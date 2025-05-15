// Simplified Go4It Sports Server
// This server only serves static files from the client directory
// and doesn't depend on database connections

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Set up basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Special route handling for auth and dashboard
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'auth.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dashboard.html'));
});

// Basic API endpoints for mock data (for demo purposes)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple hardcoded authentication
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
  // Just return success for demo purposes
  const userData = {
    id: 1,
    ...req.body,
    email: req.body.email || `${req.body.username}@example.com`
  };
  
  res.status(201).json({ success: true, user: userData });
});

app.get('/api/user', (req, res) => {
  // Demo user data
  res.json({
    id: 1,
    username: 'alexjohnson',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'athlete',
    profileImage: null
  });
});

// Catch-all route to serve the main index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] Go4It Sports simplified server running on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] Available pages: /, /auth, /dashboard`);
});