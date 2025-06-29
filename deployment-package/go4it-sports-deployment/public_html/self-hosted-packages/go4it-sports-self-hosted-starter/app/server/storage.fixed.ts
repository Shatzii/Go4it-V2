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
  videoAnalyses, type VideoAnalysis,
  combineTourEvents, type CombineTourEvent, type InsertCombineTourEvent,
  userTokens, type UserToken, type InsertUserToken,
  // Athlete Star Profiles
  athleteStarProfiles, type AthleteStarProfile, type InsertAthleteStarProfile,
  // NCAA Schools database tables
  ncaaSchools, type NcaaSchool, type InsertNcaaSchool,
  athleticDepartments, type AthleticDepartment, type InsertAthleticDepartment,
  sportPrograms, type SportProgram, type InsertSportProgram,
  coachingStaff, type CoachingStaff, type InsertCoachingStaff,
  recruitingContacts, type RecruitingContact, type InsertRecruitingContact,
  // Skill Tree and Training Drills
  skillTreeNodes, type SkillTreeNode, type InsertSkillTreeNode,
  skillTreeRelationships, type SkillTreeRelationship, type InsertSkillTreeRelationship,
  skills, type Skill, type InsertSkill,
  trainingDrills, type TrainingDrill, type InsertTrainingDrill,
  trainingDrillsExtended, type TrainingDrillsExtended, type InsertTrainingDrillsExtended,
  userDrillProgress, type UserDrillProgress, type InsertUserDrillProgress
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, sql, like, inArray } from "drizzle-orm";
import MemoryStore from "memorystore";
import session from "express-session";
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';

export interface IStorage {
  // Session store
  sessionStore: any;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getAllAthletes(): Promise<User[]>;
  
  // Video operations
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUser(userId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, data: Partial<Video>): Promise<Video | undefined>;
  
  // Video Analysis operations
  getVideoAnalysis(id: number): Promise<VideoAnalysis | undefined>;
  getVideoAnalysisByVideoId(videoId: number): Promise<VideoAnalysis | undefined>;
  saveVideoAnalysis(videoId: number, analysisData: any): Promise<VideoAnalysis>;
  createVideoAnalysis(analysisData: any): Promise<VideoAnalysis>;
  
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
  saveVideoAnalysis(videoId: number, analysisData: any): Promise<VideoAnalysis>;
  
  // Combine Tour Events operations
  getCombineTourEvents(): Promise<CombineTourEvent[]>;
  getCombineTourEvent(id: number): Promise<CombineTourEvent | undefined>;
  getCombineTourEventBySlug(slug: string): Promise<CombineTourEvent | undefined>;
  getUpcomingCombineTourEvents(limit?: number): Promise<CombineTourEvent[]>;
  getPastCombineTourEvents(limit?: number): Promise<CombineTourEvent[]>;
  getFeaturedCombineTourEvents(limit?: number): Promise<CombineTourEvent[]>;
  getCombineTourEventsByStatus(status: string, limit?: number): Promise<CombineTourEvent[]>;
  createCombineTourEvent(event: InsertCombineTourEvent): Promise<CombineTourEvent>;
  updateCombineTourEvent(id: number, data: Partial<CombineTourEvent>): Promise<CombineTourEvent | undefined>;
  deleteCombineTourEvent(id: number): Promise<boolean>;
  
  // AI Coach and Player features - stubs for future implementation
  getAthleteProfile(userId: number): Promise<any | undefined>;
  getPlayerProgress(userId: number): Promise<any | undefined>;
  getPlayerEquipment(userId: number): Promise<any[]>;
  getWorkoutVerification(userId: number): Promise<any | undefined>;
  getWorkoutVerificationCheckpoints(verificationId: number): Promise<any[]>;
  updateWorkoutVerification(verificationId: number, data: any): Promise<any>;
  getWeightRoomEquipmentById(equipmentId: number): Promise<any | undefined>;
  addXpToPlayer(userId: number, amount: number, source: string, reason: string, metadata?: any): Promise<boolean>;
  getSportRecommendations(userId: number): Promise<any[]>;
  
  // Skill Tree operations
  getSkillTreeNodes(sportType?: string, position?: string): Promise<SkillTreeNode[]>;
  getSkillTreeNode(id: number): Promise<SkillTreeNode | undefined>;
  getSkillTreeNodesByLevel(level: number): Promise<SkillTreeNode[]>;
  createSkillTreeNode(node: InsertSkillTreeNode): Promise<SkillTreeNode>;
  updateSkillTreeNode(id: number, data: Partial<SkillTreeNode>): Promise<SkillTreeNode | undefined>;
  
  // Skill Tree Relationship operations
  getSkillTreeRelationships(): Promise<SkillTreeRelationship[]>;
  getChildSkillNodes(parentNodeId: number): Promise<SkillTreeNode[]>;
  getParentSkillNodes(childNodeId: number): Promise<SkillTreeNode[]>;
  createSkillTreeRelationship(relationship: InsertSkillTreeRelationship): Promise<SkillTreeRelationship>;
  
  // Training Drills operations
  getTrainingDrills(sportType?: string, position?: string, category?: string): Promise<TrainingDrill[]>;
  getTrainingDrill(id: number): Promise<TrainingDrill | undefined>;
  getTrainingDrillsBySkill(skillNodeId: number): Promise<TrainingDrill[]>;
  createTrainingDrill(drill: InsertTrainingDrill): Promise<TrainingDrill>;
  updateTrainingDrill(id: number, data: Partial<TrainingDrill>): Promise<TrainingDrill | undefined>;
  
