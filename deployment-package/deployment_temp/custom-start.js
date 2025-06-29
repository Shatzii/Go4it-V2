// This script starts a simple API server for database operations
// without trying to use the Vite development server
// This is a workaround for issues with ESM/CommonJS compatibility

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import MemoryStore from 'memorystore';
import fs from 'fs';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres';

// Setup proper __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting Go4It Sports server with database connection...');

// Connect to the database
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not defined");
  process.exit(1);
}

// Setting up the drizzle connection
let sql;
let db;
try {
  console.log(`Connecting to database: ${DATABASE_URL}`);
  sql = postgres(DATABASE_URL);
  db = drizzle(sql);
  
  // Test connection
  const result = await sql`SELECT current_timestamp as time`;
  console.log("Database connection successful:", result[0].time);
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
    // Test connection with a simple query
    const result = await sql`SELECT current_timestamp as time`;
    
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

// Serve static files if they exist
const staticPath = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  console.log(`Serving static files from ${staticPath}`);
} else {
  console.log(`Static path ${staticPath} not found. Only API routes will be available.`);
}

// For any other GET request, serve the index.html file if it exists
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  const indexPath = path.join(__dirname, 'client', 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next();
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  try {
    await sql.end();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error closing database connection:", err);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Terminating server...");
  try {
    await sql.end();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error closing database connection:", err);
  }
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Go4It Sports server running at http://0.0.0.0:${PORT}`);
  console.log(`API available at http://0.0.0.0:${PORT}/api/test`);
});