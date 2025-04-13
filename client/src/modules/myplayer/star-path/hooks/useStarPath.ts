import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { starPathService } from '../services';
import { TrainingSessionData, CompletedTrainingResult, ClaimMilestoneResult, DailyCheckInResult } from '../index';

/**
 * Hook to handle Star Path feature data and operations
 */
export const useStarPath = (userId: number) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Star Path progress data
  const { 
    data: progressData,
    isLoading: isProgressLoading,
    error: progressError,
    refetch: refetchProgress
  } = useQuery({
    queryKey: ['/api/star-path/progress', userId],
    queryFn: () => starPathService.getStarPathProgress(userId),
    enabled: !!userId,
  });

  // Fetch Star Path milestone data
  const {
    data: milestonesData,
    isLoading: isMilestonesLoading,
    error: milestonesError
  } = useQuery({
    queryKey: ['/api/star-path/milestones', userId],
    queryFn: () => starPathService.getStarPathMilestones(userId),
    enabled: !!userId,
  });

  // Fetch user streak information
  const {
    data: streakData,
    isLoading: isStreakLoading,
    error: streakError,
    refetch: refetchStreak
  } = useQuery({
    queryKey: ['/api/star-path/streak', userId],
    queryFn: () => starPathService.getStreakInfo(userId),
    enabled: !!userId,
  });

  // Fetch XP history data
  const {
    data: xpHistoryData,
    isLoading: isXpHistoryLoading,
    error: xpHistoryError,
    refetch: refetchXpHistory
  } = useQuery({
    queryKey: ['/api/star-path/xp-history', userId],
    queryFn: () => starPathService.getXpHistory(userId),
    enabled: !!userId,
  });

  // Complete training session mutation
  const completeTrainingMutation = useMutation({
    mutationFn: (sessionData: TrainingSessionData) => 
      starPathService.completeTrainingSession(userId, sessionData),
    onSuccess: (data: CompletedTrainingResult) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/xp-history', userId] });
      
      // Show success notification
      toast({
        title: data.leveledUp ? 'Level Up! 🎉' : 'Training Completed!',
        description: data.leveledUp 
          ? `You've reached level ${data.newLevel}! Keep up the great work!` 
          : `You earned ${data.xpEarned} XP and ${data.starXpEarned} Star XP`,
        variant: data.leveledUp ? 'success' : 'default',
      });
    },
    onError: (error: Error) => {
      // Show error notification
      toast({
        title: 'Training Session Failed',
        description: error.message || 'Failed to record training session',
        variant: 'destructive',
      });
    },
  });

  // Claim milestone reward mutation
  const claimMilestoneMutation = useMutation({
    mutationFn: (milestoneId: number) => 
      starPathService.claimMilestoneReward(userId, milestoneId),
    onSuccess: (data: ClaimMilestoneResult) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/milestones', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/progress', userId] });
      
      // Show success notification
      toast({
        title: 'Milestone Reward Claimed!',
        description: data.rewardDetails,
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      // Show error notification
      toast({
        title: 'Failed to Claim Reward',
        description: error.message || 'Failed to claim milestone reward',
        variant: 'destructive',
      });
    },
  });

  // Daily check-in mutation
  const dailyCheckInMutation = useMutation({
    mutationFn: () => starPathService.performDailyCheckIn(userId),
    onSuccess: (data: DailyCheckInResult) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/streak', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/progress', userId] });
      
      const message = data.milestoneReached 
        ? `Streak: ${data.streakDays} days! Milestone reached: ${data.milestoneReward}`
        : `Streak: ${data.streakDays} days! +${data.xpEarned} XP earned`;
      
      // Show success notification
      toast({
        title: 'Daily Check-In Complete!',
        description: message,
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      // Show error notification
      toast({
        title: 'Check-In Failed',
        description: error.message || 'Failed to perform daily check-in',
        variant: 'destructive',
      });
    },
  });

  // Compile error states
  const isError = progressError || milestonesError || streakError || xpHistoryError;
  const isLoading = isProgressLoading || isMilestonesLoading || isStreakLoading || isXpHistoryLoading || isLoadingMore;

  // Helper function to refetch all data
  const refetchAllData = async () => {
    setIsLoadingMore(true);
    try {
      await Promise.all([
        refetchProgress(),
        refetchStreak(),
        refetchXpHistory()
      ]);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Complete a training session
  const completeTraining = (sessionData: TrainingSessionData) => {
    completeTrainingMutation.mutate(sessionData);
  };

  // Claim a milestone reward
  const claimMilestoneReward = (milestoneId: number) => {
    claimMilestoneMutation.mutate(milestoneId);
  };

  // Perform daily check-in
  const performDailyCheckIn = () => {
    dailyCheckInMutation.mutate();
  };

  return {
    // Data
    progressData,
    milestonesData,
    streakData,
    xpHistoryData,
    
    // Loading states
    isLoading,
    isProgressLoading,
    isMilestonesLoading,
    isStreakLoading,
    isXpHistoryLoading,
    isLoadingMore,
    
    // Error states
    isError,
    progressError,
    milestonesError,
    streakError,
    xpHistoryError,
    
    // Mutation states
    isCompletingTraining: completeTrainingMutation.isPending,
    isClaimingMilestone: claimMilestoneMutation.isPending,
    isCheckingIn: dailyCheckInMutation.isPending,
    
    // Actions
    completeTraining,
    claimMilestoneReward,
    performDailyCheckIn,
    refetchAllData,
  };
};