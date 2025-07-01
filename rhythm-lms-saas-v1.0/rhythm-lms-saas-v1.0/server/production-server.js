const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();

// Production optimizations
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false // Disable for development, enable in production
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || false,
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// AI Engine status endpoint
app.get('/api/ai/status', (req, res) => {
  res.json({
    connected: true,
    capabilities: [
      'curriculum-generation',
      'lesson-planning', 
      'assessment-creation',
      'neurodivergent-adaptations',
      'compliance-checking'
    ],
    url: 'http://localhost:3030',
    status: 'operational'
  });
});

// API endpoints for educational features
app.get('/api/academic/profiles', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'ADHD Support',
      description: 'Hyperactivity and attention management',
      accommodations: ['movement breaks', 'fidget tools', 'shortened tasks']
    },
    {
      id: 2,
      name: 'Autism Support',
      description: 'Structured learning with visual supports',
      accommodations: ['visual schedules', 'sensory breaks', 'predictable routines']
    },
    {
      id: 3,
      name: 'Dyslexia Support',
      description: 'Reading and writing accommodations',
      accommodations: ['text-to-speech', 'larger fonts', 'audio instructions']
    }
  ]);
});

app.get('/api/students', (req, res) => {
  res.json([]);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../dist');
  app.use(express.static(buildPath));
  
  // Handle React routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // Development fallback
  app.get('*', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rhythm-LMS - Loading</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            text-align: center;
            max-width: 600px;
            padding: 2rem;
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #00d4ff, #ff0080);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .status {
            background: rgba(0, 255, 0, 0.2);
            padding: 1rem;
            border-radius: 5px;
            margin: 1rem 0;
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid #00d4ff;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Rhythm-LMS</h1>
          <div class="status">
            AI Education Platform Loading...
          </div>
          <div class="spinner"></div>
          <p>Self-hosted AI engine initializing...</p>
          <p>Server Status: Operational</p>
        </div>
      </body>
      </html>
    `);
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Production Rhythm-LMS server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server };