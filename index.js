// Go4It Sports Simple Server
// This server is designed to work with Replit's workflow system
// It serves static files from the client directory

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Handle API requests
app.get('/api/test', (req, res) => {
  res.json({ status: 'success', message: 'API is working' });
});

// Fake auth API for the static site version
app.post('/api/auth/login', express.json(), (req, res) => {
  const { username, password } = req.body;
  
  // Test accounts
  const users = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
    { username: 'coach', password: 'coach123', role: 'coach', name: 'Coach Smith' },
    { username: 'alexjohnson', password: 'password123', role: 'athlete', name: 'Alex Johnson' },
  ];
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Don't send the password back
    const { password, ...userWithoutPassword } = user;
    res.json({ 
      status: 'success', 
      user: userWithoutPassword,
      token: 'fake-jwt-token-' + Math.random().toString(36).substring(2)
    });
  } else {
    res.status(401).json({ status: 'error', message: 'Invalid username or password' });
  }
});

// Always return index.html for any non-file routes so client-side routing works
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'client', 'index.html');
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found: ' + filePath);
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===========================================`);
  console.log(`  Go4It Sports Server Running on Port ${PORT}  `);
  console.log(`===========================================`);
  console.log(`Server started at: ${new Date().toLocaleString()}`);
  console.log(`Open: http://localhost:${PORT}`);
});