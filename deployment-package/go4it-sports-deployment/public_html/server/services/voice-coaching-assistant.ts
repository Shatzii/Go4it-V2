/**
 * Go4It Sports - Voice-Activated Coaching Assistant Service
 * 
 * Provides hands-free coaching guidance through natural language processing
 * with ADHD-optimized voice interactions and personalized coaching responses.
 */

import { Request, Response } from 'express';

// Voice Coaching Types
export interface VoiceCommand {
  id: string;
  athleteId: string;
  transcription: string;
  intent: VoiceIntent;
  confidence: number; // 0-1
  timestamp: Date;
  context: {
    sport: string;
    activity: string;
    environment: 'training' | 'game' | 'practice' | 'analysis';
    emotionalState?: string;
  };
  response: VoiceResponse;
  adhdAdaptations: {
    simplifiedLanguage: boolean;
    positiveReinforcement: boolean;
    shortResponses: boolean;
    repetitionAllowed: boolean;
  };
}

export interface VoiceIntent {
  type: 'question' | 'request-feedback' | 'request-drill' | 'motivational-support' | 
        'technique-help' | 'strategy-advice' | 'performance-check' | 'confidence-boost';
  category: 'technical' | 'mental' | 'tactical' | 'motivational' | 'educational';
  specificity: 'general' | 'specific' | 'detailed';
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  adhdContext?: 'focus-help' | 'frustration-management' | 'confidence-building' | 'energy-management';
}

export interface VoiceResponse {
  id: string;
  text: string;
  audioUrl?: string;
  duration: number; // seconds
  tone: 'encouraging' | 'instructional' | 'motivational' | 'calm' | 'energetic';
  complexity: 'simple' | 'moderate' | 'detailed';
  followUpSuggestions: string[];
  visualAids?: string[]; // Associated visual demonstrations
  practiceInstructions?: string[];
}

export interface CoachingSession {
  id: string;
  athleteId: string;
  startTime: Date;
  endTime?: Date;
  sport: string;
  sessionType: 'training' | 'analysis' | 'motivation' | 'strategy';
  commands: VoiceCommand[];
  progressMetrics: {
    questionsAnswered: number;
    techniquesExplained: number;
    motivationalMoments: number;
    adhdInterventions: number;
    satisfactionScore: number; // 1-10
  };
  adaptations: {
    speechRate: 'slow' | 'normal' | 'fast';
    vocabularyLevel: 'basic' | 'intermediate' | 'advanced';
    responseLength: 'brief' | 'moderate' | 'detailed';
    encouragementFrequency: 'high' | 'medium' | 'low';
  };
}

export interface CoachingPersonality {
  id: string;
  name: string;
  style: 'supportive' | 'challenging' | 'analytical' | 'enthusiastic' | 'calm';
  expertise: string[];
  adhdSpecialization: boolean;
  voiceCharacteristics: {
    tone: string;
    pace: string;
    energy: string;
    formality: 'casual' | 'professional' | 'friendly';
  };
  communicationPreferences: {
    usesAnalogies: boolean;
    providesStepByStep: boolean;
    offersEncouragement: boolean;
    adaptsToMood: boolean;
  };
}

// Coaching Personalities Database
const coachingPersonalities: CoachingPersonality[] = [
  {
    id: 'coach-sarah',
    name: 'Coach Sarah',
    style: 'supportive',
    expertise: ['technique-development', 'confidence-building', 'adhd-support'],
    adhdSpecialization: true,
    voiceCharacteristics: {
      tone: 'warm and encouraging',
      pace: 'moderate with pauses',
      energy: 'calm but positive',
      formality: 'friendly'
    },
    communicationPreferences: {
      usesAnalogies: true,
      providesStepByStep: true,
      offersEncouragement: true,
      adaptsToMood: true
    }
  },
  {
    id: 'coach-marcus',
    name: 'Coach Marcus',
    style: 'challenging',
    expertise: ['performance-optimization', 'mental-toughness', 'competitive-preparation'],
    adhdSpecialization: true,
    voiceCharacteristics: {
      tone: 'confident and direct',
      pace: 'steady with emphasis',
      energy: 'high motivation',
      formality: 'professional'
    },
    communicationPreferences: {
      usesAnalogies: false,
      providesStepByStep: true,
      offersEncouragement: true,
      adaptsToMood: true
    }
  },
  {
    id: 'coach-alex',
    name: 'Coach Alex',
    style: 'analytical',
    expertise: ['technique-analysis', 'strategy-development', 'performance-data'],
    adhdSpecialization: true,
    voiceCharacteristics: {
      tone: 'clear and informative',
      pace: 'measured and precise',
      energy: 'focused intensity',
      formality: 'professional'
    },
    communicationPreferences: {
      usesAnalogies: true,
      providesStepByStep: true,
      offersEncouragement: false,
      adaptsToMood: false
    }
  }
];

