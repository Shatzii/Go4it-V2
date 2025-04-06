import {
  users, type User, type InsertUser,
  videoHighlights, type VideoHighlight, type InsertVideoHighlight,
  highlightGeneratorConfigs, type HighlightGeneratorConfig, type InsertHighlightGeneratorConfig,
  videos, type Video, type InsertVideo
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import MemoryStore from "memorystore";
import session from "express-session";

export interface IStorage {
  // Session store
  sessionStore: any;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Video operations
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUser(userId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, data: Partial<Video>): Promise<Video | undefined>;
  
  // Video Highlight operations
  getVideoHighlightsByVideoId(videoId: number): Promise<VideoHighlight[]>;
  createVideoHighlight(highlight: InsertVideoHighlight): Promise<VideoHighlight>;
  updateVideoHighlight(id: number, data: Partial<VideoHighlight>): Promise<VideoHighlight | undefined>;
  deleteVideoHighlight(id: number): Promise<boolean>;
  getFeaturedVideoHighlights(limit?: number): Promise<VideoHighlight[]>;
  getFeaturedHighlights(limit?: number): Promise<VideoHighlight[]>;
  getHomePageEligibleHighlights(limit?: number): Promise<VideoHighlight[]>;
  
  // Highlight Generator Config operations
  getHighlightGeneratorConfigs(): Promise<HighlightGeneratorConfig[]>;
  getHighlightGeneratorConfigsBySport(sportType: string): Promise<HighlightGeneratorConfig[]>;
  getHighlightGeneratorConfig(id: number): Promise<HighlightGeneratorConfig | undefined>;
  createHighlightGeneratorConfig(config: InsertHighlightGeneratorConfig): Promise<HighlightGeneratorConfig>;
  updateHighlightGeneratorConfig(id: number, data: Partial<HighlightGeneratorConfig>): Promise<HighlightGeneratorConfig | undefined>;
  deleteHighlightGeneratorConfig(id: number): Promise<boolean>;
  getActiveHighlightGeneratorConfigs(): Promise<HighlightGeneratorConfig[]>;
  getUnanalyzedVideosForHighlights(): Promise<Video[]>;

  // User operations by role
  getUsersByRole(role: string): Promise<User[]>;
}

// Direct database implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    // Create a memory store for session management
    const MemoryStoreSession = MemoryStore(session);
    this.sessionStore = new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Video operations
  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async getVideosByUser(userId: number): Promise<Video[]> {
    return await db.select().from(videos).where(eq(videos.userId, userId));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [createdVideo] = await db.insert(videos).values(video).returning();
    return createdVideo;
  }

  async updateVideo(id: number, data: Partial<Video>): Promise<Video | undefined> {
    const [updatedVideo] = await db.update(videos)
      .set(data)
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo;
  }

  // Video Highlight operations
  async getVideoHighlightsByVideoId(videoId: number): Promise<VideoHighlight[]> {
    return await db.select()
      .from(videoHighlights)
      .where(eq(videoHighlights.videoId, videoId));
  }

  async createVideoHighlight(highlight: InsertVideoHighlight): Promise<VideoHighlight> {
    const [createdHighlight] = await db.insert(videoHighlights)
      .values(highlight)
      .returning();
    return createdHighlight;
  }

  async updateVideoHighlight(id: number, data: Partial<VideoHighlight>): Promise<VideoHighlight | undefined> {
    const [updatedHighlight] = await db.update(videoHighlights)
      .set(data)
      .where(eq(videoHighlights.id, id))
      .returning();
    return updatedHighlight;
  }

  async deleteVideoHighlight(id: number): Promise<boolean> {
    const result = await db.delete(videoHighlights)
      .where(eq(videoHighlights.id, id));
    return true; // If no error was thrown, we consider it successful
  }

  async getFeaturedVideoHighlights(limit: number = 10): Promise<VideoHighlight[]> {
    return await db.select()
      .from(videoHighlights)
      .where(eq(videoHighlights.featured, true))
      .limit(limit);
  }

  async getFeaturedHighlights(limit: number = 10): Promise<VideoHighlight[]> {
    return await db.select()
      .from(videoHighlights)
      .where(eq(videoHighlights.featured, true))
      .orderBy(desc(videoHighlights.qualityScore))
      .limit(limit);
  }

  async getHomePageEligibleHighlights(limit: number = 6): Promise<VideoHighlight[]> {
    return await db.select()
      .from(videoHighlights)
      .where(
        and(
          eq(videoHighlights.featured, true),
          sql`${videoHighlights.qualityScore} >= 70`
        )
      )
      .orderBy(desc(videoHighlights.qualityScore))
      .limit(limit);
  }

  // Highlight Generator Config operations
  async getHighlightGeneratorConfigs(): Promise<HighlightGeneratorConfig[]> {
    return await db.select().from(highlightGeneratorConfigs);
  }

  async getHighlightGeneratorConfigsBySport(sportType: string): Promise<HighlightGeneratorConfig[]> {
    return await db.select()
      .from(highlightGeneratorConfigs)
      .where(eq(highlightGeneratorConfigs.sportType, sportType));
  }

  async getHighlightGeneratorConfig(id: number): Promise<HighlightGeneratorConfig | undefined> {
    const [config] = await db.select()
      .from(highlightGeneratorConfigs)
      .where(eq(highlightGeneratorConfigs.id, id));
    return config;
  }

  async createHighlightGeneratorConfig(config: InsertHighlightGeneratorConfig): Promise<HighlightGeneratorConfig> {
    const [createdConfig] = await db.insert(highlightGeneratorConfigs)
      .values(config)
      .returning();
    return createdConfig;
  }

  async updateHighlightGeneratorConfig(id: number, data: Partial<HighlightGeneratorConfig>): Promise<HighlightGeneratorConfig | undefined> {
    const [updatedConfig] = await db.update(highlightGeneratorConfigs)
      .set(data)
      .where(eq(highlightGeneratorConfigs.id, id))
      .returning();
    return updatedConfig;
  }

  async deleteHighlightGeneratorConfig(id: number): Promise<boolean> {
    const result = await db.delete(highlightGeneratorConfigs)
      .where(eq(highlightGeneratorConfigs.id, id));
    return true; // If no error was thrown, we consider it successful
  }

  async getActiveHighlightGeneratorConfigs(): Promise<HighlightGeneratorConfig[]> {
    return await db.select()
      .from(highlightGeneratorConfigs)
      .where(eq(highlightGeneratorConfigs.active, true));
  }

  async getUnanalyzedVideosForHighlights(): Promise<Video[]> {
    return await db.select()
      .from(videos)
      .where(
        and(
          eq(videos.analyzed, false),
          eq(videos.processingStatus, 'complete')
        )
      );
  }

  // User operations by role
  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select()
      .from(users)
      .where(eq(users.role, role));
  }
}

// Export a singleton instance
export const storage = new DatabaseStorage();