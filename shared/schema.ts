import { pgTable, serial, text, integer, boolean, timestamp, date, real, index, uuid, unique, json, jsonb, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  measurementSystem: text("measurement_system"),
  phoneNumber: text("phone_number"),
});

// Athlete Profiles
export const athleteProfiles = pgTable("athlete_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  age: integer("age"),
  height: text("height"),
  weight: text("weight"),
  school: text("school"),
  graduationYear: integer("graduation_year"),
  sportsInterest: text("sports_interest").array(),
  position: text("position"),
  bio: text("bio"),
  achievements: text("achievements").array(),
  stats: jsonb("stats"),
  socialMedia: jsonb("social_media"),
  updatedAt: timestamp("updated_at").defaultNow(),
  parentEmail: text("parent_email"),
  verifiedStatus: boolean("verified_status").default(false),
});

// AI Coach/Avatar feature
export const aiCoaches = pgTable("ai_coaches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sport: text("sport").notNull(),
  specialty: text("specialty").notNull(),
  personality: text("personality").notNull(),
  avatarImage: text("avatar_image"),
  systemPrompt: text("system_prompt").notNull(),
  knowledgeBase: text("knowledge_base").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiCoachSessions = pgTable("ai_coach_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  coachId: integer("coach_id").notNull().references(() => aiCoaches.id),
  topic: text("topic"),
  userGoals: text("user_goals"),
  startedAt: timestamp("started_at").defaultNow(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  active: boolean("active").default(true),
  sessionContext: json("session_context").$type<Record<string, any>>().default({}),
});

export const aiCoachMessages = pgTable("ai_coach_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => aiCoachSessions.id),
  senderId: integer("sender_id").references(() => users.id),
  coachId: integer("coach_id").references(() => aiCoaches.id),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"),
  attachmentUrl: text("attachment_url"),
  sentAt: timestamp("sent_at").defaultNow(),
});

export const sportKnowledgeBases = pgTable("sport_knowledge_bases", {
  id: serial("id").primaryKey(),
  sport: text("sport").notNull().unique(),
  content: text("content").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  version: text("version").default("1.0"),
});

export const userCoachInteractions = pgTable("user_coach_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  coachId: integer("coach_id").notNull().references(() => aiCoaches.id),
  interactionType: text("interaction_type").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: json("metadata").$type<Record<string, any>>().default({}),
});

export const coachFeedback = pgTable("coach_feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  coachId: integer("coach_id").notNull().references(() => aiCoaches.id),
  sessionId: integer("session_id").references(() => aiCoachSessions.id),
  rating: integer("rating"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const coachRecommendations = pgTable("coach_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  coachId: integer("coach_id").notNull().references(() => aiCoaches.id),
  recommendationType: text("recommendation_type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: json("content").$type<Record<string, any>>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  feedback: text("feedback"),
});

// Video model
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  sportType: text("sport_type").notNull(),
  duration: integer("duration"), // in seconds
  filePath: text("file_path").notNull(),
  thumbnailPath: text("thumbnail_path"),
  uploadDate: timestamp("upload_date").defaultNow(),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  processed: boolean("processed").default(false),
  analyzed: boolean("analyzed").default(false),
  status: text("status").default("pending"), // pending, processing, ready, error
  public: boolean("public").default(false),
});

// Video Analysis
export const videoAnalyses = pgTable("video_analyses", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  analysisData: jsonb("analysis_data").notNull(),
  detectedObjects: text("detected_objects").array(),
  motionData: jsonb("motion_data"),
  overallScore: real("overall_score"),
  feedback: text("feedback").array(),
  improvementTips: text("improvement_tips").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Video Highlights
export const videoHighlights = pgTable("video_highlights", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: real("start_time").notNull(), // in seconds
  endTime: real("end_time").notNull(), // in seconds
  thumbnailPath: text("thumbnail_path"),
  highlightPath: text("highlight_path"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  featured: boolean("featured").default(false),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  status: text("status").default("processing"), // processing, ready, error
  aiGenerated: boolean("ai_generated").default(false),
  aiPrompt: text("ai_prompt"),
  sportType: text("sport_type"),
  garScore: real("gar_score"),
  scoreBreakdown: jsonb("score_breakdown"),
  includeOnHomePage: boolean("include_on_home_page").default(false),
});

// Highlight Generator Configuration
export const highlightGeneratorConfigs = pgTable("highlight_generator_configs", {
  id: serial("id").primaryKey(),
  sportType: text("sport_type").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  promptTemplate: text("prompt_template").notNull(),
  systemPrompt: text("system_prompt").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  active: boolean("active").default(true),
  minConfidence: real("min_confidence").default(0.7),
  modelParams: jsonb("model_params"),
  aiProvider: text("ai_provider").default("anthropic"),
  maxResponseTokens: integer("max_response_tokens").default(2000),
  temperature: real("temperature").default(0.7),
  detectionClasses: text("detection_classes").array(),
  highlightMinDuration: real("highlight_min_duration").default(3),
  highlightMaxDuration: real("highlight_max_duration").default(15),
  autoPublish: boolean("auto_publish").default(false),
  criteria: jsonb("criteria"),
});

// API Keys - updated to match actual database structure
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key_type: text("key_type").notNull(),
  key_value: text("key_value").notNull(),
  added_at: timestamp("added_at").defaultNow(),
  last_used: timestamp("last_used"),
  is_active: boolean("is_active").default(true),
});

// Content Blocks
export const contentBlocks = pgTable("content_blocks", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").unique().notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  section: text("section").notNull(),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  lastUpdatedBy: integer("last_updated_by").references(() => users.id),
  metadata: jsonb("metadata"),
});

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  authorId: integer("author_id").references(() => users.id),
  publishDate: timestamp("publish_date"),
  category: text("category"),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  coverImage: text("cover_image"),
});

// Featured Athletes
export const featuredAthletes = pgTable("featured_athletes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  featuredStats: text("featured_stats"),
  featuredDate: timestamp("featured_date"),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  starRating: integer("star_rating"),
  coverImage: text("cover_image"),
  featuredVideo: text("featured_video"),
  highlightText: text("highlight_text"),
  sportPosition: text("sport_position"),
});

// GAR Categories
export const garCategories = pgTable("gar_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sportType: text("sport_type"),
  description: text("description"),
  weight: real("weight").default(1.0),
  iconName: text("icon_name"),
  color: text("color"),
  active: boolean("active").default(true),
});

// GAR Subcategories
export const garSubcategories = pgTable("gar_subcategories", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => garCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  weight: real("weight").default(1.0),
  iconName: text("icon_name"),
  active: boolean("active").default(true),
});

