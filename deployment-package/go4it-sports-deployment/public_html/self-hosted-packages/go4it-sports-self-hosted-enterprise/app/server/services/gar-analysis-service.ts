/**
 * GAR (Growth and Ability Rating) Analysis Service
 * 
 * Advanced analytics system that analyzes athlete attributes, biomechanics,
 * neurodivergent profiles, and developmental patterns to identify optimal
 * sport recommendations for young athletes.
 * 
 * Features:
 * - Ages 4-12: Top 5 recommended sports based on comprehensive GAR analysis
 * - Ages 13-22: Top 3 professional sports routes with highest projected success
 */

import { db } from '../db';
import { IStorage } from '../storage';
import { 
  athleteProfiles, 
  athleteBodyMetrics, 
  athleteSkills,
  neurodivergentProfiles,
  sportAttributes,
  athleteAssessments,
  garScores
} from '../../shared/schema';
import { eq, and, gte, lte, inArray, sql } from 'drizzle-orm';
import OpenAI from 'openai';
import { PositionAnalyticsService } from './position-analytics-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const GPT_MODEL = "gpt-4o";

// Sport IDs for reference (these would be defined in your database)
const SPORTS = {
  BASKETBALL: 1,
  FOOTBALL: 2,
  SOCCER: 3,
  BASEBALL: 4,
  VOLLEYBALL: 5,
  TRACK: 6,
  SWIMMING: 7,
  TENNIS: 8,
  GOLF: 9,
  WRESTLING: 10,
  LACROSSE: 11,
  HOCKEY: 12,
  GYMNASTICS: 13,
  MARTIAL_ARTS: 14,
  DANCE: 15,
  CYCLING: 16,
  SKIING: 17,
  ROWING: 18,
  RUGBY: 19,
  CRICKET: 20
};

export class GARAnalysisService {
  private storage: IStorage;
  private positionAnalyticsService: PositionAnalyticsService;
  
  // Sport-specific developmental attributes by age ranges
  private sportDevelopmentalAttributes: Record<number, Record<string, any>> = {
    // Basketball
    [SPORTS.BASKETBALL]: {
      earlyDevelopment: {
        ageRange: [4, 8],
        keyAttributes: [
          'handeye_coordination', 
          'spatial_awareness',
          'rhythmic_movement',
          'focus_duration'
        ],
        keyMotorSkills: [
          'jumping',
          'throwing',
          'catching',
          'directional_movement'
        ],
        adhd_compatibility: 0.78
      },
      middleDevelopment: {
        ageRange: [9, 12],
        keyAttributes: [
          'decision_speed',
          'pattern_recognition',
          'vertical_leap',
          'stamina',
          'team_dynamics'
        ],
        keyMotorSkills: [
          'dribbling',
          'shooting_mechanics',
          'defensive_stance',
          'court_positioning'
        ],
        adhd_compatibility: 0.75
      },
      lateDevelopment: {
        ageRange: [13, 22],
        keyAttributes: [
          'leap_height',
          'strategic_thinking',
          'pressure_performance',
          'leadership',
          'quick_adaptability'
        ],
        careerRoutes: [
          'professional_player',
          'college_scholarship',
          'coach_development'
        ],
        proProjectionFactors: [
          'height_percentile',
          'jump_measurement',
          'shooting_percentage',
          'leadership_assessment',
          'game_iq'
        ],
        adhd_compatibility: 0.72
      }
    },
    // Soccer
    [SPORTS.SOCCER]: {
      earlyDevelopment: {
        ageRange: [4, 8],
        keyAttributes: [
          'foot_coordination', 
          'endurance_base',
          'spatial_awareness',
          'group_interaction'
        ],
        keyMotorSkills: [
          'running',
          'kicking',
          'balance',
          'directional_change'
        ],
        adhd_compatibility: 0.82
      },
      middleDevelopment: {
        ageRange: [9, 12],
        keyAttributes: [
          'field_vision',
          'running_speed',
          'tactical_awareness',
          'ball_control',
          'team_positioning'
        ],
        keyMotorSkills: [
          'passing_technique',
          'shooting_power',
          'defensive_positioning',
          'dribbling_control'
        ],
        adhd_compatibility: 0.85
      },
      lateDevelopment: {
        ageRange: [13, 22],
        keyAttributes: [
          'field_vision',
          'tactical_execution',
          'stamina_peak',
          'leadership',
          'technical_precision'
        ],
        careerRoutes: [
          'professional_player',
          'college_scholarship',
          'coaching_pathway'
        ],
        proProjectionFactors: [
          'sprint_speed',
          'skill_technical_grade',
          'tactical_understanding',
          'game_creativity',
          'endurance_measurement'
        ],
        adhd_compatibility: 0.80
      }
    }
    // Additional sports would be defined with similar structures
  };

