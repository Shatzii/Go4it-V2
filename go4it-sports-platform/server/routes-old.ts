import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import multer from "multer";
import path from "path";
import { insertUserSchema, insertGarScoreSchema, insertStarpathProgressSchema, insertAcademicRecordSchema } from "@shared/schema";
import { z } from "zod";

// Remove complex type declarations - using any for session to fix TypeScript issues

// Session configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "go4it-sports-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});

// Multer configuration for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/mov", "video/avi"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});

// Auth middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply session middleware
  app.use(sessionMiddleware);

  // Create default admin user if it doesn't exist
  try {
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("MyTime$$", 10);
      await storage.createUser({
        username: "admin",
        password: hashedPassword,
        role: "coach",
        firstName: "System",
        lastName: "Administrator",
        email: "admin@go4it.com",
      });
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      req.session.userRole = user.role;

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User routes
  app.get("/api/users/:id/dashboard", requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check authorization
      if (req.session.userId !== userId && req.session.userRole !== "coach") {
        return res.status(403).json({ message: "Access denied" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const garScores = await storage.getGarScoresByUser(userId);
      const starpathProgress = await storage.getStarpathProgressByUser(userId);
      const academicRecord = await storage.getAcademicRecordByUser(userId);
      const achievements = await storage.getAchievementsByUser(userId);

      res.json({
        user: { ...user, password: undefined },
        garScores,
        starpathProgress,
        academicRecord,
        achievements,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GAR Score routes
  app.get("/api/gar-scores/:userId", requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check authorization
      if (req.session.userId !== userId && req.session.userRole !== "coach") {
        return res.status(403).json({ message: "Access denied" });
      }

      const garScores = await storage.getGarScoresByUser(userId);
      res.json(garScores);
    } catch (error) {
      console.error("Get GAR scores error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/gar-scores", requireAuth, async (req: any, res) => {
    try {
      const garScoreData = insertGarScoreSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });

      const garScore = await storage.createGarScore(garScoreData);
      res.json(garScore);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Create GAR score error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Video upload routes
  app.post("/api/videos/upload", requireAuth, upload.single("video"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file provided" });
      }

      const video = await storage.createVideo({
        userId: req.session.userId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        analysisStatus: "pending",
      });

      // Simulate AI analysis (in production, this would trigger actual AI processing)
      setTimeout(async () => {
        try {
          // Mock GAR score generation
          const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
          const speedScore = Math.floor(Math.random() * 20) + 80;
          const accuracyScore = Math.floor(Math.random() * 25) + 75;
          const decisionScore = Math.floor(Math.random() * 20) + 70;

          await storage.createGarScore({
            userId: req.session.userId,
            videoId: video.id,
            overallScore: mockScore,
            speedScore,
            accuracyScore,
            decisionScore,
            skillBreakdown: {
              shooting: speedScore,
              dribbling: accuracyScore,
              passing: decisionScore,
            },
          });

          await storage.updateVideoStatus(video.id, "completed");
          
          // Award XP for uploading and analyzing video
          await storage.addXpToUser(req.session.userId, "video_analysis", 100);
        } catch (error) {
          console.error("Video processing error:", error);
          await storage.updateVideoStatus(video.id, "failed");
        }
      }, 3000);

      res.json(video);
    } catch (error) {
      console.error("Video upload error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/videos/:userId", requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check authorization
      if (req.session.userId !== userId && req.session.userRole !== "coach") {
        return res.status(403).json({ message: "Access denied" });
      }

      const videos = await storage.getVideosByUser(userId);
      res.json(videos);
    } catch (error) {
      console.error("Get videos error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // StarPath routes
  app.get("/api/starpath/:userId", requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check authorization
      if (req.session.userId !== userId && req.session.userRole !== "coach") {
        return res.status(403).json({ message: "Access denied" });
      }

      const progress = await storage.getStarpathProgressByUser(userId);
      res.json(progress);
    } catch (error) {
      console.error("Get StarPath progress error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/starpath/progress", requireAuth, async (req: any, res) => {
    try {
      const progressData = insertStarpathProgressSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });

      const progress = await storage.createStarpathProgress(progressData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Create StarPath progress error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Academic routes
  app.get("/api/academic/:userId", requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check authorization
      if (req.session.userId !== userId && req.session.userRole !== "coach") {
        return res.status(403).json({ message: "Access denied" });
      }

      const academic = await storage.getAcademicRecordByUser(userId);
      res.json(academic);
    } catch (error) {
      console.error("Get academic record error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/academic", requireAuth, async (req: any, res) => {
    try {
      const academicData = insertAcademicRecordSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });

      const academic = await storage.createOrUpdateAcademicRecord(academicData);
      res.json(academic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Create/update academic record error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Achievement routes
  app.get("/api/achievements/:userId", requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Check authorization
      if (req.session.userId !== userId && req.session.userRole !== "coach") {
        return res.status(403).json({ message: "Access denied" });
      }

      const achievements = await storage.getAchievementsByUser(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Get achievements error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
