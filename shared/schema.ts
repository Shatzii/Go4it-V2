import { pgTable, text, serial, integer, boolean, timestamp, json, real, date, jsonb, uuid, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Type for measurement system preference
export type MeasurementSystem = 'metric' | 'imperial';

// Zod validation for MeasurementSystem
export const measurementSystemSchema = z.enum(['metric', 'imperial']);

// User table (for both athletes and coaches)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("athlete"), // athlete, coach, admin
  profileImage: text("profile_image"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  measurementSystem: text("measurement_system").default("metric"), // 'metric' or 'imperial'
});

// Specific athlete profile information
export const athleteProfiles = pgTable("athlete_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  age: integer("age"),
  school: text("school"),
  graduationYear: integer("graduation_year"),
  sportsInterest: text("sports_interest").array(),
  motionScore: integer("motion_score").default(0), // 0-100
  profileCompletionPercentage: integer("profile_completion_percentage").default(0), // 0-100
});

// Coach profile specific information
export const coachProfiles = pgTable("coach_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  institution: text("institution"),
  sports: text("sports").array(),
  level: text("level"), // college, high school, club
  experience: integer("experience"), // years
  achievements: text("achievements"),
});

// Videos uploaded by athletes
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  filePath: text("file_path").notNull(),
  uploadDate: timestamp("upload_date").defaultNow(),
  analyzed: boolean("analyzed").default(false),
  sportType: text("sport_type"),
  thumbnailPath: text("thumbnail_path"),
});

// Analysis results from AI for videos
export const videoAnalyses = pgTable("video_analyses", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  analysisDate: timestamp("analysis_date").defaultNow(),
  motionData: json("motion_data").notNull(), // Stores motion analysis data points
  overallScore: integer("overall_score").notNull(), // 0-100
  feedback: text("feedback").notNull(),
  improvementTips: text("improvement_tips").array(),
  keyFrameTimestamps: real("key_frame_timestamps").array(), // timestamps of key moments in the video
});

// Sport recommendations for athletes
export const sportRecommendations = pgTable("sport_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sport: text("sport").notNull(),
  matchPercentage: integer("match_percentage").notNull(), // 0-100
  positionRecommendation: text("position_recommendation"),
  potentialLevel: text("potential_level"), // e.g., NCAA Div I, Club, etc.
  reasonForMatch: text("reason_for_match"),
  recommendationDate: timestamp("recommendation_date").defaultNow(),
});

// API Keys for external services
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  keyType: text("key_type").notNull().unique(), // openai, stripe, sendgrid, twilio, twitter, reddit_client_id, reddit_client_secret, etc.
  keyValue: text("key_value").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
  lastUsed: timestamp("last_used"),
  isActive: boolean("is_active").default(true),
});

