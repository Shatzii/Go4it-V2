import { db } from '../db';
import * as schema from '../../shared/schema';
import {
  starPathAnalytics,
  engagementAnalytics,
  workoutAnalytics,
  skillDevelopmentAnalytics,
  academicAthleticAnalytics,
  aiCoachAnalytics,
  crossSportAnalytics,
  recruitingAnalytics,
  neurodivergentAnalytics,
  communityAnalytics,
  userSessionAnalytics,
  users
} from '../../shared/schema';
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { format } from 'date-fns';

export class AnalyticsService {
  // Session tracking
  private activeSessions: Map<number, {
    startTime: Date;
    features: Set<string>;
    featureTimes: Map<string, number>;
    lastFeature: string;
    lastFeatureStartTime: number;
    contextSwitches: number;
    deviceInfo: any;
    pagesVisited: Set<string>;
    actions: any[];
    entryPoint: string;
  }> = new Map();

  /**
   * Tracking user session start
   */
  async recordSessionStart(userId: number, deviceInfo: any, entryPoint: string) {
    this.activeSessions.set(userId, {
      startTime: new Date(),
      features: new Set(),
      featureTimes: new Map(),
      lastFeature: entryPoint,
      lastFeatureStartTime: Date.now(),
      contextSwitches: 0,
      deviceInfo,
      pagesVisited: new Set([entryPoint]),
      actions: [],
      entryPoint
    });
    
    return { 
      success: true, 
      message: 'Session tracking started'
    };
  }

  /**
   * Record user navigation to a new page/feature
   */
  async recordFeatureNavigation(userId: number, feature: string) {
    const session = this.activeSessions.get(userId);
    if (!session) return { success: false, message: 'No active session' };

    // Calculate time spent on previous feature
    const now = Date.now();
    const timeSpent = now - session.lastFeatureStartTime;
    
    // Update feature usage
    session.features.add(session.lastFeature);
    session.pagesVisited.add(feature);
    
    // Update time tracking
    const currentFeatureTime = session.featureTimes.get(session.lastFeature) || 0;
    session.featureTimes.set(session.lastFeature, currentFeatureTime + timeSpent);
    
    // Track context switch
    if (session.lastFeature !== feature) {
      session.contextSwitches++;
    }
    
    // Update current feature
    session.lastFeature = feature;
    session.lastFeatureStartTime = now;
    
    return { 
      success: true, 
      message: 'Feature navigation tracked',
      timeSpent,
      feature
    };
  }

  /**
   * Record user action within a feature
   */
  async recordUserAction(userId: number, action: string, details: any) {
    const session = this.activeSessions.get(userId);
    if (!session) return { success: false, message: 'No active session' };

    session.actions.push({
      action,
      details,
      timestamp: new Date(),
      feature: session.lastFeature
    });

    return { 
      success: true, 
      message: 'User action tracked' 
    };
  }

  /**
   * End user session and save analytics data
   */
  async recordSessionEnd(userId: number, exitPoint: string, convertedGoal?: string) {
    const session = this.activeSessions.get(userId);
    if (!session) return { success: false, message: 'No active session' };

    // Calculate final time on last feature
    const now = Date.now();
    const timeSpent = now - session.lastFeatureStartTime;
    const currentFeatureTime = session.featureTimes.get(session.lastFeature) || 0;
    session.featureTimes.set(session.lastFeature, currentFeatureTime + timeSpent);

    // Calculate session duration in seconds
    const sessionEndTime = new Date();
    const sessionDuration = Math.floor((sessionEndTime.getTime() - session.startTime.getTime()) / 1000);

    // Format feature time distribution for storage
    const featureTimeDistribution: Record<string, number> = {};
    session.featureTimes.forEach((time, feature) => {
      featureTimeDistribution[feature] = time;
    });

    // Determine focus feature (feature with most time spent)
    let focusFeature = '';
    let maxTime = 0;
    session.featureTimes.forEach((time, feature) => {
      if (time > maxTime) {
        maxTime = time;
        focusFeature = feature;
      }
    });

    // Calculate day of week (0-6, Sunday-Saturday)
    const dayOfWeek = session.startTime.getDay();

    // Save session analytics to database
    try {
      // First - general session analytics
      await db.insert(userSessionAnalytics).values({
        userId,
        sessionStartTime: session.startTime,
        sessionEndTime,
        sessionDuration,
        pagesVisited: Array.from(session.pagesVisited),
        actionsPerformed: session.actions,
        deviceInfo: session.deviceInfo,
        browserInfo: session.deviceInfo?.browser || null,
        ipAddress: session.deviceInfo?.ip || null,
        geolocation: session.deviceInfo?.location || null,
        entryPoint: session.entryPoint,
        exitPoint,
        bounced: session.pagesVisited.size <= 1,
        convertedGoal,
        userType: session.deviceInfo?.userType || 'returning'
      });

      // Second - neurodivergent-specific analytics for ADHD insights
      // Calculate average time per feature
      const attentionSpanAverage = sessionDuration / session.features.size;
      
      await db.insert(engagementAnalytics).values({
        userId,
        sessionDuration,
        timeOfDay: session.startTime,
        dayOfWeek,
        featuresUsed: Array.from(session.features),
        featureTimeDistribution,
        attentionSpanAverage,
        contextSwitchCount: session.contextSwitches,
        focusFeature,
        deviceType: session.deviceInfo?.deviceType || 'unknown',
        sessionCompletionStatus: convertedGoal ? 'completed' : 'normal',
        interfaceElements: {
          mostEngaging: focusFeature,
          leastEngaging: this.findLeastEngagingFeature(session.featureTimes),
          attentionRetention: this.calculateAttentionRetentionByFeature(session.featureTimes, sessionDuration)
        }
      });

      // Remove session from active sessions
      this.activeSessions.delete(userId);

      return { 
        success: true, 
        message: 'Session ended and analytics saved',
        sessionDuration,
        featuresUsed: Array.from(session.features).length
      };
    } catch (error) {
      console.error('Error saving session analytics:', error);
      return { 
        success: false, 
        message: 'Error saving session analytics',
        error
      };
    }
  }

  /**
   * Helper to find least engaging feature
   */
  private findLeastEngagingFeature(featureTimes: Map<string, number>): string {
    let minFeature = '';
    let minTime = Infinity;
    
    featureTimes.forEach((time, feature) => {
      if (time < minTime && time > 0) {
        minTime = time;
        minFeature = feature;
      }
    });
    
    return minFeature;
  }

  /**
   * Helper to calculate retention by feature
   */
  private calculateAttentionRetentionByFeature(featureTimes: Map<string, number>, totalDuration: number): Record<string, number> {
    const result: Record<string, number> = {};
    
    featureTimes.forEach((time, feature) => {
      result[feature] = Math.min(1, time / (totalDuration * 1000));
    });
    
    return result;
  }

  /**
   * Record star path progression analytics
   */
  async recordStarPathProgress(
    userId: number, 
    currentStarLevel: number,
    previousStarLevel: number | null,
    daysAtCurrentLevel: number,
    totalDaysInSystem: number,
    progressPercentage: number,
    progressSnapshotData: any,
    bottleneckIdentified?: string,
    achievedMilestones?: string[]
  ) {
    try {
      // Calculate estimated days to next level based on current progression rate
      const nextLevelEstimatedDays = progressPercentage > 0 
        ? Math.ceil((100 - progressPercentage) * daysAtCurrentLevel / progressPercentage) 
        : null;
      
      // Determine recommended focus areas
      const recommendedFocus = bottleneckIdentified 
        ? `Prioritize improving ${bottleneckIdentified}` 
        : 'Maintain consistent training across all areas';

      await db.insert(starPathAnalytics).values({
        userId,
        currentStarLevel,
        previousStarLevel: previousStarLevel || undefined,
        daysAtCurrentLevel,
        totalDaysInSystem,
        progressPercentage,
        nextLevelEstimatedDays: nextLevelEstimatedDays || undefined,
        progressSnapshotData,
        bottleneckIdentified: bottleneckIdentified || undefined,
        recommendedFocus,
        achievedMilestones: achievedMilestones || undefined
      });

      return {
        success: true,
        message: 'Star path progress tracked successfully'
      };
    } catch (error) {
      console.error('Error tracking star path progress:', error);
      return {
        success: false,
        message: 'Error tracking star path progress',
        error
      };
    }
  }

