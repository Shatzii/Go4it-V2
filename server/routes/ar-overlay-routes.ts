/**
 * Go4It Sports - AR Performance Overlay Routes
 * API endpoints for Augmented Reality performance overlays
 */

import { Router, Request, Response } from 'express';
import { arPerformanceOverlayService } from '../services/ar-performance-overlay';

const router = Router();

/**
 * GET /api/ar/overlays/:sport
 * Get AR overlays for a specific sport
 */
router.get('/overlays/:sport', async (req: Request, res: Response) => {
  try {
    const { sport } = req.params;
    const overlays = await arPerformanceOverlayService.getOverlaysBySport(sport);
    res.json({ success: true, overlays });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ar/overlays/adhd/:sport
 * Get ADHD-optimized AR overlays
 */
router.get('/overlays/adhd/:sport', async (req: Request, res: Response) => {
  try {
    const { sport } = req.params;
    const overlays = await arPerformanceOverlayService.getADHDOptimizedOverlays(sport);
    res.json({ success: true, overlays });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ar/sessions/start
 * Start AR overlay session
 */
router.post('/sessions/start', async (req: Request, res: Response) => {
  try {
    const { athleteId, sport, overlayIds } = req.body;
    const session = await arPerformanceOverlayService.startARSession(athleteId, sport, overlayIds);
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ar/sessions/:sessionId/trigger
 * Process AR trigger event
 */
router.post('/sessions/:sessionId/trigger', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { triggerType, data } = req.body;
    const response = await arPerformanceOverlayService.processTriggerEvent(sessionId, triggerType, data);
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ar/sessions/:sessionId/complete
 * Complete AR session
 */
router.post('/sessions/:sessionId/complete', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await arPerformanceOverlayService.completeARSession(sessionId);
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ar/analytics/:athleteId
 * Get AR analytics
 */
router.get('/analytics/:athleteId', async (req: Request, res: Response) => {
  try {
    const { athleteId } = req.params;
    const analytics = await arPerformanceOverlayService.getARAnalytics(athleteId);
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;