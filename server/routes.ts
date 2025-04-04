import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fileUpload } from "./file-upload";
import { analyzeVideo, generateSportRecommendations } from "./openai";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  insertUserSchema,
  insertAthleteProfileSchema,
  insertCoachProfileSchema,
  insertVideoSchema,
  insertNcaaEligibilitySchema,
  insertCoachConnectionSchema,
  insertMessageSchema,
} from "@shared/schema";

import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { comparePasswords, hashPassword } from "./database-storage";

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
      saveUninitialized: false,
      store: storage.sessionStore,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (error) {
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

  app.post("/api/auth/login", passport.authenticate("local"), (req: Request, res: Response) => {
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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
