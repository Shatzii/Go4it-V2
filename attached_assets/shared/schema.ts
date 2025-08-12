import { pgTable, text, uuid, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Import Texas curriculum schemas
import { 
  TexasGradeLevelSchema, 
  TexasSubjectSchema
} from './texas-curriculum-schema'

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role').notNull().$type<'student' | 'teacher' | 'parent' | 'admin'>(),
  schoolId: text('school_id'),
  profile: jsonb('profile'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Schools table
export const schools = pgTable('schools', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type').notNull().$type<'primary' | 'secondary' | 'law' | 'language' | 'sports'>(),
  description: text('description'),
  settings: jsonb('settings'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Courses table
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  schoolId: text('school_id').notNull(),
  teacherId: text('teacher_id').notNull(),
  grade: text('grade'),
  subject: text('subject').notNull(),
  curriculum: jsonb('curriculum'),
  settings: jsonb('settings'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Assignments table
export const assignments = pgTable('assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  courseId: text('course_id').notNull(),
  dueDate: timestamp('due_date'),
  instructions: jsonb('instructions'),
  resources: jsonb('resources'),
  maxPoints: integer('max_points').default(100),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Submissions table
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assignmentId: text('assignment_id').notNull(),
  studentId: text('student_id').notNull(),
  content: jsonb('content'),
  files: jsonb('files'),
  grade: integer('grade'),
  feedback: text('feedback'),
  submittedAt: timestamp('submitted_at'),
  gradedAt: timestamp('graded_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Progress table
export const progress = pgTable('progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  courseId: text('course_id').notNull(),
  lessonId: text('lesson_id'),
  skillId: text('skill_id'),
  completionRate: integer('completion_rate').default(0),
  masteryLevel: integer('mastery_level').default(0),
  timeSpent: integer('time_spent').default(0),
  lastAccessed: timestamp('last_accessed'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// AI Sessions table
export const aiSessions = pgTable('ai_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  teacherId: text('teacher_id').notNull(),
  messages: jsonb('messages'),
  context: jsonb('context'),
  duration: integer('duration').default(0),
  satisfaction: integer('satisfaction'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Payments table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: text('student_id').notNull(),
  schoolId: text('school_id').notNull(),
  amount: integer('amount').notNull(), // Amount in cents
  currency: text('currency').notNull().default('usd'),
  status: text('status').notNull().$type<'pending' | 'completed' | 'failed' | 'refunded'>(),
  paymentType: text('payment_type').notNull().$type<'tuition' | 'enrollment' | 'activity' | 'materials' | 'other'>(),
  description: text('description'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  failedAt: timestamp('failed_at'),
})

// Customers table for Stripe
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  studentId: text('student_id').notNull(),
  schoolId: text('school_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: text('student_id').notNull(),
  schoolId: text('school_id').notNull(),
  customerId: text('customer_id').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  priceId: text('price_id').notNull(),
  status: text('status').notNull().$type<'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'>(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  canceledAt: timestamp('canceled_at'),
})

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertAiSessionSchema = createInsertSchema(aiSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// Select schemas
export const selectUserSchema = createSelectSchema(users)
export const selectSchoolSchema = createSelectSchema(schools)
export const selectCourseSchema = createSelectSchema(courses)
export const selectAssignmentSchema = createSelectSchema(assignments)
export const selectSubmissionSchema = createSelectSchema(submissions)
export const selectProgressSchema = createSelectSchema(progress)
export const selectAiSessionSchema = createSelectSchema(aiSessions)
export const selectPaymentSchema = createSelectSchema(payments)
export const selectCustomerSchema = createSelectSchema(customers)
export const selectSubscriptionSchema = createSelectSchema(subscriptions)

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type School = typeof schools.$inferSelect
export type NewSchool = typeof schools.$inferInsert
export type Course = typeof courses.$inferSelect
export type NewCourse = typeof courses.$inferInsert
export type Assignment = typeof assignments.$inferSelect
export type NewAssignment = typeof assignments.$inferInsert
export type Submission = typeof submissions.$inferSelect
export type NewSubmission = typeof submissions.$inferInsert
export type Progress = typeof progress.$inferSelect
export type NewProgress = typeof progress.$inferInsert
export type AiSession = typeof aiSessions.$inferSelect
export type NewAiSession = typeof aiSessions.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert

// Student onboarding table
export const studentOnboarding = pgTable('student_onboarding', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: text('student_id').notNull(),
  gradeLevel: text('grade_level').notNull(),
  schoolType: text('school_type').notNull().$type<'primary' | 'secondary' | 'law' | 'language' | 'sports'>(),
  learningStyle: text('learning_style').notNull().$type<'visual' | 'auditory' | 'kinesthetic' | 'reading_writing' | 'multimodal'>(),
  accommodations: jsonb('accommodations').$type<string[]>(),
  academicStrengths: jsonb('academic_strengths').$type<string[]>(),
  academicChallenges: jsonb('academic_challenges').$type<string[]>(),
  extracurricularInterests: jsonb('extracurricular_interests').$type<string[]>(),
  parentEmail: text('parent_email').notNull(),
  emergencyContact: text('emergency_contact').notNull(),
  medicalConsiderations: text('medical_considerations'),
  transportationNeeds: text('transportation_needs'),
  technologyAccess: jsonb('technology_access').$type<{
    hasDevice: boolean;
    hasInternet: boolean;
    deviceType?: string;
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Class schedules table
export const classSchedules = pgTable('class_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: text('student_id').notNull(),
  gradeLevel: text('grade_level').notNull(),
  schoolYear: text('school_year').notNull(),
  semester: text('semester').notNull().$type<'fall' | 'spring' | 'summer'>(),
  weeklySchedule: jsonb('weekly_schedule').$type<any[]>(),
  totalInstructionalMinutes: integer('total_instructional_minutes').notNull(),
  meetsTexasRequirements: boolean('meets_texas_requirements').default(true),
  complianceNotes: text('compliance_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Texas curriculum standards table
export const texasCurriculumStandards = pgTable('texas_curriculum_standards', {
  id: uuid('id').primaryKey().defaultRandom(),
  gradeLevel: text('grade_level').notNull(),
  subject: text('subject').notNull(),
  standardCode: text('standard_code').notNull(),
  standardText: text('standard_text').notNull(),
  knowledgeSkills: jsonb('knowledge_skills').$type<string[]>(),
  assessmentType: text('assessment_type').notNull().$type<'readiness' | 'supporting'>(),
  crossCurricularConnections: jsonb('cross_curricular_connections').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Onboarding insert schemas
export const insertStudentOnboardingSchema = createInsertSchema(studentOnboarding).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertClassScheduleSchema = createInsertSchema(classSchedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const insertTexasCurriculumStandardSchema = createInsertSchema(texasCurriculumStandards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// Onboarding select schemas
export const selectStudentOnboardingSchema = createSelectSchema(studentOnboarding)
export const selectClassScheduleSchema = createSelectSchema(classSchedules)
export const selectTexasCurriculumStandardSchema = createSelectSchema(texasCurriculumStandards)

// Onboarding types
export type StudentOnboarding = typeof studentOnboarding.$inferSelect
export type NewStudentOnboarding = typeof studentOnboarding.$inferInsert
export type ClassSchedule = typeof classSchedules.$inferSelect
export type NewClassSchedule = typeof classSchedules.$inferInsert
export type TexasCurriculumStandard = typeof texasCurriculumStandards.$inferSelect
export type NewTexasCurriculumStandard = typeof texasCurriculumStandards.$inferInsert