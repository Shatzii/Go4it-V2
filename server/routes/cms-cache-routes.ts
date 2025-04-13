import express, { Request, Response } from 'express';
import { cmsCache } from '../services/cms/cache-service';
import { isAdminMiddleware } from '../middleware/auth-middleware';

const router = express.Router();

/**
 * Get cache statistics
 * GET /api/cms/cache/stats
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = cmsCache.getCacheStats();
    return res.json(stats);
  } catch (error) {
    console.error("Error fetching cache statistics:", error);
    return res.status(500).json({ message: "Error fetching cache statistics" });
  }
});

/**
 * Invalidate content block cache
 * POST /api/cms/cache/invalidate/block/:identifier
 */
router.post('/invalidate/block/:identifier', isAdminMiddleware, (req: Request, res: Response) => {
  try {
    const identifier = req.params.identifier;
    cmsCache.invalidateContentBlock(identifier);
    
    return res.json({ 
      success: true, 
      message: `Cache invalidated for content block: ${identifier}` 
    });
  } catch (error) {
    console.error("Error invalidating content block cache:", error);
    return res.status(500).json({ message: "Error invalidating content block cache" });
  }
});

/**
 * Invalidate content section cache
 * POST /api/cms/cache/invalidate/section/:section
 */
router.post('/invalidate/section/:section', isAdminMiddleware, (req: Request, res: Response) => {
  try {
    const section = req.params.section;
    cmsCache.invalidateContentSection(section);
    
    return res.json({ 
      success: true, 
      message: `Cache invalidated for section: ${section}` 
    });
  } catch (error) {
    console.error("Error invalidating section cache:", error);
    return res.status(500).json({ message: "Error invalidating section cache" });
  }
});

/**
 * Invalidate page cache
 * POST /api/cms/cache/invalidate/page/:slug
 */
router.post('/invalidate/page/:slug', isAdminMiddleware, (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    cmsCache.invalidatePage(slug);
    
    return res.json({ 
      success: true, 
      message: `Cache invalidated for page: ${slug}` 
    });
  } catch (error) {
    console.error("Error invalidating page cache:", error);
    return res.status(500).json({ message: "Error invalidating page cache" });
  }
});

/**
 * Invalidate all cache
 * POST /api/cms/cache/invalidate/all
 */
router.post('/invalidate/all', isAdminMiddleware, (req: Request, res: Response) => {
  try {
    cmsCache.invalidateAllContent();
    
    return res.json({ 
      success: true, 
      message: "All cache has been invalidated" 
    });
  } catch (error) {
    console.error("Error invalidating all cache:", error);
    return res.status(500).json({ message: "Error invalidating all cache" });
  }
});

/**
 * Reset cache statistics
 * POST /api/cms/cache/reset-stats
 */
router.post('/reset-stats', isAdminMiddleware, (req: Request, res: Response) => {
  try {
    cmsCache.resetCacheStats();
    
    return res.json({ 
      success: true, 
      message: "Cache statistics have been reset" 
    });
  } catch (error) {
    console.error("Error resetting cache statistics:", error);
    return res.status(500).json({ message: "Error resetting cache statistics" });
  }
});

export default router;