/**
 * Star Path Types
 * 
 * This file defines all types and interfaces used within the Star Path feature module.
 * These types are used throughout the components, hooks, and services of the Star Path module.
 */

// Star Path Progress levels and statuses
export const enum StarPathLevel {
  RISING_PROSPECT = 1,
  EMERGING_TALENT = 2,
  STANDOUT_PERFORMER = 3,
  ELITE_PROSPECT = 4,
  FIVE_STAR_ATHLETE = 5
}

// Milestone type definitions
export interface Milestone {
  id: number;
  description: string;
  xpRequired: number;
  rewards: string[];
  isCompleted: boolean;
}

// Star Path progress interface
export interface StarPathProgress {
  id?: number;
  userId: number;
  currentStarLevel: number;
  targetStarLevel: number;
  storylinePhase: string;
  progress: number;
  xpTotal: number;
  completedDrills: number;
  verifiedWorkouts: number;
  skillTreeProgress: number;
  streakDays: number;
  lastActive: Date | null;
  milestones: Milestone[];
  sportType: string | null;
  position: string | null;
  nextMilestone?: string;
  achievements: Achievement[];
  levelThresholds: number[];
}

// Attribute categories for star path
export interface AttributeCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  attributes: Attribute[];
}

// Individual attribute
export interface Attribute {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  growth: number; // Percentage growth since last update
  category: string;
}

// Achievement definition
export interface Achievement {
  id: number;
  title: string;
  description: string;
  iconPath: string;
  dateEarned: Date | null;
  xpValue: number;
  isEarned: boolean;
}

// Training result after completing a drill or workout
export interface CompletedTrainingResult {
  success: boolean;
  xpEarned: number;
  currentLevel: number;
  newProgress: number;
  message: string;
  leveledUp: boolean;
  starXpEarned: number;
}

// Milestone claim result
export interface ClaimMilestoneResult {
  success: boolean;
  milestoneId: number;
  xpEarned: number;
  message: string;
  newProgress: number;
  rewardDetails: string;
}

// Daily check-in result
export interface DailyCheckInResult {
  success: boolean;
  streakDays: number;
  milestoneReached: boolean;
  milestoneReward: string;
  xpEarned: number;
  message: string;
}

// Star Path service responses
export interface StarPathResponse {
  success: boolean;
  message: string;
  data?: StarPathProgress;
  error?: string;
}

// Attribute update payload
export interface AttributeUpdate {
  attributeId: string;
  newValue: number;
  notes?: string;
}

// Star Path creation/update payload
export interface StarPathCreateUpdate {
  userId: number;
  sportType?: string;
  position?: string;
  currentStarLevel?: number;
  targetStarLevel?: number;
}