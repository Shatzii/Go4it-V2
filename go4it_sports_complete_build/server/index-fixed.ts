import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite-wrapper";
import fs from "fs";
import path from "path";
import { createSchema } from "./create-schema";
import cors from "cors";
import { storage } from './storage';
import { initializeBlogGeneration } from './blog-generator';
import { openAIService } from './services/openai-service';
import { transferPortalService } from './services/transfer-portal-service';
import { athleteScoutService } from './services/athlete-scout-service';
import net from 'net';

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

// Function to find a free port
async function findFreePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = (server.address() as net.AddressInfo).port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findFreePort(startPort + 1));
    });
  });
}

// Create schema and start server
createSchema()
  .then(() => {
    // Setup authentication
    import('./auth').then(({ setupAuth }) => {
      setupAuth(app);

      // Register routes
      registerRoutes(app);

      // Create HTTP server
      const http = require('http');
      const server = http.createServer(app);

      // Setup Vite in development mode
      if (process.env.NODE_ENV !== 'production') {
        setupVite(app, server).then(() => {
          log("Vite middleware configured", "express");
        });
      } else {
        // Serve static files in production
        serveStatic(app);
      }

      // Initialize AI blog generation if admin user exists
      try {
        if (process.env.NODE_ENV !== 'test') {
          initializeBlogGeneration();
        }
      } catch (error) {
        log(`Error initializing blog generation: ${error}`, "express");
      }

      // Start server on a free port
      findFreePort(3000).then(port => {
        server.listen(port, '0.0.0.0', () => {
          log(`Server running at http://0.0.0.0:${port}`, "express");
        });
      });
    });
  })
  .catch((error) => {
    log(`Error creating schema: ${error}`, "express");
  });