// Pre-defined coaching responses for different scenarios
const coachingResponses = {
  'technique-help': {
    'flag-football': {
      'quarterback': [
        "Let's work on your throwing motion. Keep your elbow high and step into the throw. Think of it like painting a wall - smooth, controlled motion from start to finish.",
        "For better accuracy, focus on your follow-through. Your hand should point where you want the ball to go, like you're shaking hands with your receiver.",
        "Footwork is key! Plant your back foot, step toward your target, and let your hips lead the throw. It's like a dance - rhythm and timing matter."
      ]
    },
    'soccer': {
      'midfielder': [
        "Great question! For better ball control, think of your first touch as setting up your next move. Cushion the ball with the inside of your foot, like catching an egg.",
        "Passing accuracy comes from your plant foot. Point it where you want the ball to go, and follow through low for ground passes, high for chips."
      ]
    },
    'basketball': {
      'point-guard': [
        "Ball handling is about confidence and rhythm. Keep your head up, use your fingertips not your palm, and remember - the ball should bounce back to you naturally.",
        "When driving to the basket, protect the ball with your off-hand and keep your dribble low and tight. Think 'shield and attack'."
      ]
    }
  },
  'motivational-support': {
    'frustration': [
      "I hear the frustration in your voice. Take a deep breath with me. Remember, every great athlete has moments like this - it's how we grow stronger.",
      "You're working hard and that's what matters. Your ADHD gives you unique strengths - hyperfocus, creativity, and energy. Channel that into your next attempt.",
      "Let's reset. One thing at a time. You've got this, and I believe in you. What feels most important to work on right now?"
    ],
    'confidence': [
      "You're showing real improvement! That's the result of your dedication and hard work paying off.",
      "I love your determination. You're developing skills that will serve you well beyond sports - focus, persistence, and resilience.",
      "Your unique perspective and energy are strengths. Many successful athletes have ADHD and use it to their advantage."
    ]
  },
  'adhd-specific': {
    'focus-help': [
      "Let's bring your attention back to one thing. Look at my voice as your anchor. What's the one skill we're working on right now?",
      "I notice your energy shifting. That's normal and okay. Let's use that energy - channel it into this next rep with intention.",
      "Time for a focus reset. Take three deep breaths and tell me what you want to achieve in the next 60 seconds."
    ],
    'energy-management': [
      "I can hear you're feeling energetic! Let's use that power. High-energy practice can be your superpower when directed well.",
      "Your energy is an asset. Let's channel it into explosive movements and quick decisions. Ready for some high-intensity drills?",
      "That restless feeling? It's your athlete brain ready to perform. Let's put it to work!"
    ]
  }
};

// Voice Coaching Assistant Service Class
export class VoiceCoachingAssistantService {
  private activeSessions: Map<string, CoachingSession> = new Map();
  private personalities: Map<string, CoachingPersonality> = new Map();
  private commandHistory: Map<string, VoiceCommand[]> = new Map();

  constructor() {
    // Initialize coaching personalities
    coachingPersonalities.forEach(personality => {
      this.personalities.set(personality.id, personality);
    });
  }

  /**
   * Process voice command from athlete
   */
  async processVoiceCommand(
    athleteId: string,
    transcription: string,
    context: VoiceCommand['context']
  ): Promise<VoiceCommand> {
    // Analyze intent using NLP
    const intent = await this.analyzeIntent(transcription, context);
    
    // Get athlete's ADHD profile for adaptations
    const adhdAdaptations = await this.getADHDAdaptations(athleteId);
    
    // Generate appropriate response
    const response = await this.generateResponse(intent, context, adhdAdaptations);
    
    const command: VoiceCommand = {
      id: `cmd-${Date.now()}-${athleteId}`,
      athleteId,
      transcription,
      intent,
      confidence: 0.85, // Would be from actual NLP confidence
      timestamp: new Date(),
      context,
      response,
      adhdAdaptations
    };

    // Store command history
    const history = this.commandHistory.get(athleteId) || [];
    history.push(command);
    this.commandHistory.set(athleteId, history);

    return command;
  }

