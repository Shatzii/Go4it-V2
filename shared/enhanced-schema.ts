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