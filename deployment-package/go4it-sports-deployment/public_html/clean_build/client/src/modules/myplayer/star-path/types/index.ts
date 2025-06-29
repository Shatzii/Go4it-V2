/**
 * Star Path Types
 * 
 * This file contains type definitions for the Star Path feature module.
 */

// Star Path Level Enum
export enum StarPathLevel {
  RISING_PROSPECT = 1,
  EMERGING_TALENT = 2,
  STANDOUT_PERFORMER = 3,
  ELITE_PROSPECT = 4,
  FIVE_STAR_ATHLETE = 5
}

// Also keep compatibility with previous version
export enum StarLevel {
  RisingProspect = 1,
  EmergingTalent = 2,
  StandoutPerformer = 3,
  EliteProspect = 4,
  FiveStarAthlete = 5
}

// Star Path Progress
export interface StarPathProgress {
  id: number;
  userId: number;
  currentLevel: number;
  currentXp: number;
  totalXp: number;
  streakDays: number;
  lastUpdated: string; // ISO date string
  nextMilestone?: string;
  unlockedAchievements: string[];
  attributes?: Record<string, number>;
}

// Attribute Category
export interface AttributeCategory {
  id: string;
  name: string;
  attributes: Attribute[];
}

export interface Attribute {
  id: string;
  name: string;
  value: number;
  category: string;
  description?: string;
  isLocked?: boolean;
}

// Star Path Create/Update DTO
export interface StarPathCreateUpdate {
  userId: number;
  initialLevel?: number;
  initialXp?: number;
}

// Attribute Update DTO
export interface AttributeUpdate {
  attributeId: string;
  newValue: number;
  category: string;
}