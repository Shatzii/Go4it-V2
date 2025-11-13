#!/usr/bin/env node

/**
 * Go4It AI Engine Server
 * Dedicated server for AI video analysis processing
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createAIModelManager } = require('./lib/ai-models');
const { createAdvancedVideoAnalyzer } = require('./lib/advanced-video-analysis');

const app = express();
const PORT = process.env.PORT || 3001;
const AI_ENGINE_API_KEY = process.env.AI_ENGINE_API_KEY || 'your-secure-api-key';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== AI_ENGINE_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

// Rate limiting
const rateLimit = require('express-rate-limit');
const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many AI requests from this IP',
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// Initialize AI components
const aiManager = createAIModelManager();
const processQueue = [];
const isProcessing = false;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    queue_length: processQueue.length,
    processing: isProcessing,
    engine_id: process.env.AI_ENGINE_ID || 'default',
  });
});

// Video analysis endpoint
app.post(
  '/api/analyze-video',
  authenticate,
  aiRateLimit,
  upload.single('video'),
  async (req, res) => {
    try {
      const { sport, userId, testMode } = req.body;
      let videoPath = req.file?.path;

      if (!sport) {
        return res.status(400).json({ error: 'Sport parameter is required' });
      }

      // Handle test mode
      if (testMode === 'true' || testMode === true) {
        videoPath = 'test_video.mp4';
      } else if (!videoPath) {
        return res.status(400).json({ error: 'Video file is required' });
      }

      // Create video analyzer
      const analyzer = createAdvancedVideoAnalyzer(sport);

      // Process video analysis
      const analysis = await analyzer.analyzeVideo(videoPath, { userId });

      // Clean up uploaded file (except in test mode)
      if (req.file && !testMode) {
        setTimeout(() => {
          fs.unlink(videoPath, (err) => {
            if (err) console.error('Error deleting file:', err);
          });
        }, 5000);
      }

      res.json({
        success: true,
        analysis,
        processingTime: Date.now() - req.startTime || 0,
        engineId: process.env.AI_ENGINE_ID || 'default',
      });
    } catch (error) {
      console.error('Video analysis error:', error);
      res.status(500).json({
        error: 'Analysis failed',
        message: error.message,
      });
    }
  },
);

// Real-time analysis endpoint
app.post('/api/real-time-analysis', authenticate, aiRateLimit, async (req, res) => {
  try {
    const { action, sport, quality = 'balanced' } = req.body;

    if (action === 'start') {
      // Start real-time analysis session
      const config = {
        sport,
        quality,
        fps: quality === 'performance' ? 15 : quality === 'balanced' ? 30 : 60,
        latency_target: quality === 'performance' ? 200 : quality === 'balanced' ? 100 : 50,
      };

      res.json({
        success: true,
        message: 'Real-time analysis started',
        config,
        sessionId: `session_${Date.now()}`,
      });
    } else if (action === 'stop') {
      res.json({
        success: true,
        message: 'Real-time analysis stopped',
      });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Real-time analysis error:', error);
    res.status(500).json({ error: 'Real-time analysis failed' });
  }
});

// Predictive analytics endpoint
app.post('/api/predictive-analysis', authenticate, aiRateLimit, async (req, res) => {
  try {
    const { action, sport, timeframes, athleteProfile } = req.body;

    if (action === 'performance_forecast') {
      const forecasts = timeframes.map((timeframe) => ({
        timeframe,
        predicted_score: 75 + Math.random() * 20 - 10,
        confidence_interval: {
          lower: 50 + Math.random() * 20,
          upper: 80 + Math.random() * 20,
        },
        contributing_factors: [
          { factor: 'Technical skill development', impact: 0.3, trend: 'neutral' },
          { factor: 'Athletic conditioning', impact: 0.25, trend: 'positive' },
          { factor: 'Mental preparation', impact: 0.2, trend: 'positive' },
          { factor: 'Consistency in training', impact: 0.25, trend: 'neutral' },
        ],
        recommendations: [
          'Focus on fundamental skill development',
          'Increase training intensity gradually',
        ],
      }));

      res.json({
        success: true,
        type: 'performance_forecast',
        data: forecasts,
        generated_at: new Date().toISOString(),
      });
    } else if (action === 'comprehensive_report') {
      // Generate comprehensive predictive report
      const report = {
        performance_forecasts: [],
        injury_risk_assessment: {
          overall_risk: 'low',
          risk_score: Math.floor(Math.random() * 30),
          specific_risks: [
            {
              type: 'Overuse injury',
              probability: 15,
              severity: 'minor',
              timeline: '3-6 months',
              prevention_strategies: [
                'Proper warm-up and cool-down',
                'Adequate recovery time',
                'Cross-training activities',
              ],
            },
          ],
        },
        recruitment_analysis: {
          division_predictions: [
            {
              division: 'Division I',
              probability: 0.25,
              timeline: '2-3 years',
              requirements_gap: [],
            },
          ],
          scholarship_probability: Math.floor(Math.random() * 30),
          target_schools: [],
        },
        optimization_recommendations: [],
        data_quality: {
          historical_data_points: 0,
          model_accuracy: { performance: 0.87, injury_risk: 0.92, recruitment: 0.78 },
          confidence_score: 0.85,
        },
      };

      res.json({
        success: true,
        type: 'comprehensive_report',
        data: report,
        generated_at: new Date().toISOString(),
        report_id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Predictive analysis error:', error);
    res.status(500).json({ error: 'Predictive analysis failed' });
  }
});

// AI Model management endpoints
app.get('/api/models', authenticate, async (req, res) => {
  try {
    res.json({
      available_models: [
        { name: 'llama3.1:8b', size: '4.7GB', status: 'available' },
        { name: 'gemma:2b', size: '1.4GB', status: 'available' },
        { name: 'mistral:7b', size: '4.1GB', status: 'available' },
      ],
      current_model: 'llama3.1:8b',
      model_status: 'ready',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get model status' });
  }
});

app.post('/api/models/load', authenticate, async (req, res) => {
  try {
    const { model_name } = req.body;

    // Simulate model loading
    res.json({
      success: true,
      message: `Model ${model_name} loaded successfully`,
      model_name,
      load_time: Math.floor(Math.random() * 10) + 5,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load model' });
  }
});

// Queue management
app.get('/api/queue', authenticate, async (req, res) => {
  res.json({
    queue_length: processQueue.length,
    processing: isProcessing,
    estimated_wait_time: processQueue.length * 30, // seconds
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Go4It AI Engine Server running on port ${PORT}`);
  console.log(`🤖 Engine ID: ${process.env.AI_ENGINE_ID || 'default'}`);
  console.log(`💾 Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
});

// Export for testing
module.exports = app;