// NCAA Clearinghouse eligibility tracking
export const ncaaEligibility = pgTable("ncaa_eligibility", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  coreCoursesCompleted: integer("core_courses_completed").default(0),
  coreCoursesRequired: integer("core_courses_required").default(16),
  gpa: real("gpa"),
  gpaMeetsRequirement: boolean("gpa_meets_requirement").default(false),
  satScore: integer("sat_score"),
  actScore: integer("act_score"),
  testScoresMeetRequirement: boolean("test_scores_meet_requirement").default(false),
  minimumRequiredTestScore: integer("minimum_required_test_score"),
  isInternationalStudent: boolean("is_international_student").default(false),
  countryOfEducation: text("country_of_education"),
  diplomaType: text("diploma_type"),
  internationalGradeScale: text("international_grade_scale"), // A-F, 1-10, 1-20, etc.
  hasTranslatedDocuments: boolean("has_translated_documents").default(false),
  amateurismStatus: text("amateurism_status").default("incomplete"), // incomplete, pending, verified
  ncaaDivision: text("ncaa_division").default("division_i"), // division_i, division_ii
  overallEligibilityStatus: text("overall_eligibility_status").default("incomplete"), // incomplete, partial, complete
  academicRedshirt: boolean("academic_redshirt").default(false),
  qualificationPercentage: integer("qualification_percentage").default(0), // 0-100
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// NCAA Core Course tracking
export const ncaaCoreCourses = pgTable("ncaa_core_courses", {
  id: serial("id").primaryKey(),
  eligibilityId: integer("eligibility_id").notNull().references(() => ncaaEligibility.id),
  courseName: text("course_name").notNull(),
  courseType: text("course_type").notNull(), // english, math, science, social_science, additional
  gradeEarned: text("grade_earned"),
  originalGrade: text("original_grade"), // For international students, original grade before translation
  translatedGrade: text("translated_grade"), // For international students, translated to US scale
  gradePoints: real("grade_points"), // Calculated grade points for GPA
  creditHours: real("credit_hours").notNull(),
  qualityPoints: real("quality_points"), // creditHours * gradePoints
  completed: boolean("completed").default(false),
  inProgress: boolean("in_progress").default(false),
  ncaaApproved: boolean("ncaa_approved").default(false),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected
  completionDate: date("completion_date"),
  yearTaken: integer("year_taken"),
  semesterTaken: text("semester_taken"), // fall, spring, summer
  school: text("school"),
  country: text("country"),
  isInternationalCourse: boolean("is_international_course").default(false),
  translationMethod: text("translation_method"), // How the grade was translated
  notes: text("notes"),
});

// International grade scale reference
export const gradeScales = pgTable("grade_scales", {
  id: serial("id").primaryKey(),
  country: text("country").notNull(),
  educationSystem: text("education_system").notNull(), // e.g., A-levels, IB, French Baccalaureate
  originalScale: json("original_scale").notNull(), // JSON with original grading scale
  usEquivalentScale: json("us_equivalent_scale").notNull(), // JSON with US equivalent
  conversionFormula: text("conversion_formula"), // Formula to convert grades if applicable
  notes: text("notes"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// NCAA sliding scale reference data
export const ncaaSlidingScales = pgTable("ncaa_sliding_scales", {
  id: serial("id").primaryKey(),
  effectiveDate: date("effective_date").notNull(),
  division: text("division").notNull(), // division_i, division_ii
  coreGpa: real("core_gpa").notNull(),
  minSatScore: integer("min_sat_score"), // Minimum SAT score for this GPA level
  minActScore: integer("min_act_score"), // Minimum ACT score for this GPA level
  fullQualifierStatus: boolean("full_qualifier_status").default(true), // Whether this combination qualifies for full eligibility
  academicRedshirtStatus: boolean("academic_redshirt_status").default(false), // Whether this combination qualifies for academic redshirt
  notes: text("notes"),
  isCurrentScale: boolean("is_current_scale").default(true),
});

// NCAA Document Management
export const ncaaDocuments = pgTable("ncaa_documents", {
  id: serial("id").primaryKey(),
  eligibilityId: integer("eligibility_id").notNull().references(() => ncaaEligibility.id),
  documentType: text("document_type").notNull(), // transcript, test_score, amateurism, medical, waiver
  filePath: text("file_path").notNull(),
  fileName: text("file_name").notNull(),
  uploadDate: timestamp("upload_date").defaultNow(),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected
  verificationNotes: text("verification_notes"),
  verifiedBy: integer("verified_by").references(() => users.id),
  verificationDate: timestamp("verification_date"),
});

// NCAA Eligibility Center Registration
export const ncaaRegistration = pgTable("ncaa_registration", {
  id: serial("id").primaryKey(),
  eligibilityId: integer("eligibility_id").notNull().references(() => ncaaEligibility.id),
  ncaaId: text("ncaa_id"),
  registrationDate: timestamp("registration_date"),
  registrationStatus: text("registration_status").default("not_started"), // not_started, in_progress, completed
  academicStatus: text("academic_status"), // qualifier, partial_qualifier, non_qualifier, pending
  amateurismCertified: boolean("amateurism_certified").default(false),
  divisionLevel: text("division_level"), // division_i, division_ii
  finalCertificationDate: timestamp("final_certification_date"),
});

// Coach-athlete connections
export const coachConnections = pgTable("coach_connections", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => users.id),
  athleteId: integer("athlete_id").notNull().references(() => users.id),
  connectionStatus: text("connection_status").notNull().default("pending"), // pending, accepted, rejected
  connectionDate: timestamp("connection_date").defaultNow(),
  notes: text("notes"),
  lastContact: timestamp("last_contact"),
});

// Achievements for gamification
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  achievementType: text("achievement_type").notNull(), // video, profile, ncaa, connection
  earnedDate: timestamp("earned_date").defaultNow(),
  iconType: text("icon_type"), // For storing icon identifier
});

// Messages between coaches and athletes
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  recipientId: integer("recipient_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("sent_at").defaultNow(),
  isRead: boolean("read").default(false),
});

// Blogs and articles
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  coverImage: text("cover_image"),
  authorId: integer("author_id").references(() => users.id),
  category: text("category").notNull(), // nextup, analysis, combine, tips
  publishDate: timestamp("publish_date").defaultNow(),
  featured: boolean("featured").default(false),
  slug: text("slug").notNull().unique(),
  tags: text("tags").array(),
});