  // User Skill Progress operations
  getUserSkills(userId: number): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, data: Partial<Skill>): Promise<Skill | undefined>;
  
  // User Drill Progress operations
  getUserDrillProgress(userId: number): Promise<UserDrillProgress[]>;
  getUserDrillProgressByDrill(userId: number, drillId: number): Promise<UserDrillProgress | undefined>;
  createUserDrillProgress(progress: InsertUserDrillProgress): Promise<UserDrillProgress>;
  updateUserDrillProgress(id: number, data: Partial<UserDrillProgress>): Promise<UserDrillProgress | undefined>;
  
  // CyberShield Security - User token operations
  getUserTokenByToken(token: string): Promise<UserToken | undefined>;
  getUserTokens(userId: number): Promise<UserToken[]>;
  getUserActiveTokens(userId: number): Promise<UserToken[]>;
  createUserToken(token: InsertUserToken): Promise<UserToken>;
  revokeUserToken(id: number): Promise<UserToken | undefined>;
  revokeAllUserTokens(userId: number): Promise<boolean>;
  updateUserTokenLastUsed(id: number): Promise<UserToken | undefined>;
  
  // NCAA Schools database operations
  getNcaaSchools(limit?: number): Promise<NcaaSchool[]>;
  getNcaaSchoolById(id: number): Promise<NcaaSchool | undefined>;
  getNcaaSchoolsByDivision(division: string): Promise<NcaaSchool[]>;
  getNcaaSchoolsByState(state: string): Promise<NcaaSchool[]>;
  getNcaaSchoolsByConference(conference: string): Promise<NcaaSchool[]>;
  createNcaaSchool(school: InsertNcaaSchool): Promise<NcaaSchool>;
  updateNcaaSchool(id: number, data: Partial<NcaaSchool>): Promise<NcaaSchool | undefined>;
  
  // Athletic Department operations
  getAthleticDepartmentsBySchool(schoolId: number): Promise<AthleticDepartment[]>;
  getAthleticDepartmentById(id: number): Promise<AthleticDepartment | undefined>;
  createAthleticDepartment(department: InsertAthleticDepartment): Promise<AthleticDepartment>;
  updateAthleticDepartment(id: number, data: Partial<AthleticDepartment>): Promise<AthleticDepartment | undefined>;
  
  // Sport Program operations
  getSportProgramsBySchool(schoolId: number): Promise<SportProgram[]>;
  getSportProgramById(id: number): Promise<SportProgram | undefined>;
  getSportProgramsBySport(sport: string): Promise<SportProgram[]>;
  getSportProgramsByDivision(division: string): Promise<SportProgram[]>;
  createSportProgram(program: InsertSportProgram): Promise<SportProgram>;
  updateSportProgram(id: number, data: Partial<SportProgram>): Promise<SportProgram | undefined>;
  
  // Coaching Staff operations
  getCoachingStaffByProgram(programId: number): Promise<CoachingStaff[]>;
  getCoachingStaffById(id: number): Promise<CoachingStaff | undefined>;
  createCoachingStaff(staff: InsertCoachingStaff): Promise<CoachingStaff>;
  updateCoachingStaff(id: number, data: Partial<CoachingStaff>): Promise<CoachingStaff | undefined>;
  
  // Recruiting Contact operations
  getRecruitingContactsByProgram(programId: number): Promise<RecruitingContact[]>;
  getRecruitingContactById(id: number): Promise<RecruitingContact | undefined>;
  getRecruitingContactsByRegion(region: string): Promise<RecruitingContact[]>;
  createRecruitingContact(contact: InsertRecruitingContact): Promise<RecruitingContact>;
  updateRecruitingContact(id: number, data: Partial<RecruitingContact>): Promise<RecruitingContact | undefined>;
}