  constructor(storage: IStorage) {
    this.storage = storage;
    this.positionAnalyticsService = new PositionAnalyticsService(storage);
  }

  /**
   * Generate GAR analysis and sport recommendations for youth athlete
   * @param athleteId The ID of the athlete
   * @param generateDetailedReport Whether to generate a detailed PDF report
   */
  async generateGARAnalysis(athleteId: number, generateDetailedReport: boolean = false) {
    try {
      // Get athlete profile
      const athlete = await db.query.athleteProfiles.findFirst({
        where: eq(athleteProfiles.userId, athleteId)
      });
      
      if (!athlete) {
        return { 
          success: false, 
          message: "Athlete profile not found" 
        };
      }
      
      // Get athlete's age
      const birthDate = new Date(athlete.birthDate);
      const today = new Date();
      const ageInMs = today.getTime() - birthDate.getTime();
      const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
      
      // Get athlete body metrics
      const bodyMetrics = await db.query.athleteBodyMetrics.findFirst({
        where: eq(athleteBodyMetrics.userId, athleteId)
      });
      
      // Get neurodivergent profile if available
      const neurodivergentProfile = await db.query.neurodivergentProfiles.findFirst({
        where: eq(neurodivergentProfiles.userId, athleteId)
      });
      
      // Get athlete skills
      const skills = await db.select().from(athleteSkills).where(eq(athleteSkills.userId, athleteId));
      
      // Get most recent assessment
      const assessment = await db.query.athleteAssessments.findFirst({
        where: eq(athleteAssessments.userId, athleteId),
        orderBy: [sql`${athleteAssessments.assessmentDate} DESC`]
      });
      
      // Generate sport-specific GAR scores
      const garResults = await this.calculateSportGARScores(
        athlete,
        bodyMetrics,
        neurodivergentProfile,
        skills,
        assessment,
        ageInYears
      );
      
      // Get recommendations based on age group
      let recommendations;
      if (ageInYears < 13) {
        // Youth recommendations (ages 4-12): Top 5 sports
        recommendations = await this.generateYouthRecommendations(garResults, ageInYears);
      } else {
        // Pro-track recommendations (ages 13-22): Top 3 pro routes
        recommendations = await this.generateProTrackRecommendations(garResults, ageInYears);
      }
      
      // Save GAR scores to database for tracking
      await this.saveGARScores(athleteId, garResults);
      
      // Generate detailed report if requested
      let reportUrl = null;
      if (generateDetailedReport) {
        reportUrl = await this.generateGARReport(
          athlete,
          garResults,
          recommendations,
          ageInYears
        );
      }
      
      return {
        success: true,
        athleteId,
        athleteName: athlete.fullName,
        age: Math.floor(ageInYears),
        garScores: garResults,
        recommendations,
        reportUrl
      };
    } catch (error) {
      console.error("Error generating GAR analysis:", error);
      return { 
        success: false, 
        message: "Error generating GAR analysis" 
      };
    }
  }

