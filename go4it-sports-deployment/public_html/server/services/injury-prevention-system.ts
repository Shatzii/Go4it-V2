/**
 * Go4It Sports - Predictive Injury Prevention System
 * 
 * Advanced biomechanical analysis and injury risk assessment with
 * ADHD-specific considerations for movement patterns and attention management.
 */

import { Request, Response } from 'express';

// Injury Prevention Types
export interface BiomechanicalData {
  id: string;
  athleteId: string;
  timestamp: Date;
  sport: string;
  activity: string;
  sensorData: {
    accelerometer: { x: number; y: number; z: number }[];
    gyroscope: { x: number; y: number; z: number }[];
    magnetometer: { x: number; y: number; z: number }[];
    heartRate: number[];
    gpsCoordinates?: { lat: number; lng: number; altitude: number }[];
  };
  movementPatterns: {
    velocity: number[];
    acceleration: number[];
    deceleration: number[];
    jumpHeight: number[];
    landingForce: number[];
    rotationalSpeed: number[];
  };
  contextualFactors: {
    fatigue: number; // 1-10 scale
    hydration: number; // 1-10 scale
    sleep: number; // hours
    nutrition: number; // 1-10 scale
    stress: number; // 1-10 scale
    adhdMedication: boolean;
    focusLevel: number; // 1-10 scale
  };
}

export interface InjuryRiskProfile {
  id: string;
  athleteId: string;
  sport: string;
  overallRisk: number; // 1-100 scale
  riskFactors: {
    biomechanical: number;
    fatigue: number;
    technique: number;
    environmental: number;
    psychological: number;
    adhd: number; // ADHD-specific risk factors
  };
  specificRisks: {
    bodyPart: string;
    injuryType: string;
    probability: number; // 0-1
    severity: 'low' | 'moderate' | 'high' | 'severe';
    timeline: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  }[];
  adhdConsiderations: {
    attentionLapses: number; // Risk from attention deficits
    impulsivity: number; // Risk from impulsive movements
    hyperfocus: number; // Risk from over-training
    medicationEffects: number; // Impact of ADHD medication
  };
  preventionStrategies: PreventionStrategy[];
}

export interface PreventionStrategy {
  id: string;
  type: 'technique' | 'conditioning' | 'recovery' | 'environmental' | 'behavioral' | 'adhd-specific';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  instructions: string[];
  duration: string;
  frequency: string;
  expectedOutcome: string;
  adhdAdaptations?: {
    useVisualCues: boolean;
    breakIntoSteps: boolean;
    provideReminders: boolean;
    incorporateMovement: boolean;
  };
}

export interface InjuryAlert {
  id: string;
  athleteId: string;
  timestamp: Date;
  alertLevel: 'info' | 'warning' | 'danger' | 'critical';
  riskType: string;
  bodyPart: string;
  probability: number;
  message: string;
  recommendations: string[];
  requiresAction: boolean;
  adhdContext?: {
    attentionRelated: boolean;
    medicationTiming: boolean;
    fatigueRelated: boolean;
    stressRelated: boolean;
  };
}

export interface RecoveryPlan {
  id: string;
  athleteId: string;
  injuryType: string;
  severity: string;
  estimatedRecovery: number; // days
  phases: RecoveryPhase[];
  adhdModifications: {
    shortenSessions: boolean;
    increaseVariety: boolean;
    useGameification: boolean;
    provideFrequentFeedback: boolean;
  };
  progressTracking: {
    painLevel: number; // 1-10 daily tracking
    mobility: number; // 1-10 daily tracking
    strength: number; // 1-10 weekly tracking
    confidence: number; // 1-10 psychological readiness
  };
}

export interface RecoveryPhase {
  phase: number;
  name: string;
  duration: number; // days
  goals: string[];
  exercises: Exercise[];
  restrictions: string[];
  milestones: string[];
}

export interface Exercise {
  name: string;
  type: 'mobility' | 'strength' | 'balance' | 'coordination' | 'cardio';
  sets: number;
  reps: number;
  duration: number; // seconds
  intensity: number; // 1-10
  instructions: string[];
  adhdTips: string[];
  progressionCriteria: string[];
}

