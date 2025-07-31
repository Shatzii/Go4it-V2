import { users, videoAnalysis, type User, type InsertUser, type VideoAnalysis, type InsertVideoAnalysis } from "../shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Authentication
  validateUserCredentials(email: string, password: string): Promise<User | null>;
  updateLastLogin(userId: number): Promise<void>;
  
  // Video Analysis
  createVideoAnalysis(data: InsertVideoAnalysis): Promise<VideoAnalysis>;
  getVideoAnalysisByUserId(userId: number): Promise<VideoAnalysis[]>;
  getVideoAnalysisById(id: number): Promise<VideoAnalysis | undefined>;
  updateVideoAnalysis(id: number, data: Partial<VideoAnalysis>): Promise<VideoAnalysis>;
  deleteVideoAnalysis(id: number): Promise<void>;
  
  // GAR Scoring and Rankings
  getUsersByGARScore(minScore?: number, maxScore?: number, sport?: string): Promise<User[]>;
  getTopAthletesByGAR(limit: number, sport?: string): Promise<User[]>;
  
  // Subscription Management
  updateUserSubscription(userId: number, subscriptionData: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    subscriptionEndDate?: Date;
  }): Promise<User>;
  
  // Dashboard Statistics
  getDashboardStats(userId?: number): Promise<{
    totalAthletes: number;
    totalAnalyses: number;
    averageGAR: number;
    recentAnalyses: VideoAnalysis[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash password before storing
    if (insertUser.password) {
      insertUser.password = await bcrypt.hash(insertUser.password, 12);
    }
    
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async validateUserCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async updateLastLogin(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, userId));
  }

  async createVideoAnalysis(data: InsertVideoAnalysis): Promise<VideoAnalysis> {
    const [analysis] = await db
      .insert(videoAnalysis)
      .values(data)
      .returning();
    return analysis;
  }

  async getVideoAnalysisByUserId(userId: number): Promise<VideoAnalysis[]> {
    return await db
      .select()
      .from(videoAnalysis)
      .where(eq(videoAnalysis.userId, userId))
      .orderBy(desc(videoAnalysis.createdAt));
  }

  async getVideoAnalysisById(id: number): Promise<VideoAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(videoAnalysis)
      .where(eq(videoAnalysis.id, id));
    return analysis || undefined;
  }

  async updateVideoAnalysis(id: number, data: Partial<VideoAnalysis>): Promise<VideoAnalysis> {
    const [analysis] = await db
      .update(videoAnalysis)
      .set(data)
      .where(eq(videoAnalysis.id, id))
      .returning();
    return analysis;
  }

  async deleteVideoAnalysis(id: number): Promise<void> {
    await db.delete(videoAnalysis).where(eq(videoAnalysis.id, id));
  }

  async getUsersByGARScore(minScore?: number, maxScore?: number, sport?: string): Promise<User[]> {
    let baseQuery = db
      .select()
      .from(users)
      .leftJoin(videoAnalysis, eq(users.id, videoAnalysis.userId));

    if (sport) {
      baseQuery = baseQuery.where(eq(users.sport, sport));
    }

    const results = await baseQuery;
    
    // Group by user and calculate average GAR score
    const userMap = new Map<number, any>();
    
    results.forEach(row => {
      const user = row.users;
      const analysis = row.video_analysis;
      
      if (!userMap.has(user.id)) {
        userMap.set(user.id, {
          ...user,
          garScores: []
        });
      }
      
      if (analysis && analysis.garScore) {
        userMap.get(user.id).garScores.push(Number(analysis.garScore));
      }
    });
    
    // Calculate average and filter
    const filteredUsers = Array.from(userMap.values())
      .map(user => ({
        ...user,
        averageGAR: user.garScores.length > 0 
          ? user.garScores.reduce((a: number, b: number) => a + b, 0) / user.garScores.length 
          : 0
      }))
      .filter(user => {
        const score = user.averageGAR;
        if (minScore !== undefined && score < minScore) return false;
        if (maxScore !== undefined && score > maxScore) return false;
        return true;
      });
    
    return filteredUsers;
  }

  async getTopAthletesByGAR(limit: number, sport?: string): Promise<User[]> {
    const users = await this.getUsersByGARScore(undefined, undefined, sport);
    
    return users
      .sort((a: any, b: any) => (b.averageGAR || 0) - (a.averageGAR || 0))
      .slice(0, limit);
  }

  async updateUserSubscription(userId: number, subscriptionData: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    subscriptionEndDate?: Date;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set(subscriptionData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getDashboardStats(userId?: number): Promise<{
    totalAthletes: number;
    totalAnalyses: number;
    averageGAR: number;
    recentAnalyses: VideoAnalysis[];
  }> {
    // Get total athletes
    const [athleteCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'athlete'));

    // Get total analyses
    const [analysisCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(videoAnalysis);

    // Get average GAR score
    const [avgGAR] = await db
      .select({ avg: sql<number>`COALESCE(AVG(CAST(${videoAnalysis.garScore} as DECIMAL)), 0)` })
      .from(videoAnalysis);

    // Get recent analyses (user-specific or global)
    let recentQuery = db
      .select()
      .from(videoAnalysis)
      .orderBy(desc(videoAnalysis.createdAt))
      .limit(10);

    if (userId) {
      recentQuery = recentQuery.where(eq(videoAnalysis.userId, userId));
    }

    const recentAnalyses = await recentQuery;

    return {
      totalAthletes: athleteCount.count,
      totalAnalyses: analysisCount.count,
      averageGAR: Number(avgGAR.avg),
      recentAnalyses
    };
  }
}

export const storage = new DatabaseStorage();