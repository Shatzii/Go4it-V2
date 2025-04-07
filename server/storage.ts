import {
  users, type User, type InsertUser,
  videoHighlights, type VideoHighlight, type InsertVideoHighlight,
  highlightGeneratorConfigs, type HighlightGeneratorConfig, type InsertHighlightGeneratorConfig,
  videos, type Video, type InsertVideo,
  apiKeys, type ApiKey,
  contentBlocks, type ContentBlock, type InsertContentBlock,
  blogPosts, type BlogPost, type InsertBlogPost,
  featuredAthletes, type FeaturedAthlete, type InsertFeaturedAthlete,
  garCategories, type GarCategory, type InsertGarCategory,
  garSubcategories, type GarSubcategory, type InsertGarSubcategory,
  garAthleteRatings, type GarAthleteRating, type InsertGarAthleteRating,
  garRatingHistory, type GarRatingHistory, type InsertGarRatingHistory,
  videoAnalyses, type VideoAnalysis
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, like, inArray } from "drizzle-orm";
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
  
  // API Key operations
  getAllActiveApiKeys(): Promise<ApiKey[]>;
  
  // Content Blocks operations
  getContentBlocks(): Promise<ContentBlock[]>;
  getContentBlocksBySection(section: string): Promise<ContentBlock[]>;
  getContentBlockById(id: number): Promise<ContentBlock | undefined>;
  getContentBlockByIdentifier(identifier: string): Promise<ContentBlock | undefined>;
  createContentBlock(contentBlock: InsertContentBlock): Promise<ContentBlock>;
  updateContentBlock(id: number, data: Partial<ContentBlock>): Promise<ContentBlock | undefined>;
  deleteContentBlock(id: number): Promise<boolean>;
  
  // Blog Posts operations
  getBlogPosts(limit?: number): Promise<BlogPost[]>;
  getFeaturedBlogPosts(limit?: number): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(category: string, limit?: number): Promise<BlogPost[]>;
  getBlogPostsByTags(tags: string[], limit?: number): Promise<BlogPost[]>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Featured Athletes operations
  getFeaturedAthletes(limit?: number): Promise<FeaturedAthlete[]>;
  getFeaturedAthleteById(id: number): Promise<FeaturedAthlete | undefined>;
  getFeaturedAthleteByUserId(userId: number): Promise<FeaturedAthlete | undefined>;
  createFeaturedAthlete(featuredAthlete: InsertFeaturedAthlete): Promise<FeaturedAthlete>;
  updateFeaturedAthlete(id: number, data: Partial<FeaturedAthlete>): Promise<FeaturedAthlete | undefined>;
  deleteFeaturedAthlete(id: number): Promise<boolean>;
  
  // GAR Categories operations
  getGarCategories(): Promise<GarCategory[]>;
  getGarCategoriesBySport(sportType: string): Promise<GarCategory[]>;
  getGarCategory(id: number): Promise<GarCategory | undefined>;
  
  // GAR Subcategories operations
  getGarSubcategories(categoryId: number): Promise<GarSubcategory[]>;
  getGarSubcategory(id: number): Promise<GarSubcategory | undefined>;
  
  // GAR Athlete Ratings operations
  getGarAthleteRatingsByUser(userId: number): Promise<GarAthleteRating[]>;
  getGarAthleteRatingsByCategory(userId: number, categoryId: number): Promise<GarAthleteRating[]>;
  getLatestGarAthleteRating(userId: number, categoryId: number): Promise<GarAthleteRating | undefined>;
  
  // GAR Rating History operations
  getGarRatingHistoryByUser(userId: number, limit?: number): Promise<GarRatingHistory[]>;
  getLatestGarRatingHistory(userId: number): Promise<GarRatingHistory | undefined>;
  
  // Video Analysis operations
  getVideoAnalysis(id: number): Promise<VideoAnalysis | undefined>;
  getVideoAnalysisByVideoId(videoId: number): Promise<VideoAnalysis | undefined>;
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
      .where(eq(videos.analyzed, false));
  }

  // User operations by role
  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select()
      .from(users)
      .where(eq(users.role, role));
  }
  
  // API Key operations
  async getAllActiveApiKeys(): Promise<ApiKey[]> {
    try {
      return await db.select()
        .from(apiKeys)
        .where(eq(apiKeys.isActive, true));
    } catch (error) {
      console.error('Database error in getAllActiveApiKeys:', error);
      return [];
    }
  }

  // Content Blocks operations
  async getContentBlocks(): Promise<ContentBlock[]> {
    return await db.select()
      .from(contentBlocks)
      .where(eq(contentBlocks.active, true))
      .orderBy(contentBlocks.order);
  }

  async getContentBlocksBySection(section: string): Promise<ContentBlock[]> {
    return await db.select()
      .from(contentBlocks)
      .where(
        and(
          eq(contentBlocks.active, true),
          eq(contentBlocks.section, section)
        )
      )
      .orderBy(contentBlocks.order);
  }

  async getContentBlockById(id: number): Promise<ContentBlock | undefined> {
    const [block] = await db.select()
      .from(contentBlocks)
      .where(eq(contentBlocks.id, id));
    return block;
  }

  async getContentBlockByIdentifier(identifier: string): Promise<ContentBlock | undefined> {
    const [block] = await db.select()
      .from(contentBlocks)
      .where(eq(contentBlocks.identifier, identifier));
    return block;
  }

  async createContentBlock(contentBlock: InsertContentBlock): Promise<ContentBlock> {
    const [createdBlock] = await db.insert(contentBlocks)
      .values(contentBlock)
      .returning();
    return createdBlock;
  }

  async updateContentBlock(id: number, data: Partial<ContentBlock>): Promise<ContentBlock | undefined> {
    const [updatedBlock] = await db.update(contentBlocks)
      .set({
        ...data,
        lastUpdated: new Date()
      })
      .where(eq(contentBlocks.id, id))
      .returning();
    return updatedBlock;
  }

  async deleteContentBlock(id: number): Promise<boolean> {
    const result = await db.delete(contentBlocks)
      .where(eq(contentBlocks.id, id));
    return true; // If no error was thrown, we consider it successful
  }

  // Blog Posts operations
  async getBlogPosts(limit: number = 10): Promise<BlogPost[]> {
    return await db.select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }

  async getFeaturedBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    return await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.featured, true))
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostsByCategory(category: string, limit: number = 10): Promise<BlogPost[]> {
    return await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.category, category))
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }

  async getBlogPostsByTags(tags: string[], limit: number = 10): Promise<BlogPost[]> {
    return await db.select()
      .from(blogPosts)
      .where(sql`${blogPosts.tags} && ${tags}`)
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const [createdPost] = await db.insert(blogPosts)
      .values(blogPost)
      .returning();
    return createdPost;
  }

  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db.update(blogPosts)
      .set(data)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts)
      .where(eq(blogPosts.id, id));
    return true; // If no error was thrown, we consider it successful
  }

  // Featured Athletes operations
  async getFeaturedAthletes(limit: number = 6): Promise<FeaturedAthlete[]> {
    return await db.select()
      .from(featuredAthletes)
      .where(eq(featuredAthletes.active, true))
      .orderBy(featuredAthletes.order)
      .limit(limit);
  }

  async getFeaturedAthleteById(id: number): Promise<FeaturedAthlete | undefined> {
    const [athlete] = await db.select()
      .from(featuredAthletes)
      .where(eq(featuredAthletes.id, id));
    return athlete;
  }

  async getFeaturedAthleteByUserId(userId: number): Promise<FeaturedAthlete | undefined> {
    const [athlete] = await db.select()
      .from(featuredAthletes)
      .where(eq(featuredAthletes.userId, userId));
    return athlete;
  }

  async createFeaturedAthlete(featuredAthlete: InsertFeaturedAthlete): Promise<FeaturedAthlete> {
    const [createdAthlete] = await db.insert(featuredAthletes)
      .values(featuredAthlete)
      .returning();
    return createdAthlete;
  }

  async updateFeaturedAthlete(id: number, data: Partial<FeaturedAthlete>): Promise<FeaturedAthlete | undefined> {
    const [updatedAthlete] = await db.update(featuredAthletes)
      .set(data)
      .where(eq(featuredAthletes.id, id))
      .returning();
    return updatedAthlete;
  }

  async deleteFeaturedAthlete(id: number): Promise<boolean> {
    const result = await db.delete(featuredAthletes)
      .where(eq(featuredAthletes.id, id));
    return true; // If no error was thrown, we consider it successful
  }

  // GAR Categories operations
  async getGarCategories(): Promise<GarCategory[]> {
    return await db.select()
      .from(garCategories)
      .where(eq(garCategories.active, true))
      .orderBy(garCategories.displayOrder);
  }

  async getGarCategoriesBySport(sportType: string): Promise<GarCategory[]> {
    return await db.select()
      .from(garCategories)
      .where(
        and(
          eq(garCategories.active, true),
          eq(garCategories.sportType, sportType)
        )
      )
      .orderBy(garCategories.displayOrder);
  }

  async getGarCategory(id: number): Promise<GarCategory | undefined> {
    const [category] = await db.select()
      .from(garCategories)
      .where(eq(garCategories.id, id));
    return category;
  }

  // GAR Subcategories operations
  async getGarSubcategories(categoryId: number): Promise<GarSubcategory[]> {
    return await db.select()
      .from(garSubcategories)
      .where(
        and(
          eq(garSubcategories.active, true),
          eq(garSubcategories.categoryId, categoryId)
        )
      )
      .orderBy(garSubcategories.displayOrder);
  }

  async getGarSubcategory(id: number): Promise<GarSubcategory | undefined> {
    const [subcategory] = await db.select()
      .from(garSubcategories)
      .where(eq(garSubcategories.id, id));
    return subcategory;
  }

  // GAR Athlete Ratings operations
  async getGarAthleteRatingsByUser(userId: number): Promise<GarAthleteRating[]> {
    return await db.select()
      .from(garAthleteRatings)
      .where(eq(garAthleteRatings.userId, userId))
      .orderBy(desc(garAthleteRatings.scoreDate));
  }

  async getGarAthleteRatingsByCategory(userId: number, categoryId: number): Promise<GarAthleteRating[]> {
    return await db.select()
      .from(garAthleteRatings)
      .where(
        and(
          eq(garAthleteRatings.userId, userId),
          eq(garAthleteRatings.categoryId, categoryId)
        )
      )
      .orderBy(desc(garAthleteRatings.scoreDate));
  }

  async getLatestGarAthleteRating(userId: number, categoryId: number): Promise<GarAthleteRating | undefined> {
    const [rating] = await db.select()
      .from(garAthleteRatings)
      .where(
        and(
          eq(garAthleteRatings.userId, userId),
          eq(garAthleteRatings.categoryId, categoryId)
        )
      )
      .orderBy(desc(garAthleteRatings.scoreDate))
      .limit(1);
    return rating;
  }

  // GAR Rating History operations
  async getGarRatingHistoryByUser(userId: number, limit: number = 10): Promise<GarRatingHistory[]> {
    return await db.select()
      .from(garRatingHistory)
      .where(eq(garRatingHistory.userId, userId))
      .orderBy(desc(garRatingHistory.calculatedDate))
      .limit(limit);
  }

  async getLatestGarRatingHistory(userId: number): Promise<GarRatingHistory | undefined> {
    const [history] = await db.select()
      .from(garRatingHistory)
      .where(eq(garRatingHistory.userId, userId))
      .orderBy(desc(garRatingHistory.calculatedDate))
      .limit(1);
    return history;
  }

  // Video Analysis operations
  async getVideoAnalysis(id: number): Promise<VideoAnalysis | undefined> {
    const [analysis] = await db.select()
      .from(videoAnalyses)
      .where(eq(videoAnalyses.id, id));
    return analysis;
  }

  async getVideoAnalysisByVideoId(videoId: number): Promise<VideoAnalysis | undefined> {
    const [analysis] = await db.select()
      .from(videoAnalyses)
      .where(eq(videoAnalyses.videoId, videoId));
    return analysis;
  }
}

// Export a singleton instance
export const storage = new DatabaseStorage();