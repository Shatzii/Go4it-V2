import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "fs";
import path from "path";
import { createSchema } from "./create-schema";
import cors from "cors";
import { storage } from './storage';
import { getAllActiveApiKeys } from './getAllActiveApiKeys';
import { initializeBlogGeneration } from './blog-generator';
import { openAIService } from './openai-service.fixed';
import { transferPortalService } from './services/transfer-portal-service';
import { athleteScoutService } from './services/athlete-scout-service';
import { combineService } from './services/combine-service';
import { authSentinel } from './middleware/auth-sentinel';
import { registerSkillTreeApi } from './skill-tree-api';
import skillTreeRoutes from './routes/skill-tree-routes';
import { seedSkillTree } from './seed-skill-tree';
import net from 'net';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS middleware to allow cross-origin requests
const isProduction = process.env.NODE_ENV === "production";
app.use(cors({
  // In production, only allow requests from our own server
  // In development, allow all origins for testing
  origin: isProduction ? ['http://5.161.99.81:81', 'https://5.161.99.81:81'] : true,
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Base-URL']
}));

// Add a proxy middleware for requests with X-Base-URL header
app.use((req, res, next) => {
  const baseUrl = req.headers['x-base-url'];
  if (baseUrl && typeof baseUrl === 'string' && baseUrl.startsWith('http')) {
    // Replace the base URL for this request
    const originalUrl = req.url;
    const proxyUrl = `${baseUrl}${originalUrl}`;
    
    console.log(`Proxying request: ${req.method} ${originalUrl} to ${proxyUrl}`);
    
    import('node-fetch').then(({ default: fetch }) => {
      // Forward the request to the target server with minimal headers to avoid 431 errors
      fetch(proxyUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Forwarded-For': String(req.ip || ''),
          'Host': new URL(baseUrl).host,
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      })
      .then(response => {
        console.log(`Proxy response received: ${response.status} from ${proxyUrl}`);
        
        // Set status code
        res.status(response.status);
        
        // Set headers - convert entries to array first to avoid TypeScript iterator issues
        const headerEntries = Array.from(response.headers.entries());
        for (const [key, value] of headerEntries) {
          // Skip setting these headers as they might cause issues
          if (!['content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
            res.setHeader(key, value);
          }
        }
        
        // Return the response body
        return response.text();
      })
      .then(body => {
        try {
          // Try to parse as JSON to see if it's valid
          const jsonBody = JSON.parse(body);
          console.log(`Proxy response body is valid JSON with ${Array.isArray(jsonBody) ? jsonBody.length + ' items' : 'an object'}`);
          res.json(jsonBody);
        } catch (e) {
          // If not valid JSON, just send as text
          console.log(`Proxy response body is not valid JSON, sending as text`);
          res.send(body);
        }
      })
      .catch(error => {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy request failed', message: error.message });
      });
    }).catch(err => {
      console.error('Failed to load fetch:', err);
      next();
    });
  } else {
    next();
  }
});

// Apply CyberShield Security Sentinel Middleware
// This intercepts all requests to check for valid authentication tokens
app.use(authSentinel);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve PWA files directly
app.use('/manifest.json', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'manifest.json'));
});

app.use('/service-worker.js', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'service-worker.js'));
});

app.use('/offline.html', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'offline.html'));
});

// Serve static assets 
app.use('/assets', express.static(path.join(process.cwd(), 'public', 'assets')));

// Fix for main.tsx file access
app.use('/src/main.tsx', (req, res) => {
  const mainTsxPath = path.join(process.cwd(), 'client', 'src', 'main.tsx');
  if (fs.existsSync(mainTsxPath)) {
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(mainTsxPath);
  } else {
    res.status(404).send('File not found');
  }
});

// Serve the client/src directory for modules imported by main.tsx
app.use('/src', express.static(path.join(process.cwd(), 'client', 'src')));

// Also serve node_modules for dependencies
app.use('/node_modules', express.static(path.join(process.cwd(), 'node_modules')));

