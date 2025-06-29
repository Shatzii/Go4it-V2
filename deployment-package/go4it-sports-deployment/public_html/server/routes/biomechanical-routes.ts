/**
 * Biomechanical Analysis API Routes
 * 
 * Real-time biomechanical analysis endpoints for the Go4It Sports platform.
 */

import { Router } from 'express';
import multer from 'multer';
import { biomechanicalService } from '../services/biomechanical-analysis';

const router = Router();

// Configure multer for video frame uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * Analyze a single video frame for biomechanical data
 */
router.post('/analyze-frame', upload.single('frame'), async (req, res) => {
  try {
    const { athleteId, sport } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No frame data provided' });
    }

    if (!athleteId || !sport) {
      return res.status(400).json({ error: 'athleteId and sport are required' });
    }

    const biomechanicalData = await biomechanicalService.analyzeFrame(
      req.file.buffer,
      athleteId,
      sport
    );

    res.json(biomechanicalData);
  } catch (error) {
    console.error('Frame analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze frame' });
  }
});

/**
 * Generate real-time coaching feedback
 */
router.post('/real-time-feedback', async (req, res) => {
  try {
    const { currentData, sport } = req.body;

    if (!currentData || !sport) {
      return res.status(400).json({ error: 'currentData and sport are required' });
    }

    const feedback = await biomechanicalService.generateRealTimeFeedback(
      currentData,
      sport
    );

    res.json(feedback);
  } catch (error) {
    console.error('Real-time feedback error:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

/**
 * Generate comprehensive movement analysis
 */
router.post('/movement-analysis', async (req, res) => {
  try {
    const { athleteId, sport, recentData } = req.body;

    if (!athleteId || !sport) {
      return res.status(400).json({ error: 'athleteId and sport are required' });
    }

    const analysis = await biomechanicalService.generateMovementAnalysis(
      athleteId,
      sport,
      recentData || []
    );

    res.json(analysis);
  } catch (error) {
    console.error('Movement analysis error:', error);
    res.status(500).json({ error: 'Failed to generate movement analysis' });
  }
});

/**
 * Get analysis history for an athlete
 */
router.get('/history/:athleteId', async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { limit = 50 } = req.query;

    const history = biomechanicalService.getAnalysisHistory(athleteId);
    const limitedHistory = history.slice(-parseInt(limit as string));

    res.json(limitedHistory);
  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis history' });
  }
});

/**
 * Upload and analyze video file
 */
router.post('/analyze-video', upload.single('video'), async (req, res) => {
  try {
    const { athleteId, sport } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    if (!athleteId || !sport) {
      return res.status(400).json({ error: 'athleteId and sport are required' });
    }

    // For video analysis, we would typically extract frames and analyze each one
    // This is a simplified implementation that analyzes the video as a single frame
    const biomechanicalData = await biomechanicalService.analyzeFrame(
      req.file.buffer,
      athleteId,
      sport
    );

    const analysis = await biomechanicalService.generateMovementAnalysis(
      athleteId,
      sport,
      [biomechanicalData]
    );

    res.json({
      biomechanicalData,
      analysis
    });
  } catch (error) {
    console.error('Video analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze video' });
  }
});

/**
 * Cleanup old analysis data
 */
router.post('/cleanup', async (req, res) => {
  try {
    biomechanicalService.cleanupAnalysisHistory();
    res.json({ message: 'Analysis history cleaned up successfully' });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Failed to cleanup analysis history' });
  }
});

/**
 * Get biomechanical insights for dashboard
 */
router.get('/insights/:athleteId', async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { sport = 'flag-football', days = 7 } = req.query;

    const history = biomechanicalService.getAnalysisHistory(athleteId);
    const recentHistory = history.filter(data => {
      const daysDiff = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
      return daysDiff <= parseInt(days as string);
    });

    if (recentHistory.length === 0) {
      return res.json({
        message: 'No recent analysis data available',
        insights: []
      });
    }

    // Calculate insights
    const insights = {
      averageFormEfficiency: {
        symmetry: Math.round(recentHistory.reduce((sum, data) => sum + data.formEfficiency.symmetryScore, 0) / recentHistory.length),
        stability: Math.round(recentHistory.reduce((sum, data) => sum + data.formEfficiency.stabilityScore, 0) / recentHistory.length),
        powerTransfer: Math.round(recentHistory.reduce((sum, data) => sum + data.formEfficiency.powerTransferScore, 0) / recentHistory.length)
      },
      adhdTrends: {
        focusLevel: Math.round(recentHistory.reduce((sum, data) => sum + data.adhdMetrics.focusLevel, 0) / recentHistory.length),
        consistency: Math.round(recentHistory.reduce((sum, data) => sum + data.adhdMetrics.consistencyScore, 0) / recentHistory.length),
        fatigueLevel: Math.round(recentHistory.reduce((sum, data) => sum + data.adhdMetrics.fatigueIndicator, 0) / recentHistory.length)
      },
      improvementAreas: [],
      strengthAreas: [],
      sessionsAnalyzed: recentHistory.length,
      totalAnalysisTime: Math.round((recentHistory[recentHistory.length - 1]?.timestamp - recentHistory[0]?.timestamp) / (1000 * 60))
    };

    // Determine improvement and strength areas
    if (insights.averageFormEfficiency.symmetry < 70) {
      insights.improvementAreas.push('Work on movement symmetry between left and right sides');
    }
    if (insights.averageFormEfficiency.stability < 75) {
      insights.improvementAreas.push('Focus on core stability and balance');
    }
    if (insights.adhdTrends.focusLevel < 6) {
      insights.improvementAreas.push('Practice attention-focusing techniques');
    }

    if (insights.averageFormEfficiency.powerTransfer > 80) {
      insights.strengthAreas.push('Excellent power transfer mechanics');
    }
    if (insights.adhdTrends.consistency > 80) {
      insights.strengthAreas.push('Strong consistency in movement patterns');
    }

    res.json(insights);
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

export default router;