// Site images for logos, banners, backgrounds, etc.
export const siteImages = pgTable("site_images", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  alt: text("alt").notNull(),
  location: text("location").notNull(), // "logo", "header", "background", "footer-logo", "banner", "icon"
  active: boolean("active").default(true),
  uploadDate: timestamp("upload_date").defaultNow(),
});

// Content blocks for editable site content like "What Makes Us Different" section
export const contentBlocks = pgTable("content_blocks", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull().unique(), // unique key to identify this content block
  title: text("title").notNull(),
  content: text("content").notNull(),
  section: text("section").notNull(), // e.g., "home", "about", "services"
  order: integer("order").default(0),
  active: boolean("active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  lastUpdatedBy: integer("last_updated_by").references(() => users.id),
  metadata: jsonb("metadata"), // for storing additional structured data
});

// Featured athletes 
export const featuredAthletes = pgTable("featured_athletes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  coverImage: text("cover_image"),
  featuredVideo: text("featured_video").references(() => videos.id),
  highlightText: text("highlight_text").notNull(),
  sportPosition: text("sport_position"),
  starRating: integer("star_rating").notNull(),
  featuredStats: json("featured_stats"),
  featuredDate: timestamp("featured_date").defaultNow(),
  order: integer("order").default(0),
  active: boolean("active").default(true),
});

// Skills for athlete's skill tree
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skillName: text("skill_name").notNull(),
  skillCategory: text("skill_category").notNull(), // speed, strength, agility, technique, etc
  skillLevel: integer("skill_level").notNull().default(0), // 0-5 rating
  xpPoints: integer("xp_points").notNull().default(0),
  nextLevelXp: integer("next_level_xp").notNull().default(100),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Challenges for workout and training gamification
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  xpReward: integer("xp_reward").notNull(),
  category: text("category").notNull(), // speed, strength, agility, etc
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  creatorId: integer("creator_id").references(() => users.id), // null for system challenges
});

// Athlete challenge participation 
export const athleteChallenges = pgTable("athlete_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  status: text("status").notNull().default("accepted"), // accepted, completed, failed
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  proofUrl: text("proof_url"), // video or photo proof of completion
});

// Recovery tracking for athletes
export const recoveryLogs = pgTable("recovery_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  logDate: date("log_date").notNull().defaultNow(),
  sleepHours: real("sleep_hours"),
  sorenessLevel: integer("soreness_level"), // 1-10
  energyLevel: integer("energy_level"), // 1-10
  hydrationLevel: integer("hydration_level"), // 1-10
  notes: text("notes"),
  overallRecoveryScore: integer("overall_recovery_score"), // 0-100
});

// Star rating athlete profiles for benchmarking standard levels
export const athleteStarProfiles = pgTable("athlete_star_profiles", {
  id: serial("id").primaryKey(),
  profileId: text("profile_id").notNull().unique(), // The original ID from the JSON file (e.g., foo_qua_5star_1)
  userId: integer("user_id").references(() => users.id), // If connected to a user account
  name: text("name").notNull(),
  starLevel: integer("star_level").notNull(), // 1-5 stars
  sport: text("sport").notNull(),
  position: text("position").notNull(),
  ageGroup: text("age_group"),
  metrics: jsonb("metrics").notNull(), // Height, weight, forty, vertical, GPA, etc.
  traits: jsonb("traits").notNull(), // Movement, mental, resilience traits
  filmExpectations: text("film_expectations").array(),
  trainingFocus: text("training_focus").array(),
  avatar: text("avatar").notNull(), // Path to headshot image
  rank: text("rank"),
  xpLevel: integer("xp_level").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fan club followers
export const fanClubFollowers = pgTable("fan_club_followers", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").notNull().references(() => users.id),
  followerName: text("follower_name").notNull(),
  followerEmail: text("follower_email"),
  followerType: text("follower_type").notNull(), // fan, recruiter, friend, family
  followDate: timestamp("follow_date").defaultNow(),
  notes: text("notes"),
});

// Next up leaderboard entries
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(), // by sport or skill
  rankPosition: integer("rank_position").notNull(),
  score: integer("score").notNull(),
  city: text("city"),
  state: text("state"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workout playlists
export const workoutPlaylists = pgTable("workout_playlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  workoutType: text("workout_type").notNull(), // strength, cardio, flexibility, sport-specific, recovery
  intensityLevel: text("intensity_level").notNull(), // low, medium, high
  duration: integer("duration").notNull(), // in minutes
  targets: text("targets").array(), // body parts or skills targeted
  createdAt: timestamp("created_at").defaultNow(),
  lastUsed: timestamp("last_used"),
  timesUsed: integer("times_used").default(0),
  isCustom: boolean("is_custom").default(true),
  isPublic: boolean("is_public").default(false),
});

// Workout exercises in playlists
export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").notNull().references(() => workoutPlaylists.id),
  name: text("name").notNull(),
  description: text("description"),
  sets: integer("sets"),
  reps: integer("reps"),
  duration: integer("duration"), // in seconds, for timed exercises
  restPeriod: integer("rest_period"), // in seconds
  order: integer("order").notNull(),
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
  notes: text("notes"),
  equipmentNeeded: text("equipment_needed").array(),
});

