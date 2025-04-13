import express from 'express';
import { cmsCache } from '../services/cms/cache-service';
import { isAuthenticated, isAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * Get cache statistics
 * GET /api/cms/cache/stats
 */
router.get('/stats', isAuthenticated, isAdmin, (req, res) => {
  try {
    const stats = cmsCache.getCacheStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({ message: 'Failed to get cache statistics' });
  }
});

/**
 * Invalidate content block cache
 * POST /api/cms/cache/invalidate/block/:identifier
 */
router.post('/invalidate/block/:identifier', isAuthenticated, isAdmin, (req, res) => {
  const { identifier } = req.params;
  
  try {
    cmsCache.invalidateContentBlock(identifier);
    res.json({ message: `Content block "${identifier}" cache invalidated` });
  } catch (error) {
    console.error(`Error invalidating content block "${identifier}" cache:`, error);
    res.status(500).json({ message: 'Failed to invalidate content block cache' });
  }
});

/**
 * Invalidate content section cache
 * POST /api/cms/cache/invalidate/section/:section
 */
router.post('/invalidate/section/:section', isAuthenticated, isAdmin, (req, res) => {
  const { section } = req.params;
  
  try {
    cmsCache.invalidateContentSection(section);
    res.json({ message: `Content section "${section}" cache invalidated` });
  } catch (error) {
    console.error(`Error invalidating content section "${section}" cache:`, error);
    res.status(500).json({ message: 'Failed to invalidate content section cache' });
  }
});

/**
 * Invalidate page cache
 * POST /api/cms/cache/invalidate/page/:slug
 */
router.post('/invalidate/page/:slug', isAuthenticated, isAdmin, (req, res) => {
  const { slug } = req.params;
  
  try {
    cmsCache.invalidatePage(slug);
    res.json({ message: `Page "${slug}" cache invalidated` });
  } catch (error) {
    console.error(`Error invalidating page "${slug}" cache:`, error);
    res.status(500).json({ message: 'Failed to invalidate page cache' });
  }
});

/**
 * Invalidate all cache
 * POST /api/cms/cache/invalidate/all
 */
router.post('/invalidate/all', isAuthenticated, isAdmin, (req, res) => {
  try {
    cmsCache.invalidateAllContent();
    res.json({ message: 'All cache invalidated' });
  } catch (error) {
    console.error('Error invalidating all cache:', error);
    res.status(500).json({ message: 'Failed to invalidate all cache' });
  }
});

/**
 * Reset cache statistics
 * POST /api/cms/cache/reset-stats
 */
router.post('/reset-stats', isAuthenticated, isAdmin, (req, res) => {
  try {
    cmsCache.resetCacheStats();
    res.json({ message: 'Cache statistics reset' });
  } catch (error) {
    console.error('Error resetting cache statistics:', error);
    res.status(500).json({ message: 'Failed to reset cache statistics' });
  }
});

export default router;