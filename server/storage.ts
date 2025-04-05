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
  // New imports for story mode components
  skills, type Skill, type InsertSkill,
  challenges, type Challenge, type InsertChallenge,
  athleteChallenges, type AthleteChallenge, type InsertAthleteChallenge,
  recoveryLogs, type RecoveryLog, type InsertRecoveryLog,
  fanClubFollowers, type FanClubFollower, type InsertFanClubFollower,
  leaderboardEntries, type LeaderboardEntry, type InsertLeaderboardEntry,
  // New imports for blog and featured athletes
  blogPosts, type BlogPost, type InsertBlogPost,
  featuredAthletes, type FeaturedAthlete, type InsertFeaturedAthlete,
  // New imports for workout playlists
  workoutPlaylists, type WorkoutPlaylist, type InsertWorkoutPlaylist,
  workoutExercises, type WorkoutExercise, type InsertWorkoutExercise,
  // Film comparison imports
  filmComparisons, type FilmComparison, type InsertFilmComparison,
  comparisonVideos, type ComparisonVideo, type InsertComparisonVideo,
  comparisonAnalyses, type ComparisonAnalysis, type InsertComparisonAnalysis,
  // Spotlight profiles
  spotlightProfiles, type SpotlightProfile, type InsertSpotlightProfile,
  // MyPlayer XP system 
  playerProgress, type PlayerProgress, type InsertPlayerProgress,
  xpTransactions, type XpTransaction, type InsertXpTransaction,
  playerBadges, type PlayerBadge, type InsertPlayerBadge,
  // Workout verification 
  workoutVerifications, type WorkoutVerification, type InsertWorkoutVerification,
  workoutVerificationCheckpoints, type WorkoutVerificationCheckpoint, type InsertWorkoutVerificationCheckpoint,
  // Weight room equipment
  weightRoomEquipment, type WeightRoomEquipment, type InsertWeightRoomEquipment,
  playerEquipment, type PlayerEquipment, type InsertPlayerEquipment
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Athlete Profile operations
  getAthleteProfile(userId: number): Promise<AthleteProfile | undefined>;
  createAthleteProfile(profile: InsertAthleteProfile): Promise<AthleteProfile>;
  updateAthleteProfile(userId: number, data: Partial<AthleteProfile>): Promise<AthleteProfile | undefined>;
  
  // Coach Profile operations
  getCoachProfile(userId: number): Promise<CoachProfile | undefined>;
  createCoachProfile(profile: InsertCoachProfile): Promise<CoachProfile>;
  updateCoachProfile(userId: number, data: Partial<CoachProfile>): Promise<CoachProfile | undefined>;
  
  // Video operations
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUser(userId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, data: Partial<Video>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;
  
  // Video Analysis operations
  getVideoAnalysis(id: number): Promise<VideoAnalysis | undefined>;
  getVideoAnalysisByVideoId(videoId: number): Promise<VideoAnalysis | undefined>;
  createVideoAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis>;
  
  // Sport Recommendation operations
  getSportRecommendations(userId: number): Promise<SportRecommendation[]>;
  createSportRecommendation(recommendation: InsertSportRecommendation): Promise<SportRecommendation>;
  
  // NCAA Eligibility operations
  getNcaaEligibility(userId: number): Promise<NcaaEligibility | undefined>;
  createNcaaEligibility(eligibility: InsertNcaaEligibility): Promise<NcaaEligibility>;
  updateNcaaEligibility(userId: number, data: Partial<NcaaEligibility>): Promise<NcaaEligibility | undefined>;
  
  // Coach Connection operations
  getCoachConnections(userId: number, role: string): Promise<CoachConnection[]>;
  createCoachConnection(connection: InsertCoachConnection): Promise<CoachConnection>;
  updateCoachConnection(id: number, data: Partial<CoachConnection>): Promise<CoachConnection | undefined>;
  
  // Achievement operations
  getAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Message operations
  getMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllAthletes(): Promise<User[]>;
  getAllCoaches(): Promise<User[]>;
  getAllVideos(): Promise<Video[]>;
  getSystemStats(): Promise<{
    totalUsers: number;
    totalVideos: number;
    totalAnalyses: number;
    totalCoachConnections: number;
  }>;
  
  // Skill Tree operations
  getUserSkills(userId: number): Promise<Skill[]>;
  getUserSkillsByCategory(userId: number, category: string): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, data: Partial<Skill>): Promise<Skill | undefined>;
  
  // Challenges operations
  getChallenges(): Promise<Challenge[]>;
  getChallengesByCategory(category: string): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getAthleteChallenges(userId: number): Promise<AthleteChallenge[]>;
  getAthleteChallenge(id: number): Promise<AthleteChallenge | undefined>;
  createAthleteChallenge(athleteChallenge: InsertAthleteChallenge): Promise<AthleteChallenge>;
  updateAthleteChallenge(id: number, data: Partial<AthleteChallenge>): Promise<AthleteChallenge | undefined>;
  
  // Recovery Tracker operations
  getRecoveryLogs(userId: number): Promise<RecoveryLog[]>;
  getLatestRecoveryLog(userId: number): Promise<RecoveryLog | undefined>;
  createRecoveryLog(recoveryLog: InsertRecoveryLog): Promise<RecoveryLog>;
  
  // Fan Club operations
  getFanClubFollowers(athleteId: number): Promise<FanClubFollower[]>;
  getFanClubStats(athleteId: number): Promise<{
    totalFollowers: number;
    fans: number;
    recruiters: number;
    family: number;
    friends: number;
  }>;
  createFanClubFollower(follower: InsertFanClubFollower): Promise<FanClubFollower>;
  
  // Leaderboard operations
  getLeaderboardEntries(category: string): Promise<LeaderboardEntry[]>;
  getUserLeaderboardEntry(userId: number, category: string): Promise<LeaderboardEntry | undefined>;
  createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  updateLeaderboardEntry(id: number, data: Partial<LeaderboardEntry>): Promise<LeaderboardEntry | undefined>;

  // Blog operations
  getBlogPosts(limit?: number, offset?: number): Promise<BlogPost[]>;
  getFeaturedBlogPosts(limit?: number): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string, limit?: number): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Featured Athletes operations
  getFeaturedAthletes(limit?: number): Promise<FeaturedAthlete[]>;
  getFeaturedAthlete(id: number): Promise<FeaturedAthlete | undefined>;
  getFeaturedAthleteByUserId(userId: number): Promise<FeaturedAthlete | undefined>;
  createFeaturedAthlete(athlete: InsertFeaturedAthlete): Promise<FeaturedAthlete>;
  updateFeaturedAthlete(id: number, data: Partial<FeaturedAthlete>): Promise<FeaturedAthlete | undefined>;
  deactivateFeaturedAthlete(id: number): Promise<boolean>;
  
  // Workout Playlist operations
  getWorkoutPlaylists(userId: number): Promise<WorkoutPlaylist[]>;
  getWorkoutPlaylist(id: number): Promise<WorkoutPlaylist | undefined>;
  createWorkoutPlaylist(playlist: InsertWorkoutPlaylist): Promise<WorkoutPlaylist>;
  updateWorkoutPlaylist(id: number, data: Partial<WorkoutPlaylist>): Promise<WorkoutPlaylist | undefined>;
  deleteWorkoutPlaylist(id: number): Promise<boolean>;
  incrementPlaylistUsage(id: number): Promise<WorkoutPlaylist | undefined>;
  getWorkoutExercises(playlistId: number): Promise<WorkoutExercise[]>;
  createWorkoutExercise(exercise: InsertWorkoutExercise): Promise<WorkoutExercise>;
  updateWorkoutExercise(id: number, data: Partial<WorkoutExercise>): Promise<WorkoutExercise | undefined>;
  deleteWorkoutExercise(id: number): Promise<boolean>;
  getPublicWorkoutPlaylists(workoutType?: string, intensityLevel?: string): Promise<WorkoutPlaylist[]>;
  generateAIWorkoutPlaylist(userId: number, preferences: {
    workoutType: string;
    intensityLevel: string;
    duration: number;
    targets: string[];
    userProfile?: AthleteProfile;
  }): Promise<WorkoutPlaylist>;
  
  // Film Comparison operations
  getFilmComparisons(userId: number): Promise<FilmComparison[]>;
  getFilmComparison(id: number): Promise<FilmComparison | undefined>;
  createFilmComparison(comparison: InsertFilmComparison): Promise<FilmComparison>;
  updateFilmComparison(id: number, data: Partial<FilmComparison>): Promise<FilmComparison | undefined>;
  deleteFilmComparison(id: number): Promise<boolean>;
  getComparisonVideos(comparisonId: number): Promise<ComparisonVideo[]>;
  getComparisonVideo(id: number): Promise<ComparisonVideo | undefined>;
  createComparisonVideo(video: InsertComparisonVideo): Promise<ComparisonVideo>;
  updateComparisonVideo(id: number, data: Partial<ComparisonVideo>): Promise<ComparisonVideo | undefined>;
  deleteComparisonVideo(id: number): Promise<boolean>;
  getComparisonAnalysis(comparisonId: number): Promise<ComparisonAnalysis | undefined>;
  createComparisonAnalysis(analysis: InsertComparisonAnalysis): Promise<ComparisonAnalysis>;
  updateComparisonAnalysis(id: number, data: Partial<ComparisonAnalysis>): Promise<ComparisonAnalysis | undefined>;
  
  // NextUp Spotlight operations
  getSpotlightProfiles(limit?: number, offset?: number): Promise<SpotlightProfile[]>;
  getFeaturedSpotlightProfiles(limit?: number): Promise<SpotlightProfile[]>;
  getSpotlightProfilesByCategory(category: string, limit?: number): Promise<SpotlightProfile[]>;
  getSpotlightProfile(id: number): Promise<SpotlightProfile | undefined>;
  getSpotlightProfileByUserId(userId: number): Promise<SpotlightProfile | undefined>;
  createSpotlightProfile(profile: InsertSpotlightProfile): Promise<SpotlightProfile>;
  updateSpotlightProfile(id: number, data: Partial<SpotlightProfile>): Promise<SpotlightProfile | undefined>;
  deleteSpotlightProfile(id: number): Promise<boolean>;
  incrementSpotlightViews(id: number): Promise<SpotlightProfile | undefined>;
  likeSpotlightProfile(id: number): Promise<SpotlightProfile | undefined>;
  
  // MyPlayer XP System operations
  getPlayerProgress(userId: number): Promise<PlayerProgress | undefined>;
  createPlayerProgress(progress: InsertPlayerProgress): Promise<PlayerProgress>;
  updatePlayerProgress(userId: number, data: Partial<PlayerProgress>): Promise<PlayerProgress | undefined>;
  addXpToPlayer(userId: number, amount: number, type: string, description: string, sourceId?: string): Promise<{ 
    progress: PlayerProgress, 
    transaction: XpTransaction,
    leveledUp: boolean 
  }>;
  getXpTransactions(userId: number, limit?: number): Promise<XpTransaction[]>;
  getPlayerBadges(userId: number): Promise<PlayerBadge[]>;
  getPlayerBadgesByCategory(userId: number, category: string): Promise<PlayerBadge[]>;
  createPlayerBadge(badge: InsertPlayerBadge): Promise<PlayerBadge>;
  updatePlayerBadge(id: number, data: Partial<PlayerBadge>): Promise<PlayerBadge | undefined>;
  
  // MyPlayer Workout Verification operations
  getWorkoutVerifications(userId: number): Promise<WorkoutVerification[]>;
  getPendingWorkoutVerifications(): Promise<WorkoutVerification[]>;
  getWorkoutVerification(id: number): Promise<WorkoutVerification | undefined>;
  createWorkoutVerification(verification: InsertWorkoutVerification): Promise<WorkoutVerification>;
  updateWorkoutVerification(id: number, data: Partial<WorkoutVerification>): Promise<WorkoutVerification | undefined>;
  verifyWorkout(id: number, verifierId: number, status: string, notes?: string): Promise<WorkoutVerification | undefined>;
  getWorkoutVerificationCheckpoints(verificationId: number): Promise<WorkoutVerificationCheckpoint[]>;
  createWorkoutVerificationCheckpoint(checkpoint: InsertWorkoutVerificationCheckpoint): Promise<WorkoutVerificationCheckpoint>;
  updateWorkoutVerificationCheckpoint(id: number, data: Partial<WorkoutVerificationCheckpoint>): Promise<WorkoutVerificationCheckpoint | undefined>;
  
  // MyPlayer UI Weight Room operations
  getWeightRoomEquipment(category?: string): Promise<WeightRoomEquipment[]>;
  getWeightRoomEquipmentById(id: number): Promise<WeightRoomEquipment | undefined>;
  createWeightRoomEquipment(equipment: InsertWeightRoomEquipment): Promise<WeightRoomEquipment>;
  updateWeightRoomEquipment(id: number, data: Partial<WeightRoomEquipment>): Promise<WeightRoomEquipment | undefined>;
  getPlayerEquipment(userId: number): Promise<PlayerEquipment[]>;
  getPlayerEquipmentById(id: number): Promise<PlayerEquipment | undefined>;
  createPlayerEquipment(equipment: InsertPlayerEquipment): Promise<PlayerEquipment>;
  updatePlayerEquipment(id: number, data: Partial<PlayerEquipment>): Promise<PlayerEquipment | undefined>;
  incrementEquipmentUsage(id: number): Promise<PlayerEquipment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private athleteProfiles: Map<number, AthleteProfile>;
  private coachProfiles: Map<number, CoachProfile>;
  private videos: Map<number, Video>;
  private videoAnalyses: Map<number, VideoAnalysis>;
  private sportRecommendations: Map<number, SportRecommendation>;
  private ncaaEligibility: Map<number, NcaaEligibility>;
  private coachConnections: Map<number, CoachConnection>;
  private achievements: Map<number, Achievement>;
  private messages: Map<number, Message>;
  
  // Story mode components
  private skills: Map<number, Skill>;
  private challenges: Map<number, Challenge>;
  private athleteChallenges: Map<number, AthleteChallenge>;
  private recoveryLogs: Map<number, RecoveryLog>;
  private fanClubFollowers: Map<number, FanClubFollower>;
  private leaderboardEntries: Map<number, LeaderboardEntry>;
  
  // Content components
  private blogPosts: Map<number, BlogPost>;
  private featuredAthletes: Map<number, FeaturedAthlete>;
  
  // Workout playlist components
  private workoutPlaylists: Map<number, WorkoutPlaylist>;
  private workoutExercises: Map<number, WorkoutExercise>;
  
  // Film comparison components
  private filmComparisons: Map<number, FilmComparison>;
  private comparisonVideos: Map<number, ComparisonVideo>;
  private comparisonAnalyses: Map<number, ComparisonAnalysis>;
  
  // Spotlight profile components
  private spotlightProfiles: Map<number, SpotlightProfile>;
  
  // MyPlayer XP system components
  private playerProgress: Map<number, PlayerProgress>;
  private xpTransactions: Map<number, XpTransaction>;
  private playerBadges: Map<number, PlayerBadge>;
  
  // Workout verification components
  private workoutVerifications: Map<number, WorkoutVerification>;
  private workoutVerificationCheckpoints: Map<number, WorkoutVerificationCheckpoint>;
  
  // Weight room equipment components
  private weightRoomEquipment: Map<number, WeightRoomEquipment>;
  private playerEquipment: Map<number, PlayerEquipment>;
  
  private currentUserId: number;
  private currentAthleteProfileId: number;
  private currentCoachProfileId: number;
  private currentVideoId: number;
  private currentVideoAnalysisId: number;
  private currentSportRecommendationId: number;
  private currentNcaaEligibilityId: number;
  private currentCoachConnectionId: number;
  private currentAchievementId: number;
  private currentMessageId: number;
  private currentSkillId: number;
  private currentChallengeId: number;
  private currentAthleteChallengeId: number;
  private currentRecoveryLogId: number;
  private currentFanClubFollowerId: number;
  private currentLeaderboardEntryId: number;
  private currentBlogPostId: number;
  private currentFeaturedAthleteId: number;
  private currentWorkoutPlaylistId: number;
  private currentWorkoutExerciseId: number;
  
  // Film comparison IDs
  private currentFilmComparisonId: number;
  private currentComparisonVideoId: number;
  private currentComparisonAnalysisId: number;
  
  // Spotlight profile IDs
  private currentSpotlightProfileId: number;
  
  // MyPlayer XP system IDs
  private currentPlayerProgressId: number;
  private currentXpTransactionId: number;
  private currentPlayerBadgeId: number;
  
  // Workout verification IDs
  private currentWorkoutVerificationId: number;
  private currentWorkoutVerificationCheckpointId: number;
  
  // Weight room equipment IDs
  private currentWeightRoomEquipmentId: number;
  private currentPlayerEquipmentId: number;

  constructor() {
    this.users = new Map();
    this.athleteProfiles = new Map();
    this.coachProfiles = new Map();
    this.videos = new Map();
    this.videoAnalyses = new Map();
    this.sportRecommendations = new Map();
    this.ncaaEligibility = new Map();
    this.coachConnections = new Map();
    this.achievements = new Map();
    this.messages = new Map();
    
    // Initialize story mode component maps
    this.skills = new Map();
    this.challenges = new Map();
    this.athleteChallenges = new Map();
    this.recoveryLogs = new Map();
    this.fanClubFollowers = new Map();
    this.leaderboardEntries = new Map();
    
    // Initialize content component maps
    this.blogPosts = new Map();
    this.featuredAthletes = new Map();
    
    // Initialize workout playlist maps
    this.workoutPlaylists = new Map();
    this.workoutExercises = new Map();
    
    // Initialize film comparison maps
    this.filmComparisons = new Map();
    this.comparisonVideos = new Map();
    this.comparisonAnalyses = new Map();
    
    // Initialize spotlight profile maps
    this.spotlightProfiles = new Map();
    
    // Initialize MyPlayer XP system maps
    this.playerProgress = new Map();
    this.xpTransactions = new Map();
    this.playerBadges = new Map();
    
    // Initialize workout verification maps
    this.workoutVerifications = new Map();
    this.workoutVerificationCheckpoints = new Map();
    
    // Initialize weight room equipment maps
    this.weightRoomEquipment = new Map();
    this.playerEquipment = new Map();
    
    this.currentUserId = 1;
    this.currentAthleteProfileId = 1;
    this.currentCoachProfileId = 1;
    this.currentVideoId = 1;
    this.currentVideoAnalysisId = 1;
    this.currentSportRecommendationId = 1;
    this.currentNcaaEligibilityId = 1;
    this.currentCoachConnectionId = 1;
    this.currentAchievementId = 1;
    this.currentMessageId = 1;
    this.currentSkillId = 1;
    this.currentChallengeId = 1;
    this.currentAthleteChallengeId = 1;
    this.currentRecoveryLogId = 1;
    this.currentFanClubFollowerId = 1;
    this.currentLeaderboardEntryId = 1;
    this.currentBlogPostId = 1;
    this.currentFeaturedAthleteId = 1;
    this.currentWorkoutPlaylistId = 1;
    this.currentWorkoutExerciseId = 1;
    this.currentFilmComparisonId = 1;
    this.currentComparisonVideoId = 1;
    this.currentComparisonAnalysisId = 1;
    this.currentSpotlightProfileId = 1;
    this.currentPlayerProgressId = 1;
    this.currentXpTransactionId = 1;
    this.currentPlayerBadgeId = 1;
    this.currentWorkoutVerificationId = 1;
    this.currentWorkoutVerificationCheckpointId = 1;
    this.currentWeightRoomEquipmentId = 1;
    this.currentPlayerEquipmentId = 1;
    
    // Initialize with sample data for testing
    this.seedInitialData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Athlete Profile operations
  async getAthleteProfile(userId: number): Promise<AthleteProfile | undefined> {
    return Array.from(this.athleteProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createAthleteProfile(profile: InsertAthleteProfile): Promise<AthleteProfile> {
    const id = this.currentAthleteProfileId++;
    const athleteProfile: AthleteProfile = { ...profile, id };
    this.athleteProfiles.set(id, athleteProfile);
    return athleteProfile;
  }

  async updateAthleteProfile(userId: number, data: Partial<AthleteProfile>): Promise<AthleteProfile | undefined> {
    const profile = Array.from(this.athleteProfiles.values()).find(
      (profile) => profile.userId === userId
    );
    
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...data };
    this.athleteProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }
  
  // Coach Profile operations
  async getCoachProfile(userId: number): Promise<CoachProfile | undefined> {
    return Array.from(this.coachProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createCoachProfile(profile: InsertCoachProfile): Promise<CoachProfile> {
    const id = this.currentCoachProfileId++;
    const coachProfile: CoachProfile = { ...profile, id };
    this.coachProfiles.set(id, coachProfile);
    return coachProfile;
  }

  async updateCoachProfile(userId: number, data: Partial<CoachProfile>): Promise<CoachProfile | undefined> {
    const profile = Array.from(this.coachProfiles.values()).find(
      (profile) => profile.userId === userId
    );
    
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...data };
    this.coachProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }
  
  // Video operations
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideosByUser(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.userId === userId
    );
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const now = new Date();
    const newVideo: Video = { 
      ...video, 
      id, 
      uploadDate: now, 
      analyzed: false 
    };
    this.videos.set(id, newVideo);
    return newVideo;
  }

  async updateVideo(id: number, data: Partial<Video>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo = { ...video, ...data };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    return this.videos.delete(id);
  }
  
  // Video Analysis operations
  async getVideoAnalysis(id: number): Promise<VideoAnalysis | undefined> {
    return this.videoAnalyses.get(id);
  }

  async getVideoAnalysisByVideoId(videoId: number): Promise<VideoAnalysis | undefined> {
    return Array.from(this.videoAnalyses.values()).find(
      (analysis) => analysis.videoId === videoId
    );
  }

  async createVideoAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis> {
    const id = this.currentVideoAnalysisId++;
    const now = new Date();
    const videoAnalysis: VideoAnalysis = { ...analysis, id, analysisDate: now };
    this.videoAnalyses.set(id, videoAnalysis);
    
    // Update the video to mark it as analyzed
    const video = this.videos.get(analysis.videoId);
    if (video) {
      this.videos.set(analysis.videoId, { ...video, analyzed: true });
    }
    
    return videoAnalysis;
  }
  
  // Sport Recommendation operations
  async getSportRecommendations(userId: number): Promise<SportRecommendation[]> {
    return Array.from(this.sportRecommendations.values()).filter(
      (recommendation) => recommendation.userId === userId
    );
  }

  async createSportRecommendation(recommendation: InsertSportRecommendation): Promise<SportRecommendation> {
    const id = this.currentSportRecommendationId++;
    const now = new Date();
    const sportRecommendation: SportRecommendation = { 
      ...recommendation, 
      id, 
      recommendationDate: now 
    };
    this.sportRecommendations.set(id, sportRecommendation);
    return sportRecommendation;
  }
  
  // NCAA Eligibility operations
  async getNcaaEligibility(userId: number): Promise<NcaaEligibility | undefined> {
    return Array.from(this.ncaaEligibility.values()).find(
      (eligibility) => eligibility.userId === userId
    );
  }

  async createNcaaEligibility(eligibility: InsertNcaaEligibility): Promise<NcaaEligibility> {
    const id = this.currentNcaaEligibilityId++;
    const now = new Date();
    const ncaaEligibility: NcaaEligibility = { 
      ...eligibility, 
      id, 
      lastUpdated: now 
    };
    this.ncaaEligibility.set(id, ncaaEligibility);
    return ncaaEligibility;
  }

  async updateNcaaEligibility(userId: number, data: Partial<NcaaEligibility>): Promise<NcaaEligibility | undefined> {
    const eligibility = Array.from(this.ncaaEligibility.values()).find(
      (eligibility) => eligibility.userId === userId
    );
    
    if (!eligibility) return undefined;
    
    const now = new Date();
    const updatedEligibility = { 
      ...eligibility, 
      ...data, 
      lastUpdated: now 
    };
    this.ncaaEligibility.set(eligibility.id, updatedEligibility);
    return updatedEligibility;
  }
  
  // Coach Connection operations
  async getCoachConnections(userId: number, role: string): Promise<CoachConnection[]> {
    if (role === "coach") {
      return Array.from(this.coachConnections.values()).filter(
        (connection) => connection.coachId === userId
      );
    } else {
      return Array.from(this.coachConnections.values()).filter(
        (connection) => connection.athleteId === userId
      );
    }
  }

  async createCoachConnection(connection: InsertCoachConnection): Promise<CoachConnection> {
    const id = this.currentCoachConnectionId++;
    const now = new Date();
    const coachConnection: CoachConnection = { 
      ...connection, 
      id, 
      connectionDate: now,
      lastContact: now 
    };
    this.coachConnections.set(id, coachConnection);
    return coachConnection;
  }

  async updateCoachConnection(id: number, data: Partial<CoachConnection>): Promise<CoachConnection | undefined> {
    const connection = this.coachConnections.get(id);
    if (!connection) return undefined;
    
    const updatedConnection = { ...connection, ...data };
    this.coachConnections.set(id, updatedConnection);
    return updatedConnection;
  }
  
  // Achievement operations
  async getAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId
    );
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const now = new Date();
    const newAchievement: Achievement = { 
      ...achievement, 
      id, 
      earnedDate: now 
    };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }
  
  // Message operations
  async getMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.senderId === userId || message.recipientId === userId
    );
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    const newMessage: Message = { 
      ...message, 
      id, 
      createdAt: now, 
      isRead: false 
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllAthletes(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "athlete"
    );
  }

  async getAllCoaches(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "coach"
    );
  }

  async getAllVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    totalVideos: number;
    totalAnalyses: number;
    totalCoachConnections: number;
  }> {
    return {
      totalUsers: this.users.size,
      totalVideos: this.videos.size,
      totalAnalyses: this.videoAnalyses.size,
      totalCoachConnections: this.coachConnections.size,
    };
  }
  
  // Skill Tree operations
  async getUserSkills(userId: number): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(
      (skill) => skill.userId === userId
    );
  }
  
  async getUserSkillsByCategory(userId: number, category: string): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(
      (skill) => skill.userId === userId && skill.skillCategory === category
    );
  }
  
  async getSkill(id: number): Promise<Skill | undefined> {
    return this.skills.get(id);
  }
  
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = this.currentSkillId++;
    const now = new Date();
    const newSkill: Skill = {
      ...skill,
      id,
      updatedAt: now
    };
    this.skills.set(id, newSkill);
    return newSkill;
  }
  
  async updateSkill(id: number, data: Partial<Skill>): Promise<Skill | undefined> {
    const skill = this.skills.get(id);
    if (!skill) return undefined;
    
    const now = new Date();
    const updatedSkill = {
      ...skill,
      ...data,
      updatedAt: now
    };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }
  
  // Challenges operations
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }
  
  async getChallengesByCategory(category: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      (challenge) => challenge.category === category
    );
  }
  
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }
  
  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = this.currentChallengeId++;
    const now = new Date();
    const newChallenge: Challenge = {
      ...challenge,
      id,
      createdAt: now
    };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }
  
  async getAthleteChallenges(userId: number): Promise<AthleteChallenge[]> {
    return Array.from(this.athleteChallenges.values()).filter(
      (athleteChallenge) => athleteChallenge.userId === userId
    );
  }
  
  async getAthleteChallenge(id: number): Promise<AthleteChallenge | undefined> {
    return this.athleteChallenges.get(id);
  }
  
  async createAthleteChallenge(athleteChallenge: InsertAthleteChallenge): Promise<AthleteChallenge> {
    const id = this.currentAthleteChallengeId++;
    const now = new Date();
    const newAthleteChallenge: AthleteChallenge = {
      ...athleteChallenge,
      id,
      startedAt: now,
      completedAt: null
    };
    this.athleteChallenges.set(id, newAthleteChallenge);
    return newAthleteChallenge;
  }
  
  async updateAthleteChallenge(id: number, data: Partial<AthleteChallenge>): Promise<AthleteChallenge | undefined> {
    const athleteChallenge = this.athleteChallenges.get(id);
    if (!athleteChallenge) return undefined;
    
    const updatedAthleteChallenge = {
      ...athleteChallenge,
      ...data
    };
    this.athleteChallenges.set(id, updatedAthleteChallenge);
    return updatedAthleteChallenge;
  }
  
  // Recovery Tracker operations
  async getRecoveryLogs(userId: number): Promise<RecoveryLog[]> {
    return Array.from(this.recoveryLogs.values())
      .filter((log) => log.userId === userId)
      .sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());
  }
  
  async getLatestRecoveryLog(userId: number): Promise<RecoveryLog | undefined> {
    const logs = await this.getRecoveryLogs(userId);
    return logs.length > 0 ? logs[0] : undefined;
  }
  
  async createRecoveryLog(recoveryLog: InsertRecoveryLog): Promise<RecoveryLog> {
    const id = this.currentRecoveryLogId++;
    const today = new Date();
    const newRecoveryLog: RecoveryLog = {
      ...recoveryLog,
      id,
      logDate: today
    };
    this.recoveryLogs.set(id, newRecoveryLog);
    return newRecoveryLog;
  }
  
  // Fan Club operations
  async getFanClubFollowers(athleteId: number): Promise<FanClubFollower[]> {
    return Array.from(this.fanClubFollowers.values())
      .filter((follower) => follower.athleteId === athleteId)
      .sort((a, b) => new Date(b.followDate).getTime() - new Date(a.followDate).getTime());
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
    const id = this.currentFanClubFollowerId++;
    const now = new Date();
    const newFollower: FanClubFollower = {
      ...follower,
      id,
      followDate: now
    };
    this.fanClubFollowers.set(id, newFollower);
    return newFollower;
  }
  
  // Leaderboard operations
  async getLeaderboardEntries(category: string): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboardEntries.values())
      .filter((entry) => entry.category === category)
      .sort((a, b) => a.rankPosition - b.rankPosition);
  }
  
  async getUserLeaderboardEntry(userId: number, category: string): Promise<LeaderboardEntry | undefined> {
    return Array.from(this.leaderboardEntries.values()).find(
      (entry) => entry.userId === userId && entry.category === category
    );
  }
  
  async createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const id = this.currentLeaderboardEntryId++;
    const now = new Date();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id,
      updatedAt: now
    };
    this.leaderboardEntries.set(id, newEntry);
    return newEntry;
  }
  
  async updateLeaderboardEntry(id: number, data: Partial<LeaderboardEntry>): Promise<LeaderboardEntry | undefined> {
    const entry = this.leaderboardEntries.get(id);
    if (!entry) return undefined;
    
    const now = new Date();
    const updatedEntry = {
      ...entry,
      ...data,
      updatedAt: now
    };
    this.leaderboardEntries.set(id, updatedEntry);
    return updatedEntry;
  }
  
  // Blog Post operations
  async getBlogPosts(limit: number = 20, offset: number = 0): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => new Date(b.publishDate || Date.now()).getTime() - new Date(a.publishDate || Date.now()).getTime())
      .slice(offset, offset + limit);
  }
  
  async getFeaturedBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.featured)
      .sort((a, b) => new Date(b.publishDate || Date.now()).getTime() - new Date(a.publishDate || Date.now()).getTime())
      .slice(0, limit);
  }
  
  async getBlogPostsByCategory(category: string, limit: number = 10): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.category === category)
      .sort((a, b) => new Date(b.publishDate || Date.now()).getTime() - new Date(a.publishDate || Date.now()).getTime())
      .slice(0, limit);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const now = new Date();
    const newPost: BlogPost = {
      ...post,
      id,
      publishDate: post.publishDate || now
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }
  
  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = {
      ...post,
      ...data
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
  
  // Featured Athlete operations
  async getFeaturedAthletes(limit: number = 4): Promise<FeaturedAthlete[]> {
    return Array.from(this.featuredAthletes.values())
      .filter(athlete => athlete.active)
      .sort((a, b) => new Date(b.featuredDate || Date.now()).getTime() - new Date(a.featuredDate || Date.now()).getTime())
      .slice(0, limit);
  }
  
  async getFeaturedAthlete(id: number): Promise<FeaturedAthlete | undefined> {
    return this.featuredAthletes.get(id);
  }
  
  async getFeaturedAthleteByUserId(userId: number): Promise<FeaturedAthlete | undefined> {
    return Array.from(this.featuredAthletes.values()).find(
      (athlete) => athlete.userId === userId
    );
  }
  
  async createFeaturedAthlete(athlete: InsertFeaturedAthlete): Promise<FeaturedAthlete> {
    const id = this.currentFeaturedAthleteId++;
    const now = new Date();
    const newAthlete: FeaturedAthlete = {
      ...athlete,
      id,
      featuredDate: athlete.featuredDate || now,
      order: athlete.order || 0, 
      active: athlete.active === undefined ? true : athlete.active
    };
    this.featuredAthletes.set(id, newAthlete);
    return newAthlete;
  }
  
  async updateFeaturedAthlete(id: number, data: Partial<FeaturedAthlete>): Promise<FeaturedAthlete | undefined> {
    const athlete = this.featuredAthletes.get(id);
    if (!athlete) return undefined;
    
    const updatedAthlete = {
      ...athlete,
      ...data
    };
    this.featuredAthletes.set(id, updatedAthlete);
    return updatedAthlete;
  }
  
  async deactivateFeaturedAthlete(id: number): Promise<boolean> {
    const athlete = this.featuredAthletes.get(id);
    if (!athlete) return false;
    
    athlete.active = false;
    this.featuredAthletes.set(id, athlete);
    return true;
  }
  
  // Workout Playlist operations
  async getWorkoutPlaylists(userId: number): Promise<WorkoutPlaylist[]> {
    return Array.from(this.workoutPlaylists.values())
      .filter(playlist => playlist.userId === userId)
      .sort((a, b) => new Date(b.lastUsed || Date.now()).getTime() - new Date(a.lastUsed || Date.now()).getTime());
  }

  async getWorkoutPlaylist(id: number): Promise<WorkoutPlaylist | undefined> {
    return this.workoutPlaylists.get(id);
  }

  async createWorkoutPlaylist(playlist: InsertWorkoutPlaylist): Promise<WorkoutPlaylist> {
    const id = this.currentWorkoutPlaylistId++;
    const now = new Date();
    const newPlaylist: WorkoutPlaylist = {
      ...playlist,
      id,
      createdAt: now,
      lastUsed: now,
      timesUsed: 0
    };
    this.workoutPlaylists.set(id, newPlaylist);
    return newPlaylist;
  }

  async updateWorkoutPlaylist(id: number, data: Partial<WorkoutPlaylist>): Promise<WorkoutPlaylist | undefined> {
    const playlist = this.workoutPlaylists.get(id);
    if (!playlist) return undefined;
    
    const updatedPlaylist = { ...playlist, ...data };
    this.workoutPlaylists.set(id, updatedPlaylist);
    return updatedPlaylist;
  }

  async deleteWorkoutPlaylist(id: number): Promise<boolean> {
    // First delete all exercises associated with this playlist
    Array.from(this.workoutExercises.values())
      .filter(exercise => exercise.playlistId === id)
      .forEach(exercise => this.workoutExercises.delete(exercise.id));
    
    // Then delete the playlist itself
    return this.workoutPlaylists.delete(id);
  }

  async incrementPlaylistUsage(id: number): Promise<WorkoutPlaylist | undefined> {
    const playlist = this.workoutPlaylists.get(id);
    if (!playlist) return undefined;
    
    const now = new Date();
    const updatedPlaylist = { 
      ...playlist,
      lastUsed: now,
      timesUsed: (playlist.timesUsed || 0) + 1
    };
    this.workoutPlaylists.set(id, updatedPlaylist);
    return updatedPlaylist;
  }

  async getWorkoutExercises(playlistId: number): Promise<WorkoutExercise[]> {
    return Array.from(this.workoutExercises.values())
      .filter(exercise => exercise.playlistId === playlistId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createWorkoutExercise(exercise: InsertWorkoutExercise): Promise<WorkoutExercise> {
    const id = this.currentWorkoutExerciseId++;
    const newExercise: WorkoutExercise = {
      ...exercise,
      id
    };
    this.workoutExercises.set(id, newExercise);
    return newExercise;
  }

  async updateWorkoutExercise(id: number, data: Partial<WorkoutExercise>): Promise<WorkoutExercise | undefined> {
    const exercise = this.workoutExercises.get(id);
    if (!exercise) return undefined;
    
    const updatedExercise = { ...exercise, ...data };
    this.workoutExercises.set(id, updatedExercise);
    return updatedExercise;
  }

  async deleteWorkoutExercise(id: number): Promise<boolean> {
    return this.workoutExercises.delete(id);
  }

  async getPublicWorkoutPlaylists(workoutType?: string, intensityLevel?: string): Promise<WorkoutPlaylist[]> {
    let playlists = Array.from(this.workoutPlaylists.values())
      .filter(playlist => playlist.isPublic);
    
    if (workoutType) {
      playlists = playlists.filter(playlist => playlist.workoutType === workoutType);
    }
    
    if (intensityLevel) {
      playlists = playlists.filter(playlist => playlist.intensityLevel === intensityLevel);
    }
    
    return playlists.sort((a, b) => 
      (b.timesUsed || 0) - (a.timesUsed || 0) // Sort by popularity
    );
  }

  async generateAIWorkoutPlaylist(userId: number, preferences: {
    workoutType: string;
    intensityLevel: string;
    duration: number;
    targets: string[];
    userProfile?: AthleteProfile;
  }): Promise<WorkoutPlaylist> {
    // This would typically use the OpenAI API to generate a workout playlist
    // For now, we'll create a placeholder workout playlist
    const now = new Date();
    const id = this.currentWorkoutPlaylistId++;
    
    // Create the playlist
    const playlist: WorkoutPlaylist = {
      id,
      userId,
      name: `AI Generated ${preferences.workoutType} Workout (${preferences.intensityLevel})`,
      description: `A ${preferences.intensityLevel} ${preferences.workoutType} workout targeting ${preferences.targets.join(', ')}`,
      workoutType: preferences.workoutType,
      intensityLevel: preferences.intensityLevel,
      durationMinutes: preferences.duration,
      targetAreas: preferences.targets,
      isPublic: false,
      createdAt: now,
      lastUsed: now,
      timesUsed: 0
    };
    
    this.workoutPlaylists.set(id, playlist);
    
    // Generate some sample exercises based on the workout type and target areas
    const exercises: InsertWorkoutExercise[] = [];
    
    // This would be much more sophisticated with actual AI generation
    if (preferences.workoutType === 'Strength') {
      if (preferences.targets.includes('Upper Body')) {
        exercises.push({
          playlistId: id,
          name: 'Push-ups',
          description: 'Standard push-ups with proper form',
          durationSeconds: 60,
          repetitions: 15,
          sets: 3,
          restSeconds: 30,
          orderIndex: 1
        });
        exercises.push({
          playlistId: id,
          name: 'Pull-ups',
          description: 'Pull-ups with proper form',
          durationSeconds: 60,
          repetitions: 10,
          sets: 3,
          restSeconds: 45,
          orderIndex: 2
        });
      }
      if (preferences.targets.includes('Lower Body')) {
        exercises.push({
          playlistId: id,
          name: 'Squats',
          description: 'Bodyweight squats with proper form',
          durationSeconds: 60,
          repetitions: 20,
          sets: 3,
          restSeconds: 30,
          orderIndex: 3
        });
        exercises.push({
          playlistId: id,
          name: 'Lunges',
          description: 'Alternating lunges with proper form',
          durationSeconds: 60,
          repetitions: 12,
          sets: 3,
          restSeconds: 30,
          orderIndex: 4
        });
      }
    } else if (preferences.workoutType === 'Cardio') {
      exercises.push({
        playlistId: id,
        name: 'Jumping Jacks',
        description: 'Standard jumping jacks at a moderate pace',
        durationSeconds: 60,
        repetitions: null,
        sets: 3,
        restSeconds: 15,
        orderIndex: 1
      });
      exercises.push({
        playlistId: id,
        name: 'Mountain Climbers',
        description: 'Mountain climbers at a quick pace',
        durationSeconds: 45,
        repetitions: null,
        sets: 3,
        restSeconds: 15,
        orderIndex: 2
      });
    } else if (preferences.workoutType === 'Flexibility') {
      exercises.push({
        playlistId: id,
        name: 'Standing Hamstring Stretch',
        description: 'Gentle hamstring stretch while standing',
        durationSeconds: 30,
        repetitions: null,
        sets: 3,
        restSeconds: 10,
        orderIndex: 1
      });
      exercises.push({
        playlistId: id,
        name: 'Hip Flexor Stretch',
        description: 'Gentle hip flexor stretch in lunge position',
        durationSeconds: 30,
        repetitions: null,
        sets: 3,
        restSeconds: 10,
        orderIndex: 2
      });
    }
    
    // Add the exercises to the database
    for (const exercise of exercises) {
      await this.createWorkoutExercise(exercise);
    }
    
    return playlist;
  }

  // Film Comparison operations
  async getFilmComparisons(userId: number): Promise<FilmComparison[]> {
    return Array.from(this.filmComparisons.values()).filter(
      (comparison) => comparison.userId === userId
    );
  }
  
  async getFilmComparison(id: number): Promise<FilmComparison | undefined> {
    return this.filmComparisons.get(id);
  }
  
  async createFilmComparison(comparison: InsertFilmComparison): Promise<FilmComparison> {
    const id = this.currentFilmComparisonId++;
    const now = new Date();
    const filmComparison: FilmComparison = {
      ...comparison,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.filmComparisons.set(id, filmComparison);
    return filmComparison;
  }
  
  async updateFilmComparison(id: number, data: Partial<FilmComparison>): Promise<FilmComparison | undefined> {
    const comparison = this.filmComparisons.get(id);
    if (!comparison) return undefined;
    
    const now = new Date();
    const updatedComparison = {
      ...comparison,
      ...data,
      updatedAt: now
    };
    this.filmComparisons.set(id, updatedComparison);
    return updatedComparison;
  }
  
  async deleteFilmComparison(id: number): Promise<boolean> {
    return this.filmComparisons.delete(id);
  }
  
  async getComparisonVideos(comparisonId: number): Promise<ComparisonVideo[]> {
    return Array.from(this.comparisonVideos.values()).filter(
      (video) => video.comparisonId === comparisonId
    );
  }
  
  async getComparisonVideo(id: number): Promise<ComparisonVideo | undefined> {
    return this.comparisonVideos.get(id);
  }
  
  async createComparisonVideo(video: InsertComparisonVideo): Promise<ComparisonVideo> {
    const id = this.currentComparisonVideoId++;
    const now = new Date();
    const comparisonVideo: ComparisonVideo = {
      ...video,
      id,
      uploadDate: now
    };
    this.comparisonVideos.set(id, comparisonVideo);
    return comparisonVideo;
  }
  
  async updateComparisonVideo(id: number, data: Partial<ComparisonVideo>): Promise<ComparisonVideo | undefined> {
    const video = this.comparisonVideos.get(id);
    if (!video) return undefined;
    
    const updatedVideo = {
      ...video,
      ...data
    };
    this.comparisonVideos.set(id, updatedVideo);
    return updatedVideo;
  }
  
  async deleteComparisonVideo(id: number): Promise<boolean> {
    return this.comparisonVideos.delete(id);
  }
  
  async getComparisonAnalysis(comparisonId: number): Promise<ComparisonAnalysis | undefined> {
    return Array.from(this.comparisonAnalyses.values()).find(
      (analysis) => analysis.comparisonId === comparisonId
    );
  }
  
  async createComparisonAnalysis(analysis: InsertComparisonAnalysis): Promise<ComparisonAnalysis> {
    const id = this.currentComparisonAnalysisId++;
    const now = new Date();
    const comparisonAnalysis: ComparisonAnalysis = {
      ...analysis,
      id,
      analysisDate: now
    };
    this.comparisonAnalyses.set(id, comparisonAnalysis);
    return comparisonAnalysis;
  }
  
  async updateComparisonAnalysis(id: number, data: Partial<ComparisonAnalysis>): Promise<ComparisonAnalysis | undefined> {
    const analysis = this.comparisonAnalyses.get(id);
    if (!analysis) return undefined;
    
    const updatedAnalysis = {
      ...analysis,
      ...data
    };
    this.comparisonAnalyses.set(id, updatedAnalysis);
    return updatedAnalysis;
  }
  
  // NextUp Spotlight operations
  async getSpotlightProfiles(limit?: number, offset?: number): Promise<SpotlightProfile[]> {
    let profiles = Array.from(this.spotlightProfiles.values());
    
    if (offset) {
      profiles = profiles.slice(offset);
    }
    
    if (limit) {
      profiles = profiles.slice(0, limit);
    }
    
    return profiles;
  }
  
  async getFeaturedSpotlightProfiles(limit?: number): Promise<SpotlightProfile[]> {
    let profiles = Array.from(this.spotlightProfiles.values())
      .filter(profile => profile.featured)
      .sort((a, b) => b.views - a.views);
    
    if (limit) {
      profiles = profiles.slice(0, limit);
    }
    
    return profiles;
  }
  
  async getSpotlightProfilesByCategory(category: string, limit?: number): Promise<SpotlightProfile[]> {
    let profiles = Array.from(this.spotlightProfiles.values())
      .filter(profile => profile.sportCategory === category)
      .sort((a, b) => b.views - a.views);
    
    if (limit) {
      profiles = profiles.slice(0, limit);
    }
    
    return profiles;
  }
  
  async getSpotlightProfile(id: number): Promise<SpotlightProfile | undefined> {
    return this.spotlightProfiles.get(id);
  }
  
  async getSpotlightProfileByUserId(userId: number): Promise<SpotlightProfile | undefined> {
    return Array.from(this.spotlightProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }
  
  async createSpotlightProfile(profile: InsertSpotlightProfile): Promise<SpotlightProfile> {
    const id = this.currentSpotlightProfileId++;
    const now = new Date();
    const spotlightProfile: SpotlightProfile = {
      ...profile,
      id,
      createdAt: now,
      updatedAt: now,
      views: 0,
      likes: 0,
      featured: false
    };
    this.spotlightProfiles.set(id, spotlightProfile);
    return spotlightProfile;
  }
  
  async updateSpotlightProfile(id: number, data: Partial<SpotlightProfile>): Promise<SpotlightProfile | undefined> {
    const profile = this.spotlightProfiles.get(id);
    if (!profile) return undefined;
    
    const now = new Date();
    const updatedProfile = {
      ...profile,
      ...data,
      updatedAt: now
    };
    this.spotlightProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  async deleteSpotlightProfile(id: number): Promise<boolean> {
    return this.spotlightProfiles.delete(id);
  }
  
  async incrementSpotlightViews(id: number): Promise<SpotlightProfile | undefined> {
    const profile = this.spotlightProfiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = {
      ...profile,
      views: profile.views + 1
    };
    this.spotlightProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  async likeSpotlightProfile(id: number): Promise<SpotlightProfile | undefined> {
    const profile = this.spotlightProfiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = {
      ...profile,
      likes: profile.likes + 1
    };
    this.spotlightProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  // MyPlayer XP System operations
  async getPlayerProgress(userId: number): Promise<PlayerProgress | undefined> {
    return Array.from(this.playerProgress.values()).find(
      (progress) => progress.userId === userId
    );
  }
  
  async createPlayerProgress(progress: InsertPlayerProgress): Promise<PlayerProgress> {
    const id = this.currentPlayerProgressId++;
    const now = new Date();
    const playerProgress: PlayerProgress = {
      ...progress,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.playerProgress.set(id, playerProgress);
    return playerProgress;
  }
  
  async updatePlayerProgress(userId: number, data: Partial<PlayerProgress>): Promise<PlayerProgress | undefined> {
    const progress = Array.from(this.playerProgress.values()).find(
      (progress) => progress.userId === userId
    );
    
    if (!progress) return undefined;
    
    const now = new Date();
    const updatedProgress = {
      ...progress,
      ...data,
      updatedAt: now
    };
    this.playerProgress.set(progress.id, updatedProgress);
    return updatedProgress;
  }
  
  async addXpToPlayer(userId: number, amount: number, type: string, description: string, sourceId?: string): Promise<{ 
    progress: PlayerProgress, 
    transaction: XpTransaction,
    leveledUp: boolean 
  }> {
    // Get the player's progress
    let progress = await this.getPlayerProgress(userId);
    
    // If no progress exists, create initial progress
    if (!progress) {
      progress = await this.createPlayerProgress({
        userId,
        level: 1,
        totalXp: 0,
        currentLevelXp: 0,
        nextLevelXp: 100,
        streak: 0
      });
    }
    
    // Calculate new values
    const newTotalXp = progress.totalXp + amount;
    const newCurrentLevelXp = progress.currentLevelXp + amount;
    
    let leveledUp = false;
    let newLevel = progress.level;
    let newNextLevelXp = progress.nextLevelXp;
    let remainingXp = 0;
    
    // Check if level up occurred
    if (newCurrentLevelXp >= progress.nextLevelXp) {
      leveledUp = true;
      newLevel = progress.level + 1;
      remainingXp = newCurrentLevelXp - progress.nextLevelXp;
      newNextLevelXp = Math.round(progress.nextLevelXp * 1.5); // Increase XP required for next level
    }
    
    // Update the player's progress
    const updatedProgress = await this.updatePlayerProgress(userId, {
      totalXp: newTotalXp,
      currentLevelXp: leveledUp ? remainingXp : newCurrentLevelXp,
      level: newLevel,
      nextLevelXp: leveledUp ? newNextLevelXp : progress.nextLevelXp
    });
    
    // Create an XP transaction record
    const transaction = await this.createXpTransaction({
      userId,
      amount,
      type,
      description,
      sourceId,
      awarded: new Date()
    });
    
    return {
      progress: updatedProgress!,
      transaction,
      leveledUp
    };
  }
  
  async getXpTransactions(userId: number, limit?: number): Promise<XpTransaction[]> {
    let transactions = Array.from(this.xpTransactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => new Date(b.awarded).getTime() - new Date(a.awarded).getTime());
    
    if (limit) {
      transactions = transactions.slice(0, limit);
    }
    
    return transactions;
  }
  
  async createXpTransaction(transaction: InsertXpTransaction): Promise<XpTransaction> {
    const id = this.currentXpTransactionId++;
    const xpTransaction: XpTransaction = {
      ...transaction,
      id
    };
    this.xpTransactions.set(id, xpTransaction);
    return xpTransaction;
  }
  
  async getPlayerBadges(userId: number): Promise<PlayerBadge[]> {
    return Array.from(this.playerBadges.values()).filter(
      (badge) => badge.userId === userId
    );
  }
  
  async getPlayerBadgesByCategory(userId: number, category: string): Promise<PlayerBadge[]> {
    return Array.from(this.playerBadges.values()).filter(
      (badge) => badge.userId === userId && badge.category === category
    );
  }
  
  async createPlayerBadge(badge: InsertPlayerBadge): Promise<PlayerBadge> {
    const id = this.currentPlayerBadgeId++;
    const now = new Date();
    const playerBadge: PlayerBadge = {
      ...badge,
      id,
      earnedAt: now
    };
    this.playerBadges.set(id, playerBadge);
    return playerBadge;
  }
  
  async updatePlayerBadge(id: number, data: Partial<PlayerBadge>): Promise<PlayerBadge | undefined> {
    const badge = this.playerBadges.get(id);
    if (!badge) return undefined;
    
    const updatedBadge = {
      ...badge,
      ...data
    };
    this.playerBadges.set(id, updatedBadge);
    return updatedBadge;
  }
  
  // MyPlayer Workout Verification operations
  async getWorkoutVerifications(userId: number): Promise<WorkoutVerification[]> {
    return Array.from(this.workoutVerifications.values()).filter(
      (verification) => verification.userId === userId
    );
  }
  
  async getPendingWorkoutVerifications(): Promise<WorkoutVerification[]> {
    return Array.from(this.workoutVerifications.values()).filter(
      (verification) => verification.status === 'pending'
    );
  }
  
  async getWorkoutVerification(id: number): Promise<WorkoutVerification | undefined> {
    return this.workoutVerifications.get(id);
  }
  
  async createWorkoutVerification(verification: InsertWorkoutVerification): Promise<WorkoutVerification> {
    const id = this.currentWorkoutVerificationId++;
    const now = new Date();
    const workoutVerification: WorkoutVerification = {
      ...verification,
      id,
      submittedAt: now,
      status: 'pending',
      verifiedAt: null,
      verifierId: null,
      verifierNotes: null
    };
    this.workoutVerifications.set(id, workoutVerification);
    return workoutVerification;
  }
  
  async updateWorkoutVerification(id: number, data: Partial<WorkoutVerification>): Promise<WorkoutVerification | undefined> {
    const verification = this.workoutVerifications.get(id);
    if (!verification) return undefined;
    
    const updatedVerification = {
      ...verification,
      ...data
    };
    this.workoutVerifications.set(id, updatedVerification);
    return updatedVerification;
  }
  
  async verifyWorkout(id: number, verifierId: number, status: string, notes?: string): Promise<WorkoutVerification | undefined> {
    const verification = this.workoutVerifications.get(id);
    if (!verification) return undefined;
    
    const now = new Date();
    const updatedVerification = {
      ...verification,
      status,
      verifierId,
      verifierNotes: notes || null,
      verifiedAt: now
    };
    this.workoutVerifications.set(id, updatedVerification);
    
    // If approved, award XP to the user
    if (status === 'approved') {
      await this.addXpToPlayer(
        verification.userId, 
        50, 
        'workout_verification',
        `Workout "${verification.workoutTitle}" verified`,
        String(id)
      );
    }
    
    return updatedVerification;
  }
  
  async getWorkoutVerificationCheckpoints(verificationId: number): Promise<WorkoutVerificationCheckpoint[]> {
    return Array.from(this.workoutVerificationCheckpoints.values()).filter(
      (checkpoint) => checkpoint.verificationId === verificationId
    );
  }
  
  async createWorkoutVerificationCheckpoint(checkpoint: InsertWorkoutVerificationCheckpoint): Promise<WorkoutVerificationCheckpoint> {
    const id = this.currentWorkoutVerificationCheckpointId++;
    const workoutVerificationCheckpoint: WorkoutVerificationCheckpoint = {
      ...checkpoint,
      id
    };
    this.workoutVerificationCheckpoints.set(id, workoutVerificationCheckpoint);
    return workoutVerificationCheckpoint;
  }
  
  async updateWorkoutVerificationCheckpoint(id: number, data: Partial<WorkoutVerificationCheckpoint>): Promise<WorkoutVerificationCheckpoint | undefined> {
    const checkpoint = this.workoutVerificationCheckpoints.get(id);
    if (!checkpoint) return undefined;
    
    const updatedCheckpoint = {
      ...checkpoint,
      ...data
    };
    this.workoutVerificationCheckpoints.set(id, updatedCheckpoint);
    return updatedCheckpoint;
  }
  
  // MyPlayer UI Weight Room operations
  async getWeightRoomEquipment(category?: string): Promise<WeightRoomEquipment[]> {
    let equipment = Array.from(this.weightRoomEquipment.values());
    
    if (category) {
      equipment = equipment.filter(
        (item) => item.category === category
      );
    }
    
    return equipment;
  }
  
  async getWeightRoomEquipmentById(id: number): Promise<WeightRoomEquipment | undefined> {
    return this.weightRoomEquipment.get(id);
  }
  
  async createWeightRoomEquipment(equipment: InsertWeightRoomEquipment): Promise<WeightRoomEquipment> {
    const id = this.currentWeightRoomEquipmentId++;
    const weightRoomEquipment: WeightRoomEquipment = {
      ...equipment,
      id
    };
    this.weightRoomEquipment.set(id, weightRoomEquipment);
    return weightRoomEquipment;
  }
  
  async updateWeightRoomEquipment(id: number, data: Partial<WeightRoomEquipment>): Promise<WeightRoomEquipment | undefined> {
    const equipment = this.weightRoomEquipment.get(id);
    if (!equipment) return undefined;
    
    const updatedEquipment = {
      ...equipment,
      ...data
    };
    this.weightRoomEquipment.set(id, updatedEquipment);
    return updatedEquipment;
  }
  
  async getPlayerEquipment(userId: number): Promise<PlayerEquipment[]> {
    return Array.from(this.playerEquipment.values()).filter(
      (equipment) => equipment.userId === userId
    );
  }
  
  async getPlayerEquipmentById(id: number): Promise<PlayerEquipment | undefined> {
    return this.playerEquipment.get(id);
  }
  
  async createPlayerEquipment(equipment: InsertPlayerEquipment): Promise<PlayerEquipment> {
    const id = this.currentPlayerEquipmentId++;
    const now = new Date();
    const playerEquipment: PlayerEquipment = {
      ...equipment,
      id,
      equippedAt: now,
      timesUsed: 0
    };
    this.playerEquipment.set(id, playerEquipment);
    return playerEquipment;
  }
  
  async updatePlayerEquipment(id: number, data: Partial<PlayerEquipment>): Promise<PlayerEquipment | undefined> {
    const equipment = this.playerEquipment.get(id);
    if (!equipment) return undefined;
    
    const updatedEquipment = {
      ...equipment,
      ...data
    };
    this.playerEquipment.set(id, updatedEquipment);
    return updatedEquipment;
  }
  
  async incrementEquipmentUsage(id: number): Promise<PlayerEquipment | undefined> {
    const equipment = this.playerEquipment.get(id);
    if (!equipment) return undefined;
    
    const updatedEquipment = {
      ...equipment,
      timesUsed: (equipment.timesUsed || 0) + 1
    };
    this.playerEquipment.set(id, updatedEquipment);
    return updatedEquipment;
  }

  // Method to seed some initial data for development
  private seedInitialData() {
    // Create sample users (1 athlete, 1 coach, 1 admin)
    const athleteUser: User = {
      id: this.currentUserId++,
      username: "alexjohnson",
      password: "password123", // In a real app, this would be hashed
      email: "alex@example.com",
      name: "Alex Johnson",
      role: "athlete",
      profileImage: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "High school student athlete looking to compete at the college level.",
      createdAt: new Date(),
    };
    this.users.set(athleteUser.id, athleteUser);

    const coachUser1: User = {
      id: this.currentUserId++,
      username: "coachwilliams",
      password: "coachpass123",
      email: "williams@stateuniversity.edu",
      name: "Coach Williams",
      role: "coach",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Basketball coach at State University with 15 years of experience.",
      createdAt: new Date(),
    };
    this.users.set(coachUser1.id, coachUser1);

    const coachUser2: User = {
      id: this.currentUserId++,
      username: "coachmartinez",
      password: "coachpass456",
      email: "martinez@centralcollege.edu",
      name: "Coach Martinez",
      role: "coach",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      bio: "Volleyball coach at Central College, specializing in developing high school talent.",
      createdAt: new Date(),
    };
    this.users.set(coachUser2.id, coachUser2);

    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "adminpass123",
      email: "admin@goforit.com",
      name: "Admin User",
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create athlete profile
    const athleteProfile: AthleteProfile = {
      id: this.currentAthleteProfileId++,
      userId: athleteUser.id,
      height: 188, // 6'2" in cm
      weight: 82, // 180 lbs in kg
      age: 17,
      school: "Washington High School",
      graduationYear: 2024,
      sportsInterest: ["basketball", "volleyball", "track"],
      motionScore: 65,
      profileCompletionPercentage: 50,
    };
    this.athleteProfiles.set(athleteProfile.id, athleteProfile);

    // Create coach profiles
    const coachProfile1: CoachProfile = {
      id: this.currentCoachProfileId++,
      userId: coachUser1.id,
      institution: "State University",
      sports: ["basketball"],
      level: "college",
      experience: 15,
      achievements: "3 conference championships, 2 NCAA tournament appearances",
    };
    this.coachProfiles.set(coachProfile1.id, coachProfile1);

    const coachProfile2: CoachProfile = {
      id: this.currentCoachProfileId++,
      userId: coachUser2.id,
      institution: "Central College",
      sports: ["volleyball"],
      level: "college",
      experience: 8,
      achievements: "Regional championship, developed 5 D1 athletes",
    };
    this.coachProfiles.set(coachProfile2.id, coachProfile2);

    // Create sample video
    const sampleVideo: Video = {
      id: this.currentVideoId++,
      userId: athleteUser.id,
      title: "Basketball Jump Shot",
      description: "My jump shot form from practice yesterday",
      filePath: "/uploads/videos/jumpshotvideo.mp4",
      uploadDate: new Date(2023, 4, 12), // May 12, 2023
      analyzed: true,
      sportType: "basketball",
      thumbnailPath: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    };
    this.videos.set(sampleVideo.id, sampleVideo);

    // Create sample video analysis
    const sampleAnalysis: VideoAnalysis = {
      id: this.currentVideoAnalysisId++,
      videoId: sampleVideo.id,
      analysisDate: new Date(2023, 4, 12),
      motionData: {
        elbowAlignment: 85,
        releasePoint: 72,
        followThrough: 55,
        balance: 90,
        keypoints: [
          { x: 0.42, y: 0.35, confidence: 0.95, name: "elbow" },
          { x: 0.52, y: 0.45, confidence: 0.90, name: "wrist" },
          { x: 0.48, y: 0.65, confidence: 0.85, name: "knee" }
        ]
      },
      overallScore: 75,
      feedback: "Good elbow alignment and balance. Work on follow through.",
      improvementTips: [
        "Maintain follow through position longer",
        "Keep your shooting elbow tucked in more consistently",
        "Work on consistent release point"
      ],
      keyFrameTimestamps: [2.4, 3.1, 4.5],
    };
    this.videoAnalyses.set(sampleAnalysis.id, sampleAnalysis);

    // Create sport recommendations
    const basketballRecommendation: SportRecommendation = {
      id: this.currentSportRecommendationId++,
      userId: athleteUser.id,
      sport: "Basketball",
      matchPercentage: 92,
      positionRecommendation: "Guard",
      potentialLevel: "NCAA Div II Potential",
      reasonForMatch: "Great match for your height and vertical jumping ability.",
      recommendationDate: new Date(),
    };
    this.sportRecommendations.set(basketballRecommendation.id, basketballRecommendation);

    const volleyballRecommendation: SportRecommendation = {
      id: this.currentSportRecommendationId++,
      userId: athleteUser.id,
      sport: "Volleyball",
      matchPercentage: 85,
      positionRecommendation: "Outside Hitter",
      potentialLevel: "Club Level Potential",
      reasonForMatch: "Your jumping and arm extension are perfect for volleyball.",
      recommendationDate: new Date(),
    };
    this.sportRecommendations.set(volleyballRecommendation.id, volleyballRecommendation);

    const trackRecommendation: SportRecommendation = {
      id: this.currentSportRecommendationId++,
      userId: athleteUser.id,
      sport: "Track & Field",
      matchPercentage: 78,
      positionRecommendation: "Sprinter",
      potentialLevel: "NCAA Div I Potential",
      reasonForMatch: "Your stride length and acceleration show potential.",
      recommendationDate: new Date(),
    };
    this.sportRecommendations.set(trackRecommendation.id, trackRecommendation);

    // Create NCAA eligibility
    const ncaaEligibility: NcaaEligibility = {
      id: this.currentNcaaEligibilityId++,
      userId: athleteUser.id,
      coreCoursesCompleted: 12,
      coreCoursesRequired: 16,
      gpa: 3.5,
      gpaMeetsRequirement: true,
      testScores: "1200 SAT",
      testScoresMeetRequirement: true,
      amateurismStatus: "incomplete",
      overallEligibilityStatus: "partial",
      lastUpdated: new Date(),
    };
    this.ncaaEligibility.set(ncaaEligibility.id, ncaaEligibility);

    // Create coach connections
    const connection1: CoachConnection = {
      id: this.currentCoachConnectionId++,
      coachId: coachUser1.id,
      athleteId: athleteUser.id,
      connectionStatus: "accepted",
      connectionDate: new Date(2023, 3, 15), // April 15, 2023
      notes: "Interested in your jump shot technique. Would like to see more training videos.",
      lastContact: new Date(),
    };
    this.coachConnections.set(connection1.id, connection1);

    const connection2: CoachConnection = {
      id: this.currentCoachConnectionId++,
      coachId: coachUser2.id,
      athleteId: athleteUser.id,
      connectionStatus: "pending",
      connectionDate: new Date(2023, 5, 1), // June 1, 2023
      notes: "Your vertical leap is impressive. Let's discuss your volleyball experience.",
      lastContact: new Date(),
    };
    this.coachConnections.set(connection2.id, connection2);

    // Create achievements
    const achievement1: Achievement = {
      id: this.currentAchievementId++,
      userId: athleteUser.id,
      title: "First Video Analysis",
      description: "Completed your first video motion analysis",
      achievementType: "video",
      earnedDate: new Date(2023, 4, 12),
      iconType: "trophy",
    };
    this.achievements.set(achievement1.id, achievement1);

    const achievement2: Achievement = {
      id: this.currentAchievementId++,
      userId: athleteUser.id,
      title: "Profile 50% Complete",
      description: "Reached 50% completion on your athlete profile",
      achievementType: "profile",
      earnedDate: new Date(2023, 4, 20),
      iconType: "profile",
    };
    this.achievements.set(achievement2.id, achievement2);

    const achievement3: Achievement = {
      id: this.currentAchievementId++,
      userId: athleteUser.id,
      title: "Connected with Coach",
      description: "Made your first connection with a college coach",
      achievementType: "connection",
      earnedDate: new Date(2023, 4, 25),
      iconType: "handshake",
    };
    this.achievements.set(achievement3.id, achievement3);

    const achievement4: Achievement = {
      id: this.currentAchievementId++,
      userId: athleteUser.id,
      title: "NCAA GPA Eligible",
      description: "Achieved the minimum GPA required for NCAA eligibility",
      achievementType: "ncaa",
      earnedDate: new Date(2023, 5, 10),
      iconType: "certificate",
    };
    this.achievements.set(achievement4.id, achievement4);
    
    // Create sample skills for the athlete
    const jumpingSkill: Skill = {
      id: this.currentSkillId++,
      userId: athleteUser.id,
      skillName: "Vertical Jump",
      skillCategory: "athletic",
      currentLevel: 7,
      maxLevel: 10,
      description: "Ability to jump vertically with power and control",
      xpPoints: 850,
      xpToNextLevel: 1000,
      updatedAt: new Date(2023, 5, 15),
    };
    this.skills.set(jumpingSkill.id, jumpingSkill);
    
    const shootingSkill: Skill = {
      id: this.currentSkillId++,
      userId: athleteUser.id,
      skillName: "Jump Shot",
      skillCategory: "basketball",
      currentLevel: 6,
      maxLevel: 10,
      description: "Basketball jump shot form and accuracy",
      xpPoints: 750,
      xpToNextLevel: 1000,
      updatedAt: new Date(2023, 5, 15),
    };
    this.skills.set(shootingSkill.id, shootingSkill);
    
    const speedSkill: Skill = {
      id: this.currentSkillId++,
      userId: athleteUser.id,
      skillName: "Sprint Speed",
      skillCategory: "athletic",
      currentLevel: 8,
      maxLevel: 10,
      description: "Speed in short distance sprints",
      xpPoints: 900,
      xpToNextLevel: 1000,
      updatedAt: new Date(2023, 5, 15),
    };
    this.skills.set(speedSkill.id, speedSkill);
    
    // Create sample challenges
    const conditioningChallenge: Challenge = {
      id: this.currentChallengeId++,
      title: "Conditioning Challenge",
      description: "Complete 10 suicides under 3 minutes",
      difficulty: "intermediate",
      category: "conditioning",
      pointsAwarded: 200,
      createdAt: new Date(2023, 4, 1),
    };
    this.challenges.set(conditioningChallenge.id, conditioningChallenge);
    
    const shootingChallenge: Challenge = {
      id: this.currentChallengeId++,
      title: "Shooting Challenge",
      description: "Make 50 free throws with 80% accuracy",
      difficulty: "beginner",
      category: "basketball",
      pointsAwarded: 150,
      createdAt: new Date(2023, 4, 1),
    };
    this.challenges.set(shootingChallenge.id, shootingChallenge);
    
    const strengthChallenge: Challenge = {
      id: this.currentChallengeId++,
      title: "Strength Challenge",
      description: "Complete 5 sets of 10 push-ups, 10 sit-ups, and 10 squats",
      difficulty: "beginner",
      category: "strength",
      pointsAwarded: 100,
      createdAt: new Date(2023, 4, 1),
    };
    this.challenges.set(strengthChallenge.id, strengthChallenge);
    
    // Create athlete challenges (challenges accepted by the athlete)
    const athleteShootingChallenge: AthleteChallenge = {
      id: this.currentAthleteChallengeId++,
      userId: athleteUser.id,
      challengeId: shootingChallenge.id,
      status: "completed",
      progress: 100,
      startedAt: new Date(2023, 5, 10),
      completedAt: new Date(2023, 5, 12),
    };
    this.athleteChallenges.set(athleteShootingChallenge.id, athleteShootingChallenge);
    
    const athleteStrengthChallenge: AthleteChallenge = {
      id: this.currentAthleteChallengeId++,
      userId: athleteUser.id,
      challengeId: strengthChallenge.id,
      status: "in-progress",
      progress: 60,
      startedAt: new Date(2023, 5, 15),
      completedAt: null,
    };
    this.athleteChallenges.set(athleteStrengthChallenge.id, athleteStrengthChallenge);
    
    // Create recovery logs
    const recoveryLog1: RecoveryLog = {
      id: this.currentRecoveryLogId++,
      userId: athleteUser.id,
      sleepHours: 8,
      hydrationLevel: 7,
      nutritionLevel: 6,
      fatigueLevel: 3,
      soreness: 4,
      notes: "Feeling good overall, slight soreness in quads from yesterday's workout",
      logDate: new Date(2023, 5, 18),
    };
    this.recoveryLogs.set(recoveryLog1.id, recoveryLog1);
    
    const recoveryLog2: RecoveryLog = {
      id: this.currentRecoveryLogId++,
      userId: athleteUser.id,
      sleepHours: 6,
      hydrationLevel: 5,
      nutritionLevel: 7,
      fatigueLevel: 6,
      soreness: 5,
      notes: "Not enough sleep last night, more tired than usual",
      logDate: new Date(2023, 5, 17),
    };
    this.recoveryLogs.set(recoveryLog2.id, recoveryLog2);
    
    // Create fan club followers
    const fanClubFollower1: FanClubFollower = {
      id: this.currentFanClubFollowerId++,
      athleteId: athleteUser.id,
      followerName: "James Smith",
      followerType: "fan",
      followDate: new Date(2023, 4, 20),
    };
    this.fanClubFollowers.set(fanClubFollower1.id, fanClubFollower1);
    
    const fanClubFollower2: FanClubFollower = {
      id: this.currentFanClubFollowerId++,
      athleteId: athleteUser.id,
      followerName: "Coach Thompson",
      followerType: "recruiter",
      followDate: new Date(2023, 5, 5),
    };
    this.fanClubFollowers.set(fanClubFollower2.id, fanClubFollower2);
    
    const fanClubFollower3: FanClubFollower = {
      id: this.currentFanClubFollowerId++,
      athleteId: athleteUser.id,
      followerName: "John Johnson",
      followerType: "family",
      followDate: new Date(2023, 4, 15),
    };
    this.fanClubFollowers.set(fanClubFollower3.id, fanClubFollower3);
    
    // Create sample messages
    const message1: Message = {
      id: this.currentMessageId++,
      senderId: coachUser1.id,
      recipientId: athleteUser.id,
      content: "Hi Alex, I was impressed with your basketball jump shot video. Would love to discuss your college plans.",
      createdAt: new Date(2023, 4, 20),
      isRead: true
    };
    this.messages.set(message1.id, message1);
    
    const message2: Message = {
      id: this.currentMessageId++,
      senderId: athleteUser.id,
      recipientId: coachUser1.id,
      content: "Thank you Coach Williams! I'm very interested in your basketball program. When would be a good time to talk?",
      createdAt: new Date(2023, 4, 21),
      isRead: true
    };
    this.messages.set(message2.id, message2);
    
    const message3: Message = {
      id: this.currentMessageId++,
      senderId: coachUser1.id,
      recipientId: athleteUser.id,
      content: "How about this Friday at 3pm? We can discuss scholarship opportunities and what our program can offer you.",
      createdAt: new Date(2023, 4, 22),
      isRead: false
    };
    this.messages.set(message3.id, message3);
    
    const message4: Message = {
      id: this.currentMessageId++,
      senderId: coachUser2.id,
      recipientId: athleteUser.id,
      content: "Alex, I noticed your vertical leap stats. Have you considered volleyball? We might have a spot for you on our team.",
      createdAt: new Date(2023, 5, 1),
      isRead: false
    };
    this.messages.set(message4.id, message4);
    
    // Create leaderboard entries
    const shootingLeaderboardEntry: LeaderboardEntry = {
      id: this.currentLeaderboardEntryId++,
      userId: athleteUser.id,
      username: athleteUser.username,
      category: "basketball-shooting",
      score: 850,
      rankPosition: 3,
      updatedAt: new Date(2023, 5, 15),
    };
    this.leaderboardEntries.set(shootingLeaderboardEntry.id, shootingLeaderboardEntry);
    
    const verticalLeaderboardEntry: LeaderboardEntry = {
      id: this.currentLeaderboardEntryId++,
      userId: athleteUser.id,
      username: athleteUser.username,
      category: "vertical-jump",
      score: 920,
      rankPosition: 2,
      updatedAt: new Date(2023, 5, 15),
    };
    this.leaderboardEntries.set(verticalLeaderboardEntry.id, verticalLeaderboardEntry);
    
    // Create sample blog posts
    const blogPost1: BlogPost = {
      id: this.currentBlogPostId++,
      title: "5 Tips to Improve Your Vertical Jump",
      slug: "5-tips-improve-vertical-jump",
      content: "Increasing your vertical jump can dramatically improve your performance in basketball, volleyball, and many other sports. Here are five evidence-based tips to help you add inches to your vertical leap...",
      summary: "Learn how to increase your vertical jump with these proven techniques that can help you gain an edge in your sport.",
      category: "training",
      authorId: coachUser1.id,
      coverImage: "https://images.unsplash.com/photo-1574416792053-85da360629e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      publishDate: new Date(2023, 5, 10),
      featured: true,
      tags: ["vertical jump", "training", "basketball", "volleyball"]
    };
    this.blogPosts.set(blogPost1.id, blogPost1);
    
    const blogPost2: BlogPost = {
      id: this.currentBlogPostId++,
      title: "Understanding the NCAA Eligibility Process",
      slug: "understanding-ncaa-eligibility-process",
      content: "Navigating the NCAA eligibility process can be complex for student athletes. This comprehensive guide breaks down each requirement and provides a clear roadmap to ensure you maintain your eligibility...",
      summary: "A complete guide to NCAA eligibility requirements and how to ensure you meet all criteria as a student athlete.",
      category: "ncaa",
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1580846629473-61e93f9b2268?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      publishDate: new Date(2023, 5, 15),
      featured: true,
      tags: ["ncaa", "eligibility", "college sports", "recruitment"]
    };
    this.blogPosts.set(blogPost2.id, blogPost2);
    
    const blogPost3: BlogPost = {
      id: this.currentBlogPostId++,
      title: "How AI Is Transforming Sports Analysis",
      slug: "how-ai-transforming-sports-analysis",
      content: "Artificial intelligence is revolutionizing how athletes and coaches analyze performance. From motion detection to predictive analytics, discover how AI tools are providing unprecedented insights into athletic performance...",
      summary: "Discover the cutting-edge AI technologies that are changing how athletes train and coaches recruit.",
      category: "technology",
      authorId: adminUser.id,
      coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      publishDate: new Date(2023, 5, 20),
      featured: false,
      tags: ["AI", "technology", "sports analytics", "motion analysis"]
    };
    this.blogPosts.set(blogPost3.id, blogPost3);
    
    // Create sample featured athletes
    const featuredAthlete1: FeaturedAthlete = {
      id: this.currentFeaturedAthleteId++,
      userId: athleteUser.id,
      highlightText: "Alex Johnson has shown exceptional progress in basketball skills, with a 92% match to the sport based on motion analysis.",
      sportPosition: "Guard",
      starRating: 4,
      featuredStats: {
        points: 25,
        rebounds: 8,
        assists: 5,
        achievements: ["Regional championship MVP", "25 points per game average"]
      },
      featuredDate: new Date(2023, 5, 15),
      featuredVideo: sampleVideo.id.toString(),
      coverImage: athleteUser.profileImage || "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      order: 1,
      active: true
    };
    this.featuredAthletes.set(featuredAthlete1.id, featuredAthlete1);
    
    // Create sample workout playlists
    const now = new Date();
    
    // Strength training workout playlist
    const strengthPlaylist: WorkoutPlaylist = {
      id: this.currentWorkoutPlaylistId++,
      userId: athleteUser.id,
      name: "Basketball Strength Builder",
      description: "A strength training program designed for basketball players to improve performance",
      workoutType: "Strength",
      intensityLevel: "Intermediate",
      durationMinutes: 45,
      targetAreas: ["Upper Body", "Lower Body", "Core"],
      isPublic: true,
      createdAt: now,
      lastUsed: now,
      timesUsed: 12
    };
    this.workoutPlaylists.set(strengthPlaylist.id, strengthPlaylist);
    
    // Add exercises to the strength playlist
    const strengthExercises: WorkoutExercise[] = [
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: strengthPlaylist.id,
        name: "Push-ups",
        description: "Standard push-ups focusing on chest and triceps",
        durationSeconds: 60,
        repetitions: 15,
        sets: 3,
        restSeconds: 30,
        orderIndex: 1
      },
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: strengthPlaylist.id,
        name: "Bodyweight Squats",
        description: "Deep squats to strengthen quads and glutes",
        durationSeconds: 60,
        repetitions: 20,
        sets: 3,
        restSeconds: 45,
        orderIndex: 2
      },
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: strengthPlaylist.id,
        name: "Plank",
        description: "Core stabilization exercise",
        durationSeconds: 45,
        repetitions: null,
        sets: 3,
        restSeconds: 30,
        orderIndex: 3
      },
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: strengthPlaylist.id,
        name: "Lunges",
        description: "Forward lunges for leg strength",
        durationSeconds: 60,
        repetitions: 12,
        sets: 3,
        restSeconds: 30,
        orderIndex: 4
      }
    ];
    
    for (const exercise of strengthExercises) {
      this.workoutExercises.set(exercise.id, exercise);
    }
    
    // Cardio workout playlist
    const cardioPlaylist: WorkoutPlaylist = {
      id: this.currentWorkoutPlaylistId++,
      userId: athleteUser.id,
      name: "Basketball Conditioning",
      description: "High-intensity cardio workout to improve basketball endurance",
      workoutType: "Cardio",
      intensityLevel: "Advanced",
      durationMinutes: 30,
      targetAreas: ["Cardiovascular", "Agility"],
      isPublic: true,
      createdAt: now,
      lastUsed: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      timesUsed: 8
    };
    this.workoutPlaylists.set(cardioPlaylist.id, cardioPlaylist);
    
    // Add exercises to the cardio playlist
    const cardioExercises: WorkoutExercise[] = [
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: cardioPlaylist.id,
        name: "Line Sprints",
        description: "Court line-to-line sprints",
        durationSeconds: 30,
        repetitions: 10,
        sets: 2,
        restSeconds: 15,
        orderIndex: 1
      },
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: cardioPlaylist.id,
        name: "Jumping Jacks",
        description: "Classic cardio exercise",
        durationSeconds: 60,
        repetitions: null,
        sets: 3,
        restSeconds: 20,
        orderIndex: 2
      },
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: cardioPlaylist.id,
        name: "Burpees",
        description: "Full body cardio exercise",
        durationSeconds: 45,
        repetitions: 12,
        sets: 3,
        restSeconds: 30,
        orderIndex: 3
      }
    ];
    
    for (const exercise of cardioExercises) {
      this.workoutExercises.set(exercise.id, exercise);
    }
    
    // Flexibility workout playlist (private)
    const flexPlaylist: WorkoutPlaylist = {
      id: this.currentWorkoutPlaylistId++,
      userId: athleteUser.id,
      name: "My Recovery Routine",
      description: "Personal flexibility and recovery routine",
      workoutType: "Flexibility",
      intensityLevel: "Beginner",
      durationMinutes: 20,
      targetAreas: ["Recovery", "Flexibility"],
      isPublic: false,
      createdAt: now,
      lastUsed: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      timesUsed: 5
    };
    this.workoutPlaylists.set(flexPlaylist.id, flexPlaylist);
    
    // Add exercises to the flexibility playlist
    const flexExercises: WorkoutExercise[] = [
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: flexPlaylist.id,
        name: "Hamstring Stretch",
        description: "Seated hamstring stretch",
        durationSeconds: 30,
        repetitions: null,
        sets: 2,
        restSeconds: 10,
        orderIndex: 1
      },
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: flexPlaylist.id,
        name: "Shoulder Stretch",
        description: "Cross-body shoulder stretch",
        durationSeconds: 30,
        repetitions: null,
        sets: 2,
        restSeconds: 10,
        orderIndex: 2
      },
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: flexPlaylist.id,
        name: "Quad Stretch",
        description: "Standing quad stretch",
        durationSeconds: 30,
        repetitions: null,
        sets: 2,
        restSeconds: 10,
        orderIndex: 3
      },
      {
        id: this.currentWorkoutExerciseId++,
        playlistId: flexPlaylist.id,
        name: "Calf Stretch",
        description: "Wall calf stretch",
        durationSeconds: 30,
        repetitions: null,
        sets: 2,
        restSeconds: 10,
        orderIndex: 4
      }
    ];
    
    for (const exercise of flexExercises) {
      this.workoutExercises.set(exercise.id, exercise);
    }
  }
}

import { DatabaseStorage } from "./database-storage";

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