// Film Comparison feature
export const filmComparisons = pgTable("film_comparisons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  isPublic: boolean("is_public").default(false),
  comparisonType: text("comparison_type").notNull(), // self, pro, teammate
  status: text("status").notNull().default("draft"), // draft, completed, shared
  tags: text("tags").array(),
});

export const comparisonVideos = pgTable("comparison_videos", {
  id: serial("id").primaryKey(),
  comparisonId: integer("comparison_id").notNull().references(() => filmComparisons.id),
  videoId: integer("video_id").references(() => videos.id),
  externalVideoUrl: text("external_video_url"),
  athleteName: text("athlete_name"),
  videoType: text("video_type").notNull(), // base, comparison
  order: integer("order").default(0),
  notes: text("notes"),
  keyPoints: text("key_points").array(),
  markups: json("markups"), // Stores drawing data for the video
});

export const comparisonAnalyses = pgTable("comparison_analyses", {
  id: serial("id").primaryKey(),
  comparisonId: integer("comparison_id").notNull().references(() => filmComparisons.id),
  analysisDate: timestamp("analysis_date").defaultNow(),
  similarityScore: integer("similarity_score"), // 0-100
  differences: json("differences"), // Key differences in technique
  recommendations: text("recommendations").array(),
  aiGeneratedNotes: text("ai_generated_notes"),
  techniqueBreakdown: json("technique_breakdown"),
  // Football coach specific analyses
  playAssignments: json("play_assignments"), // Expected assignments for each player
  assignmentGrades: json("assignment_grades"), // How well each player executed their assignment (0-100)
  bustedCoverage: boolean("busted_coverage").default(false),
  bustedCoverageDetails: json("busted_coverage_details"), // Details about coverage breakdowns
  playerComparisons: json("player_comparisons"), // Size, speed, competition level comparisons
  performanceRating: json("performance_rating"), // True rating based on performance metrics
  recommendedExamples: json("recommended_examples"), // URLs to recommended technique examples
  defenseAnalysis: json("defense_analysis"), // Analysis of defensive scheme and execution
});

// NextUp Spotlight feature
export const spotlightProfiles = pgTable("spotlight_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  story: text("story").notNull(),
  coverImage: text("cover_image").notNull(),
  mediaGallery: text("media_gallery").array(),
  spotlightDate: timestamp("spotlight_date").defaultNow(),
  featured: boolean("featured").default(false),
  status: text("status").notNull().default("pending"), // pending, approved, archived
  approvedBy: integer("approved_by").references(() => users.id),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  isTrending: boolean("is_trending").default(false),
  category: text("category").notNull(), // Rising Star, Comeback Story, etc.
});

// MyPlayer XP System
export const playerProgress = pgTable("player_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currentLevel: integer("current_level").notNull().default(1),
  totalXp: integer("total_xp").notNull().default(0),
  levelXp: integer("level_xp").notNull().default(0),
  xpToNextLevel: integer("xp_to_next_level").notNull().default(100),
  rank: text("rank").notNull().default("Rookie"),
  lifetimeAchievements: integer("lifetime_achievements").default(0),
  streakDays: integer("streak_days").default(0),
  lastActive: timestamp("last_active").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const xpTransactions = pgTable("xp_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  transactionType: text("transaction_type").notNull(), // workout, challenge, video, analysis, etc.
  sourceId: text("source_id"), // ID of the source that generated XP
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  multiplier: real("multiplier").default(1.0),
});

export const playerBadges = pgTable("player_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: text("badge_id").notNull(),
  badgeName: text("badge_name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // athletic, academic, leadership, etc.
  tier: text("tier").notNull().default("bronze"), // bronze, silver, gold, platinum
  isActive: boolean("is_active").default(true),
  iconPath: text("icon_path").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: integer("progress").default(100), // Percentage of completion
});

