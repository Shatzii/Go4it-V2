/**
 * Star Path Module
 * 
 * This module provides components, hooks, and services for the Star Path feature
 * which allows athletes to track their progression from Rookie to Legend.
 */

// Export components, hooks, and services
export * from './components';
export * from './hooks';
export * from './services';

// Star Path Interfaces

/**
 * Represents an athlete's progress in the Star Path system
 */
export interface StarPathProgress {
  id: number;
  userId: number;
  currentStarLevel: number;
  targetStarLevel: number;
  storylinePhase: string;
  position: string | null;
  sportType: string | null;
  progress: number;
  xpTotal: number;
  level: number;
  completedDrills: number;
  verifiedWorkouts: number;
  starXp: number;
  skillTreeProgress: number;
  streakDays: number;
  lastUpdated: Date | null;
  nextMilestone: string | null;
  attributeScores: AttributeScores;
  levelThresholds: number[];
}

/**
 * Represents attribute scores for an athlete, grouped by category
 */
export interface AttributeScores {
  physical: {
    speed: number;
    strength: number;
    agility: number;
    endurance: number;
    verticalJump: number;
  };
  technical: {
    technique: number;
    ballControl: number;
    accuracy: number;
    gameIQ: number;
  };
  mental: {
    focus: number;
    confidence: number;
    determination: number;
    teamwork: number;
  };
}

/**
 * Represents a milestone in the Star Path progression
 */
export interface StarPathMilestone {
  id: number;
  title: string;
  description: string;
  xpRequired: number;
  starLevel: number;
  rewardType: 'badge' | 'item' | 'attribute' | 'unlockable';
  rewardDetails: string;
  isClaimed: boolean;
  claimedAt: Date | null;
  iconPath: string;
}

/**
 * Represents an athlete's streak information
 */
export interface StarPathStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  milestones: {
    days: number;
    reward: string;
    claimed: boolean;
  }[];
  nextMilestone: number;
}

/**
 * Represents an entry in the athlete's XP history
 */
export interface StarPathXpHistory {
  id: number;
  userId: number;
  amount: number;
  source: string;
  description: string;
  earnedAt: Date;
  level: number;
  totalXp: number;
}

/**
 * Data representing a completed training session
 */
export interface TrainingSessionData {
  drillId: number;
  duration: number; // Minutes
  intensity: 'light' | 'moderate' | 'intense';
  completionDate: Date;
  rating: number; // 1-5
  notes: string;
  mediaUrls?: string[];
  metrics?: {
    [key: string]: number; // Various metrics like reps, distance, etc.
  };
}

/**
 * Result of a completed training session
 */
export interface CompletedTrainingResult {
  success: boolean;
  xpEarned: number;
  starXpEarned: number;
  leveledUp: boolean;
  newLevel?: number;
  unlockedReward: boolean;
  rewardDetails?: string;
  streakUpdated: boolean;
  newStreakDays?: number;
}

/**
 * Result of claiming a milestone reward
 */
export interface ClaimMilestoneResult {
  success: boolean;
  milestoneId: number;
  rewardType: 'badge' | 'item' | 'attribute' | 'unlockable';
  rewardDetails: string;
  attributesUpdated?: {
    attribute: string;
    oldValue: number;
    newValue: number;
  }[];
}

/**
 * Result of performing a daily check-in
 */
export interface DailyCheckInResult {
  success: boolean;
  message: string;
  streakDays: number;
  xpEarned: number;
  milestoneReached: boolean;
  milestoneReward?: string;
}

/**
 * The five star levels in the Star Path progression system
 */
export enum StarLevel {
  RisingProspect = 1,
  EmergingTalent = 2,
  StandoutPerformer = 3,
  EliteProspect = 4,
  FiveStarAthlete = 5
}

/**
 * Star Path game storyline phases
 */
export enum StorylinePhase {
  HighSchoolFreshman = 'HIGH_SCHOOL_FRESHMAN',
  HighSchoolSophomore = 'HIGH_SCHOOL_SOPHOMORE',
  HighSchoolJunior = 'HIGH_SCHOOL_JUNIOR',
  HighSchoolSenior = 'HIGH_SCHOOL_SENIOR',
  CollegeRecruit = 'COLLEGE_RECRUIT'
}