  /**
   * Calculate sport-specific GAR scores for all sports
   */
  private async calculateSportGARScores(
    athlete: any,
    bodyMetrics: any | null,
    neurodivergentProfile: any | null,
    skills: any[],
    assessment: any | null,
    ageInYears: number
  ) {
    // Initialize results object
    const results: Record<number, any> = {};
    
    // Process each sport
    for (const [sportName, sportId] of Object.entries(SPORTS)) {
      // Skip sports inappropriate for very young children
      if (ageInYears < 6 && [SPORTS.FOOTBALL, SPORTS.RUGBY, SPORTS.HOCKEY, SPORTS.WRESTLING].includes(Number(sportId))) {
        continue;
      }
      
      // Get sport developmental attributes for current age
      const sportAttrs = this.sportDevelopmentalAttributes[Number(sportId)];
      let developmentStage;
      
      if (ageInYears <= 8) {
        developmentStage = sportAttrs?.earlyDevelopment;
      } else if (ageInYears <= 12) {
        developmentStage = sportAttrs?.middleDevelopment;
      } else {
        developmentStage = sportAttrs?.lateDevelopment;
      }
      
      // Skip if no defined attributes for this sport/age
      if (!developmentStage) {
        continue;
      }
      
      // Calculate main GAR components
      
      // 1. Physical GAR component (0-100)
      const physicalGAR = this.calculatePhysicalGAR(
        bodyMetrics, 
        assessment, 
        sportId as number, 
        ageInYears
      );
      
      // 2. Technical GAR component (0-100)
      const technicalGAR = this.calculateTechnicalGAR(
        skills, 
        sportId as number, 
        ageInYears
      );
      
      // 3. Psychological GAR component (0-100)
      const psychologicalGAR = this.calculatePsychologicalGAR(
        assessment,
        neurodivergentProfile,
        sportId as number
      );
      
      // 4. Developmental Potential GAR (0-100)
      const developmentalGAR = this.calculateDevelopmentalGAR(
        ageInYears,
        bodyMetrics,
        athlete,
        sportId as number
      );
      
      // 5. ADHD Compatibility Score (only if athlete has ADHD)
      let adhdCompatibilityScore = null;
      if (neurodivergentProfile?.hasAdhd) {
        adhdCompatibilityScore = this.calculateADHDCompatibility(
          neurodivergentProfile,
          sportId as number
        );
      }
      
      // Calculate overall GAR score (weighted average)
      const overallGAR = (
        (physicalGAR * 0.35) +
        (technicalGAR * 0.25) +
        (psychologicalGAR * 0.20) +
        (developmentalGAR * 0.20)
      );
      
      // Store results
      results[sportId as number] = {
        sportId: sportId,
        sportName: sportName.toLowerCase(),
        overallGAR,
        components: {
          physical: physicalGAR,
          technical: technicalGAR,
          psychological: psychologicalGAR,
          developmental: developmentalGAR
        },
        adhdCompatibility: adhdCompatibilityScore,
        ageAppropriate: true,
        developmentStage: ageInYears <= 8 ? 'early' : ageInYears <= 12 ? 'middle' : 'late'
      };
    }
    
    return results;
  }
  
  /**
   * Calculate Physical GAR component
   */
  private calculatePhysicalGAR(
    bodyMetrics: any | null,
    assessment: any | null,
    sportId: number,
    ageInYears: number
  ): number {
    // If no data, return base score of 50
    if (!bodyMetrics && !assessment) {
      return 50;
    }
    
    // Get sport attributes data
    const sportAttrs = this.sportDevelopmentalAttributes[sportId];
    if (!sportAttrs) {
      return 50;
    }
    
    // Determine development stage based on age
    let stageAttrs;
    if (ageInYears <= 8) {
      stageAttrs = sportAttrs.earlyDevelopment;
    } else if (ageInYears <= 12) {
      stageAttrs = sportAttrs.middleDevelopment;
    } else {
      stageAttrs = sportAttrs.lateDevelopment;
    }
    
    if (!stageAttrs) {
      return 50;
    }
    
    // Calculate physical attribute scores
    
    // Height/weight percentiles (age-adjusted)
    let heightPercentileScore = 50;
    let weightPercentileScore = 50;
    
    if (bodyMetrics) {
      // These would be calculated against reference data by age/gender
      // For now using placeholders
      heightPercentileScore = bodyMetrics.heightPercentile || 50;
      weightPercentileScore = bodyMetrics.weightPercentile || 50;
    }
    
    // Motor skills scores
    let motorSkillsScore = 50;
    if (assessment && assessment.motorSkills) {
      // Map motor skills assessment to the sport's key motor skills
      const relevantSkills = stageAttrs.keyMotorSkills || [];
      let totalScore = 0;
      let matchedSkills = 0;
      
      relevantSkills.forEach((skill: string) => {
        if (assessment.motorSkills[skill]) {
          totalScore += assessment.motorSkills[skill];
          matchedSkills++;
        }
      });
      
      motorSkillsScore = matchedSkills > 0 ? totalScore / matchedSkills : 50;
    }
    
    // Speed/agility/strength scores
    let speedScore = assessment?.speed || 50;
    let agilityScore = assessment?.agility || 50;
    let strengthScore = assessment?.strength || 50;
    
    // Calculate sport-specific weighting based on sport type
    let weights = {
      height: 0.15,
      weight: 0.10,
      motorSkills: 0.30,
      speed: 0.15,
      agility: 0.15,
      strength: 0.15
    };
    
    // Adjust weights based on sport
    switch (sportId) {
      case SPORTS.BASKETBALL:
      case SPORTS.VOLLEYBALL:
        weights.height = 0.25;
        weights.weight = 0.05;
        break;
        
      case SPORTS.FOOTBALL:
      case SPORTS.RUGBY:
        weights.strength = 0.25;
        weights.weight = 0.20;
        weights.height = 0.05;
        break;
        
      case SPORTS.SOCCER:
      case SPORTS.TRACK:
        weights.speed = 0.25;
        weights.agility = 0.25;
        weights.height = 0.05;
        weights.weight = 0.05;
        break;
        
      case SPORTS.GYMNASTICS:
      case SPORTS.DANCE:
        weights.motorSkills = 0.40;
        weights.agility = 0.30;
        weights.height = 0.05;
        weights.weight = 0.05;
        break;
    }
    
    // Calculate weighted physical GAR
    const physicalGAR = (
      (heightPercentileScore * weights.height) +
      (weightPercentileScore * weights.weight) +
      (motorSkillsScore * weights.motorSkills) +
      (speedScore * weights.speed) +
      (agilityScore * weights.agility) +
      (strengthScore * weights.strength)
    );
    
    return Math.min(100, Math.max(0, physicalGAR));
  }
  
