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
  leaderboardEntries, type LeaderboardEntry, type InsertLeaderboardEntry
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
      sentAt: now, 
      read: false 
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, read: true };
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
  }
}

import { DatabaseStorage } from "./database-storage";

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