  /**
   * Analyze voice command intent using NLP
   */
  private async analyzeIntent(transcription: string, context: VoiceCommand['context']): Promise<VoiceIntent> {
    const lowerText = transcription.toLowerCase();
    
    // Intent detection patterns
    const patterns = {
      'question': ['how do', 'what is', 'can you explain', 'why does'],
      'request-feedback': ['how did i do', 'was that good', 'feedback on', 'rate my'],
      'request-drill': ['give me a drill', 'practice for', 'work on', 'improve my'],
      'motivational-support': ['i\'m frustrated', 'this is hard', 'i can\'t', 'help me feel'],
      'technique-help': ['technique for', 'form check', 'am i doing this right', 'correct way'],
      'strategy-advice': ['strategy for', 'game plan', 'what should i do when'],
      'performance-check': ['how am i improving', 'progress check', 'am i getting better'],
      'confidence-boost': ['i\'m nervous', 'not confident', 'scared to', 'boost my']
    };

    let detectedType: VoiceIntent['type'] = 'question'; // default
    let maxMatches = 0;

    for (const [type, phraseList] of Object.entries(patterns)) {
      const matches = phraseList.filter(phrase => lowerText.includes(phrase)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedType = type as VoiceIntent['type'];
      }
    }

    // ADHD context detection
    let adhdContext: VoiceIntent['adhdContext'] | undefined;
    if (lowerText.includes('focus') || lowerText.includes('concentrate')) {
      adhdContext = 'focus-help';
    } else if (lowerText.includes('frustrated') || lowerText.includes('angry')) {
      adhdContext = 'frustration-management';
    } else if (lowerText.includes('confident') || lowerText.includes('believe')) {
      adhdContext = 'confidence-building';
    } else if (lowerText.includes('energy') || lowerText.includes('restless')) {
      adhdContext = 'energy-management';
    }

    return {
      type: detectedType,
      category: this.determineCategory(detectedType, lowerText),
      specificity: lowerText.length > 100 ? 'detailed' : lowerText.length > 30 ? 'specific' : 'general',
      urgency: this.determineUrgency(lowerText, context),
      adhdContext
    };
  }

  /**
   * Determine intent category
   */
  private determineCategory(type: VoiceIntent['type'], text: string): VoiceIntent['category'] {
    if (type === 'technique-help' || text.includes('form') || text.includes('technique')) {
      return 'technical';
    }
    if (type === 'motivational-support' || type === 'confidence-boost') {
      return 'motivational';
    }
    if (type === 'strategy-advice' || text.includes('strategy') || text.includes('game plan')) {
      return 'tactical';
    }
    if (text.includes('mental') || text.includes('psychology') || text.includes('mindset')) {
      return 'mental';
    }
    return 'educational';
  }