  /**
   * Calculate Technical GAR component
   */
  private calculateTechnicalGAR(
    skills: any[],
    sportId: number,
    ageInYears: number
  ): number {
    // If no skills data, return base score of 50
    if (!skills || skills.length === 0) {
      return 50;
    }
    
    // Filter skills relevant to this sport
    const sportSkills = skills.filter(skill => 
      skill.sportId === sportId || skill.sportId === null
    );
    
    if (sportSkills.length === 0) {
      return 50;
    }
    
    // Calculate average skill level, adjusted for age
    const avgSkillLevel = sportSkills.reduce((sum, skill) => sum + (skill.level || 0), 0) / sportSkills.length;
    
    // Convert to GAR scale (0-100)
    // This takes into account expected skill level for age
    const expectedSkillForAge = Math.min(10, ageInYears / 2); // Simple model: expect level 5 at age 10
    const ageAdjustedScore = (avgSkillLevel / expectedSkillForAge) * 75;
    
    // Cap score and ensure minimum floor
    return Math.min(100, Math.max(25, ageAdjustedScore));
  }
  
  /**
   * Calculate Psychological GAR component
   */
  private calculatePsychologicalGAR(
    assessment: any | null,
    neurodivergentProfile: any | null,
    sportId: number
  ): number {
    // If no assessment data, return base score of 50
    if (!assessment) {
      return 50;
    }
    
    // Get relevant psychological attributes
    const focus = assessment.focus || 50;
    const determination = assessment.determination || 50;
    const teamwork = assessment.teamwork || 50;
    const pressure = assessment.pressureResponse || 50;
    const confidence = assessment.confidence || 50;
    
    // ADHD adjustment if applicable
    let adhdAdjustment = 0;
    if (neurodivergentProfile?.hasAdhd) {
      // Get sport compatibility score
      const sportAttrs = this.sportDevelopmentalAttributes[sportId];
      
      // Apply adjustment based on sport compatibility
      if (sportAttrs) {
        let stage;
        if (assessment.athleteAge <= 8) {
          stage = 'earlyDevelopment';
        } else if (assessment.athleteAge <= 12) {
          stage = 'middleDevelopment';
        } else {
          stage = 'lateDevelopment';
        }
        
        const compatibilityScore = sportAttrs[stage]?.adhd_compatibility || 0.5;
        adhdAdjustment = (compatibilityScore - 0.5) * 20; // Scale to -10 to +10
      }
    }
    
    // Calculate weighted psychological GAR
    const sportWeights = this.getPsychologicalWeightsBySport(sportId);
    
    const psychologicalGAR = (
      (focus * sportWeights.focus) +
      (determination * sportWeights.determination) +
      (teamwork * sportWeights.teamwork) +
      (pressure * sportWeights.pressure) +
      (confidence * sportWeights.confidence)
    ) + adhdAdjustment;
    
    return Math.min(100, Math.max(0, psychologicalGAR));
  }
  