// Custom handler for the root path to ensure index.html is served
app.get('/', (req, res, next) => {
  console.log('Serving root path');
  // Directly serve index.html for the root path
  const clientIndexPath = path.join(process.cwd(), 'client', 'index.html');
  if (fs.existsSync(clientIndexPath)) {
    console.log('Serving index.html from:', clientIndexPath);
    return res.sendFile(clientIndexPath);
  }
  // Otherwise proceed to the next middleware
  next();
});

// Serve auth.html directly for simplified authentication
app.get('/auth', (req, res, next) => {
  console.log('Serving auth path');
  const authPath = path.join(process.cwd(), 'client', 'auth.html');
  if (fs.existsSync(authPath)) {
    console.log('Serving auth.html from:', authPath);
    return res.sendFile(authPath);
  }
  next();
});

// Serve dashboard.html directly
app.get('/dashboard', (req, res, next) => {
  console.log('Serving dashboard path');
  // Here we could check authentication if needed
  const dashboardPath = path.join(process.cwd(), 'client', 'dashboard.html');
  if (fs.existsSync(dashboardPath)) {
    console.log('Serving dashboard.html from:', dashboardPath);
    return res.sendFile(dashboardPath);
  }
  next();
});

// Route for the main application after NDA acceptance
// Let Vite handle this route in development mode
// Only explicitly handle it in production mode
if (app.get("env") !== "development") {
  app.get('/app', (req, res) => {
    // Serve the client/index.html file for the app route
    const clientIndexPath = path.join(process.cwd(), 'client', 'index.html');
    if (fs.existsSync(clientIndexPath)) {
      res.sendFile(clientIndexPath);
    } else {
      // Fallback to vite handling
      res.redirect('/');
    }
  });
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Create database schema if needed
    await createSchema();
    log("Database schema created successfully", "db");
    
    // Register skill tree API endpoints directly before other API routes
    registerSkillTreeApi(app);
    log("Registered Skill Tree API endpoints");
    
    // Register enhanced skill tree routes
    app.use('/api/skills', skillTreeRoutes);
    log("Registered Enhanced Skill Tree Routes");
    
    // Seed skill tree data if needed
    try {
      await seedSkillTree();
      log("Skill tree sample data initialized");
    } catch (error) {
      log(`Error seeding skill tree data: ${error}`, "error");
    }
    
    // Load API keys from database
    try {
      const apiKeys = await getAllActiveApiKeys();
      if (apiKeys && apiKeys.length > 0) {
        log(`Loading ${apiKeys.length} API keys from database`);
        
        // Set environment variables from stored API keys
        apiKeys.forEach((key: any) => {
          const keyName = key.key_type.toUpperCase() + '_API_KEY';
          if (key.key_type === 'openai') {
            process.env.OPENAI_API_KEY = key.key_value;
            log('Set OPENAI_API_KEY from database');
          } else if (key.key_type === 'stripe') {
            process.env.STRIPE_SECRET_KEY = key.key_value;
            log('Set STRIPE_SECRET_KEY from database');
          } else if (key.key_type === 'sendgrid') {
            process.env.SENDGRID_API_KEY = key.key_value;
            log('Set SENDGRID_API_KEY from database');
          } else if (key.key_type === 'twilio') {
            process.env.TWILIO_AUTH_TOKEN = key.key_value;
            log('Set TWILIO_AUTH_TOKEN from database');
          } else {
            process.env[keyName] = key.key_value;
            log(`Set ${keyName} from database`);
          }
        });
      } else {
        log('No API keys found in database', 'db');
      }
    } catch (err) {
      log(`Error loading API keys from database: ${err}`, 'db');
    }
  } catch (error) {
    log(`Error creating database schema: ${error}`, "db");
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  console.log("Current environment:", app.get("env"));
  
  // Express.js sets "development" as the default env when NODE_ENV is not set
  // But let's be explicit to ensure Vite is set up properly
  if (app.get("env") === "development" || !process.env.NODE_ENV) {
    console.log("Setting up Vite development server...");
    await setupVite(app, server);
  } else {
    console.log("Setting up static file serving for production...");
    serveStatic(app);
  }

  // Production server will use port 81 on IP 5.161.99.81
  // For development, we'll use port 5000
  const isProduction = process.env.NODE_ENV === "production";
  const findAvailablePort = async (startPort: number): Promise<number> => {
    // In production mode, always use port 81
    if (isProduction) {
      return 81;
    }
    
    // In development, find an available port starting from startPort
    return new Promise((resolve) => {
      const netServer = net.createServer();
      netServer.listen(startPort, '0.0.0.0', () => {
        const port = (netServer.address() as any).port;
        netServer.close(() => resolve(port));
      });
      netServer.on('error', () => {
        resolve(findAvailablePort(startPort + 1));
      });
    });
  };

  const port = await findAvailablePort(5000);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Initialize OpenAI service and blog generation
    openAIService.hasValidApiKey()
      .then(async hasKey => {
        if (hasKey) {
          log("✅ OpenAI API key validated successfully");
          
          // Now initialize the blog generator
          log("Initializing AI blog generator...");
          try {
            await initializeBlogGeneration();
            log("AI blog generator initialized successfully");
            
            // Initialize Transfer Portal Service
            log("Initializing Transfer Portal Service...");
            const transferPortalInitialized = await transferPortalService.initialize();
            log(`Transfer Portal Service initialization ${transferPortalInitialized ? 'successful' : 'failed'}`);
            
            // Initialize Athlete Scout Service
            log("Initializing Athlete Scout Service...");
            const athleteScoutInitialized = await athleteScoutService.initialize();
            log(`Athlete Scout Service initialization ${athleteScoutInitialized ? 'successful' : 'failed'}`);
            
            // Initialize Combine Service
            log("Initializing Combine Rating Service...");
            const combineInitialized = await combineService.initialize();
            log(`Combine Rating Service initialization ${combineInitialized ? 'successful' : 'failed'}`);
            
            // Create default monitors and scouts if none exist
            try {
              // Create a default transfer portal monitor for Football
              const initialMonitor = await transferPortalService.createMonitor(
                "NCAA Football Transfer Portal Tracker",
                "Monitors NCAA football transfer portal for new entries and roster changes",
                "football",
                "player-portal-entries",
                1, // Admin user ID
                {
                  divisions: ["D1-FBS", "D1-FCS", "D2"],
                  conferences: ["SEC", "Big Ten", "ACC", "Big 12", "Pac-12"],
                  updateFrequency: 360, // 6 minutes
                  positionGroups: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S"]
                }
              );
              
              if (initialMonitor) {
                log("Created initial Football Transfer Portal monitor");
              }
              
              // Create a default athlete scout
              const initialScout = await athleteScoutService.createScout(
                "National Football & Basketball Talent Scout",
                "Discovers promising football and basketball athletes on social media",
                1, // Admin user ID
                {
                  sportFocus: ["football", "basketball"],
                  platformsToSearch: ["instagram", "tiktok", "twitter"],
                  ageRangeMin: 14,
                  ageRangeMax: 18
                }
              );
              
              if (initialScout) {
                log("Created initial Athlete Social Media scout");
              }
              
              // Create a default media partnership scout
              const initialMediaScout = await athleteScoutService.createMediaScout(
                "Sports Podcast & Instagram Partnership Scout",
                "Discovers sports media outlets for cross-promotion opportunities",
                1, // Admin user ID
                ["podcast", "instagram", "youtube"], // Media types
                ["football", "basketball", "multi-sport"], // Sport focus
                {
                  followerThreshold: 5000,
                  keywordsToTrack: ["athlete", "recruiting", "high school", "college", "sports"]
                }
              );
              
              if (initialMediaScout) {
                log("Created initial Media Partnership scout");
              }
            } catch (err) {
              log(`Error creating default scouts/monitors: ${err}`);
            }
            
          } catch (err) {
            log(`Error initializing AI blog generator: ${err}`);
          }
        } else {
          log("⚠️ No valid OpenAI API key found. AI features will be limited.");
          log("Please update the API key in the admin panel or set OPENAI_API_KEY environment variable.");
        }
      })
      .catch(error => {
        log(`Error checking OpenAI API key: ${error}`, "error");
      });
  });
})();
