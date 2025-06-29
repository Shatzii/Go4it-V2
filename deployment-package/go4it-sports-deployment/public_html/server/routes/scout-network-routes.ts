/**
 * Go4It Sports - Professional Scout Network Routes
 * API endpoints for scout connections and recruitment
 */

import { Router, Request, Response } from 'express';
import { professionalScoutNetworkService } from '../services/professional-scout-network';

const router = Router();

/**
 * POST /api/scouts/find-matches
 * Find matching scouts for athlete profile
 */
router.post('/find-matches', async (req: Request, res: Response) => {
  try {
    const athleteProfile = req.body;
    const matches = await professionalScoutNetworkService.findMatchingScouts(athleteProfile);
    res.json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scouts/connect
 * Initiate connection with scout
 */
router.post('/connect', async (req: Request, res: Response) => {
  try {
    const { athleteId, scoutId, message } = req.body;
    const connection = await professionalScoutNetworkService.initiateScoutConnection(athleteId, scoutId, message);
    res.json({ success: true, connection });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scouts/highlights/generate
 * Generate automatic highlight reel
 */
router.post('/highlights/generate', async (req: Request, res: Response) => {
  try {
    const { athleteId, videoIds, targetScouts } = req.body;
    const highlight = await professionalScoutNetworkService.generateAutoHighlight(athleteId, videoIds, targetScouts);
    res.json({ success: true, highlight });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/scouts/connections/:connectionId/interest
 * Update scout interest level
 */
router.put('/connections/:connectionId/interest', async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.params;
    const interestData = req.body;
    await professionalScoutNetworkService.updateScoutInterest(connectionId, interestData);
    res.json({ success: true, message: 'Interest updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scouts/connections/:connectionId/communicate
 * Send communication between athlete and scout
 */
router.post('/connections/:connectionId/communicate', async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.params;
    const communication = req.body;
    await professionalScoutNetworkService.sendCommunication(connectionId, communication);
    res.json({ success: true, message: 'Communication sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scouts/reports/generate
 * Generate scouting report
 */
router.post('/reports/generate', async (req: Request, res: Response) => {
  try {
    const { athleteId, scoutId, athleteData } = req.body;
    const report = await professionalScoutNetworkService.generateScoutingReport(athleteId, scoutId, athleteData);
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/scouts/analytics/:athleteId
 * Get scout network analytics
 */
router.get('/analytics/:athleteId', async (req: Request, res: Response) => {
  try {
    const { athleteId } = req.params;
    const analytics = await professionalScoutNetworkService.getScoutNetworkAnalytics(athleteId);
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;