  /**
   * Record workout verification analytics
   */
  async recordWorkoutCompletion(
    userId: number,
    workoutVerificationId: number | null,
    workoutType: string,
    completionSuccess: boolean,
    formQualityScore?: number,
    consistencyStreak: number = 1,
    workoutDuration?: number,
    preferredTimeOfDay?: string,
    preferredEnvironment?: string,
    equipmentUsed?: string[]
  ) {
    try {
      // Get previous workout analytics for comparison
      const previousWorkouts = await db.select()
        .from(workoutAnalytics)
        .where(and(
          eq(workoutAnalytics.userId, userId),
          eq(workoutAnalytics.workoutType, workoutType)
        ))
        .orderBy(desc(workoutAnalytics.timestampRecorded))
        .limit(5);

      // Calculate form improvement rate if we have previous workouts
      let formImprovementRate: number | undefined;
      let bestStreak: number | undefined;
      let difficultyProgression: number | undefined;
      
      if (previousWorkouts.length > 0 && formQualityScore) {
        const prevWithFormScores = previousWorkouts.filter(w => w.formQualityScore !== null);
        
        if (prevWithFormScores.length > 0) {
          const avgPreviousScore = prevWithFormScores.reduce((sum, workout) => 
            sum + (workout.formQualityScore || 0), 0) / prevWithFormScores.length;
          
          formImprovementRate = ((formQualityScore - avgPreviousScore) / avgPreviousScore) * 100;
        }
        
        // Calculate best streak
        const allStreaks = previousWorkouts.map(w => w.consistencyStreak);
        allStreaks.push(consistencyStreak);
        bestStreak = Math.max(...allStreaks);
        
        // Calculate difficulty progression if we have enough data
        if (previousWorkouts.length >= 3) {
          // This is a simplified measure; in a real system it would be more complex
          difficultyProgression = 0.5; // Placeholder calculation
        }
      }

      await db.insert(workoutAnalytics).values({
        userId,
        workoutVerificationId: workoutVerificationId || undefined,
        workoutType,
        completionSuccess,
        formQualityScore: formQualityScore || undefined,
        formImprovementRate: formImprovementRate || undefined,
        consistencyStreak,
        bestStreak: bestStreak || undefined,
        difficultyProgression: difficultyProgression || undefined,
        workoutDuration: workoutDuration || undefined,
        preferredTimeOfDay: preferredTimeOfDay || undefined,
        preferredEnvironment: preferredEnvironment || undefined,
        equipmentUsed: equipmentUsed || undefined
      });

      return {
        success: true,
        message: 'Workout completion tracked successfully',
        formImprovementRate,
        bestStreak
      };
    } catch (error) {
      console.error('Error tracking workout completion:', error);
      return {
        success: false,
        message: 'Error tracking workout completion',
        error
      };
    }
  }

  /**
   * Record skill development analytics
   */
  async recordSkillDevelopment(
    userId: number,
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
    try {
      // Get previous skill development entries for comparison
      const previousEntries = await db.select()
        .from(skillDevelopmentAnalytics)
        .where(and(
          eq(skillDevelopmentAnalytics.userId, userId),
          eq(skillDevelopmentAnalytics.sportType, sportType),
          eq(skillDevelopmentAnalytics.skillCategory, skillCategory),
          eq(skillDevelopmentAnalytics.skillName, skillName)
        ))
        .orderBy(desc(skillDevelopmentAnalytics.timestampRecorded))
        .limit(10);

      // Calculate improvement rate if we have previous entries
      let improvementRate: number | undefined;
      let correlationFactors: any = {};
      let drillEfficiency: any = {};
      
      if (previousEntries.length > 0) {
        // Calculate weekly improvement rate
        const oldestEntry = previousEntries[previousEntries.length - 1];
        const oldestTimestamp = new Date(oldestEntry.timestampRecorded);
        const currentTimestamp = new Date();
        
        // Calculate weeks between oldest and current entry
        const weeksDiff = Math.max(1, Math.ceil(
          (currentTimestamp.getTime() - oldestTimestamp.getTime()) / (7 * 24 * 60 * 60 * 1000)
        ));
        
        improvementRate = (currentLevel - oldestEntry.currentLevel) / weeksDiff;
        
        // Simple correlation analysis (placeholder - would be more sophisticated in real system)
        if (practiceFrequency && timeInvested) {
          correlationFactors = {
            practiceFrequency: this.calculateCorrelation(
              previousEntries.map(e => e.practiceFrequency), 
              previousEntries.map(e => e.currentLevel)
            ),
            timeInvested: this.calculateCorrelation(
              previousEntries.map(e => e.timeInvested), 
              previousEntries.map(e => e.currentLevel)
            )
          };

          // Simple drill efficiency calculation (placeholder)
          drillEfficiency = {
            timeEfficiency: timeInvested > 0 ? improvementRate / timeInvested : 0,
            frequencyEfficiency: practiceFrequency > 0 ? improvementRate / practiceFrequency : 0
          };
        }
      }

      await db.insert(skillDevelopmentAnalytics).values({
        userId,
        sportType,
        skillCategory,
        skillName,
        currentLevel,
        improvementRate: improvementRate || undefined,
        practiceFrequency: practiceFrequency || undefined,
        timeInvested: timeInvested || undefined,
        plateauIdentified,
        plateauDuration: plateauDuration || undefined,
        breakthroughFactors: breakthroughFactors || undefined,
        correlationFactors: Object.keys(correlationFactors).length > 0 ? correlationFactors : undefined,
        drillEfficiency: Object.keys(drillEfficiency).length > 0 ? drillEfficiency : undefined
      });

      return {
        success: true,
        message: 'Skill development tracked successfully',
        improvementRate
      };
    } catch (error) {
      console.error('Error tracking skill development:', error);
      return {
        success: false,
        message: 'Error tracking skill development',
        error
      };
    }
  }

