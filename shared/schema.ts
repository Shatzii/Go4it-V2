import { pgTable, text, integer, timestamp, boolean, decimal, jsonb, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table - Updated to match actual database schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').notNull().default('athlete'), // athlete, coach, parent, admin
  profileImage: text('profile_image'),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  measurementSystem: text('measurement_system'),
  phoneNumber: text('phone_number'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  dateOfBirth: timestamp('date_of_birth'),
  sport: text('sport'),
  position: text('position'),
  graduationYear: integer('graduation_year'),
  gpa: decimal('gpa', { precision: 3, scale: 2 }),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at'),
  isVerified: boolean('is_verified').default(false),
  verifiedAt: timestamp('verified_at'),
  verifiedBy: text('verified_by'),
  garScore: decimal('gar_score', { precision: 5, scale: 2 }),
  lastGarAnalysis: timestamp('last_gar_analysis'),
});

// Video analysis table
export const videoAnalysis = pgTable('video_analysis', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  sport: text('sport').notNull(),
  garScore: decimal('gar_score', { precision: 5, scale: 2 }),
  analysisData: jsonb('analysis_data'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Videos table for the highlight reel system
export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  sport: text('sport').notNull(),
  garScore: decimal('gar_score', { precision: 5, scale: 2 }),
  analysisData: jsonb('analysis_data'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Highlight reels table
export const highlightReels = pgTable('highlight_reels', {
  id: serial('id').primaryKey(),
  videoId: integer('video_id').notNull().references(() => videos.id),
  title: text('title').notNull(),
  duration: integer('duration').notNull().default(60),
  highlights: jsonb('highlights'),
  status: text('status').notNull().default('processing'), // processing, completed, failed
  downloadUrl: text('download_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  processedAt: timestamp('processed_at'),
});

// Camp registrations table
export const campRegistrations = pgTable('camp_registrations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // null if guest registration
  campId: text('camp_id').notNull(), // merida-summer-2025, etc.
  campName: text('camp_name').notNull(),
  campDates: text('camp_dates').notNull(),
  campLocation: text('camp_location').notNull(),
  
  // Personal information (for guest registrations)
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  
  // Parent/Guardian information
  parentName: text('parent_name').notNull(),
  parentEmail: text('parent_email').notNull(),
  emergencyContact: text('emergency_contact').notNull(),
  emergencyPhone: text('emergency_phone').notNull(),
  
  // Football information
  position: text('position'),
  experience: text('experience'),
  
  // Benefits and services
  garAnalysis: boolean('gar_analysis').default(true),
  usaFootballMembership: boolean('usa_football_membership').default(true),
  actionNetworkOptIn: boolean('action_network_opt_in').default(true),
  
  // Action Network integration
  actionNetworkId: text('action_network_id'), // From Action Network API
  actionNetworkStatus: text('action_network_status'), // submitted, confirmed, etc.
  
  // Registration status
  status: text('status').notNull().default('pending'), // pending, confirmed, cancelled
  paymentStatus: text('payment_status').default('pending'), // pending, paid, refunded
  registrationFee: decimal('registration_fee', { precision: 8, scale: 2 }),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// StarPath progress table
export const starPathProgress = pgTable('starpath_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  skillId: text('skill_id').notNull(),
  skillName: text('skill_name').notNull(),
  currentLevel: integer('current_level').notNull().default(1),
  totalXp: integer('total_xp').notNull().default(0),
  isUnlocked: boolean('is_unlocked').notNull().default(false),
  completedAt: timestamp('completed_at'),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
});

// Content tags table for smart tagging
export const contentTags = pgTable('content_tags', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileId: integer('file_id').notNull(),
  tagName: text('tag_name').notNull(),
  tagCategory: text('tag_category').notNull(), // sport, skill, performance, event, location, equipment, technique, strategy
  confidence: decimal('confidence', { precision: 3, scale: 2 }).notNull().default('0.8'),
  relevance: decimal('relevance', { precision: 3, scale: 2 }).notNull().default('0.7'),
  metadata: jsonb('metadata'), // Additional tag metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// User files table for file management
export const userFiles = pgTable('user_files', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileType: text('file_type').notNull(), // video, image, document
  fileSize: integer('file_size').notNull(),
  sport: text('sport'),
  description: text('description'),
  isAnalyzed: boolean('is_analyzed').notNull().default(false),
  analysisData: jsonb('analysis_data'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Content analysis table for detailed analysis results
export const contentAnalysis = pgTable('content_analysis', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  fileId: integer('file_id').notNull().references(() => userFiles.id),
  primarySport: text('primary_sport').notNull(),
  secondarySports: text('secondary_sports').array(),
  skills: jsonb('skills'), // Array of skill objects
  performance: jsonb('performance'), // Performance metrics
  context: jsonb('context'), // Analysis context
  suggestions: text('suggestions').array(),
  autoCategories: text('auto_categories').array(),
  detectedObjects: text('detected_objects').array(),
  timestamps: jsonb('timestamps'), // Video timestamps
  analyzedAt: timestamp('analyzed_at').notNull().defaultNow(),
});

// Achievements table
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  achievementId: text('achievement_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  badgeIcon: text('badge_icon'),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
});

// NCAA schools table
export const ncaaSchools = pgTable('ncaa_schools', {
  id: serial('id').primaryKey(),
  schoolName: text('school_name').notNull(),
  division: text('division').notNull(), // D1, D2, D3, NAIA, NJCAA
  conference: text('conference'),
  state: text('state'),
  city: text('city'),
  website: text('website'),
  coachingStaff: jsonb('coaching_staff'),
  programs: jsonb('programs'), // Available sports programs
  isActive: boolean('is_active').notNull().default(true),
});

// User sessions table for authentication
export const userSessions = pgTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// AI Coaching Profiles
export const aiCoachingProfiles = pgTable('ai_coaching_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  emotionalState: text('emotional_state'),
  frustrationLevel: integer('frustration_level').default(0),
  adaptations: jsonb('adaptations'),
  learningStyle: text('learning_style'),
  preferredCommunication: text('preferred_communication'),
  strengths: jsonb('strengths'),
  challenges: jsonb('challenges'),
  progressHistory: jsonb('progress_history'),
  lastInteraction: timestamp('last_interaction'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// User Preferences for Accessibility
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  theme: text('theme').default('default'),
  sensoryPreferences: jsonb('sensory_preferences'),
  audioDescriptions: boolean('audio_descriptions').default(false),
  focusMode: boolean('focus_mode').default(false),
  executiveSupport: jsonb('executive_support'),
  language: text('language').default('en'),
  culturalSettings: jsonb('cultural_settings'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Performance Metrics
export const performanceMetrics = pgTable('performance_metrics', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  metricType: text('metric_type').notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit'),
  category: text('category'),
  subCategory: text('sub_category'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  metadata: jsonb('metadata'),
  seasonYear: integer('season_year'),
  sport: text('sport'),
});

// Teams
export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sport: text('sport').notNull(),
  division: text('division'),
  season: text('season'),
  year: integer('year'),
  homeVenue: text('home_venue'),
  teamColors: jsonb('team_colors'),
  maxRosterSize: integer('max_roster_size').default(25),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Team Memberships
export const teamMemberships = pgTable('team_memberships', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  teamId: integer('team_id').notNull().references(() => teams.id),
  role: text('role').default('player'), // player, coach, assistant, manager
  joinDate: timestamp('join_date').notNull().defaultNow(),
  endDate: timestamp('end_date'),
  isActive: boolean('is_active').default(true),
  jerseyNumber: integer('jersey_number'),
  position: text('position'),
});

// Playbooks for team strategies
export const playbooks = pgTable('playbooks', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  playName: text('play_name').notNull(),
  sport: text('sport').notNull(), // flag-football, soccer, basketball
  playType: text('play_type').notNull(), // offense, defense, special
  formation: text('formation'),
  description: text('description'),
  diagramData: jsonb('diagram_data'), // Visual play diagram
  playerPositions: jsonb('player_positions'), // Position assignments
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Team schedules
export const teamSchedules = pgTable('team_schedules', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  eventType: text('event_type').notNull(), // game, practice, tournament
  opponent: text('opponent'),
  location: text('location').notNull(),
  eventDate: timestamp('event_date').notNull(),
  duration: integer('duration').default(90), // minutes
  notes: text('notes'),
  isHome: boolean('is_home').default(true),
  status: text('status').default('scheduled'), // scheduled, completed, cancelled
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Player stats tracking
export const playerStats = pgTable('player_stats', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  teamId: integer('team_id').notNull().references(() => teams.id),
  gameId: integer('game_id').references(() => teamSchedules.id),
  statType: text('stat_type').notNull(), // touchdowns, goals, assists, etc
  value: integer('value').notNull(),
  sport: text('sport').notNull(),
  gameDate: timestamp('game_date'),
  season: text('season'),
  notes: text('notes'),
  recordedAt: timestamp('recorded_at').notNull().defaultNow(),
});

// Athletic Institutions table (High Schools, Universities)
export const institutions = pgTable('institutions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // high_school, college, university, club
  state: text('state').notNull(),
  city: text('city').notNull(),
  conference: text('conference'),
  division: text('division'), // D1, D2, D3, NAIA, JUCO
  website: text('website'),
  logoUrl: text('logo_url'),
  athleticDirector: text('athletic_director'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  subscriptionPlan: text('subscription_plan').default('basic'), // basic, premium, enterprise
  maxAthletes: integer('max_athletes').default(100),
  currentAthletes: integer('current_athletes').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Curriculum table for real academic content
export const curriculum = pgTable('curriculum', {
  id: serial('id').primaryKey(),
  courseId: text('course_id').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  subject: text('subject').notNull(), // math, english, science, history, etc.
  gradeLevel: text('grade_level').notNull(), // 9, 10, 11, 12, college
  creditHours: decimal('credit_hours', { precision: 3, scale: 2 }).default('1.0'),
  prerequisites: text('prerequisites').array(),
  learningObjectives: text('learning_objectives').array(),
  assessmentMethods: text('assessment_methods').array(),
  standardsAlignment: jsonb('standards_alignment'), // Common Core, state standards
  isNcaaApproved: boolean('is_ncaa_approved').default(false),
  difficulty: text('difficulty').default('standard'), // remedial, standard, honors, ap
  estimatedHours: integer('estimated_hours').default(120),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Course Content table for lessons and materials
export const courseContent = pgTable('course_content', {
  id: serial('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => curriculum.courseId),
  unit: integer('unit').notNull(),
  lesson: integer('lesson').notNull(),
  title: text('title').notNull(),
  contentType: text('content_type').notNull(), // video, text, quiz, assignment, lab
  content: text('content'), // HTML content or video URL
  resources: jsonb('resources'), // Additional resources, links, files
  estimatedTime: integer('estimated_time').default(50), // minutes
  isRequired: boolean('is_required').default(true),
  prerequisites: text('prerequisites').array(),
  learningObjectives: text('learning_objectives').array(),
  assessmentCriteria: jsonb('assessment_criteria'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Student Enrollments table
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => users.id),
  courseId: text('course_id').notNull().references(() => curriculum.courseId),
  institutionId: integer('institution_id').references(() => institutions.id),
  enrollmentDate: timestamp('enrollment_date').notNull().defaultNow(),
  completionDate: timestamp('completion_date'),
  currentGrade: decimal('current_grade', { precision: 5, scale: 2 }),
  finalGrade: decimal('final_grade', { precision: 5, scale: 2 }),
  gradePoints: decimal('grade_points', { precision: 3, scale: 2 }),
  status: text('status').default('enrolled'), // enrolled, completed, dropped, withdrawn
  semester: text('semester'), // fall_2024, spring_2025, etc.
  progressPercentage: integer('progress_percentage').default(0),
  lastAccessedAt: timestamp('last_accessed_at'),
  isNcaaEligible: boolean('is_ncaa_eligible').default(true),
});

// Assignment Submissions table
export const assignments = pgTable('assignments', {
  id: serial('id').primaryKey(),
  enrollmentId: integer('enrollment_id').notNull().references(() => enrollments.id),
  contentId: integer('content_id').notNull().references(() => courseContent.id),
  studentId: integer('student_id').notNull().references(() => users.id),
  submissionContent: text('submission_content'),
  submissionFiles: text('submission_files').array(),
  submittedAt: timestamp('submitted_at'),
  dueDate: timestamp('due_date').notNull(),
  gradeReceived: decimal('grade_received', { precision: 5, scale: 2 }),
  feedback: text('feedback'),
  gradedAt: timestamp('graded_at'),
  gradedBy: integer('graded_by').references(() => users.id),
  status: text('status').default('assigned'), // assigned, submitted, graded, late
  attempts: integer('attempts').default(0),
  maxAttempts: integer('max_attempts').default(3),
});

// Team Roster Management with Academic Tracking
export const teamRosters = pgTable('team_rosters', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  athleteId: integer('athlete_id').notNull().references(() => users.id),
  position: text('position'),
  jerseyNumber: integer('jersey_number'),
  status: text('status').default('active'), // active, inactive, injured, suspended
  eligibilityStatus: text('eligibility_status').default('eligible'), // eligible, ineligible, pending
  gpa: decimal('gpa', { precision: 3, scale: 2 }),
  creditHours: decimal('credit_hours', { precision: 3, scale: 1 }),
  joinDate: timestamp('join_date').notNull().defaultNow(),
  graduationDate: timestamp('graduation_date'),
  scholarshipAmount: decimal('scholarship_amount', { precision: 10, scale: 2 }),
  scholarshipType: text('scholarship_type'), // full, partial, academic, athletic
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
});

export const insertVideoAnalysisSchema = createInsertSchema(videoAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertHighlightReelSchema = createInsertSchema(highlightReels).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertStarPathProgressSchema = createInsertSchema(starPathProgress).omit({
  id: true,
  lastUpdated: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

export const insertAiCoachingProfileSchema = createInsertSchema(aiCoachingProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPerformanceMetricsSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertTeamMembershipSchema = createInsertSchema(teamMemberships).omit({
  id: true,
  joinDate: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export const insertPlaybookSchema = createInsertSchema(playbooks).omit({
  id: true,
  createdAt: true,
});

export const insertTeamScheduleSchema = createInsertSchema(teamSchedules).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerStatsSchema = createInsertSchema(playerStats).omit({
  id: true,
  recordedAt: true,
});

export const insertInstitutionSchema = createInsertSchema(institutions).omit({
  id: true,
  createdAt: true,
});

export const insertCurriculumSchema = createInsertSchema(curriculum).omit({
  id: true,
  createdAt: true,
});

export const insertCourseContentSchema = createInsertSchema(courseContent).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrollmentDate: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
});

export const insertTeamRosterSchema = createInsertSchema(teamRosters).omit({
  id: true,
  joinDate: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type VideoAnalysis = typeof videoAnalysis.$inferSelect;
export type InsertVideoAnalysis = typeof videoAnalysis.$inferInsert;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;
export type HighlightReel = typeof highlightReels.$inferSelect;
export type InsertHighlightReel = typeof highlightReels.$inferInsert;
export type StarPathProgress = typeof starPathProgress.$inferSelect;
export type InsertStarPathProgress = typeof starPathProgress.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
export type NcaaSchool = typeof ncaaSchools.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;
export type AiCoachingProfile = typeof aiCoachingProfiles.$inferSelect;
export type InsertAiCoachingProfile = typeof aiCoachingProfiles.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetrics = typeof performanceMetrics.$inferInsert;
export type TeamMembership = typeof teamMemberships.$inferSelect;
export type InsertTeamMembership = typeof teamMemberships.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;
export type Playbook = typeof playbooks.$inferSelect;
export type InsertPlaybook = typeof playbooks.$inferInsert;
export type TeamSchedule = typeof teamSchedules.$inferSelect;
export type InsertTeamSchedule = typeof teamSchedules.$inferInsert;
export type PlayerStats = typeof playerStats.$inferSelect;
export type InsertPlayerStats = typeof playerStats.$inferInsert;
export type Institution = typeof institutions.$inferSelect;
export type InsertInstitution = typeof institutions.$inferInsert;
export type Curriculum = typeof curriculum.$inferSelect;
export type InsertCurriculum = typeof curriculum.$inferInsert;
export type CourseContent = typeof courseContent.$inferSelect;
export type InsertCourseContent = typeof courseContent.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;
export type TeamRoster = typeof teamRosters.$inferSelect;
export type InsertTeamRoster = typeof teamRosters.$inferInsert;

// Camp registration types
export type CampRegistration = typeof campRegistrations.$inferSelect;
export type InsertCampRegistration = typeof campRegistrations.$inferInsert;
export const insertCampRegistrationSchema = createInsertSchema(campRegistrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Additional team types for forms
export type InsertTeamType = z.infer<typeof insertTeamSchema>;
export type InsertTeamRosterType = z.infer<typeof insertTeamRosterSchema>;

