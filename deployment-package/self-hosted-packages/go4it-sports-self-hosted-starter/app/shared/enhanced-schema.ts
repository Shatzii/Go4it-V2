import { pgTable, text, integer, timestamp, boolean, jsonb, decimal, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enhanced Performance Tracking
export const performanceMetrics = pgTable('performance_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  sessionId: uuid('session_id').notNull(),
  heartRate: integer('heart_rate'),
  movement: jsonb('movement_data'),
  attention: jsonb('attention_metrics'),
  timestamp: timestamp('timestamp').defaultNow(),
  performanceZone: text('performance_zone'),
  notes: text('notes')
});

// Real-time Sessions
export const liveSessions = pgTable('live_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  sessionType: text('session_type').notNull(),
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time'),
  isActive: boolean('is_active').default(true),
  coachId: integer('coach_id'),
  realTimeData: jsonb('real_time_data')
});

// Enhanced AI Coaching
export const aiCoachingProfiles = pgTable('ai_coaching_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  emotionalState: text('emotional_state'),
  frustrationLevel: integer('frustration_level').default(0),
  preferredTone: text('preferred_tone').default('encouraging'),
  adhd: jsonb('adhd_preferences'),
  lastInteraction: timestamp('last_interaction').defaultNow(),
  adaptations: jsonb('adaptations')
});

// Enhanced Gamification
export const challenges = pgTable('challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(), // daily, weekly, team
  points: integer('points').default(0),
  requirements: jsonb('requirements'),
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date'),
  isActive: boolean('is_active').default(true),
  teamBased: boolean('team_based').default(false)
});

export const userChallenges = pgTable('user_challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  challengeId: uuid('challenge_id').notNull(),
  progress: integer('progress').default(0),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  reward: text('reward')
});

export const teamCompetitions = pgTable('team_competitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  participants: jsonb('participants'), // array of user IDs
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date'),
  status: text('status').default('active'),
  leaderboard: jsonb('leaderboard'),
  prizes: jsonb('prizes')
});

// Mobile Video Tools
export const videoRecordingSessions = pgTable('video_recording_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  sport: text('sport').notNull(),
  technique: text('technique'),
  guidanceUsed: boolean('guidance_used').default(false),
  qualityScore: integer('quality_score'),
  recordedAt: timestamp('recorded_at').defaultNow(),
  syncStatus: text('sync_status').default('pending'),
  filePath: text('file_path')
});

// Communication Hub
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: integer('sender_id').notNull(),
  receiverId: integer('receiver_id').notNull(),
  messageType: text('message_type').notNull(), // coach-athlete, parent-coach, peer
  content: text('content').notNull(),
  readAt: timestamp('read_at'),
  sentAt: timestamp('sent_at').defaultNow(),
  attachments: jsonb('attachments'),
  priority: text('priority').default('normal')
});

export const supportGroups = pgTable('support_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  sport: text('sport'),
  ageGroup: text('age_group'),
  members: jsonb('members'), // array of user IDs
  moderatorId: integer('moderator_id'),
  createdAt: timestamp('created_at').defaultNow(),
  isActive: boolean('is_active').default(true),
  groupType: text('group_type').default('peer') // peer, parent, coach
});

// Academic Integration Enhancement
export const academicProgress = pgTable('academic_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  gpa: decimal('gpa', { precision: 3, scale: 2 }),
  gradeLevel: text('grade_level'),
  semester: text('semester'),
  year: integer('year'),
  courses: jsonb('courses'),
  performanceCorrelation: jsonb('performance_correlation'),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const scholarshipOpportunities = pgTable('scholarship_opportunities', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolName: text('school_name').notNull(),
  sport: text('sport').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  requirements: jsonb('requirements'),
  deadline: timestamp('deadline'),
  contactInfo: jsonb('contact_info'),
  matchScore: integer('match_score'), // 0-100 based on athlete profile
  status: text('status').default('available')
});

export const userScholarships = pgTable('user_scholarships', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  scholarshipId: uuid('scholarship_id').notNull(),
  applicationStatus: text('application_status').default('interested'),
  appliedAt: timestamp('applied_at'),
  notes: text('notes'),
  followUpDate: timestamp('follow_up_date')
});

// Accessibility Features
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  theme: text('theme').default('default'),
  sensoryPreferences: jsonb('sensory_preferences'),
  audioDescriptions: boolean('audio_descriptions').default(false),
  focusMode: boolean('focus_mode').default(false),
  executiveSupport: jsonb('executive_support'),
  language: text('language').default('en'),
  culturalSettings: jsonb('cultural_settings')
});

