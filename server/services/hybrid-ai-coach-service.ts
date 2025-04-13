import { anthropicService } from './anthropic-service';
import { openAIService } from './openai-service';
import OpenAI from 'openai';

/**
 * Service for managing hybrid AI coaching capabilities 
 * that intelligently routes requests between Claude and GPT models
 * based on the specific task requirements.
 */
export class HybridAiCoachService {
  private openai: OpenAI | null = null;
  
  constructor() {
    console.log('Hybrid AI Coach Service initialized');
    this.initializeOpenAI();
  }
  
  /**
   * Initialize OpenAI client
   */
  private async initializeOpenAI() {
    try {
      this.openai = await openAIService.getClient();
      console.log('OpenAI client initialized for hybrid coaching');
    } catch (error) {
      console.error('Error initializing OpenAI for hybrid coaching:', error);
    }
  }
  
  /**
   * Analyzes message content to determine which AI model would be more appropriate
   * 
   * @param message The user's message
   * @returns The recommended model ('claude' or 'gpt')
   */
  private analyzeMessageContent(message: string): 'claude' | 'gpt' {
    // Convert to lowercase for matching
    const lowerMessage = message.toLowerCase();
    
    // Keywords that suggest Claude would be better (more detailed training, nuanced feedback)
    const claudeKeywords = [
      'training plan',
      'workout routine',
      'technique analysis',
      'form check',
      'detailed feedback',
      'mental approach',
      'psychology',
      'neurodivergent',
      'adhd strategies',
      'learning style',
      'focus issues',
      'attention',
      'comprehensive',
      'personalized plan'
    ];
    
    // Keywords that suggest GPT might be better (factual, tactical, statistics)
    const gptKeywords = [
      'stats',
      'statistics',
      'player comparison',
      'historical',
      'rules',
      'quick tips',
      'game strategy',
      'tactical',
      'record',
      'schedule',
      'league',
      'tournament',
      'equipment',
      'nutrition facts',
      'game plan'
    ];
    
    // Count matches for each model
    let claudeMatches = 0;
    let gptMatches = 0;
    
    // Check Claude keywords
    for (const keyword of claudeKeywords) {
      if (lowerMessage.includes(keyword)) {
        claudeMatches++;
      }
    }
    
    // Check GPT keywords
    for (const keyword of gptKeywords) {
      if (lowerMessage.includes(keyword)) {
        gptMatches++;
      }
    }
    
    // Check for explicit question types - Claude is better at personalized training/technique
    const askingForTrainingPlan = 
      lowerMessage.includes('create a training plan') || 
      lowerMessage.includes('build me a workout') ||
      lowerMessage.includes('design a program');
      
    if (askingForTrainingPlan) {
      claudeMatches += 3; // Give extra weight to these specific requests
    }
    
    // Check for statistics or fact-checking requests - GPT is better at these
    const askingForStats = 
      lowerMessage.includes('what are the stats') || 
      lowerMessage.includes('player records') ||
      lowerMessage.includes('tell me about the history');
      
    if (askingForStats) {
      gptMatches += 3; // Give extra weight to these specific requests
    }
    
    // Make the decision based on keyword matches
    return claudeMatches >= gptMatches ? 'claude' : 'gpt';
  }
  