// Injury Prevention System Service Class
export class InjuryPreventionSystemService {
  private riskProfiles: Map<string, InjuryRiskProfile> = new Map();
  private biomechanicalHistory: Map<string, BiomechanicalData[]> = new Map();
  private activeAlerts: Map<string, InjuryAlert[]> = new Map();
  private recoveryPlans: Map<string, RecoveryPlan> = new Map();

  constructor() {
    // Initialize with sample risk patterns
    this.initializeSampleData();
  }

  /**
   * Initialize sample data for demonstration
   */
  private initializeSampleData(): void {
    // Sample biomechanical data would be populated from real sensors
    const sampleData: BiomechanicalData = {
      id: 'bio-sample-1',
      athleteId: 'athlete-1',
      timestamp: new Date(),
      sport: 'flag-football',
      activity: 'running-drill',
      sensorData: {
        accelerometer: [{ x: 0.5, y: 0.2, z: 9.8 }],
        gyroscope: [{ x: 0.1, y: 0.05, z: 0.02 }],
        magnetometer: [{ x: 25.0, y: -15.0, z: 45.0 }],
        heartRate: [145, 148, 152, 149]
      },
      movementPatterns: {
        velocity: [5.2, 5.8, 6.1, 5.9],
        acceleration: [1.2, 0.8, 0.5, -0.3],
        deceleration: [-0.8, -1.2, -0.9],
        jumpHeight: [0.32, 0.35, 0.31],
        landingForce: [2.1, 2.3, 2.0],
        rotationalSpeed: [0.5, 0.7, 0.4]
      },
      contextualFactors: {
        fatigue: 6,
        hydration: 7,
        sleep: 7.5,
        nutrition: 8,
        stress: 5,
        adhdMedication: true,
        focusLevel: 7
      }
    };

    this.biomechanicalHistory.set('athlete-1', [sampleData]);
  }

  /**
   * Analyze biomechanical data for injury risk
   */
  async analyzeBiomechanicalData(data: BiomechanicalData): Promise<InjuryRiskProfile> {
    // Store historical data
    const history = this.biomechanicalHistory.get(data.athleteId) || [];
    history.push(data);
    this.biomechanicalHistory.set(data.athleteId, history);

    // Calculate risk factors
    const riskFactors = await this.calculateRiskFactors(data, history);
    
    // Identify specific injury risks
    const specificRisks = await this.identifySpecificRisks(data, riskFactors);
    
    // Generate prevention strategies
    const preventionStrategies = await this.generatePreventionStrategies(riskFactors, specificRisks);
    
    // Assess ADHD-specific considerations
    const adhdConsiderations = await this.assessADHDRisks(data);

    const riskProfile: InjuryRiskProfile = {
      id: `risk-${Date.now()}-${data.athleteId}`,
      athleteId: data.athleteId,
      sport: data.sport,
      overallRisk: this.calculateOverallRisk(riskFactors),
      riskFactors,
      specificRisks,
      adhdConsiderations,
      preventionStrategies
    };

    this.riskProfiles.set(data.athleteId, riskProfile);
    
    // Generate alerts if necessary
    await this.checkForAlerts(riskProfile);

    return riskProfile;
  }

  /**
   * Calculate risk factors from biomechanical data
   */
  private async calculateRiskFactors(
    current: BiomechanicalData,
    history: BiomechanicalData[]
  ): Promise<InjuryRiskProfile['riskFactors']> {
    // Biomechanical risk analysis
    const biomechanicalRisk = this.analyzeBiomechanicalRisk(current);
    
    // Fatigue analysis
    const fatigueRisk = this.analyzeFatigueRisk(current, history);
    
    // Technique analysis
    const techniqueRisk = this.analyzeTechniqueRisk(current);
    
    // Environmental factors
    const environmentalRisk = this.analyzeEnvironmentalRisk(current);
    
    // Psychological factors
    const psychologicalRisk = this.analyzePsychologicalRisk(current);
    
    // ADHD-specific factors
    const adhdRisk = this.analyzeADHDRisk(current);

    return {
      biomechanical: biomechanicalRisk,
      fatigue: fatigueRisk,
      technique: techniqueRisk,
      environmental: environmentalRisk,
      psychological: psychologicalRisk,
      adhd: adhdRisk
    };
  }