  /**
   * Get psychological weights adjusted for each sport
   */
  private getPsychologicalWeightsBySport(sportId: number) {
    // Default weights
    const weights = {
      focus: 0.2,
      determination: 0.2,
      teamwork: 0.2,
      pressure: 0.2,
      confidence: 0.2
    };
    
    // Adjust by sport type
    switch (sportId) {
      case SPORTS.GOLF:
      case SPORTS.TENNIS:
        // Individual precision sports value focus and pressure response
        weights.focus = 0.30;
        weights.pressure = 0.30;
        weights.teamwork = 0.05;
        break;
        
      case SPORTS.BASKETBALL:
      case SPORTS.SOCCER:
      case SPORTS.FOOTBALL:
        // Team sports value teamwork
        weights.teamwork = 0.35;
        weights.focus = 0.15;
        break;
        
      case SPORTS.WRESTLING:
      case SPORTS.MARTIAL_ARTS:
        // Combat sports value determination and confidence
        weights.determination = 0.35;
        weights.confidence = 0.30;
        weights.teamwork = 0.05;
        break;
        
      case SPORTS.TRACK:
      case SPORTS.SWIMMING:
        // Endurance sports value determination
        weights.determination = 0.35;
        weights.teamwork = 0.10;
        break;
    }
    
    return weights;
  }
  
  /**
   * Calculate Developmental GAR component
   */
  private calculateDevelopmentalGAR(
    ageInYears: number,
    bodyMetrics: any | null,
    athlete: any,
    sportId: number
  ): number {
    // Basis for projecting future development potential
    
    // Age-appropriate starting point (younger = more potential)
    const ageFactor = Math.max(0, 100 - (ageInYears * 3));
    
    // Growth trajectory (if data available)
    let growthFactor = 50;
    if (bodyMetrics && bodyMetrics.growthVelocity) {
      growthFactor = Math.min(100, bodyMetrics.growthVelocity * 10);
    }
    
    // Genetic/family background in sport
    let familyFactor = 50;
    if (athlete.familyAthleteHistory && athlete.familyAthleteHistory[sportId]) {
      familyFactor = 75; // Higher baseline if family history in this sport
    }
    
    // Calculation with weights depending on age
    let agePotentialWeight, growthWeight, familyWeight;
    
    if (ageInYears < 10) {
      // Young children: highest weight on age (most development ahead)
      agePotentialWeight = 0.6;
      growthWeight = 0.3;
      familyWeight = 0.1;
    } else if (ageInYears < 16) {
      // Pre-teens/early teens: balanced factors
      agePotentialWeight = 0.4;
      growthWeight = 0.4;
      familyWeight = 0.2;
    } else {
      // Older teens: growth patterns and family history more indicative
      agePotentialWeight = 0.2;
      growthWeight = 0.5;
      familyWeight = 0.3;
    }
    
    const developmentalGAR = (
      (ageFactor * agePotentialWeight) +
      (growthFactor * growthWeight) +
      (familyFactor * familyWeight)
    );
    
    return Math.min(100, Math.max(0, developmentalGAR));
  }
  
  /**
   * Calculate ADHD Compatibility Score
   */
  private calculateADHDCompatibility(
    neurodivergentProfile: any,
    sportId: number
  ): number {
    // Exit if no ADHD profile
    if (!neurodivergentProfile || !neurodivergentProfile.hasAdhd) {
      return null;
    }
    
    const sportAttrs = this.sportDevelopmentalAttributes[sportId];
    if (!sportAttrs) {
      return 50; // Default middle score
    }
    
    // Get ADHD type
    const adhdType = neurodivergentProfile.adhdType || 'combined';
    
    // Base compatibility from sport attributes
    let baseCompatibility = 0;
    
    // Get average of all stage compatibilities
    const stages = ['earlyDevelopment', 'middleDevelopment', 'lateDevelopment'];
    let totalCompat = 0;
    let stageCount = 0;
    
    stages.forEach(stage => {
      if (sportAttrs[stage] && sportAttrs[stage].adhd_compatibility) {
        totalCompat += sportAttrs[stage].adhd_compatibility;
        stageCount++;
      }
    });
    
    baseCompatibility = stageCount > 0 ? totalCompat / stageCount : 0.5;
    
    // Adjust based on ADHD type
    let typeAdjustment = 0;
    
    switch (sportId) {
      // High movement sports good for hyperactive type
      case SPORTS.SOCCER:
      case SPORTS.BASKETBALL:
      case SPORTS.TRACK:
        typeAdjustment = adhdType === 'hyperactive' ? 0.15 : 
                         adhdType === 'inattentive' ? -0.05 : 0.05;
        break;
      
      // Structured, individual sports good for inattentive type
      case SPORTS.SWIMMING:
      case SPORTS.MARTIAL_ARTS:
        typeAdjustment = adhdType === 'inattentive' ? 0.15 : 
                         adhdType === 'hyperactive' ? -0.05 : 0.05;
        break;
      
      // Team sports with continuous action good for combined type
      case SPORTS.FOOTBALL:
      case SPORTS.HOCKEY:
        typeAdjustment = adhdType === 'combined' ? 0.15 : 0;
        break;
    }
    
    // Calculate final score (0-100)
    const finalScore = (baseCompatibility + typeAdjustment) * 100;
    return Math.min(100, Math.max(0, finalScore));
  }

