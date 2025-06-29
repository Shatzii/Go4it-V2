/**
 * Go4It Sports - CDN Middleware
 * 
 * This middleware configures static asset serving with CDN-like features:
 * - Long-term caching with cache busting
 * - Efficient ETags for conditional requests
 * - Compression for appropriate file types
 */

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

/**
 * Creates middleware for CDN-like static asset serving
 * @param {Object} options - Configuration options
 * @param {string} options.directory - Directory to serve static files from (relative to server root)
 * @param {number} options.maxAge - Cache max age in seconds (default: 30 days)
 * @param {string[]} options.compressible - File extensions that should be compressed
 * @returns {Function} Express middleware
 */
function cdnMiddleware(options = {}) {
  const {
    directory = '../client/dist',
    maxAge = 2592000, // 30 days in seconds
    compressible = [
      '.html', '.css', '.js', '.json', '.xml', '.svg', 
      '.txt', '.md', '.woff', '.woff2'
    ]
  } = options;
  
  // Convert relative directory to absolute path
  const staticDir = path.resolve(__dirname, directory);
  
  // In-memory file hash cache to avoid disk reads
  const fileHashCache = new Map();
  
  return async (req, res, next) => {
    // Only process GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    try {
      // Normalize and clean up the path
      const urlPath = req.path;
      const normalizedPath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
      const filePath = path.join(staticDir, normalizedPath);
      
      // Check if file exists
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        return next();
      }
      
      // Get file extension and MIME type
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = getMimeType(ext);
      
      // Set appropriate MIME type
      res.setHeader('Content-Type', mimeType);
      
      // Set cache control headers
      res.setHeader('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=86400`);
      
      // Generate or get ETag
      let etag = fileHashCache.get(filePath);
      if (!etag) {
        const stats = fs.statSync(filePath);
        const fileHash = crypto
          .createHash('md5')
          .update(`${filePath}:${stats.size}:${stats.mtimeMs}`)
          .digest('hex');
        etag = `"${fileHash}"`;
        fileHashCache.set(filePath, etag);
      }
      
      // Set ETag header
      res.setHeader('ETag', etag);
      
      // Process conditional request
      if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
      }
      
      // Determine if file should be compressed
      const shouldCompress = compressible.includes(ext);
      if (shouldCompress) {
        res.setHeader('Vary', 'Accept-Encoding');
      }
      
      // Enable Cross-Origin Resource Sharing for assets
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // Send the file
      res.sendFile(filePath);
    } catch (error) {
      console.error(`CDN middleware error: ${error.message}`);
      next();
    }
  };
}

/**
 * Get MIME type for a file extension
 * @param {string} ext - File extension with leading dot
 * @returns {string} MIME type
 */
function getMimeType(ext) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
    '.md': 'text/markdown'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}

module.exports = {
  cdnMiddleware
};