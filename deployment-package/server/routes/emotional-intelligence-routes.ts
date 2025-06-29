/**
 * Emotional Intelligence Coaching API Routes
 * 
 * ADHD-specialized emotional analysis and coaching adaptation endpoints.
 */

import { Router } from 'express';
import multer from 'multer';
import { emotionalIntelligenceService } from '../services/emotional-intelligence';

const router = Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
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
 * Analyze emotional state from image data
 */
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const { athleteId, contextInfo } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    if (!athleteId) {
      return res.status(400).json({ error: 'athleteId is required' });
    }

    const parsedContextInfo = contextInfo ? JSON.parse(contextInfo) : {
      activityType: 'training',
      sessionDuration: 0,
      previousPerformance: 'stable'
    };

    const emotionalState = await emotionalIntelligenceService.analyzeEmotionalState(
      req.file.buffer,
      athleteId,
      parsedContextInfo
    );

    res.json(emotionalState);
  } catch (error) {
    console.error('Emotional analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze emotional state' });
  }
});

/**
 * Generate personalized coaching adaptation
 */
router.post('/coaching-adaptation', async (req, res) => {
  try {
    const { athleteId, currentState, athleteProfile } = req.body;

    if (!athleteId || !currentState || !athleteProfile) {
      return res.status(400).json({ 
        error: 'athleteId, currentState, and athleteProfile are required' 
      });
    }

    const adaptation = await emotionalIntelligenceService.generateCoachingAdaptation(
      athleteId,
      currentState,
      athleteProfile
    );

    res.json(adaptation);
  } catch (error) {
    console.error('Coaching adaptation error:', error);
    res.status(500).json({ error: 'Failed to generate coaching adaptation' });
  }
});

/**
 * Detect frustration patterns and suggest interventions
 */
router.post('/frustration-detection', async (req, res) => {
  try {
    const { athleteId, recentStates } = req.body;

    if (!athleteId || !recentStates || !Array.isArray(recentStates)) {
      return res.status(400).json({ 
        error: 'athleteId and recentStates array are required' 
      });
    }

    const frustrationPattern = await emotionalIntelligenceService.detectFrustrationPattern(
      athleteId,
      recentStates
    );

    res.json(frustrationPattern);
  } catch (error) {
    console.error('Frustration detection error:', error);
    res.status(500).json({ error: 'Failed to detect frustration pattern' });
  }
});

/**
 * Optimize attention span for ADHD athletes
 */
router.post('/attention-optimization', async (req, res) => {
  try {
    const { athleteId, currentSession } = req.body;

    if (!athleteId || !currentSession) {
      return res.status(400).json({ 
        error: 'athleteId and currentSession are required' 
      });
    }

    const optimization = await emotionalIntelligenceService.optimizeAttentionSpan(
      athleteId,
      currentSession
    );

    res.json(optimization);
  } catch (error) {
    console.error('Attention optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize attention span' });
  }
});

/**
 * Get emotional state history for an athlete
 */
router.get('/history/:athleteId', async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { limit = 50, days = 7 } = req.query;

    // Get emotional history (this would come from a database in production)
    const allHistory = []; // emotionalIntelligenceService.getEmotionalHistory(athleteId);
    
    // Filter by date range
    const cutoffTime = Date.now() - (parseInt(days as string) * 24 * 60 * 60 * 1000);
    const recentHistory = allHistory.filter(state => state.timestamp >= cutoffTime);
    
    // Limit results
    const limitedHistory = recentHistory.slice(-parseInt(limit as string));

    res.json(limitedHistory);
  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve emotional history' });
  }
});

/**
 * Get emotional insights and trends
 */
