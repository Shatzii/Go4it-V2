/**
 * Go4It Sports - Cache Middleware
 * 
 * This middleware provides API response caching for improved performance.
 * It supports cache-control headers and conditional requests.
 */

const { cacheManager } = require('../cache-manager');
const crypto = require('crypto');

/**
 * Generates a cache key based on the request method, url, and query parameters
 * @param {Object} req - Express request object
 * @returns {string} The cache key
 */
function generateCacheKey(req) {
  // Include the authenticated user ID in the cache key if available
  const userId = req.user ? req.user.id : 'anonymous';
  const queryString = Object.keys(req.query).length 
    ? JSON.stringify(req.query) 
    : '';
  
  return `${req.method}:${userId}:${req.originalUrl}:${queryString}`;
}

/**
 * Generates an ETag for the response
 * @param {Object} data - Response data
 * @returns {string} ETag hash
 */
function generateETag(data) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');
}

/**
 * Cache middleware for API routes
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in seconds (default: 300)
 * @param {boolean} options.ignoreQueryParams - Whether to ignore query parameters in cache key
 * @param {Function} options.keyGenerator - Custom function to generate cache keys
 * @param {string[]} options.cacheableMethods - HTTP methods to cache (default: ['GET'])
 * @returns {Function} Express middleware
 */
function cacheMiddleware(options = {}) {
  const {
    ttl = 300, // Default: 5 minutes
    ignoreQueryParams = false,
    keyGenerator = generateCacheKey,
    cacheableMethods = ['GET']
  } = options;
  
  return async (req, res, next) => {
    // Skip caching for non-cacheable methods
    if (!cacheableMethods.includes(req.method)) {
      return next();
    }
    
    // Generate the cache key
    let cacheKey = keyGenerator(req);
    if (ignoreQueryParams) {
      cacheKey = `${req.method}:${req.path}`;
    }
    
    // Add a property to the request object for internal use
    req.cacheKey = cacheKey;
    
    try {
      // Check if we have a cached response
      const cachedResponse = await cacheManager.get(cacheKey);
      
      if (cachedResponse) {
        const { data, etag, lastModified } = cachedResponse;
        
        // Check for conditional requests
        if (req.headers['if-none-match'] === etag) {
          return res.status(304).end();
        }
        
        if (req.headers['if-modified-since'] && 
            new Date(req.headers['if-modified-since']) >= new Date(lastModified)) {
          return res.status(304).end();
        }
        
        // Set cache-related headers
        res.setHeader('Cache-Control', `max-age=${ttl}, public`);
        res.setHeader('ETag', etag);
        res.setHeader('Last-Modified', lastModified);
        res.setHeader('X-Cache', 'HIT');
        
        // Send cached response
        return res.json(data);
      }
      
      // No cached response, capture the original json method
      const originalJson = res.json;
      
      // Override the json method to intercept the response
      res.json = function(data) {
        // Store the original arguments
        const args = arguments;
        
        // Skip caching for error responses
        if (res.statusCode >= 400) {
          return originalJson.apply(res, args);
        }
        
        // Generate ETag for the response
        const etag = generateETag(data);
        const lastModified = new Date().toUTCString();
        
        // Store the response in cache
        cacheManager.set(cacheKey, {
          data,
          etag,
          lastModified
        }, ttl).catch(err => console.error(`Cache storage error: ${err.message}`));
        
        // Set cache-related headers
        res.setHeader('Cache-Control', `max-age=${ttl}, public`);
        res.setHeader('ETag', etag);
        res.setHeader('Last-Modified', lastModified);
        res.setHeader('X-Cache', 'MISS');
        
        // Call the original json method
        return originalJson.apply(res, args);
      };
      
      next();
    } catch (error) {
      // Log the error but don't fail the request
      console.error(`Cache middleware error: ${error.message}`);
      next();
    }
  };
}

/**
 * Middleware to clear cache for specific routes
 * @param {string|string[]} patterns - Cache key patterns to clear
 * @returns {Function} Express middleware
 */
function clearCache(patterns) {
  const patternArray = Array.isArray(patterns) ? patterns : [patterns];
  
  return async (req, res, next) => {
    // Store the original end method
    const originalEnd = res.end;
    
    // Override the end method
    res.end = async function(...args) {
      // Only clear cache if the request was successful
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          for (const pattern of patternArray) {
            await cacheManager.clear(pattern);
          }
        } catch (error) {
          console.error(`Cache clearing error: ${error.message}`);
        }
      }
      
      // Call the original end method
      return originalEnd.apply(res, args);
    };
    
    next();
  };
}

module.exports = {
  cacheMiddleware,
  clearCache,
  generateCacheKey
};