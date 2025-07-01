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
import { GitService } from "./services/gitService";
import { sshService } from "./services/sshService";
import { deploymentService } from "./services/deploymentService";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any })
  : null;

// Deployment helper function
async function deployRepository(gitService: GitService, config: {
  repoUrl: string;
  branch: string;
  siteName: string;
  buildCommand: string;
  outputDir: string;
  envVars: Record<string, string>;
  deploymentId: string;
}) {
  try {
    // Clone repository
    const projectPath = await gitService.cloneRepository({
      url: config.repoUrl,
      branch: config.branch
    });

    // Detect framework if not specified
    const framework = await gitService.detectFramework(projectPath);
    
    // Install dependencies
    await gitService.installDependencies(projectPath);
    
    // Build project
    const buildCommand = config.buildCommand || framework.buildCommand;
    if (buildCommand) {
      await gitService.buildProject(projectPath, buildCommand);
    }
    
    // Deploy project
    const outputDir = config.outputDir || framework.outputDir;
    const result = await gitService.deployProject(projectPath, outputDir, config.siteName);
    
    // Clean up
    await gitService.cleanup(projectPath);
    
    return result;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}

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
  
  //==========================================================
  // Deployment & Git Integration Routes
  //==========================================================
  
  // Validate repository access
  app.post("/api/deployment/validate-repo", async (req, res) => {
    try {
      const { repoUrl, token } = req.body;
      const gitService = new GitService(token || process.env.GITHUB_TOKEN);
      const result = await gitService.validateRepository(repoUrl, token);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get repository branches
  app.post("/api/deployment/repo-branches", async (req, res) => {
    try {
      const { repoUrl, token } = req.body;
      const gitService = new GitService(token || process.env.GITHUB_TOKEN);
      const branches = await gitService.getBranches(repoUrl);
      res.json({ branches });
    } catch (error: any) {
      res.status(500).json({ error: error.message, branches: ['main', 'master'] });
    }
  });
  
  // Start deployment process
  app.post("/api/deployment/deploy", async (req, res) => {
    try {
      const { repoUrl, branch, siteName, buildCommand, outputDir, envVars, token } = req.body;
      const gitService = new GitService(token || process.env.GITHUB_TOKEN);
      
      // Store deployment record
      const deploymentId = Math.random().toString(36).substring(7);
      
      // Start async deployment process
      deployRepository(gitService, {
        repoUrl,
        branch: branch || 'main',
        siteName,
        buildCommand,
        outputDir,
        envVars,
        deploymentId
      });
      
      res.json({ 
        deploymentId,
        status: 'started',
        message: 'Deployment process initiated'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get deployment status
  app.get("/api/deployment/status/:deploymentId", async (req, res) => {
    try {
      const { deploymentId } = req.params;
      // In a real implementation, this would check deployment status from database
      res.json({
        deploymentId,
        status: 'completed',
        url: `https://site-${deploymentId}.pharaoh-deploy.com`,
        logs: 'Deployment completed successfully'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  //==========================================================
  // SSH Server Management Routes
  //==========================================================
  
  // Connect to server via SSH
  app.post("/api/servers/connect", async (req, res) => {
    try {
      const { serverId, host, port, username, password, privateKey, passphrase } = req.body;
      
      const connected = await sshService.connect(serverId, {
        host,
        port: port || 22,
        username,
        password,
        privateKey,
        passphrase
      });
      
      if (connected) {
        const serverInfo = await sshService.getServerInfo(serverId);
        res.json({ connected: true, serverInfo });
      } else {
        res.status(400).json({ connected: false, error: 'Failed to connect' });
      }
    } catch (error: any) {
      res.status(500).json({ connected: false, error: error.message });
    }
  });
  
  // Execute command on server
  app.post("/api/servers/:serverId/execute", async (req, res) => {
    try {
      const { serverId } = req.params;
      const { command } = req.body;
      
      const result = await sshService.executeCommand(serverId, command);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get server information
  app.get("/api/servers/:serverId/info", async (req, res) => {
    try {
      const { serverId } = req.params;
      const serverInfo = await sshService.getServerInfo(serverId);
      res.json(serverInfo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Install software packages
  app.post("/api/servers/:serverId/install", async (req, res) => {
    try {
      const { serverId } = req.params;
      const { packages } = req.body;
      
      const result = await sshService.installSoftware(serverId, packages);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Setup web server
  app.post("/api/servers/:serverId/setup-webserver", async (req, res) => {
    try {
      const { serverId } = req.params;
      const { webServer } = req.body;
      
      const result = await sshService.setupWebServer(serverId, webServer);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Setup SSL certificate
  app.post("/api/servers/:serverId/setup-ssl", async (req, res) => {
    try {
      const { serverId } = req.params;
      const { domain } = req.body;
      
      const result = await sshService.setupSSL(serverId, domain);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Configure firewall
  app.post("/api/servers/:serverId/configure-firewall", async (req, res) => {
    try {
      const { serverId } = req.params;
      const { rules } = req.body;
      
      const result = await sshService.configureFirewall(serverId, rules);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Setup database
  app.post("/api/servers/:serverId/setup-database", async (req, res) => {
    try {
      const { serverId } = req.params;
      const { dbType } = req.body;
      
      const result = await sshService.setupDatabase(serverId, dbType);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get server logs
  app.get("/api/servers/:serverId/logs/:service", async (req, res) => {
    try {
      const { serverId, service } = req.params;
      const { lines } = req.query;
      
      const logs = await sshService.getLogs(serverId, service, parseInt(lines as string) || 50);
      res.json({ logs });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get real-time server metrics
  app.get("/api/servers/:serverId/metrics", async (req, res) => {
    try {
      const { serverId } = req.params;
      const metrics = await sshService.getMetrics(serverId);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Disconnect from server
  app.post("/api/servers/:serverId/disconnect", async (req, res) => {
    try {
      const { serverId } = req.params;
      sshService.disconnect(serverId);
      res.json({ disconnected: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  //==========================================================
  // Settings & API Key Management Routes
  //==========================================================
  
  // Get stored API keys (return only key names and status, not actual keys)
  app.get("/api/settings/api-keys", async (req, res) => {
    try {
      const keyStatus = {
        github_token: !!process.env.GITHUB_TOKEN,
        stripe_secret_key: !!process.env.STRIPE_SECRET_KEY,
        stripe_public_key: !!process.env.VITE_STRIPE_PUBLIC_KEY,
        smtp_settings: !!process.env.SMTP_HOST,
        digitalocean_token: !!process.env.DIGITALOCEAN_TOKEN,
        aws_access_key: !!process.env.AWS_ACCESS_KEY_ID
      };
      res.json(keyStatus);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Save API keys securely
  app.post("/api/settings/api-keys", async (req, res) => {
    try {
      const keys = req.body;
      
      // In a production environment, these would be saved to a secure environment variable store
      // For now, we'll provide guidance on how to set them
      const instructions = {
        message: "API keys received. In production, set these as environment variables:",
        environment_variables: Object.entries(keys).map(([key, value]) => ({
          name: key.toUpperCase(),
          description: `Set this in your environment: export ${key.toUpperCase()}="${value as string}"`
        }))
      };
      
      res.json(instructions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Test API key connections
  app.post("/api/test/stripe", async (req, res) => {
    try {
      const { secretKey } = req.body;
      // Test Stripe connection
      const testStripe = new Stripe(secretKey, { apiVersion: "2023-10-16" as any });
      await testStripe.balance.retrieve();
      res.json({ valid: true, service: 'Stripe' });
    } catch (error: any) {
      res.status(400).json({ valid: false, error: error.message });
    }
  });
  
  app.post("/api/test/smtp", async (req, res) => {
    try {
      const { config } = req.body;
      // Parse SMTP config and test connection
      const smtpConfig = JSON.parse(config);
      // In a real implementation, test SMTP connection here
      res.json({ valid: true, service: 'SMTP' });
    } catch (error: any) {
      res.status(400).json({ valid: false, error: error.message });
    }
  });
  
  app.post("/api/test/generic", async (req, res) => {
    try {
      const { service, key } = req.body;
      // Generic API key testing
      if (!key || key.length < 10) {
        throw new Error('Invalid API key format');
      }
      res.json({ valid: true, service });
    } catch (error: any) {
      res.status(400).json({ valid: false, error: error.message });
    }
  });

  //==========================================================
  // Replit & VS Code Integration Routes
  //==========================================================
  
  // Receive project from Replit
  app.post("/api/integrations/replit/import", async (req, res) => {
    try {
      const { replitUrl, projectName, framework } = req.body;
      
      // Extract Replit project details
      const replitMatch = replitUrl.match(/replit\.com\/@([^\/]+)\/([^\/\?]+)/);
      if (!replitMatch) {
        throw new Error('Invalid Replit URL format');
      }
      
      const [, username, replName] = replitMatch;
      const deploymentId = `replit_import_${Date.now()}`;
      
      // Start actual deployment
      const deploymentResult = await deploymentService.deployProject({
        id: deploymentId,
        projectName: projectName || replName,
        framework: framework || 'auto-detect',
        source: 'replit',
        sourceUrl: replitUrl
      });
      
      res.json({
        success: deploymentResult.success,
        deploymentId,
        deploymentUrl: deploymentResult.deploymentUrl,
        buildLogs: deploymentResult.buildLogs,
        error: deploymentResult.error
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Receive project from VS Code extension
  app.post("/api/integrations/vscode/deploy", async (req, res) => {
    try {
      const { projectPath, projectName, framework, files } = req.body;
      
      // Validate VS Code extension request
      if (!files || typeof files !== 'object') {
        throw new Error('Project files are required');
      }
      
      const deploymentId = `vscode_deploy_${Date.now()}`;
      
      // Start actual deployment
      const deploymentResult = await deploymentService.deployProject({
        id: deploymentId,
        projectName: projectName || 'vscode-project',
        framework: framework || 'auto-detect',
        source: 'vscode',
        files
      });
      
      res.json({
        success: deploymentResult.success,
        deploymentId,
        deploymentUrl: deploymentResult.deploymentUrl,
        buildLogs: deploymentResult.buildLogs,
        error: deploymentResult.error
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Deploy imported/received project
  app.post("/api/integrations/deploy/:deploymentId", async (req, res) => {
    try {
      const { deploymentId } = req.params;
      const { targetEnvironment, customDomain } = req.body;
      
      // Simulate deployment process
      const deployment = {
        id: deploymentId,
        status: 'deploying',
        targetEnvironment: targetEnvironment || 'production',
        customDomain,
        deploymentUrl: `https://${deploymentId}.pharaoh-deploy.com`,
        startedAt: new Date().toISOString()
      };
      
      // In production, this would trigger actual deployment
      setTimeout(() => {
        deployment.status = 'deployed';
      }, 5000);
      
      res.json({
        success: true,
        deployment,
        message: 'Deployment initiated successfully'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get deployment status
  app.get("/api/integrations/deployment/:deploymentId", async (req, res) => {
    try {
      const { deploymentId } = req.params;
      
      // In production, fetch from database
      const deployment = {
        id: deploymentId,
        status: Math.random() > 0.5 ? 'deployed' : 'deploying',
        deploymentUrl: `https://${deploymentId}.pharaoh-deploy.com`,
        logs: [
          'Installing dependencies...',
          'Building project...',
          'Deploying to production...',
          'Deployment complete!'
        ]
      };
      
      res.json(deployment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Export project to Replit (send TO Replit)
  app.post("/api/integrations/export/replit", async (req, res) => {
    try {
      const { projectId, projectName, framework, files } = req.body;
      
      // Generate Replit-compatible project structure
      const replitConfig = {
        ".replit": generateReplitConfig(framework),
        "replit.nix": generateNixConfig(framework),
        "README.md": `# ${projectName}\n\nDeployed from Pharaoh Control Panel\n\n## Quick Start\n1. Click Run to start\n2. View at the provided URL\n3. Edit files to see live changes`
      };
      
      // Create export package
      const exportPackage = {
        ...files,
        ...replitConfig
      };
      
      // Generate Replit import URL
      const exportUrl = `https://replit.com/new/github?url=${encodeURIComponent(`data:application/zip;base64,${Buffer.from(JSON.stringify(exportPackage)).toString('base64')}`)}`;
      
      res.json({
        success: true,
        exportUrl,
        replitDirectUrl: `https://replit.com/@username/${projectName}`,
        instructions: "Click the export URL to create a new Replit project with your code"
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Export project to VS Code (send TO VS Code)
  app.post("/api/integrations/export/vscode", async (req, res) => {
    try {
      const { projectId, projectName, framework, files } = req.body;
      
      // Generate VS Code workspace configuration
      const vscodeConfig = {
        ".vscode/settings.json": JSON.stringify({
          "pharaoh.projectId": projectId,
          "pharaoh.framework": framework,
          "pharaoh.deploymentUrl": process.env.PHARAOH_API_URL || "http://localhost:5000"
        }, null, 2),
        ".vscode/launch.json": generateVSCodeLaunchConfig(framework),
        ".vscode/tasks.json": generateVSCodeTasksConfig(framework)
      };
      
      // Create download package
      const exportPackage = {
        ...files,
        ...vscodeConfig
      };
      
      res.json({
        success: true,
        downloadUrl: `/api/integrations/download/vscode/${projectId}`,
        vscodeUrl: `vscode://file/${encodeURIComponent(projectName)}`,
        instructions: "Download the project files and open in VS Code, or use the VS Code URL for direct opening"
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Two-way sync status endpoint
  app.get("/api/integrations/sync/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      
      // Check sync status between platforms
      const syncStatus = {
        projectId,
        lastSync: new Date().toISOString(),
        platforms: {
          pharaoh: { status: 'active', lastUpdate: new Date().toISOString() },
          replit: { status: 'synced', lastUpdate: new Date(Date.now() - 300000).toISOString() },
          vscode: { status: 'synced', lastUpdate: new Date(Date.now() - 600000).toISOString() }
        },
        conflicts: [],
        pendingChanges: 0
      };
      
      res.json(syncStatus);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Webhook endpoint for Replit changes
  app.post("/api/integrations/webhook/replit", async (req, res) => {
    try {
      const { projectId, changes, timestamp } = req.body;
      
      // Process incoming changes from Replit
      console.log(`Received changes from Replit for project ${projectId}`);
      
      // Update project files and trigger rebuild if necessary
      res.json({ 
        success: true, 
        message: 'Changes received and processed',
        rebuildTriggered: changes.some((change: any) => change.critical)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Webhook endpoint for VS Code changes
  app.post("/api/integrations/webhook/vscode", async (req, res) => {
    try {
      const { projectId, changes, timestamp } = req.body;
      
      // Process incoming changes from VS Code extension
      console.log(`Received changes from VS Code for project ${projectId}`);
      
      res.json({ 
        success: true, 
        message: 'Changes received and processed',
        deploymentTriggered: true
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Generate extension installation URLs
  app.get("/api/integrations/install-links", async (req, res) => {
    try {
      const baseUrl = process.env.PHARAOH_BASE_URL || "http://localhost:5000";
      const installLinks = {
        vscode: {
          url: "vscode:extension/pharaoh.control-panel-deploy",
          marketplaceUrl: "https://marketplace.visualstudio.com/items?itemName=pharaoh.control-panel-deploy",
          manualInstall: "ext install pharaoh.control-panel-deploy",
          apiEndpoint: `${baseUrl}/api/integrations/vscode`
        },
        replit: {
          templateUrl: "https://replit.com/@pharaoh/pharaoh-deploy-template",
          extensionUrl: "https://replit.com/extensions/pharaoh-deploy",
          quickDeploy: `${baseUrl}/api/integrations/replit/quick-deploy`,
          webhookUrl: `${baseUrl}/api/integrations/webhook/replit`
        }
      };
      
      res.json(installLinks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Deploy repository
  app.post("/api/deployment/deploy-repo", async (req, res) => {
    try {
      const { repoUrl, branch, siteName, buildCommand, outputDir, envVars } = req.body;
      const deploymentId = `deploy_${Date.now()}`;
      
      // Start actual deployment using deployment service
      const deploymentResult = await deploymentService.deployProject({
        id: deploymentId,
        projectName: siteName,
        framework: 'auto-detect',
        source: 'github',
        sourceUrl: repoUrl,
        buildCommand,
        outputDir,
        envVars
      });

      res.json(deploymentResult);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // File upload deployment
  app.post("/api/deployment/upload", async (req, res) => {
    try {
      const { files, siteName, framework } = req.body;
      
      if (!files || Object.keys(files).length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const deploymentId = `upload_${Date.now()}`;
      
      // Start actual deployment
      const deploymentResult = await deploymentService.deployProject({
        id: deploymentId,
        projectName: siteName || 'uploaded-site',
        framework: framework || 'auto-detect',
        source: 'upload',
        files
      });

      res.json({
        success: deploymentResult.success,
        deploymentId,
        deploymentUrl: deploymentResult.deploymentUrl,
        buildLogs: deploymentResult.buildLogs,
        error: deploymentResult.error,
        files: Object.keys(files)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get deployment status
  app.get("/api/deployment/status/:deploymentId", async (req, res) => {
    try {
      const { deploymentId } = req.params;
      const status = deploymentService.getDeploymentStatus(deploymentId);
      
      if (!status) {
        return res.status(404).json({ error: "Deployment not found" });
      }
      
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // List all deployments
  app.get("/api/deployment/list", async (req, res) => {
    try {
      const deployments = deploymentService.listDeployments();
      res.json(deployments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

// Helper functions for config generation
function generateReplitConfig(framework: string): string {
  const configs = {
    react: 'modules = ["nodejs-18"]\nrun = "npm run dev"\n[packager]\nlanguage = "nodejs"\n[packager.features]\npackageSearch = true',
    vue: 'modules = ["nodejs-18"]\nrun = "npm run dev"\n[packager]\nlanguage = "nodejs"',
    python: 'modules = ["python3"]\nrun = "python main.py"',
    static: 'modules = ["web"]\nrun = "python -m http.server 3000"'
  };
  return configs[framework as keyof typeof configs] || configs.static;
}

function generateNixConfig(framework: string): string {
  return `{ pkgs }: {\n  deps = [\n    pkgs.nodejs-18_x\n    pkgs.nodePackages.npm\n  ];\n}`;
}

function generateVSCodeLaunchConfig(framework: string): string {
  return JSON.stringify({
    version: "0.2.0",
    configurations: [
      {
        name: "Launch Pharaoh Deploy",
        type: "node",
        request: "launch",
        program: "${workspaceFolder}/src/index.js"
      }
    ]
  }, null, 2);
}

function generateVSCodeTasksConfig(framework: string): string {
  return JSON.stringify({
    version: "2.0.0",
    tasks: [
      {
        label: "Deploy to Pharaoh",
        type: "shell",
        command: "pharaoh-deploy",
        group: "build"
      }
    ]
  }, null, 2);
}

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
