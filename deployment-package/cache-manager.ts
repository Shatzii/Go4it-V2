/**
 * Go4It Engine - Cache Manager
 * 
 * This module provides a Redis-based caching layer for the Go4It Engine,
 * improving performance by storing frequently accessed data and computation results.
 */

import Redis from 'ioredis';
import { EventEmitter } from 'events';

// Cache item interface
interface CacheItem<T> {
  value: T;
  expiresAt: number; // Unix timestamp (milliseconds)
}

// Cache configuration
interface CacheConfig {
  redisUrl?: string;
  prefix?: string;
  defaultTtl?: number; // Time to live in seconds
  connectTimeout?: number;
  enableCompression?: boolean;
  logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug';
}

/**
 * Cache Manager class providing Redis-based caching
 */
export class CacheManager extends EventEmitter {
  private redis: Redis;
  private prefix: string;
  private defaultTtl: number;
  private enableCompression: boolean;
  private logLevel: string;
  private isConnected: boolean = false;
  private static instance: CacheManager;

  /**
   * Create a new cache manager instance
   */
  constructor(config: CacheConfig = {}) {
    super();
    
    this.prefix = config.prefix || 'go4it:cache:';
    this.defaultTtl = config.defaultTtl || 3600; // 1 hour default
    this.enableCompression = config.enableCompression || false;
    this.logLevel = config.logLevel || 'error';
    
    // Initialize Redis client
    this.redis = new Redis(config.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379', {
      connectTimeout: config.connectTimeout || 10000,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });
    
    // Set up event listeners
    this.redis.on('connect', () => {
      this.isConnected = true;
      this.log('info', 'Connected to Redis');
      this.emit('connect');
    });
    
    this.redis.on('error', (error) => {
      this.isConnected = false;
      this.log('error', `Redis error: ${error.message}`);
      this.emit('error', error);
    });
    
    this.redis.on('reconnecting', () => {
      this.log('warn', 'Reconnecting to Redis');
      this.emit('reconnecting');
    });
    
    this.redis.on('end', () => {
      this.isConnected = false;
      this.log('info', 'Redis connection closed');
      this.emit('end');
    });
  }

  /**
   * Get the singleton instance of the cache manager
   */
  public static getInstance(config?: CacheConfig): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config);
    }
    return CacheManager.instance;
  }

  /**
   * Set a value in the cache
   */
  public async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (!this.isConnected) {
      this.log('warn', 'Failed to set cache value: Redis not connected');
      return false;
    }
    
    try {
      const actualTtl = ttl || this.defaultTtl;
      const expiresAt = Date.now() + (actualTtl * 1000);
      
      const cacheItem: CacheItem<T> = {
        value,
        expiresAt
      };
      
      // Serialize the value
      let serialized = JSON.stringify(cacheItem);
      
      // Compress if enabled (in a real implementation, we would use a compression library)
      if (this.enableCompression && serialized.length > 1024) {
        // This is a placeholder for actual compression
        this.log('debug', `Compression would save ${(serialized.length * 0.7).toFixed(0)} bytes for key ${key}`);
      }
      
      // Store in Redis with expiration
      await this.redis.set(
        this.getKeyWithPrefix(key),
        serialized,
        'EX',
        actualTtl
      );
      
      this.log('debug', `Cached key: ${key} (TTL: ${actualTtl}s)`);
      return true;
    } catch (error) {
      this.log('error', `Failed to set cache value for key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Get a value from the cache
   */
  public async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      this.log('warn', 'Failed to get cache value: Redis not connected');
      return null;
    }
    
    try {
      const serialized = await this.redis.get(this.getKeyWithPrefix(key));
      
      if (!serialized) {
        this.log('debug', `Cache miss for key: ${key}`);
        return null;
      }
      
      // Deserialize the value
      const cacheItem = JSON.parse(serialized) as CacheItem<T>;
      
      // Check if the item is expired (this is a safety check, Redis should handle expiration)
      if (cacheItem.expiresAt < Date.now()) {
        this.log('debug', `Cache item expired for key: ${key}`);
        await this.delete(key);
        return null;
      }
      
      this.log('debug', `Cache hit for key: ${key}`);
      return cacheItem.value;
    } catch (error) {
      this.log('error', `Failed to get cache value for key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Get or set a value in the cache
   */
  public async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T | null> {
    // Try to get from cache first
    const cachedValue = await this.get<T>(key);
    
    if (cachedValue !== null) {
      return cachedValue;
    }
    
    // Not in cache, fetch the value
    try {
      const value = await fetchFn();
      
      // Cache the result
      await this.set(key, value, ttl);
      
      return value;
    } catch (error) {
      this.log('error', `Failed to fetch value for key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Delete a value from the cache
   */
  public async delete(key: string): Promise<boolean> {
    if (!this.isConnected) {
      this.log('warn', 'Failed to delete cache value: Redis not connected');
      return false;
    }
    
    try {
      const result = await this.redis.del(this.getKeyWithPrefix(key));
      
      if (result > 0) {
        this.log('debug', `Deleted cache key: ${key}`);
        return true;
      } else {
        this.log('debug', `Key not found for deletion: ${key}`);
        return false;
      }
    } catch (error) {
      this.log('error', `Failed to delete cache key ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Clear a pattern of cache keys
   */
  public async clear(pattern?: string): Promise<number> {
    if (!this.isConnected) {
      this.log('warn', 'Failed to clear cache: Redis not connected');
      return 0;
    }
    
    try {
      const actualPattern = pattern 
        ? this.getKeyWithPrefix(pattern) 
        : `${this.prefix}*`;
      
      // Use SCAN instead of KEYS for production use to avoid blocking
      const keys = await this.redis.keys(actualPattern);
      
      if (keys.length === 0) {
        this.log('debug', `No keys found for pattern: ${actualPattern}`);
        return 0;
      }
      
      const result = await this.redis.del(...keys);
      this.log('info', `Cleared ${result} cache keys with pattern: ${actualPattern}`);
      
      return result;
    } catch (error) {
      this.log('error', `Failed to clear cache with pattern ${pattern}: ${error.message}`);
      return 0;
    }
  }

  /**
   * Log a message based on log level
   */
  private log(level: string, message: string): void {
    const logLevels = {
      'none': 0,
      'error': 1,
      'warn': 2,
      'info': 3,
      'debug': 4
    };
    
    if (logLevels[level] <= logLevels[this.logLevel]) {
      if (level === 'error') {
        console.error(`[cache] ${message}`);
      } else if (level === 'warn') {
        console.warn(`[cache] ${message}`);
      } else {
        console.log(`[cache] ${message}`);
      }
    }
  }

  /**
   * Get key with prefix
   */
  private getKeyWithPrefix(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Get Redis status
   */
  public getStatus(): { connected: boolean, status: string } {
    return {
      connected: this.isConnected,
      status: this.isConnected ? 'connected' : 'disconnected'
    };
  }

  /**
   * Close the Redis connection
   */
  public async close(): Promise<void> {
    await this.redis.quit();
    this.isConnected = false;
    this.log('info', 'Redis connection closed');
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();