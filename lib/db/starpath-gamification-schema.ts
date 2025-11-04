/**
 * StarPath Gamification System Schema
 * Tracks student progress towards NCAA eligibility, scholarship offers, and 5-star athlete status
 */

import { pgTable, serial, varchar, integer, boolean, timestamp, jsonb, real, text } from 'drizzle-orm/pg-core';

/**
 * StarPath Progress - Main tracking table for student achievements
 */
export const starpathProgress = pgTable('starpath_progress', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  
  // Overall Progress
  totalXP: integer('total_xp').default(0),
  currentLevel: integer('current_level').default(1),
  starRating: real('star_rating').default(1.0), // 1.0 to 5.0 scale
  
  // NCAA Eligibility Progress
  ncaaEligibilityScore: integer('ncaa_eligibility_score').default(0), // 0-100
  coreGPA: real('core_gpa').default(0),
  coreCreditsEarned: real('core_credits_earned').default(0),
  coreCreditsRequired: real('core_credits_required').default(16),
  ncaaStatus: varchar('ncaa_status', { length: 50 }).default('not_started'), // not_started, in_progress, on_track, eligible, certified
  
  // GAR Performance
  avgGarScore: real('avg_gar_score').default(0),
  garSessionsCompleted: integer('gar_sessions_completed').default(0),
  garMilestone: varchar('gar_milestone', { length: 50 }).default('beginner'), // beginner, developing, proficient, advanced, elite
  
  // Scholarship Progress
  scholarshipOffersReceived: integer('scholarship_offers_received').default(0),
  scholarshipInterestCount: integer('scholarship_interest_count').default(0),
  officialVisitsScheduled: integer('official_visits_scheduled').default(0),
  recruitersContacted: integer('recruiters_contacted').default(0),
  
  // Academic Performance
  academicXP: integer('academic_xp').default(0),
  coursesCompleted: integer('courses_completed').default(0),
  currentGPA: real('current_gpa').default(0),
  academicStreak: integer('academic_streak').default(0), // Days
  assignmentsSubmitted: integer('assignments_submitted').default(0),
  quizzesPassed: integer('quizzes_passed').default(0),
  
  // Athletic Performance
  athleticXP: integer('athletic_xp').default(0),
  videosUploaded: integer('videos_uploaded').default(0),
  highlightReelsCreated: integer('highlight_reels_created').default(0),
  performanceImprovementPercent: real('performance_improvement_percent').default(0),
  
  // Engagement Metrics
  engagementXP: integer('engagement_xp').default(0),
  loginStreak: integer('login_streak').default(0),
  forumPostsCreated: integer('forum_posts_created').default(0),
  studyGroupsJoined: integer('study_groups_joined').default(0),
  eventsAttended: integer('events_attended').default(0),
  
  // Milestones
  completedMilestones: jsonb('completed_milestones').default([]), // Array of milestone IDs
  nextMilestone: varchar('next_milestone', { length: 100 }),
  
  // Timestamps
  lastActivityAt: timestamp('last_activity_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * StarPath Achievements/Badges
 */
export const starpathAchievements = pgTable('starpath_achievements', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 100 }).notNull().unique(), // e.g., 'ncaa_eligible', 'first_scholarship_offer'
  
  // Display Info
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 50 }).notNull(), // academic, athletic, ncaa, scholarship, gar, engagement
  tier: varchar('tier', { length: 50 }).notNull(), // bronze, silver, gold, platinum, diamond
  
  // Requirements
  requirements: jsonb('requirements').notNull(), // Conditions to unlock
  xpReward: integer('xp_reward').default(0),
  
  // Visual
  iconUrl: varchar('icon_url', { length: 500 }),
  badgeColor: varchar('badge_color', { length: 50 }),
  
  // Metadata
  isActive: boolean('is_active').default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * User Achievement Unlocks
 */
