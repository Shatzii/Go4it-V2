// Simple Express server to test database connection
const express = require('express');
const { db } = require('./server/db.fixed.ts');
const { sql } = require('drizzle-orm');

const app = express();
const port = 3001;

app.get('/', async (req, res) => {
  try {
    // Test the database connection
    const result = await db.execute(sql`SELECT current_timestamp as time`);
    
    res.json({
      message: 'Server is running!',
      databaseConnection: 'Connected',
      time: result.rows[0].time,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'not set',
        databaseUrl: process.env.DATABASE_URL ? 'Available (hidden)' : 'Not available',
        openaiKey: process.env.OPENAI_API_KEY ? 'Available (hidden)' : 'Not available'
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    res.status(500).json({
      message: 'Server is running but database connection failed',
      error: error.message,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'not set',
        databaseUrl: process.env.DATABASE_URL ? 'Available (hidden)' : 'Not available',
        openaiKey: process.env.OPENAI_API_KEY ? 'Available (hidden)' : 'Not available'
      }
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Simple test server running at http://0.0.0.0:${port}`);
});