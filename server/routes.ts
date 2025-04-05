import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fileUpload, imageUpload, getUploadedImages, deleteImage } from "./file-upload";
import fs from "fs";
import { analyzeVideo, generateSportRecommendations } from "./openai";
import { hashPassword, comparePasswords } from "./database-storage";
import { db } from "./db";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { WebSocketServer, WebSocket } from 'ws';
import { 
  insertUserSchema,
  insertAthleteProfileSchema,
  insertCoachProfileSchema,
  insertVideoSchema,
  insertNcaaEligibilitySchema,
  insertCoachConnectionSchema,
  insertMessageSchema,
  insertSkillSchema,
  insertChallengeSchema,
  insertAthleteChallengeSchema,
  insertRecoveryLogSchema,
  insertFanClubFollowerSchema,
  insertLeaderboardEntrySchema,
  insertBlogPostSchema,
  insertFeaturedAthleteSchema,
  insertWorkoutPlaylistSchema,
  insertWorkoutExerciseSchema,
  users,
} from "@shared/schema";

import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Create a file upload middleware
const upload = multer({
  dest: path.join(process.cwd(), "uploads"),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "supersecret",
      resave: false,
      saveUninitialized: true,
      store: storage.sessionStore,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      },
    })
  );

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport to use local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Attempting login for username:", username);
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username));
        
        if (!user) {
          console.log("User not found");
          return done(null, false, { message: "Incorrect username" });
        }
        
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          console.log("Invalid password");
          return done(null, false, { message: "Incorrect password" });
        }
        
        console.log("Login successful for:", username);
        return done(null, user);
      } catch (error) {
        console.error("Login error:", error);
        return done(error);
      }
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Hash password before storing
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Create profile based on role
      if (userData.role === "athlete") {
        await storage.createAthleteProfile({
          userId: user.id,
          height: 0,
          weight: 0,
          age: 0,
          school: "",
          graduationYear: 0,
          sportsInterest: [],
          motionScore: 0,
          profileCompletionPercentage: 0,
        });
        
        // Create initial NCAA eligibility
        await storage.createNcaaEligibility({
          userId: user.id,
          coreCoursesCompleted: 0,
          coreCoursesRequired: 16,
          gpa: 0,
          gpaMeetsRequirement: false,
          testScores: "",
          testScoresMeetRequirement: false,
          amateurismStatus: "incomplete",
          overallEligibilityStatus: "incomplete",
        });
      } else if (userData.role === "coach") {
        await storage.createCoachProfile({
          userId: user.id,
          institution: "",
          sports: [],
          level: "",
          experience: 0,
          achievements: "",
        });
      }
      
      // Log in the user after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        return res.status(201).json({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", (req: Request, res: Response, next: Function) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout(function(err) {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user as any;
    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: "Not authenticated" });
  };

  // Middleware to check if user is an admin
  const isAdmin = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated() && (req.user as any).role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Not authorized" });
  };
  
  // Routes for listing athletes and coaches for messaging
  app.get("/api/athletes/list", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const athletes = await storage.getAllAthletes();
      return res.json(athletes.map(athlete => ({
        id: athlete.id,
        name: athlete.name,
        username: athlete.username,
        profileImage: athlete.profileImage,
        role: athlete.role
      })));
    } catch (error) {
      console.error("Error fetching athletes list:", error);
      return res.status(500).json({ message: "Error fetching athletes list" });
    }
  });
  
  app.get("/api/coaches/list", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const coaches = await storage.getAllCoaches();
      return res.json(coaches.map(coach => ({
        id: coach.id,
        name: coach.name,
        username: coach.username,
        profileImage: coach.profileImage,
        role: coach.role
      })));
    } catch (error) {
      console.error("Error fetching coaches list:", error);
      return res.status(500).json({ message: "Error fetching coaches list" });
    }
  });

  // User profile routes
  app.get("/api/athletes/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== "athlete") {
        return res.status(404).json({ message: "Athlete not found" });
      }
      
      const profile = await storage.getAthleteProfile(userId);
      
      return res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        profile,
      });
    } catch (error) {
      console.error("Error fetching athlete:", error);
      return res.status(500).json({ message: "Error fetching athlete data" });
    }
  });

  app.get("/api/coaches/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== "coach") {
        return res.status(404).json({ message: "Coach not found" });
      }
      
      const profile = await storage.getCoachProfile(userId);
      
      return res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        profile,
      });
    } catch (error) {
      console.error("Error fetching coach:", error);
      return res.status(500).json({ message: "Error fetching coach data" });
    }
  });

  // Update athlete profile
  app.put("/api/athletes/:id/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Only allow updating own profile unless admin
      if (userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this profile" });
      }
      
      const profileData = insertAthleteProfileSchema.parse(req.body);
      const updatedProfile = await storage.updateAthleteProfile(userId, profileData);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Athlete profile not found" });
      }
      
      return res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating athlete profile:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Update coach profile
  app.put("/api/coaches/:id/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Only allow updating own profile unless admin
      if (userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this profile" });
      }
      
      const profileData = insertCoachProfileSchema.parse(req.body);
      const updatedProfile = await storage.updateCoachProfile(userId, profileData);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Coach profile not found" });
      }
      
      return res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating coach profile:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Video routes
  app.get("/api/videos", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const videos = await storage.getVideosByUser(user.id);
      return res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      return res.status(500).json({ message: "Error fetching videos" });
    }
  });

  app.get("/api/videos/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const user = req.user as any;
      
      // Only allow access to own videos or admin access
      if (video.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this video" });
      }
      
      return res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      return res.status(500).json({ message: "Error fetching video" });
    }
  });

  // Upload video endpoint
  app.post("/api/videos/upload", isAuthenticated, upload.single("video"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }
      
      const user = req.user as any;
      const { title, description, sportType } = req.body;
      
      // Create a more permanent location for the file
      const uploadsDir = path.join(process.cwd(), "uploads", "videos");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filename = `${Date.now()}-${path.basename(req.file.originalname)}`;
      const filePath = path.join(uploadsDir, filename);
      
      fs.renameSync(req.file.path, filePath);
      
      // Create video entry
      const videoData = insertVideoSchema.parse({
        userId: user.id,
        title,
        description,
        filePath: `/uploads/videos/${filename}`,
        sportType,
        thumbnailPath: "", // Will be updated after processing
      });
      
      const video = await storage.createVideo(videoData);
      
      // Start async video analysis
      analyzeVideo(video.id, filePath)
        .then(async (analysisResult) => {
          // Update video as analyzed
          await storage.updateVideo(video.id, { analyzed: true });
          
          // Generate thumbnail (we'd normally do this in a real implementation)
          await storage.updateVideo(video.id, { 
            thumbnailPath: `https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`
          });
          
          // Create video analysis
          await storage.createVideoAnalysis({
            videoId: video.id,
            motionData: analysisResult.motionData,
            overallScore: analysisResult.overallScore,
            feedback: analysisResult.feedback,
            improvementTips: analysisResult.improvementTips,
            keyFrameTimestamps: analysisResult.keyFrameTimestamps,
          });
          
          // Generate sport recommendations
          const athleteProfile = await storage.getAthleteProfile(user.id);
          if (athleteProfile) {
            const recommendations = await generateSportRecommendations(
              user.id, 
              analysisResult.motionData, 
              athleteProfile
            );
            
            for (const rec of recommendations) {
              await storage.createSportRecommendation({
                userId: user.id,
                sport: rec.sport,
                matchPercentage: rec.matchPercentage,
                positionRecommendation: rec.positionRecommendation,
                potentialLevel: rec.potentialLevel,
                reasonForMatch: rec.reasonForMatch,
              });
            }
          }
          
          // Create achievement for first video analysis if this is the first one
          const userVideos = await storage.getVideosByUser(user.id);
          if (userVideos.length === 1) {
            await storage.createAchievement({
              userId: user.id,
              title: "First Video Analysis",
              description: "Completed your first video motion analysis",
              achievementType: "video",
              iconType: "trophy",
            });
          }
        })
        .catch((error) => {
          console.error("Video analysis error:", error);
        });
      
      return res.status(201).json(video);
    } catch (error) {
      console.error("Error uploading video:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Video analysis routes
  app.get("/api/videos/:id/analysis", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const user = req.user as any;
      
      // Only allow access to own videos or admin access
      if (video.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this analysis" });
      }
      
      const analysis = await storage.getVideoAnalysisByVideoId(videoId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found for this video" });
      }
      
      return res.json(analysis);
    } catch (error) {
      console.error("Error fetching video analysis:", error);
      return res.status(500).json({ message: "Error fetching video analysis" });
    }
  });

  // Sport recommendations routes
  app.get("/api/athletes/:id/recommendations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Only allow access to own recommendations or admin access
      if (userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view these recommendations" });
      }
      
      const recommendations = await storage.getSportRecommendations(userId);
      return res.json(recommendations);
    } catch (error) {
      console.error("Error fetching sport recommendations:", error);
      return res.status(500).json({ message: "Error fetching sport recommendations" });
    }
  });

  // NCAA eligibility routes
  app.get("/api/athletes/:id/ncaa-eligibility", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Only allow access to own eligibility or admin access
      if (userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this eligibility" });
      }
      
      const eligibility = await storage.getNcaaEligibility(userId);
      
      if (!eligibility) {
        return res.status(404).json({ message: "NCAA eligibility not found" });
      }
      
      return res.json(eligibility);
    } catch (error) {
      console.error("Error fetching NCAA eligibility:", error);
      return res.status(500).json({ message: "Error fetching NCAA eligibility" });
    }
  });

  app.put("/api/athletes/:id/ncaa-eligibility", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Only allow updating own eligibility or admin access
      if (userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this eligibility" });
      }
      
      const eligibilityData = insertNcaaEligibilitySchema.parse(req.body);
      const updatedEligibility = await storage.updateNcaaEligibility(userId, eligibilityData);
      
      if (!updatedEligibility) {
        return res.status(404).json({ message: "NCAA eligibility not found" });
      }
      
      return res.json(updatedEligibility);
    } catch (error) {
      console.error("Error updating NCAA eligibility:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Coach connection routes
  app.get("/api/connections", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const connections = await storage.getCoachConnections(user.id, user.role);
      
      // Enhance connections with user info
      const enhancedConnections = await Promise.all(
        connections.map(async (connection) => {
          const otherUserId = user.role === "coach" ? connection.athleteId : connection.coachId;
          const otherUser = await storage.getUser(otherUserId);
          
          return {
            ...connection,
            otherUser: {
              id: otherUser.id,
              name: otherUser.name,
              username: otherUser.username,
              profileImage: otherUser.profileImage,
              role: otherUser.role,
            },
          };
        })
      );
      
      return res.json(enhancedConnections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      return res.status(500).json({ message: "Error fetching connections" });
    }
  });

  app.post("/api/connections", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const { coachId, athleteId, notes } = req.body;
      
      // Validate that the ids are valid based on roles
      if (user.role === "coach" && coachId !== user.id) {
        return res.status(400).json({ message: "Invalid coach ID for current user" });
      }
      
      if (user.role === "athlete" && athleteId !== user.id) {
        return res.status(400).json({ message: "Invalid athlete ID for current user" });
      }
      
      const connectionData = insertCoachConnectionSchema.parse({
        coachId: coachId || user.id,
        athleteId: athleteId || user.id,
        connectionStatus: "pending",
        notes: notes || "",
      });
      
      const connection = await storage.createCoachConnection(connectionData);
      
      return res.status(201).json(connection);
    } catch (error) {
      console.error("Error creating connection:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/connections/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const connectionId = parseInt(req.params.id);
      const user = req.user as any;
      const { connectionStatus } = req.body;
      
      // Only allow updating connection if user is part of it
      const connection = await storage.getCoachConnections(user.id, user.role).then(
        connections => connections.find(c => c.id === connectionId)
      );
      
      if (!connection) {
        return res.status(404).json({ message: "Connection not found or not authorized" });
      }
      
      const updatedConnection = await storage.updateCoachConnection(connectionId, {
        connectionStatus,
        lastContact: new Date(),
      });
      
      // If this is the first accepted connection, create an achievement
      if (connectionStatus === "accepted") {
        const userConnections = await storage.getCoachConnections(user.id, user.role);
        const acceptedConnections = userConnections.filter(c => c.connectionStatus === "accepted");
        
        if (acceptedConnections.length === 1) {
          await storage.createAchievement({
            userId: user.role === "athlete" ? user.id : connection.athleteId,
            title: "Connected with Coach",
            description: "Made your first connection with a college coach",
            achievementType: "connection",
            iconType: "handshake",
          });
        }
      }
      
      return res.json(updatedConnection);
    } catch (error) {
      console.error("Error updating connection:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Achievement routes
  app.get("/api/athletes/:id/achievements", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Only allow access to own achievements or admin access
      if (userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view these achievements" });
      }
      
      const achievements = await storage.getAchievements(userId);
      return res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return res.status(500).json({ message: "Error fetching achievements" });
    }
  });

  // Messaging routes
  app.get("/api/messages", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const messages = await storage.getMessages(user.id);
      
      // Enhance messages with user info
      const enhancedMessages = await Promise.all(
        messages.map(async (message) => {
          const senderId = message.senderId;
          const sender = await storage.getUser(senderId);
          
          return {
            ...message,
            sender: {
              id: sender.id,
              name: sender.name,
              username: sender.username,
              profileImage: sender.profileImage,
              role: sender.role,
            },
          };
        })
      );
      
      return res.json(enhancedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.post("/api/messages", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const { recipientId, content } = req.body;
      
      const messageData = insertMessageSchema.parse({
        senderId: user.id,
        recipientId,
        content,
      });
      
      const message = await storage.createMessage(messageData);
      
      return res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/messages/:id/read", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const messageId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Get the message to check if user is recipient
      const messages = await storage.getMessages(user.id);
      const message = messages.find(m => m.id === messageId);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      if (message.recipientId !== user.id) {
        return res.status(403).json({ message: "Not authorized to mark this message as read" });
      }
      
      const updatedMessage = await storage.markMessageAsRead(messageId);
      
      return res.json(updatedMessage);
    } catch (error) {
      console.error("Error marking message as read:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Error fetching users" });
    }
  });

  app.get("/api/admin/athletes", isAdmin, async (req: Request, res: Response) => {
    try {
      const athletes = await storage.getAllAthletes();
      return res.json(athletes);
    } catch (error) {
      console.error("Error fetching athletes:", error);
      return res.status(500).json({ message: "Error fetching athletes" });
    }
  });

  app.get("/api/admin/coaches", isAdmin, async (req: Request, res: Response) => {
    try {
      const coaches = await storage.getAllCoaches();
      return res.json(coaches);
    } catch (error) {
      console.error("Error fetching coaches:", error);
      return res.status(500).json({ message: "Error fetching coaches" });
    }
  });

  app.get("/api/admin/videos", isAdmin, async (req: Request, res: Response) => {
    try {
      const videos = await storage.getAllVideos();
      return res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      return res.status(500).json({ message: "Error fetching videos" });
    }
  });

  app.get("/api/admin/stats", isAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getSystemStats();
      return res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      return res.status(500).json({ message: "Error fetching stats" });
    }
  });

  // Player Story Mode - Skills API Routes
  app.get("/api/player/skills", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const skills = await storage.getUserSkills(user.id);
      return res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      return res.status(500).json({ message: "Error fetching skills" });
    }
  });

  app.post("/api/player/skills", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const skillData = insertSkillSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const skill = await storage.createSkill(skillData);
      return res.status(201).json(skill);
    } catch (error) {
      console.error("Error creating skill:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/player/skills/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const skillId = parseInt(req.params.id);
      const user = req.user as any;
      const skill = await storage.getSkill(skillId);
      
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      // Only allow updating own skills unless admin
      if (skill.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this skill" });
      }
      
      const updatedSkill = await storage.updateSkill(skillId, req.body);
      return res.json(updatedSkill);
    } catch (error) {
      console.error("Error updating skill:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Player Story Mode - Challenges API Routes
  app.get("/api/player/challenges", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const challenges = await storage.getChallenges();
      return res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      return res.status(500).json({ message: "Error fetching challenges" });
    }
  });

  app.get("/api/player/challenges/active", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userChallenges = await storage.getAthleteChallenges(user.id);
      
      // For each user challenge, get the challenge details
      const activeChallenges = await Promise.all(
        userChallenges.map(async (userChallenge) => {
          const challenge = await storage.getChallenge(userChallenge.challengeId);
          return {
            ...userChallenge,
            challenge,
          };
        })
      );
      
      return res.json(activeChallenges);
    } catch (error) {
      console.error("Error fetching active challenges:", error);
      return res.status(500).json({ message: "Error fetching active challenges" });
    }
  });

  app.post("/api/player/challenges/:id/accept", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const challengeId = parseInt(req.params.id);
      const user = req.user as any;
      
      const challenge = await storage.getChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      // Check if user already accepted this challenge
      const existingChallenge = await storage.getAthleteChallengeByUserAndChallenge(user.id, challengeId);
      if (existingChallenge) {
        return res.status(400).json({ message: "Challenge already accepted" });
      }
      
      const athleteChallenge = await storage.createAthleteChallenge({
        userId: user.id,
        challengeId,
        status: "in-progress",
        startedAt: new Date(),
        completedAt: null,
        proofUrl: null,
      });
      
      return res.status(201).json(athleteChallenge);
    } catch (error) {
      console.error("Error accepting challenge:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/player/challenges/:id/complete", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const challengeId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Find the athlete challenge
      const athleteChallenge = await storage.getAthleteChallengeByUserAndChallenge(user.id, challengeId);
      if (!athleteChallenge) {
        return res.status(404).json({ message: "Challenge not found or not accepted" });
      }
      
      if (athleteChallenge.status === "completed") {
        return res.status(400).json({ message: "Challenge already completed" });
      }
      
      // Update the athlete challenge
      const updatedChallenge = await storage.updateAthleteChallenge(athleteChallenge.id, {
        status: "completed",
        completedAt: new Date(),
        proofUrl: req.body.proofUrl || null,
      });
      
      // Get the challenge details to award XP
      const challenge = await storage.getChallenge(challengeId);
      if (challenge) {
        // Find a skill that matches the challenge category
        const skills = await storage.getUserSkills(user.id);
        const matchingSkill = skills.find(skill => skill.skillCategory.toLowerCase() === challenge.category.toLowerCase());
        
        // If there's a matching skill, update it with XP
        if (matchingSkill) {
          const newXpPoints = matchingSkill.xpPoints + challenge.xpReward;
          let newLevel = matchingSkill.skillLevel;
          
          // Level up if enough XP
          if (newXpPoints >= matchingSkill.nextLevelXp && matchingSkill.skillLevel < matchingSkill.maxLevel) {
            newLevel += 1;
          }
          
          await storage.updateSkill(matchingSkill.id, {
            xpPoints: newXpPoints,
            skillLevel: newLevel,
          });
          
          // Add achievement if this is the first challenge completed
          const completedChallenges = await storage.getCompletedChallengesByUser(user.id);
          if (completedChallenges.length === 1) {
            await storage.createAchievement({
              userId: user.id,
              title: "First Challenge Completed",
              description: "Completed your first training challenge",
              achievementType: "challenge",
              iconType: "award",
              earnedDate: new Date(),
            });
          }
        }
      }
      
      return res.json(updatedChallenge);
    } catch (error) {
      console.error("Error completing challenge:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Player Story Mode - Recovery Tracker API Routes
  app.get("/api/player/recovery", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const recoveryLogs = await storage.getRecoveryLogs(user.id);
      return res.json(recoveryLogs);
    } catch (error) {
      console.error("Error fetching recovery logs:", error);
      return res.status(500).json({ message: "Error fetching recovery logs" });
    }
  });

  app.post("/api/player/recovery", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const logData = insertRecoveryLogSchema.parse({
        ...req.body,
        userId: user.id,
        logDate: new Date(),
      });
      
      const log = await storage.createRecoveryLog(logData);
      
      // Check if this is the first recovery log
      const userLogs = await storage.getRecoveryLogs(user.id);
      if (userLogs.length === 1) {
        await storage.createAchievement({
          userId: user.id,
          title: "Recovery Tracking Started",
          description: "Started tracking your recovery and wellness",
          achievementType: "recovery",
          iconType: "heart",
          earnedDate: new Date(),
        });
      }
      
      return res.status(201).json(log);
    } catch (error) {
      console.error("Error creating recovery log:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Player Story Mode - Fan Club API Routes
  app.get("/api/player/fan-club", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const followers = await storage.getFanClubFollowers(user.id);
      return res.json(followers);
    } catch (error) {
      console.error("Error fetching fan club followers:", error);
      return res.status(500).json({ message: "Error fetching fan club followers" });
    }
  });

  app.post("/api/player/fan-club", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // Only athletes can have fan clubs
      const athlete = await storage.getAthleteProfile(user.id);
      if (!athlete) {
        return res.status(403).json({ message: "Only athletes can have fan clubs" });
      }
      
      const followerData = insertFanClubFollowerSchema.parse({
        ...req.body,
        athleteId: user.id,
        followDate: new Date(),
      });
      
      const follower = await storage.createFanClubFollower(followerData);
      
      // Check milestone achievements
      const followers = await storage.getFanClubFollowers(user.id);
      if (followers.length === 1) {
        await storage.createAchievement({
          userId: user.id,
          title: "First Fan",
          description: "Someone is following your athletic journey",
          achievementType: "fanclub",
          iconType: "users",
          earnedDate: new Date(),
        });
      } else if (followers.length === 10) {
        await storage.createAchievement({
          userId: user.id,
          title: "Rising Star",
          description: "Your fan club has reached 10 followers",
          achievementType: "fanclub",
          iconType: "star",
          earnedDate: new Date(),
        });
      } else if (followers.length === 50) {
        await storage.createAchievement({
          userId: user.id,
          title: "Local Celebrity",
          description: "Your fan club has reached 50 followers",
          achievementType: "fanclub",
          iconType: "award",
          earnedDate: new Date(),
        });
      }
      
      return res.status(201).json(follower);
    } catch (error) {
      console.error("Error creating fan club follower:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Player Story Mode - Leaderboard API Routes
  app.get("/api/player/leaderboard/:category", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const entries = await storage.getLeaderboardEntries(category);
      return res.json(entries);
    } catch (error) {
      console.error("Error fetching leaderboard entries:", error);
      return res.status(500).json({ message: "Error fetching leaderboard entries" });
    }
  });

  app.get("/api/player/leaderboard", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const entries = await storage.getLeaderboardEntriesByUser(user.id);
      return res.json(entries);
    } catch (error) {
      console.error("Error fetching user leaderboard entries:", error);
      return res.status(500).json({ message: "Error fetching user leaderboard entries" });
    }
  });

  app.post("/api/player/leaderboard", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      const entryData = insertLeaderboardEntrySchema.parse({
        ...req.body,
        userId: user.id,
        updatedAt: new Date(),
      });
      
      // Check if entry already exists for this category and user
      const existingEntry = await storage.getUserLeaderboardEntry(user.id, entryData.category);
      
      let entry;
      if (existingEntry) {
        // Update only if new score is higher
        if (entryData.score > existingEntry.score) {
          entry = await storage.updateLeaderboardEntry(existingEntry.id, {
            score: entryData.score,
            rankPosition: entryData.rankPosition,
            updatedAt: new Date(),
          });
        } else {
          entry = existingEntry;
        }
      } else {
        entry = await storage.createLeaderboardEntry(entryData);
      }
      
      // Update all rank positions in this category
      await storage.recalculateLeaderboardRanks(entryData.category);
      
      return res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating/updating leaderboard entry:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Player Story Mode - Achievements API Routes
  app.get("/api/player/achievements", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const achievements = await storage.getAchievementsByUser(user.id);
      return res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return res.status(500).json({ message: "Error fetching achievements" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients with their user info
  const clients = new Map<WebSocket, { userId: number, username: string, role: string }>();
  
  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket connection established');
    
    // Handle authentication - extract session
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      ws.close(4001, 'Authentication required');
      return;
    }
    
    // The client needs to authenticate after connection
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Handle client authentication
        if (data.type === 'auth') {
          const userId = data.userId;
          const user = await storage.getUser(userId);
          
          if (!user) {
            ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
            return;
          }
          
          // Store client info
          clients.set(ws, { 
            userId: user.id, 
            username: user.username, 
            role: user.role 
          });
          
          console.log(`WebSocket authenticated for user: ${user.username}`);
          
          // Send confirmation
          ws.send(JSON.stringify({ 
            type: 'auth_success',
            message: 'Authentication successful' 
          }));
          
          // Load unread messages
          const messages = await storage.getMessages(userId);
          const unreadMessages = messages.filter(msg => !msg.isRead && msg.recipientId === userId);
          
          if (unreadMessages.length > 0) {
            ws.send(JSON.stringify({ 
              type: 'unread_messages', 
              count: unreadMessages.length,
              messages: unreadMessages.map(msg => ({
                id: msg.id,
                senderId: msg.senderId,
                recipientId: msg.recipientId,
                content: msg.content,
                createdAt: msg.createdAt,
                isRead: msg.isRead
              }))
            }));
          }
          
          return;
        }
        
        // Check if client is authenticated
        const clientInfo = clients.get(ws);
        if (!clientInfo) {
          ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
          return;
        }
        
        // Handle messages
        if (data.type === 'message') {
          const { recipientId, content } = data;
          
          if (!recipientId || !content) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid message data' }));
            return;
          }
          
          // Store message in database
          const message = await storage.createMessage({
            senderId: clientInfo.userId,
            recipientId,
            content,
            isRead: false
          });
          
          // Find recipient if they're connected
          for (const [clientWs, info] of clients.entries()) {
            if (info.userId === recipientId && clientWs.readyState === WebSocket.OPEN) {
              // Send to recipient
              clientWs.send(JSON.stringify({
                type: 'new_message',
                message: {
                  id: message.id,
                  senderId: message.senderId,
                  senderName: clientInfo.username,
                  recipientId: message.recipientId,
                  content: message.content,
                  createdAt: message.createdAt,
                  isRead: message.isRead
                }
              }));
              break;
            }
          }
          
          // Confirm to sender
          ws.send(JSON.stringify({
            type: 'message_sent',
            messageId: message.id,
            recipientId,
            timestamp: new Date().toISOString()
          }));
          
          return;
        }
        
        // Handle read receipts
        if (data.type === 'message_read') {
          const { messageId } = data;
          
          if (!messageId) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid message ID' }));
            return;
          }
          
          // Update message in database
          const updatedMessage = await storage.markMessageAsRead(messageId);
          
          if (!updatedMessage) {
            ws.send(JSON.stringify({ type: 'error', message: 'Message not found' }));
            return;
          }
          
          // Notify sender if connected
          for (const [clientWs, info] of clients.entries()) {
            if (info.userId === updatedMessage.senderId && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({
                type: 'message_read_receipt',
                messageId: updatedMessage.id,
                readAt: new Date().toISOString()
              }));
              break;
            }
          }
          
          return;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });
    
    // Handle disconnections
    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket connection closed');
    });
  });

  // Blog Posts API Routes
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const blogPosts = await storage.getBlogPosts(limit, offset);
      res.json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });
  
  app.get("/api/blog-posts/featured", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const featuredPosts = await storage.getFeaturedBlogPosts(limit);
      res.json(featuredPosts);
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      res.status(500).json({ message: "Error fetching featured blog posts" });
    }
  });
  
  app.get("/api/blog-posts/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const posts = await storage.getBlogPostsByCategory(category, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts by category:", error);
      res.status(500).json({ message: "Error fetching blog posts by category" });
    }
  });
  
  app.get("/api/blog-posts/:slug", async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });
  
  // Admin-only blog post management routes
  app.post("/api/blog-posts", isAdmin, async (req: Request, res: Response) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  app.put("/api/blog-posts/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const postData = insertBlogPostSchema.partial().parse(req.body);
      
      const updatedPost = await storage.updateBlogPost(postId, postData);
      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  app.delete("/api/blog-posts/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(postId);
      
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Error deleting blog post" });
    }
  });
  
  // Featured Athletes API Routes
  app.get("/api/featured-athletes", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const athletes = await storage.getFeaturedAthletes(limit);
      
      // Enrich with user data
      const enrichedAthletes = await Promise.all(athletes.map(async (athlete) => {
        const user = await storage.getUser(athlete.userId);
        return {
          ...athlete,
          name: user?.name || "",
          username: user?.username || "",
          profileImage: user?.profileImage || athlete.coverImage
        };
      }));
      
      res.json(enrichedAthletes);
    } catch (error) {
      console.error("Error fetching featured athletes:", error);
      res.status(500).json({ message: "Error fetching featured athletes" });
    }
  });
  
  app.get("/api/featured-athletes/:id", async (req: Request, res: Response) => {
    try {
      const athleteId = parseInt(req.params.id);
      const athlete = await storage.getFeaturedAthlete(athleteId);
      
      if (!athlete) {
        return res.status(404).json({ message: "Featured athlete not found" });
      }
      
      const user = await storage.getUser(athlete.userId);
      
      res.json({
        ...athlete,
        name: user?.name || "",
        username: user?.username || "",
        profileImage: user?.profileImage || athlete.coverImage
      });
    } catch (error) {
      console.error("Error fetching featured athlete:", error);
      res.status(500).json({ message: "Error fetching featured athlete" });
    }
  });
  
  // Admin-only featured athlete management routes
  app.post("/api/featured-athletes", isAdmin, async (req: Request, res: Response) => {
    try {
      const athleteData = insertFeaturedAthleteSchema.parse(req.body);
      const athlete = await storage.createFeaturedAthlete(athleteData);
      res.status(201).json(athlete);
    } catch (error) {
      console.error("Error creating featured athlete:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  app.put("/api/featured-athletes/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const athleteId = parseInt(req.params.id);
      const athleteData = insertFeaturedAthleteSchema.partial().parse(req.body);
      
      const updatedAthlete = await storage.updateFeaturedAthlete(athleteId, athleteData);
      if (!updatedAthlete) {
        return res.status(404).json({ message: "Featured athlete not found" });
      }
      
      res.json(updatedAthlete);
    } catch (error) {
      console.error("Error updating featured athlete:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  app.delete("/api/featured-athletes/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const athleteId = parseInt(req.params.id);
      const success = await storage.deactivateFeaturedAthlete(athleteId);
      
      if (!success) {
        return res.status(404).json({ message: "Featured athlete not found" });
      }
      
      res.json({ message: "Featured athlete deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating featured athlete:", error);
      res.status(500).json({ message: "Error deactivating featured athlete" });
    }
  });
  
  // Workout Playlist Routes
  app.get("/api/workout-playlists", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const playlists = await storage.getWorkoutPlaylists(userId);
      res.json(playlists);
    } catch (error) {
      console.error("Error retrieving workout playlists:", error);
      res.status(500).json({ message: "Error retrieving workout playlists" });
    }
  });
  
  app.get("/api/workout-playlists/public", async (req: Request, res: Response) => {
    try {
      const workoutType = req.query.workoutType as string | undefined;
      const intensityLevel = req.query.intensityLevel as string | undefined;
      const playlists = await storage.getPublicWorkoutPlaylists(workoutType, intensityLevel);
      res.json(playlists);
    } catch (error) {
      console.error("Error retrieving public workout playlists:", error);
      res.status(500).json({ message: "Error retrieving public workout playlists" });
    }
  });
  
  app.get("/api/workout-playlists/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const playlistId = parseInt(req.params.id);
      const playlist = await storage.getWorkoutPlaylist(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: "Workout playlist not found" });
      }
      
      // If this is not a public playlist, ensure the user has access
      if (!playlist.isPublic && playlist.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to access this playlist" });
      }
      
      res.json(playlist);
    } catch (error) {
      console.error("Error retrieving workout playlist:", error);
      res.status(500).json({ message: "Error retrieving workout playlist" });
    }
  });
  
  app.post("/api/workout-playlists", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const playlistData = insertWorkoutPlaylistSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const newPlaylist = await storage.createWorkoutPlaylist(playlistData);
      res.status(201).json(newPlaylist);
    } catch (error) {
      console.error("Error creating workout playlist:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  app.put("/api/workout-playlists/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const playlistId = parseInt(req.params.id);
      const existingPlaylist = await storage.getWorkoutPlaylist(playlistId);
      
      if (!existingPlaylist) {
        return res.status(404).json({ message: "Workout playlist not found" });
      }
      
      if (existingPlaylist.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to update this playlist" });
      }
      
      const updatedPlaylist = await storage.updateWorkoutPlaylist(playlistId, req.body);
      res.json(updatedPlaylist);
    } catch (error) {
      console.error("Error updating workout playlist:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  app.delete("/api/workout-playlists/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const playlistId = parseInt(req.params.id);
      const existingPlaylist = await storage.getWorkoutPlaylist(playlistId);
      
      if (!existingPlaylist) {
        return res.status(404).json({ message: "Workout playlist not found" });
      }
      
      if (existingPlaylist.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to delete this playlist" });
      }
      
      const success = await storage.deleteWorkoutPlaylist(playlistId);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to delete workout playlist" });
      }
      
      res.json({ message: "Workout playlist deleted successfully" });
    } catch (error) {
      console.error("Error deleting workout playlist:", error);
      res.status(500).json({ message: "Error deleting workout playlist" });
    }
  });
  
  app.post("/api/workout-playlists/:id/use", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const playlistId = parseInt(req.params.id);
      const existingPlaylist = await storage.getWorkoutPlaylist(playlistId);
      
      if (!existingPlaylist) {
        return res.status(404).json({ message: "Workout playlist not found" });
      }
      
      const updatedPlaylist = await storage.incrementPlaylistUsage(playlistId);
      res.json(updatedPlaylist);
    } catch (error) {
      console.error("Error updating playlist usage:", error);
      res.status(500).json({ message: "Error updating playlist usage" });
    }
  });
  
  app.get("/api/workout-playlists/:id/exercises", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const playlistId = parseInt(req.params.id);
      const playlist = await storage.getWorkoutPlaylist(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: "Workout playlist not found" });
      }
      
      // If this is not a public playlist, ensure the user has access
      if (!playlist.isPublic && playlist.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to access this playlist" });
      }
      
      const exercises = await storage.getWorkoutExercises(playlistId);
      res.json(exercises);
    } catch (error) {
      console.error("Error retrieving workout exercises:", error);
      res.status(500).json({ message: "Error retrieving workout exercises" });
    }
  });
  
  app.post("/api/workout-playlists/:id/exercises", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const playlistId = parseInt(req.params.id);
      const playlist = await storage.getWorkoutPlaylist(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: "Workout playlist not found" });
      }
      
      if (playlist.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to add exercises to this playlist" });
      }
      
      const exerciseData = insertWorkoutExerciseSchema.parse({
        ...req.body,
        playlistId
      });
      
      const newExercise = await storage.createWorkoutExercise(exerciseData);
      res.status(201).json(newExercise);
    } catch (error) {
      console.error("Error creating workout exercise:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  app.put("/api/workout-exercises/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const exerciseId = parseInt(req.params.id);
      // We need to check if the user owns the playlist that contains this exercise
      const exercise = await storage.getWorkoutExercises(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({ message: "Workout exercise not found" });
      }
      
      // Get the playlist to check ownership
      const playlist = await storage.getWorkoutPlaylist(exercise.playlistId);
      if (!playlist || playlist.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to update this exercise" });
      }
      
      const updatedExercise = await storage.updateWorkoutExercise(exerciseId, req.body);
      res.json(updatedExercise);
    } catch (error) {
      console.error("Error updating workout exercise:", error);
      res.status(400).json({ message: error.message });
    }
  });
  
  app.delete("/api/workout-exercises/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const exerciseId = parseInt(req.params.id);
      // We need to check if the user owns the playlist that contains this exercise
      const exercise = await storage.getWorkoutExercises(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({ message: "Workout exercise not found" });
      }
      
      // Get the playlist to check ownership
      const playlist = await storage.getWorkoutPlaylist(exercise.playlistId);
      if (!playlist || playlist.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to delete this exercise" });
      }
      
      const success = await storage.deleteWorkoutExercise(exerciseId);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to delete workout exercise" });
      }
      
      res.json({ message: "Workout exercise deleted successfully" });
    } catch (error) {
      console.error("Error deleting workout exercise:", error);
      res.status(500).json({ message: "Error deleting workout exercise" });
    }
  });
  
  app.post("/api/workout-playlists/generate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { workoutType, intensityLevel, duration, targets } = req.body;
      
      // Validate required fields
      if (!workoutType || !intensityLevel || !duration || !targets || !Array.isArray(targets) || targets.length === 0) {
        return res.status(400).json({ message: "Missing required fields. Please provide workoutType, intensityLevel, duration and targets array." });
      }
      
      // Get user profile for personalized recommendations if available
      const athleteProfile = await storage.getAthleteProfileByUserId(userId);
      
      const generatedPlaylist = await storage.generateAIWorkoutPlaylist(userId, {
        workoutType,
        intensityLevel,
        duration,
        targets,
        userProfile: athleteProfile
      });
      
      res.status(201).json(generatedPlaylist);
    } catch (error) {
      console.error("Error generating AI workout playlist:", error);
      res.status(500).json({ message: "Error generating AI workout playlist" });
    }
  });
  
  // Home feed API - combines blog posts and featured athletes for the dashboard
  // CMS Image Management Routes
  app.get("/api/cms/images", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const images = await getUploadedImages(category);
      return res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      return res.status(500).json({ message: "Error fetching images" });
    }
  });

  app.post("/api/cms/images/upload", isAuthenticated, imageUpload.single("image"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }
      
      const category = req.body.category || 'images';
      const relativePath = path.relative(process.cwd(), req.file.path);
      const url = `/${relativePath.split(path.sep).join('/')}`;
      
      return res.status(201).json({
        url,
        path: relativePath,
        filename: req.file.filename,
        category,
        originalname: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ message: "Error uploading image" });
    }
  });

  app.delete("/api/cms/images/:path(*)", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const imagePath = req.params.path;
      const success = await deleteImage(imagePath);
      
      if (!success) {
        return res.status(404).json({ message: "Image not found or could not be deleted" });
      }
      
      return res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      return res.status(500).json({ message: "Error deleting image" });
    }
  });

  // User Profile Image Update
  app.post("/api/users/:id/profile-image", isAuthenticated, imageUpload.single("image"), async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Only allow updating own profile image unless admin
      if (userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this profile" });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }
      
      const relativePath = path.relative(process.cwd(), req.file.path);
      const profileImageUrl = `/${relativePath.split(path.sep).join('/')}`;
      
      // Update the user's profile image
      const updatedUser = await storage.updateUser(userId, { profileImage: profileImageUrl });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json({
        id: updatedUser.id,
        profileImage: updatedUser.profileImage
      });
    } catch (error) {
      console.error("Error updating profile image:", error);
      return res.status(500).json({ message: "Error updating profile image" });
    }
  });

  // Add a route for checking if the CMS system is working
  app.get("/api/cms/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const uploadsDir = path.join(process.cwd(), "uploads");
      const dirExists = fs.existsSync(uploadsDir);
      
      return res.json({
        status: "operational",
        uploadsDirectoryExists: dirExists,
        categories: ["profiles", "blog", "featured", "banners"]
      });
    } catch (error) {
      console.error("Error checking CMS status:", error);
      return res.status(500).json({ message: "Error checking CMS status" });
    }
  });

  app.get("/api/feed", async (req: Request, res: Response) => {
    try {
      // Get featured blog posts
      const featuredPosts = await storage.getFeaturedBlogPosts(3);
      
      // Get featured athletes
      const featuredAthletes = await storage.getFeaturedAthletes(4);
      
      // Enrich athletes with user data
      const enrichedAthletes = await Promise.all(featuredAthletes.map(async (athlete) => {
        const user = await storage.getUser(athlete.userId);
        return {
          ...athlete,
          name: user?.name || "",
          username: user?.username || "",
          profileImage: user?.profileImage || athlete.coverImage
        };
      }));
      
      // Get latest blog posts
      const latestPosts = await storage.getBlogPosts(5);
      
      res.json({
        featuredPosts,
        featuredAthletes: enrichedAthletes,
        latestPosts
      });
    } catch (error) {
      console.error("Error fetching home feed:", error);
      res.status(500).json({ message: "Error fetching home feed" });
    }
  });

  return httpServer;
}
