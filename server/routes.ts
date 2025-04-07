import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fileUpload, imageUpload, videoUpload, getUploadedImages, deleteImage } from "./file-upload";
import fs from "fs";
import { analyzeVideo, generateSportRecommendations, analyzePlayStrategy } from "./openai";
import activeNetworkService from "./active-network";
import { db } from "./db";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { WebSocketServer, WebSocket } from 'ws';
import { setupAuth, hashPassword as authHashPassword } from "./auth";
import passport from "passport";
import { saveApiKey, getApiKeyStatus } from "./api-keys";
import { footballCoachService } from "./services/football-coach-service";
import { sendSms, checkSmsStatus, sendVerificationCode, verifyCode, sendNotification } from './services/sms-routes';
import { 
  insertUserSchema,
  insertAthleteProfileSchema,
  insertCoachProfileSchema,
  insertVideoSchema,
  insertVideoWithFileSchema,
  insertNcaaEligibilitySchema,
  insertCoachConnectionSchema,
  insertMessageSchema,
  insertSkillSchema,
  insertChallengeSchema,
  insertAthleteChallengeSchema,
  insertRecoveryLogSchema,
  videoHighlights,
  highlightGeneratorConfigs,
  insertVideoHighlightSchema,
  insertHighlightGeneratorConfigSchema,
  insertFanClubFollowerSchema,
  insertLeaderboardEntrySchema,
  insertBlogPostSchema,
  insertFeaturedAthleteSchema,
  insertWorkoutPlaylistSchema,
  insertWorkoutExerciseSchema,
  insertFilmComparisonSchema,
  insertComparisonVideoSchema,
  insertComparisonAnalysisSchema,
  insertAthleteStarProfileSchema,
  insertUserAgreementSchema,
  insertGarCategorySchema,
  insertGarSubcategorySchema,
  insertGarAthleteRatingSchema,
  insertGarRatingHistorySchema,
  users,
  athleteStarProfiles,
  videos,
  garCategories,
  garSubcategories,
  garAthleteRatings,
  garRatingHistory,
} from "@shared/schema";

