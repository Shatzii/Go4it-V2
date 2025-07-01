import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  role: text("role").notNull().default("student"), // student, coach, parent
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const garScores = pgTable("gar_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  videoId: integer("video_id").references(() => videos.id, { onDelete: "cascade" }),
  overallScore: integer("overall_score").notNull(),
  speedScore: integer("speed_score"),
  accuracyScore: integer("accuracy_score"),
  decisionScore: integer("decision_score"),
  skillBreakdown: jsonb("skill_breakdown"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const starpathProgress = pgTable("starpath_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  skillId: text("skill_id").notNull(),
  skillName: text("skill_name").notNull(),
  xpPoints: integer("xp_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  isUnlocked: boolean("is_unlocked").notNull().default(false),
  unlockedAt: timestamp("unlocked_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  originalName: text("original_name"),
  analysisStatus: text("analysis_status").notNull().default("pending"), // pending, processing, completed, failed
  uploadDate: timestamp("upload_date").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const academicRecords = pgTable("academic_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gpa: decimal("gpa", { precision: 3, scale: 2 }),
  creditsCompleted: integer("credits_completed").default(0),
  totalCreditsRequired: integer("total_credits_required").default(120),
  satScore: integer("sat_score"),
  isNcaaEligible: boolean("is_ncaa_eligible").default(false),
  courses: jsonb("courses"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: text("achievement_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  xpReward: integer("xp_reward").default(0),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const usaFootballMemberships = pgTable("usa_football_memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  membershipType: text("membership_type").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  parentEmail: text("parent_email"),
  position: text("position"),
  experience: text("experience"),
  schoolName: text("school_name"),
  coachName: text("coach_name"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  medicalConditions: text("medical_conditions"),
  membershipNumber: text("membership_number").unique(),
  status: text("status").default("pending"),
  expirationDate: timestamp("expiration_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGarScoreSchema = createInsertSchema(garScores).omit({
  id: true,
  createdAt: true,
});

export const insertStarpathProgressSchema = createInsertSchema(starpathProgress).omit({
  id: true,
  updatedAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  uploadDate: true,
  processedAt: true,
});

export const insertAcademicRecordSchema = createInsertSchema(academicRecords).omit({
  id: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

export const insertUSAFootballMembershipSchema = createInsertSchema(usaFootballMemberships).omit({
  id: true,
  membershipNumber: true,
  status: true,
  expirationDate: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type GarScore = typeof garScores.$inferSelect;
export type InsertGarScore = z.infer<typeof insertGarScoreSchema>;
export type StarpathProgress = typeof starpathProgress.$inferSelect;
export type InsertStarpathProgress = z.infer<typeof insertStarpathProgressSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type AcademicRecord = typeof academicRecords.$inferSelect;
export type InsertAcademicRecord = z.infer<typeof insertAcademicRecordSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type USAFootballMembership = typeof usaFootballMemberships.$inferSelect;
export type InsertUSAFootballMembership = z.infer<typeof insertUSAFootballMembershipSchema>;

// CMS Tables
export const cmsContent = pgTable("cms_content", {
  id: serial("id").primaryKey(),
  slug: varchar("slug").notNull().unique(),
  title: varchar("title").notNull(),
  content: text("content"),
  type: varchar("type").notNull().default("page"), // page, announcement, faq
  status: varchar("status").notNull().default("published"), // draft, published, archived
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cmsMenus = pgTable("cms_menus", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  items: text("items"), // JSON array of menu items
  location: varchar("location").notNull(), // navbar, footer, sidebar
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cmsSports = pgTable("cms_sports", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  skills: text("skills"), // JSON array of skills
  drills: text("drills"), // JSON array of drills
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cmsAchievements = pgTable("cms_achievements", {
  id: serial("id").primaryKey(),
  achievementId: varchar("achievement_id").notNull().unique(),
  title: varchar("title").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  requirements: text("requirements"), // JSON object
  rewards: text("rewards"), // JSON object
  category: varchar("category").default("general"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cmsSettings = pgTable("cms_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull().unique(),
  value: text("value"),
  type: varchar("type").default("text"), // text, number, boolean, json
  category: varchar("category").default("general"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CMS Insert Schemas
export const insertCmsContentSchema = createInsertSchema(cmsContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCmsMenuSchema = createInsertSchema(cmsMenus).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCmsSportsSchema = createInsertSchema(cmsSports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCmsAchievementsSchema = createInsertSchema(cmsAchievements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCmsSettingsSchema = createInsertSchema(cmsSettings).omit({
  id: true,
  updatedAt: true,
});

// CMS Types
export type CmsContent = typeof cmsContent.$inferSelect;
export type InsertCmsContent = z.infer<typeof insertCmsContentSchema>;
export type CmsMenu = typeof cmsMenus.$inferSelect;
export type InsertCmsMenu = z.infer<typeof insertCmsMenuSchema>;
export type CmsSports = typeof cmsSports.$inferSelect;
export type InsertCmsSports = z.infer<typeof insertCmsSportsSchema>;
export type CmsAchievements = typeof cmsAchievements.$inferSelect;
export type InsertCmsAchievements = z.infer<typeof insertCmsAchievementsSchema>;
export type CmsSettings = typeof cmsSettings.$inferSelect;
export type InsertCmsSettings = z.infer<typeof insertCmsSettingsSchema>;
