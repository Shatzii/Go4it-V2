// Go4It Sports Replit-compatible Startup Script
// This script launches the static server for the standalone version
// designed to work specifically with Replit's workflow system

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 5000;

// Create Express app
const app = express();

// Log startup info
console.log('============================================');
console.log(' Go4It Sports Standalone Server - Starting  ');
console.log('============================================');
console.log('Current directory:', __dirname);
console.log('Checking client directory...');

// Check if client directory exists
const clientDir = path.join(__dirname, 'client');
if (!fs.existsSync(clientDir)) {
  console.log('⚠️ WARNING: Client directory not found at:', clientDir);
} else {
  console.log('✅ Client directory found at:', clientDir);
  
  // Check for index.html in client directory
  const indexPath = path.join(clientDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ Found index.html');
  } else {
    console.log('⚠️ WARNING: index.html not found in client directory');
  }
}

// Middleware for logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from client directory
app.use(express.static(clientDir));

// API routes for authentication
app.get('/api/user', (req, res) => {
  res.json({
    id: 1,
    username: 'alexjohnson',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'athlete'
  });
});

// Create fake data API endpoints
app.get('/api/athlete/stats', (req, res) => {
  res.json({
    garScore: 87,
    recentPerformance: [92, 86, 78, 88, 92, 95],
    trainingHours: 128,
    achievements: 14,
    streak: 22,
    skillLevel: 'Advanced'
  });
});

// Handle all routes by returning index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`🌐 Try accessing: http://localhost:${PORT}`);
  console.log('============================================');
});

// Handle process events for clean shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});