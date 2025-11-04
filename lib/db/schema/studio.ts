/**
 * Studio schema for Elite Integrated Core Studio (grades 9-12)
 * Additive to existing Go4it OS schema
 * SQLite dev / Postgres prod compatible
 */

import { pgTable, text, integer, real, timestamp, serial, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Subject enums
export const subjectEnum = ['math', 'ela', 'science', 'socialStudies'] as const;
export type SubjectKey = typeof subjectEnum[number];

// Course type enums for NCAA mapping
export const courseTypeEnum = ['english', 'math', 'science', 'social_studies'] as const;
export type CourseType = typeof courseTypeEnum[number];

// Activity type enums
export const activityTypeEnum = [
  'mini_lesson',
  'guided_practice', 
  'lab_demo',
  'cer_writeup',
  'close_reading',
  'writing_workshop',
  'peer_review',
  'case_study',
  'learning_log',
  'concept_check',
  'exit_ticket'
] as const;
export type ActivityType = typeof activityTypeEnum[number];

/**
 * Daily Studios - one per day per grade level
 * Links to curriculum units and contains the day's theme/driving question
 */
export const dailyStudios = pgTable("daily_studios", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // ISO date (YYYY-MM-DD)
  gradeLevel: integer("grade_level").notNull(), // 9-12
  unitId: text("unit_id"), // FK to curriculum_units (optional)
  drivingQuestion: text("driving_question").notNull(),
  theme: text("theme").notNull(),
  ncaaTasks: text("ncaa_tasks"), // JSON array of task strings
  athleteAIData: text("athlete_ai_data"), // JSON { sleepScore, readiness, trainingLoad }
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Studio Rotations - 4 per daily studio (Math, ELA, Science, Social Studies)
 * Contains standards, objectives, activities, and differentiation
 */
export const studioRotations = pgTable("studio_rotations", {
  id: serial("id").primaryKey(),
  dailyStudioId: integer("daily_studio_id").notNull().references(() => dailyStudios.id),
  subject: text("subject", { enum: subjectEnum }).notNull(),
  title: text("title").notNull(),
  duration: integer("duration").notNull(), // minutes
  standards: text("standards").notNull(), // JSON array of standard codes
  objectives: text("objectives").notNull(), // JSON array of learning objectives
  activities: text("activities").notNull(), // JSON array of activity objects
  exitTicketQuestion: text("exit_ticket_question"),
  differentiation: text("differentiation"), // JSON { scaffolded, extended }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Student Studio Progress - tracks completion and learning logs
 * One per student per daily studio
 */
export const studentStudioProgress = pgTable("student_studio_progress", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull(), // FK to Clerk user ID
  dailyStudioId: integer("daily_studio_id").notNull().references(() => dailyStudios.id),
  rotationCompletions: text("rotation_completions").notNull().default('{}'), // JSON { math: true, ela: false, ... }
  exitTicketResponses: text("exit_ticket_responses").notNull().default('{}'), // JSON { math: "response", ... }
  learningLogUrl: text("learning_log_url"), // URL to student's reflection/log
  timeOnTaskMins: integer("time_on_task_mins").default(0),
  synthesisCompleted: boolean("synthesis_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * NCAA Core Courses - tracks student progress toward NCAA eligibility
 * Maps studio work to NCAA core credit requirements
 */
export const ncaaCoreCourses = pgTable("ncaa_core_courses", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull(), // FK to Clerk user ID
  courseType: text("course_type", { enum: courseTypeEnum }).notNull(),
  courseTitle: text("course_title").notNull(),
  gradeLevel: integer("grade_level").notNull(), // 9-12
  credits: real("credits").notNull(), // e.g., 1.0 for full year
  standardsCovered: text("standards_covered").notNull(), // JSON array
  finalGrade: text("final_grade"), // A, B, C, etc.
  completed: boolean("completed").default(false),
  schoolYear: integer("school_year").notNull(), // e.g., 2025
  carnegieUnits: real("carnegie_units"), // calculated based on 120+ hours
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Curriculum Units - 6-week thematic units for studio planning
 */
export const curriculumUnits = pgTable("curriculum_units", {
  id: text("id").primaryKey(), // e.g., "G9-U1-Energy"
  gradeLevel: integer("grade_level").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  durationWeeks: integer("duration_weeks").default(6),
  essentialQuestion: text("essential_question"),
  coreStandards: text("core_standards").notNull(), // JSON array
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Exports for Drizzle ORM
export type DailyStudio = typeof dailyStudios.$inferSelect;
export type NewDailyStudio = typeof dailyStudios.$inferInsert;

export type StudioRotation = typeof studioRotations.$inferSelect;
export type NewStudioRotation = typeof studioRotations.$inferInsert;

export type StudentStudioProgress = typeof studentStudioProgress.$inferSelect;
export type NewStudentStudioProgress = typeof studentStudioProgress.$inferInsert;

export type NCAACoreCourse = typeof ncaaCoreCourses.$inferSelect;
export type NewNCAACoreCourse = typeof ncaaCoreCourses.$inferInsert;

export type CurriculumUnit = typeof curriculumUnits.$inferSelect;
export type NewCurriculumUnit = typeof curriculumUnits.$inferInsert;
