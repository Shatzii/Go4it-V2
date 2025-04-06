import { 
  users, type User, type InsertUser,
  videoHighlights, type VideoHighlight, type InsertVideoHighlight,
  highlightGeneratorConfigs, type HighlightGeneratorConfig, type InsertHighlightGeneratorConfig,
  videos, type Video, type InsertVideo
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface from storage.ts is reused, but we're only implementing essential methods for now

export class DatabaseStorage {
  
  // Video Highlight methods
  async getVideoHighlightsByVideoId(videoId: number): Promise<VideoHighlight[]> {
    try {
      const highlights = await db.select()
        .from(videoHighlights)
        .where(eq(videoHighlights.videoId, videoId));
      
      return highlights;
    } catch (error) {
      console.error('Database error in getVideoHighlightsByVideoId:', error);
      return [];
    }
  }

  async createVideoHighlight(highlight: InsertVideoHighlight): Promise<VideoHighlight> {
    const [newHighlight] = await db
      .insert(videoHighlights)
      .values(highlight)
      .returning();
    
    return newHighlight;
  }

  async updateVideoHighlight(id: number, data: Partial<VideoHighlight>): Promise<VideoHighlight | undefined> {
    try {
      const [updatedHighlight] = await db
        .update(videoHighlights)
        .set(data)
        .where(eq(videoHighlights.id, id))
        .returning();
      
      return updatedHighlight;
    } catch (error) {
      console.error('Database error in updateVideoHighlight:', error);
      return undefined;
    }
  }

  async deleteVideoHighlight(id: number): Promise<boolean> {
    try {
      await db
        .delete(videoHighlights)
        .where(eq(videoHighlights.id, id));
      
      return true;
    } catch (error) {
      console.error('Database error in deleteVideoHighlight:', error);
      return false;
    }
  }

  async getFeaturedVideoHighlights(limit: number = 10): Promise<VideoHighlight[]> {
    try {
      const highlights = await db.select()
        .from(videoHighlights)
        .where(eq(videoHighlights.featured, true))
        .limit(limit);
      
      return highlights;
    } catch (error) {
      console.error('Database error in getFeaturedVideoHighlights:', error);
      return [];
    }
  }

  async getFeaturedHighlights(limit: number = 10): Promise<VideoHighlight[]> {
    try {
      const highlights = await db.select()
        .from(videoHighlights)
        .where(eq(videoHighlights.featured, true))
        .orderBy(desc(videoHighlights.createdAt))
        .limit(limit);
      
      return highlights;
    } catch (error) {
      console.error('Database error in getFeaturedHighlights:', error);
      return [];
    }
  }

  async getHomePageEligibleHighlights(limit: number = 6): Promise<VideoHighlight[]> {
    try {
      const highlights = await db.select()
        .from(videoHighlights)
        .where(
          and(
            eq(videoHighlights.featured, true),
            eq(videoHighlights.qualityScore, 5)
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

  // Highlight Generator Config methods
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

  async createHighlightGeneratorConfig(config: InsertHighlightGeneratorConfig): Promise<HighlightGeneratorConfig> {
    const [newConfig] = await db
      .insert(highlightGeneratorConfigs)
      .values(config)
      .returning();
    
    return newConfig;
  }

  async updateHighlightGeneratorConfig(id: number, data: Partial<HighlightGeneratorConfig>): Promise<HighlightGeneratorConfig | undefined> {
    try {
      const [updatedConfig] = await db
        .update(highlightGeneratorConfigs)
        .set(data)
        .where(eq(highlightGeneratorConfigs.id, id))
        .returning();
      
      return updatedConfig;
    } catch (error) {
      console.error('Database error in updateHighlightGeneratorConfig:', error);
      return undefined;
    }
  }

  async deleteHighlightGeneratorConfig(id: number): Promise<boolean> {
    try {
      await db
        .delete(highlightGeneratorConfigs)
        .where(eq(highlightGeneratorConfigs.id, id));
      
      return true;
    } catch (error) {
      console.error('Database error in deleteHighlightGeneratorConfig:', error);
      return false;
    }
  }

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

  async getUnanalyzedVideosForHighlights(): Promise<Video[]> {
    try {
      const unanalyzedVideos = await db.select()
        .from(videos)
        .where(eq(videos.analyzed, false));
      
      return unanalyzedVideos;
    } catch (error) {
      console.error('Database error in getUnanalyzedVideosForHighlights:', error);
      return [];
    }
  }

  // User methods
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

  // Video methods
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

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db
      .insert(videos)
      .values(video)
      .returning();
    
    return newVideo;
  }

  async updateVideo(id: number, data: Partial<Video>): Promise<Video | undefined> {
    try {
      const [updatedVideo] = await db
        .update(videos)
        .set(data)
        .where(eq(videos.id, id))
        .returning();
      
      return updatedVideo;
    } catch (error) {
      console.error('Database error in updateVideo:', error);
      return undefined;
    }
  }

  // User methods
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
    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();
    
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();
      
      return updatedUser;
    } catch (error) {
      console.error('Database error in updateUser:', error);
      return undefined;
    }
  }

  // Add other methods as needed based on project requirements
}

// Export a singleton instance
export const dbStorage = new DatabaseStorage();