// GAR Athlete Ratings
export const garAthleteRatings = pgTable("gar_athlete_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => garCategories.id),
  subcategoryId: integer("subcategory_id").references(() => garSubcategories.id),
  rating: real("rating").notNull(),
  videoId: integer("video_id").references(() => videos.id),
  source: text("source").default("manual"), // manual, ai, coach
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// GAR Rating History
export const garRatingHistory = pgTable("gar_rating_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  ratings: jsonb("ratings").notNull(), // Stored as { categoryId: rating }
  totalScore: real("total_score"),
  recordedAt: timestamp("recorded_at").defaultNow(),
  source: text("source").default("analysis"), // analysis, manual, coach
  notes: text("notes"),
});

// Athlete Star Profiles
export const athleteStarProfiles = pgTable("athlete_star_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  starLevel: integer("star_level").default(1),
  metrics: jsonb("metrics"),
  traits: jsonb("traits"),
  xpLevel: integer("xp_level").default(0),
  active: boolean("active").default(true),
  avatar: text("avatar"),
  rank: text("rank"),
  profileId: integer("profile_id"),
  filmExpectations: text("film_expectations"),
  name: text("name"),
  trainingFocus: text("training_focus"),
  sport: text("sport"),
  position: text("position"),
  ageGroup: text("age_group"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Road to 5 Star Storyline
export const athleteStarPath = pgTable("athlete_star_path", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  currentStarLevel: integer("current_star_level").default(1),
  targetStarLevel: integer("target_star_level").default(2),
  storylinePhase: text("storyline_phase").notNull().default("beginning"),
  progress: integer("progress").default(0), // Progress percentage to next star level
  sportType: text("sport_type"),
  position: text("position"),
  milestones: jsonb("milestones").$type<Record<string, any>>().default({}),
  achievements: jsonb("achievements").$type<Record<string, any>>().default({}),
  completedDrills: integer("completed_drills").default(0),
  verifiedWorkouts: integer("verified_workouts").default(0),
  skillTreeProgress: integer("skill_tree_progress").default(0),
  physicalAttributes: jsonb("physical_attributes").$type<Record<string, number>>().default({}),
  technicalAttributes: jsonb("technical_attributes").$type<Record<string, number>>().default({}),
  mentalAttributes: jsonb("mental_attributes").$type<Record<string, number>>().default({}),
  storylineStarted: timestamp("storyline_started").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  storylineActive: boolean("storyline_active").default(true),
  nextMilestone: text("next_milestone"),
  xpTotal: integer("xp_total").default(0),
  levelThresholds: jsonb("level_thresholds").$type<number[]>().default([]),
});

// Workout Verification System - for real-world workout verification
export const workoutVerifications = pgTable("workout_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  exerciseType: text("exercise_type").notNull(), // e.g., "push_ups", "running", "shooting_drills"
  targetAmount: integer("target_amount").notNull(), // Number of reps or minutes
  completedAmount: integer("completed_amount").default(0),
  status: text("status").default("pending").notNull(), // pending, completed, verified, rejected
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  verifiedAt: timestamp("verified_at"),
  verificationMethod: text("verification_method").notNull(), // video, sensor, coach, ai
  feedback: text("feedback"),
  motionAnalysis: jsonb("motion_analysis"), // AI analysis data
  videoUrl: text("video_url"), // Recording of the workout
  thumbnailUrl: text("thumbnail_url"),
  xpEarned: integer("xp_earned").default(0),
  attributeGains: jsonb("attribute_gains").$type<Record<string, number>>().default({}),
  isAiVerified: boolean("is_ai_verified").default(false),
  aiConfidenceScore: real("ai_confidence_score"),
  formQuality: integer("form_quality"), // 1-100 score on form quality
  repAccuracy: real("rep_accuracy").default(0), // 0.0-1.0 score on accuracy
  starPathId: integer("star_path_id").references(() => athleteStarPath.id),
  skillNodeId: integer("skill_node_id").references(() => skillTreeNodes.id),
});

// Workout Verification Checkpoints - tracking progress during workout
export const workoutVerificationCheckpoints = pgTable("workout_verification_checkpoints", {
  id: serial("id").primaryKey(),
  workoutVerificationId: integer("workout_verification_id").notNull().references(() => workoutVerifications.id),
  timestamp: timestamp("timestamp").defaultNow(),
  checkpointType: text("checkpoint_type").notNull(), // start, progress, complete
  completedAmount: integer("completed_amount").default(0),
  notes: text("notes"),
  imageUrl: text("image_url"), // Screenshot or sensor data
  motionData: jsonb("motion_data"), // Motion tracking data
  confidence: real("confidence"), // AI confidence score 0.0-1.0
  feedback: text("feedback"), // AI feedback on form
});

// Relations for workout verification and star path
export const athleteStarPathRelations = relations(athleteStarPath, ({ one, many }) => ({
  user: one(users, {
    fields: [athleteStarPath.userId],
    references: [users.id],
  }),
  workoutVerifications: many(workoutVerifications, {
    relationName: "starPathWorkouts",
  }),
}));

export const workoutVerificationsRelations = relations(workoutVerifications, ({ one, many }) => ({
  user: one(users, {
    fields: [workoutVerifications.userId],
    references: [users.id],
  }),
  starPath: one(athleteStarPath, {
    fields: [workoutVerifications.starPathId],
    references: [athleteStarPath.id],
    relationName: "starPathWorkouts",
  }),
  skillNode: one(skillTreeNodes, {
    fields: [workoutVerifications.skillNodeId],
    references: [skillTreeNodes.id],
  }),
  checkpoints: many(workoutVerificationCheckpoints),
}));

export const workoutVerificationCheckpointsRelations = relations(workoutVerificationCheckpoints, ({ one }) => ({
  workoutVerification: one(workoutVerifications, {
    fields: [workoutVerificationCheckpoints.workoutVerificationId],
    references: [workoutVerifications.id],
  }),
}));

