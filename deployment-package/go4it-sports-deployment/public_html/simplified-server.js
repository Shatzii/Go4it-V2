// Go4It Sports Simplified Server for Replit
// This server is designed to work with Replit's workflow system
// and avoid database connection issues

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = 5000;

// Configure middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log startup info
console.log('============================================');
console.log(' Go4It Sports Simplified Server - Starting  ');
console.log('============================================');
console.log('Current directory:', __dirname);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));

// API endpoints for demo authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: ${username}`);
  
  // Simple hardcoded auth for the demo
  if ((username === 'alexjohnson' && password === 'password123') ||
      (username === 'admin' && password === 'admin123') ||
      (username === 'coach' && password === 'coach123')) {
    
    const userData = {
      id: 1,
      username,
      name: username === 'alexjohnson' ? 'Alex Johnson' : 
            username === 'admin' ? 'Admin User' : 'Coach Smith',
      email: `${username}@example.com`,
      role: username === 'alexjohnson' ? 'athlete' : 
            username === 'admin' ? 'admin' : 'coach',
    };
    
    res.json({ success: true, user: userData });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  console.log(`Registration attempt: ${req.body.username}`);
  
  // Return success for the demo
  const userData = {
    id: Math.floor(Math.random() * 1000) + 1,
    ...req.body,
    email: req.body.email || `${req.body.username}@example.com`
  };
  
  res.status(201).json({ success: true, user: userData });
});

// Basic user data
app.get('/api/user', (req, res) => {
  res.json({
    id: 1,
    username: 'alexjohnson',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'athlete',
    profileImage: null
  });
});

// Demo data for dashboard
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Standard route handlers for HTML pages
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'auth.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dashboard.html'));
});

// Catch-all route for SPA-style navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server with error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`🌐 Available at http://localhost:${PORT}`);
  console.log('============================================');
});

// Handle shutdown gracefully
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