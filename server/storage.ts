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
  spotlightProfiles, type SpotlightProfile, type InsertSpotlightProfile,
  athleteStarPath, type AthleteStarPath, type InsertAthleteStarPath,
  workoutVerifications, type WorkoutVerification, type InsertWorkoutVerification,
  workoutVerificationCheckpoints, type WorkoutVerificationCheckpoint, type InsertWorkoutVerificationCheckpoint,
  onboardingProgress, type OnboardingProgress, type InsertOnboardingProgress,
  athleteStarProfiles, type AthleteStarProfile, type InsertAthleteStarProfile,
  anthropicTrainingPlans, type AnthropicTrainingPlan, type InsertAnthropicTrainingPlan
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, inArray, asc } from "drizzle-orm";
import session from "express-session";
import MemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

export interface IStorage {
  // Session store
  sessionStore: any;
  
  // System stats for admin dashboard
  getSystemStats(): Promise<any>;
  
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
  
  // Combine Event Registration operations
  getCombineEventRegistrations(eventId: number): Promise<Registration[]>;
  getCombineEventRegistrationsByUser(userId: number): Promise<Registration[]>;
  getCombineEventRegistration(userId: number, eventId: number): Promise<Registration | undefined>;
  createCombineEventRegistration(registration: InsertRegistration): Promise<Registration>;
  updateCombineEventRegistration(id: number, data: Partial<Registration>): Promise<Registration | undefined>;
  cancelCombineEventRegistration(userId: number, eventId: number): Promise<boolean>;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getAllAthletes(): Promise<User[]>;
  
  // Onboarding operations
  getOnboardingProgress(userId: number): Promise<OnboardingProgress | undefined>;
  createOnboardingProgress(data: InsertOnboardingProgress): Promise<OnboardingProgress>;
  updateOnboardingProgress(userId: number, data: Partial<OnboardingProgress>): Promise<OnboardingProgress | undefined>;
  completeOnboardingStep(userId: number, step: number, section?: string): Promise<OnboardingProgress | undefined>;
  skipOnboardingSection(userId: number, section: string): Promise<OnboardingProgress | undefined>;
  
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
  
  // AI Coach and Player features
  getAthleteProfile(userId: number): Promise<any | undefined>;
  getPlayerProgress(userId: number): Promise<any | undefined>;
  createPlayerProgress(data: any): Promise<any>;
  updatePlayerProgress(userId: number, data: any): Promise<any>;
  getPlayerEquipment(userId: number): Promise<any[]>;
  getPlayerBadges(userId: number): Promise<any[]>;
  getXpTransactions(userId: number): Promise<any[]>;
  getWeightRoomEquipmentById(equipmentId: number): Promise<any | undefined>;
  addXpToPlayer(userId: number, amount: number, source: string, reason: string, metadata?: any): Promise<any>;
  getSportRecommendations(userId: number): Promise<any[]>;
  
  // Star Path and Workout Verification
  getAthleteStarPath(userId: number): Promise<AthleteStarPath | undefined>;
  createAthleteStarPath(data: InsertAthleteStarPath): Promise<AthleteStarPath>;
  updateAthleteStarPath(userId: number, data: Partial<AthleteStarPath>): Promise<AthleteStarPath>;
  getStarPathByUserId(userId: number): Promise<AthleteStarPath | undefined>;
  createStarPath(data: any): Promise<AthleteStarPath>;
  updateStarPath(id: number, data: any): Promise<AthleteStarPath>;
  getWorkoutVerification(id: number): Promise<WorkoutVerification | undefined>;
  getWorkoutVerifications(userId: number, limit?: number): Promise<WorkoutVerification[]>;
  getPendingWorkoutVerifications(userId: number): Promise<WorkoutVerification[]>;
  createWorkoutVerification(data: InsertWorkoutVerification): Promise<WorkoutVerification>;
  updateWorkoutVerification(id: number, data: Partial<WorkoutVerification>): Promise<WorkoutVerification>;
  verifyWorkout(id: number, aiScore: number, formQuality: number, repAccuracy: number, xpEarned: number): Promise<WorkoutVerification>;
  getWorkoutVerificationCheckpoints(workoutVerificationId: number): Promise<WorkoutVerificationCheckpoint[]>;
  createWorkoutVerificationCheckpoint(data: InsertWorkoutVerificationCheckpoint): Promise<WorkoutVerificationCheckpoint>;
  updateWorkoutVerificationCheckpoint(id: number, data: Partial<WorkoutVerificationCheckpoint>): Promise<WorkoutVerificationCheckpoint>;
  
  // Player Progress and XP
  createPlayerXpTransaction(data: any): Promise<any>;
  getPlayerXpTransactions(userId: number): Promise<any[]>;
  
  // Skill Tree operations
  getSkillTreeNodes(sportType?: string, position?: string): Promise<SkillTreeNode[]>;
  getRootSkillTreeNodes(sportType?: string, position?: string): Promise<SkillTreeNode[]>;
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
  _xpTransactions: Record<number, any[]>;

