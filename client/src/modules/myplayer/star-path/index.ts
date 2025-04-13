/**
 * Star Path Module
 * 
 * This module provides comprehensive athlete progression tracking through a star-based leveling system.
 * The Star Path represents an athlete's journey from Rising Prospect to Five-Star status,
 * with achievements, milestones, and rewards along the way.
 */

// Re-export components
export * from './components';

// Re-export hooks
export * from './hooks';

// Re-export services
export * from './services';

// Re-export types
export * from './types';

// Star Path specific constants and enums
export enum StarLevel {
  RISING_PROSPECT = 1,
  EMERGING_TALENT = 2, 
  STANDOUT_PERFORMER = 3,
  ELITE_PROSPECT = 4,
  FIVE_STAR_ATHLETE = 5
}

// Additional types needed specifically for hooks
export interface TrainingSessionData {
  userId: number;
  duration: number;
  exercises: string[];
  metrics?: Record<string, number>;
}

export interface CompletedTrainingResult {
  success: boolean;
  xpEarned: number;
  newLevel?: StarLevel;
  message: string;
}

export interface ClaimMilestoneResult {
  success: boolean;
  rewardClaimed: string;
  message: string;
}

export interface DailyCheckInResult {
  success: boolean;
  streakDays: number;
  bonusXp?: number;
  message: string;
}