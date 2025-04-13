import axios from 'axios';
import { apiRequest } from '@/lib/queryClient';
import { 
  StarPathProgress, 
  StarPathMilestone, 
  StreakInfo, 
  XpHistoryEntry,
  TrainingSessionData,
  CompletedTrainingResult,
  ClaimMilestoneResult,
  DailyCheckInResult
} from '../types';

/**
 * Service to handle Star Path API interactions
 */
export const starPathService = {
  /**
   * Get user's Star Path progress 
   * @param userId User ID
   * @returns Star Path progress data
   */
  async getStarPathProgress(userId: number): Promise<StarPathProgress> {
    try {
      const response = await apiRequest(`/api/star-path/progress?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Star Path progress:', error);
      throw new Error('Failed to fetch Star Path progress');
    }
  },

  /**
   * Get user's Star Path milestones
   * @param userId User ID
   * @returns Star Path milestones
   */
  async getStarPathMilestones(userId: number): Promise<StarPathMilestone[]> {
    try {
      const response = await apiRequest(`/api/star-path/milestones?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Star Path milestones:', error);
      throw new Error('Failed to fetch Star Path milestones');
    }
  },

  /**
   * Get user's streak information
   * @param userId User ID
   * @returns Streak data
   */
  async getStreakInfo(userId: number): Promise<StreakInfo> {
    try {
      const response = await apiRequest(`/api/star-path/streak?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching streak info:', error);
      throw new Error('Failed to fetch streak information');
    }
  },

  /**
   * Get user's XP history
   * @param userId User ID
   * @returns XP history data
   */
  async getXpHistory(userId: number): Promise<XpHistoryEntry[]> {
    try {
      const response = await apiRequest(`/api/star-path/xp-history?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching XP history:', error);
      throw new Error('Failed to fetch XP history');
    }
  },

  /**
   * Complete a training session
   * @param userId User ID
   * @param sessionData Training session data
   * @returns Results of the training session
   */
  async completeTrainingSession(userId: number, sessionData: TrainingSessionData): Promise<CompletedTrainingResult> {
    try {
      const response = await apiRequest(`/api/star-path/complete-training`, {
        method: 'POST',
        body: {
          userId,
          ...sessionData,
        },
      });
      
      return {
        success: true,
        xpEarned: response.data.xpEarned || 0,
        starXpEarned: response.data.starXpEarned || 0,
        leveledUp: response.data.leveledUp || false,
        newLevel: response.data.newLevel,
        achievementUnlocked: response.data.achievementUnlocked || false,
        achievementDetails: response.data.achievementDetails,
      };
    } catch (error) {
      console.error('Error completing training session:', error);
      throw new Error('Failed to record training session');
    }
  },

  /**
   * Claim a milestone reward
   * @param userId User ID
   * @param milestoneId Milestone ID
   * @returns Results of claiming the milestone
   */
  async claimMilestoneReward(userId: number, milestoneId: number): Promise<ClaimMilestoneResult> {
    try {
      const response = await apiRequest(`/api/star-path/claim-milestone`, {
        method: 'POST',
        body: {
          userId,
          milestoneId,
        },
      });
      
      return {
        success: true,
        milestoneId: milestoneId,
        rewardType: response.data.rewardType || 'item',
        rewardDetails: response.data.rewardDetails || 'You received a reward!'
      };
    } catch (error) {
      console.error('Error claiming milestone reward:', error);
      throw new Error('Failed to claim milestone reward');
    }
  },

  /**
   * Perform daily check-in
   * @param userId User ID
   * @returns Results of daily check-in
   */
  async performDailyCheckIn(userId: number): Promise<DailyCheckInResult> {
    try {
      const response = await apiRequest(`/api/star-path/daily-check-in`, {
        method: 'POST',
        body: {
          userId,
        },
      });
      
      return {
        success: true,
        message: response.data.message || 'Daily check-in successful!',
        streakDays: response.data.streakDays || 1,
        xpEarned: response.data.xpEarned || 10,
        milestoneReached: response.data.milestoneReached || false,
        milestoneReward: response.data.milestoneReward || null
      };
    } catch (error) {
      console.error('Error performing daily check-in:', error);
      throw new Error('Failed to perform daily check-in');
    }
  }
};