  /**
   * Generate recommendations for youth athletes (ages 4-12)
   */
  private async generateYouthRecommendations(
    garResults: Record<number, any>,
    ageInYears: number
  ) {
    // Sort sports by overall GAR score
    const sortedSports = Object.values(garResults)
      .sort((a, b) => b.overallGAR - a.overallGAR);
    
    // Get top 5 scores
    const topSports = sortedSports.slice(0, 5);
    
    // Add specific developmental focus areas for each sport
    const recommendations = await Promise.all(topSports.map(async (sport) => {
      // Get development stage attributes
      const sportAttrs = this.sportDevelopmentalAttributes[sport.sportId];
      let stageAttrs;
      
      if (ageInYears <= 8) {
        stageAttrs = sportAttrs?.earlyDevelopment;
      } else {
        stageAttrs = sportAttrs?.middleDevelopment;
      }
      
      // Generate AI recommendations for this sport
      const aiRecommendations = await this.generateSportSpecificRecommendations(
        sport.sportId,
        sport.sportName,
        ageInYears,
        sport
      );
      
      return {
        sportId: sport.sportId,
        sportName: sport.sportName,
        garScore: sport.overallGAR,
        componentScores: sport.components,
        adhdCompatibility: sport.adhdCompatibility,
        keyDevelopmentalAreas: stageAttrs?.keyAttributes || [],
        keyMotorSkills: stageAttrs?.keyMotorSkills || [],
        recommendations: aiRecommendations
      };
    }));
    
    return {
      recommendationType: 'youth',
      ageGroup: ageInYears <= 8 ? 'early_development' : 'middle_development',
      recommendations
    };
  }
  
  /**
   * Generate recommendations for pro-track athletes (ages 13-22)
   */
  private async generateProTrackRecommendations(
    garResults: Record<number, any>,
    ageInYears: number
  ) {
    // Sort sports by overall GAR score
    const sortedSports = Object.values(garResults)
      .sort((a, b) => b.overallGAR - a.overallGAR);
    
    // Get top 3 scores
    const topSports = sortedSports.slice(0, 3);
    
    // For each sport, analyze potential pro routes
    const recommendations = await Promise.all(topSports.map(async (sport) => {
      // Get late development attributes
      const sportAttrs = this.sportDevelopmentalAttributes[sport.sportId];
      const stageAttrs = sportAttrs?.lateDevelopment;
      
      // Get career routes
      const careerRoutes = stageAttrs?.careerRoutes || [];
      
      // Generate AI recommendations for pro development
      const aiRecommendations = await this.generateProDevelopmentRecommendations(
        sport.sportId,
        sport.sportName,
        ageInYears,
        sport
      );
      
      // Calculate pro probability score (0-100%)
      const proProbability = this.calculateProProbability(
        sport.sportId,
        sport.overallGAR,
        ageInYears
      );
      
      return {
        sportId: sport.sportId,
        sportName: sport.sportName,
        garScore: sport.overallGAR,
        componentScores: sport.components,
        proProbability,
        careerRoutes,
        proProjectionFactors: stageAttrs?.proProjectionFactors || [],
        recommendations: aiRecommendations
      };
    }));
    
    return {
      recommendationType: 'pro_track',
      ageGroup: ageInYears <= 18 ? 'high_school' : 'college',
      recommendations
    };
  }
  
