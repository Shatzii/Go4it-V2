import { pgTable, text, integer, timestamp, boolean, decimal, jsonb, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from '../lib/schema';

// Extended schema with additional tables for enhanced functionality

// AI Coaching Profiles
export const aiCoachingProfiles = pgTable('ai_coaching_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  emotionalState: text('emotional_state'),
  frustrationLevel: integer('frustration_level').default(0),
  adaptations: jsonb('adaptations'),
  learningStyle: text('learning_style'),
  preferredCommunication: text('preferred_communication'),
  strengths: jsonb('strengths'),
  challenges: jsonb('challenges'),
  progressHistory: jsonb('progress_history'),
  lastInteraction: timestamp('last_interaction'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// User Preferences for Accessibility
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  theme: text('theme').default('default'),
  sensoryPreferences: jsonb('sensory_preferences'),
  audioDescriptions: boolean('audio_descriptions').default(false),
  focusMode: boolean('focus_mode').default(false),
  executiveSupport: jsonb('executive_support'),
  language: text('language').default('en'),
  culturalSettings: jsonb('cultural_settings'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Performance Metrics
export const performanceMetrics = pgTable('performance_metrics', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  metricType: text('metric_type').notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit'),
  category: text('category'),
  subCategory: text('sub_category'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  metadata: jsonb('metadata'),
  seasonYear: integer('season_year'),
  sport: text('sport'),
});

// Team Memberships
export const teamMemberships = pgTable('team_memberships', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  teamId: integer('team_id').notNull().references(() => teams.id),
  role: text('role').default('player'), // player, coach, assistant, manager
  joinDate: timestamp('join_date').notNull().defaultNow(),
  endDate: timestamp('end_date'),
  isActive: boolean('is_active').default(true),
  jerseyNumber: integer('jersey_number'),
  position: text('position'),
});

// Teams
export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sport: text('sport').notNull(),
  division: text('division'),
  season: text('season'),
  year: integer('year'),
  homeVenue: text('home_venue'),
  teamColors: jsonb('team_colors'),
  maxRosterSize: integer('max_roster_size').default(25),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Challenges
export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(), // daily, weekly, monthly, special
  sport: text('sport'),
  difficulty: text('difficulty').default('medium'), // easy, medium, hard
  xpReward: integer('xp_reward').default(10),
  requirements: jsonb('requirements'),
  isActive: boolean('is_active').default(true),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// User Challenges
export const userChallenges = pgTable('user_challenges', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  challengeId: integer('challenge_id').notNull().references(() => challenges.id),
  status: text('status').default('active'), // active, completed, failed, expired
  progress: integer('progress').default(0),
  maxProgress: integer('max_progress').default(100),
  completedAt: timestamp('completed_at'),
  xpEarned: integer('xp_earned').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Health Metrics
export const healthMetrics = pgTable('health_metrics', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  metricType: text('metric_type').notNull(), // heart_rate, sleep, stress, recovery
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit').notNull(),
  recordedAt: timestamp('recorded_at').notNull().defaultNow(),
  source: text('source'), // fitbit, garmin, manual, etc.
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Recovery Plans
export const recoveryPlans = pgTable('recovery_plans', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  planName: text('plan_name').notNull(),
  planType: text('plan_type').notNull(), // injury, fatigue, performance
  description: text('description'),
  exercises: jsonb('exercises'),
  duration: integer('duration'), // in days
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  status: text('status').default('active'), // active, completed, paused
  progress: integer('progress').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});



// Create insert schemas
export const insertAiCoachingProfileSchema = createInsertSchema(aiCoachingProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPerformanceMetricsSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertTeamMembershipSchema = createInsertSchema(teamMemberships).omit({
  id: true,
  joinDate: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
});

export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({
  id: true,
  createdAt: true,
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({
  id: true,
  createdAt: true,
  recordedAt: true,
});

export const insertRecoveryPlanSchema = createInsertSchema(recoveryPlans).omit({
  id: true,
  createdAt: true,
});

// Export types
export type AiCoachingProfile = typeof aiCoachingProfiles.$inferSelect;
export type InsertAiCoachingProfile = z.infer<typeof insertAiCoachingProfileSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetrics = z.infer<typeof insertPerformanceMetricsSchema>;
export type TeamMembership = typeof teamMemberships.$inferSelect;
export type InsertTeamMembership = z.infer<typeof insertTeamMembershipSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
export type RecoveryPlan = typeof recoveryPlans.$inferSelect;
export type InsertRecoveryPlan = z.infer<typeof insertRecoveryPlanSchema>;