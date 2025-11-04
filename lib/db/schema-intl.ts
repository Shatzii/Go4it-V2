/**
 * International Credential Evaluation Schema (ADDITIVE)
 * Links to existing users table via userId foreign key
 * Enables NCAA eligibility evaluation for international transcripts
 * Feature flag: INTL_ENHANCED for confidence scoring and DI/DII projections
 */

import { pgTable, text, integer, real, timestamp, serial, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from "./schema"; // Link to existing users table

/**
 * International Countries - Reference data for supported education systems
 */
export const intlCountries = pgTable("intl_countries", {
  id: text("id").primaryKey(), // ISO 3166-1 alpha-2 (e.g., "GB", "DE", "FR")
  name: text("name").notNull(),
  region: text("region").notNull(), // "Europe", "Asia", "Americas", etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * International Education Systems - Country-specific grading and course structures
 */
export const intlSystems = pgTable("intl_systems", {
  id: text("id").primaryKey(), // e.g., "uk_alevel", "ib_diploma", "de_abitur"
  countryId: text("country_id").notNull().references(() => intlCountries.id),
  name: text("name").notNull(), // "UK A-Levels", "IB Diploma", "German Abitur"
  description: text("description"),
  gradingScale: text("grading_scale").notNull(), // "A*-E", "1-7", "1.0-6.0", etc.
  creditSystem: text("credit_system"), // "hours", "units", "modules"
  isActive: boolean("is_active").default(true),
  rulesVersion: text("rules_version").default("1.0"), // Track rule file version
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Grade Scale Mappings - Convert local grades to US 4.0 GPA scale
 */
export const intlGradeScales = pgTable("intl_grade_scales", {
  id: serial("id").primaryKey(),
  systemId: text("system_id").notNull().references(() => intlSystems.id),
  localGrade: text("local_grade").notNull(), // "A*", "7", "1.0", etc.
  usGpaEquivalent: real("us_gpa_equivalent").notNull(), // 4.0 scale
  description: text("description"), // "Exceptional", "Very Good", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Course Equivalencies - Map international courses to NCAA core requirements
 */
export const intlCourseEquivalencies = pgTable("intl_course_equivalencies", {
  id: serial("id").primaryKey(),
  systemId: text("system_id").notNull().references(() => intlSystems.id),
  localCourseName: text("local_course_name").notNull(), // "A-Level Mathematics"
  ncaaCategory: text("ncaa_category").notNull(), // "math", "english", "science", etc.
  usEquivalent: text("us_equivalent").notNull(), // "Algebra II", "Chemistry", etc.
  isLabScience: boolean("is_lab_science").default(false),
  isAlgebraIOrHigher: boolean("is_algebra_i_or_higher").default(false),
  defaultCreditHours: real("default_credit_hours"), // Typical credit award
  matchKeywords: text("match_keywords"), // JSON array for fuzzy matching
  requiresReview: boolean("requires_review").default(false), // Flag for manual review
  confidenceScore: real("confidence_score").default(1.0), // 0.0-1.0 for match quality
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * International Transcripts - Student submission metadata
 */
export const intlTranscripts = pgTable("intl_transcripts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id), // Link to existing users
  countryId: text("country_id").notNull().references(() => intlCountries.id),
  systemId: text("system_id").notNull().references(() => intlSystems.id),
  schoolName: text("school_name"),
  schoolType: text("school_type"), // "public", "private", "international"
  curriculum: text("curriculum"), // "National", "IB", "Cambridge", etc.
  language: text("language").notNull(), // ISO 639-1 code
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // "pending", "processing", "completed", "needs_review"
  processingNotes: text("processing_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * International Student Courses - Individual course records with enhanced metadata
 */
export const intlStudentCourses = pgTable("intl_student_courses", {
  id: serial("id").primaryKey(),
  transcriptId: integer("transcript_id").notNull().references(() => intlTranscripts.id),
  year: integer("year").notNull(), // Academic year (e.g., 2024)
  term: text("term"), // "Fall", "Spring", "Q1", etc.
  subject: text("subject").notNull(), // Original course name
  level: text("level"), // "Standard", "Higher", "AP", etc.
  localGrade: text("local_grade").notNull(),
  normalizedGrade: real("normalized_grade"), // Converted to 4.0 scale
  hoursPerWeek: integer("hours_per_week"),
  weeksPerYear: integer("weeks_per_year"),
  isCompleted: boolean("is_completed").default(true),
  
  // NCAA categorization (populated by evaluator)
  ncaaCategory: text("ncaa_category"), // "english", "math", "science", "social_science", etc.
  usEquivalent: text("us_equivalent"), // Mapped US course name
  isLabScience: boolean("is_lab_science").default(false),
  isAlgebraIOrHigher: boolean("is_algebra_i_or_higher").default(false),
  creditHoursAwarded: real("credit_hours_awarded"), // Carnegie units
  
  // Enhanced evaluation metadata (when INTL_ENHANCED=true)
  confidenceScore: real("confidence_score"), // 0.0-1.0 match confidence
  requiresReview: boolean("requires_review").default(false),
  reviewNotes: text("review_notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * International Evaluations - Final NCAA eligibility assessment
 */
export const intlEvaluations = pgTable("intl_evaluations", {
  id: serial("id").primaryKey(),
  transcriptId: integer("transcript_id").notNull().references(() => intlTranscripts.id),
  userId: text("user_id").notNull().references(() => users.id),
  
  // Core metrics
  coreGpa: real("core_gpa"), // GPA for NCAA core courses only
  overallGpa: real("overall_gpa"), // All courses
  coreUnits: real("core_units"), // Total core Carnegie units
  
  // NCAA credit breakdown
  englishCredits: real("english_credits").default(0),
  mathAlgebraICredits: real("math_algebra_i_credits").default(0),
  scienceCredits: real("science_credits").default(0),
  scienceLabCredits: real("science_lab_credits").default(0),
  socialScienceCredits: real("social_science_credits").default(0),
  additionalAcademicCredits: real("additional_academic_credits").default(0),
  foreignLanguageCredits: real("foreign_language_credits").default(0),
  foreignLanguageCount: integer("foreign_language_count").default(0),
  
  // Eligibility projections (Enhanced mode only)
  divisionIStatus: text("division_i_status"), // "eligible", "at_risk", "ineligible", null
  divisionIConfidence: real("division_i_confidence"), // 0.0-1.0
  divisionIIMStatus: text("division_ii_status"),
  divisionIIConfidence: real("division_ii_confidence"),
  
  // Risk factors and recommendations
  riskFactors: jsonb("risk_factors"), // Array of risk indicators
  missingRequirements: jsonb("missing_requirements"), // Array of missing items
  recommendedActions: jsonb("recommended_actions"), // Array of next steps
  
  // Report generation
  reportUrl: text("report_url"), // PDF stored in Supabase
  reportGeneratedAt: timestamp("report_generated_at"),
  
  evaluatedAt: timestamp("evaluated_at").defaultNow().notNull(),
  evaluatorVersion: text("evaluator_version").default("mvp"), // "mvp" or "enhanced"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Audit Log - Track all evaluation decisions for compliance (Enhanced mode)
 */
export const intlAuditLog = pgTable("intl_audit_log", {
  id: serial("id").primaryKey(),
  evaluationId: integer("evaluation_id").references(() => intlEvaluations.id),
  transcriptId: integer("transcript_id").references(() => intlTranscripts.id),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(), // "course_matched", "grade_normalized", "credit_awarded", etc.
  phase: text("phase").notNull(), // "ingest", "suggest", "evaluate", "report"
  details: jsonb("details").notNull(), // Full context of decision
  confidenceScore: real("confidence_score"),
  requiresReview: boolean("requires_review").default(false),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Translation Jobs - Track document translation requests (Enhanced mode)
 */
export const intlTranslationJobs = pgTable("intl_translation_jobs", {
  id: serial("id").primaryKey(),
  transcriptId: integer("transcript_id").notNull().references(() => intlTranscripts.id),
  userId: text("user_id").notNull().references(() => users.id),
  sourceLanguage: text("source_language").notNull(),
  targetLanguage: text("target_language").default("en"),
  documentType: text("document_type").notNull(), // "transcript", "certificate", "syllabus"
  documentUrl: text("document_url").notNull(), // Original document in Supabase
  translatedUrl: text("translated_url"), // Translated document
  provider: text("provider"), // "human", "google_translate", "deepl", etc.
  status: text("status").notNull().default("pending"), // "pending", "in_progress", "completed", "failed"
  cost: real("cost"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports for TypeScript
export type IntlCountry = typeof intlCountries.$inferSelect;
export type NewIntlCountry = typeof intlCountries.$inferInsert;

export type IntlSystem = typeof intlSystems.$inferSelect;
export type NewIntlSystem = typeof intlSystems.$inferInsert;

export type IntlGradeScale = typeof intlGradeScales.$inferSelect;
export type NewIntlGradeScale = typeof intlGradeScales.$inferInsert;

export type IntlCourseEquivalency = typeof intlCourseEquivalencies.$inferSelect;
export type NewIntlCourseEquivalency = typeof intlCourseEquivalencies.$inferInsert;

export type IntlTranscript = typeof intlTranscripts.$inferSelect;
export type NewIntlTranscript = typeof intlTranscripts.$inferInsert;

export type IntlStudentCourse = typeof intlStudentCourses.$inferSelect;
export type NewIntlStudentCourse = typeof intlStudentCourses.$inferInsert;

export type IntlEvaluation = typeof intlEvaluations.$inferSelect;
export type NewIntlEvaluation = typeof intlEvaluations.$inferInsert;

export type IntlAuditLog = typeof intlAuditLog.$inferSelect;
export type NewIntlAuditLog = typeof intlAuditLog.$inferInsert;

export type IntlTranslationJob = typeof intlTranslationJobs.$inferSelect;
export type NewIntlTranslationJob = typeof intlTranslationJobs.$inferInsert;