  /**
   * Track academic-athletic integration analytics
   */
  async recordAcademicAthletic(
    userId: number,
    currentGPA: number,
    strongestSubjects: string[],
    weakestSubjects: string[],
    studyHoursPerWeek: number,
    athleticImprovementRate: number
  ) {
    try {
      // Get previous academic entries for comparison and time series
      const previousEntries = await db.select()
        .from(academicAthleticAnalytics)
        .where(eq(academicAthleticAnalytics.userId, userId))
        .orderBy(desc(academicAthleticAnalytics.timestampRecorded))
        .limit(10);
      
      // Build GPA time series
      const gpaTimeSeries: { date: string, gpa: number }[] = previousEntries.map(entry => ({
        date: format(new Date(entry.timestampRecorded), 'yyyy-MM-dd'),
        gpa: entry.currentGPA || 0
      }));
      
      // Add current GPA to time series
      gpaTimeSeries.unshift({
        date: format(new Date(), 'yyyy-MM-dd'),
        gpa: currentGPA
      });
      
      // Calculate academic improvement rate
      let academicImprovementRate: number | undefined;
      if (previousEntries.length > 0 && previousEntries[0].currentGPA) {
        academicImprovementRate = currentGPA - previousEntries[0].currentGPA;
      }
      
      // Calculate athletic-academic correlation
      let athleticPerformanceCorrelation: number | undefined;
      if (previousEntries.length >= 3) {
        const gpaTrend = previousEntries.map(e => e.currentGPA || 0);
        const athleticTrend = previousEntries.map(e => e.athleticImprovementRate || 0);
        
        if (gpaTrend.every(Boolean) && athleticTrend.every(Boolean)) {
          athleticPerformanceCorrelation = this.calculateCorrelation(gpaTrend, athleticTrend);
        }
      }
      
      // Calculate balance score (how well balanced academics and athletics are)
      // 0-100 where 50 is perfectly balanced, <50 means academics need more focus, >50 means athletics need more focus
      const balanceScore = Math.min(100, Math.max(0, 50 + (athleticImprovementRate * 10 - academicImprovementRate * 10)));
      
      // Determine cognitive influence factor (how academics impact athletic decisions)
      const cognitiveInfluenceFactor = athleticPerformanceCorrelation 
        ? Math.abs(athleticPerformanceCorrelation) 
        : 0.5; // Default to moderate influence
      
      // Determine recommended study patterns
      const recommendedStudyPatterns = {
        frequency: studyHoursPerWeek < 10 ? 'Increase study frequency' : 'Maintain current frequency',
        subjects: weakestSubjects.map(subject => `Focus more on ${subject}`),
        timing: athleticImprovementRate > 0.2 
          ? 'Schedule study sessions after workouts to leverage focus momentum' 
          : 'Try study sessions before workouts to improve mental preparation'
      };
      
      // Determine recommended subject focus
      const recommendedSubjectFocus = weakestSubjects.length > 0 
        ? weakestSubjects[0] 
        : 'Maintain balanced focus across all subjects';

      await db.insert(academicAthleticAnalytics).values({
        userId,
        currentGPA,
        gpaTimeSeries,
        strongestSubjects,
        weakestSubjects,
        studyHoursPerWeek,
        athleticPerformanceCorrelation: athleticPerformanceCorrelation || undefined,
        cognitiveInfluenceFactor,
        academicImprovementRate: academicImprovementRate || undefined,
        athleticImprovementRate,
        balanceScore,
        recommendedStudyPatterns,
        recommendedSubjectFocus
      });

      return {
        success: true,
        message: 'Academic-athletic integration tracked successfully',
        balanceScore,
        recommendedSubjectFocus
      };
    } catch (error) {
      console.error('Error tracking academic-athletic integration:', error);
      return {
        success: false,
        message: 'Error tracking academic-athletic integration',
        error
      };
    }
  }

  /**
   * Track AI coach effectiveness analytics
   */
  async recordAICoachEffectiveness(
    userId: number,
    coachId: number | null,
    userSatisfactionRating: number,
    recommendationAdherenceRate: number,
    aiInteractionFrequency: number,
    averageInteractionDuration: number,
    mostUsedFeatures: string[],
    commonQueries: string[] = [],
    feedbackProvided: string = '',
    improvementWithAI?: number
  ) {
    try {
      // Get previous AI coach effectiveness entries for comparison
      const previousEntries = await db.select()
        .from(aiCoachAnalytics)
        .where(eq(aiCoachAnalytics.userId, userId))
        .orderBy(desc(aiCoachAnalytics.timestampRecorded))
        .limit(5);
      
      // Calculate personalization accuracy based on user satisfaction trend
      let personalizationAccuracy: number | undefined;
      if (previousEntries.length > 0) {
        const satisfactionTrend = previousEntries.map(e => e.userSatisfactionRating || 0);
        // If satisfaction is trending up, personalization is improving
        const trendDirection = satisfactionTrend[0] > satisfactionTrend[satisfactionTrend.length - 1] ? 1 : -1;
        personalizationAccuracy = Math.min(100, Math.max(0, 
          (userSatisfactionRating / 10) * 100 + (trendDirection * 5)
        ));
      } else {
        personalizationAccuracy = (userSatisfactionRating / 10) * 100;
      }
      
      // Calculate improvement without AI (baseline) if we have AI improvement data
      let improvementWithoutAI: number | undefined;
      if (improvementWithAI !== undefined) {
        // This is a placeholder - in a real system, we'd have a more sophisticated calculation
        improvementWithoutAI = improvementWithAI * (1 - (recommendationAdherenceRate / 100));
      }
      
      // Adjustments needed based on feedback and effectiveness
      const adjustmentsImplemented: Record<string, any> = {};
      
      if (feedbackProvided) {
        // Simple NLP-like analysis of feedback (placeholder)
        if (feedbackProvided.toLowerCase().includes('more specific')) {
          adjustmentsImplemented.specificity = 'Increase workout specificity';
        }
        if (feedbackProvided.toLowerCase().includes('too difficult') || 
            feedbackProvided.toLowerCase().includes('too hard')) {
          adjustmentsImplemented.difficulty = 'Reduce difficulty level';
        }
        if (feedbackProvided.toLowerCase().includes('too easy')) {
          adjustmentsImplemented.difficulty = 'Increase difficulty level';
        }
        if (feedbackProvided.toLowerCase().includes('explain') || 
            feedbackProvided.toLowerCase().includes('unclear')) {
          adjustmentsImplemented.clarity = 'Improve explanation clarity';
        }
      }

      await db.insert(aiCoachAnalytics).values({
        userId,
        coachId: coachId || undefined,
        personalizationAccuracy,
        recommendationAdherenceRate,
        userSatisfactionRating,
        improvementWithAI,
        improvementWithoutAI,
        aiInteractionFrequency,
        averageInteractionDuration,
        mostUsedFeatures,
        commonQueries: commonQueries.length > 0 ? commonQueries : undefined,
        feedbackProvided: feedbackProvided || undefined,
        adjustmentsImplemented: Object.keys(adjustmentsImplemented).length > 0 ? adjustmentsImplemented : undefined
      });

      return {
        success: true,
        message: 'AI coach effectiveness tracked successfully',
        personalizationAccuracy,
        adjustmentsImplemented
      };
    } catch (error) {
      console.error('Error tracking AI coach effectiveness:', error);
      return {
        success: false,
        message: 'Error tracking AI coach effectiveness',
        error
      };
    }
  }

