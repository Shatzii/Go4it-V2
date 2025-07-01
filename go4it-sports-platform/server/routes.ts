import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import multer from "multer";
import path from "path";
import { insertUserSchema, insertGarScoreSchema, insertStarpathProgressSchema, insertAcademicRecordSchema } from "@shared/schema";
import { z } from "zod";

// Session configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "go4it-sports-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
});

// Configure multer for video uploads
const videoUpload = multer({
  dest: 'uploads/videos/',
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  },
});

function requireAuth(req: any, res: Response, next: any) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(sessionMiddleware);

  // Authentication routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;

      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Video upload and GAR analysis
  app.post("/api/videos/upload", requireAuth, videoUpload.single('video'), async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No video file provided" });
      }

      const video = await storage.createVideo({
        userId,
        filename: file.filename,
        originalName: file.originalname,
        analysisStatus: 'uploaded',
      });

      res.status(201).json(video);
    } catch (error) {
      console.error("Video upload error:", error);
      res.status(500).json({ message: "Video upload failed" });
    }
  });

  app.get("/api/videos", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const videos = await storage.getVideosByUser(userId);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // GAR Scores
  app.post("/api/gar-scores", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const validatedData = insertGarScoreSchema.parse({
        ...req.body,
        userId,
      });

      const garScore = await storage.createGarScore(validatedData);
      res.status(201).json(garScore);
    } catch (error) {
      console.error("GAR score creation error:", error);
      res.status(400).json({ message: "Failed to create GAR score" });
    }
  });

  app.get("/api/gar-scores", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const garScores = await storage.getGarScoresByUser(userId);
      res.json(garScores);
    } catch (error) {
      console.error("Error fetching GAR scores:", error);
      res.status(500).json({ message: "Failed to fetch GAR scores" });
    }
  });

  // StarPath Progress
  app.get("/api/starpath", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const progress = await storage.getStarpathProgressByUser(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching StarPath progress:", error);
      res.status(500).json({ message: "Failed to fetch StarPath progress" });
    }
  });

  app.post("/api/starpath/add-xp", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const { skillId, xpAmount } = req.body;
      
      await storage.addXpToUser(userId, skillId, xpAmount);
      res.json({ message: "XP added successfully" });
    } catch (error) {
      console.error("Error adding XP:", error);
      res.status(500).json({ message: "Failed to add XP" });
    }
  });

  // Academic Records
  app.get("/api/academic", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const record = await storage.getAcademicRecordByUser(userId);
      res.json(record);
    } catch (error) {
      console.error("Error fetching academic record:", error);
      res.status(500).json({ message: "Failed to fetch academic record" });
    }
  });

  app.post("/api/academic", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const validatedData = insertAcademicRecordSchema.parse({
        ...req.body,
        userId,
      });

      const record = await storage.createOrUpdateAcademicRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      console.error("Academic record creation error:", error);
      res.status(400).json({ message: "Failed to create academic record" });
    }
  });

  // Achievements
  app.get("/api/achievements", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const achievements = await storage.getAchievementsByUser(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Health check with system information
  app.get("/api/health", (req: Request, res: Response) => {
    const { getSystemHealth } = require("./production-config");
    res.json(getSystemHealth());
  });

  // CMS Content routes
  app.get("/api/cms/content", requireAuth, async (req: Request, res: Response) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching CMS content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/cms/content/:slug", async (req: Request, res: Response) => {
    try {
      const content = await storage.getContentBySlug(req.params.slug);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/cms/content", requireAuth, async (req: Request, res: Response) => {
    try {
      const content = await storage.createContent(req.body);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  app.put("/api/cms/content/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const content = await storage.updateContent(parseInt(req.params.id), req.body);
      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  app.delete("/api/cms/content/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      await storage.deleteContent(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // CMS Sports routes
  app.get("/api/cms/sports", async (req: Request, res: Response) => {
    try {
      const sports = await storage.getAllSports();
      res.json(sports);
    } catch (error) {
      console.error("Error fetching sports:", error);
      res.status(500).json({ message: "Failed to fetch sports" });
    }
  });

  app.post("/api/cms/sports", requireAuth, async (req: Request, res: Response) => {
    try {
      const sport = await storage.createSport(req.body);
      res.status(201).json(sport);
    } catch (error) {
      console.error("Error creating sport:", error);
      res.status(500).json({ message: "Failed to create sport" });
    }
  });

  app.put("/api/cms/sports/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const sport = await storage.updateSport(parseInt(req.params.id), req.body);
      res.json(sport);
    } catch (error) {
      console.error("Error updating sport:", error);
      res.status(500).json({ message: "Failed to update sport" });
    }
  });

  // CMS Settings routes
  app.get("/api/cms/settings", requireAuth, async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const settings = category 
        ? await storage.getSettingsByCategory(category as string)
        : await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/cms/settings", requireAuth, async (req: Request, res: Response) => {
    try {
      const setting = await storage.createSetting(req.body);
      res.status(201).json(setting);
    } catch (error) {
      console.error("Error creating setting:", error);
      res.status(500).json({ message: "Failed to create setting" });
    }
  });

  app.put("/api/cms/settings/:key", requireAuth, async (req: Request, res: Response) => {
    try {
      const { value } = req.body;
      const setting = await storage.updateSetting(req.params.key, value);
      res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}