// MyPlayer Workout Verification
export const workoutVerifications = pgTable("workout_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  workoutId: integer("workout_id").references(() => workoutPlaylists.id),
  title: text("title").notNull(),
  submissionDate: timestamp("submission_date").defaultNow(),
  verificationStatus: text("verification_status").notNull().default("pending"), // pending, approved, rejected
  verifiedBy: integer("verified_by").references(() => users.id),
  verificationDate: timestamp("verification_date"),
  verificationMethod: text("verification_method"), // coach, AI, photo, video
  proofType: text("proof_type"), // photo, video, coach-verified, location
  proofData: text("proof_data"), // URL or data for verification
  notes: text("notes"),
  xpEarned: integer("xp_earned").default(0),
  duration: integer("duration"), // in minutes
  recoveryImpact: integer("recovery_impact"), // 1-10
});

// Video highlights table for storing short clips generated from original videos
export const videoHighlights = pgTable("video_highlights", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: real("start_time").notNull(), // Start timestamp in seconds
  endTime: real("end_time").notNull(), // End timestamp in seconds
  highlightPath: text("highlight_path").notNull(), // Path to the generated highlight clip
  thumbnailPath: text("thumbnail_path"), // Path to the thumbnail image
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  aiGenerated: boolean("ai_generated").default(false), // Whether this was auto-generated by AI
  featured: boolean("featured").default(false), // Whether this is a featured highlight
  tags: text("tags").array(), // Tags for categorizing highlights
});

export const workoutVerificationCheckpoints = pgTable("workout_verification_checkpoints", {
  id: serial("id").primaryKey(),
  verificationId: integer("verification_id").notNull().references(() => workoutVerifications.id),
  exerciseName: text("exercise_name").notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedAmount: integer("completed_amount"), // reps or time
  targetAmount: integer("target_amount"), // target reps or time
  feedback: text("feedback"),
  mediaProof: text("media_proof"), // URL to proof media
  checkpointOrder: integer("checkpoint_order").notNull(),
});

// MyPlayer UI Weight Room
export const weightRoomEquipment = pgTable("weight_room_equipment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  equipmentType: text("equipment_type").notNull(), // strength, cardio, agility, plyometric, functional
  difficultyLevel: text("difficulty_level").notNull(), // beginner, intermediate, advanced
  targetMuscles: text("target_muscles").array(),
  baseXp: integer("base_xp").notNull(),
  iconPath: text("icon_path").notNull(),
  modelPath: text("model_path"),
  price: integer("price").notNull().default(0),
  unlockLevel: integer("unlock_level").notNull().default(1),
  isPremium: boolean("is_premium").default(false),
});

export const playerEquipment = pgTable("player_equipment", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  equipmentId: integer("equipment_id").notNull().references(() => weightRoomEquipment.id),
  acquiredDate: timestamp("acquired_date").defaultNow(),
  level: integer("level").notNull().default(1),
  timesUsed: integer("times_used").default(0),
  lastUsed: timestamp("last_used"),
  isFavorite: boolean("is_favorite").default(false),
  customName: text("custom_name"),
  usageStreak: integer("usage_streak").default(0),
});

/* Combine Tour Events Table */
export const combineTourEvents = pgTable(
  "combine_tour_events",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    location: text("location").notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    zipCode: text("zip_code").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    registrationDeadline: timestamp("registration_deadline"),
    maximumAttendees: integer("maximum_attendees"),
    currentAttendees: integer("current_attendees").default(0),
    price: numeric("price").notNull(),
    slug: text("slug").notNull().unique(),
    status: text("status").default("draft"), // draft, published, cancelled, completed
    featuredImage: text("featured_image"),
    activeNetworkId: text("active_network_id"),
    registrationUrl: text("registration_url"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
  }
);

/* Registrations Table */
export const registrations = pgTable(
  "registrations",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id),
    eventId: integer("event_id").references(() => combineTourEvents.id),
    status: text("status").default("pending"), // pending, confirmed, cancelled, waitlisted
    externalId: text("external_id"), // ID in Active Network
    registeredAt: timestamp("registered_at").defaultNow(),
    paymentStatus: text("payment_status").default("unpaid"), // unpaid, processing, paid, refunded
    notes: text("notes"),
    checkInTime: timestamp("check_in_time"),
    completedAt: timestamp("completed_at")
  }
);

/* Payments Table */
export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    registrationId: integer("registration_id").references(() => registrations.id),
    amount: numeric("amount").notNull(),
    externalId: text("external_id"), // ID from Active Network
    status: text("status").notNull(), // pending, completed, failed, refunded
    processedAt: timestamp("processed_at").defaultNow(),
    refundedAt: timestamp("refunded_at")
  }
);

// Create insert schemas for all tables
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

