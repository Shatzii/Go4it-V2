import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  decimal,
  uuid,
  index,
  uniqueIndex,
  serial
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enhanced Academy Schema for Full Educational System

// 1. Complete Curriculum Management System
export const curriculumStandards = pgTable("curriculum_standards", {
  id: uuid("id").primaryKey().defaultRandom(),
  stateCode: varchar("state_code", { length: 2 }).notNull(),
  gradeLevel: varchar("grade_level", { length: 10 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  standard: text("standard").notNull(),
  description: text("description"),
  alignmentCode: varchar("alignment_code", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const curriculumMapping = pgTable("curriculum_mapping", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id),
  standardId: uuid("standard_id").references(() => curriculumStandards.id),
  alignment: varchar("alignment", { length: 20 }).default("aligned"), // aligned, partially, not_aligned
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

export const pacingGuides = pgTable("pacing_guides", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id),
  week: integer("week").notNull(),
  topics: jsonb("topics").notNull(),
  objectives: jsonb("objectives").notNull(),
  assessments: jsonb("assessments"),
  resources: jsonb("resources"),
  createdAt: timestamp("created_at").defaultNow()
});

// 2. Advanced Grading & Assessment Platform
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  code: varchar("code", { length: 20 }).unique(),
  credits: decimal("credits", { precision: 3, scale: 1 }).default("1.0"),
  gradeLevel: varchar("grade_level", { length: 10 }),
  department: varchar("department", { length: 100 }),
  prerequisites: jsonb("prerequisites"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const gradeCategories = pgTable("grade_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id),
  name: varchar("name", { length: 100 }).notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(), // percentage
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id),
  categoryId: uuid("category_id").references(() => gradeCategories.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  instructions: text("instructions"),
  pointsTotal: decimal("points_total", { precision: 6, scale: 2 }).notNull(),
  dueDate: timestamp("due_date"),
  availableFrom: timestamp("available_from"),
  availableUntil: timestamp("available_until"),
  submissionType: varchar("submission_type", { length: 50 }).default("online"), // online, paper, presentation
  allowLateSubmission: boolean("allow_late_submission").default(false),
  lateDeduction: decimal("late_deduction", { precision: 5, scale: 2 }).default("0"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id").references(() => assignments.id),
  studentId: uuid("student_id").references(() => users.id),
  content: text("content"),
  attachments: jsonb("attachments"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  isLate: boolean("is_late").default(false),
  status: varchar("status", { length: 20 }).default("submitted"), // submitted, graded, returned
  createdAt: timestamp("created_at").defaultNow()
});

export const grades = pgTable("grades", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").references(() => submissions.id),
  studentId: uuid("student_id").references(() => users.id),
  assignmentId: uuid("assignment_id").references(() => assignments.id),
  pointsEarned: decimal("points_earned", { precision: 6, scale: 2 }),
  letterGrade: varchar("letter_grade", { length: 5 }),
  feedback: text("feedback"),
  rubricScores: jsonb("rubric_scores"),
  gradedBy: uuid("graded_by").references(() => users.id),
  gradedAt: timestamp("graded_at"),
  isExcused: boolean("is_excused").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// 3. Learning Management System (LMS)
export const courseContent = pgTable("course_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id),
  title: varchar("title", { length: 200 }).notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // lesson, video, document, quiz
  content: text("content"),
  mediaUrl: varchar("media_url", { length: 500 }),
  duration: integer("duration"), // in minutes
  order: integer("order").default(0),
  isPublished: boolean("is_published").default(false),
  prerequisites: jsonb("prerequisites"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const discussions = pgTable("discussions", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  isModerated: boolean("is_moderated").default(false),
  allowStudentPosts: boolean("allow_student_posts").default(true),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});

export const discussionPosts = pgTable("discussion_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  discussionId: uuid("discussion_id").references(() => discussions.id),
  parentId: uuid("parent_id").references(() => discussionPosts.id),
  userId: uuid("user_id").references(() => users.id),
  content: text("content").notNull(),
  attachments: jsonb("attachments"),
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// 4. Student Information System (SIS)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 100 }).unique(),
  password: varchar("password", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: varchar("role", { length: 50 }).default("student"),
  dateOfBirth: timestamp("date_of_birth"),
  phoneNumber: varchar("phone_number", { length: 20 }),
  address: jsonb("address"),
  emergencyContact: jsonb("emergency_contact"),
  medicalInfo: jsonb("medical_info"),
  academicLevel: varchar("academic_level", { length: 20 }),
  graduationYear: integer("graduation_year"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  semester: varchar("semester", { length: 20 }),
  year: integer("year"),
  status: varchar("status", { length: 20 }).default("active"), // active, completed, dropped, withdrawn
  finalGrade: varchar("final_grade", { length: 5 }),
  finalPoints: decimal("final_points", { precision: 6, scale: 2 }),
  creditsEarned: decimal("credits_earned", { precision: 3, scale: 1 }),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at")
});

export const transcripts = pgTable("transcripts", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  courseName: varchar("course_name", { length: 200 }).notNull(),
  courseCode: varchar("course_code", { length: 20 }),
  credits: decimal("credits", { precision: 3, scale: 1 }),
  grade: varchar("grade", { length: 5 }),
  gradePoints: decimal("grade_points", { precision: 4, scale: 2 }),
  semester: varchar("semester", { length: 20 }),
  year: integer("year"),
  isTransferCredit: boolean("is_transfer_credit").default(false),
  transferFrom: varchar("transfer_from", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow()
});

// 5. Advanced Reporting & Analytics
export const studentProgress = pgTable("student_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  completedLessons: integer("completed_lessons").default(0),
  totalLessons: integer("total_lessons").default(0),
  currentGrade: decimal("current_grade", { precision: 5, scale: 2 }),
  timeSpent: integer("time_spent").default(0), // in minutes
  lastAccessed: timestamp("last_accessed"),
  streakDays: integer("streak_days").default(0),
  achievements: jsonb("achievements"),
  predictedOutcome: varchar("predicted_outcome", { length: 50 }),
  riskLevel: varchar("risk_level", { length: 20 }).default("low"), // low, medium, high
  updatedAt: timestamp("updated_at").defaultNow()
});

export const ncaaEligibility = pgTable("ncaa_eligibility", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id),
  coreGpa: decimal("core_gpa", { precision: 3, scale: 2 }),
  overallGpa: decimal("overall_gpa", { precision: 3, scale: 2 }),
  coreCourseCount: integer("core_course_count").default(0),
  requiredCoreCount: integer("required_core_count").default(16),
  satScore: integer("sat_score"),
  actScore: integer("act_score"),
  isEligible: boolean("is_eligible").default(false),
  deficiencies: jsonb("deficiencies"),
  recommendations: jsonb("recommendations"),
  lastUpdated: timestamp("last_updated").defaultNow()
});

// 6. Communication & Collaboration
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").references(() => users.id),
  recipientId: uuid("recipient_id").references(() => users.id),
  subject: varchar("subject", { length: 200 }),
  content: text("content").notNull(),
  messageType: varchar("message_type", { length: 50 }).default("direct"), // direct, announcement, alert
  isRead: boolean("is_read").default(false),
  attachments: jsonb("attachments"),
  priority: varchar("priority", { length: 10 }).default("normal"), // low, normal, high, urgent
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at")
});

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id").references(() => users.id),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  targetAudience: jsonb("target_audience"), // roles, courses, specific users
  isPublished: boolean("is_published").default(false),
  publishAt: timestamp("publish_at"),
  expiresAt: timestamp("expires_at"),
  priority: varchar("priority", { length: 10 }).default("normal"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// 7. Sports Science Laboratory
export const performanceMetrics = pgTable("performance_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id),
  sport: varchar("sport", { length: 100 }).notNull(),
  metricType: varchar("metric_type", { length: 100 }).notNull(), // speed, strength, endurance, etc.
  value: decimal("value", { precision: 10, scale: 3 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  testDate: timestamp("test_date").defaultNow(),
  notes: text("notes"),
  baseline: decimal("baseline", { precision: 10, scale: 3 }),
  improvement: decimal("improvement", { precision: 10, scale: 3 }),
  createdAt: timestamp("created_at").defaultNow()
});

export const nutritionPlans = pgTable("nutrition_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id),
  planName: varchar("plan_name", { length: 200 }).notNull(),
  goals: jsonb("goals"),
  dailyCalories: integer("daily_calories"),
  macros: jsonb("macros"), // protein, carbs, fat percentages
  mealPlan: jsonb("meal_plan"),
  supplements: jsonb("supplements"),
  restrictions: jsonb("restrictions"),
  createdBy: uuid("created_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// 8. Career & College Preparation
export const collegeProspects = pgTable("college_prospects", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id),
  collegeName: varchar("college_name", { length: 200 }).notNull(),
  division: varchar("division", { length: 10 }),
  sport: varchar("sport", { length: 100 }),
  contactInfo: jsonb("contact_info"),
  interestLevel: varchar("interest_level", { length: 20 }), // high, medium, low
  status: varchar("status", { length: 50 }).default("prospect"), // prospect, contacted, visited, offered, committed
  scholarshipAmount: decimal("scholarship_amount", { precision: 10, scale: 2 }),
  academicFit: integer("academic_fit"), // 1-10 scale
  athleticFit: integer("athletic_fit"), // 1-10 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const scholarships = pgTable("scholarships", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  provider: varchar("provider", { length: 200 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  eligibilityRequirements: jsonb("eligibility_requirements"),
  applicationDeadline: timestamp("application_deadline"),
  sport: varchar("sport", { length: 100 }),
  academicRequirements: jsonb("academic_requirements"),
  description: text("description"),
  applicationUrl: varchar("application_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// 9. Schedule & Calendar Management
export const schedules = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: varchar("start_time", { length: 8 }).notNull(), // HH:MM:SS
  endTime: varchar("end_time", { length: 8 }).notNull(),
  room: varchar("room", { length: 50 }),
  instructor: uuid("instructor").references(() => users.id),
  semester: varchar("semester", { length: 20 }),
  year: integer("year"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(), // academic, sports, social, administrative
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: varchar("location", { length: 200 }),
  organizer: uuid("organizer").references(() => users.id),
  targetAudience: jsonb("target_audience"),
  isPublic: boolean("is_public").default(true),
  maxAttendees: integer("max_attendees"),
  registrationRequired: boolean("registration_required").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// 10. Resource Management System
export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  resourceType: varchar("resource_type", { length: 50 }).notNull(), // book, equipment, facility, digital
  location: varchar("location", { length: 200 }),
  isAvailable: boolean("is_available").default(true),
  quantity: integer("quantity").default(1),
  condition: varchar("condition", { length: 50 }).default("good"),
  purchaseDate: timestamp("purchase_date"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const resourceCheckouts = pgTable("resource_checkouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  resourceId: uuid("resource_id").references(() => resources.id),
  userId: uuid("user_id").references(() => users.id),
  checkedOutAt: timestamp("checked_out_at").defaultNow(),
  dueDate: timestamp("due_date"),
  returnedAt: timestamp("returned_at"),
  condition: varchar("condition", { length: 50 }),
  notes: text("notes"),
  lateFee: decimal("late_fee", { precision: 10, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).default("active") // active, returned, overdue, lost
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;
export type Grade = typeof grades.$inferSelect;
export type InsertGrade = typeof grades.$inferInsert;
export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = typeof studentProgress.$inferInsert;
export type NCAAEligibility = typeof ncaaEligibility.$inferSelect;
export type InsertNCAAEligibility = typeof ncaaEligibility.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = typeof performanceMetrics.$inferInsert;
export type CollegeProspect = typeof collegeProspects.$inferSelect;
export type InsertCollegeProspect = typeof collegeProspects.$inferInsert;
export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = typeof schedules.$inferInsert;
export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertCourseSchema = createInsertSchema(courses);
export const insertAssignmentSchema = createInsertSchema(assignments);
export const insertGradeSchema = createInsertSchema(grades);
export const insertStudentProgressSchema = createInsertSchema(studentProgress);
export const insertNCAAEligibilitySchema = createInsertSchema(ncaaEligibility);
export const insertMessageSchema = createInsertSchema(messages);
export const insertAnnouncementSchema = createInsertSchema(announcements);
export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics);
export const insertCollegeProspectSchema = createInsertSchema(collegeProspects);
export const insertScheduleSchema = createInsertSchema(schedules);
export const insertEventSchema = createInsertSchema(events);
export const insertResourceSchema = createInsertSchema(resources);