  /**
   * Track Cross-Sport Potential Analytics
   */
  async recordCrossSportPotential(
    userId: number,
    primarySport: string,
    secondarySports: string[],
    crossTrainingFrequency: number,
    skillTransferabilityScore?: Record<string, number>
  ) {
    try {
      // Get previous cross-sport entries for comparison
      const previousEntries = await db.select()
        .from(crossSportAnalytics)
        .where(eq(crossSportAnalytics.userId, userId))
        .orderBy(desc(crossSportAnalytics.timestampRecorded))
        .limit(5);
      
      // Calculate multi-sport performance index (placeholder)
      const multiSportPerformanceIndex = 
        crossTrainingFrequency * 0.2 + 
        secondarySports.length * 0.3 + 
        (skillTransferabilityScore 
          ? Object.values(skillTransferabilityScore).reduce((sum, score) => sum + score, 0) / Object.values(skillTransferabilityScore).length
          : 0.5);
      
      // Calculate sport recommendation accuracy if we have previous entries
      let sportRecommendationAccuracy: number | undefined;
      if (previousEntries.length > 0 && previousEntries[0].secondarySports) {
        // Check if previously recommended secondary sports are still in current list
        const prevSports = previousEntries[0].secondarySports;
        const retainedSports = prevSports.filter(sport => secondarySports.includes(sport));
        sportRecommendationAccuracy = (retainedSports.length / prevSports.length) * 100;
      }
      
      // Identify complementary skill sets between sports
      const complementarySkillSets: Record<string, string[]> = {};
      if (primarySport === 'basketball') {
        complementarySkillSets.volleyball = ['jumping', 'coordination', 'hand-eye coordination'];
        complementarySkillSets.football = ['agility', 'speed', 'spatial awareness'];
        complementarySkillSets.soccer = ['footwork', 'endurance', 'field vision'];
      } else if (primarySport === 'football') {
        complementarySkillSets.track = ['speed', 'explosiveness', 'endurance'];
        complementarySkillSets.wrestling = ['strength', 'leverage', 'body control'];
        complementarySkillSets.basketball = ['jumping', 'coordination', 'agility'];
      }
      // Add more sport combinations as needed
      
      // Calculate specialty vs versatility balance
      // 0 = pure specialist, 1 = complete versatility
      const specialtyVsVersatilityBalance = Math.min(1, Math.max(0, 
        secondarySports.length * 0.2 + crossTrainingFrequency * 0.1
      ));
      
      // Sport progression timeline (projected development path)
      const now = new Date();
      const sportProgressionTimeline = {
        primarySport: {
          current: 'active',
          projectedPeak: format(new Date(now.setMonth(now.getMonth() + 24)), 'yyyy-MM-dd')
        },
        secondarySports: secondarySports.reduce((acc, sport) => {
          const monthOffset = Math.floor(Math.random() * 36) + 12; // Random 12-48 month projection
          acc[sport] = {
            current: 'developing',
            projectedPeak: format(new Date(new Date().setMonth(now.getMonth() + monthOffset)), 'yyyy-MM-dd')
          };
          return acc;
        }, {} as Record<string, any>)
      };

      await db.insert(crossSportAnalytics).values({
        userId,
        primarySport,
        secondarySports,
        skillTransferabilityScore,
        crossTrainingFrequency,
        multiSportPerformanceIndex,
        sportRecommendationAccuracy,
        complementarySkillSets,
        specialtyVsVersatilityBalance,
        sportProgressionTimeline
      });

      return {
        success: true,
        message: 'Cross-sport potential tracked successfully',
        multiSportPerformanceIndex,
        specialtyVsVersatilityBalance
      };
    } catch (error) {
      console.error('Error tracking cross-sport potential:', error);
      return {
        success: false,
        message: 'Error tracking cross-sport potential',
        error
      };
    }
  }

  /**
   * Track Recruiting Readiness Analytics
   */
  async recordRecruitingReadiness(
    userId: number,
    overallGARScore: number,
    highlightGenerationCount: number,
    highlightViewCount: number,
    highlightShareCount: number,
    scoutViewCount: number,
    recruitingProfileCompleteness: number,
    collegeMatchPercentages?: Record<string, number>
  ) {
    try {
      // Get previous recruiting entries for comparison
      const previousEntries = await db.select()
        .from(recruitingAnalytics)
        .where(eq(recruitingAnalytics.userId, userId))
        .orderBy(desc(recruitingAnalytics.timestampRecorded))
        .limit(10);
      
      // Build GAR score progression time series
      const garScoreProgression: { date: string, score: number }[] = previousEntries.map(entry => ({
        date: format(new Date(entry.timestampRecorded), 'yyyy-MM-dd'),
        score: entry.overallGARScore || 0
      }));
      
      // Add current GAR score to time series
      garScoreProgression.unshift({
        date: format(new Date(), 'yyyy-MM-dd'),
        score: overallGARScore
      });
      
      // Calculate scout engagement metrics
      const scoutEngagementMetrics = {
        averageViewDuration: Math.floor(Math.random() * 120) + 60, // Placeholder: Random 60-180 seconds
        clickthroughRate: (highlightShareCount / Math.max(1, highlightViewCount)) * 100,
        heatmap: {
          profileSection: Math.random() * 100,
          highlightsSection: Math.random() * 100,
          statsSection: Math.random() * 100,
          academicsSection: Math.random() * 100
        },
        interestByPosition: {
          // Generate random interest levels by position based on sport
          // This is placeholder data
          guard: Math.random() * 100,
          forward: Math.random() * 100,
          center: Math.random() * 100
        }
      };
      
      // Calculate national and local ranking projections
      // These would be based on complex algorithms in a real application
      const nationalRankingProjection = Math.floor(5000 * (1 - overallGARScore / 100));
      const localRankingProjection = Math.floor(500 * (1 - overallGARScore / 100));
      
      // Calculate scholarship potential score
      const scholarshipPotentialScore = Math.min(100, Math.max(0,
        overallGARScore * 0.6 +
        recruitingProfileCompleteness * 0.2 +
        (scoutViewCount / 10) * 0.2
      ));

      await db.insert(recruitingAnalytics).values({
        userId,
        overallGARScore,
        garScoreProgression,
        highlightGenerationCount,
        highlightViewCount,
        highlightShareCount,
        scoutViewCount,
        scoutEngagementMetrics,
        collegeMatchPercentages,
        recruitingProfileCompleteness,
        nationalRankingProjection,
        localRankingProjection,
        scholarshipPotentialScore
      });

      return {
        success: true,
        message: 'Recruiting readiness tracked successfully',
        scholarshipPotentialScore,
        nationalRankingProjection,
        localRankingProjection
      };
    } catch (error) {
      console.error('Error tracking recruiting readiness:', error);
      return {
        success: false,
        message: 'Error tracking recruiting readiness',
        error
      };
    }
  }

  /**
   * Track Neurodivergent-Specific Success Patterns
   */
  async recordNeurodivergentPatterns(
    userId: number,
    adhdFriendlyFeatureUsage: Record<string, number>,
    distractionFrequency: number,
    recoveryTime: number,
    optimalSessionDuration: number,
    visualVsTextualPreference: number
  ) {
    try {
      // Get previous neurodivergent pattern entries
      const previousEntries = await db.select()
        .from(neurodivergentAnalytics)
        .where(eq(neurodivergentAnalytics.userId, userId))
        .orderBy(desc(neurodivergentAnalytics.timestampRecorded))
        .limit(5);
      
      // Track which accommodations are effective
      const accommodationEffectiveness: Record<string, number> = {
        focusMode: (adhdFriendlyFeatureUsage['focusMode'] || 0) / Math.max(1, optimalSessionDuration) * 100,
        visualCues: visualVsTextualPreference > 0.7 ? 90 : 50,
        breakReminders: 100 - distractionFrequency,
        progressTracking: adhdFriendlyFeatureUsage['progressTracking'] || 70,
        gamification: adhdFriendlyFeatureUsage['gamification'] || 85
      };
      
      // Track focus duration by UI element
      const focusDuration: Record<string, number> = {};
      for (const [feature, usage] of Object.entries(adhdFriendlyFeatureUsage)) {
        focusDuration[feature] = usage * (1 - distractionFrequency / 100);
      }
      
      // Track dopamine trigger effectiveness
      const dopamineTriggerEffectiveness: Record<string, number> = {
        achievements: Math.random() * 50 + 50, // Placeholder: Random 50-100
        rewards: Math.random() * 50 + 50,
        socialRecognition: Math.random() * 50 + 50,
        progressVisualization: Math.random() * 50 + 50,
        instantFeedback: Math.random() * 50 + 50
      };
      
      // Track attention patterns
      const attentionPatterns = {
        peakTimes: {
          morning: Math.random() * 100,
          afternoon: Math.random() * 100,
          evening: Math.random() * 100
        },
        sustainedAttentionMax: optimalSessionDuration,
        focusRecoveryRate: 100 - recoveryTime,
        hyperfocusTriggers: ['challenge', 'competition', 'novelty'].filter(() => Math.random() > 0.3)
      };
      
      // Track environmental factors
      const environmentalFactors = {
        noiseLevel: {
          low: Math.random() * 100,
          moderate: Math.random() * 100,
          high: Math.random() * 100
        },
        timeOfDay: {
          morning: Math.random() * 100,
          afternoon: Math.random() * 100,
          evening: Math.random() * 100
        },
        socialSetting: {
          alone: Math.random() * 100,
          smallGroup: Math.random() * 100,
          largeGroup: Math.random() * 100
        }
      };

      await db.insert(neurodivergentAnalytics).values({
        userId,
        adhdFriendlyFeatureUsage,
        accommodationEffectiveness,
        focusDuration,
        distractionFrequency,
        recoveryTime,
        optimalSessionDuration,
        visualVsTextualPreference,
        dopamineTriggerEffectiveness,
        attentionPatterns,
        environmentalFactors
      });

      return {
        success: true,
        message: 'Neurodivergent patterns tracked successfully',
        mostEffectiveAccommodation: Object.entries(accommodationEffectiveness)
          .sort((a, b) => b[1] - a[1])[0][0],
        optimalSessionDuration
      };
    } catch (error) {
      console.error('Error tracking neurodivergent patterns:', error);
      return {
        success: false,
        message: 'Error tracking neurodivergent patterns',
        error
      };
    }
  }

