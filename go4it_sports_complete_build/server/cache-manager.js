/**
 * Go4It Engine - Cache Manager
 * 
 * This module provides a Redis-based caching layer for the Go4It Engine,
 * improving performance by storing frequently accessed data and computation results.
 */

const Redis = require('ioredis');
const { EventEmitter } = require('events');
const zlib = require('zlib');
const util = require('util');

// Promisify zlib methods
const gzipAsync = util.promisify(zlib.gzip);
const gunzipAsync = util.promisify(zlib.gunzip);

/**
 * Cache Manager class providing Redis-based caching
 */
class CacheManager extends EventEmitter {
  /**
   * Create a new cache manager instance
   */
  constructor(config = {}) {
    super();
    
    this.prefix = config.prefix || 'go4it:cache:';
    this.defaultTtl = config.defaultTtl || 3600; // 1 hour default
    this.enableCompression = config.enableCompression !== undefined ? config.enableCompression : true;
    this.logLevel = config.logLevel || 'error';
    
    // Initialize Redis connection
    if (process.env.NODE_ENV === 'production') {
      this.redis = new Redis(config.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379', {
        connectTimeout: config.connectTimeout || 5000,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        retryStrategy: (times) => {
          const delay = Math.min(times * 100, 3000);
          this.log('warn', `Redis connection attempt ${times} failed. Retrying in ${delay}ms`);
          return delay;
        }
      });
    } else {
      // In development/test, use in-memory cache instead of Redis
      this.inMemoryCache = new Map();
      this.expiryMap = new Map();
      // Simulate Redis interface
      this.redis = {
        on: () => {},
        set: () => Promise.resolve('OK'),
        get: () => Promise.resolve(null),
        del: () => Promise.resolve(1),
        quit: () => Promise.resolve(),
        status: 'ready'
      };
    }
    
