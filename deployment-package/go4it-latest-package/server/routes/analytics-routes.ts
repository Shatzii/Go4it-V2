/**
 * Analytics Routes
 * 
 * Handles all API endpoints for collecting and retrieving analytics data
 * for the Go4It Sports platform.
 */

import express, { Request, Response } from 'express';
import { storage } from '../storage';
import { isAdminMiddleware as isAdmin, isAuthenticatedMiddleware as isAuthenticated } from '../middleware/auth-middleware';
import { User } from '../../shared/schema';
import { AnalyticsService } from '../services/analytics-service';

const router = express.Router();
const analyticsService = new AnalyticsService();

/**
 * Record user session start
 * POST /api/analytics/session-start
 */
router.post('/session-start', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId, deviceInfo, entryPoint } = req.body;
    const user = req.user as User;
    
    // Only allow a user to record their own analytics or admins to record for anyone
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordSessionStart(userId, deviceInfo, entryPoint);
    return res.json(result);
  } catch (error) {
    console.error('Error recording session start:', error);
    return res.status(500).json({ message: 'Error recording session start' });
  }
});

/**
 * Record user feature navigation
 * POST /api/analytics/feature-navigation
 */
router.post('/feature-navigation', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId, feature } = req.body;
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordFeatureNavigation(userId, feature);
    return res.json(result);
  } catch (error) {
    console.error('Error recording feature navigation:', error);
    return res.status(500).json({ message: 'Error recording feature navigation' });
  }
});

/**
 * Record user action
 * POST /api/analytics/user-action
 */
router.post('/user-action', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId, action, details } = req.body;
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordUserAction(userId, action, details);
    return res.json(result);
  } catch (error) {
    console.error('Error recording user action:', error);
    return res.status(500).json({ message: 'Error recording user action' });
  }
});

/**
 * Record session end
 * POST /api/analytics/session-end
 */
router.post('/session-end', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId, exitPoint, convertedGoal } = req.body;
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordSessionEnd(userId, exitPoint, convertedGoal);
    return res.json(result);
  } catch (error) {
    console.error('Error recording session end:', error);
    return res.status(500).json({ message: 'Error recording session end' });
  }
});

/**
 * Record star path progress
 * POST /api/analytics/star-path
 */
router.post('/star-path', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { 
      userId, 
      currentStarLevel, 
      previousStarLevel, 
      daysAtCurrentLevel, 
      totalDaysInSystem, 
      progressPercentage,
      progressSnapshotData,
      bottleneckIdentified,
      achievedMilestones
    } = req.body;
    
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordStarPathProgress(
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
    
    return res.json(result);
  } catch (error) {
    console.error('Error recording star path progress:', error);
    return res.status(500).json({ message: 'Error recording star path progress' });
  }
});

/**
 * Record workout completion
 * POST /api/analytics/workout
 */
router.post('/workout', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { 
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
    } = req.body;
    
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordWorkoutCompletion(
      userId,
      workoutType,
      completionSuccess,
      workoutVerificationId,
      formQualityScore,
      consistencyStreak,
      workoutDuration,
      preferredTimeOfDay,
      preferredEnvironment,
      equipmentUsed
    );
    
    return res.json(result);
  } catch (error) {
    console.error('Error recording workout completion:', error);
    return res.status(500).json({ message: 'Error recording workout completion' });
  }
});

/**
 * Record skill development
 * POST /api/analytics/skill
 */
router.post('/skill', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { 
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
    } = req.body;
    
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordSkillDevelopment(
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
    
    return res.json(result);
  } catch (error) {
    console.error('Error recording skill development:', error);
    return res.status(500).json({ message: 'Error recording skill development' });
  }
});

/**
 * Record academic-athletic integration
 * POST /api/analytics/academic
 */
router.post('/academic', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { 
      userId,
      currentGPA,
      strongestSubjects,
      weakestSubjects,
      studyHoursPerWeek,
      athleticImprovementRate
    } = req.body;
    
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordAcademicAthletic(
      userId,
      currentGPA,
      strongestSubjects,
      weakestSubjects,
      studyHoursPerWeek,
      athleticImprovementRate
    );
    
    return res.json(result);
  } catch (error) {
    console.error('Error recording academic-athletic integration:', error);
    return res.status(500).json({ message: 'Error recording academic-athletic integration' });
  }
});

/**
 * Record AI coach effectiveness
 * POST /api/analytics/ai-coach
 */
router.post('/ai-coach', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { 
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
    } = req.body;
    
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordAICoachEffectiveness(
      userId,
      userSatisfactionRating,
      recommendationAdherenceRate,
      aiInteractionFrequency,
      averageInteractionDuration,
      mostUsedFeatures,
      coachId,
      commonQueries,
      feedbackProvided,
      improvementWithAI
    );
    
    return res.json(result);
  } catch (error) {
    console.error('Error recording AI coach effectiveness:', error);
    return res.status(500).json({ message: 'Error recording AI coach effectiveness' });
  }
});

/**
 * Record cross-sport potential
 * POST /api/analytics/cross-sport
 */
