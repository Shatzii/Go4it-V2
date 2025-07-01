import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  boolean,
  json, 
  primaryKey,
  varchar
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication and account management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true, 
  email: true,
  role: true,
  firstName: true,
  lastName: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Activity logs for tracking user activity
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  userId: true,
  action: true,
  details: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Rhythm files for storing templates
export const rhythmFiles = pgTable("rhythm_files", {
  id: serial("id").primaryKey(),
  path: varchar("path", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastModifiedBy: integer("last_modified_by").references(() => users.id),
});

export const insertRhythmFileSchema = createInsertSchema(rhythmFiles).pick({
  path: true,
  content: true,
  createdBy: true,
  lastModifiedBy: true,
});

export type InsertRhythmFile = z.infer<typeof insertRhythmFileSchema>;
export type RhythmFile = typeof rhythmFiles.$inferSelect;

// State curriculum standards 
export const stateStandards = pgTable("state_standards", {
  id: serial("id").primaryKey(),
  stateCode: varchar("state_code", { length: 2 }).notNull(),
  stateName: varchar("state_name", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  gradeLevel: varchar("grade_level", { length: 20 }).notNull(),
  standardCode: varchar("standard_code", { length: 50 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  keywords: text("keywords").array(),
  dateAdopted: varchar("date_adopted", { length: 50 }),
  dateUpdated: varchar("date_updated", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStateStandardSchema = createInsertSchema(stateStandards).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStateStandard = z.infer<typeof insertStateStandardSchema>;
export type StateStandard = typeof stateStandards.$inferSelect;

// Learning objectives aligned with standards
export const learningObjectives = pgTable("learning_objectives", {
  id: serial("id").primaryKey(),
  standardId: integer("standard_id").references(() => stateStandards.id).notNull(),
  description: text("description").notNull(),
  bloomsLevel: varchar("blooms_level", { length: 20 }).notNull(),
  difficultyLevel: varchar("difficulty_level", { length: 20 }).notNull(),
  neurodivergentConsiderations: json("neurodivergent_considerations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLearningObjectiveSchema = createInsertSchema(learningObjectives).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLearningObjective = z.infer<typeof insertLearningObjectiveSchema>;
export type LearningObjective = typeof learningObjectives.$inferSelect;

// Lesson plans for educators
export const lessonPlans = pgTable("lesson_plans", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  gradeLevel: varchar("grade_level", { length: 20 }).notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  standardIds: integer("standard_ids").array(),
  objectiveIds: integer("objective_ids").array(),
  duration: integer("duration").notNull(), // in minutes
  materials: text("materials").array(),
  preparation: text("preparation").notNull(),
  procedure: text("procedure").notNull(),
  assessment: text("assessment").notNull(),
  differentiation: json("differentiation"),
  extensions: text("extensions").array(),
  resources: json("resources"),
  tags: text("tags").array(),
  visibility: varchar("visibility", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLessonPlanSchema = createInsertSchema(lessonPlans).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLessonPlan = z.infer<typeof insertLessonPlanSchema>;
export type LessonPlan = typeof lessonPlans.$inferSelect;

// Academic units (collections of lessons)
export const academicUnits = pgTable("academic_units", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  gradeLevel: varchar("grade_level", { length: 20 }).notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  lessonIds: integer("lesson_ids").array(),
  duration: integer("duration").notNull(), // in days
  essentialQuestions: text("essential_questions").array(),
  bigIdeas: text("big_ideas").array(),
  assessments: json("assessments"),
  visibility: varchar("visibility", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAcademicUnitSchema = createInsertSchema(academicUnits).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAcademicUnit = z.infer<typeof insertAcademicUnitSchema>;
export type AcademicUnit = typeof academicUnits.$inferSelect;

// Neurodivergent learning profiles
export const neurodivergentProfiles = pgTable("neurodivergent_profiles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  description: text("description").notNull(),
  learningStrengths: text("learning_strengths").array(),
  learningChallenges: text("learning_challenges").array(),
  recommendedAccommodations: json("recommended_accommodations"),
  preferredLearningStyles: text("preferred_learning_styles").array(),
  interestAreas: text("interest_areas").array(),
  sensoryConsiderations: json("sensory_considerations"),
  executiveFunctionSupports: json("executive_function_supports"),
  colorSchemePreference: varchar("color_scheme_preference", { length: 50 }),
  fontPreference: varchar("font_preference", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNeurodivergentProfileSchema = createInsertSchema(neurodivergentProfiles).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNeurodivergentProfile = z.infer<typeof insertNeurodivergentProfileSchema>;
export type NeurodivergentProfile = typeof neurodivergentProfiles.$inferSelect;

// Personalized curriculum paths
export const curriculumPaths = pgTable("curriculum_paths", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  profileId: integer("profile_id").references(() => neurodivergentProfiles.id),
  gradeLevel: varchar("grade_level", { length: 20 }).notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  stateCode: varchar("state_code", { length: 2 }).notNull(),
  standardsVersion: varchar("standards_version", { length: 50 }).notNull(),
  units: json("units").notNull(),
  pace: varchar("pace", { length: 20 }).notNull(),
  presentationPreferences: json("presentation_preferences").notNull(),
  assessmentAdaptations: json("assessment_adaptations").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCurriculumPathSchema = createInsertSchema(curriculumPaths).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCurriculumPath = z.infer<typeof insertCurriculumPathSchema>;
export type CurriculumPath = typeof curriculumPaths.$inferSelect;

// Define relationships between tables
export const userRelations = relations(users, ({ many }) => ({
  activityLogs: many(activityLogs),
  rhythmFiles: many(rhythmFiles, { relationName: "createdFiles" }),
  modifiedFiles: many(rhythmFiles, { relationName: "modifiedFiles" }),
  lessonPlans: many(lessonPlans),
  academicUnits: many(academicUnits),
  curriculumPaths: many(curriculumPaths),
}));

export const standardRelations = relations(stateStandards, ({ many }) => ({
  learningObjectives: many(learningObjectives),
}));

export const learningObjectiveRelations = relations(learningObjectives, ({ one }) => ({
  standard: one(stateStandards, {
    fields: [learningObjectives.standardId],
    references: [stateStandards.id],
  }),
}));

export const neurodivergentProfileRelations = relations(neurodivergentProfiles, ({ many }) => ({
  curriculumPaths: many(curriculumPaths),
}));

export const curriculumPathRelations = relations(curriculumPaths, ({ one }) => ({
  student: one(users, {
    fields: [curriculumPaths.studentId],
    references: [users.id],
  }),
  profile: one(neurodivergentProfiles, {
    fields: [curriculumPaths.profileId],
    references: [neurodivergentProfiles.id],
  }),
}));