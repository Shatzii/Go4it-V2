/**
 * Star Path Service
 * 
 * This service handles all API calls related to the Star Path feature.
 * It provides methods to fetch and update star path progress, milestones,
 * and handle daily check-ins for the streak system.
 */

import { apiRequest } from '@lib/queryClient';
import type { 
  StarPathProgress, 
  StarPathMilestone,
  StarPathStreak,
  StarPathXpHistory 
} from '../hooks/useStarPath';

/**
 * Get the user's current star path progress
 * @param userId The user's ID
 * @returns Star path progress data
 */
export const getStarPathProgress = async (userId: number): Promise<StarPathProgress> => {
  const response = await apiRequest(`/api/star-path/progress/${userId}`);
  return response;
};

/**
 * Get the milestones for a user's star path
 * @param userId The user's ID
 * @returns List of milestones with completion status
 */
export const getStarPathMilestones = async (userId: number): Promise<StarPathMilestone[]> => {
  const response = await apiRequest(`/api/star-path/milestones/${userId}`);
  return response;
};

/**
 * Get the XP requirements for each star level
 * @returns Record mapping star level to XP required
 */
export const getStarLevelXpRequirements = async (): Promise<Record<string, number>> => {
  const response = await apiRequest('/api/star-path/xp-requirements');
  return response;
};

/**
 * Update a user's star path progress
 * @param userId The user's ID
 * @param progress Partial progress data to update
 * @returns Updated star path progress
 */
export const updateStarPathProgress = async (
  userId: number,
  progress: Partial<StarPathProgress>
): Promise<StarPathProgress> => {
  const response = await apiRequest(`/api/star-path/progress/${userId}`, {
    method: 'PATCH',
    body: progress
  });
  return response;
};

/**
 * Perform daily check-in to maintain streak
 * @param userId The user's ID
 * @returns Result of check-in with XP awarded
 */
export const performDailyCheckIn = async (userId: number): Promise<{ 
  success: boolean; 
  xpAwarded: number; 
  currentStreak: number 
}> => {
  const response = await apiRequest(`/api/star-path/check-in/${userId}`, {
    method: 'POST'
  });
  return response;
};

/**
 * Get the user's XP history for charts and analytics
 * @param userId The user's ID
 * @returns Array of XP history entries
 */
export const getXpHistory = async (userId: number): Promise<StarPathXpHistory[]> => {
  const response = await apiRequest(`/api/star-path/xp-history/${userId}`);
  return response;
};

/**
 * Get the user's streak information
 * @param userId The user's ID
 * @returns Streak data including current and longest streaks
 */
export const getStreakInfo = async (userId: number): Promise<StarPathStreak> => {
  const response = await apiRequest(`/api/star-path/streak/${userId}`);
  return response;
};

/**
 * Complete a training session and earn XP
 * @param userId The user's ID
 * @param sessionData Training session data
 * @returns Result with XP awarded
 */
export const completeTrainingSession = async (
  userId: number,
  sessionData: {
    drillId?: number;
    duration: number;
    completionType: 'drill' | 'workout' | 'tutorial';
    skillNodeIds?: number[];
  }
): Promise<{
  success: boolean;
  xpAwarded: number;
  updatedProgress: StarPathProgress;
}> => {
  const response = await apiRequest(`/api/star-path/training-session/${userId}`, {
    method: 'POST',
    body: sessionData
  });
  return response;
};

/**
 * Claim a milestone reward
 * @param userId The user's ID
 * @param milestoneId The milestone ID to claim
 * @returns Result with reward details
 */
export const claimMilestoneReward = async (
  userId: number,
  milestoneId: number
): Promise<{
  success: boolean;
  reward: string;
  updatedProgress: StarPathProgress;
}> => {
  const response = await apiRequest(`/api/star-path/claim-reward/${userId}`, {
    method: 'POST',
    body: { milestoneId }
  });
  return response;
};