// Combine Tour Events
export const combineTourEvents = pgTable("combine_tour_events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  country: text("country").default("USA"),
  venueDetails: text("venue_details"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  registrationUrl: text("registration_url"),
  description: text("description"),
  sportTypes: text("sport_types").array(),
  ageGroups: text("age_groups").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: text("status").default("upcoming"), // upcoming, ongoing, completed, cancelled
  featured: boolean("featured").default(false),
  capacity: integer("capacity"),
  registeredCount: integer("registered_count").default(0),
  price: real("price"),
  discountCode: text("discount_code"),
  bannerImage: text("banner_image"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  slug: text("slug").unique(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  activeNetworkId: text("active_network_id"),
});

// Event Registrations
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventId: integer("event_id").notNull().references(() => combineTourEvents.id),
  status: text("status").notNull().default("registered"), // registered, confirmed, cancelled, waitlisted
  externalId: text("external_id"), // ID in the external registration system
  registeredAt: timestamp("registered_at").defaultNow(),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, refunded, failed
  paymentAmount: real("payment_amount"),
  notes: text("notes"),
  checkedIn: boolean("checked_in").default(false),
  checkedInAt: timestamp("checked_in_at"),
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  registrationId: integer("registration_id").notNull().references(() => registrations.id),
  amount: real("amount").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull(), // success, pending, failed, refunded
  externalId: text("external_id"), // ID in the payment processor's system
  processedAt: timestamp("processed_at").defaultNow(),
  paymentMethod: text("payment_method"), // credit_card, paypal, etc.
  transactionData: jsonb("transaction_data"),
});

