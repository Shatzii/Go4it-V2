import { Request, Response, NextFunction } from 'express';

// Simple in-memory cache implementation
interface CacheItem {
  data: any;
  expiry: number;
}

class SimpleCache {
  private cache: Record<string, CacheItem> = {};
  private defaultTtl: number;

  constructor(defaultTtl = 300) {
    this.defaultTtl = defaultTtl;
    
    // Set up periodic cleanup of expired items
    setInterval(() => this.cleanup(), 60000);
  }

  get(key: string): any {
    const item = this.cache[key];
    
    if (!item) {
      return null;
    }
    
    // Check if the item has expired
    if (Date.now() > item.expiry) {
      delete this.cache[key];
      return null;
    }
    
    return item.data;
  }

  set(key: string, data: any, ttl = this.defaultTtl): void {
    this.cache[key] = {
      data,
      expiry: Date.now() + (ttl * 1000)
    };
  }

  del(key: string): void {
    delete this.cache[key];
  }

  keys(): string[] {
    return Object.keys(this.cache);
  }

  clear(): void {
    this.cache = {};
  }

  // Remove all expired cache items
  private cleanup(): void {
    const now = Date.now();
    let count = 0;
    
    for (const key in this.cache) {
      if (this.cache[key].expiry < now) {
        delete this.cache[key];
        count++;
      }
    }
    
    if (count > 0) {
      console.log(`[cache] Cleaned up ${count} expired items`);
    }
  }
}

// Create cache instance
const apiCache = new SimpleCache(300); // 5 minute default TTL

// Cache paths to skip (never cache these endpoints)
const SKIP_CACHE_PATHS = [
  '/api/login', 
  '/api/logout', 
  '/api/register', 
  '/api/admin/',
  '/api/user',
  '/api/upload'
];

// Cache paths to always include, even for authenticated users
const WHITELIST_CACHE_PATHS = [
  '/api/content-blocks/',
  '/api/featured-athletes',
  '/api/combine-tour/',
  '/api/scout-vision',
  '/api/blog-posts'
];

// Cache middleware
export function cacheMiddleware(ttl = 300) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip cache for non-GET methods
    if (req.method !== 'GET') {
      return next();
    }

    // Skip cache for specified paths
    if (SKIP_CACHE_PATHS.some(path => req.path.includes(path))) {
      return next();
    }

    // Skip cache for authenticated routes that might have user-specific data
    // unless they are explicitly whitelisted
    if (req.isAuthenticated && req.isAuthenticated() && 
        !WHITELIST_CACHE_PATHS.some(path => req.path.includes(path))) {
      return next();
    }

    // Get cache key from URL path
    const key = req.originalUrl || req.url;
    
    // Check if we have a cache hit
    const cachedResponse = apiCache.get(key);
    
    if (cachedResponse) {
      // Log cache hit
      console.log(`[cache] Cache hit for key: ${key}`);
      
      // Set Cache-Control header for browsers
      res.set('Cache-Control', `public, max-age=${ttl}`);
      
      // Return the cached response
      return res.send(cachedResponse);
    }

    // Store the original send method
    const originalSend = res.send;
    
    // Override the send method to cache the response
    res.send = function(body): Response {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          apiCache.set(key, body, ttl);
          console.log(`[cache] Cache miss for key: ${key}`);
        } catch (error) {
          console.error('[cache] Error setting cache:', error);
        }
      }
      
      // Call the original send method
      return originalSend.call(this, body);
    };
    
    next();
  };
}

// Cache invalidation function for specific paths
export function invalidateCache(pathPattern: string): void {
  const keys = apiCache.keys();
  
  keys.forEach((key: string) => {
    if (key.includes(pathPattern)) {
      apiCache.del(key);
      console.log(`[cache] Invalidated cache for: ${key}`);
    }
  });
}

// Function to clear entire cache
export function clearCache(): void {
  apiCache.clear();
  console.log('[cache] Entire cache cleared');
}