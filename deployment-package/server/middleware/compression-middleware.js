/**
 * Go4It Sports - Compression Middleware
 * 
 * This middleware configures compression for the APIs,
 * optimizing response size and improving performance.
 */

const compression = require('compression');

/**
 * Determines if a request should be compressed
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} Whether to compress the response
 */
function shouldCompress(req, res) {
  // Don't compress if client explicitly doesn't accept it
  if (req.headers['x-no-compression']) {
    return false;
  }
  
  // Check response's content-type
  const contentType = res.getHeader('Content-Type') || '';
  
  // Skip compression for already compressed formats
  if (
    contentType.includes('image/') ||
    contentType.includes('video/') ||
    contentType.includes('audio/') ||
    contentType.includes('application/zip') ||
    contentType.includes('application/gzip') ||
    contentType.includes('application/x-gzip') ||
    contentType.includes('application/pdf')
  ) {
    return false;
  }
  
  // Use default threshold (1KB) for other types
  return compression.filter(req, res);
}

/**
 * Configures compression middleware with optimized settings
 * @returns {Function} Express middleware
 */
function configureCompression() {
  return compression({
    // Filter function to determine if response should be compressed
    filter: shouldCompress,
    
    // Compression level (1=fastest, 9=best compression)
    level: 6,
    
    // Only compress responses larger than 1KB (default)
    threshold: 1024,
    
    // Support brotli compression if available
    brotli: { enabled: true, zlib: {} }
  });
}

module.exports = {
  configureCompression
};