export const userAchievements = pgTable('user_achievements', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  achievementId: integer('achievement_id').notNull(),
  
  // Unlock Details
  unlockedAt: timestamp('unlocked_at').defaultNow(),
  progress: integer('progress').default(0), // For multi-step achievements
  isCompleted: boolean('is_completed').default(true),
  
  // Recognition
  isDisplayed: boolean('is_displayed').default(true), // Show on profile
  isPinned: boolean('is_pinned').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * StarPath Milestones - Major achievements on path to 5-star status
 */
export const starpathMilestones = pgTable('starpath_milestones', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  
  // Display
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 50 }).notNull(), // star_1, star_2, star_3, star_4, star_5, ncaa, scholarship
  
  // Requirements
  requiredLevel: integer('required_level').default(1),
  requiredXP: integer('required_xp').default(0),
  requiredGarScore: real('required_gar_score').default(0),
  requiredGPA: real('required_gpa').default(0),
  requiredCoreCredits: real('required_core_credits').default(0),
  customRequirements: jsonb('custom_requirements'), // Additional conditions
  
  // Rewards
  xpReward: integer('xp_reward').default(0),
  starRatingIncrease: real('star_rating_increase').default(0),
  unlocksFeatures: jsonb('unlocks_features'), // Array of feature names
  
  // Order and Display
  sequenceOrder: integer('sequence_order').default(0),
  iconUrl: varchar('icon_url', { length: 500 }),
  celebrationMessage: text('celebration_message'),
  
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * User Milestone Progress
 */
export const userMilestones = pgTable('user_milestones', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  milestoneId: integer('milestone_id').notNull(),
  
  // Progress
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  progressPercent: integer('progress_percent').default(0),
  
  // Tracking
  startedAt: timestamp('started_at').defaultNow(),
  notificationSent: boolean('notification_sent').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * XP Activity Log
 */
export const xpActivityLog = pgTable('xp_activity_log', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  
  // Activity Details
  activityType: varchar('activity_type', { length: 100 }).notNull(), // lesson_completed, quiz_passed, video_uploaded, etc.
  activityCategory: varchar('activity_category', { length: 50 }).notNull(), // academic, athletic, engagement
  description: text('description').notNull(),
  
  // XP Awarded
  xpAwarded: integer('xp_awarded').notNull(),
  xpMultiplier: real('xp_multiplier').default(1.0), // Bonus multipliers
  
  // Context
  relatedEntityType: varchar('related_entity_type', { length: 50 }), // course, video, quiz, etc.
  relatedEntityId: varchar('related_entity_id', { length: 255 }),
  
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * StarPath Leaderboards
 */
export const starpathLeaderboards = pgTable('starpath_leaderboards', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  
  // Rankings
  overallRank: integer('overall_rank'),
  academicRank: integer('academic_rank'),
  athleticRank: integer('athletic_rank'),
  garRank: integer('gar_rank'),
  
  // Scores
  overallScore: integer('overall_score').default(0),
  academicScore: integer('academic_score').default(0),
  athleticScore: integer('athletic_score').default(0),
  garScore: real('gar_score').default(0),
  
  // Metadata
  lastCalculatedAt: timestamp('last_calculated_at').defaultNow(),
  seasonId: varchar('season_id', { length: 50 }), // e.g., 'fall_2024', 'spring_2025'
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Daily/Weekly Challenges
 */
export const starpathChallenges = pgTable('starpath_challenges', {
  id: serial('id').primaryKey(),
  
  // Challenge Info
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  challengeType: varchar('challenge_type', { length: 50 }).notNull(), // daily, weekly, special
  category: varchar('category', { length: 50 }).notNull(),
  
  // Requirements
  targetValue: integer('target_value').notNull(),
  targetMetric: varchar('target_metric', { length: 100 }).notNull(), // lessons_completed, gar_sessions, etc.
  
  // Rewards
  xpReward: integer('xp_reward').notNull(),
  bonusRewards: jsonb('bonus_rewards'), // Additional rewards
  
  // Timing
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  
  // Status
  isActive: boolean('is_active').default(true),
  participantCount: integer('participant_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * User Challenge Progress
 */
export const userChallenges = pgTable('user_challenges', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  challengeId: integer('challenge_id').notNull(),
  
  // Progress
  currentProgress: integer('current_progress').default(0),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  
  // Tracking
  startedAt: timestamp('started_at').defaultNow(),
  lastProgressAt: timestamp('last_progress_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Type exports
export type StarpathProgress = typeof starpathProgress.$inferSelect;
export type NewStarpathProgress = typeof starpathProgress.$inferInsert;
export type StarpathAchievement = typeof starpathAchievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type StarpathMilestone = typeof starpathMilestones.$inferSelect;
export type UserMilestone = typeof userMilestones.$inferSelect;
export type XPActivityLog = typeof xpActivityLog.$inferSelect;
export type StarpathLeaderboard = typeof starpathLeaderboards.$inferSelect;
export type StarpathChallenge = typeof starpathChallenges.$inferSelect;
export type UserChallenge = typeof userChallenges.$inferSelect;
