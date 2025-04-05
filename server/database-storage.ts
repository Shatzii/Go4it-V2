import {
  users, type User, type InsertUser,
  athleteProfiles, type AthleteProfile, type InsertAthleteProfile,
  coachProfiles, type CoachProfile, type InsertCoachProfile,
  videos, type Video, type InsertVideo,
  videoAnalyses, type VideoAnalysis, type InsertVideoAnalysis,
  sportRecommendations, type SportRecommendation, type InsertSportRecommendation,
  apiKeys, type ApiKey, type InsertApiKey,
  ncaaEligibility, type NcaaEligibility, type InsertNcaaEligibility,
  coachConnections, type CoachConnection, type InsertCoachConnection,
  achievements, type Achievement, type InsertAchievement,
  messages, type Message, type InsertMessage,
  skills, type Skill, type InsertSkill,
  challenges, type Challenge, type InsertChallenge,
  athleteChallenges, type AthleteChallenge, type InsertAthleteChallenge,
  recoveryLogs, type RecoveryLog, type InsertRecoveryLog,
  fanClubFollowers, type FanClubFollower, type InsertFanClubFollower,
  leaderboardEntries, type LeaderboardEntry, type InsertLeaderboardEntry,
  blogPosts, type BlogPost, type InsertBlogPost,
  featuredAthletes, type FeaturedAthlete, type InsertFeaturedAthlete,
  workoutPlaylists, type WorkoutPlaylist, type InsertWorkoutPlaylist,
  workoutExercises, type WorkoutExercise, type InsertWorkoutExercise,
  filmComparisons, type FilmComparison, type InsertFilmComparison,
  comparisonVideos, type ComparisonVideo, type InsertComparisonVideo,
  comparisonAnalyses, type ComparisonAnalysis, type InsertComparisonAnalysis,
  playerProgress, type PlayerProgress, type InsertPlayerProgress,
  xpTransactions, type XpTransaction, type InsertXpTransaction,
  playerBadges, type PlayerBadge, type InsertPlayerBadge,
  workoutVerifications, type WorkoutVerification, type InsertWorkoutVerification,
  workoutVerificationCheckpoints, type WorkoutVerificationCheckpoint, type InsertWorkoutVerificationCheckpoint,
  weightRoomEquipment, type WeightRoomEquipment, type InsertWeightRoomEquipment,
  playerEquipment, type PlayerEquipment, type InsertPlayerEquipment,
  videoHighlights, type VideoHighlight, type InsertVideoHighlight,
  athleteStarProfiles, type AthleteStarProfile, type InsertAthleteStarProfile,
  onboardingProgress, type OnboardingProgress, type InsertOnboardingProgress,
  athleteJourneyMap, type AthleteJourneyMap, type InsertAthleteJourneyMap,
  journeyMilestones, type JourneyMilestone, type InsertJourneyMilestone,
  contentBlocks, type ContentBlock, type InsertContentBlock
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, and, desc, asc, sql, isNull, isNotNull } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { AnalysisResult } from "./openai";

const scryptAsync = promisify(scrypt);

