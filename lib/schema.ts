import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  decimal,
  jsonb,
  serial,
} from 'drizzle-orm/pg-core';
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
});

// Video analysis table
export const videoAnalysis = pgTable('video_analysis', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
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
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
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
  videoId: integer('video_id')
    .notNull()
    .references(() => videos.id),
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
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  skillId: text('skill_id').notNull(),
  skillName: text('skill_name').notNull(),
  currentLevel: integer('current_level').notNull().default(1),
  totalXp: integer('total_xp').notNull().default(0),
  isUnlocked: boolean('is_unlocked').notNull().default(false),
  completedAt: timestamp('completed_at'),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
});

// Achievements table
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
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
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
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

export const insertStarPathProgressSchema = createInsertSchema(starPathProgress).omit({
  id: true,
  lastUpdated: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
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

// Athlete profiles table for extended profile data
export const athleteProfiles = pgTable('athlete_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  height: text('height'), // e.g., "6'2"
  weight: text('weight'), // e.g., "185 lbs"
  dominantHand: text('dominant_hand'), // left, right, both
  yearsPlaying: integer('years_playing'),
  previousInjuries: text('previous_injuries'),
  phoneNumber: text('phone_number'),
  parentContactName: text('parent_contact_name'),
  parentContactPhone: text('parent_contact_phone'),
  parentContactEmail: text('parent_contact_email'),
  coachName: text('coach_name'),
  coachPhone: text('coach_phone'),
  coachEmail: text('coach_email'),
  achievements: text('achievements').array(),
  specialties: text('specialties').array(),
  goals: text('goals'),
  bio: text('bio'),
  socialMediaLinks: jsonb('social_media_links'),
  isProfileComplete: boolean('is_profile_complete').notNull().default(false),
  profileVisibility: text('profile_visibility').notNull().default('public'), // public, private, coaches-only
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Quick profile setup table for one-click creation
export const quickProfileSetup = pgTable('quick_profile_setup', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  setupStep: text('setup_step').notNull().default('basic-info'), // basic-info, athletics, contacts, goals, complete
  setupData: jsonb('setup_data'),
  isCompleted: boolean('is_completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Zod schemas for athlete profiles
export const insertAthleteProfileSchema = createInsertSchema(athleteProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuickProfileSetupSchema = createInsertSchema(quickProfileSetup).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Add missing insert schemas
export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
});

export const insertNcaaSchoolSchema = createInsertSchema(ncaaSchools).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type VideoAnalysis = typeof videoAnalysis.$inferSelect;
export type InsertVideoAnalysis = typeof videoAnalysis.$inferInsert;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;
export type HighlightReel = typeof highlightReels.$inferSelect;
export type InsertHighlightReel = typeof highlightReels.$inferInsert;
export type StarPathProgress = typeof starPathProgress.$inferSelect;
export type InsertStarPathProgress = typeof starPathProgress.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
export type NcaaSchool = typeof ncaaSchools.$inferSelect;
export type InsertNcaaSchool = typeof ncaaSchools.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = typeof userSessions.$inferInsert;
export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type InsertAthleteProfile = typeof athleteProfiles.$inferInsert;
export type QuickProfileSetup = typeof quickProfileSetup.$inferSelect;
export type InsertQuickProfileSetup = typeof quickProfileSetup.$inferInsert;
