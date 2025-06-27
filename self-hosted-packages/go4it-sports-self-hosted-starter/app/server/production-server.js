/**
 * Go4It Sports API Server - Production Entry Point
 * 
 * This file serves as the main entry point for the production API server.
 * It sets up the Express application, database connection, and all API routes.
 * 
 * For deployment to https://go4itsports.org
 */

// Load environment variables
require('dotenv').config();

// Core dependencies
const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const { WebSocketServer } = require('ws');

// Force environment to production
process.env.NODE_ENV = 'production';

console.log('Starting Go4It Sports API server in PRODUCTION mode');
console.log(`Server time: ${new Date().toISOString()}`);

// Create Express application
const app = express();

// Apply production middleware
app.use(compression({
  level: parseInt(process.env.COMPRESSION_LEVEL || '6', 10)
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure CORS for production
const corsOptions = {
  origin: process.env.SITE_URL || 'https://go4itsports.org',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Static files - only serve uploads directory from API server
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '1d',
  immutable: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.1',
    environment: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

// Import routes
const { registerRoutes } = require('./routes');

// Register all API routes
console.log('Initializing API routes...');
const httpServer = registerRoutes(app);

// Create WebSocket server
const wss = new WebSocketServer({ 
  server: httpServer,
  path: '/ws',
  clientTracking: true
});

// WebSocket handling
wss.on('connection', (ws, req) => {
  console.log(`WebSocket client connected: ${req.socket.remoteAddress}`);
  
  ws.isAlive = true;
  
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log(`Received message: ${parsedMessage.type}`);
      
      // Handle different message types
      switch (parsedMessage.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', time: Date.now() }));
          break;
        default:
          // Forward to appropriate handlers based on message type
          break;
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Go4It Sports WebSocket server',
    time: Date.now()
  }));
});

// Keep-alive ping for WebSockets to prevent timeouts
const pingInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('Terminating inactive WebSocket connection');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(pingInterval);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('API error:', err);
  
  res.status(err.status || 500).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'An internal server error occurred'
        : err.message,
      status: err.status || 500
    }
  });
});

// Fallback route handler - let frontend handle routing
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'API endpoint not found',
      status: 404
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Go4It Sports API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}/ws`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
});