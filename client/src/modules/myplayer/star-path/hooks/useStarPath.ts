/**
 * useStarPath Hook
 * 
 * Custom hook for fetching and managing Star Path data.
 * This hook provides functionality to fetch user's star path progress,
 * milestones, and streak information. It also provides methods to update
 * progress and complete daily activities.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStarPathProgress, 
  getStarPathMilestones, 
  getXpHistory, 
  getStreakInfo, 
  updateStarPathProgress,
  performDailyCheckIn,
  completeTrainingSession,
  claimMilestoneReward,
  getStarLevelXpRequirements
} from '../services/starPathService';

/**
 * StarPathProgress interface representing user's progress data
 */
export interface StarPathProgress {
  userId: number;
  sportType: string;
  position?: string | null;
  currentStarLevel: number;
  targetStarLevel: number;
  progress: number;
  storylinePhase: string;
  xpTotal: number;
  completedDrills: number;
  verifiedWorkouts: number;
  streakDays: number;
  skillTreeProgress: number;
  storylineUnlocks: string[];
  nextMilestone?: string;
  storylineActive?: boolean;
  levelThresholds: number[];
}

/**
 * StarPathMilestone interface representing an achievement milestone
 */
export interface StarPathMilestone {
  id: number;
  name: string;
  description: string;
  xpRequired: number;
  rewards: string[];
  completed: boolean;
  starLevel: number;
}

/**
 * StarPathStreak interface representing a user's activity streak
 */
export interface StarPathStreak {
  currentStreak: number;
  longestStreak: number;
  lastActive: string;
}

/**
 * StarPathXpHistory interface for charting historical XP data
 */
export interface StarPathXpHistory {
  date: string;
  xp: number;
}

/**
 * useStarPath hook providing Star Path functionality
 * @param userId The user's ID
 * @returns Object containing Star Path state and methods
 */
export const useStarPath = (userId: number) => {
  const queryClient = useQueryClient();
  
  // Query for fetching the user's star path progress
  const progressQuery = useQuery({
    queryKey: ['/api/star-path/progress', userId],
    queryFn: () => getStarPathProgress(userId),
    enabled: !!userId
  });
  
  // Query for fetching the user's milestones
  const milestonesQuery = useQuery({
    queryKey: ['/api/star-path/milestones', userId],
    queryFn: () => getStarPathMilestones(userId),
    enabled: !!userId
  });
  
  // Query for fetching XP history for charts
  const xpHistoryQuery = useQuery({
    queryKey: ['/api/star-path/xp-history', userId],
    queryFn: () => getXpHistory(userId),
    enabled: !!userId
  });
  
  // Query for fetching user's streak information
  const streakQuery = useQuery({
    queryKey: ['/api/star-path/streak', userId],
    queryFn: () => getStreakInfo(userId),
    enabled: !!userId
  });
  
  // Query for fetching star level XP requirements
  const xpRequirementsQuery = useQuery({
    queryKey: ['/api/star-path/xp-requirements'],
    queryFn: () => getStarLevelXpRequirements()
  });
  
  // Mutation for updating star path progress
  const updateProgressMutation = useMutation({
    mutationFn: (progress: Partial<StarPathProgress>) => 
      updateStarPathProgress(userId, progress),
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/progress', userId] });
    }
  });
  
  // Mutation for daily check-in
  const checkInMutation = useMutation({
    mutationFn: () => performDailyCheckIn(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/streak', userId] });
    }
  });
  
  // Mutation for completing a training session
  const completeTrainingMutation = useMutation({
    mutationFn: (sessionData: {
      drillId?: number;
      duration: number;
      completionType: 'drill' | 'workout' | 'tutorial';
      skillNodeIds?: number[];
    }) => completeTrainingSession(userId, sessionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/milestones', userId] });
      // Also invalidate skill tree progress if skill nodes were trained
      queryClient.invalidateQueries({ queryKey: ['/api/skill-tree/progress', userId] });
    }
  });
  
  // Mutation for claiming a milestone reward
  const claimRewardMutation = useMutation({
    mutationFn: (milestoneId: number) => claimMilestoneReward(userId, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/star-path/milestones', userId] });
    }
  });
  
  // Compute the progress percentage to next star level
  const computeProgressPercentage = (): number => {
    if (!progressQuery.data || !xpRequirementsQuery.data) return 0;
    
    const { currentStarLevel, targetStarLevel, xpTotal } = progressQuery.data;
    const xpRequirements = xpRequirementsQuery.data;
    
    // If already at max level, return 100%
    if (currentStarLevel === 5) return 100;
    
    const currentLevelXP = xpRequirements[currentStarLevel.toString()] || 0;
    const nextLevelXP = xpRequirements[(currentStarLevel + 1).toString()] || 0;
    
    if (nextLevelXP === currentLevelXP) return 100;
    
    // Calculate percentage between current and next level
    const xpProgress = xpTotal - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    
    return Math.min(Math.round((xpProgress / xpNeeded) * 100), 100);
  };
  
  /**
   * Get a formatted description of the user's star level
   */
  const getStarLevelDescription = (): string => {
    if (!progressQuery.data) return 'Loading...';
    
    const level = progressQuery.data.currentStarLevel;
    switch (level) {
      case 1: return "Rising Prospect";
      case 2: return "Emerging Talent";
      case 3: return "Standout Performer";
      case 4: return "Elite Prospect";
      case 5: return "Five-Star Athlete";
      default: return "New Athlete";
    }
  };
  
  // Helper function to check if user can perform daily check-in
  const canCheckIn = (): boolean => {
    if (!streakQuery.data) return false;
    
    const lastActive = new Date(streakQuery.data.lastActive);
    const now = new Date();
    
    // Check if last active day was yesterday or earlier
    const lastActiveDay = lastActive.getDate();
    const today = now.getDate();
    const lastActiveMonth = lastActive.getMonth();
    const currentMonth = now.getMonth();
    const lastActiveYear = lastActive.getFullYear();
    const currentYear = now.getFullYear();
    
    // Different year
    if (lastActiveYear < currentYear) return true;
    
    // Same year, different month
    if (lastActiveYear === currentYear && lastActiveMonth < currentMonth) return true;
    
    // Same year, same month, different day
    if (lastActiveYear === currentYear && 
        lastActiveMonth === currentMonth && 
        lastActiveDay < today) return true;
    
    return false;
  };
  
  return {
    // Queries
    progress: progressQuery.data,
    isLoadingProgress: progressQuery.isLoading,
    milestones: milestonesQuery.data,
    isLoadingMilestones: milestonesQuery.isLoading,
    xpHistory: xpHistoryQuery.data,
    isLoadingXpHistory: xpHistoryQuery.isLoading,
    streak: streakQuery.data,
    isLoadingStreak: streakQuery.isLoading,
    xpRequirements: xpRequirementsQuery.data,
    isLoadingXpRequirements: xpRequirementsQuery.isLoading,
    
    // Computed values
    progressPercentage: computeProgressPercentage(),
    starLevelDescription: getStarLevelDescription(),
    canCheckIn: canCheckIn(),
    
    // Mutations
    updateProgress: updateProgressMutation.mutate,
    isUpdatingProgress: updateProgressMutation.isPending,
    checkIn: checkInMutation.mutate,
    isCheckingIn: checkInMutation.isPending,
    completeTraining: completeTrainingMutation.mutate,
    isCompletingTraining: completeTrainingMutation.isPending,
    claimReward: claimRewardMutation.mutate,
    isClaimingReward: claimRewardMutation.isPending,
  };
};