  /**
   * Analyze biomechanical risk factors
   */
  private analyzeBiomechanicalRisk(data: BiomechanicalData): number {
    let risk = 0;

    // Landing force analysis
    const avgLandingForce = data.movementPatterns.landingForce.reduce((a, b) => a + b, 0) / 
                           data.movementPatterns.landingForce.length;
    if (avgLandingForce > 2.5) risk += 20; // High impact landings
    
    // Acceleration/deceleration patterns
    const maxAcceleration = Math.max(...data.movementPatterns.acceleration);
    const maxDeceleration = Math.abs(Math.min(...data.movementPatterns.deceleration));
    
    if (maxAcceleration > 2.0 || maxDeceleration > 2.0) risk += 15; // Sudden movements
    
    // Rotational speed analysis
    const avgRotationalSpeed = data.movementPatterns.rotationalSpeed.reduce((a, b) => a + b, 0) / 
                              data.movementPatterns.rotationalSpeed.length;
    if (avgRotationalSpeed > 1.0) risk += 10; // High rotational forces

    return Math.min(100, risk);
  }

  /**
   * Analyze fatigue-related risk
   */
  private analyzeFatigueRisk(current: BiomechanicalData, history: BiomechanicalData[]): number {
    let risk = 0;

    // Current fatigue level
    risk += current.contextualFactors.fatigue * 5;
    
    // Sleep deprivation
    if (current.contextualFactors.sleep < 7) {
      risk += (7 - current.contextualFactors.sleep) * 8;
    }
    
    // Hydration status
    if (current.contextualFactors.hydration < 6) {
      risk += (6 - current.contextualFactors.hydration) * 5;
    }
    
    // Historical fatigue patterns
    if (history.length > 3) {
      const recentFatigue = history.slice(-3).map(d => d.contextualFactors.fatigue);
      const avgFatigue = recentFatigue.reduce((a, b) => a + b, 0) / recentFatigue.length;
      if (avgFatigue > 7) risk += 15; // Chronic fatigue
    }

    return Math.min(100, risk);
  }

  /**
   * Analyze technique-related risk
   */
  private analyzeTechniqueRisk(data: BiomechanicalData): number {
    let risk = 0;

    // Inconsistent movement patterns indicate poor technique
    const velocityVariance = this.calculateVariance(data.movementPatterns.velocity);
    if (velocityVariance > 2.0) risk += 20;
    
    // Jump height consistency
    if (data.movementPatterns.jumpHeight.length > 1) {
      const jumpVariance = this.calculateVariance(data.movementPatterns.jumpHeight);
      if (jumpVariance > 0.05) risk += 15; // Inconsistent jumping technique
    }

    return Math.min(100, risk);
  }

  /**
   * Analyze environmental risk factors
   */
  private analyzeEnvironmentalRisk(data: BiomechanicalData): number {
    let risk = 0;

    // Weather and field conditions would be assessed here
    // For demo, using contextual factors
    if (data.contextualFactors.stress > 7) risk += 10; // High stress environment
    
    return Math.min(100, risk);
  }

  /**
   * Analyze psychological risk factors
   */
  private analyzePsychologicalRisk(data: BiomechanicalData): number {
    let risk = 0;

    // Stress levels
    risk += data.contextualFactors.stress * 3;
    
    // Focus levels (important for ADHD athletes)
    if (data.contextualFactors.focusLevel < 5) {
      risk += (5 - data.contextualFactors.focusLevel) * 8;
    }

    return Math.min(100, risk);
  }