// Injury Prevention & Health
export const healthMetrics = pgTable('health_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  injuryRisk: integer('injury_risk').default(0), // 0-100 scale
  recoveryStatus: text('recovery_status').default('normal'),
  biomechanicalAnalysis: jsonb('biomechanical_analysis'),
  recommendedExercises: jsonb('recommended_exercises'),
  medicalNotes: text('medical_notes'),
  lastAssessment: timestamp('last_assessment').defaultNow(),
  nextCheckup: timestamp('next_checkup')
});

export const recoveryPlans = pgTable('recovery_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  planType: text('plan_type').notNull(), // rest, active_recovery, therapy
  exercises: jsonb('exercises'),
  duration: integer('duration'), // days
  startDate: timestamp('start_date').defaultNow(),
  progressTracking: jsonb('progress_tracking'),
  therapistId: integer('therapist_id'),
  isActive: boolean('is_active').default(true)
});

// Advanced Analytics
export const performanceAnalytics = pgTable('performance_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  timeframe: text('timeframe').notNull(), // weekly, monthly, seasonal
  metrics: jsonb('metrics'),
  trends: jsonb('trends'),
  predictions: jsonb('predictions'),
  insights: jsonb('insights'),
  generatedAt: timestamp('generated_at').defaultNow(),
  reportType: text('report_type') // athlete, coach, parent
});

export const recruitmentPredictions = pgTable('recruitment_predictions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id').notNull(),
  collegeProbabilities: jsonb('college_probabilities'),
  strengthAreas: jsonb('strength_areas'),
  improvementAreas: jsonb('improvement_areas'),
  timelineProjections: jsonb('timeline_projections'),
  confidenceScore: integer('confidence_score'),
  lastUpdated: timestamp('last_updated').defaultNow()
});

// Insert schemas for all new tables
export const insertPerformanceMetrics = createInsertSchema(performanceMetrics);
export const insertLiveSessions = createInsertSchema(liveSessions);
export const insertAiCoachingProfiles = createInsertSchema(aiCoachingProfiles);
export const insertChallenges = createInsertSchema(challenges);
export const insertUserChallenges = createInsertSchema(userChallenges);
export const insertTeamCompetitions = createInsertSchema(teamCompetitions);
export const insertVideoRecordingSessions = createInsertSchema(videoRecordingSessions);
export const insertMessages = createInsertSchema(messages);
export const insertSupportGroups = createInsertSchema(supportGroups);
export const insertAcademicProgress = createInsertSchema(academicProgress);
export const insertScholarshipOpportunities = createInsertSchema(scholarshipOpportunities);
export const insertUserScholarships = createInsertSchema(userScholarships);
export const insertUserPreferences = createInsertSchema(userPreferences);
export const insertHealthMetrics = createInsertSchema(healthMetrics);
export const insertRecoveryPlans = createInsertSchema(recoveryPlans);
export const insertPerformanceAnalytics = createInsertSchema(performanceAnalytics);
export const insertRecruitmentPredictions = createInsertSchema(recruitmentPredictions);

// Go4It Teams Section
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  sport: text('sport').notNull(), // flag_football, soccer, basketball, track_field
  division: text('division'), // age group or skill level
  coachId: integer('coach_id').notNull(),
  assistantCoaches: jsonb('assistant_coaches'), // array of coach IDs
  season: text('season').notNull(),
  year: integer('year').notNull(),
  homeVenue: text('home_venue'),
  teamColors: jsonb('team_colors'),
  teamLogo: text('team_logo'),
  maxRosterSize: integer('max_roster_size').default(20),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const teamRosters = pgTable('team_rosters', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull(),
  playerId: integer('player_id').notNull(),
  position: text('position'),
  jerseyNumber: integer('jersey_number'),
  joinedDate: timestamp('joined_date').defaultNow(),
  status: text('status').default('active'), // active, injured, suspended, inactive
  playerRole: text('player_role').default('player'), // player, captain, co-captain
  parentContactInfo: jsonb('parent_contact_info')
});

