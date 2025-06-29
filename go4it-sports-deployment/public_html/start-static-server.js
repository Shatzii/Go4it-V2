// Go4It Sports Static Server
// This is a minimal server that serves the static HTML files
// without requiring database connection

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Setup basic environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// Create Express app
const app = express();

// Logging for debugging
console.log('============================================');
console.log('    Go4It Sports Static Server Starting     ');
console.log('============================================');
console.log('Current directory:', __dirname);
console.log('Checking for client files...');

// Check if client directory and files exist
const clientDir = path.join(__dirname, 'client');
if (!fs.existsSync(clientDir)) {
  console.error('⚠️ Client directory not found!');
} else {
  const indexFile = path.join(clientDir, 'index.html');
  const authFile = path.join(clientDir, 'auth.html');
  const dashboardFile = path.join(clientDir, 'dashboard.html');
  
  console.log('- Client directory found at:', clientDir);
  console.log('- index.html exists:', fs.existsSync(indexFile));
  console.log('- auth.html exists:', fs.existsSync(authFile));
  console.log('- dashboard.html exists:', fs.existsSync(dashboardFile));
}

// Simple request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));

// API endpoint for demo health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Demo API for user authentication (no database required)
app.post('/api/auth/login', express.json(), (req, res) => {
  const { username, password } = req.body;
  
  // Simple hardcoded credentials for demo
  if ((username === 'alexjohnson' && password === 'password123') ||
      (username === 'admin' && password === 'admin123') ||
      (username === 'coach' && password === 'coach123')) {
    
    const userData = {
      id: 1,
      username,
      name: username === 'alexjohnson' ? 'Alex Johnson' : 
            username === 'admin' ? 'Admin User' : 'Coach Smith',
      role: username === 'alexjohnson' ? 'athlete' : 
            username === 'admin' ? 'admin' : 'coach',
    };
    
    res.json({ success: true, user: userData });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials'
    });
  }
});

// Route handlers for specific pages
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'auth.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dashboard.html'));
});

// Catch-all route returns index.html for SPA-style navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Try opening: http://localhost:${PORT}`);
  console.log('============================================');
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing server');
  server.close(() => console.log('Server closed'));
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing server');
  server.close(() => console.log('Server closed'));
});