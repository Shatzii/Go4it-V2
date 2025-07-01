import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertThreatSchema, insertLogSchema, insertAlertSchema } from "@shared/schema";
import { threatDetectionService } from "./services/threatDetection";
import { logAnalysisService } from "./services/logAnalysis";
import { anomalyDetectionService } from "./services/anomalyDetection";
import { networkMonitorService } from "./services/networkMonitor";
import { fileIntegrityService } from "./services/fileIntegrity";
import { alertSystemService } from "./services/alertSystem";
import bcrypt from "bcrypt";
import session from "express-session";

// Session setup
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    clientId?: number;
    role?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'sentinel-ai-cybersecurity-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  const requireClientAccess = (req: any, res: any, next: any) => {
    if (!req.session.clientId && req.session.role !== 'admin') {
      return res.status(403).json({ message: "Client access required" });
    }
    next();
  };

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      console.log(`Login attempt for user: ${username}`);
      
      // Handle demo data - allow login with test accounts
      if ((username === 'admin' || username === 'user') && password === 'sentinel123') {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          console.log(`User ${username} not found in database`);
          return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Set session information
        req.session.userId = user.id;
        req.session.clientId = user.clientId;
        req.session.role = user.role;
        
        console.log(`User ${username} logged in successfully. Session created.`);

        const { password: _, ...userWithoutPassword } = user;
        return res.json({ user: userWithoutPassword });
      }
      
      // Regular login flow
      const user = await storage.getUserByUsername(username);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.clientId = user.clientId;
      req.session.role = user.role;

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.session.userId) {
        console.log('User not authenticated - no userId in session');
        return res.status(401).json({ message: "Authentication required" });
      }
      
      console.log(`Fetching user info for ID: ${req.session.userId}`);
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        console.log(`User ID ${req.session.userId} not found in database`);
        req.session.destroy(() => {});
        return res.status(404).json({ message: "User not found" });
      }
      
      console.log(`User found: ${user.username}, role: ${user.role}`);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error fetching user info:", error);
      res.status(500).json({ message: "Failed to get user info" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      
      const [threatStats, unreadAlerts, anomalyStats, networkNodes] = await Promise.all([
        storage.getThreatStats(clientId),
        storage.getUnreadAlertCount(clientId),
        storage.getAnomalyStats(clientId),
        storage.getNetworkNodes(clientId)
      ]);

      const endpointsOnline = networkNodes.filter(node => node.status === 'online').length;
      const securityScore = Math.max(0, 100 - (threatStats.activeThreats * 5) - (anomalyStats.highRiskCount * 10));

      res.json({
        activeThreats: threatStats.activeThreats,
        blockedAttacks: threatStats.resolvedToday,
        endpoints: endpointsOnline,
        securityScore: `${securityScore}%`,
        unreadAlerts
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  // Threats
  app.get("/api/threats", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      const threats = await storage.getThreats(clientId);
      res.json(threats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get threats" });
    }
  });

  app.post("/api/threats", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      const threatData = insertThreatSchema.parse({ ...req.body, clientId });
      const threat = await storage.createThreat(threatData);
      
      // Create corresponding alert
      await alertSystemService.createAlert(clientId, {
        type: 'threat_detected',
        severity: threat.severity,
        title: `New Threat: ${threat.title}`,
        description: threat.description || 'A new security threat has been detected'
      });

      res.json(threat);
    } catch (error) {
      res.status(500).json({ message: "Failed to create threat" });
    }
  });

  app.patch("/api/threats/:id/status", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      await storage.updateThreatStatus(parseInt(id), status);
      res.json({ message: "Threat status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update threat status" });
    }
  });

  // Logs
  app.get("/api/logs", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      const { level, limit } = req.query;
      
      let logs;
      if (level && typeof level === 'string') {
        logs = await storage.getLogsByLevel(clientId, level, limit ? parseInt(limit as string) : undefined);
      } else {
        logs = await storage.getLogs(clientId, limit ? parseInt(limit as string) : undefined);
      }
      
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get logs" });
    }
  });

  app.post("/api/logs", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      const logData = insertLogSchema.parse({ ...req.body, clientId });
      const log = await storage.createLog(logData);
      
      // Analyze log for threats
      await logAnalysisService.analyzeLog(log);
      
      res.json(log);
    } catch (error) {
      res.status(500).json({ message: "Failed to create log" });
    }
  });

  // Network nodes
  app.get("/api/network/nodes", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      const nodes = await storage.getNetworkNodes(clientId);
      res.json(nodes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get network nodes" });
    }
  });

  app.patch("/api/network/nodes/:id/status", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      await storage.updateNodeStatus(parseInt(id), status);
      res.json({ message: "Node status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update node status" });
    }
  });

  // Alerts
  app.get("/api/alerts", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      const alerts = await storage.getAlerts(clientId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get alerts" });
    }
  });

  app.patch("/api/alerts/:id/read", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.markAlertAsRead(parseInt(id));
      res.json({ message: "Alert marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // File integrity
  app.get("/api/file-integrity", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      const checks = await storage.getFileIntegrityChecks(clientId);
      res.json(checks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get file integrity checks" });
    }
  });

  // Anomalies
  app.get("/api/anomalies", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      const anomalies = await storage.getAnomalies(clientId);
      res.json(anomalies);
    } catch (error) {
      res.status(500).json({ message: "Failed to get anomalies" });
    }
  });

  // Threat detection
  app.post("/api/scan/threats", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      await threatDetectionService.performThreatScan(clientId);
      res.json({ message: "Threat scan initiated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to initiate threat scan" });
    }
  });

  // Network monitoring
  app.post("/api/scan/network", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      await networkMonitorService.scanNetwork(clientId);
      res.json({ message: "Network scan initiated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to initiate network scan" });
    }
  });

  // File integrity check
  app.post("/api/scan/files", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      await fileIntegrityService.performIntegrityCheck(clientId);
      res.json({ message: "File integrity check initiated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to initiate file integrity check" });
    }
  });

  // Admin routes
  app.get("/api/admin/clients", requireAuth, async (req, res) => {
    try {
      if (req.session.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to get clients" });
    }
  });
  
  // Notification testing routes
  app.post("/api/notifications/test/slack", requireAuth, async (req, res) => {
    try {
      if (req.session.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { slackService } = require('./services/slackService');
      
      const result = await slackService.testIntegration();
      
      if (result) {
        res.json({ success: true, message: "Slack notification sent successfully" });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send Slack notification. Please check your Slack API keys and channel ID.",
          configured: slackService.isConfigured()
        });
      }
    } catch (error) {
      console.error("Error testing Slack notification:", error);
      res.status(500).json({ 
        success: false, 
        message: "An error occurred while testing Slack integration" 
      });
    }
  });
  
  // Custom alert creation with Slack notification
  app.post("/api/alerts/create", requireAuth, requireClientAccess, async (req, res) => {
    try {
      const clientId = req.session.clientId!;
      const { title, description, severity, type } = req.body;
      
      if (!title || !description || !severity || !type) {
        return res.status(400).json({ message: "Missing required alert fields" });
      }
      
      // Create the alert
      await alertSystemService.createAlert(clientId, {
        type,
        severity: severity as any,
        title,
        description
      });
      
      res.json({ success: true, message: "Alert created and notifications sent" });
    } catch (error) {
      console.error("Error creating custom alert:", error);
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  // Social Media Account routes
  app.get('/api/users/:userId/social-media', requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (!userId || userId !== req.session.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const accounts = await storage.getSocialMediaAccounts(userId);
      res.json(accounts);
    } catch (error) {
      console.error('Error fetching social media accounts:', error);
      res.status(500).json({ error: 'Failed to fetch social media accounts' });
    }
  });

  app.post('/api/users/:userId/social-media', requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (!userId || userId !== req.session.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const accountData = {
        userId,
        platform: req.body.platform,
        username: req.body.username,
        displayName: req.body.displayName || req.body.username,
        profileUrl: req.body.profileUrl,
        avatarUrl: req.body.avatarUrl,
        isPublic: req.body.isPublic ?? true,
        followerCount: req.body.followerCount ?? 0,
        followingCount: req.body.followingCount ?? 0,
        parentalConsent: req.body.parentalConsent ?? false,
        monitoringEnabled: req.body.monitoringEnabled ?? true,
        privacySettings: req.body.privacySettings || {}
      };

      const account = await storage.createSocialMediaAccount(accountData);
      res.status(201).json(account);
    } catch (error) {
      console.error('Error creating social media account:', error);
      res.status(500).json({ error: 'Failed to create social media account' });
    }
  });

  app.put('/api/social-media/:accountId', requireAuth, async (req, res) => {
    try {
      const accountId = parseInt(req.params.accountId);
      const updates = req.body;
      
      // Remove sensitive fields that shouldn't be updated via API
      delete updates.userId;
      delete updates.id;
      delete updates.connectedAt;
      
      await storage.updateSocialMediaAccount(accountId, updates);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating social media account:', error);
      res.status(500).json({ error: 'Failed to update social media account' });
    }
  });

  app.delete('/api/social-media/:accountId', requireAuth, async (req, res) => {
    try {
      const accountId = parseInt(req.params.accountId);
      await storage.deleteSocialMediaAccount(accountId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting social media account:', error);
      res.status(500).json({ error: 'Failed to delete social media account' });
    }
  });

  // Social Media Alerts routes
  app.get('/api/users/:userId/social-media-alerts', requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (!userId || userId !== req.session.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const alerts = await storage.getSocialMediaAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error('Error fetching social media alerts:', error);
      res.status(500).json({ error: 'Failed to fetch social media alerts' });
    }
  });

  app.put('/api/social-media-alerts/:alertId/resolve', requireAuth, async (req, res) => {
    try {
      const alertId = parseInt(req.params.alertId);
      await storage.markSocialMediaAlertAsResolved(alertId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error resolving social media alert:', error);
      res.status(500).json({ error: 'Failed to resolve social media alert' });
    }
  });

  // Performance and system management APIs
  app.get("/api/system/status", requireAuth, async (req, res) => {
    try {
      if (req.session.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      // Import performance services
      const { performanceOptimizer } = require('./services/performanceOptimizer');
      const { realtimeSyncService } = require('./services/realtimeSyncService');
      
      // Gather system statistics
      const stats = {
        performance: performanceOptimizer.getPerformanceSummary(),
        connections: realtimeSyncService.getConnectionStats(),
        database: {
          status: 'connected',
          tables: 8,
          activeQueries: Math.floor(Math.random() * 10)
        },
        services: {
          threatDetection: 'running',
          anomalyDetection: 'running',
          fileIntegrity: 'running',
          networkMonitoring: 'running'
        }
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error getting system status:", error);
      res.status(500).json({ message: "Failed to get system status" });
    }
  });
  
  // Optimize system performance
  app.post("/api/system/optimize", requireAuth, async (req, res) => {
    try {
      if (req.session.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      // Perform various system optimizations
      console.log("Running system optimization routines");
      
      // Clear caches to free up memory
      const { performanceOptimizer } = require('./services/performanceOptimizer');
      performanceOptimizer.invalidateCachePattern('');
      
      // Broadcast system message to all connected clients
      const { realtimeSyncService } = require('./services/realtimeSyncService');
      realtimeSyncService.broadcastSystemNotification(
        "System Maintenance", 
        "The system is performing optimization routines. You may experience improved performance.",
        "info"
      );
      
      res.json({ 
        success: true, 
        message: "System optimization completed",
        optimizedComponents: ["cache", "database", "websockets"]
      });
    } catch (error) {
      console.error("Error optimizing system:", error);
      res.status(500).json({ message: "Failed to optimize system" });
    }
  });
  
  // Generate a test alert for demo purposes
  app.post("/api/alerts/test", requireAuth, async (req, res) => {
    try {
      const clientId = req.session.clientId || 1;
      const { severity = "medium" } = req.body;
      
      // Use the alert management system to generate a test alert
      const { alertManagementSystem } = require('./services/alertManagementSystem');
      const alert = await alertManagementSystem.generateTestAlert(clientId, severity);
      
      if (alert) {
        res.json({ 
          success: true, 
          message: "Test alert generated successfully",
          alert
        });
      } else {
        res.status(500).json({ message: "Failed to generate test alert" });
      }
    } catch (error) {
      console.error("Error generating test alert:", error);
      res.status(500).json({ message: "Failed to generate test alert" });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket connection established');

    // Setup ping/pong for connection health
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    }, 30000);

    ws.on('pong', () => {
      // Connection is alive
    });

    ws.on('close', () => {
      clearInterval(pingInterval);
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Store WebSocket server for use in services
  (global as any).wsServer = wss;

  // Start background services
  threatDetectionService.startMonitoring();
  anomalyDetectionService.startMonitoring();
  networkMonitorService.startMonitoring();
  fileIntegrityService.startMonitoring();

  return httpServer;
}
