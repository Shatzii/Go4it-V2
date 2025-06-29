/**
 * GAR (Growth and Ability Rating) Analysis Routes
 * 
 * Handles API endpoints for the GAR analysis system, which provides:
 * - Sport recommendations for youth athletes (ages 4-12)
 * - Professional route recommendations for teens/young adults (ages 13-22)
 * - Historical GAR score tracking
 * - Advanced biomechanical and neurodivergent analytics
 */

import express, { Request, Response } from 'express';
import { storage } from '../storage';
import { isAdminMiddleware as isAdmin, isAuthenticatedMiddleware as isAuthenticated, isCoachMiddleware as isCoach } from '../middleware/auth-middleware';
import { User } from '../../shared/schema';
import { GARAnalysisService } from '../services/gar-analysis-service';
import { PositionAnalyticsService } from '../services/position-analytics-service';

const router = express.Router();
const garAnalysisService = new GARAnalysisService(storage);
const positionAnalyticsService = new PositionAnalyticsService(storage);

/**
 * Generate GAR analysis for an athlete
 * POST /api/gar-analysis
 */
router.post('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { athleteId, generateDetailedReport = false } = req.body;
    const user = req.user as User;
    
    // Check permissions (can only analyze self or as coach/admin)
    const canAccess = user.id === athleteId || 
                      user.role === 'admin' || 
                      user.role === 'coach';
    
    if (!canAccess) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to access GAR analysis for this athlete' 
      });
    }
    
    // Generate GAR analysis
    const analysis = await garAnalysisService.generateGARAnalysis(
      athleteId,
      generateDetailedReport
    );
    
    return res.json(analysis);
  } catch (error) {
    console.error('Error generating GAR analysis:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error generating GAR analysis' 
    });
  }
});

/**
 * Get historical GAR scores for athlete
 * GET /api/gar-analysis/history/:athleteId
 */
router.get('/history/:athleteId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const athleteId = parseInt(req.params.athleteId);
    const user = req.user as User;
    
    // Check permissions (can only view self or as coach/admin)
    const canAccess = user.id === athleteId || 
                      user.role === 'admin' || 
                      user.role === 'coach';
    
    if (!canAccess) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to access GAR history for this athlete' 
      });
    }
    
    // Get historical scores
    const history = await garAnalysisService.getHistoricalGARScores(athleteId);
    
    return res.json(history);
  } catch (error) {
    console.error('Error retrieving GAR history:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving GAR history' 
    });
  }
});

/**
 * Get ideal biomechanics for a position (advanced cross-generational analysis)
 * GET /api/gar-analysis/biomechanics/:sport/:position
 */
router.get('/biomechanics/:sport/:position', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { sport, position } = req.params;
    
    // Get advanced biomechanics analysis
    const analysis = await positionAnalyticsService.getIdealBiomechanics(sport, position);
    
    return res.json(analysis);
  } catch (error) {
    console.error('Error analyzing ideal biomechanics:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error analyzing ideal biomechanics' 
    });
  }
});

/**
 * Analyze neurodivergent correlations for a position
 * GET /api/gar-analysis/neurodivergent/:sport/:position
 */
router.get('/neurodivergent/:sport/:position', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { sport, position } = req.params;
    
    // Get neurodivergent correlations
    const analysis = await positionAnalyticsService.analyzeNeurodivergentCorrelations(sport, position);
    
    return res.json(analysis);
  } catch (error) {
    console.error('Error analyzing neurodivergent correlations:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error analyzing neurodivergent correlations' 
    });
  }
});

/**
 * Get position recommendations based on athlete's attributes
 * GET /api/gar-analysis/recommendations/:athleteId
 */
router.get('/recommendations/:athleteId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const athleteId = parseInt(req.params.athleteId);
    const user = req.user as User;
    
    // Check permissions (can only access self or as coach/admin)
    const canAccess = user.id === athleteId || 
                      user.role === 'admin' || 
                      user.role === 'coach';
    
    if (!canAccess) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to access position recommendations for this athlete' 
      });
    }
    
    // Get recommendations
    const recommendations = await positionAnalyticsService.getPositionRecommendations(athleteId);
    
    return res.json(recommendations);
  } catch (error) {
    console.error('Error generating position recommendations:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error generating position recommendations' 
    });
  }
});

export default router;