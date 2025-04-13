import { pgTable, serial, text, integer, boolean, timestamp, date, real, index, uuid, unique, json, jsonb, numeric } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
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
  format: text("format").default("html"),
  section: text("section").notNull(),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  lastUpdatedBy: integer("last_updated_by").references(() => users.id),
  metadata: jsonb("metadata"),
});

// CMS Pages
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  className: text("class_name"),
  components: jsonb("components"),
  metadata: jsonb("metadata"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishDate: timestamp("publish_date"),
  createdBy: integer("created_by").references(() => users.id),
  lastUpdatedBy: integer("last_updated_by").references(() => users.id),
});

// CMS Page Components
export const pageComponents = pgTable("page_components", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull().references(() => pages.id),
  type: text("type").notNull(),
  title: text("title"),
  content: text("content"),
  configuration: jsonb("configuration"),
  position: integer("position").default(0),
  section: text("section").default("main"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  lastUpdatedBy: integer("last_updated_by").references(() => users.id),
});

// CMS Component Registry
export const componentRegistry = pgTable("component_registry", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").default("general"),
  icon: text("icon").default("box"),
  schema: jsonb("schema"),
  defaultConfig: jsonb("default_config"),
  previewImage: text("preview_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  lastUpdatedBy: integer("last_updated_by").references(() => users.id),
});

// Content revisions for versioning
export const contentRevisions = pgTable("content_revisions", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // 'block' or 'page'
  contentId: integer("content_id").notNull(),
  version: integer("version").notNull(),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  comment: text("comment"),
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
  sport_type: text("sport_type").notNull(), // Using snake_case to match DB schema
  position: text("position"),
  level: integer("level").notNull().default(1),
  xp_to_unlock: integer("xp_to_unlock").default(0), // Using snake_case to match DB schema
  icon_path: text("icon_path"), // Using icon_path instead of iconUrl
  parent_category: text("parent_category"), // Using parent_category instead of skillCategory
  created_at: timestamp("created_at").defaultNow(), // Using snake_case to match DB schema
});