// Extend the insertUserSchema with validation for measurementSystem
export const insertUserWithMeasurementSchema = insertUserSchema.extend({
  measurementSystem: measurementSystemSchema.optional().default('metric'),
});
export const insertAthleteProfileSchema = createInsertSchema(athleteProfiles).omit({ id: true });
export const insertCoachProfileSchema = createInsertSchema(coachProfiles).omit({ id: true });
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, uploadDate: true, analyzed: true });

// Adding a more flexible filePath validation
export const insertVideoWithFileSchema = insertVideoSchema.extend({
  filePath: z.string(),
  sportType: z.string().optional(),
  thumbnailPath: z.string().optional()
});
export const insertVideoAnalysisSchema = createInsertSchema(videoAnalyses).omit({ id: true, analysisDate: true });
export const insertSportRecommendationSchema = createInsertSchema(sportRecommendations).omit({ id: true, recommendationDate: true });
export const insertNcaaEligibilitySchema = createInsertSchema(ncaaEligibility).omit({ 
  id: true, 
  lastUpdated: true,
  qualificationPercentage: true // Calculated value, not user input
});

export const insertNcaaCoreCourseSchema = createInsertSchema(ncaaCoreCourses).omit({ 
  id: true, 
  qualityPoints: true, // Calculated value
  gradePoints: true // Calculated value
});

export const insertGradeScaleSchema = createInsertSchema(gradeScales).omit({ 
  id: true, 
  lastUpdated: true 
});

export const insertNcaaSlidingScaleSchema = createInsertSchema(ncaaSlidingScales).omit({ 
  id: true 
});

export const insertNcaaDocumentSchema = createInsertSchema(ncaaDocuments).omit({ 
  id: true, 
  uploadDate: true,
  verificationDate: true 
});

export const insertNcaaRegistrationSchema = createInsertSchema(ncaaRegistration).omit({ 
  id: true,
  finalCertificationDate: true
});
export const insertCoachConnectionSchema = createInsertSchema(coachConnections).omit({ id: true, connectionDate: true, lastContact: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, earnedDate: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true, isRead: true });

// New schema for story mode components
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true, updatedAt: true });
export const insertChallengeSchema = createInsertSchema(challenges).omit({ id: true, createdAt: true });
export const insertAthleteChallengeSchema = createInsertSchema(athleteChallenges).omit({ id: true, startedAt: true, completedAt: true });
export const insertRecoveryLogSchema = createInsertSchema(recoveryLogs).omit({ id: true, logDate: true });
export const insertFanClubFollowerSchema = createInsertSchema(fanClubFollowers).omit({ id: true, followDate: true });
export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).omit({ id: true, updatedAt: true });
export const insertWorkoutPlaylistSchema = createInsertSchema(workoutPlaylists).omit({ id: true, createdAt: true, lastUsed: true, timesUsed: true });
export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises).omit({ id: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  publishDate: z.date().optional(),
}).omit({ id: true });

export const insertFeaturedAthleteSchema = createInsertSchema(featuredAthletes, {
  featuredDate: z.date().optional(),
}).omit({ id: true });

// Site Images insert schema
export const insertSiteImageSchema = createInsertSchema(siteImages).omit({ id: true, uploadDate: true });

// Content Blocks insert schema
export const insertContentBlockSchema = createInsertSchema(contentBlocks).omit({ id: true, lastUpdated: true, lastUpdatedBy: true });

// Film Comparison feature insert schemas
export const insertFilmComparisonSchema = createInsertSchema(filmComparisons).omit({ id: true, createdAt: true });
export const insertComparisonVideoSchema = createInsertSchema(comparisonVideos).omit({ id: true });
export const insertComparisonAnalysisSchema = createInsertSchema(comparisonAnalyses).omit({ id: true, analysisDate: true });

// NextUp Spotlight feature insert schema
export const insertSpotlightProfileSchema = createInsertSchema(spotlightProfiles, {
  spotlightDate: z.date().optional(),
}).omit({ id: true, views: true, likes: true });

// MyPlayer XP System insert schemas
export const insertPlayerProgressSchema = createInsertSchema(playerProgress).omit({ 
  id: true, lastActive: true, updatedAt: true 
});
export const insertXpTransactionSchema = createInsertSchema(xpTransactions).omit({ id: true, createdAt: true });
export const insertPlayerBadgeSchema = createInsertSchema(playerBadges).omit({ id: true, earnedAt: true });

// MyPlayer Workout Verification insert schemas
export const insertWorkoutVerificationSchema = createInsertSchema(workoutVerifications).omit({ 
  id: true, submissionDate: true, verificationDate: true 
});
export const insertWorkoutVerificationCheckpointSchema = createInsertSchema(workoutVerificationCheckpoints).omit({ id: true });