// NCAA Schools Database
export const ncaaSchools = pgTable("ncaa_schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  nickname: text("nickname"),
  abbreviation: text("abbreviation"),
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  division: text("division").notNull(), // NCAA Division I, II, III
  conference: text("conference"),
  website: text("website"),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  notes: text("notes"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// NCAA Eligibility
export const ncaaEligibility = pgTable("ncaa_eligibility", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  coreCoursesCompleted: integer("core_courses_completed").default(0),
  coreCoursesRequired: integer("core_courses_required").default(16),
  gpa: real("gpa"),
  gpaMeetsRequirement: boolean("gpa_meets_requirement").default(false),
  testScores: text("test_scores"),
  testScoresMeetRequirement: boolean("test_scores_meet_requirement").default(false),
  hasTranslatedDocuments: boolean("has_translated_documents").default(false),
  amateurismStatus: text("amateurism_status").default("incomplete"),
  ncaaDivision: text("ncaa_division").default("division_i"),
  overallEligibilityStatus: text("overall_eligibility_status").default("incomplete"),
  academicRedshirt: boolean("academic_redshirt").default(false),
  qualificationPercentage: integer("qualification_percentage").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const athleticDepartments = pgTable("athletic_departments", {
  id: serial("id").primaryKey(),
  school_id: integer("school_id").notNull().references(() => ncaaSchools.id),
  director_name: text("director_name"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  website: text("website"),
  social_media: jsonb("social_media"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const sportPrograms = pgTable("sport_programs", {
  id: serial("id").primaryKey(),
  school_id: integer("school_id").notNull().references(() => ncaaSchools.id),
  sport: text("sport").notNull(),
  division: text("division"),
  gender: text("gender").notNull(), // Men, Women, Coed
  website: text("website"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  facilities: text("facilities"),
  achievements: text("achievements"),
  roster_size: integer("roster_size"),
  scholarship_info: text("scholarship_info"),
  last_updated: timestamp("last_updated").defaultNow(),
}, (table) => {
  return {
    sportProgramUnique: unique().on(table.school_id, table.sport, table.gender),
  };
});

export const coachingStaff = pgTable("coaching_staff", {
  id: serial("id").primaryKey(),
  sport_program_id: integer("sport_program_id").notNull().references(() => sportPrograms.id),
  name: text("name").notNull(),
  position: text("position").notNull(), // Head Coach, Assistant Coach, etc.
  bio: text("bio"),
  email: text("email"),
  phone: text("phone"),
  alma_mater: text("alma_mater"),
  years_at_school: integer("years_at_school"),
  previous_schools: text("previous_schools").array(),
  photo_url: text("photo_url"),
  twitter: text("twitter"),
  last_updated: timestamp("last_updated").defaultNow(),
  linkedin: text("linkedin"),
});

export const recruitingContacts = pgTable("recruiting_contacts", {
  id: serial("id").primaryKey(),
  sport_program_id: integer("sport_program_id").notNull().references(() => sportPrograms.id),
  name: text("name").notNull(),
  position: text("position").notNull(),
  email: text("email"),
  phone: text("phone"),
  regions: text("regions").array(), // Geographic regions this contact handles
  recruiting_class_years: text("recruiting_class_years").array(), // Which graduation years they're recruiting
  notes: text("notes"),
  preferred_contact_method: text("preferred_contact_method"),
  last_updated: timestamp("last_updated").defaultNow(),
});

// Skill Tree and Training System
export const skillTreeNodes = pgTable("skill_tree_nodes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sportType: text("sport_type").notNull(),
  position: text("position"),
  level: integer("level").notNull().default(1),
  xpToUnlock: integer("xp_to_unlock").default(0),
  iconUrl: text("icon_url"),
  unlockCriteria: jsonb("unlock_criteria"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  active: boolean("active").default(true),
  prerequisiteSkills: text("prerequisite_skills").array(),
  skillCategory: text("skill_category").notNull(), // e.g., "Offensive", "Defensive", "Physical"
  difficulty: text("difficulty").default("intermediate"), // beginner, intermediate, advanced, elite
});

export const skillTreeRelationships = pgTable("skill_tree_relationships", {
  id: serial("id").primaryKey(),
  parentNodeId: integer("parent_node_id").notNull().references(() => skillTreeNodes.id),
  childNodeId: integer("child_node_id").notNull().references(() => skillTreeNodes.id),
  relationshipType: text("relationship_type").default("requires"), // requires, enhances, unlocks
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    relationshipUnique: unique().on(table.parentNodeId, table.childNodeId),
  };
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skillNodeId: integer("skill_node_id").notNull().references(() => skillTreeNodes.id),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  unlocked: boolean("unlocked").default(false),
  unlockedAt: timestamp("unlocked_at"),
  lastTrainedAt: timestamp("last_trained_at"),
  notes: text("notes"),
}, (table) => {
  return {
    userSkillUnique: unique().on(table.userId, table.skillNodeId),
  };
});

export const trainingDrills = pgTable("training_drills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sport: text("sport").notNull(),
  position: text("position"),
  difficulty: text("difficulty").default("intermediate"), // beginner, intermediate, advanced, elite
  estimatedDuration: integer("estimated_duration"), // in minutes
  equipmentNeeded: text("equipment_needed").array(),
  videoUrl: text("video_url"),
  instructions: text("instructions").array(),
  tips: text("tips").array(),
  skillNodeId: integer("skill_node_id").references(() => skillTreeNodes.id),
  xpReward: integer("xp_reward").default(10),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  active: boolean("active").default(true),
  tags: text("tags").array(),
  category: text("category"),
  thumbnailUrl: text("thumbnail_url"),
});

export const trainingDrillsExtended = pgTable("training_drills_extended", {
  id: serial("id").primaryKey(),
  drillId: integer("drill_id").notNull().references(() => trainingDrills.id),
  fieldSetup: text("field_setup"),
  coachTips: text("coach_tips"),
  variations: jsonb("variations"),
  progressions: jsonb("progressions"),
  metrics: text("metrics").array(), // What to measure for this drill
  idealOutcomes: text("ideal_outcomes"),
  commonErrors: text("common_errors").array(),
  videoAnnotations: jsonb("video_annotations"),
  recommendedFrequency: text("recommended_frequency"),
  warmupRequired: boolean("warmup_required").default(true),
  relatedDrillIds: integer("related_drill_ids").array(),
});

export const userDrillProgress = pgTable("user_drill_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  drillId: integer("drill_id").notNull().references(() => trainingDrills.id),
  completionCount: integer("completion_count").default(0),
  lastCompletedAt: timestamp("last_completed_at"),
  favorite: boolean("favorite").default(false),
  notes: text("notes"),
  personalBests: jsonb("personal_bests"),
  trend: text("trend"), // improving, steady, declining
  feedback: text("feedback"),
  rating: integer("rating"), // User rating 1-5
  totalTimeSpent: integer("total_time_spent"), // in minutes
}, (table) => {
  return {
    userDrillUnique: unique().on(table.userId, table.drillId),
  };
});

// CyberShield Security - User tokens
export const userTokens = pgTable("user_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").unique().notNull(),
  tokenType: text("token_type").default("access"), // access, refresh, remember, reset
  description: text("description"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  isRevoked: boolean("is_revoked").default(false),
});

// User Agreements
export const userAgreements = pgTable("user_agreements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  agreementType: text("agreement_type").notNull(), // tos, privacy_policy, parental_consent
  version: text("version").notNull(),
  acceptedAt: timestamp("accepted_at").defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  videos: many(videos),
  athleteProfile: one(athleteProfiles, {
    fields: [users.id],
    references: [athleteProfiles.userId],
  }),
  starProfile: one(athleteStarProfiles, {
    fields: [users.id],
    references: [athleteStarProfiles.userId],
  }),
  starPath: one(athleteStarPath, {
    fields: [users.id],
    references: [athleteStarPath.userId],
  }),
  featuredAthlete: one(featuredAthletes, {
    fields: [users.id],
    references: [featuredAthletes.userId],
  }),
  tokens: many(userTokens),
  garRatings: many(garAthleteRatings),
  garHistory: many(garRatingHistory),
  aiCoachSessions: many(aiCoachSessions),
  skills: many(skills),
  drillProgress: many(userDrillProgress),
}));

export const videoRelations = relations(videos, ({ one, many }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  analysis: one(videoAnalyses, {
    fields: [videos.id],
    references: [videoAnalyses.videoId],
  }),
  highlights: many(videoHighlights),
}));

export const videoAnalysisRelations = relations(videoAnalyses, ({ one }) => ({
  video: one(videos, {
    fields: [videoAnalyses.videoId],
    references: [videos.id],
  }),
}));

export const videoHighlightRelations = relations(videoHighlights, ({ one }) => ({
  video: one(videos, {
    fields: [videoHighlights.videoId],
    references: [videos.id],
  }),
  user: one(users, {
    fields: [videoHighlights.userId],
    references: [users.id],
  }),
}));

export const athleteProfileRelations = relations(athleteProfiles, ({ one }) => ({
  user: one(users, {
    fields: [athleteProfiles.userId],
    references: [users.id],
  }),
}));

export const blogPostRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

export const featuredAthleteRelations = relations(featuredAthletes, ({ one }) => ({
  user: one(users, {
    fields: [featuredAthletes.userId],
    references: [users.id],
  }),
}));

export const garCategoryRelations = relations(garCategories, ({ many }) => ({
  subcategories: many(garSubcategories),
  ratings: many(garAthleteRatings),
}));

export const garSubcategoryRelations = relations(garSubcategories, ({ one, many }) => ({
  category: one(garCategories, {
    fields: [garSubcategories.categoryId],
    references: [garCategories.id],
  }),
  ratings: many(garAthleteRatings),
}));

export const garAthleteRatingRelations = relations(garAthleteRatings, ({ one }) => ({
  user: one(users, {
    fields: [garAthleteRatings.userId],
    references: [users.id],
  }),
  category: one(garCategories, {
    fields: [garAthleteRatings.categoryId],
    references: [garCategories.id],
  }),
  subcategory: one(garSubcategories, {
    fields: [garAthleteRatings.subcategoryId],
    references: [garSubcategories.id],
  }),
  video: one(videos, {
    fields: [garAthleteRatings.videoId],
    references: [videos.id],
  }),
}));

export const garRatingHistoryRelations = relations(garRatingHistory, ({ one }) => ({
  user: one(users, {
    fields: [garRatingHistory.userId],
    references: [users.id],
  }),
}));

export const athleteStarProfileRelations = relations(athleteStarProfiles, ({ one }) => ({
  user: one(users, {
    fields: [athleteStarProfiles.userId],
    references: [users.id],
  }),
}));

export const userTokenRelations = relations(userTokens, ({ one }) => ({
  user: one(users, {
    fields: [userTokens.userId],
    references: [users.id],
  }),
}));

export const userAgreementRelations = relations(userAgreements, ({ one }) => ({
  user: one(users, {
    fields: [userAgreements.userId],
    references: [users.id],
  }),
}));

// NCAA Schools database relations
export const ncaaSchoolsRelations = relations(ncaaSchools, ({ one, many }) => ({
  athleticDepartment: one(athleticDepartments, {
    fields: [ncaaSchools.id],
    references: [athleticDepartments.school_id],
  }),
  sportPrograms: many(sportPrograms),
}));

export const athleticDepartmentsRelations = relations(athleticDepartments, ({ one }) => ({
  school: one(ncaaSchools, {
    fields: [athleticDepartments.school_id],
    references: [ncaaSchools.id],
  }),
}));

export const sportProgramsRelations = relations(sportPrograms, ({ one, many }) => ({
  school: one(ncaaSchools, {
    fields: [sportPrograms.school_id],
    references: [ncaaSchools.id],
  }),
  coachingStaff: many(coachingStaff),
  recruitingContacts: many(recruitingContacts),
}));

export const coachingStaffRelations = relations(coachingStaff, ({ one }) => ({
  sportProgram: one(sportPrograms, {
    fields: [coachingStaff.sport_program_id],
    references: [sportPrograms.id],
  }),
}));

export const recruitingContactsRelations = relations(recruitingContacts, ({ one }) => ({
  sportProgram: one(sportPrograms, {
    fields: [recruitingContacts.sport_program_id],
    references: [sportPrograms.id],
  }),
}));

// Event registration and payment relations
export const combineTourEventRelations = relations(combineTourEvents, ({ many }) => ({
  registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one, many }) => ({
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
  event: one(combineTourEvents, {
    fields: [registrations.eventId],
    references: [combineTourEvents.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  registration: one(registrations, {
    fields: [payments.registrationId],
    references: [registrations.id],
  }),
}));

// AI Coach relations
export const aiCoachesRelations = relations(aiCoaches, ({ many }) => ({
  sessions: many(aiCoachSessions),
  messages: many(aiCoachMessages),
  interactions: many(userCoachInteractions),
  feedback: many(coachFeedback),
  recommendations: many(coachRecommendations),
}));

export const aiCoachSessionsRelations = relations(aiCoachSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [aiCoachSessions.userId],
    references: [users.id],
  }),
  coach: one(aiCoaches, {
    fields: [aiCoachSessions.coachId],
    references: [aiCoaches.id],
  }),
  messages: many(aiCoachMessages),
}));

