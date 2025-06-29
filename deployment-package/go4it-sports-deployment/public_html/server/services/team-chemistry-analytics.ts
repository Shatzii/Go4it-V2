/**
 * Go4It Sports - Team Chemistry Analytics Service
 * 
 * Analyzes team communication patterns, leadership emergence, and optimal
 * team formations with ADHD-inclusive team dynamics optimization.
 */

import { Request, Response } from 'express';

// Team Chemistry Types
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  role: 'leader' | 'supporter' | 'contributor' | 'emerging';
  isNeurodivergent: boolean;
  adhdType?: 'hyperactive' | 'inattentive' | 'combined';
  communicationStyle: 'verbal' | 'visual' | 'kinesthetic' | 'mixed';
  personalityTraits: {
    extroversion: number; // 1-10
    agreeableness: number; // 1-10
    conscientiousness: number; // 1-10
    emotionalStability: number; // 1-10
    openness: number; // 1-10
  };
  athleticAttributes: {
    skill: number;
    experience: number;
    leadership: number;
    adaptability: number;
    teamwork: number;
  };
}

export interface CommunicationPattern {
  id: string;
  fromMemberId: string;
  toMemberId: string;
  type: 'instruction' | 'encouragement' | 'strategy' | 'feedback' | 'social';
  frequency: number; // per session
  effectiveness: number; // 1-10 rating
  timing: 'pre-activity' | 'during-activity' | 'post-activity' | 'break-time';
  context: 'practice' | 'game' | 'training' | 'analysis';
  adhdAdaptations: {
    usesVisualCues: boolean;
    simplifiesMessage: boolean;
    repeatsKeyPoints: boolean;
    providesPositiveReinforcement: boolean;
  };
}

export interface LeadershipMoment {
  id: string;
  memberId: string;
  timestamp: Date;
  type: 'decision-making' | 'motivation' | 'conflict-resolution' | 'strategy-suggestion' | 'support';
  situation: string;
  approach: string;
  effectiveness: number; // 1-10
  teamResponse: 'positive' | 'neutral' | 'resistant';
  impact: {
    teamMorale: number; // -5 to +5
    performance: number; // -5 to +5
    cohesion: number; // -5 to +5
  };
  adhdContext?: {
    leveragedHyperfocus: boolean;
    managedImpulsivity: boolean;
    showedCreativity: boolean;
    demonstratedEmpathy: boolean;
  };
}

export interface TeamFormation {
  id: string;
  name: string;
  sport: string;
  positions: { [position: string]: string }; // position -> memberId
  chemistryScore: number; // 1-100
  strengths: string[];
  weaknesses: string[];
  communicationFlow: CommunicationFlow[];
  adhdConsiderations: {
    balancedNeuroTypes: boolean;
    complementaryStyles: boolean;
    supportStructures: string[];
    attentionManagement: string[];
  };
}

export interface CommunicationFlow {
  from: string;
  to: string;
  strength: number; // 1-10
  type: 'command' | 'support' | 'feedback' | 'coordination';
  efficiency: number; // 1-10
}

export interface TeamSession {
  id: string;
  teamId: string;
  date: Date;
  duration: number; // minutes
  type: 'practice' | 'game' | 'strategy' | 'team-building';
  participants: string[]; // member IDs
  communicationData: CommunicationPattern[];
  leadershipMoments: LeadershipMoment[];
  metrics: {
    overallChemistry: number; // 1-100
    communicationEfficiency: number; // 1-100
    leadershipEmergence: number; // 1-100
    conflictResolution: number; // 1-100
    inclusivity: number; // 1-100 (ADHD inclusion)
  };
  insights: {
    strongConnections: string[];
    improvementAreas: string[];
    leadershipOpportunities: string[];
    adhdSupportNeeds: string[];
  };
}