  /**
   * Track Community & Social Impact Analytics
   */
  async recordCommunityImpact(
    userId: number,
    peerInteractionCount: number,
    coachAthleteMessageCount: number,
    responseTimeAverage: number,
    parentInvolvementScore: number,
    collaborativeWorkoutsPercentage: number,
    socialSupportNetworkSize: number
  ) {
    try {
      // Calculate peer learning effectiveness
      const peerLearningEffectiveness = Math.min(100, Math.max(0,
        (peerInteractionCount / Math.max(1, socialSupportNetworkSize)) * 50 +
        collaborativeWorkoutsPercentage * 0.5
      ));
      
      // Calculate team vs individual improvement (-1 to 1)
      // Negative means individual better, positive means team better
      const teamVsIndividualImprovement = 
        (collaborativeWorkoutsPercentage / 100) * 2 - 1;
      
      // Calculate regional comparison percentile (placeholder)
      const regionalComparisonPercentile = Math.random() * 100;
      
      // Calculate community contribution score
      const communityContributionScore = Math.min(100, Math.max(0,
        peerInteractionCount * 2 +
        (coachAthleteMessageCount / 2) + 
        parentInvolvementScore * 0.5
      ));
      
      // Calculate knowledge sharing metrics
      const knowledgeSharingMetrics = {
        contentCreated: Math.floor(Math.random() * 10), // Placeholder: Random 0-10
        contentEngagement: Math.floor(Math.random() * 100), // Placeholder: Random 0-100
        questionsAnswered: Math.floor(Math.random() * 30), // Placeholder: Random 0-30
        resourcesShared: Math.floor(Math.random() * 20) // Placeholder: Random 0-20
      };

      await db.insert(communityAnalytics).values({
        userId,
        peerInteractionCount,
        peerLearningEffectiveness,
        coachAthleteMessageCount,
        responseTimeAverage,
        parentInvolvementScore,
        teamVsIndividualImprovement,
        regionalComparisonPercentile,
        communityContributionScore,
        socialSupportNetworkSize,
        collaborativeWorkoutsPercentage,
        knowledgeSharingMetrics
      });

      return {
        success: true,
        message: 'Community impact tracked successfully',
        communityContributionScore,
        peerLearningEffectiveness,
        teamVsIndividualImprovement
      };
    } catch (error) {
      console.error('Error tracking community impact:', error);
      return {
        success: false,
        message: 'Error tracking community impact',
        error
      };
    }
  }

  /**
   * Get analytics overview for all categories for a specific user
   */
  async getUserAnalyticsOverview(userId: number) {
    try {
      // Get most recent entries from each analytics table for this user
      const starPath = await db.select().from(starPathAnalytics)
        .where(eq(starPathAnalytics.userId, userId))
        .orderBy(desc(starPathAnalytics.timestampRecorded))
        .limit(1);
      
      const engagement = await db.select().from(engagementAnalytics)
        .where(eq(engagementAnalytics.userId, userId))
        .orderBy(desc(engagementAnalytics.timestampRecorded))
        .limit(1);
      
      const workout = await db.select().from(workoutAnalytics)
        .where(eq(workoutAnalytics.userId, userId))
        .orderBy(desc(workoutAnalytics.timestampRecorded))
        .limit(1);
      
      const skill = await db.select().from(skillDevelopmentAnalytics)
        .where(eq(skillDevelopmentAnalytics.userId, userId))
        .orderBy(desc(skillDevelopmentAnalytics.timestampRecorded))
        .limit(1);
      
      const academic = await db.select().from(academicAthleticAnalytics)
        .where(eq(academicAthleticAnalytics.userId, userId))
        .orderBy(desc(academicAthleticAnalytics.timestampRecorded))
        .limit(1);
      
      const aiCoach = await db.select().from(aiCoachAnalytics)
        .where(eq(aiCoachAnalytics.userId, userId))
        .orderBy(desc(aiCoachAnalytics.timestampRecorded))
        .limit(1);
      
      const crossSport = await db.select().from(crossSportAnalytics)
        .where(eq(crossSportAnalytics.userId, userId))
        .orderBy(desc(crossSportAnalytics.timestampRecorded))
        .limit(1);
      
      const recruiting = await db.select().from(recruitingAnalytics)
        .where(eq(recruitingAnalytics.userId, userId))
        .orderBy(desc(recruitingAnalytics.timestampRecorded))
        .limit(1);
      
      const neurodivergent = await db.select().from(neurodivergentAnalytics)
        .where(eq(neurodivergentAnalytics.userId, userId))
        .orderBy(desc(neurodivergentAnalytics.timestampRecorded))
        .limit(1);
      
      const community = await db.select().from(communityAnalytics)
        .where(eq(communityAnalytics.userId, userId))
        .orderBy(desc(communityAnalytics.timestampRecorded))
        .limit(1);

      // Combine into a comprehensive overview
      return {
        success: true,
        analytics: {
          starPath: starPath[0] || null,
          engagement: engagement[0] || null,
          workout: workout[0] || null,
          skill: skill[0] || null,
          academic: academic[0] || null,
          aiCoach: aiCoach[0] || null,
          crossSport: crossSport[0] || null,
          recruiting: recruiting[0] || null,
          neurodivergent: neurodivergent[0] || null,
          community: community[0] || null
        },
        summary: this.generateAnalyticsSummary({
          starPath: starPath[0] || null,
          engagement: engagement[0] || null,
          workout: workout[0] || null,
          skill: skill[0] || null,
          academic: academic[0] || null,
          aiCoach: aiCoach[0] || null,
          crossSport: crossSport[0] || null,
          recruiting: recruiting[0] || null,
          neurodivergent: neurodivergent[0] || null,
          community: community[0] || null
        })
      };
    } catch (error) {
      console.error('Error getting user analytics overview:', error);
      return {
        success: false,
        message: 'Error getting user analytics overview',
        error
      };
    }
  }

