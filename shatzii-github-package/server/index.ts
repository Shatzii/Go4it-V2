import express, { type Request, Response, NextFunction } from "express";
import cors from 'cors';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// Temporarily comment out until security middleware is complete
// import { corsOptions, errorHandler, requestLogger } from "./middleware/security";
import { performanceMonitor } from "./monitoring/performance-monitor";
import { engineManager } from "./ai-engines/engine-manager";
import { aiWebSocketServer } from "./ai-engines/websocket-server";
import { investorAgent } from "./ai-engines/investor-acquisition-agent";
import { revenueOptimizer } from "./ai-engines/revenue-optimization-engine";

const app = express();

// Apply CORS with proper configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://shatzii.com', 'https://www.shatzii.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Performance monitoring middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const isError = res.statusCode >= 400;
    performanceMonitor.recordRequest(duration, isError);
  });
  next();
});

// Request logging is handled by requestLogger middleware

(async () => {
  const server = await registerRoutes(app);
  
  // Initialize WebSocket server for real-time AI updates
  aiWebSocketServer.initialize(server);
  
  // Start AI engines
  try {
    await engineManager.start();
    log("AI engines started successfully");
  } catch (error) {
    console.error("Failed to start AI engines:", error);
  }

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
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
