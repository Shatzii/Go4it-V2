// Standalone Express Server for database API
// This avoids any issues with Vite or TypeScript configuration problems

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { detectHighlightsInVideo, generateHighlightCaption, generateHighlightTitle } = require('./server/openai-highlight.cjs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve the HTML frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for videos
const videoFileFilter = (req, file, cb) => {
  // Accept only video files
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

// Create upload middleware
const videoUpload = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB file size limit
  }
});

// Connection to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    const currentTime = result.rows[0].now;
    client.release();
    
    res.json({
      status: 'ok',
      message: 'API server is running',
      databaseConnected: true,
      timestamp: currentTime
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.json({
      status: 'warning',
      message: 'API server is running but database connection failed',
      databaseConnected: false,
      error: error.message
    });
  }
});

// Get videos for user
app.get('/api/videos', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }
    
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM videos WHERE "userId" = $1',
      [userId]
    );
    client.release();
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Get video by ID
app.get('/api/videos/:id', async (req, res) => {
  try {
    const videoId = req.params.id;
    
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM videos WHERE id = $1',
      [videoId]
    );
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Get highlights
app.get('/api/highlights', async (req, res) => {
  try {
    const featured = req.query.featured === 'true';
    const videoId = req.query.videoId;
    const limit = req.query.limit || 10;
    
    let query;
    let params = [];
    
    if (videoId) {
      query = 'SELECT * FROM video_highlights WHERE "videoId" = $1';
      params = [videoId];
    } else if (featured) {
      query = 'SELECT * FROM video_highlights WHERE featured = true ORDER BY id DESC LIMIT $1';
      params = [limit];
    } else {
      // Get homepage highlights
      query = 'SELECT * FROM video_highlights ORDER BY id DESC LIMIT $1';
      params = [limit];
    }
    
    const client = await pool.connect();
    const result = await client.query(query, params);
    client.release();
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching highlights:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Get tables and schema
app.get('/api/system/schema', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Get list of tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    
    // Get schema for each table
    const schemaByTable = {};
    
    for (const table of tables) {
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      
      schemaByTable[table] = columnsResult.rows;
    }
    
    client.release();
    
    res.json({
      tables,
      schema: schemaByTable
    });
  } catch (error) {
    console.error('Error fetching schema:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Get highlight generator configs
app.get('/api/highlight-configs', async (req, res) => {
  try {
    const sportType = req.query.sportType;
    
    let query = 'SELECT * FROM highlight_generator_configs';
    const params = [];
    
    if (sportType) {
      query += ' WHERE "sportType" = $1';
      params.push(sportType);
    }
    
    query += ' ORDER BY id';
    
    const client = await pool.connect();
    const result = await client.query(query, params);
    client.release();
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching highlight configs:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Get active highlight generator configs
app.get('/api/highlight-configs/active', async (req, res) => {
  try {
    const query = 'SELECT * FROM highlight_generator_configs WHERE active = true ORDER BY id';
    
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching active highlight configs:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Upload a video and create entry in database
app.post('/api/videos/upload', videoUpload.single('video'), async (req, res) => {
  try {
    const { title, description, userId, sportType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }
    
    if (!title || !userId) {
      return res.status(400).json({ error: 'Missing required fields: title and userId' });
    }
    
    const filePath = '/uploads/' + req.file.filename;
    
    // Insert into database
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO videos (title, description, "userId", "filePath", "uploadDate", analyzed, "sportType") 
       VALUES ($1, $2, $3, $4, NOW(), false, $5) 
       RETURNING *`,
      [title, description || null, userId, filePath, sportType || null]
    );
    client.release();
    
    const video = result.rows[0];
    
    res.status(201).json({
      message: 'Video uploaded successfully',
      video
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Generate highlights for a video
app.post('/api/videos/:id/generate-highlights', async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    const configId = req.body.configId;
    
    if (!configId) {
      return res.status(400).json({ error: 'Missing configId in request body' });
    }
    
    // Get video details
    const client = await pool.connect();
    
    // Get video
    const videoResult = await client.query(
      'SELECT * FROM videos WHERE id = $1',
      [videoId]
    );
    
    if (videoResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const video = videoResult.rows[0];
    
    // Get config
    const configResult = await client.query(
      'SELECT * FROM highlight_generator_configs WHERE id = $1',
      [configId]
    );
    
    if (configResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: 'Highlight generator config not found' });
    }
    
    const config = configResult.rows[0];
    
    // Create a test frame image if it doesn't exist (for demo purposes)
    const testFramePath = path.join(process.cwd(), 'uploads', 'test-frame.jpg');
    if (!fs.existsSync(testFramePath)) {
      // We'd normally use ffmpeg to extract real frames from the video
      // For demo, we'll just create a placeholder file
      fs.writeFileSync(testFramePath, 'Test image');
    }
    
    // Get the full path to the video
    const videoPath = path.join(process.cwd(), video.filePath.replace('/uploads/', 'uploads/'));
    
    // Generate highlights using OpenAI
    const highlights = await detectHighlightsInVideo(videoPath, {
      sportType: config.sportType,
      highlightCriteria: config.criteria,
      sampleInterval: config.sampleInterval || 5,
      minimumConfidence: config.minimumConfidence || 0.7
    });
    
    // Save highlights to database
    const savedHighlights = [];
    
    for (const highlight of highlights) {
      const caption = await generateHighlightCaption(highlight.description, config.sportType);
      
      const highlightResult = await client.query(
        `INSERT INTO video_highlights (
          "videoId", title, description, "startTime", "endTime", duration,
          "clipPath", "thumbnailPath", tags, "confidenceScore", featured, "aiGenerated", "aiAnalysisNotes"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          videoId,
          caption,
          highlight.description,
          highlight.timestamp,
          highlight.timestamp + highlight.duration,
          highlight.duration,
          null,  // clipPath - would be populated by actual video extraction
          null,  // thumbnailPath - would be populated by thumbnail extraction
          ['auto-generated', config.sportType],  // tags
          highlight.confidence,
          false,  // featured
          true,   // aiGenerated
          JSON.stringify(highlight.reasons)  // aiAnalysisNotes
        ]
      );
      
      savedHighlights.push(highlightResult.rows[0]);
    }
    
    // Mark video as analyzed
    await client.query(
      'UPDATE videos SET analyzed = true WHERE id = $1',
      [videoId]
    );
    
    client.release();
    
    res.json({
      success: true,
      message: `Generated ${savedHighlights.length} highlights`,
      highlights: savedHighlights
    });
  } catch (error) {
    console.error('Error generating highlights:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate highlights',
      details: error.message
    });
  }
});

// Generate a highlight title for a collection of highlights
app.post('/api/highlights/generate-title', async (req, res) => {
  try {
    const { descriptions, athleteName, sportType } = req.body;
    
    if (!descriptions || !Array.isArray(descriptions) || descriptions.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid descriptions array' });
    }
    
    if (!athleteName || !sportType) {
      return res.status(400).json({ error: 'Missing athleteName or sportType' });
    }
    
    const title = await generateHighlightTitle(descriptions, athleteName, sportType);
    
    res.json({
      title,
      athleteName,
      sportType
    });
  } catch (error) {
    console.error('Error generating title:', error);
    res.status(500).json({ error: 'Failed to generate title', details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Standalone API server running on http://0.0.0.0:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /api/health');
  console.log('  GET /api/videos?userId=<id>');
  console.log('  GET /api/videos/:id');
  console.log('  GET /api/highlights?videoId=<id>');
  console.log('  GET /api/highlights?featured=true&limit=10');
  console.log('  GET /api/highlight-configs');
  console.log('  GET /api/highlight-configs/active');
  console.log('  GET /api/system/schema');
  console.log('  POST /api/videos/upload');
  console.log('  POST /api/videos/:id/generate-highlights');
  console.log('  POST /api/highlights/generate-title');
});