/**
 * StarPath + NCAA Integration Schema (ADDITIVE)
 * Connects GAR sessions, Credit Audit evaluations, and Academy progress
 * Full-time students get automatic NCAA pathway tracking
 */

import { pgTable, text, integer, real, timestamp, serial, boolean, jsonb, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "../shared/schema";

/**
 * GAR Sessions - Track individual training/testing sessions
 */
export const garSessions = pgTable("gar_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sport: varchar("sport").notNull(),
  sessionType: varchar("session_type").notNull(), // "training", "testing", "competition"
  
  // Session metrics
  duration: integer("duration"), // minutes
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  
  // GAR scores
  garScore: real("gar_score"),
  physicalScore: real("physical_score"),
  cognitiveScore: real("cognitive_score"),
  psychologicalScore: real("psychological_score"),
  
  // Readiness & Load
  readinessScore: real("readiness_score"), // 0-10
  trainingLoad: real("training_load"), // 0-10
  sleepScore: real("sleep_score"), // 0-10
  recoveryScore: real("recovery_score"), // 0-10
  
  // Performance deltas
  deltaFromBaseline: real("delta_from_baseline"),
  deltaFromLastSession: real("delta_from_last_session"),
  
  // Video & Analysis
  videoUrl: varchar("video_url"),
  analysisData: jsonb("analysis_data"),
  strengths: text("strengths").array(),
  improvements: text("improvements").array(),
  
  // Tags for filtering
  tags: text("tags").array(), // ["drill", "scrimmage", "conditioning"]
  
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * GAR Metrics Snapshots - Aggregated metrics by period
 */
export const garMetricsSnapshots = pgTable("gar_metrics_snapshots", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  period: varchar("period").notNull(), // "daily", "weekly", "monthly"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  // Aggregated scores
  avgGarScore: real("avg_gar_score"),
  avgReadiness: real("avg_readiness"),
  avgTrainingLoad: real("avg_training_load"),
  avgSleep: real("avg_sleep"),
  avgRecovery: real("avg_recovery"),
  
  // Trends
  garTrend: varchar("gar_trend"), // "improving", "stable", "declining"
  totalSessions: integer("total_sessions").default(0),
  totalMinutes: integer("total_minutes").default(0),
  
  // Peak performance
  peakGarScore: real("peak_gar_score"),
  peakSessionId: varchar("peak_session_id"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Student Profiles - Extended with StarPath + NCAA integration
 */
export const studentProfiles = pgTable("student_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  
  // Enrollment status
  enrollmentType: varchar("enrollment_type").notNull(), // "full_time", "part_time", "audit_only"
  enrollmentDate: timestamp("enrollment_date"),
  expectedGraduation: integer("expected_graduation"), // year
  currentGradeLevel: integer("current_grade_level"), // 9-12
  
  // NCAA Integration (linked from Credit Audit / Intl Engine)
  auditEvaluationId: integer("audit_evaluation_id"), // FK to intl_evaluations
  coreGpa: real("core_gpa"), // Pulled from evaluation
  overallGpa: real("overall_gpa"),
  coreUnitsCompleted: real("core_units_completed"),
  coreUnitsRequired: real("core_units_required").default(16),
  
  // NCAA eligibility status
  ncaaStatus: varchar("ncaa_status"), // "on_track", "at_risk", "ineligible", "eligible"
  divisionIStatus: varchar("division_i_status"),
  divisionIIStatus: varchar("division_ii_status"),
  missingRequirements: jsonb("missing_requirements"), // Array of strings
  
  // StarPath progress
  totalXp: integer("total_xp").default(0),
  currentTier: integer("current_tier").default(1),
  completedNodes: integer("completed_nodes").default(0),
  achievements: integer("achievements").default(0),
  
  // GAR baseline
  baselineGarScore: real("baseline_gar_score"),
  currentGarScore: real("current_gar_score"),
  garTrend: varchar("gar_trend"), // "improving", "stable", "declining"
  
  // Academic Load ↔ Training Load correlation
  lastAcademicSync: timestamp("last_academic_sync"),
  lastGarSync: timestamp("last_gar_sync"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * NCAA Course Mapping - Links Studio rotations to NCAA core requirements
 */
export const ncaaCourseMappings = pgTable("ncaa_course_mappings", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id").notNull().references(() => users.id),
  
  // Course identification
  courseId: varchar("course_id"), // FK to academy_courses or daily_studios
  courseName: varchar("course_name").notNull(),
  courseType: varchar("course_type").notNull(), // "studio_rotation", "traditional_course"
  
  // NCAA categorization
  ncaaCategory: varchar("ncaa_category").notNull(), // "english", "math", "science", "social_science"
  isCoreCourse: boolean("is_core_course").default(true),
  isLabScience: boolean("is_lab_science").default(false),
  isAlgebraIOrHigher: boolean("is_algebra_i_or_higher").default(false),
  
  // Credit calculation
  hoursPerWeek: integer("hours_per_week"),
  weeksCompleted: integer("weeks_completed"),
  totalInstructionalHours: integer("total_instructional_hours"),
  carnegieUnits: real("carnegie_units"), // Hours ÷ 120
  
  // Grading
  currentGrade: varchar("current_grade"),
  normalizedGrade: real("normalized_grade"), // 4.0 scale
  isComplete: boolean("is_complete").default(false),
  completedAt: timestamp("completed_at"),
  
  schoolYear: integer("school_year").notNull(),
  semester: varchar("semester"), // "fall", "spring", "summer"
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * StarPath + NCAA Auto-Planning - AI-generated course recommendations
 */
export const ncaaAutoPlans = pgTable("ncaa_auto_plans", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id").notNull().references(() => users.id),
  
  // Plan metadata
  planType: varchar("plan_type").notNull(), // "catch_up", "accelerated", "standard"
  targetDivision: varchar("target_division"), // "D1", "D2", "D3", "NAIA"
  targetGraduation: integer("target_graduation"), // year
  
  // Recommendations
  missingCredits: jsonb("missing_credits"), // { english: 1.0, math: 0.5, ... }
  recommendedCourses: jsonb("recommended_courses"), // Array of course IDs
  recommendedStudioFocus: jsonb("recommended_studio_focus"), // Which rotations to prioritize
  weeklySchedule: jsonb("weekly_schedule"), // Suggested weekly structure
  
  // Progress tracking
  planProgress: real("plan_progress").default(0), // 0-100%
  onTrack: boolean("on_track").default(true),
  lastRecalculated: timestamp("last_recalculated"),
  
  // GAR integration
  recommendedTrainingLoad: real("recommended_training_load"), // Suggested max load
  academicLoadScore: real("academic_load_score"), // Current academic intensity
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type GarSession = typeof garSessions.$inferSelect;
export type NewGarSession = typeof garSessions.$inferInsert;

export type GarMetricsSnapshot = typeof garMetricsSnapshots.$inferSelect;
export type NewGarMetricsSnapshot = typeof garMetricsSnapshots.$inferInsert;

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type NewStudentProfile = typeof studentProfiles.$inferInsert;

export type NCAACourseMapping = typeof ncaaCourseMappings.$inferSelect;
export type NewNCAACourseMapping = typeof ncaaCourseMappings.$inferInsert;

export type NCAAAutoPlan = typeof ncaaAutoPlans.$inferSelect;
export type NewNCAAAutoPlan = typeof ncaaAutoPlans.$inferInsert;