  constructor() {
    // Initialize the XP transactions in-memory storage
    this._xpTransactions = {};
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
  
  async getSystemStats(): Promise<any> {
    try {
      // Get total users count
      const totalUsers = await db.select({ count: sql`count(*)` }).from(users);
      const userCount = Number(totalUsers[0]?.count || 0);
      
      // Get athletes count
      const athleteCount = await db.select({ count: sql`count(*)` })
        .from(users)
        .where(eq(users.role, 'athlete'));
      
      // Get coaches count
      const coachCount = await db.select({ count: sql`count(*)` })
        .from(users)
        .where(eq(users.role, 'coach'));
        
      // Get videos count
      const videosCount = await db.select({ count: sql`count(*)` }).from(videos);
      
      // Get highlights count
      const highlightsCount = await db.select({ count: sql`count(*)` }).from(videoHighlights);
      
      // Get blog posts count
      const blogPostsCount = await db.select({ count: sql`count(*)` }).from(blogPosts);
      
      // Get workout verifications count
      let workoutVerificationsCount = 0;
      try {
        const workoutCount = await db.select({ count: sql`count(*)` }).from(workoutVerifications);
        workoutVerificationsCount = Number(workoutCount[0]?.count || 0);
      } catch (error) {
        console.log("Workout verifications table might not exist yet");
      }
      
      // Recent signups - users created in the last 7 days
      const recentSignups = await db.select()
        .from(users)
        .where(sql`${users.createdAt} > NOW() - INTERVAL '7 days'`)
        .orderBy(desc(users.createdAt));
      
      return {
        totalUsers: userCount,
        athleteUsers: Number(athleteCount[0]?.count || 0),
        coachUsers: Number(coachCount[0]?.count || 0),
        totalVideos: Number(videosCount[0]?.count || 0),
        totalHighlights: Number(highlightsCount[0]?.count || 0),
        totalBlogPosts: Number(blogPostsCount[0]?.count || 0),
        totalWorkoutVerifications: workoutVerificationsCount,
        recentSignups: recentSignups.length,
        recentUsers: recentSignups.slice(0, 5) // Only return the 5 most recent
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      // Return default stats to prevent dashboard from breaking
      return {
        totalUsers: 0,
        athleteUsers: 0,
        coachUsers: 0,
        totalVideos: 0,
        totalHighlights: 0,
        totalBlogPosts: 0,
        totalWorkoutVerifications: 0,
        recentSignups: 0,
        recentUsers: []
      };
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
    try {
      // First try a safe query to avoid schema mismatch issues
      const safeResult = await db.execute(sql`SELECT * FROM videos WHERE id = ${id}`);
      if (safeResult.rows && safeResult.rows.length > 0) {
        return safeResult.rows[0] as Video;
      }
      // Fallback to standard query only if needed
      const [video] = await db.select().from(videos).where(eq(videos.id, id));
      return video;
    } catch (error) {
      console.error(`Database error in getVideo(${id}):`, error);
      return undefined;
    }
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
  
  // Onboarding Progress operations
  async getOnboardingProgress(userId: number): Promise<OnboardingProgress | undefined> {
    try {
      const [progress] = await db
        .select()
        .from(onboardingProgress)
        .where(eq(onboardingProgress.userId, userId));
      return progress;
    } catch (error) {
      console.error(`Error fetching onboarding progress for user ${userId}:`, error);
      return undefined;
    }
  }

  async createOnboardingProgress(data: InsertOnboardingProgress): Promise<OnboardingProgress> {
    try {
      const [progress] = await db
        .insert(onboardingProgress)
        .values(data)
        .returning();
      return progress;
    } catch (error) {
      console.error("Error creating onboarding progress:", error);
      throw error;
    }
  }

  async updateOnboardingProgress(userId: number, data: Partial<OnboardingProgress>): Promise<OnboardingProgress | undefined> {
    try {
      const [progress] = await db
        .update(onboardingProgress)
        .set({
          ...data,
          lastUpdated: new Date(),
        })
        .where(eq(onboardingProgress.userId, userId))
        .returning();
      return progress;
    } catch (error) {
      console.error(`Error updating onboarding progress for user ${userId}:`, error);
      return undefined;
    }
  }

  async completeOnboardingStep(userId: number, step: number, section?: string): Promise<OnboardingProgress | undefined> {
    try {
      const currentProgress = await this.getOnboardingProgress(userId);
      
      if (!currentProgress) {
        return undefined;
      }
      
      const update: Partial<OnboardingProgress> = {
        currentStep: step + 1,
        lastUpdated: new Date(),
      };
      
      // Add to completed sections if provided
      if (section) {
        const completedSections = currentProgress.completedSections || [];
        if (!completedSections.includes(section)) {
          update.completedSections = [...completedSections, section];
        }
      }
      
      // Check if this was the last step
      if (step + 1 > currentProgress.totalSteps) {
        update.isCompleted = true;
      }
      
      const [progress] = await db
        .update(onboardingProgress)
        .set(update)
        .where(eq(onboardingProgress.userId, userId))
        .returning();
      
      return progress;
    } catch (error) {
      console.error(`Error completing onboarding step for user ${userId}:`, error);
      return undefined;
    }
  }

  async skipOnboardingSection(userId: number, section: string): Promise<OnboardingProgress | undefined> {
    try {
      const currentProgress = await this.getOnboardingProgress(userId);
      
      if (!currentProgress) {
        return undefined;
      }
      
      const skippedSections = currentProgress.skippedSections || [];
      
      if (!skippedSections.includes(section)) {
        const [progress] = await db
          .update(onboardingProgress)
          .set({
            skippedSections: [...skippedSections, section],
            lastUpdated: new Date(),
          })
          .where(eq(onboardingProgress.userId, userId))
          .returning();
        
        return progress;
      }
      
      return currentProgress;
    } catch (error) {
      console.error(`Error skipping onboarding section for user ${userId}:`, error);
      return undefined;
    }
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
    console.log(`Getting player progress for user ID: ${userId}`);
    
    try {
      // First, try to get the star path data for the user
      const starPath = await this.getAthleteStarPath(userId);
      
      if (starPath) {
        // Return formatted progress object based on star path data
        return {
          userId,
          currentLevel: starPath.currentStarLevel || 1,
          totalXp: starPath.xpTotal || 0,
          levelXp: Math.min(starPath.xpTotal || 0, 1000), // XP in current level
          xpToNextLevel: 1000, // Fixed for now
          streakDays: 0,
          lastActive: new Date().toISOString(),
          badges: [],
          achievements: starPath.achievements || {},
          starLevel: starPath.currentStarLevel || 1
        };
      }
      
      // If no star path exists yet, return default values
      return {
        userId,
        currentLevel: 1,
        totalXp: 0,
        levelXp: 0,
        xpToNextLevel: 1000,
        streakDays: 0,
        lastActive: new Date().toISOString(),
        badges: [],
        achievements: {},
        starLevel: 1
      };
    } catch (error) {
      console.error("Error getting player progress:", error);
      // Return default values on error
      return {
        userId,
        currentLevel: 1,
        totalXp: 0,
        levelXp: 0,
        xpToNextLevel: 1000,
        streakDays: 0,
        lastActive: new Date().toISOString(),
        badges: [],
        achievements: {},
        starLevel: 1
      };
    }
  }
  
  async createPlayerProgress(data: any): Promise<any> {
    console.log(`Creating player progress for user ID: ${data.userId}`);
    
    try {
      // Check if a star path already exists
      const existingStarPath = await this.getAthleteStarPath(data.userId);
      
      if (existingStarPath) {
        return this.getPlayerProgress(data.userId);
      }
      
      // If no star path exists, create one
      const starPath = await this.createAthleteStarPath({
        userId: data.userId,
        currentStarLevel: 1,
        targetStarLevel: 2,
        storylinePhase: "beginning",
        progress: 0,
        sportType: "basketball", // Default sport
        xpTotal: data.totalXp || 0,
        storylineActive: true
      });
      
      // Return the newly created progress data
      return {
        userId: data.userId,
        currentLevel: starPath.currentStarLevel || 1,
        totalXp: starPath.xpTotal || 0,
        levelXp: 0,
        xpToNextLevel: 1000,
        streakDays: data.streakDays || 0,
        lastActive: data.lastActive || new Date().toISOString(),
        badges: [],
        achievements: {},
        starLevel: 1
      };
    } catch (error) {
      console.error("Error creating player progress:", error);
      // Return the input data as fallback
      return data;
    }
  }
  
  async updatePlayerProgress(userId: number, data: any): Promise<any> {
    console.log(`Updating player progress for user ID: ${userId}`, data);
    
    try {
      // Get the star path
      const starPath = await this.getAthleteStarPath(userId);
      
      if (!starPath) {
        // If star path doesn't exist, create player progress first
        return this.createPlayerProgress({
          userId,
          ...data
        });
      }
      
      // Update the star path
      const updatedStarPath = await this.updateAthleteStarPath(userId, {
        lastUpdated: new Date()
      });
      
      // Return the updated progress
      return await this.getPlayerProgress(userId);
    } catch (error) {
      console.error("Error updating player progress:", error);
      return null;
    }
  }

  async getPlayerEquipment(userId: number): Promise<any[]> {
    console.log(`Getting player equipment for user ID: ${userId}`);
    
    try {
      // Try to get the star path for the user to determine appropriate equipment
      const starPath = await this.getAthleteStarPath(userId);
      
      // Base equipment list that everyone has
      const baseEquipment = [
        {
          id: 1,
          type: "shoes",
          name: "Basic Training Shoes",
          stats: { speed: 5, agility: 5 },
          equipped: true,
          level: 1,
          description: "Standard training shoes with basic performance",
          durability: 100,
          image: "/assets/equipment/basic_shoes.png"
        },
        {
          id: 2,
          type: "shirt",
          name: "Training Jersey",
          stats: { endurance: 5 },
          equipped: true,
          level: 1,
          description: "Simple jersey for everyday practice",
          durability: 100,
          image: "/assets/equipment/training_jersey.png"
        },
        {
          id: 3,
          type: "armband",
          name: "Focus Band",
          stats: { focus: 3 },
          equipped: false,
          level: 1,
          description: "Basic armband that helps improve focus during training",
          durability: 100,
          image: "/assets/equipment/focus_band.png"
        }
      ];
      
      // If no star path exists, just return the base equipment
      if (!starPath) {
        return baseEquipment;
      }
      
      // If star path exists, add equipment based on star level and sport type
      const additionalEquipment = [];
      const currentLevel = starPath.currentStarLevel || 1;
      const sportType = starPath.sportType || "basketball";
      
      // Add equipment based on player level
      if (currentLevel >= 2) {
        additionalEquipment.push({
          id: 4,
          type: "shoes",
          name: "Advanced Training Shoes",
          stats: { speed: 8, agility: 8, strength: 2 },
          equipped: false,
          level: 2,
          description: "Higher performance shoes with improved traction",
          durability: 100,
          image: "/assets/equipment/advanced_shoes.png"
        });
      }
      
      if (currentLevel >= 3) {
        additionalEquipment.push({
          id: 5,
          type: "smartwatch",
          name: "Performance Tracker Watch",
          stats: { focus: 5, gameIQ: 3, technique: 2 },
          equipped: false,
          level: 3,
          description: "Digital watch that tracks performance metrics during workouts",
          durability: 100,
          image: "/assets/equipment/smartwatch.png"
        });
      }
      
      if (currentLevel >= 4) {
        additionalEquipment.push({
          id: 6,
          type: "gear",
          name: "Pro Recovery Kit",
          stats: { endurance: 10, recovery: 15 },
          equipped: false,
          level: 4,
          description: "Professional recovery equipment for faster muscle repair",
          durability: 100,
          image: "/assets/equipment/recovery_kit.png"
        });
      }
      
      // Add sport-specific equipment
      if (sportType === "basketball") {
        additionalEquipment.push({
          id: 100,
          type: "ball",
          name: "Precision Basketball",
          stats: { ballControl: 7, technique: 5 },
          equipped: false,
          level: Math.min(currentLevel, 3),
          description: "High-quality basketball with optimal grip",
          durability: 95,
          sportType: "basketball",
          image: "/assets/equipment/basketball_premium.png"
        });
      } else if (sportType === "football") {
        additionalEquipment.push({
          id: 101,
          type: "helmet",
          name: "Impact Protection Helmet",
          stats: { safety: 10, confidence: 5 },
          equipped: false,
          level: Math.min(currentLevel, 3),
          description: "Advanced helmet with superior impact protection",
          durability: 100,
          sportType: "football",
          image: "/assets/equipment/football_helmet.png"
        });
      } else if (sportType === "soccer") {
        additionalEquipment.push({
          id: 102,
          type: "cleats",
          name: "Precision Cleats",
          stats: { speed: 8, ballControl: 6 },
          equipped: false,
          level: Math.min(currentLevel, 3),
          description: "Premium cleats designed for ball control and speed",
          durability: 95,
          sportType: "soccer",
          image: "/assets/equipment/soccer_cleats.png"
        });
      }
      
      // Combine base and additional equipment
      return [...baseEquipment, ...additionalEquipment];
      
    } catch (error) {
      console.error(`Error getting player equipment for user ${userId}:`, error);
      // Fall back to base equipment in case of error
      return [
        {
          id: 1,
          type: "shoes",
          name: "Basic Training Shoes",
          stats: { speed: 5, agility: 5 },
          equipped: true,
          level: 1,
          description: "Standard training shoes with basic performance",
          durability: 100,
          image: "/assets/equipment/basic_shoes.png"
        },
        {
          id: 2,
          type: "shirt",
          name: "Training Jersey",
          stats: { endurance: 5 },
          equipped: true,
          level: 1,
          description: "Simple jersey for everyday practice",
          durability: 100,
          image: "/assets/equipment/training_jersey.png"
        }
      ];
    }
  }

  // ----------------
  // Star Path Methods
  // ----------------
  
  async getAthleteStarPath(userId: number): Promise<AthleteStarPath | undefined> {
    try {
      const [starPath] = await db.select()
        .from(athleteStarPath)
        .where(eq(athleteStarPath.userId, userId));
      return starPath;
    } catch (error) {
      console.error(`Error getting athlete star path for user ${userId}:`, error);
      return undefined;
    }
  }
  
  async getPlayerProgress(userId: number): Promise<any | undefined> {
    console.log(`Getting player progress for user ID: ${userId}`);
    
    try {
      // First, try to get the star path data for the user
      const starPath = await this.getAthleteStarPath(userId);
      
      if (starPath) {
        // Calculate next level threshold based on current level
        const currentLevel = starPath.currentStarLevel || 1;
        const nextLevelThreshold = starPath.levelThresholds ? 
          starPath.levelThresholds[currentLevel] || 1000 : 1000;
        const prevLevelThreshold = currentLevel > 1 && starPath.levelThresholds ? 
          starPath.levelThresholds[currentLevel - 1] || 0 : 0;
          
        // Calculate XP in current level
        const totalXp = starPath.xpTotal || 0;
        const levelXp = totalXp - prevLevelThreshold;
        const xpToNextLevel = nextLevelThreshold - prevLevelThreshold;
        
        // Get latest workout data if any
        const workouts = await this.getWorkoutVerifications(userId, 5);
        const latestWorkout = workouts && workouts.length > 0 ? workouts[0] : null;
        
        // Return formatted progress object based on star path data
        return {
          userId,
          currentLevel: currentLevel,
          totalXp: totalXp,
          levelXp: levelXp,
          xpToNextLevel: xpToNextLevel,
          streakDays: starPath.streakDays || 0,
          lastWorkout: latestWorkout ? {
            date: latestWorkout.completedAt,
            type: latestWorkout.exerciseType,
            xpEarned: latestWorkout.xpEarned
          } : null,
          physicalAttributes: starPath.physicalAttributes,
          technicalAttributes: starPath.technicalAttributes,
          mentalAttributes: starPath.mentalAttributes,
          sportType: starPath.sportType,
          position: starPath.position,
          storylinePhase: starPath.storylinePhase,
          completedDrills: starPath.completedDrills || 0,
          verifiedWorkouts: starPath.verifiedWorkouts || 0,
          skillTreeProgress: starPath.skillTreeProgress || 0,
          progress: starPath.progress || 0,
          nextMilestone: starPath.nextMilestone
        };
      }
      
      // If no star path exists, return undefined
      return undefined;
    } catch (error) {
      console.error(`Error getting player progress for user ${userId}:`, error);
      return undefined;
    }
  }
  
  async createPlayerProgress(data: any): Promise<any> {
    console.log(`Creating player progress for user ID: ${data.userId}`);
    
    try {
      // Check if a star path already exists for this user
      const existingStarPath = await this.getAthleteStarPath(data.userId);
      
      if (existingStarPath) {
        // If star path already exists, just return the player progress
        return this.getPlayerProgress(data.userId);
      }
      
      // If no star path exists, create one
      const starPath = await this.createAthleteStarPath({
        userId: data.userId,
        currentStarLevel: 1,
        targetStarLevel: 2,
        storylinePhase: "beginning",
        progress: 0,
        sportType: data.sportType || "basketball", // Default sport
        position: data.position || null,
        xpTotal: data.totalXp || 0,
        storylineActive: true,
        streakDays: 0,
        completedDrills: 0,
        verifiedWorkouts: 0,
        skillTreeProgress: 0,
        physicalAttributes: {
          speed: 50,
          strength: 50,
          agility: 50,
          endurance: 50,
          verticalJump: 50
        },
        technicalAttributes: {
          technique: 50,
          ballControl: 50,
          accuracy: 50,
          gameIQ: 50
        },
        mentalAttributes: {
          focus: 50,
          confidence: 50,
          determination: 50,
          teamwork: 50
        },
        levelThresholds: [0, 1000, 3000, 6000, 10000, 15000],
        lastUpdated: new Date()
      });
      
      // Return the newly created progress data
      return this.getPlayerProgress(data.userId);
    } catch (error) {
      console.error("Error creating player progress:", error);
      return null;
    }
  }
  
  async updatePlayerProgress(userId: number, data: any): Promise<any> {
    console.log(`Updating player progress for user ID: ${userId}`);
    
    try {
      // Check if star path exists
      const starPath = await this.getAthleteStarPath(userId);
      
      if (!starPath) {
        // If star path doesn't exist, create player progress first
        return this.createPlayerProgress({
          userId,
          sportType: data.sportType,
          position: data.position,
          totalXp: data.totalXp
        });
      }
      
      // Prepare update data
      const updateData: Partial<AthleteStarPath> = {
        lastUpdated: new Date()
      };
      
      // Update various attributes if provided
      if (data.sportType) updateData.sportType = data.sportType;
      if (data.position) updateData.position = data.position;
      if (data.currentStarLevel) updateData.currentStarLevel = data.currentStarLevel;
      if (data.targetStarLevel) updateData.targetStarLevel = data.targetStarLevel;
      if (data.storylinePhase) updateData.storylinePhase = data.storylinePhase;
      if (data.progress !== undefined) updateData.progress = data.progress;
      if (data.totalXp) updateData.xpTotal = data.totalXp;
      if (data.streakDays !== undefined) updateData.streakDays = data.streakDays;
      if (data.completedDrills) updateData.completedDrills = data.completedDrills;
      if (data.verifiedWorkouts) updateData.verifiedWorkouts = data.verifiedWorkouts;
      if (data.skillTreeProgress) updateData.skillTreeProgress = data.skillTreeProgress;
      if (data.physicalAttributes) updateData.physicalAttributes = {
        ...starPath.physicalAttributes,
        ...data.physicalAttributes
      };
      if (data.technicalAttributes) updateData.technicalAttributes = {
        ...starPath.technicalAttributes,
        ...data.technicalAttributes
      };
      if (data.mentalAttributes) updateData.mentalAttributes = {
        ...starPath.mentalAttributes,
        ...data.mentalAttributes
      };
      if (data.nextMilestone) updateData.nextMilestone = data.nextMilestone;
      
      // Update the star path
      await this.updateAthleteStarPath(userId, updateData);
      
      // Return the updated player progress
      return await this.getPlayerProgress(userId);
    } catch (error) {
      console.error("Error updating player progress:", error);
      return null;
    }
  }

  async createAthleteStarPath(data: InsertAthleteStarPath): Promise<AthleteStarPath> {
    try {
      // Set default values if not provided
      const pathData = {
        ...data,
        currentStarLevel: data.currentStarLevel || 1,
        targetStarLevel: data.targetStarLevel || 2,
        storylinePhase: data.storylinePhase || "beginning",
        progress: data.progress || 0,
        xpTotal: data.xpTotal || 0,
        completedDrills: data.completedDrills || 0,
        verifiedWorkouts: data.verifiedWorkouts || 0,
        skillTreeProgress: data.skillTreeProgress || 0,
        physicalAttributes: data.physicalAttributes || {
          speed: 50,
          strength: 50,
          agility: 50,
          endurance: 50,
          verticalJump: 50
        },
        technicalAttributes: data.technicalAttributes || {
          technique: 50,
          ballControl: 50,
          accuracy: 50,
          gameIQ: 50
        },
        mentalAttributes: data.mentalAttributes || {
          focus: 50,
          confidence: 50,
          determination: 50,
          teamwork: 50
        },
        levelThresholds: data.levelThresholds || [0, 1000, 3000, 6000, 10000, 15000]
      };

      const [createdPath] = await db.insert(athleteStarPath).values(pathData).returning();
      return createdPath;
    } catch (error) {
      console.error("Error creating athlete star path:", error);
      throw error;
    }
  }

  async updateAthleteStarPath(userId: number, data: Partial<AthleteStarPath>): Promise<AthleteStarPath> {
    try {
      const [updatedPath] = await db.update(athleteStarPath)
        .set(data)
        .where(eq(athleteStarPath.userId, userId))
        .returning();
      
      if (!updatedPath) {
        throw new Error(`No star path found for user ID ${userId}`);
      }
      
      return updatedPath;
    } catch (error) {
      console.error(`Error updating athlete star path for user ${userId}:`, error);
      throw error;
    }
  }
  

  
  // -------------------------
  // Workout Verification Methods
  // -------------------------
  
  async getWorkoutVerification(id: number): Promise<any | undefined> {
    try {
      // Query using raw SQL to get around schema discrepancies
      const result = await db.execute(sql`
        SELECT * FROM workout_verifications WHERE id = ${id}
      `);
      
      if (result.length > 0) {
        return result[0];
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching workout verification:", error);
      return undefined;
    }
  }
  
  async getWorkoutVerifications(userId: number, limit: number = 50): Promise<any[]> {
    try {
      // Query using raw SQL to get around schema discrepancies
      const result = await db.execute(sql`
        SELECT * FROM workout_verifications 
        WHERE user_id = ${userId}
        ORDER BY submission_date DESC
        LIMIT ${limit}
      `);
      
      return result;
    } catch (error) {
      console.error("Error fetching workout verifications:", error);
      return [];
    }
  }
  
  async getPendingWorkoutVerifications(userId: number): Promise<any[]> {
    try {
      // Query using raw SQL to get around schema discrepancies
      const result = await db.execute(sql`
        SELECT * FROM workout_verifications 
        WHERE user_id = ${userId} AND verification_status = 'pending'
        ORDER BY submission_date DESC
      `);
      
      return result;
    } catch (error) {
      console.error("Error fetching pending workout verifications:", error);
      return [];
    }
  }
  
  async createWorkoutVerification(data: any): Promise<any> {
    try {
      // Format the data for the actual database schema
      const values = {
        user_id: data.userId,
        title: data.title || "Workout Verification",
        workout_type: data.workoutType || data.exerciseType || "general",
        verification_status: data.status || "pending",
        submission_date: new Date(),
        duration: data.duration || 0,
        proof_type: data.proofType || "video",
        proof_data: data.videoUrl || data.proofData,
        notes: data.feedback || data.notes,
        verification_method: data.verificationMethod || "ai"
      };
      
      // Insert using raw SQL to get around schema discrepancies
      const result = await db.execute(sql`
        INSERT INTO workout_verifications 
        (user_id, title, workout_type, verification_status, submission_date, duration, proof_type, proof_data, notes, verification_method)
        VALUES 
        (${values.user_id}, ${values.title}, ${values.workout_type}, ${values.verification_status}, 
         ${values.submission_date}, ${values.duration}, ${values.proof_type}, ${values.proof_data}, ${values.notes}, ${values.verification_method})
        RETURNING *
      `);
      
      return result[0];
    } catch (error) {
      console.error("Error creating workout verification:", error);
      throw error;
    }
  }
  
  async updateWorkoutVerification(id: number, data: any): Promise<any> {
    try {
      // Build an update SQL statement based on provided fields
      let updateFields = [];
      let params = [];
      
      if (data.verification_status !== undefined) {
        updateFields.push('verification_status = ?');
        params.push(data.verification_status);
      }
      
      if (data.verified_by !== undefined) {
        updateFields.push('verified_by = ?');
        params.push(data.verified_by);
      }
      
      if (data.verification_date !== undefined) {
        updateFields.push('verification_date = ?');
        params.push(data.verification_date);
      }
      
      if (data.notes !== undefined) {
        updateFields.push('notes = ?');
        params.push(data.notes);
      }
      
      if (data.xp_earned !== undefined) {
        updateFields.push('xp_earned = ?');
        params.push(data.xp_earned);
      }
      
      if (updateFields.length === 0) {
        throw new Error("No valid fields provided for update");
      }
      
      // Update using raw SQL to get around schema discrepancies
      const updateSql = `
        UPDATE workout_verifications 
        SET ${updateFields.join(', ')}
        WHERE id = ?
        RETURNING *
      `;
      params.push(id);
      
      const result = await db.execute(sql.raw(updateSql, params));
      
      if (result.length === 0) {
        throw new Error("Workout verification not found");
      }
      
      return result[0];
    } catch (error) {
      console.error("Error updating workout verification:", error);
      throw error;
    }
  }
  
  async verifyWorkout(id: number, verificationData: any): Promise<any> {
    try {
      // Data to update for verification
      const updateData = {
        verification_status: "approved",
        verification_date: new Date(),
        xp_earned: verificationData.xpEarned || 100,
        notes: verificationData.feedback || "Verified by AI system"
      };
      
      // Update the workout verification
      const verifiedWorkout = await this.updateWorkoutVerification(id, updateData);
      
      // Add XP to player's account if needed
      if (updateData.xp_earned > 0) {
        try {
          await this.addXpToPlayer(
            verifiedWorkout.user_id, 
            updateData.xp_earned, 
            "workout_verification", 
            `Completed ${verifiedWorkout.workout_type} workout verification`,
            String(id)
          );
        } catch (error) {
          console.error("Error adding XP to player:", error);
          // Continue even if XP addition fails
        }
      }
      
      return verifiedWorkout;
    } catch (error) {
      console.error("Error verifying workout:", error);
      throw error;
    }
  }
  
  async getWorkoutVerificationCheckpoints(verificationId: number): Promise<any[]> {
    try {
      // Query for workout verification checkpoints
      const result = await db.execute(sql`
        SELECT * FROM workout_verification_checkpoints 
        WHERE verification_id = ${verificationId}
        ORDER BY checkpoint_order ASC
      `);
      
      return result;
    } catch (error) {
      console.error("Error fetching workout verification checkpoints:", error);
      return [];
    }
  }
  
  async createWorkoutCheckpoint(data: any): Promise<any> {
    try {
      // Format data for insertion
      const values = {
        verification_id: data.verificationId,
        exercise_name: data.exerciseName,
        is_completed: data.isCompleted || false,
        completed_amount: data.completedAmount || 0,
        target_amount: data.targetAmount,
        feedback: data.feedback,
        media_proof: data.mediaProof,
        checkpoint_order: data.checkpointOrder
      };
      
      // Insert using raw SQL
      const result = await db.execute(sql`
        INSERT INTO workout_verification_checkpoints 
        (verification_id, exercise_name, is_completed, completed_amount, target_amount, feedback, media_proof, checkpoint_order)
        VALUES 
        (${values.verification_id}, ${values.exercise_name}, ${values.is_completed}, 
         ${values.completed_amount}, ${values.target_amount}, ${values.feedback}, 
         ${values.media_proof}, ${values.checkpoint_order})
        RETURNING *
      `);
      
      return result[0];
    } catch (error) {
      console.error("Error creating workout checkpoint:", error);
      throw error;
    }
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
  
  // Star Path operations
  async getStarPathByUserId(userId: number): Promise<AthleteStarPath | undefined> {
    try {
      const [starPath] = await db.select()
        .from(athleteStarPath)
        .where(eq(athleteStarPath.userId, userId));
      
      return starPath;
    } catch (error) {
      console.error('Error fetching star path:', error);
      return undefined;
    }
  }
  
  async createStarPath(data: any): Promise<AthleteStarPath> {
    try {
      // Check if star path already exists
      const existingStarPath = await this.getStarPathByUserId(data.userId);
      if (existingStarPath) {
        return existingStarPath;
      }
      
      // Create new star path
      const [starPath] = await db.insert(athleteStarPath)
        .values({
          userId: data.userId,
          sportType: data.sportType,
          position: data.position || '',
          currentStarLevel: data.currentStarLevel || 1,
          starXp: data.starXp || 0,
          attributes: data.attributes || {},
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return starPath;
    } catch (error) {
      console.error('Error creating star path:', error);
      throw error;
    }
  }
  
  async updateStarPath(id: number, data: any): Promise<AthleteStarPath> {
    try {
      // Update star path
      const [updatedStarPath] = await db.update(athleteStarPath)
        .set({
          sportType: data.sportType !== undefined ? data.sportType : undefined,
          position: data.position !== undefined ? data.position : undefined,
          currentStarLevel: data.currentStarLevel !== undefined ? data.currentStarLevel : undefined,
          starXp: data.starXp !== undefined ? data.starXp : undefined,
          attributes: data.attributes !== undefined ? data.attributes : undefined,
          updatedAt: new Date()
        })
        .where(eq(athleteStarPath.id, id))
        .returning();
      
      return updatedStarPath;
    } catch (error) {
      console.error('Error updating star path:', error);
      throw error;
    }
  }
  
  // Player XP Transaction operations
  async createPlayerXpTransaction(data: any): Promise<any> {
    try {
      // For now, we'll store these in memory, but a real implementation would store in the database
      const userId = data.userId;
      
      if (!this._xpTransactions[userId]) {
        this._xpTransactions[userId] = [];
      }
      
      const transaction = {
        id: this._xpTransactions[userId].length + 1,
        userId,
        amount: data.amount,
        source: data.source,
        description: data.description,
        timestamp: new Date()
      };
      
      this._xpTransactions[userId].push(transaction);
      
      return transaction;
    } catch (error) {
      console.error('Error creating XP transaction:', error);
      throw error;
    }
  }
  
  async getPlayerXpTransactions(userId: number): Promise<any[]> {
    try {
      return this._xpTransactions[userId] || [];
    } catch (error) {
      console.error('Error fetching XP transactions:', error);
      return [];
    }
  }
  
  // Video operations by user ID
  async getVideosByUserId(userId: number): Promise<Video[]> {
    try {
      return await this.getVideosByUser(userId);
    } catch (error) {
      console.error('Error fetching videos by user ID:', error);
      return [];
    }
  }
  
  // Delete a video
  async deleteVideo(id: number): Promise<boolean> {
    try {
      await db.delete(videos)
        .where(eq(videos.id, id));
      
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
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

  async getUserStreakDays(userId: number): Promise<number> {
    try {
      // Get the last 30 days of workout verifications
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Query using raw SQL to get all workout verifications in the last 30 days
      const result = await db.execute(sql`
        SELECT submission_date 
        FROM workout_verifications 
        WHERE user_id = ${userId} 
        AND verification_status = 'approved'
        AND submission_date >= ${thirtyDaysAgo.toISOString()}
        ORDER BY submission_date DESC
      `);
      
      if (result.length === 0) {
        return 0;
      }
      
      // Check if there's a verification in the last 2 days to consider streak active
      const lastVerification = new Date(result[0].submission_date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastVerification.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 2) {
        // Streak is broken if no workout in last 2 days
        return 0;
      }
      
      // Calculate consecutive days
      let streak = 1; // Start with 1 for the most recent day
      let lastDate = new Date(result[0].submission_date);
      lastDate.setHours(0, 0, 0, 0); // Normalize to start of day
      
      for (let i = 1; i < result.length; i++) {
        const currentDate = new Date(result[i].submission_date);
        currentDate.setHours(0, 0, 0, 0); // Normalize to start of day
        
        // Check if the current date is the day before the last date
        const expectedPreviousDate = new Date(lastDate);
        expectedPreviousDate.setDate(expectedPreviousDate.getDate() - 1);
        
        if (
          currentDate.getDate() === expectedPreviousDate.getDate() &&
          currentDate.getMonth() === expectedPreviousDate.getMonth() &&
          currentDate.getFullYear() === expectedPreviousDate.getFullYear()
        ) {
          streak++;
          lastDate = currentDate;
        } else if (
          currentDate.getDate() === lastDate.getDate() &&
          currentDate.getMonth() === lastDate.getMonth() &&
          currentDate.getFullYear() === lastDate.getFullYear()
        ) {
          // Same day, continue with last date
          continue;
        } else {
          // Streak broken
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error("Error calculating streak days:", error);
      return 0;
    }
  }
  
  async addXpToPlayer(userId: number, amount: number, source: string, reason: string, metadata?: any): Promise<any> {
    console.log(`Adding ${amount} XP to user ID: ${userId} from ${source}: ${reason}`);
    
    try {
      // First, try to update the player's athlete star path
      const starPath = await this.getAthleteStarPath(userId);
      
      if (starPath) {
        // Update star path with additional XP
        await this.updateAthleteStarPath(userId, {
          xpTotal: (starPath.xpTotal || 0) + amount,
          lastUpdated: new Date()
        });
      }
      
      // Create an XP transaction record with default values
      const transaction = {
        userId,
        amount,
        source,
        reason,
        timestamp: new Date().toISOString(),
        metadata: metadata ? JSON.stringify(metadata) : null
      };
      
      // Store this transaction in memory until we implement the XP transactions table
      if (!this._xpTransactions) {
        this._xpTransactions = {};
      }
      
      if (!this._xpTransactions[userId]) {
        this._xpTransactions[userId] = [];
      }
      
      // Add the transaction to the user's transaction history
      this._xpTransactions[userId].unshift(transaction);
      
      // Keep only the most recent 20 transactions
      if (this._xpTransactions[userId].length > 20) {
        this._xpTransactions[userId] = this._xpTransactions[userId].slice(0, 20);
      }
      
      return transaction;
    } catch (error) {
      console.error("Error adding XP to player:", error);
      return {
        userId,
        amount,
        source,
        reason,
        timestamp: new Date().toISOString(),
        metadata: metadata ? JSON.stringify(metadata) : null
      };
    }
  }
  
  async getXpTransactions(userId: number): Promise<any[]> {
    console.log(`Getting XP transactions for user ID: ${userId}`);
    
    // Return stored transactions if they exist
    if (this._xpTransactions && this._xpTransactions[userId]) {
      return this._xpTransactions[userId];
    }
    
    // Return a default empty array if no transactions exist yet
    return [];
  }
  
  async getPlayerBadges(userId: number): Promise<any[]> {
    console.log(`Getting badges for player ID: ${userId}`);
    
    try {
      // Try to get the star path to determine appropriate badges
      const starPath = await this.getAthleteStarPath(userId);
      
      if (!starPath) {
        return [];
      }
      
      // Create badges based on star level and other achievements
      const badges = [];
      
      // Star level badges
      if (starPath.currentStarLevel >= 1) {
        badges.push({
          id: 'star-1',
          name: 'Rising Prospect',
          description: 'Earned your first star rating',
          category: 'star-level',
          dateEarned: starPath.storylineStarted,
          icon: 'star'
        });
      }
      
      if (starPath.currentStarLevel >= 2) {
        badges.push({
          id: 'star-2',
          name: 'Emerging Talent',
          description: 'Achieved 2-star athlete status',
          category: 'star-level',
          dateEarned: starPath.lastUpdated,
          icon: 'award'
        });
      }
      
      if (starPath.currentStarLevel >= 3) {
        badges.push({
          id: 'star-3',
          name: 'Standout Performer',
          description: 'Reached 3-star athlete level',
          category: 'star-level',
          dateEarned: starPath.lastUpdated,
          icon: 'trophy'
        });
      }
      
      if (starPath.currentStarLevel >= 4) {
        badges.push({
          id: 'star-4',
          name: 'Elite Prospect',
          description: 'Achieved 4-star elite status',
          category: 'star-level',
          dateEarned: starPath.lastUpdated,
          icon: 'medal'
        });
      }
      
      if (starPath.currentStarLevel >= 5) {
        badges.push({
          id: 'star-5',
          name: 'Five-Star Athlete',
          description: 'Reached the pinnacle 5-star level',
          category: 'star-level',
          dateEarned: starPath.lastUpdated,
          icon: 'crown'
        });
      }
      
      // Add workout verification badges if applicable
      if (starPath.verifiedWorkouts && starPath.verifiedWorkouts > 0) {
        badges.push({
          id: 'workout-starter',
          name: 'Workout Starter',
          description: 'Completed your first verified workout',
          category: 'workout',
          dateEarned: starPath.lastUpdated,
          icon: 'dumbbell'
        });
      }
      
      if (starPath.verifiedWorkouts && starPath.verifiedWorkouts >= 10) {
        badges.push({
          id: 'workout-committed',
          name: 'Workout Committed',
          description: 'Completed 10 verified workouts',
          category: 'workout',
          dateEarned: starPath.lastUpdated,
          icon: 'flame'
        });
      }
      
      if (starPath.verifiedWorkouts && starPath.verifiedWorkouts >= 50) {
        badges.push({
          id: 'workout-master',
          name: 'Workout Master',
          description: 'Completed 50 verified workouts',
          category: 'workout',
          dateEarned: starPath.lastUpdated,
          icon: 'zap'
        });
      }
      
      // Add skill tree badges if applicable
      if (starPath.skillTreeProgress && starPath.skillTreeProgress > 0) {
        badges.push({
          id: 'skill-tree-explorer',
          name: 'Skill Explorer',
          description: 'Started developing skills in the Skill Tree',
          category: 'skill',
          dateEarned: starPath.lastUpdated,
          icon: 'git-branch'
        });
      }
      
      if (starPath.skillTreeProgress && starPath.skillTreeProgress >= 50) {
        badges.push({
          id: 'skill-tree-adept',
          name: 'Skill Adept',
          description: 'Made significant progress in the Skill Tree',
          category: 'skill',
          dateEarned: starPath.lastUpdated,
          icon: 'lightbulb'
        });
      }
      
      return badges;
    } catch (error) {
      console.error("Error getting player badges:", error);
      return [];
    }
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
        
        // Add the sport_type condition if provided
        if (sportType) {
          conditions.push(eq(skillTreeNodes.sport_type, sportType));
        }
        
        // Add the position condition if provided
        if (position) {
          conditions.push(eq(skillTreeNodes.position, position));
        }
        
        // Apply all conditions if any
        let finalQuery = query;
        if (conditions.length > 0) {
          finalQuery = finalQuery.where(and(...conditions));
        }
        
        // Order by level 
        return await finalQuery.orderBy(asc(skillTreeNodes.level));
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
  
  async getRootSkillTreeNodes(sportType?: string, position?: string): Promise<SkillTreeNode[]> {
    try {
      // First get all skill tree nodes based on sport and position filters
      const allNodes = await this.getSkillTreeNodes(sportType, position);
      
      // Get all relationships to find child nodes
      const relationships = await this.getSkillTreeRelationships();
      
      // Create a set of all node IDs that are children in relationships
      const childNodeIds = new Set(relationships.map(rel => rel.child_id));
      
      // Root nodes are those that don't appear as children in any relationship
      const rootNodes = allNodes.filter(node => !childNodeIds.has(node.id));
      
      return rootNodes;
    } catch (error) {
      console.error('Error in getRootSkillTreeNodes:', error);
      return [];
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
        
        // Add is_active condition if exists
        try {
          conditions.push(eq(skillTreeNodes.is_active, true));
        } catch (err) {
          console.warn('is_active column not found on skillTreeNodes table');
          // Continue without is_active filter
        }
        
        // Execute query with appropriate conditions
        let query = db.select().from(skillTreeNodes);
        
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        
        try {
          return await query.orderBy(asc(skillTreeNodes.sort_order));
        } catch (err) {
          console.warn('sort_order column not found on skillTreeNodes table, returning unordered results');
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
        childId: skillTreeRelationships.child_id
      })
      .from(skillTreeRelationships)
      .where(eq(skillTreeRelationships.parent_id, parentNodeId));
      
      if (relationships.length === 0) {
        return [];
      }
      
      const childIds = relationships.map(r => r.childId);
      
      return await db.select()
        .from(skillTreeNodes)
        .where(
          and(
            inArray(skillTreeNodes.id, childIds),
            eq(skillTreeNodes.is_active, true)
          )
        )
        .orderBy(asc(skillTreeNodes.level), asc(skillTreeNodes.sort_order));
    } catch (error) {
      console.error(`Error fetching child skill nodes for parent ID ${parentNodeId}:`, error);
      return [];
    }
  }

  async getParentSkillNodes(childNodeId: number): Promise<SkillTreeNode[]> {
    try {
      const relationships = await db.select({
        parentId: skillTreeRelationships.parent_id
      })
      .from(skillTreeRelationships)
      .where(eq(skillTreeRelationships.child_id, childNodeId));
      
      if (relationships.length === 0) {
        return [];
      }
      
      const parentIds = relationships.map(r => r.parentId);
      
      return await db.select()
        .from(skillTreeNodes)
        .where(
          and(
            inArray(skillTreeNodes.id, parentIds),
            eq(skillTreeNodes.is_active, true)
          )
        )
        .orderBy(asc(skillTreeNodes.level), asc(skillTreeNodes.sort_order));
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
        
        // Add sport_type filter if provided and column exists
        if (sportType) {
          try {
            conditions.push(eq(trainingDrills.sport_type, sportType));
          } catch (err) {
            console.warn('sport_type column not found on trainingDrills table');
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

  async getUserSkillsByNodeIds(userId: number, nodeIds: number[]): Promise<Skill[]> {
    try {
      // Check if skills table exists and has necessary columns
      if (typeof skills === 'undefined' || !skills) {
        console.warn(`skills table not found when looking for skills with node IDs for user ${userId}`);
        return [];
      }
      
      // Return skills that match both the user ID and any of the skill node IDs
      return await db.select()
        .from(skills)
        .where(
          and(
            eq(skills.userId, userId),
            inArray(skills.skillNodeId, nodeIds)
          )
        );
    } catch (error) {
      console.error(`Error fetching skills for user ID ${userId} with node IDs:`, error);
      return [];
    }
  }

  async getUserSkillByNodeId(userId: number, nodeId: number): Promise<Skill | undefined> {
    try {
      // Check if skills table exists
      if (typeof skills === 'undefined' || !skills) {
        console.warn(`skills table not found when looking for skill with node ID ${nodeId} for user ${userId}`);
        return undefined;
      }
      
      const [skill] = await db.select()
        .from(skills)
        .where(
          and(
            eq(skills.userId, userId),
            eq(skills.skillNodeId, nodeId)
          )
        );
      
      return skill;
    } catch (error) {
      console.error(`Error fetching skill for user ID ${userId} with node ID ${nodeId}:`, error);
      return undefined;
    }
  }

  async updateUserSkill(userId: number, skillNodeId: number, data: Partial<Skill>): Promise<Skill> {
    try {
      // Check if skill exists first
      let skill = await this.getUserSkillByNodeId(userId, skillNodeId);
      
      if (skill) {
        // Update existing skill
        const [updatedSkill] = await db.update(skills)
          .set({
            ...data,
            lastUpdated: new Date()
          })
          .where(
            and(
              eq(skills.userId, userId),
              eq(skills.skillNodeId, skillNodeId)
            )
          )
          .returning();
        
        return updatedSkill;
      } else {
        // Create new skill if it doesn't exist
        const [newSkill] = await db.insert(skills)
          .values({
            userId,
            skillNodeId,
            progress: 0,
            level: 1,
            xp: 0,
            ...data,
            createdAt: new Date(),
            lastUpdated: new Date()
          })
          .returning();
        
        return newSkill;
      }
    } catch (error) {
      console.error(`Error updating skill for user ID ${userId} with node ID ${skillNodeId}:`, error);
      throw error;
    }
  }

  async getTrainingDrillsBySkillNode(skillNodeId: number): Promise<TrainingDrill[]> {
    try {
      // Check if trainingDrills table exists
      if (typeof trainingDrills === 'undefined' || !trainingDrills) {
        console.warn(`trainingDrills table not found when looking for drills with skill node ID ${skillNodeId}`);
        return [];
      }
      
      return await db.select()
        .from(trainingDrills)
        .where(eq(trainingDrills.skillNodeId, skillNodeId))
        .orderBy(trainingDrills.difficulty);
    } catch (error) {
      console.error(`Error fetching training drills for skill node ID ${skillNodeId}:`, error);
      return [];
    }
  }

  async createDrillCompletion(data: InsertUserDrillProgress): Promise<UserDrillProgress> {
    try {
      // Create new drill completion progress record
      const [drillProgress] = await db.insert(userDrillProgress)
        .values({
          ...data,
          completedAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      // If the drill is linked to a skill node, update the user's skill progress
      if (drillProgress.skillNodeId) {
        try {
          const skill = await this.getUserSkillByNodeId(drillProgress.userId, drillProgress.skillNodeId);
          
          if (skill) {
            // Update the existing skill with some XP gain
            const xpGain = drillProgress.score || 10; // Default 10 XP if no score is provided
            
            await this.updateUserSkill(drillProgress.userId, drillProgress.skillNodeId, {
              xp: skill.xp + xpGain,
              progress: Math.min(100, skill.progress + (drillProgress.progressPercentage || 5)), // Default 5% progress if not specified
              completedDrills: (skill.completedDrills || 0) + 1,
              lastUpdated: new Date()
            });
          }
        } catch (skillError) {
          console.warn(`Failed to update skill for drill completion, but drill progress was recorded:`, skillError);
        }
      }
      
      return drillProgress;
    } catch (error) {
      console.error(`Error creating drill completion progress:`, error);
      throw error;
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
  
  // Combine Event Registration operations
  async getCombineEventRegistrations(eventId: number): Promise<Registration[]> {
    return this.getRegistrationsByEvent(eventId);
  }
  
  async getCombineEventRegistrationsByUser(userId: number): Promise<Registration[]> {
    return this.getRegistrationsByUser(userId);
  }
  
  async getCombineEventRegistration(userId: number, eventId: number): Promise<Registration | undefined> {
    try {
      const [registrationData] = await db.select()
        .from(registrations)
        .where(
          and(
            eq(registrations.userId, userId),
            eq(registrations.eventId, eventId)
          )
        );
      return registrationData;
    } catch (error) {
      console.error('Database error in getCombineEventRegistration:', error);
      return undefined;
    }
  }
  
  async createCombineEventRegistration(registration: InsertRegistration): Promise<Registration> {
    return this.createRegistration(registration);
  }
  
  async updateCombineEventRegistration(id: number, data: Partial<Registration>): Promise<Registration | undefined> {
    return this.updateRegistration(id, data);
  }
  
  async cancelCombineEventRegistration(userId: number, eventId: number): Promise<boolean> {
    try {
      const registration = await this.getCombineEventRegistration(userId, eventId);
      if (!registration) {
        return false;
      }
      
      // Update status to cancelled instead of deleting
      const updated = await this.updateRegistration(registration.id, {
        status: "cancelled",
        cancelledAt: new Date()
      });
      
      return !!updated;
    } catch (error) {
      console.error('Database error in cancelCombineEventRegistration:', error);
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

  // Anthropic AI Coach methods
  getAnthropicTrainingPlan(id: number): Promise<AnthropicTrainingPlan | undefined>;
  getAnthropicTrainingPlansByUserId(userId: number): Promise<AnthropicTrainingPlan[]>;
  createAnthropicTrainingPlan(plan: InsertAnthropicTrainingPlan): Promise<AnthropicTrainingPlan>;
  updateAnthropicTrainingPlan(id: number, data: Partial<AnthropicTrainingPlan>): Promise<AnthropicTrainingPlan | undefined>;
  completeAnthropicTrainingPlanDay(id: number, dayNumber: number): Promise<AnthropicTrainingPlan | undefined>;
  finishAnthropicTrainingPlan(id: number, rating: number, feedback: string): Promise<AnthropicTrainingPlan | undefined>;
  
  // Hybrid AI Coach methods (using both Claude and GPT)
  getHybridCoachingResponse(userId: number, message: string, modelPreference?: 'claude' | 'gpt' | 'both'): Promise<{message: string, source: string}>;
  getPersonalizedTrainingAdvice(userId: number, sport: string, skillLevel: string, focusArea: string): Promise<{advice: string, drills: any[], source: string}>;
}

export const storage = new DatabaseStorage();