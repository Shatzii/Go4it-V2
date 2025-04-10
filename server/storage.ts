import * as schema from "@shared/schema";
import { 
  users, type User, type InsertUser,
  videos, type Video, type InsertVideo,
  videoAnalyses, type VideoAnalysis,
  videoHighlights, type VideoHighlight, type InsertVideoHighlight,
  highlightGeneratorConfigs, type HighlightGeneratorConfig, type InsertHighlightGeneratorConfig,
  apiKeys, type ApiKey,
  contentBlocks, type ContentBlock, type InsertContentBlock,
  blogPosts, type BlogPost, type InsertBlogPost,
  featuredAthletes, type FeaturedAthlete, type InsertFeaturedAthlete,
  garCategories, type GarCategory,
  garSubcategories, type GarSubcategory,
  garAthleteRatings, type GarAthleteRating,
  garRatingHistory, type GarRatingHistory,
  combineTourEvents, type CombineTourEvent, type InsertCombineTourEvent,
  registrations, type Registration, type InsertRegistration,
  payments, type Payment, type InsertPayment,
  skillTreeNodes, type SkillTreeNode, type InsertSkillTreeNode,
  skillTreeRelationships, type SkillTreeRelationship, type InsertSkillTreeRelationship,
  trainingDrills, type TrainingDrill, type InsertTrainingDrill,
  skills, type Skill, type InsertSkill,
  userDrillProgress, type UserDrillProgress, type InsertUserDrillProgress,
  userTokens, type UserToken, type InsertUserToken,
  ncaaSchools, type NcaaSchool, type InsertNcaaSchool,
  ncaaEligibility, type NcaaEligibility, type InsertNcaaEligibility,
  athleticDepartments, type AthleticDepartment, type InsertAthleticDepartment,
  sportPrograms, type SportProgram, type InsertSportProgram,
  coachingStaff, type CoachingStaff, type InsertCoachingStaff,
  recruitingContacts, type RecruitingContact, type InsertRecruitingContact,
  spotlightProfiles, type SpotlightProfile, type InsertSpotlightProfile
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import session from "express-session";
import MemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

export interface IStorage {
  // Session store
  sessionStore: any;
  
  // Spotlight Profile operations
  getSpotlightProfiles(limit?: number): Promise<SpotlightProfile[]>;
  getSpotlightProfilesByUser(userId: number): Promise<SpotlightProfile[]>;
  getSpotlightProfile(id: number): Promise<SpotlightProfile | undefined>;
  getFeaturedSpotlightProfiles(limit?: number): Promise<SpotlightProfile[]>;
  getTrendingSpotlightProfiles(limit?: number): Promise<SpotlightProfile[]>;
  getRecommendedSpotlightProfiles(userId: number, limit?: number): Promise<SpotlightProfile[]>;
  createSpotlightProfile(profile: InsertSpotlightProfile): Promise<SpotlightProfile>;
  updateSpotlightProfile(id: number, data: Partial<SpotlightProfile>): Promise<SpotlightProfile | undefined>;
  deleteSpotlightProfile(id: number): Promise<boolean>;

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
  saveApiKey(apiKeyData: { keyType: string; keyValue: string; isActive: boolean }): Promise<ApiKey>;
  getApiKeyStatus(): Promise<Record<string, boolean>>;
  
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
  
  // Registration operations
  getRegistrations(): Promise<Registration[]>;
  getRegistrationsByEvent(eventId: number): Promise<Registration[]>;
  getRegistrationsByUser(userId: number): Promise<Registration[]>;
  getRegistration(id: number): Promise<Registration | undefined>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  updateRegistration(id: number, data: Partial<Registration>): Promise<Registration | undefined>;
  deleteRegistration(id: number): Promise<boolean>;
  
  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPaymentsByRegistration(registrationId: number): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, data: Partial<Payment>): Promise<Payment | undefined>;
  
  // AI Coach and Player features - stubs for future implementation
  getAthleteProfile(userId: number): Promise<any | undefined>;
  getPlayerProgress(userId: number): Promise<any | undefined>;
  getPlayerEquipment(userId: number): Promise<any[]>;
  getWeightRoomEquipmentById(equipmentId: number): Promise<any | undefined>;
  addXpToPlayer(userId: number, amount: number, source: string, reason: string, metadata?: any): Promise<boolean>;
  getSportRecommendations(userId: number): Promise<any[]>;
  
  // Star Path and Workout Verification
  getAthleteStarPath(userId: number): Promise<AthleteStarPath | undefined>;
  createAthleteStarPath(data: InsertAthleteStarPath): Promise<AthleteStarPath>;
  updateAthleteStarPath(userId: number, data: Partial<AthleteStarPath>): Promise<AthleteStarPath>;
  getWorkoutVerification(id: number): Promise<WorkoutVerification | undefined>;
  getWorkoutVerifications(userId: number, limit?: number): Promise<WorkoutVerification[]>;
  getPendingWorkoutVerifications(userId: number): Promise<WorkoutVerification[]>;
  createWorkoutVerification(data: InsertWorkoutVerification): Promise<WorkoutVerification>;
  updateWorkoutVerification(id: number, data: Partial<WorkoutVerification>): Promise<WorkoutVerification>;
  verifyWorkout(id: number, aiScore: number, formQuality: number, repAccuracy: number, xpEarned: number): Promise<WorkoutVerification>;
  getWorkoutVerificationCheckpoints(workoutVerificationId: number): Promise<WorkoutVerificationCheckpoint[]>;
  createWorkoutVerificationCheckpoint(data: InsertWorkoutVerificationCheckpoint): Promise<WorkoutVerificationCheckpoint>;
  updateWorkoutVerificationCheckpoint(id: number, data: Partial<WorkoutVerificationCheckpoint>): Promise<WorkoutVerificationCheckpoint>;
  
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
  
  // NCAA Eligibility operations
  getNcaaEligibility(userId: number): Promise<NcaaEligibility | undefined>;
  createNcaaEligibility(eligibility: InsertNcaaEligibility): Promise<NcaaEligibility>;
  updateNcaaEligibility(id: number, data: Partial<NcaaEligibility>): Promise<NcaaEligibility | undefined>;
  
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

  // Registration operations
  getRegistrations(): Promise<Registration[]>;
  getRegistrationsByEvent(eventId: number): Promise<Registration[]>;
  getRegistrationsByUser(userId: number): Promise<Registration[]>;
  getRegistration(id: number): Promise<Registration | undefined>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  updateRegistration(id: number, data: Partial<Registration>): Promise<Registration | undefined>;
  deleteRegistration(id: number): Promise<boolean>;

  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPaymentsByRegistration(registrationId: number): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, data: Partial<Payment>): Promise<Payment | undefined>;
  
  // Athlete Star Profile operations
  getAthleteStarProfile(userId: number): Promise<any | undefined>;
  getAllAthleteStarProfiles(): Promise<any[]>;
  getActiveAthleteStarProfiles(): Promise<any[]>;
  createAthleteStarProfile(profile: any): Promise<any>;
  updateAthleteStarProfile(userId: number, data: any): Promise<any | undefined>;
  
  // Skill Tree operations
  getSkillTreeNodes(sportType?: string, position?: string): Promise<SkillTreeNode[]>;
  getSkillTreeNode(id: number): Promise<SkillTreeNode | undefined>;
  getSkillTreeRelationships(): Promise<SkillTreeRelationship[]>;
  getUserSkills(userId: number): Promise<Skill[]>;
  getUserSkillsByNodeIds(userId: number, nodeIds: number[]): Promise<Skill[]>;
  getUserSkillByNodeId(userId: number, nodeId: number): Promise<Skill | undefined>;
  updateUserSkill(userId: number, skillNodeId: number, data: Partial<Skill>): Promise<Skill>;
  getTrainingDrillsBySkillNode(skillNodeId: number): Promise<TrainingDrill[]>;
  getTrainingDrill(id: number): Promise<TrainingDrill | undefined>;
  createTrainingDrill(drill: Partial<InsertTrainingDrill>): Promise<TrainingDrill>;
  createDrillCompletion(data: InsertUserDrillProgress): Promise<UserDrillProgress>;
}

