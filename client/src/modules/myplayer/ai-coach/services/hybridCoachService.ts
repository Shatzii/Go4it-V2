import { apiRequest } from '@lib/queryClient';

export interface CoachingRequest {
  message: string;
  messageHistory?: Array<{role: 'user' | 'assistant', content: string}>;
  modelPreference?: 'claude' | 'gpt' | 'auto';
}

export interface CoachingResponse {
  message: string;
  source: 'claude' | 'gpt';
  timestamp: string;
}

export interface TrainingAdviceRequest {
  sport: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  focusArea: string;
}

export interface TrainingDrill {
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  adhdConsiderations: string | null;
}

export interface TrainingAdviceResponse {
  advice: string;
  drills: TrainingDrill[];
  source: 'claude' | 'gpt';
}

export interface VideoFeedbackRequest {
  sportType: string;
  videoDescription: string;
}

export interface VideoFeedbackResponse {
  feedback: {
    overallAssessment: string;
    technicalAnalysis: string;
    strengths: string[];
    improvementAreas: string[];
    adhdConsiderations: string;
    nextSteps: string;
  };
  source: 'claude' | 'gpt';
}

/**
 * Service for interacting with the hybrid AI coach API
 * Intelligently routes between Claude and GPT models based on task
 */
export class HybridCoachService {
  /**
   * Get a coaching response from the appropriate AI model
   */
  async getChatResponse(request: CoachingRequest): Promise<CoachingResponse> {
    try {
      const response = await apiRequest<CoachingResponse>('/api/hybrid-coach/chat', {
        method: 'POST',
        data: request
      });
      
      return response;
    } catch (error) {
      console.error('Error getting coaching response:', error);
      throw error;
    }
  }

  /**
   * Get personalized training advice for a specific sport and focus area
   */
  async getTrainingAdvice(request: TrainingAdviceRequest): Promise<TrainingAdviceResponse> {
    try {
      const response = await apiRequest<TrainingAdviceResponse>('/api/hybrid-coach/training-advice', {
        method: 'POST',
        data: request
      });
      
      return response;
    } catch (error) {
      console.error('Error getting training advice:', error);
      throw error;
    }
  }

  /**
   * Generate feedback on a sports performance video
   */
  async getVideoFeedback(request: VideoFeedbackRequest): Promise<VideoFeedbackResponse> {
    try {
      const response = await apiRequest<VideoFeedbackResponse>('/api/hybrid-coach/video-feedback', {
        method: 'POST',
        data: request
      });
      
      return response;
    } catch (error) {
      console.error('Error getting video feedback:', error);
      throw error;
    }
  }
}

export const hybridCoachService = new HybridCoachService();