export const aiCoachMessagesRelations = relations(aiCoachMessages, ({ one }) => ({
  session: one(aiCoachSessions, {
    fields: [aiCoachMessages.sessionId],
    references: [aiCoachSessions.id],
  }),
  sender: one(users, {
    fields: [aiCoachMessages.senderId],
    references: [users.id],
  }),
  coach: one(aiCoaches, {
    fields: [aiCoachMessages.coachId],
    references: [aiCoaches.id],
  }),
}));

export const userCoachInteractionsRelations = relations(userCoachInteractions, ({ one }) => ({
  user: one(users, {
    fields: [userCoachInteractions.userId],
    references: [users.id],
  }),
  coach: one(aiCoaches, {
    fields: [userCoachInteractions.coachId],
    references: [aiCoaches.id],
  }),
}));

export const coachFeedbackRelations = relations(coachFeedback, ({ one }) => ({
  user: one(users, {
    fields: [coachFeedback.userId],
    references: [users.id],
  }),
  coach: one(aiCoaches, {
    fields: [coachFeedback.coachId],
    references: [aiCoaches.id],
  }),
  session: one(aiCoachSessions, {
    fields: [coachFeedback.sessionId],
    references: [aiCoachSessions.id],
  }),
}));

export const coachRecommendationsRelations = relations(coachRecommendations, ({ one }) => ({
  user: one(users, {
    fields: [coachRecommendations.userId],
    references: [users.id],
  }),
  coach: one(aiCoaches, {
    fields: [coachRecommendations.coachId],
    references: [aiCoaches.id],
  }),
}));

// Skill Tree relations
export const skillTreeNodesRelations = relations(skillTreeNodes, ({ many }) => ({
  parentRelationships: many(skillTreeRelationships, { relationName: "parent" }),
  childRelationships: many(skillTreeRelationships, { relationName: "child" }),
  drills: many(trainingDrills),
  userSkills: many(skills),
}));

