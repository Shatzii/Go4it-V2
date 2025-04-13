/**
 * Star Path Hook
 * 
 * This hook provides access to the star path data and functionality
 * for the current user. It handles loading states, errors, and
 * provides methods to update progress and claim rewards.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { 
  getStarPathProgress,
  getStarPathMilestones,
  getStreakInfo,
  getXpHistory, 
  completeTrainingSession,
  claimMilestoneReward,
  performDailyCheckIn
} from '../services/starPathService';
import type { 
  StarPathProgress, 
  StarPathMilestone, 
  StarPathStreak,
  StarPathXpHistory,
  TrainingSessionData,
  CompletedTrainingResult,
  ClaimMilestoneResult,
  DailyCheckInResult
} from '../index';

export function useStarPath() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const userId = user?.id || 0;
  
  // Query to fetch star path progress
  const progressQuery = useQuery({
    queryKey: ['/api/star-path/progress', userId],
    queryFn: () => getStarPathProgress(userId),
    enabled: !!userId,
  });
  
  // Query to fetch star path milestones
  const milestonesQuery = useQuery({
    queryKey: ['/api/star-path/milestones', userId],
    queryFn: () => getStarPathMilestones(userId),
    enabled: !!userId,
  });
  
  // Query to fetch star path streak info
  const streakQuery = useQuery({
    queryKey: ['/api/star-path/streak', userId],
    queryFn: () => getStreakInfo(userId),
    enabled: !!userId,
  });
  
  // Query to fetch XP history
  const xpHistoryQuery = useQuery({
    queryKey: ['/api/star-path/xp-history', userId],
    queryFn: () => getXpHistory(userId),
    enabled: !!userId,
  });
  
  // Mutation to complete a training session
  const completeMutation = useMutation({
    mutationFn: (sessionData: TrainingSessionData) => {
      return completeTrainingSession(userId, sessionData);
    },
    onSuccess: (data: CompletedTrainingResult) => {
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/xp-history', userId] });
      
      let toastMessage = `Earned ${data.xpEarned} XP!`;
      
      if (data.leveledUp) {
        toastMessage += ` Leveled up to ${data.newLevel}!`;
      }
      
      if (data.unlockedReward) {
        toastMessage += ` ${data.rewardDetails}`;
      }
      
      toast({
        title: 'Training Session Completed',
        description: toastMessage,
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Completing Training',
        description: error.message || 'Could not complete training session',
        variant: 'destructive',
      });
    },
  });
  
  // Mutation to claim a milestone reward
  const claimRewardMutation = useMutation({
    mutationFn: (milestoneId: number) => {
      return claimMilestoneReward(userId, milestoneId);
    },
    onSuccess: (data: ClaimMilestoneResult) => {
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/milestones', userId] });
      
      toast({
        title: 'Reward Claimed',
        description: data.rewardDetails,
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Claiming Reward',
        description: error.message || 'Could not claim milestone reward',
        variant: 'destructive',
      });
    },
  });
  
  // Mutation to perform daily check-in
  const checkInMutation = useMutation({
    mutationFn: () => {
      return performDailyCheckIn(userId);
    },
    onSuccess: (data: DailyCheckInResult) => {
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/streak', userId] });
      
      toast({
        title: 'Daily Check-In',
        description: data.message,
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Checking In',
        description: error.message || 'Could not perform daily check-in',
        variant: 'destructive',
      });
    },
  });
  
  // Return the data, loading states, and mutation functions
  return {
    // Data
    progress: progressQuery.data as StarPathProgress | undefined,
    milestones: milestonesQuery.data as StarPathMilestone[] | undefined,
    streak: streakQuery.data as StarPathStreak | undefined,
    xpHistory: xpHistoryQuery.data as StarPathXpHistory[] | undefined,
    
    // Loading States
    isLoading: progressQuery.isLoading || milestonesQuery.isLoading || streakQuery.isLoading,
    isError: progressQuery.isError || milestonesQuery.isError || streakQuery.isError,
    
    // Mutations
    completeTraining: completeMutation.mutate,
    isCompletingTraining: completeMutation.isPending,
    
    claimReward: claimRewardMutation.mutate,
    isClaimingReward: claimRewardMutation.isPending,
    
    performCheckIn: checkInMutation.mutate,
    isCheckingIn: checkInMutation.isPending,
  };
}