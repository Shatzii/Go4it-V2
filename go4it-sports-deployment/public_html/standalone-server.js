// Go4It Sports Standalone Server
// This simplified server avoids database issues by serving static HTML files
// with client-side authentication handling through localStorage

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';

// Setup basic server infrastructure
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Configure middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));

// Route handlers for specific HTML pages
app.get('/auth', (req, res) => {
  console.log("Serving auth.html");
  res.sendFile(path.join(__dirname, 'client', 'auth.html'));
});

app.get('/dashboard', (req, res) => {
  console.log("Serving dashboard.html");
  res.sendFile(path.join(__dirname, 'client', 'dashboard.html'));
});

// Basic API endpoints for authentication (for demo purposes)
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
  
  // Just return success for the demo
  const userData = {
    id: Math.floor(Math.random() * 1000) + 1,
    ...req.body,
    email: req.body.email || `${req.body.username}@example.com`
  };
  
  res.status(201).json({ success: true, user: userData });
});

app.get('/api/user', (req, res) => {
  // Demo user data
  console.log("User data requested");
  res.json({
    id: 1,
    username: 'alexjohnson',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'athlete',
    profileImage: null
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Catch-all route for the main index
app.get('*', (req, res) => {
  console.log(`Serving index.html for path: ${req.path}`);
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] Go4It Sports standalone server running on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] Available pages: /, /auth, /dashboard`);
  console.log(`[${new Date().toISOString()}] API endpoints: /api/auth/login, /api/auth/register, /api/user`);
});