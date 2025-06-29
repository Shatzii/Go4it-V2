/**
 * Go4It Sports - AI-Powered Rival Competition System
 * 
 * Creates virtual competition environments with AI opponents designed to challenge
 * neurodivergent student athletes and accelerate skill development through
 * adaptive competition scenarios.
 */

import { Request, Response } from 'express';

// AI Rival Competition Types
export interface AIRival {
  id: string;
  name: string;
  sport: 'flag-football' | 'soccer' | 'basketball' | 'track-field';
  position: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite' | 'professional';
  garScore: number;
  personality: {
    competitiveness: number; // 1-10
    aggression: number; // 1-10
    adaptability: number; // 1-10
    mentalToughness: number; // 1-10
    leadership: number; // 1-10
  };
  attributes: {
    physical: Record<string, number>; // speed, strength, agility, etc.
    technical: Record<string, number>; // sport-specific skills
    mental: Record<string, number>; // decision-making, awareness, etc.
  };
  adhdAdaptations: {
    challengeStyle: 'gradual' | 'intense' | 'varied' | 'supportive';
    communicationTone: 'encouraging' | 'competitive' | 'respectful' | 'motivating';
    difficultyScaling: 'adaptive' | 'progressive' | 'dynamic';
  };
  backstory: {
    origin: string;
    motivation: string;
    strengths: string[];
    weaknesses: string[];
    rivalryContext: string;
  };
}

export interface CompetitionScenario {
  id: string;
  name: string;
  sport: string;
  type: 'skill-challenge' | 'game-simulation' | 'training-duel' | 'mental-battle' | 'team-competition';
  description: string;
  objectives: string[];
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  adhdOptimized: boolean;
  metrics: {
    primary: string[]; // Main scoring metrics
    secondary: string[]; // Additional evaluation criteria
    successThreshold: number; // Percentage to "win"
  };
  environment: {
    setting: string;
    conditions: string[];
    crowd: boolean;
    pressure: number; // 1-10
  };
  adaptations: {
    attentionBreaks: boolean;
    simplifiedRules: boolean;
    visualCues: boolean;
    immediateRewards: boolean;
    confidenceBoosts: boolean;
  };
}

export interface RivalryMatch {
  id: string;
  athleteId: string;
  rivalId: string;
  scenarioId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'paused';
  startTime: Date;
  endTime?: Date;
  performance: {
    athlete: PerformanceMetrics;
    rival: PerformanceMetrics;
    winner: 'athlete' | 'rival' | 'tie';
    winCondition: string;
  };
  progression: {
    athleteGrowth: number; // Skill points gained
    rivalAdaptation: number; // How much rival adapted
    challengeIncrease: number; // Difficulty adjustment
    confidenceImpact: number; // +/- confidence change
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    rivalReaction: string;
    nextChallenge: string;
    motivationalMessage: string;
  };
  adhdMetrics: {
    focusLevel: number; // 1-10 throughout match
    frustrationEvents: number;
    interventionsUsed: string[];
    attentionSpanOptimal: boolean;
  };
}

export interface PerformanceMetrics {
  overall: number; // 1-100
  technical: number;
  mental: number;
  physical: number;
  consistency: number;
  clutch: number; // Performance under pressure
  adaptation: number; // How well adapted during match
}

export interface RivalryProgression {
  athleteId: string;
  totalMatches: number;
  wins: number;
  losses: number;
  ties: number;
  currentStreak: { type: 'win' | 'loss'; count: number };
  favoriteRivals: string[];
  nemesisRivals: string[];
  skillGrowthRate: number;
  confidenceLevel: number;
  nextMilestones: string[];
  rivalryStories: RivalryStory[];
}

export interface RivalryStory {
  id: string;
  athleteId: string;
  rivalId: string;
  chapter: number;
  title: string;
  narrative: string;
  keyMoments: string[];
  outcome: string;
  skillsLearned: string[];
  characterGrowth: string[];
}