// MyPlayer UI Weight Room insert schemas
export const insertWeightRoomEquipmentSchema = createInsertSchema(weightRoomEquipment).omit({ id: true });
export const insertPlayerEquipmentSchema = createInsertSchema(playerEquipment).omit({ 
  id: true, acquiredDate: true, lastUsed: true,
});

// Video Highlights insert schema
export const insertVideoHighlightSchema = createInsertSchema(videoHighlights).omit({
  id: true, createdAt: true
});

// Export types for insert and select operations
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserWithMeasurement = z.infer<typeof insertUserWithMeasurementSchema>;

export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type InsertAthleteProfile = z.infer<typeof insertAthleteProfileSchema>;

export type CoachProfile = typeof coachProfiles.$inferSelect;
export type InsertCoachProfile = z.infer<typeof insertCoachProfileSchema>;

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type VideoAnalysis = typeof videoAnalyses.$inferSelect;
export type InsertVideoAnalysis = z.infer<typeof insertVideoAnalysisSchema>;

export type SportRecommendation = typeof sportRecommendations.$inferSelect;
export type InsertSportRecommendation = z.infer<typeof insertSportRecommendationSchema>;

export type NcaaEligibility = typeof ncaaEligibility.$inferSelect;
export type InsertNcaaEligibility = z.infer<typeof insertNcaaEligibilitySchema>;

export type NcaaCoreCourse = typeof ncaaCoreCourses.$inferSelect;
export type InsertNcaaCoreCourse = z.infer<typeof insertNcaaCoreCourseSchema>;

export type GradeScale = typeof gradeScales.$inferSelect;
export type InsertGradeScale = z.infer<typeof insertGradeScaleSchema>;

export type NcaaSlidingScale = typeof ncaaSlidingScales.$inferSelect;
export type InsertNcaaSlidingScale = z.infer<typeof insertNcaaSlidingScaleSchema>;

export type NcaaDocument = typeof ncaaDocuments.$inferSelect;
export type InsertNcaaDocument = z.infer<typeof insertNcaaDocumentSchema>;

export type NcaaRegistration = typeof ncaaRegistration.$inferSelect;
export type InsertNcaaRegistration = z.infer<typeof insertNcaaRegistrationSchema>;

export type CoachConnection = typeof coachConnections.$inferSelect;
export type InsertCoachConnection = z.infer<typeof insertCoachConnectionSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Story mode component types
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type AthleteChallenge = typeof athleteChallenges.$inferSelect;
export type InsertAthleteChallenge = z.infer<typeof insertAthleteChallengeSchema>;

export type RecoveryLog = typeof recoveryLogs.$inferSelect;
export type InsertRecoveryLog = z.infer<typeof insertRecoveryLogSchema>;

export type FanClubFollower = typeof fanClubFollowers.$inferSelect;
export type InsertFanClubFollower = z.infer<typeof insertFanClubFollowerSchema>;

export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type SiteImage = typeof siteImages.$inferSelect;
export type InsertSiteImage = z.infer<typeof insertSiteImageSchema>;

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type InsertContentBlock = z.infer<typeof insertContentBlockSchema>;

export type FeaturedAthlete = typeof featuredAthletes.$inferSelect;
export type InsertFeaturedAthlete = z.infer<typeof insertFeaturedAthleteSchema>;

// Workout playlist types
export type WorkoutPlaylist = typeof workoutPlaylists.$inferSelect;
export type InsertWorkoutPlaylist = z.infer<typeof insertWorkoutPlaylistSchema>;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;

// Film Comparison feature types
export type FilmComparison = typeof filmComparisons.$inferSelect;
export type InsertFilmComparison = z.infer<typeof insertFilmComparisonSchema>;

export type ComparisonVideo = typeof comparisonVideos.$inferSelect;
export type InsertComparisonVideo = z.infer<typeof insertComparisonVideoSchema>;

export type ComparisonAnalysis = typeof comparisonAnalyses.$inferSelect;
export type InsertComparisonAnalysis = z.infer<typeof insertComparisonAnalysisSchema>;

// NextUp Spotlight feature types
export type SpotlightProfile = typeof spotlightProfiles.$inferSelect;
export type InsertSpotlightProfile = z.infer<typeof insertSpotlightProfileSchema>;

// MyPlayer XP System types
export type PlayerProgress = typeof playerProgress.$inferSelect;
export type InsertPlayerProgress = z.infer<typeof insertPlayerProgressSchema>;