  /**
   * Generate human-readable analytics summary
   */
  private generateAnalyticsSummary(data: Record<string, any>) {
    const summary: Record<string, any> = {};
    
    // Star Path Summary
    if (data.starPath) {
      summary.starPath = {
        currentLevel: data.starPath.currentStarLevel,
        progress: `${data.starPath.progressPercentage.toFixed(1)}%`,
        estimatedDaysToNextLevel: data.starPath.nextLevelEstimatedDays,
        recommendation: data.starPath.recommendedFocus
      };
    }
    
    // Workout Summary
    if (data.workout) {
      summary.workout = {
        streak: data.workout.consistencyStreak,
        bestStreak: data.workout.bestStreak,
        formQuality: data.workout.formQualityScore 
          ? `${data.workout.formQualityScore.toFixed(1)}/100`
          : 'Not available',
        improvement: data.workout.formImprovementRate
          ? `${data.workout.formImprovementRate > 0 ? '+' : ''}${data.workout.formImprovementRate.toFixed(1)}%`
          : 'Not available'
      };
    }
    
    // Academics Summary
    if (data.academic) {
      summary.academic = {
        gpa: data.academic.currentGPA.toFixed(2),
        balanceScore: `${data.academic.balanceScore.toFixed(1)}/100`,
        strongestSubjects: data.academic.strongestSubjects,
        recommendation: data.academic.recommendedSubjectFocus
      };
    }
    
    // Recruiting Summary
    if (data.recruiting) {
      summary.recruiting = {
        garScore: data.recruiting.overallGARScore.toFixed(1),
        scholarshipPotential: `${data.recruiting.scholarshipPotentialScore.toFixed(1)}%`,
        nationalRanking: `#${data.recruiting.nationalRankingProjection}`,
        profileCompleteness: `${data.recruiting.recruitingProfileCompleteness.toFixed(1)}%`
      };
    }
    
    // Neurodivergent Summary
    if (data.neurodivergent) {
      // Find most effective accommodation
      let mostEffectiveAccommodation = '';
      let highestEffectiveness = 0;
      
      if (data.neurodivergent.accommodationEffectiveness) {
        Object.entries(data.neurodivergent.accommodationEffectiveness).forEach(([key, value]: [string, any]) => {
          if (value > highestEffectiveness) {
            highestEffectiveness = value;
            mostEffectiveAccommodation = key;
          }
        });
      }
      
      summary.neurodivergent = {
        optimalSessionDuration: `${data.neurodivergent.optimalSessionDuration} minutes`,
        visualPreference: `${(data.neurodivergent.visualVsTextualPreference * 100).toFixed(1)}%`,
        recoveryTime: `${data.neurodivergent.recoveryTime} seconds`,
        mostEffectiveAccommodation
      };
    }
    
    return summary;
  }

  /**
   * Helper function to calculate correlation between two arrays
   */
  private calculateCorrelation(x: (number | undefined)[], y: (number | undefined)[]): number {
    // Filter out undefined values
    const validPairs = x.map((val, i) => [val, y[i]])
      .filter(pair => pair[0] !== undefined && pair[1] !== undefined) as [number, number][];
    
    if (validPairs.length < 2) return 0;
    
    const xValues = validPairs.map(pair => pair[0]);
    const yValues = validPairs.map(pair => pair[1]);
    
    const xMean = xValues.reduce((sum, val) => sum + val, 0) / xValues.length;
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
    
    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;
    
    for (let i = 0; i < xValues.length; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = yValues[i] - yMean;
      numerator += xDiff * yDiff;
      xDenominator += xDiff * xDiff;
      yDenominator += yDiff * yDiff;
    }
    
    if (xDenominator === 0 || yDenominator === 0) return 0;
    
    return numerator / Math.sqrt(xDenominator * yDenominator);
  }

  /**
   * Get system-wide analytics (for admin dashboard)
   */
  async getSystemAnalytics(dateRange?: { start: Date, end: Date }) {
    try {
      // Query filters
      const dateFilter = dateRange
        ? and(
            gte(userSessionAnalytics.sessionStartTime, dateRange.start),
            lte(userSessionAnalytics.sessionStartTime, dateRange.end)
          )
        : undefined;
      
      // Get session data
      const sessionData = dateFilter
        ? await db.select().from(userSessionAnalytics).where(dateFilter)
        : await db.select().from(userSessionAnalytics);
      
      // Get user counts
      const userCount = await db.select({ count: sql`count(*)` }).from(users);
      const totalUsers = Number(userCount[0].count) || 0;
      
      // Get workout data
      const workoutData = dateFilter
        ? await db.select().from(workoutAnalytics).where(dateFilter)
        : await db.select().from(workoutAnalytics);
      
      // Get star path data
      const starPathData = dateFilter
        ? await db.select().from(starPathAnalytics).where(dateFilter)
        : await db.select().from(starPathAnalytics);
      
      // Get neurodivergent analytics
      const neurodivergentData = dateFilter
        ? await db.select().from(neurodivergentAnalytics).where(dateFilter)
        : await db.select().from(neurodivergentAnalytics);
      
      // Calculate system metrics
      const systemMetrics = {
        totalUsers,
        activeUsers: new Set(sessionData.map(s => s.userId)).size,
        totalSessions: sessionData.length,
        avgSessionDuration: this.calculateAverage(sessionData.map(s => s.sessionDuration)),
        bounceRate: this.calculatePercentage(sessionData.filter(s => s.bounced).length, sessionData.length),
        deviceBreakdown: this.calculateDeviceBreakdown(sessionData),
      };
      
      // Calculate workout metrics
      const workoutMetrics = {
        totalWorkouts: workoutData.length,
        completionRate: this.calculatePercentage(
          workoutData.filter(w => w.completionSuccess).length,
          workoutData.length
        ),
        avgWorkoutDuration: this.calculateAverage(workoutData.map(w => w.workoutDuration)),
        popularWorkoutTypes: this.getTopItems(workoutData.map(w => w.workoutType), 5),
      };
      
      // Calculate ADHD-specific metrics
      const adhdMetrics = {
        avgAttentionSpan: this.calculateAverage(neurodivergentData.map(n => n.optimalSessionDuration)) || 0,
        avgVisualPreference: this.calculateAverage(neurodivergentData.map(n => n.visualVsTextualPreference)) || 0,
        avgRecoveryTime: this.calculateAverage(neurodivergentData.map(n => n.recoveryTime)) || 0,
        mostEffectiveFeatures: this.calculateMostEffectiveAdhdFeatures(neurodivergentData)
      };
      
      return {
        success: true,
        systemMetrics,
        workoutMetrics,
        adhdMetrics,
        starPathDistribution: this.calculateStarPathDistribution(starPathData),
        timeOfDayUsage: this.calculateUsageByTimeOfDay(sessionData)
      };
    } catch (error) {
      console.error('Error getting system analytics:', error);
      return {
        success: false,
        message: 'Error getting system analytics',
        error
      };
    }
  }
  
  /**
   * Calculate most effective ADHD-friendly features
   */
  private calculateMostEffectiveAdhdFeatures(neurodivergentData: any[]) {
    // Extract all accommodationEffectiveness objects
    const allAccommodations: Record<string, number[]> = {};
    
    neurodivergentData.forEach(data => {
      if (data.accommodationEffectiveness) {
        Object.entries(data.accommodationEffectiveness).forEach(([feature, effectiveness]) => {
          if (!allAccommodations[feature]) {
            allAccommodations[feature] = [];
          }
          allAccommodations[feature].push(effectiveness as number);
        });
      }
    });
    
    // Calculate average effectiveness for each feature
    const avgEffectiveness = Object.entries(allAccommodations).map(([feature, scores]) => ({
      feature,
      effectiveness: this.calculateAverage(scores)
    }));
    
    // Sort by effectiveness (descending)
    return avgEffectiveness.sort((a, b) => b.effectiveness - a.effectiveness);
  }
  
