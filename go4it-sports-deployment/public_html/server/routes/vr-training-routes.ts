/**
 * Go4It Sports - VR Training Routes
 * API endpoints for Virtual Reality training scenarios
 */

import { Router, Request, Response } from 'express';
import { vrTrainingService } from '../services/vr-training-scenarios';

const router = Router();

/**
 * GET /api/vr/scenarios/:sport
 * Get VR scenarios for a specific sport
 */
router.get('/scenarios/:sport', async (req: Request, res: Response) => {
  try {
    const { sport } = req.params;
    const scenarios = await vrTrainingService.getScenariosBySport(sport);
    res.json({ success: true, scenarios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/vr/scenarios/adhd/:sport
 * Get ADHD-optimized VR scenarios
 */
router.get('/scenarios/adhd/:sport', async (req: Request, res: Response) => {
  try {
    const { sport } = req.params;
    const athleteId = req.user?.id || 'demo-user';
    const scenarios = await vrTrainingService.getADHDOptimizedScenarios(athleteId, sport);
    res.json({ success: true, scenarios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/vr/sessions/start
 * Start a new VR training session
 */
router.post('/sessions/start', async (req: Request, res: Response) => {
  try {
    const { athleteId, scenarioId } = req.body;
    const session = await vrTrainingService.startVRSession(athleteId, scenarioId);
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/vr/sessions/:sessionId/performance
 * Update VR session performance
 */
router.put('/sessions/:sessionId/performance', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const performance = req.body;
    await vrTrainingService.updateSessionPerformance(sessionId, performance);
    res.json({ success: true, message: 'Performance updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/vr/sessions/:sessionId/complete
 * Complete VR training session
 */
router.post('/sessions/:sessionId/complete', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await vrTrainingService.completeVRSession(sessionId);
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/vr/analytics/:athleteId
 * Get VR training analytics
 */
router.get('/analytics/:athleteId', async (req: Request, res: Response) => {
  try {
    const { athleteId } = req.params;
    const analytics = await vrTrainingService.getVRAnalytics(athleteId);
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/vr/history/:athleteId
 * Get VR session history
 */
router.get('/history/:athleteId', async (req: Request, res: Response) => {
  try {
    const { athleteId } = req.params;
    const history = await vrTrainingService.getSessionHistory(athleteId);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;