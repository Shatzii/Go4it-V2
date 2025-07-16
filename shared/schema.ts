import { pgTable, text, integer, timestamp, boolean, decimal, jsonb, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('athlete'), // athlete, coach, parent, admin
  firstName: text('first_name'),
  lastName: text('last_name'),
  dateOfBirth: timestamp('date_of_birth'),
  sport: text('sport'),
  position: text('position'),
  graduationYear: integer('graduation_year'),
  gpa: decimal('gpa', { precision: 3, scale: 2 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
  
  // Subscription fields
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionPlan: text('subscription_plan').default('free'), // free, starter, pro, elite
  subscriptionStatus: text('subscription_status').default('active'), // active, canceled, past_due
  subscriptionEndDate: timestamp('subscription_end_date'),
});

// Video analysis table
export const videoAnalysis = pgTable('video_analysis', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  sport: text('sport').notNull(),
  garScore: decimal('gar_score', { precision: 5, scale: 2 }),
  analysisData: jsonb('analysis_data'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Videos table for the highlight reel system
export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  sport: text('sport').notNull(),
  garScore: decimal('gar_score', { precision: 5, scale: 2 }),
  analysisData: jsonb('analysis_data'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Highlight reels table
export const highlightReels = pgTable('highlight_reels', {
  id: serial('id').primaryKey(),
  videoId: integer('video_id').notNull().references(() => videos.id),
  title: text('title').notNull(),
  duration: integer('duration').notNull().default(60),
  highlights: jsonb('highlights'),
  status: text('status').notNull().default('processing'), // processing, completed, failed
  downloadUrl: text('download_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  processedAt: timestamp('processed_at'),
});

// StarPath progress table
export const starPathProgress = pgTable('starpath_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  skillId: text('skill_id').notNull(),
  skillName: text('skill_name').notNull(),
  currentLevel: integer('current_level').notNull().default(1),
  totalXp: integer('total_xp').notNull().default(0),
  isUnlocked: boolean('is_unlocked').notNull().default(false),
  completedAt: timestamp('completed_at'),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
});

// Content tags table for smart tagging
export const contentTags = pgTable('content_tags', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileId: integer('file_id').notNull(),
  tagName: text('tag_name').notNull(),
  tagCategory: text('tag_category').notNull(), // sport, skill, performance, event, location, equipment, technique, strategy
  confidence: decimal('confidence', { precision: 3, scale: 2 }).notNull().default('0.8'),
  relevance: decimal('relevance', { precision: 3, scale: 2 }).notNull().default('0.7'),
  metadata: jsonb('metadata'), // Additional tag metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User files table for file management
export const userFiles = pgTable('user_files', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileType: text('file_type').notNull(), // video, image, document
  fileSize: integer('file_size').notNull(),
  sport: text('sport'),
  description: text('description'),
  isAnalyzed: boolean('is_analyzed').notNull().default(false),
  analysisData: jsonb('analysis_data'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Content analysis table for detailed analysis results
export const contentAnalysis = pgTable('content_analysis', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileId: integer('file_id').notNull().references(() => userFiles.id),
  primarySport: text('primary_sport').notNull(),
  secondarySports: text('secondary_sports').array(),
  skills: jsonb('skills'), // Array of skill objects
  performance: jsonb('performance'), // Performance metrics
  context: jsonb('context'), // Analysis context
  suggestions: text('suggestions').array(),
  autoCategories: text('auto_categories').array(),
  detectedObjects: text('detected_objects').array(),
  timestamps: jsonb('timestamps'), // Video timestamps
  analyzedAt: timestamp('analyzed_at').notNull().defaultNow(),
});

// Achievements table
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  achievementId: text('achievement_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  badgeIcon: text('badge_icon'),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
});

// NCAA schools table
export const ncaaSchools = pgTable('ncaa_schools', {
  id: serial('id').primaryKey(),
  schoolName: text('school_name').notNull(),
  division: text('division').notNull(), // D1, D2, D3, NAIA, NJCAA
  conference: text('conference'),
  state: text('state'),
  city: text('city'),
  website: text('website'),
  coachingStaff: jsonb('coaching_staff'),
  programs: jsonb('programs'), // Available sports programs
  isActive: boolean('is_active').notNull().default(true),
});

// User sessions table for authentication
export const userSessions = pgTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

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

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
});

export const insertVideoAnalysisSchema = createInsertSchema(videoAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertHighlightReelSchema = createInsertSchema(highlightReels).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertStarPathProgressSchema = createInsertSchema(starPathProgress).omit({
  id: true,
  lastUpdated: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type VideoAnalysis = typeof videoAnalysis.$inferSelect;
export type InsertVideoAnalysis = z.infer<typeof insertVideoAnalysisSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type HighlightReel = typeof highlightReels.$inferSelect;
export type InsertHighlightReel = z.infer<typeof insertHighlightReelSchema>;
export type StarPathProgress = typeof starPathProgress.$inferSelect;
export type InsertStarPathProgress = z.infer<typeof insertStarPathProgressSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type NcaaSchool = typeof ncaaSchools.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;
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