import { Request, Response } from "express";
import { db } from "../db";
import { eq, and, desc, gte } from "drizzle-orm";
import { 
  garAthleteRatings, 
  garCategories, 
  garSubcategories, 
  garRatingHistory,
  videos,
  users,
  athleteProfiles
} from "@shared/schema";
import { storage } from "../storage";
import { isAuthenticatedMiddleware } from "../auth";

/**
 * Get a user's GAR scores
 * GET /api/athlete/gar-scores/:userId
 */
export const getGarScores = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Ensure the user is requesting their own data or is an admin/coach
    if (req.user?.id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'coach') {
      return res.status(403).json({ error: "Not authorized to view this user's GAR scores" });
    }

    // Get categories
    const categories = await db.select().from(garCategories);
    
    // Get all ratings for this user, including category and subcategory details
    const ratings = await db.select({
      id: garAthleteRatings.id,
      rating: garAthleteRatings.rating,
      categoryId: garAthleteRatings.categoryId,
      subcategoryId: garAthleteRatings.subcategoryId,
      createdAt: garAthleteRatings.createdAt,
      categoryName: garCategories.name,
      categoryWeight: garCategories.weight,
      subcategoryName: garSubcategories.name,
      subcategoryWeight: garSubcategories.weight,
    })
    .from(garAthleteRatings)
    .leftJoin(garCategories, eq(garAthleteRatings.categoryId, garCategories.id))
    .leftJoin(garSubcategories, eq(garAthleteRatings.subcategoryId, garSubcategories.id))
    .where(eq(garAthleteRatings.userId, userId))
    .orderBy(desc(garAthleteRatings.createdAt));

    // Group ratings by category
    const categoryScores: Record<string, { score: number; subcategories: any[] }> = {};
    let totalWeightedScore = 0;
    let totalWeight = 0;

    // Initialize categories
    categories.forEach(category => {
      categoryScores[category.name.toLowerCase()] = {
        score: 0,
        subcategories: []
      };
    });

    // Process ratings
    ratings.forEach(rating => {
      const categoryKey = rating.categoryName.toLowerCase();
      
      // Add subcategory score if it exists
      if (rating.subcategoryName) {
        categoryScores[categoryKey].subcategories.push({
          name: rating.subcategoryName,
          score: rating.rating,
          weight: rating.subcategoryWeight || 1.0
        });
      }
      
      // Accumulate scores for calculating weighted average
      const weight = rating.categoryWeight || 1.0;
      totalWeightedScore += rating.rating * weight;
      totalWeight += weight;
    });

    // Calculate average scores for each category
    for (const categoryKey in categoryScores) {
      const subcategories = categoryScores[categoryKey].subcategories;
      if (subcategories.length > 0) {
        let categoryTotal = 0;
        let categoryWeightTotal = 0;
        
        subcategories.forEach(sub => {
          categoryTotal += sub.score * sub.weight;
          categoryWeightTotal += sub.weight;
        });
        
        categoryScores[categoryKey].score = Math.round(categoryTotal / categoryWeightTotal);
      }
    }

    // Calculate overall GAR score
    const overallScore = totalWeight > 0 
      ? Math.round(totalWeightedScore / totalWeight) 
      : 0;

    // Format the final response
    const result = {
      overallScore,
      categoryScores: Object.keys(categoryScores).reduce((acc, key) => {
        acc[key] = categoryScores[key].score;
        return acc;
      }, {} as Record<string, number>),
      detailedScores: categoryScores,
      updatedAt: ratings.length > 0 ? ratings[0].createdAt : new Date(),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching GAR scores:", error);
    return res.status(500).json({ error: "Failed to fetch GAR scores" });
  }
};

/**
 * Get a user's GAR score history
 * GET /api/athlete/gar-history/:userId
 */