  /**
   * Analyze ADHD-specific risk factors
   */
  private analyzeADHDRisk(data: BiomechanicalData): number {
    let risk = 0;

    // Focus level impact
    if (data.contextualFactors.focusLevel < 6) {
      risk += 20; // Attention deficits increase injury risk
    }
    
    // Medication timing effects
    if (!data.contextualFactors.adhdMedication) {
      risk += 15; // Off medication may affect focus and impulse control
    }
    
    // Stress interaction with ADHD
    if (data.contextualFactors.stress > 6 && data.contextualFactors.focusLevel < 6) {
      risk += 10; // Compound effect
    }

    return Math.min(100, risk);
  }

  /**
   * Calculate variance for movement consistency analysis
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Calculate overall risk score
   */
  private calculateOverallRisk(riskFactors: InjuryRiskProfile['riskFactors']): number {
    const weights = {
      biomechanical: 0.25,
      fatigue: 0.20,
      technique: 0.20,
      environmental: 0.10,
      psychological: 0.15,
      adhd: 0.10
    };

    return Math.round(
      riskFactors.biomechanical * weights.biomechanical +
      riskFactors.fatigue * weights.fatigue +
      riskFactors.technique * weights.technique +
      riskFactors.environmental * weights.environmental +
      riskFactors.psychological * weights.psychological +
      riskFactors.adhd * weights.adhd
    );
  }

  /**
   * Identify specific injury risks
   */
  private async identifySpecificRisks(
    data: BiomechanicalData,
    riskFactors: InjuryRiskProfile['riskFactors']
  ): Promise<InjuryRiskProfile['specificRisks']> {
    const risks: InjuryRiskProfile['specificRisks'] = [];

    // Knee injury risk from high landing forces
    if (riskFactors.biomechanical > 60) {
      risks.push({
        bodyPart: 'knee',
        injuryType: 'ligament strain',
        probability: 0.3,
        severity: 'moderate',
        timeline: 'short-term'
      });
    }

    // Ankle injury risk from technique issues
    if (riskFactors.technique > 50) {
      risks.push({
        bodyPart: 'ankle',
        injuryType: 'sprain',
        probability: 0.25,
        severity: 'low',
        timeline: 'immediate'
      });
    }

    // Overuse injuries from fatigue
    if (riskFactors.fatigue > 70) {
      risks.push({
        bodyPart: 'muscles',
        injuryType: 'overuse strain',
        probability: 0.4,
        severity: 'moderate',
        timeline: 'medium-term'
      });
    }

    // ADHD-related injury risks
    if (riskFactors.adhd > 50) {
      risks.push({
        bodyPart: 'various',
        injuryType: 'attention-related incident',
        probability: 0.2,
        severity: 'low',
        timeline: 'immediate'
      });
    }

    return risks;
  }

  /**
   * Generate prevention strategies
   */
  private async generatePreventionStrategies(
    riskFactors: InjuryRiskProfile['riskFactors'],
    specificRisks: InjuryRiskProfile['specificRisks']
  ): Promise<PreventionStrategy[]> {
    const strategies: PreventionStrategy[] = [];

    // Biomechanical strategies
    if (riskFactors.biomechanical > 50) {
      strategies.push({
        id: 'biomech-1',
        type: 'technique',
        priority: 'high',
        title: 'Landing Technique Training',
        description: 'Improve landing mechanics to reduce impact forces',
        instructions: [
          'Practice soft landings with bent knees',
          'Focus on controlled deceleration',
          'Use mirror for visual feedback'
        ],
        duration: '15 minutes',
        frequency: 'Daily',
        expectedOutcome: 'Reduced landing forces by 20%',
        adhdAdaptations: {
          useVisualCues: true,
          breakIntoSteps: true,
          provideReminders: true,
          incorporateMovement: true
        }
      });
    }

    // Fatigue management strategies
    if (riskFactors.fatigue > 60) {
      strategies.push({
        id: 'fatigue-1',
        type: 'recovery',
        priority: 'high',
        title: 'Sleep Optimization Protocol',
        description: 'Improve sleep quality and duration for better recovery',
        instructions: [
          'Maintain consistent sleep schedule',
          'Create relaxing bedtime routine',
          'Limit screens 1 hour before bed',
          'Use blackout curtains'
        ],
        duration: '8+ hours',
        frequency: 'Nightly',
        expectedOutcome: 'Improved recovery and reduced fatigue',
        adhdAdaptations: {
          useVisualCues: true,
          breakIntoSteps: true,
          provideReminders: true,
          incorporateMovement: false
        }
      });
    }

    // ADHD-specific strategies
    if (riskFactors.adhd > 40) {
      strategies.push({
        id: 'adhd-1',
        type: 'adhd-specific',
        priority: 'medium',
        title: 'Focus Enhancement Techniques',
        description: 'Improve attention and reduce impulsivity during training',
        instructions: [
          'Use mindfulness breathing exercises',
          'Practice visualization techniques',
          'Implement attention anchoring cues',
          'Take regular focus breaks'
        ],
        duration: '10 minutes',
        frequency: 'Before each session',
        expectedOutcome: 'Improved focus and reduced attention-related risks',
        adhdAdaptations: {
          useVisualCues: true,
          breakIntoSteps: true,
          provideReminders: true,
          incorporateMovement: true
        }
      });
    }

    return strategies;
  }