export const teamSchedule = pgTable('team_schedule', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull(),
  eventType: text('event_type').notNull(), // game, practice, tournament
  opponentTeam: text('opponent_team'),
  eventDate: timestamp('event_date').notNull(),
  venue: text('venue').notNull(),
  isHomeGame: boolean('is_home_game').default(true),
  status: text('status').default('scheduled'), // scheduled, completed, cancelled, postponed
  score: jsonb('score'), // { home: number, away: number }
  gameNotes: text('game_notes'),
  attendanceRequired: boolean('attendance_required').default(true)
});

export const teamStats = pgTable('team_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull(),
  playerId: integer('player_id').notNull(),
  gameId: uuid('game_id'),
  sport: text('sport').notNull(),
  stats: jsonb('stats'), // sport-specific statistics
  gameDate: timestamp('game_date'),
  recordedAt: timestamp('recorded_at').defaultNow(),
  recordedBy: integer('recorded_by') // coach ID
});

export const teamCommunications = pgTable('team_communications', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull(),
  senderId: integer('sender_id').notNull(),
  messageType: text('message_type').notNull(), // announcement, reminder, injury_report, celebration
  title: text('title').notNull(),
  content: text('content').notNull(),
  recipients: jsonb('recipients'), // array of player/parent IDs
  priority: text('priority').default('normal'), // high, normal, low
  readBy: jsonb('read_by'), // array of user IDs who read the message
  sentAt: timestamp('sent_at').defaultNow(),
  scheduledFor: timestamp('scheduled_for'),
  attachments: jsonb('attachments')
});

export const teamTrainingPlans = pgTable('team_training_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull(),
  planName: text('plan_name').notNull(),
  sport: text('sport').notNull(),
  focusAreas: jsonb('focus_areas'), // array of skills to work on
  duration: integer('duration'), // weeks
  weeklySchedule: jsonb('weekly_schedule'),
  drills: jsonb('drills'),
  progressMetrics: jsonb('progress_metrics'),
  adaptiveFeatures: jsonb('adaptive_features'), // ADHD-friendly modifications
  createdBy: integer('created_by'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const teamAchievements = pgTable('team_achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull(),
  achievementType: text('achievement_type').notNull(), // win, tournament, milestone, improvement
  title: text('title').notNull(),
  description: text('description'),
  achievedDate: timestamp('achieved_date').defaultNow(),
  participants: jsonb('participants'), // array of player IDs involved
  recognition: text('recognition'), // trophy, certificate, etc.
  media: jsonb('media'), // photos, videos of the achievement
  isPublic: boolean('is_public').default(true)
});

// Insert schemas for team tables
export const insertTeams = createInsertSchema(teams);
export const insertTeamRosters = createInsertSchema(teamRosters);
export const insertTeamSchedule = createInsertSchema(teamSchedule);
export const insertTeamStats = createInsertSchema(teamStats);
export const insertTeamCommunications = createInsertSchema(teamCommunications);
export const insertTeamTrainingPlans = createInsertSchema(teamTrainingPlans);
export const insertTeamAchievements = createInsertSchema(teamAchievements);

// Type exports
export type Teams = typeof teams.$inferSelect;
export type TeamRosters = typeof teamRosters.$inferSelect;
export type TeamSchedule = typeof teamSchedule.$inferSelect;
export type TeamStats = typeof teamStats.$inferSelect;
export type TeamCommunications = typeof teamCommunications.$inferSelect;
export type TeamTrainingPlans = typeof teamTrainingPlans.$inferSelect;
export type TeamAchievements = typeof teamAchievements.$inferSelect;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;
export type LiveSessions = typeof liveSessions.$inferSelect;
export type AiCoachingProfiles = typeof aiCoachingProfiles.$inferSelect;
export type Challenges = typeof challenges.$inferSelect;
export type UserChallenges = typeof userChallenges.$inferSelect;
export type TeamCompetitions = typeof teamCompetitions.$inferSelect;
export type VideoRecordingSessions = typeof videoRecordingSessions.$inferSelect;
export type Messages = typeof messages.$inferSelect;
export type SupportGroups = typeof supportGroups.$inferSelect;
export type AcademicProgress = typeof academicProgress.$inferSelect;
export type ScholarshipOpportunities = typeof scholarshipOpportunities.$inferSelect;
export type UserScholarships = typeof userScholarships.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type HealthMetrics = typeof healthMetrics.$inferSelect;
export type RecoveryPlans = typeof recoveryPlans.$inferSelect;
export type PerformanceAnalytics = typeof performanceAnalytics.$inferSelect;
export type RecruitmentPredictions = typeof recruitmentPredictions.$inferSelect;