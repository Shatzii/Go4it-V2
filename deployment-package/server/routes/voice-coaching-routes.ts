/**
 * Go4It Sports - Voice Coaching Routes
 * API endpoints for voice-activated coaching assistant
 */

import { Router, Request, Response } from 'express';
import { voiceCoachingAssistantService } from '../services/voice-coaching-assistant';

const router = Router();

/**
 * POST /api/voice-coach/process
 * Process voice command from athlete
 */
router.post('/process', async (req: Request, res: Response) => {
  try {
    const { athleteId, transcription, context } = req.body;
    const command = await voiceCoachingAssistantService.processVoiceCommand(athleteId, transcription, context);
    res.json({ success: true, command });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/voice-coach/sessions/start
 * Start coaching session
 */
router.post('/sessions/start', async (req: Request, res: Response) => {
  try {
    const { athleteId, sport, sessionType } = req.body;
    const session = await voiceCoachingAssistantService.startCoachingSession(athleteId, sport, sessionType);
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/voice-coach/sessions/:sessionId/complete
 * Complete coaching session
 */
router.post('/sessions/:sessionId/complete', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { satisfactionScore } = req.body;
    const session = await voiceCoachingAssistantService.completeCoachingSession(sessionId, satisfactionScore);
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/voice-coach/analytics/:athleteId
 * Get coaching analytics
 */
router.get('/analytics/:athleteId', async (req: Request, res: Response) => {
  try {
    const { athleteId } = req.params;
    const analytics = await voiceCoachingAssistantService.getCoachingAnalytics(athleteId);
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;