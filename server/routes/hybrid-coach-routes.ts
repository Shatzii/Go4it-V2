import { Request, Response, Router, Express } from 'express';
import { HybridAICoachService } from '../services/hybrid-ai-coach-service';

const router = Router();
const hybridCoachService = new HybridAICoachService();

/**
 * Chat with the hybrid AI coach
 */
router.post('/hybrid-coach/chat', async (req: Request, res: Response) => {
  try {
    const { message, messageHistory, modelPreference } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await hybridCoachService.getChatResponse({
      message,
      messageHistory: messageHistory || [],
      modelPreference: modelPreference || 'auto'
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error in hybrid coach chat:', error);
    res.status(500).json({
      error: 'Failed to process your message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Generate personalized training advice
 */
router.post('/hybrid-coach/training-advice', async (req: Request, res: Response) => {
  try {
    const { sport, skillLevel, focusArea } = req.body;
    
    if (!sport || !skillLevel || !focusArea) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'sport, skillLevel, and focusArea are all required'
      });
    }
    
    if (!['beginner', 'intermediate', 'advanced', 'elite'].includes(skillLevel)) {
      return res.status(400).json({
        error: 'Invalid skill level',
        details: 'skillLevel must be one of: beginner, intermediate, advanced, elite'
      });
    }
    
    const response = await hybridCoachService.getTrainingAdvice({
      sport,
      skillLevel: skillLevel as 'beginner' | 'intermediate' | 'advanced' | 'elite',
      focusArea
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error generating training advice:', error);
    res.status(500).json({
      error: 'Failed to generate training advice',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Generate video feedback based on description
 */
router.post('/hybrid-coach/video-feedback', async (req: Request, res: Response) => {
  try {
    const { sportType, videoDescription } = req.body;
    
    if (!sportType || !videoDescription) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'sportType and videoDescription are both required'
      });
    }
    
    const response = await hybridCoachService.getVideoFeedback({
      sportType,
      videoDescription
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error generating video feedback:', error);
    res.status(500).json({
      error: 'Failed to generate video feedback',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Register hybrid coach routes with the Express app
 */
export const registerHybridCoachRoutes = (app: Express) => {
  app.use('/api', router);
};

export default router;