// Create a file upload middleware
const upload = multer({
  dest: path.join(process.cwd(), "uploads"),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server with WebSocket support
  const server = createServer(app);
  
  // Set up WebSocket server on a distinct path to avoid conflicts with Vite's HMR
  const wss = new WebSocketServer({ 
    server, 
    path: '/ws',
    perMessageDeflate: false
  });
  
  // Track connected clients with their user info
  const clients = new Map<WebSocket, { userId: number, username: string, role: string }>();
  
  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    
    // The client needs to authenticate after connection
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle client authentication
        if (data.type === 'auth') {
          const userId = data.userId;
          const user = await storage.getUser(userId);
          
          if (!user) {
            console.log(`WebSocket authentication failed for user ID: ${userId}`);
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
        
        // Handle chat messages
        if (data.type === 'chat_message') {
          const { content, recipientId, senderId, timestamp } = data;
          
          // Validate the sender
          const clientInfo = clients.get(ws);
          if (!clientInfo || clientInfo.userId !== senderId) {
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: 'Unauthorized message sender' 
            }));
            return;
          }
          
          // Get sender info to include in forwarded messages
          const sender = await storage.getUser(senderId);
          if (!sender) {
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: 'Sender not found' 
            }));
            return;
          }
          
          const outgoingMessage = {
            type: 'chat_message',
            senderId,
            senderName: sender.name,
            content,
            timestamp,
            recipientId: recipientId || null
          };
          
          // Store the message in the database if needed
          try {
            await storage.createMessage({
              senderId,
              recipientId: recipientId || null,
              content,
              isRead: false
            });
          } catch (dbError) {
            console.error('Error storing chat message:', dbError);
            // Continue even if storage fails
          }
          
          // Handle private message or broadcast
          if (recipientId > 0) {
            // Send to specific recipient
            for (const [client, info] of clients.entries()) {
              if (info.userId === recipientId) {
                client.send(JSON.stringify(outgoingMessage));
                break;
              }
            }
            
            // Also send confirmation back to the sender
            ws.send(JSON.stringify({ 
              type: 'message_sent', 
              recipientId,
              timestamp 
            }));
          } else {
            // Broadcast to all connected clients except sender
            for (const [client, info] of clients.entries()) {
              if (client !== ws) {
                client.send(JSON.stringify(outgoingMessage));
              }
            }
          }
          
          return;
        }
        
        // Handle other message types as needed
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'connected' }));
  });
  
  // PUBLIC ROUTES: Register public endpoints BEFORE authentication setup
  // This way these routes won't be affected by authentication middleware
  
  // Get featured video highlights (public endpoint)
  app.get("/api/highlights/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const highlights = await storage.getFeaturedVideoHighlights(limit);
      return res.json(highlights);
    } catch (error) {
      console.error("Error fetching featured highlights:", error);
      return res.status(500).json({ message: "Error fetching featured highlights" });
    }
  });
  
  // Public endpoint for non-authenticated users to submit agreements (like NDA)
  app.post("/api/public/user-agreements", async (req: Request, res: Response) => {
    try {
      // For non-authenticated users, we just return success without storing in DB
      // This allows the GlobalAgreementModal to function for guests
      // When they register or log in, they'll be prompted to formally accept the agreement
      
      // Get client IP and user agent for logging purposes
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      console.log(`Guest agreement accepted from IP: ${ipAddress}, UA: ${userAgent}`);
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing guest agreement:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Now set up authentication AFTER public routes
  setupAuth(app);
  
  // Add enhanced login route for better debugging
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      
      if (!user) {
        console.log("Authentication failed:", info);
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Log successful authentication
      console.log(`User authenticated: ${user.username}, ID: ${user.id}`);
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Session login error:", loginErr);
          return next(loginErr);
        }
        
        // Log session details
        console.log("Session created:", req.sessionID);
        console.log("Session data:", req.session);
        
        return res.status(200).json({ user });
      });
    })(req, res, next);
  });
  
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await authHashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ user });
      });
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  
  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    res.json({ user: req.user });
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

  // User agreement routes
  app.get("/api/user-agreements/:userId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const requestUser = req.user as any;
      
      // Only allow viewing own agreement or admins can view any
      if (userId !== requestUser.id && requestUser.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this agreement" });
      }
      
      const agreement = await storage.getUserAgreement(userId);
      
      if (!agreement) {
        return res.status(404).json({ message: "No agreement found for this user" });
      }
      
      return res.json(agreement);
    } catch (error) {
      console.error("Error fetching user agreement:", error);
      return res.status(500).json({ message: "Error fetching user agreement" });
    }
  });

  app.post("/api/user-agreements", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const agreement = insertUserAgreementSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      // Get client IP and user agent
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      // Create agreement with IP and user agent for legal tracking
      const newAgreement = await storage.createUserAgreement({
        ...agreement,
        ipAddress: ipAddress ? String(ipAddress) : null,
        userAgent: userAgent ? String(userAgent) : null
      });
      
      return res.status(201).json(newAgreement);
    } catch (error) {
      console.error("Error creating user agreement:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Authentication routes are now handled in auth.ts via setupAuth(app) and the routes above
  
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

  // Get athlete profile by ID
  app.get("/api/athletes/:id/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const requestUser = req.user as any;
      
      // Only allow viewing own profile unless admin
      if (userId !== requestUser.id && requestUser.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this profile" });
      }
      
      const profile = await storage.getAthleteProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Athlete profile not found" });
      }
      
      return res.json(profile);
    } catch (error) {
      console.error("Error fetching athlete profile:", error);
      return res.status(500).json({ message: "Error fetching athlete profile data" });
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
      
      // Check if profile exists
      let profile = await storage.getAthleteProfile(userId);
      
      if (!profile) {
        // Create new profile if it doesn't exist
        profile = await storage.createAthleteProfile({
          userId,
          ...profileData
        });
        return res.status(201).json(profile);
      }
      
      // Update existing profile
      const updatedProfile = await storage.updateAthleteProfile(userId, profileData);
      
      if (!updatedProfile) {
        return res.status(500).json({ message: "Failed to update athlete profile" });
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
  app.post("/api/videos/upload", isAuthenticated, videoUpload.single("video"), async (req: Request, res: Response) => {
    try {
      console.log("Video upload received:", req.file ? "File present" : "No file");
      console.log("Request body:", req.body);
      console.log("User:", req.user ? `ID: ${(req.user as any).id}, Role: ${(req.user as any).role}` : "No user");
      
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
      const videoData = insertVideoWithFileSchema.parse({
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

  // Play strategy analysis endpoint
  app.post("/api/videos/:id/analyze-play", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const user = req.user as any;
      
      // Only allow access to own videos or admin/coach access
      if (video.userId !== user.id && user.role !== "admin" && user.role !== "coach") {
        return res.status(403).json({ message: "Not authorized to analyze this video" });
      }
      
      // Get sport type from video or request body
      const sportType = req.body.sportType || video.sportType || "basketball";
      
      // Get context from request body (offense, defense, etc.)
      const context = req.body.context || "general";
      
      // Analyze the play strategy
      const playAnalysis = await analyzePlayStrategy(videoId, sportType, context);
      
      return res.json(playAnalysis);
    } catch (error) {
      console.error("Error analyzing play strategy:", error);
      return res.status(500).json({ message: "Error analyzing play strategy" });
    }
  });

  // Video highlights routes
  app.get("/api/videos/:id/highlights", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const user = req.user as any;
      
      // Only allow access to own videos or admin access
      if (video.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view these highlights" });
      }
      
      const highlights = await storage.getVideoHighlights(videoId);
      return res.json(highlights);
    } catch (error) {
      console.error("Error fetching video highlights:", error);
      return res.status(500).json({ message: "Error fetching video highlights" });
    }
  });

  app.get("/api/highlights/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const highlightId = parseInt(req.params.id);
      const highlight = await storage.getVideoHighlight(highlightId);
      
      if (!highlight) {
        return res.status(404).json({ message: "Highlight not found" });
      }
      
      // Fetch the related video to check permission
      const video = await storage.getVideo(highlight.videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Original video not found" });
      }
      
      const user = req.user as any;
      
      // Only allow access to own video highlights or admin access
      if (video.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this highlight" });
      }
      
      return res.json(highlight);
    } catch (error) {
      console.error("Error fetching highlight:", error);
      return res.status(500).json({ message: "Error fetching highlight" });
    }
  });

  app.post("/api/videos/:id/highlights", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const user = req.user as any;
      
      // Only allow creating highlights for own videos or admin access
      if (video.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to create highlights for this video" });
      }
      
      const highlightData = insertVideoHighlightSchema.parse({
        ...req.body,
        videoId,
        userId: user.id
      });
      
      const highlight = await storage.createVideoHighlight(highlightData);
      return res.status(201).json(highlight);
    } catch (error) {
      console.error("Error creating video highlight:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/highlights/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const highlightId = parseInt(req.params.id);
      const highlight = await storage.getVideoHighlight(highlightId);
      
      if (!highlight) {
        return res.status(404).json({ message: "Highlight not found" });
      }
      
      // Fetch the related video to check permission
      const video = await storage.getVideo(highlight.videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Original video not found" });
      }
      
      const user = req.user as any;
      
      // Only allow updating own video highlights or admin access
      if (video.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this highlight" });
      }
      
      const updatedHighlight = await storage.updateVideoHighlight(highlightId, req.body);
      
      if (!updatedHighlight) {
        return res.status(500).json({ message: "Failed to update highlight" });
      }
      
      return res.json(updatedHighlight);
    } catch (error) {
      console.error("Error updating highlight:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/highlights/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const highlightId = parseInt(req.params.id);
      const highlight = await storage.getVideoHighlight(highlightId);
      
      if (!highlight) {
        return res.status(404).json({ message: "Highlight not found" });
      }
      
      // Fetch the related video to check permission
      const video = await storage.getVideo(highlight.videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Original video not found" });
      }
      
      const user = req.user as any;
      
      // Only allow deleting own video highlights or admin access
      if (video.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to delete this highlight" });
      }
      
      const result = await storage.deleteVideoHighlight(highlightId);
      
      if (!result) {
        return res.status(500).json({ message: "Failed to delete highlight" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting highlight:", error);
      return res.status(500).json({ message: "Error deleting highlight" });
    }
  });

  // Public endpoint - moved before isAuthenticated middleware is defined
  app.get("/api/highlights/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const highlights = await storage.getFeaturedVideoHighlights(limit);
      return res.json(highlights);
    } catch (error) {
      console.error("Error fetching featured highlights:", error);
      return res.status(500).json({ message: "Error fetching featured highlights" });
    }
  });

  // Generate video highlight with AI
  app.post("/api/videos/:id/generate-highlight", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const user = req.user as any;
      
      // Only allow generating highlights for own videos or admin access
      if (video.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to generate highlights for this video" });
      }
      
      const { startTime, endTime, title, description } = req.body;
      
      if (typeof startTime !== 'number' || typeof endTime !== 'number' || startTime >= endTime) {
        return res.status(400).json({ message: "Invalid start or end time" });
      }
      
      const highlight = await storage.generateVideoHighlight(videoId, {
        startTime,
        endTime,
        title,
        description,
        userId: user.id,
        aiGenerated: true
      });
      
      return res.status(201).json(highlight);
    } catch (error) {
      console.error("Error generating video highlight:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  // AI HIGHLIGHT GENERATOR ROUTES
  
  // Get all highlight generator configurations
  app.get("/api/highlight-generator/configs", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Get all configurations
      const configs = await db.select().from(highlightGeneratorConfigs).orderBy(highlightGeneratorConfigs.createdAt);
      return res.json(configs);
    } catch (error) {
      console.error("Error fetching highlight generator configs:", error);
      return res.status(500).json({ message: "Error fetching highlight generator configurations" });
    }
  });
  
  // Get highlight generator configuration by ID
  app.get("/api/highlight-generator/configs/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const configId = parseInt(req.params.id);
      const [config] = await db.select().from(highlightGeneratorConfigs).where(eq(highlightGeneratorConfigs.id, configId));
      
      if (!config) {
        return res.status(404).json({ message: "Highlight generator configuration not found" });
      }
      
      return res.json(config);
    } catch (error) {
      console.error("Error fetching highlight generator config:", error);
      return res.status(500).json({ message: "Error fetching highlight generator configuration" });
    }
  });
  
  // Create new highlight generator configuration
  app.post("/api/highlight-generator/configs", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // Only allow admins to create configs
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can create highlight generator configurations" });
      }
      
      const configData = insertHighlightGeneratorConfigSchema.parse({
        ...req.body,
        createdBy: user.id
      });
      
      const [newConfig] = await db.insert(highlightGeneratorConfigs).values(configData).returning();
      
      return res.status(201).json(newConfig);
    } catch (error) {
      console.error("Error creating highlight generator config:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Update highlight generator configuration
  app.put("/api/highlight-generator/configs/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const configId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Only allow admins to update configs
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can update highlight generator configurations" });
      }
      
      // Check if config exists
      const [existingConfig] = await db.select().from(highlightGeneratorConfigs).where(eq(highlightGeneratorConfigs.id, configId));
      
      if (!existingConfig) {
        return res.status(404).json({ message: "Highlight generator configuration not found" });
      }
      
      // Update config
      const [updatedConfig] = await db
        .update(highlightGeneratorConfigs)
        .set(req.body)
        .where(eq(highlightGeneratorConfigs.id, configId))
        .returning();
      
      return res.json(updatedConfig);
    } catch (error) {
      console.error("Error updating highlight generator config:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Delete highlight generator configuration
  app.delete("/api/highlight-generator/configs/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const configId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Only allow admins to delete configs
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can delete highlight generator configurations" });
      }
      
      // Check if config exists
      const [existingConfig] = await db.select().from(highlightGeneratorConfigs).where(eq(highlightGeneratorConfigs.id, configId));
      
      if (!existingConfig) {
        return res.status(404).json({ message: "Highlight generator configuration not found" });
      }
      
      // Delete config
      await db.delete(highlightGeneratorConfigs).where(eq(highlightGeneratorConfigs.id, configId));
      
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting highlight generator config:", error);
      return res.status(500).json({ message: "Error deleting highlight generator configuration" });
    }
  });
  
  // Run highlight generator for a video with a specific configuration
  app.post("/api/highlight-generator/run/:videoId/:configId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.videoId);
      const configId = parseInt(req.params.configId);
      const user = req.user as any;
      
      // Get the video
      const video = await storage.getVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Only allow generating highlights for own videos or admin access
      if (video.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to generate highlights for this video" });
      }
      
      // Get the config
      const [config] = await db.select().from(highlightGeneratorConfigs).where(eq(highlightGeneratorConfigs.id, configId));
      
      if (!config) {
        return res.status(404).json({ message: "Highlight generator configuration not found" });
      }
      
      if (!config.active) {
        return res.status(400).json({ message: "This highlight generator configuration is not active" });
      }
      
      // Start the highlight generation process
      // This would be processed with a queue or background job in production
      // For now, we'll do it synchronously
      
      // Generate dummy detection points (in real implementation, this would use AI to detect highlight moments)
      // This is a simplified demonstration
      const videoDuration = video.duration || 300; // Default to 5 min if no duration
      const detectableEvents = config.detectableEvents || {};
      
      const detectedHighlights = [];
      
      // Generate 1-3 random highlight segments based on configuration
      const numHighlights = Math.min(
        Math.floor(Math.random() * 3) + 1, 
        config.maxHighlightsPerVideo || 3
      );
      
      for (let i = 0; i < numHighlights; i++) {
        // Create a highlight of random length within the config min/max duration
        const highlightDuration = Math.floor(
          Math.random() * (config.maxDuration - config.minDuration) + config.minDuration
        );
        
        // Random start time that ensures the highlight fits within the video
        const maxStartTime = Math.max(0, videoDuration - highlightDuration - 1);
        const startTime = Math.floor(Math.random() * maxStartTime);
        const endTime = startTime + highlightDuration;
        
        // Generate a quality score between config.qualityThreshold and 100
        const qualityScore = Math.floor(
          Math.random() * (100 - config.qualityThreshold) + config.qualityThreshold
        );
        
        // Pick a random skill from the highlight types
        const primarySkill = config.highlightTypes && config.highlightTypes.length > 0
          ? config.highlightTypes[Math.floor(Math.random() * config.highlightTypes.length)]
          : "general play";
        
        // Random skill level 50-95
        const skillLevel = Math.floor(Math.random() * 45) + 50;
        
        // Create AI analysis notes
        const aiAnalysisNotes = `Detected ${primarySkill} with confidence ${qualityScore}%. Skill level rated ${skillLevel}/100.`;
        
        // Save the highlight to the database
        const highlight = {
          videoId,
          title: `${video.title} - ${primarySkill} Highlight`,
          description: `AI-generated highlight showing ${primarySkill} from ${video.title}`,
          startTime,
          endTime,
          highlightPath: video.filePath, // In real implementation, this would be a new file
          thumbnailPath: video.thumbnailPath,
          createdBy: user.id,
          aiGenerated: true,
          tags: [config.sportType, primarySkill],
          qualityScore,
          primarySkill,
          skillLevel,
          gameContext: "practice",
          aiAnalysisNotes
        };
        
        // Create the highlight in the database
        const [createdHighlight] = await db.insert(videoHighlights).values(highlight).returning();
        detectedHighlights.push(createdHighlight);
      }
      
      // Update the configuration's lastRun timestamp
      await db
        .update(highlightGeneratorConfigs)
        .set({ lastRun: new Date() })
        .where(eq(highlightGeneratorConfigs.id, configId));
      
      return res.status(201).json({
        message: `Generated ${detectedHighlights.length} highlights`,
        highlights: detectedHighlights
      });
      
    } catch (error) {
      console.error("Error running highlight generator:", error);
      return res.status(500).json({ message: "Error running highlight generator" });
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

  // Player Story Mode - XP System API Routes
  app.get("/api/player/progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      let progress = await storage.getPlayerProgress(user.id);
      
      // If no progress record exists, create one
      if (!progress) {
        progress = await storage.createPlayerProgress({
          userId: user.id,
          currentLevel: 1,
          totalXp: 0,
          levelXp: 0,
          xpToNextLevel: 100,
          streakDays: 0,
          lastActive: new Date().toISOString(),
        });
      } else {
        // Check if streak needs to be updated
        const lastActive = new Date(progress.lastActive);
        const now = new Date();
        const daysSinceLastActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastActive === 1) {
          // If logged in the next day, increase streak
          await storage.updatePlayerProgress(user.id, {
            streakDays: progress.streakDays + 1,
            lastActive: now.toISOString()
          });
          progress.streakDays += 1;
          progress.lastActive = now.toISOString();
        } else if (daysSinceLastActive > 1) {
          // If more than a day has passed, reset streak
          await storage.updatePlayerProgress(user.id, {
            streakDays: 1,
            lastActive: now.toISOString()
          });
          progress.streakDays = 1;
          progress.lastActive = now.toISOString();
        } else if (daysSinceLastActive === 0) {
          // Update the last active timestamp only
          await storage.updatePlayerProgress(user.id, {
            lastActive: now.toISOString()
          });
          progress.lastActive = now.toISOString();
        }
      }
      
      return res.json(progress);
    } catch (error) {
      console.error("Error fetching player progress:", error);
      return res.status(500).json({ message: "Error fetching player progress" });
    }
  });
  
  app.get("/api/player/xp/transactions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const transactions = await storage.getXpTransactions(user.id);
      return res.json(transactions);
    } catch (error) {
      console.error("Error fetching XP transactions:", error);
      return res.status(500).json({ message: "Error fetching XP transactions" });
    }
  });
  
  app.post("/api/player/xp/add", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const { amount, type, description } = req.body;
      
      if (!amount || !type || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const xpTransaction = await storage.addXpToPlayer(user.id, amount, type, description);
      return res.status(201).json(xpTransaction);
    } catch (error) {
      console.error("Error adding XP:", error);
      return res.status(500).json({ message: "Error adding XP" });
    }
  });
  
  app.post("/api/player/xp/daily-login", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const progress = await storage.getPlayerProgress(user.id);
      
      if (!progress) {
        return res.status(404).json({ message: "Player progress not found" });
      }
      
      // Check if already claimed today
      const lastActive = new Date(progress.lastActive);
      const now = new Date();
      const isSameDay = lastActive.getDate() === now.getDate() && 
                        lastActive.getMonth() === now.getMonth() &&
                        lastActive.getFullYear() === now.getFullYear();
      
      // If already claimed today, return error
      if (isSameDay && progress.dailyLoginClaimed) {
        return res.status(400).json({ message: "Daily login bonus already claimed today" });
      }
      
      // Calculate bonus based on streak
      const baseXp = 50;
      const streakBonus = Math.min(progress.streakDays * 10, 100); // Cap streak bonus at 100 XP
      const totalBonus = baseXp + streakBonus;
      
      // Add XP and mark as claimed
      const xpTransaction = await storage.addXpToPlayer(
        user.id, 
        totalBonus, 
        "login", 
        `Daily login streak bonus (${progress.streakDays} days)`
      );
      
      await storage.updatePlayerProgress(user.id, {
        dailyLoginClaimed: true
      });
      
      return res.status(201).json({
        transaction: xpTransaction,
        message: `Claimed ${totalBonus} XP for daily login`
      });
    } catch (error) {
      console.error("Error claiming daily login bonus:", error);
      return res.status(500).json({ message: "Error claiming daily login bonus" });
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

  // Film Comparison Feature API Routes
  app.get("/api/film-comparisons", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const comparisons = await storage.getFilmComparisons(user.id);
      return res.json(comparisons);
    } catch (error) {
      console.error("Error fetching film comparisons:", error);
      return res.status(500).json({ message: "Error fetching film comparisons" });
    }
  });
  
  app.get("/api/film-comparisons/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const comparisonId = parseInt(req.params.id);
      const comparison = await storage.getFilmComparison(comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow access to own comparisons unless public or admin
      if (comparison.userId !== user.id && !comparison.isPublic && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this comparison" });
      }
      
      // Get videos associated with this comparison
      const videos = await storage.getComparisonVideos(comparisonId);
      
      // Get analysis if it exists
      const analysis = await storage.getComparisonAnalysis(comparisonId);
      
      return res.json({
        comparison,
        videos,
        analysis
      });
    } catch (error) {
      console.error("Error fetching film comparison:", error);
      return res.status(500).json({ message: "Error fetching film comparison" });
    }
  });
  
  app.post("/api/film-comparisons", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      const comparisonData = {
        ...req.body,
        userId: user.id,
      };
      
      const comparison = await storage.createFilmComparison(comparisonData);
      return res.status(201).json(comparison);
    } catch (error) {
      console.error("Error creating film comparison:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.put("/api/film-comparisons/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const comparisonId = parseInt(req.params.id);
      const comparison = await storage.getFilmComparison(comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow updating own comparisons unless admin
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this comparison" });
      }
      
      const updatedComparison = await storage.updateFilmComparison(comparisonId, req.body);
      return res.json(updatedComparison);
    } catch (error) {
      console.error("Error updating film comparison:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.delete("/api/film-comparisons/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const comparisonId = parseInt(req.params.id);
      const comparison = await storage.getFilmComparison(comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow deleting own comparisons unless admin
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to delete this comparison" });
      }
      
      const success = await storage.deleteFilmComparison(comparisonId);
      
      if (success) {
        return res.json({ message: "Film comparison deleted successfully" });
      } else {
        return res.status(500).json({ message: "Error deleting film comparison" });
      }
    } catch (error) {
      console.error("Error deleting film comparison:", error);
      return res.status(500).json({ message: "Error deleting film comparison" });
    }
  });
  
  // Comparison videos endpoints
  app.post("/api/film-comparisons/:id/videos", isAuthenticated, upload.single("video"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }
      
      const comparisonId = parseInt(req.params.id);
      const comparison = await storage.getFilmComparison(comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow adding videos to own comparisons unless admin
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to add videos to this comparison" });
      }
      
      // Create a more permanent location for the file
      const uploadsDir = path.join(process.cwd(), "uploads", "comparisons");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filename = `${Date.now()}-${path.basename(req.file.originalname)}`;
      const filePath = path.join(uploadsDir, filename);
      
      fs.renameSync(req.file.path, filePath);
      
      // Create comparison video entry
      const videoData = {
        comparisonId,
        title: req.body.title || "Untitled Video",
        description: req.body.description || "",
        filePath: `/uploads/comparisons/${filename}`,
        videoType: req.body.videoType || "reference",
        athlete: req.body.athlete || "",
        order: parseInt(req.body.order) || 1,
      };
      
      const video = await storage.createComparisonVideo(videoData);
      return res.status(201).json(video);
    } catch (error) {
      console.error("Error adding comparison video:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.delete("/api/comparison-videos/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getComparisonVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Comparison video not found" });
      }
      
      const comparison = await storage.getFilmComparison(video.comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow deleting videos from own comparisons unless admin
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to delete videos from this comparison" });
      }
      
      const success = await storage.deleteComparisonVideo(videoId);
      
      if (success) {
        return res.json({ message: "Comparison video deleted successfully" });
      } else {
        return res.status(500).json({ message: "Error deleting comparison video" });
      }
    } catch (error) {
      console.error("Error deleting comparison video:", error);
      return res.status(500).json({ message: "Error deleting comparison video" });
    }
  });
  
  // Comparison analysis endpoints
  app.post("/api/film-comparisons/:id/analyze", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const comparisonId = parseInt(req.params.id);
      const comparison = await storage.getFilmComparison(comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow analysis of own comparisons unless admin
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to analyze this comparison" });
      }
      
      const videos = await storage.getComparisonVideos(comparisonId);
      
      if (videos.length < 2) {
        return res.status(400).json({ message: "At least two videos are required for comparison analysis" });
      }

      // Update comparison status to processing
      await storage.updateFilmComparison(comparisonId, { status: "processing" });
      
      let analysis;
      
      // Check if this is a football-related comparison
      if (comparison.sport === "football") {
        // Use specialized football coach analysis service
        analysis = await footballCoachService.analyzeFootballFilm(comparisonId);
        
        if (!analysis) {
          return res.status(500).json({ message: "Error performing football film analysis" });
        }
      } else {
        // For non-football sports, use the general analysis
        const generalAnalysis = {
          comparisonId,
          findings: "Both videos show similar technique, with some differences in posture and follow-through.",
          improvementAreas: ["Body positioning", "Follow-through", "Timing"],
          overallScore: 78,
          techniqueSimilarity: 0.82,
          recommendations: "Focus on improving follow-through and timing to better match the reference example."
        };
        
        // Check if analysis already exists
        const existingAnalysis = await storage.getComparisonAnalysis(comparisonId);
        
        if (existingAnalysis) {
          // Update existing analysis
          analysis = await storage.updateComparisonAnalysis(existingAnalysis.id, generalAnalysis);
        } else {
          // Create new analysis
          analysis = await storage.createComparisonAnalysis(generalAnalysis);
        }
      }
      
      // Update comparison status to completed
      await storage.updateFilmComparison(comparisonId, { status: "completed" });
      
      return res.json(analysis);
    } catch (error) {
      console.error("Error analyzing film comparison:", error);
      
      // If there was an error during processing, update status to failed
      try {
        const comparisonId = parseInt(req.params.id);
        await storage.updateFilmComparison(comparisonId, { status: "failed" });
      } catch (updateError) {
        console.error("Error updating comparison status:", updateError);
      }
      
      return res.status(500).json({ message: "Error analyzing film comparison" });
    }
  });
  
  // NextUp Spotlight Feature API Routes
  app.get("/api/spotlight-profiles", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const category = req.query.category as string | undefined;
      
      let profiles;
      if (category) {
        profiles = await storage.getSpotlightProfilesByCategory(category, limit);
      } else {
        profiles = await storage.getSpotlightProfiles(limit, offset);
      }
      
      return res.json(profiles);
    } catch (error) {
      console.error("Error fetching spotlight profiles:", error);
      return res.status(500).json({ message: "Error fetching spotlight profiles" });
    }
  });
  
  app.get("/api/spotlight-profiles/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const profiles = await storage.getFeaturedSpotlightProfiles(limit);
      return res.json(profiles);
    } catch (error) {
      console.error("Error fetching featured spotlight profiles:", error);
      return res.status(500).json({ message: "Error fetching featured spotlight profiles" });
    }
  });
  
  app.get("/api/spotlight-profiles/:id", async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.id);
      const profile = await storage.getSpotlightProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Spotlight profile not found" });
      }
      
      // Increment view count
      await storage.incrementSpotlightViews(profileId);
      
      // Get user details
      const user = await storage.getUser(profile.userId);
      
      if (!user) {
        return res.status(404).json({ message: "Profile user not found" });
      }
      
      return res.json({
        ...profile,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          profileImage: user.profileImage
        }
      });
    } catch (error) {
      console.error("Error fetching spotlight profile:", error);
      return res.status(500).json({ message: "Error fetching spotlight profile" });
    }
  });
  
  app.post("/api/spotlight-profiles/:id/like", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.id);
      const profile = await storage.getSpotlightProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Spotlight profile not found" });
      }
      
      const updatedProfile = await storage.likeSpotlightProfile(profileId);
      return res.json(updatedProfile);
    } catch (error) {
      console.error("Error liking spotlight profile:", error);
      return res.status(500).json({ message: "Error liking spotlight profile" });
    }
  });
  
  app.post("/api/spotlight-profiles", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // Check if user already has a spotlight profile
      const existingProfile = await storage.getSpotlightProfileByUserId(user.id);
      
      if (existingProfile) {
        return res.status(400).json({ message: "User already has a spotlight profile" });
      }
      
      const profileData = {
        ...req.body,
        userId: user.id,
      };
      
      const profile = await storage.createSpotlightProfile(profileData);
      return res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating spotlight profile:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.put("/api/spotlight-profiles/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.id);
      const profile = await storage.getSpotlightProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Spotlight profile not found" });
      }
      
      const user = req.user as any;
      
      // Only allow updating own profile unless admin
      if (profile.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this profile" });
      }
      
      const updatedProfile = await storage.updateSpotlightProfile(profileId, req.body);
      return res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating spotlight profile:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.delete("/api/spotlight-profiles/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.id);
      const profile = await storage.getSpotlightProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Spotlight profile not found" });
      }
      
      const user = req.user as any;
      
      // Only allow deleting own profile unless admin
      if (profile.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to delete this profile" });
      }
      
      const success = await storage.deleteSpotlightProfile(profileId);
      
      if (success) {
        return res.json({ message: "Spotlight profile deleted successfully" });
      } else {
        return res.status(500).json({ message: "Error deleting spotlight profile" });
      }
    } catch (error) {
      console.error("Error deleting spotlight profile:", error);
      return res.status(500).json({ message: "Error deleting spotlight profile" });
    }
  });
  
  // MyPlayer XP System API Routes
  app.get("/api/player/progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const progress = await storage.getPlayerProgress(user.id);
      
      if (!progress) {
        // Create initial progress if none exists
        const newProgress = await storage.createPlayerProgress({
          userId: user.id,
          level: 1,
          totalXp: 0,
          currentLevelXp: 0,
          nextLevelXp: 100,
          streak: 0
        });
        return res.json(newProgress);
      }
      
      return res.json(progress);
    } catch (error) {
      console.error("Error fetching player progress:", error);
      return res.status(500).json({ message: "Error fetching player progress" });
    }
  });
  
  app.get("/api/player/xp/transactions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const transactions = await storage.getXpTransactions(user.id, limit);
      return res.json(transactions);
    } catch (error) {
      console.error("Error fetching XP transactions:", error);
      return res.status(500).json({ message: "Error fetching XP transactions" });
    }
  });
  
  app.post("/api/player/xp/award", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // Only admins or coaches can award XP
      if (user.role !== "admin" && user.role !== "coach") {
        return res.status(403).json({ message: "Not authorized to award XP" });
      }
      
      const { userId, amount, type, description, sourceId } = req.body;
      
      if (!userId || !amount || !type || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const result = await storage.addXpToPlayer(userId, amount, type, description, sourceId);
      return res.json(result);
    } catch (error) {
      console.error("Error awarding XP:", error);
      return res.status(500).json({ message: "Error awarding XP" });
    }
  });
  
  app.post("/api/player/xp/daily-login", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // Check if already got XP for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const recentTransactions = await storage.getXpTransactions(user.id, 10);
      const alreadyAwarded = recentTransactions.some(tx => {
        const txDate = new Date(tx.awarded);
        txDate.setHours(0, 0, 0, 0);
        return txDate.getTime() === today.getTime() && tx.type === "daily_login";
      });
      
      if (alreadyAwarded) {
        return res.status(400).json({ message: "Already received daily login XP today" });
      }
      
      // Award XP for daily login
      const result = await storage.addXpToPlayer(
        user.id,
        25,
        "daily_login",
        "Daily login bonus"
      );
      
      return res.json(result);
    } catch (error) {
      console.error("Error processing daily login XP:", error);
      return res.status(500).json({ message: "Error processing daily login XP" });
    }
  });
  
  app.get("/api/player/badges", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const category = req.query.category as string | undefined;
      
      let badges;
      if (category) {
        badges = await storage.getPlayerBadgesByCategory(user.id, category);
      } else {
        badges = await storage.getPlayerBadges(user.id);
      }
      
      return res.json(badges);
    } catch (error) {
      console.error("Error fetching player badges:", error);
      return res.status(500).json({ message: "Error fetching player badges" });
    }
  });
  
  app.post("/api/player/badges", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // Only admins or coaches can award badges directly
      if (user.role !== "admin" && user.role !== "coach") {
        return res.status(403).json({ message: "Not authorized to award badges" });
      }
      
      const badgeData = {
        ...req.body,
        userId: req.body.userId || user.id,
      };
      
      const badge = await storage.createPlayerBadge(badgeData);
      
      // Award XP for earning a badge
      await storage.addXpToPlayer(
        badgeData.userId,
        50,
        "badge_earned",
        `Earned ${badgeData.name} badge`,
        String(badge.id)
      );
      
      return res.status(201).json(badge);
    } catch (error) {
      console.error("Error creating player badge:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  // MyPlayer Workout Verification API Routes
  app.get("/api/workout-verifications", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const verifications = await storage.getWorkoutVerifications(user.id);
      return res.json(verifications);
    } catch (error) {
      console.error("Error fetching workout verifications:", error);
      return res.status(500).json({ message: "Error fetching workout verifications" });
    }
  });
  
  app.get("/api/workout-verifications/pending", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // Only coaches and admins can view all pending verifications
      if (user.role !== "coach" && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view all pending verifications" });
      }
      
      const verifications = await storage.getPendingWorkoutVerifications();
      return res.json(verifications);
    } catch (error) {
      console.error("Error fetching pending workout verifications:", error);
      return res.status(500).json({ message: "Error fetching pending workout verifications" });
    }
  });
  
  app.get("/api/workout-verifications/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const verificationId = parseInt(req.params.id);
      const verification = await storage.getWorkoutVerification(verificationId);
      
      if (!verification) {
        return res.status(404).json({ message: "Workout verification not found" });
      }
      
      const user = req.user as any;
      
      // Only allow access to own verifications or coach/admin access
      if (verification.userId !== user.id && user.role !== "coach" && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this verification" });
      }
      
      // Get checkpoints associated with this verification
      const checkpoints = await storage.getWorkoutVerificationCheckpoints(verificationId);
      
      return res.json({
        verification,
        checkpoints
      });
    } catch (error) {
      console.error("Error fetching workout verification:", error);
      return res.status(500).json({ message: "Error fetching workout verification" });
    }
  });
  
  app.post("/api/workout-verifications", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      console.log("Workout verification request:", {
        user: user ? { id: user.id, role: user.role } : 'No user',
        bodyKeys: Object.keys(req.body),
        mediaUrls: req.body.mediaUrls ? 'Present' : 'Not present'
      });
      
      // We're now using mediaUrls directly passed from the frontend
      // They point to videos that were already uploaded and processed
      let mediaUrls: string[] = [];
      
      if (req.body.mediaUrls) {
        // If it's an array, use it directly
        if (Array.isArray(req.body.mediaUrls)) {
          mediaUrls = req.body.mediaUrls;
        } 
        // If it's a JSON string, parse it
        else if (typeof req.body.mediaUrls === 'string') {
          try {
            mediaUrls = JSON.parse(req.body.mediaUrls);
          } catch (e) {
            console.error("Error parsing mediaUrls:", e);
          }
        }
      }
      
      // Create verification
      const verificationData = {
        userId: user.id,
        title: req.body.workoutTitle || req.body.title, // Support both field names for robustness
        verificationStatus: "pending",
        duration: parseInt(req.body.duration) || 0,
        proofType: 'video', // We're using video for verification
        proofData: mediaUrls.length > 0 ? mediaUrls[0] : '', // Use the first video URL
        notes: req.body.description || '',
        verificationMethod: 'AI', // Using AI for verification
      };
      
      const verification = await storage.createWorkoutVerification(verificationData);
      
      // Create checkpoints if provided
      if (req.body.checkpoints) {
        let checkpoints;
        try {
          checkpoints = JSON.parse(req.body.checkpoints);
        } catch (e) {
          return res.status(400).json({ message: "Invalid checkpoints data format" });
        }
        
        if (Array.isArray(checkpoints)) {
          for (const checkpoint of checkpoints) {
            await storage.createWorkoutVerificationCheckpoint({
              verificationId: verification.id,
              exerciseName: checkpoint.exerciseName,
              isCompleted: checkpoint.isCompleted || false,
              completedAmount: checkpoint.completedAmount,
              targetAmount: checkpoint.targetAmount,
              feedback: checkpoint.feedback || "",
              mediaProof: checkpoint.mediaProof || "",
              checkpointOrder: checkpoint.checkpointOrder || 0,
            });
          }
        }
      }
      
      return res.status(201).json(verification);
    } catch (error) {
      console.error("Error creating workout verification:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.post("/api/workout-verifications/:id/verify", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const verificationId = parseInt(req.params.id);
      const verification = await storage.getWorkoutVerification(verificationId);
      
      if (!verification) {
        return res.status(404).json({ message: "Workout verification not found" });
      }
      
      const user = req.user as any;
      
      // Only coaches and admins can verify workouts
      if (user.role !== "coach" && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to verify workouts" });
      }
      
      const { status, notes } = req.body;
      
      if (!status || (status !== "approved" && status !== "rejected")) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const updatedVerification = await storage.verifyWorkout(
        verificationId,
        user.id,
        status,
        notes
      );
      
      return res.json(updatedVerification);
    } catch (error) {
      console.error("Error verifying workout:", error);
      return res.status(500).json({ message: "Error verifying workout" });
    }
  });
  
  /**
   * @route POST /api/workout-verifications/:id/analyze
   * @desc Analyze a workout video with AI
   */
  app.post("/api/workout-verifications/:id/analyze", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const verificationId = parseInt(req.params.id);
      const { videoPath, checkpointId } = req.body;
      
      if (!videoPath) {
        return res.status(400).json({ message: "Video path is required" });
      }
      
      const verification = await storage.getWorkoutVerification(verificationId);
      
      if (!verification) {
        return res.status(404).json({ message: "Workout verification not found" });
      }
      
      const user = req.user as any;
      
      // Only the owner or coaches/admins can analyze the workout
      if (verification.userId !== user.id && user.role !== "coach" && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to analyze this workout" });
      }
      
      // Use OpenAI to analyze the workout video
      const { analyzeWorkoutVerification } = await import('./openai');
      const analysis = await analyzeWorkoutVerification(verificationId, videoPath);
      
      // Update the checkpoint if provided
      if (checkpointId) {
        await storage.updateWorkoutVerificationCheckpoint(parseInt(checkpointId), {
          isCompleted: analysis.isCompleted,
          completedAmount: analysis.completedAmount,
          feedback: analysis.feedback,
          mediaProof: videoPath
        });
      }
      
      // If all checkpoints are completed, update the verification status
      if (analysis.isCompleted) {
        const checkpoints = await storage.getWorkoutVerificationCheckpoints(verificationId);
        const allCompleted = checkpoints.every(c => c.isCompleted);
        
        if (allCompleted) {
          // Calculate XP based on completed amount and accuracy
          const baseXp = Math.round(analysis.completedAmount * (analysis.repAccuracy / 100) * 10);
          const xpEarned = Math.max(50, baseXp); // Minimum 50 XP
          
          await storage.verifyWorkout(
            verificationId,
            user.id,
            "approved",
            xpEarned,
            "Automatically verified by AI analysis"
          );
          
          analysis.xpEarned = xpEarned;
        }
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing workout video:", error);
      res.status(500).json({ message: "Failed to analyze workout video" });
    }
  });
  
  // MyPlayer UI Weight Room API Routes
  app.get("/api/weight-room/equipment", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const equipment = await storage.getWeightRoomEquipment(category);
      return res.json(equipment);
    } catch (error) {
      console.error("Error fetching weight room equipment:", error);
      return res.status(500).json({ message: "Error fetching weight room equipment" });
    }
  });
  
  app.get("/api/weight-room/equipment/:id", async (req: Request, res: Response) => {
    try {
      const equipmentId = parseInt(req.params.id);
      const equipment = await storage.getWeightRoomEquipmentById(equipmentId);
      
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      return res.json(equipment);
    } catch (error) {
      console.error("Error fetching weight room equipment:", error);
      return res.status(500).json({ message: "Error fetching weight room equipment" });
    }
  });
  
  // AI Coach Routes for Weight Room
  app.get("/api/weight-room/ai-coach/workout-plan", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const skillLevel = parseInt(req.query.level as string) || 1;
      const goals = req.query.goals ? String(req.query.goals).split(',') : ["Strength", "Speed", "Endurance"];
      
      // Get all available equipment
      const equipmentList = await storage.getWeightRoomEquipment();
      
      // Generate personalized workout plan with OpenAI
      const { generateWeightRoomPlan } = await import('./openai');
      const workoutPlan = await generateWeightRoomPlan(userId, equipmentList, skillLevel, goals);
      
      return res.json(workoutPlan);
    } catch (error) {
      console.error("Error generating AI workout plan:", error);
      return res.status(500).json({ message: "Error generating AI workout plan" });
    }
  });
  
  app.post("/api/weight-room/ai-coach/form-feedback", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const { equipmentId, formDescription } = req.body;
      
      if (!equipmentId || !formDescription) {
        return res.status(400).json({ message: "Equipment ID and form description are required" });
      }
      
      // Get form feedback using OpenAI
      const { getFormFeedback } = await import('./openai');
      const feedback = await getFormFeedback(userId, equipmentId, formDescription);
      
      return res.json(feedback);
    } catch (error) {
      console.error("Error generating form feedback:", error);
      return res.status(500).json({ message: "Error generating form feedback" });
    }
  });
  
  app.get("/api/player/equipment", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const equipment = await storage.getPlayerEquipment(user.id);
      return res.json(equipment);
    } catch (error) {
      console.error("Error fetching player equipment:", error);
      return res.status(500).json({ message: "Error fetching player equipment" });
    }
  });
  
  // AI Coach API Routes
  app.get("/api/player/ai-coach/state", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // Get the player's coach settings
      // In a real implementation, this would come from the database
      // For now, we'll return default settings
      const coachState = {
        personality: "Supportive and motivational",
        specialization: "Performance Development",
        activeTab: "chat",
        knowledgeAreas: ["Technique Analysis", "Training Programs", "Recovery", "Nutrition", "Sports Psychology"],
        experienceLevel: "intermediate",
        lastInteraction: new Date()
      };
      
      return res.json(coachState);
    } catch (error) {
      console.error("Error fetching AI coach state:", error);
      return res.status(500).json({ message: "Error fetching AI coach state" });
    }
  });
  
  app.get("/api/player/ai-coach/messages", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // For this implementation, we'll start with a welcome message
      // In a real implementation, this would query the database for conversation history
      const messages = [
        {
          id: "1",
          role: "coach",
          content: "Hey there! I'm your AI Coach. I'm here to help you improve your performance, analyze your technique, and create personalized training plans.",
          timestamp: new Date(Date.now() - 86400000),
          type: "text"
        },
        {
          id: "2", 
          role: "coach",
          content: "What would you like to work on today?",
          timestamp: new Date(Date.now() - 86400000),
          type: "text"
        }
      ];
      
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching AI coach messages:", error);
      return res.status(500).json({ message: "Error fetching AI coach messages" });
    }
  });
  
  app.post("/api/player/ai-coach/messages", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }
      
      // Get previous messages to provide context
      const previousMessages: any[] = []; // In a real implementation, get from database
      
      // Import the AI coach function
      const { generateAICoachResponse } = await import('./openai');
      
      // Generate AI response
      const response = await generateAICoachResponse(user.id, content, previousMessages);
      
      // Format the response
      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: content,
        timestamp: new Date(),
        type: "text"
      };
      
      const coachMessage = {
        id: (Date.now() + 1).toString(),
        role: "coach",
        content: response.content,
        timestamp: new Date(),
        type: response.metadata ? "workout" : "text",
        metadata: response.metadata
      };
      
      // In a real implementation, save these messages to the database
      
      return res.json([userMessage, coachMessage]);
    } catch (error) {
      console.error("Error generating AI coach response:", error);
      return res.status(500).json({ message: "Error generating AI coach response" });
    }
  });
  
  app.post("/api/player/ai-coach/messages/:messageId/rate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const messageId = req.params.messageId;
      const { isHelpful } = req.body;
      
      if (typeof isHelpful !== 'boolean') {
        return res.status(400).json({ message: "Rating must be true or false" });
      }
      
      // In a real implementation, save this rating to the database
      // For now, just return success
      
      return res.json({ success: true, messageId });
    } catch (error) {
      console.error("Error rating AI coach message:", error);
      return res.status(500).json({ message: "Error rating AI coach message" });
    }
  });
  
  app.post("/api/player/ai-coach/realtime-feedback", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const { exerciseType, performanceData } = req.body;
      
      if (!exerciseType || !performanceData) {
        return res.status(400).json({ message: "Exercise type and performance data are required" });
      }
      
      // Import the real-time feedback function
      const { generateRealTimeWorkoutFeedback } = await import('./openai');
      
      // Generate real-time feedback
      const feedback = await generateRealTimeWorkoutFeedback(user.id, exerciseType, performanceData);
      
      return res.json(feedback);
    } catch (error) {
      console.error("Error generating real-time feedback:", error);
      return res.status(500).json({ message: "Error generating real-time feedback" });
    }
  });
  
  app.post("/api/player/ai-coach/training-plan", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const { goals, durationWeeks, daysPerWeek, focusAreas } = req.body;
      
      // Import the training plan generator
      const { generatePersonalizedTrainingPlan } = await import('./openai');
      
      // Generate a personalized training plan
      const trainingPlan = await generatePersonalizedTrainingPlan(
        user.id,
        goals || ["Overall Performance"],
        durationWeeks || 4,
        daysPerWeek || 3,
        focusAreas || []
      );
      
      return res.json(trainingPlan);
    } catch (error) {
      console.error("Error generating training plan:", error);
      return res.status(500).json({ message: "Error generating training plan" });
    }
  });
  
  app.post("/api/player/equipment", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      const { equipmentId } = req.body;
      
      if (!equipmentId) {
        return res.status(400).json({ message: "Equipment ID is required" });
      }
      
      const equipment = await storage.getWeightRoomEquipmentById(equipmentId);
      
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      // Check if player already has this equipment
      const playerEquipment = await storage.getPlayerEquipment(user.id);
      const alreadyOwned = playerEquipment.some((item: any) => item.equipmentId === equipmentId);
      
      if (alreadyOwned) {
        return res.status(400).json({ message: "Player already owns this equipment" });
      }
      
      // Check if player has reached required level
      const progress = await storage.getPlayerProgress(user.id);
      
      if (!progress) {
        return res.status(400).json({ message: "Player progress not found" });
      }
      
      if (progress.currentLevel < equipment.unlockLevel) {
        return res.status(400).json({ 
          message: `Player must reach level ${equipment.unlockLevel} to unlock this equipment`
        });
      }
      
      // Create player equipment record
      const newPlayerEquipment = await storage.createPlayerEquipment({
        userId: user.id,
        equipmentId: equipment.id,
        isFavorite: false
      });
      
      return res.status(201).json(newPlayerEquipment);
    } catch (error) {
      console.error("Error acquiring equipment:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.put("/api/player/equipment/:id/activate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const equipmentId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Get the player equipment
      const playerEquipment = await storage.getPlayerEquipmentById(equipmentId);
      
      if (!playerEquipment) {
        return res.status(404).json({ message: "Player equipment not found" });
      }
      
      // Verify ownership
      if (playerEquipment.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to activate this equipment" });
      }
      
      // Update equipment to active status
      const updatedEquipment = await storage.updatePlayerEquipment(equipmentId, { isFavorite: true });
      
      // Increment usage count
      await storage.incrementEquipmentUsage(equipmentId);
      
      // Award XP for first time using equipment
      if ((playerEquipment.timesUsed || 0) === 0) {
        await storage.addXpToPlayer(
          user.id,
          15,
          "equipment_use",
          `First time using ${equipmentId}`,
          String(equipmentId)
        );
      }
      
      return res.json(updatedEquipment);
    } catch (error) {
      console.error("Error activating equipment:", error);
      return res.status(500).json({ message: "Error activating equipment" });
    }
  });
  
  app.put("/api/player/equipment/:id/deactivate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const equipmentId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Get the player equipment
      const playerEquipment = await storage.getPlayerEquipmentById(equipmentId);
      
      if (!playerEquipment) {
        return res.status(404).json({ message: "Player equipment not found" });
      }
      
      // Verify ownership
      if (playerEquipment.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to deactivate this equipment" });
      }
      
      // Update equipment to inactive status
      const updatedEquipment = await storage.updatePlayerEquipment(equipmentId, { isFavorite: false });
      
      return res.json(updatedEquipment);
    } catch (error) {
      console.error("Error deactivating equipment:", error);
      return res.status(500).json({ message: "Error deactivating equipment" });
    }
  });

  // ===== Active Network Integration for Combine Tour Events =====

  // Get all combine tour events
  app.get("/api/combine-tour/events", async (req: Request, res: Response) => {
    try {
      const events = await storage.getCombineTourEvents();
      return res.json(events);
    } catch (error) {
      console.error("Error fetching combine tour events:", error);
      return res.status(500).json({ message: "Error fetching combine tour events" });
    }
  });

  // Get a specific combine tour event
  app.get("/api/combine-tour/events/:id", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getCombineTourEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      return res.json(event);
    } catch (error) {
      console.error("Error fetching combine tour event:", error);
      return res.status(500).json({ message: "Error fetching combine tour event" });
    }
  });

  // Create combine tour event (admin only)
  app.post("/api/combine-tour/events", isAdmin, async (req: Request, res: Response) => {
    try {
      const eventData = req.body;
      
      // Create event in Active Network first
      const activeNetworkEvent = await activeNetworkService.createEvent({
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        capacity: eventData.capacity,
        fee: eventData.price
      });
      
      // Add Active Network data to our event
      const event = await storage.createCombineTourEvent({
        ...eventData,
        activeNetworkId: activeNetworkEvent.id,
        registrationUrl: activeNetworkEvent.registrationUrl,
        slug: eventData.name.toLowerCase().replace(/\s+/g, '-')
      });
      
      return res.status(201).json(event);
    } catch (error) {
      console.error("Error creating combine tour event:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Update a combine tour event (admin only)
  app.put("/api/combine-tour/events/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      const eventData = req.body;
      
      // Get current event data
      const currentEvent = await storage.getCombineTourEvent(eventId);
      
      if (!currentEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Update event in our database
      const updatedEvent = await storage.updateCombineTourEvent(eventId, eventData);
      
      return res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating combine tour event:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Get registration URL for an event
  app.get("/api/combine-tour/events/:id/register", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      
      // Get registration URL from Active Network
      const registrationInfo = await activeNetworkService.getRegistrationUrl(eventId);
      
      return res.json({
        registrationUrl: registrationInfo.registrationUrl,
        eventId,
        activeNetworkId: registrationInfo.activeNetworkId
      });
    } catch (error) {
      console.error("Error getting registration URL:", error);
      return res.status(500).json({ message: "Error getting registration URL" });
    }
  });

  // Check registration status for a user
  app.get("/api/combine-tour/registration-status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const eventId = parseInt(req.query.eventId as string);
      
      if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }
      
      // Check registration status
      const status = await activeNetworkService.checkRegistrationStatus(user.id, eventId);
      
      return res.json(status);
    } catch (error) {
      console.error("Error checking registration status:", error);
      return res.status(500).json({ message: "Error checking registration status" });
    }
  });

  // Webhook endpoint for Active Network callbacks
  app.post("/api/combine-tour/webhook", async (req: Request, res: Response) => {
    try {
      // Process the webhook data from Active Network
      const result = await activeNetworkService.processWebhook(req.body);
      
      return res.json(result);
    } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // This section was removed to avoid duplicate WebSocket handlers
  /* 
  // The WebSocket server is already set up above, no need for another handler
  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket connection established');
    
    // The client needs to authenticate after connection
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Handle client authentication
        if (data.type === 'auth') {
          const userId = data.userId;
          const user = await storage.getUser(userId);
          
          if (!user) {
            console.log(`WebSocket authentication failed for user ID: ${userId}`);
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
            content
          });
          
          // Find recipient if they're connected
          for (const [clientWs, info] of Array.from(clients.entries())) {
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
          for (const [clientWs, info] of Array.from(clients.entries())) {
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
  */

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
  
  // Manual trigger for AI blog post generation (admin only)
  app.post("/api/admin/blog-posts/generate", isAdmin, async (req: Request, res: Response) => {
    try {
      const { createAIBlogPost } = await import('./blog-generator');
      const adminUserId = req.user!.id;
      
      const success = await createAIBlogPost(adminUserId);
      
      if (success) {
        res.status(201).json({ 
          success: true, 
          message: "New AI blog post generated successfully" 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to generate blog post. Check OpenAI API key and server logs." 
        });
      }
    } catch (error) {
      console.error("Error generating AI blog post:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error generating AI blog post", 
        error: error instanceof Error ? error.message : String(error)
      });
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

  // Film Comparison routes
  app.get("/api/film-comparisons", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const comparisons = await storage.getFilmComparisons(user.id);
      res.json(comparisons);
    } catch (error) {
      console.error("Error fetching film comparisons:", error);
      res.status(500).json({ message: "Error fetching film comparisons" });
    }
  });

  app.get("/api/film-comparisons/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const comparisonId = parseInt(req.params.id);
      const comparison = await storage.getFilmComparison(comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow access to own comparisons or admin access
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to view this comparison" });
      }
      
      // Get videos associated with this comparison
      const videos = await storage.getComparisonVideos(comparisonId);
      
      // Get analysis if it exists
      const analysis = await storage.getComparisonAnalysis(comparisonId);
      
      return res.json({
        comparison,
        videos,
        analysis
      });
    } catch (error) {
      console.error("Error fetching film comparison:", error);
      res.status(500).json({ message: "Error fetching film comparison" });
    }
  });

  app.post("/api/film-comparisons", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const comparisonData = insertFilmComparisonSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const comparison = await storage.createFilmComparison(comparisonData);
      res.status(201).json(comparison);
    } catch (error) {
      console.error("Error creating film comparison:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/film-comparisons/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const comparisonId = parseInt(req.params.id);
      const comparison = await storage.getFilmComparison(comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow updating own comparisons or admin access
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this comparison" });
      }
      
      const updatedComparison = await storage.updateFilmComparison(comparisonId, req.body);
      res.json(updatedComparison);
    } catch (error) {
      console.error("Error updating film comparison:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/film-comparisons/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const comparisonId = parseInt(req.params.id);
      const comparison = await storage.getFilmComparison(comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow deleting own comparisons or admin access
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to delete this comparison" });
      }
      
      const success = await storage.deleteFilmComparison(comparisonId);
      
      if (success) {
        res.status(200).json({ message: "Film comparison deleted successfully" });
      } else {
        res.status(500).json({ message: "Error deleting film comparison" });
      }
    } catch (error) {
      console.error("Error deleting film comparison:", error);
      res.status(500).json({ message: "Error deleting film comparison" });
    }
  });

  // Comparison Video routes
  app.post("/api/film-comparisons/:id/videos", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const comparisonId = parseInt(req.params.id);
      const comparison = await storage.getFilmComparison(comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow adding videos to own comparisons or admin access
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to modify this comparison" });
      }
      
      const videoData = insertComparisonVideoSchema.parse({
        ...req.body,
        comparisonId
      });
      
      const video = await storage.createComparisonVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      console.error("Error adding comparison video:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/comparison-videos/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getComparisonVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Comparison video not found" });
      }
      
      // Get the comparison to check permissions
      const comparison = await storage.getFilmComparison(video.comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow updating videos in own comparisons or admin access
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to modify this comparison" });
      }
      
      const updatedVideo = await storage.updateComparisonVideo(videoId, req.body);
      res.json(updatedVideo);
    } catch (error) {
      console.error("Error updating comparison video:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/comparison-videos/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.id);
      const video = await storage.getComparisonVideo(videoId);
      
      if (!video) {
        return res.status(404).json({ message: "Comparison video not found" });
      }
      
      // Get the comparison to check permissions
      const comparison = await storage.getFilmComparison(video.comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow deleting videos in own comparisons or admin access
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to modify this comparison" });
      }
      
      const success = await storage.deleteComparisonVideo(videoId);
      
      if (success) {
        res.status(200).json({ message: "Comparison video deleted successfully" });
      } else {
        res.status(500).json({ message: "Error deleting comparison video" });
      }
    } catch (error) {
      console.error("Error deleting comparison video:", error);
      res.status(500).json({ message: "Error deleting comparison video" });
    }
  });

  // Comparison Analysis routes
  app.post("/api/film-comparisons/:id/analysis", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const comparisonId = parseInt(req.params.id);
      const comparison = await storage.getFilmComparison(comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow adding analysis to own comparisons or admin access
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to modify this comparison" });
      }
      
      // Check if analysis already exists
      const existingAnalysis = await storage.getComparisonAnalysis(comparisonId);
      if (existingAnalysis) {
        return res.status(400).json({ message: "Analysis already exists for this comparison" });
      }
      
      const analysisData = insertComparisonAnalysisSchema.parse({
        ...req.body,
        comparisonId
      });
      
      const analysis = await storage.createComparisonAnalysis(analysisData);
      res.status(201).json(analysis);
    } catch (error) {
      console.error("Error creating comparison analysis:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/comparison-analyses/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const analysisId = parseInt(req.params.id);
      
      // Get the analysis and related comparison to check permissions
      const analysis = await storage.getComparisonAnalysis(req.body.comparisonId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Comparison analysis not found" });
      }
      
      const comparison = await storage.getFilmComparison(analysis.comparisonId);
      
      if (!comparison) {
        return res.status(404).json({ message: "Film comparison not found" });
      }
      
      const user = req.user as any;
      
      // Only allow updating analysis for own comparisons or admin access
      if (comparison.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to modify this analysis" });
      }
      
      const updatedAnalysis = await storage.updateComparisonAnalysis(analysisId, req.body);
      res.json(updatedAnalysis);
    } catch (error) {
      console.error("Error updating comparison analysis:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Athlete Star Profiles routes
  app.get("/api/athlete-profiles/stars", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { sport, position, starLevel } = req.query;
      
      // Create a base query
      let query = db.select().from(athleteStarProfiles);
      
      // Add filters conditionally
      if (sport) {
        query = query.where(eq(athleteStarProfiles.sport, sport as string));
      }
      
      if (position) {
        query = query.where(eq(athleteStarProfiles.position, position as string));
      }
      
      if (starLevel) {
        const level = parseInt(starLevel as string);
        if (!isNaN(level)) {
          query = query.where(eq(athleteStarProfiles.starLevel, level));
        }
      }
      
      const profiles = await query;
      
      return res.json(profiles);
    } catch (error) {
      console.error("Error fetching athlete star profiles:", error);
      return res.status(500).json({ message: "Error fetching athlete star profiles" });
    }
  });
  
  app.get("/api/athlete-profiles/stars/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Use the id column, not profileId
      const [profile] = await db
        .select()
        .from(athleteStarProfiles)
        .where(eq(athleteStarProfiles.id, id));
      
      if (!profile) {
        return res.status(404).json({ message: "Athlete star profile not found" });
      }
      
      return res.json(profile);
    } catch (error) {
      console.error("Error fetching athlete star profile:", error);
      return res.status(500).json({ message: "Error fetching athlete star profile" });
    }
  });
  
  app.post("/api/admin/athlete-profiles/generate", isAdmin, async (req: Request, res: Response) => {
    try {
      const { generateProfiles } = await import('./generate-athlete-profiles');
      const profiles = await generateProfiles();
      
      return res.json({ 
        message: `Successfully generated ${profiles.length} athlete profiles.`,
        count: profiles.length
      });
    } catch (error) {
      console.error("Error generating athlete profiles:", error);
      return res.status(500).json({ message: "Error generating athlete profiles: " + error.message });
    }
  });

  // API Key management routes
  app.post("/api/settings/api-keys", isAuthenticated, saveApiKey);
  app.get("/api/settings/api-keys/status", isAuthenticated, getApiKeyStatus);
  
  // SMS Messaging Routes
  app.post("/api/sms/send", isAuthenticated, sendSms);
  app.get("/api/sms/status", isAuthenticated, checkSmsStatus);
  app.post("/api/sms/verify-phone", isAuthenticated, sendVerificationCode);
  app.post("/api/sms/verify-code", isAuthenticated, verifyCode);
  app.post("/api/sms/notification", isAuthenticated, sendNotification);

  // Content Blocks API Routes
  app.get("/api/content-blocks", async (req: Request, res: Response) => {
    try {
      const section = req.query.section as string;
      const contentBlocks = await storage.getContentBlocks(section);
      res.json(contentBlocks);
    } catch (error) {
      console.error("Error fetching content blocks:", error);
      res.status(500).json({ message: "Error fetching content blocks" });
    }
  });

  app.get("/api/content-blocks/section/:section", async (req: Request, res: Response) => {
    try {
      const section = req.params.section;
      const contentBlocks = await storage.getContentBlocks(section);
      res.json(contentBlocks);
    } catch (error) {
      console.error("Error fetching content blocks by section:", error);
      res.status(500).json({ message: "Error fetching content blocks by section" });
    }
  });

  app.get("/api/content-blocks/identifier/:identifier", async (req: Request, res: Response) => {
    try {
      const identifier = req.params.identifier;
      const contentBlock = await storage.getContentBlocksByIdentifier(identifier);
      
      if (!contentBlock) {
        return res.status(404).json({ message: "Content block not found" });
      }
      
      res.json(contentBlock);
    } catch (error) {
      console.error("Error fetching content block by identifier:", error);
      res.status(500).json({ message: "Error fetching content block by identifier" });
    }
  });

  app.get("/api/content-blocks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const contentBlock = await storage.getContentBlock(id);
      
      if (!contentBlock) {
        return res.status(404).json({ message: "Content block not found" });
      }
      
      res.json(contentBlock);
    } catch (error) {
      console.error("Error fetching content block:", error);
      res.status(500).json({ message: "Error fetching content block" });
    }
  });

  app.post("/api/content-blocks", isAdmin, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const blockData = req.body;
      
      // Validate input
      if (!blockData.identifier || !blockData.title || !blockData.content || !blockData.section) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Add the current user as the updater
      blockData.lastUpdatedBy = user.id;
      
      const contentBlock = await storage.createContentBlock(blockData);
      res.status(201).json(contentBlock);
    } catch (error) {
      console.error("Error creating content block:", error);
      res.status(500).json({ message: "Error creating content block" });
    }
  });

  app.put("/api/content-blocks/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user as User;
      const blockData = req.body;
      
      // Add the current user as the updater
      blockData.lastUpdatedBy = user.id;
      
      const contentBlock = await storage.updateContentBlock(id, blockData);
      
      if (!contentBlock) {
        return res.status(404).json({ message: "Content block not found" });
      }
      
      res.json(contentBlock);
    } catch (error) {
      console.error("Error updating content block:", error);
      res.status(500).json({ message: "Error updating content block" });
    }
  });

  app.delete("/api/content-blocks/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContentBlock(id);
      
      if (!success) {
        return res.status(404).json({ message: "Content block not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content block:", error);
      res.status(500).json({ message: "Error deleting content block" });
    }
  });

  // GAR Score Visualization Routes

  // Get all GAR categories
  app.get("/api/gar/categories", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const sportType = req.query.sport as string;
      let categories;
      
      if (sportType) {
        categories = await storage.getGarCategoriesBySport(sportType);
      } else {
        categories = await storage.getGarCategories();
      }
      
      return res.json(categories);
    } catch (error) {
      console.error("Error fetching GAR categories:", error);
      return res.status(500).json({ message: "Error fetching GAR categories" });
    }
  });

  // Get a specific GAR category
  app.get("/api/gar/categories/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getGarCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "GAR category not found" });
      }
      
      return res.json(category);
    } catch (error) {
      console.error("Error fetching GAR category:", error);
      return res.status(500).json({ message: "Error fetching GAR category" });
    }
  });

  // Get subcategories for a category
  app.get("/api/gar/categories/:id/subcategories", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      const subcategories = await storage.getGarSubcategories(categoryId);
      
      return res.json(subcategories);
    } catch (error) {
      console.error("Error fetching GAR subcategories:", error);
      return res.status(500).json({ message: "Error fetching GAR subcategories" });
    }
  });

  // Get GAR ratings for a user
  app.get("/api/gar/users/:userId/ratings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = req.user as any;
      
      // Only allow viewing own ratings unless admin or coach
      if (userId !== user.id && user.role !== "admin" && user.role !== "coach") {
        return res.status(403).json({ message: "Not authorized to view these ratings" });
      }
      
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      let ratings;
      if (categoryId) {
        ratings = await storage.getGarAthleteRatingsByCategory(userId, categoryId);
      } else {
        ratings = await storage.getGarAthleteRatingsByUser(userId);
      }
      
      return res.json(ratings);
    } catch (error) {
      console.error("Error fetching GAR ratings:", error);
      return res.status(500).json({ message: "Error fetching GAR ratings" });
    }
  });

  // Get GAR rating history for a user
  app.get("/api/gar/users/:userId/history", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = req.user as any;
      
      // Only allow viewing own history unless admin or coach
      if (userId !== user.id && user.role !== "admin" && user.role !== "coach") {
        return res.status(403).json({ message: "Not authorized to view this history" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const history = await storage.getGarRatingHistoryByUser(userId, limit);
      
      return res.json(history);
    } catch (error) {
      console.error("Error fetching GAR rating history:", error);
      return res.status(500).json({ message: "Error fetching GAR rating history" });
    }
  });

  // Get latest GAR rating for a user
  app.get("/api/gar/users/:userId/latest", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = req.user as any;
      
      // Only allow viewing own data unless admin or coach
      if (userId !== user.id && user.role !== "admin" && user.role !== "coach") {
        return res.status(403).json({ message: "Not authorized to view this data" });
      }
      
      const latestHistory = await storage.getLatestGarRatingHistory(userId);
      
      if (!latestHistory) {
        return res.status(404).json({ message: "No GAR ratings found for this user" });
      }
      
      return res.json(latestHistory);
    } catch (error) {
      console.error("Error fetching latest GAR rating:", error);
      return res.status(500).json({ message: "Error fetching latest GAR rating" });
    }
  });
  
  // Get GAR data for a video analysis
  app.get("/api/gar/videos/:videoId/analysis", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const videoId = parseInt(req.params.videoId);
      
      // Check if user has access to this video
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const user = req.user as any;
      if (video.userId !== user.id && user.role !== "admin" && user.role !== "coach") {
        return res.status(403).json({ message: "Not authorized to access this video analysis" });
      }
      
      const analysis = await storage.getVideoAnalysisByVideoId(videoId);
      
      if (!analysis) {
        return res.status(404).json({ message: "No analysis found for this video" });
      }
      
      return res.json(analysis);
    } catch (error) {
      console.error("Error fetching video analysis:", error);
      return res.status(500).json({ message: "Error fetching video analysis" });
    }
  });

  return server;
}
