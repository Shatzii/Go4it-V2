import {
  users, type User, type InsertUser,
  athleteProfiles, type AthleteProfile, type InsertAthleteProfile,
  coachProfiles, type CoachProfile, type InsertCoachProfile,
  videos, type Video, type InsertVideo,
  videoAnalyses, type VideoAnalysis, type InsertVideoAnalysis,
  sportRecommendations, type SportRecommendation, type InsertSportRecommendation,
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
  featuredAthletes, type FeaturedAthlete, type InsertFeaturedAthlete
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, and, desc, asc, sql, isNull, isNotNull } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

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
        ssl: process.env.NODE_ENV === "production"
      },
      createTableIfMissing: true
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

  // Featured Athletes operations
  async getFeaturedAthletes(limit: number = 4): Promise<FeaturedAthlete[]> {
    return await db
      .select()
      .from(featuredAthletes)
      .where(eq(featuredAthletes.active, true))
      .orderBy(asc(featuredAthletes.order), desc(featuredAthletes.featuredDate))
      .limit(limit);
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

  // Method to seed initial data
  async seedInitialData() {
    // Check if we already have users
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("Data already seeded, skipping...");
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
  }
}