  /**
   * Calculate probability of reaching professional level
   */
  private calculateProProbability(
    sportId: number,
    garScore: number,
    ageInYears: number
  ): number {
    // Base probability on GAR score
    let baseProbability = garScore / 2; // 50% maximum base probability
    
    // Age modifier - odds decrease with age if GAR isn't exceptional
    const ageModifier = Math.max(0, 15 - (ageInYears - 13) * 2);
    
    // Sport-specific odds adjustment
    let sportMultiplier = 1.0;
    switch (sportId) {
      case SPORTS.FOOTBALL:
      case SPORTS.BASKETBALL:
        sportMultiplier = 0.8; // Harder to go pro in major sports
        break;
      case SPORTS.SOCCER:
        sportMultiplier = 0.85; // Global competition
        break;
      case SPORTS.GOLF:
      case SPORTS.TENNIS:
        sportMultiplier = 1.2; // More structured path with rankings
        break;
      case SPORTS.SWIMMING:
      case SPORTS.TRACK:
        sportMultiplier = 1.1; // Objective measures of ability
        break;
    }
    
    // Calculate final probability
    let finalProbability = (baseProbability + ageModifier) * sportMultiplier;
    
    // Cap at reasonable maximum
    return Math.min(99, Math.max(1, finalProbability));
  }
  
  /**
   * Generate AI recommendations for youth sport development
   */
  private async generateSportSpecificRecommendations(
    sportId: number,
    sportName: string,
    ageInYears: number,
    sportScore: any
  ) {
    try {
      // Create prompt for GPT-4 analysis
      const prompt = `
You are an expert youth sports development specialist with deep knowledge of ${sportName}.

I need specific recommendations for a ${Math.floor(ageInYears)}-year-old athlete with the following GAR (Growth and Ability Rating) scores for ${sportName}:

- Overall GAR Score: ${sportScore.overallGAR.toFixed(1)}
- Physical Component: ${sportScore.components.physical.toFixed(1)}
- Technical Component: ${sportScore.components.technical.toFixed(1)}
- Psychological Component: ${sportScore.components.psychological.toFixed(1)}
- Developmental Potential: ${sportScore.components.developmental.toFixed(1)}
${sportScore.adhdCompatibility ? `- ADHD Compatibility: ${sportScore.adhdCompatibility.toFixed(1)}` : ''}

Based on this data, please provide:

1. A brief assessment of this child's potential in ${sportName}
2. Three specific developmental activities appropriate for their age to improve in this sport
3. Key motor skills to focus on developing
4. How parents can support development without creating pressure
5. Warning signs to watch for that might indicate this sport isn't a good fit

Format your response as structured JSON with these sections.
`;

      // Call GPT-4 for recommendations
      const response = await openai.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: "system", content: "You are an expert youth sports development specialist who focuses on age-appropriate development, fun, and long-term athlete development principles. Your advice is evidence-based and considers physical, psychological and social development." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      // Parse and return the AI-generated recommendations
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error generating sport-specific recommendations:", error);
      return {
        error: "Failed to generate recommendations",
        message: "The AI recommendation service is temporarily unavailable"
      };
    }
  }
  
  /**
   * Generate AI recommendations for pro development pathway
   */
  private async generateProDevelopmentRecommendations(
    sportId: number,
    sportName: string,
    ageInYears: number,
    sportScore: any
  ) {
    try {
      // Create prompt for GPT-4 analysis
      const prompt = `
You are an expert in sports talent development and professional athlete pathways for ${sportName}.

I need specific recommendations for a ${Math.floor(ageInYears)}-year-old athlete with professional aspirations in ${sportName}. Here are their GAR (Growth and Ability Rating) scores:

- Overall GAR Score: ${sportScore.overallGAR.toFixed(1)}
- Physical Component: ${sportScore.components.physical.toFixed(1)}
- Technical Component: ${sportScore.components.technical.toFixed(1)}
- Psychological Component: ${sportScore.components.psychological.toFixed(1)}
- Developmental Potential: ${sportScore.components.developmental.toFixed(1)}

Based on this data, please provide:

1. A realistic assessment of this athlete's professional potential in ${sportName}
2. The optimal development pathway toward professional opportunities (college, minor leagues, etc.)
3. Three specific areas where they should focus training to maximize their potential
4. Key milestones they should aim to achieve in the next 2-3 years
5. Potential obstacles they might face and how to overcome them

Format your response as structured JSON with these sections.
`;

      // Call GPT-4 for recommendations
      const response = await openai.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: "system", content: "You are an expert in sports talent development and professional athlete pathways. You provide realistic, actionable advice based on athlete data and understand the extremely competitive nature of professional sports." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      // Parse and return the AI-generated recommendations
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error generating pro development recommendations:", error);
      return {
        error: "Failed to generate recommendations",
        message: "The AI recommendation service is temporarily unavailable"
      };
    }
  }
  