router.post('/cross-sport', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { 
      userId,
      primarySport,
      secondarySports,
      crossTrainingFrequency,
      skillTransferabilityScore
    } = req.body;
    
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordCrossSportPotential(
      userId,
      primarySport,
      secondarySports,
      crossTrainingFrequency,
      skillTransferabilityScore
    );
    
    return res.json(result);
  } catch (error) {
    console.error('Error recording cross-sport potential:', error);
    return res.status(500).json({ message: 'Error recording cross-sport potential' });
  }
});

/**
 * Record recruiting readiness
 * POST /api/analytics/recruiting
 */
router.post('/recruiting', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { 
      userId,
      overallGARScore,
      highlightGenerationCount,
      highlightViewCount,
      highlightShareCount,
      scoutViewCount,
      recruitingProfileCompleteness,
      collegeMatchPercentages
    } = req.body;
    
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordRecruitingReadiness(
      userId,
      overallGARScore,
      highlightGenerationCount,
      highlightViewCount,
      highlightShareCount,
      scoutViewCount,
      recruitingProfileCompleteness,
      collegeMatchPercentages
    );
    
    return res.json(result);
  } catch (error) {
    console.error('Error recording recruiting readiness:', error);
    return res.status(500).json({ message: 'Error recording recruiting readiness' });
  }
});

/**
 * Record neurodivergent patterns
 * POST /api/analytics/neurodivergent
 */
router.post('/neurodivergent', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { 
      userId,
      adhdFriendlyFeatureUsage,
      distractionFrequency,
      recoveryTime,
      optimalSessionDuration,
      visualVsTextualPreference
    } = req.body;
    
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordNeurodivergentPatterns(
      userId,
      adhdFriendlyFeatureUsage,
      distractionFrequency,
      recoveryTime,
      optimalSessionDuration,
      visualVsTextualPreference
    );
    
    return res.json(result);
  } catch (error) {
    console.error('Error recording neurodivergent patterns:', error);
    return res.status(500).json({ message: 'Error recording neurodivergent patterns' });
  }
});

/**
 * Record community impact
 * POST /api/analytics/community
 */
router.post('/community', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { 
      userId,
      peerInteractionCount,
      coachAthleteMessageCount,
      responseTimeAverage,
      parentInvolvementScore,
      collaborativeWorkoutsPercentage,
      socialSupportNetworkSize
    } = req.body;
    
    const user = req.user as User;
    
    if (userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to record analytics for this user' });
    }
    
    const result = await analyticsService.recordCommunityImpact(
      userId,
      peerInteractionCount,
      coachAthleteMessageCount,
      responseTimeAverage,
      parentInvolvementScore,
      collaborativeWorkoutsPercentage,
      socialSupportNetworkSize
    );
    
    return res.json(result);
  } catch (error) {
    console.error('Error recording community impact:', error);
    return res.status(500).json({ message: 'Error recording community impact' });
  }
});

/**
 * Get analytics overview for a user
 * GET /api/analytics/overview/:userId
 */
router.get('/overview/:userId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = req.user as User;
    
    // Only allow viewing own analytics or admins/coaches to view anyone's
    if (userId !== user.id && user.role !== 'admin' && user.role !== 'coach') {
      return res.status(403).json({ message: 'Unauthorized to view analytics for this user' });
    }
    
    const overview = await analyticsService.getUserAnalyticsOverview(userId);
    return res.json(overview);
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return res.status(500).json({ message: 'Error fetching analytics overview' });
  }
});

/**
 * Get analytics dashboard data
 * GET /api/analytics/dashboard
 */
router.get('/dashboard', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const userId = req.query.userId ? parseInt(req.query.userId as string) : user.id;
    
    // Only allow viewing own analytics or admins/coaches to view anyone's
    if (userId !== user.id && user.role !== 'admin' && user.role !== 'coach') {
      return res.status(403).json({ message: 'Unauthorized to view analytics for this user' });
    }
    
    let dateRange: { start: Date, end: Date } | undefined;
    
    if (req.query.startDate && req.query.endDate) {
      dateRange = {
        start: new Date(req.query.startDate as string),
        end: new Date(req.query.endDate as string)
      };
    }
    
    const dashboard = await analyticsService.getAnalyticsDashboardData(userId, dateRange);
    return res.json({ dashboard });
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    return res.status(500).json({ message: 'Error fetching analytics dashboard' });
  }
});

/**
 * Get aggregate system analytics (admin only)
 * GET /api/analytics/system
 */
router.get('/system', isAdmin, async (req: Request, res: Response) => {
  try {
    let dateRange: { start: Date, end: Date } | undefined;
    
    if (req.query.startDate && req.query.endDate) {
      dateRange = {
        start: new Date(req.query.startDate as string),
        end: new Date(req.query.endDate as string)
      };
    }
    
    const systemAnalytics = await analyticsService.getSystemAnalytics(dateRange);
    return res.json(systemAnalytics);
  } catch (error) {
    console.error('Error fetching system analytics:', error);
    return res.status(500).json({ message: 'Error fetching system analytics' });
  }
});

export default router;