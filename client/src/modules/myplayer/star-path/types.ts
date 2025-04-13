/**
 * Star Path Progress interface - represents a user's overall progress in the Star Path feature
 */
export interface StarPathProgress {
  id: number;
  userId: number;
  currentStarLevel: number;
  targetStarLevel: number;
  storylinePhase: string;
  progress: number;
  xpTotal: number;
  starXp: number;
  streakDays: number;
  completedDrills: number;
  verifiedWorkouts: number;
  skillTreeProgress: number;
  lastUpdated: string | Date;
  nextMilestone?: string;
  levelProgress: {
    current: number;
    target: number;
    percentage: number;
  };
  attributes: {
    physical: number;
    technical: number;
    mental: number;
  };
  recentActivity: {
    date: string;
    activity: string;
    xpEarned: number;
  }[];
  badges: {
    id: number;
    name: string;
    icon: string;
    earnedDate: string;
  }[];
  levelThresholds: number[];
}

/**
 * Star Path Milestone interface - represents progress milestones and rewards
 */
export interface StarPathMilestone {
  id: number;
  name: string;
  description: string;
  xpRequired: number;
  starLevel: number;
  rewardType: 'badge' | 'item' | 'attribute' | 'customization' | 'feature';
  rewardDetails: string;
  claimed: boolean;
  claimedDate?: string | Date;
  icon: string;
  unlocked: boolean;
  progress: number;
}

/**
 * Streak Info interface - represents a user's streak information
 */
export interface StreakInfo {
  streakDays: number;
  lastCheckInDate: string | Date;
  nextMilestone: number;
  currentBonusMultiplier: number;
  lifetimeMaxStreak: number;
  milestones: {
    days: number;
    reward: string;
    achieved: boolean;
  }[];
  streakHistory: {
    date: string;
    checkedIn: boolean;
  }[];
}

/**
 * XP History Entry interface - represents an entry in the XP history
 */
export interface XpHistoryEntry {
  id: number;
  userId: number;
  date: string | Date;
  amount: number;
  source: string;
  description: string;
  activityType: 'training' | 'skill' | 'check_in' | 'achievement' | 'challenge' | 'bonus';
  wasStreak: boolean;
  wasStarPath: boolean;
}

/**
 * Training Session Data interface - represents data for completing a training session
 */
export interface TrainingSessionData {
  completedAt: string;
  platform: string;
  drillId: number;
  duration: number;
  intensity: 'light' | 'moderate' | 'intense';
  completionDate: Date;
  rating: number;
  notes: string;
  mediaUrls?: string[];
  metrics?: {
    [key: string]: number;
  };
}

/**
 * Completed Training Result interface - represents the result of a completed training session
 */
export interface CompletedTrainingResult {
  success: boolean;
  xpEarned: number;
  starXpEarned: number;
  leveledUp: boolean;
  newLevel?: number;
  achievementUnlocked: boolean;
  achievementDetails?: string;
}

/**
 * Claim Milestone Result interface - represents the result of claiming a milestone
 */
export interface ClaimMilestoneResult {
  success: boolean;
  milestoneId: number;
  rewardType: string;
  rewardDetails: string;
}

/**
 * Daily Check-In Result interface - represents the result of a daily check-in
 */
export interface DailyCheckInResult {
  success: boolean;
  message: string;
  streakDays: number;
  xpEarned: number;
  milestoneReached: boolean;
  milestoneReward?: string;
}