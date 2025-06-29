/**
 * Emotional Intelligence Coaching Service
 * 
 * Real-time emotion detection and ADHD-specific coaching adaptations.
 * Provides personalized feedback based on emotional state and attention patterns.
 */

import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface EmotionalState {
  timestamp: number;
  emotions: {
    confidence: number; // 0-100
    frustration: number; // 0-100
    focus: number; // 0-100
    motivation: number; // 0-100
    anxiety: number; // 0-100
    excitement: number; // 0-100
  };
  adhdIndicators: {
    hyperactivityLevel: number; // 0-100
    impulsivityMarkers: number; // 0-100
    attentionSpan: number; // seconds
    fidgetingLevel: number; // 0-100
  };
  facialAnalysis: {
    eyeContact: number; // 0-100
    facialTension: number; // 0-100
    smileIntensity: number; // 0-100
    browFurrow: number; // 0-100
  };
  bodyLanguage: {
    posture: 'alert' | 'slouched' | 'tense' | 'relaxed';
    gestureFrequency: number; // gestures per minute
    restlessness: number; // 0-100
  };
}

export interface CoachingAdaptation {
  communicationStyle: 'energetic' | 'calm' | 'encouraging' | 'directive';
  sessionAdjustments: {
    breakNeeded: boolean;
    simplifyInstructions: boolean;
    increasePositiveReinforcement: boolean;
    changeActivity: boolean;
  };
  personalizedMessage: string;
  motivationalStrategy: string;
  adhdSpecificTips: string[];
}

export class EmotionalIntelligenceService {
  private emotionalHistory: Map<string, EmotionalState[]> = new Map();
  private coachingProfiles: Map<string, any> = new Map();

  /**
   * Analyze emotional state from video/image data
   */
  async analyzeEmotionalState(
    imageData: Buffer,
    athleteId: string,
    contextInfo: {
      activityType: string;
      sessionDuration: number;
      previousPerformance: 'improving' | 'declining' | 'stable';
    }
  ): Promise<EmotionalState> {
    try {
      const base64Image = imageData.toString('base64');

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert in emotional intelligence analysis specializing in ADHD athletes.
            Analyze facial expressions, body language, and micro-expressions to determine emotional state.
            Pay special attention to ADHD-specific indicators like hyperactivity, attention, and impulsivity markers.
            Provide detailed emotional analysis in JSON format matching the EmotionalState interface.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this athlete's emotional state during ${contextInfo.activityType}. 
                Session duration: ${contextInfo.sessionDuration} minutes.
                Recent performance trend: ${contextInfo.previousPerformance}.
                Focus on ADHD-specific emotional and behavioral indicators.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      });

      const analysisData = JSON.parse(response.choices[0].message.content || '{}');
      
      const emotionalState: EmotionalState = {
        timestamp: Date.now(),
        emotions: {
          confidence: analysisData.emotions?.confidence || 75,
          frustration: analysisData.emotions?.frustration || 20,
          focus: analysisData.emotions?.focus || 70,
          motivation: analysisData.emotions?.motivation || 80,
          anxiety: analysisData.emotions?.anxiety || 15,
          excitement: analysisData.emotions?.excitement || 65
        },
        adhdIndicators: {
          hyperactivityLevel: analysisData.adhdIndicators?.hyperactivityLevel || 45,
          impulsivityMarkers: analysisData.adhdIndicators?.impulsivityMarkers || 30,
          attentionSpan: analysisData.adhdIndicators?.attentionSpan || 180,
          fidgetingLevel: analysisData.adhdIndicators?.fidgetingLevel || 25
        },
        facialAnalysis: {
          eyeContact: analysisData.facialAnalysis?.eyeContact || 70,
          facialTension: analysisData.facialAnalysis?.facialTension || 30,
          smileIntensity: analysisData.facialAnalysis?.smileIntensity || 60,
          browFurrow: analysisData.facialAnalysis?.browFurrow || 20
        },
        bodyLanguage: {
          posture: analysisData.bodyLanguage?.posture || 'alert',
          gestureFrequency: analysisData.bodyLanguage?.gestureFrequency || 8,
          restlessness: analysisData.bodyLanguage?.restlessness || 35
        }
      };

      // Store emotional history
      if (!this.emotionalHistory.has(athleteId)) {
        this.emotionalHistory.set(athleteId, []);
      }
      this.emotionalHistory.get(athleteId)!.push(emotionalState);

