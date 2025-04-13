import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { starPathService, type StarPathProgress } from '../services/starPathService';

/**
 * Custom hook for working with Star Path data
 * 
 * Provides methods for fetching and updating Star Path progress
 * This hook makes it easy to integrate the Star Path feature into any component
 */
export const useStarPath = (userId: number, sportType?: string) => {
  const queryClient = useQueryClient();
  
  // Get current star path progress
  const {
    data: starPathProgress,
    isLoading: isLoadingProgress,
    error: progressError,
    refetch: refetchProgress
  } = useQuery({
    queryKey: [`/api/player/star-path/${userId}`, sportType],
    queryFn: () => starPathService.getStarPathProgress(userId, sportType),
    enabled: !!userId,
  });
  
  // Get star path milestones for current level
  const {
    data: currentLevelMilestones,
    isLoading: isLoadingMilestones,
    error: milestonesError
  } = useQuery({
    queryKey: [`/api/player/star-path/milestones`, starPathProgress?.currentStarLevel, sportType],
    queryFn: () => 
      starPathService.getStarPathMilestones(
        starPathProgress?.currentStarLevel || 1, 
        sportType
      ),
    enabled: !!starPathProgress?.currentStarLevel,
  });
  
  // Get XP history for charts
  const {
    data: xpHistory,
    isLoading: isLoadingXpHistory,
    error: xpHistoryError
  } = useQuery({
    queryKey: [`/api/player/star-path/${userId}/xp-history`],
    queryFn: () => starPathService.getXpHistory(userId),
    enabled: !!userId,
  });
  
  // Get streak information
  const {
    data: streakInfo,
    isLoading: isLoadingStreakInfo,
    error: streakInfoError
  } = useQuery({
    queryKey: [`/api/player/star-path/${userId}/streak`],
    queryFn: () => starPathService.getStreakInfo(userId),
    enabled: !!userId,
  });
  
  // Complete a milestone mutation
  const completeMilestoneMutation = useMutation({
    mutationFn: (milestoneId: string) => 
      starPathService.completeMilestone(userId, milestoneId),
    onSuccess: () => {
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/player/star-path/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/player/star-path/milestones`] });
      queryClient.invalidateQueries({ queryKey: [`/api/player/star-path/${userId}/xp-history`] });
      queryClient.invalidateQueries({ queryKey: [`/api/player/star-path/${userId}/streak`] });
    },
  });
  
  // Update star path progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: (data: Partial<StarPathProgress>) => 
      starPathService.updateStarPathProgress(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/player/star-path/${userId}`] });
    },
  });
  
  // Calculate if the user is making good progress
  const calculateProgressStatus = (): 'excellent' | 'good' | 'fair' | 'needs-improvement' => {
    if (!starPathProgress) return 'fair';
    
    const { progress, completedDrills, verifiedWorkouts, skillTreeProgress } = starPathProgress;
    
    if (progress >= 75 && completedDrills >= 10 && verifiedWorkouts >= 5) {
      return 'excellent';
    } else if (progress >= 50 && completedDrills >= 5 && verifiedWorkouts >= 3) {
      return 'good';
    } else if (progress >= 25 && completedDrills >= 2 && verifiedWorkouts >= 1) {
      return 'fair';
    } else {
      return 'needs-improvement';
    }
  };
  
  return {
    // Data
    starPathProgress,
    currentLevelMilestones,
    xpHistory,
    streakInfo,
    
    // Loading states
    isLoadingProgress,
    isLoadingMilestones,
    isLoadingXpHistory,
    isLoadingStreakInfo,
    isLoading: isLoadingProgress || isLoadingMilestones || isLoadingXpHistory || isLoadingStreakInfo,
    
    // Error states
    progressError,
    milestonesError,
    xpHistoryError,
    streakInfoError,
    
    // Helper functions
    calculateProgressStatus,
    
    // Mutations
    completeMilestone: completeMilestoneMutation.mutate,
    isCompletingMilestone: completeMilestoneMutation.isPending,
    
    updateProgress: updateProgressMutation.mutate,
    isUpdatingProgress: updateProgressMutation.isPending,
    
    // Refetch functions
    refetchProgress,
  };
};