import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { anthropicCoachService } from "../services/anthropicCoachService";
import { CoachMessage, CoachState, TrainingPlan } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useAnthropicCoach() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [messageHistory, setMessageHistory] = useState<CoachMessage[]>([]);
  const [coachState, setCoachState] = useState<CoachState>({
    isTyping: false,
    currentView: 'chat',
    showWelcomeMessage: true,
    userPreferences: {
      coachStyle: 'Supportive',
      notificationEnabled: true,
      focusMode: false
    }
  });
  
  // Fetch saved training plans
  const { 
    data: trainingPlans = [],
    isLoading: isLoadingPlans,
    error: trainingPlansError
  } = useQuery({
    queryKey: ['/api/anthropic-coach/training-plans'],
    queryFn: async () => {
      try {
        return await anthropicCoachService.getSavedTrainingPlans();
      } catch (error) {
        console.error("Error fetching training plans:", error);
        return [] as TrainingPlan[];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Send message to AI coach
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return await anthropicCoachService.sendMessage(message, messageHistory);
    },
    onMutate: () => {
      setCoachState(prev => ({ ...prev, isTyping: true }));
    },
    onSuccess: (coachMessage) => {
      setMessageHistory(prev => [...prev, coachMessage]);
      setCoachState(prev => ({ ...prev, isTyping: false }));
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    },
    onError: (error) => {
      console.error("Error from AI coach:", error);
      setCoachState(prev => ({ ...prev, isTyping: false }));
      toast({
        title: "Communication Error",
        description: "Could not get a response from your coach. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Generate training plan
  const generateTrainingPlanMutation = useMutation({
    mutationFn: async ({ sportType, focusArea }: { sportType: string, focusArea: string }) => {
      return await anthropicCoachService.generateTrainingPlan(sportType, focusArea);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/anthropic-coach/training-plans'] });
      toast({
        title: "Training Plan Created",
        description: "Your personalized training plan has been generated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error generating training plan:", error);
      toast({
        title: "Error Creating Plan",
        description: "Could not generate your training plan. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Generate video feedback
  const generateVideoFeedbackMutation = useMutation({
    mutationFn: async ({ 
      sportType, 
      videoDescription,
      videoId
    }: { 
      sportType: string, 
      videoDescription: string,
      videoId?: number
    }) => {
      return await anthropicCoachService.generateVideoFeedback(
        sportType, 
        videoDescription,
        videoId
      );
    },
    onSuccess: (feedback) => {
      toast({
        title: "Video Analysis Complete",
        description: "Your performance analysis is ready to view.",
      });
      return feedback;
    },
    onError: (error) => {
      console.error("Error generating video feedback:", error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze your video. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Add user message to history and trigger coach response
  const sendMessage = useCallback(async (messageContent: string) => {
    try {
      if (!messageContent.trim()) return;
      
      // Add user message to history
      const userMessage: CoachMessage = {
        role: 'user',
        content: messageContent,
        timestamp: new Date().toISOString()
      };
      
      setMessageHistory(prev => [...prev, userMessage]);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      
      // Get response from coach
      await sendMessageMutation.mutateAsync(messageContent);
      
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [sendMessageMutation]);

  // Change the current view
  const changeView = useCallback((view: 'chat' | 'training' | 'performance' | 'settings') => {
    setCoachState(prev => ({ ...prev, currentView: view }));
  }, []);

  // Update user preferences
  const updateUserPreferences = useCallback((
    preferences: Partial<CoachState['userPreferences']>
  ) => {
    setCoachState(prev => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        ...preferences
      }
    }));
  }, []);

  // Clear message history
  const clearMessageHistory = useCallback(() => {
    setMessageHistory([]);
    setCoachState(prev => ({ ...prev, showWelcomeMessage: true }));
  }, []);

  return {
    // State
    messageHistory,
    coachState,
    messagesEndRef,
    trainingPlans,
    isLoadingPlans,
    trainingPlansError,
    
    // Actions
    sendMessage,
    changeView,
    updateUserPreferences,
    clearMessageHistory,
    
    // Mutations
    sendMessageMutation,
    generateTrainingPlanMutation,
    generateVideoFeedbackMutation
  };
}