import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import MemoryStore from 'memorystore';
import fs from 'fs';
import postgres from 'postgres';

// Setup proper __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not defined");
  process.exit(1);
}

try {
  console.log(`Connecting to database: ${DATABASE_URL}`);
  const sql = postgres(DATABASE_URL);
  
  // Test connection
  const result = await sql`SELECT current_timestamp as time`;
  console.log("Database connection successful:", result[0].time);
  
  // Close the connection
  await sql.end();
} catch (error) {
  console.error("Database connection error:", error);
  process.exit(1);
}

// Initialize Express app
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

// Session configuration
const MemoryStoreSession = MemoryStore(session);
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key-for-dev-only',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
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

// Serve static files
const staticPath = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  console.log(`Serving static files from ${staticPath}`);
} else {
  console.log(`Static path ${staticPath} not found. Only API routes will be available.`);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});