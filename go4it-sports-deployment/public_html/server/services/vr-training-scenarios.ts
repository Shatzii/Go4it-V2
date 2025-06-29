/**
 * Go4It Sports - Virtual Reality Training Scenarios Service
 * 
 * Provides immersive VR training environments specifically designed for 
 * neurodivergent student athletes with ADHD-optimized scenarios.
 */

import { Request, Response } from 'express';

// VR Training Scenario Types
export interface VRScenario {
  id: string;
  name: string;
  sport: 'flag-football' | 'soccer' | 'basketball' | 'track-field';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  adhdOptimized: boolean;
  duration: number; // minutes
  focusLevel: 'high' | 'medium' | 'low';
  environmentType: 'stadium' | 'practice-field' | 'indoor-gym' | 'track';
  scenarios: VRScenarioElement[];
  adhdFeatures: {
    attentionBreaks: boolean;
    visualCues: boolean;
    simplifiedInstructions: boolean;
    progressTracking: boolean;
    immediateRewards: boolean;
  };
}

export interface VRScenarioElement {
  id: string;
  type: 'decision-making' | 'skill-practice' | 'game-situation' | 'mental-training';
  description: string;
  objectives: string[];
  successMetrics: string[];
  adhdAdaptations: string[];
}

export interface VRSession {
  id: string;
  athleteId: string;
  scenarioId: string;
  startTime: Date;
  endTime?: Date;
  performance: {
    decisionAccuracy: number;
    reactionTime: number;
    focusLevel: number;
    completionRate: number;
    adhdAdaptationsUsed: string[];
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
  };
}

// VR Training Scenarios Database
const vrScenarios: VRScenario[] = [
  {
    id: 'ff-quarterback-decisions',
    name: 'Quarterback Decision Making',
    sport: 'flag-football',
    difficulty: 'intermediate',
    adhdOptimized: true,
    duration: 15,
    focusLevel: 'high',
    environmentType: 'practice-field',
    scenarios: [
      {
        id: 'read-defense',
        type: 'decision-making',
        description: 'Read defensive formations and choose optimal play',
        objectives: ['Identify coverage type', 'Select best receiver', 'Execute throw timing'],
        successMetrics: ['Decision speed < 3 seconds', 'Accuracy > 80%', 'Pressure handling'],
        adhdAdaptations: ['Color-coded receivers', 'Simplified route concepts', 'Visual timer display']
      },
      {
        id: 'pocket-presence',
        type: 'skill-practice',
        description: 'Maintain composure under pressure',
        objectives: ['Step up in pocket', 'Keep eyes downfield', 'Avoid sacks'],
        successMetrics: ['Pocket time > 4 seconds', 'Completion rate > 70%', 'Turnover avoidance'],
        adhdAdaptations: ['Breathing reminders', 'Focus point indicators', 'Calm zone visualization']
      }
    ],
    adhdFeatures: {
      attentionBreaks: true,
      visualCues: true,
      simplifiedInstructions: true,
      progressTracking: true,
      immediateRewards: true
    }
  },
  {
    id: 'soccer-midfielder-vision',
    name: 'Midfielder Vision Training',
    sport: 'soccer',
    difficulty: 'advanced',
    adhdOptimized: true,
    duration: 20,
    focusLevel: 'high',
    environmentType: 'stadium',
    scenarios: [
      {
        id: 'field-scanning',
        type: 'decision-making',
        description: 'Scan field for passing opportunities',
        objectives: ['Identify open teammates', 'Assess defensive pressure', 'Execute accurate passes'],
        successMetrics: ['Scan frequency > 8/minute', 'Pass accuracy > 85%', 'Assists created'],
        adhdAdaptations: ['Scan reminder signals', 'Highlighted passing lanes', 'Simplified decision tree']
      },
      {
        id: 'transition-play',
        type: 'game-situation',
        description: 'Quick transition from defense to attack',
        objectives: ['Win ball possession', 'Switch play quickly', 'Support attack'],
        successMetrics: ['Transition time < 5 seconds', 'Possession retention', 'Forward progress'],
        adhdAdaptations: ['Action sequence coaching', 'Priority target highlighting', 'Energy management cues']
      }
    ],
    adhdFeatures: {
      attentionBreaks: true,
      visualCues: true,
      simplifiedInstructions: true,
      progressTracking: true,
      immediateRewards: true
    }
  },
  {
    id: 'basketball-point-guard',
    name: 'Point Guard Leadership',
    sport: 'basketball',
    difficulty: 'advanced',
    adhdOptimized: true,
    duration: 18,
    focusLevel: 'high',
    environmentType: 'indoor-gym',
    scenarios: [
      {
        id: 'floor-general',
        type: 'decision-making',
        description: 'Direct team offense and manage game flow',
        objectives: ['Call plays effectively', 'Distribute ball efficiently', 'Control tempo'],
        successMetrics: ['Assist-to-turnover ratio > 3:1', 'Team shooting %', 'Game management'],
        adhdAdaptations: ['Play call reminders', 'Teammate highlighting', 'Tempo visual indicators']
      },
      {
        id: 'defensive-pressure',
        type: 'mental-training',
        description: 'Maintain composure under full-court press',
        objectives: ['Break press effectively', 'Avoid turnovers', 'Find open teammates'],
        successMetrics: ['Press break success > 80%', 'Turnover rate < 10%', 'Fast break creation'],
        adhdAdaptations: ['Pressure breathing techniques', 'Escape route highlighting', 'Confidence mantras']
      }
    ],
    adhdFeatures: {
      attentionBreaks: true,
      visualCues: true,
      simplifiedInstructions: true,
      progressTracking: true,
      immediateRewards: true
    }
  },
  {
    id: 'track-sprinter-blocks',
    name: 'Sprinter Start Training',
    sport: 'track-field',
    difficulty: 'beginner',
    adhdOptimized: true,
    duration: 12,
    focusLevel: 'high',
    environmentType: 'track',
    scenarios: [
      {
        id: 'perfect-start',
        type: 'skill-practice',
        description: 'Master starting block technique',
        objectives: ['Optimal block position', 'Explosive drive phase', 'Acceleration mechanics'],
        successMetrics: ['Reaction time < 0.15s', 'Drive angle 45°', 'First step power'],
        adhdAdaptations: ['Rhythm counting', 'Visual start cues', 'Muscle memory drills']
      },
      {
        id: 'race-simulation',
        type: 'game-situation',
        description: 'Simulate competitive race environment',
        objectives: ['Handle starting pressure', 'Maintain lane discipline', 'Execute race strategy'],
        successMetrics: ['Start consistency', 'Lane maintenance', 'Finish strong'],
        adhdAdaptations: ['Anxiety management', 'Focus anchoring', 'Performance visualization']
      }
    ],
    adhdFeatures: {
      attentionBreaks: true,
      visualCues: true,
      simplifiedInstructions: true,
      progressTracking: true,
      immediateRewards: true
    }
  }
];

