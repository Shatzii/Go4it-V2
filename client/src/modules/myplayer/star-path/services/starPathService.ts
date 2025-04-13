/**
 * Star Path Service
 * 
 * Provides the API interface for Star Path functionality.
 * All API calls related to the Star Path feature should go through this service.
 */

import { queryClient } from '@/lib/queryClient';
import type { 
  StarPathProgress, 
  StarPathMilestone, 
  TrainingSessionData,
  CompletedTrainingResult,
  ClaimMilestoneResult,
  DailyCheckInResult,
  StarPathStreak,
  StarPathXpHistory
} from '../index';

// API URL constants
const BASE_URL = '/api/star-path';
const PROGRESS_URL = `${BASE_URL}/progress`;
const MILESTONES_URL = `${BASE_URL}/milestones`;
const XP_REQUIREMENTS_URL = `${BASE_URL}/xp-requirements`;
const STREAK_URL = `${BASE_URL}/streak`;
const XP_HISTORY_URL = `${BASE_URL}/xp-history`;
const TRAINING_SESSION_URL = `${BASE_URL}/training`;
const CLAIM_MILESTONE_URL = `${BASE_URL}/claim-milestone`;
const DAILY_CHECK_IN_URL = `${BASE_URL}/daily-check-in`;

/**
 * Get star path progress for a user
 */
export async function getStarPathProgress(userId: number): Promise<StarPathProgress> {
  const response = await fetch(`${PROGRESS_URL}/${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch star path progress');
  }
  
  return response.json();
}

/**
 * Get star path milestones for a user
 */
export async function getStarPathMilestones(userId: number): Promise<StarPathMilestone[]> {
  const response = await fetch(`${MILESTONES_URL}/${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch star path milestones');
  }
  
  return response.json();
}

/**
 * Get XP requirements for each star level
 */
export async function getStarLevelXpRequirements(): Promise<Record<string, number>> {
  const response = await fetch(XP_REQUIREMENTS_URL);
  
  if (!response.ok) {
    throw new Error('Failed to fetch star level XP requirements');
  }
  
  return response.json();
}

/**
 * Get streak information for a user
 */
export async function getStreakInfo(userId: number): Promise<StarPathStreak> {
  const response = await fetch(`${STREAK_URL}/${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch streak information');
  }
  
  return response.json();
}

/**
 * Get XP history for a user
 */
export async function getXpHistory(userId: number): Promise<StarPathXpHistory[]> {
  const response = await fetch(`${XP_HISTORY_URL}/${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch XP history');
  }
  
  return response.json();
}

/**
 * Update star path progress
 */
export async function updateStarPathProgress(
  userId: number, 
  progressData: Partial<StarPathProgress>
): Promise<StarPathProgress> {
  const response = await fetch(`${PROGRESS_URL}/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progressData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update star path progress');
  }
  
  return response.json();
}

/**
 * Complete a training session and earn XP
 */
export async function completeTrainingSession(
  userId: number, 
  sessionData: TrainingSessionData
): Promise<CompletedTrainingResult> {
  const response = await fetch(`${TRAINING_SESSION_URL}/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...sessionData,
      completionType: sessionData.sessionType === 'drill' ? 'drill' : 'workout'
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to complete training session');
  }

  const result = await response.json();
  
  return {
    xpEarned: result.xpAwarded,
    leveledUp: result.updatedProgress.currentStarLevel > sessionData.currentStarLevel,
    newLevel: result.updatedProgress.currentStarLevel,
    updatedProgress: result.updatedProgress
  };
}

/**
 * Claim a milestone reward
 */
export async function claimMilestoneReward(
  userId: number, 
  milestoneId: number
): Promise<ClaimMilestoneResult> {
  const response = await fetch(`${CLAIM_MILESTONE_URL}/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ milestoneId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to claim milestone reward');
  }

  const result = await response.json();
  
  return {
    success: result.success,
    milestone: result.milestone,
    rewardDetails: result.reward,
    updatedProgress: result.updatedProgress
  };
}

/**
 * Perform daily check-in to maintain streak
 */
export async function performDailyCheckIn(userId: number): Promise<DailyCheckInResult> {
  const response = await fetch(`${DAILY_CHECK_IN_URL}/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to perform daily check-in');
  }

  const result = await response.json();
  
  return {
    success: result.success,
    streakDays: result.currentStreak,
    xpEarned: result.xpAwarded,
    streakBonus: result.streakBonus || 0,
    message: `Daily check-in complete! +${result.xpAwarded} XP. Current streak: ${result.currentStreak} days.`
  };
}