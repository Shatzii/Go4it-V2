import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { createSchema } from "./create-schema";
import { storage } from './storage';
import { registerRoutes } from "./routes";

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

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

// Main server startup function
async function startServer() {
  try {
    // Create database schema if needed
    await createSchema();
    console.log("Database schema created successfully");
    
    // Load API keys from database
    try {
      const apiKeys = await storage.getAllActiveApiKeys();
      if (apiKeys && apiKeys.length > 0) {
        console.log(`Loading ${apiKeys.length} API keys from database`);
        
        // Set environment variables from stored API keys
        apiKeys.forEach((key: any) => {
          const keyName = key.keyType.toUpperCase() + '_API_KEY';
          if (key.keyType === 'openai') {
            process.env.OPENAI_API_KEY = key.keyValue;
            console.log('Set OPENAI_API_KEY from database');
          } else if (key.keyType === 'stripe') {
            process.env.STRIPE_SECRET_KEY = key.keyValue;
            console.log('Set STRIPE_SECRET_KEY from database');
          } else if (key.keyType === 'sendgrid') {
            process.env.SENDGRID_API_KEY = key.keyValue;
            console.log('Set SENDGRID_API_KEY from database');
          } else if (key.keyType === 'twilio') {
            process.env.TWILIO_AUTH_TOKEN = key.keyValue;
            console.log('Set TWILIO_AUTH_TOKEN from database');
          } else {
            process.env[keyName] = key.keyValue;
            console.log(`Set ${keyName} from database`);
          }
        });
      } else {
        console.log('No API keys found in database');
      }
    } catch (err) {
      console.error(`Error loading API keys from database: ${err}`);
    }
  } catch (error) {
    console.error(`Error creating database schema: ${error}`);
  }
  
  // Register API routes
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`Error: ${message}`);
    res.status(status).json({ message });
  });

  // Start server on port 3000
  const port = process.env.PORT || 3000;
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    console.log(`API server running on http://0.0.0.0:${port}`);
    console.log(`REST API endpoints available at http://0.0.0.0:${port}/api/...`);
  });
}

// Start the server
startServer().catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});