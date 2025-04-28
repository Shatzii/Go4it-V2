/**
 * Go4It Engine - Cache Middleware
 * 
 * This middleware provides caching for API routes, reducing database load
 * and improving response times for frequently accessed data.
 */

import { Request, Response, NextFunction } from 'express';
import { cacheManager } from '../cache-manager';

// Cache configuration interface
interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyFn?: (req: Request) => string; // Function to generate cache key
  condition?: (req: Request) => boolean; // Function to determine if request should be cached
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      bypassCache?: boolean;
    }
  }
}

// Default cache key generator
const defaultKeyGenerator = (req: Request): string => {
  const path = req.originalUrl || req.url;
  
  // Include query parameters in the key
  const queryParams = new URLSearchParams(req.query as any).toString();
  
  // Include user ID in key if authenticated to avoid serving wrong data
  const userId = req.user?.id || 'anonymous';
  
  return `${path}${queryParams ? '?' + queryParams : ''}:user:${userId}`;
};

// Default cache condition
const defaultCondition = (req: Request): boolean => {
  // Only cache GET requests
  return req.method === 'GET';
};

/**
 * Create a caching middleware
 */
export const cache = (options: CacheOptions = {}) => {
  const ttl = options.ttl || 3600; // Default to 1 hour
  const keyFn = options.keyFn || defaultKeyGenerator;
  const condition = options.condition || defaultCondition;
  
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching if condition is not met or bypass flag is set
    if (!condition(req) || req.bypassCache) {
      return next();
    }
    
    // Generate cache key
    const cacheKey = keyFn(req);
    
    try {
      // Try to get from cache
      const cachedData = await cacheManager.get(cacheKey);
      
      if (cachedData) {
        // Return cached response
        return res.status(200).json(cachedData);
      }
      
      // Cache miss, capture the response
      const originalSend = res.send;
      
      // Override send method to cache the response
      res.send = function(body: any): Response {
        const responseBody = body;
        
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            // Parse JSON body
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
            
            // Store in cache
            cacheManager.set(cacheKey, parsedBody, ttl)
              .catch(err => console.error(`Cache set error: ${err.message}`));
          } catch (error) {
            console.error(`Failed to cache response: ${error.message}`);
          }
        }
        
        // Call original send
        return originalSend.call(this, responseBody);
      };
      
      next();
    } catch (error) {
      console.error(`Cache middleware error: ${error.message}`);
      next();
    }
  };
};

/**
 * Middleware to clear cache entries matching a pattern
 */
export const clearCache = (pattern: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cacheManager.clear(pattern);
      next();
    } catch (error) {
      console.error(`Cache clear error: ${error.message}`);
      next();
    }
  };
};

/**
 * Middleware to bypass cache
 */
export const bypassCache = (req: Request, res: Response, next: NextFunction) => {
  // Add a flag to request to bypass cache
  req.bypassCache = true;
  next();
};