// AI Rivals Database
const aiRivals: AIRival[] = [
  {
    id: 'rival-qb-alex',
    name: 'Alex "Lightning" Thompson',
    sport: 'flag-football',
    position: 'quarterback',
    skillLevel: 'advanced',
    garScore: 87,
    personality: {
      competitiveness: 9,
      aggression: 6,
      adaptability: 8,
      mentalToughness: 9,
      leadership: 8
    },
    attributes: {
      physical: { speed: 85, agility: 90, armStrength: 88 },
      technical: { accuracy: 89, decision: 87, mobility: 85 },
      mental: { awareness: 90, pressure: 88, adaptation: 87 }
    },
    adhdAdaptations: {
      challengeStyle: 'gradual',
      communicationTone: 'competitive',
      difficultyScaling: 'adaptive'
    },
    backstory: {
      origin: 'State champion quarterback from rival high school',
      motivation: 'Prove that traditional training beats modern methods',
      strengths: ['Pocket presence', 'Quick release', 'Field vision'],
      weaknesses: ['Mobility under pressure', 'Deep ball accuracy'],
      rivalryContext: 'Represents the classic quarterback archetype you must overcome'
    }
  },
  {
    id: 'rival-soccer-maria',
    name: 'Maria "The Magician" Rodriguez',
    sport: 'soccer',
    position: 'midfielder',
    skillLevel: 'elite',
    garScore: 92,
    personality: {
      competitiveness: 10,
      aggression: 7,
      adaptability: 9,
      mentalToughness: 8,
      leadership: 9
    },
    attributes: {
      physical: { speed: 88, stamina: 95, agility: 93 },
      technical: { passing: 94, dribbling: 91, vision: 93 },
      mental: { creativity: 95, pressure: 89, teamwork: 90 }
    },
    adhdAdaptations: {
      challengeStyle: 'varied',
      communicationTone: 'respectful',
      difficultyScaling: 'dynamic'
    },
    backstory: {
      origin: 'Youth national team midfielder with professional aspirations',
      motivation: 'Test skills against unconventional playing styles',
      strengths: ['Creative passing', 'Field vision', 'Technical skills'],
      weaknesses: ['Physical defending', 'Long shots'],
      rivalryContext: 'Master technician who challenges your creativity and vision'
    }
  },
  {
    id: 'rival-basketball-jordan',
    name: 'Jordan "Ice Cold" Williams',
    sport: 'basketball',
    position: 'point-guard',
    skillLevel: 'advanced',
    garScore: 89,
    personality: {
      competitiveness: 9,
      aggression: 8,
      adaptability: 7,
      mentalToughness: 10,
      leadership: 9
    },
    attributes: {
      physical: { speed: 87, jumping: 83, coordination: 90 },
      technical: { shooting: 88, ballHandling: 91, defense: 85 },
      mental: { clutch: 95, leadership: 89, basketball_iq: 92 }
    },
    adhdAdaptations: {
      challengeStyle: 'intense',
      communicationTone: 'motivating',
      difficultyScaling: 'progressive'
    },
    backstory: {
      origin: 'Clutch performer known for game-winning shots',
      motivation: 'Prove mental toughness trumps athletic ability',
      strengths: ['Clutch shooting', 'Leadership', 'Pressure performance'],
      weaknesses: ['Pure athleticism', 'Defensive consistency'],
      rivalryContext: 'The ultimate mental competitor who thrives under pressure'
    }
  },
  {
    id: 'rival-track-samantha',
    name: 'Samantha "Rocket" Chen',
    sport: 'track-field',
    position: 'sprinter',
    skillLevel: 'elite',
    garScore: 94,
    personality: {
      competitiveness: 10,
      aggression: 9,
      adaptability: 6,
      mentalToughness: 9,
      leadership: 7
    },
    attributes: {
      physical: { speed: 96, power: 91, acceleration: 94 },
      technical: { starts: 93, mechanics: 90, finishing: 88 },
      mental: { focus: 92, confidence: 89, consistency: 87 }
    },
    adhdAdaptations: {
      challengeStyle: 'supportive',
      communicationTone: 'encouraging',
      difficultyScaling: 'adaptive'
    },
    backstory: {
      origin: 'State record holder looking to break national records',
      motivation: 'Push training partners to elite levels',
      strengths: ['Pure speed', 'Starting technique', 'Consistency'],
      weaknesses: ['Tactical racing', 'Mental pressure'],
      rivalryContext: 'Speed demon who sets the pace for greatness'
    }
  }
];

