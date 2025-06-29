import { Request, Response, Router } from 'express';
import { storage } from '../storage';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { isAuthenticatedMiddleware } from '../middleware/auth-middleware';
import { garAthleteRatings, videoHighlights, coachRecommendations, garCategories } from '@shared/schema';
import { log } from '../vite';

const router = Router();

/**
 * Get GAR scores for a specific user
 * 
 * @route GET /api/gar-scores/:userId
 * @param {number} userId - The ID of the user to get GAR scores for
 * @returns {Object} GAR scores object by category
 */
router.get('/gar-scores/:userId', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Ensure user is requesting their own data or is an admin/coach
    if (req.user?.id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'coach') {
      return res.status(403).json({ message: 'You do not have permission to access this data' });
    }

    // Get latest GAR scores for each category for the user
    const garScores = await db.select()
      .from(garAthleteRatings)
      .where(eq(garAthleteRatings.userId, userId))
      .orderBy(garAthleteRatings.createdAt);

    // Transform into object by category
    const scoresByCategory: Record<string, number> = {};
    
    for (const score of garScores) {
      // Get the category name from the categoryId
      const categories = await db.select().from(garCategories).where(eq(garCategories.id, score.categoryId));
      
      if (categories.length > 0) {
        scoresByCategory[categories[0].name] = score.rating;
      }
    }

    res.json(scoresByCategory);
  } catch (error) {
    log(`Error getting GAR scores: ${error}`, 'error');
    res.status(500).json({ message: 'Error retrieving GAR scores' });
  }
});

/**
 * Get highlights for a specific user
 * 
 * @route GET /api/highlights
 * @query {number} userId - The ID of the user to get highlights for
 * @returns {Array} Array of highlight objects
 */
router.get('/highlights', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.query.userId as string);
    
    // Ensure user is requesting their own data or is an admin/coach
    if (req.user?.id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'coach') {
      return res.status(403).json({ message: 'You do not have permission to access this data' });
    }

    // Get highlights for the user
    const highlights = await db.select()
      .from(videoHighlights)
      .where(eq(videoHighlights.userId, userId))
      .orderBy(videoHighlights.createdAt);

    res.json(highlights);
  } catch (error) {
    log(`Error getting highlights: ${error}`, 'error');
    res.status(500).json({ message: 'Error retrieving highlights' });
  }
});

/**
 * Get recommendations for a specific user
 * 
 * @route GET /api/recommendations/:userId
 * @param {number} userId - The ID of the user to get recommendations for
 * @returns {Array} Array of recommendation objects
 */
router.get('/recommendations/:userId', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Ensure user is requesting their own data or is an admin/coach
    if (req.user?.id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'coach') {
      return res.status(403).json({ message: 'You do not have permission to access this data' });
    }

    // Get recommendations for the user
    const recommendations = await db.select()
      .from(coachRecommendations)
      .where(eq(coachRecommendations.userId, userId))
      .orderBy(coachRecommendations.createdAt);

    res.json(recommendations);
  } catch (error) {
    log(`Error getting recommendations: ${error}`, 'error');
    res.status(500).json({ message: 'Error retrieving recommendations' });
  }
});

export default router;