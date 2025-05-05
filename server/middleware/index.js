/**
 * Go4It Sports - Middleware Index
 * 
 * This file exports all middleware components for easy importing
 */

const { cacheMiddleware, clearCache, generateCacheKey } = require('./cache-middleware');
const { configureCompression } = require('./compression-middleware');
const { cdnMiddleware } = require('./cdn-middleware');

module.exports = {
  cacheMiddleware,
  clearCache,
  generateCacheKey,
  configureCompression,
  cdnMiddleware
};