  /**
   * Assess ADHD-specific risk considerations
   */
  private async assessADHDRisks(data: BiomechanicalData): Promise<InjuryRiskProfile['adhdConsiderations']> {
    return {
      attentionLapses: data.contextualFactors.focusLevel < 6 ? 
        Math.round((6 - data.contextualFactors.focusLevel) * 10) : 0,
      impulsivity: data.contextualFactors.stress > 6 && !data.contextualFactors.adhdMedication ? 15 : 5,
      hyperfocus: data.contextualFactors.focusLevel > 8 ? 10 : 0, // Risk of over-training
      medicationEffects: data.contextualFactors.adhdMedication ? 5 : 15
    };
  }

  /**
   * Check for and generate injury alerts
   */
  private async checkForAlerts(riskProfile: InjuryRiskProfile): Promise<void> {
    const alerts: InjuryAlert[] = [];

    // High overall risk alert
    if (riskProfile.overallRisk > 75) {
      alerts.push({
        id: `alert-${Date.now()}-critical`,
        athleteId: riskProfile.athleteId,
        timestamp: new Date(),
        alertLevel: 'critical',
        riskType: 'overall',
        bodyPart: 'general',
        probability: riskProfile.overallRisk / 100,
        message: 'Critical injury risk detected. Immediate intervention recommended.',
        recommendations: [
          'Stop current activity',
          'Consult with sports medicine professional',
          'Implement recovery protocol'
        ],
        requiresAction: true
      });
    }

    // ADHD-specific alerts
    if (riskProfile.adhdConsiderations.attentionLapses > 20) {
      alerts.push({
        id: `alert-${Date.now()}-adhd`,
        athleteId: riskProfile.athleteId,
        timestamp: new Date(),
        alertLevel: 'warning',
        riskType: 'attention',
        bodyPart: 'general',
        probability: 0.4,
        message: 'Attention deficits detected. Increased injury risk from reduced focus.',
        recommendations: [
          'Take focus break',
          'Use attention anchoring techniques',
          'Consider medication timing'
        ],
        requiresAction: false,
        adhdContext: {
          attentionRelated: true,
          medicationTiming: false,
          fatigueRelated: false,
          stressRelated: false
        }
      });
    }

    // Store alerts
    this.activeAlerts.set(riskProfile.athleteId, alerts);
  }

  /**
   * Generate recovery plan for injured athlete
   */
  async generateRecoveryPlan(
    athleteId: string,
    injuryType: string,
    severity: string
  ): Promise<RecoveryPlan> {
    const plan: RecoveryPlan = {
      id: `recovery-${Date.now()}-${athleteId}`,
      athleteId,
      injuryType,
      severity,
      estimatedRecovery: this.calculateRecoveryTime(injuryType, severity),
      phases: await this.generateRecoveryPhases(injuryType, severity),
      adhdModifications: {
        shortenSessions: true,
        increaseVariety: true,
        useGameification: true,
        provideFrequentFeedback: true
      },
      progressTracking: {
        painLevel: 7, // Initial assessment
        mobility: 4,
        strength: 5,
        confidence: 6
      }
    };

    this.recoveryPlans.set(athleteId, plan);
    return plan;
  }