  /**
   * Calculate Star Path level distribution
   */
  private calculateStarPathDistribution(starPathData: any[]) {
    const distribution: Record<number, number> = {};
    
    starPathData.forEach(data => {
      const level = data.currentStarLevel;
      if (!distribution[level]) {
        distribution[level] = 0;
      }
      distribution[level]++;
    });
    
    return Object.entries(distribution).map(([level, count]) => ({
      level: parseInt(level),
      count,
      percentage: (count / starPathData.length) * 100
    }));
  }
  
  /**
   * Calculate usage by time of day
   */
  private calculateUsageByTimeOfDay(sessionData: any[]) {
    const timeSlots = {
      morning: 0,   // 6am-12pm
      afternoon: 0, // 12pm-6pm
      evening: 0,   // 6pm-12am
      night: 0      // 12am-6am
    };
    
    sessionData.forEach(session => {
      if (!session.sessionStartTime) return;
      
      const hour = new Date(session.sessionStartTime).getHours();
      
      if (hour >= 6 && hour < 12) {
        timeSlots.morning++;
      } else if (hour >= 12 && hour < 18) {
        timeSlots.afternoon++;
      } else if (hour >= 18 && hour < 24) {
        timeSlots.evening++;
      } else {
        timeSlots.night++;
      }
    });
    
    return Object.entries(timeSlots).map(([timeSlot, count]) => ({
      timeSlot,
      count,
      percentage: (count / sessionData.length) * 100
    }));
  }
  
  /**
   * Get analytics dashboard data
   */
  async getAnalyticsDashboardData(userId?: number, dateRange?: { start: Date, end: Date }) {
    try {
      // Query filters
      const dateFilter = dateRange
        ? and(
            gte(userSessionAnalytics.sessionStartTime, dateRange.start),
            lte(userSessionAnalytics.sessionStartTime, dateRange.end)
          )
        : undefined;
      
      const userFilter = userId
        ? eq(userSessionAnalytics.userId, userId)
        : undefined;
      
      const whereConditions = [dateFilter, userFilter].filter(Boolean);
      const whereClause = whereConditions.length > 0
        ? and(...whereConditions)
        : undefined;
      
      // Get session data
      const sessionData = whereClause
        ? await db.select().from(userSessionAnalytics).where(whereClause)
        : await db.select().from(userSessionAnalytics);
      
      // Prepare dashboard data
      const dashboard = {
        sessionMetrics: {
          totalSessions: sessionData.length,
          avgSessionDuration: this.calculateAverage(sessionData.map(s => s.sessionDuration)),
          bounceRate: this.calculatePercentage(sessionData.filter(s => s.bounced).length, sessionData.length),
          mostVisitedPages: this.getTopItems(
            sessionData.flatMap(s => s.pagesVisited || []),
            5
          )
        },
        userEngagement: {
          activeUsers: new Set(sessionData.map(s => s.userId)).size,
          returningUserRate: this.calculateReturningUserRate(sessionData),
          peakUsageTimes: this.calculatePeakUsageTimes(sessionData),
          deviceBreakdown: this.calculateDeviceBreakdown(sessionData)
        },
        athleteDevelopment: {
          // These would be aggregated from other analytics tables
          avgStarLevel: 0,
          avgGarScore: 0,
          workoutCompletionRate: 0,
          mostImprovingSkills: []
        },
        neurodivergentInsights: {
          // These would be aggregated from neurodivergent analytics
          avgAttentionSpan: 0,
          mostEffectiveFeatures: [],
          optimalSessionDuration: 0,
          visualPreferenceRate: 0
        }
      };
      
      // If we have a specific user, get their specific development metrics
      if (userId) {
        const athleteDevelopment = await this.getAthleteDevelopmentMetrics(userId);
        dashboard.athleteDevelopment = athleteDevelopment;
        
        const neurodivergentInsights = await this.getNeurodivergentInsights(userId);
        dashboard.neurodivergentInsights = neurodivergentInsights;
      } else {
        // Get aggregated metrics for all users
        const athleteDevelopment = await this.getAggregatedDevelopmentMetrics();
        dashboard.athleteDevelopment = athleteDevelopment;
        
        const neurodivergentInsights = await this.getAggregatedNeurodivergentInsights();
        dashboard.neurodivergentInsights = neurodivergentInsights;
      }
      
      return {
        success: true,
        dashboard
      };
    } catch (error) {
      console.error('Error getting analytics dashboard data:', error);
      return {
        success: false,
        message: 'Error getting analytics dashboard data',
        error
      };
    }
  }

  /**
   * Get athlete development metrics for a specific user
   */
  private async getAthleteDevelopmentMetrics(userId: number) {
    // Get star path data
    const starPathData = await db.select()
      .from(starPathAnalytics)
      .where(eq(starPathAnalytics.userId, userId))
      .orderBy(desc(starPathAnalytics.timestampRecorded))
      .limit(1);
    
    // Get recruiting data for GAR score
    const recruitingData = await db.select()
      .from(recruitingAnalytics)
      .where(eq(recruitingAnalytics.userId, userId))
      .orderBy(desc(recruitingAnalytics.timestampRecorded))
      .limit(1);
    
    // Get workout data
    const workoutData = await db.select()
      .from(workoutAnalytics)
      .where(eq(workoutAnalytics.userId, userId))
      .orderBy(desc(workoutAnalytics.timestampRecorded));
    
    // Get skill development data
    const skillData = await db.select()
      .from(skillDevelopmentAnalytics)
      .where(eq(skillDevelopmentAnalytics.userId, userId))
      .orderBy(desc(skillDevelopmentAnalytics.improvementRate));
    
    return {
      avgStarLevel: starPathData.length > 0 ? starPathData[0].currentStarLevel : 0,
      avgGarScore: recruitingData.length > 0 ? recruitingData[0].overallGARScore : 0,
      workoutCompletionRate: this.calculatePercentage(
        workoutData.filter(w => w.completionSuccess).length,
        workoutData.length
      ),
      mostImprovingSkills: skillData
        .slice(0, 5)
        .map(s => ({
          name: s.skillName,
          category: s.skillCategory,
          sport: s.sportType,
          rate: s.improvementRate
        }))
    };
  }

  /**
   * Get aggregated development metrics for all users
   */
  private async getAggregatedDevelopmentMetrics() {
    // Get average star level
    const starPathData = await db.select()
      .from(starPathAnalytics)
      .orderBy(desc(starPathAnalytics.timestampRecorded));
    
    const starLevels = this.aggregateByUser(starPathData, 'currentStarLevel');
    
    // Get average GAR score
    const recruitingData = await db.select()
      .from(recruitingAnalytics)
      .orderBy(desc(recruitingAnalytics.timestampRecorded));
    
    const garScores = this.aggregateByUser(recruitingData, 'overallGARScore');
    
    // Get workout completion rate
    const workoutData = await db.select()
      .from(workoutAnalytics);
    
    const completionRate = this.calculatePercentage(
      workoutData.filter(w => w.completionSuccess).length,
      workoutData.length
    );
    
    // Get most improving skills across all users
    const skillData = await db.select()
      .from(skillDevelopmentAnalytics)
      .orderBy(desc(skillDevelopmentAnalytics.improvementRate))
      .limit(100);
    
    const skillsByName: Record<string, { count: number, totalRate: number }> = {};
    skillData.forEach(skill => {
      const key = `${skill.sportType}:${skill.skillCategory}:${skill.skillName}`;
      if (!skillsByName[key]) skillsByName[key] = { count: 0, totalRate: 0 };
      skillsByName[key].count++;
      skillsByName[key].totalRate += skill.improvementRate || 0;
    });
    
    const topSkills = Object.entries(skillsByName)
      .map(([key, data]) => {
        const [sport, category, name] = key.split(':');
        return {
          name,
          category,
          sport,
          rate: data.totalRate / data.count
        };
      })
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);
    