export const skillTreeRelationships = pgTable("skill_tree_relationships", {
  id: serial("id").primaryKey(),
  parent_id: integer("parent_id").references(() => skillTreeNodes.id), // Using snake_case to match DB schema
  child_id: integer("child_id").notNull().references(() => skillTreeNodes.id), // Using snake_case to match DB schema
  relationship_type: text("relationship_type").default("requires"), // requires, enhances, unlocks
  created_at: timestamp("created_at").defaultNow(), // Using snake_case to match DB schema
}, (table) => {
  return {
    relationshipUnique: unique().on(table.parent_id, table.child_id),
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
    fields: [skillTreeRelationships.parent_id],
    references: [skillTreeNodes.id],
    relationName: "parent",
  }),
  child: one(skillTreeNodes, {
    fields: [skillTreeRelationships.child_id],
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
  contactInfo: jsonb("contact_info"),
  discoveryDate: timestamp("discovery_date", { withTimezone: true }),
  starRating: integer("star_rating"),
  notes: text("notes"),
  talentScore: integer("talent_score"),
  potentialRating: integer("potential_rating"),
  contacted: boolean("contacted"),
  contactedDate: timestamp("contacted_date", { withTimezone: true }),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  schoolName: text("school_name"),
  graduationYear: integer("graduation_year"),
  bio: text("bio"),
  postCount: integer("post_count"),
  highlights: text("highlights").array(),
  mediaUrls: text("media_urls").array(),
  discoveredAt: timestamp("discovered_at"),
  lastCheckedAt: timestamp("last_checked_at"),
  status: text("status"),
  assignedTo: integer("assigned_to"),
  confidence: integer("confidence"),
  contactAttempts: integer("contact_attempts"),
  convertedToUserId: integer("converted_to_user_id"),
});

export const mediaPartnerDiscoveries = pgTable("media_partner_discoveries", {
  id: serial("id").primaryKey(),
  scoutId: integer("scout_id").notNull().references(() => mediaPartnershipScouts.id),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  url: text("url"),
  followerCount: integer("follower_count"),
  averageEngagement: real("average_engagement"),
  sports: text("sports").array(),
  contentQuality: integer("content_quality"),
  relevanceScore: integer("relevance_score"),
  partnershipPotential: integer("partnership_potential"),
  discoveredAt: timestamp("discovered_at"),
  lastCheckedAt: timestamp("last_checked_at"),
  status: text("status"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  audienceType: text("audience_type"),
  recentTopics: text("recent_topics").array(),
  location: text("location"),
  assignedTo: integer("assigned_to"),
  notes: text("notes"),
  partnershipTerms: text("partnership_terms"),
  partnershipStartDate: timestamp("partnership_start_date"),
  partnershipEndDate: timestamp("partnership_end_date"),
  partnershipResults: jsonb("partnership_results"),
});

export const cityInfluencerDiscoveries = pgTable("city_influencer_discoveries", {
  id: serial("id").primaryKey(),
  scoutId: integer("scout_id").notNull().references(() => cityInfluencerScouts.id),
  fullName: text("full_name").notNull(),
  username: text("username").notNull(),
  platform: text("platform").notNull(),
  profileUrl: text("profile_url").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  followerCount: integer("follower_count"),
  engagementRate: numeric("engagement_rate"),
  contentFocus: text("content_focus").array(),
  discoveryDate: timestamp("discovery_date", { withTimezone: true }),
  contactInfo: jsonb("contact_info"),
  influenceScore: integer("influence_score"),
  contacted: boolean("contacted"),
  contactedDate: timestamp("contacted_date", { withTimezone: true }),
  notes: text("notes"),
  ranking: integer("ranking"),
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
  discoveryDate: true,
  contactedDate: true
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

// MyPlayer XP System Tables
// Player XP Transactions - Track XP earned by players
export const playerXpTransactions = pgTable("player_xp_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  source: text("source").notNull(), // e.g., "workout", "streak", "challenge"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Star Paths - Player development pathways
export const starPaths = pgTable("star_paths", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  sportType: text("sport_type").notNull(),
  position: text("position"),
  currentStarLevel: integer("current_star_level").default(1),
  starXp: integer("star_xp").default(0),
  attributes: json("attributes").$type<Record<string, Record<string, number>>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const playerProgress = pgTable("player_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currentLevel: integer("current_level").notNull().default(1),
  levelXp: integer("level_xp").notNull().default(0),
  xpToNextLevel: integer("xp_to_next_level").notNull().default(100),
  totalXp: integer("total_xp").notNull().default(0),
  streakDays: integer("streak_days").notNull().default(0),
  lastActive: timestamp("last_active").default(sql`now()`),
  completedChallenges: integer("completed_challenges").default(0),
  lifetimeAchievements: integer("lifetime_achievements").default(0),
  rank: text("rank"),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const playerSkills = pgTable("player_skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  level: integer("level").notNull().default(1),
  progress: integer("progress").notNull().default(0),
  category: text("category").notNull(), // physical, mental, technical
  attribute: text("attribute").notNull(), // specific attribute like speed, strength, etc.
  sport: text("sport"), // sport-specific or null for general
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const playerBadges = pgTable("player_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  tier: text("tier").notNull().default("None"), // None, Bronze, Silver, Gold
  earned: boolean("earned").notNull().default(false),
  progress: integer("progress").notNull().default(0),
  imageUrl: text("image_url"),
  earnedAt: timestamp("earned_at", { withTimezone: true }),
  requirements: jsonb("requirements"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const xpTransactions = pgTable("xp_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  transaction_type: text("transaction_type").notNull(), // workout, login, challenge, film, game, assessment
  description: text("description").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  multiplier: real("multiplier"),
  source_id: text("source_id"),
});

export const playerChallenges = pgTable("player_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").notNull(),
  badgeReward: text("badge_reward"),
  requirementType: text("requirement_type").notNull(), // workout, skill, assessment
  requirementCount: integer("requirement_count").notNull().default(1),
  requirementDetails: jsonb("requirement_details"),
  duration: integer("duration"), // in days or null for no time limit
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  category: text("category").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const playerActiveChallenges = pgTable("player_active_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => playerChallenges.id),
  progress: integer("progress").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  isCompleted: boolean("is_completed").notNull().default(false),
});

// Add relations for playerChallenges
export const playerChallengesRelations = relations(playerChallenges, ({ many }) => ({
  activeChallenges: many(playerActiveChallenges),
}));

// Add relations for playerActiveChallenges
export const playerActiveChallengesRelations = relations(playerActiveChallenges, ({ one }) => ({
  user: one(users, {
    fields: [playerActiveChallenges.userId],
    references: [users.id],
  }),
  challenge: one(playerChallenges, {
    fields: [playerActiveChallenges.challengeId],
    references: [playerChallenges.id],
  }),
}));

export const coachMessages = pgTable("coach_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isUserMessage: boolean("is_user_message").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
  isHelpful: boolean("is_helpful"),
  context: jsonb("context"),
  relatedTo: text("related_to"), // e.g. "workout", "assessment", etc.
  relatedId: integer("related_id"),
});

export const playerAssessments = pgTable("player_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  type: text("type").notNull(), // physical, mental, technical
  description: text("description").notNull(),
  results: jsonb("results"),
  date: timestamp("date", { withTimezone: true }).defaultNow(),
  coachNotes: text("coach_notes"),
  recommendedFocus: text("recommended_focus").array(),
});

export const trainingPlans = pgTable("training_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sport: text("sport").notNull(),
  focusAreas: text("focus_areas").array(),
  duration: integer("duration").notNull(), // in days
  status: text("status").notNull().default("active"), // active, completed, archived
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
});

export const trainingPlanActivities = pgTable("training_plan_activities", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull().references(() => trainingPlans.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // workout, drill, rest, assessment
  day: integer("day").notNull(), // day in plan (1-based)
  xpReward: integer("xp_reward").notNull().default(0),
  duration: integer("duration"), // in minutes
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  details: jsonb("details"), // specific details based on activity type
});

// Types for MyPlayer tables
export type PlayerXpTransaction = typeof playerXpTransactions.$inferSelect;
export const insertPlayerXpTransactionSchema = createInsertSchema(playerXpTransactions).omit({ id: true });
export type InsertPlayerXpTransaction = z.infer<typeof insertPlayerXpTransactionSchema>;

export type StarPath = typeof starPaths.$inferSelect;
export const insertStarPathSchema = createInsertSchema(starPaths).omit({ id: true });
export type InsertStarPath = z.infer<typeof insertStarPathSchema>;

export type PlayerProgress = typeof playerProgress.$inferSelect;
export const insertPlayerProgressSchema = createInsertSchema(playerProgress).omit({ id: true });
export type InsertPlayerProgress = z.infer<typeof insertPlayerProgressSchema>;

export type PlayerSkill = typeof playerSkills.$inferSelect;
export const insertPlayerSkillSchema = createInsertSchema(playerSkills).omit({ id: true });
export type InsertPlayerSkill = z.infer<typeof insertPlayerSkillSchema>;

export type PlayerBadge = typeof playerBadges.$inferSelect;
export const insertPlayerBadgeSchema = createInsertSchema(playerBadges).omit({ id: true });
export type InsertPlayerBadge = z.infer<typeof insertPlayerBadgeSchema>;

export type XpTransaction = typeof xpTransactions.$inferSelect;
export const insertXpTransactionSchema = createInsertSchema(xpTransactions).omit({ id: true });
export type InsertXpTransaction = z.infer<typeof insertXpTransactionSchema>;

export type PlayerChallenge = typeof playerChallenges.$inferSelect;
export const insertPlayerChallengeSchema = createInsertSchema(playerChallenges).omit({ id: true });
export type InsertPlayerChallenge = z.infer<typeof insertPlayerChallengeSchema>;

export type PlayerActiveChallenge = typeof playerActiveChallenges.$inferSelect;
export const insertPlayerActiveChallengeSchema = createInsertSchema(playerActiveChallenges).omit({ id: true });
export type InsertPlayerActiveChallenge = z.infer<typeof insertPlayerActiveChallengeSchema>;

export type CoachMessage = typeof coachMessages.$inferSelect;
export const insertCoachMessageSchema = createInsertSchema(coachMessages).omit({ id: true });
export type InsertCoachMessage = z.infer<typeof insertCoachMessageSchema>;

export type PlayerAssessment = typeof playerAssessments.$inferSelect;
export const insertPlayerAssessmentSchema = createInsertSchema(playerAssessments).omit({ id: true });
export type InsertPlayerAssessment = z.infer<typeof insertPlayerAssessmentSchema>;

export type TrainingPlan = typeof trainingPlans.$inferSelect;
export const insertTrainingPlanSchema = createInsertSchema(trainingPlans).omit({ id: true });
export type InsertTrainingPlan = z.infer<typeof insertTrainingPlanSchema>;

export type TrainingPlanActivity = typeof trainingPlanActivities.$inferSelect;
export const insertTrainingPlanActivitySchema = createInsertSchema(trainingPlanActivities).omit({ id: true });
export type InsertTrainingPlanActivity = z.infer<typeof insertTrainingPlanActivitySchema>;
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

// Analytics System Tables

// 1. Star Path Progression Analytics
export const starPathAnalytics = pgTable("star_path_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currentStarLevel: integer("current_star_level").notNull(),
  previousStarLevel: integer("previous_star_level"),
  daysAtCurrentLevel: integer("days_at_current_level").notNull(),
  totalDaysInSystem: integer("total_days_in_system").notNull(),
  progressPercentage: real("progress_percentage").notNull(),
  nextLevelEstimatedDays: integer("next_level_estimated_days"),
  progressSnapshotData: jsonb("progress_snapshot_data"),
  bottleneckIdentified: text("bottleneck_identified"),
  recommendedFocus: text("recommended_focus"),
  achievedMilestones: text("achieved_milestones").array(),
  timestampRecorded: timestamp("timestamp_recorded").defaultNow().notNull(),
});

// 2. Engagement Patterns & ADHD Analytics
export const engagementAnalytics = pgTable("engagement_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionDuration: integer("session_duration").notNull(), // in seconds
  timeOfDay: timestamp("time_of_day").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 for Sunday-Saturday
  featuresUsed: text("features_used").array(),
  featureTimeDistribution: jsonb("feature_time_distribution"), // JSON mapping features to time spent
  attentionSpanAverage: real("attention_span_average"), // in seconds
  contextSwitchCount: integer("context_switch_count"),
  focusFeature: text("focus_feature"), // which feature kept attention longest
  deviceType: text("device_type"),
  sessionCompletionStatus: text("session_completion_status"), // "completed", "interrupted", etc.
  interfaceElements: jsonb("interface_elements"), // tracking UI components that maintained engagement
  timestampRecorded: timestamp("timestamp_recorded").defaultNow().notNull(),
});

// 3. Workout Verification Analytics
export const workoutAnalytics = pgTable("workout_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  workoutVerificationId: integer("workout_verification_id"),
  workoutType: text("workout_type").notNull(),
  completionSuccess: boolean("completion_success").notNull(),
  formQualityScore: real("form_quality_score"), // 0-100
  formImprovementRate: real("form_improvement_rate"), // compared to last similar workout
  consistencyStreak: integer("consistency_streak").notNull(),
  bestStreak: integer("best_streak"),
  difficultyProgression: real("difficulty_progression"), // rate of increasing difficulty
  caloriesBurned: integer("calories_burned"),
  workoutDuration: integer("workout_duration"), // in minutes
  intensityScore: real("intensity_score"), // 0-100
  preferredTimeOfDay: text("preferred_time_of_day"),
  preferredEnvironment: text("preferred_environment"), // gym, home, outdoor, etc.
  equipmentUsed: text("equipment_used").array(),
  timestampRecorded: timestamp("timestamp_recorded").defaultNow().notNull(),
});

// 4. Skill Development Velocity Analytics
export const skillDevelopmentAnalytics = pgTable("skill_development_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sportType: text("sport_type").notNull(),
  skillCategory: text("skill_category").notNull(), // e.g. shooting, passing, defense
  skillName: text("skill_name").notNull(),
  currentLevel: integer("current_level").notNull(),
  improvementRate: real("improvement_rate"), // per week
  practiceFrequency: integer("practice_frequency"), // days per week
  timeInvested: integer("time_invested"), // minutes per week
  plateauIdentified: boolean("plateau_identified"),
  plateauDuration: integer("plateau_duration"), // days
  breakthroughFactors: text("breakthrough_factors").array(),
  correlationFactors: jsonb("correlation_factors"), // factors correlating with improvements
  drillEfficiency: jsonb("drill_efficiency"), // which drills produce fastest improvement
  timestampRecorded: timestamp("timestamp_recorded").defaultNow().notNull(),
});

// 5. Academic-Athletic Integration Analytics
// Academic Subjects
export const academicSubjects = pgTable("academic_subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., Math, Science, Language Arts, etc.
  description: text("description"),
  isCore: boolean("is_core").default(true), // Whether it's a core academic subject
  createdAt: timestamp("created_at").defaultNow(),
});

