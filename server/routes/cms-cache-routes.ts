/**
 * CMS Cache Routes
 * 
 * API endpoints for managing the CMS content cache,
 * including route handlers for statistics, invalidation,
 * and cache control operations.
 */

import { Router } from 'express';
import { cmsCache } from '../services/cms/cache-service';
import { isAuthenticatedMiddleware, isAdminMiddleware } from '../middleware/auth-middleware';

const router = Router();

/**
 * Get current cache statistics
 * GET /api/cms/cache/stats
 */
router.get('/stats', isAuthenticatedMiddleware, isAdminMiddleware, (req, res) => {
  try {
    const stats = cmsCache.getStats();
    return res.json(stats);
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return res.status(500).json({ error: 'Failed to retrieve cache statistics' });
  }
});

/**
 * Reset cache statistics (but keep cached data)
 * POST /api/cms/cache/reset-stats
 */
router.post('/reset-stats', isAuthenticatedMiddleware, isAdminMiddleware, (req, res) => {
  try {
    cmsCache.resetStats();
    return res.json({ success: true, message: 'Cache statistics reset successfully' });
  } catch (error) {
    console.error('Error resetting cache stats:', error);
    return res.status(500).json({ error: 'Failed to reset cache statistics' });
  }
});

/**
 * Invalidate a specific content block in the cache
 * POST /api/cms/cache/invalidate/block/:identifier
 */
router.post('/invalidate/block/:identifier', isAuthenticatedMiddleware, isAdminMiddleware, (req, res) => {
  try {
    const { identifier } = req.params;
    const result = cmsCache.invalidateContentBlock(identifier);
    
    return res.json({ 
      success: result, 
      message: result 
        ? `Content block '${identifier}' invalidated successfully` 
        : `Content block '${identifier}' not found in cache`
    });
  } catch (error) {
    console.error('Error invalidating content block:', error);
    return res.status(500).json({ error: 'Failed to invalidate content block' });
  }
});

/**
 * Invalidate all content blocks in a section
 * POST /api/cms/cache/invalidate/section/:section
 */
router.post('/invalidate/section/:section', isAuthenticatedMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const { section } = req.params;
    const result = await cmsCache.invalidateContentSection(section);
    
    return res.json({ 
      success: result, 
      message: result 
        ? `Content section '${section}' invalidated successfully` 
        : `Content section '${section}' not found or error occurred`
    });
  } catch (error) {
    console.error('Error invalidating content section:', error);
    return res.status(500).json({ error: 'Failed to invalidate content section' });
  }
});

/**
 * Invalidate a specific page in the cache
 * POST /api/cms/cache/invalidate/page/:slug
 */
router.post('/invalidate/page/:slug', isAuthenticatedMiddleware, isAdminMiddleware, (req, res) => {
  try {
    const { slug } = req.params;
    const result = cmsCache.invalidatePage(slug);
    
    return res.json({ 
      success: result, 
      message: result 
        ? `Page '${slug}' invalidated successfully` 
        : `Page '${slug}' not found in cache`
    });
  } catch (error) {
    console.error('Error invalidating page:', error);
    return res.status(500).json({ error: 'Failed to invalidate page' });
  }
});

/**
 * Invalidate the entire cache
 * POST /api/cms/cache/invalidate/all
 */
router.post('/invalidate/all', isAuthenticatedMiddleware, isAdminMiddleware, (req, res) => {
  try {
    cmsCache.invalidateAll();
    return res.json({ 
      success: true, 
      message: 'All cache entries invalidated successfully'
    });
  } catch (error) {
    console.error('Error invalidating entire cache:', error);
    return res.status(500).json({ error: 'Failed to invalidate cache' });
  }
});

export default router;