const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');
const starpathRoutes = require('./routes/starpath');
const academicRoutes = require('./routes/academic');
const userRoutes = require('./routes/user');

// Middleware
const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/video', authenticateToken, videoRoutes);
app.use('/api/starpath', authenticateToken, starpathRoutes);
app.use('/api/academic', authenticateToken, academicRoutes);
app.use('/api/user', authenticateToken, userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Go4It Sports Platform running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;