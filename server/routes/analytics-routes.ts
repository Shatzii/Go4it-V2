import { Router } from 'express';
import { db } from '../db';
import analyticsService from '../services/analytics-service';
import { z } from 'zod';

const router = Router();

/**
 * Record user session start
 * POST /api/analytics/session-start
 */
router.post('/session-start', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      deviceInfo: z.record(z.any()),
      entryPoint: z.string()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { userId, deviceInfo, entryPoint } = result.data;
    const response = await analyticsService.trackSessionStart(userId, deviceInfo, entryPoint);
    res.json(response);
  } catch (error) {
    console.error('Error recording session start:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record user feature navigation
 * POST /api/analytics/feature-navigation
 */
router.post('/feature-navigation', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      feature: z.string()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { userId, feature } = result.data;
    const response = await analyticsService.trackFeatureNavigation(userId, feature);
    res.json(response);
  } catch (error) {
    console.error('Error recording feature navigation:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record user action
 * POST /api/analytics/user-action
 */
router.post('/user-action', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      action: z.string(),
      details: z.record(z.any()).optional()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { userId, action, details = {} } = result.data;
    const response = await analyticsService.trackUserAction(userId, action, details);
    res.json(response);
  } catch (error) {
    console.error('Error recording user action:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record session end
 * POST /api/analytics/session-end
 */
router.post('/session-end', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      exitPoint: z.string(),
      convertedGoal: z.string().optional()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { userId, exitPoint, convertedGoal } = result.data;
    const response = await analyticsService.trackSessionEnd(userId, exitPoint, convertedGoal);
    res.json(response);
  } catch (error) {
    console.error('Error recording session end:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record star path progress
 * POST /api/analytics/star-path
 */
router.post('/star-path', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      currentStarLevel: z.number(),
      previousStarLevel: z.number().nullable().optional(),
      daysAtCurrentLevel: z.number(),
      totalDaysInSystem: z.number(),
      progressPercentage: z.number(),
      progressSnapshotData: z.record(z.any()),
      bottleneckIdentified: z.string().optional(),
      achievedMilestones: z.array(z.string()).optional()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { 
      userId, 
      currentStarLevel, 
      previousStarLevel = null, 
      daysAtCurrentLevel,
      totalDaysInSystem,
      progressPercentage,
      progressSnapshotData,
      bottleneckIdentified,
      achievedMilestones
    } = result.data;
    
    const response = await analyticsService.trackStarPathProgress(
      userId, 
      currentStarLevel, 
      previousStarLevel, 
      daysAtCurrentLevel,
      totalDaysInSystem,
      progressPercentage,
      progressSnapshotData,
      bottleneckIdentified,
      achievedMilestones
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error recording star path progress:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record workout completion
 * POST /api/analytics/workout
 */
router.post('/workout', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      workoutVerificationId: z.number().nullable().optional(),
      workoutType: z.string(),
      completionSuccess: z.boolean(),
      formQualityScore: z.number().optional(),
      consistencyStreak: z.number().optional(),
      workoutDuration: z.number().optional(),
      preferredTimeOfDay: z.string().optional(),
      preferredEnvironment: z.string().optional(),
      equipmentUsed: z.array(z.string()).optional()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { 
      userId, 
      workoutVerificationId = null, 
      workoutType, 
      completionSuccess,
      formQualityScore,
      consistencyStreak = 1,
      workoutDuration,
      preferredTimeOfDay,
      preferredEnvironment,
      equipmentUsed
    } = result.data;
    
    const response = await analyticsService.trackWorkoutCompletion(
      userId, 
      workoutVerificationId, 
      workoutType, 
      completionSuccess,
      formQualityScore,
      consistencyStreak,
      workoutDuration,
      preferredTimeOfDay,
      preferredEnvironment,
      equipmentUsed
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error recording workout completion:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record skill development
 * POST /api/analytics/skill
 */
router.post('/skill', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      sportType: z.string(),
      skillCategory: z.string(),
      skillName: z.string(),
      currentLevel: z.number(),
      practiceFrequency: z.number().optional(),
      timeInvested: z.number().optional(),
      plateauIdentified: z.boolean().optional(),
      plateauDuration: z.number().optional(),
      breakthroughFactors: z.array(z.string()).optional()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { 
      userId, 
      sportType, 
      skillCategory, 
      skillName,
      currentLevel,
      practiceFrequency,
      timeInvested,
      plateauIdentified = false,
      plateauDuration,
      breakthroughFactors
    } = result.data;
    
    const response = await analyticsService.trackSkillDevelopment(
      userId, 
      sportType, 
      skillCategory, 
      skillName,
      currentLevel,
      practiceFrequency,
      timeInvested,
      plateauIdentified,
      plateauDuration,
      breakthroughFactors
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error recording skill development:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record academic-athletic integration
 * POST /api/analytics/academic
 */
router.post('/academic', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      currentGPA: z.number(),
      strongestSubjects: z.array(z.string()),
      weakestSubjects: z.array(z.string()),
      studyHoursPerWeek: z.number(),
      athleticImprovementRate: z.number()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { 
      userId, 
      currentGPA, 
      strongestSubjects, 
      weakestSubjects,
      studyHoursPerWeek,
      athleticImprovementRate
    } = result.data;
    
    const response = await analyticsService.trackAcademicAthletic(
      userId, 
      currentGPA, 
      strongestSubjects, 
      weakestSubjects,
      studyHoursPerWeek,
      athleticImprovementRate
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error recording academic-athletic integration:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record AI coach effectiveness
 * POST /api/analytics/ai-coach
 */
router.post('/ai-coach', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      coachId: z.number().nullable().optional(),
      userSatisfactionRating: z.number(),
      recommendationAdherenceRate: z.number(),
      aiInteractionFrequency: z.number(),
      averageInteractionDuration: z.number(),
      mostUsedFeatures: z.array(z.string()),
      commonQueries: z.array(z.string()).optional(),
      feedbackProvided: z.string().optional(),
      improvementWithAI: z.number().optional()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { 
      userId, 
      coachId = null, 
      userSatisfactionRating, 
      recommendationAdherenceRate,
      aiInteractionFrequency,
      averageInteractionDuration,
      mostUsedFeatures,
      commonQueries = [],
      feedbackProvided = '',
      improvementWithAI
    } = result.data;
    
    const response = await analyticsService.trackAICoachEffectiveness(
      userId, 
      coachId, 
      userSatisfactionRating, 
      recommendationAdherenceRate,
      aiInteractionFrequency,
      averageInteractionDuration,
      mostUsedFeatures,
      commonQueries,
      feedbackProvided,
      improvementWithAI
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error recording AI coach effectiveness:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record cross-sport potential
 * POST /api/analytics/cross-sport
 */
router.post('/cross-sport', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      primarySport: z.string(),
      secondarySports: z.array(z.string()),
      crossTrainingFrequency: z.number(),
      skillTransferabilityScore: z.record(z.number()).optional()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { 
      userId, 
      primarySport, 
      secondarySports, 
      crossTrainingFrequency,
      skillTransferabilityScore
    } = result.data;
    
    const response = await analyticsService.trackCrossSportPotential(
      userId, 
      primarySport, 
      secondarySports, 
      crossTrainingFrequency,
      skillTransferabilityScore
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error recording cross-sport potential:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record recruiting readiness
 * POST /api/analytics/recruiting
 */
router.post('/recruiting', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      overallGARScore: z.number(),
      highlightGenerationCount: z.number(),
      highlightViewCount: z.number(),
      highlightShareCount: z.number(),
      scoutViewCount: z.number(),
      recruitingProfileCompleteness: z.number(),
      collegeMatchPercentages: z.record(z.number()).optional()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { 
      userId, 
      overallGARScore, 
      highlightGenerationCount, 
      highlightViewCount,
      highlightShareCount,
      scoutViewCount,
      recruitingProfileCompleteness,
      collegeMatchPercentages
    } = result.data;
    
    const response = await analyticsService.trackRecruitingReadiness(
      userId, 
      overallGARScore, 
      highlightGenerationCount, 
      highlightViewCount,
      highlightShareCount,
      scoutViewCount,
      recruitingProfileCompleteness,
      collegeMatchPercentages
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error recording recruiting readiness:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record neurodivergent patterns
 * POST /api/analytics/neurodivergent
 */
router.post('/neurodivergent', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      adhdFriendlyFeatureUsage: z.record(z.number()),
      distractionFrequency: z.number(),
      recoveryTime: z.number(),
      optimalSessionDuration: z.number(),
      visualVsTextualPreference: z.number()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { 
      userId, 
      adhdFriendlyFeatureUsage, 
      distractionFrequency, 
      recoveryTime,
      optimalSessionDuration,
      visualVsTextualPreference
    } = result.data;
    
    const response = await analyticsService.trackNeurodivergentPatterns(
      userId, 
      adhdFriendlyFeatureUsage, 
      distractionFrequency, 
      recoveryTime,
      optimalSessionDuration,
      visualVsTextualPreference
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error recording neurodivergent patterns:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Record community impact
 * POST /api/analytics/community
 */
router.post('/community', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      peerInteractionCount: z.number(),
      coachAthleteMessageCount: z.number(),
      responseTimeAverage: z.number(),
      parentInvolvementScore: z.number(),
      collaborativeWorkoutsPercentage: z.number(),
      socialSupportNetworkSize: z.number()
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.issues });
    }

    const { 
      userId, 
      peerInteractionCount, 
      coachAthleteMessageCount, 
      responseTimeAverage,
      parentInvolvementScore,
      collaborativeWorkoutsPercentage,
      socialSupportNetworkSize
    } = result.data;
    
    const response = await analyticsService.trackCommunityImpact(
      userId, 
      peerInteractionCount, 
      coachAthleteMessageCount, 
      responseTimeAverage,
      parentInvolvementScore,
      collaborativeWorkoutsPercentage,
      socialSupportNetworkSize
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error recording community impact:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Get analytics overview for a user
 * GET /api/analytics/overview/:userId
 */
router.get('/overview/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const response = await analyticsService.getUserAnalyticsOverview(userId);
    res.json(response);
  } catch (error) {
    console.error('Error getting analytics overview:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Get analytics dashboard data
 * GET /api/analytics/dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    let dateRange: { start: Date, end: Date } | undefined;
    
    if (req.query.startDate && req.query.endDate) {
      dateRange = {
        start: new Date(req.query.startDate as string),
        end: new Date(req.query.endDate as string)
      };
    }

    const response = await analyticsService.getAnalyticsDashboardData(userId, dateRange);
    res.json(response);
  } catch (error) {
    console.error('Error getting analytics dashboard data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;