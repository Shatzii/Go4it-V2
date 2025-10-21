// Enterprise Rate Limiter Module
// Production-ready rate limiting with Redis and database persistence

import Redis from 'ioredis';
import { createClient } from '@supabase/supabase-js';

// Enterprise rate limiter configuration
const config = {
  redisUrl: process.env.REDIS_URL,
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  enableRedis: process.env.ENABLE_REDIS !== 'false',
  enableDatabasePersistence: process.env.ENABLE_RATE_LIMIT_PERSISTENCE !== 'false',
  defaultWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  defaultMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  cleanupInterval: parseInt(process.env.RATE_LIMIT_CLEANUP_INTERVAL || '300000'), // 5 minutes
  rateLimitPrefix: process.env.RATE_LIMIT_PREFIX || 'ratelimit:',
};

interface RateLimitRule {
  key: string;
  windowMs: number;
  maxRequests: number;
  blockDurationMs?: number;
  whitelist?: string[];
  blacklist?: string[];
}

interface RateLimitEntry {
  key: string;
  requests: number;
  windowStart: number;
  windowEnd: number;
  blocked: boolean;
  blockExpiry?: number;
  lastRequest: number;
  metadata?: Record<string, any>;
}

export class EnterpriseRateLimiter {
  private redis: Redis | null = null;
  private supabase: any;
  private rules: Map<string, RateLimitRule> = new Map();
  private memoryStore: Map<string, RateLimitEntry> = new Map();
  private cleanupTimer?: NodeJS.Timeout;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeRateLimiter();
  }

  private async initializeRateLimiter(): Promise<void> {
    try {
      // Initialize Redis if enabled
      if (config.enableRedis && config.redisUrl) {
        this.redis = new Redis(config.redisUrl, {
          maxRetriesPerRequest: 3,
          retryDelayOnFailover: 100,
          enableReadyCheck: false,
          lazyConnect: true,
        });

        this.redis.on('connect', () => {
          // console.log('Redis rate limiter connected successfully');
        });

        this.redis.on('error', (error) => {
          console.error('Redis rate limiter connection error:', error);
        });

        await this.redis.connect();
      }

      // Initialize Supabase for persistent rate limiting
      if (config.supabaseUrl && config.supabaseServiceKey) {
        this.supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
      }

      // Start cleanup timer
      this.cleanupTimer = setInterval(() => {
        this.cleanupExpiredEntries();
      }, config.cleanupInterval);

      this.isInitialized = true;
      // console.log('Enterprise Rate Limiter initialized successfully');

    } catch (error) {
      console.error('Failed to initialize Enterprise Rate Limiter:', error);
      // Continue with memory-only rate limiting
      this.isInitialized = true;
    }
  }

  // Define a rate limit rule
  defineRule(
    name: string,
    options: {
      windowMs?: number;
      maxRequests?: number;
      blockDurationMs?: number;
      whitelist?: string[];
      blacklist?: string[];
    }
  ): void {
    const rule: RateLimitRule = {
      key: name,
      windowMs: options.windowMs || config.defaultWindowMs,
      maxRequests: options.maxRequests || config.defaultMaxRequests,
      blockDurationMs: options.blockDurationMs,
      whitelist: options.whitelist,
      blacklist: options.blacklist,
    };

    this.rules.set(name, rule);
  }

  // Check if request is allowed
  async checkLimit(
    ruleName: string,
    identifier: string,
    options?: {
      increment?: boolean;
      metadata?: Record<string, any>;
    }
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    blocked: boolean;
    blockExpiry?: number;
  }> {
    if (!this.isInitialized) {
      return { allowed: true, remaining: 999, resetTime: Date.now() + 900000, blocked: false };
    }

    const rule = this.rules.get(ruleName);
    if (!rule) {
      console.warn(`Rate limit rule '${ruleName}' not found, using defaults`);
      this.defineRule(ruleName, {});
      return this.checkLimit(ruleName, identifier, options);
    }

    // Check whitelist/blacklist
    if (rule.whitelist && !rule.whitelist.includes(identifier)) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + rule.windowMs,
        blocked: true,
        blockExpiry: Date.now() + (rule.blockDurationMs || rule.windowMs),
      };
    }

    if (rule.blacklist && rule.blacklist.includes(identifier)) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + rule.windowMs,
        blocked: true,
        blockExpiry: Date.now() + (rule.blockDurationMs || rule.windowMs),
      };
    }

    const key = `${ruleName}:${identifier}`;
    const now = Date.now();

    try {
      let entry = await this.getEntry(key);

      if (!entry) {
        // Create new entry
        entry = {
          key,
          requests: 0,
          windowStart: now,
          windowEnd: now + rule.windowMs,
          blocked: false,
          lastRequest: now,
          metadata: options?.metadata,
        };
      }

      // Check if window has expired
      if (now > entry.windowEnd) {
        entry.requests = 0;
        entry.windowStart = now;
        entry.windowEnd = now + rule.windowMs;
        entry.blocked = false;
        entry.blockExpiry = undefined;
      }

      // Check if still blocked
      if (entry.blocked && entry.blockExpiry && now < entry.blockExpiry) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.windowEnd,
          blocked: true,
          blockExpiry: entry.blockExpiry,
        };
      }

      // Check rate limit
      const allowed = entry.requests < rule.maxRequests;
      const remaining = Math.max(0, rule.maxRequests - entry.requests);

      if (options?.increment !== false && allowed) {
        entry.requests++;
        entry.lastRequest = now;

        // Check if limit exceeded after increment
        if (entry.requests >= rule.maxRequests) {
          entry.blocked = true;
          entry.blockExpiry = now + (rule.blockDurationMs || rule.windowMs);
        }

        await this.saveEntry(entry);
      }

      return {
        allowed,
        remaining: allowed ? remaining - 1 : remaining,
        resetTime: entry.windowEnd,
        blocked: entry.blocked,
        blockExpiry: entry.blockExpiry,
      };

    } catch (error) {
      console.error(`Rate limit check error for key ${key}:`, error);
      // Allow request on error to prevent blocking legitimate traffic
      return { allowed: true, remaining: 999, resetTime: now + rule.windowMs, blocked: false };
    }
  }

  // Get rate limit status
  async getStatus(ruleName: string, identifier: string): Promise<RateLimitEntry | null> {
    if (!this.isInitialized) return null;

    const key = `${ruleName}:${identifier}`;
    return await this.getEntry(key);
  }

  // Reset rate limit for a specific identifier
  async resetLimit(ruleName: string, identifier: string): Promise<boolean> {
    if (!this.isInitialized) return false;

    const key = `${ruleName}:${identifier}`;

    try {
      // Reset in Redis
      if (this.redis) {
        await this.redis.del(this.getRedisKey(key));
      }

      // Reset in memory
      this.memoryStore.delete(key);

      // Reset in database
      if (this.supabase && config.enableDatabasePersistence) {
        await this.supabase
          .from('rate_limits')
          .delete()
          .eq('key', key);
      }

      return true;

    } catch (error) {
      console.error(`Rate limit reset error for key ${key}:`, error);
      return false;
    }
  }

  // Get rate limit statistics
  async getStats(ruleName?: string): Promise<any> {
    const stats = {
      rules: Array.from(this.rules.keys()),
      memoryEntries: this.memoryStore.size,
      redis: {
        connected: false,
      },
      timestamp: new Date().toISOString(),
    };

    // Get Redis stats
    if (this.redis) {
      try {
        stats.redis.connected = this.redis.status === 'ready';
        if (stats.redis.connected) {
          const keys = await this.redis.keys(`${config.rateLimitPrefix}*`);
          stats.redis.entries = keys.length;
        }
      } catch (error) {
        stats.redis.error = error.message;
      }
    }

    // Get rule-specific stats
    if (ruleName) {
      const rule = this.rules.get(ruleName);
      if (rule) {
        stats.ruleStats = {
          name: ruleName,
          windowMs: rule.windowMs,
          maxRequests: rule.maxRequests,
          blockDurationMs: rule.blockDurationMs,
          whitelistCount: rule.whitelist?.length || 0,
          blacklistCount: rule.blacklist?.length || 0,
        };
      }
    }

    return stats;
  }

  // Clear all rate limit data
  async clearAll(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      // Clear Redis
      if (this.redis) {
        const keys = await this.redis.keys(`${config.rateLimitPrefix}*`);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      }

      // Clear memory
      this.memoryStore.clear();

      // Clear database
      if (this.supabase && config.enableDatabasePersistence) {
        await this.supabase
          .from('rate_limits')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      }

    } catch (error) {
      console.error('Rate limiter clear error:', error);
    }
  }

  // Private helper methods
  private getRedisKey(key: string): string {
    return `${config.rateLimitPrefix}${key}`;
  }

  private async getEntry(key: string): Promise<RateLimitEntry | null> {
    try {
      // Try Redis first
      if (this.redis) {
        const redisKey = this.getRedisKey(key);
        const data = await this.redis.get(redisKey);
        if (data) {
          return JSON.parse(data);
        }
      }

      // Try memory cache
      const memoryEntry = this.memoryStore.get(key);
      if (memoryEntry) {
        return memoryEntry;
      }

      // Try database
      if (this.supabase && config.enableDatabasePersistence) {
        const { data, error } = await this.supabase
          .from('rate_limits')
          .select('*')
          .eq('key', key)
          .single();

        if (!error && data) {
          return {
            key: data.key,
            requests: data.requests,
            windowStart: new Date(data.window_start).getTime(),
            windowEnd: new Date(data.window_end).getTime(),
            blocked: data.blocked,
            blockExpiry: data.block_expiry ? new Date(data.block_expiry).getTime() : undefined,
            lastRequest: new Date(data.last_request).getTime(),
            metadata: data.metadata,
          };
        }
      }

      return null;

    } catch (error) {
      console.error(`Get entry error for key ${key}:`, error);
      return null;
    }
  }

  private async saveEntry(entry: RateLimitEntry): Promise<void> {
    try {
      const serializedEntry = JSON.stringify(entry);

      // Save to Redis
      if (this.redis) {
        const redisKey = this.getRedisKey(entry.key);
        const ttl = Math.ceil((entry.windowEnd - Date.now()) / 1000);
        await this.redis.setex(redisKey, Math.max(1, ttl), serializedEntry);
      }

      // Save to memory
      this.memoryStore.set(entry.key, entry);

      // Save to database
      if (this.supabase && config.enableDatabasePersistence) {
        await this.supabase
          .from('rate_limits')
          .upsert({
            key: entry.key,
            requests: entry.requests,
            window_start: new Date(entry.windowStart).toISOString(),
            window_end: new Date(entry.windowEnd).toISOString(),
            blocked: entry.blocked,
            block_expiry: entry.blockExpiry ? new Date(entry.blockExpiry).toISOString() : null,
            last_request: new Date(entry.lastRequest).toISOString(),
            metadata: entry.metadata || {},
            updated_at: new Date().toISOString(),
          });
      }

    } catch (error) {
      console.error(`Save entry error for key ${entry.key}:`, error);
    }
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();

    // Clean memory store
    for (const [key, entry] of this.memoryStore) {
      if (now > entry.windowEnd) {
        this.memoryStore.delete(key);
      }
    }

    // Clean database entries (async, don't wait)
    if (this.supabase && config.enableDatabasePersistence) {
      this.supabase
        .from('rate_limits')
        .delete()
        .lt('window_end', new Date(now).toISOString())
        .then(() => {
          // console.log('Cleaned up expired rate limit entries from database');
        })
        .catch((error: any) => {
          console.error('Failed to cleanup expired rate limit entries:', error);
        });
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

    // console.log('Enterprise Rate Limiter shut down gracefully');
  }
}

// Export singleton instance
export const rateLimiter = new EnterpriseRateLimiter();

// Initialize default rules
rateLimiter.defineRule('content_generation', {
  windowMs: 3600000, // 1 hour
  maxRequests: 50,
  blockDurationMs: 3600000, // 1 hour block
});

rateLimiter.defineRule('platform_facebook', {
  windowMs: 3600000, // 1 hour
  maxRequests: 200,
  blockDurationMs: 3600000,
});

rateLimiter.defineRule('platform_instagram', {
  windowMs: 3600000,
  maxRequests: 200,
  blockDurationMs: 3600000,
});

rateLimiter.defineRule('platform_tiktok', {
  windowMs: 3600000,
  maxRequests: 100,
  blockDurationMs: 3600000,
});

rateLimiter.defineRule('platform_hudl', {
  windowMs: 3600000,
  maxRequests: 50,
  blockDurationMs: 3600000,
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await rateLimiter.shutdown();
});

process.on('SIGTERM', async () => {
  await rateLimiter.shutdown();
});

export default rateLimiter;