export const skillTreeRelationshipsRelations = relations(skillTreeRelationships, ({ one }) => ({
  parent: one(skillTreeNodes, {
    fields: [skillTreeRelationships.parentNodeId],
    references: [skillTreeNodes.id],
    relationName: "parent",
  }),
  child: one(skillTreeNodes, {
    fields: [skillTreeRelationships.childNodeId],
    references: [skillTreeNodes.id],
    relationName: "child",
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
  skillNode: one(skillTreeNodes, {
    fields: [skills.skillNodeId],
    references: [skillTreeNodes.id],
  }),
}));

export const trainingDrillsRelations = relations(trainingDrills, ({ one, many }) => ({
  skillNode: one(skillTreeNodes, {
    fields: [trainingDrills.skillNodeId],
    references: [skillTreeNodes.id],
  }),
  extended: one(trainingDrillsExtended, {
    fields: [trainingDrills.id],
    references: [trainingDrillsExtended.drillId],
  }),
  userProgress: many(userDrillProgress),
}));

export const trainingDrillsExtendedRelations = relations(trainingDrillsExtended, ({ one }) => ({
  drill: one(trainingDrills, {
    fields: [trainingDrillsExtended.drillId],
    references: [trainingDrills.id],
  }),
}));

export const userDrillProgressRelations = relations(userDrillProgress, ({ one }) => ({
  user: one(users, {
    fields: [userDrillProgress.userId],
    references: [users.id],
  }),
  drill: one(trainingDrills, {
    fields: [userDrillProgress.drillId],
    references: [trainingDrills.id],
  }),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  uploadDate: true,
  views: true,
  likes: true,
  processed: true,
  analyzed: true,
  status: true,
});

export const insertVideoHighlightSchema = createInsertSchema(videoHighlights).omit({
  id: true,
  createdAt: true,
  views: true,
  likes: true,
  status: true,
});

export const insertHighlightGeneratorConfigSchema = createInsertSchema(highlightGeneratorConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentBlockSchema = createInsertSchema(contentBlocks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeaturedAthleteSchema = createInsertSchema(featuredAthletes).omit({
  id: true,
  startDate: true,
});

export const insertAthleteProfileSchema = createInsertSchema(athleteProfiles).omit({
  id: true,
  updatedAt: true,
});

export const insertCombineTourEventSchema = createInsertSchema(combineTourEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  registeredCount: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  registeredAt: true,
  checkedInAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  processedAt: true,
});

export const insertNcaaSchoolSchema = createInsertSchema(ncaaSchools).omit({
  id: true,
  lastUpdated: true,
});

export const insertNcaaEligibilitySchema = createInsertSchema(ncaaEligibility).omit({
  id: true,
  lastUpdated: true,
});

export const insertAthleticDepartmentSchema = createInsertSchema(athleticDepartments).omit({
  id: true,
  lastUpdated: true,
});

export const insertSportProgramSchema = createInsertSchema(sportPrograms).omit({
  id: true,
  last_updated: true,
});

export const insertCoachingStaffSchema = createInsertSchema(coachingStaff).omit({
  id: true,
  last_updated: true,
});

export const insertRecruitingContactSchema = createInsertSchema(recruitingContacts).omit({
  id: true,
  last_updated: true,
});

export const insertSkillTreeNodeSchema = createInsertSchema(skillTreeNodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillTreeRelationshipSchema = createInsertSchema(skillTreeRelationships).omit({
  id: true,
  createdAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  unlockedAt: true,
  lastTrainedAt: true,
});

export const insertTrainingDrillSchema = createInsertSchema(trainingDrills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserDrillProgressSchema = createInsertSchema(userDrillProgress).omit({
  id: true,
  lastCompletedAt: true,
});

export const insertUserTokenSchema = createInsertSchema(userTokens).omit({
  id: true,
  createdAt: true,
  lastUsedAt: true,
  isRevoked: true,
});

export const insertUserAgreementSchema = createInsertSchema(userAgreements).omit({
  id: true,
  acceptedAt: true,
});

// Star Path and Workout Verification Schemas
export const insertAthleteStarPathSchema = createInsertSchema(athleteStarPath).omit({
  id: true,
  storylineStarted: true,
  lastUpdated: true,
});

export const insertWorkoutVerificationSchema = createInsertSchema(workoutVerifications).omit({
  id: true,
  startedAt: true,
  completedAt: true,
  verifiedAt: true,
  aiConfidenceScore: true,
  formQuality: true,
  repAccuracy: true,
  xpEarned: true,
});

export const insertWorkoutVerificationCheckpointSchema = createInsertSchema(workoutVerificationCheckpoints).omit({
  id: true,
  timestamp: true,
});

// AI Coach Schemas
export const insertAiCoachSchema = createInsertSchema(aiCoaches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiCoachSessionSchema = createInsertSchema(aiCoachSessions).omit({
  id: true,
  startedAt: true,
  lastMessageAt: true,
});

export const insertAiCoachMessageSchema = createInsertSchema(aiCoachMessages).omit({
  id: true,
  sentAt: true,
});

export const insertSportKnowledgeBaseSchema = createInsertSchema(sportKnowledgeBases).omit({
  id: true,
  lastUpdated: true,
});

export const insertUserCoachInteractionSchema = createInsertSchema(userCoachInteractions).omit({
  id: true,
  timestamp: true,
});

export const insertCoachFeedbackSchema = createInsertSchema(coachFeedback).omit({
  id: true,
  createdAt: true,
});

export const insertCoachRecommendationSchema = createInsertSchema(coachRecommendations).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type VideoHighlight = typeof videoHighlights.$inferSelect;
export type InsertVideoHighlight = z.infer<typeof insertVideoHighlightSchema>;

export type HighlightGeneratorConfig = typeof highlightGeneratorConfigs.$inferSelect;
export type InsertHighlightGeneratorConfig = z.infer<typeof insertHighlightGeneratorConfigSchema>;

export type VideoAnalysis = typeof videoAnalyses.$inferSelect;

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type InsertContentBlock = z.infer<typeof insertContentBlockSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type FeaturedAthlete = typeof featuredAthletes.$inferSelect;
export type InsertFeaturedAthlete = z.infer<typeof insertFeaturedAthleteSchema>;

export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type InsertAthleteProfile = z.infer<typeof insertAthleteProfileSchema>;

// Create insert schemas for these tables
export const insertGarCategorySchema = createInsertSchema(garCategories).omit({ id: true });
export const insertGarSubcategorySchema = createInsertSchema(garSubcategories).omit({ id: true });
export const insertGarAthleteRatingSchema = createInsertSchema(garAthleteRatings).omit({ id: true, createdAt: true });
export const insertGarRatingHistorySchema = createInsertSchema(garRatingHistory).omit({ id: true, recordedAt: true });
export const insertAthleteStarProfileSchema = createInsertSchema(athleteStarProfiles).omit({ id: true, reachedAt: true, lastUpdate: true });
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ id: true, createdAt: true, lastUsedAt: true });

// Scout-related tables
export const socialMediaScouts = pgTable("social_media_scouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  active: boolean("active").default(true),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastRun: timestamp("last_run"),
  sportFocus: text("sport_focus").array(),
  locationFocus: text("location_focus").array(),
  keywordsToTrack: text("keywords_to_track").array(),
  platformsToSearch: text("platforms_to_search").array(),
  ageRangeMin: integer("age_range_min").default(12),
  ageRangeMax: integer("age_range_max").default(18),
  discoveryCount: integer("discovery_count").default(0),
  position: text("position"),
  minHeight: integer("min_height"),
  minWeight: integer("min_weight"),
  lastRunAt: timestamp("last_run_at"),
  customCriteria: jsonb("custom_criteria"),
});

export const mediaPartnershipScouts = pgTable("media_partnership_scouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  active: boolean("active").default(true),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastRun: timestamp("last_run"),
  lastUpdated: timestamp("last_updated"),
  lastRunAt: timestamp("last_run_at"),
  mediaTypes: text("media_types").array(),
  locationFocus: text("location_focus").array(),
  sportFocus: text("sport_focus").array(),
  regions: text("regions").array(),
  keywordsToTrack: text("keywords_to_track").array(),
  exclusionTerms: text("exclusion_terms").array(),
  followerThreshold: integer("follower_threshold"),
  discoveryCount: integer("discovery_count").default(0),
  configuration: jsonb("configuration"),
});

export const cityInfluencerScouts = pgTable("city_influencer_scouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  active: boolean("active").default(true),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastRun: timestamp("last_run"),
  lastUpdated: timestamp("last_updated"),
  lastRunAt: timestamp("last_run_at"),
  cities: text("cities").array(),
  states: text("states").array(),
  regions: text("regions").array(),
  sportFocus: text("sport_focus").array(),
  keywordsToTrack: text("keywords_to_track").array(),
  platforms: text("platforms").array(),
  influencerType: text("influencer_type").array(),
  locationFocus: text("location_focus").array(),
  ageRangeMin: integer("age_range_min"),
  ageRangeMax: integer("age_range_max"),
  minFollowers: integer("min_followers"),
  maxInfluencers: integer("max_influencers"),
  discoveryCount: integer("discovery_count").default(0),
  configuration: jsonb("configuration"),
});

// Tables for storing discoveries from scout services
export const athleteDiscoveries = pgTable("athlete_discoveries", {
  id: serial("id").primaryKey(),
  scoutId: integer("scout_id").notNull().references(() => socialMediaScouts.id),
  fullName: text("full_name").notNull(),
  username: text("username").notNull(),
  platform: text("platform").notNull(),
  profileUrl: text("profile_url").notNull(),
  estimatedAge: integer("estimated_age"),
  sports: text("sports").array(),
  positions: text("positions").array(),
  followerCount: integer("follower_count"),
  engagementRate: numeric("engagement_rate", { precision: 5, scale: 2 }),
  // Using graduation_year instead of grad_year as that's what exists in the database
  graduationYear: integer("graduation_year"),
  location: text("location"),
  highSchool: text("high_school"),
  discoveredAt: timestamp("discovered_at").defaultNow(),
  reviewStatus: text("review_status").default("pending"),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  contactAttempted: boolean("contact_attempted").default(false),
  contactedBy: integer("contacted_by"),
  contactedAt: timestamp("contacted_at"),
  notes: text("notes"),
  highlights: jsonb("highlights"),
  profileImage: text("profile_image"),
});

export const mediaPartnerDiscoveries = pgTable("media_partner_discoveries", {
  id: serial("id").primaryKey(),
  scoutId: integer("scout_id").notNull().references(() => mediaPartnershipScouts.id),
  name: text("name").notNull(),
  // mediaType field removed as it doesn't exist in the actual database
  platform: text("platform").notNull(), // This is the column actually present in the database
  websiteUrl: text("website_url"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  followerCount: integer("follower_count"),
  sportsFocus: text("sports_focus").array(),
  locationCoverage: text("location_coverage").array(),
  reachMetrics: jsonb("reach_metrics"),
  potentialValue: text("potential_value"),
  discoveredAt: timestamp("discovered_at").defaultNow(),
  reviewStatus: text("review_status").default("pending"),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  contactAttempted: boolean("contact_attempted").default(false),
  contactedBy: integer("contacted_by"),
  contactedAt: timestamp("contacted_at"),
  notes: text("notes"),
  logoUrl: text("logo_url"),
});

export const cityInfluencerDiscoveries = pgTable("city_influencer_discoveries", {
  id: serial("id").primaryKey(),
  scoutId: integer("scout_id").notNull().references(() => cityInfluencerScouts.id),
  fullName: text("full_name").notNull(),
  platform: text("platform").notNull(),
  username: text("username").notNull(),
  profileUrl: text("profile_url").notNull(),
  followerCount: integer("follower_count"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  sportsFocus: text("sports_focus").array(),
  influenceRank: integer("influence_rank"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  discoveredAt: timestamp("discovered_at").defaultNow(),
  reviewStatus: text("review_status").default("pending"),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  contactAttempted: boolean("contact_attempted").default(false),
  contactedBy: integer("contacted_by"),
  contactedAt: timestamp("contacted_at"),
  notes: text("notes"),
  profileImage: text("profile_image"),
  combineEventId: integer("combine_event_id").references(() => combineTourEvents.id),
});

// Insert schemas for scouts
export const insertSocialMediaScoutSchema = createInsertSchema(socialMediaScouts).omit({ 
  id: true, 
  createdAt: true,
  lastRun: true,
  lastRunAt: true,
  discoveryCount: true,
  customCriteria: true
});

export const insertMediaPartnershipScoutSchema = createInsertSchema(mediaPartnershipScouts).omit({ 
  id: true, 
  createdAt: true,
  lastRun: true,
  lastRunAt: true,
  lastUpdated: true,
  discoveryCount: true,
  configuration: true
});

export const insertCityInfluencerScoutSchema = createInsertSchema(cityInfluencerScouts).omit({ 
  id: true, 
  createdAt: true,
  lastRun: true,
  lastRunAt: true,
  lastUpdated: true,
  discoveryCount: true,
  configuration: true
});

// Insert schemas for discoveries
export const insertAthleteDiscoverySchema = createInsertSchema(athleteDiscoveries).omit({
  id: true,
  discoveredAt: true,
  reviewedAt: true,
  contactedAt: true
});

export const insertMediaPartnerDiscoverySchema = createInsertSchema(mediaPartnerDiscoveries).omit({
  id: true,
  discoveredAt: true,
  reviewedAt: true,
  contactedAt: true
});

export const insertCityInfluencerDiscoverySchema = createInsertSchema(cityInfluencerDiscoveries).omit({
  id: true,
  discoveredAt: true,
  reviewedAt: true,
  contactedAt: true
});

// Scout types
export type SocialMediaScout = typeof socialMediaScouts.$inferSelect;
export type InsertSocialMediaScout = z.infer<typeof insertSocialMediaScoutSchema>;

export type MediaPartnershipScout = typeof mediaPartnershipScouts.$inferSelect;
export type InsertMediaPartnershipScout = z.infer<typeof insertMediaPartnershipScoutSchema>;

export type CityInfluencerScout = typeof cityInfluencerScouts.$inferSelect;
export type InsertCityInfluencerScout = z.infer<typeof insertCityInfluencerScoutSchema>;

// Discovery types
export type AthleteDiscovery = typeof athleteDiscoveries.$inferSelect;
export type InsertAthleteDiscovery = z.infer<typeof insertAthleteDiscoverySchema>;

export type MediaPartnerDiscovery = typeof mediaPartnerDiscoveries.$inferSelect;
export type InsertMediaPartnerDiscovery = z.infer<typeof insertMediaPartnerDiscoverySchema>;

export type CityInfluencerDiscovery = typeof cityInfluencerDiscoveries.$inferSelect;
export type InsertCityInfluencerDiscovery = z.infer<typeof insertCityInfluencerDiscoverySchema>;

export type GarCategory = typeof garCategories.$inferSelect;
export type InsertGarCategory = z.infer<typeof insertGarCategorySchema>;

export type GarSubcategory = typeof garSubcategories.$inferSelect;
export type InsertGarSubcategory = z.infer<typeof insertGarSubcategorySchema>;

export type GarAthleteRating = typeof garAthleteRatings.$inferSelect;
export type InsertGarAthleteRating = z.infer<typeof insertGarAthleteRatingSchema>;

export type GarRatingHistory = typeof garRatingHistory.$inferSelect;
export type InsertGarRatingHistory = z.infer<typeof insertGarRatingHistorySchema>;

export type AthleteStarProfile = typeof athleteStarProfiles.$inferSelect;
export type InsertAthleteStarProfile = z.infer<typeof insertAthleteStarProfileSchema>;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

export type CombineTourEvent = typeof combineTourEvents.$inferSelect;
export type InsertCombineTourEvent = z.infer<typeof insertCombineTourEventSchema>;

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type UserToken = typeof userTokens.$inferSelect;
export type InsertUserToken = z.infer<typeof insertUserTokenSchema>;

export type UserAgreement = typeof userAgreements.$inferSelect;
export type InsertUserAgreement = z.infer<typeof insertUserAgreementSchema>;

// Star Path and Workout Verification Types
export type AthleteStarPath = typeof athleteStarPath.$inferSelect;
export type InsertAthleteStarPath = z.infer<typeof insertAthleteStarPathSchema>;

export type WorkoutVerification = typeof workoutVerifications.$inferSelect;
export type InsertWorkoutVerification = z.infer<typeof insertWorkoutVerificationSchema>;

export type WorkoutVerificationCheckpoint = typeof workoutVerificationCheckpoints.$inferSelect;
export type InsertWorkoutVerificationCheckpoint = z.infer<typeof insertWorkoutVerificationCheckpointSchema>;

// NCAA Schools Database types
export type NcaaSchool = typeof ncaaSchools.$inferSelect;
export type InsertNcaaSchool = z.infer<typeof insertNcaaSchoolSchema>;

export type AthleticDepartment = typeof athleticDepartments.$inferSelect;
export type InsertAthleticDepartment = z.infer<typeof insertAthleticDepartmentSchema>;

export type SportProgram = typeof sportPrograms.$inferSelect;
export type InsertSportProgram = z.infer<typeof insertSportProgramSchema>;

export type CoachingStaff = typeof coachingStaff.$inferSelect;
export type InsertCoachingStaff = z.infer<typeof insertCoachingStaffSchema>;

export type RecruitingContact = typeof recruitingContacts.$inferSelect;
export type InsertRecruitingContact = z.infer<typeof insertRecruitingContactSchema>;

export type NcaaEligibility = typeof ncaaEligibility.$inferSelect;
export type InsertNcaaEligibility = z.infer<typeof insertNcaaEligibilitySchema>;

// Skill Tree types
export type SkillTreeNode = typeof skillTreeNodes.$inferSelect;
export type InsertSkillTreeNode = z.infer<typeof insertSkillTreeNodeSchema>;

export type SkillTreeRelationship = typeof skillTreeRelationships.$inferSelect;
export type InsertSkillTreeRelationship = z.infer<typeof insertSkillTreeRelationshipSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type TrainingDrill = typeof trainingDrills.$inferSelect;
export type InsertTrainingDrill = z.infer<typeof insertTrainingDrillSchema>;

export type TrainingDrillsExtended = typeof trainingDrillsExtended.$inferSelect;
export type InsertTrainingDrillsExtended = {
  drillId: number;
  fieldSetup?: string;
  coachTips?: string;
  variations?: Record<string, any>;
  progressions?: Record<string, any>;
  metrics?: string[];
  idealOutcomes?: string;
  commonErrors?: string[];
  videoAnnotations?: Record<string, any>;
  recommendedFrequency?: string;
  warmupRequired?: boolean;
  relatedDrillIds?: number[];
};

export type UserDrillProgress = typeof userDrillProgress.$inferSelect;
export type InsertUserDrillProgress = z.infer<typeof insertUserDrillProgressSchema>;

// AI Coach types
export type AiCoach = typeof aiCoaches.$inferSelect;
export type InsertAiCoach = z.infer<typeof insertAiCoachSchema>;

export type AiCoachSession = typeof aiCoachSessions.$inferSelect;
export type InsertAiCoachSession = z.infer<typeof insertAiCoachSessionSchema>;

export type AiCoachMessage = typeof aiCoachMessages.$inferSelect;
export type InsertAiCoachMessage = z.infer<typeof insertAiCoachMessageSchema>;

export type SportKnowledgeBase = typeof sportKnowledgeBases.$inferSelect;
export type InsertSportKnowledgeBase = z.infer<typeof insertSportKnowledgeBaseSchema>;

export type UserCoachInteraction = typeof userCoachInteractions.$inferSelect;
export type InsertUserCoachInteraction = z.infer<typeof insertUserCoachInteractionSchema>;

export type CoachFeedback = typeof coachFeedback.$inferSelect;
export type InsertCoachFeedback = z.infer<typeof insertCoachFeedbackSchema>;

export type CoachRecommendation = typeof coachRecommendations.$inferSelect;
export type InsertCoachRecommendation = z.infer<typeof insertCoachRecommendationSchema>;

// Spotlight Profiles for NextUp feature
export const spotlightProfiles = pgTable("spotlight_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  sport: text("sport").notNull(),
  position: text("position").notNull(),
  school: text("school").notNull(),
  graduationYear: integer("graduation_year").notNull(),
  location: text("location").notNull(),
  height: text("height").notNull(),
  weight: text("weight").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  bio: text("bio").notNull(),
  highlights: text("highlights").notNull(),
  academicGpa: text("academic_gpa"),
  profileImage: text("profile_image"),
  coverImage: text("cover_image"),
  highlightVideo: text("highlight_video"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  featured: boolean("featured").default(false),
  trending: boolean("trending").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const spotlightProfilesRelations = relations(spotlightProfiles, ({ one }) => ({
  user: one(users, {
    fields: [spotlightProfiles.userId],
    references: [users.id],
  }),
}));

export const insertSpotlightProfileSchema = createInsertSchema(spotlightProfiles).omit({
  id: true,
  views: true,
  likes: true,
  featured: true,
  trending: true,
  createdAt: true,
  updatedAt: true,
});

export type SpotlightProfile = typeof spotlightProfiles.$inferSelect;
export type InsertSpotlightProfile = z.infer<typeof insertSpotlightProfileSchema>;

// Onboarding Progress
export const onboardingProgress = pgTable("onboarding_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.id),
  isCompleted: boolean("is_completed").notNull().default(false),
  currentStep: integer("current_step").notNull().default(1),
  totalSteps: integer("total_steps").notNull().default(5),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  completedSections: text("completed_sections").array(),
  skippedSections: text("skipped_sections").array(),
  preferences: jsonb("preferences"),
  // Neurodivergent-specific preferences
  adhd: boolean("adhd").default(false),
  focusMode: boolean("focus_mode").default(false),
  uiAnimationLevel: text("ui_animation_level").default("medium"), // low, medium, high
  colorSchemePreference: text("color_scheme_preference").default("standard"), // standard, high-contrast, muted
  textSizePreference: text("text_size_preference").default("medium"), // small, medium, large
});

export const onboardingProgressRelations = relations(onboardingProgress, ({ one }) => ({
  user: one(users, {
    fields: [onboardingProgress.userId],
    references: [users.id],
  }),
}));

export const insertOnboardingProgressSchema = createInsertSchema(onboardingProgress).omit({
  id: true,
  lastUpdated: true,
});

export type OnboardingProgress = typeof onboardingProgress.$inferSelect;
export type InsertOnboardingProgress = z.infer<typeof insertOnboardingProgressSchema>;