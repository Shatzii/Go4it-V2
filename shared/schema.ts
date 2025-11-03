import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  real,
  serial,
  decimal,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Session storage table for Replit Auth
export const sessions = pgTable(
  'sessions',
  {
    sid: varchar('sid').primaryKey(),
    sess: jsonb('sess').notNull(),
    expire: timestamp('expire').notNull(),
  },
  (table) => [index('IDX_session_expire').on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable('users', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar('email').unique(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  profileImageUrl: varchar('profile_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),

  // Additional Go4It specific fields
  sport: varchar('sport'),
  position: varchar('position'),
  grade: varchar('grade'),
  garScore: real('gar_score').default(0),
  isVerified: boolean('is_verified').default(false),
  subscriptionTier: varchar('subscription_tier').default('free'),
  profileSetupComplete: boolean('profile_setup_complete').default(false),
  isAdmin: boolean('is_admin').default(false),

  // Stripe integration fields
  stripeCustomerId: varchar('stripe_customer_id'),
  stripeSubscriptionId: varchar('stripe_subscription_id'),
  stripeSubscriptionStatus: varchar('stripe_subscription_status'),
});

// User insert/upsert schemas
export const insertUserSchema = createInsertSchema(users);
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
}).partial();

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UpsertUser = z.infer<typeof upsertUserSchema>;

// Activity Log & Audit Trail (Upgrade #10)
export const activityLog = pgTable('activity_log', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  action: varchar('action').notNull(), // e.g., 'task.created', 'task.status.updated'
  entityType: varchar('entity_type').notNull(), // 'task', 'project', 'goal'
  entityId: varchar('entity_id').notNull(),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  metadata: jsonb('metadata'), // Additional context
  ipAddress: varchar('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Task Dependencies (Upgrade #8)
export const taskDependencies = pgTable('task_dependencies', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  taskId: varchar('task_id').notNull(),
  dependsOnTaskId: varchar('depends_on_task_id').notNull(),
  dependencyType: varchar('dependency_type').default('finish_to_start'), // 'finish_to_start', 'start_to_start', etc.
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('IDX_task_dependencies_task').on(table.taskId),
  index('IDX_task_dependencies_depends_on').on(table.dependsOnTaskId),
]);

// Time Tracking (Upgrade #11)
export const timeEntries = pgTable('time_entries', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  taskId: varchar('task_id'),
  projectId: varchar('project_id'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  duration: integer('duration'), // in minutes
  description: text('description'),
  isBillable: boolean('is_billable').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('IDX_time_entries_user').on(table.userId),
  index('IDX_time_entries_task').on(table.taskId),
  index('IDX_time_entries_project').on(table.projectId),
]);

// Custom Views & Filters (Upgrade #15)
export const savedViews = pgTable('saved_views', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  name: varchar('name').notNull(),
  description: text('description'),
  viewType: varchar('view_type').notNull(), // 'tasks', 'projects', 'dashboard'
  filters: jsonb('filters').notNull(), // Filter criteria
  sortBy: varchar('sort_by'),
  sortOrder: varchar('sort_order').default('desc'),
  isDefault: boolean('is_default').default(false),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Workflow Templates (Upgrade #13)
export const workflowTemplates = pgTable('workflow_templates', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  description: text('description'),
  triggerType: varchar('trigger_type').notNull(), // 'project.created', 'task.completed', etc.
  triggerConditions: jsonb('trigger_conditions'), // Conditions that must be met
  actions: jsonb('actions').notNull(), // Array of actions to perform
  isActive: boolean('is_active').default(true),
  createdBy: varchar('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Notifications (Upgrade #4)
export const notifications = pgTable('notifications', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  type: varchar('type').notNull(), // 'email', 'sms', 'in_app', 'slack'
  title: varchar('title').notNull(),
  message: text('message').notNull(),
  priority: varchar('priority').default('normal'), // 'low', 'normal', 'high', 'urgent'
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  actionUrl: varchar('action_url'), // URL to redirect to when clicked
  metadata: jsonb('metadata'), // Additional data for the notification
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('IDX_notifications_user').on(table.userId),
  index('IDX_notifications_unread').on(table.userId, table.isRead),
]);

// Teams table
export const teams = pgTable('teams', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  sport: varchar('sport').notNull(),
  division: varchar('division'),
  season: varchar('season'),
  year: integer('year'),
  homeVenue: varchar('home_venue'),
  maxRosterSize: integer('max_roster_size').default(25),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

// GAR Analysis table
export const garAnalyses = pgTable('gar_analyses', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  sport: varchar('sport').notNull(),
  videoUrl: varchar('video_url'),
  garScore: real('gar_score').notNull(),
  analysisData: jsonb('analysis_data'),
  strengths: text('strengths').array(),
  improvements: text('improvements').array(),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export type GarAnalysis = typeof garAnalyses.$inferSelect;
export type InsertGarAnalysis = typeof garAnalyses.$inferInsert;

// Academy Courses table
export const academyCourses = pgTable('academy_courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  code: text('code'),
  credits: real('credits').default(1.0),
  gradeLevel: text('grade_level'), // 7-12
  department: text('department'),
  instructor: text('instructor'),
  difficulty: text('difficulty').default('Beginner'),
  subjects: jsonb('subjects'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type AcademyCourse = typeof academyCourses.$inferSelect;
export type InsertAcademyCourse = typeof academyCourses.$inferInsert;

// Prospect Database for Automated Recruitment
export const prospects = pgTable('prospects', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  email: varchar('email'),
  sport: varchar('sport').notNull(),
  position: varchar('position'),
  classYear: varchar('class_year'),
  state: varchar('state'),
  city: varchar('city'),
  school: varchar('school'),
  height: varchar('height'),
  weight: varchar('weight'),

  // Social Media
  instagramHandle: varchar('instagram_handle'),
  twitterHandle: varchar('twitter_handle'),
  tiktokHandle: varchar('tiktok_handle'),
  youtubeChannel: varchar('youtube_channel'),
  followers: integer('followers').default(0),

  // Rankings & Stats
  nationalRanking: integer('national_ranking'),
  stateRanking: integer('state_ranking'),
  positionRanking: integer('position_ranking'),
  stats: jsonb('stats'),

  // Recruiting Status
  recruitingStatus: varchar('recruiting_status'), // 'open', 'committed', 'decommitted'
  commitment: varchar('commitment'), // School committed to
  offers: text('offers').array(), // List of offers

  // Data Source & Quality
  source: varchar('source').notNull(), // 'MaxPreps', 'ESPN', 'Social Media'
  sourceUrl: varchar('source_url'),
  confidence: real('confidence').default(0.5), // Data quality score
  lastScraped: timestamp('last_scraped').defaultNow(),

  // Outreach Tracking
  contactAttempts: integer('contact_attempts').default(0),
  lastContactDate: timestamp('last_contact_date'),
  responseReceived: boolean('response_received').default(false),
  registeredUser: boolean('registered_user').default(false),
  convertedToPaid: boolean('converted_to_paid').default(false),

  // Campaign Tracking
  campaignId: varchar('campaign_id'),
  emailStatus: varchar('email_status'), // 'pending', 'sent', 'opened', 'clicked', 'bounced'
  unsubscribed: boolean('unsubscribed').default(false),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Prospect = typeof prospects.$inferSelect;
export type InsertProspect = typeof prospects.$inferInsert;

// Automated Campaigns
export const campaigns = pgTable('campaigns', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  type: varchar('type').notNull(), // 'email', 'social_media', 'sms'
  status: varchar('status').default('draft'), // 'draft', 'active', 'paused', 'completed'

  // Targeting
  sport: varchar('sport'),
  ageRange: varchar('age_range'),
  states: text('states').array(),
  minFollowers: integer('min_followers'),
  maxFollowers: integer('max_followers'),

  // Campaign Content
  subject: varchar('subject'),
  emailTemplate: text('email_template'),
  socialMediaTemplate: text('social_media_template'),

  // Automation Settings
  sendDelay: integer('send_delay').default(0), // Minutes between sends
  followUpDelay: integer('follow_up_delay').default(1440), // Minutes before follow-up
  maxFollowUps: integer('max_follow_ups').default(3),

  // Analytics
  totalSent: integer('total_sent').default(0),
  totalOpened: integer('total_opened').default(0),
  totalClicked: integer('total_clicked').default(0),
  totalReplies: integer('total_replies').default(0),
  totalRegistrations: integer('total_registrations').default(0),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

// Scraping Jobs for Automation
export const scrapingJobs = pgTable('scraping_jobs', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  type: varchar('type').notNull(), // 'athlete_discovery', 'social_media', 'parent_discovery'
  status: varchar('status').default('scheduled'), // 'scheduled', 'running', 'completed', 'failed'

  // Job Configuration
  platforms: text('platforms').array(), // ['MaxPreps', 'ESPN', 'Instagram']
  sports: text('sports').array(),
  locations: text('locations').array(),
  keywords: text('keywords').array(),

  // Scheduling
  frequency: varchar('frequency'), // 'daily', 'weekly', 'monthly'
  nextRun: timestamp('next_run'),
  lastRun: timestamp('last_run'),

  // Results
  recordsFound: integer('records_found').default(0),
  recordsProcessed: integer('records_processed').default(0),
  errors: text('errors').array(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type ScrapingJob = typeof scrapingJobs.$inferSelect;
export type InsertScrapingJob = typeof scrapingJobs.$inferInsert;

// Academy Lessons table
export const academyLessons = pgTable('academy_lessons', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => academyCourses.id),
  title: varchar('title').notNull(),
  description: text('description'),
  content: text('content'), // Lesson content/markdown
  videoUrl: varchar('video_url'), // Khan Academy or other video URL
  order: integer('order').default(0),
  duration: integer('duration').default(30), // minutes
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type AcademyLesson = typeof academyLessons.$inferSelect;
export type InsertAcademyLesson = typeof academyLessons.$inferInsert;

// Academy Enrollments table
export const academyEnrollments = pgTable('academy_enrollments', {
  id: serial('id').primaryKey(),
  studentId: varchar('student_id').references(() => users.id),
  courseId: integer('course_id').references(() => academyCourses.id),
  enrolledAt: timestamp('enrolled_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  progress: real('progress').default(0), // 0-100%
  currentGrade: varchar('current_grade'), // A, B, C, D, F
  status: varchar('status').default('active'), // active, completed, withdrawn
  isActive: boolean('is_active').default(true),
});

// Alias for backward compatibility
export const studentEnrollments = academyEnrollments;

export type AcademyEnrollment = typeof academyEnrollments.$inferSelect;
export type InsertAcademyEnrollment = typeof academyEnrollments.$inferInsert;

// Academy Assignments table
export const academyAssignments = pgTable('academy_assignments', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => academyCourses.id),
  lessonId: integer('lesson_id').references(() => academyLessons.id),
  title: varchar('title').notNull(),
  description: text('description'),
  type: varchar('type').notNull(), // homework, quiz, project, discussion
  dueDate: timestamp('due_date'),
  maxPoints: integer('max_points').default(100),
  instructions: text('instructions'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export type AcademyAssignment = typeof academyAssignments.$inferSelect;
export type InsertAcademyAssignment = typeof academyAssignments.$inferInsert;

// Student Assignment Submissions table
export const academySubmissions = pgTable('academy_submissions', {
  id: serial('id').primaryKey(),
  assignmentId: integer('assignment_id').references(() => academyAssignments.id),
  studentId: varchar('student_id').references(() => users.id),
  content: text('content'),
  fileUrl: varchar('file_url'),
  submittedAt: timestamp('submitted_at').defaultNow(),
  gradedAt: timestamp('graded_at'),
  score: integer('score'),
  feedback: text('feedback'),
  status: varchar('status').default('submitted'), // submitted, graded, returned
});

export type AcademySubmission = typeof academySubmissions.$inferSelect;
export type InsertAcademySubmission = typeof academySubmissions.$inferInsert;

// Wellness Tracking table
export const wellnessTracking = pgTable('wellness_tracking', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  date: timestamp('date').defaultNow(),
  sleep: real('sleep'), // hours
  hydration: real('hydration'), // percentage
  stress: real('stress'), // 1-10 scale
  energy: real('energy'), // 1-10 scale
  mood: real('mood'), // 1-10 scale
  recovery: real('recovery'), // percentage
  weight: real('weight'), // pounds
  heartRate: real('heart_rate'), // bpm
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type WellnessTracking = typeof wellnessTracking.$inferSelect;
export type InsertWellnessTracking = typeof wellnessTracking.$inferInsert;

// Nutrition Plans table
export const nutritionPlans = pgTable('nutrition_plans', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  sport: varchar('sport').notNull(),
  phase: varchar('phase').notNull(), // training, competition, recovery
  calories: integer('calories'),
  protein: integer('protein'), // grams
  carbs: integer('carbs'), // grams
  fats: integer('fats'), // grams
  meals: jsonb('meals'), // meal plan data
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type NutritionPlan = typeof nutritionPlans.$inferSelect;
export type InsertNutritionPlan = typeof nutritionPlans.$inferInsert;

// Mental Health Modules table
export const mentalHealthModules = pgTable('mental_health_modules', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar('title').notNull(),
  type: varchar('type').notNull(), // breathing, meditation, visualization, focus
  duration: integer('duration'), // minutes
  description: text('description'),
  benefits: text('benefits').array(),
  content: text('content'), // guided instructions
  audioUrl: varchar('audio_url'), // optional audio guide
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export type MentalHealthModule = typeof mentalHealthModules.$inferSelect;
export type InsertMentalHealthModule = typeof mentalHealthModules.$inferInsert;

// Student Athlete Profiles table (extended user data)
export const studentAthleteProfiles = pgTable('student_athlete_profiles', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id')
    .references(() => users.id)
    .unique(),
  // Athletic Information
  height: varchar('height'), // e.g., "6'2\""
  weight: real('weight'), // pounds
  dominantHand: varchar('dominant_hand'), // left, right, both
  positions: text('positions').array(), // primary and secondary positions
  teamAffiliation: varchar('team_affiliation'),
  coachName: varchar('coach_name'),
  coachEmail: varchar('coach_email'),
  coachPhone: varchar('coach_phone'),

  // Academic Information
  school: varchar('school'),
  graduationYear: integer('graduation_year'),
  currentGpa: real('current_gpa'),
  satScore: integer('sat_score'),
  actScore: integer('act_score'),
  transcriptUrl: varchar('transcript_url'),

  // Athletic Performance
  seasonStats: jsonb('season_stats'), // sport-specific stats
  athleticAchievements: text('athletic_achievements').array(),
  injuryHistory: jsonb('injury_history'),

  // Recruiting Information
  recruitingStatus: varchar('recruiting_status').default('exploring'), // exploring, committed, signed
  interestedColleges: text('interested_colleges').array(),
  collegeVisits: jsonb('college_visits'),
  scholarshipOffers: jsonb('scholarship_offers'),

  // Wellness & Development
  wellnessGoals: text('wellness_goals').array(),
  trainingSchedule: jsonb('training_schedule'),

  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type StudentAthleteProfile = typeof studentAthleteProfiles.$inferSelect;
export type InsertStudentAthleteProfile = typeof studentAthleteProfiles.$inferInsert;

// Social Media Accounts table
export const socialMediaAccounts = pgTable('social_media_accounts', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  platform: varchar('platform').notNull(), // instagram, twitter, facebook, tiktok, linkedin, youtube
  username: varchar('username').notNull(),
  displayName: varchar('display_name'),
  profileUrl: varchar('profile_url'),
  followers: integer('followers').default(0),
  isVerified: boolean('is_verified').default(false),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  tokenExpiry: timestamp('token_expiry'),
  isActive: boolean('is_active').default(true),
  connectionStatus: varchar('connection_status').default('connected'), // connected, expired, error, pending
  connectionType: varchar('connection_type').default('manual'), // api, manual
  lastSync: timestamp('last_sync').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type SocialMediaAccount = typeof socialMediaAccounts.$inferSelect;
export type InsertSocialMediaAccount = typeof socialMediaAccounts.$inferInsert;
export const insertSocialMediaAccountSchema = createInsertSchema(socialMediaAccounts);

// Social Media Posts table
export const socialMediaPosts = pgTable('social_media_posts', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: varchar('account_id').references(() => socialMediaAccounts.id, {
    onDelete: 'cascade',
  }),
  platform: varchar('platform').notNull(),
  content: text('content').notNull(),
  images: text('images').array(),
  videoUrl: varchar('video_url'),
  externalPostId: varchar('external_post_id'), // Platform's post ID
  status: varchar('status').default('published'), // published, scheduled, failed, draft
  scheduledTime: timestamp('scheduled_time'),
  publishedTime: timestamp('published_time'),
  engagement: jsonb('engagement'), // likes, comments, shares, views
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type SocialMediaPost = typeof socialMediaPosts.$inferSelect;
export type InsertSocialMediaPost = typeof socialMediaPosts.$inferInsert;

// Social Media Campaigns table
export const socialMediaCampaigns = pgTable('social_media_campaigns', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  description: text('description'),
  platforms: jsonb('platforms'), // array of platforms
  features: jsonb('features'), // array of features
  contentType: varchar('content_type'), // image, video, carousel, mixed
  schedule: jsonb('schedule'), // scheduling configuration
  targetAudience: jsonb('target_audience'),
  status: varchar('status').notNull().default('draft'),
  postsScheduled: integer('posts_scheduled').default(0),
  postsPublished: integer('posts_published').default(0),
  totalEngagement: integer('total_engagement').default(0),
  engagementRate: real('engagement_rate').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type SocialMediaCampaign = typeof socialMediaCampaigns.$inferSelect;
export type InsertSocialMediaCampaign = typeof socialMediaCampaigns.$inferInsert;

// Social Media Schedule table
export const socialMediaSchedule = pgTable('social_media_schedule', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  campaignId: varchar('campaign_id').references(() => socialMediaCampaigns.id, {
    onDelete: 'cascade',
  }),
  postId: varchar('post_id').references(() => socialMediaPosts.id),
  platform: varchar('platform').notNull(),
  content: text('content').notNull(),
  media: jsonb('media'), // array of media URLs
  scheduledFor: timestamp('scheduled_for').notNull(),
  publishedAt: timestamp('published_at'),
  status: varchar('status').notNull().default('scheduled'),
  retries: integer('retries').default(0),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type SocialMediaSchedule = typeof socialMediaSchedule.$inferSelect;
export type InsertSocialMediaSchedule = typeof socialMediaSchedule.$inferInsert;

// Scraper Results table
export const scraperResults = pgTable('scraper_results', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  source: varchar('source').notNull(), // production, enhanced, social-media
  sport: varchar('sport'),
  region: varchar('region'),
  data: jsonb('data').notNull(),
  metadata: jsonb('metadata'),
  status: varchar('status').notNull().default('success'),
  totalRecords: integer('total_records').default(0),
  successfulRecords: integer('successful_records').default(0),
  failedRecords: integer('failed_records').default(0),
  processingTime: integer('processing_time'),
  errors: jsonb('errors'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type ScraperResult = typeof scraperResults.$inferSelect;
export type InsertScraperResult = typeof scraperResults.$inferInsert;

// Social Media Metrics table (analytics)
export const socialMediaMetrics = pgTable('social_media_metrics', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  postId: varchar('post_id').references(() => socialMediaPosts.id, {
    onDelete: 'cascade',
  }),
  campaignId: varchar('campaign_id').references(() => socialMediaCampaigns.id),
  platform: varchar('platform').notNull(),
  impressions: integer('impressions').default(0),
  reach: integer('reach').default(0),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  shares: integer('shares').default(0),
  saves: integer('saves').default(0),
  clicks: integer('clicks').default(0),
  videoViews: integer('video_views').default(0),
  engagementRate: real('engagement_rate').default(0),
  clickThroughRate: real('click_through_rate').default(0),
  recordedAt: timestamp('recorded_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('IDX_metrics_post').on(table.postId),
]);

export type SocialMediaMetric = typeof socialMediaMetrics.$inferSelect;
export type InsertSocialMediaMetric = typeof socialMediaMetrics.$inferInsert;

// Stripe Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  stripeSubscriptionId: varchar('stripe_subscription_id').notNull().unique(),
  stripeCustomerId: varchar('stripe_customer_id').notNull(),
  stripePriceId: varchar('stripe_price_id').notNull(),
  status: varchar('status').notNull(), // active, canceled, incomplete, incomplete_expired, past_due, trialing, unpaid
  tier: varchar('tier').notNull(), // starter, pro, elite
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Comprehensive Colleges Database - ALL NCAA, NAIA, and Junior Colleges
export const colleges = pgTable('colleges', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  shortName: varchar('short_name'), // Common abbreviation
  mascot: varchar('mascot'),

  // Classification
  division: varchar('division').notNull(), // D1, D2, D3, NAIA, NJCAA
  subdivision: varchar('subdivision'), // FBS, FCS for D1 football
  conference: varchar('conference'),
  region: varchar('region'), // Geographic region

  // Location
  city: varchar('city').notNull(),
  state: varchar('state').notNull(),
  zipCode: varchar('zip_code'),
  country: varchar('country').default('USA'),
  timezone: varchar('timezone'),

  // Institution Details
  type: varchar('type').notNull(), // public, private, community
  enrollment: integer('enrollment'),
  founded: integer('founded'),
  website: varchar('website'),
  athleticsWebsite: varchar('athletics_website'),

  // Academic Information
  acceptanceRate: real('acceptance_rate'), // 0-100
  averageGPA: real('average_gpa'),
  tuitionInState: decimal('tuition_in_state'),
  tuitionOutState: decimal('tuition_out_state'),

  // Athletic Information
  athleticDirector: varchar('athletic_director'),
  athleticDirectorEmail: varchar('athletic_director_email'),
  athleticDirectorPhone: varchar('athletic_director_phone'),
  facilitiesInfo: jsonb('facilities_info'),

  // Colors and Branding
  primaryColor: varchar('primary_color'),
  secondaryColor: varchar('secondary_color'),
  logoUrl: varchar('logo_url'),

  // Contact Quality
  contactsVerified: boolean('contacts_verified').default(false),
  lastContactUpdate: timestamp('last_contact_update'),
  dataSource: varchar('data_source').default('NCAA_Directory'),

  // Status
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type College = typeof colleges.$inferSelect;
export type InsertCollege = typeof colleges.$inferInsert;

// Sports Programs - What sports each college offers
export const sportsPrograms = pgTable('sports_programs', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  collegeId: varchar('college_id')
    .notNull()
    .references(() => colleges.id, { onDelete: 'cascade' }),
  sport: varchar('sport').notNull(), // football, basketball, soccer, etc.
  gender: varchar('gender').notNull(), // men, women, coed
  scholarshipsAvailable: integer('scholarships_available'),
  scholarshipsOffered: real('scholarships_offered'), // Can be partial
  season: varchar('season'), // fall, winter, spring
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export type SportsProgram = typeof sportsPrograms.$inferSelect;
export type InsertSportsProgram = typeof sportsPrograms.$inferInsert;

// Coaching Staff Database - ALL coaches with contact info
export const coachingStaff = pgTable('coaching_staff', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  collegeId: varchar('college_id')
    .notNull()
    .references(() => colleges.id, { onDelete: 'cascade' }),
  sport: varchar('sport').notNull(),
  gender: varchar('gender').notNull(), // men, women, coed

  // Coach Information
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  title: varchar('title').notNull(), // Head Coach, Assistant Coach, etc.

  // Contact Information
  email: varchar('email'),
  phone: varchar('phone'),
  officePhone: varchar('office_phone'),
  recruitingEmail: varchar('recruiting_email'),

  // Professional Information
  yearsAtSchool: integer('years_at_school'),
  totalYearsCoaching: integer('total_years_coaching'),
  previousPositions: jsonb('previous_positions'),
  education: jsonb('education'),

  // Recruiting Information
  recruitingTerritory: text('recruiting_territory').array(), // States/regions
  recruitingFocus: text('recruiting_focus').array(), // Position types, player attributes
  responseRate: real('response_rate'), // Historical response rate
  preferredContactMethod: varchar('preferred_contact_method'), // email, phone, text

  // Social Media
  twitterHandle: varchar('twitter_handle'),
  linkedinProfile: varchar('linkedin_profile'),

  // Data Quality
  contactVerified: boolean('contact_verified').default(false),
  lastContactAttempt: timestamp('last_contact_attempt'),
  lastVerified: timestamp('last_verified'),
  dataSource: varchar('data_source'),

  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Coach = typeof coachingStaff.$inferSelect;
export type InsertCoach = typeof coachingStaff.$inferInsert;

// NCAA Eligibility Requirements by Division
export const ncaaRequirements = pgTable('ncaa_requirements', {
  id: serial('id').primaryKey(),
  division: varchar('division').notNull(),
  sport: varchar('sport'),

  // Academic Requirements
  minGPA: real('min_gpa'),
  coreCourses: integer('core_courses'),
  testScore: jsonb('test_score'), // SAT/ACT requirements

  // Eligibility Rules
  amateurismRules: jsonb('amateurism_rules'),
  recruitingRules: jsonb('recruiting_rules'),
  scholarshipLimits: jsonb('scholarship_limits'),

  effectiveDate: timestamp('effective_date').defaultNow(),
  isActive: boolean('is_active').default(true),
});

export type NCAARequirement = typeof ncaaRequirements.$inferSelect;
export type InsertNCAARequirement = typeof ncaaRequirements.$inferInsert;

// Video Analysis table
export const videoAnalysis = pgTable('video_analysis', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  fileName: varchar('file_name').notNull(),
  filePath: varchar('file_path').notNull(),
  sport: varchar('sport').notNull(),
  garScore: real('gar_score'),
  analysisData: jsonb('analysis_data'),
  feedback: text('feedback'),
  strengths: text('strengths').array(),
  improvements: text('improvements').array(),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export type VideoAnalysis = typeof videoAnalysis.$inferSelect;
export type InsertVideoAnalysis = typeof videoAnalysis.$inferInsert;

// StarPath Progress table
export const starPathProgress = pgTable('starpath_progress', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  skillId: varchar('skill_id').notNull(),
  skillName: varchar('skill_name').notNull(),
  currentLevel: integer('current_level').default(1),
  totalXp: integer('total_xp').default(0),
  isUnlocked: boolean('is_unlocked').default(false),
  completedAt: timestamp('completed_at'),
  lastUpdated: timestamp('last_updated').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type StarPathProgress = typeof starPathProgress.$inferSelect;
export type InsertStarPathProgress = typeof starPathProgress.$inferInsert;

// Camp Registrations table
export const campRegistrations = pgTable('camp_registrations', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  campName: varchar('camp_name').notNull(),
  sport: varchar('sport').notNull(),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  email: varchar('email').notNull(),
  phone: varchar('phone'),
  birthDate: timestamp('birth_date'),
  guardianName: varchar('guardian_name'),
  guardianPhone: varchar('guardian_phone'),
  position: varchar('position'),
  experience: varchar('experience'),
  registrationStatus: varchar('registration_status').default('pending'),
  paymentStatus: varchar('payment_status').default('unpaid'),
  specialRequirements: text('special_requirements'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type CampRegistration = typeof campRegistrations.$inferSelect;
export type InsertCampRegistration = typeof campRegistrations.$inferInsert;

// User Files table
export const userFiles = pgTable('user_files', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  fileName: varchar('file_name').notNull(),
  filePath: varchar('file_path').notNull(),
  fileSize: integer('file_size'),
  fileType: varchar('file_type'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  isActive: boolean('is_active').default(true),
});

export type UserFile = typeof userFiles.$inferSelect;
export type InsertUserFile = typeof userFiles.$inferInsert;

// Content Tags table
export const contentTags = pgTable('content_tags', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  fileId: varchar('file_id').references(() => userFiles.id),
  tagName: varchar('tag_name').notNull(),
  confidence: real('confidence').default(0.5),
  relevance: real('relevance').default(0.5),
  category: varchar('category'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type ContentTag = typeof contentTags.$inferSelect;
export type InsertContentTag = typeof contentTags.$inferInsert;

// Academy-related tables for courses and enrollments
export const courses = pgTable('courses', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar('title').notNull(),
  description: text('description'),
  code: varchar('code'),
  credits: real('credits').default(1.0),
  gradeLevel: varchar('grade_level'),
  department: varchar('department'),
  prerequisites: jsonb('prerequisites'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const enrollments = pgTable('enrollments', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  courseId: varchar('course_id').references(() => courses.id),
  status: varchar('status').default('active'),
  enrolledAt: timestamp('enrolled_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

export const assessments = pgTable('assessments', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: varchar('course_id').references(() => courses.id),
  title: varchar('title').notNull(),
  description: text('description'),
  type: varchar('type').default('quiz'),
  pointsTotal: real('points_total').notNull(),
  dueDate: timestamp('due_date'),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

export const contentLibrary = pgTable('content_library', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: varchar('course_id').references(() => courses.id),
  title: varchar('title').notNull(),
  type: varchar('type').notNull(),
  content: text('content'),
  url: varchar('url'),
  fileSize: integer('file_size'),
  duration: integer('duration'),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export type ContentLibraryItem = typeof contentLibrary.$inferSelect;
export type InsertContentLibraryItem = typeof contentLibrary.$inferInsert;

// Curriculum-related tables
export const curriculum = pgTable('curriculum', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: varchar('course_id').references(() => courses.id),
  week: integer('week').notNull(),
  topic: varchar('topic').notNull(),
  objectives: jsonb('objectives'),
  resources: jsonb('resources'),
  assessments: jsonb('assessments'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type CurriculumItem = typeof curriculum.$inferSelect;
export type InsertCurriculumItem = typeof curriculum.$inferInsert;

export const courseContent = pgTable('course_content', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: varchar('course_id').references(() => courses.id),
  title: varchar('title').notNull(),
  order: integer('order').default(0),
  contentType: varchar('content_type').notNull(),
  content: text('content'),
  metadata: jsonb('metadata'),
  isLocked: boolean('is_locked').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export type CourseContent = typeof courseContent.$inferSelect;
export type InsertCourseContent = typeof courseContent.$inferInsert;

// Friday Night Lights Event Registration
export const fridayNightLightsRegistrations = pgTable('friday_night_lights_registrations', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar('user_id').references(() => users.id),
  eventType: varchar('event_type').notNull(), // 'open-house', 'tryout', 'both'
  
  // Personal Information
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  email: varchar('email').notNull(),
  phone: varchar('phone'),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  
  // Parent/Guardian Information
  parentName: varchar('parent_name'),
  parentEmail: varchar('parent_email'),
  emergencyContact: varchar('emergency_contact'),
  emergencyPhone: varchar('emergency_phone'),
  
  // Universal One Open House
  universalOneInterest: boolean('universal_one_interest').default(false),
  academicPrograms: text('academic_programs'), // JSON stringified array
  needsAcademicSupport: boolean('needs_academic_support').default(false),
  
  // Team Tryout Information
  primarySport: varchar('primary_sport'),
  secondarySports: text('secondary_sports'), // JSON stringified array
  position: varchar('position'),
  experience: varchar('experience'),
  previousTeams: text('previous_teams'),
  
  // Sports-specific tryouts
  flagFootballTryout: boolean('flag_football_tryout').default(false),
  basketballTryout: boolean('basketball_tryout').default(false),
  soccerTryout: boolean('soccer_tryout').default(false),
  
  // Opt-ins
  garAnalysisOptIn: boolean('gar_analysis_opt_in').default(true),
  aiCoachingOptIn: boolean('ai_coaching_opt_in').default(true),
  recruitmentOptIn: boolean('recruitment_opt_in').default(true),
  
  // Event Logistics
  transportationNeeds: boolean('transportation_needs').default(false),
  dietaryRestrictions: text('dietary_restrictions'),
  specialAccommodations: text('special_accommodations'),
  
  // Registration Status
  status: varchar('status').default('confirmed'), // 'pending', 'confirmed', 'cancelled'
  registrationDate: timestamp('registration_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type FridayNightLightsRegistration = typeof fridayNightLightsRegistrations.$inferSelect;
export type InsertFridayNightLightsRegistration = typeof fridayNightLightsRegistrations.$inferInsert;

// Zod validation schemas for academy
export const insertCourseSchema = createInsertSchema(courses);
export const insertEnrollmentSchema = createInsertSchema(enrollments);
export const insertAssessmentSchema = createInsertSchema(assessments);
export const insertContentLibrarySchema = createInsertSchema(contentLibrary);
export const insertCurriculumSchema = createInsertSchema(curriculum);
export const insertCourseContentSchema = createInsertSchema(courseContent);
export const insertFridayNightLightsRegistrationSchema = createInsertSchema(fridayNightLightsRegistrations);