export interface ChemistryAnalysis {
  teamId: string;
  analysisDate: Date;
  overallScore: number; // 1-100
  dimensions: {
    communication: number;
    trust: number;
    leadership: number;
    conflict: number;
    performance: number;
    inclusion: number;
  };
  networkAnalysis: {
    centralFigures: string[]; // Most connected members
    isolatedMembers: string[]; // Less connected members
    communicationClusters: string[][]; // Sub-groups
    bridgeBuilders: string[]; // Members connecting clusters
  };
  recommendations: {
    formationChanges: string[];
    communicationImprovements: string[];
    leadershipDevelopment: string[];
    adhdSupport: string[];
  };
  trends: {
    improvingConnections: string[];
    decliningConnections: string[];
    emergingLeaders: string[];
    supportNeeds: string[];
  };
}

// Team Chemistry Analytics Service Class
export class TeamChemistryAnalyticsService {
  private teams: Map<string, TeamMember[]> = new Map();
  private sessions: Map<string, TeamSession> = new Map();
  private formations: Map<string, TeamFormation> = new Map();
  private analyses: Map<string, ChemistryAnalysis> = new Map();

  constructor() {
    // Initialize with sample team data
    this.initializeSampleTeam();
  }

  /**
   * Initialize sample team for demonstration
   */
  private initializeSampleTeam(): void {
    const sampleTeam: TeamMember[] = [
      {
        id: 'member-1',
        name: 'Alex Johnson',
        position: 'quarterback',
        role: 'leader',
        isNeurodivergent: true,
        adhdType: 'combined',
        communicationStyle: 'verbal',
        personalityTraits: {
          extroversion: 8,
          agreeableness: 7,
          conscientiousness: 6,
          emotionalStability: 7,
          openness: 9
        },
        athleticAttributes: {
          skill: 85,
          experience: 4,
          leadership: 9,
          adaptability: 8,
          teamwork: 8
        }
      },
      {
        id: 'member-2',
        name: 'Maya Chen',
        position: 'receiver',
        role: 'supporter',
        isNeurodivergent: false,
        communicationStyle: 'visual',
        personalityTraits: {
          extroversion: 6,
          agreeableness: 9,
          conscientiousness: 8,
          emotionalStability: 8,
          openness: 7
        },
        athleticAttributes: {
          skill: 82,
          experience: 3,
          leadership: 6,
          adaptability: 9,
          teamwork: 9
        }
      },
      {
        id: 'member-3',
        name: 'Jordan Williams',
        position: 'defense',
        role: 'emerging',
        isNeurodivergent: true,
        adhdType: 'hyperactive',
        communicationStyle: 'kinesthetic',
        personalityTraits: {
          extroversion: 7,
          agreeableness: 6,
          conscientiousness: 5,
          emotionalStability: 6,
          openness: 8
        },
        athleticAttributes: {
          skill: 78,
          experience: 2,
          leadership: 7,
          adaptability: 8,
          teamwork: 7
        }
      }
    ];

    this.teams.set('team-demo', sampleTeam);
  }

