/**
 * Service to handle Star Path API interactions
 */

import { apiRequest } from '@lib/queryClient';
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

export const starPathService = {
  /**
   * Get user's Star Path progress 
   * @param userId User ID
   * @returns Star Path progress data
   */
  async getStarPathProgress(userId: number): Promise<StarPathProgress> {
    const response = await apiRequest<StarPathProgress>(
      `/api/star-path/progress/${userId}`
    );
    return response;
  },

  /**
   * Get user's Star Path milestones
   * @param userId User ID
   * @returns Star Path milestones
   */
  async getStarPathMilestones(userId: number): Promise<StarPathMilestone[]> {
    const response = await apiRequest<StarPathMilestone[]>(
      `/api/star-path/milestones/${userId}`
    );
    return response;
  },

  /**
   * Get user's streak information
   * @param userId User ID
   * @returns Streak data
   */
  async getStreakInfo(userId: number): Promise<StreakInfo> {
    const response = await apiRequest<StreakInfo>(
      `/api/star-path/streak/${userId}`
    );
    return response;
  },

  /**
   * Get user's XP history
   * @param userId User ID
   * @returns XP history data
   */
  async getXpHistory(userId: number): Promise<XpHistoryEntry[]> {
    const response = await apiRequest<XpHistoryEntry[]>(
      `/api/star-path/xp-history/${userId}`
    );
    return response;
  },

  /**
   * Complete a training session
   * @param userId User ID
   * @param sessionData Training session data
   * @returns Results of the training session
   */
  async completeTrainingSession(userId: number, sessionData: TrainingSessionData): Promise<CompletedTrainingResult> {
    const response = await apiRequest<CompletedTrainingResult>(
      `/api/star-path/complete-training/${userId}`,
      {
        method: 'POST',
        body: sessionData
      }
    );
    return response;
  },

  /**
   * Claim a milestone reward
   * @param userId User ID
   * @param milestoneId Milestone ID
   * @returns Results of claiming the milestone
   */
  async claimMilestoneReward(userId: number, milestoneId: number): Promise<ClaimMilestoneResult> {
    const response = await apiRequest<ClaimMilestoneResult>(
      `/api/star-path/claim-milestone`,
      {
        method: 'POST',
        body: {
          userId,
          milestoneId
        }
      }
    );
    return response;
  },

  /**
   * Perform daily check-in
   * @param userId User ID
   * @returns Results of daily check-in
   */
  async performDailyCheckIn(userId: number): Promise<DailyCheckInResult> {
    const response = await apiRequest<DailyCheckInResult>(
      `/api/star-path/daily-check-in`,
      {
        method: 'POST',
        body: {
          userId
        }
      }
    );
    return response;
  }
};