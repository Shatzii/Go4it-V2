import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-ts-cache-storage-memory';

// Cache with configurable TTL (time to live)
const apiCache = new NodeCache({ 
  ttl: 300, // 5 minutes default TTL
  checkperiod: 60  // Check for expired items every 60 seconds
});

// Cache paths to skip (never cache these endpoints)
const SKIP_CACHE_PATHS = [
  '/api/login', 
  '/api/logout', 
  '/api/register', 
  '/api/admin/',
  '/api/user',
  '/api/upload'
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
    if (req.isAuthenticated() && !req.path.includes('/api/content-blocks/')) {
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
  
  keys.forEach(key => {
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