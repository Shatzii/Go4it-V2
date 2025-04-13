import express, { Request, Response } from 'express';
import { anthropicService } from '../services/anthropic-service';
import { storage } from '../storage';
import { isAuthenticatedMiddleware } from '../middleware/auth-middleware';

/**
 * Register the Anthropic Claude-powered coaching companion routes
 */
export function registerAnthropicCoachRoutes(app: express.Express) {
  // Chat with the AI coach
  app.post('/api/anthropic-coach/chat', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const { message, messageHistory = [] } = req.body;
      const user = req.user as any;
      
      if (!message) {
        return res.status(400).json({ message: 'Message is required' });
      }
      
      // Get user context from the profile if available
      const athleteProfile = await storage.getAthleteProfileByUserId(user.id);
      
      // Create a custom system prompt based on user data
      let systemPrompt = undefined;
      if (athleteProfile) {
        const sportInfo = athleteProfile.sportType ? `sport: ${athleteProfile.sportType}` : '';
        const positionInfo = athleteProfile.position ? `position: ${athleteProfile.position}` : '';
        
        if (sportInfo || positionInfo) {
          systemPrompt = `
            You are a personalized coaching companion for Go4It Sports.
            This athlete plays ${sportInfo} ${positionInfo}. 
            Tailor your advice specifically to their sport and position when relevant.
            Remember that this athlete is a neurodivergent student (12-18 years old), likely with ADHD.
            Use clear, concise communication with visual cues like bullet points and numbered lists.
            Be encouraging, positive, and break complex topics into manageable chunks.
          `;
        }
      }
      
      // Get response from the AI
      const response = await anthropicService.getChatResponse(
        message, 
        messageHistory.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        systemPrompt
      );
      
      return res.json({
        message: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error in AI coach chat:", error);
      return res.status(500).json({ message: "Error generating coach response" });
    }
  });

  // Generate a personalized training plan
  app.post('/api/anthropic-coach/training-plan', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const { sportType, focusArea } = req.body;
      const user = req.user as any;
      
      if (!sportType || !focusArea) {
        return res.status(400).json({ message: 'Sport type and focus area are required' });
      }

      // Get user context from the profile if available
      const athleteProfile = await storage.getAthleteProfileByUserId(user.id);
      let athleteContext = '';
      
      if (athleteProfile) {
        const contextParts = [];
        if (athleteProfile.age) contextParts.push(`Age: ${athleteProfile.age}`);
        if (athleteProfile.position) contextParts.push(`Position: ${athleteProfile.position}`);
        if (athleteProfile.height) contextParts.push(`Height: ${athleteProfile.height}"`);
        if (athleteProfile.weight) contextParts.push(`Weight: ${athleteProfile.weight} lbs`);
        
        athleteContext = contextParts.join(', ');
      }
      
      // Generate training plan from the AI
      const plan = await anthropicService.generateTrainingPlan(sportType, focusArea, athleteContext);
      
      // Save the training plan in the database
      const savedPlan = await storage.createAnthropicTrainingPlan({
        userId: user.id,
        title: plan.title,
        sportType: plan.sportType,
        focusArea: plan.focusArea,
        durationDays: plan.durationDays,
        recommendedLevel: plan.recommendedLevel,
        overview: plan.overview,
        planData: plan,
        createdAt: new Date()
      });
      
      return res.json({
        plan: plan,
        planId: savedPlan.id
      });
    } catch (error) {
      console.error("Error generating training plan:", error);
      return res.status(500).json({ message: "Error generating training plan" });
    }
  });

  // Get video performance feedback
  app.post('/api/anthropic-coach/video-feedback', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const { sportType, videoDescription, videoId } = req.body;
      const user = req.user as any;
      
      if (!sportType || !videoDescription) {
        return res.status(400).json({ message: 'Sport type and video description are required' });
      }
      
      // Generate feedback from the AI
      const feedback = await anthropicService.generateVideoFeedback(sportType, videoDescription);
      
      // If videoId was provided, associate the feedback with the video
      if (videoId) {
        const video = await storage.getVideo(videoId);
        
        // Check if user has access to this video
        if (!video || (video.userId !== user.id && user.role !== 'admin' && user.role !== 'coach')) {
          return res.status(403).json({ message: "Not authorized to analyze this video" });
        }
        
        // Save the feedback in the database
        await storage.createVideoAnalysis({
          videoId: videoId,
          analysisData: feedback,
          analysisType: 'anthropic-coach',
          createdAt: new Date(),
          athleteId: video.userId
        });
      }
      
      return res.json(feedback);
    } catch (error) {
      console.error("Error generating video feedback:", error);
      return res.status(500).json({ message: "Error generating video feedback" });
    }
  });

  // Get all saved training plans for a user
  app.get('/api/anthropic-coach/training-plans', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // Get training plans from the database
      const plans = await storage.getAnthropicTrainingPlansByUserId(user.id);
      
      return res.json(plans.map(plan => ({
        id: plan.id,
        title: plan.title,
        sportType: plan.sportType,
        focusArea: plan.focusArea,
        durationDays: plan.durationDays,
        recommendedLevel: plan.recommendedLevel,
        overview: plan.overview,
        days: plan.planData.days,
        createdAt: plan.createdAt
      })));
    } catch (error) {
      console.error("Error fetching training plans:", error);
      return res.status(500).json({ message: "Error fetching training plans" });
    }
  });

  // Get a specific training plan by ID
  app.get('/api/anthropic-coach/training-plans/:id', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user as any;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid plan ID" });
      }
      
      // Get the training plan from the database
      const plan = await storage.getAnthropicTrainingPlan(id);
      
      if (!plan) {
        return res.status(404).json({ message: "Training plan not found" });
      }
      
      // Check if user has access to this plan
      if (plan.userId !== user.id && user.role !== 'admin' && user.role !== 'coach') {
        return res.status(403).json({ message: "Not authorized to access this training plan" });
      }
      
      return res.json({
        id: plan.id,
        title: plan.title,
        sportType: plan.sportType,
        focusArea: plan.focusArea,
        durationDays: plan.durationDays,
        recommendedLevel: plan.recommendedLevel,
        overview: plan.overview,
        days: plan.planData.days,
        createdAt: plan.createdAt
      });
    } catch (error) {
      console.error("Error fetching training plan:", error);
      return res.status(500).json({ message: "Error fetching training plan" });
    }
  });
}