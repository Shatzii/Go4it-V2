import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  hybridCoachService, 
  CoachingRequest, 
  TrainingAdviceRequest,
  VideoFeedbackRequest,
  CoachingResponse,
  TrainingAdviceResponse,
  VideoFeedbackResponse
} from '../services/hybridCoachService';
import { useState } from 'react';

/**
 * Hook for using the hybrid AI coach functionality
 * Provides methods for chatting with the coach, getting training advice, and video feedback
 */
export function useHybridCoach() {
  const queryClient = useQueryClient();
  const [messageHistory, setMessageHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  
  // Chat with the coach (uses the appropriate AI model based on message content)
  const coachChatMutation = useMutation({
    mutationFn: async (request: Omit<CoachingRequest, 'messageHistory'>) => {
      const result = await hybridCoachService.getChatResponse({
        ...request,
        messageHistory
      });
      
      // Update message history
      setMessageHistory(prev => [
        ...prev,
        { role: 'user', content: request.message },
        { role: 'assistant', content: result.message }
      ]);
      
      return result;
    }
  });
  
  // Get training advice
  const trainingAdviceMutation = useMutation({
    mutationFn: async (request: TrainingAdviceRequest) => {
      return await hybridCoachService.getTrainingAdvice(request);
    }
  });
  
  // Get video feedback
  const videoFeedbackMutation = useMutation({
    mutationFn: async (request: VideoFeedbackRequest) => {
      return await hybridCoachService.getVideoFeedback(request);
    }
  });
  
  // Reset chat history
  const resetChat = () => {
    setMessageHistory([]);
  };
  
  return {
    // Chat methods
    sendMessage: coachChatMutation.mutate,
    sendMessageAsync: coachChatMutation.mutateAsync,
    isChatLoading: coachChatMutation.isPending,
    chatError: coachChatMutation.error,
    messageHistory,
    resetChat,
    
    // Training advice methods
    getTrainingAdvice: trainingAdviceMutation.mutate,
    getTrainingAdviceAsync: trainingAdviceMutation.mutateAsync,
    isTrainingAdviceLoading: trainingAdviceMutation.isPending,
    trainingAdviceError: trainingAdviceMutation.error,
    
    // Video feedback methods
    getVideoFeedback: videoFeedbackMutation.mutate,
    getVideoFeedbackAsync: videoFeedbackMutation.mutateAsync,
    isVideoFeedbackLoading: videoFeedbackMutation.isPending,
    videoFeedbackError: videoFeedbackMutation.error
  };
}