    return {
      avgStarLevel: this.calculateAverage(starLevels),
      avgGarScore: this.calculateAverage(garScores),
      workoutCompletionRate: completionRate,
      mostImprovingSkills: topSkills
    };
  }

  /**
   * Helper to aggregate by user and return full objects
   */
  private aggregateByUserObject<T extends { userId: number }>(data: T[]): T[] {
    const userMap: Record<number, T> = {};
    
    // Group by user and take most recent value
    data.forEach(item => {
      if (!userMap[item.userId]) {
        userMap[item.userId] = item;
      }
    });
    
    return Object.values(userMap);
  }

  /**
   * Helper to aggregate the most recent value by user
   */
  private aggregateByUser<T extends { userId: number }>(data: T[], field: keyof T): number[] {
    const userMap: Record<number, any> = {};
    
    // Group by user and take most recent value
    data.forEach(item => {
      if (!userMap[item.userId] && item[field] !== undefined && item[field] !== null) {
        userMap[item.userId] = item[field];
      }
    });
    
    return Object.values(userMap);
  }

  /**
   * Get neurodivergent insights for a specific user
   */
  private async getNeurodivergentInsights(userId: number) {
    // Get neurodivergent analytics data
    const ndData = await db.select()
      .from(neurodivergentAnalytics)
      .where(eq(neurodivergentAnalytics.userId, userId))
      .orderBy(desc(neurodivergentAnalytics.timestampRecorded))
      .limit(1);
    
    // Get engagement analytics for attention span
    const engagementData = await db.select()
      .from(engagementAnalytics)
      .where(eq(engagementAnalytics.userId, userId))
      .orderBy(desc(engagementAnalytics.timestampRecorded));
    
    if (ndData.length === 0) {
      return {
        avgAttentionSpan: 0,
        mostEffectiveFeatures: [],
        optimalSessionDuration: 0,
        visualPreferenceRate: 0
      };
    }
    
    // Find most effective features
    const nd = ndData[0];
    let mostEffectiveFeatures: { name: string, effectiveness: number }[] = [];
    
    if (nd.accommodationEffectiveness) {
      mostEffectiveFeatures = Object.entries(nd.accommodationEffectiveness)
        .map(([name, effectiveness]) => ({ name, effectiveness: effectiveness as number }))
        .sort((a, b) => b.effectiveness - a.effectiveness)
        .slice(0, 3);
    }
    
    // Calculate average attention span from engagement data
    const attentionSpans = engagementData
      .map(e => e.attentionSpanAverage)
      .filter(Boolean) as number[];
    
    const avgAttentionSpan = attentionSpans.length > 0
      ? this.calculateAverage(attentionSpans)
      : 0;
    
    return {
      avgAttentionSpan,
      mostEffectiveFeatures,
      optimalSessionDuration: nd.optimalSessionDuration || 0,
      visualPreferenceRate: (nd.visualVsTextualPreference || 0) * 100
    };
  }

  /**
   * Get aggregated neurodivergent insights for all users
   */
  private async getAggregatedNeurodivergentInsights() {
    // Get neurodivergent analytics data
    const ndData = await db.select()
      .from(neurodivergentAnalytics)
      .orderBy(desc(neurodivergentAnalytics.timestampRecorded));
    
    // Get engagement analytics for attention span
    const engagementData = await db.select()
      .from(engagementAnalytics)
      .orderBy(desc(engagementAnalytics.timestampRecorded));
    
    if (ndData.length === 0) {
      return {
        avgAttentionSpan: 0,
        mostEffectiveFeatures: [],
        optimalSessionDuration: 0,
        visualPreferenceRate: 0
      };
    }
    
    // Aggregate neurodivergent data by user
    const ndByUser = this.aggregateByUserObject(ndData);
    
    // Aggregate accommodation effectiveness
    const allAccommodations: Record<string, { count: number, totalEffectiveness: number }> = {};
    
    ndByUser.forEach(nd => {
      if (nd.accommodationEffectiveness) {
        Object.entries(nd.accommodationEffectiveness).forEach(([name, effectiveness]) => {
          if (!allAccommodations[name]) {
            allAccommodations[name] = { count: 0, totalEffectiveness: 0 };
          }
          allAccommodations[name].count++;
          allAccommodations[name].totalEffectiveness += effectiveness as number;
        });
      }
    });
    
    // Find most effective features overall
    const mostEffectiveFeatures = Object.entries(allAccommodations)
      .map(([name, data]) => ({
        name,
        effectiveness: data.totalEffectiveness / data.count
      }))
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 3);
    
    // Calculate average attention span
    const attentionSpans = engagementData
      .map(e => e.attentionSpanAverage)
      .filter(Boolean) as number[];
    
    const avgAttentionSpan = attentionSpans.length > 0
      ? this.calculateAverage(attentionSpans)
      : 0;
    
    // Calculate average optimal session duration
    const sessionDurations = ndByUser
      .map(nd => nd.optimalSessionDuration)
      .filter(Boolean) as number[];
    
    const avgSessionDuration = sessionDurations.length > 0
      ? this.calculateAverage(sessionDurations)
      : 0;
    
    // Calculate average visual preference rate
    const visualPreferences = ndByUser
      .map(nd => nd.visualVsTextualPreference)
      .filter(Boolean) as number[];
    
    const avgVisualPreference = visualPreferences.length > 0
      ? this.calculateAverage(visualPreferences) * 100
      : 0;
    
    return {
      avgAttentionSpan,
      mostEffectiveFeatures,
      optimalSessionDuration: avgSessionDuration,
      visualPreferenceRate: avgVisualPreference
    };
  }



  /**
   * Helper function to calculate average
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Helper function to calculate percentage
   */
  private calculatePercentage(part: number, total: number): number {
    if (total === 0) return 0;
    return (part / total) * 100;
  }

  /**
   * Helper function to get top items
   */
  private getTopItems(items: string[], limit: number): { item: string, count: number }[] {
    const counts: Record<string, number> = {};
    
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Helper function to calculate returning user rate
   */
  private calculateReturningUserRate(sessions: typeof userSessionAnalytics.$inferSelect[]): number {
    const userSessions: Record<number, number> = {};
    
    sessions.forEach(session => {
      userSessions[session.userId] = (userSessions[session.userId] || 0) + 1;
    });
    
    const returningUsers = Object.values(userSessions).filter(count => count > 1).length;
    const totalUsers = Object.keys(userSessions).length;
    
    return this.calculatePercentage(returningUsers, totalUsers);
  }

  /**
   * Helper function to calculate peak usage times
   */
  private calculatePeakUsageTimes(sessions: typeof userSessionAnalytics.$inferSelect[]): { 
    hour: number, 
    count: number 
  }[] {
    const hourCounts: Record<number, number> = {};
    
    sessions.forEach(session => {
      if (session.sessionStartTime) {
        const hour = new Date(session.sessionStartTime).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    
    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }

  /**
   * Helper function to calculate device breakdown
   */
  private calculateDeviceBreakdown(sessions: typeof userSessionAnalytics.$inferSelect[]): {
    type: string,
    count: number,
    percentage: number
  }[] {
    const deviceCounts: Record<string, number> = {};
    let totalDevices = 0;
    
    sessions.forEach(session => {
      if (session.deviceInfo?.deviceType) {
        const deviceType = session.deviceInfo.deviceType as string;
        deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
        totalDevices++;
      }
    });
    
    return Object.entries(deviceCounts)
      .map(([type, count]) => ({
        type,
        count,
        percentage: this.calculatePercentage(count, totalDevices)
      }))
      .sort((a, b) => b.count - a.count);
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;