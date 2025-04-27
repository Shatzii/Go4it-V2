/**
 * Star Path Service
 * 
 * This service handles API interactions for the Star Path feature.
 */

import { apiRequest } from '@/lib/queryClient';
import {
  StarPathProgress,
  AttributeCategory,
  StarPathCreateUpdate,
  AttributeUpdate,
  Achievement,
  Reward,
  AchievementCategory,
  RewardType
} from '../types';

// Fetch the user's star path progress
export async function fetchStarPath(userId: number): Promise<StarPathProgress | null> {
  try {
    const response = await apiRequest('GET', `/api/star-path/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching star path:', error);
    return null;
  }
}

// Create or update star path progress
export async function createOrUpdateStarPath(
  data: StarPathCreateUpdate
): Promise<StarPathProgress | null> {
  try {
    const response = await apiRequest('POST', '/api/star-path', data);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating star path:', error);
    return null;
  }
}

// Fetch attributes by category
export async function fetchAttributesByCategory(
  category: string
): Promise<AttributeCategory | null> {
  try {
    const response = await apiRequest('GET', `/api/attributes/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category} attributes:`, error);
    return null;
  }
}

// Update attribute value
export async function updateAttribute(
  userId: number,
  update: AttributeUpdate
): Promise<boolean> {
  try {
    await apiRequest('PATCH', `/api/attributes/${userId}`, update);
    return true;
  } catch (error) {
    console.error('Error updating attribute:', error);
    return false;
  }
}

// Complete training
export async function completeTraining(
  userId: number,
  trainingData: {
    drillId: number;
    duration: number;
    score?: number;
    skillNodeId?: number;
  }
): Promise<{ xpGained: number; message: string; levelUp?: boolean }> {
  try {
    const response = await apiRequest(
      'POST',
      `/api/training/${userId}/complete`,
      trainingData
    );
    return response.data;
  } catch (error) {
    console.error('Error completing training:', error);
    throw error;
  }
}

// Claim milestone
export async function claimMilestone(
  userId: number,
  milestoneId: number
): Promise<{ 
  success: boolean; 
  message: string; 
  reward?: Reward;
  achievement?: Achievement;
}> {
  try {
    const response = await apiRequest(
      'POST',
      `/api/milestones/${userId}/claim`,
      { milestoneId }
    );
    return response.data;
  } catch (error) {
    console.error('Error claiming milestone:', error);
    throw error;
  }
}

// Daily check-in
export async function dailyCheckIn(
  userId: number
): Promise<{ 
  success: boolean; 
  message: string; 
  xpGained: number; 
  milestoneReached?: boolean;
  streakCount: number;
  reward?: Reward;
}> {
  try {
    const response = await apiRequest('POST', `/api/star-path/${userId}/check-in`);
    return response.data;
  } catch (error) {
    console.error('Error performing daily check-in:', error);
    throw error;
  }
}

// Fetch achievements by category
export async function fetchAchievements(
  userId: number,
  category?: AchievementCategory
): Promise<Achievement[]> {
  try {
    const url = category 
      ? `/api/achievements/${userId}?category=${category}` 
      : `/api/achievements/${userId}`;
    
    const response = await apiRequest('GET', url);
    return response.data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
}

// Fetch rewards by type
export async function fetchRewards(
  userId: number,
  type?: RewardType,
  unlockedOnly: boolean = false
): Promise<Reward[]> {
  try {
    let url = `/api/rewards/${userId}`;
    const params = [];
    
    if (type) {
      params.push(`type=${type}`);
    }
    
    if (unlockedOnly) {
      params.push('unlockedOnly=true');
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await apiRequest('GET', url);
    return response.data;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return [];
  }
}

// Share achievement to social media
export async function shareAchievement(
  userId: number,
  achievementId: number,
  platform: 'twitter' | 'facebook' | 'instagram' = 'twitter'
): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    const response = await apiRequest('POST', `/api/achievements/${userId}/share`, {
      achievementId,
      platform
    });
    return response.data;
  } catch (error) {
    console.error('Error sharing achievement:', error);
    throw error;
  }
}

// Share reward to social media
export async function shareReward(
  userId: number,
  rewardId: number,
  platform: 'twitter' | 'facebook' | 'instagram' = 'twitter'
): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    const response = await apiRequest('POST', `/api/rewards/${userId}/share`, {
      rewardId,
      platform
    });
    return response.data;
  } catch (error) {
    console.error('Error sharing reward:', error);
    throw error;
  }
}

// Get sport-specific achievements and rewards
export async function fetchSportSpecificContent(
  userId: number,
  sportType: string
): Promise<{
  achievements: Achievement[];
  rewards: Reward[];
}> {
  try {
    const response = await apiRequest('GET', `/api/star-path/${userId}/sport-content`, {
      sportType
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sport-specific content:', error);
    return { achievements: [], rewards: [] };
  }
}