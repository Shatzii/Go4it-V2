import { apiRequest } from "../lib/queryClient";

/**
 * Analytics Tracking Service
 * 
 * Provides utilities for tracking user activity and analytics events
 * in the Go4It Sports platform.
 */
class AnalyticsService {
  private userId: number | null = null;
  private sessionStarted: boolean = false;
  private currentFeature: string = '';
  private sessionStartTime: Date | null = null;
  private actions: any[] = [];
  private deviceInfo: any = null;

  /**
   * Initialize analytics tracking for a user
   */
  initialize(userId: number) {
    this.userId = userId;
    this.sessionStarted = false;
    this.actions = [];
    this.collectDeviceInfo();
  }

  /**
   * Collect device information for analytics
   */
  private collectDeviceInfo() {
    // Simple device detection
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/Tablet|iPad/i.test(userAgent)) {
      deviceType = 'tablet';
    }

    // Browser detection
    let browser = 'unknown';
    if (userAgent.indexOf('Chrome') !== -1) {
      browser = 'Chrome';
    } else if (userAgent.indexOf('Firefox') !== -1) {
      browser = 'Firefox';
    } else if (userAgent.indexOf('Safari') !== -1) {
      browser = 'Safari';
    } else if (userAgent.indexOf('Edge') !== -1 || userAgent.indexOf('Edg') !== -1) {
      browser = 'Edge';
    }

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    this.deviceInfo = {
      deviceType,
      browser,
      screenResolution: {
        width: viewportWidth,
        height: viewportHeight
      },
      userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  /**
   * Start a tracking session
   */
  async startSession(entryPoint: string) {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return;
    }

    if (this.sessionStarted) {
      console.warn('Session already started');
      return;
    }

    this.sessionStarted = true;
    this.currentFeature = entryPoint;
    this.sessionStartTime = new Date();

    try {
      await apiRequest('/api/analytics/session-start', {
        method: 'POST',
        data: {
          userId: this.userId,
          deviceInfo: this.deviceInfo,
          entryPoint
        }
      });
      console.log('Analytics session started');
    } catch (error) {
      console.error('Failed to start analytics session:', error);
    }
  }

  /**
   * Track navigation to a feature
   */
  async trackFeatureNavigation(feature: string) {
    if (!this.userId || !this.sessionStarted) {
      console.warn('Analytics session not started');
      return;
    }

    try {
      await apiRequest('/api/analytics/feature-navigation', {
        method: 'POST',
        data: {
          userId: this.userId,
          feature
        }
      });
      this.currentFeature = feature;
      console.log(`Tracked navigation to: ${feature}`);
    } catch (error) {
      console.error('Failed to track feature navigation:', error);
    }
  }

  /**
   * Track a user action
   */
  async trackAction(action: string, details: any = {}) {
    if (!this.userId || !this.sessionStarted) {
      console.warn('Analytics session not started');
      return;
    }

    // Add current feature and timestamp to action details
    const actionWithContext = {
      ...details,
      feature: this.currentFeature,
      timestamp: new Date().toISOString()
    };

    // Store action locally
    this.actions.push({
      action,
      details: actionWithContext
    });

    try {
      await apiRequest('/api/analytics/user-action', {
        method: 'POST',
        data: {
          userId: this.userId,
          action,
          details: actionWithContext
        }
      });
      console.log(`Tracked action: ${action}`);
    } catch (error) {
      console.error('Failed to track user action:', error);
    }
  }

  /**
   * End the tracking session
   */
  async endSession(exitPoint: string, convertedGoal?: string) {
    if (!this.userId || !this.sessionStarted) {
      console.warn('Analytics session not started');
      return;
    }

    try {
      await apiRequest('/api/analytics/session-end', {
        method: 'POST',
        data: {
          userId: this.userId,
          exitPoint,
          convertedGoal
        }
      });
      
      this.sessionStarted = false;
      this.actions = [];
      console.log('Analytics session ended');
    } catch (error) {
      console.error('Failed to end analytics session:', error);
    }
  }

