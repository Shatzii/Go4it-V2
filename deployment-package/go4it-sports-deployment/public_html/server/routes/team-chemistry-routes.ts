/**
 * Go4It Sports - Team Chemistry Routes
 * API endpoints for team chemistry analytics
 */

import { Router, Request, Response } from 'express';
import { teamChemistryAnalyticsService } from '../services/team-chemistry-analytics';

const router = Router();

/**
 * POST /api/team-chemistry/analyze-communication
 * Analyze team communication patterns
 */
router.post('/analyze-communication', async (req: Request, res: Response) => {
  try {
    const { teamId, sessionData } = req.body;
    const analysis = await teamChemistryAnalyticsService.analyzeCommunicationPatterns(teamId, sessionData);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/team-chemistry/track-leadership
 * Track leadership emergence
 */
router.post('/track-leadership', async (req: Request, res: Response) => {
  try {
    const { teamId, leadershipMoments } = req.body;
    const leadership = await teamChemistryAnalyticsService.trackLeadershipEmergence(teamId, leadershipMoments);
    res.json({ success: true, leadership });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/team-chemistry/optimize-formation
 * Generate optimal team formation
 */
router.post('/optimize-formation', async (req: Request, res: Response) => {
  try {
    const { teamId, sport } = req.body;
    const formation = await teamChemistryAnalyticsService.generateOptimalFormation(teamId, sport);
    res.json({ success: true, formation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/team-chemistry/analysis/:teamId
 * Generate comprehensive chemistry analysis
 */
router.get('/analysis/:teamId', async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const analysis = await teamChemistryAnalyticsService.generateChemistryAnalysis(teamId);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/team-chemistry/analytics/:teamId
 * Get team analytics
 */
router.get('/analytics/:teamId', async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const analytics = await teamChemistryAnalyticsService.getTeamAnalytics(teamId);
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;