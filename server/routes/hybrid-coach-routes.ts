import express, { Request, Response } from 'express';
import { isAuthenticatedMiddleware } from '../middleware/auth-middleware';
import { storage } from '../storage';
import { hybridAiCoachService } from '../services/hybrid-ai-coach-service';

/**
 * Register the Hybrid AI coaching routes that intelligently use both 
 * Claude and GPT models based on the specific task
 */
export function registerHybridCoachRoutes(app: express.Express) {
  // Get a chat response from the appropriate AI model
  app.post('/api/hybrid-coach/chat', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const { message, messageHistory = [], modelPreference = 'auto' } = req.body;
      const user = req.user as any;
      
      if (!message) {
        return res.status(400).json({ message: 'Message is required' });
      }
      
      // Get response from the appropriate AI model
      const response = await hybridAiCoachService.getCoachingResponse(
        user.id, 
        message, 
        messageHistory,
        modelPreference as 'claude' | 'gpt' | 'auto'
      );
      
      return res.json({
        message: response.message,
        source: response.source,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error getting hybrid coaching response:", error);
      return res.status(500).json({ message: "Error generating coaching response" });
    }
  });
  
  // Get personalized training advice
  app.post('/api/hybrid-coach/training-advice', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const { sport, skillLevel, focusArea } = req.body;
      const user = req.user as any;
      
      if (!sport || !skillLevel || !focusArea) {
        return res.status(400).json({ 
          message: 'Sport, skill level, and focus area are all required' 
        });
      }
      
      // Get training advice from the appropriate AI model
      const advice = await hybridAiCoachService.getPersonalizedTrainingAdvice(
        user.id,
        sport,
        skillLevel,
        focusArea
      );
      
      return res.json(advice);
    } catch (error) {
      console.error("Error getting personalized training advice:", error);
      return res.status(500).json({ message: "Error generating training advice" });
    }
  });
  
  // Generate feedback on a video performance
  app.post('/api/hybrid-coach/video-feedback', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
    try {
      const { sportType, videoDescription } = req.body;
      const user = req.user as any;
      
      if (!sportType || !videoDescription) {
        return res.status(400).json({ 
          message: 'Sport type and video description are required' 
        });
      }
      
      // Generate video feedback
      const feedback = await hybridAiCoachService.generateVideoFeedback(
        user.id,
        sportType,
        videoDescription
      );
      
      return res.json(feedback);
    } catch (error) {
      console.error("Error generating video feedback:", error);
      return res.status(500).json({ message: "Error generating video feedback" });
    }
  });
}