  /**
   * Track Star Path progress
   */
  async trackStarPathProgress(
    currentStarLevel: number,
    previousStarLevel: number | null,
    daysAtCurrentLevel: number,
    totalDaysInSystem: number,
    progressPercentage: number,
    progressSnapshotData: any,
    bottleneckIdentified?: string,
    achievedMilestones?: string[]
  ) {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return;
    }

    try {
      await apiRequest('/api/analytics/star-path', {
        method: 'POST',
        data: {
          userId: this.userId,
          currentStarLevel,
          previousStarLevel,
          daysAtCurrentLevel,
          totalDaysInSystem,
          progressPercentage,
          progressSnapshotData,
          bottleneckIdentified,
          achievedMilestones
        }
      });
      console.log('Tracked Star Path progress');
    } catch (error) {
      console.error('Failed to track Star Path progress:', error);
    }
  }

  /**
   * Track workout completion
   */
  async trackWorkoutCompletion(
    workoutType: string,
    completionSuccess: boolean,
    workoutVerificationId?: number | null,
    formQualityScore?: number,
    consistencyStreak: number = 1,
    workoutDuration?: number,
    preferredTimeOfDay?: string,
    preferredEnvironment?: string,
    equipmentUsed?: string[]
  ) {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return;
    }

    try {
      await apiRequest('/api/analytics/workout', {
        method: 'POST',
        data: {
          userId: this.userId,
          workoutVerificationId,
          workoutType,
          completionSuccess,
          formQualityScore,
          consistencyStreak,
          workoutDuration,
          preferredTimeOfDay,
          preferredEnvironment,
          equipmentUsed
        }
      });
      console.log('Tracked workout completion');
    } catch (error) {
      console.error('Failed to track workout completion:', error);
    }
  }

  /**
   * Track skill development
   */
  async trackSkillDevelopment(
    sportType: string,
    skillCategory: string,
    skillName: string,
    currentLevel: number,
    practiceFrequency?: number,
    timeInvested?: number,
    plateauIdentified: boolean = false,
    plateauDuration?: number,
    breakthroughFactors?: string[]
  ) {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return;
    }

    try {
      await apiRequest('/api/analytics/skill', {
        method: 'POST',
        data: {
          userId: this.userId,
          sportType,
          skillCategory,
          skillName,
          currentLevel,
          practiceFrequency,
          timeInvested,
          plateauIdentified,
          plateauDuration,
          breakthroughFactors
        }
      });
      console.log('Tracked skill development');
    } catch (error) {
      console.error('Failed to track skill development:', error);
    }
  }

  /**
   * Track academic-athletic integration
   */
  async trackAcademicAthletic(
    currentGPA: number,
    strongestSubjects: string[],
    weakestSubjects: string[],
    studyHoursPerWeek: number,
    athleticImprovementRate: number
  ) {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return;
    }

    try {
      await apiRequest('/api/analytics/academic', {
        method: 'POST',
        data: {
          userId: this.userId,
          currentGPA,
          strongestSubjects,
          weakestSubjects,
          studyHoursPerWeek,
          athleticImprovementRate
        }
      });
      console.log('Tracked academic-athletic integration');
    } catch (error) {
      console.error('Failed to track academic-athletic integration:', error);
    }
  }

  /**
   * Track AI coach effectiveness
   */
  async trackAICoachEffectiveness(
    userSatisfactionRating: number,
    recommendationAdherenceRate: number,
    aiInteractionFrequency: number,
    averageInteractionDuration: number,
    mostUsedFeatures: string[],
    coachId?: number | null,
    commonQueries: string[] = [],
    feedbackProvided: string = '',
    improvementWithAI?: number
  ) {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return;
    }

    try {
      await apiRequest('/api/analytics/ai-coach', {
        method: 'POST',
        data: {
          userId: this.userId,
          coachId,
          userSatisfactionRating,
          recommendationAdherenceRate,
          aiInteractionFrequency,
          averageInteractionDuration,
          mostUsedFeatures,
          commonQueries,
          feedbackProvided,
          improvementWithAI
        }
      });
      console.log('Tracked AI coach effectiveness');
    } catch (error) {
      console.error('Failed to track AI coach effectiveness:', error);
    }
  }

  /**
   * Track cross-sport potential
   */
  async trackCrossSportPotential(
    primarySport: string,
    secondarySports: string[],
    crossTrainingFrequency: number,
    skillTransferabilityScore?: Record<string, number>
  ) {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return;
    }

    try {
      await apiRequest('/api/analytics/cross-sport', {
        method: 'POST',
        data: {
          userId: this.userId,
          primarySport,
          secondarySports,
          crossTrainingFrequency,
          skillTransferabilityScore
        }
      });
      console.log('Tracked cross-sport potential');
    } catch (error) {
      console.error('Failed to track cross-sport potential:', error);
    }
  }

  /**
   * Track recruiting readiness
   */
  async trackRecruitingReadiness(
    overallGARScore: number,
    highlightGenerationCount: number,
    highlightViewCount: number,
    highlightShareCount: number,
    scoutViewCount: number,
    recruitingProfileCompleteness: number,
    collegeMatchPercentages?: Record<string, number>
  ) {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return;
    }

    try {
      await apiRequest('/api/analytics/recruiting', {
        method: 'POST',
        data: {
          userId: this.userId,
          overallGARScore,
          highlightGenerationCount,
          highlightViewCount,
          highlightShareCount,
          scoutViewCount,
          recruitingProfileCompleteness,
          collegeMatchPercentages
        }
      });
      console.log('Tracked recruiting readiness');
    } catch (error) {
      console.error('Failed to track recruiting readiness:', error);
    }
  }

  /**
   * Track neurodivergent patterns
   */
  async trackNeurodivergentPatterns(
    adhdFriendlyFeatureUsage: Record<string, number>,
    distractionFrequency: number,
    recoveryTime: number,
    optimalSessionDuration: number,
    visualVsTextualPreference: number
  ) {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return;
    }

    try {
      await apiRequest('/api/analytics/neurodivergent', {
        method: 'POST',
        data: {
          userId: this.userId,
          adhdFriendlyFeatureUsage,
          distractionFrequency,
          recoveryTime,
          optimalSessionDuration,
          visualVsTextualPreference
        }
      });
      console.log('Tracked neurodivergent patterns');
    } catch (error) {
      console.error('Failed to track neurodivergent patterns:', error);
    }
  }

  /**
   * Track community impact
   */
  async trackCommunityImpact(
    peerInteractionCount: number,
    coachAthleteMessageCount: number,
    responseTimeAverage: number,
    parentInvolvementScore: number,
    collaborativeWorkoutsPercentage: number,
    socialSupportNetworkSize: number
  ) {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return;
    }

    try {
      await apiRequest('/api/analytics/community', {
        method: 'POST',
        data: {
          userId: this.userId,
          peerInteractionCount,
          coachAthleteMessageCount,
          responseTimeAverage,
          parentInvolvementScore,
          collaborativeWorkoutsPercentage,
          socialSupportNetworkSize
        }
      });
      console.log('Tracked community impact');
    } catch (error) {
      console.error('Failed to track community impact:', error);
    }
  }

  /**
   * Get analytics overview for current user
   */
  async getAnalyticsOverview() {
    if (!this.userId) {
      console.warn('Analytics not initialized with user ID');
      return null;
    }

    try {
      const response = await apiRequest(`/api/analytics/overview/${this.userId}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Failed to get analytics overview:', error);
      return null;
    }
  }

  /**
   * Get analytics dashboard data
   */
  async getAnalyticsDashboard(startDate?: string, endDate?: string) {
    let url = '/api/analytics/dashboard';
    const params = new URLSearchParams();
    
    if (this.userId) {
      params.append('userId', this.userId.toString());
    }
    
    if (startDate) {
      params.append('startDate', startDate);
    }
    
    if (endDate) {
      params.append('endDate', endDate);
    }
    
    if (params.toString()) {
      url = `${url}?${params.toString()}`;
    }

    try {
      const response = await apiRequest(url, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Failed to get analytics dashboard:', error);
      return null;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;