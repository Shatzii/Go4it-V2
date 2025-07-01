import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { dashboardController } from "./controllers/dashboard";
import { aiModelsController } from "./controllers/aiModels";
import { serverHealthController } from "./controllers/serverHealth";
import { aiController } from "./controllers/aiController";
import { monitoringController } from "./controllers/monitoringController";
import { authController } from "./controllers/authController";
import { subscriptionController } from "./controllers/subscriptionController"; 
import { authenticate } from "./middlewares/authMiddleware";
import { initializeSocketService } from "./services/socketService";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes (public)
  app.post("/api/auth/register", authController.register);
  app.post("/api/auth/login", authController.login);
  app.post("/api/auth/logout", authController.logout);
  app.get("/api/auth/user", authController.getCurrentUser);
  
  // User info endpoint (protected)
  app.get("/api/auth/me", authenticate, authController.getCurrentUser);
  
  // Dashboard routes - protected
  app.get("/api/dashboard", authenticate, dashboardController.getDashboardData);
  
  // Server health routes - protected
  app.get("/api/server/metrics", authenticate, serverHealthController.getServerMetrics);
  app.get("/api/server/performance", authenticate, serverHealthController.getPerformanceData);
  app.get("/api/server/healing-events", authenticate, serverHealthController.getHealingEvents);
  app.post("/api/server/healing-events", authenticate, serverHealthController.createHealingEvent);
  
  // AI models routes
  app.get("/api/ai/models", aiModelsController.getActiveModels);
  app.get("/api/ai/marketplace", aiModelsController.getMarketplaceModels);
  app.post("/api/ai/models", aiModelsController.addModel);
  app.patch("/api/ai/models/:id", aiModelsController.updateModel);
  app.delete("/api/ai/models/:id", aiModelsController.deleteModel);
  
  // Terminal command simulation route
  app.post("/api/terminal/execute", (req, res) => {
    const { command } = req.body;
    let output = "Command executed successfully";
    
    if (command.includes("error")) {
      output = "Error: Command failed to execute";
    }
    
    res.json({ output });
  });

  // Subscription routes - protected
  app.post("/api/subscription/create", authenticate, subscriptionController.getOrCreateSubscription);
  app.get("/api/subscription", authenticate, subscriptionController.getSubscription);
  app.post("/api/subscription/cancel", authenticate, subscriptionController.cancelSubscription);
  app.get("/api/subscription/success", subscriptionController.handleSubscriptionSuccess);
  
  // AI Model Marketplace routes - protected
  app.get("/api/marketplace/models", authenticate, aiModelsController.getMarketplaceModels);
  app.post("/api/marketplace/install", authenticate, aiModelsController.installModel);
  app.get("/api/marketplace/installed", authenticate, aiModelsController.getInstalledModels);
  
  // Legacy payment routes (kept for compatibility)
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable." });
      }

      const { amount } = req.body;
      
      // Create a payment intent for a one-time payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Legacy subscription route (redirects to new endpoint)
  app.post("/api/get-or-create-subscription", authenticate, (req, res) => {
    // Redirect to the new endpoint
    req.url = "/api/subscription/create";
    app._router.handle(req, res);
  });

  //==========================================================
  // AI Engine Routes - Using the PharaohAI engine
  //==========================================================
  
  // AI Root Cause Analysis
  app.post("/api/ai/analyze-issue", aiController.analyzeServerIssue);
  
  // AI Performance Analysis and Optimization 
  app.post("/api/ai/performance-anomalies", aiController.detectPerformanceAnomalies);
  
  // AI Security Analysis
  app.post("/api/ai/security-analysis", aiController.analyzeSecurityRisks);
  
  // AI Terminal Assistant
  app.post("/api/ai/terminal-assistance", aiController.getTerminalAssistance);
  
  // Self-healing system
  app.get("/api/healing-events", aiController.getHealingEvents);
  app.post("/api/healing-events/status", aiController.updateHealingEventStatus);
  
  //==========================================================
  // Real-Time Monitoring Routes - Live server data
  //==========================================================
  
  // System monitoring
  app.get("/api/monitoring/metrics", monitoringController.getCurrentMetrics);
  app.get("/api/monitoring/performance", monitoringController.getPerformanceData);
  app.get("/api/monitoring/status", monitoringController.getMonitoringStatus);
  app.post("/api/monitoring/control", monitoringController.controlMonitoring);
  
  // Log monitoring
  app.get("/api/monitoring/logs", monitoringController.getRecentLogs);
  app.get("/api/monitoring/log-analysis", monitoringController.getLogAnalysis);
  app.post("/api/monitoring/analyze-log", monitoringController.analyzeLogFile);
  
  // Terminal execution
  app.post("/api/terminal/execute", monitoringController.executeCommand);
  app.get("/api/terminal/history", monitoringController.getCommandHistory);
  app.get("/api/terminal/suggestions", monitoringController.getCommandSuggestions);
  app.get("/api/terminal/safe-commands", monitoringController.getSafeCommands);
  app.post("/api/terminal/execute-healing", monitoringController.executeHealingCommands);
  app.get("/api/terminal/system-info", monitoringController.getSystemInfo);
  
  // AI Self-Healing endpoints
  app.post("/api/ai/self-heal", aiController.performSelfHealing);
  
  // AI Model Download Endpoints
  app.get("/api/ai/download-info", (req, res) => {
    // Provide information about the downloadable AI model
    res.json({
      name: "Pharaoh AI Engine",
      version: "1.0.0",
      size: "2.4GB",
      description: "Local AI engine for server management and self-healing",
      systemRequirements: {
        cpu: "4+ cores recommended",
        ram: "8GB minimum, 16GB recommended",
        disk: "5GB free space",
        os: ["Linux", "macOS", "Windows 10/11"]
      },
      features: [
        "Root cause analysis",
        "Performance optimization",
        "Self-healing capabilities",
        "Security auditing",
        "Server documentation generation",
        "Infrastructure-as-code generation",
        "Terminal assistance"
      ],
      downloadUrl: "/api/ai/download-model",
      installationInstructions: [
        "1. Download the Pharaoh AI Engine package",
        "2. Extract the files to a local directory",
        "3. Run the installer script for your platform",
        "4. Configure the connection to your Pharaoh Control Panel",
        "5. Start the local AI engine service"
      ]
    });
  });
  
  app.get("/api/ai/download-model", (req, res) => {
    // In a real implementation, this would stream the model file to the client
    // For demo purposes, we just inform that this is a placeholder
    res.status(200).send({
      message: "This is a placeholder for the model download endpoint. In production, this would stream the actual model file."
    });
  });

  const httpServer = createServer(app);

  // Initialize WebSocket service with the HTTP server
  initializeSocketService(httpServer);

  return httpServer;
}