  /**
   * Analyze team communication patterns
   */
  async analyzeCommunicationPatterns(teamId: string, sessionData: TeamSession): Promise<{
    patterns: CommunicationPattern[];
    efficiency: number;
    recommendations: string[];
  }> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error(`Team ${teamId} not found`);
    }

    // Analyze existing communication data
    const patterns = sessionData.communicationData;
    
    // Calculate communication efficiency
    const efficiency = this.calculateCommunicationEfficiency(patterns, team);
    
    // Generate recommendations
    const recommendations = await this.generateCommunicationRecommendations(patterns, team);

    return { patterns, efficiency, recommendations };
  }

  /**
   * Calculate communication efficiency score
   */
  private calculateCommunicationEfficiency(patterns: CommunicationPattern[], team: TeamMember[]): number {
    if (patterns.length === 0) return 0;

    let totalEffectiveness = 0;
    let adhdAdaptationBonus = 0;
    let diversityBonus = 0;

    patterns.forEach(pattern => {
      totalEffectiveness += pattern.effectiveness;
      
      // Bonus for ADHD adaptations
      const adaptations = pattern.adhdAdaptations;
      if (adaptations.usesVisualCues || adaptations.simplifiesMessage || 
          adaptations.repeatsKeyPoints || adaptations.providesPositiveReinforcement) {
        adhdAdaptationBonus += 1;
      }
      
      // Bonus for communication style diversity
      const fromMember = team.find(m => m.id === pattern.fromMemberId);
      const toMember = team.find(m => m.id === pattern.toMemberId);
      if (fromMember && toMember && fromMember.communicationStyle !== toMember.communicationStyle) {
        diversityBonus += 0.5;
      }
    });

    const baseScore = (totalEffectiveness / patterns.length) * 10;
    const adaptationScore = (adhdAdaptationBonus / patterns.length) * 10;
    const diversityScore = (diversityBonus / patterns.length) * 10;

    return Math.min(100, baseScore + adaptationScore + diversityScore);
  }

  /**
   * Generate communication recommendations
   */
  private async generateCommunicationRecommendations(
    patterns: CommunicationPattern[], 
    team: TeamMember[]
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Check for ADHD-inclusive communication
    const adhdMembers = team.filter(m => m.isNeurodivergent);
    const adhdAdaptedPatterns = patterns.filter(p => 
      p.adhdAdaptations.usesVisualCues || p.adhdAdaptations.simplifiesMessage
    );

    if (adhdMembers.length > 0 && adhdAdaptedPatterns.length < patterns.length * 0.5) {
      recommendations.push('Increase use of visual cues and simplified messaging for ADHD team members');
    }

    // Check communication balance
    const communicationCounts = new Map<string, number>();
    patterns.forEach(p => {
      communicationCounts.set(p.fromMemberId, (communicationCounts.get(p.fromMemberId) || 0) + 1);
    });

    const dominantCommunicators = Array.from(communicationCounts.entries())
      .filter(([, count]) => count > patterns.length * 0.4);

    if (dominantCommunicators.length > 0) {
      recommendations.push('Encourage more balanced communication participation across team members');
    }

    // Check for low effectiveness patterns
    const lowEffectiveness = patterns.filter(p => p.effectiveness < 6);
    if (lowEffectiveness.length > patterns.length * 0.3) {
      recommendations.push('Focus on improving communication clarity and timing');
    }

    return recommendations;
  }

  /**
   * Track leadership emergence
   */
  async trackLeadershipEmergence(teamId: string, leadershipMoments: LeadershipMoment[]): Promise<{
    currentLeaders: string[];
    emergingLeaders: string[];
    leadershipStyles: { [memberId: string]: string };
    developmentOpportunities: string[];
  }> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error(`Team ${teamId} not found`);
    }

    // Analyze leadership moments
    const leadershipScores = new Map<string, number>();
    const leadershipTypes = new Map<string, string[]>();

    leadershipMoments.forEach(moment => {
      const currentScore = leadershipScores.get(moment.memberId) || 0;
      leadershipScores.set(moment.memberId, currentScore + moment.effectiveness);
      
      const types = leadershipTypes.get(moment.memberId) || [];
      types.push(moment.type);
      leadershipTypes.set(moment.memberId, types);
    });

    // Identify current and emerging leaders
    const sortedLeaders = Array.from(leadershipScores.entries())
      .sort(([,a], [,b]) => b - a);

    const currentLeaders = sortedLeaders.slice(0, 2).map(([id]) => id);
    const emergingLeaders = sortedLeaders.slice(2, 4).map(([id]) => id);

    // Determine leadership styles
    const leadershipStyles: { [memberId: string]: string } = {};
    leadershipTypes.forEach((types, memberId) => {
      const mostCommon = this.getMostCommonType(types);
      leadershipStyles[memberId] = this.mapToLeadershipStyle(mostCommon);
    });

    // Generate development opportunities
    const developmentOpportunities = await this.generateLeadershipDevelopment(
      team, currentLeaders, emergingLeaders, leadershipMoments
    );

    return {
      currentLeaders,
      emergingLeaders,
      leadershipStyles,
      developmentOpportunities
    };
  }

  /**
   * Get most common leadership type
   */
  private getMostCommonType(types: string[]): string {
    const counts = new Map<string, number>();
    types.forEach(type => {
      counts.set(type, (counts.get(type) || 0) + 1);
    });
    
    return Array.from(counts.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'support';
  }

  /**
   * Map leadership moment type to style
   */
  private mapToLeadershipStyle(type: string): string {
    const styleMap: { [key: string]: string } = {
      'decision-making': 'Decisive Leader',
      'motivation': 'Inspirational Leader',
      'conflict-resolution': 'Diplomatic Leader',
      'strategy-suggestion': 'Strategic Leader',
      'support': 'Supportive Leader'
    };
    
    return styleMap[type] || 'Emerging Leader';
  }

  /**
   * Generate leadership development opportunities
   */
  private async generateLeadershipDevelopment(
    team: TeamMember[],
    currentLeaders: string[],
    emergingLeaders: string[],
    moments: LeadershipMoment[]
  ): Promise<string[]> {
    const opportunities: string[] = [];

    // Check for ADHD leaders needing support
    const adhdLeaders = currentLeaders.filter(id => 
      team.find(m => m.id === id)?.isNeurodivergent
    );

    if (adhdLeaders.length > 0) {
      opportunities.push('Provide ADHD-specific leadership coaching for hyperfocus and impulse management');
    }

    // Check for underutilized leadership potential
    const quietMembers = team.filter(member => 
      !currentLeaders.includes(member.id) && 
      !emergingLeaders.includes(member.id) &&
      member.athleticAttributes.leadership > 6
    );

    if (quietMembers.length > 0) {
      opportunities.push('Create leadership opportunities for quiet but capable team members');
    }

    // Check leadership moment effectiveness
    const lowEffectiveness = moments.filter(m => m.effectiveness < 6);
    if (lowEffectiveness.length > moments.length * 0.3) {
      opportunities.push('Focus on leadership communication and timing training');
    }

    return opportunities;
  }

  /**
   * Generate optimal team formation
   */
  async generateOptimalFormation(teamId: string, sport: string): Promise<TeamFormation> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error(`Team ${teamId} not found`);
    }

    // Calculate chemistry scores for different position combinations
    const formation = await this.optimizePositions(team, sport);
    
    // Analyze communication flow
    const communicationFlow = await this.analyzeCommunicationFlow(formation.positions, team);
    
    // Add ADHD considerations
    const adhdConsiderations = await this.assessADHDConsiderations(formation.positions, team);

    const optimizedFormation: TeamFormation = {
      id: `formation-${Date.now()}`,
      name: `Optimized ${sport} Formation`,
      sport,
      positions: formation.positions,
      chemistryScore: formation.score,
      strengths: formation.strengths,
      weaknesses: formation.weaknesses,
      communicationFlow,
      adhdConsiderations
    };

    this.formations.set(optimizedFormation.id, optimizedFormation);
    return optimizedFormation;
  }

  /**
   * Optimize position assignments
   */
  private async optimizePositions(team: TeamMember[], sport: string): Promise<{
    positions: { [position: string]: string };
    score: number;
    strengths: string[];
    weaknesses: string[];
  }> {
    // Sport-specific position requirements
    const positionRequirements = this.getPositionRequirements(sport);
    
    // Score all possible combinations (simplified for demo)
    const bestFormation = this.findBestFormation(team, positionRequirements);
    
    return bestFormation;
  }

  /**
   * Get position requirements for sport
   */
  private getPositionRequirements(sport: string): { [position: string]: string[] } {
    const requirements: { [sport: string]: { [position: string]: string[] } } = {
      'flag-football': {
        'quarterback': ['leadership', 'skill', 'adaptability'],
        'receiver': ['skill', 'teamwork', 'adaptability'],
        'defense': ['skill', 'teamwork', 'experience']
      },
      'soccer': {
        'midfielder': ['leadership', 'teamwork', 'adaptability'],
        'forward': ['skill', 'adaptability'],
        'defender': ['teamwork', 'experience']
      },
      'basketball': {
        'point-guard': ['leadership', 'skill', 'adaptability'],
        'shooting-guard': ['skill', 'teamwork'],
        'forward': ['skill', 'teamwork', 'experience']
      }
    };
    
    return requirements[sport] || {};
  }

  /**
   * Find best formation through simplified optimization
   */
  private findBestFormation(team: TeamMember[], requirements: { [position: string]: string[] }): {
    positions: { [position: string]: string };
    score: number;
    strengths: string[];
    weaknesses: string[];
  } {
    // Simplified formation assignment
    const positions: { [position: string]: string } = {};
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // Assign positions based on member attributes and preferences
    const positionList = Object.keys(requirements);
    let score = 0;

    team.forEach((member, index) => {
      if (index < positionList.length) {
        const position = positionList[index];
        positions[position] = member.id;
        
        // Calculate fit score
        const requiredAttributes = requirements[position];
        let positionScore = 0;
        
        requiredAttributes.forEach(attr => {
          if (attr === 'leadership') positionScore += member.athleticAttributes.leadership;
          if (attr === 'skill') positionScore += member.athleticAttributes.skill;
          if (attr === 'teamwork') positionScore += member.athleticAttributes.teamwork;
          if (attr === 'experience') positionScore += member.athleticAttributes.experience * 20;
          if (attr === 'adaptability') positionScore += member.athleticAttributes.adaptability;
        });
        
        score += positionScore / requiredAttributes.length;
        
        // Identify strengths and weaknesses
        if (positionScore / requiredAttributes.length > 80) {
          strengths.push(`Strong ${position} with ${member.name}`);
        } else if (positionScore / requiredAttributes.length < 60) {
          weaknesses.push(`${position} position needs development`);
        }
      }
    });

    // ADHD-specific considerations
    const adhdMembers = team.filter(m => m.isNeurodivergent);
    if (adhdMembers.length > 0) {
      strengths.push('Neurodiverse team with creative problem-solving abilities');
    }

    return {
      positions,
      score: Math.round(score / positionList.length),
      strengths,
      weaknesses
    };
  }

  /**
   * Analyze communication flow in formation
   */
  private async analyzeCommunicationFlow(
    positions: { [position: string]: string },
    team: TeamMember[]
  ): Promise<CommunicationFlow[]> {
    const flows: CommunicationFlow[] = [];
    
    // Analyze all member pairs
    const memberIds = Object.values(positions);
    
    for (let i = 0; i < memberIds.length; i++) {
      for (let j = i + 1; j < memberIds.length; j++) {
        const member1 = team.find(m => m.id === memberIds[i]);
        const member2 = team.find(m => m.id === memberIds[j]);
        
        if (member1 && member2) {
          const flow = this.calculateCommunicationStrength(member1, member2);
          flows.push({
            from: member1.id,
            to: member2.id,
            strength: flow.strength,
            type: flow.type,
            efficiency: flow.efficiency
          });
        }
      }
    }
    
    return flows;
  }

  /**
   * Calculate communication strength between two members
   */
  private calculateCommunicationStrength(member1: TeamMember, member2: TeamMember): {
    strength: number;
    type: 'command' | 'support' | 'feedback' | 'coordination';
    efficiency: number;
  } {
    let strength = 5; // Base strength
    
    // Leadership dynamics
    if (member1.role === 'leader' && member2.role !== 'leader') {
      strength += 2;
    }
    
    // Personality compatibility
    const personalityMatch = this.calculatePersonalityMatch(
      member1.personalityTraits, 
      member2.personalityTraits
    );
    strength += personalityMatch * 3;
    
    // Communication style compatibility
    if (member1.communicationStyle === member2.communicationStyle) {
      strength += 1;
    }
    
    // ADHD considerations
    if (member1.isNeurodivergent || member2.isNeurodivergent) {
      // ADHD members often communicate well with patient, understanding teammates
      if (member1.personalityTraits.agreeableness > 7 || member2.personalityTraits.agreeableness > 7) {
        strength += 1;
      }
    }
    
    // Determine communication type
    let type: 'command' | 'support' | 'feedback' | 'coordination' = 'coordination';
    if (member1.role === 'leader') type = 'command';
    else if (member1.role === 'supporter') type = 'support';
    else type = 'feedback';
    
    // Calculate efficiency
    const efficiency = Math.min(10, strength + (personalityMatch * 2));
    
    return {
      strength: Math.min(10, Math.max(1, strength)),
      type,
      efficiency: Math.round(efficiency)
    };
  }

  /**
   * Calculate personality trait compatibility
   */
  private calculatePersonalityMatch(traits1: TeamMember['personalityTraits'], traits2: TeamMember['personalityTraits']): number {
    // Complementary traits work well together
    let match = 0;
    
    // Extroversion balance
    const extroversionDiff = Math.abs(traits1.extroversion - traits2.extroversion);
    if (extroversionDiff > 3 && extroversionDiff < 7) match += 0.5; // Complementary
    
    // Agreeableness similarity (both high is good)
    if (traits1.agreeableness > 6 && traits2.agreeableness > 6) match += 1;
    
    // Conscientiousness balance
    if (traits1.conscientiousness > 6 || traits2.conscientiousness > 6) match += 0.5;
    
    // Emotional stability (both high is good)
    if (traits1.emotionalStability > 6 && traits2.emotionalStability > 6) match += 1;
    
    // Openness compatibility
    const opennessDiff = Math.abs(traits1.openness - traits2.openness);
    if (opennessDiff < 4) match += 0.5; // Similar openness levels
    
    return Math.min(1, match / 3.5);
  }

  /**
   * Assess ADHD considerations for formation
   */
  private async assessADHDConsiderations(
    positions: { [position: string]: string },
    team: TeamMember[]
  ): Promise<TeamFormation['adhdConsiderations']> {
    const adhdMembers = team.filter(m => m.isNeurodivergent);
    const neurotypicalMembers = team.filter(m => !m.isNeurodivergent);
    
    return {
      balancedNeuroTypes: adhdMembers.length > 0 && neurotypicalMembers.length > 0,
      complementaryStyles: this.hasComplementaryStyles(team),
      supportStructures: [
        'Pair ADHD members with supportive teammates',
        'Use visual communication aids',
        'Implement structured check-ins'
      ],
      attentionManagement: [
        'Rotate high-attention positions',
        'Build in movement breaks',
        'Use clear, simple instructions'
      ]
    };
  }

  /**
   * Check for complementary communication styles
   */
  private hasComplementaryStyles(team: TeamMember[]): boolean {
    const styles = team.map(m => m.communicationStyle);
    const uniqueStyles = new Set(styles);
    return uniqueStyles.size > 1; // Has style diversity
  }

  /**
   * Generate comprehensive team chemistry analysis
   */
  async generateChemistryAnalysis(teamId: string): Promise<ChemistryAnalysis> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error(`Team ${teamId} not found`);
    }

    const analysis: ChemistryAnalysis = {
      teamId,
      analysisDate: new Date(),
      overallScore: await this.calculateOverallChemistry(teamId),
      dimensions: await this.analyzeDimensions(teamId),
      networkAnalysis: await this.performNetworkAnalysis(team),
      recommendations: await this.generateTeamRecommendations(teamId),
      trends: await this.analyzeTrends(teamId)
    };

    this.analyses.set(teamId, analysis);
    return analysis;
  }

  /**
   * Calculate overall team chemistry score
   */
  private async calculateOverallChemistry(teamId: string): Promise<number> {
    // Simplified calculation - would use actual session data
    return 78; // Demo score
  }

  /**
   * Analyze chemistry dimensions
   */
  private async analyzeDimensions(teamId: string): Promise<ChemistryAnalysis['dimensions']> {
    return {
      communication: 82,
      trust: 75,
      leadership: 88,
      conflict: 70,
      performance: 85,
      inclusion: 90 // High ADHD inclusion score
    };
  }

  /**
   * Perform network analysis
   */
  private async performNetworkAnalysis(team: TeamMember[]): Promise<ChemistryAnalysis['networkAnalysis']> {
    // Simplified network analysis
    const leaders = team.filter(m => m.role === 'leader').map(m => m.id);
    const supporters = team.filter(m => m.role === 'supporter').map(m => m.id);
    
    return {
      centralFigures: leaders,
      isolatedMembers: [],
      communicationClusters: [leaders, supporters],
      bridgeBuilders: supporters
    };
  }

  /**
   * Generate team recommendations
   */
  private async generateTeamRecommendations(teamId: string): Promise<ChemistryAnalysis['recommendations']> {
    return {
      formationChanges: [
        'Consider rotating leadership responsibilities',
        'Pair experienced players with newcomers'
      ],
      communicationImprovements: [
        'Implement visual communication signals',
        'Practice ADHD-inclusive team meetings'
      ],
      leadershipDevelopment: [
        'Develop emerging leaders through mentorship',
        'Provide ADHD leadership training'
      ],
      adhdSupport: [
        'Create sensory-friendly team environments',
        'Use movement-based team building activities'
      ]
    };
  }

  /**
   * Analyze team trends
   */
  private async analyzeTrends(teamId: string): Promise<ChemistryAnalysis['trends']> {
    return {
      improvingConnections: ['member-1 to member-2', 'member-2 to member-3'],
      decliningConnections: [],
      emergingLeaders: ['member-3'],
      supportNeeds: ['Communication clarity', 'ADHD accommodations']
    };
  }

  /**
   * Get team chemistry analytics
   */
  async getTeamAnalytics(teamId: string): Promise<{
    currentChemistry: number;
    communicationEfficiency: number;
    leadershipBalance: number;
    adhdInclusion: number;
    recommendations: string[];
    topPerformers: string[];
    improvementAreas: string[];
  }> {
    const analysis = this.analyses.get(teamId);
    
    if (!analysis) {
      // Generate new analysis if none exists
      const newAnalysis = await this.generateChemistryAnalysis(teamId);
      return this.formatAnalyticsResponse(newAnalysis);
    }
    
    return this.formatAnalyticsResponse(analysis);
  }

  /**
   * Format analytics response
   */
  private formatAnalyticsResponse(analysis: ChemistryAnalysis): {
    currentChemistry: number;
    communicationEfficiency: number;
    leadershipBalance: number;
    adhdInclusion: number;
    recommendations: string[];
    topPerformers: string[];
    improvementAreas: string[];
  } {
    return {
      currentChemistry: analysis.overallScore,
      communicationEfficiency: analysis.dimensions.communication,
      leadershipBalance: analysis.dimensions.leadership,
      adhdInclusion: analysis.dimensions.inclusion,
      recommendations: [
        ...analysis.recommendations.communicationImprovements,
        ...analysis.recommendations.adhdSupport
      ].slice(0, 5),
      topPerformers: analysis.networkAnalysis.centralFigures,
      improvementAreas: [
        'Trust building exercises',
        'Conflict resolution training',
        'ADHD awareness workshops'
      ]
    };
  }
}

// Export service instance
export const teamChemistryAnalyticsService = new TeamChemistryAnalyticsService();