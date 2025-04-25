/**
 * Star Path Types
 * 
 * This file defines all types used in the Star Path feature module
 */

/**
 * Star Path Progress Interface
 * Represents an athlete's progress in the Star Path system
 */
export interface StarPathProgress {
  id: number;
  userId: number;
  position: string | null;
  lastUpdated: Date | null;
  sportType: string | null;
  currentStarLevel: number | null;
  targetStarLevel: number | null;
  storylinePhase: string;
  progress: number;
  xpTotal: number;
  starXp: number;
  level: number;
  completedDrills: number;
  verifiedWorkouts: number;
  skillTreeProgress: number;
  streakDays: number;
  longestStreak: number;
  currentGoal: string | null;
  nextMilestone: string | null;
  roadmapItems: string[] | null;
  achievements: string[] | null;
  levelThresholds: number[] | null;
}

/**
 * Star Path Create/Update Interface
 * Used for creating or updating Star Path progress data
 */
export interface StarPathCreateUpdate {
  userId: number;
  position?: string | null;
  sportType?: string | null;
  currentStarLevel?: number | null;
  targetStarLevel?: number | null;
  storylinePhase?: string;
  progress?: number;
  xpTotal?: number;
  starXp?: number;
  level?: number;
  completedDrills?: number;
  verifiedWorkouts?: number;
  skillTreeProgress?: number;
  streakDays?: number;
  longestStreak?: number;
  currentGoal?: string | null;
  nextMilestone?: string | null;
  roadmapItems?: string[] | null;
  achievements?: string[] | null;
  levelThresholds?: number[] | null;
}

/**
 * Attribute Category Interface
 * Represents a group of related attributes
 */
export interface AttributeCategory {
  id: number;
  name: string;
  description: string | null;
  sportType: string | null;
  attributes: Attribute[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Attribute Interface
 * Represents a specific athletic or skill attribute
 */
export interface Attribute {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  baseValue: number | null;
  currentValue: number | null;
  potentialValue: number | null;
  growthRate: number | null;
  importance: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Attribute Update Interface
 * Used for updating a specific attribute value
 */
export interface AttributeUpdate {
  attributeId: number;
  value: number;
  notes?: string;
}

/**
 * Star Level enum
 * Represents the different levels in the Star Path progression
 */
export enum StarLevel {
  RisingProspect = 1,
  EmergingTalent = 2,
  StandoutPerformer = 3,
  EliteProspect = 4,
  FiveStarAthlete = 5
}

/**
 * Training Activity Interface
 * Represents a completed training activity
 */
export interface TrainingActivity {
  id: number;
  userId: number;
  drillId: number;
  duration: number;
  score?: number;
  skillNodeId?: number;
  completedAt: Date;
}

/**
 * Milestone Interface
 * Represents an achievement milestone in the Star Path
 */
export interface Milestone {
  id: number;
  name: string;
  description: string;
  xpReward: number;
  starXpReward: number;
  unlockCriteria: string;
  category: string;
  level: number;
  isClaimable: boolean;
}

/**
 * Daily Check-In Interface
 * Represents a daily check-in record
 */
export interface DailyCheckIn {
  id: number;
  userId: number;
  checkedInAt: Date;
  streakCount: number;
  rewards: {
    xp: number;
    starXp: number;
    bonusItems?: string[];
  };
}