    // Setup Redis event handlers
    if (process.env.NODE_ENV === 'production') {
      this.redis.on('connect', () => {
        this.isConnected = true;
        this.log('info', 'Connected to Redis');
        this.emit('connect');
      });
      
      this.redis.on('error', (err) => {
        this.isConnected = false;
        this.log('error', `Redis error: ${err.message}`);
        this.emit('error', err);
      });
      
      this.redis.on('close', () => {
        this.isConnected = false;
        this.log('warn', 'Redis connection closed');
        this.emit('close');
      });
      
      this.redis.on('reconnecting', () => {
        this.log('info', 'Reconnecting to Redis...');
        this.emit('reconnecting');
      });
      
      this.redis.on('ready', () => {
        this.isConnected = true;
        this.log('info', 'Redis connection ready');
        this.emit('ready');
      });
    } else {
      this.isConnected = true;
      
      // Setup timer to clean expired items from in-memory cache
      setInterval(() => {
        const now = Date.now();
        for (const [key, expiry] of this.expiryMap.entries()) {
          if (expiry <= now) {
            this.inMemoryCache.delete(key);
            this.expiryMap.delete(key);
            this.log('debug', `Cache item expired: ${key}`);
          }
        }
      }, 60000); // Check every minute
    }
  }
  
  /**
   * Get the singleton instance of the cache manager
   */
  static getInstance(config) {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config);
    }
    return CacheManager.instance;
  }
  
  /**
   * Set a value in the cache
   */
  async set(key, value, ttl) {
    this.log('debug', `Setting cache key: ${key}`);
    const cacheKey = this.getKeyWithPrefix(key);
    
    try {
      // Serialize value to JSON
      const jsonValue = JSON.stringify(value);
      
      // Compress data if enabled and data is large enough
      let dataToStore = jsonValue;
      let compressed = false;
      
      if (this.enableCompression && jsonValue.length > 1024) {
        try {
          const compressedData = await gzipAsync(Buffer.from(jsonValue));
          dataToStore = compressedData.toString('base64');
          compressed = true;
          this.log('debug', `Compressed cache data for ${key} (${jsonValue.length} -> ${dataToStore.length} bytes)`);
        } catch (compressionError) {
          this.log('error', `Compression error for ${key}: ${compressionError.message}`);
          // Continue with uncompressed data
        }
      }
      
      // Store metadata along with value
      const finalValue = JSON.stringify({
        data: dataToStore,
        compressed,
        createdAt: Date.now(),
        ttl: ttl || this.defaultTtl
      });
      
      if (process.env.NODE_ENV === 'production') {
        // Store in Redis
        await this.redis.set(
          cacheKey,
          finalValue,
          'EX',
          ttl || this.defaultTtl
        );
      } else {
        // Store in memory
        this.inMemoryCache.set(cacheKey, finalValue);
        this.expiryMap.set(cacheKey, Date.now() + ((ttl || this.defaultTtl) * 1000));
      }
      
      return true;
    } catch (error) {
      this.log('error', `Failed to set cache key ${key}: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Get a value from the cache
   */
  async get(key) {
    this.log('debug', `Getting cache key: ${key}`);
    const cacheKey = this.getKeyWithPrefix(key);
    
    try {
      let rawValue;
      
      if (process.env.NODE_ENV === 'production') {
        // Get from Redis
        rawValue = await this.redis.get(cacheKey);
      } else {
        // Get from memory
        rawValue = this.inMemoryCache.get(cacheKey);
        
        // Check if expired
        const expiry = this.expiryMap.get(cacheKey);
        if (expiry && expiry <= Date.now()) {
          this.inMemoryCache.delete(cacheKey);
          this.expiryMap.delete(cacheKey);
          return null;
        }
      }
      
      if (!rawValue) {
        this.log('debug', `Cache miss for key: ${key}`);
        return null;
      }
      
      // Parse the stored object with metadata
      const { data, compressed, createdAt, ttl } = JSON.parse(rawValue);
      
      // Decompress if necessary
      let jsonValue = data;
      if (compressed) {
        try {
          const decompressedData = await gunzipAsync(Buffer.from(data, 'base64'));
          jsonValue = decompressedData.toString();
        } catch (decompressionError) {
          this.log('error', `Decompression error for ${key}: ${decompressionError.message}`);
          return null;
        }
      }
      
      // Parse the JSON value
      const value = JSON.parse(jsonValue);
      this.log('debug', `Cache hit for key: ${key}`);
      return value;
    } catch (error) {
      this.log('error', `Failed to get cache key ${key}: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Get or set a value in the cache
   */
  async getOrSet(key, valueFactory, ttl) {
    // Try to get from cache first
    const cachedValue = await this.get(key);
    if (cachedValue !== null) {
      return cachedValue;
    }
    
    // Generate the value
    this.log('debug', `Cache miss, generating value for key: ${key}`);
    try {
      const generatedValue = await valueFactory();
      
      // Cache the generated value (do not await to avoid blocking)
      this.set(key, generatedValue, ttl).catch(err => {
        this.log('error', `Failed to cache generated value for ${key}: ${err.message}`);
      });
      
      return generatedValue;
    } catch (error) {
      this.log('error', `Failed to generate value for ${key}: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Delete a value from the cache
   */
  async delete(key) {
    this.log('debug', `Deleting cache key: ${key}`);
    const cacheKey = this.getKeyWithPrefix(key);
    
    try {
      if (process.env.NODE_ENV === 'production') {
        await this.redis.del(cacheKey);
      } else {
        this.inMemoryCache.delete(cacheKey);
        this.expiryMap.delete(cacheKey);
      }
      return true;
    } catch (error) {
      this.log('error', `Failed to delete cache key ${key}: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Clear a pattern of cache keys
   */
  async clear(pattern) {
    if (process.env.NODE_ENV !== 'production') {
      const prefix = this.getKeyWithPrefix(pattern || '');
      let count = 0;
      
      // Clear matching keys from memory cache
      for (const key of this.inMemoryCache.keys()) {
        if (!pattern || key.startsWith(prefix)) {
          this.inMemoryCache.delete(key);
          this.expiryMap.delete(key);
          count++;
        }
      }
      
      this.log('info', `Cleared ${count} keys from memory cache`);
      return count;
    }
    
    const scanPattern = pattern 
      ? this.getKeyWithPrefix(pattern) + '*' 
      : this.getKeyWithPrefix('*');
    
    try {
      this.log('info', `Clearing cache keys matching pattern: ${scanPattern}`);
      
      // Use SCAN to get all matching keys
      let cursor = '0';
      let count = 0;
      
      do {
        const [nextCursor, keys] = await this.redis.scan(
          cursor,
          'MATCH',
          scanPattern,
          'COUNT',
          100
        );
        
        cursor = nextCursor;
        
        if (keys.length > 0) {
          await this.redis.del(...keys);
          count += keys.length;
        }
      } while (cursor !== '0');
      
      this.log('info', `Cleared ${count} keys from cache`);
      return count;
    } catch (error) {
      this.log('error', `Failed to clear cache: ${error.message}`);
      return 0;
    }
  }
  
  /**
   * Log a message based on log level
   */
  log(level, message) {
    const levels = {
      none: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4
    };
    
    if (levels[level] <= levels[this.logLevel]) {
      const timestamp = new Date().toISOString();
      switch (level) {
        case 'error':
          console.error(`[${timestamp}] [cache] ERROR: ${message}`);
          break;
        case 'warn':
          console.warn(`[${timestamp}] [cache] WARN: ${message}`);
          break;
        case 'info':
          console.info(`[${timestamp}] [cache] ${message}`);
          break;
        case 'debug':
          console.log(`[${timestamp}] [cache] ${message}`);
          break;
      }
    }
  }
  
  /**
   * Get key with prefix
   */
  getKeyWithPrefix(key) {
    return `${this.prefix}${key}`;
  }
  
  /**
   * Get Redis status
   */
  getStatus() {
    if (process.env.NODE_ENV !== 'production') {
      return { connected: true, status: 'in-memory' };
    }
    
    return {
      connected: this.isConnected,
      status: this.redis.status
    };
  }
  
  /**
   * Close the Redis connection
   */
  async close() {
    this.log('info', 'Closing cache connection...');
    
    if (process.env.NODE_ENV === 'production') {
      try {
        if (this.redis) {
          await this.redis.quit();
        }
        this.log('info', 'Cache connection closed');
      } catch (error) {
        this.log('error', `Error closing cache connection: ${error.message}`);
      }
    } else {
      // Clear in-memory cache
      this.inMemoryCache.clear();
      this.expiryMap.clear();
    }
  }
}

// Singleton instance
const cacheManager = CacheManager.getInstance();

module.exports = {
  CacheManager,
  cacheManager
};