// VR Training Service Class
export class VRTrainingService {
  private sessions: Map<string, VRSession> = new Map();
  private activeScenarios: Map<string, VRScenario> = new Map();

  constructor() {
    // Initialize scenarios
    vrScenarios.forEach(scenario => {
      this.activeScenarios.set(scenario.id, scenario);
    });
  }

  /**
   * Get all available VR scenarios for a sport
   */
  async getScenariosBySport(sport: string): Promise<VRScenario[]> {
    return vrScenarios.filter(scenario => scenario.sport === sport);
  }

  /**
   * Get ADHD-optimized scenarios for an athlete
   */
  async getADHDOptimizedScenarios(athleteId: string, sport: string): Promise<VRScenario[]> {
    const scenarios = await this.getScenariosBySport(sport);
    return scenarios.filter(scenario => scenario.adhdOptimized);
  }

  /**
   * Start a VR training session
   */
  async startVRSession(athleteId: string, scenarioId: string): Promise<VRSession> {
    const scenario = this.activeScenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    const session: VRSession = {
      id: `vr-${Date.now()}-${athleteId}`,
      athleteId,
      scenarioId,
      startTime: new Date(),
      performance: {
        decisionAccuracy: 0,
        reactionTime: 0,
        focusLevel: 0,
        completionRate: 0,
        adhdAdaptationsUsed: []
      },
      feedback: {
        strengths: [],
        improvements: [],
        nextSteps: []
      }
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Update VR session performance
   */
  async updateSessionPerformance(sessionId: string, performance: Partial<VRSession['performance']>): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.performance = { ...session.performance, ...performance };
    this.sessions.set(sessionId, session);
  }

  /**
   * Complete VR training session
   */
  async completeVRSession(sessionId: string): Promise<VRSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.endTime = new Date();
    
    // Generate ADHD-specific feedback
    session.feedback = await this.generateADHDFeedback(session);
    
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Generate ADHD-specific feedback for VR session
   */
  private async generateADHDFeedback(session: VRSession): Promise<VRSession['feedback']> {
    const scenario = this.activeScenarios.get(session.scenarioId);
    if (!scenario) {
      throw new Error(`Scenario ${session.scenarioId} not found`);
    }

    const feedback: VRSession['feedback'] = {
      strengths: [],
      improvements: [],
      nextSteps: []
    };

    // Analyze performance and provide ADHD-specific feedback
    if (session.performance.focusLevel > 7) {
      feedback.strengths.push('Excellent focus maintenance throughout VR session');
      feedback.strengths.push('Successfully used ADHD adaptations to stay engaged');
    }

    if (session.performance.decisionAccuracy > 80) {
      feedback.strengths.push('Strong decision-making under VR pressure');
    }

    if (session.performance.completionRate < 70) {
      feedback.improvements.push('Consider shorter VR sessions to maintain attention');
      feedback.improvements.push('Use more visual cues and simplified instructions');
    }

    if (session.performance.reactionTime > 2) {
      feedback.improvements.push('Practice quick decision-making drills');
      feedback.nextSteps.push('Try beginner-level scenarios to build confidence');
    }

    // ADHD-specific next steps
    feedback.nextSteps.push('Schedule VR sessions during peak attention hours');
    feedback.nextSteps.push('Combine VR training with real-world practice');
    feedback.nextSteps.push('Track progress with immediate rewards system');

    return feedback;
  }

  /**
   * Get VR session history for athlete
   */
  async getSessionHistory(athleteId: string): Promise<VRSession[]> {
    const sessions = Array.from(this.sessions.values());
    return sessions.filter(session => session.athleteId === athleteId);
  }

  /**
   * Get VR performance analytics
   */
  async getVRAnalytics(athleteId: string): Promise<{
    totalSessions: number;
    averagePerformance: VRSession['performance'];
    improvementTrend: number;
    recommendedScenarios: string[];
  }> {
    const sessions = await this.getSessionHistory(athleteId);
    const completedSessions = sessions.filter(s => s.endTime);

    if (completedSessions.length === 0) {
      return {
        totalSessions: 0,
        averagePerformance: {
          decisionAccuracy: 0,
          reactionTime: 0,
          focusLevel: 0,
          completionRate: 0,
          adhdAdaptationsUsed: []
        },
        improvementTrend: 0,
        recommendedScenarios: []
      };
    }

    // Calculate averages
    const averagePerformance = completedSessions.reduce((avg, session) => ({
      decisionAccuracy: avg.decisionAccuracy + session.performance.decisionAccuracy,
      reactionTime: avg.reactionTime + session.performance.reactionTime,
      focusLevel: avg.focusLevel + session.performance.focusLevel,
      completionRate: avg.completionRate + session.performance.completionRate,
      adhdAdaptationsUsed: [...new Set([...avg.adhdAdaptationsUsed, ...session.performance.adhdAdaptationsUsed])]
    }), {
      decisionAccuracy: 0,
      reactionTime: 0,
      focusLevel: 0,
      completionRate: 0,
      adhdAdaptationsUsed: [] as string[]
    });

    const sessionCount = completedSessions.length;
    averagePerformance.decisionAccuracy /= sessionCount;
    averagePerformance.reactionTime /= sessionCount;
    averagePerformance.focusLevel /= sessionCount;
    averagePerformance.completionRate /= sessionCount;

    // Calculate improvement trend
    const recentSessions = completedSessions.slice(-5);
    const earlierSessions = completedSessions.slice(0, -5);
    const improvementTrend = recentSessions.length > 0 && earlierSessions.length > 0 
      ? (recentSessions.reduce((sum, s) => sum + s.performance.decisionAccuracy, 0) / recentSessions.length) -
        (earlierSessions.reduce((sum, s) => sum + s.performance.decisionAccuracy, 0) / earlierSessions.length)
      : 0;

    // Get recommended scenarios based on performance
    const recommendedScenarios = this.getRecommendedScenarios(averagePerformance);

    return {
      totalSessions: sessionCount,
      averagePerformance,
      improvementTrend,
      recommendedScenarios
    };
  }

  /**
   * Get recommended scenarios based on performance
   */
  private getRecommendedScenarios(performance: VRSession['performance']): string[] {
    const recommendations: string[] = [];

    if (performance.decisionAccuracy < 60) {
      recommendations.push('Start with beginner decision-making scenarios');
    } else if (performance.decisionAccuracy > 85) {
      recommendations.push('Try advanced game-situation scenarios');
    }

    if (performance.focusLevel < 6) {
      recommendations.push('Use shorter scenarios with attention breaks');
    }

    if (performance.reactionTime > 3) {
      recommendations.push('Practice quick-response skill drills');
    }

    return recommendations;
  }
}

// Export service instance
export const vrTrainingService = new VRTrainingService();