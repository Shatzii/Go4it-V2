/**
 * Go4It Sports - Cache Middleware
 * 
 * This middleware provides easy caching for API routes with:
 * - Route-based caching
 * - Conditional caching (query params, auth state)
 * - Cache invalidation
 * - Bypass options for specific requests
 */

import { Request, Response, NextFunction } from 'express';
import cacheService from '../services/cache-service';

// Keys that should be skipped for cache key generation
const SKIP_KEYS = ['token', 'signature', 'timestamp', 'apiKey'];

// Options for the cache middleware
interface CacheOptions {
  ttl?: number;
  namespace?: string;
  condition?: (req: Request) => boolean;
  keyGenerator?: (req: Request) => string;
  bypassHeader?: string;
  ignoreQueryParams?: boolean;
  ignoreAuthState?: boolean;
  cacheMethods?: string[];
}

/**
 * Extract a cache key from the request
 */
function generateCacheKey(req: Request, options: CacheOptions): string {
  // Use custom key generator if provided
  if (options.keyGenerator) {
    return options.keyGenerator(req);
  }
  
  // Start with the path
  let key = req.originalUrl || req.url;
  
  // If query params should be considered
  if (!options.ignoreQueryParams && Object.keys(req.query).length > 0) {
    // Filter out skipped keys
    const filteredQuery = { ...req.query };
    SKIP_KEYS.forEach(k => delete filteredQuery[k]);
    
    // Sort keys for consistency
    const sortedQuery = Object.keys(filteredQuery)
      .sort()
      .reduce<Record<string, any>>((obj, key) => {
        obj[key] = filteredQuery[key];
        return obj;
      }, {});
    
    // Append query string if any params remain
    if (Object.keys(sortedQuery).length > 0) {
      key = `${key}?${new URLSearchParams(sortedQuery as Record<string, string>).toString()}`;
    }
  }
  
  // If auth state should be considered
  if (!options.ignoreAuthState && req.user) {
    // Include user ID in key (but not other user info for privacy)
    key = `${key}:user_${(req.user as any).id || 'anon'}`;
  }
  
  return key;
}

/**
 * Check if a request should be cached
 */
function shouldCache(req: Request, options: CacheOptions): boolean {
  // Skip if disabled via header (e.g. for debugging)
  if (options.bypassHeader && req.get(options.bypassHeader)) {
    return false;
  }
  
  // Skip if method is not in cacheMethods
  if (options.cacheMethods && !options.cacheMethods.includes(req.method)) {
    return false;
  }
  
  // Skip if condition function returns false
  if (options.condition && !options.condition(req)) {
    return false;
  }
  
  return true;
}

/**
 * Cache middleware factory
 */
export function cacheMiddleware(ttl: number = 300, options: Partial<CacheOptions> = {}) {
  // Default options
  const defaultOptions: CacheOptions = {
    ttl: ttl,
    namespace: 'api',
    bypassHeader: 'X-Skip-Cache',
    ignoreQueryParams: false,
    ignoreAuthState: false,
    cacheMethods: ['GET'],
  };
  
  // Merge with provided options
  const cacheOptions: CacheOptions = { ...defaultOptions, ...options };
  
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET methods by default
    if (!shouldCache(req, cacheOptions)) {
      return next();
    }
    
    // Generate cache key
    const cacheKey = generateCacheKey(req, cacheOptions);
    
    try {
      // Try to get from cache
      const cachedData = await cacheService.get(cacheOptions.namespace!, cacheKey);
      
      if (cachedData) {
        // Set headers to indicate cache hit
        res.set('X-Cache', 'HIT');
        return res.json(cachedData);
      }
      
      // Set headers to indicate cache miss
      res.set('X-Cache', 'MISS');
      
      // Save original JSON method
      const originalJson = res.json;
      
      // Override res.json to intercept the response
      res.json = function(body: any) {
        // Restore original method to avoid multiple interceptions
        res.json = originalJson;
        
        // Don't cache error responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Save response to cache
          cacheService.set(
            cacheOptions.namespace!,
            cacheKey,
            body,
            cacheOptions.ttl
          ).catch(err => console.error('[Cache] Error caching response:', err));
        }
        
        // Call the original method
        return originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      // If there's any error with caching, just proceed with the request
      console.error('[Cache] Error in cache middleware:', error);
      next();
    }
  };
}

/**
 * Invalidate cache for a specific key or pattern
 */
export async function invalidateCache(key: string, namespace: string = 'api'): Promise<boolean> {
  if (key.includes('*')) {
    // Wildcard invalidation
    return cacheService.invalidateNamespace(namespace);
  } else {
    return cacheService.delete(namespace, key);
  }
}

/**
 * Middleware to manually skip cache for a specific request
 */
export function skipCache(req: Request, _res: Response, next: NextFunction) {
  req.headers['x-skip-cache'] = '1';
  next();
}

export default {
  cacheMiddleware,
  invalidateCache,
  skipCache
};