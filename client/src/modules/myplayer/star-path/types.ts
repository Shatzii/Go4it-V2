/**
 * Star Path Types
 * 
 * This file contains all type definitions used throughout the Star Path module.
 * These types ensure consistency and type safety across components, hooks, and services.
 */

/**
 * Star Path Levels Enum
 * Represents the different levels a player can achieve in their Star Path journey
 */
export const enum StarPathLevel {
  RISING_PROSPECT = 1,
  EMERGING_TALENT = 2,
  STANDOUT_PERFORMER = 3,
  ELITE_PROSPECT = 4,
  FIVE_STAR_ATHLETE = 5
}

/**
 * Star Path Level Names
 * Provides display names for each star level
 */
export const StarPathLevelNames = {
  [StarPathLevel.RISING_PROSPECT]: "Rising Prospect",
  [StarPathLevel.EMERGING_TALENT]: "Emerging Talent",
  [StarPathLevel.STANDOUT_PERFORMER]: "Standout Performer",
  [StarPathLevel.ELITE_PROSPECT]: "Elite Prospect",
  [StarPathLevel.FIVE_STAR_ATHLETE]: "Five-Star Athlete"
};

/**
 * Milestone Interface
 * Represents achievement milestones that players can reach along their Star Path
 */
export interface Milestone {
  id: number;
  description: string;
  xpRequired: number;
  rewards: string[];
  isCompleted: boolean;
}

/**
 * Star Path Progress Interface
 * Represents a player's current progress along their Star Path journey
 */
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

/**
 * Attribute Category Interface
 * Represents a category of player attributes (physical, mental, technical)
 */
export interface AttributeCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  attributes: Attribute[];
}

/**
 * Attribute Interface
 * Represents a specific player attribute within a category
 */
export interface Attribute {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  growth: number; // Percentage growth since last update
  category: string;
}

/**
 * Achievement Interface
 * Represents an achievement or badge a player can earn
 */
export interface Achievement {
  id: number;
  title: string;
  description: string;
  iconPath: string;
  dateEarned: Date | null;
  xpValue: number;
  isEarned: boolean;
}

/**
 * Training Completion Result Interface
 * Response from completing a training session
 */
export interface CompletedTrainingResult {
  success: boolean;
  xpEarned: number;
  starXpEarned: number;
  currentLevel: number;
  newProgress: number;
  message: string;
  leveledUp: boolean;
}

/**
 * Claim Milestone Result Interface
 * Response from claiming a milestone reward
 */
export interface ClaimMilestoneResult {
  success: boolean;
  milestoneId: number;
  xpEarned: number;
  message: string;
  newProgress: number;
  rewardDetails: string;
}

/**
 * Daily Check-In Result Interface
 * Response from performing a daily check-in
 */
export interface DailyCheckInResult {
  success: boolean;
  streakDays: number;
  milestoneReached: boolean;
  milestoneReward: string;
  xpEarned: number;
  message: string;
}

/**
 * Star Path API Response Interface
 * Standard format for API responses from Star Path endpoints
 */
export interface StarPathResponse {
  success: boolean;
  message: string;
  data?: StarPathProgress;
  error?: string;
}

/**
 * Attribute Update Interface
 * Parameters for updating a player attribute
 */
export interface AttributeUpdate {
  attributeId: string;
  newValue: number;
  notes?: string;
}

/**
 * Star Path Create/Update Interface
 * Parameters for creating or updating a Star Path
 */
export interface StarPathCreateUpdate {
  userId: number;
  sportType?: string;
  position?: string;
  currentStarLevel?: number;
  targetStarLevel?: number;
}