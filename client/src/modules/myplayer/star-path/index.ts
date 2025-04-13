/**
 * Star Path Module
 * 
 * This module contains all components, hooks, and services related to the Star Path feature.
 * The Star Path is a progression system for athletes to track their development journey
 * from Rising Prospect (Level 1) to Five-Star Athlete (Level 5).
 */

// Export all components, hooks, and services
export * from './components';
export * from './hooks';
export * from './services';

// Export types used throughout the Star Path feature
export interface StarPathProgress {
  id?: number;
  userId: number;
  position: string | null;
  lastUpdated: Date | null;
  sportType: string | null;
  currentStarLevel: number;
  targetStarLevel: number;
  storylinePhase: string;
  progress: number;
  xpTotal: number;
  completedDrills: number;
  verifiedWorkouts: number;
  skillTreeProgress: number;
  focusAreas: string[] | null;
  streakDays: number;
  longestStreak: number;
  currentXp: number;
  nextLevelXp: number;
  lastCheckIn: Date | null;
  recentAchievements: string[] | null;
  nextMilestone: string | null;
  levelThresholds: number[] | null;
}

export interface StarPathMilestone {
  id: number;
  name: string;
  description: string;
  xpRequired: number;
  starLevel: number;
  isCompleted: boolean;
  rewardType: string;
  rewardValue: number;
  iconUrl?: string;
}

export interface StarPathStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  streakMultiplier: number;
  nextMilestone: number;
  milestoneReward: string;
}

export interface StarPathXpHistory {
  date: string;
  xpEarned: number;
  source: string;
  description: string;
}

export interface TrainingSessionData {
  sessionType: string;
  duration: number;
  intensity: number;
  focusAreas: string[];
  completedDrills: number;
  performance: number;
  notes?: string;
}

export interface CompletedTrainingResult {
  xpEarned: number;
  leveledUp: boolean;
  newLevel?: number;
  unlockedReward?: boolean;
  rewardDetails?: string;
  updatedProgress: StarPathProgress;
}

export interface ClaimMilestoneResult {
  success: boolean;
  milestone: StarPathMilestone;
  rewardDetails: string;
  xpBonus?: number;
  updatedProgress: StarPathProgress;
}

export interface DailyCheckInResult {
  success: boolean;
  streakDays: number;
  xpEarned: number;
  streakBonus: number;
  message: string;
}