router.get('/insights/:athleteId', async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { days = 7 } = req.query;

    // This would typically come from stored emotional state history
    const mockHistory = [
      {
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        emotions: { confidence: 75, frustration: 25, focus: 70, motivation: 80, anxiety: 20, excitement: 65 },
        adhdIndicators: { hyperactivityLevel: 40, impulsivityMarkers: 30, attentionSpan: 240, fidgetingLevel: 25 }
      },
      {
        timestamp: Date.now() - 12 * 60 * 60 * 1000,
        emotions: { confidence: 80, frustration: 20, focus: 75, motivation: 85, anxiety: 15, excitement: 70 },
        adhdIndicators: { hyperactivityLevel: 35, impulsivityMarkers: 25, attentionSpan: 300, fidgetingLevel: 20 }
      },
      {
        timestamp: Date.now(),
        emotions: { confidence: 85, frustration: 15, focus: 80, motivation: 90, anxiety: 10, excitement: 75 },
        adhdIndicators: { hyperactivityLevel: 30, impulsivityMarkers: 20, attentionSpan: 360, fidgetingLevel: 15 }
      }
    ];

    if (mockHistory.length === 0) {
      return res.json({
        message: 'No emotional data available for insights',
        insights: null
      });
    }

    // Calculate insights
    const insights = {
      emotionalTrends: {
        confidence: {
          current: mockHistory[mockHistory.length - 1].emotions.confidence,
          average: Math.round(mockHistory.reduce((sum, state) => sum + state.emotions.confidence, 0) / mockHistory.length),
          trend: mockHistory.length > 1 ? 
            mockHistory[mockHistory.length - 1].emotions.confidence - mockHistory[0].emotions.confidence : 0
        },
        frustration: {
          current: mockHistory[mockHistory.length - 1].emotions.frustration,
          average: Math.round(mockHistory.reduce((sum, state) => sum + state.emotions.frustration, 0) / mockHistory.length),
          trend: mockHistory.length > 1 ? 
            mockHistory[mockHistory.length - 1].emotions.frustration - mockHistory[0].emotions.frustration : 0
        },
        focus: {
          current: mockHistory[mockHistory.length - 1].emotions.focus,
          average: Math.round(mockHistory.reduce((sum, state) => sum + state.emotions.focus, 0) / mockHistory.length),
          trend: mockHistory.length > 1 ? 
            mockHistory[mockHistory.length - 1].emotions.focus - mockHistory[0].emotions.focus : 0
        },
        motivation: {
          current: mockHistory[mockHistory.length - 1].emotions.motivation,
          average: Math.round(mockHistory.reduce((sum, state) => sum + state.emotions.motivation, 0) / mockHistory.length),
          trend: mockHistory.length > 1 ? 
            mockHistory[mockHistory.length - 1].emotions.motivation - mockHistory[0].emotions.motivation : 0
        }
      },
      adhdMetrics: {
        attentionSpan: {
          current: mockHistory[mockHistory.length - 1].adhdIndicators.attentionSpan,
          average: Math.round(mockHistory.reduce((sum, state) => sum + state.adhdIndicators.attentionSpan, 0) / mockHistory.length),
          trend: mockHistory.length > 1 ? 
            mockHistory[mockHistory.length - 1].adhdIndicators.attentionSpan - mockHistory[0].adhdIndicators.attentionSpan : 0
        },
        hyperactivity: {
          current: mockHistory[mockHistory.length - 1].adhdIndicators.hyperactivityLevel,
          average: Math.round(mockHistory.reduce((sum, state) => sum + state.adhdIndicators.hyperactivityLevel, 0) / mockHistory.length),
          trend: mockHistory.length > 1 ? 
            mockHistory[mockHistory.length - 1].adhdIndicators.hyperactivityLevel - mockHistory[0].adhdIndicators.hyperactivityLevel : 0
        }
      },
      recommendations: [],
      sessionsAnalyzed: mockHistory.length,
      overallWellbeing: 'good' // good, fair, needs_attention
    };

    // Generate recommendations based on trends
    if (insights.emotionalTrends.frustration.average > 50) {
      insights.recommendations.push('Consider shorter training sessions with more breaks');
    }
    if (insights.adhdMetrics.attentionSpan.average < 180) {
      insights.recommendations.push('Focus on attention-building exercises and mindfulness practices');
    }
    if (insights.emotionalTrends.confidence.trend < -10) {
      insights.recommendations.push('Increase positive reinforcement and celebrate small wins');
    }
    if (insights.adhdMetrics.hyperactivity.average > 70) {
      insights.recommendations.push('Include more high-energy activities to channel excess energy');
    }

    // Determine overall wellbeing
    const avgPositiveEmotions = (insights.emotionalTrends.confidence.average + insights.emotionalTrends.motivation.average) / 2;
    const avgNegativeEmotions = insights.emotionalTrends.frustration.average;
    
    if (avgPositiveEmotions > 75 && avgNegativeEmotions < 30) {
      insights.overallWellbeing = 'excellent';
    } else if (avgPositiveEmotions > 60 && avgNegativeEmotions < 50) {
      insights.overallWellbeing = 'good';
    } else if (avgPositiveEmotions > 45 && avgNegativeEmotions < 65) {
      insights.overallWellbeing = 'fair';
    } else {
      insights.overallWellbeing = 'needs_attention';
    }

    res.json(insights);
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to generate emotional insights' });
  }
});

/**
 * Real-time emotional coaching suggestions
 */