  /**
   * Determine urgency level
   */
  private determineUrgency(text: string, context: VoiceCommand['context']): VoiceIntent['urgency'] {
    if (text.includes('help') || text.includes('frustrated') || text.includes('stuck')) {
      return context.environment === 'game' ? 'immediate' : 'high';
    }
    if (context.environment === 'game') {
      return 'high';
    }
    if (text.includes('quick') || text.includes('now') || text.includes('right away')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Get ADHD adaptations for athlete
   */
  private async getADHDAdaptations(athleteId: string): Promise<VoiceCommand['adhdAdaptations']> {
    // Would get from athlete profile in real implementation
    return {
      simplifiedLanguage: true,
      positiveReinforcement: true,
      shortResponses: true,
      repetitionAllowed: true
    };
  }

  /**
   * Generate appropriate coaching response
   */
  private async generateResponse(
    intent: VoiceIntent,
    context: VoiceCommand['context'],
    adaptations: VoiceCommand['adhdAdaptations']
  ): Promise<VoiceResponse> {
    let responseText = '';
    let tone: VoiceResponse['tone'] = 'encouraging';
    let complexity: VoiceResponse['complexity'] = adaptations.simplifiedLanguage ? 'simple' : 'moderate';

    // Select response based on intent and context
    if (intent.adhdContext) {
      responseText = await this.getADHDSpecificResponse(intent.adhdContext);
      tone = intent.adhdContext === 'frustration-management' ? 'calm' : 'encouraging';
    } else if (intent.type === 'technique-help') {
      responseText = await this.getTechniqueResponse(context.sport, context.activity);
      tone = 'instructional';
    } else if (intent.type === 'motivational-support') {
      responseText = await this.getMotivationalResponse('general');
      tone = 'motivational';
    } else {
      responseText = await this.getGeneralResponse(intent.type, context);
      tone = 'encouraging';
    }

    // Adapt response length for ADHD
    if (adaptations.shortResponses && responseText.length > 200) {
      responseText = this.shortenResponse(responseText);
    }

    // Add positive reinforcement if needed
    if (adaptations.positiveReinforcement) {
      responseText = this.addPositiveReinforcement(responseText);
    }

    return {
      id: `resp-${Date.now()}`,
      text: responseText,
      duration: Math.ceil(responseText.length / 10), // Rough estimate
      tone,
      complexity,
      followUpSuggestions: await this.generateFollowUpSuggestions(intent, context),
      visualAids: await this.suggestVisualAids(intent, context),
      practiceInstructions: await this.generatePracticeInstructions(intent, context)
    };
  }

  /**
   * Get ADHD-specific response
   */
  private async getADHDSpecificResponse(adhdContext: string): Promise<string> {
    const responses = coachingResponses['adhd-specific'][adhdContext] || [];
    return responses[Math.floor(Math.random() * responses.length)] || 
           "I understand what you're going through. Let's work together to find the best approach for you.";
  }

  /**
   * Get technique-specific response
   */
  private async getTechniqueResponse(sport: string, activity: string): Promise<string> {
    const sportResponses = coachingResponses['technique-help'][sport];
    if (sportResponses && sportResponses[activity]) {
      const responses = sportResponses[activity];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    return "Great question about technique! Let's break this down step by step to help you improve.";
  }

  /**
   * Get motivational response
   */
  private async getMotivationalResponse(type: string): Promise<string> {
    const responses = coachingResponses['motivational-support'][type] || 
                     coachingResponses['motivational-support']['confidence'];
    return responses[Math.floor(Math.random() * responses.length)] || 
           "You're doing great! Keep pushing yourself and trust the process.";
  }

  /**
   * Get general response
   */
  private async getGeneralResponse(intentType: string, context: VoiceCommand['context']): Promise<string> {
    const responses = {
      'question': "That's a great question! Let me help you understand this better.",
      'request-feedback': "You're showing real improvement! Here's what I noticed...",
      'request-drill': "I've got the perfect drill for you. Let's work on this together.",
      'strategy-advice': "Here's a strategy that could work well for your situation.",
      'performance-check': "Your progress has been impressive! Let me share what I've observed."
    };
    
    return responses[intentType] || "I'm here to help you succeed. What would you like to work on?";
  }

  /**
   * Shorten response for ADHD attention span
   */
  private shortenResponse(text: string): string {
    const sentences = text.split('. ');
    if (sentences.length <= 2) return text;
    
    return sentences.slice(0, 2).join('. ') + '.';
  }

  /**
   * Add positive reinforcement
   */
  private addPositiveReinforcement(text: string): string {
    const reinforcements = [
      "You're doing great! ",
      "I love your focus! ",
      "Keep it up! ",
      "You've got this! "
    ];
    
    const reinforcement = reinforcements[Math.floor(Math.random() * reinforcements.length)];
    return reinforcement + text;
  }

  /**
   * Generate follow-up suggestions
   */
  private async generateFollowUpSuggestions(
    intent: VoiceIntent,
    context: VoiceCommand['context']
  ): Promise<string[]> {
    const suggestions = [
      "Would you like me to explain that differently?",
      "Should we practice this step by step?",
      "Want to see a visual demonstration?",
      "Ready to try it again with my guidance?"
    ];

    if (intent.adhdContext === 'focus-help') {
      suggestions.unshift("Need a quick focus break?");
    }

    return suggestions.slice(0, 3);
  }

  /**
   * Suggest visual aids
   */
  private async suggestVisualAids(
    intent: VoiceIntent,
    context: VoiceCommand['context']
  ): Promise<string[]> {
    if (intent.type === 'technique-help') {
      return ['slow-motion-demo', 'form-comparison', 'step-by-step-guide'];
    }
    if (intent.category === 'tactical') {
      return ['field-diagram', 'play-visualization', 'position-guide'];
    }
    return [];
  }

  /**
   * Generate practice instructions
   */
  private async generatePracticeInstructions(
    intent: VoiceIntent,
    context: VoiceCommand['context']
  ): Promise<string[]> {
    if (intent.type === 'request-drill') {
      return [
        "Start with 5 slow repetitions",
        "Focus on form over speed",
        "Take a 30-second break between sets",
        "Ask for feedback after each set"
      ];
    }
    return [];
  }

  /**
   * Start coaching session
   */
  async startCoachingSession(
    athleteId: string,
    sport: string,
    sessionType: CoachingSession['sessionType']
  ): Promise<CoachingSession> {
    const session: CoachingSession = {
      id: `session-${Date.now()}-${athleteId}`,
      athleteId,
      startTime: new Date(),
      sport,
      sessionType,
      commands: [],
      progressMetrics: {
        questionsAnswered: 0,
        techniquesExplained: 0,
        motivationalMoments: 0,
        adhdInterventions: 0,
        satisfactionScore: 0
      },
      adaptations: {
        speechRate: 'normal',
        vocabularyLevel: 'intermediate',
        responseLength: 'moderate',
        encouragementFrequency: 'medium'
      }
    };

    this.activeSessions.set(session.id, session);
    return session;
  }

  /**
   * Add command to session
   */
  async addCommandToSession(sessionId: string, command: VoiceCommand): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.commands.push(command);
    
    // Update progress metrics
    this.updateProgressMetrics(session, command);
    
    this.activeSessions.set(sessionId, session);
  }

  /**
   * Update session progress metrics
   */
  private updateProgressMetrics(session: CoachingSession, command: VoiceCommand): void {
    switch (command.intent.type) {
      case 'question':
        session.progressMetrics.questionsAnswered++;
        break;
      case 'technique-help':
        session.progressMetrics.techniquesExplained++;
        break;
      case 'motivational-support':
      case 'confidence-boost':
        session.progressMetrics.motivationalMoments++;
        break;
    }

    if (command.intent.adhdContext) {
      session.progressMetrics.adhdInterventions++;
    }
  }

  /**
   * Complete coaching session
   */
  async completeCoachingSession(sessionId: string, satisfactionScore: number): Promise<CoachingSession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.endTime = new Date();
    session.progressMetrics.satisfactionScore = satisfactionScore;
    
    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Get coaching analytics
   */
  async getCoachingAnalytics(athleteId: string): Promise<{
    totalSessions: number;
    averageSatisfaction: number;
    commonQuestions: string[];
    adhdSupportFrequency: number;
    improvementAreas: string[];
    coachingEffectiveness: number;
  }> {
    const sessions = Array.from(this.activeSessions.values())
      .filter(session => session.athleteId === athleteId && session.endTime);

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageSatisfaction: 0,
        commonQuestions: [],
        adhdSupportFrequency: 0,
        improvementAreas: [],
        coachingEffectiveness: 0
      };
    }

    const totalSatisfaction = sessions.reduce((sum, session) => 
      sum + session.progressMetrics.satisfactionScore, 0);
    const averageSatisfaction = totalSatisfaction / sessions.length;

    const totalCommands = sessions.reduce((sum, session) => sum + session.commands.length, 0);
    const adhdInterventions = sessions.reduce((sum, session) => 
      sum + session.progressMetrics.adhdInterventions, 0);
    const adhdSupportFrequency = totalCommands > 0 ? (adhdInterventions / totalCommands) * 100 : 0;

    return {
      totalSessions: sessions.length,
      averageSatisfaction: Math.round(averageSatisfaction * 10) / 10,
      commonQuestions: await this.getCommonQuestions(athleteId),
      adhdSupportFrequency: Math.round(adhdSupportFrequency),
      improvementAreas: await this.identifyImprovementAreas(sessions),
      coachingEffectiveness: Math.round(averageSatisfaction * 10)
    };
  }

