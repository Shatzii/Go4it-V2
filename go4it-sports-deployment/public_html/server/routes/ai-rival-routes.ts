/**
 * Go4It Sports - AI Rival Competition Routes
 * API endpoints for AI-powered rival competition system
 */

import { Router, Request, Response } from 'express';
import { aiRivalCompetitionService } from '../services/ai-rival-competition';

const router = Router();

/**
 * POST /api/rivals/find-optimal
 * Find optimal AI rival for athlete
 */
router.post('/find-optimal', async (req: Request, res: Response) => {
  try {
    const athleteProfile = req.body;
    const matches = await aiRivalCompetitionService.findOptimalRival(athleteProfile);
    res.json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/rivals/matches/create
 * Create rivalry match
 */
router.post('/matches/create', async (req: Request, res: Response) => {
  try {
    const { athleteId, rivalId, scenarioId } = req.body;
    const match = await aiRivalCompetitionService.createRivalryMatch(athleteId, rivalId, scenarioId);
    res.json({ success: true, match });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/rivals/matches/:matchId/simulate-rival
 * Simulate AI rival performance
 */
router.post('/matches/:matchId/simulate-rival', async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const athletePerformance = req.body;
    const rivalPerformance = await aiRivalCompetitionService.simulateRivalPerformance(matchId, athletePerformance);
    res.json({ success: true, rivalPerformance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/rivals/matches/:matchId/complete
 * Complete rivalry match
 */
router.post('/matches/:matchId/complete', async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const finalAthletePerformance = req.body;
    const match = await aiRivalCompetitionService.completeRivalryMatch(matchId, finalAthletePerformance);
    res.json({ success: true, match });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/rivals/analytics/:athleteId
 * Get rivalry analytics
 */
router.get('/analytics/:athleteId', async (req: Request, res: Response) => {
  try {
    const { athleteId } = req.params;
    const analytics = await aiRivalCompetitionService.getRivalryAnalytics(athleteId);
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;