// Functions for password hashing
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    // Setup session store with PostgreSQL
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
      },
      createTableIfMissing: true,
      tableName: 'session',
      ttl: 60 * 60 * 24 * 7, // 1 week
      pruneSessionInterval: 60 // 1 minute
    });
    
    // Seed initial data for testing
    this.seedInitialData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(sql`LOWER(${users.username})`, username.toLowerCase()));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(sql`LOWER(${users.email})`, email.toLowerCase()));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: await hashPassword(insertUser.password),
        createdAt: new Date()
      })
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    let updateData = { ...data };
    
    // If password is provided, hash it
    if (data.password) {
      updateData = {
        ...data,
        password: await hashPassword(data.password)
      };
    }
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }
  
  // Athlete Profile operations
  async getAthleteProfile(userId: number): Promise<AthleteProfile | undefined> {
    const [profile] = await db
      .select()
      .from(athleteProfiles)
      .where(eq(athleteProfiles.userId, userId));
    return profile;
  }

  async createAthleteProfile(profile: InsertAthleteProfile): Promise<AthleteProfile> {
    const [athleteProfile] = await db
      .insert(athleteProfiles)
      .values(profile)
      .returning();
    return athleteProfile;
  }

  async updateAthleteProfile(userId: number, data: Partial<AthleteProfile>): Promise<AthleteProfile | undefined> {
    const [profile] = await db
      .update(athleteProfiles)
      .set(data)
      .where(eq(athleteProfiles.userId, userId))
      .returning();
    return profile;
  }
  
  // Coach Profile operations
  async getCoachProfile(userId: number): Promise<CoachProfile | undefined> {
    const [profile] = await db
      .select()
      .from(coachProfiles)
      .where(eq(coachProfiles.userId, userId));
    return profile;
  }

  async createCoachProfile(profile: InsertCoachProfile): Promise<CoachProfile> {
    const [coachProfile] = await db
      .insert(coachProfiles)
      .values(profile)
      .returning();
    return coachProfile;
  }

  async updateCoachProfile(userId: number, data: Partial<CoachProfile>): Promise<CoachProfile | undefined> {
    const [profile] = await db
      .update(coachProfiles)
      .set(data)
      .where(eq(coachProfiles.userId, userId))
      .returning();
    return profile;
  }
  
  // Video operations
  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, id));
    return video;
  }

  async getVideosByUser(userId: number): Promise<Video[]> {
    return await db
      .select()
      .from(videos)
      .where(eq(videos.userId, userId))
      .orderBy(desc(videos.uploadDate));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const now = new Date();
    const [newVideo] = await db
      .insert(videos)
      .values({
        ...video,
        uploadDate: now,
        analyzed: false
      })
      .returning();
    return newVideo;
  }

  async updateVideo(id: number, data: Partial<Video>): Promise<Video | undefined> {
    const [video] = await db
      .update(videos)
      .set(data)
      .where(eq(videos.id, id))
      .returning();
    return video;
  }

  async deleteVideo(id: number): Promise<boolean> {
    const result = await db
      .delete(videos)
      .where(eq(videos.id, id));
    return result.count > 0;
  }
  
  // Video Analysis operations
  async getVideoAnalysis(id: number): Promise<VideoAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(videoAnalyses)
      .where(eq(videoAnalyses.id, id));
    return analysis;
  }

  async getVideoAnalysisByVideoId(videoId: number): Promise<VideoAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(videoAnalyses)
      .where(eq(videoAnalyses.videoId, videoId));
    return analysis;
  }

  async createVideoAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis> {
    const now = new Date();
    
    // Update the video to mark it as analyzed
    await db
      .update(videos)
      .set({ analyzed: true })
      .where(eq(videos.id, analysis.videoId));
    
    const [videoAnalysis] = await db
      .insert(videoAnalyses)
      .values({
        ...analysis,
        analysisDate: now
      })
      .returning();
    
    return videoAnalysis;
  }
  
  async saveVideoAnalysis(videoId: number, analysis: AnalysisResult): Promise<VideoAnalysis> {
    // Check if an analysis already exists for this video
    const existingAnalysis = await this.getVideoAnalysisByVideoId(videoId);
    
    if (existingAnalysis) {
      // Update existing analysis
      const now = new Date();
      
      const [updatedAnalysis] = await db
        .update(videoAnalyses)
        .set({
          motionData: analysis.motionData,
          overallScore: analysis.overallScore,
          feedback: analysis.feedback,
          improvementTips: analysis.improvementTips,
          keyFrameTimestamps: analysis.keyFrameTimestamps,
          analysisDate: now
        })
        .where(eq(videoAnalyses.id, existingAnalysis.id))
        .returning();
      
      return updatedAnalysis;
    } else {
      // Create new analysis
      const newAnalysis: InsertVideoAnalysis = {
        videoId,
        motionData: analysis.motionData,
        overallScore: analysis.overallScore,
        feedback: analysis.feedback,
        improvementTips: analysis.improvementTips,
        keyFrameTimestamps: analysis.keyFrameTimestamps
      };
      
      // Update the video's analyzed flag is handled in createVideoAnalysis
      return this.createVideoAnalysis(newAnalysis);
    }
  }
  
  // Sport Recommendation operations
  async getSportRecommendations(userId: number): Promise<SportRecommendation[]> {
    return await db
      .select()
      .from(sportRecommendations)
      .where(eq(sportRecommendations.userId, userId))
      .orderBy(desc(sportRecommendations.recommendationDate));
  }

  async createSportRecommendation(recommendation: InsertSportRecommendation): Promise<SportRecommendation> {
    const now = new Date();
    const [sportRecommendation] = await db
      .insert(sportRecommendations)
      .values({
        ...recommendation,
        recommendationDate: now
      })
      .returning();
    return sportRecommendation;
  }
  
  // NCAA Eligibility operations
  async getNcaaEligibility(userId: number): Promise<NcaaEligibility | undefined> {
    const [eligibility] = await db
      .select()
      .from(ncaaEligibility)
      .where(eq(ncaaEligibility.userId, userId));
    return eligibility;
  }

  async createNcaaEligibility(eligibility: InsertNcaaEligibility): Promise<NcaaEligibility> {
    const now = new Date();
    const [ncaaRecord] = await db
      .insert(ncaaEligibility)
      .values({
        ...eligibility,
        lastUpdated: now
      })
      .returning();
    return ncaaRecord;
  }

  async updateNcaaEligibility(userId: number, data: Partial<NcaaEligibility>): Promise<NcaaEligibility | undefined> {
    const now = new Date();
    const [eligibility] = await db
      .update(ncaaEligibility)
      .set({
        ...data,
        lastUpdated: now
      })
      .where(eq(ncaaEligibility.userId, userId))
      .returning();
    return eligibility;
  }
  
  // Coach Connection operations
  async getCoachConnections(userId: number, role: string): Promise<CoachConnection[]> {
    if (role === "coach") {
      return await db
        .select()
        .from(coachConnections)
        .where(eq(coachConnections.coachId, userId))
        .orderBy(desc(coachConnections.lastContact));
    } else {
      return await db
        .select()
        .from(coachConnections)
        .where(eq(coachConnections.athleteId, userId))
        .orderBy(desc(coachConnections.lastContact));
    }
  }

  async createCoachConnection(connection: InsertCoachConnection): Promise<CoachConnection> {
    const now = new Date();
    const [coachConnection] = await db
      .insert(coachConnections)
      .values({
        ...connection,
        connectionDate: now,
        lastContact: now
      })
      .returning();
    return coachConnection;
  }

  async updateCoachConnection(id: number, data: Partial<CoachConnection>): Promise<CoachConnection | undefined> {
    const [connection] = await db
      .update(coachConnections)
      .set(data)
      .where(eq(coachConnections.id, id))
      .returning();
    return connection;
  }
  
  // Achievement operations
  async getAchievements(userId: number): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.earnedDate));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const now = new Date();
    const [newAchievement] = await db
      .insert(achievements)
      .values({
        ...achievement,
        earnedDate: now
      })
      .returning();
    return newAchievement;
  }
  
  // Message operations
  async getMessages(userId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        sql`${messages.senderId} = ${userId} OR ${messages.recipientId} = ${userId}`
      )
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const now = new Date();
    const [newMessage] = await db
      .insert(messages)
      .values({
        senderId: message.senderId,
        recipientId: message.recipientId,
        content: message.content,
        createdAt: now,
        isRead: false
      })
      .returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [message] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }
  
  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(asc(users.name));
  }

  async getAllAthletes(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, "athlete"))
      .orderBy(asc(users.name));
  }

  async getAllCoaches(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, "coach"))
      .orderBy(asc(users.name));
  }

  async getAllVideos(): Promise<Video[]> {
    return await db
      .select()
      .from(videos)
      .orderBy(desc(videos.uploadDate));
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    totalVideos: number;
    totalAnalyses: number;
    totalCoachConnections: number;
  }> {
    const [{ count: totalUsers }] = await db
      .select({ count: sql`COUNT(*)`.mapWith(Number) })
      .from(users);
    
    const [{ count: totalVideos }] = await db
      .select({ count: sql`COUNT(*)`.mapWith(Number) })
      .from(videos);
    
    const [{ count: totalAnalyses }] = await db
      .select({ count: sql`COUNT(*)`.mapWith(Number) })
      .from(videoAnalyses);
    
    const [{ count: totalCoachConnections }] = await db
      .select({ count: sql`COUNT(*)`.mapWith(Number) })
      .from(coachConnections);
    
    return {
      totalUsers,
      totalVideos,
      totalAnalyses,
      totalCoachConnections,
    };
  }
  
  // Skill Tree operations
  async getUserSkills(userId: number): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.userId, userId))
      .orderBy(asc(skills.skillCategory), asc(skills.skillName));
  }

  async getUserSkillsByCategory(userId: number, category: string): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .where(
        and(
          eq(skills.userId, userId),
          eq(skills.skillCategory, category)
        )
      )
      .orderBy(asc(skills.skillName));
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db
      .select()
      .from(skills)
      .where(eq(skills.id, id));
    return skill;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const now = new Date();
    const [newSkill] = await db
      .insert(skills)
      .values({
        ...skill,
        updatedAt: now
      })
      .returning();
    return newSkill;
  }

  async updateSkill(id: number, data: Partial<Skill>): Promise<Skill | undefined> {
    const now = new Date();
    const [skill] = await db
      .update(skills)
      .set({
        ...data,
        updatedAt: now
      })
      .where(eq(skills.id, id))
      .returning();
    return skill;
  }

  // Challenges operations
  async getChallenges(): Promise<Challenge[]> {
    return await db
      .select()
      .from(challenges)
      .orderBy(desc(challenges.createdAt));
  }

  async getChallengesByCategory(category: string): Promise<Challenge[]> {
    return await db
      .select()
      .from(challenges)
      .where(eq(challenges.category, category))
      .orderBy(desc(challenges.createdAt));
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, id));
    return challenge;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const now = new Date();
    const [newChallenge] = await db
      .insert(challenges)
      .values({
        ...challenge,
        createdAt: now
      })
      .returning();
    return newChallenge;
  }

  async getAthleteChallenges(userId: number): Promise<AthleteChallenge[]> {
    return await db
      .select()
      .from(athleteChallenges)
      .where(eq(athleteChallenges.userId, userId))
      .orderBy(desc(athleteChallenges.startedAt));
  }
  
  async getAthleteChallenge(id: number): Promise<AthleteChallenge | undefined> {
    const [athleteChallenge] = await db
      .select()
      .from(athleteChallenges)
      .where(eq(athleteChallenges.id, id));
    return athleteChallenge;
  }

  async createAthleteChallenge(athleteChallenge: InsertAthleteChallenge): Promise<AthleteChallenge> {
    const [newAthleteChallenge] = await db
      .insert(athleteChallenges)
      .values(athleteChallenge)
      .returning();
    return newAthleteChallenge;
  }

  async updateAthleteChallenge(id: number, data: Partial<AthleteChallenge>): Promise<AthleteChallenge | undefined> {
    const [athleteChallenge] = await db
      .update(athleteChallenges)
      .set(data)
      .where(eq(athleteChallenges.id, id))
      .returning();
    return athleteChallenge;
  }
  
  // Additional helper methods
  async getCompletedChallengesByUser(userId: number): Promise<AthleteChallenge[]> {
    return await db
      .select()
      .from(athleteChallenges)
      .where(
        and(
          eq(athleteChallenges.userId, userId),
          eq(athleteChallenges.status, "completed")
        )
      )
      .orderBy(desc(athleteChallenges.completedAt));
  }
  
  async getAthleteChallengeByUserAndChallenge(userId: number, challengeId: number): Promise<AthleteChallenge | undefined> {
    const [athleteChallenge] = await db
      .select()
      .from(athleteChallenges)
      .where(
        and(
          eq(athleteChallenges.userId, userId),
          eq(athleteChallenges.challengeId, challengeId)
        )
      );
    return athleteChallenge;
  }

  // Recovery Tracker operations
  async getRecoveryLogs(userId: number): Promise<RecoveryLog[]> {
    return await db
      .select()
      .from(recoveryLogs)
      .where(eq(recoveryLogs.userId, userId))
      .orderBy(desc(recoveryLogs.logDate));
  }

  async getLatestRecoveryLog(userId: number): Promise<RecoveryLog | undefined> {
    const logs = await this.getRecoveryLogs(userId);
    return logs.length > 0 ? logs[0] : undefined;
  }

  async createRecoveryLog(log: InsertRecoveryLog): Promise<RecoveryLog> {
    const [newLog] = await db
      .insert(recoveryLogs)
      .values(log)
      .returning();
    return newLog;
  }
  
  // Additional helper methods
  async getRecoveryLog(id: number): Promise<RecoveryLog | undefined> {
    const [log] = await db
      .select()
      .from(recoveryLogs)
      .where(eq(recoveryLogs.id, id));
    return log;
  }

  // Fan Club operations
  async getFanClubFollowers(athleteId: number): Promise<FanClubFollower[]> {
    return await db
      .select()
      .from(fanClubFollowers)
      .where(eq(fanClubFollowers.athleteId, athleteId))
      .orderBy(desc(fanClubFollowers.followDate));
  }
  
  async getFanClubStats(athleteId: number): Promise<{
    totalFollowers: number;
    fans: number;
    recruiters: number;
    family: number;
    friends: number;
  }> {
    const followers = await this.getFanClubFollowers(athleteId);
    
    return {
      totalFollowers: followers.length,
      fans: followers.filter(f => f.followerType === "fan").length,
      recruiters: followers.filter(f => f.followerType === "recruiter").length,
      family: followers.filter(f => f.followerType === "family").length,
      friends: followers.filter(f => f.followerType === "friend").length
    };
  }
  
  async createFanClubFollower(follower: InsertFanClubFollower): Promise<FanClubFollower> {
    const [newFollower] = await db
      .insert(fanClubFollowers)
      .values(follower)
      .returning();
    return newFollower;
  }
  
  // Additional helper methods
  async getFanClubFollower(id: number): Promise<FanClubFollower | undefined> {
    const [follower] = await db
      .select()
      .from(fanClubFollowers)
      .where(eq(fanClubFollowers.id, id));
    return follower;
  }

  // Leaderboard operations
  async getLeaderboardEntries(category: string): Promise<LeaderboardEntry[]> {
    return await db
      .select()
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.category, category))
      .orderBy(asc(leaderboardEntries.rankPosition));
  }
  
  async getUserLeaderboardEntry(userId: number, category: string): Promise<LeaderboardEntry | undefined> {
    const [entry] = await db
      .select()
      .from(leaderboardEntries)
      .where(
        and(
          eq(leaderboardEntries.userId, userId),
          eq(leaderboardEntries.category, category)
        )
      );
    return entry;
  }
  
  async createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const [newEntry] = await db
      .insert(leaderboardEntries)
      .values(entry)
      .returning();
    
    // Recalculate ranks after creating a new entry
    await this.recalculateLeaderboardRanks(entry.category);
    
    return newEntry;
  }
  
  async updateLeaderboardEntry(id: number, data: Partial<LeaderboardEntry>): Promise<LeaderboardEntry | undefined> {
    const [entry] = await db
      .update(leaderboardEntries)
      .set(data)
      .where(eq(leaderboardEntries.id, id))
      .returning();
    
    if (entry && data.score !== undefined) {
      // If score was updated, recalculate ranks
      await this.recalculateLeaderboardRanks(entry.category);
    }
    
    return entry;
  }
  
  async recalculateLeaderboardRanks(category: string): Promise<void> {
    // Get all entries for the category sorted by score descending
    const entries = await db
      .select()
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.category, category))
      .orderBy(desc(leaderboardEntries.score));
    
    // Update rank positions
    for (let i = 0; i < entries.length; i++) {
      await db
        .update(leaderboardEntries)
        .set({ rankPosition: i + 1 })
        .where(eq(leaderboardEntries.id, entries[i].id));
    }
  }
  
  // Additional helper methods
  async getLeaderboardEntry(id: number): Promise<LeaderboardEntry | undefined> {
    const [entry] = await db
      .select()
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.id, id));
    return entry;
  }
  
  async getLeaderboardEntriesByUser(userId: number): Promise<LeaderboardEntry[]> {
    return await db
      .select()
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.userId, userId))
      .orderBy(asc(leaderboardEntries.category));
  }

  // Player Story Mode - Achievements operations
  async getAchievementsByUser(userId: number): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.earnedDate));
  }

  // Blog operations
  async getBlogPosts(limit: number = 20, offset: number = 0): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit)
      .offset(offset);
  }

  async getFeaturedBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.featured, true))
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }

  async getBlogPostsByCategory(category: string, limit: number = 10): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.category, category))
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const now = new Date();
    const [newPost] = await db
      .insert(blogPosts)
      .values({
        ...post,
        publishDate: now
      })
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set(data)
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
    return result.count > 0;
  }

  // Content Blocks operations
  async getContentBlocks(section?: string): Promise<ContentBlock[]> {
    if (section) {
      return await db
        .select()
        .from(contentBlocks)
        .where(eq(contentBlocks.section, section))
        .orderBy(asc(contentBlocks.order));
    }
    return await db
      .select()
      .from(contentBlocks)
      .orderBy(asc(contentBlocks.section), asc(contentBlocks.order));
  }

  async getContentBlocksByIdentifier(identifier: string): Promise<ContentBlock | undefined> {
    const [block] = await db
      .select()
      .from(contentBlocks)
      .where(eq(contentBlocks.identifier, identifier));
    return block;
  }

  async getContentBlock(id: number): Promise<ContentBlock | undefined> {
    const [block] = await db
      .select()
      .from(contentBlocks)
      .where(eq(contentBlocks.id, id));
    return block;
  }

  async createContentBlock(block: InsertContentBlock): Promise<ContentBlock> {
    const now = new Date();
    const [newBlock] = await db
      .insert(contentBlocks)
      .values({
        ...block,
        lastUpdated: now
      })
      .returning();
    return newBlock;
  }

  async updateContentBlock(id: number, data: Partial<ContentBlock>): Promise<ContentBlock | undefined> {
    const now = new Date();
    const [updatedBlock] = await db
      .update(contentBlocks)
      .set({
        ...data,
        lastUpdated: now
      })
      .where(eq(contentBlocks.id, id))
      .returning();
    return updatedBlock;
  }

  async deleteContentBlock(id: number): Promise<boolean> {
    const result = await db
      .delete(contentBlocks)
      .where(eq(contentBlocks.id, id));
    return result.count > 0;
  }

  // Featured Athletes operations
  async getFeaturedAthletes(limit: number = 4): Promise<FeaturedAthlete[]> {
    try {
      return await db
        .select()
        .from(featuredAthletes)
        .where(eq(featuredAthletes.active, true))
        .orderBy(desc(featuredAthletes.featuredDate))
        .limit(limit);
    } catch (error) {
      console.error("Error in getFeaturedAthletes:", error);
      return [];
    }
  }

  async getFeaturedAthlete(id: number): Promise<FeaturedAthlete | undefined> {
    const [athlete] = await db
      .select()
      .from(featuredAthletes)
      .where(eq(featuredAthletes.id, id));
    return athlete;
  }

  async getFeaturedAthleteByUserId(userId: number): Promise<FeaturedAthlete | undefined> {
    const [athlete] = await db
      .select()
      .from(featuredAthletes)
      .where(eq(featuredAthletes.userId, userId));
    return athlete;
  }

  async createFeaturedAthlete(athlete: InsertFeaturedAthlete): Promise<FeaturedAthlete> {
    const now = new Date();
    const [newAthlete] = await db
      .insert(featuredAthletes)
      .values({
        ...athlete,
        featuredDate: now
      })
      .returning();
    return newAthlete;
  }

  async updateFeaturedAthlete(id: number, data: Partial<FeaturedAthlete>): Promise<FeaturedAthlete | undefined> {
    const [athlete] = await db
      .update(featuredAthletes)
      .set(data)
      .where(eq(featuredAthletes.id, id))
      .returning();
    return athlete;
  }

  async deactivateFeaturedAthlete(id: number): Promise<boolean> {
    const result = await db
      .update(featuredAthletes)
      .set({ active: false })
      .where(eq(featuredAthletes.id, id));
    return result.count > 0;
  }
  
  // Workout Playlist operations
  async getWorkoutPlaylists(userId: number): Promise<WorkoutPlaylist[]> {
    return await db
      .select()
      .from(workoutPlaylists)
      .where(eq(workoutPlaylists.userId, userId))
      .orderBy(desc(workoutPlaylists.lastUsed));
  }

  async getWorkoutPlaylist(id: number): Promise<WorkoutPlaylist | undefined> {
    const [playlist] = await db
      .select()
      .from(workoutPlaylists)
      .where(eq(workoutPlaylists.id, id));
    return playlist;
  }

  async createWorkoutPlaylist(playlist: InsertWorkoutPlaylist): Promise<WorkoutPlaylist> {
    const now = new Date();
    const [newPlaylist] = await db
      .insert(workoutPlaylists)
      .values({
        ...playlist,
        createdAt: now,
        lastUsed: now,
        timesUsed: 0
      })
      .returning();
    return newPlaylist;
  }

  async updateWorkoutPlaylist(id: number, data: Partial<WorkoutPlaylist>): Promise<WorkoutPlaylist | undefined> {
    const [playlist] = await db
      .update(workoutPlaylists)
      .set(data)
      .where(eq(workoutPlaylists.id, id))
      .returning();
    return playlist;
  }

  async deleteWorkoutPlaylist(id: number): Promise<boolean> {
    // First delete all exercises associated with this playlist
    await db
      .delete(workoutExercises)
      .where(eq(workoutExercises.playlistId, id));
    
    // Then delete the playlist itself
    const result = await db
      .delete(workoutPlaylists)
      .where(eq(workoutPlaylists.id, id));
    
    return result.count > 0;
  }

  async incrementPlaylistUsage(id: number): Promise<WorkoutPlaylist | undefined> {
    const [playlist] = await db
      .select()
      .from(workoutPlaylists)
      .where(eq(workoutPlaylists.id, id));
    
    if (!playlist) return undefined;
    
    const now = new Date();
    const [updatedPlaylist] = await db
      .update(workoutPlaylists)
      .set({
        lastUsed: now,
        timesUsed: (playlist.timesUsed || 0) + 1
      })
      .where(eq(workoutPlaylists.id, id))
      .returning();
    
    return updatedPlaylist;
  }

  async getWorkoutExercises(playlistId: number): Promise<WorkoutExercise[]> {
    return await db
      .select()
      .from(workoutExercises)
      .where(eq(workoutExercises.playlistId, playlistId))
      .orderBy(asc(workoutExercises.order));
  }

  async createWorkoutExercise(exercise: InsertWorkoutExercise): Promise<WorkoutExercise> {
    const [newExercise] = await db
      .insert(workoutExercises)
      .values(exercise)
      .returning();
    return newExercise;
  }

  async updateWorkoutExercise(id: number, data: Partial<WorkoutExercise>): Promise<WorkoutExercise | undefined> {
    const [exercise] = await db
      .update(workoutExercises)
      .set(data)
      .where(eq(workoutExercises.id, id))
      .returning();
    return exercise;
  }

  async deleteWorkoutExercise(id: number): Promise<boolean> {
    const result = await db
      .delete(workoutExercises)
      .where(eq(workoutExercises.id, id));
    return result.count > 0;
  }

  async getPublicWorkoutPlaylists(workoutType?: string, intensityLevel?: string): Promise<WorkoutPlaylist[]> {
    let query = db
      .select()
      .from(workoutPlaylists)
      .where(eq(workoutPlaylists.isPublic, true));
    
    if (workoutType) {
      query = query.where(eq(workoutPlaylists.workoutType, workoutType));
    }
    
    if (intensityLevel) {
      query = query.where(eq(workoutPlaylists.intensityLevel, intensityLevel));
    }
    
    return await query.orderBy(desc(workoutPlaylists.timesUsed));
  }

  async getAthleteProfileByUserId(userId: number): Promise<AthleteProfile | undefined> {
    return this.getAthleteProfile(userId);
  }

  async generateAIWorkoutPlaylist(userId: number, preferences: {
    workoutType: string;
    intensityLevel: string;
    duration: number;
    targets: string[];
    userProfile?: AthleteProfile;
  }): Promise<WorkoutPlaylist> {
    // Create a basic playlist structure
    const now = new Date();
    
    // Insert the playlist first
    const [playlist] = await db
      .insert(workoutPlaylists)
      .values({
        userId,
        title: `AI Generated ${preferences.workoutType} Workout (${preferences.intensityLevel})`,
        description: `A ${preferences.intensityLevel} ${preferences.workoutType} workout targeting ${preferences.targets.join(', ')}`,
        workoutType: preferences.workoutType,
        intensityLevel: preferences.intensityLevel,
        duration: preferences.duration,
        targets: preferences.targets,
        isPublic: false,
        createdAt: now,
        lastUsed: now,
        timesUsed: 0
      })
      .returning();
    
    // Now generate exercises based on workout type and user profile
    const exercises = [];
    
    // This is a simplified version - in a real implementation, this would make API calls to OpenAI
    // to generate personalized exercises
    if (preferences.workoutType === 'Strength') {
      if (preferences.targets.includes('Upper Body')) {
        exercises.push({
          playlistId: playlist.id,
          name: 'Push-ups',
          description: 'Standard push-ups with proper form',
          duration: 60,
          sets: 3,
          reps: 15,
          restPeriod: 30,
          order: 1
        });
        exercises.push({
          playlistId: playlist.id,
          name: 'Pull-ups',
          description: 'Pull-ups with proper form',
          duration: 60,
          sets: 3,
          reps: 10,
          restPeriod: 45,
          order: 2
        });
      }
      if (preferences.targets.includes('Lower Body')) {
        exercises.push({
          playlistId: playlist.id,
          name: 'Squats',
          description: 'Bodyweight squats with proper form',
          duration: 60,
          sets: 3,
          reps: 20,
          restPeriod: 30,
          order: 3
        });
        exercises.push({
          playlistId: playlist.id,
          name: 'Lunges',
          description: 'Alternating lunges with proper form',
          duration: 60,
          sets: 3,
          reps: 12,
          restPeriod: 30,
          order: 4
        });
      }
    } else if (preferences.workoutType === 'Cardio') {
      exercises.push({
        playlistId: playlist.id,
        name: 'Jumping Jacks',
        description: 'Standard jumping jacks at a moderate pace',
        duration: 60,
        sets: 3,
        order: 1
      });
      exercises.push({
        playlistId: playlist.id,
        name: 'Mountain Climbers',
        description: 'Mountain climbers at a quick pace',
        duration: 45,
        sets: 3,
        order: 2
      });
    } else if (preferences.workoutType === 'Flexibility') {
      exercises.push({
        playlistId: playlist.id,
        name: 'Standing Hamstring Stretch',
        description: 'Gentle hamstring stretch while standing',
        duration: 30,
        sets: 2,
        order: 1
      });
      exercises.push({
        playlistId: playlist.id,
        name: 'Hip Flexor Stretch',
        description: 'Gentle hip flexor stretch in lunge position',
        duration: 30,
        sets: 2,
        order: 2
      });
    }
    
    // Add the exercises to the database
    for (const exercise of exercises) {
      await db
        .insert(workoutExercises)
        .values(exercise);
    }
    
    return playlist;
  }

  // Film Comparison operations
  async getFilmComparisons(userId: number): Promise<FilmComparison[]> {
    return await db
      .select()
      .from(filmComparisons)
      .where(eq(filmComparisons.userId, userId))
      .orderBy(desc(filmComparisons.createdAt));
  }

  async getFilmComparison(id: number): Promise<FilmComparison | undefined> {
    const [comparison] = await db
      .select()
      .from(filmComparisons)
      .where(eq(filmComparisons.id, id));
    return comparison;
  }

  async createFilmComparison(comparison: InsertFilmComparison): Promise<FilmComparison> {
    const now = new Date();
    const [newComparison] = await db
      .insert(filmComparisons)
      .values({
        ...comparison,
        createdAt: now
      })
      .returning();
    return newComparison;
  }

  async updateFilmComparison(id: number, data: Partial<FilmComparison>): Promise<FilmComparison | undefined> {
    const [comparison] = await db
      .update(filmComparisons)
      .set(data)
      .where(eq(filmComparisons.id, id))
      .returning();
    return comparison;
  }

  async deleteFilmComparison(id: number): Promise<boolean> {
    // First delete any videos associated with this comparison
    await db
      .delete(comparisonVideos)
      .where(eq(comparisonVideos.comparisonId, id));
    
    // Then delete any analyses associated with this comparison
    await db
      .delete(comparisonAnalyses)
      .where(eq(comparisonAnalyses.comparisonId, id));
    
    // Finally delete the comparison itself
    const result = await db
      .delete(filmComparisons)
      .where(eq(filmComparisons.id, id));
    
    return result.count > 0;
  }

  async getComparisonVideos(comparisonId: number): Promise<ComparisonVideo[]> {
    return await db
      .select()
      .from(comparisonVideos)
      .where(eq(comparisonVideos.comparisonId, comparisonId))
      .orderBy(asc(comparisonVideos.order));
  }

  async getComparisonVideo(id: number): Promise<ComparisonVideo | undefined> {
    const [video] = await db
      .select()
      .from(comparisonVideos)
      .where(eq(comparisonVideos.id, id));
    return video;
  }

  async createComparisonVideo(video: InsertComparisonVideo): Promise<ComparisonVideo> {
    const [newVideo] = await db
      .insert(comparisonVideos)
      .values(video)
      .returning();
    return newVideo;
  }

  async updateComparisonVideo(id: number, data: Partial<ComparisonVideo>): Promise<ComparisonVideo | undefined> {
    const [video] = await db
      .update(comparisonVideos)
      .set(data)
      .where(eq(comparisonVideos.id, id))
      .returning();
    return video;
  }

  async deleteComparisonVideo(id: number): Promise<boolean> {
    const result = await db
      .delete(comparisonVideos)
      .where(eq(comparisonVideos.id, id));
    return result.count > 0;
  }

  async getComparisonAnalysis(comparisonId: number): Promise<ComparisonAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(comparisonAnalyses)
      .where(eq(comparisonAnalyses.comparisonId, comparisonId));
    return analysis;
  }

  async createComparisonAnalysis(analysis: InsertComparisonAnalysis): Promise<ComparisonAnalysis> {
    const [newAnalysis] = await db
      .insert(comparisonAnalyses)
      .values(analysis)
      .returning();
    return newAnalysis;
  }

  async updateComparisonAnalysis(id: number, data: Partial<ComparisonAnalysis>): Promise<ComparisonAnalysis | undefined> {
    const [analysis] = await db
      .update(comparisonAnalyses)
      .set(data)
      .where(eq(comparisonAnalyses.id, id))
      .returning();
    return analysis;
  }

  // MyPlayer XP System methods
  async getPlayerProgress(userId: number): Promise<PlayerProgress | undefined> {
    const [progress] = await db.select()
      .from(playerProgress)
      .where(eq(playerProgress.userId, userId));
    return progress;
  }
  
  async createPlayerProgress(data: InsertPlayerProgress): Promise<PlayerProgress> {
    const [progress] = await db.insert(playerProgress)
      .values({
        ...data,
        lastActive: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return progress;
  }
  
  async updatePlayerProgress(userId: number, data: Partial<PlayerProgress>): Promise<PlayerProgress | undefined> {
    const [updatedProgress] = await db.update(playerProgress)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(playerProgress.userId, userId))
      .returning();
    return updatedProgress;
  }
  
  async getXpTransactions(userId: number): Promise<XpTransaction[]> {
    return await db.select()
      .from(xpTransactions)
      .where(eq(xpTransactions.userId, userId))
      .orderBy(desc(xpTransactions.createdAt));
  }
  
  async addXpToPlayer(userId: number, amount: number, type: string, description: string, sourceId?: string): Promise<{ 
    progress: PlayerProgress, 
    transaction: XpTransaction,
    leveledUp: boolean 
  }> {
    // Begin a transaction
    return await db.transaction(async (tx) => {
      // 1. Create the XP transaction record
      const [transaction] = await tx.insert(xpTransactions)
        .values({
          userId,
          amount,
          transactionType: type,
          description,
          createdAt: new Date(),
        })
        .returning();
      
      // 2. Get the player's current progress
      const [progress] = await tx.select()
        .from(playerProgress)
        .where(eq(playerProgress.userId, userId));
      
      let leveledUp = false;
      let newProgress: PlayerProgress;
      
      if (!progress) {
        // Create new progress record if it doesn't exist
        const [createdProgress] = await tx.insert(playerProgress)
          .values({
            userId,
            currentLevel: 1,
            totalXp: amount,
            levelXp: amount,
            xpToNextLevel: 100,
            streakDays: 0,
            lastActive: new Date(),
            updatedAt: new Date(),
          })
          .returning();
          
        newProgress = createdProgress;
      } else {
        // Update existing progress record
        const newTotalXp = progress.totalXp + amount;
        const newLevelXp = progress.levelXp + amount;
        
        // Calculate if this XP causes a level up
        let newCurrentLevel = progress.currentLevel;
        let newLevelXpValue = newLevelXp;
        let newXpToNextLevel = progress.xpToNextLevel;
        
        // Check for level up (simple progression formula)
        if (newLevelXp >= progress.xpToNextLevel) {
          newCurrentLevel += 1;
          newLevelXpValue = newLevelXp - progress.xpToNextLevel;
          // Scale up the XP needed for next level (by 10% each level)
          newXpToNextLevel = Math.floor(progress.xpToNextLevel * 1.1);
          leveledUp = true;
        }
        
        const [updatedProgress] = await tx.update(playerProgress)
          .set({
            totalXp: newTotalXp,
            levelXp: newLevelXpValue,
            currentLevel: newCurrentLevel,
            xpToNextLevel: newXpToNextLevel,
            lastActive: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(playerProgress.userId, userId))
          .returning();
          
        newProgress = updatedProgress;
      }
      
      return {
        progress: newProgress,
        transaction,
        leveledUp
      };
    });
  }
  
  async getPlayerBadges(userId: number): Promise<PlayerBadge[]> {
    return await db.select()
      .from(playerBadges)
      .where(eq(playerBadges.userId, userId))
      .orderBy(asc(playerBadges.category), asc(playerBadges.badgeName));
  }
  
  async getPlayerBadgesByCategory(userId: number, category: string): Promise<PlayerBadge[]> {
    return await db.select()
      .from(playerBadges)
      .where(
        and(
          eq(playerBadges.userId, userId),
          eq(playerBadges.category, category)
        )
      )
      .orderBy(asc(playerBadges.badgeName));
  }
  
  async createPlayerBadge(badge: InsertPlayerBadge): Promise<PlayerBadge> {
    const [newBadge] = await db.insert(playerBadges)
      .values({
        ...badge,
        earnedAt: new Date(),
      })
      .returning();
    return newBadge;
  }
  
  async updatePlayerBadge(id: number, data: Partial<PlayerBadge>): Promise<PlayerBadge | undefined> {
    const [updatedBadge] = await db.update(playerBadges)
      .set(data)
      .where(eq(playerBadges.id, id))
      .returning();
    return updatedBadge;
  }
  
  // Weight Room Equipment operations
  async getWeightRoomEquipment(category?: string): Promise<WeightRoomEquipment[]> {
    try {
      let query = db.select().from(weightRoomEquipment);
      
      if (category) {
        query = query.where(eq(weightRoomEquipment.category, category));
      }
      
      return await query;
    } catch (error) {
      console.error("Error in getWeightRoomEquipment", error);
      return [];
    }
  }
  
  async getWeightRoomEquipmentById(id: number): Promise<WeightRoomEquipment | undefined> {
    try {
      const [result] = await db.select().from(weightRoomEquipment).where(eq(weightRoomEquipment.id, id)).limit(1);
      return result;
    } catch (error) {
      console.error(`Error in getWeightRoomEquipmentById for ID ${id}:`, error);
      return undefined;
    }
  }
  
  async createWeightRoomEquipment(equipment: InsertWeightRoomEquipment): Promise<WeightRoomEquipment> {
    try {
      const [result] = await db.insert(weightRoomEquipment).values(equipment).returning();
      return result;
    } catch (error) {
      console.error("Error in createWeightRoomEquipment:", error);
      throw new Error("Failed to create weight room equipment");
    }
  }
  
  async updateWeightRoomEquipment(id: number, data: Partial<WeightRoomEquipment>): Promise<WeightRoomEquipment | undefined> {
    try {
      const [result] = await db.update(weightRoomEquipment)
        .set(data)
        .where(eq(weightRoomEquipment.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error in updateWeightRoomEquipment for ID ${id}:`, error);
      return undefined;
    }
  }
  
  // Player Equipment operations
  async getPlayerEquipment(userId: number): Promise<PlayerEquipment[]> {
    try {
      return await db.select().from(playerEquipment).where(eq(playerEquipment.userId, userId));
    } catch (error) {
      console.error(`Error in getPlayerEquipment for user ${userId}:`, error);
      return [];
    }
  }
  
  async getPlayerEquipmentById(id: number): Promise<PlayerEquipment | undefined> {
    try {
      const [result] = await db.select().from(playerEquipment).where(eq(playerEquipment.id, id)).limit(1);
      return result;
    } catch (error) {
      console.error(`Error in getPlayerEquipmentById for ID ${id}:`, error);
      return undefined;
    }
  }
  
  async createPlayerEquipment(equipment: InsertPlayerEquipment): Promise<PlayerEquipment> {
    try {
      const [result] = await db.insert(playerEquipment).values(equipment).returning();
      return result;
    } catch (error) {
      console.error("Error in createPlayerEquipment:", error);
      throw new Error("Failed to create player equipment");
    }
  }
  
  async updatePlayerEquipment(id: number, data: Partial<PlayerEquipment>): Promise<PlayerEquipment | undefined> {
    try {
      const [result] = await db.update(playerEquipment)
        .set(data)
        .where(eq(playerEquipment.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error in updatePlayerEquipment for ID ${id}:`, error);
      return undefined;
    }
  }
  
  async incrementEquipmentUsage(id: number): Promise<PlayerEquipment | undefined> {
    try {
      const equipment = await this.getPlayerEquipmentById(id);
      if (!equipment) {
        return undefined;
      }
      
      const timesUsed = (equipment.timesUsed || 0) + 1;
      const [result] = await db.update(playerEquipment)
        .set({ timesUsed, lastUsed: new Date() })
        .where(eq(playerEquipment.id, id))
        .returning();
        
      return result;
    } catch (error) {
      console.error(`Error in incrementEquipmentUsage for ID ${id}:`, error);
      return undefined;
    }
  }
  
  // Video Highlight operations
  async getVideoHighlights(videoId: number): Promise<VideoHighlight[]> {
    try {
      return await db
        .select()
        .from(videoHighlights)
        .where(eq(videoHighlights.videoId, videoId))
        .orderBy(desc(videoHighlights.createdAt));
    } catch (error) {
      console.error(`Error in getVideoHighlights for video ${videoId}:`, error);
      return [];
    }
  }

  async getVideoHighlight(id: number): Promise<VideoHighlight | undefined> {
    try {
      const [highlight] = await db
        .select()
        .from(videoHighlights)
        .where(eq(videoHighlights.id, id));
      return highlight;
    } catch (error) {
      console.error(`Error in getVideoHighlight for ID ${id}:`, error);
      return undefined;
    }
  }

  async createVideoHighlight(highlight: InsertVideoHighlight): Promise<VideoHighlight> {
    try {
      const now = new Date();
      const [newHighlight] = await db
        .insert(videoHighlights)
        .values({
          ...highlight,
          createdAt: now
        })
        .returning();
      return newHighlight;
    } catch (error) {
      console.error(`Error in createVideoHighlight:`, error);
      throw error;
    }
  }

  async updateVideoHighlight(id: number, data: Partial<VideoHighlight>): Promise<VideoHighlight | undefined> {
    try {
      const [highlight] = await db
        .update(videoHighlights)
        .set(data)
        .where(eq(videoHighlights.id, id))
        .returning();
      return highlight;
    } catch (error) {
      console.error(`Error in updateVideoHighlight for ID ${id}:`, error);
      return undefined;
    }
  }

  async deleteVideoHighlight(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(videoHighlights)
        .where(eq(videoHighlights.id, id));
      return result.count > 0;
    } catch (error) {
      console.error(`Error in deleteVideoHighlight for ID ${id}:`, error);
      return false;
    }
  }

  async getFeaturedVideoHighlights(limit: number = 10): Promise<VideoHighlight[]> {
    try {
      return await db
        .select()
        .from(videoHighlights)
        .where(eq(videoHighlights.featured, true))
        .orderBy(desc(videoHighlights.createdAt))
        .limit(limit);
    } catch (error) {
      console.error(`Error in getFeaturedVideoHighlights:`, error);
      return [];
    }
  }

  async generateVideoHighlight(videoId: number, options: {
    startTime: number;
    endTime: number;
    title: string;
    description?: string;
    userId: number;
    aiGenerated?: boolean;
  }): Promise<VideoHighlight> {
    try {
      // First verify that the video exists
      const video = await this.getVideo(videoId);
      if (!video) {
        throw new Error("Video not found");
      }
      
      // Import the VideoProcessor dynamically to avoid circular dependencies
      const { VideoProcessor } = await import('./services/video-processor');
      
      // Process the video to create highlight clip
      const { highlightPath, thumbnailPath } = await VideoProcessor.createHighlight(
        video.filePath,
        {
          startTime: options.startTime,
          endTime: options.endTime
        }
      );
      
      // Create the highlight record in the database
      const now = new Date();
      const [highlight] = await db
        .insert(videoHighlights)
        .values({
          videoId,
          title: options.title,
          description: options.description || null,
          startTime: options.startTime,
          endTime: options.endTime,
          highlightPath, // Path to the generated highlight video
          thumbnailPath, // Path to the generated thumbnail
          createdAt: now,
          createdBy: options.userId,
          aiGenerated: options.aiGenerated || false,
          featured: false
        })
        .returning();
        
      return highlight;
    } catch (error) {
      console.error(`Error in generateVideoHighlight for video ${videoId}:`, error);
      throw error;
    }
  }
  
  // Highlight Generator Config operations
  async getHighlightGeneratorConfigs(): Promise<HighlightGeneratorConfig[]> {
    try {
      return await db.select().from(highlightGeneratorConfigs);
    } catch (error) {
      console.error("Error in getHighlightGeneratorConfigs:", error);
      throw error;
    }
  }
  
  async getHighlightGeneratorConfigsBySport(sportType: string): Promise<HighlightGeneratorConfig[]> {
    try {
      return await db.select().from(highlightGeneratorConfigs)
        .where(eq(highlightGeneratorConfigs.sportType, sportType));
    } catch (error) {
      console.error(`Error in getHighlightGeneratorConfigsBySport for sport ${sportType}:`, error);
      throw error;
    }
  }
  
  async getHighlightGeneratorConfig(id: number): Promise<HighlightGeneratorConfig | undefined> {
    try {
      const [config] = await db.select().from(highlightGeneratorConfigs)
        .where(eq(highlightGeneratorConfigs.id, id));
      return config;
    } catch (error) {
      console.error(`Error in getHighlightGeneratorConfig with id ${id}:`, error);
      throw error;
    }
  }
  
  async createHighlightGeneratorConfig(config: InsertHighlightGeneratorConfig): Promise<HighlightGeneratorConfig> {
    try {
      const [newConfig] = await db.insert(highlightGeneratorConfigs)
        .values(config)
        .returning();
      return newConfig;
    } catch (error) {
      console.error("Error in createHighlightGeneratorConfig:", error);
      throw error;
    }
  }
  
  async updateHighlightGeneratorConfig(id: number, data: Partial<HighlightGeneratorConfig>): Promise<HighlightGeneratorConfig | undefined> {
    try {
      const [updatedConfig] = await db.update(highlightGeneratorConfigs)
        .set(data)
        .where(eq(highlightGeneratorConfigs.id, id))
        .returning();
      return updatedConfig;
    } catch (error) {
      console.error(`Error in updateHighlightGeneratorConfig with id ${id}:`, error);
      throw error;
    }
  }
  
  async deleteHighlightGeneratorConfig(id: number): Promise<boolean> {
    try {
      const result = await db.delete(highlightGeneratorConfigs)
        .where(eq(highlightGeneratorConfigs.id, id));
      return result.count > 0;
    } catch (error) {
      console.error(`Error in deleteHighlightGeneratorConfig with id ${id}:`, error);
      throw error;
    }
  }
  
  async getActiveHighlightGeneratorConfigs(): Promise<HighlightGeneratorConfig[]> {
    try {
      return await db.select().from(highlightGeneratorConfigs)
        .where(eq(highlightGeneratorConfigs.active, true));
    } catch (error) {
      console.error("Error in getActiveHighlightGeneratorConfigs:", error);
      throw error;
    }
  }
  
  // Workout Verification operations
  async getWorkoutVerifications(userId: number): Promise<WorkoutVerification[]> {
    try {
      return await db.select().from(workoutVerifications).where(eq(workoutVerifications.userId, userId));
    } catch (error) {
      console.error(`Error in getWorkoutVerifications for user ${userId}:`, error);
      return [];
    }
  }
  
  async getPendingWorkoutVerifications(): Promise<WorkoutVerification[]> {
    try {
      return await db.select().from(workoutVerifications)
        .where(eq(workoutVerifications.verificationStatus, "pending"))
        .orderBy(desc(workoutVerifications.submissionDate));
    } catch (error) {
      console.error("Error in getPendingWorkoutVerifications:", error);
      return [];
    }
  }
  
  async getWorkoutVerification(id: number): Promise<WorkoutVerification | undefined> {
    try {
      const [result] = await db.select().from(workoutVerifications).where(eq(workoutVerifications.id, id)).limit(1);
      return result;
    } catch (error) {
      console.error(`Error in getWorkoutVerification for ID ${id}:`, error);
      return undefined;
    }
  }
  
  async createWorkoutVerification(verification: InsertWorkoutVerification): Promise<WorkoutVerification> {
    try {
      const [result] = await db.insert(workoutVerifications).values(verification).returning();
      return result;
    } catch (error) {
      console.error("Error in createWorkoutVerification:", error);
      throw new Error("Failed to create workout verification");
    }
  }
  
  async updateWorkoutVerification(id: number, data: Partial<WorkoutVerification>): Promise<WorkoutVerification | undefined> {
    try {
      const [result] = await db.update(workoutVerifications)
        .set(data)
        .where(eq(workoutVerifications.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error in updateWorkoutVerification for ID ${id}:`, error);
      return undefined;
    }
  }
  
  async getWorkoutVerificationCheckpoints(verificationId: number): Promise<WorkoutVerificationCheckpoint[]> {
    try {
      return await db.select()
        .from(workoutVerificationCheckpoints)
        .where(eq(workoutVerificationCheckpoints.verificationId, verificationId))
        .orderBy(workoutVerificationCheckpoints.checkpointOrder);
    } catch (error) {
      console.error(`Error in getWorkoutVerificationCheckpoints for verification ${verificationId}:`, error);
      return [];
    }
  }
  
  async createWorkoutVerificationCheckpoint(checkpoint: InsertWorkoutVerificationCheckpoint): Promise<WorkoutVerificationCheckpoint> {
    try {
      const [result] = await db.insert(workoutVerificationCheckpoints).values(checkpoint).returning();
      return result;
    } catch (error) {
      console.error("Error in createWorkoutVerificationCheckpoint:", error);
      throw new Error("Failed to create workout verification checkpoint");
    }
  }
  
  async updateWorkoutVerificationCheckpoint(id: number, data: Partial<WorkoutVerificationCheckpoint>): Promise<WorkoutVerificationCheckpoint | undefined> {
    try {
      const [result] = await db.update(workoutVerificationCheckpoints)
        .set(data)
        .where(eq(workoutVerificationCheckpoints.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error in updateWorkoutVerificationCheckpoint for ID ${id}:`, error);
      return undefined;
    }
  }
  
  async verifyWorkout(id: number, verifierId: number, status: string, xpEarned: number, feedback?: string): Promise<WorkoutVerification | undefined> {
    try {
      const [result] = await db.update(workoutVerifications)
        .set({
          verificationStatus: status,
          verifiedBy: verifierId,
          verificationDate: new Date(),
          notes: feedback,
          xpEarned
        })
        .where(eq(workoutVerifications.id, id))
        .returning();
        
      // If approved, add XP to the player
      if (status === 'approved' && result) {
        await this.addXpToPlayer(
          result.userId, 
          xpEarned, 
          'workout', 
          `Workout verification: ${result.title}`,
          result.id.toString()
        );
      }
      
      return result;
    } catch (error) {
      console.error(`Error in verifyWorkout for ID ${id}:`, error);
      return undefined;
    }
  }
  
  // Method to seed initial data
  async seedInitialData() {
    // Check if we already have users
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("Basic data already seeded, checking for realistic athletes...");
      // Import and run the athlete seeding function
      const { seedRealisticAthletes } = await import('./seed-athletes');
      await seedRealisticAthletes();
      return;
    }
    // Create sample users (1 athlete, 2 coaches, 1 admin)
    const [athleteUser] = await db.insert(users).values({
      username: "alexjohnson",
      password: await hashPassword("password123"),
      email: "alex@example.com",
      name: "Alex Johnson",
      role: "athlete",
      profileImage: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "High school student athlete looking to compete at the college level.",
      createdAt: new Date(),
    }).returning();

    const [coachUser1] = await db.insert(users).values({
      username: "coachwilliams",
      password: await hashPassword("coachpass123"),
      email: "williams@stateuniversity.edu",
      name: "Coach Williams",
      role: "coach",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Basketball coach at State University with 15 years of experience.",
      createdAt: new Date(),
    }).returning();

    const [coachUser2] = await db.insert(users).values({
      username: "coachmartinez",
      password: await hashPassword("coachpass456"),
      email: "martinez@centralcollege.edu",
      name: "Coach Martinez",
      role: "coach",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Track and Field coach at Central College specializing in sprints and jumps.",
      createdAt: new Date(),
    }).returning();

    const [adminUser] = await db.insert(users).values({
      username: "admin",
      password: await hashPassword("adminpass123"),
      email: "admin@goforit.com",
      name: "Admin User",
      role: "admin",
      createdAt: new Date(),
    }).returning();

    const [newAdmin] = await db.insert(users).values({
      username: "superadmin",
      password: await hashPassword("superadmin123"),
      email: "superadmin@goforit.com",
      name: "Super Admin",
      role: "admin",
      createdAt: new Date(),
    }).returning();

    // Create athlete profile
    const [athleteProfile] = await db.insert(athleteProfiles).values({
      userId: athleteUser.id,
      height: 188, // 6'2" in cm
      weight: 82, // 180 lbs in kg
      age: 17,
      school: "Washington High School",
      graduationYear: 2024,
      sportsInterest: ["basketball", "volleyball", "track"],
      academicInterest: ["computer science", "engineering"],
      gpa: 3.7,
    }).returning();

    // Create coach profiles
    const [coachProfile1] = await db.insert(coachProfiles).values({
      userId: coachUser1.id,
      institution: "State University",
      sport: "basketball",
      position: "Head Coach",
      experience: 15,
      achievements: ["2x State Champions", "Coach of the Year 2022"],
      lookingFor: "Point guards with strong leadership and shooting ability.",
    }).returning();

    const [coachProfile2] = await db.insert(coachProfiles).values({
      userId: coachUser2.id,
      institution: "Central College",
      sport: "track",
      position: "Assistant Coach",
      experience: 8,
      achievements: ["National Champions 2023", "Developed 3 Olympic athletes"],
      lookingFor: "Sprinters and long jumpers with potential for development.",
    }).returning();

    // Create a sample video
    const [sampleVideo] = await db.insert(videos).values({
      userId: athleteUser.id,
      title: "Basketball Jump Shot Form",
      description: "My current jump shot form - looking for feedback.",
      filePath: "/uploads/sample-jumpshot.mp4",
      thumbnailPath: "/uploads/sample-jumpshot-thumb.jpg",
      sport: "basketball",
      uploadDate: new Date(),
      analyzed: true,
      duration: 8.5, // seconds
      fileSize: 2.4, // MB
    }).returning();

    // Create video analysis
    const [sampleAnalysis] = await db.insert(videoAnalyses).values({
      videoId: sampleVideo.id,
      overallScore: 7.5,
      feedback: "Your jump shot shows good potential. Your elbow alignment is excellent, but you need to work on your follow-through and balance.",
      improvementTips: [
        "Hold your follow-through longer after release",
        "Focus on landing in the same spot you jumped from",
        "Try to maintain more consistent arc on the ball"
      ],
      analysisData: {
        elbowAlignment: 9.2,
        releasePoint: 7.8,
        followThrough: 6.5,
        balance: 6.9,
        keypoints: [
          { x: 0.45, y: 0.38, confidence: 0.87, name: "right_elbow" },
          { x: 0.47, y: 0.26, confidence: 0.92, name: "right_wrist" },
          { x: 0.49, y: 0.18, confidence: 0.85, name: "right_hand" }
        ]
      },
      keyFrameTimestamps: [1.2, 3.7, 4.5],
      analysisDate: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
    }).returning();

    // Create sport recommendations
    const [basketballRecommendation] = await db.insert(sportRecommendations).values({
      userId: athleteUser.id,
      sport: "basketball",
      matchPercentage: 85,
      positionRecommendation: "Shooting Guard",
      potentialLevel: "College Division I",
      reasonForMatch: "Your height, coordination, and shooting form indicate strong potential as a shooting guard. Your analysis shows excellent shooting mechanics that could be developed further.",
      recommendationDate: new Date(Date.now() - 40 * 60 * 60 * 1000) // 40 hours ago
    }).returning();

    const [volleyballRecommendation] = await db.insert(sportRecommendations).values({
      userId: athleteUser.id,
      sport: "volleyball",
      matchPercentage: 72,
      positionRecommendation: "Outside Hitter",
      potentialLevel: "College Division II",
      reasonForMatch: "Your height and jumping ability suggest good potential for volleyball. Your coordination and timing would transfer well to spiking and blocking.",
      recommendationDate: new Date(Date.now() - 39 * 60 * 60 * 1000) // 39 hours ago
    }).returning();

    const [trackRecommendation] = await db.insert(sportRecommendations).values({
      userId: athleteUser.id,
      sport: "track",
      matchPercentage: 68,
      positionRecommendation: "Long Jump",
      potentialLevel: "College Division II",
      reasonForMatch: "Your explosive jumping ability and coordination indicate potential in long jump. With focused training, you could develop the technique required for success.",
      recommendationDate: new Date(Date.now() - 38 * 60 * 60 * 1000) // 38 hours ago
    }).returning();

    // Create NCAA eligibility record
    const [ncaaEligibility] = await db.insert(ncaaEligibility).values({
      userId: athleteUser.id,
      academicStatus: "On Track",
      coreCourses: [
        { name: "English I", grade: "A", credits: 1, completed: true },
        { name: "Algebra II", grade: "B+", credits: 1, completed: true },
        { name: "Chemistry", grade: "B", credits: 1, completed: true },
        { name: "World History", grade: "A-", credits: 1, completed: true },
        { name: "English II", grade: "In Progress", credits: 1, completed: false }
      ],
      satScore: 1180,
      actScore: 26,
      eligibilityCenter: {
        registered: true,
        registrationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        status: "Initial Review Complete",
        academicCertification: "Pending Final Transcripts"
      },
      amateurStatus: true,
      notes: "Need to submit final transcripts after graduation.",
      lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
    }).returning();

    // Create coach connections
    const [connection1] = await db.insert(coachConnections).values({
      athleteId: athleteUser.id,
      coachId: coachUser1.id,
      status: "in_contact",
      notes: "Initial contact made after Coach Williams saw my shooting video. Discussing potential campus visit.",
      connectionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      recruitmentStage: "interested"
    }).returning();

    const [connection2] = await db.insert(coachConnections).values({
      athleteId: athleteUser.id,
      coachId: coachUser2.id,
      status: "watching",
      notes: "Coach Martinez expressed interest in my long jump potential after seeing track recommendation.",
      connectionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      recruitmentStage: "prospect"
    }).returning();

    // Create achievements
    const [achievement1] = await db.insert(achievements).values({
      userId: athleteUser.id,
      title: "First Video Analysis",
      description: "Completed your first video analysis",
      type: "platform",
      iconPath: "/icons/video-analysis.svg",
      earnedDate: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
    }).returning();

    const [achievement2] = await db.insert(achievements).values({
      userId: athleteUser.id,
      title: "Sport Matched",
      description: "Received your first sport match recommendation",
      type: "platform",
      iconPath: "/icons/sport-match.svg",
      earnedDate: new Date(Date.now() - 40 * 60 * 60 * 1000) // 40 hours ago
    }).returning();

    const [achievement3] = await db.insert(achievements).values({
      userId: athleteUser.id,
      title: "Coach Connection",
      description: "Connected with your first college coach",
      type: "platform",
      iconPath: "/icons/coach-connection.svg",
      earnedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
    }).returning();

    const [achievement4] = await db.insert(achievements).values({
      userId: athleteUser.id,
      title: "District Champion",
      description: "Won the district championship in basketball",
      type: "sports",
      iconPath: "/icons/trophy.svg",
      earnedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
    }).returning();

    // Add sample workout playlists
    const now = new Date();
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    // Create a strength workout playlist for the athlete
    const [strengthPlaylist] = await db.insert(workoutPlaylists).values({
      userId: athleteUser.id,
      title: "Upper Body Strength",
      description: "A comprehensive upper body workout focusing on arms, chest, and shoulders",
      workoutType: "strength",
      intensityLevel: "medium",
      duration: 45,
      targets: ["arms", "chest", "shoulders"],
      createdAt: twoWeeksAgo,
      lastUsed: oneWeekAgo,
      timesUsed: 5,
      isCustom: true,
      isPublic: false
    }).returning();

    // Add exercises to the strength playlist
    await db.insert(workoutExercises).values({
      playlistId: strengthPlaylist.id,
      name: "Push-ups",
      description: "Standard push-ups with proper form",
      sets: 3,
      reps: 15,
      restPeriod: 60,
      order: 1,
      notes: "Keep core tight and maintain straight back"
    });

    await db.insert(workoutExercises).values({
      playlistId: strengthPlaylist.id,
      name: "Dumbbell Curls",
      description: "Alternating dumbbell curls",
      sets: 3,
      reps: 12,
      restPeriod: 45,
      order: 2,
      notes: "Use controlled movements"
    });

    await db.insert(workoutExercises).values({
      playlistId: strengthPlaylist.id,
      name: "Shoulder Press",
      description: "Dumbbell shoulder presses",
      sets: 3,
      reps: 10,
      restPeriod: 60,
      order: 3,
      equipmentNeeded: ["dumbbells"]
    });

    // Create a cardio workout playlist that's public
    const [cardioPlaylist] = await db.insert(workoutPlaylists).values({
      userId: coachUser1.id,
      title: "Basketball Conditioning",
      description: "High-intensity cardio workout for basketball players",
      workoutType: "cardio",
      intensityLevel: "high",
      duration: 30,
      targets: ["stamina", "agility", "speed"],
      createdAt: twoWeeksAgo,
      lastUsed: now,
      timesUsed: 12,
      isCustom: true,
      isPublic: true
    }).returning();

    // Add exercises to the cardio playlist
    await db.insert(workoutExercises).values({
      playlistId: cardioPlaylist.id,
      name: "Suicides",
      description: "Court length sprints with increasing distances",
      duration: 300, // 5 minutes
      order: 1,
      equipmentNeeded: ["basketball court"]
    });

    await db.insert(workoutExercises).values({
      playlistId: cardioPlaylist.id,
      name: "Jump Rope",
      description: "High-intensity jump rope intervals",
      duration: 180, // 3 minutes
      order: 2,
      equipmentNeeded: ["jump rope"]
    });

    await db.insert(workoutExercises).values({
      playlistId: cardioPlaylist.id,
      name: "Defensive Slides",
      description: "Side-to-side defensive movement drills",
      duration: 240, // 4 minutes
      order: 3
    });

    // Create a flexibility/recovery workout playlist
    const [flexibilityPlaylist] = await db.insert(workoutPlaylists).values({
      userId: athleteUser.id,
      title: "Post-Game Recovery",
      description: "Gentle stretching routine for recovery after games",
      workoutType: "flexibility",
      intensityLevel: "low",
      duration: 20,
      targets: ["recovery", "flexibility"],
      createdAt: oneWeekAgo,
      lastUsed: now,
      timesUsed: 3,
      isCustom: true,
      isPublic: false
    }).returning();

    // Add exercises to the flexibility playlist
    await db.insert(workoutExercises).values({
      playlistId: flexibilityPlaylist.id,
      name: "Hamstring Stretch",
      description: "Seated hamstring stretch",
      duration: 60, // 1 minute
      sets: 2,
      order: 1
    });

    await db.insert(workoutExercises).values({
      playlistId: flexibilityPlaylist.id,
      name: "Quad Stretch",
      description: "Standing quad stretch with support",
      duration: 60, // 1 minute
      sets: 2,
      order: 2
    });

    await db.insert(workoutExercises).values({
      playlistId: flexibilityPlaylist.id,
      name: "Shoulder Stretch",
      description: "Cross-body shoulder stretch",
      duration: 60, // 1 minute
      sets: 2,
      order: 3
    });
    
    // Create content blocks for "What Makes Us Different" section
    await db.insert(contentBlocks).values({
      identifier: "what-makes-us-different-ai-analysis",
      title: "AI Motion Analysis",
      content: "Our cutting-edge AI technology analyzes your motion mechanics with professional-grade accuracy, providing detailed feedback on your form, technique, and movement patterns.",
      section: "what-makes-us-different",
      order: 1,
      active: true,
      metadata: {
        iconName: "cpu",
        backgroundColor: "bg-blue-100"
      }
    });
    
    await db.insert(contentBlocks).values({
      identifier: "what-makes-us-different-verified-combines",
      title: "Verified Combines",
      content: "Participate in certified athletic combines where your performance metrics are verified by professionals, giving college scouts reliable data they can trust.",
      section: "what-makes-us-different",
      order: 2,
      active: true,
      metadata: {
        iconName: "badge-check",
        backgroundColor: "bg-green-100"
      }
    });
    
    await db.insert(contentBlocks).values({
      identifier: "what-makes-us-different-scout-connection",
      title: "Direct Scout Connection",
      content: "Get noticed by college scouts through our verified platform that connects talented athletes directly with college recruiting programs across the country.",
      section: "what-makes-us-different",
      order: 3,
      active: true,
      metadata: {
        iconName: "users",
        backgroundColor: "bg-yellow-100"
      }
    });
    
    await db.insert(contentBlocks).values({
      identifier: "what-makes-us-different-personalized-development",
      title: "Personalized Development",
      content: "Receive tailored training programs and development paths based on your specific needs, goals, and athletic profile, helping you reach your full potential.",
      section: "what-makes-us-different",
      order: 4,
      active: true,
      metadata: {
        iconName: "trending-up",
        backgroundColor: "bg-purple-100"
      }
    });
  }
  
  // API Key operations
  async getApiKey(keyType: string): Promise<ApiKey | undefined> {
    const [apiKey] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.keyType, keyType));
    return apiKey;
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    return await db
      .select()
      .from(apiKeys)
      .orderBy(asc(apiKeys.keyType));
  }
  
  async getAllActiveApiKeys(): Promise<ApiKey[]> {
    return await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.isActive, true))
      .orderBy(asc(apiKeys.keyType));
  }

  async getApiKeyStatus(): Promise<Record<string, boolean>> {
    const keys = await this.getAllApiKeys();
    const keyTypes = ["openai", "stripe", "sendgrid", "twilio", "google", "aws", "active"];
    const result: Record<string, boolean> = {};
    
    for (const keyType of keyTypes) {
      result[keyType] = keys.some(key => key.keyType === keyType && key.isActive);
    }
    
    return result;
  }

  async saveApiKey(key: InsertApiKey): Promise<ApiKey> {
    const now = new Date();
    
    // Check if key already exists
    const existingKey = await this.getApiKey(key.keyType);
    
    if (existingKey) {
      // Update existing key
      const [updatedKey] = await db
        .update(apiKeys)
        .set({
          keyValue: key.keyValue,
          isActive: key.isActive,
          lastUsed: now
        })
        .where(eq(apiKeys.keyType, key.keyType))
        .returning();
      
      // If this is an OpenAI key, set the environment variable
      if (key.keyType === "openai" && process.env) {
        process.env.OPENAI_API_KEY = key.keyValue;
      }
      
      return updatedKey;
    } else {
      // Insert new key
      const [newApiKey] = await db
        .insert(apiKeys)
        .values({
          keyType: key.keyType,
          keyValue: key.keyValue,
          addedAt: now,
          isActive: key.isActive ?? true
        })
        .returning();
      
      // If this is an OpenAI key, set the environment variable
      if (key.keyType === "openai" && process.env) {
        process.env.OPENAI_API_KEY = key.keyValue;
      }
      
      return newApiKey;
    }
  }

  async updateApiKey(keyType: string, data: Partial<ApiKey>): Promise<ApiKey | undefined> {
    if (data.keyValue && keyType === "openai" && process.env) {
      process.env.OPENAI_API_KEY = data.keyValue;
    }
    
    const [updatedKey] = await db
      .update(apiKeys)
      .set(data)
      .where(eq(apiKeys.keyType, keyType))
      .returning();
    
    return updatedKey;
  }

  async deleteApiKey(keyType: string): Promise<boolean> {
    const result = await db
      .delete(apiKeys)
      .where(eq(apiKeys.keyType, keyType));
    
    return result.count > 0;
  }

  // Athlete Star Profile operations
  async getAthleteStarProfiles(filters?: { sport?: string; position?: string; starLevel?: number }): Promise<AthleteStarProfile[]> {
    let query = db.select().from(athleteStarProfiles);
    
    if (filters) {
      if (filters.sport) {
        query = query.where(eq(athleteStarProfiles.sport, filters.sport));
      }
      
      if (filters.position) {
        query = query.where(eq(athleteStarProfiles.position, filters.position));
      }
      
      if (filters.starLevel) {
        query = query.where(eq(athleteStarProfiles.starLevel, filters.starLevel));
      }
    }
    
    return await query.orderBy(desc(athleteStarProfiles.createdAt));
  }

  async getAthleteStarProfile(id: number): Promise<AthleteStarProfile | undefined> {
    const [profile] = await db
      .select()
      .from(athleteStarProfiles)
      .where(eq(athleteStarProfiles.id, id));
      
    return profile;
  }

  async createAthleteStarProfile(profile: InsertAthleteStarProfile): Promise<AthleteStarProfile> {
    const now = new Date();
    
    const [newProfile] = await db
      .insert(athleteStarProfiles)
      .values({
        ...profile,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    
    return newProfile;
  }
  
  // Onboarding Progress operations
  async getOnboardingProgress(userId: number): Promise<OnboardingProgress | undefined> {
    const [progress] = await db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.userId, userId));
      
    return progress;
  }
  
  async createOnboardingProgress(progress: InsertOnboardingProgress): Promise<OnboardingProgress> {
    const now = new Date();
    
    const [newProgress] = await db
      .insert(onboardingProgress)
      .values({
        ...progress,
        lastUpdated: now
      })
      .returning();
    
    return newProgress;
  }
  
  async updateOnboardingProgress(userId: number, data: Partial<OnboardingProgress>): Promise<OnboardingProgress | undefined> {
    const now = new Date();
    
    const [updatedProgress] = await db
      .update(onboardingProgress)
      .set({
        ...data,
        lastUpdated: now
      })
      .where(eq(onboardingProgress.userId, userId))
      .returning();
    
    return updatedProgress;
  }
  
  // Athlete Journey Map operations
  async getAthleteJourneyMap(userId: number): Promise<AthleteJourneyMap | undefined> {
    const [journeyMap] = await db
      .select()
      .from(athleteJourneyMap)
      .where(eq(athleteJourneyMap.userId, userId));
      
    return journeyMap;
  }
  
  async createAthleteJourneyMap(journeyMap: InsertAthleteJourneyMap): Promise<AthleteJourneyMap> {
    const now = new Date();
    
    const [newJourneyMap] = await db
      .insert(athleteJourneyMap)
      .values({
        ...journeyMap,
        startedAt: now,
        updatedAt: now
      })
      .returning();
    
    return newJourneyMap;
  }
  
  async updateAthleteJourneyMap(userId: number, data: Partial<AthleteJourneyMap>): Promise<AthleteJourneyMap | undefined> {
    const now = new Date();
    
    const [updatedJourneyMap] = await db
      .update(athleteJourneyMap)
      .set({
        ...data,
        updatedAt: now
      })
      .where(eq(athleteJourneyMap.userId, userId))
      .returning();
    
    return updatedJourneyMap;
  }
  
  // Journey Milestone operations
  async getJourneyMilestones(journeyMapId: number): Promise<JourneyMilestone[]> {
    return await db
      .select()
      .from(journeyMilestones)
      .where(eq(journeyMilestones.journeyMapId, journeyMapId))
      .orderBy(asc(journeyMilestones.priority));
  }
  
  async getJourneyMilestone(id: number): Promise<JourneyMilestone | undefined> {
    const [milestone] = await db
      .select()
      .from(journeyMilestones)
      .where(eq(journeyMilestones.id, id));
      
    return milestone;
  }
  
  async createJourneyMilestone(milestone: InsertJourneyMilestone): Promise<JourneyMilestone> {
    const [newMilestone] = await db
      .insert(journeyMilestones)
      .values(milestone)
      .returning();
    
    return newMilestone;
  }
  
  async updateJourneyMilestone(id: number, data: Partial<JourneyMilestone>): Promise<JourneyMilestone | undefined> {
    const [updatedMilestone] = await db
      .update(journeyMilestones)
      .set(data)
      .where(eq(journeyMilestones.id, id))
      .returning();
    
    return updatedMilestone;
  }
  
  async deleteJourneyMilestone(id: number): Promise<boolean> {
    const result = await db
      .delete(journeyMilestones)
      .where(eq(journeyMilestones.id, id));
      
    return result.count > 0;
  }
}