// Academic Courses
export const academicCourses = pgTable("academic_courses", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => academicSubjects.id),
  name: text("name").notNull(),
  courseLevel: text("course_level"), // e.g., AP, Honors, Standard
  gradeLevel: integer("grade_level"), // e.g., 9, 10, 11, 12
  credits: real("credits"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  isCore: boolean("is_core").default(false), // Indicates if course is an NCAA core course
  createdAt: timestamp("created_at").defaultNow(),
});

// Student Course Enrollments
export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => academicCourses.id),
  semester: text("semester").notNull(), // e.g., "Fall 2023"
  currentGrade: text("current_grade"), // Letter or numerical grade
  currentPercentage: real("current_percentage"),
  status: text("status").default("active").notNull(), // active, completed, dropped
  teacherName: text("teacher_name"),
  notes: text("notes"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course Assignments
export const academicAssignments = pgTable("academic_assignments", {
  id: serial("id").primaryKey(),
  courseEnrollmentId: integer("course_enrollment_id").notNull().references(() => courseEnrollments.id),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  status: text("status").default("pending").notNull(), // pending, completed, late, excused
  grade: text("grade"),
  percentage: real("percentage"),
  weight: real("weight").default(1.0), // How much this assignment weighs toward final grade
  assignmentType: text("assignment_type"), // homework, quiz, test, project, etc.
  submittedDate: date("submitted_date"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Academic Term Progress
export const academicTerms = pgTable("academic_terms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  termName: text("term_name").notNull(), // e.g., "Fall 2023"
  startDate: date("start_date"),
  endDate: date("end_date"),
  overallGPA: real("overall_gpa"),
  totalCredits: real("total_credits"),
  status: text("status").default("active").notNull(), // active, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ADHD-specific Study Strategies
export const adhdStudyStrategies = pgTable("adhd_study_strategies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., focus, planning, time management
  effectiveness: integer("effectiveness"), // Scale of 1-10
  implementationDifficulty: integer("implementation_difficulty"), // Scale of 1-10
  recommendedSubjects: text("recommended_subjects").array(),
  tips: text("tips").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student Study Strategy Implementations
export const studentStudyStrategies = pgTable("student_study_strategies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  strategyId: integer("strategy_id").notNull().references(() => adhdStudyStrategies.id),
  implementationDate: date("implementation_date").defaultNow(),
  effectiveness: integer("effectiveness"), // Student rating of effectiveness
  notes: text("notes"),
  usageFrequency: text("usage_frequency"), // daily, weekly, occasionally
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Academic Athletic Analytics - Overall analysis combining sports and academics
export const academicAthleticAnalytics = pgTable("academic_athletic_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currentGPA: real("current_gpa"),
  gpaTimeSeries: jsonb("gpa_time_series"),
  strongestSubjects: text("strongest_subjects").array(),
  weakestSubjects: text("weakest_subjects").array(),
  studyHoursPerWeek: integer("study_hours_per_week"),
  athleticPerformanceCorrelation: real("athletic_performance_correlation"), // -1 to 1
  cognitiveInfluenceFactor: real("cognitive_influence_factor"), // how academics impact sports decisions
  academicImprovementRate: real("academic_improvement_rate"),
  athleticImprovementRate: real("athletic_improvement_rate"),
  balanceScore: real("balance_score"), // 0-100, how well balanced academics and athletics
  recommendedStudyPatterns: jsonb("recommended_study_patterns"),
  recommendedSubjectFocus: text("recommended_subject_focus"),
  timestampRecorded: timestamp("timestamp_recorded").defaultNow().notNull(),
});

// 6. AI Coach Effectiveness Analytics
export const aiCoachAnalytics = pgTable("ai_coach_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  coachId: integer("coach_id"),
  personalizationAccuracy: real("personalization_accuracy"), // 0-100
  recommendationAdherenceRate: real("recommendation_adherence_rate"), // % of recommendations followed
  userSatisfactionRating: integer("user_satisfaction_rating"), // 1-10
  improvementWithAI: real("improvement_with_ai"), // improvement rate with AI coach
  improvementWithoutAI: real("improvement_without_ai"), // baseline comparison
  aiInteractionFrequency: integer("ai_interaction_frequency"), // times per week
  averageInteractionDuration: integer("average_interaction_duration"), // seconds
  mostUsedFeatures: text("most_used_features").array(),
  commonQueries: text("common_queries").array(),
  feedbackProvided: text("feedback_provided"),
  adjustmentsImplemented: jsonb("adjustments_implemented"),
  timestampRecorded: timestamp("timestamp_recorded").defaultNow().notNull(),
});

// 7. Cross-Sport Potential Analytics
export const crossSportAnalytics = pgTable("cross_sport_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  primarySport: text("primary_sport").notNull(),
  secondarySports: text("secondary_sports").array(),
  skillTransferabilityScore: jsonb("skill_transferability_score"), // mapping sports to transferability scores
  crossTrainingFrequency: integer("cross_training_frequency"), // days per week
  multiSportPerformanceIndex: real("multi_sport_performance_index"), // composite score
  sportRecommendationAccuracy: real("sport_recommendation_accuracy"), // 0-100
  complementarySkillSets: jsonb("complementary_skill_sets"),
  specialtyVsVersatilityBalance: real("specialty_vs_versatility_balance"), // 0-1, 0=specialist, 1=versatile
  sportProgressionTimeline: jsonb("sport_progression_timeline"),
  timestampRecorded: timestamp("timestamp_recorded").defaultNow().notNull(),
});

// 8. Recruiting Readiness Analytics
export const recruitingAnalytics = pgTable("recruiting_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  overallGARScore: real("overall_gar_score"),
  garScoreProgression: jsonb("gar_score_progression"),
  highlightGenerationCount: integer("highlight_generation_count"),
  highlightViewCount: integer("highlight_view_count"),
  highlightShareCount: integer("highlight_share_count"),
  scoutViewCount: integer("scout_view_count"),
  scoutEngagementMetrics: jsonb("scout_engagement_metrics"), // what scouts spend time looking at
  collegeMatchPercentages: jsonb("college_match_percentages"), // top college matches
  recruitingProfileCompleteness: real("recruiting_profile_completeness"), // 0-100
  nationalRankingProjection: integer("national_ranking_projection"),
  localRankingProjection: integer("local_ranking_projection"),
  scholarshipPotentialScore: real("scholarship_potential_score"), // 0-100
  timestampRecorded: timestamp("timestamp_recorded").defaultNow().notNull(),
});

// 9. Neurodivergent-Specific Success Patterns
export const neurodivergentAnalytics = pgTable("neurodivergent_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  adhdFriendlyFeatureUsage: jsonb("adhd_friendly_feature_usage"), // which features are most used
  accommodationEffectiveness: jsonb("accommodation_effectiveness"), // which accommodations improve outcomes
  focusDuration: jsonb("focus_duration"), // average focus time by UI element
  distractionFrequency: integer("distraction_frequency"),
  recoveryTime: integer("recovery_time"), // time to refocus after distraction
  optimalSessionDuration: integer("optimal_session_duration"), // in minutes
  visualVsTextualPreference: real("visual_vs_textual_preference"), // 0-1, 0=text, 1=visual
  dopamineTriggerEffectiveness: jsonb("dopamine_trigger_effectiveness"),
  attentionPatterns: jsonb("attention_patterns"),
  environmentalFactors: jsonb("environmental_factors"), // which environments improve focus
  timestampRecorded: timestamp("timestamp_recorded").defaultNow().notNull(),
});

// 10. Community & Social Impact Analytics
export const communityAnalytics = pgTable("community_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  peerInteractionCount: integer("peer_interaction_count"),
  peerLearningEffectiveness: real("peer_learning_effectiveness"), // 0-100
  coachAthleteMessageCount: integer("coach_athlete_message_count"),
  responseTimeAverage: integer("response_time_average"), // in minutes
  parentInvolvementScore: real("parent_involvement_score"), // 0-100
  teamVsIndividualImprovement: real("team_vs_individual_improvement"), // -1 to 1, negative=individual better
  regionalComparisonPercentile: real("regional_comparison_percentile"),
  communityContributionScore: real("community_contribution_score"),
  socialSupportNetworkSize: integer("social_support_network_size"),
  collaborativeWorkoutsPercentage: real("collaborative_workouts_percentage"),
  knowledgeSharingMetrics: jsonb("knowledge_sharing_metrics"),
  timestampRecorded: timestamp("timestamp_recorded").defaultNow().notNull(),
});

// User Session Analytics - general tracking table
export const userSessionAnalytics = pgTable("user_session_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionStartTime: timestamp("session_start_time").notNull(),
  sessionEndTime: timestamp("session_end_time"),
  sessionDuration: integer("session_duration"), // in seconds
  pagesVisited: text("pages_visited").array(),
  actionsPerformed: jsonb("actions_performed"),
  deviceInfo: jsonb("device_info"),
  browserInfo: jsonb("browser_info"),
  ipAddress: text("ip_address"),
  geolocation: text("geolocation"),
  referrer: text("referrer"),
  entryPoint: text("entry_point"),
  exitPoint: text("exit_point"),
  bounced: boolean("bounced"),
  convertedGoal: text("converted_goal"),
  userType: text("user_type"), // new, returning
});