// Direct database implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    try {
      // Use PostgreSQL for session storage instead of memory store
      const PgStore = connectPgSimple(session);
      
      this.sessionStore = new PgStore({
        pool: pool, // Use the pool from db.ts
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
      // This query retrieves all users in the system for admin access
      const userList = await db.select().from(users).orderBy(desc(users.createdAt));
      console.log(`Retrieved ${userList.length} users for admin dashboard`);
      return userList;
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
  
  async getAllVideoHighlights(limit: number = 50, sportType?: string): Promise<VideoHighlight[]> {
    let query = db.select().from(videoHighlights);
    
    // Add sport type filter if provided
    if (sportType) {
      query = query.where(eq(videoHighlights.sportType, sportType));
    }
    
    // Get highlights with status "ready" if available
    query = query.where(eq(videoHighlights.status, "ready"));
    
    // Order by newest first
    query = query.orderBy(desc(videoHighlights.createdAt));
    
    // Limit results
    query = query.limit(limit);
    
    return await query;
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
  
  // Athlete Star Profile operations
  async getAthleteStarProfile(userId: number): Promise<AthleteStarProfile | undefined> {
    try {
      const [profile] = await db.select()
        .from(athleteStarProfiles)
        .where(eq(athleteStarProfiles.userId, userId));
      return profile;
    } catch (error) {
      console.error(`Error fetching athlete star profile for user ${userId}:`, error);
      return undefined;
    }
  }
  
  async getAllAthleteStarProfiles(): Promise<AthleteStarProfile[]> {
    try {
      return await db.select()
        .from(athleteStarProfiles)
        .orderBy(athleteStarProfiles.createdAt);
    } catch (error) {
      console.error('Error fetching all athlete star profiles:', error);
      return [];
    }
  }
  
  async getActiveAthleteStarProfiles(): Promise<AthleteStarProfile[]> {
    try {
      return await db.select()
        .from(athleteStarProfiles)
        .where(eq(athleteStarProfiles.active, true))
        .orderBy(athleteStarProfiles.createdAt);
    } catch (error) {
      console.error('Error fetching active athlete star profiles:', error);
      return [];
    }
  }
  
  async createAthleteStarProfile(profile: InsertAthleteStarProfile): Promise<AthleteStarProfile> {
    try {
      const [createdProfile] = await db.insert(athleteStarProfiles)
        .values(profile)
        .returning();
      return createdProfile;
    } catch (error) {
      console.error('Error creating athlete star profile:', error);
      throw error;
    }
  }
  
  async updateAthleteStarProfile(userId: number, data: Partial<AthleteStarProfile>): Promise<AthleteStarProfile | undefined> {
    try {
      const [updatedProfile] = await db.update(athleteStarProfiles)
        .set(data)
        .where(eq(athleteStarProfiles.userId, userId))
        .returning();
      return updatedProfile;
    } catch (error) {
      console.error(`Error updating athlete star profile for user ${userId}:`, error);
      return undefined;
    }
  }
  
  // Spotlight Profile operations
  async getSpotlightProfiles(limit: number = 10): Promise<SpotlightProfile[]> {
    try {
      return await db.select()
        .from(spotlightProfiles)
        .orderBy(desc(spotlightProfiles.createdAt))
        .limit(limit);
    } catch (error) {
      console.error('Error fetching spotlight profiles:', error);
      return [];
    }
  }

  async getSpotlightProfilesByUser(userId: number): Promise<SpotlightProfile[]> {
    try {
      return await db.select()
        .from(spotlightProfiles)
        .where(eq(spotlightProfiles.userId, userId))
        .orderBy(desc(spotlightProfiles.createdAt));
    } catch (error) {
      console.error(`Error fetching spotlight profiles for user ${userId}:`, error);
      return [];
    }
  }

  async getSpotlightProfile(id: number): Promise<SpotlightProfile | undefined> {
    try {
      const [profile] = await db.select()
        .from(spotlightProfiles)
        .where(eq(spotlightProfiles.id, id));
      return profile;
    } catch (error) {
      console.error(`Error fetching spotlight profile with ID ${id}:`, error);
      return undefined;
    }
  }

  async getFeaturedSpotlightProfiles(limit: number = 6): Promise<SpotlightProfile[]> {
    try {
      return await db.select()
        .from(spotlightProfiles)
        .where(eq(spotlightProfiles.featured, true))
        .orderBy(desc(spotlightProfiles.createdAt))
        .limit(limit);
    } catch (error) {
      console.error('Error fetching featured spotlight profiles:', error);
      return [];
    }
  }

  async getTrendingSpotlightProfiles(limit: number = 6): Promise<SpotlightProfile[]> {
    try {
      return await db.select()
        .from(spotlightProfiles)
        .where(eq(spotlightProfiles.active, true))
        .orderBy(desc(spotlightProfiles.views))
        .limit(limit);
    } catch (error) {
      console.error('Error fetching trending spotlight profiles:', error);
      return [];
    }
  }

  async getRecommendedSpotlightProfiles(userId: number, limit: number = 6): Promise<SpotlightProfile[]> {
    try {
      // Get user's profile to find similar athletes by sport or position
      const [userProfile] = await db.select()
        .from(spotlightProfiles)
        .where(eq(spotlightProfiles.userId, userId));
      
      if (!userProfile) {
        // If user doesn't have a profile, return trending profiles
        return this.getTrendingSpotlightProfiles(limit);
      }
      
      // Find profiles with similar sport or position
      return await db.select()
        .from(spotlightProfiles)
        .where(
          and(
            eq(spotlightProfiles.active, true),
            sql`${spotlightProfiles.userId} != ${userId}`, // Not the user's own profile
            or(
              eq(spotlightProfiles.sport, userProfile.sport),
              eq(spotlightProfiles.position, userProfile.position)
            )
          )
        )
        .orderBy(desc(spotlightProfiles.createdAt))
        .limit(limit);
    } catch (error) {
      console.error(`Error fetching recommended spotlight profiles for user ${userId}:`, error);
      return [];
    }
  }

  async createSpotlightProfile(profile: InsertSpotlightProfile): Promise<SpotlightProfile> {
    try {
      const [createdProfile] = await db.insert(spotlightProfiles)
        .values({
          ...profile,
          createdAt: new Date(),
          updatedAt: new Date(),
          views: 0,
          active: true,
          featured: false
        })
        .returning();
      
      return createdProfile;
    } catch (error) {
      console.error('Error creating spotlight profile:', error);
      throw error;
    }
  }

  async updateSpotlightProfile(id: number, data: Partial<SpotlightProfile>): Promise<SpotlightProfile | undefined> {
    try {
      const [updatedProfile] = await db.update(spotlightProfiles)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(spotlightProfiles.id, id))
        .returning();
      
      return updatedProfile;
    } catch (error) {
      console.error(`Error updating spotlight profile with ID ${id}:`, error);
      return undefined;
    }
  }

  async deleteSpotlightProfile(id: number): Promise<boolean> {
    try {
      await db.delete(spotlightProfiles)
        .where(eq(spotlightProfiles.id, id));
      
      return true;
    } catch (error) {
      console.error(`Error deleting spotlight profile with ID ${id}:`, error);
      return false;
    }
  }

  // API Key operations
  async getAllActiveApiKeys(): Promise<ApiKey[]> {
    try {
      return await db.select()
        .from(apiKeys)
        .where(eq(apiKeys.is_active, true));
    } catch (error) {
      console.error('Database error in getAllActiveApiKeys:', error);
      return [];
    }
  }
  
  // Save API key
  async saveApiKey(apiKeyData: { keyType: string; keyValue: string; isActive: boolean }): Promise<ApiKey> {
    try {
      // Check if we already have a key of this type
      const [existingKey] = await db.select()
        .from(apiKeys)
        .where(eq(apiKeys.key_type, apiKeyData.keyType))
        .limit(1);
      
      if (existingKey) {
        // Update the existing key
        const [updatedKey] = await db.update(apiKeys)
          .set({
            key_value: apiKeyData.keyValue,
            is_active: apiKeyData.isActive,
            last_used: new Date()
          })
          .where(eq(apiKeys.id, existingKey.id))
          .returning();
        
        return updatedKey;
      }
      
      // Create a new key
      const [newKey] = await db.insert(apiKeys)
        .values({
          key_type: apiKeyData.keyType,
          key_value: apiKeyData.keyValue,
          is_active: apiKeyData.isActive,
          added_at: new Date()
        })
        .returning();
      
      return newKey;
    } catch (error) {
      console.error('Database error in saveApiKey:', error);
      throw new Error('Failed to save API key');
    }
  }
  
  // Get API key status (just presence, not the actual keys)
  async getApiKeyStatus(): Promise<Record<string, boolean>> {
    try {
      const keys = await db.select()
        .from(apiKeys)
        .where(eq(apiKeys.is_active, true));
      
      // Create a map of key type to boolean (true if exists)
      const keyStatus: Record<string, boolean> = {};
      keys.forEach(key => {
        keyStatus[key.key_type] = true;
      });
      
      return keyStatus;
    } catch (error) {
      console.error('Database error in getApiKeyStatus:', error);
      return {};
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
      .where(
        eq(blogPosts.featured, true)
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
        eq(blogPosts.category, category)
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
        sql`${blogPosts.tags} && ARRAY[${tags.join(',')}]::text[]`
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
    try {
      return await db.select()
        .from(featuredAthletes)
        .where(eq(featuredAthletes.active, true))
        .orderBy(featuredAthletes.order)
        .limit(limit);
    } catch (error) {
      console.error('Error fetching featured athletes:', error);
      return [];
    }
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
      .orderBy(desc(garAthleteRatings.createdAt));
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
      .orderBy(desc(garAthleteRatings.createdAt));
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
      .orderBy(desc(garAthleteRatings.createdAt))
      .limit(1);
    return rating;
  }

  // GAR Rating History operations
  async getGarRatingHistoryByUser(userId: number, limit: number = 10): Promise<GarRatingHistory[]> {
    return await db.select()
      .from(garRatingHistory)
      .where(eq(garRatingHistory.userId, userId))
      .orderBy(desc(garRatingHistory.recordedAt))
      .limit(limit);
  }

  async getLatestGarRatingHistory(userId: number): Promise<GarRatingHistory | undefined> {
    const [rating] = await db.select()
      .from(garRatingHistory)
      .where(eq(garRatingHistory.userId, userId))
      .orderBy(desc(garRatingHistory.recordedAt))
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

  // ----------------
  // Star Path Methods
  // ----------------
  
  async getAthleteStarPath(userId: number): Promise<AthleteStarPath | undefined> {
    const [starPath] = await db.select()
      .from(athleteStarPath)
      .where(eq(athleteStarPath.userId, userId));
    return starPath;
  }
  
  async createAthleteStarPath(data: InsertAthleteStarPath): Promise<AthleteStarPath> {
    const [createdStarPath] = await db.insert(athleteStarPath)
      .values(data)
      .returning();
    return createdStarPath;
  }
  
  async updateAthleteStarPath(userId: number, data: Partial<AthleteStarPath>): Promise<AthleteStarPath> {
    const [updatedStarPath] = await db.update(athleteStarPath)
      .set(data)
      .where(eq(athleteStarPath.userId, userId))
      .returning();
    return updatedStarPath;
  }
  
  // -------------------------
  // Workout Verification Methods
  // -------------------------
  
  async getWorkoutVerification(id: number): Promise<WorkoutVerification | undefined> {
    const [verification] = await db.select()
      .from(workoutVerifications)
      .where(eq(workoutVerifications.id, id));
    return verification;
  }
  
  async getWorkoutVerifications(userId: number, limit: number = 10): Promise<WorkoutVerification[]> {
    return await db.select()
      .from(workoutVerifications)
      .where(eq(workoutVerifications.userId, userId))
      .orderBy(desc(workoutVerifications.createdAt))
      .limit(limit);
  }
  
  async getPendingWorkoutVerifications(userId: number): Promise<WorkoutVerification[]> {
    return await db.select()
      .from(workoutVerifications)
      .where(
        and(
          eq(workoutVerifications.userId, userId),
          eq(workoutVerifications.status, "pending")
        )
      )
      .orderBy(desc(workoutVerifications.createdAt));
  }
  
  async createWorkoutVerification(data: InsertWorkoutVerification): Promise<WorkoutVerification> {
    const [createdVerification] = await db.insert(workoutVerifications)
      .values(data)
      .returning();
    return createdVerification;
  }
  
  async updateWorkoutVerification(id: number, data: Partial<WorkoutVerification>): Promise<WorkoutVerification> {
    const [updatedVerification] = await db.update(workoutVerifications)
      .set(data)
      .where(eq(workoutVerifications.id, id))
      .returning();
    return updatedVerification;
  }
  
  async verifyWorkout(id: number, aiScore: number, formQuality: number, repAccuracy: number, xpEarned: number): Promise<WorkoutVerification> {
    const [verifiedWorkout] = await db.update(workoutVerifications)
      .set({
        status: "completed",
        aiScore,
        formQuality,
        repAccuracy,
        completedAt: new Date(),
        xpEarned
      })
      .where(eq(workoutVerifications.id, id))
      .returning();
      
    // If there's a star path associated with this workout, update the XP
    if (verifiedWorkout.starPathId) {
      // Get the star path
      const [starPath] = await db.select()
        .from(athleteStarPath)
        .where(eq(athleteStarPath.id, verifiedWorkout.starPathId));
        
      if (starPath) {
        // Update the star path with the earned XP
        await db.update(athleteStarPath)
          .set({ 
            currentXp: starPath.currentXp + xpEarned,
            workoutsCompleted: starPath.workoutsCompleted + 1,
            lastWorkoutAt: new Date()
          })
          .where(eq(athleteStarPath.id, starPath.id));
      }
    }
    
    // Call the method to add XP to player's overall account
    if (xpEarned > 0) {
      await this.addXpToPlayer(
        verifiedWorkout.userId, 
        xpEarned, 
        "workout_verification", 
        `Completed ${verifiedWorkout.workoutType} workout with ${repAccuracy.toFixed(1)}% accuracy`,
        { workoutVerificationId: id }
      );
    }
    
    return verifiedWorkout;
  }
  
  async getWorkoutVerificationCheckpoints(workoutVerificationId: number): Promise<WorkoutVerificationCheckpoint[]> {
    return await db.select()
      .from(workoutVerificationCheckpoints)
      .where(eq(workoutVerificationCheckpoints.workoutVerificationId, workoutVerificationId))
      .orderBy(workoutVerificationCheckpoints.timestamp);
  }
  
  async createWorkoutVerificationCheckpoint(data: InsertWorkoutVerificationCheckpoint): Promise<WorkoutVerificationCheckpoint> {
    const [createdCheckpoint] = await db.insert(workoutVerificationCheckpoints)
      .values(data)
      .returning();
    return createdCheckpoint;
  }
  
  async updateWorkoutVerificationCheckpoint(id: number, data: Partial<WorkoutVerificationCheckpoint>): Promise<WorkoutVerificationCheckpoint> {
    const [updatedCheckpoint] = await db.update(workoutVerificationCheckpoints)
      .set(data)
      .where(eq(workoutVerificationCheckpoints.id, id))
      .returning();
    return updatedCheckpoint;
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
      // Check if skillTreeNodes exists
      if (typeof skillTreeNodes === 'undefined' || !skillTreeNodes) {
        console.warn('skillTreeNodes table not found');
        return [];
      }

      // Construct the query in a try-catch to handle any database errors
      try {
        const query = db.select().from(skillTreeNodes);
        
        // Build a conditions array for the where clause
        const conditions = [];
        
        // Try to add the isActive condition if the column exists
        try {
          conditions.push(eq(skillTreeNodes.isActive, true));
        } catch (err) {
          console.warn('isActive column not found on skillTreeNodes table');
        }
        
        // Try to add the sportType condition if provided and column exists
        if (sportType) {
          try {
            conditions.push(eq(skillTreeNodes.sportType, sportType));
          } catch (err) {
            console.warn('sportType column not found on skillTreeNodes table');
          }
        }
        
        // Try to add the position condition if provided and column exists
        if (position) {
          try {
            conditions.push(eq(skillTreeNodes.position, position));
          } catch (err) {
            console.warn('position column not found on skillTreeNodes table');
          }
        }
        
        // Apply all conditions if any
        let finalQuery = query;
        if (conditions.length > 0) {
          finalQuery = finalQuery.where(and(...conditions));
        }
        
        // Try to order by level and sortOrder if they exist
        try {
          return await finalQuery.orderBy(skillTreeNodes.level, skillTreeNodes.sortOrder);
        } catch (err) {
          console.warn('Could not order by level and sortOrder, returning unordered results');
          return await finalQuery;
        }
      } catch (queryError) {
        console.error('Error constructing skill tree nodes query:', queryError);
        return [];
      }
    } catch (error) {
      console.error('Error fetching skill tree nodes:', error);
      return [];
    }
  }

  async getSkillTreeNode(id: number): Promise<SkillTreeNode | undefined> {
    try {
      // Check if skillTreeNodes exists
      if (typeof skillTreeNodes === 'undefined' || !skillTreeNodes) {
        console.warn(`skillTreeNodes table not found when looking for node ID ${id}`);
        return undefined;
      }

      try {
        const [node] = await db.select()
          .from(skillTreeNodes)
          .where(eq(skillTreeNodes.id, id));
        return node;
      } catch (queryError) {
        console.error(`Error querying skill tree node with ID ${id}:`, queryError);
        return undefined;
      }
    } catch (error) {
      console.error(`Error fetching skill tree node with ID ${id}:`, error);
      return undefined;
    }
  }

  async getSkillTreeNodesByLevel(level: number): Promise<SkillTreeNode[]> {
    try {
      // Check if skillTreeNodes exists
      if (typeof skillTreeNodes === 'undefined' || !skillTreeNodes) {
        console.warn(`skillTreeNodes table not found when looking for level ${level}`);
        return [];
      }

      try {
        // Build conditions safely
        const conditions = [];
        
        // Add level condition
        try {
          conditions.push(eq(skillTreeNodes.level, level));
        } catch (err) {
          console.warn('level column not found on skillTreeNodes table');
          return []; // Can't filter by level, return empty array
        }
        
        // Add isActive condition if exists
        try {
          conditions.push(eq(skillTreeNodes.isActive, true));
        } catch (err) {
          console.warn('isActive column not found on skillTreeNodes table');
          // Continue without isActive filter
        }
        
        // Execute query with appropriate conditions
        let query = db.select().from(skillTreeNodes);
        
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        
        try {
          return await query.orderBy(skillTreeNodes.sortOrder);
        } catch (err) {
          console.warn('sortOrder column not found on skillTreeNodes table, returning unordered results');
          return await query;
        }
      } catch (queryError) {
        console.error(`Error constructing skill tree nodes query for level ${level}:`, queryError);
        return [];
      }
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
      // Check if trainingDrills table exists
      if (typeof trainingDrills === 'undefined' || !trainingDrills) {
        console.warn('trainingDrills table not found');
        return [];
      }

      try {
        // Start with the basic query
        let query = db.select().from(trainingDrills);
        
        // Conditions for filtering
        const conditions = [];
        
        // Add sportType filter if provided and column exists
        if (sportType) {
          try {
            conditions.push(eq(trainingDrills.sportType, sportType));
          } catch (err) {
            console.warn('sportType column not found on trainingDrills table');
          }
        }
        
        // Add position filter if provided and column exists
        if (position) {
          try {
            conditions.push(eq(trainingDrills.position, position));
          } catch (err) {
            console.warn('position column not found on trainingDrills table');
          }
        }
        
        // Add category filter if provided and column exists
        if (category) {
          try {
            conditions.push(eq(trainingDrills.category, category));
          } catch (err) {
            console.warn('category column not found on trainingDrills table');
          }
        }
        
        // Apply all conditions if any are valid
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        
        return await query;
      } catch (queryError) {
        console.error('Error constructing training drills query:', queryError);
        return [];
      }
    } catch (error) {
      console.error('Error fetching training drills:', error);
      return [];
    }
  }

  async getTrainingDrill(id: number): Promise<TrainingDrill | undefined> {
    try {
      // Check if trainingDrills table exists
      if (typeof trainingDrills === 'undefined' || !trainingDrills) {
        console.warn(`trainingDrills table not found when looking for drill ID ${id}`);
        return undefined;
      }
      
      try {
        const [drill] = await db.select()
          .from(trainingDrills)
          .where(eq(trainingDrills.id, id));
        return drill;
      } catch (queryError) {
        console.error(`Error querying training drill with ID ${id}:`, queryError);
        return undefined;
      }
    } catch (error) {
      console.error(`Error fetching training drill with ID ${id}:`, error);
      return undefined;
    }
  }

  async getTrainingDrillsBySkill(skillNodeId: number): Promise<TrainingDrill[]> {
    try {
      // Check if trainingDrills table exists
      if (typeof trainingDrills === 'undefined' || !trainingDrills) {
        console.warn(`trainingDrills table not found when looking for drills with skill node ID ${skillNodeId}`);
        return [];
      }
      
      try {
        // Check if skillNodeId column exists
        try {
          return await db.select()
            .from(trainingDrills)
            .where(eq(trainingDrills.skillNodeId, skillNodeId));
        } catch (columnError) {
          console.warn('skillNodeId column not found on trainingDrills table');
          return [];
        }
      } catch (queryError) {
        console.error(`Error constructing query for training drills with skill node ID ${skillNodeId}:`, queryError);
        return [];
      }
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
      // Check if skills table exists
      if (typeof skills === 'undefined' || !skills) {
        console.warn(`skills table not found when looking for user ID ${userId}`);
        return [];
      }
      
      try {
        // Check if userId column exists
        try {
          return await db.select().from(skills).where(eq(skills.userId, userId));
        } catch (columnError) {
          console.warn('userId column not found on skills table');
          return [];
        }
      } catch (queryError) {
        console.error(`Error constructing query for skills with user ID ${userId}:`, queryError);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching skills for user ID ${userId}:`, error);
      return [];
    }
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    try {
      // Check if skills table exists
      if (typeof skills === 'undefined' || !skills) {
        console.warn(`skills table not found when looking for skill ID ${id}`);
        return undefined;
      }
      
      try {
        const [skill] = await db.select()
          .from(skills)
          .where(eq(skills.id, id));
        return skill;
      } catch (queryError) {
        console.error(`Error querying skill with ID ${id}:`, queryError);
        return undefined;
      }
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
      // Check if userDrillProgress table exists
      if (typeof userDrillProgress === 'undefined' || !userDrillProgress) {
        console.warn(`userDrillProgress table not found when looking for user ID ${userId}`);
        return [];
      }
      
      try {
        // Check if userId column exists
        try {
          return await db.select().from(userDrillProgress).where(eq(userDrillProgress.userId, userId));
        } catch (columnError) {
          console.warn('userId column not found on userDrillProgress table');
          return [];
        }
      } catch (queryError) {
        console.error(`Error constructing query for user drill progress with user ID ${userId}:`, queryError);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching user drill progress for user ID ${userId}:`, error);
      return [];
    }
  }

  async getUserDrillProgressByDrill(userId: number, drillId: number): Promise<UserDrillProgress | undefined> {
    try {
      // Check if userDrillProgress table exists
      if (typeof userDrillProgress === 'undefined' || !userDrillProgress) {
        console.warn(`userDrillProgress table not found when looking for user ID ${userId} and drill ID ${drillId}`);
        return undefined;
      }
      
      try {
        // Safely construct the conditions
        const conditions = [];
        
        // Add userId condition if exists
        try {
          conditions.push(eq(userDrillProgress.userId, userId));
        } catch (err) {
          console.warn('userId column not found on userDrillProgress table');
          return undefined;
        }
        
        // Add drillId condition if exists
        try {
          conditions.push(eq(userDrillProgress.drillId, drillId));
        } catch (err) {
          console.warn('drillId column not found on userDrillProgress table');
          return undefined;
        }
        
        // Execute query with combined conditions
        if (conditions.length === 2) {
          const [progress] = await db.select()
            .from(userDrillProgress)
            .where(and(...conditions));
          return progress;
        } else {
          console.warn('Required columns missing from userDrillProgress table');
          return undefined;
        }
      } catch (queryError) {
        console.error(`Error constructing query for user drill progress with user ID ${userId} and drill ID ${drillId}:`, queryError);
        return undefined;
      }
    } catch (error) {
      console.error(`Error fetching user drill progress for user ID ${userId} and drill ID ${drillId}:`, error);
      return undefined;
    }
  }

  async createUserDrillProgress(progress: InsertUserDrillProgress): Promise<UserDrillProgress> {
    try {
      // Check if userDrillProgress table exists
      if (typeof userDrillProgress === 'undefined' || !userDrillProgress) {
        console.error('userDrillProgress table not found when trying to create progress record');
        throw new Error('User drill progress table not found');
      }
      
      try {
        const [createdProgress] = await db.insert(userDrillProgress).values(progress).returning();
        return createdProgress;
      } catch (insertError) {
        console.error('Error inserting into userDrillProgress table:', insertError);
        throw new Error('Failed to create user drill progress record');
      }
    } catch (error) {
      console.error('Error creating user drill progress:', error);
      throw error;
    }
  }

  async updateUserDrillProgress(id: number, data: Partial<UserDrillProgress>): Promise<UserDrillProgress | undefined> {
    try {
      // Check if userDrillProgress table exists
      if (typeof userDrillProgress === 'undefined' || !userDrillProgress) {
        console.warn(`userDrillProgress table not found when updating progress ID ${id}`);
        return undefined;
      }
      
      try {
        // Check if updatedAt field exists
        let updateData: any = { ...data };
        
        try {
          updateData.updatedAt = new Date();
        } catch (fieldError) {
          console.warn('updatedAt field might not exist on userDrillProgress table');
          // Continue without setting updatedAt
        }
        
        // Execute update
        try {
          const [updatedProgress] = await db.update(userDrillProgress)
            .set(updateData)
            .where(eq(userDrillProgress.id, id))
            .returning();
          return updatedProgress;
        } catch (updateError) {
          console.error(`Error executing update on userDrillProgress with ID ${id}:`, updateError);
          return undefined;
        }
      } catch (queryError) {
        console.error(`Error constructing update query for userDrillProgress with ID ${id}:`, queryError);
        return undefined;
      }
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
  
  // NCAA Eligibility operations
  async getNcaaEligibility(userId: number): Promise<NcaaEligibility | undefined> {
    try {
      const [eligibility] = await db.select()
        .from(ncaaEligibility)
        .where(eq(ncaaEligibility.userId, userId));
      return eligibility;
    } catch (error) {
      console.error(`Database error in getNcaaEligibility(${userId}):`, error);
      return undefined;
    }
  }
  
  async createNcaaEligibility(eligibility: InsertNcaaEligibility): Promise<NcaaEligibility> {
    try {
      const [createdEligibility] = await db.insert(ncaaEligibility)
        .values({
          ...eligibility,
          lastUpdated: new Date()
        })
        .returning();
      return createdEligibility;
    } catch (error) {
      console.error('Database error in createNcaaEligibility:', error);
      throw error;
    }
  }
  
  async updateNcaaEligibility(id: number, data: Partial<NcaaEligibility>): Promise<NcaaEligibility | undefined> {
    try {
      const [updatedEligibility] = await db.update(ncaaEligibility)
        .set({
          ...data,
          lastUpdated: new Date()
        })
        .where(eq(ncaaEligibility.id, id))
        .returning();
      return updatedEligibility;
    } catch (error) {
      console.error(`Database error in updateNcaaEligibility(${id}):`, error);
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
            eq(userTokens.isRevoked, false),
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
          isRevoked: false
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
          isRevoked: true,
          lastUsedAt: new Date() // Using lastUsedAt instead of revokedAt which doesn't exist
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
          isRevoked: true,
          lastUsedAt: new Date() // Using lastUsedAt instead of revokedAt which doesn't exist
        })
        .where(
          and(
            eq(userTokens.userId, userId),
            eq(userTokens.isRevoked, false)
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

  // Registration operations
  async getRegistrations(): Promise<Registration[]> {
    try {
      return await db.select().from(registrations);
    } catch (error) {
      console.error('Database error in getRegistrations:', error);
      return [];
    }
  }

  async getRegistrationsByEvent(eventId: number): Promise<Registration[]> {
    try {
      return await db.select()
        .from(registrations)
        .where(eq(registrations.eventId, eventId));
    } catch (error) {
      console.error('Database error in getRegistrationsByEvent:', error);
      return [];
    }
  }

  async getRegistrationsByUser(userId: number): Promise<Registration[]> {
    try {
      return await db.select()
        .from(registrations)
        .where(eq(registrations.userId, userId));
    } catch (error) {
      console.error('Database error in getRegistrationsByUser:', error);
      return [];
    }
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    try {
      const [registration] = await db.select()
        .from(registrations)
        .where(eq(registrations.id, id));
      return registration;
    } catch (error) {
      console.error('Database error in getRegistration:', error);
      return undefined;
    }
  }

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    try {
      const [createdRegistration] = await db.insert(registrations)
        .values(registration)
        .returning();
      return createdRegistration;
    } catch (error) {
      console.error('Database error in createRegistration:', error);
      throw error;
    }
  }

  async updateRegistration(id: number, data: Partial<Registration>): Promise<Registration | undefined> {
    try {
      const [updatedRegistration] = await db.update(registrations)
        .set(data)
        .where(eq(registrations.id, id))
        .returning();
      return updatedRegistration;
    } catch (error) {
      console.error('Database error in updateRegistration:', error);
      return undefined;
    }
  }

  async deleteRegistration(id: number): Promise<boolean> {
    try {
      await db.delete(registrations)
        .where(eq(registrations.id, id));
      return true;
    } catch (error) {
      console.error('Database error in deleteRegistration:', error);
      return false;
    }
  }

  // Payment operations
  async getPayments(): Promise<Payment[]> {
    try {
      return await db.select().from(payments);
    } catch (error) {
      console.error('Database error in getPayments:', error);
      return [];
    }
  }

  async getPaymentsByRegistration(registrationId: number): Promise<Payment[]> {
    try {
      return await db.select()
        .from(payments)
        .where(eq(payments.registrationId, registrationId));
    } catch (error) {
      console.error('Database error in getPaymentsByRegistration:', error);
      return [];
    }
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    try {
      const [payment] = await db.select()
        .from(payments)
        .where(eq(payments.id, id));
      return payment;
    } catch (error) {
      console.error('Database error in getPayment:', error);
      return undefined;
    }
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    try {
      const [createdPayment] = await db.insert(payments)
        .values(payment)
        .returning();
      return createdPayment;
    } catch (error) {
      console.error('Database error in createPayment:', error);
      throw error;
    }
  }

  async updatePayment(id: number, data: Partial<Payment>): Promise<Payment | undefined> {
    try {
      const [updatedPayment] = await db.update(payments)
        .set(data)
        .where(eq(payments.id, id))
        .returning();
      return updatedPayment;
    } catch (error) {
      console.error('Database error in updatePayment:', error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();