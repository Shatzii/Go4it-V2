/**
 * Database Storage Implementation
 * 
 * This provides an implementation of the IStorage interface that uses
 * our PostgreSQL database through Drizzle ORM.
 */

import {
  users, type User, type InsertUser,
  videos, type Video, type InsertVideo,
  videoHighlights, type VideoHighlight, type InsertVideoHighlight,
  highlightGeneratorConfigs, type HighlightGeneratorConfig, type InsertHighlightGeneratorConfig,
} from "@shared/schema";
import { db } from "./db.fixed";
import { eq, and, desc, sql, InferSelectModel } from "drizzle-orm";
import { IStorage } from "./storage";
import session from "express-session";
import createMemoryStore from "memorystore";

// Create session store for authentication (using memory store for now)
const MemoryStore = createMemoryStore(session);

export class DatabaseStorage implements IStorage {
  // Session store for authentication
  public sessionStore = new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  });

  // We'll implement just the highlight generator related functions for now
  
  // Get all video highlights for a specific video
  async getVideoHighlightsByVideoId(videoId: number): Promise<VideoHighlight[]> {
    try {
      const highlights = await db.select()
        .from(videoHighlights)
        .where(eq(videoHighlights.videoId, videoId))
        .orderBy(desc(videoHighlights.createdAt));
      
      return highlights;
    } catch (error) {
      console.error('Database error in getVideoHighlightsByVideoId:', error);
      return [];
    }
  }

  // Create a new video highlight
  async createVideoHighlight(highlight: InsertVideoHighlight): Promise<VideoHighlight> {
    try {
      const [newHighlight] = await db.insert(videoHighlights)
        .values(highlight)
        .returning();
      
      return newHighlight;
    } catch (error) {
      console.error('Database error in createVideoHighlight:', error);
      throw new Error(`Failed to create video highlight: ${error.message}`);
    }
  }
  
  // Update an existing video highlight
  async updateVideoHighlight(id: number, data: Partial<VideoHighlight>): Promise<VideoHighlight | undefined> {
    try {
      const [updatedHighlight] = await db.update(videoHighlights)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(videoHighlights.id, id))
        .returning();
      
      return updatedHighlight;
    } catch (error) {
      console.error('Database error in updateVideoHighlight:', error);
      return undefined;
    }
  }
  
  // Delete a video highlight
  async deleteVideoHighlight(id: number): Promise<boolean> {
    try {
      await db.delete(videoHighlights)
        .where(eq(videoHighlights.id, id));
      
      return true;
    } catch (error) {
      console.error('Database error in deleteVideoHighlight:', error);
      return false;
    }
  }
  
  // Get all featured video highlights
  async getFeaturedVideoHighlights(limit: number = 10): Promise<VideoHighlight[]> {
    try {
      const highlights = await db.select()
        .from(videoHighlights)
        .where(eq(videoHighlights.featured, true))
        .orderBy(desc(videoHighlights.createdAt))
        .limit(limit);
      
      return highlights;
    } catch (error) {
      console.error('Database error in getFeaturedVideoHighlights:', error);
      return [];
    }
  }
  
  // Alias method for backward compatibility
  async getFeaturedHighlights(limit: number = 10): Promise<VideoHighlight[]> {
    return this.getFeaturedVideoHighlights(limit);
  }
  
  // Get all homepage-eligible highlights
  async getHomePageEligibleHighlights(limit: number = 6): Promise<VideoHighlight[]> {
    try {
      const highlights = await db.select()
        .from(videoHighlights)
        .where(
          and(
            eq(videoHighlights.featured, true),
            eq(videoHighlights.homePageEligible, true)
          )
        )
        .orderBy(desc(videoHighlights.createdAt))
        .limit(limit);
      
      return highlights;
    } catch (error) {
      console.error('Database error in getHomePageEligibleHighlights:', error);
      return [];
    }
  }
  
  // Generate a video highlight
  async generateVideoHighlight(videoId: number, options: {
    startTime: number;
    endTime: number;
    title: string;
    description?: string;
    tags?: string[];
    qualityScore?: number;
    primarySkill?: string;
    skillLevel?: number;
    featured?: boolean;
    homePageEligible?: boolean;
  }): Promise<VideoHighlight> {
    try {
      // In a real implementation, this would call ffmpeg to extract the highlight clip
      // and generate a thumbnail, for now we just simulate the paths
      const uniqueId = Date.now().toString();
      const sanitizedTitle = options.title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
      
      const highlightPath = `/uploads/highlights/${sanitizedTitle}-${uniqueId}.mp4`;
      const thumbnailPath = `/uploads/thumbnails/${sanitizedTitle}-${uniqueId}.jpg`;
      
      // Create the highlight record
      const highlight: InsertVideoHighlight = {
        videoId,
        title: options.title,
        description: options.description || '',
        startTime: options.startTime,
        endTime: options.endTime,
        highlightPath,
        thumbnailPath,
        aiGenerated: false,
        tags: options.tags || [],
        qualityScore: options.qualityScore || 75,
        primarySkill: options.primarySkill || '',
        skillLevel: options.skillLevel || 50,
        featured: options.featured || false,
        homePageEligible: options.homePageEligible || false,
        createdBy: 1, // Default to admin user for now
      };
      
      // Save to database
      const newHighlight = await this.createVideoHighlight(highlight);
      return newHighlight;
    } catch (error) {
      console.error('Database error in generateVideoHighlight:', error);
      throw new Error(`Failed to generate video highlight: ${error.message}`);
    }
  }
  
  // Get all highlight generator configurations
  async getHighlightGeneratorConfigs(): Promise<HighlightGeneratorConfig[]> {
    try {
      const configs = await db.select()
        .from(highlightGeneratorConfigs);
      
      return configs;
    } catch (error) {
      console.error('Database error in getHighlightGeneratorConfigs:', error);
      return [];
    }
  }
  
  // Get highlight generator configurations by sport
  async getHighlightGeneratorConfigsBySport(sportType: string): Promise<HighlightGeneratorConfig[]> {
    try {
      const configs = await db.select()
        .from(highlightGeneratorConfigs)
        .where(eq(highlightGeneratorConfigs.sportType, sportType));
      
      return configs;
    } catch (error) {
      console.error('Database error in getHighlightGeneratorConfigsBySport:', error);
      return [];
    }
  }
  
  // Get a specific highlight generator configuration
  async getHighlightGeneratorConfig(id: number): Promise<HighlightGeneratorConfig | undefined> {
    try {
      const [config] = await db.select()
        .from(highlightGeneratorConfigs)
        .where(eq(highlightGeneratorConfigs.id, id));
      
      return config;
    } catch (error) {
      console.error('Database error in getHighlightGeneratorConfig:', error);
      return undefined;
    }
  }
  
  // Create a new highlight generator configuration
  async createHighlightGeneratorConfig(config: InsertHighlightGeneratorConfig): Promise<HighlightGeneratorConfig> {
    try {
      const [newConfig] = await db.insert(highlightGeneratorConfigs)
        .values(config)
        .returning();
      
      return newConfig;
    } catch (error) {
      console.error('Database error in createHighlightGeneratorConfig:', error);
      throw new Error(`Failed to create highlight generator config: ${error.message}`);
    }
  }
  
  // Update an existing highlight generator configuration
  async updateHighlightGeneratorConfig(id: number, data: Partial<HighlightGeneratorConfig>): Promise<HighlightGeneratorConfig | undefined> {
    try {
      const [updatedConfig] = await db.update(highlightGeneratorConfigs)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(highlightGeneratorConfigs.id, id))
        .returning();
      
      return updatedConfig;
    } catch (error) {
      console.error('Database error in updateHighlightGeneratorConfig:', error);
      return undefined;
    }
  }
  
  // Delete a highlight generator configuration
  async deleteHighlightGeneratorConfig(id: number): Promise<boolean> {
    try {
      await db.delete(highlightGeneratorConfigs)
        .where(eq(highlightGeneratorConfigs.id, id));
      
      return true;
    } catch (error) {
      console.error('Database error in deleteHighlightGeneratorConfig:', error);
      return false;
    }
  }
  
  // Get active highlight generator configurations
  async getActiveHighlightGeneratorConfigs(): Promise<HighlightGeneratorConfig[]> {
    try {
      const configs = await db.select()
        .from(highlightGeneratorConfigs)
        .where(eq(highlightGeneratorConfigs.active, true));
      
      return configs;
    } catch (error) {
      console.error('Database error in getActiveHighlightGeneratorConfigs:', error);
      return [];
    }
  }
  
  // Get unanalyzed videos for highlights
  async getUnanalyzedVideosForHighlights(): Promise<Video[]> {
    try {
      // Look for videos that have been uploaded but not yet analyzed
      const videosToAnalyze = await db.select()
        .from(videos)
        .where(
          and(
            eq(videos.analyzed, false),
            eq(videos.processingStatus, 'complete')
          )
        );
      
      return videosToAnalyze;
    } catch (error) {
      console.error('Database error in getUnanalyzedVideosForHighlights:', error);
      return [];
    }
  }
  
  // Get all users with a specific role
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const usersWithRole = await db.select()
        .from(users)
        .where(eq(users.role, role));
      
      return usersWithRole;
    } catch (error) {
      console.error('Database error in getUsersByRole:', error);
      return [];
    }
  }
  
  // Get a specific video
  async getVideo(id: number): Promise<Video | undefined> {
    try {
      const [video] = await db.select()
        .from(videos)
        .where(eq(videos.id, id));
      
      return video;
    } catch (error) {
      console.error('Database error in getVideo:', error);
      return undefined;
    }
  }
  
  // Get videos by user
  async getVideosByUser(userId: number): Promise<Video[]> {
    try {
      const userVideos = await db.select()
        .from(videos)
        .where(eq(videos.userId, userId));
      
      return userVideos;
    } catch (error) {
      console.error('Database error in getVideosByUser:', error);
      return [];
    }
  }
  
  // Create a new video
  async createVideo(video: InsertVideo): Promise<Video> {
    try {
      const [newVideo] = await db.insert(videos)
        .values(video)
        .returning();
      
      return newVideo;
    } catch (error) {
      console.error('Database error in createVideo:', error);
      throw new Error(`Failed to create video: ${error.message}`);
    }
  }

  // Update a video
  async updateVideo(id: number, data: Partial<Video>): Promise<Video | undefined> {
    try {
      const [updatedVideo] = await db.update(videos)
        .set(data)
        .where(eq(videos.id, id))
        .returning();
      
      return updatedVideo;
    } catch (error) {
      console.error('Database error in updateVideo:', error);
      return undefined;
    }
  }
  
  // Required methods for the IStorage interface
  // These are placeholders and should be implemented properly
  
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, id));
      
      return user;
    } catch (error) {
      console.error('Database error in getUser:', error);
      return undefined;
    }
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.username, username));
      
      return user;
    } catch (error) {
      console.error('Database error in getUserByUsername:', error);
      return undefined;
    }
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.email, email));
      
      return user;
    } catch (error) {
      console.error('Database error in getUserByEmail:', error);
      return undefined;
    }
  }
  
  async createUser(user: InsertUser): Promise<User> {
    try {
      const [newUser] = await db.insert(users)
        .values(user)
        .returning();
      
      return newUser;
    } catch (error) {
      console.error('Database error in createUser:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    try {
      const [updatedUser] = await db.update(users)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(users.id, id))
        .returning();
      
      return updatedUser;
    } catch (error) {
      console.error('Database error in updateUser:', error);
      return undefined;
    }
  }



// Export a singleton instance
export const dbStorage = new DatabaseStorage();