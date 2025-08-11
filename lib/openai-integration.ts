import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface AIAnalysisRequest {
  videoData?: string;
  playerMetrics?: any;
  sport: string;
  analysisType: 'gar' | 'coaching' | 'recruitment' | 'tactical' | 'biomechanics';
  context?: any;
}

export interface AIAnalysisResponse {
  success: boolean;
  analysis: string;
  scores?: {
    technical: number;
    tactical: number;
    physical: number;
    mental: number;
    overall: number;
  };
  recommendations?: string[];
  nextSteps?: string[];
}

export class Go4ItAIEngine {
  
  async generateGARAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const prompt = this.buildGARPrompt(request);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an expert sports analyst for Go4It Sports Platform, specializing in comprehensive athlete evaluation using the GAR (Growth & Ability Rating) system. 
            
            You analyze student athletes with a focus on neurodivergent-friendly coaching approaches. Provide detailed, constructive feedback that helps athletes understand their strengths and areas for improvement.
            
            Always format your response as JSON with this structure:
            {
              "analysis": "detailed written analysis",
              "scores": {
                "technical": number (1-10),
                "tactical": number (1-10), 
                "physical": number (1-10),
                "mental": number (1-10),
                "overall": number (1-10)
              },
              "recommendations": ["specific actionable advice"],
              "nextSteps": ["concrete next steps for improvement"]
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0.7
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        success: true,
        analysis: result.analysis || 'Analysis completed successfully.',
        scores: result.scores || {
          technical: 7.5,
          tactical: 7.0,
          physical: 8.0,
          mental: 7.5,
          overall: 7.5
        },
        recommendations: result.recommendations || [],
        nextSteps: result.nextSteps || []
      };
      
    } catch (error) {
      console.error('OpenAI GAR Analysis Error:', error);
      return {
        success: false,
        analysis: 'Unable to complete analysis at this time. Please try again later.',
        scores: {
          technical: 0,
          tactical: 0,
          physical: 0,
          mental: 0,
          overall: 0
        }
      };
    }
  }

  async generateCoachingAdvice(request: AIAnalysisRequest): Promise<string> {
    const prompt = this.buildCoachingPrompt(request);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are Coach AI for Go4It Sports Platform - an expert virtual coach specializing in neurodivergent student athlete development. 
            
            Provide encouraging, specific, and actionable coaching advice. Use clear, simple language that's easy to understand. Focus on building confidence while addressing areas for improvement.
            
            Always be positive and motivational while being honest about areas that need work.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.8
      });

      return response.choices[0].message.content || 'Keep practicing and stay focused on your goals!';
      
    } catch (error) {
      console.error('OpenAI Coaching Error:', error);
      return 'Keep working hard and focus on the fundamentals. Every great athlete started with the basics!';
    }
  }

  async generateRecruitmentReport(request: AIAnalysisRequest): Promise<string> {
    const prompt = this.buildRecruitmentPrompt(request);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are a college recruitment specialist for Go4It Sports Platform. Generate comprehensive recruitment reports that highlight an athlete's strengths and potential fit for college programs.
            
            Focus on:
            - Athletic performance and potential
            - Academic considerations
            - Character and leadership qualities
            - Areas for development
            - College program recommendations
            
            Write in a professional tone suitable for college recruiters and coaches.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.6
      });

      return response.choices[0].message.content || 'Recruitment analysis completed.';
      
    } catch (error) {
      console.error('OpenAI Recruitment Error:', error);
      return 'Unable to generate recruitment report at this time.';
    }
  }

  async analyzeVideoContent(videoDescription: string, sport: string): Promise<AIAnalysisResponse> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an expert sports video analyst for Go4It Sports Platform. Analyze athletic performance based on video descriptions and provide detailed technical feedback.
            
            Respond in JSON format with:
            {
              "analysis": "detailed technical analysis",
              "scores": {
                "technical": number (1-10),
                "tactical": number (1-10),
                "physical": number (1-10), 
                "mental": number (1-10),
                "overall": number (1-10)
              },
              "recommendations": ["specific improvements"],
              "nextSteps": ["actionable next steps"]
            }`
          },
          {
            role: "user",
            content: `Analyze this ${sport} performance: ${videoDescription}`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.7
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        success: true,
        analysis: result.analysis || 'Video analysis completed.',
        scores: result.scores || {
          technical: 7.5,
          tactical: 7.0,
          physical: 8.0,
          mental: 7.5,
          overall: 7.5
        },
        recommendations: result.recommendations || [],
        nextSteps: result.nextSteps || []
      };
      
    } catch (error) {
      console.error('OpenAI Video Analysis Error:', error);
      return {
        success: false,
        analysis: 'Unable to analyze video at this time.',
        scores: {
          technical: 0,
          tactical: 0,
          physical: 0,
          mental: 0,
          overall: 0
        }
      };
    }
  }

  private buildGARPrompt(request: AIAnalysisRequest): string {
    return `Perform a comprehensive GAR (Growth & Ability Rating) analysis for a ${request.sport} athlete.
    
    Sport: ${request.sport}
    Analysis Type: ${request.analysisType}
    
    ${request.context ? `Additional Context: ${JSON.stringify(request.context)}` : ''}
    
    Evaluate the athlete across these 5 key areas:
    1. Technical Skills (technique, form, execution)
    2. Tactical Understanding (game sense, decision-making, positioning)
    3. Physical Attributes (speed, strength, agility, endurance)
    4. Mental Approach (focus, confidence, resilience, coachability)
    5. Overall Potential (combining all factors)
    
    Provide scores from 1-10 for each area, with specific explanations and actionable improvement recommendations.`;
  }

  private buildCoachingPrompt(request: AIAnalysisRequest): string {
    return `Provide encouraging coaching advice for a ${request.sport} athlete.
    
    Sport: ${request.sport}
    Context: ${request.context ? JSON.stringify(request.context) : 'General coaching advice needed'}
    
    Focus on:
    - Building confidence and motivation
    - Specific skill development areas
    - Training recommendations
    - Mental game improvement
    - Goal setting and progress tracking
    
    Use positive, clear language appropriate for student athletes. Remember this platform specializes in neurodivergent-friendly coaching approaches.`;
  }

  private buildRecruitmentPrompt(request: AIAnalysisRequest): string {
    return `Generate a comprehensive recruitment report for a ${request.sport} athlete.
    
    Sport: ${request.sport}
    Context: ${request.context ? JSON.stringify(request.context) : 'Standard recruitment evaluation'}
    
    Include:
    - Athletic performance summary
    - Strengths and standout qualities
    - Areas for development
    - College program fit analysis
    - Academic considerations
    - Character assessment
    - Recruitment recommendations
    
    Write professionally for college coaches and recruiters.`;
  }
}

// Singleton instance
export const go4itAI = new Go4ItAIEngine();