  /**
   * Calculate estimated recovery time
   */
  private calculateRecoveryTime(injuryType: string, severity: string): number {
    const baseTimes: { [key: string]: number } = {
      'ligament strain': 14,
      'sprain': 7,
      'overuse strain': 10,
      'attention-related incident': 1
    };

    const severityMultipliers: { [key: string]: number } = {
      'low': 0.7,
      'moderate': 1.0,
      'high': 1.5,
      'severe': 2.5
    };

    const baseTime = baseTimes[injuryType] || 7;
    const multiplier = severityMultipliers[severity] || 1.0;

    return Math.round(baseTime * multiplier);
  }

  /**
   * Generate recovery phases
   */
  private async generateRecoveryPhases(injuryType: string, severity: string): Promise<RecoveryPhase[]> {
    // Simplified recovery phases for demo
    return [
      {
        phase: 1,
        name: 'Rest and Protection',
        duration: 3,
        goals: ['Reduce pain and inflammation', 'Protect injured area'],
        exercises: [
          {
            name: 'Gentle Range of Motion',
            type: 'mobility',
            sets: 2,
            reps: 10,
            duration: 30,
            intensity: 2,
            instructions: ['Move slowly within comfortable range', 'Stop if pain increases'],
            adhdTips: ['Use timer for consistency', 'Focus on breathing'],
            progressionCriteria: ['Pain-free movement', 'Reduced swelling']
          }
        ],
        restrictions: ['No high-impact activities', 'No competitive play'],
        milestones: ['Pain reduced to 3/10', 'Normal walking pattern']
      },
      {
        phase: 2,
        name: 'Gradual Loading',
        duration: 7,
        goals: ['Restore strength', 'Improve mobility'],
        exercises: [
          {
            name: 'Strengthening Exercises',
            type: 'strength',
            sets: 3,
            reps: 15,
            duration: 60,
            intensity: 5,
            instructions: ['Progressive resistance', 'Focus on form'],
            adhdTips: ['Use visual progress charts', 'Vary exercises for engagement'],
            progressionCriteria: ['80% strength of uninjured side']
          }
        ],
        restrictions: ['No running yet', 'Modified training only'],
        milestones: ['Full range of motion', 'No pain with daily activities']
      }
    ];
  }

  /**
   * Get injury prevention analytics
   */
  async getPreventionAnalytics(athleteId: string): Promise<{
    currentRisk: number;
    riskTrends: number[];
    preventionCompliance: number;
    injuryHistory: string[];
    recommendations: string[];
    adhdOptimizations: string[];
  }> {
    const riskProfile = this.riskProfiles.get(athleteId);
    const biomechanicalHistory = this.biomechanicalHistory.get(athleteId) || [];

    if (!riskProfile) {
      return {
        currentRisk: 0,
        riskTrends: [],
        preventionCompliance: 0,
        injuryHistory: [],
        recommendations: ['Complete initial biomechanical assessment'],
        adhdOptimizations: ['Set up ADHD-specific monitoring protocols']
      };
    }

    return {
      currentRisk: riskProfile.overallRisk,
      riskTrends: biomechanicalHistory.slice(-7).map(d => d.contextualFactors.fatigue * 10),
      preventionCompliance: 78, // Would calculate from actual compliance data
      injuryHistory: ['Minor ankle sprain - 3 months ago'],
      recommendations: riskProfile.preventionStrategies.slice(0, 3).map(s => s.title),
      adhdOptimizations: [
        'Optimize medication timing for training sessions',
        'Implement attention breaks every 15 minutes',
        'Use visual cues for technique corrections'
      ]
    };
  }
}

// Export service instance
export const injuryPreventionSystemService = new InjuryPreventionSystemService();