/**
 * Go4It Engine - Core Implementation
 * Version: 2.0.0
 * 
 * This engine powers the Go4It Sports platform providing advanced analytics,
 * video processing, StarPath progression, and athlete development features.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import http from 'http';

// Load environment variables
config();

// Configure database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// Import cache middleware
import { cache, clearCache, bypassCache } from './middleware/cache-middleware';
import { cacheManager } from './cache-manager';

// Configure middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize cache connection
cacheManager.on('connect', () => {
  console.log('Connected to Redis cache server');
});

cacheManager.on('error', (error) => {
  console.warn(`Redis cache connection error: ${error.message}. Continuing without caching.`);
});

// Configure file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + '-' + uuidv4();
    cb(null, uniquePrefix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB
  },
  fileFilter: (req, file, cb) => {
    // Allow specific video formats
    const allowedFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format'));
    }
  }
});

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

// Subscription tier validation middleware
const validateSubscription = async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    // Get user's subscription tier from database
    const userResult = await pool.query(
      'SELECT subscription_tier FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const subscriptionTier = userResult.rows[0].subscription_tier;
    req.subscriptionTier = subscriptionTier;
    
    next();
  } catch (error) {
    console.error('Error validating subscription:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// API Routes
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GAR Analysis endpoints
app.post('/api/analysis/gar', authenticateJWT, validateSubscription, async (req, res) => {
  try {
    const { data, options } = req.body;
    const { athleteId, videoId } = data;
    const { subscriptionTier } = req;
    
    // Enforce subscription limits
    if (subscriptionTier === 'scout') {
      // Check if user has already reached their analysis limit
      const analysisCount = await pool.query(
        'SELECT COUNT(*) FROM gar_analyses WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'30 days\'',
        [req.user.userId]
      );
      
      if (parseInt(analysisCount.rows[0].count) >= 1) {
        return res.status(403).json({ 
          error: 'Analysis limit reached for Scout tier', 
          subscriptionUpgrade: true 
        });
      }
    } else if (subscriptionTier === 'mvp') {
      const analysisCount = await pool.query(
        'SELECT COUNT(*) FROM gar_analyses WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'30 days\'',
        [req.user.userId]
      );
      
      if (parseInt(analysisCount.rows[0].count) >= 10) {
        return res.status(403).json({ 
          error: 'Analysis limit reached for MVP tier', 
          subscriptionUpgrade: true 
        });
      }
    }
    
    // Mock GAR analysis calculation based on sport type
    // In a real implementation, this would use ML models for analysis
    const sportType = data.sport || 'basketball';
    
    // Calculate mock GAR score
    const garScore = calculateGarScore(sportType, data);
    
    // Store analysis results
    const analysisResult = await pool.query(
      'INSERT INTO gar_analyses (user_id, athlete_id, video_id, sport_type, gar_score, metrics, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id',
      [req.user.userId, athleteId, videoId, sportType, garScore.overall, JSON.stringify(garScore.metrics)]
    );
    
    res.status(200).json({
      id: analysisResult.rows[0].id,
      garScore: garScore.overall,
      metrics: garScore.metrics,
      insights: generateInsights(garScore),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error performing GAR analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// StarPath endpoints
app.post('/api/progression/starpath/:userId', authenticateJWT, validateSubscription, async (req, res) => {
  try {
    const { userId } = req.params;
    const progressData = req.body;
    const { subscriptionTier } = req;
    
    // Check if user is authorized to update this user's StarPath
    if (parseInt(userId) !== req.user.userId && req.user.role !== 'admin' && req.user.role !== 'coach') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Apply subscription-based limitations
    let starPathAccess = 'basic';
    if (subscriptionTier === 'mvp') {
      starPathAccess = 'standard';
    } else if (subscriptionTier === 'allStar') {
      starPathAccess = 'premium';
    }
    
    // Process different aspects of StarPath based on access level
    let response = {
      userId: parseInt(userId),
      timestamp: new Date().toISOString(),
      updates: {}
    };
    
    // Process achievements
    if (progressData.achievements && progressData.achievements.length > 0) {
      await processAchievements(userId, progressData.achievements);
      response.updates.achievements = { processed: progressData.achievements.length };
    }
    
    // Process XP
    if (progressData.xp) {
      const xpResult = await processXP(userId, progressData.xp);
      response.updates.xp = xpResult;
    }
    
    // Process skill levels
    if (progressData.level) {
      const levelResults = await processSkillLevels(userId, progressData.level, starPathAccess);
      response.updates.levels = levelResults;
    }
    
    // For premium tier, process environment-specific progress
    if (starPathAccess === 'premium' && progressData.environment) {
      const environmentResult = await processEnvironment(userId, progressData.environment);
      response.updates.environment = environmentResult;
    }
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating StarPath:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Media processing endpoints
app.post('/api/media/process', authenticateJWT, validateSubscription, upload.single('file'), async (req, res) => {
  try {
    const { subscriptionTier } = req;
    
    // Check video upload limits
    if (subscriptionTier === 'scout') {
      const videoCount = await pool.query(
        'SELECT COUNT(*) FROM videos WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'30 days\'',
        [req.user.userId]
      );
      
      if (parseInt(videoCount.rows[0].count) >= 1) {
        return res.status(403).json({ 
          error: 'Video upload limit reached for Scout tier', 
          subscriptionUpgrade: true 
        });
      }
    } else if (subscriptionTier === 'mvp') {
      const videoCount = await pool.query(
        'SELECT COUNT(*) FROM videos WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'30 days\'',
        [req.user.userId]
      );
      
      if (parseInt(videoCount.rows[0].count) >= 5) {
        return res.status(403).json({ 
          error: 'Video upload limit reached for MVP tier', 
          subscriptionUpgrade: true 
        });
      }
    }
    
    // Process the uploaded file
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Extract athlete info from request
    const athleteInfo = JSON.parse(req.body.athlete || '{}');
    
    // Store video information in database
    const videoResult = await pool.query(
      'INSERT INTO videos (user_id, filename, filepath, filesize, athlete_id, sport, position, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id',
      [
        req.user.userId,
        file.originalname,
        file.path,
        file.size,
        athleteInfo.id || null,
        athleteInfo.sport || null,
        athleteInfo.position || null
      ]
    );
    
    const videoId = videoResult.rows[0].id;
    
    // Determine which processing options are available based on subscription
    let processingOptions = ['basic_analysis'];
    if (subscriptionTier === 'mvp') {
      processingOptions.push('highlight_generation');
    } else if (subscriptionTier === 'allStar') {
      processingOptions = ['basic_analysis', 'highlight_generation', 'body_tracking', 'performance_extraction', 'sport_specific_metrics'];
    }
    
    // Start async processing
    // In a real implementation, this would trigger a background job
    processVideo(videoId, file.path, processingOptions);
    
    res.status(200).json({
      videoId,
      status: 'processing',
      processingOptions,
      estimatedCompletionTime: new Date(Date.now() + 10 * 60 * 1000).toISOString() // Mock 10 min processing
    });
  } catch (error) {
    console.error('Error processing media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Academic endpoints
app.get('/api/academics/:userId', authenticateJWT, cache({ ttl: 3600 }), async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is authorized to access this user's academic data
    if (parseInt(userId) !== req.user.userId && req.user.role !== 'admin' && req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Get academic data
    const academicResult = await pool.query(
      `SELECT 
        a.id, a.user_id, a.gpa, a.weighted_gpa, a.class_rank, a.class_size, a.sat_score, a.act_score,
        a.graduation_year, a.school_id, s.name as school_name, s.city, s.state
      FROM 
        academics a
      LEFT JOIN 
        schools s ON a.school_id = s.id
      WHERE 
        a.user_id = $1`,
      [userId]
    );
    
    if (academicResult.rows.length === 0) {
      return res.status(404).json({ error: 'Academic data not found' });
    }
    
    // Get courses
    const coursesResult = await pool.query(
      `SELECT 
        c.id, c.academic_id, c.name, c.grade, c.credits, c.is_ap, c.is_honors, c.is_core, c.semester, c.year
      FROM 
        courses c
      INNER JOIN 
        academics a ON c.academic_id = a.id
      WHERE 
        a.user_id = $1
      ORDER BY 
        c.year DESC, c.semester DESC`,
      [userId]
    );
    
    // Check NCAA eligibility
    const eligibilityResult = await checkNcaaEligibility(academicResult.rows[0], coursesResult.rows);
    
    res.status(200).json({
      academic: academicResult.rows[0],
      courses: coursesResult.rows,
      eligibility: eligibilityResult
    });
  } catch (error) {
    console.error('Error fetching academic data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Recommendations endpoints
app.get('/api/recommendations/:userId', authenticateJWT, validateSubscription, cache({ ttl: 1800 }), async (req, res) => {
  try {
    const { userId } = req.params;
    const context = req.query;
    const { subscriptionTier } = req;
    
    // Check if user is authorized to access this user's recommendations
    if (parseInt(userId) !== req.user.userId && req.user.role !== 'admin' && req.user.role !== 'coach') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Get user information
    const userResult = await pool.query(
      'SELECT id, username, age, primary_sport, secondary_sport FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // Get performance data
    const performanceResult = await pool.query(
      'SELECT * FROM gar_analyses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );
    
    // Generate recommendations based on subscription tier
    let recommendations = {
      training: [],
      skill: [],
      college: [],
      performance: []
    };
    
    // Training plan recommendations (available to all tiers)
    recommendations.training = generateTrainingRecommendations(user, performanceResult.rows);
    
    // Skill development (available to MVP and All-Star)
    if (subscriptionTier === 'mvp' || subscriptionTier === 'allStar') {
      recommendations.skill = generateSkillRecommendations(user, performanceResult.rows);
    }
    
    // College matching (available to All-Star only)
    if (subscriptionTier === 'allStar' && context.includeColleges === 'true') {
      recommendations.college = await generateCollegeRecommendations(user, performanceResult.rows);
    }
    
    // Performance improvement (available to All-Star only)
    if (subscriptionTier === 'allStar') {
      recommendations.performance = generatePerformanceRecommendations(user, performanceResult.rows);
    }
    
    res.status(200).json({
      userId: parseInt(userId),
      timestamp: new Date().toISOString(),
      recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Coaching endpoints
app.post('/api/coaching/:userId/feedback', authenticateJWT, validateSubscription, async (req, res) => {
  try {
    const { userId } = req.params;
    const performanceData = req.body;
    const { subscriptionTier } = req;
    
    // Check if user is authorized to get coaching for this user
    if (parseInt(userId) !== req.user.userId && req.user.role !== 'admin' && req.user.role !== 'coach') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // AI coaching is only available for MVP and All-Star tiers
    if (subscriptionTier === 'scout') {
      return res.status(403).json({
        error: 'AI Coaching is not available on Scout tier',
        subscriptionUpgrade: true
      });
    }
    
    // Get user information
    const userResult = await pool.query(
      'SELECT id, username, age, primary_sport, secondary_sport FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // Generate AI coaching feedback
    const feedback = generateCoachingFeedback(user, performanceData, subscriptionTier);
    
    // For All-Star tier, provide more detailed analysis
    if (subscriptionTier === 'allStar') {
      // Additional detailed analysis would be done here
      feedback.detailedAnalysis = generateDetailedAnalysis(performanceData);
      feedback.personalizedDrills = generatePersonalizedDrills(user, performanceData);
      feedback.videoAnnotations = generateVideoAnnotations(performanceData);
    }
    
    res.status(200).json({
      userId: parseInt(userId),
      timestamp: new Date().toISOString(),
      feedback
    });
  } catch (error) {
    console.error('Error generating coaching feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook registration endpoint
app.post('/api/webhooks/register', authenticateJWT, async (req, res) => {
  try {
    const { event, callbackUrl } = req.body;
    
    if (!event || !callbackUrl) {
      return res.status(400).json({ error: 'Event and callbackUrl are required' });
    }
    
    // Store webhook registration
    const webhookResult = await pool.query(
      'INSERT INTO webhooks (user_id, event, callback_url, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
      [req.user.userId, event, callbackUrl]
    );
    
    res.status(201).json({
      id: webhookResult.rows[0].id,
      event,
      callbackUrl,
      status: 'registered'
    });
  } catch (error) {
    console.error('Error registering webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Access validation endpoint
app.post('/api/access/validate', authenticateJWT, async (req, res) => {
  try {
    const { userId, feature } = req.body;
    
    // Check if user is authorized to validate access for this user
    if (parseInt(userId) !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Get user's subscription tier
    const userResult = await pool.query(
      'SELECT subscription_tier FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const subscriptionTier = userResult.rows[0].subscription_tier;
    
    // Determine if user has access to feature
    const hasAccess = checkFeatureAccess(subscriptionTier, feature);
    
    res.status(200).json({
      userId: parseInt(userId),
      feature,
      hasAccess,
      subscriptionTier
    });
  } catch (error) {
    console.error('Error validating access:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WebSocket handling
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'auth') {
        // Authenticate WebSocket connection
        try {
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET || 'default-secret');
          ws.userId = decoded.userId;
          ws.role = decoded.role;
          ws.send(JSON.stringify({ type: 'auth', status: 'success' }));
        } catch (error) {
          ws.send(JSON.stringify({ type: 'auth', status: 'error', error: 'Invalid token' }));
        }
      } else if (ws.userId) {
        // Handle authenticated messages
        switch (data.type) {
          case 'subscribe':
            ws.subscriptions = ws.subscriptions || [];
            ws.subscriptions.push(data.channel);
            ws.send(JSON.stringify({ type: 'subscribe', status: 'success', channel: data.channel }));
            break;
            
          case 'unsubscribe':
            if (ws.subscriptions) {
              ws.subscriptions = ws.subscriptions.filter(channel => channel !== data.channel);
              ws.send(JSON.stringify({ type: 'unsubscribe', status: 'success', channel: data.channel }));
            }
            break;
            
          default:
            ws.send(JSON.stringify({ type: 'error', error: 'Unknown message type' }));
        }
      } else {
        ws.send(JSON.stringify({ type: 'error', error: 'Not authenticated' }));
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      ws.send(JSON.stringify({ type: 'error', error: 'Invalid message format' }));
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Helper functions
function calculateGarScore(sportType, data) {
  // This is a simplified mock implementation
  // In a real system, this would use ML models trained on athlete performance
  const baseMetrics = {
    athleticism: Math.random() * 10,
    technique: Math.random() * 10,
    gameIQ: Math.random() * 10,
    consistency: Math.random() * 10,
    leadership: Math.random() * 10,
  };
  
  // Add sport-specific metrics
  let sportMetrics = {};
  switch (sportType) {
    case 'basketball':
      sportMetrics = {
        shooting: Math.random() * 10,
        ballHandling: Math.random() * 10,
        passing: Math.random() * 10,
        defense: Math.random() * 10,
        rebounding: Math.random() * 10,
      };
      break;
    case 'football':
      sportMetrics = {
        strength: Math.random() * 10,
        speed: Math.random() * 10,
        agility: Math.random() * 10,
        fieldVision: Math.random() * 10,
        tackling: Math.random() * 10,
      };
      break;
    // Add more sports as needed
  }
  
  const metrics = { ...baseMetrics, ...sportMetrics };
  
  // Calculate overall score (weighted average)
  const values = Object.values(metrics);
  const overall = values.reduce((sum, value) => sum + value, 0) / values.length;
  
  return {
    overall: parseFloat(overall.toFixed(2)),
    metrics
  };
}

function generateInsights(garScore) {
  // Mock function to generate insights based on GAR score
  const metrics = garScore.metrics;
  const insights = [];
  
  // Find strengths (top 2 metrics)
  const sortedStrengths = Object.entries(metrics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  
  sortedStrengths.forEach(([key, value]) => {
    insights.push({
      type: 'strength',
      area: key,
      description: `Your ${key} is exceptional at ${value.toFixed(1)}/10. Continue to build on this strength.`
    });
  });
  
  // Find areas for improvement (bottom 2 metrics)
  const sortedWeaknesses = Object.entries(metrics)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2);
  
  sortedWeaknesses.forEach(([key, value]) => {
    insights.push({
      type: 'improvement',
      area: key,
      description: `Your ${key} could use improvement at ${value.toFixed(1)}/10. Focus on specific drills to enhance this area.`
    });
  });
  
  // Add overall assessment
  if (garScore.overall >= 8) {
    insights.push({
      type: 'assessment',
      area: 'overall',
      description: `Your overall GAR score of ${garScore.overall} is excellent. You're performing at an elite level.`
    });
  } else if (garScore.overall >= 6) {
    insights.push({
      type: 'assessment',
      area: 'overall',
      description: `Your overall GAR score of ${garScore.overall} is good. You're showing solid potential.`
    });
  } else {
    insights.push({
      type: 'assessment',
      area: 'overall',
      description: `Your overall GAR score of ${garScore.overall} shows room for growth. Focus on foundational skills.`
    });
  }
  
  return insights;
}

async function processAchievements(userId, achievements) {
  // Process achievements and store them in the database
  for (const achievement of achievements) {
    await pool.query(
      'INSERT INTO achievements (user_id, name, description, earned_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (user_id, name) DO NOTHING',
      [userId, achievement, `Earned ${achievement} achievement`]
    );
  }
  
  return true;
}

async function processXP(userId, xp) {
  // Get current XP
  const xpResult = await pool.query(
    'SELECT xp, level FROM user_progression WHERE user_id = $1',
    [userId]
  );
  
  let currentXP = 0;
  let currentLevel = 1;
  
  if (xpResult.rows.length > 0) {
    currentXP = xpResult.rows[0].xp;
    currentLevel = xpResult.rows[0].level;
  }
  
  // Calculate new XP and level
  const newXP = currentXP + xp;
  
  // Calculate level based on XP (simplified formula)
  const xpPerLevel = 1000;
  const newLevel = Math.floor(newXP / xpPerLevel) + 1;
  
  // Update or insert progression
  if (xpResult.rows.length > 0) {
    await pool.query(
      'UPDATE user_progression SET xp = $1, level = $2, updated_at = NOW() WHERE user_id = $3',
      [newXP, newLevel, userId]
    );
  } else {
    await pool.query(
      'INSERT INTO user_progression (user_id, xp, level, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
      [userId, newXP, newLevel]
    );
  }
  
  return {
    previousXP: currentXP,
    addedXP: xp,
    newXP,
    previousLevel: currentLevel,
    newLevel,
    levelUp: newLevel > currentLevel
  };
}

async function processSkillLevels(userId, levels, accessLevel) {
  const results = {};
  
  // Process each skill level
  for (const [skill, level] of Object.entries(levels)) {
    // Check if skill is allowed for this access level
    if (accessLevel === 'basic' && !isBasicSkill(skill)) {
      continue;
    }
    
    // Store skill level
    await pool.query(
      `INSERT INTO skill_levels (user_id, skill_name, level, updated_at) 
       VALUES ($1, $2, $3, NOW()) 
       ON CONFLICT (user_id, skill_name) 
       DO UPDATE SET level = $3, updated_at = NOW()`,
      [userId, skill, level]
    );
    
    results[skill] = { level };
  }
  
  return results;
}

function isBasicSkill(skill) {
  // Define which skills are available in basic tier
  const basicSkills = ['shooting', 'passing', 'dribbling', 'defense', 'strength', 'speed', 'agility'];
  return basicSkills.includes(skill);
}

async function processEnvironment(userId, environmentData) {
  // Process environment-specific progress (only for premium tier)
  const { environment, progress } = environmentData;
  
  // Check if environment is valid
  const validEnvironments = ['field', 'weight_room', 'locker_room'];
  if (!validEnvironments.includes(environment)) {
    throw new Error('Invalid environment');
  }
  
  // Store environment progress
  await pool.query(
    `INSERT INTO environment_progress (user_id, environment, progress, updated_at) 
     VALUES ($1, $2, $3, NOW()) 
     ON CONFLICT (user_id, environment) 
     DO UPDATE SET progress = $3, updated_at = NOW()`,
    [userId, environment, JSON.stringify(progress)]
  );
  
  return {
    environment,
    updated: true
  };
}

async function processVideo(videoId, filePath, processingOptions) {
  // In a real implementation, this would spawn a background job
  console.log(`Processing video ${videoId} with options: ${processingOptions.join(', ')}`);
  
  // Simulate processing time
  setTimeout(async () => {
    // Update video status
    await pool.query(
      'UPDATE videos SET status = $1, processed_at = NOW() WHERE id = $2',
      ['processed', videoId]
    );
    
    console.log(`Video ${videoId} processing completed`);
  }, 5000); // 5 seconds for demo purposes
}

async function checkNcaaEligibility(academic, courses) {
  // This is a simplified mock implementation of NCAA eligibility rules
  // In a real system, this would implement the actual NCAA requirements
  
  // Check GPA requirement
  const gpaRequirement = 2.3;
  const meetsGpaRequirement = academic.gpa >= gpaRequirement;
  
  // Check core courses requirement
  const coreCoursesRequired = 16;
  const coreCourses = courses.filter(course => course.is_core);
  const meetsCoreCoursesRequirement = coreCourses.length >= coreCoursesRequired;
  
  // Check SAT/ACT requirement (simplified)
  const satRequirement = 900;
  const actRequirement = 18;
  const meetsSatActRequirement = (academic.sat_score && academic.sat_score >= satRequirement) || 
                               (academic.act_score && academic.act_score >= actRequirement);
  
  // Overall eligibility
  const isEligible = meetsGpaRequirement && meetsCoreCoursesRequirement && meetsSatActRequirement;
  
  return {
    isEligible,
    gpa: {
      required: gpaRequirement,
      actual: academic.gpa,
      meets: meetsGpaRequirement
    },
    coreCourses: {
      required: coreCoursesRequired,
      actual: coreCourses.length,
      meets: meetsCoreCoursesRequirement
    },
    satAct: {
      satRequired: satRequirement,
      actRequired: actRequirement,
      satActual: academic.sat_score,
      actActual: academic.act_score,
      meets: meetsSatActRequirement
    }
  };
}

function generateTrainingRecommendations(user, performances) {
  // Mock function to generate training recommendations
  return [
    {
      type: 'endurance',
      title: 'Improve cardiovascular endurance',
      description: 'Add 20 minutes of interval training 3 times per week',
      difficulty: 'moderate'
    },
    {
      type: 'skill',
      title: `Focus on ${user.primary_sport} fundamentals`,
      description: 'Practice basic techniques for 30 minutes daily',
      difficulty: 'easy'
    },
    {
      type: 'strength',
      title: 'Build core strength',
      description: 'Complete the recommended core workout twice weekly',
      difficulty: 'moderate'
    }
  ];
}

function generateSkillRecommendations(user, performances) {
  // Mock function to generate skill development recommendations
  return [
    {
      skill: 'technique',
      drills: [
        {
          name: 'Precision Passing',
          description: 'Practice accurate passing with a partner',
          frequency: '3x weekly',
          duration: '15 minutes'
        },
        {
          name: 'Footwork Ladder',
          description: 'Complete footwork ladder drills',
          frequency: '2x weekly',
          duration: '10 minutes'
        }
      ]
    },
    {
      skill: 'game awareness',
      drills: [
        {
          name: 'Film Study',
          description: 'Analyze professional games',
          frequency: '1x weekly',
          duration: '30 minutes'
        },
        {
          name: 'Situational Scrimmage',
          description: 'Practice specific game situations',
          frequency: '1x weekly',
          duration: '45 minutes'
        }
      ]
    }
  ];
}

async function generateCollegeRecommendations(user, performances) {
  // Mock function to generate college recommendations
  // In a real implementation, this would query a college database
  return [
    {
      name: 'State University',
      division: 'NCAA D1',
      match: 85,
      strengths: ['Strong academic program', 'Competitive team', 'Scholarship opportunities'],
      requirements: {
        gpa: 3.2,
        sat: 1100
      }
    },
    {
      name: 'Metro College',
      division: 'NCAA D2',
      match: 92,
      strengths: ['Excellent coaching staff', 'Playing time opportunities', 'Urban campus'],
      requirements: {
        gpa: 2.8,
        sat: 950
      }
    },
    {
      name: 'Coastal Institute',
      division: 'NCAA D3',
      match: 78,
      strengths: ['Academic focus', 'Beautiful campus', 'Balanced student life'],
      requirements: {
        gpa: 3.0,
        sat: 1050
      }
    }
  ];
}

function generatePerformanceRecommendations(user, performances) {
  // Mock function to generate performance improvement recommendations
  return [
    {
      area: 'technique',
      current: 7.2,
      target: 8.5,
      plan: 'Focus on proper form in all drills',
      timeframe: '3 months'
    },
    {
      area: 'strength',
      current: 6.8,
      target: 8.0,
      plan: 'Progressive overload weight training',
      timeframe: '6 months'
    },
    {
      area: 'endurance',
      current: 8.1,
      target: 9.0,
      plan: 'Increase interval training intensity',
      timeframe: '2 months'
    }
  ];
}

function generateCoachingFeedback(user, performanceData, subscriptionTier) {
  // Mock function to generate AI coaching feedback
  const feedback = {
    summary: `Based on your recent performance, you're showing good progress in ${user.primary_sport}. Continue focusing on fundamentals while gradually increasing intensity.`,
    strengths: [
      {
        area: 'technique',
        description: 'Your form has improved significantly'
      },
      {
        area: 'consistency',
        description: 'You're maintaining performance throughout games/matches'
      }
    ],
    improvements: [
      {
        area: 'decision making',
        description: 'Work on reading situations faster',
        drill: 'Situational practice with limited time'
      },
      {
        area: 'communication',
        description: 'Be more vocal with teammates',
        drill: 'Active communication drills during practice'
      }
    ],
    nextSteps: 'Focus on decision-making drills this week, then reassess performance'
  };
  
  return feedback;
}

function generateDetailedAnalysis(performanceData) {
  // Mock function to generate detailed analysis (for All-Star tier)
  return {
    technicalBreakdown: {
      biomechanics: 'Your body positioning shows good alignment during movement',
      efficiencyScore: 8.2,
      comparisonToIdeal: 'Close to ideal form with minor adjustments needed'
    },
    tacticalAnalysis: {
      decisionMaking: 'Your decision speed has improved but accuracy could be better',
      situationalAwareness: 'You recognize opportunities well but sometimes hesitate to exploit them',
      teamPositioning: 'Good spacing and movement relative to teammates'
    },
    trends: {
      improvements: ['First step quickness', 'Recovery positioning', 'Shooting form'],
      concerns: ['Fatigue management late in games', 'Defensive stance consistency']
    }
  };
}

function generatePersonalizedDrills(user, performanceData) {
  // Mock function to generate personalized drills (for All-Star tier)
  return [
    {
      name: 'Quick Decision Passing',
      focus: 'Decision making under pressure',
      description: 'Quick passing drill with progressively reducing time windows',
      sets: 3,
      repetitions: 12,
      restPeriod: '30 seconds between sets',
      expectedOutcome: 'Faster decision making with maintained accuracy'
    },
    {
      name: 'Reactive Positioning',
      focus: 'Defensive awareness',
      description: 'React to unpredictable offensive movements with proper positioning',
      sets: 4,
      repetitions: 8,
      restPeriod: '45 seconds between sets',
      expectedOutcome: 'Improved anticipation and positioning'
    },
    {
      name: 'Endurance Technique Maintenance',
      focus: 'Technique consistency when fatigued',
      description: 'Perform technical skills after cardiovascular fatigue elements',
      sets: 2,
      repetitions: 10,
      restPeriod: '1 minute between sets',
      expectedOutcome: 'Better technique preservation during late-game situations'
    }
  ];
}

function generateVideoAnnotations(performanceData) {
  // Mock function to generate video annotations (for All-Star tier)
  return [
    {
      timestamp: '00:23',
      description: 'Excellent defensive stance and positioning',
      category: 'strength',
      relatedSkill: 'defense'
    },
    {
      timestamp: '01:45',
      description: 'Body positioning could be lower for better balance',
      category: 'improvement',
      relatedSkill: 'balance'
    },
    {
      timestamp: '03:12',
      description: 'Great anticipation of opponent's movement',
      category: 'strength',
      relatedSkill: 'gameIQ'
    },
    {
      timestamp: '05:38',
      description: 'Quick decision but pass could be more accurate',
      category: 'improvement',
      relatedSkill: 'passing'
    }
  ];
}

function checkFeatureAccess(subscriptionTier, feature) {
  // Define feature access by subscription tier
  const featureAccess = {
    scout: [
      'basic_gar_analysis',
      'single_video_upload',
      'basic_messaging',
      'basic_starpath',
      'community_forum'
    ],
    mvp: [
      'basic_gar_analysis',
      'enhanced_gar_analysis',
      'multiple_video_upload',
      'highlight_generation',
      'basic_messaging',
      'priority_messaging',
      'interactive_starpath',
      'skill_tree',
      'basic_badges',
      'weekly_challenges',
      'academic_tracking',
      'community_forum'
    ],
    allStar: [
      'basic_gar_analysis',
      'enhanced_gar_analysis',
      'advanced_gar_analysis',
      'unlimited_video_upload',
      'highlight_generation',
      'performance_comparison',
      'basic_messaging',
      'priority_messaging',
      'coach_direct_messaging',
      'interactive_starpath',
      'premium_starpath',
      'skill_tree',
      'all_environments',
      'advanced_badges',
      'daily_challenges',
      'ai_coaching',
      'academic_tracking',
      'eligibility_monitoring',
      'college_recruitment',
      'combine_tracking',
      'community_forum'
    ]
  };
  
  return featureAccess[subscriptionTier]?.includes(feature) || false;
}

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Go4It Engine running on port ${PORT}`);
});

// Export for testing
module.exports = { app, server };