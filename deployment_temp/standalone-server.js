// Standalone Express Server for database API
// This avoids any issues with Vite or TypeScript configuration problems

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
  console.log('  GET /api/system/schema');
});