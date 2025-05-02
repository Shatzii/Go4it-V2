/**
 * Go4It Sports Production Server (CommonJS version)
 * 
 * This file is the main entry point for running the Go4It Sports platform in production mode.
 * It handles both the API server and serves the built client files.
 */

// Set environment to production
process.env.NODE_ENV = 'production';

// Load environment variables
require('dotenv').config();

// Load dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');

/**
 * Initialize the database connection
 */
async function initializeDatabase() {
  try {
    // Import asynchronously to support both ESM and CommonJS 
    const { Pool } = require('pg');
    const { drizzle } = require('drizzle-orm/node-postgres');
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
    }
    
    // Configure pool based on environment
    const isProd = process.env.NODE_ENV === 'production';
    const defaultMaxConnections = isProd ? 10 : 20;
    
    const poolConfig = {
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.PG_MAX_CONNECTIONS || String(defaultMaxConnections), 10),
      min: parseInt(process.env.PG_MIN_CONNECTIONS || '2', 10),
      idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || (isProd ? '60000' : '30000'), 10),
      connectionTimeoutMillis: parseInt(process.env.PG_CONNECTION_TIMEOUT || '5000', 10),
      allowExitOnIdle: false
    };
    
    console.log(`Initializing database connection pool: ${process.env.DATABASE_URL.split('@')[1]}`);
    const pool = new Pool(poolConfig);
    
    // Test the connection
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT 1 as connection_test');
      console.log('✅ Database connection successful');
    } finally {
      client.release();
    }
    
    return { pool };
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Initialize the application
 */
async function initialize() {
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
  
  // Initialize database
  try {
    const { pool } = await initializeDatabase();
    
    // Set up auth
    const { setupAuth } = require('./server/auth');
    setupAuth(app);
    
    // Register routes
    const { registerRoutes } = require('./server/routes');
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
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(clientBuildPath, 'index.html'));
      });
    } else {
      console.warn('⚠️ Warning: Client build not found at', clientBuildPath);
      console.warn('⚠️ Run "npm run build" to create the client build');
      
      // Add a simple fallback page
      app.get('*', (req, res, next) => {
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
    
    return httpServer;
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
}

// Start the server
initialize().catch(error => {
  console.error('❌ Fatal error during server initialization:', error);
  process.exit(1);
});