// Competition Scenarios Database
const competitionScenarios: CompetitionScenario[] = [
  {
    id: 'qb-accuracy-challenge',
    name: 'Quarterback Accuracy Gauntlet',
    sport: 'flag-football',
    type: 'skill-challenge',
    description: 'Hit targets at increasing distances while defenders rush',
    objectives: ['Hit 8/10 targets', 'Complete under time pressure', 'Maintain form under rush'],
    duration: 15,
    difficulty: 'intermediate',
    adhdOptimized: true,
    metrics: {
      primary: ['accuracy-percentage', 'time-to-release', 'pressure-handling'],
      secondary: ['form-consistency', 'target-difficulty', 'mental-composure'],
      successThreshold: 75
    },
    environment: {
      setting: 'Practice field with moving targets',
      conditions: ['Variable wind', 'Rushing defenders', 'Time pressure'],
      crowd: false,
      pressure: 6
    },
    adaptations: {
      attentionBreaks: true,
      simplifiedRules: true,
      visualCues: true,
      immediateRewards: true,
      confidenceBoosts: true
    }
  },
  {
    id: 'soccer-creativity-duel',
    name: 'Midfield Creativity Showdown',
    sport: 'soccer',
    type: 'training-duel',
    description: 'Create scoring opportunities through defensive pressure',
    objectives: ['Complete 6 through passes', 'Create 3 scoring chances', 'Maintain possession'],
    duration: 20,
    difficulty: 'advanced',
    adhdOptimized: true,
    metrics: {
      primary: ['pass-completion', 'chances-created', 'possession-time'],
      secondary: ['creativity-score', 'pressure-resistance', 'teamwork'],
      successThreshold: 70
    },
    environment: {
      setting: 'Half-field with dense defensive pressure',
      conditions: ['High press', 'Limited space', 'Quick transitions'],
      crowd: true,
      pressure: 7
    },
    adaptations: {
      attentionBreaks: false,
      simplifiedRules: false,
      visualCues: true,
      immediateRewards: true,
      confidenceBoosts: true
    }
  },
  {
    id: 'basketball-clutch-moments',
    name: 'Clutch Performance Challenge',
    sport: 'basketball',
    type: 'mental-battle',
    description: 'Execute game-winning plays under maximum pressure',
    objectives: ['Hit clutch shots', 'Make key assists', 'Avoid turnovers'],
    duration: 12,
    difficulty: 'advanced',
    adhdOptimized: true,
    metrics: {
      primary: ['clutch-percentage', 'decision-making', 'leadership'],
      secondary: ['confidence-display', 'team-impact', 'pressure-response'],
      successThreshold: 80
    },
    environment: {
      setting: 'Game simulation with crowd noise',
      conditions: ['Game pressure', 'Tight defense', 'Limited time'],
      crowd: true,
      pressure: 9
    },
    adaptations: {
      attentionBreaks: false,
      simplifiedRules: false,
      visualCues: false,
      immediateRewards: false,
      confidenceBoosts: true
    }
  },
  {
    id: 'track-speed-development',
    name: 'Sprint Technique Refinement',
    sport: 'track-field',
    type: 'skill-challenge',
    description: 'Perfect sprint mechanics while racing AI opponent',
    objectives: ['Improve start reaction', 'Maintain form at speed', 'Strong finish'],
    duration: 10,
    difficulty: 'intermediate',
    adhdOptimized: true,
    metrics: {
      primary: ['reaction-time', 'form-score', 'speed-consistency'],
      secondary: ['improvement-rate', 'technique-adaptation', 'mental-focus'],
      successThreshold: 75
    },
    environment: {
      setting: 'Professional track with timing systems',
      conditions: ['Perfect track', 'Ideal weather', 'Focused environment'],
      crowd: false,
      pressure: 5
    },
    adaptations: {
      attentionBreaks: true,
      simplifiedRules: true,
      visualCues: true,
      immediateRewards: true,
      confidenceBoosts: true
    }
  }
];

// AI Rival Competition Service Class
export class AIRivalCompetitionService {
  private rivals: Map<string, AIRival> = new Map();
  private scenarios: Map<string, CompetitionScenario> = new Map();
  private activeMatches: Map<string, RivalryMatch> = new Map();
  private progressions: Map<string, RivalryProgression> = new Map();

