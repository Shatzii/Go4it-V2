import { pgTable, serial, text, integer, boolean, timestamp, real, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Core Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("student"), // student, coach, parent, admin
  createdAt: timestamp("created_at").defaultNow(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  phoneNumber: text("phone_number"),
});

// Athlete Profiles
export const athleteProfiles = pgTable("athlete_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  age: integer("age"),
  height: text("height"),
  weight: text("weight"),
  school: text("school"),
  graduationYear: integer("graduation_year"),
  sportsInterest: text("sports_interest").array(),
  position: text("position"),
  bio: text("bio"),
  achievements: text("achievements").array(),
  stats: jsonb("stats"),
  updatedAt: timestamp("updated_at").defaultNow(),
  parentEmail: text("parent_email"),
  verifiedStatus: boolean("verified_status").default(false),
});

// Videos table for GAR analysis
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  sportType: text("sport_type").notNull(),
  duration: integer("duration"), // in seconds
  filePath: text("file_path").notNull(),
  thumbnailPath: text("thumbnail_path"),
  uploadDate: timestamp("upload_date").defaultNow(),
  processed: boolean("processed").default(false),
  analyzed: boolean("analyzed").default(false),
  status: text("status").default("pending"), // pending, processing, ready, error
  public: boolean("public").default(false),
});

// GAR Analysis Results
export const garAnalyses = pgTable("gar_analyses", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  userId: integer("user_id").notNull().references(() => users.id),
  overallScore: real("overall_score").notNull(), // 0-100 GAR score
  physicalScore: real("physical_score"), // Speed, agility, strength
  technicalScore: real("technical_score"), // Skill execution
  tacticalScore: real("tactical_score"), // Decision making
  psychologicalScore: real("psychological_score"), // Mental toughness
  analysisData: jsonb("analysis_data"), // Detailed breakdown
  feedback: text("feedback").array(),
  improvementTips: text("improvement_tips").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// StarPath Skill Tree
export const skillTrees = pgTable("skill_trees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sportType: text("sport_type").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  treeId: integer("tree_id").notNull().references(() => skillTrees.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // fundamental, intermediate, advanced
  xpRequired: integer("xp_required").default(100),
  prerequisites: integer("prerequisites").array(), // skill IDs required
  drills: jsonb("drills"), // Associated training drills
  icon: text("icon"),
  position: jsonb("position"), // x,y coordinates for tree visualization
  active: boolean("active").default(true),
});

// User Skill Progress
export const userSkillProgress = pgTable("user_skill_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  xpEarned: integer("xp_earned").default(0),
  level: integer("level").default(0),
  unlocked: boolean("unlocked").default(false),
  completed: boolean("completed").default(false),
  unlockedAt: timestamp("unlocked_at"),
  completedAt: timestamp("completed_at"),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
});

// XP Transactions for tracking points earned
export const xpTransactions = pgTable("xp_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skillId: integer("skill_id").references(() => skills.id),
  amount: integer("amount").notNull(),
  source: text("source").notNull(), // drill_completion, gar_improvement, achievement
  sourceId: integer("source_id"), // reference to specific activity
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Academic Progress Tracking
export const academicRecords = pgTable("academic_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gpa: real("gpa"),
  cumulativeGpa: real("cumulative_gpa"),
  semester: text("semester"),
  year: integer("year"),
  courses: jsonb("courses"), // Array of course objects
  ncaaEligible: boolean("ncaa_eligible").default(false),
  eligibilityNotes: text("eligibility_notes"),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievements/Badges
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // skill, gar, academic, milestone
  icon: text("icon"),
  color: text("color"),
  criteria: jsonb("criteria"), // Requirements to unlock
  xpReward: integer("xp_reward").default(0),
  rarity: text("rarity").default("common"), // common, rare, epic, legendary
  active: boolean("active").default(true),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: integer("progress").default(0), // For progressive achievements
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  athleteProfile: one(athleteProfiles, {
    fields: [users.id],
    references: [athleteProfiles.userId],
  }),
  videos: many(videos),
  garAnalyses: many(garAnalyses),
  skillProgress: many(userSkillProgress),
  academicRecords: many(academicRecords),
  achievements: many(userAchievements),
  xpTransactions: many(xpTransactions),
}));

export const athleteProfilesRelations = relations(athleteProfiles, ({ one }) => ({
  user: one(users, {
    fields: [athleteProfiles.userId],
    references: [users.id],
  }),
}));

export const videosRelations = relations(videos, ({ one, many }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  garAnalyses: many(garAnalyses),
}));

export const garAnalysesRelations = relations(garAnalyses, ({ one }) => ({
  video: one(videos, {
    fields: [garAnalyses.videoId],
    references: [videos.id],
  }),
  user: one(users, {
    fields: [garAnalyses.userId],
    references: [users.id],
  }),
}));

export const skillTreesRelations = relations(skillTrees, ({ many }) => ({
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
  tree: one(skillTrees, {
    fields: [skills.treeId],
    references: [skillTrees.id],
  }),
  userProgress: many(userSkillProgress),
}));

export const userSkillProgressRelations = relations(userSkillProgress, ({ one }) => ({
  user: one(users, {
    fields: [userSkillProgress.userId],
    references: [users.id],
  }),
  skill: one(skills, {
    fields: [userSkillProgress.skillId],
    references: [skills.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAthleteProfileSchema = createInsertSchema(athleteProfiles).omit({
  id: true,
  updatedAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  uploadDate: true,
});

export const insertGarAnalysisSchema = createInsertSchema(garAnalyses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillProgressSchema = createInsertSchema(userSkillProgress).omit({
  id: true,
  lastActivityAt: true,
});

export const insertAcademicRecordSchema = createInsertSchema(academicRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type InsertAthleteProfile = z.infer<typeof insertAthleteProfileSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type GarAnalysis = typeof garAnalyses.$inferSelect;
export type InsertGarAnalysis = z.infer<typeof insertGarAnalysisSchema>;
export type Skill = typeof skills.$inferSelect;
export type SkillTree = typeof skillTrees.$inferSelect;
export type UserSkillProgress = typeof userSkillProgress.$inferSelect;
export type InsertSkillProgress = z.infer<typeof insertSkillProgressSchema>;
export type AcademicRecord = typeof academicRecords.$inferSelect;
export type InsertAcademicRecord = z.infer<typeof insertAcademicRecordSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;