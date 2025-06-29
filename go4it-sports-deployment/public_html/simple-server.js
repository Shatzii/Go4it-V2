// Go4It Sports Simple Server (Extra-Simplified Version)
// This version is optimized to start quickly within Replit's constraints
const express = require('express');
const path = require('path');
const fs = require('fs');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Start timing for metrics
const startTime = Date.now();

// Minimal logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Simple API endpoint for testing
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    mode: 'static',
    uptime: Math.floor((Date.now() - startTime) / 1000) + ' seconds'
  });
});

// Login API endpoint with mock authentication
app.post('/api/auth/login', express.json(), (req, res) => {
  const { username, password } = req.body;
  
  // Pre-defined test accounts
  const users = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
    { username: 'coach', password: 'coach123', role: 'coach', name: 'Coach Smith' },
    { username: 'alexjohnson', password: 'password123', role: 'athlete', name: 'Alex Johnson' }
  ];
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Return user info without password
    const { password, ...userInfo } = user;
    res.json({ 
      success: true, 
      user: userInfo,
      token: 'static-mode-token-' + Date.now()
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server quickly
app.listen(PORT, '0.0.0.0', () => {
  const bootTime = Date.now() - startTime;
  console.log(`╔════════════════════════════════════════════╗`);
  console.log(`║  Go4It Sports Static Server                ║`);
  console.log(`╠════════════════════════════════════════════╣`);
  console.log(`║  Server is running on port: ${PORT}           ║`);
  console.log(`║  Started in: ${bootTime}ms                     ║`);
  console.log(`║  Mode: Static (No Database Required)        ║`);
  console.log(`╚════════════════════════════════════════════╝`);
});