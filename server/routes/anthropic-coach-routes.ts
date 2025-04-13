import express, { Request, Response } from 'express';
import { db } from '../db';
import { 
  aiCoaches, 
  aiCoachSessions, 
  aiCoachMessages, 
  coachFeedback, 
  coachRecommendations, 
  athleteProfiles 
} from '@shared/schema';
import { isAuthenticatedMiddleware, isAdminMiddleware } from '../middleware/auth-middleware';
import { 
  generatePersonalizedCoachingResponse, 
  generateTrainingPlan, 
  generateVideoFeedback 
} from '../services/anthropic-service';
import { and, eq, desc } from 'drizzle-orm';

// Function to register Anthropic Coach routes
export function registerAnthropicCoachRoutes(app: express.Express) {
  // Get personalized coach response (uses Claude AI)
  app.post('/api/anthropic-coach/chat', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const { message, messageHistory } = req.body;

      if (!message) {
        return res.status(400).json({ message: 'Message content is required' });
      }

      // Get athlete profile for personalization
      let athleteProfile = await db
        .select()
        .from(athleteProfiles)
        .where(eq(athleteProfiles.userId, userId))
        .then(results => results[0] || null);

      // If no profile exists, create a minimal default one
      if (!athleteProfile) {
        athleteProfile = {
          name: 'Athlete',
          sportFocus: 'general athletics',
          adhdProfile: 'needs structured coaching',
          strengths: ['dedication'],
          areasForGrowth: ['technique', 'consistency'],
          skillLevel: 'developing'
        };
      }

      // Generate personalized coaching response using Anthropic's Claude
      const response = await generatePersonalizedCoachingResponse(
        userId,
        message,
        messageHistory || [],
        athleteProfile
      );

      return res.status(200).json({
        message: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating coaching response:', error);
      return res.status(500).json({ message: 'Error generating coaching response' });
    }
  });

  // Generate a training plan (uses Claude AI)
  app.post('/api/anthropic-coach/training-plan', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const { sportType, focusArea } = req.body;

      if (!sportType) {
        return res.status(400).json({ message: 'Sport type is required' });
      }

      // Get athlete profile for personalization
      let athleteProfile = await db
        .select()
        .from(athleteProfiles)
        .where(eq(athleteProfiles.userId, userId))
        .then(results => results[0] || null);

      // If no profile exists, create a minimal default one
      if (!athleteProfile) {
        athleteProfile = {
          skillLevel: 'developing',
          adhdProfile: 'needs structured coaching',
          physicalMetrics: 'standard for age group'
        };
      }

      // Generate training plan using Anthropic's Claude
      const trainingPlan = await generateTrainingPlan(
        userId,
        sportType,
        athleteProfile,
        focusArea || 'overall improvement'
      );

      // Save the training plan to recommendations table
      const [savedPlan] = await db
        .insert(coachRecommendations)
        .values({
          userId,
          title: trainingPlan.title,
          category: 'training_plan',
          content: JSON.stringify(trainingPlan),
          sportType: sportType
        })
        .returning();

      return res.status(200).json({
        plan: trainingPlan,
        planId: savedPlan.id
      });
    } catch (error) {
      console.error('Error generating training plan:', error);
      return res.status(500).json({ message: 'Error generating training plan' });
    }
  });

  // Generate video feedback (uses Claude AI)
  app.post('/api/anthropic-coach/video-feedback', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const { sportType, videoDescription, videoId } = req.body;

      if (!sportType || !videoDescription) {
        return res.status(400).json({ message: 'Sport type and video description are required' });
      }

      // Get athlete profile for personalization
      let athleteProfile = await db
        .select()
        .from(athleteProfiles)
        .where(eq(athleteProfiles.userId, userId))
        .then(results => results[0] || null);

      // If no profile exists, create a minimal default one
      if (!athleteProfile) {
        athleteProfile = {
          skillLevel: 'developing',
          adhdProfile: 'needs structured coaching'
        };
      }

      // Generate video feedback using Anthropic's Claude
      const feedback = await generateVideoFeedback(
        userId,
        sportType,
        videoDescription,
        athleteProfile
      );

      // If videoId is provided, save the feedback
      if (videoId) {
        try {
          // Save feedback to the database
          await db
            .insert(coachFeedback)
            .values({
              userId,
              videoId,
              rating: 5, // Default rating
              feedback: JSON.stringify(feedback),
              source: 'anthropic_ai'
            });
        } catch (dbError) {
          console.error('Error saving video feedback to database:', dbError);
          // Continue anyway, as we want to return the feedback even if saving fails
        }
      }

      return res.status(200).json(feedback);
    } catch (error) {
      console.error('Error generating video feedback:', error);
      return res.status(500).json({ message: 'Error generating video feedback' });
    }
  });

  // Get user's saved training plans
  app.get('/api/anthropic-coach/training-plans', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      
      const trainingPlans = await db
        .select()
        .from(coachRecommendations)
        .where(
          and(
            eq(coachRecommendations.userId, userId),
            eq(coachRecommendations.category, 'training_plan')
          )
        )
        .orderBy(desc(coachRecommendations.createdAt));

      return res.status(200).json(trainingPlans);
    } catch (error) {
      console.error('Error fetching training plans:', error);
      return res.status(500).json({ message: 'Error fetching training plans' });
    }
  });

  // Get a specific training plan
  app.get('/api/anthropic-coach/training-plans/:id', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const planId = parseInt(req.params.id);
      
      if (isNaN(planId)) {
        return res.status(400).json({ message: 'Invalid plan ID' });
      }
      
      const [plan] = await db
        .select()
        .from(coachRecommendations)
        .where(
          and(
            eq(coachRecommendations.id, planId),
            eq(coachRecommendations.userId, userId),
            eq(coachRecommendations.category, 'training_plan')
          )
        );
      
      if (!plan) {
        return res.status(404).json({ message: 'Training plan not found' });
      }
      
      // Parse the content back to JSON
      let planContent;
      try {
        planContent = JSON.parse(plan.content);
      } catch (parseError) {
        console.error('Error parsing training plan content:', parseError);
        return res.status(500).json({ message: 'Error parsing training plan content' });
      }
      
      return res.status(200).json({
        ...plan,
        content: planContent
      });
    } catch (error) {
      console.error(`Error fetching training plan ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Error fetching training plan' });
    }
  });
}