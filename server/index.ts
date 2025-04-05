import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "fs";
import path from "path";
import { createSchema } from "./create-schema";
import cors from "cors";
import { storage } from './storage';
import { initializeBlogGeneration } from './blog-generator';
import { openAIService } from './services/openai-service';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS middleware to allow cross-origin requests
app.use(cors({
  origin: true, // Allow all origins
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
    
    // Load API keys from database
    try {
      const apiKeys = await storage.getAllActiveApiKeys();
      if (apiKeys && apiKeys.length > 0) {
        log(`Loading ${apiKeys.length} API keys from database`);
        
        // Set environment variables from stored API keys
        apiKeys.forEach((key: any) => {
          const keyName = key.keyType.toUpperCase() + '_API_KEY';
          if (key.keyType === 'openai') {
            process.env.OPENAI_API_KEY = key.keyValue;
            log('Set OPENAI_API_KEY from database');
          } else if (key.keyType === 'stripe') {
            process.env.STRIPE_SECRET_KEY = key.keyValue;
            log('Set STRIPE_SECRET_KEY from database');
          } else if (key.keyType === 'sendgrid') {
            process.env.SENDGRID_API_KEY = key.keyValue;
            log('Set SENDGRID_API_KEY from database');
          } else if (key.keyType === 'twilio') {
            process.env.TWILIO_AUTH_TOKEN = key.keyValue;
            log('Set TWILIO_AUTH_TOKEN from database');
          } else {
            process.env[keyName] = key.keyValue;
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
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const findAvailablePort = async (startPort: number): Promise<number> => {
    return new Promise((resolve) => {
      const server = require('net').createServer();
      server.listen(startPort, '0.0.0.0', () => {
        const port = (server.address() as any).port;
        server.close(() => resolve(port));
      });
      server.on('error', () => {
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
      .then(hasKey => {
        if (hasKey) {
          log("✅ OpenAI API key validated successfully");
          
          // Now initialize the blog generator
          log("Initializing AI blog generator...");
          initializeBlogGeneration()
            .then(() => log("AI blog generator initialized successfully"))
            .catch(err => log(`Error initializing AI blog generator: ${err}`));
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
