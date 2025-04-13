/**
 * Star Path Service
 * 
 * Provides methods for interacting with the Star Path API
 * This creates a reusable API layer that can be easily integrated with CMS
 */

import { apiRequest } from '@/lib/queryClient';

export interface StarPathProgress {
  userId: number;
  sportType: string;
  currentStarLevel: number;
  targetStarLevel: number;
  progress: number;
  storylinePhase: string;
  startDate: string;
  lastUpdated: string;
  milestones: {
    [key: string]: {
      title: string;
      description: string;
      completed: boolean;
      completedDate?: string;
      requirementsMet: boolean;
      xpReward: number;
    }
  };
  attributes: {
    physical: {
      [key: string]: number;
    };
    mental: {
      [key: string]: number;
    };
    technical: {
      [key: string]: number;
    };
  };
  completedDrills: number;
  verifiedWorkouts: number;
  skillTreeProgress: number;
  xpTotal: number;
  xpHistory: {
    [date: string]: number;
  };
  streakDays: number;
  nextMilestone?: string;
}

export interface StarPathMilestone {
  id: string;
  title: string;
  description: string;
  sportType: string;
  level: number;
  xpReward: number;
  requirementType: 'skill' | 'workout' | 'video' | 'other';
  requirements: {
    description: string;
    targetValue: number;
    currentValue?: number;
  }[];
  isCompleted: boolean;
  completedDate?: string;
}

/**
 * Service for interacting with the star path API endpoints
 */
export const starPathService = {
  /**
   * Get the current star path progress for a user
   */
  async getStarPathProgress(userId: number, sportType?: string): Promise<StarPathProgress> {
    const sportParam = sportType ? `&sportType=${encodeURIComponent(sportType)}` : '';
    return apiRequest(`/api/player/star-path/${userId}${sportParam}`);
  },

  /**
   * Get all milestones for a specific star level
   */
  async getStarPathMilestones(level: number, sportType?: string): Promise<StarPathMilestone[]> {
    const sportParam = sportType ? `&sportType=${encodeURIComponent(sportType)}` : '';
    return apiRequest(`/api/player/star-path/milestones?level=${level}${sportParam}`);
  },

  /**
   * Get attribute details for a specific category
   */
  async getStarPathAttributes(userId: number, category: 'physical' | 'mental' | 'technical'): Promise<Record<string, number>> {
    return apiRequest(`/api/player/star-path/${userId}/attributes/${category}`);
  },

  /**
   * Update star path progress (typically after completing a milestone)
   */
  async updateStarPathProgress(userId: number, data: Partial<StarPathProgress>): Promise<StarPathProgress> {
    return apiRequest(`/api/player/star-path/${userId}`, {
      method: 'PATCH',
      body: data,
    });
  },

  /**
   * Complete a milestone
   */
  async completeMilestone(userId: number, milestoneId: string): Promise<{ success: boolean; xpAwarded: number }> {
    return apiRequest(`/api/player/star-path/${userId}/milestones/${milestoneId}/complete`, {
      method: 'POST',
    });
  },

  /**
   * Get star path XP history (for trends and charts)
   */
  async getXpHistory(userId: number, days: number = 30): Promise<{ date: string; xp: number }[]> {
    return apiRequest(`/api/player/star-path/${userId}/xp-history?days=${days}`);
  },

  /**
   * Get user's current streak information
   */
  async getStreakInfo(userId: number): Promise<{ currentStreak: number; longestStreak: number; lastActive: string }> {
    return apiRequest(`/api/player/star-path/${userId}/streak`);
  },
};