// Direct database implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    try {
      // Use PostgreSQL for session storage instead of memory store
      const PgStore = connectPgSimple(session);
      
      this.sessionStore = new PgStore({
        conString: process.env.DATABASE_URL,
        tableName: 'session', // Use the session table
        createTableIfMissing: true,
        // Added options for better reliability
        pruneSessionInterval: 60 * 15, // Prune every 15 minutes (in seconds)
        errorLog: console.error.bind(console, 'PostgreSQL session store error:')
      });
      
      console.log('PostgreSQL session store initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PostgreSQL session store, falling back to memory store:', error);
      
      // Fallback to memory store in case of connection issues
      const MemoryStoreSession = MemoryStore(session);
      this.sessionStore = new MemoryStoreSession({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
    }
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
  
  async getAllUsers(): Promise<User[]> {
    try {
      return await db.select()
        .from(users)
        .orderBy(desc(users.createdAt));
    } catch (error) {
      console.error('Database error in getAllUsers:', error);
      return [];
    }
  }
  
  async getAllAthletes(): Promise<User[]> {
    try {
      const athleteUsers = await db.select()
        .from(users)
        .where(eq(users.role, 'athlete'))
        .orderBy(desc(users.createdAt));
        
      // Also look for any athletes in athleteStarProfiles that might not be directly in users table
      const starProfiles = await db.select({
        profile: athleteStarProfiles,
        userId: athleteStarProfiles.userId
      })
      .from(athleteStarProfiles)
      .where(
        and(
          eq(athleteStarProfiles.active, true),
          sql`${athleteStarProfiles.userId} IS NOT NULL`
        )
      );
      
      // Create a set of already included user IDs
      const includedUserIds = new Set(athleteUsers.map(user => user.id));
      
      // Find additional user IDs from star profiles
      const additionalUserIds = starProfiles
        .filter(profile => profile.userId && !includedUserIds.has(profile.userId))
        .map(profile => profile.userId);
      
      // If there are additional user IDs, fetch them
      if (additionalUserIds.length > 0) {
        const additionalUsers = await db.select()
          .from(users)
          .where(inArray(users.id, additionalUserIds as number[]));
          
        // Combine the results
        return [...athleteUsers, ...additionalUsers];
      }
      
      return athleteUsers;
    } catch (error) {
      console.error('Database error in getAllAthletes:', error);
      return [];
    }
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
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }

  async getFeaturedBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    return await db.select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, true),
          eq(blogPosts.featured, true)
        )
      )
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
      .where(
        and(
          eq(blogPosts.published, true),
          eq(blogPosts.category, category)
        )
      )
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }

  async getBlogPostsByTags(tags: string[], limit: number = 10): Promise<BlogPost[]> {
    if (tags.length === 0) {
      return this.getBlogPosts(limit);
    }

    // Note: This is a simplified version. In a real-world scenario, 
    // we would use a more sophisticated query to match posts with any of the provided tags.
    return await db.select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, true),
          sql`${blogPosts.tags} && ARRAY[${tags.join(',')}]::text[]`
        )
      )
      .orderBy(desc(blogPosts.publishDate))
      .limit(limit);
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    // For a new blog post, we need to generate a slug if not provided
    if (!blogPost.slug && blogPost.title) {
      const slug = blogPost.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim(); // Remove leading and trailing spaces
      
      blogPost = {
        ...blogPost,
        slug,
        publishDate: blogPost.publishDate || new Date()
      };
    }
    
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
      .where(eq(featuredAthletes.isActive, true))
      .orderBy(desc(featuredAthletes.featuredDate))
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
      .values({
        ...featuredAthlete,
        featuredDate: featuredAthlete.featuredDate || new Date()
      })
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
      .orderBy(garCategories.order);
  }

  async getGarCategoriesBySport(sportType: string): Promise<GarCategory[]> {
    return await db.select()
      .from(garCategories)
      .where(eq(garCategories.sportType, sportType))
      .orderBy(garCategories.order);
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
      .where(eq(garSubcategories.categoryId, categoryId))
      .orderBy(garSubcategories.order);
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
      .orderBy(desc(garAthleteRatings.ratingDate));
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
      .orderBy(desc(garAthleteRatings.ratingDate));
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
      .orderBy(desc(garAthleteRatings.ratingDate))
      .limit(1);
    return rating;
  }

  // GAR Rating History operations
  async getGarRatingHistoryByUser(userId: number, limit: number = 10): Promise<GarRatingHistory[]> {
    return await db.select()
      .from(garRatingHistory)
      .where(eq(garRatingHistory.userId, userId))
      .orderBy(desc(garRatingHistory.ratingDate))
      .limit(limit);
  }

  async getLatestGarRatingHistory(userId: number): Promise<GarRatingHistory | undefined> {
    const [rating] = await db.select()
      .from(garRatingHistory)
      .where(eq(garRatingHistory.userId, userId))
      .orderBy(desc(garRatingHistory.ratingDate))
      .limit(1);
    return rating;
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

  async saveVideoAnalysis(videoId: number, analysisData: any): Promise<VideoAnalysis> {
    // First, check if an analysis already exists for this video
    const existingAnalysis = await this.getVideoAnalysisByVideoId(videoId);
    
    if (existingAnalysis) {
      // Update the existing analysis
      const [updatedAnalysis] = await db.update(videoAnalyses)
        .set({
          data: analysisData,
          updatedAt: new Date()
        })
        .where(eq(videoAnalyses.id, existingAnalysis.id))
        .returning();
      
      // Also update the video's analyzed flag
      await db.update(videos)
        .set({ analyzed: true })
        .where(eq(videos.id, videoId));
      
      return updatedAnalysis;
    } else {
      // Create a new analysis
      return await this.createVideoAnalysis({
        videoId,
        data: analysisData
      });
    }
  }

  async createVideoAnalysis(analysisData: any): Promise<VideoAnalysis> {
    const [analysis] = await db.insert(videoAnalyses)
      .values({
        videoId: analysisData.videoId,
        data: analysisData.data || {},
        garScores: analysisData.garScores || {},
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    // Also update the video's analyzed flag
    await db.update(videos)
      .set({ analyzed: true })
      .where(eq(videos.id, analysisData.videoId));
    
    return analysis;
  }

  // Combine Tour Events operations
  async getCombineTourEvents(): Promise<CombineTourEvent[]> {
    try {
      return await db.select()
        .from(combineTourEvents)
        .orderBy(combineTourEvents.startDate);
    } catch (error) {
      console.error('Database error in getCombineTourEvents:', error);
      return [];
    }
  }

  async getCombineTourEvent(id: number): Promise<CombineTourEvent | undefined> {
    try {
      const [event] = await db.select()
        .from(combineTourEvents)
        .where(eq(combineTourEvents.id, id));
      return event;
    } catch (error) {
      console.error(`Database error in getCombineTourEvent(${id}):`, error);
      return undefined;
    }
  }

  async getCombineTourEventBySlug(slug: string): Promise<CombineTourEvent | undefined> {
    try {
      const [event] = await db.select()
        .from(combineTourEvents)
        .where(eq(combineTourEvents.slug, slug));
      return event;
    } catch (error) {
      console.error(`Database error in getCombineTourEventBySlug(${slug}):`, error);
      return undefined;
    }
  }

  async getUpcomingCombineTourEvents(limit: number = 10): Promise<CombineTourEvent[]> {
    try {
      return await db.select()
        .from(combineTourEvents)
        .where(sql`${combineTourEvents.startDate} >= CURRENT_DATE`)
        .orderBy(combineTourEvents.startDate)
        .limit(limit);
    } catch (error) {
      console.error('Database error in getUpcomingCombineTourEvents:', error);
      return [];
    }
  }

  async getPastCombineTourEvents(limit: number = 10): Promise<CombineTourEvent[]> {
    try {
      return await db.select()
        .from(combineTourEvents)
        .where(sql`${combineTourEvents.endDate} < CURRENT_DATE`)
        .orderBy(desc(combineTourEvents.endDate))
        .limit(limit);
    } catch (error) {
      console.error('Database error in getPastCombineTourEvents:', error);
      return [];
    }
  }

  async getFeaturedCombineTourEvents(limit: number = 6): Promise<CombineTourEvent[]> {
    try {
      return await db.select()
        .from(combineTourEvents)
        .where(
          and(
            eq(combineTourEvents.featured, true),
            sql`${combineTourEvents.startDate} >= CURRENT_DATE`
          )
        )
        .orderBy(combineTourEvents.startDate)
        .limit(limit);
    } catch (error) {
      console.error('Database error in getFeaturedCombineTourEvents:', error);
      return [];
    }
  }

  async getCombineTourEventsByStatus(status: string, limit: number = 10): Promise<CombineTourEvent[]> {
    try {
      return await db.select()
        .from(combineTourEvents)
        .where(eq(combineTourEvents.status, status))
        .orderBy(combineTourEvents.startDate)
        .limit(limit);
    } catch (error) {
      console.error(`Database error in getCombineTourEventsByStatus(${status}):`, error);
      return [];
    }
  }

  async createCombineTourEvent(event: InsertCombineTourEvent): Promise<CombineTourEvent> {
    try {
      // Generate a slug if not provided
      if (!event.slug && event.name) {
        event = {
          ...event,
          slug: event.name
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-')
            .trim()
        };
      }
      
      const [createdEvent] = await db.insert(combineTourEvents)
        .values({
          ...event,
          createdAt: new Date(),
          updatedAt: new Date(),
          currentAttendees: 0 // Initialize with 0 attendees
        })
        .returning();
      
      return createdEvent;
    } catch (error) {
      console.error('Database error in createCombineTourEvent:', error);
      throw error;
    }
  }

  async updateCombineTourEvent(id: number, data: Partial<CombineTourEvent>): Promise<CombineTourEvent | undefined> {
    try {
      const [updatedEvent] = await db.update(combineTourEvents)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(combineTourEvents.id, id))
        .returning();
      
      return updatedEvent;
    } catch (error) {
      console.error(`Database error in updateCombineTourEvent(${id}):`, error);
      return undefined;
    }
  }

  async deleteCombineTourEvent(id: number): Promise<boolean> {
    try {
      await db.delete(combineTourEvents)
        .where(eq(combineTourEvents.id, id));
      
      return true;
    } catch (error) {
      console.error(`Database error in deleteCombineTourEvent(${id}):`, error);
      return false;
    }
  }

  // AI Coach and Player features - stub implementations
  async getAthleteProfile(userId: number): Promise<any | undefined> {
    console.log(`[STUB] Getting athlete profile for user ID: ${userId}`);
    // Return a default profile object until we implement the actual tables
    return {
      userId,
      height: 175, // Default height in cm
      weight: 70,  // Default weight in kg
      age: 16,     // Default age
      school: "High School",
      graduationYear: new Date().getFullYear() + 2,
      sportsInterest: ["basketball", "football", "track"],
      motionScore: 75
    };
  }

  async getPlayerProgress(userId: number): Promise<any | undefined> {
    console.log(`[STUB] Getting player progress for user ID: ${userId}`);
    // Return a default progress object until we implement the actual tables
    return {
      userId,
      currentLevel: 1,
      xpTotal: 0,
      xpCurrentLevel: 0,
      xpForNextLevel: 100,
      badges: [],
      achievements: [],
      lastActive: new Date(),
      focusAreas: ["Overall Fitness"]
    };
  }

  async getPlayerEquipment(userId: number): Promise<any[]> {
    console.log(`[STUB] Getting player equipment for user ID: ${userId}`);
    // Return a default equipment array until we implement the actual tables
    return [
      {
        id: 1,
        type: "shoes",
        name: "Basic Training Shoes",
        stats: { speed: 5, agility: 5 },
        equipped: true
      },
      {
        id: 2,
        type: "shirt",
        name: "Training Jersey",
        stats: { endurance: 5 },
        equipped: true
      }
    ];
  }

  async getWorkoutVerification(userId: number): Promise<any | undefined> {
    console.log(`[STUB] Getting workout verification for user ID: ${userId}`);
    // Return a default verification object until we implement the actual tables
    return {
      id: 1,
      userId,
      workoutType: "cardio",
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      endTime: new Date(),
      status: "completed",
      calories: 350,
      steps: 7500,
      distance: 5.2,
      verified: true
    };
  }

  async getWorkoutVerificationCheckpoints(verificationId: number): Promise<any[]> {
    console.log(`[STUB] Getting workout verification checkpoints for verification ID: ${verificationId}`);
    // Return default checkpoint data until we implement the actual tables
    return [
      { id: 1, verificationId, timestamp: new Date(Date.now() - 3600000 + 900000), data: { distance: 1.3, heartRate: 120 } },
      { id: 2, verificationId, timestamp: new Date(Date.now() - 3600000 + 1800000), data: { distance: 2.6, heartRate: 145 } },
      { id: 3, verificationId, timestamp: new Date(Date.now() - 3600000 + 2700000), data: { distance: 3.9, heartRate: 155 } },
      { id: 4, verificationId, timestamp: new Date(Date.now() - 3600000 + 3600000), data: { distance: 5.2, heartRate: 130 } }
    ];
  }

  async updateWorkoutVerification(verificationId: number, data: any): Promise<any> {
    console.log(`[STUB] Updating workout verification ID: ${verificationId} with data:`, data);
    // In a real implementation, we would update the workout_verifications table
    // For now, just return the updated data
    return {
      id: verificationId,
      ...data,
      updatedAt: new Date()
    };
  }

  async getWeightRoomEquipmentById(equipmentId: number): Promise<any | undefined> {
    console.log(`[STUB] Getting weight room equipment ID: ${equipmentId}`);
    // Return default equipment data until we implement the actual tables
    const equipments: Record<number, any> = {
      1: { id: 1, name: "Bench Press", type: "strength", muscleGroups: ["chest", "triceps"], difficulty: "intermediate" },
      2: { id: 2, name: "Squat Rack", type: "strength", muscleGroups: ["legs", "core"], difficulty: "intermediate" },
      3: { id: 3, name: "Pull-up Bar", type: "bodyweight", muscleGroups: ["back", "biceps"], difficulty: "beginner" }
    };
    return equipments[equipmentId];
  }

  async addXpToPlayer(userId: number, amount: number, source: string, reason: string, metadata?: any): Promise<boolean> {
    console.log(`[STUB] Adding ${amount} XP to user ID: ${userId} from ${source}: ${reason}`);
    // In a real implementation, we would update a player_progress table
    // For now just return true to indicate success
    return true;
  }

  async getSportRecommendations(userId: number): Promise<any[]> {
    console.log(`[STUB] Getting sport recommendations for user ID: ${userId}`);
    // Return default recommendations until we implement the actual system
    return [
      {
        sportType: "basketball",
        matchScore: 85,
        reasons: ["height advantage", "coordination", "speed"],
        positions: ["power forward", "center"],
        stats: { height: "good", agility: "moderate", strength: "moderate" }
      },
      {
        sportType: "swimming",
        matchScore: 78,
        reasons: ["aerobic capacity", "upper body strength"],
        positions: ["freestyle", "butterfly"],
        stats: { endurance: "excellent", technique: "developing", strength: "good" }
      },
      {
        sportType: "soccer",
        matchScore: 72,
        reasons: ["speed", "teamwork", "strategic thinking"],
        positions: ["midfielder", "winger"],
        stats: { speed: "good", teamwork: "excellent", ball_control: "moderate" }
      }
    ];
  }

  // Skill Tree operations
  async getSkillTreeNodes(sportType?: string, position?: string): Promise<SkillTreeNode[]> {
    try {
      let query = db.select().from(skillTreeNodes).where(eq(skillTreeNodes.isActive, true));
      
      if (sportType) {
        query = query.where(eq(skillTreeNodes.sportType, sportType));
      }
      
      if (position) {
        query = query.where(eq(skillTreeNodes.position, position));
      }
      
      return await query.orderBy(skillTreeNodes.level, skillTreeNodes.sortOrder);
    } catch (error) {
      console.error('Error fetching skill tree nodes:', error);
      return [];
    }
  }

  async getSkillTreeNode(id: number): Promise<SkillTreeNode | undefined> {
    try {
      const [node] = await db.select()
        .from(skillTreeNodes)
        .where(eq(skillTreeNodes.id, id));
      return node;
    } catch (error) {
      console.error(`Error fetching skill tree node with ID ${id}:`, error);
      return undefined;
    }
  }

  async getSkillTreeNodesByLevel(level: number): Promise<SkillTreeNode[]> {
    try {
      return await db.select()
        .from(skillTreeNodes)
        .where(
          and(
            eq(skillTreeNodes.level, level),
            eq(skillTreeNodes.isActive, true)
          )
        )
        .orderBy(skillTreeNodes.sortOrder);
    } catch (error) {
      console.error(`Error fetching skill tree nodes for level ${level}:`, error);
      return [];
    }
  }

  async createSkillTreeNode(node: InsertSkillTreeNode): Promise<SkillTreeNode> {
    try {
      const [createdNode] = await db.insert(skillTreeNodes).values(node).returning();
      return createdNode;
    } catch (error) {
      console.error('Error creating skill tree node:', error);
      throw error;
    }
  }

  async updateSkillTreeNode(id: number, data: Partial<SkillTreeNode>): Promise<SkillTreeNode | undefined> {
    try {
      const [updatedNode] = await db.update(skillTreeNodes)
        .set(data)
        .where(eq(skillTreeNodes.id, id))
        .returning();
      return updatedNode;
    } catch (error) {
      console.error(`Error updating skill tree node with ID ${id}:`, error);
      return undefined;
    }
  }

  // Skill Tree Relationship operations
  async getSkillTreeRelationships(): Promise<SkillTreeRelationship[]> {
    try {
      return await db.select().from(skillTreeRelationships);
    } catch (error) {
      console.error('Error fetching skill tree relationships:', error);
      return [];
    }
  }

  async getChildSkillNodes(parentNodeId: number): Promise<SkillTreeNode[]> {
    try {
      const relationships = await db.select({
        childId: skillTreeRelationships.childId
      })
      .from(skillTreeRelationships)
      .where(eq(skillTreeRelationships.parentId, parentNodeId));
      
      if (relationships.length === 0) {
        return [];
      }
      
      const childIds = relationships.map(r => r.childId);
      
      return await db.select()
        .from(skillTreeNodes)
        .where(
          and(
            inArray(skillTreeNodes.id, childIds),
            eq(skillTreeNodes.isActive, true)
          )
        )
        .orderBy(skillTreeNodes.level, skillTreeNodes.sortOrder);
    } catch (error) {
      console.error(`Error fetching child skill nodes for parent ID ${parentNodeId}:`, error);
      return [];
    }
  }

  async getParentSkillNodes(childNodeId: number): Promise<SkillTreeNode[]> {
    try {
      const relationships = await db.select({
        parentId: skillTreeRelationships.parentId
      })
      .from(skillTreeRelationships)
      .where(eq(skillTreeRelationships.childId, childNodeId));
      
      if (relationships.length === 0) {
        return [];
      }
      
      const parentIds = relationships.map(r => r.parentId);
      
      return await db.select()
        .from(skillTreeNodes)
        .where(
          and(
            inArray(skillTreeNodes.id, parentIds),
            eq(skillTreeNodes.isActive, true)
          )
        )
        .orderBy(skillTreeNodes.level, skillTreeNodes.sortOrder);
    } catch (error) {
      console.error(`Error fetching parent skill nodes for child ID ${childNodeId}:`, error);
      return [];
    }
  }

  async createSkillTreeRelationship(relationship: InsertSkillTreeRelationship): Promise<SkillTreeRelationship> {
    try {
      const [createdRelationship] = await db.insert(skillTreeRelationships).values(relationship).returning();
      return createdRelationship;
    } catch (error) {
      console.error('Error creating skill tree relationship:', error);
      throw error;
    }
  }

  // Training Drills operations
  async getTrainingDrills(sportType?: string, position?: string, category?: string): Promise<TrainingDrill[]> {
    try {
      let query = db.select().from(trainingDrills);
      
      if (sportType) {
        query = query.where(eq(trainingDrills.sportType, sportType));
      }
      
      if (position) {
        query = query.where(eq(trainingDrills.position, position));
      }
      
      if (category) {
        query = query.where(eq(trainingDrills.category, category));
      }
      
      return await query;
    } catch (error) {
      console.error('Error fetching training drills:', error);
      return [];
    }
  }

  async getTrainingDrill(id: number): Promise<TrainingDrill | undefined> {
    try {
      const [drill] = await db.select()
        .from(trainingDrills)
        .where(eq(trainingDrills.id, id));
      return drill;
    } catch (error) {
      console.error(`Error fetching training drill with ID ${id}:`, error);
      return undefined;
    }
  }

  async getTrainingDrillsBySkill(skillNodeId: number): Promise<TrainingDrill[]> {
    try {
      return await db.select()
        .from(trainingDrills)
        .where(eq(trainingDrills.skillNodeId, skillNodeId));
    } catch (error) {
      console.error(`Error fetching training drills for skill node ID ${skillNodeId}:`, error);
      return [];
    }
  }

  async createTrainingDrill(drill: InsertTrainingDrill): Promise<TrainingDrill> {
    try {
      const [createdDrill] = await db.insert(trainingDrills).values(drill).returning();
      return createdDrill;
    } catch (error) {
      console.error('Error creating training drill:', error);
      throw error;
    }
  }

  async updateTrainingDrill(id: number, data: Partial<TrainingDrill>): Promise<TrainingDrill | undefined> {
    try {
      const [updatedDrill] = await db.update(trainingDrills)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(trainingDrills.id, id))
        .returning();
      return updatedDrill;
    } catch (error) {
      console.error(`Error updating training drill with ID ${id}:`, error);
      return undefined;
    }
  }

  // User Skill Progress operations
  async getUserSkills(userId: number): Promise<Skill[]> {
    try {
      return await db.select().from(skills).where(eq(skills.userId, userId));
    } catch (error) {
      console.error(`Error fetching skills for user ID ${userId}:`, error);
      return [];
    }
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    try {
      const [skill] = await db.select()
        .from(skills)
        .where(eq(skills.id, id));
      return skill;
    } catch (error) {
      console.error(`Error fetching skill with ID ${id}:`, error);
      return undefined;
    }
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    try {
      const [createdSkill] = await db.insert(skills).values(skill).returning();
      return createdSkill;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  }

  async updateSkill(id: number, data: Partial<Skill>): Promise<Skill | undefined> {
    try {
      const [updatedSkill] = await db.update(skills)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(skills.id, id))
        .returning();
      return updatedSkill;
    } catch (error) {
      console.error(`Error updating skill with ID ${id}:`, error);
      return undefined;
    }
  }

  // User Drill Progress operations
  async getUserDrillProgress(userId: number): Promise<UserDrillProgress[]> {
    try {
      return await db.select().from(userDrillProgress).where(eq(userDrillProgress.userId, userId));
    } catch (error) {
      console.error(`Error fetching user drill progress for user ID ${userId}:`, error);
      return [];
    }
  }

  async getUserDrillProgressByDrill(userId: number, drillId: number): Promise<UserDrillProgress | undefined> {
    try {
      const [progress] = await db.select()
        .from(userDrillProgress)
        .where(
          and(
            eq(userDrillProgress.userId, userId),
            eq(userDrillProgress.drillId, drillId)
          )
        );
      return progress;
    } catch (error) {
      console.error(`Error fetching user drill progress for user ID ${userId} and drill ID ${drillId}:`, error);
      return undefined;
    }
  }

  async createUserDrillProgress(progress: InsertUserDrillProgress): Promise<UserDrillProgress> {
    try {
      const [createdProgress] = await db.insert(userDrillProgress).values(progress).returning();
      return createdProgress;
    } catch (error) {
      console.error('Error creating user drill progress:', error);
      throw error;
    }
  }

  async updateUserDrillProgress(id: number, data: Partial<UserDrillProgress>): Promise<UserDrillProgress | undefined> {
    try {
      const [updatedProgress] = await db.update(userDrillProgress)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(userDrillProgress.id, id))
        .returning();
      return updatedProgress;
    } catch (error) {
      console.error(`Error updating user drill progress with ID ${id}:`, error);
      return undefined;
    }
  }

  // NCAA Schools database operations
  async getNcaaSchools(limit: number = 100): Promise<NcaaSchool[]> {
    try {
      return await db.select()
        .from(ncaaSchools)
        .orderBy(ncaaSchools.name)
        .limit(limit);
    } catch (error) {
      console.error('Database error in getNcaaSchools:', error);
      return [];
    }
  }

  async getNcaaSchoolById(id: number): Promise<NcaaSchool | undefined> {
    try {
      const [school] = await db.select()
        .from(ncaaSchools)
        .where(eq(ncaaSchools.id, id));
      return school;
    } catch (error) {
      console.error(`Database error in getNcaaSchoolById(${id}):`, error);
      return undefined;
    }
  }

  async getNcaaSchoolsByDivision(division: string): Promise<NcaaSchool[]> {
    try {
      return await db.select()
        .from(ncaaSchools)
        .where(eq(ncaaSchools.division, division))
        .orderBy(ncaaSchools.name);
    } catch (error) {
      console.error(`Database error in getNcaaSchoolsByDivision(${division}):`, error);
      return [];
    }
  }

  async getNcaaSchoolsByState(state: string): Promise<NcaaSchool[]> {
    try {
      return await db.select()
        .from(ncaaSchools)
        .where(eq(ncaaSchools.state, state))
        .orderBy(ncaaSchools.name);
    } catch (error) {
      console.error(`Database error in getNcaaSchoolsByState(${state}):`, error);
      return [];
    }
  }

  async getNcaaSchoolsByConference(conference: string): Promise<NcaaSchool[]> {
    try {
      return await db.select()
        .from(ncaaSchools)
        .where(eq(ncaaSchools.conference, conference))
        .orderBy(ncaaSchools.name);
    } catch (error) {
      console.error(`Database error in getNcaaSchoolsByConference(${conference}):`, error);
      return [];
    }
  }

  async createNcaaSchool(school: InsertNcaaSchool): Promise<NcaaSchool> {
    try {
      const [createdSchool] = await db.insert(ncaaSchools)
        .values(school)
        .returning();
      return createdSchool;
    } catch (error) {
      console.error('Database error in createNcaaSchool:', error);
      throw error;
    }
  }

  async updateNcaaSchool(id: number, data: Partial<NcaaSchool>): Promise<NcaaSchool | undefined> {
    try {
      const [updatedSchool] = await db.update(ncaaSchools)
        .set({
          ...data,
          lastUpdated: new Date()
        })
        .where(eq(ncaaSchools.id, id))
        .returning();
      return updatedSchool;
    } catch (error) {
      console.error(`Database error in updateNcaaSchool(${id}):`, error);
      return undefined;
    }
  }

  // Athletic Department operations
  async getAthleticDepartmentsBySchool(schoolId: number): Promise<AthleticDepartment[]> {
    try {
      return await db.select()
        .from(athleticDepartments)
        .where(eq(athleticDepartments.schoolId, schoolId));
    } catch (error) {
      console.error(`Database error in getAthleticDepartmentsBySchool(${schoolId}):`, error);
      return [];
    }
  }

  async getAthleticDepartmentById(id: number): Promise<AthleticDepartment | undefined> {
    try {
      const [department] = await db.select()
        .from(athleticDepartments)
        .where(eq(athleticDepartments.id, id));
      return department;
    } catch (error) {
      console.error(`Database error in getAthleticDepartmentById(${id}):`, error);
      return undefined;
    }
  }

  async createAthleticDepartment(department: InsertAthleticDepartment): Promise<AthleticDepartment> {
    try {
      const [createdDepartment] = await db.insert(athleticDepartments)
        .values({
          ...department,
          lastUpdated: new Date()
        })
        .returning();
      return createdDepartment;
    } catch (error) {
      console.error('Database error in createAthleticDepartment:', error);
      throw error;
    }
  }

  async updateAthleticDepartment(id: number, data: Partial<AthleticDepartment>): Promise<AthleticDepartment | undefined> {
    try {
      const [updatedDepartment] = await db.update(athleticDepartments)
        .set({
          ...data,
          lastUpdated: new Date()
        })
        .where(eq(athleticDepartments.id, id))
        .returning();
      return updatedDepartment;
    } catch (error) {
      console.error(`Database error in updateAthleticDepartment(${id}):`, error);
      return undefined;
    }
  }

  // Sport Program operations
  async getSportProgramsBySchool(schoolId: number): Promise<SportProgram[]> {
    try {
      return await db.select()
        .from(sportPrograms)
        .where(eq(sportPrograms.schoolId, schoolId));
    } catch (error) {
      console.error(`Database error in getSportProgramsBySchool(${schoolId}):`, error);
      return [];
    }
  }

  async getSportProgramById(id: number): Promise<SportProgram | undefined> {
    try {
      const [program] = await db.select()
        .from(sportPrograms)
        .where(eq(sportPrograms.id, id));
      return program;
    } catch (error) {
      console.error(`Database error in getSportProgramById(${id}):`, error);
      return undefined;
    }
  }

  async getSportProgramsBySport(sport: string): Promise<SportProgram[]> {
    try {
      return await db.select()
        .from(sportPrograms)
        .where(eq(sportPrograms.sport, sport));
    } catch (error) {
      console.error(`Database error in getSportProgramsBySport(${sport}):`, error);
      return [];
    }
  }

  async getSportProgramsByDivision(division: string): Promise<SportProgram[]> {
    try {
      return await db.select()
        .from(sportPrograms)
        .where(eq(sportPrograms.division, division));
    } catch (error) {
      console.error(`Database error in getSportProgramsByDivision(${division}):`, error);
      return [];
    }
  }

  async createSportProgram(program: InsertSportProgram): Promise<SportProgram> {
    try {
      const [createdProgram] = await db.insert(sportPrograms)
        .values({
          ...program,
          lastUpdated: new Date()
        })
        .returning();
      return createdProgram;
    } catch (error) {
      console.error('Database error in createSportProgram:', error);
      throw error;
    }
  }

  async updateSportProgram(id: number, data: Partial<SportProgram>): Promise<SportProgram | undefined> {
    try {
      const [updatedProgram] = await db.update(sportPrograms)
        .set({
          ...data,
          lastUpdated: new Date()
        })
        .where(eq(sportPrograms.id, id))
        .returning();
      return updatedProgram;
    } catch (error) {
      console.error(`Database error in updateSportProgram(${id}):`, error);
      return undefined;
    }
  }

  // Coaching Staff operations
  async getCoachingStaffByProgram(programId: number): Promise<CoachingStaff[]> {
    try {
      return await db.select()
        .from(coachingStaff)
        .where(eq(coachingStaff.sportProgramId, programId));
    } catch (error) {
      console.error(`Database error in getCoachingStaffByProgram(${programId}):`, error);
      return [];
    }
  }

  async getCoachingStaffById(id: number): Promise<CoachingStaff | undefined> {
    try {
      const [staff] = await db.select()
        .from(coachingStaff)
        .where(eq(coachingStaff.id, id));
      return staff;
    } catch (error) {
      console.error(`Database error in getCoachingStaffById(${id}):`, error);
      return undefined;
    }
  }

  async createCoachingStaff(staff: InsertCoachingStaff): Promise<CoachingStaff> {
    try {
      const [createdStaff] = await db.insert(coachingStaff)
        .values({
          ...staff,
          lastUpdated: new Date()
        })
        .returning();
      return createdStaff;
    } catch (error) {
      console.error('Database error in createCoachingStaff:', error);
      throw error;
    }
  }

  async updateCoachingStaff(id: number, data: Partial<CoachingStaff>): Promise<CoachingStaff | undefined> {
    try {
      const [updatedStaff] = await db.update(coachingStaff)
        .set({
          ...data,
          lastUpdated: new Date()
        })
        .where(eq(coachingStaff.id, id))
        .returning();
      return updatedStaff;
    } catch (error) {
      console.error(`Database error in updateCoachingStaff(${id}):`, error);
      return undefined;
    }
  }

  // Recruiting Contact operations
  async getRecruitingContactsByProgram(programId: number): Promise<RecruitingContact[]> {
    try {
      return await db.select()
        .from(recruitingContacts)
        .where(eq(recruitingContacts.sportProgramId, programId));
    } catch (error) {
      console.error(`Database error in getRecruitingContactsByProgram(${programId}):`, error);
      return [];
    }
  }

  async getRecruitingContactById(id: number): Promise<RecruitingContact | undefined> {
    try {
      const [contact] = await db.select()
        .from(recruitingContacts)
        .where(eq(recruitingContacts.id, id));
      return contact;
    } catch (error) {
      console.error(`Database error in getRecruitingContactById(${id}):`, error);
      return undefined;
    }
  }

  async getRecruitingContactsByRegion(region: string): Promise<RecruitingContact[]> {
    try {
      return await db.select()
        .from(recruitingContacts)
        .where(eq(recruitingContacts.region, region));
    } catch (error) {
      console.error(`Database error in getRecruitingContactsByRegion(${region}):`, error);
      return [];
    }
  }

  async createRecruitingContact(contact: InsertRecruitingContact): Promise<RecruitingContact> {
    try {
      const [createdContact] = await db.insert(recruitingContacts)
        .values({
          ...contact,
          lastUpdated: new Date()
        })
        .returning();
      return createdContact;
    } catch (error) {
      console.error('Database error in createRecruitingContact:', error);
      throw error;
    }
  }

  async updateRecruitingContact(id: number, data: Partial<RecruitingContact>): Promise<RecruitingContact | undefined> {
    try {
      const [updatedContact] = await db.update(recruitingContacts)
        .set({
          ...data,
          lastUpdated: new Date()
        })
        .where(eq(recruitingContacts.id, id))
        .returning();
      return updatedContact;
    } catch (error) {
      console.error(`Database error in updateRecruitingContact(${id}):`, error);
      return undefined;
    }
  }

  // CyberShield Security - User token operations
  async getUserTokenByToken(token: string): Promise<UserToken | undefined> {
    try {
      const [userToken] = await db.select()
        .from(userTokens)
        .where(eq(userTokens.token, token));
      return userToken;
    } catch (error) {
      console.error('Error retrieving user token:', error);
      return undefined;
    }
  }

  async getUserTokens(userId: number): Promise<UserToken[]> {
    try {
      return await db.select()
        .from(userTokens)
        .where(eq(userTokens.userId, userId))
        .orderBy(desc(userTokens.createdAt));
    } catch (error) {
      console.error(`Error retrieving tokens for user ID ${userId}:`, error);
      return [];
    }
  }

  async getUserActiveTokens(userId: number): Promise<UserToken[]> {
    try {
      return await db.select()
        .from(userTokens)
        .where(
          and(
            eq(userTokens.userId, userId),
            eq(userTokens.revoked, false),
            sql`${userTokens.expiresAt} > NOW()`
          )
        )
        .orderBy(desc(userTokens.createdAt));
    } catch (error) {
      console.error(`Error retrieving active tokens for user ID ${userId}:`, error);
      return [];
    }
  }

  async createUserToken(token: InsertUserToken): Promise<UserToken> {
    try {
      const [createdToken] = await db.insert(userTokens)
        .values({
          ...token,
          createdAt: new Date(),
          revoked: false
        })
        .returning();
      return createdToken;
    } catch (error) {
      console.error('Error creating user token:', error);
      throw error;
    }
  }

  async revokeUserToken(id: number): Promise<UserToken | undefined> {
    try {
      const [revokedToken] = await db.update(userTokens)
        .set({
          revoked: true,
          revokedAt: new Date()
        })
        .where(eq(userTokens.id, id))
        .returning();
      return revokedToken;
    } catch (error) {
      console.error(`Error revoking token ID ${id}:`, error);
      return undefined;
    }
  }

  async revokeAllUserTokens(userId: number): Promise<boolean> {
    try {
      await db.update(userTokens)
        .set({
          revoked: true,
          revokedAt: new Date()
        })
        .where(
          and(
            eq(userTokens.userId, userId),
            eq(userTokens.revoked, false)
          )
        );
      return true;
    } catch (error) {
      console.error(`Error revoking all tokens for user ID ${userId}:`, error);
      return false;
    }
  }

  async updateUserTokenLastUsed(id: number): Promise<UserToken | undefined> {
    try {
      const [updatedToken] = await db.update(userTokens)
        .set({
          lastUsedAt: new Date()
        })
        .where(eq(userTokens.id, id))
        .returning();
      return updatedToken;
    } catch (error) {
      console.error(`Error updating last used timestamp for token ID ${id}:`, error);
      return undefined;
    }
  }

  // Get latest blog post
  async getLatestBlogPost(): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select()
        .from(blogPosts)
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.publishDate))
        .limit(1);
      return post;
    } catch (error) {
      console.error('Error fetching latest blog post:', error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();