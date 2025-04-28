import { apiRequest } from "@lib/queryClient";
import { 
  CoachMessage, 
  TrainingPlan, 
  VideoFeedback, 
  ChatResponse, 
  TrainingPlanResponse 
} from "../types";

/**
 * Service for communicating with the Anthropic-powered AI Coach API
 */
export const anthropicCoachService = {
  /**
   * Send a message to the AI coach and get a response
   */
  async sendMessage(message: string, messageHistory: CoachMessage[] = []): Promise<CoachMessage> {
    try {
      const response = await apiRequest<ChatResponse>(
        "POST", 
        "/api/anthropic-coach/chat", 
        { message, messageHistory }
      );
      
      return {
        role: "coach",
        content: response.message,
        timestamp: response.timestamp
      };
    } catch (error) {
      console.error("Error sending message to AI coach:", error);
      throw new Error("Failed to get a response from the coach");
    }
  },

  /**
   * Generate a personalized training plan
   */
  async generateTrainingPlan(sportType: string, focusArea: string): Promise<TrainingPlan> {
    try {
      const response = await apiRequest<TrainingPlanResponse>(
        "POST", 
        "/api/anthropic-coach/training-plan", 
        { sportType, focusArea }
      );
      
      return {
        ...response.plan,
        id: response.planId
      };
    } catch (error) {
      console.error("Error generating training plan:", error);
      throw new Error("Failed to generate a training plan");
    }
  },

  /**
   * Get all saved training plans for the user
   */
  async getSavedTrainingPlans(): Promise<TrainingPlan[]> {
    try {
      return await apiRequest<TrainingPlan[]>("GET", "/api/anthropic-coach/training-plans");
    } catch (error) {
      console.error("Error fetching saved training plans:", error);
      throw new Error("Failed to fetch saved training plans");
    }
  },

  /**
   * Get a specific training plan by ID
   */
  async getTrainingPlan(planId: number): Promise<TrainingPlan> {
    try {
      return await apiRequest<TrainingPlan>("GET", `/api/anthropic-coach/training-plans/${planId}`);
    } catch (error) {
      console.error(`Error fetching training plan ${planId}:`, error);
      throw new Error("Failed to fetch training plan");
    }
  },

  /**
   * Generate feedback on a video performance
   */
  async generateVideoFeedback(
    sportType: string, 
    videoDescription: string, 
    videoId?: number
  ): Promise<VideoFeedback> {
    try {
      return await apiRequest<VideoFeedback>(
        "POST", 
        "/api/anthropic-coach/video-feedback", 
        { sportType, videoDescription, videoId }
      );
    } catch (error) {
      console.error("Error generating video feedback:", error);
      throw new Error("Failed to generate video feedback");
    }
  }
};