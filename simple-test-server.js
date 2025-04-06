import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

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

// Add a simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Test database connectivity
app.get('/api/db-test', async (req, res) => {
  try {
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'DATABASE_URL not set' });
    }
    
    // Import postgres dynamically
    const { default: postgres } = await import('postgres');
    const sql = postgres(process.env.DATABASE_URL);
    
    // Test connection with a simple query
    const result = await sql`SELECT current_timestamp as time`;
    
    // Close connection
    await sql.end();
    
    return res.json({ 
      success: true, 
      message: 'Database connection successful',
      time: result[0].time
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running at http://0.0.0.0:${PORT}`);
});