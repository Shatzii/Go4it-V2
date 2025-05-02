/**
 * Go4It Sports Production Server
 * 
 * This file is the main entry point for running the Go4It Sports platform in production mode.
 * It handles both the API server and serves the built client files.
 */

// Set environment to production
process.env.NODE_ENV = 'production';

// Load environment variables
import 'dotenv/config';

// Load dependencies
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { registerRoutes } from './server/routes.js';
import { setupAuth } from './server/auth.js';
import { pool } from './server/db.js';
import { registerAIEngineRoutes } from './server/routes/ai-engine-routes.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Add production middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Set up auth
setupAuth(app);

// Register API routes
const router = express.Router();
registerAIEngineRoutes(router);
app.use('/api', router);

// Create and start the HTTP server
const startServer = async () => {
  try {
    // Register routes and get the HTTP server
    const httpServer = await registerRoutes(app);
    
    // Check for client build
    const clientBuildPath = path.join(__dirname, 'client/dist');
    const clientBuildExists = fs.existsSync(clientBuildPath);
    
    if (clientBuildExists) {
      console.log('📦 Client build found, serving static files');
      
      // Serve static files
      app.use(express.static(clientBuildPath));
      
      // Serve index.html for any other routes (SPA support)
      app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
      });
    } else {
      console.warn('⚠️ Warning: Client build not found at', clientBuildPath);
      console.warn('⚠️ Run "npm run build" to create the client build');
      
      // Add a simple fallback page
      app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) return next();
        res.send(`
          <html>
            <head><title>Go4It Sports - API Only Mode</title></head>
            <body style="font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto;">
              <h1>Go4It Sports - API Only Mode</h1>
              <p>The server is running in API-only mode. Client build not found.</p>
              <p>Please run "npm run build" to create the client build.</p>
            </body>
          </html>
        `);
      });
    }
    
    // Start the server
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Go4It Sports server started in ${process.env.NODE_ENV} mode`);
      console.log(`🌐 Server listening on port ${PORT}`);
      console.log(`📅 Server started at ${new Date().toISOString()}`);
    });
    
    // Handle graceful shutdown
    const shutdown = async () => {
      console.log('🛑 Shutting down server...');
      
      // Close HTTP server
      httpServer.close(async () => {
        console.log('✅ HTTP server closed');
        
        // Close database connections
        try {
          await pool.end();
          console.log('✅ Database connections closed');
        } catch (err) {
          console.error('❌ Error closing database connections:', err);
        }
        
        console.log('👋 Server shutdown complete');
        process.exit(0);
      });
      
      // Force exit after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        console.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    // Listen for shutdown signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
startServer();