      return emotionalState;
    } catch (error) {
      console.error('Emotional analysis error:', error);
      return this.getDefaultEmotionalState();
    }
  }

  /**
   * Generate personalized coaching adaptation based on emotional state
   */
  async generateCoachingAdaptation(
    athleteId: string,
    currentState: EmotionalState,
    athleteProfile: {
      age: number;
      sport: string;
      adhdType: 'hyperactive' | 'inattentive' | 'combined';
      coachingPreferences: string[];
    }
  ): Promise<CoachingAdaptation> {
    const history = this.emotionalHistory.get(athleteId) || [];
    
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `As an expert ADHD sports coach, create personalized coaching adaptations.

            Current Emotional State:
            ${JSON.stringify(currentState, null, 2)}

            Athlete Profile:
            - Age: ${athleteProfile.age}
            - Sport: ${athleteProfile.sport}
            - ADHD Type: ${athleteProfile.adhdType}
            - Coaching Preferences: ${athleteProfile.coachingPreferences.join(', ')}

            Recent Emotional History (last 5 sessions):
            ${JSON.stringify(history.slice(-5), null, 2)}

            Provide coaching adaptations in JSON format matching CoachingAdaptation interface.
            Focus on:
            1. Immediate emotional needs
            2. ADHD-specific adjustments
            3. Motivational strategies that work for this athlete type
            4. Session modifications for optimal learning`
          }
        ]
      });

      const adaptationData = JSON.parse(response.content[0].text);
      
      return {
        communicationStyle: this.determineCommunicationStyle(currentState),
        sessionAdjustments: {
          breakNeeded: currentState.emotions.frustration > 60 || currentState.adhdIndicators.attentionSpan < 120,
          simplifyInstructions: currentState.emotions.focus < 50 || currentState.adhdIndicators.hyperactivityLevel > 70,
          increasePositiveReinforcement: currentState.emotions.confidence < 60,
          changeActivity: currentState.emotions.motivation < 40 || currentState.adhdIndicators.fidgetingLevel > 70
        },
        personalizedMessage: adaptationData.personalizedMessage || this.generatePersonalizedMessage(currentState, athleteProfile),
        motivationalStrategy: adaptationData.motivationalStrategy || this.getMotivationalStrategy(currentState, athleteProfile),
        adhdSpecificTips: adaptationData.adhdSpecificTips || this.getADHDSpecificTips(currentState, athleteProfile)
      };
    } catch (error) {
      console.error('Coaching adaptation error:', error);
      return this.getDefaultCoachingAdaptation(currentState, athleteProfile);
    }
  }

  /**
   * Real-time frustration detection and intervention
   */
  async detectFrustrationPattern(
    athleteId: string,
    recentStates: EmotionalState[]
  ): Promise<{
    frustrationLevel: 'low' | 'moderate' | 'high' | 'critical';
    interventionNeeded: boolean;
    suggestedIntervention: string;
    preventiveStrategies: string[];
  }> {
    const avgFrustration = recentStates.reduce((sum, state) => sum + state.emotions.frustration, 0) / recentStates.length;
    const frustrationTrend = this.calculateTrend(recentStates.map(s => s.emotions.frustration));
    
    let frustrationLevel: 'low' | 'moderate' | 'high' | 'critical';
    if (avgFrustration < 25) frustrationLevel = 'low';
    else if (avgFrustration < 50) frustrationLevel = 'moderate';
    else if (avgFrustration < 75) frustrationLevel = 'high';
    else frustrationLevel = 'critical';

    const interventionNeeded = frustrationLevel === 'high' || frustrationLevel === 'critical' || frustrationTrend > 15;

    return {
      frustrationLevel,
      interventionNeeded,
      suggestedIntervention: this.getSuggestedIntervention(frustrationLevel, frustrationTrend),
      preventiveStrategies: this.getPreventiveStrategies(recentStates)
    };
  }

  /**
   * ADHD attention span optimization
   */
  async optimizeAttentionSpan(
    athleteId: string,
    currentSession: {
      duration: number;
      activityChanges: number;
      breaksTaken: number;
    }
  ): Promise<{
    optimalSessionLength: number;
    recommendedBreakFrequency: number;
    activityVariationSuggestion: string;
    focusEnhancementTips: string[];
  }> {
    const history = this.emotionalHistory.get(athleteId) || [];
    const attentionData = history.map(state => ({
      duration: currentSession.duration,
      attentionSpan: state.adhdIndicators.attentionSpan,
      focus: state.emotions.focus
    }));

    // Analyze patterns to optimize future sessions
    const avgAttentionSpan = attentionData.reduce((sum, data) => sum + data.attentionSpan, 0) / attentionData.length || 300;
    const optimalSessionLength = Math.min(avgAttentionSpan * 1.2, 45 * 60); // Max 45 minutes

    return {
      optimalSessionLength: Math.round(optimalSessionLength / 60), // Convert to minutes
      recommendedBreakFrequency: Math.round(avgAttentionSpan / 60 / 3), // Break every 1/3 of attention span
      activityVariationSuggestion: this.getActivityVariationSuggestion(attentionData),
      focusEnhancementTips: [
        "Use visual cues and demonstrations",
        "Break complex skills into smaller steps",
        "Provide immediate feedback and rewards",
        "Allow movement between different skill stations",
        "Use gamification elements to maintain engagement"
      ]
    };
  }

  private determineCommunicationStyle(state: EmotionalState): 'energetic' | 'calm' | 'encouraging' | 'directive' {
    if (state.emotions.anxiety > 60) return 'calm';
    if (state.emotions.confidence < 50) return 'encouraging';
    if (state.adhdIndicators.hyperactivityLevel > 70) return 'directive';
    return 'energetic';
  }

  private generatePersonalizedMessage(state: EmotionalState, profile: any): string {
    const messages = {
      highFrustration: [
        "Let's take a step back and focus on what you're doing well.",
        "It's okay to feel challenged - that's how we grow stronger.",
        "Take a deep breath. We're going to break this down into smaller pieces."
      ],
      lowConfidence: [
        "You've got the skills - let's build on your strengths.",
        "Remember how much you've already improved.",
        "Every great athlete has moments like this. You're learning."
      ],
      goodFocus: [
        "I can see you're really locked in today - great job!",
        "Your concentration is on point. Let's use this momentum.",
        "This is the focused energy that leads to breakthroughs."
      ]
    };

    if (state.emotions.frustration > 60) {
      return messages.highFrustration[Math.floor(Math.random() * messages.highFrustration.length)];
    } else if (state.emotions.confidence < 50) {
      return messages.lowConfidence[Math.floor(Math.random() * messages.lowConfidence.length)];
    } else {
      return messages.goodFocus[Math.floor(Math.random() * messages.goodFocus.length)];
    }
  }

  private getMotivationalStrategy(state: EmotionalState, profile: any): string {
    const strategies = {
      hyperactive: "Channel that energy into explosive movements and quick transitions",
      inattentive: "Focus on one skill at a time with clear, visual goals",
      combined: "Use variety and movement to maintain engagement while building focus"
    };
    return strategies[profile.adhdType] || strategies.combined;
  }

  private getADHDSpecificTips(state: EmotionalState, profile: any): string[] {
    const baseTips = [
      "Use the 'two-minute rule' - focus intensely for short bursts",
      "Celebrate small wins to build momentum",
      "Use physical movement to help process information"
    ];

    const typeTips = {
      hyperactive: [
        "Use high-energy activities to release excess energy first",
        "Practice deep breathing between intense efforts",
        "Channel fidgeting into productive movement patterns"
      ],
      inattentive: [
        "Use visual and auditory cues to maintain focus",
        "Break complex movements into 3-step sequences",
        "Create external accountability through check-ins"
      ],
      combined: [
        "Alternate between high and low intensity activities",
        "Use timer-based training intervals",
        "Provide multiple ways to receive the same information"
      ]
    };

    return [...baseTips, ...typeTips[profile.adhdType]];
  }

  private getSuggestedIntervention(level: 'low' | 'moderate' | 'high' | 'critical', trend: number): string {
    const interventions = {
      low: "Continue with current approach, monitor for changes",
      moderate: "Introduce a brief mindfulness moment or skill variation",
      high: "Take an immediate break, do some deep breathing, and simplify the next activity",
      critical: "Stop current activity, take a 5-minute walk, and reassess training goals"
    };
    return interventions[level];
  }

  private getPreventiveStrategies(states: EmotionalState[]): string[] {
    return [
      "Establish clear expectations before each session",
      "Use consistent routines to reduce anxiety",
      "Provide choices when possible to increase buy-in",
      "Monitor energy levels and adjust intensity accordingly",
      "Build in success opportunities throughout the session"
    ];
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    return secondAvg - firstAvg;
  }

  private getActivityVariationSuggestion(attentionData: any[]): string {
    const avgFocus = attentionData.reduce((sum, data) => sum + data.focus, 0) / attentionData.length;
    
    if (avgFocus > 70) {
      return "Maintain current activity structure - focus levels are optimal";
    } else if (avgFocus > 50) {
      return "Consider adding one activity change every 10-15 minutes";
    } else {
      return "Increase activity variety - change activities every 5-8 minutes";
    }
  }

  private getDefaultEmotionalState(): EmotionalState {
    return {
      timestamp: Date.now(),
      emotions: {
        confidence: 70,
        frustration: 25,
        focus: 65,
        motivation: 75,
        anxiety: 20,
        excitement: 60
      },
      adhdIndicators: {
        hyperactivityLevel: 40,
        impulsivityMarkers: 30,
        attentionSpan: 240,
        fidgetingLevel: 25
      },
      facialAnalysis: {
        eyeContact: 65,
        facialTension: 25,
        smileIntensity: 55,
        browFurrow: 15
      },
      bodyLanguage: {
        posture: 'alert',
        gestureFrequency: 6,
        restlessness: 30
      }
    };
  }

  private getDefaultCoachingAdaptation(state: EmotionalState, profile: any): CoachingAdaptation {
    return {
      communicationStyle: 'encouraging',
      sessionAdjustments: {
        breakNeeded: false,
        simplifyInstructions: false,
        increasePositiveReinforcement: true,
        changeActivity: false
      },
      personalizedMessage: "You're doing great! Let's keep building on your strengths.",
      motivationalStrategy: "Focus on steady progress and celebrate every improvement",
      adhdSpecificTips: [
        "Take breaks when you need them",
        "Focus on one thing at a time",
        "Use your natural energy to your advantage"
      ]
    };
  }
}

export const emotionalIntelligenceService = new EmotionalIntelligenceService();