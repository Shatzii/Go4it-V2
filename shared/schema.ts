import { pgTable, text, serial, integer, boolean, timestamp, json, real, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

// NCAA Clearinghouse eligibility tracking
export const ncaaEligibility = pgTable("ncaa_eligibility", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  coreCoursesCompleted: integer("core_courses_completed").default(0),
  coreCoursesRequired: integer("core_courses_required").default(16),
  gpa: real("gpa"),
  gpaMeetsRequirement: boolean("gpa_meets_requirement").default(false),
  testScores: text("test_scores"), // SAT/ACT scores
  testScoresMeetRequirement: boolean("test_scores_meet_requirement").default(false),
  amateurismStatus: text("amateurism_status").default("incomplete"), // incomplete, pending, verified
  overallEligibilityStatus: text("overall_eligibility_status").default("incomplete"), // incomplete, partial, complete
  lastUpdated: timestamp("last_updated").defaultNow(),
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

// Create insert schemas for all tables
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertAthleteProfileSchema = createInsertSchema(athleteProfiles).omit({ id: true });
export const insertCoachProfileSchema = createInsertSchema(coachProfiles).omit({ id: true });
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, uploadDate: true, analyzed: true });
export const insertVideoAnalysisSchema = createInsertSchema(videoAnalyses).omit({ id: true, analysisDate: true });
export const insertSportRecommendationSchema = createInsertSchema(sportRecommendations).omit({ id: true, recommendationDate: true });
export const insertNcaaEligibilitySchema = createInsertSchema(ncaaEligibility).omit({ id: true, lastUpdated: true });
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

// Export types for insert and select operations
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

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

export type FeaturedAthlete = typeof featuredAthletes.$inferSelect;
export type InsertFeaturedAthlete = z.infer<typeof insertFeaturedAthleteSchema>;

// Workout playlist types
export type WorkoutPlaylist = typeof workoutPlaylists.$inferSelect;
export type InsertWorkoutPlaylist = z.infer<typeof insertWorkoutPlaylistSchema>;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;
