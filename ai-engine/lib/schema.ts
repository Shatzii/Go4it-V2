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

// Recruiting contacts table (coaches, recruiters)
export const recruitingContacts = pgTable('recruiting_contacts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  schoolId: integer('school_id').references(() => ncaaSchools.id),
  name: text('name').notNull(),
  title: text('title'), // Head Coach, Assistant Coach, Recruiting Coordinator
  email: text('email'),
  phone: text('phone'),
  sport: text('sport'),
  notes: text('notes'),
  interestLevel: text('interest_level'), // high, medium, low
  lastContactDate: timestamp('last_contact_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Recruiting communications log
export const recruitingCommunications = pgTable('recruiting_communications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  contactId: integer('contact_id').references(() => recruitingContacts.id),
  type: text('type').notNull(), // email, phone, text, in-person, video-call
  subject: text('subject'),
  content: text('content'),
  direction: text('direction').notNull(), // inbound, outbound
  communicationDate: timestamp('communication_date').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Recruiting offers and interest
export const recruitingOffers = pgTable('recruiting_offers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  schoolId: integer('school_id')
    .notNull()
    .references(() => ncaaSchools.id),
  contactId: integer('contact_id').references(() => recruitingContacts.id),
  status: text('status').notNull().default('interested'), // interested, contacted, visited, offered, committed, declined
  offerType: text('offer_type'), // scholarship, walk-on, preferred-walk-on
  scholarshipAmount: decimal('scholarship_amount', { precision: 10, scale: 2 }),
  scholarshipType: text('scholarship_type'), // full, partial, academic
  notes: text('notes'),
  visitDate: timestamp('visit_date'),
  offerDate: timestamp('offer_date'),
  commitmentDate: timestamp('commitment_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Recruiting timeline events
export const recruitingTimeline = pgTable('recruiting_timeline', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  schoolId: integer('school_id').references(() => ncaaSchools.id),
  contactId: integer('contact_id').references(() => recruitingContacts.id),
  eventType: text('event_type').notNull(), // visit, camp, showcase, deadline, commitment, contact
  title: text('title').notNull(),
  description: text('description'),
  eventDate: timestamp('event_date').notNull(),
  location: text('location'),
  isCompleted: boolean('is_completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Recruiting documents
export const recruitingDocuments = pgTable('recruiting_documents', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  documentType: text('document_type').notNull(), // transcript, recommendation, essay, resume, video
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size'),
  mimeType: text('mime_type'),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
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

export const insertRecruitingContactSchema = createInsertSchema(recruitingContacts).omit({
  id: true,
  createdAt: true,
});

export const insertRecruitingCommunicationSchema = createInsertSchema(recruitingCommunications).omit({
  id: true,
  createdAt: true,
});

export const insertRecruitingOfferSchema = createInsertSchema(recruitingOffers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecruitingTimelineSchema = createInsertSchema(recruitingTimeline).omit({
  id: true,
  createdAt: true,
});

export const insertRecruitingDocumentSchema = createInsertSchema(recruitingDocuments).omit({
  id: true,
  uploadedAt: true,
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
export type RecruitingContact = typeof recruitingContacts.$inferSelect;
export type InsertRecruitingContact = z.infer<typeof insertRecruitingContactSchema>;
export type RecruitingCommunication = typeof recruitingCommunications.$inferSelect;
export type InsertRecruitingCommunication = z.infer<typeof insertRecruitingCommunicationSchema>;
export type RecruitingOffer = typeof recruitingOffers.$inferSelect;
export type InsertRecruitingOffer = z.infer<typeof insertRecruitingOfferSchema>;
export type RecruitingTimeline = typeof recruitingTimeline.$inferSelect;
export type InsertRecruitingTimeline = z.infer<typeof insertRecruitingTimelineSchema>;
export type RecruitingDocument = typeof recruitingDocuments.$inferSelect;
export type InsertRecruitingDocument = z.infer<typeof insertRecruitingDocumentSchema>;
