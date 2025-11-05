/**
 * Drill Library Schema - Complete Training Content Management
 * 
 * ZONE MAPPING:
 * - GREEN: Public drill library (isPublic=true)
 * - YELLOW: Aggregated stats, anonymized ratings
 * - RED: Athlete-specific assignments, performance data, PII
 * 
 * AI MODEL USAGE:
 * - local_fast_llm: Tagging, classification, sport detection
 * - local_embed_model: Vector embeddings for semantic search
 * - whisper_docker: Video transcription (self-hosted)
 * - hosted_creative_llm: GREEN zone marketing descriptions ONLY
 */

import { pgTable, text, integer, real, boolean, timestamp, jsonb, varchar, serial } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// ============================================
// MEDIA ASSETS (Foundation for all video/audio content)
// ZONE: Hybrid (GREEN for public library, RED for athlete uploads)
// ============================================
export const mediaAssets = pgTable('media_assets', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  
  // File Information
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(), // video, image, audio
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  
  // Storage (Cloudflare R2)
  storageUrl: text('storage_url').notNull(), // https://cdn.go4itsports.com/drills/...
  thumbnailUrl: text('thumbnail_url'),
  duration: integer('duration'), // seconds (for video/audio)
  fileSize: integer('file_size'), // bytes
  resolution: varchar('resolution', { length: 20 }), // 1920x1080
  
  // Metadata
  uploadedBy: varchar('uploaded_by', { length: 255 }), // userId or 'system'
  uploadType: varchar('upload_type', { length: 50 }).notNull(), // 'library' | 'athlete_submission' | 'coach_demo'
  
  // AI Processing Status
  transcriptionStatus: varchar('transcription_status', { length: 50 }).default('pending'), // pending, processing, completed, failed
  transcript: text('transcript'), // Whisper output (RED if athlete-specific)
  transcriptLanguage: varchar('transcript_language', { length: 10 }), // en, es, de, etc.
  transcriptConfidence: real('transcript_confidence'), // 0-1
  
  // Embeddings for Semantic Search (local_embed_model)
  embedding: jsonb('embedding'), // Vector array
  embeddingModel: varchar('embedding_model', { length: 100 }), // 'local_embed_model_v1'
  embeddingDimensions: integer('embedding_dimensions'), // 384, 768, etc.
  
  // Privacy & Compliance
  zone: varchar('zone', { length: 10 }).notNull(), // RED, YELLOW, GREEN
  isPublic: boolean('is_public').default(false),
  athleteId: varchar('athlete_id', { length: 255 }), // If RED zone (references users.id)
  
  // Processing Metadata
  processingLog: jsonb('processing_log'), // [{timestamp, stage, status, details}]
  errorLog: text('error_log'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// DRILLS (Training exercises and techniques)
// ZONE: GREEN (public library) / RED (personalized assignments)
// ============================================
export const drills = pgTable('drills', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  
  // Basic Information
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  shortDescription: varchar('short_description', { length: 200 }),
  
  // Sport Classification (supports: football, basketball, soccer, ski_jumping, flag_football)
  sport: varchar('sport', { length: 50 }).notNull(),
  subSport: varchar('sub_sport', { length: 50 }), // '11v11', '7v7', 'flag', etc.
  category: varchar('category', { length: 50 }).notNull(), // strength, speed, agility, skill, technique, conditioning
  skillLevel: varchar('skill_level', { length: 50 }).notNull(), // beginner, intermediate, advanced, elite
  position: varchar('position', { length: 50 }), // QB, WR, Forward, Midfielder, Jumper, etc.
  
  // StarPath Integration
  garComponent: varchar('gar_component', { length: 50 }), // sprint, cod, vertical, strength, endurance
  ariConnection: varchar('ari_connection', { length: 50 }), // focus, discipline, time_management
  behaviorConnection: varchar('behavior_connection', { length: 50 }), // teamwork, resilience, leadership
  
  // Media Content
  primaryVideoId: varchar('primary_video_id', { length: 255 }).references(() => mediaAssets.id),
  alternateVideoIds: varchar('alternate_video_ids', { length: 255 }).array(), // Multiple angles/demonstrations
  imageUrls: text('image_urls').array(), // Diagrams, setup photos
  
  // Exercise Instructions
  instructionSteps: jsonb('instruction_steps'), // [{step: 1, text: '...', imageUrl: '...', duration: 30}]
  setupInstructions: text('setup_instructions'),
  
  // Exercise Parameters
  duration: integer('duration'), // minutes
  sets: integer('sets'),
  reps: varchar('reps', { length: 50 }), // '10' or '10-15' or 'max'
  restPeriod: integer('rest_period'), // seconds
  intensity: varchar('intensity', { length: 20 }), // low, medium, high, max
  
  // Equipment & Space
  equipment: varchar('equipment', { length: 100 }).array(), // ['cones', 'ball', 'ladder', 'resistance_bands']
  spaceRequired: varchar('space_required', { length: 100 }), // '20x20 yards', 'half court', '40m runway'
  participantCount: varchar('participant_count', { length: 50 }), // 'individual', '2-4', 'team'
  
  // Difficulty & Progression
  difficultyScore: real('difficulty_score'), // 1-10 scale
  prerequisites: varchar('prerequisites', { length: 255 }).array(), // Other drill IDs
  progressionPath: jsonb('progression_path'), // [{drillId: '...', order: 1, description: '...'}]
  regressionOptions: jsonb('regression_options'), // Easier modifications
  
  // AI-Generated Tags (local_fast_llm)
  aiTags: varchar('ai_tags', { length: 100 }).array(), // Auto-generated from transcript/video
  aiConfidence: real('ai_confidence'), // 0-1 confidence in AI tags
  manualTags: varchar('manual_tags', { length: 100 }).array(), // Coach-added tags
  
  // Coaching Points
  keyPoints: text('key_points').array(),
  commonMistakes: text('common_mistakes').array(),
  coachingCues: text('coaching_cues').array(),
  safetyNotes: text('safety_notes'),
  modifications: jsonb('modifications'), // For different skill levels/injuries
  
  // Success Metrics
  successMetrics: jsonb('success_metrics'), // {metric: 'completion_time', target: '< 30s', measurement: 'seconds'}
  assessmentCriteria: jsonb('assessment_criteria'), // How coaches evaluate performance
  
  // Gamification
  xpReward: integer('xp_reward').default(10), // StarPath XP
  achievementIds: varchar('achievement_ids', { length: 255 }).array(), // Unlock achievements
  
  // Publishing & Approval Workflow
  status: varchar('status', { length: 20 }).default('draft'), // draft, review, approved, published, archived
  approvedBy: varchar('approved_by', { length: 255 }), // Coach/admin userId
  approvedAt: timestamp('approved_at'),
  isPublic: boolean('is_public').default(false),
  isFeatured: boolean('is_featured').default(false),
  
  // Usage Statistics (YELLOW zone - aggregated)
  viewCount: integer('view_count').default(0),
  completionCount: integer('completion_count').default(0),
  averageRating: real('average_rating'),
  ratingCount: integer('rating_count').default(0),
  
  // Authorship
  createdBy: varchar('created_by', { length: 255 }), // Original creator userId
  sourceAttribution: text('source_attribution'), // If from external source
  license: varchar('license', { length: 100 }), // 'proprietary', 'cc-by', etc.
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// WORKOUT TEMPLATES (Collections of drills)
// ZONE: GREEN (public templates) / RED (personalized plans)
// ============================================
export const workoutTemplates = pgTable('workout_templates', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  
  // Basic Information
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  sport: varchar('sport', { length: 50 }).notNull(),
  
  // Target Audience
  skillLevel: varchar('skill_level', { length: 50 }).notNull(),
  ageRange: varchar('age_range', { length: 50 }), // '13-15', '16-18', 'college', 'adult'
  position: varchar('position', { length: 50 }), // Position-specific workouts
  
  // Workout Structure
  totalDuration: integer('total_duration'), // minutes
  warmupDuration: integer('warmup_duration'), // minutes
  mainDuration: integer('main_duration'), // minutes
  cooldownDuration: integer('cooldown_duration'), // minutes
  
  // Drill Sequences
  drillSequence: jsonb('drill_sequence'), // [{drillId, order, duration, sets, reps, restPeriod, notes}]
  warmupDrills: varchar('warmup_drills', { length: 255 }).array(),
  mainDrills: varchar('main_drills', { length: 255 }).array(),
  cooldownDrills: varchar('cooldown_drills', { length: 255 }).array(),
  
  // Goals & Outcomes
  primaryGoal: varchar('primary_goal', { length: 50 }), // speed, strength, skill, conditioning, recovery
  secondaryGoals: varchar('secondary_goals', { length: 50 }).array(),
  targetedSkills: varchar('targeted_skills', { length: 100 }).array(),
  expectedOutcomes: text('expected_outcomes'),
  
  // Frequency & Schedule
  recommendedFrequency: varchar('recommended_frequency', { length: 50 }), // 'daily', '3x/week', 'weekly'
  restDaysRequired: integer('rest_days_required'),
  seasonPhase: varchar('season_phase', { length: 50 }), // preseason, in-season, off-season
  
  // Equipment & Environment
  equipmentNeeded: varchar('equipment_needed', { length: 100 }).array(),
  facilityType: varchar('facility_type', { length: 50 }), // indoor, outdoor, gym, field
  
  // Publishing
  isPublic: boolean('is_public').default(false),
  isFeatured: boolean('is_featured').default(false),
  createdBy: varchar('created_by', { length: 255 }), // Coach userId
  
  // Usage Statistics
  usageCount: integer('usage_count').default(0),
  averageRating: real('average_rating'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// ATHLETE DRILL ASSIGNMENTS (RED ZONE)
// Personalized drill assignments with performance tracking
// ============================================
export const athleteDrillAssignments = pgTable('athlete_drill_assignments', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  
  // Assignment Details
  athleteId: varchar('athlete_id', { length: 255 }).notNull(), // references users.id - RED ZONE
  drillId: varchar('drill_id', { length: 255 }).references(() => drills.id),
  workoutId: varchar('workout_id', { length: 255 }).references(() => workoutTemplates.id),
  
  // Assignment Context
  assignedBy: varchar('assigned_by', { length: 255 }), // Coach userId
  assignmentType: varchar('assignment_type', { length: 50 }).default('practice'), // practice, homework, assessment, remedial
  dueDate: timestamp('due_date'),
  priority: varchar('priority', { length: 20 }).default('medium'), // low, medium, high, urgent
  notes: text('notes'), // Private coach notes for athlete
  
  // Custom Parameters (override defaults)
  customSets: integer('custom_sets'),
  customReps: varchar('custom_reps', { length: 50 }),
  customDuration: integer('custom_duration'),
  targetMetrics: jsonb('target_metrics'), // {metric: 'time', target: 25, unit: 'seconds'}
  
  // Completion Tracking
  status: varchar('status', { length: 20 }).default('assigned'), // assigned, in_progress, completed, skipped, overdue
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  timeSpent: integer('time_spent'), // seconds
  
  // Performance Data (RED ZONE - athlete-specific)
  performanceData: jsonb('performance_data'), // {reps_completed, time, metrics, notes}
  videoSubmissionId: varchar('video_submission_id', { length: 255 }).references(() => mediaAssets.id),
  coachFeedback: text('coach_feedback'),
  selfRating: integer('self_rating'), // 1-5
  selfReflection: text('self_reflection'),
  
  // Progress Tracking
  attemptNumber: integer('attempt_number').default(1),
  isReassigned: boolean('is_reassigned').default(false),
  previousAssignmentId: varchar('previous_assignment_id', { length: 255 }),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================
// DRILL RATINGS & REVIEWS (YELLOW ZONE)
// Aggregated feedback, can be anonymized
// ============================================
export const drillRatings = pgTable('drill_ratings', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  
  drillId: varchar('drill_id', { length: 255 }).notNull().references(() => drills.id),
  userId: varchar('user_id', { length: 255 }), // Can be anonymized for YELLOW zone
  userRole: varchar('user_role', { length: 50 }), // athlete, coach, parent
  
  // Ratings (1-5 scale)
  overallRating: integer('overall_rating').notNull(), // Overall experience
  difficultyRating: integer('difficulty_rating'), // How challenging it was
  effectivenessRating: integer('effectiveness_rating'), // Did it help
  instructionClarity: integer('instruction_clarity'), // Were instructions clear
  funFactor: integer('fun_factor'), // Was it engaging/enjoyable
  
  // Feedback
  comment: text('comment'),
  pros: text('pros').array(),
  cons: text('cons').array(),
  suggestedImprovements: text('suggested_improvements'),
  
  // Context
  skillLevelAtTime: varchar('skill_level_at_time', { length: 50 }), // Their level when they did it
  completionCount: integer('completion_count').default(1), // How many times they've done it
  
  // Privacy
  isAnonymized: boolean('is_anonymized').default(false),
  isPublicReview: boolean('is_public_review').default(false),
  
  // Moderation
  isApproved: boolean('is_approved').default(true),
  moderatedBy: varchar('moderated_by', { length: 255 }),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// DRILL COLLECTIONS (Curated sets for specific purposes)
// ZONE: GREEN (public) / RED (personalized)
// ============================================
export const drillCollections = pgTable('drill_collections', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  sport: varchar('sport', { length: 50 }).notNull(),
  
  // Collection Type
  collectionType: varchar('collection_type', { length: 50 }).notNull(), // 'featured', 'beginner_path', 'position_specific', 'injury_recovery', 'off_season'
  
  // Drills in Collection
  drillIds: varchar('drill_ids', { length: 255 }).array().notNull(),
  recommendedOrder: jsonb('recommended_order'), // [{drillId, order, why}]
  
  // Curation
  curatedBy: varchar('curated_by', { length: 255 }),
  isPublic: boolean('is_public').default(false),
  isFeatured: boolean('is_featured').default(false),
  
  // Usage
  viewCount: integer('view_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Zod validation schemas
export const insertMediaAssetSchema = createInsertSchema(mediaAssets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDrillSchema = createInsertSchema(drills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  completionCount: true,
  averageRating: true,
  ratingCount: true,
});

export const insertWorkoutTemplateSchema = createInsertSchema(workoutTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usageCount: true,
  averageRating: true,
});

export const insertAthleteDrillAssignmentSchema = createInsertSchema(athleteDrillAssignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDrillRatingSchema = createInsertSchema(drillRatings).omit({
  id: true,
  createdAt: true,
});

export const insertDrillCollectionSchema = createInsertSchema(drillCollections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

// TypeScript types
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = z.infer<typeof insertMediaAssetSchema>;

export type Drill = typeof drills.$inferSelect;
export type InsertDrill = z.infer<typeof insertDrillSchema>;

export type WorkoutTemplate = typeof workoutTemplates.$inferSelect;
export type InsertWorkoutTemplate = z.infer<typeof insertWorkoutTemplateSchema>;

export type AthleteDrillAssignment = typeof athleteDrillAssignments.$inferSelect;
export type InsertAthleteDrillAssignment = z.infer<typeof insertAthleteDrillAssignmentSchema>;

export type DrillRating = typeof drillRatings.$inferSelect;
export type InsertDrillRating = z.infer<typeof insertDrillRatingSchema>;

export type DrillCollection = typeof drillCollections.$inferSelect;
export type InsertDrillCollection = z.infer<typeof insertDrillCollectionSchema>;