  /**
   * Save GAR scores to database for tracking development over time
   */
  private async saveGARScores(athleteId: number, garResults: Record<number, any>) {
    try {
      // Create records for each sport
      const garRecords = Object.values(garResults).map(sportScore => ({
        userId: athleteId,
        sportId: sportScore.sportId,
        overallScore: sportScore.overallGAR,
        physicalScore: sportScore.components.physical,
        technicalScore: sportScore.components.technical,
        psychologicalScore: sportScore.components.psychological,
        developmentalScore: sportScore.components.developmental,
        adhdCompatibilityScore: sportScore.adhdCompatibility,
        scoreDate: new Date(),
        ageAtAssessment: sportScore.athleteAge || null
      }));
      
      // Insert into database
      await db.insert(garScores).values(garRecords);
      
      return true;
    } catch (error) {
      console.error("Error saving GAR scores:", error);
      return false;
    }
  }
  
  /**
   * Generate detailed PDF report for GAR analysis
   */
  private async generateGARReport(
    athlete: any,
    garResults: Record<number, any>,
    recommendations: any,
    ageInYears: number
  ): Promise<string | null> {
    // This would typically use a PDF generation library
    // For now, returning mock URL
    return `https://go4it.com/reports/gar/${athlete.userId}_${Date.now()}.pdf`;
  }
  
  /**
   * Get historical GAR scores for an athlete to track development
   */
  async getHistoricalGARScores(athleteId: number) {
    try {
      // Get all GAR scores for this athlete, ordered by date
      const scores = await db.select()
        .from(garScores)
        .where(eq(garScores.userId, athleteId))
        .orderBy(sql`${garScores.scoreDate} ASC`);
      
      if (!scores || scores.length === 0) {
        return { 
          success: false, 
          message: "No historical GAR scores found for this athlete" 
        };
      }
      
      // Group by sport ID
      const sportScores: Record<number, any[]> = {};
      
      scores.forEach(score => {
        if (!sportScores[score.sportId]) {
          sportScores[score.sportId] = [];
        }
        
        sportScores[score.sportId].push({
          date: score.scoreDate,
          overallScore: score.overallScore,
          physicalScore: score.physicalScore,
          technicalScore: score.technicalScore,
          psychologicalScore: score.psychologicalScore,
          developmentalScore: score.developmentalScore,
          ageAtAssessment: score.ageAtAssessment
        });
      });
      
      // Calculate development trends for each sport
      const developmentTrends = {};
      
      Object.entries(sportScores).forEach(([sportId, scores]) => {
        // Need at least 2 scores to calculate trend
        if (scores.length >= 2) {
          // Sort by date
          scores.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          // Calculate overall trend (positive/negative)
          const firstScore = scores[0].overallScore;
          const lastScore = scores[scores.length - 1].overallScore;
          const overallTrend = lastScore - firstScore;
          
          // Calculate component trends
          const physicalTrend = scores[scores.length - 1].physicalScore - scores[0].physicalScore;
          const technicalTrend = scores[scores.length - 1].technicalScore - scores[0].technicalScore;
          const psychologicalTrend = scores[scores.length - 1].psychologicalScore - scores[0].psychologicalScore;
          const developmentalTrend = scores[scores.length - 1].developmentalScore - scores[0].developmentalScore;
          
          developmentTrends[sportId] = {
            sportId: parseInt(sportId),
            overallTrend,
            componentTrends: {
              physical: physicalTrend,
              technical: technicalTrend,
              psychological: psychologicalTrend,
              developmental: developmentalTrend
            },
            scoreHistory: scores
          };
        }
      });
      
      return {
        success: true,
        athleteId,
        sportScores,
        developmentTrends
      };
    } catch (error) {
      console.error("Error retrieving historical GAR scores:", error);
      return { 
        success: false, 
        message: "Error retrieving historical GAR scores" 
      };
    }
  }
}