  /**
   * Generate a coaching response using the appropriate AI model
   * 
   * @param userId The user ID
   * @param message The user's message
   * @param modelPreference Optional preference for which model to use
   * @returns The AI response and which model was used
   */
  async getCoachingResponse(
    userId: number, 
    message: string, 
    messageHistory: Array<{role: 'user' | 'assistant', content: string}> = [],
    modelPreference: 'claude' | 'gpt' | 'auto' = 'auto'
  ): Promise<{message: string, source: string}> {
    try {
      console.log(`Getting coaching response for user ${userId}, model preference: ${modelPreference}`);
      
      // Determine which model to use
      let modelToUse: 'claude' | 'gpt';
      
      if (modelPreference === 'claude' || modelPreference === 'gpt') {
        modelToUse = modelPreference;
      } else {
        modelToUse = this.analyzeMessageContent(message);
      }
      
      console.log(`Using ${modelToUse} for response`);
      
      // Use the appropriate model
      if (modelToUse === 'claude') {
        const response = await anthropicService.getChatResponse(message, messageHistory);
        return { message: response, source: 'claude' };
      } else {
        // Ensure OpenAI client is initialized
        if (!this.openai) {
          await this.initializeOpenAI();
          if (!this.openai) {
            throw new Error('OpenAI client not available');
          }
        }
        
        // System instruction for coaching context
        const systemPrompt = `
          You are an AI sports coach for a platform called Go4It Sports focused on 
          student athletes aged 12-18 who may have ADHD or other neurodivergent traits.
          Provide clear, concise coaching advice that's structured and easy to follow.
          Use bullet points, numbered lists, and short paragraphs to improve readability.
          Focus on being encouraging, accurate, and providing actionable advice.
          Adjust your guidance to the athlete's apparent skill level and sport.
        `;
        
        // Format message history for OpenAI
        const formattedHistory = messageHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        // Call OpenAI API
        const response = await this.openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            { role: "system", content: systemPrompt },
            ...formattedHistory,
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 800
        });
        
        return { 
          message: response.choices[0].message.content || "I'm sorry, I couldn't generate a response.", 
          source: 'gpt' 
        };
      }
    } catch (error) {
      console.error('Error in getCoachingResponse:', error);
      throw error;
    }
  }
  
  /**
   * Generate personalized training advice for a specific sport and focus area
   * 
   * @param userId The user ID
   * @param sport The sport type
   * @param skillLevel The user's skill level
   * @param focusArea The specific area to focus on
   * @returns Training advice, drills, and which model was used
   */
  async getPersonalizedTrainingAdvice(
    userId: number, 
    sport: string, 
    skillLevel: string, 
    focusArea: string
  ): Promise<{advice: string, drills: any[], source: string}> {
    try {
      console.log(`Getting personalized training advice for user ${userId} in ${sport} with focus on ${focusArea}`);
      
      // For training plans and skill development, Claude is typically better
      // Claude provides more detailed explanations for specific drills and techniques
      const response = await anthropicService.generateTrainingPlan(sport, focusArea);
      
      // Extract the advice and create a drill list from the training plan
      const advice = response.overview || 
        `Here's a personalized training plan for ${focusArea} in ${sport} at ${skillLevel} level.`;
      
      // Convert training plan days to drills
      const drills = response.days.flatMap((day: any) => {
        return (day.activities || []).map((activity: any) => ({
          name: activity.name,
          description: activity.description,
          duration: activity.duration,
          difficulty: skillLevel,
          adhdConsiderations: activity.adhdConsiderations || null
        }));
      }).slice(0, 5); // Take up to 5 drills
      
      return { 
        advice,
        drills,
        source: 'claude' // Claude is better for training plan generation
      };
    } catch (error) {
      console.error('Error in getPersonalizedTrainingAdvice:', error);
      throw error;
    }
  }
  
  /**
   * Generate feedback on a sports performance video
   */
  async generateVideoFeedback(
    userId: number,
    sportType: string,
    videoDescription: string
  ): Promise<{feedback: any, source: string}> {
    try {
      console.log(`Generating video feedback for user ${userId} in ${sportType}`);
      
      // Video analysis is better suited to Claude's detailed observation capabilities
      const feedback = await anthropicService.generateVideoFeedback(sportType, videoDescription);
      
      return {
        feedback,
        source: 'claude'
      };
    } catch (error) {
      console.error('Error generating video feedback:', error);
      throw error;
    }
  }
}

export const hybridAiCoachService = new HybridAiCoachService();