// Create insert schemas for academic tables
export const insertAcademicSubjectsSchema = createInsertSchema(academicSubjects).omit({ id: true });
export const insertAcademicCoursesSchema = createInsertSchema(academicCourses).omit({ id: true });
export const insertCourseEnrollmentsSchema = createInsertSchema(courseEnrollments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAcademicAssignmentsSchema = createInsertSchema(academicAssignments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAcademicTermsSchema = createInsertSchema(academicTerms).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAdhdStudyStrategiesSchema = createInsertSchema(adhdStudyStrategies).omit({ id: true });
export const insertStudentStudyStrategiesSchema = createInsertSchema(studentStudyStrategies).omit({ id: true, createdAt: true, updatedAt: true });

// Create insert schemas for analytics tables
export const insertStarPathAnalyticsSchema = createInsertSchema(starPathAnalytics).omit({ id: true });
export const insertEngagementAnalyticsSchema = createInsertSchema(engagementAnalytics).omit({ id: true });
export const insertWorkoutAnalyticsSchema = createInsertSchema(workoutAnalytics).omit({ id: true });
export const insertSkillDevelopmentAnalyticsSchema = createInsertSchema(skillDevelopmentAnalytics).omit({ id: true });
export const insertAcademicAthleticAnalyticsSchema = createInsertSchema(academicAthleticAnalytics).omit({ id: true });
export const insertAiCoachAnalyticsSchema = createInsertSchema(aiCoachAnalytics).omit({ id: true });
export const insertCrossSportAnalyticsSchema = createInsertSchema(crossSportAnalytics).omit({ id: true });
export const insertRecruitingAnalyticsSchema = createInsertSchema(recruitingAnalytics).omit({ id: true });
export const insertNeurodivergentAnalyticsSchema = createInsertSchema(neurodivergentAnalytics).omit({ id: true });
export const insertCommunityAnalyticsSchema = createInsertSchema(communityAnalytics).omit({ id: true });
export const insertUserSessionAnalyticsSchema = createInsertSchema(userSessionAnalytics).omit({ id: true });

// Relations for academic tables
export const academicCoursesRelations = relations(academicCourses, ({ one }) => ({
  subject: one(academicSubjects, { fields: [academicCourses.subjectId], references: [academicSubjects.id] }),
}));

export const courseEnrollmentsRelations = relations(courseEnrollments, ({ one, many }) => ({
  user: one(users, { fields: [courseEnrollments.userId], references: [users.id] }),
  course: one(academicCourses, { fields: [courseEnrollments.courseId], references: [academicCourses.id] }),
  assignments: many(academicAssignments),
}));

export const academicAssignmentsRelations = relations(academicAssignments, ({ one }) => ({
  enrollment: one(courseEnrollments, { fields: [academicAssignments.courseEnrollmentId], references: [courseEnrollments.id] }),
}));

export const academicTermsRelations = relations(academicTerms, ({ one }) => ({
  user: one(users, { fields: [academicTerms.userId], references: [users.id] }),
}));

export const studentStudyStrategiesRelations = relations(studentStudyStrategies, ({ one }) => ({
  user: one(users, { fields: [studentStudyStrategies.userId], references: [users.id] }),
  strategy: one(adhdStudyStrategies, { fields: [studentStudyStrategies.strategyId], references: [adhdStudyStrategies.id] }),
}));

// Relations for analytics tables
export const starPathAnalyticsRelations = relations(starPathAnalytics, ({ one }) => ({
  user: one(users, { fields: [starPathAnalytics.userId], references: [users.id] }),
}));

export const engagementAnalyticsRelations = relations(engagementAnalytics, ({ one }) => ({
  user: one(users, { fields: [engagementAnalytics.userId], references: [users.id] }),
}));

export const workoutAnalyticsRelations = relations(workoutAnalytics, ({ one }) => ({
  user: one(users, { fields: [workoutAnalytics.userId], references: [users.id] }),
}));

export const skillDevelopmentAnalyticsRelations = relations(skillDevelopmentAnalytics, ({ one }) => ({
  user: one(users, { fields: [skillDevelopmentAnalytics.userId], references: [users.id] }),
}));

export const academicAthleticAnalyticsRelations = relations(academicAthleticAnalytics, ({ one }) => ({
  user: one(users, { fields: [academicAthleticAnalytics.userId], references: [users.id] }),
}));

export const aiCoachAnalyticsRelations = relations(aiCoachAnalytics, ({ one }) => ({
  user: one(users, { fields: [aiCoachAnalytics.userId], references: [users.id] }),
  coach: one(aiCoaches, { fields: [aiCoachAnalytics.coachId], references: [aiCoaches.id] }),
}));

export const crossSportAnalyticsRelations = relations(crossSportAnalytics, ({ one }) => ({
  user: one(users, { fields: [crossSportAnalytics.userId], references: [users.id] }),
}));

export const recruitingAnalyticsRelations = relations(recruitingAnalytics, ({ one }) => ({
  user: one(users, { fields: [recruitingAnalytics.userId], references: [users.id] }),
}));

export const neurodivergentAnalyticsRelations = relations(neurodivergentAnalytics, ({ one }) => ({
  user: one(users, { fields: [neurodivergentAnalytics.userId], references: [users.id] }),
}));

export const communityAnalyticsRelations = relations(communityAnalytics, ({ one }) => ({
  user: one(users, { fields: [communityAnalytics.userId], references: [users.id] }),
}));

export const userSessionAnalyticsRelations = relations(userSessionAnalytics, ({ one }) => ({
  user: one(users, { fields: [userSessionAnalytics.userId], references: [users.id] }),
}));

// Export types for academic tables
export type AcademicSubject = typeof academicSubjects.$inferSelect;
export type InsertAcademicSubject = z.infer<typeof insertAcademicSubjectsSchema>;

export type AcademicCourse = typeof academicCourses.$inferSelect;
export type InsertAcademicCourse = z.infer<typeof insertAcademicCoursesSchema>;

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = z.infer<typeof insertCourseEnrollmentsSchema>;

export type AcademicAssignment = typeof academicAssignments.$inferSelect;
export type InsertAcademicAssignment = z.infer<typeof insertAcademicAssignmentsSchema>;

export type AcademicTerm = typeof academicTerms.$inferSelect;
export type InsertAcademicTerm = z.infer<typeof insertAcademicTermsSchema>;

export type AdhdStudyStrategy = typeof adhdStudyStrategies.$inferSelect;
export type InsertAdhdStudyStrategy = z.infer<typeof insertAdhdStudyStrategiesSchema>;

export type StudentStudyStrategy = typeof studentStudyStrategies.$inferSelect;
export type InsertStudentStudyStrategy = z.infer<typeof insertStudentStudyStrategiesSchema>;

// Export types for analytics tables
export type StarPathAnalytics = typeof starPathAnalytics.$inferSelect;
export type InsertStarPathAnalytics = z.infer<typeof insertStarPathAnalyticsSchema>;

export type EngagementAnalytics = typeof engagementAnalytics.$inferSelect;
export type InsertEngagementAnalytics = z.infer<typeof insertEngagementAnalyticsSchema>;

export type WorkoutAnalytics = typeof workoutAnalytics.$inferSelect;
export type InsertWorkoutAnalytics = z.infer<typeof insertWorkoutAnalyticsSchema>;

export type SkillDevelopmentAnalytics = typeof skillDevelopmentAnalytics.$inferSelect;
export type InsertSkillDevelopmentAnalytics = z.infer<typeof insertSkillDevelopmentAnalyticsSchema>;

export type AcademicAthleticAnalytics = typeof academicAthleticAnalytics.$inferSelect;
export type InsertAcademicAthleticAnalytics = z.infer<typeof insertAcademicAthleticAnalyticsSchema>;

export type AiCoachAnalytics = typeof aiCoachAnalytics.$inferSelect;
export type InsertAiCoachAnalytics = z.infer<typeof insertAiCoachAnalyticsSchema>;

export type CrossSportAnalytics = typeof crossSportAnalytics.$inferSelect;
export type InsertCrossSportAnalytics = z.infer<typeof insertCrossSportAnalyticsSchema>;

export type RecruitingAnalytics = typeof recruitingAnalytics.$inferSelect;
export type InsertRecruitingAnalytics = z.infer<typeof insertRecruitingAnalyticsSchema>;

export type NeurodivergentAnalytics = typeof neurodivergentAnalytics.$inferSelect;
export type InsertNeurodivergentAnalytics = z.infer<typeof insertNeurodivergentAnalyticsSchema>;

export type CommunityAnalytics = typeof communityAnalytics.$inferSelect;
export type InsertCommunityAnalytics = z.infer<typeof insertCommunityAnalyticsSchema>;

export type UserSessionAnalytics = typeof userSessionAnalytics.$inferSelect;
export type InsertUserSessionAnalytics = z.infer<typeof insertUserSessionAnalyticsSchema>;

// GAR Analysis Tables

// Sport positions table
export const sportPositions = pgTable('sport_positions', {
  id: serial('id').primaryKey(),
  sportType: text('sport_type').notNull(),
  positionName: text('position_name').notNull(),
  description: text('description'),
  ageMinimum: integer('age_minimum'),
  physicalRequirements: json('physical_requirements'),
  technicalRequirements: json('technical_requirements'),
  tacticalRequirements: json('tactical_requirements'),
  psychologicalRequirements: json('psychological_requirements'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const insertSportPositionSchema = createInsertSchema(sportPositions)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type SportPosition = typeof sportPositions.$inferSelect;
export type InsertSportPosition = z.infer<typeof insertSportPositionSchema>;

// Biomechanics data table
export const biomechanicsData = pgTable('biomechanics_data', {
  id: serial('id').primaryKey(),
  athleteId: integer('athlete_id').notNull().references(() => users.id),
  captureDate: timestamp('capture_date').defaultNow(),
  sportType: text('sport_type'),
  positionPlayed: text('position_played'),
  category: text('category').notNull(), // bodyMechanics, physicalAttributes, movementPatterns, etc.
  metrics: json('metrics').notNull(), // JSON containing all measured metrics
  videoReference: text('video_reference'),
  captureMethod: text('capture_method'),
  aiAnalysisNotes: text('ai_analysis_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const insertBiomechanicsDataSchema = createInsertSchema(biomechanicsData)
  .omit({ id: true, createdAt: true, updatedAt: true, captureDate: true });

export type BiomechanicsData = typeof biomechanicsData.$inferSelect;
export type InsertBiomechanicsData = z.infer<typeof insertBiomechanicsDataSchema>;

// Neurodivergent profiles table
export const neurodivergentProfiles = pgTable('neurodivergent_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  hasAdhd: boolean('has_adhd').default(false),
  adhdType: text('adhd_type'), // inattentive, hyperactive, combined
  adhdDiagnosisDate: timestamp('adhd_diagnosis_date'),
  adhdMedication: boolean('adhd_medication').default(false),
  hasDyslexia: boolean('has_dyslexia').default(false),
  hasAutism: boolean('has_autism').default(false),
  sensoryProcessingNeeds: json('sensory_processing_needs'),
  learningPreferences: json('learning_preferences'),
  environmentalAdaptations: json('environmental_adaptations'),
  birthDate: timestamp('birth_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const insertNeurodivergentProfileSchema = createInsertSchema(neurodivergentProfiles)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type NeurodivergentProfile = typeof neurodivergentProfiles.$inferSelect;
export type InsertNeurodivergentProfile = z.infer<typeof insertNeurodivergentProfileSchema>;

// Athlete body metrics table
export const athleteBodyMetrics = pgTable('athlete_body_metrics', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  height: numeric('height'), // in cm
  weight: numeric('weight'), // in kg
  wingspan: numeric('wingspan'), // in cm
  standingReach: numeric('standing_reach'), // in cm
  verticalJump: numeric('vertical_jump'), // in cm
  sprintSpeed: numeric('sprint_speed'), // in seconds (e.g., 40yd dash)
  agility: numeric('agility'), // measured score
  strengthScore: numeric('strength_score'), // composite score
  flexibilityScore: numeric('flexibility_score'), // composite score
  bodyFatPercentage: numeric('body_fat_percentage'),
  muscleMass: numeric('muscle_mass'), // in kg
  bmi: numeric('bmi'),
  vo2Max: numeric('vo2_max'),
  restingHeartRate: integer('resting_heart_rate'),
  growthVelocity: numeric('growth_velocity'), // cm/year
  heightPercentile: integer('height_percentile'),
  weightPercentile: integer('weight_percentile'),
  handedness: text('handedness'), // left, right, ambidextrous
  footedness: text('footedness'), // left, right, ambidextrous
  measurementDate: timestamp('measurement_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const insertAthleteBodyMetricsSchema = createInsertSchema(athleteBodyMetrics)
  .omit({ id: true, createdAt: true, updatedAt: true, measurementDate: true });

export type AthleteBodyMetrics = typeof athleteBodyMetrics.$inferSelect;
export type InsertAthleteBodyMetrics = z.infer<typeof insertAthleteBodyMetricsSchema>;

// Athlete assessments table
export const athleteAssessments = pgTable('athlete_assessments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  assessmentDate: timestamp('assessment_date').defaultNow(),
  assessorId: integer('assessor_id').references(() => users.id),
  athleteAge: numeric('athlete_age'), // Decimal to allow half years
  speed: integer('speed'), // 0-100 score
  agility: integer('agility'), // 0-100 score
  strength: integer('strength'), // 0-100 score
  endurance: integer('endurance'), // 0-100 score
  flexibility: integer('flexibility'), // 0-100 score
  balance: integer('balance'), // 0-100 score
  coordination: integer('coordination'), // 0-100 score
  focus: integer('focus'), // 0-100 score
  determination: integer('determination'), // 0-100 score
  teamwork: integer('teamwork'), // 0-100 score
  pressureResponse: integer('pressure_response'), // 0-100 score
  confidence: integer('confidence'), // 0-100 score
  sportSpecificSkills: json('sport_specific_skills'),
  motorSkills: json('motor_skills'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const insertAthleteAssessmentSchema = createInsertSchema(athleteAssessments)
  .omit({ id: true, createdAt: true, updatedAt: true, assessmentDate: true });

export type AthleteAssessment = typeof athleteAssessments.$inferSelect;
export type InsertAthleteAssessment = z.infer<typeof insertAthleteAssessmentSchema>;

// Athlete skills table
export const athleteSkills = pgTable('athlete_skills', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  sportId: integer('sport_id'),
  skillName: text('skill_name').notNull(),
  level: integer('level').default(1),
  experience: integer('experience'), // in hours
  lastPracticed: timestamp('last_practiced'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const insertAthleteSkillSchema = createInsertSchema(athleteSkills)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type AthleteSkill = typeof athleteSkills.$inferSelect;
export type InsertAthleteSkill = z.infer<typeof insertAthleteSkillSchema>;

// GAR scores table
export const garScores = pgTable('gar_scores', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  sportId: integer('sport_id').notNull(),
  overallScore: numeric('overall_score').notNull(),
  physicalScore: numeric('physical_score').notNull(),
  technicalScore: numeric('technical_score').notNull(),
  psychologicalScore: numeric('psychological_score').notNull(),
  developmentalScore: numeric('developmental_score').notNull(),
  adhdCompatibilityScore: numeric('adhd_compatibility_score'),
  scoreDate: timestamp('score_date').defaultNow(),
  ageAtAssessment: numeric('age_at_assessment'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const insertGarScoreSchema = createInsertSchema(garScores)
  .omit({ id: true, createdAt: true, updatedAt: true, scoreDate: true });

export type GarScore = typeof garScores.$inferSelect;
export type InsertGarScore = z.infer<typeof insertGarScoreSchema>;

// Combine Ratings Template
export const combineRatingTemplates = pgTable('combine_rating_templates', {
  id: serial('id').primaryKey(),
  template_id: text('template_id').notNull().unique(), // e.g., bas_cen_5star_1
  name: text('name').notNull(),
  star_level: integer('star_level').notNull(),
  sport: text('sport').notNull(),
  position: text('position').notNull(),
  age_group: text('age_group'),
  metrics: jsonb('metrics'), // height, weight, forty_yard_dash, etc.
  traits: jsonb('traits'), // movement, mental, resilience
  film_expectations: text('film_expectations').array(),
  training_focus: text('training_focus').array(),
  avatar: text('avatar'),
  rank: text('rank'),
  xp_level: integer('xp_level'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const insertCombineRatingTemplateSchema = createInsertSchema(combineRatingTemplates)
  .omit({ id: true, created_at: true, updated_at: true });

export type CombineRatingTemplate = typeof combineRatingTemplates.$inferSelect;
export type InsertCombineRatingTemplate = z.infer<typeof insertCombineRatingTemplateSchema>;

// Combine Athlete Ratings
export const combineAthleteRatings = pgTable('combine_athlete_ratings', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  event_id: integer('event_id').references(() => combineTourEvents.id),
  template_id: text('template_id').references(() => combineRatingTemplates.template_id),
  sport: text('sport').notNull(),
  position: text('position').notNull(),
  star_level: integer('star_level').notNull(),
  metrics: jsonb('metrics'), // Actual recorded metrics
  traits: jsonb('traits'), // Observed traits
  notes: text('notes'),
  rated_by: integer('rated_by').references(() => users.id),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const insertCombineAthleteRatingSchema = createInsertSchema(combineAthleteRatings)
  .omit({ id: true, created_at: true, updated_at: true });

export type CombineAthleteRating = typeof combineAthleteRatings.$inferSelect;
export type InsertCombineAthleteRating = z.infer<typeof insertCombineAthleteRatingSchema>;

// Combine Analysis Results
export const combineAnalysisResults = pgTable('combine_analysis_results', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  event_id: integer('event_id').references(() => combineTourEvents.id),
  video_id: integer('video_id').references(() => videos.id),
  position_fit: text('position_fit').array(), // Array of recommended positions
  skill_analysis: jsonb('skill_analysis'), // Complete breakdown of skills
  next_steps: jsonb('next_steps'), // Training recommendations
  challenges: text('challenges').array(), // Recommended challenges
  recovery_status: text('recovery_status'),
  recovery_score: integer('recovery_score'),
  ai_analysis_date: timestamp('ai_analysis_date').defaultNow(),
  ai_coach_notes: text('ai_coach_notes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const insertCombineAnalysisResultSchema = createInsertSchema(combineAnalysisResults)
  .omit({ id: true, created_at: true, updated_at: true, ai_analysis_date: true });

export type CombineAnalysisResult = typeof combineAnalysisResults.$inferSelect;
export type InsertCombineAnalysisResult = z.infer<typeof insertCombineAnalysisResultSchema>;

// Relations for Combine Rating Templates
export const combineRatingTemplateRelations = relations(combineRatingTemplates, ({ many }) => ({
  athleteRatings: many(combineAthleteRatings),
}));

// Relations for Combine Athlete Ratings
export const combineAthleteRatingRelations = relations(combineAthleteRatings, ({ one }) => ({
  user: one(users, {
    fields: [combineAthleteRatings.user_id],
    references: [users.id],
  }),
  template: one(combineRatingTemplates, {
    fields: [combineAthleteRatings.template_id],
    references: [combineRatingTemplates.template_id],
  }),
  event: one(combineTourEvents, {
    fields: [combineAthleteRatings.event_id],
    references: [combineTourEvents.id],
  }),
  rater: one(users, {
    fields: [combineAthleteRatings.rated_by],
    references: [users.id],
  }),
}));

// Relations for Combine Analysis Results
export const combineAnalysisResultRelations = relations(combineAnalysisResults, ({ one }) => ({
  user: one(users, {
    fields: [combineAnalysisResults.user_id],
    references: [users.id],
  }),
  event: one(combineTourEvents, {
    fields: [combineAnalysisResults.event_id],
    references: [combineTourEvents.id],
  }),
  video: one(videos, {
    fields: [combineAnalysisResults.video_id],
    references: [videos.id],
  }),
}));

// Sport attributes table
export const sportAttributes = pgTable('sport_attributes', {
  id: serial('id').primaryKey(),
  sportId: integer('sport_id').notNull(),
  attributeName: text('attribute_name').notNull(),
  importance: numeric('importance').notNull(), // 0-1 scale
  description: text('description'),
  developmentAge: json('development_age'), // JSON object with early, middle, late importance
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const insertSportAttributeSchema = createInsertSchema(sportAttributes)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type SportAttribute = typeof sportAttributes.$inferSelect;
export type InsertSportAttribute = z.infer<typeof insertSportAttributeSchema>;

// Transfer Portal Monitors
export const transferPortalMonitors = pgTable('transfer_portal_monitors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  active: boolean('active').default(true),
  sport: text('sport').notNull(),
  sportType: text('sport_type').notNull(),
  divisions: text('divisions').array(),
  conferences: text('conferences').array(),
  monitorType: text('monitor_type').notNull(),
  updateFrequency: integer('update_frequency').default(360),
  lastRunAt: timestamp('last_run_at'),
  alertThreshold: integer('alert_threshold').default(3),
  notifyCoaches: boolean('notify_coaches').default(true),
  positionGroups: text('position_groups').array(),
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: integer('created_by').references(() => users.id),
  transferCount: integer('transfer_count').default(0)
});

export const insertTransferPortalMonitorSchema = createInsertSchema(transferPortalMonitors)
  .omit({ id: true, lastRunAt: true, createdAt: true, transferCount: true });

export type TransferPortalMonitor = typeof transferPortalMonitors.$inferSelect;
export type InsertTransferPortalMonitor = z.infer<typeof insertTransferPortalMonitorSchema>;

// Transfer Portal Entries
export const transferPortalEntries = pgTable('transfer_portal_entries', {
  id: serial('id').primaryKey(),
  playerName: text('player_name').notNull(),
  previousSchool: text('previous_school').notNull(),
  sport: text('sport').notNull(),
  position: text('position').notNull(),
  eligibilityRemaining: text('eligibility_remaining'),
  height: text('height'),
  weight: text('weight'),
  hometown: text('hometown'),
  highSchool: text('high_school'),
  starRating: integer('star_rating'),
  portalEntryDate: timestamp('portal_entry_date').notNull(),
  lastSeasonStats: json('last_season_stats'),
  careerStats: json('career_stats'),
  academicInfo: json('academic_info'),
  injuryHistory: json('injury_history'),
  videoHighlights: text('video_highlights').array(),
  portalStatus: text('portal_status').default('active'),
  committedTo: text('committed_to'),
  commitDate: timestamp('commit_date'),
  bestFitSchools: text('best_fit_schools').array(),
  fitReasons: json('fit_reasons'),
  transferRating: integer('transfer_rating'),
  notes: text('notes'),
  socialMediaHandles: json('social_media_handles'),
  contactInfo: json('contact_info'),
  agentName: text('agent_name'),
  portalDeadline: timestamp('portal_deadline'),
  nilDeals: json('nil_deals'),
  lastUpdated: timestamp('last_updated').defaultNow()
});

export const insertTransferPortalEntrySchema = createInsertSchema(transferPortalEntries)
  .omit({ id: true, lastUpdated: true });

export type TransferPortalEntry = typeof transferPortalEntries.$inferSelect;
export type InsertTransferPortalEntry = z.infer<typeof insertTransferPortalEntrySchema>;

// Relations for Transfer Portal
export const transferPortalMonitorRelations = relations(transferPortalMonitors, ({ one }) => ({
  creator: one(users, {
    fields: [transferPortalMonitors.createdBy],
    references: [users.id],
  }),
}));

// NCAA Team Rosters
export const ncaaTeamRosters = pgTable('ncaa_team_rosters', {
  id: serial('id').primaryKey(),
  school: text('school').notNull(),
  sport: text('sport').notNull(),
  division: text('division'),
  conference: text('conference'),
  rosterStatus: text('roster_status').default('normal'),
  rosterSize: integer('roster_size'),
  positionNeeds: jsonb('position_needs'),
  lastUpdated: timestamp('last_updated').defaultNow()
});

export const insertNcaaTeamRostersSchema = createInsertSchema(ncaaTeamRosters)
  .omit({ id: true, lastUpdated: true });

export type NcaaTeamRoster = typeof ncaaTeamRosters.$inferSelect;
export type InsertNcaaTeamRoster = z.infer<typeof insertNcaaTeamRostersSchema>;

/**
 * Anthropic AI Coach Training Plans
 */
export const anthropicTrainingPlans = pgTable("anthropic_training_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  sportType: text("sport_type").notNull(),
  focusArea: text("focus_area").notNull(),
  durationDays: integer("duration_days").notNull(),
  recommendedLevel: text("recommended_level").notNull(),
  overview: text("overview").notNull(),
  planData: jsonb("plan_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  completedDay: integer("completed_day").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  rating: integer("rating"),
  feedback: text("feedback"),
});

export const insertAnthropicTrainingPlanSchema = createInsertSchema(anthropicTrainingPlans)
  .omit({ id: true, updatedAt: true, completedAt: true });

export type AnthropicTrainingPlan = typeof anthropicTrainingPlans.$inferSelect;
export type InsertAnthropicTrainingPlan = z.infer<typeof insertAnthropicTrainingPlanSchema>;

/**
 * CMS Types
 */

// Content Block and Page types would already be derived from the tables above

/**
 * Cache Statistics
 * Represents the performance metrics of the CMS cache
 */
export interface CacheStats {
  hits: number;               // Number of cache hits
  misses: number;             // Number of cache misses
  invalidations: number;      // Number of cache invalidations
  size: number;               // Current cache size (number of items)
  hitRatio: number;           // Cache hit ratio (hits / total requests)
}