  constructor() {
    // Initialize databases
    aiRivals.forEach(rival => this.rivals.set(rival.id, rival));
    competitionScenarios.forEach(scenario => this.scenarios.set(scenario.id, scenario));
  }

  /**
   * Find optimal AI rival for athlete
   */
  async findOptimalRival(athleteProfile: {
    sport: string;
    position: string;
    garScore: number;
    skillLevel: string;
    isNeurodivergent: boolean;
    weaknesses: string[];
    goals: string[];
  }): Promise<{ rival: AIRival; matchScore: number; challengeType: string }[]> {
    const matches: { rival: AIRival; matchScore: number; challengeType: string }[] = [];

    for (const rival of this.rivals.values()) {
      if (rival.sport !== athleteProfile.sport) continue;

      const matchScore = this.calculateRivalMatch(rival, athleteProfile);
      const challengeType = this.determineOptimalChallenge(rival, athleteProfile);
      
      if (matchScore > 60) {
        matches.push({ rival, matchScore, challengeType });
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calculate rival match compatibility
   */
  private calculateRivalMatch(rival: AIRival, athlete: any): number {
    let score = 0;

    // Skill level compatibility (30 points)
    const skillDiff = Math.abs(rival.garScore - athlete.garScore);
    if (skillDiff <= 10) score += 30;
    else if (skillDiff <= 20) score += 20;
    else if (skillDiff <= 30) score += 10;

    // Position compatibility (25 points)
    if (rival.position === athlete.position) score += 25;

    // ADHD adaptations (20 points)
    if (athlete.isNeurodivergent && rival.adhdAdaptations.challengeStyle === 'gradual') score += 20;
    else if (!athlete.isNeurodivergent) score += 15;

    // Weakness targeting (15 points)
    const targetedWeaknesses = athlete.weaknesses.filter(weakness =>
      rival.backstory.strengths.some(strength => 
        strength.toLowerCase().includes(weakness.toLowerCase())
      )
    );
    score += Math.min(15, targetedWeaknesses.length * 5);

    // Personality fit (10 points)
    if (rival.personality.competitiveness >= 7) score += 5;
    if (rival.personality.adaptability >= 7) score += 5;

    return Math.min(100, score);
  }

  /**
   * Determine optimal challenge type
   */
  private determineOptimalChallenge(rival: AIRival, athlete: any): string {
    if (athlete.goals.includes('technical-improvement')) return 'skill-development';
    if (athlete.goals.includes('mental-toughness')) return 'pressure-training';
    if (athlete.goals.includes('game-performance')) return 'competitive-simulation';
    return 'balanced-growth';
  }

  /**
   * Create rivalry match
   */
  async createRivalryMatch(
    athleteId: string, 
    rivalId: string, 
    scenarioId: string
  ): Promise<RivalryMatch> {
    const rival = this.rivals.get(rivalId);
    const scenario = this.scenarios.get(scenarioId);
    
    if (!rival || !scenario) {
      throw new Error('Rival or scenario not found');
    }

    const match: RivalryMatch = {
      id: `match-${Date.now()}-${athleteId}`,
      athleteId,
      rivalId,
      scenarioId,
      status: 'scheduled',
      startTime: new Date(),
      performance: {
        athlete: this.initializePerformanceMetrics(),
        rival: this.initializePerformanceMetrics(),
        winner: 'tie',
        winCondition: ''
      },
      progression: {
        athleteGrowth: 0,
        rivalAdaptation: 0,
        challengeIncrease: 0,
        confidenceImpact: 0
      },
      feedback: {
        strengths: [],
        improvements: [],
        rivalReaction: '',
        nextChallenge: '',
        motivationalMessage: ''
      },
      adhdMetrics: {
        focusLevel: 7,
        frustrationEvents: 0,
        interventionsUsed: [],
        attentionSpanOptimal: true
      }
    };

    this.activeMatches.set(match.id, match);
    return match;
  }

  /**
   * Initialize performance metrics
   */
  private initializePerformanceMetrics(): PerformanceMetrics {
    return {
      overall: 0,
      technical: 0,
      mental: 0,
      physical: 0,
      consistency: 0,
      clutch: 0,
      adaptation: 0
    };
  }

  /**
   * Simulate AI rival performance during match
   */
  async simulateRivalPerformance(
    matchId: string, 
    athletePerformance: Partial<PerformanceMetrics>
  ): Promise<PerformanceMetrics> {
    const match = this.activeMatches.get(matchId);
    if (!match) throw new Error('Match not found');

    const rival = this.rivals.get(match.rivalId);
    if (!rival) throw new Error('Rival not found');

    // AI rival adapts based on athlete performance
    const basePerformance = this.calculateBaseRivalPerformance(rival);
    const adaptedPerformance = this.adaptRivalToAthlete(basePerformance, athletePerformance, rival);
    
    return adaptedPerformance;
  }

  /**
   * Calculate base rival performance
   */
  private calculateBaseRivalPerformance(rival: AIRival): PerformanceMetrics {
    const base = rival.garScore / 100;
    
    return {
      overall: rival.garScore,
      technical: Math.round(base * (80 + Math.random() * 20)),
      mental: Math.round(base * (75 + Math.random() * 25)),
      physical: Math.round(base * (70 + Math.random() * 30)),
      consistency: Math.round(rival.personality.mentalToughness * 10),
      clutch: Math.round(rival.personality.competitiveness * 10),
      adaptation: Math.round(rival.personality.adaptability * 10)
    };
  }

  /**
   * Adapt rival performance based on athlete performance
   */
  private adaptRivalToAthlete(
    basePerformance: PerformanceMetrics,
    athletePerformance: Partial<PerformanceMetrics>,
    rival: AIRival
  ): PerformanceMetrics {
    const adaptationFactor = rival.personality.adaptability / 10;
    const competitive = rival.personality.competitiveness / 10;
    
    // Rival performs better when athlete performs well (competitive response)
    const athleteOverall = athletePerformance.overall || 0;
    const competitiveBoost = (athleteOverall > 75) ? competitive * 5 : 0;
    
    return {
      overall: Math.min(100, basePerformance.overall + competitiveBoost),
      technical: Math.min(100, basePerformance.technical + (adaptationFactor * 3)),
      mental: Math.min(100, basePerformance.mental + competitiveBoost),
      physical: basePerformance.physical,
      consistency: Math.min(100, basePerformance.consistency + (adaptationFactor * 2)),
      clutch: Math.min(100, basePerformance.clutch + competitiveBoost),
      adaptation: Math.min(100, basePerformance.adaptation + 5)
    };
  }

  /**
   * Complete rivalry match and generate results
   */
  async completeRivalryMatch(
    matchId: string, 
    finalAthletePerformance: PerformanceMetrics
  ): Promise<RivalryMatch> {
    const match = this.activeMatches.get(matchId);
    if (!match) throw new Error('Match not found');

    const rival = this.rivals.get(match.rivalId);
    const scenario = this.scenarios.get(match.scenarioId);
    if (!rival || !scenario) throw new Error('Rival or scenario not found');

    // Finalize rival performance
    match.performance.rival = await this.simulateRivalPerformance(matchId, finalAthletePerformance);
    match.performance.athlete = finalAthletePerformance;

    // Determine winner
    const result = this.determineMatchWinner(
      finalAthletePerformance, 
      match.performance.rival, 
      scenario
    );
    match.performance.winner = result.winner;
    match.performance.winCondition = result.condition;

    // Calculate progression
    match.progression = this.calculateProgression(match, rival, scenario);

    // Generate feedback
    match.feedback = await this.generateMatchFeedback(match, rival, scenario);

    // Update match status
    match.status = 'completed';
    match.endTime = new Date();

    // Update athlete progression
    await this.updateAthleteProgression(match.athleteId, match);

    this.activeMatches.set(matchId, match);
    return match;
  }

  /**
   * Determine match winner
   */
  private determineMatchWinner(
    athletePerformance: PerformanceMetrics,
    rivalPerformance: PerformanceMetrics,
    scenario: CompetitionScenario
  ): { winner: 'athlete' | 'rival' | 'tie'; condition: string } {
    const athleteScore = this.calculateScenarioScore(athletePerformance, scenario);
    const rivalScore = this.calculateScenarioScore(rivalPerformance, scenario);

    const difference = Math.abs(athleteScore - rivalScore);
    
    if (difference < 3) {
      return { winner: 'tie', condition: 'Extremely close competition' };
    } else if (athleteScore > rivalScore) {
      return { 
        winner: 'athlete', 
        condition: athleteScore > rivalScore + 10 ? 'Dominant victory' : 'Close victory'
      };
    } else {
      return { 
        winner: 'rival', 
        condition: rivalScore > athleteScore + 10 ? 'Learning opportunity' : 'Close loss'
      };
    }
  }

  /**
   * Calculate scenario-specific score
   */
  private calculateScenarioScore(performance: PerformanceMetrics, scenario: CompetitionScenario): number {
    let score = 0;

    // Weight performance metrics based on scenario type
    switch (scenario.type) {
      case 'skill-challenge':
        score = performance.technical * 0.4 + performance.consistency * 0.3 + performance.overall * 0.3;
        break;
      case 'mental-battle':
        score = performance.mental * 0.4 + performance.clutch * 0.3 + performance.adaptation * 0.3;
        break;
      case 'game-simulation':
        score = performance.overall * 0.3 + performance.clutch * 0.25 + performance.mental * 0.25 + performance.technical * 0.2;
        break;
      case 'training-duel':
        score = performance.technical * 0.35 + performance.adaptation * 0.35 + performance.consistency * 0.3;
        break;
      default:
        score = performance.overall;
    }

    return Math.round(score);
  }

  /**
   * Calculate match progression
   */
  private calculateProgression(
    match: RivalryMatch, 
    rival: AIRival, 
    scenario: CompetitionScenario
  ): RivalryMatch['progression'] {
    const athleteScore = this.calculateScenarioScore(match.performance.athlete, scenario);
    const rivalScore = this.calculateScenarioScore(match.performance.rival, scenario);
    
    let athleteGrowth = 5; // Base growth
    let confidenceImpact = 0;
    let challengeIncrease = 0;

    // Adjust based on match outcome
    if (match.performance.winner === 'athlete') {
      athleteGrowth += Math.round(rivalScore / 10); // Learn from worthy opponent
      confidenceImpact = Math.round((athleteScore - rivalScore) / 5);
      challengeIncrease = 2;
    } else if (match.performance.winner === 'rival') {
      athleteGrowth += Math.round((100 - athleteScore) / 8); // Learn from mistakes
      confidenceImpact = -Math.round((rivalScore - athleteScore) / 8);
      challengeIncrease = 1;
    } else {
      athleteGrowth += 3;
      confidenceImpact = 1;
      challengeIncrease = 1;
    }

    // ADHD-specific adjustments
    if (match.adhdMetrics.attentionSpanOptimal) {
      athleteGrowth += 2;
    }
    if (match.adhdMetrics.frustrationEvents === 0) {
      confidenceImpact += 1;
    }

    return {
      athleteGrowth: Math.max(1, athleteGrowth),
      rivalAdaptation: Math.round(rival.personality.adaptability),
      challengeIncrease: Math.max(0, challengeIncrease),
      confidenceImpact: Math.max(-5, Math.min(5, confidenceImpact))
    };
  }

  /**
   * Generate comprehensive match feedback
   */
  private async generateMatchFeedback(
    match: RivalryMatch,
    rival: AIRival,
    scenario: CompetitionScenario
  ): Promise<RivalryMatch['feedback']> {
    const athletePerf = match.performance.athlete;
    const rivalPerf = match.performance.rival;
    
    const feedback: RivalryMatch['feedback'] = {
      strengths: [],
      improvements: [],
      rivalReaction: '',
      nextChallenge: '',
      motivationalMessage: ''
    };

    // Identify strengths
    if (athletePerf.technical > rivalPerf.technical) {
      feedback.strengths.push('Superior technical execution under pressure');
    }
    if (athletePerf.mental > rivalPerf.mental) {
      feedback.strengths.push('Strong mental game and decision-making');
    }
    if (athletePerf.clutch > 85) {
      feedback.strengths.push('Excellent performance in clutch moments');
    }

    // Identify improvements
    if (athletePerf.consistency < 70) {
      feedback.improvements.push('Focus on consistency throughout the competition');
    }
    if (athletePerf.adaptation < rivalPerf.adaptation) {
      feedback.improvements.push('Work on adapting strategy during competition');
    }
    if (match.adhdMetrics.frustrationEvents > 2) {
      feedback.improvements.push('Practice frustration management techniques');
    }

    // Generate rival reaction
    feedback.rivalReaction = this.generateRivalReaction(match, rival);

    // Suggest next challenge
    feedback.nextChallenge = this.suggestNextChallenge(match, rival);

    // Create motivational message
    feedback.motivationalMessage = this.generateMotivationalMessage(match, rival);

    return feedback;
  }

  /**
   * Generate rival reaction to match
   */
  private generateRivalReaction(match: RivalryMatch, rival: AIRival): string {
    const reactions = {
      'athlete-win': [
        `${rival.name}: "Well played! You've definitely improved since our last meeting."`,
        `${rival.name}: "That was impressive. You're becoming a real competitor."`,
        `${rival.name}: "You earned that win. I'll need to step up my game next time."`
      ],
      'rival-win': [
        `${rival.name}: "Good effort! You're getting closer each time we compete."`,
        `${rival.name}: "You showed great heart out there. Keep working and you'll beat me soon."`,
        `${rival.name}: "I can see your improvement. Don't give up - the competition is getting exciting!"`
      ],
      'tie': [
        `${rival.name}: "Now that's what I call a perfect match! We're evenly matched."`,
        `${rival.name}: "Incredible! We pushed each other to new levels today."`,
        `${rival.name}: "A tie means we're both improving. Can't wait for the rematch!"`
      ]
    };

    const outcomeKey = match.performance.winner === 'tie' ? 'tie' : 
                       match.performance.winner === 'athlete' ? 'athlete-win' : 'rival-win';
    
    const outcomeReactions = reactions[outcomeKey];
    return outcomeReactions[Math.floor(Math.random() * outcomeReactions.length)];
  }

  /**
   * Suggest next challenge based on performance
   */
  private suggestNextChallenge(match: RivalryMatch, rival: AIRival): string {
    if (match.performance.winner === 'athlete' && match.performance.athlete.overall > 85) {
      return 'Ready for a higher difficulty scenario or a new rival';
    }
    if (match.performance.winner === 'rival') {
      return 'Focus on weaknesses identified, then rematch for redemption';
    }
    return 'Continue building skills with similar scenarios before advancing';
  }

  /**
   * Generate motivational message
   */
  private generateMotivationalMessage(match: RivalryMatch, rival: AIRival): string {
    const messages = {
      'high-performance': [
        'Outstanding effort! Your ADHD superpowers are really showing in competition.',
        'That level of focus and intensity is exactly what champions are made of!',
        'You\'re proving that neurodivergent athletes can compete at the highest levels.'
      ],
      'improvement-focus': [
        'Every challenge makes you stronger. Keep pushing your limits!',
        'Your growth mindset is your greatest asset. Keep competing and improving!',
        'Remember: champions aren\'t made overnight, but through consistent effort like this.'
      ],
      'encouragement': [
        'Your determination in competition shows true athletic character.',
        'ADHD athletes often have unique competitive advantages - you\'re proving that!',
        'Each rivalry match builds skills that will serve you in real competition.'
      ]
    };

    let messageType = 'encouragement';
    if (match.performance.athlete.overall > 80) messageType = 'high-performance';
    else if (match.progression.athleteGrowth > 6) messageType = 'improvement-focus';

    const typeMessages = messages[messageType];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }

  /**
   * Update athlete progression tracking
   */
  private async updateAthleteProgression(athleteId: string, match: RivalryMatch): Promise<void> {
    let progression = this.progressions.get(athleteId);
    
    if (!progression) {
      progression = {
        athleteId,
        totalMatches: 0,
        wins: 0,
        losses: 0,
        ties: 0,
        currentStreak: { type: 'win', count: 0 },
        favoriteRivals: [],
        nemesisRivals: [],
        skillGrowthRate: 0,
        confidenceLevel: 5,
        nextMilestones: [],
        rivalryStories: []
      };
    }

    // Update match statistics
    progression.totalMatches++;
    if (match.performance.winner === 'athlete') {
      progression.wins++;
      if (progression.currentStreak.type === 'win') {
        progression.currentStreak.count++;
      } else {
        progression.currentStreak = { type: 'win', count: 1 };
      }
    } else if (match.performance.winner === 'rival') {
      progression.losses++;
      if (progression.currentStreak.type === 'loss') {
        progression.currentStreak.count++;
      } else {
        progression.currentStreak = { type: 'loss', count: 1 };
      }
    } else {
      progression.ties++;
      progression.currentStreak = { type: 'win', count: 0 }; // Reset streak on tie
    }

    // Update confidence
    progression.confidenceLevel = Math.max(1, Math.min(10, 
      progression.confidenceLevel + match.progression.confidenceImpact
    ));

    // Update skill growth rate
    const recentMatches = Math.min(5, progression.totalMatches);
    progression.skillGrowthRate = (progression.skillGrowthRate * (recentMatches - 1) + match.progression.athleteGrowth) / recentMatches;

    this.progressions.set(athleteId, progression);
  }

  /**
   * Get rivalry analytics
   */
  async getRivalryAnalytics(athleteId: string): Promise<{
    overallRecord: { wins: number; losses: number; ties: number };
    winRate: number;
    averageGrowth: number;
    confidenceLevel: number;
    favoriteRivals: { rival: AIRival; record: string }[];
    upcomingChallenges: string[];
    achievements: string[];
  }> {
    const progression = this.progressions.get(athleteId);
    
    if (!progression) {
      return {
        overallRecord: { wins: 0, losses: 0, ties: 0 },
        winRate: 0,
        averageGrowth: 0,
        confidenceLevel: 5,
        favoriteRivals: [],
        upcomingChallenges: ['Complete first rivalry match to unlock analytics'],
        achievements: []
      };
    }

    const winRate = progression.totalMatches > 0 ? 
      (progression.wins / progression.totalMatches) * 100 : 0;

    const achievements = this.calculateAchievements(progression);
    const upcomingChallenges = this.generateUpcomingChallenges(progression);
    const favoriteRivals = this.getFavoriteRivalsWithRecords(progression);

    return {
      overallRecord: {
        wins: progression.wins,
        losses: progression.losses,
        ties: progression.ties
      },
      winRate: Math.round(winRate * 10) / 10,
      averageGrowth: Math.round(progression.skillGrowthRate * 10) / 10,
      confidenceLevel: progression.confidenceLevel,
      favoriteRivals,
      upcomingChallenges,
      achievements
    };
  }

  /**
   * Calculate achievements based on progression
   */
  private calculateAchievements(progression: RivalryProgression): string[] {
    const achievements: string[] = [];

    if (progression.wins >= 1) achievements.push('First Victory');
    if (progression.wins >= 5) achievements.push('Seasoned Competitor');
    if (progression.wins >= 10) achievements.push('Rivalry Master');
    
    if (progression.currentStreak.type === 'win' && progression.currentStreak.count >= 3) {
      achievements.push('Win Streak Champion');
    }
    
    if (progression.confidenceLevel >= 8) achievements.push('Unshakeable Confidence');
    if (progression.skillGrowthRate > 8) achievements.push('Rapid Improvement');
    
    return achievements;
  }

  /**
   * Generate upcoming challenges
   */
  private generateUpcomingChallenges(progression: RivalryProgression): string[] {
    const challenges: string[] = [];

    if (progression.wins < 3) {
      challenges.push('Win your next 3 matches to unlock advanced rivals');
    }
    
    if (progression.confidenceLevel < 7) {
      challenges.push('Build confidence through consistent performance');
    }
    
    challenges.push('Try competing in a different sport scenario');
    challenges.push('Face your nemesis rival for redemption');
    
    return challenges;
  }

  /**
   * Get favorite rivals with records
   */
  private getFavoriteRivalsWithRecords(progression: RivalryProgression): 
    { rival: AIRival; record: string }[] {
    // This would track individual rival records in a real implementation
    return progression.favoriteRivals.slice(0, 3).map(rivalId => {
      const rival = this.rivals.get(rivalId);
      return {
        rival: rival!,
        record: '2-1-0' // Placeholder record
      };
    });
  }
}

// Export service instance
export const aiRivalCompetitionService = new AIRivalCompetitionService();