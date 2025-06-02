import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
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
import authRoutes from './auth-routes';

// Get the current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Direct route handlers for HTML pages - These take priority over React routes
app.get('/', (req, res, next) => {
  const indexPath = path.join(__dirname, '../client/index.html');
  console.log('Serving root path');
  
  if (fs.existsSync(indexPath)) {
    console.log(`Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath);
  } else {
    console.log('index.html not found, falling back to Vite/React');
    next();
  }
});

app.get('/auth', (req, res, next) => {
  const authPath = path.join(__dirname, '../client/auth.html');
  console.log('Serving auth path');
  
  if (fs.existsSync(authPath)) {
    console.log(`Serving auth.html from: ${authPath}`);
    res.sendFile(authPath);
  } else {
    console.log('auth.html not found, falling back to Vite/React');
    next();
  }
});

app.get('/dashboard', (req, res, next) => {
  const dashboardPath = path.join(__dirname, '../client/dashboard.html');
  console.log('Serving dashboard path');
  
  if (fs.existsSync(dashboardPath)) {
    console.log(`Serving dashboard.html from: ${dashboardPath}`);
    res.sendFile(dashboardPath);
  } else {
    console.log('dashboard.html not found, falling back to Vite/React');
    next();
  }
});

// Serve static assets from the client/assets directory
app.use('/assets', express.static(path.join(__dirname, '../client/assets')));

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

  // Serve static files for Vite
  app.use(serveStatic);

  // Use Vite middleware
  app.use(setupVite);

  // Register auth routes
  app.use(authRoutes);

  // Check if OpenAI API key is valid
  openAIService
    .hasValidApiKey()
    .then(valid => {
      if (valid) {
        console.log("✅ OpenAI API key validated successfully");
        
        // Initialize AI blog generator
        initializeBlogGeneration()
          .then(() => {
            log("AI blog generator initialized successfully");
            
            // Initialize Transfer Portal Service
            transferPortalService.initialize()
              .then(() => {
                log("Transfer Portal Service initialization successful");
                
                // Initialize Athlete Scout Service
                athleteScoutService.initialize()
                  .then(() => {
                    log("Athlete Scout Service initialization successful");
                    
                    // Initialize Combine Rating Service
                    combineService.initialize()
                      .then(() => {
                        log("Combine Rating Service initialization successful");
                        
                        // Create example data for development environment
                        try {
                            // Skipping scout/monitor creation to avoid startup errors
                          log("Skipping sample monitor/scout creation to avoid startup errors");
                        } catch (err) {
                          log(`Error creating default scouts/monitors: ${err}`);
                        }
                      })
                      .catch(error => {
                        log(`Error initializing Combine Rating Service: ${error}`, "error");
                      });
                  })
                  .catch(error => {
                    log(`Error initializing Athlete Scout Service: ${error}`, "error");
                  });
              })
              .catch(error => {
                log(`Error initializing Transfer Portal Service: ${error}`, "error");
              });
          })
          .catch(err => {
            log(`Error initializing AI blog generator: ${err}`);
          });
      } else {
        log("⚠️ No valid OpenAI API key found. AI features will be limited.");
        log("Please update the API key in the admin panel or set OPENAI_API_KEY environment variable.");
      }
    })
    .catch(error => {
      log(`Error checking OpenAI API key: ${error}`, "error");
    });
})();