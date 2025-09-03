// Enterprise Cache Module
// Production-ready caching with Redis and in-memory fallback

import Redis from 'ioredis';
import { createClient } from '@supabase/supabase-js';

// Enterprise cache configuration
const config = {
  redisUrl: process.env.REDIS_URL,
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  enableRedis: process.env.ENABLE_REDIS !== 'false',
  enableSupabaseCache: process.env.ENABLE_SUPABASE_CACHE !== 'false',
  defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL || '3600'), // 1 hour
  maxMemory: process.env.CACHE_MAX_MEMORY || '512mb',
  compression: process.env.ENABLE_CACHE_COMPRESSION === 'true',
  cachePrefix: process.env.CACHE_PREFIX || 'go4it:',
};

interface CacheEntry {
  key: string;
  value: any;
  ttl?: number;
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
  metadata?: Record<string, any>;
}

export class EnterpriseCache {
  private redis: Redis | null = null;
  private supabase: any;
  private memoryCache: Map<string, CacheEntry> = new Map();
  private isInitialized: boolean = false;
  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    this.initializeCache();
  }

  private async initializeCache(): Promise<void> {
    try {
      // Initialize Redis if enabled
      if (config.enableRedis && config.redisUrl) {
        this.redis = new Redis(config.redisUrl, {
          maxRetriesPerRequest: 3,
          retryDelayOnFailover: 100,
          enableReadyCheck: false,
          maxMemory: config.maxMemory,
          lazyConnect: true,
        });

        this.redis.on('connect', () => {
          console.log('Redis cache connected successfully');
        });

        this.redis.on('error', (error) => {
          console.error('Redis cache connection error:', error);
        });

        await this.redis.connect();
      }

      // Initialize Supabase for persistent cache
      if (config.supabaseUrl && config.supabaseServiceKey) {
        this.supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
      }

      // Start cleanup timer for memory cache
      this.cleanupTimer = setInterval(() => {
        this.cleanupExpiredEntries();
      }, 300000); // Clean up every 5 minutes

      this.isInitialized = true;
      console.log('Enterprise Cache initialized successfully');

    } catch (error) {
      console.error('Failed to initialize Enterprise Cache:', error);
      // Continue with memory-only cache
      this.isInitialized = true;
    }
  }

  // Get value from cache
  async get(key: string): Promise<any> {
    if (!this.isInitialized) return null;

    const fullKey = this.getFullKey(key);

    try {
      // Try Redis first
      if (this.redis) {
        const redisValue = await this.redis.get(fullKey);
        if (redisValue) {
          const parsed = JSON.parse(redisValue);
          await this.updateAccessStats(fullKey, parsed);
          return parsed.value;
        }
      }

      // Try memory cache
      const memoryEntry = this.memoryCache.get(fullKey);
      if (memoryEntry && !this.isExpired(memoryEntry)) {
        memoryEntry.lastAccessed = new Date();
        memoryEntry.accessCount++;
        return memoryEntry.value;
      }

      // Try Supabase persistent cache
      if (this.supabase && config.enableSupabaseCache) {
        const { data, error } = await this.supabase
          .from('cache_entries')
          .select('value, metadata')
          .eq('key', fullKey)
          .single();

        if (!error && data) {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          await this.updateAccessStats(fullKey, { value: parsed, metadata: data.metadata });
          return parsed;
        }
      }

      return null;

    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  // Set value in cache
  async set(key: string, value: any, ttl?: number, metadata?: Record<string, any>): Promise<void> {
    if (!this.isInitialized) return;

    const fullKey = this.getFullKey(key);
    const actualTTL = ttl || config.defaultTTL;
    const entry: CacheEntry = {
      key: fullKey,
      value,
      ttl: actualTTL,
      createdAt: new Date(),
      lastAccessed: new Date(),
      accessCount: 0,
      metadata,
    };

    try {
      const serializedValue = JSON.stringify(entry);

      // Set in Redis
      if (this.redis) {
        await this.redis.setex(fullKey, actualTTL, serializedValue);
      }

      // Set in memory cache
      this.memoryCache.set(fullKey, entry);

      // Set in Supabase for persistence
      if (this.supabase && config.enableSupabaseCache) {
        await this.supabase
          .from('cache_entries')
          .upsert({
            key: fullKey,
            value: JSON.stringify(value),
            ttl: actualTTL,
            expires_at: new Date(Date.now() + actualTTL * 1000).toISOString(),
            metadata: metadata || {},
            created_at: new Date().toISOString(),
          });
      }

    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  // Delete value from cache
  async delete(key: string): Promise<boolean> {
    if (!this.isInitialized) return false;

    const fullKey = this.getFullKey(key);
    let deleted = false;

    try {
      // Delete from Redis
      if (this.redis) {
        await this.redis.del(fullKey);
        deleted = true;
      }

      // Delete from memory cache
      deleted = this.memoryCache.delete(fullKey) || deleted;

      // Delete from Supabase
      if (this.supabase && config.enableSupabaseCache) {
        await this.supabase
          .from('cache_entries')
          .delete()
          .eq('key', fullKey);
        deleted = true;
      }

      return deleted;

    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    if (!this.isInitialized) return false;

    const fullKey = this.getFullKey(key);

    try {
      // Check Redis
      if (this.redis) {
        const exists = await this.redis.exists(fullKey);
        if (exists) return true;
      }

      // Check memory cache
      const memoryEntry = this.memoryCache.get(fullKey);
      if (memoryEntry && !this.isExpired(memoryEntry)) {
        return true;
      }

      // Check Supabase
      if (this.supabase && config.enableSupabaseCache) {
        const { data, error } = await this.supabase
          .from('cache_entries')
          .select('key')
          .eq('key', fullKey)
          .single();

        if (!error && data) {
          return true;
        }
      }

      return false;

    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  // Get cache statistics
  async getStats(): Promise<any> {
    const stats = {
      memoryCache: {
        entries: this.memoryCache.size,
        totalSize: this.calculateMemorySize(),
      },
      redis: {
        connected: false,
        info: null,
      },
      supabase: {
        enabled: !!this.supabase && config.enableSupabaseCache,
      },
      timestamp: new Date().toISOString(),
    };

    // Get Redis stats
    if (this.redis) {
      try {
        stats.redis.connected = this.redis.status === 'ready';
        stats.redis.info = await this.redis.info();
      } catch (error) {
        stats.redis.error = error.message;
      }
    }

    return stats;
  }

  // Clear all cache entries
  async clear(pattern?: string): Promise<void> {
    if (!this.isInitialized) return;

    try {
      // Clear Redis
      if (this.redis) {
        if (pattern) {
          const keys = await this.redis.keys(this.getFullKey(pattern));
          if (keys.length > 0) {
            await this.redis.del(...keys);
          }
        } else {
          await this.redis.flushall();
        }
      }

      // Clear memory cache
      if (pattern) {
        for (const [key] of this.memoryCache) {
          if (key.includes(pattern)) {
            this.memoryCache.delete(key);
          }
        }
      } else {
        this.memoryCache.clear();
      }

      // Clear Supabase cache
      if (this.supabase && config.enableSupabaseCache) {
        if (pattern) {
          await this.supabase
            .from('cache_entries')
            .delete()
            .like('key', `%${pattern}%`);
        } else {
          await this.supabase
            .from('cache_entries')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
        }
      }

    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // Get multiple keys
  async mget(keys: string[]): Promise<Record<string, any>> {
    if (!this.isInitialized) return {};

    const results: Record<string, any> = {};

    for (const key of keys) {
      results[key] = await this.get(key);
    }

    return results;
  }

  // Set multiple keys
  async mset(entries: Record<string, { value: any; ttl?: number; metadata?: Record<string, any> }>): Promise<void> {
    if (!this.isInitialized) return;

    for (const [key, entry] of Object.entries(entries)) {
      await this.set(key, entry.value, entry.ttl, entry.metadata);
    }
  }

  // Increment a numeric value
  async increment(key: string, amount: number = 1): Promise<number> {
    if (!this.isInitialized) return 0;

    const fullKey = this.getFullKey(key);
    let currentValue = await this.get(key) || 0;
    currentValue += amount;

    await this.set(key, currentValue);
    return currentValue;
  }

  // Get time-to-live for a key
  async ttl(key: string): Promise<number> {
    if (!this.isInitialized) return -1;

    const fullKey = this.getFullKey(key);

    try {
      // Check Redis TTL
      if (this.redis) {
        const ttl = await this.redis.ttl(fullKey);
        if (ttl > 0) return ttl;
      }

      // Check memory cache TTL
      const memoryEntry = this.memoryCache.get(fullKey);
      if (memoryEntry && memoryEntry.ttl) {
        const remaining = Math.max(0, memoryEntry.ttl - Math.floor((Date.now() - memoryEntry.createdAt.getTime()) / 1000));
        return remaining;
      }

      return -1;

    } catch (error) {
      console.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  // Private helper methods
  private getFullKey(key: string): string {
    return `${config.cachePrefix}${key}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    if (!entry.ttl) return false;
    const age = (Date.now() - entry.createdAt.getTime()) / 1000;
    return age > entry.ttl;
  }

  private async updateAccessStats(key: string, entry: any): Promise<void> {
    // Update access stats in Supabase if enabled
    if (this.supabase && config.enableSupabaseCache) {
      try {
        await this.supabase
          .from('cache_entries')
          .update({
            last_accessed: new Date().toISOString(),
            access_count: (entry.metadata?.accessCount || 0) + 1,
          })
          .eq('key', key);
      } catch (error) {
        // Silently fail for access stats updates
      }
    }
  }

  private calculateMemorySize(): string {
    let totalSize = 0;
    for (const [key, entry] of this.memoryCache) {
      totalSize += JSON.stringify(entry).length;
    }
    return `${Math.round(totalSize / 1024)}KB`;
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Shutdown gracefully
  async shutdown(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    if (this.redis) {
      await this.redis.quit();
    }

    console.log('Enterprise Cache shut down gracefully');
  }
}

// Export singleton instance
export const cache = new EnterpriseCache();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await cache.shutdown();
});

process.on('SIGTERM', async () => {
  await cache.shutdown();
});

export default cache;