  /**
   * Get common questions from athlete
   */
  private async getCommonQuestions(athleteId: string): Promise<string[]> {
    const history = this.commandHistory.get(athleteId) || [];
    const questionCounts = new Map<string, number>();

    history.forEach(command => {
      if (command.intent.type === 'question') {
        const key = command.transcription.toLowerCase();
        questionCounts.set(key, (questionCounts.get(key) || 0) + 1);
      }
    });

    return Array.from(questionCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([question]) => question);
  }

  /**
   * Identify improvement areas from session data
   */
  private async identifyImprovementAreas(sessions: CoachingSession[]): Promise<string[]> {
    const areas: string[] = [];

    const avgSatisfaction = sessions.reduce((sum, s) => s.progressMetrics.satisfactionScore, 0) / sessions.length;
    if (avgSatisfaction < 7) {
      areas.push('Overall coaching satisfaction needs improvement');
    }

    const adhdSupport = sessions.reduce((sum, s) => s.progressMetrics.adhdInterventions, 0);
    if (adhdSupport > sessions.length * 3) {
      areas.push('Increase proactive ADHD support strategies');
    }

    const technicalQuestions = sessions.reduce((sum, s) => s.progressMetrics.techniquesExplained, 0);
    if (technicalQuestions > sessions.length * 5) {
      areas.push('Focus on fundamental technique education');
    }

    return areas;
  }
}

// Export service instance
export const voiceCoachingAssistantService = new VoiceCoachingAssistantService();