export const getGarHistory = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Ensure the user is requesting their own data or is an admin/coach
    if (req.user?.id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'coach') {
      return res.status(403).json({ error: "Not authorized to view this user's GAR history" });
    }

    // Get the history entries
    const history = await db.select()
      .from(garRatingHistory)
      .where(eq(garRatingHistory.userId, userId))
      .orderBy(garRatingHistory.recordedAt);

    return res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching GAR history:", error);
    return res.status(500).json({ error: "Failed to fetch GAR history" });
  }
};

/**
 * Generate GAR scores from a video
 * POST /api/athlete/generate-gar-score
 * Body: { videoId: number }
 */
export const generateGarScore = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.body;
    
    if (!videoId) {
      return res.status(400).json({ error: "Video ID is required" });
    }

    // Get the video
    const [video] = await db.select()
      .from(videos)
      .where(eq(videos.id, videoId));

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Ensure the user is the owner of the video or an admin/coach
    if (req.user?.id !== video.userId && req.user?.role !== 'admin' && req.user?.role !== 'coach') {
      return res.status(403).json({ error: "Not authorized to generate GAR scores for this video" });
    }

    // Check if video has been analyzed
    if (!video.analyzed) {
      return res.status(400).json({ error: "Video has not been analyzed yet" });
    }

    // In a real implementation, this would use the AI analysis results
    // For now, we'll simulate by generating random scores
    const categories = await db.select().from(garCategories);
    const subcategories = await db.select().from(garSubcategories);
    
    // Group subcategories by category
    const subcategoriesByCategory: Record<number, typeof subcategories> = {};
    subcategories.forEach(sub => {
      if (!subcategoriesByCategory[sub.categoryId]) {
        subcategoriesByCategory[sub.categoryId] = [];
      }
      subcategoriesByCategory[sub.categoryId].push(sub);
    });

    // Generate ratings for each subcategory
    const ratings = [];
    const ratingValues: Record<string, number> = {};
    
    for (const category of categories) {
      const categorySubcategories = subcategoriesByCategory[category.id] || [];
      let categoryTotal = 0;
      
      for (const subcategory of categorySubcategories) {
        // In a real implementation, this would be calculated from AI analysis
        // For now, generate a score between 60-90
        const score = Math.floor(Math.random() * 31) + 60;
        
        ratings.push({
          userId: video.userId,
          categoryId: category.id,
          subcategoryId: subcategory.id,
          rating: score,
          videoId: videoId,
          source: "ai",
          notes: `Generated from video analysis of ${video.title}`,
        });
        
        categoryTotal += score;
      }
      
      const categoryAvg = categorySubcategories.length > 0 
        ? Math.round(categoryTotal / categorySubcategories.length) 
        : 0;
      
      ratingValues[category.name.toLowerCase()] = categoryAvg;
    }

    // Calculate overall score
    const overallScore = Object.values(ratingValues).length > 0
      ? Math.round(Object.values(ratingValues).reduce((sum, val) => sum + val, 0) / Object.values(ratingValues).length)
      : 0;

    // Insert individual ratings
    if (ratings.length > 0) {
      await db.insert(garAthleteRatings).values(ratings);
    }

    // Record in history
    await db.insert(garRatingHistory).values({
      userId: video.userId,
      ratings: ratingValues,
      totalScore: overallScore,
      source: "video_analysis",
      notes: `Generated from video analysis of ${video.title}`,
    });

    return res.status(200).json({ 
      success: true, 
      message: "GAR scores generated successfully",
      scores: {
        overall: overallScore,
        categories: ratingValues
      }
    });
  } catch (error) {
    console.error("Error generating GAR scores:", error);
    return res.status(500).json({ error: "Failed to generate GAR scores" });
  }
};

/**
 * Get training recommendations based on GAR scores
 * GET /api/athlete/training-recommendations/:userId
 */
