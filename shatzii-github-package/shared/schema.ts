import { pgTable, text, serial, integer, boolean, timestamp, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  company: text("company"),
  role: text("role"),
  phone: text("phone"),
  title: text("title"),
  industry: text("industry"),
  companySize: text("company_size"),
  monthlyRevenue: text("monthly_revenue"),
  primaryGoals: text("primary_goals"), // JSON string
  currentChallenges: text("current_challenges"),
  deploymentType: text("deployment_type"),
  integrationNeeds: text("integration_needs"), // JSON string
  setupId: text("setup_id"),
  setupStatus: text("setup_status").default("pending"),
  aiRecommendations: text("ai_recommendations"), // JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  features: text("features").array().notNull(),
  popular: boolean("popular").default(false),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"), // 'ai', 'cms', 'deployment', 'general'
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => plans.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const demoRequests = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  message: text("message"),
  productInterest: text("product_interest").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'sales', 'support', 'general'
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  avatar: text("avatar"),
  featured: boolean("featured").default(false),
});

export const userMetrics = pgTable("user_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: text("date").notNull(), // YYYY-MM-DD format
  tasksCompleted: integer("tasks_completed").default(0),
  timeSpent: integer("time_spent").default(0), // in minutes
  leadsGenerated: integer("leads_generated").default(0),
  dealsCreated: integer("deals_created").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0.00"),
  efficiency: decimal("efficiency", { precision: 5, scale: 2 }).default("0.00"), // percentage
  createdAt: timestamp("created_at").defaultNow(),
});

export const userGoals = pgTable("user_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'daily', 'weekly', 'monthly'
  category: text("category").notNull(), // 'tasks', 'revenue', 'leads', 'efficiency'
  target: decimal("target", { precision: 10, scale: 2 }).notNull(),
  current: decimal("current", { precision: 10, scale: 2 }).default("0.00"),
  period: text("period").notNull(), // '2024-01-01' for daily, '2024-W01' for weekly, '2024-01' for monthly
  achieved: boolean("achieved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'login', 'task_completed', 'goal_achieved', 'milestone_reached'
  description: text("description").notNull(),
  metadata: text("metadata"), // JSON string for additional data
  timestamp: timestamp("timestamp").defaultNow(),
});

// Education tables
export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  district: text("district"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  phone: text("phone"),
  email: text("email").unique().notNull(),
  website: text("website"),
  principalName: text("principal_name"),
  studentCount: integer("student_count"),
  gradeLevel: text("grade_level"), // 'elementary', 'middle', 'high', 'k-12'
  subscriptionTier: text("subscription_tier").default("basic"), // 'basic', 'premium', 'enterprise'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique(),
  gradeLevel: integer("grade_level").notNull(), // K=0, 1st=1, 2nd=2, etc.
  studentId: text("student_id"), // School's internal student ID
  dateOfBirth: timestamp("date_of_birth"),
  parentEmail: text("parent_email"),
  learningProfile: text("learning_profile"), // JSON string with preferences
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiTeachers = pgTable("ai_teachers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(), // 'math', 'science', 'english', 'history', 'art', 'special_education'
  personality: text("personality").notNull(), // 'friendly', 'encouraging', 'challenging', 'patient'
  expertise: text("expertise").notNull(), // JSON array of specializations
  gradeRange: text("grade_range").notNull(), // 'K-5', '6-8', '9-12', 'K-12'
  systemPrompt: text("system_prompt").notNull(),
  modelName: text("model_name").notNull().default("llama3.1:8b"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lessonPlans = pgTable("lesson_plans", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => aiTeachers.id),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  gradeLevel: integer("grade_level").notNull(),
  objectives: text("objectives").notNull(), // JSON array
  content: text("content").notNull(), // Lesson content
  activities: text("activities"), // JSON array of activities
  assessments: text("assessments"), // JSON array of assessment methods
  duration: integer("duration").notNull(), // minutes
  difficulty: text("difficulty").default("medium"), // 'easy', 'medium', 'hard'
  standards: text("standards"), // JSON array of educational standards
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tutoringSessions = pgTable("tutoring_sessions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  teacherId: integer("teacher_id").notNull().references(() => aiTeachers.id),
  subject: text("subject").notNull(),
  topic: text("topic").notNull(),
  conversation: text("conversation").notNull(), // JSON array of messages
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // minutes
  studentRating: integer("student_rating"), // 1-5 stars
  teacherNotes: text("teacher_notes"),
  learningGoals: text("learning_goals"), // JSON array
  achievements: text("achievements"), // JSON array of completed goals
  nextSteps: text("next_steps"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertDemoRequestSchema = createInsertSchema(demoRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export const insertUserMetricsSchema = createInsertSchema(userMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertUserGoalsSchema = createInsertSchema(userGoals).omit({
  id: true,
  createdAt: true,
});

export const insertUserActivitiesSchema = createInsertSchema(userActivities).omit({
  id: true,
  timestamp: true,
});

// Education insert schemas
export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAITeacherSchema = createInsertSchema(aiTeachers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonPlanSchema = createInsertSchema(lessonPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTutoringSessionSchema = createInsertSchema(tutoringSessions).omit({
  id: true,
  startTime: true,
  createdAt: true,
});

// School registration schema
export const schoolRegistrationSchema = insertSchoolSchema.extend({
  adminFirstName: z.string().min(1, "First name is required"),
  adminLastName: z.string().min(1, "Last name is required"),
  adminEmail: z.string().email("Valid email address is required"),
  adminPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
}).refine(data => data.adminPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type DemoRequest = typeof demoRequests.$inferSelect;
export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type UserMetrics = typeof userMetrics.$inferSelect;
export type InsertUserMetrics = z.infer<typeof insertUserMetricsSchema>;
export type UserGoals = typeof userGoals.$inferSelect;
export type InsertUserGoals = z.infer<typeof insertUserGoalsSchema>;
export type UserActivities = typeof userActivities.$inferSelect;
export type InsertUserActivities = z.infer<typeof insertUserActivitiesSchema>;

// Education types
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type School = typeof schools.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type AITeacher = typeof aiTeachers.$inferSelect;
export type InsertAITeacher = z.infer<typeof insertAITeacherSchema>;
export type LessonPlan = typeof lessonPlans.$inferSelect;
export type InsertLessonPlan = z.infer<typeof insertLessonPlanSchema>;
export type TutoringSession = typeof tutoringSessions.$inferSelect;
export type InsertTutoringSession = z.infer<typeof insertTutoringSessionSchema>;

// Form types
export type SchoolRegistrationData = z.infer<typeof schoolRegistrationSchema>;