router.post('/real-time-coaching', async (req, res) => {
  try {
    const { currentState, athleteProfile, sessionContext } = req.body;

    if (!currentState) {
      return res.status(400).json({ error: 'currentState is required' });
    }

    // Generate real-time coaching suggestions based on emotional state
    const suggestions = {
      immediate: [],
      session: [],
      longTerm: []
    };

    // Immediate suggestions based on current emotional state
    if (currentState.emotions.frustration > 60) {
      suggestions.immediate.push({
        type: 'break',
        message: 'Take a 2-minute breathing break to reset focus',
        priority: 'high'
      });
    }

    if (currentState.emotions.anxiety > 50) {
      suggestions.immediate.push({
        type: 'reassurance',
        message: 'Remind athlete of recent progress and strengths',
        priority: 'medium'
      });
    }

    if (currentState.adhdIndicators.fidgetingLevel > 70) {
      suggestions.immediate.push({
        type: 'movement',
        message: 'Allow brief movement break or fidget tool use',
        priority: 'medium'
      });
    }

    // Session-level suggestions
    if (currentState.adhdIndicators.attentionSpan < 120) {
      suggestions.session.push({
        type: 'structure',
        message: 'Break remaining activities into 3-5 minute segments',
        priority: 'high'
      });
    }

    if (currentState.emotions.motivation < 50) {
      suggestions.session.push({
        type: 'engagement',
        message: 'Switch to a more engaging or preferred activity',
        priority: 'medium'
      });
    }

    // Long-term suggestions
    if (currentState.emotions.confidence < 60) {
      suggestions.longTerm.push({
        type: 'confidence_building',
        message: 'Focus on mastery-based goals rather than performance comparisons',
        priority: 'medium'
      });
    }

    res.json({
      suggestions,
      adhdSpecificTips: [
        'Use visual and auditory cues together for instructions',
        'Provide immediate feedback on performance',
        'Allow athlete to use preferred coping strategies',
        'Maintain consistent routines and expectations'
      ],
      currentStateAssessment: {
        needsBreak: currentState.emotions.frustration > 60 || currentState.adhdIndicators.attentionSpan < 120,
        needsEncouragement: currentState.emotions.confidence < 60,
        needsMovement: currentState.adhdIndicators.fidgetingLevel > 70,
        readyForChallenge: currentState.emotions.confidence > 75 && currentState.emotions.focus > 70
      }
    });
  } catch (error) {
    console.error('Real-time coaching error:', error);
    res.status(500).json({ error: 'Failed to generate coaching suggestions' });
  }
});

/**
 * ADHD accommodation recommendations
 */
router.post('/adhd-accommodations', async (req, res) => {
  try {
    const { athleteProfile, emotionalHistory, performanceData } = req.body;

    if (!athleteProfile) {
      return res.status(400).json({ error: 'athleteProfile is required' });
    }

    const accommodations = {
      environmental: [],
      instructional: [],
      assessment: [],
      behavioral: []
    };

    // Environmental accommodations
    accommodations.environmental.push(
      'Minimize visual and auditory distractions in training area',
      'Provide consistent, organized space for equipment',
      'Use visual cues and markers for positioning'
    );

    // Instructional accommodations
    accommodations.instructional.push(
      'Break complex skills into smaller, sequential steps',
      'Use multi-sensory instruction (visual, auditory, kinesthetic)',
      'Provide written or visual reminders of key technique points',
      'Allow processing time between instructions'
    );

    // Assessment accommodations
    accommodations.assessment.push(
      'Focus on effort and improvement rather than absolute performance',
      'Use frequent, brief check-ins rather than long evaluations',
      'Provide immediate feedback during skill practice'
    );

    // Behavioral accommodations
    accommodations.behavioral.push(
      'Allow movement breaks every 10-15 minutes',
      'Provide fidget tools or stress balls during instruction',
      'Use positive reinforcement frequently',
      'Establish clear routines and expectations'
    );

    // Customize based on ADHD type
    if (athleteProfile.adhdType === 'hyperactive') {
      accommodations.behavioral.push(
        'Channel excess energy through high-intensity warm-ups',
        'Use standing or movement-based activities when possible'
      );
    } else if (athleteProfile.adhdType === 'inattentive') {
      accommodations.instructional.push(
        'Use attention-grabbing cues and signals',
        'Provide written instructions as backup to verbal'
      );
    }

    res.json({
      accommodations,
      implementationTips: [
        'Start with 2-3 accommodations and gradually add more',
        'Involve the athlete in choosing which accommodations work best',
        'Be flexible and adjust based on daily needs and energy levels',
        'Communicate accommodations clearly with all coaching staff'
      ],
      monitoringGuidelines: [
        'Track effectiveness of each accommodation weekly',
        'Note which combinations work best for different activities',
        'Adjust accommodations based on athlete feedback and performance'
      ]
    });
  } catch (error) {
    console.error('Accommodations error:', error);
    res.status(500).json({ error: 'Failed to generate ADHD accommodations' });
  }
});

export default router;