export const getTrainingRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Ensure the user is requesting their own data or is an admin/coach
    if (req.user?.id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'coach') {
      return res.status(403).json({ error: "Not authorized to view this user's recommendations" });
    }

    // Get athlete profile to know their sport
    const profile = await db.query.athleteProfiles.findFirst({
      where: eq(athleteProfiles.userId, userId)
    });

    if (!profile) {
      return res.status(404).json({ error: "Athlete profile not found" });
    }

    // Get latest GAR ratings
    const ratings = await db.select({
      id: garAthleteRatings.id,
      rating: garAthleteRatings.rating,
      categoryId: garAthleteRatings.categoryId,
      subcategoryId: garAthleteRatings.subcategoryId,
      categoryName: garCategories.name,
      subcategoryName: garSubcategories.name,
    })
    .from(garAthleteRatings)
    .leftJoin(garCategories, eq(garAthleteRatings.categoryId, garCategories.id))
    .leftJoin(garSubcategories, eq(garAthleteRatings.subcategoryId, garSubcategories.id))
    .where(eq(garAthleteRatings.userId, userId))
    .orderBy(desc(garAthleteRatings.createdAt));

    // Find low scores (below 70) to generate recommendations
    const lowScores = ratings.filter(rating => rating.rating < 70);
    
    // Generate recommendations
    // In a real implementation, this would use AI to generate personalized recommendations
    // For now, we'll use static recommendations based on low scores
    const recommendations = lowScores.slice(0, 3).map(score => ({
      type: score.categoryName.toLowerCase(),
      area: score.subcategoryName,
      score: score.rating,
      title: `Improve ${score.subcategoryName}`,
      description: `Your ${score.subcategoryName} score is ${score.rating}/100. Work on improving this aspect.`,
      drillsLink: `/drills/${score.subcategoryName.toLowerCase().replace(/\s+/g, '-')}`,
    }));

    // If we don't have enough recommendations from low scores, add general ones
    if (recommendations.length < 3) {
      const generalRecs = [
        {
          type: "technique",
          area: "Form",
          score: null,
          title: "Perfect Your Form",
          description: "Work on fundamental techniques to improve overall performance.",
          drillsLink: "/drills/fundamentals",
        },
        {
          type: "physical",
          area: "Conditioning",
          score: null,
          title: "Enhance Conditioning",
          description: "Improve your overall fitness for better endurance during games.",
          drillsLink: "/drills/conditioning",
        },
        {
          type: "mental",
          area: "Game IQ",
          score: null,
          title: "Boost Game IQ",
          description: "Study game footage to improve decision-making on the court/field.",
          drillsLink: "/drills/game-iq",
        }
      ];
      
      while (recommendations.length < 3) {
        recommendations.push(generalRecs[recommendations.length]);
      }
    }

    return res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error generating training recommendations:", error);
    return res.status(500).json({ error: "Failed to generate training recommendations" });
  }
};

/**
 * Get GAR categories and subcategories
 * GET /api/gar/categories
 */
export const getGarCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await db.select().from(garCategories);
    const subcategories = await db.select().from(garSubcategories);
    
    // Group subcategories by category
    const result = categories.map(category => ({
      ...category,
      subcategories: subcategories.filter(sub => sub.categoryId === category.id)
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching GAR categories:", error);
    return res.status(500).json({ error: "Failed to fetch GAR categories" });
  }
};

/**
 * Register GAR routes
 */
export function registerGarRoutes(app: any) {
  // Athlete-specific routes
  app.get('/api/athlete/gar-scores/:userId', isAuthenticatedMiddleware, getGarScores);
  app.get('/api/athlete/gar-history/:userId', isAuthenticatedMiddleware, getGarHistory);
  app.post('/api/athlete/generate-gar-score', isAuthenticatedMiddleware, generateGarScore);
  app.get('/api/athlete/training-recommendations/:userId', isAuthenticatedMiddleware, getTrainingRecommendations);
  
  // General GAR routes
  app.get('/api/gar/categories', getGarCategories);
  
  console.log('[express] Registered GAR API routes');
}