export type XpTransaction = typeof xpTransactions.$inferSelect;
export type InsertXpTransaction = z.infer<typeof insertXpTransactionSchema>;

export type PlayerBadge = typeof playerBadges.$inferSelect;
export type InsertPlayerBadge = z.infer<typeof insertPlayerBadgeSchema>;

// MyPlayer Workout Verification types
export type WorkoutVerification = typeof workoutVerifications.$inferSelect;
export type InsertWorkoutVerification = z.infer<typeof insertWorkoutVerificationSchema>;

export type WorkoutVerificationCheckpoint = typeof workoutVerificationCheckpoints.$inferSelect;
export type InsertWorkoutVerificationCheckpoint = z.infer<typeof insertWorkoutVerificationCheckpointSchema>;

// MyPlayer UI Weight Room types
export type WeightRoomEquipment = typeof weightRoomEquipment.$inferSelect;
export type InsertWeightRoomEquipment = z.infer<typeof insertWeightRoomEquipmentSchema>;

export type PlayerEquipment = typeof playerEquipment.$inferSelect;
export type InsertPlayerEquipment = z.infer<typeof insertPlayerEquipmentSchema>;

// Active Network payment integration types
export const insertCombineTourEventSchema = createInsertSchema(combineTourEvents).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  currentAttendees: true 
});
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ 
  id: true, 
  registeredAt: true,
  checkInTime: true,
  completedAt: true
});
export const insertPaymentSchema = createInsertSchema(payments).omit({ 
  id: true, 
  processedAt: true,
  refundedAt: true
});

export type CombineTourEvent = typeof combineTourEvents.$inferSelect;
export type InsertCombineTourEvent = z.infer<typeof insertCombineTourEventSchema>;

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

// Video Highlight types
export type VideoHighlight = typeof videoHighlights.$inferSelect;
export type InsertVideoHighlight = z.infer<typeof insertVideoHighlightSchema>;

// API Key schema and types
export const insertApiKeySchema = createInsertSchema(apiKeys, {
  keyType: z.enum(['openai', 'stripe', 'sendgrid', 'twilio', 'google', 'aws', 'active', 'twitter', 'reddit_client_id', 'reddit_client_secret']),
}).omit({ id: true, addedAt: true, lastUsed: true });

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

export const insertAthleteStarProfileSchema = createInsertSchema(athleteStarProfiles).omit({ 
  id: true, 
  createdAt: true 
});
export type AthleteStarProfile = typeof athleteStarProfiles.$inferSelect;
export type InsertAthleteStarProfile = z.infer<typeof insertAthleteStarProfileSchema>;

// Onboarding Tutorial Progress
export const onboardingProgress = pgTable("onboarding_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  isCompleted: boolean("is_completed").notNull().default(false),
  currentStep: integer("current_step").notNull().default(1),
  totalSteps: integer("total_steps").notNull().default(5),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  completedSections: text("completed_sections").array(),
  skippedSections: text("skipped_sections").array(),
});

// Athlete Journey Map
export const athleteJourneyMap = pgTable("athlete_journey_map", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  currentPhase: text("current_phase").notNull(),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  timeline: jsonb("timeline").notNull(),
  goals: jsonb("goals").notNull(),
  milestones: jsonb("milestones").notNull(),
});

// Journey Milestones
export const journeyMilestones = pgTable("journey_milestones", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  journeyMapId: integer("journey_map_id").notNull().references(() => athleteJourneyMap.id),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: timestamp("target_date"),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  type: text("type").notNull(), // athletic, academic, personal
  priority: integer("priority").notNull().default(1),
});

// Insert schemas for the new tables
export const insertOnboardingProgressSchema = createInsertSchema(onboardingProgress).omit({
  id: true,
  lastUpdated: true
});

export const insertAthleteJourneyMapSchema = createInsertSchema(athleteJourneyMap).omit({
  id: true,
  startedAt: true,
  updatedAt: true
});

export const insertJourneyMilestoneSchema = createInsertSchema(journeyMilestones).omit({
  id: true,
  completedAt: true
});

// Types for the new tables
export type OnboardingProgress = typeof onboardingProgress.$inferSelect;
export type InsertOnboardingProgress = z.infer<typeof insertOnboardingProgressSchema>;

export type AthleteJourneyMap = typeof athleteJourneyMap.$inferSelect;
export type InsertAthleteJourneyMap = z.infer<typeof insertAthleteJourneyMapSchema>;

export type JourneyMilestone = typeof journeyMilestones.$inferSelect;
export type InsertJourneyMilestone = z.infer<typeof insertJourneyMilestoneSchema>;
