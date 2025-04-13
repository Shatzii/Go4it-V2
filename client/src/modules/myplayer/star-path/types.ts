import { StarLevel } from './index';

export interface StarPathProgress {
  id: number;
  userId: number;
  currentStarLevel: number;
  targetStarLevel: number;
  progress: number;
  sportType: string | null;
  position: string | null;
  storylinePhase: string;
  xpTotal: number;
  completedDrills: number;
  verifiedWorkouts: number;
  skillTreeProgress: number;
  streakDays: number;
  personalBest?: Record<string, number>;
  nextMilestone?: string;
  lastUpdated: Date | null;
  milestones: StarPathMilestone[];
  levelThresholds: number[];
}

export interface StarPathMilestone {
  id: number;
  userId: number;
  starPathId: number;
  level: StarLevel;
  name: string;
  description: string;
  xpRequired: number;
  reward: string;
  isCompleted: boolean;
  completedAt: Date | null;
  isClaimed: boolean;
  claimedAt: Date | null;
}

export interface StarPathCheckInData {
  userId: number;
  date: string;
}

export interface StarPathStatsUpdate {
  userId: number;
  progress?: number;
  xpTotal?: number;
  completedDrills?: number;
  verifiedWorkouts?: number;
  skillTreeProgress?: number;
  streakDays?: number;
}

export interface ClaimRewardData {
  userId: number;
  milestoneId: number;
}