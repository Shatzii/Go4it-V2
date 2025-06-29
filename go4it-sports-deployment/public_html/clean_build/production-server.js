/**
 * Go4It Sports Production Server
 * Configured for deployment on go4itsports.org (188.245.209.124:81)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { createServer } = require('http');
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const multer = require('multer');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cron = require('node-cron');

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 81;
const HOST = process.env.SERVER_HOST || '188.245.209.124';

// Set up database connection
console.log(`Initializing database connection for PRODUCTION`);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Express app
const app = express();

// Production optimizations
app.use(compression()); // Compress responses
app.use(helmet({
  contentSecurityPolicy: false, // Adjust as needed for your app
  crossOriginEmbedderPolicy: false,
}));

// Basic middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  store: new pgSession({
    pool,
    tableName: 'sessions', // Make sure this table exists
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'go4it-production-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: false, // Set to true if using HTTPS
  }
}));

// Set up passport authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure passport local strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = path.join(__dirname, 'uploads');
    
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// API routes

// Authentication routes
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// File upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Health check endpoint
app.get('/api/healthcheck', (req, res) => {
  res.json({ 
    status: 'ok', 
    server: `${HOST}:${PORT}`,
    database: pool.totalCount > 0 ? 'connected' : 'connecting',
    time: new Date().toISOString()
  });
});

// Add more API routes here...
// Import your routes from server/routes and register them
// This is a simplified example - you'll need to adapt this to your actual route structure

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, 'client/dist')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// For all other routes, serve the React app (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Create HTTP server
const server = createServer(app);

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Go4It Sports Server running on http://${HOST}:${PORT}`);
});

// Database health check
setInterval(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection is healthy');
  } catch (error) {
    console.error('Database health check failed:', error);
  }
}, 60000);

// Schedule daily database backup at 3AM
cron.schedule('0 3 * * *', async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(__dirname, 'backups', `backup-${timestamp}.sql`);
  
  // Create backups directory if it doesn't exist
  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Execute pg_dump (this requires pg_dump to be installed on the server)
  const { exec } = require('child_process');
  exec(`pg_dump ${process.env.DATABASE_URL} > ${backupPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Database backup error: ${error.message}`);
      return;
    }
    console.log(`Database backup completed: ${backupPath}`);
    
    // Clean up old backups (keep only the last 7 days)
    exec(`find ${backupDir} -type f -name "backup-*.sql" -mtime +7 -delete`, (err) => {
      if (err) {
        console.error(`Error cleaning up old backups: ${err.message}`);
      } else {
        console.log('Old backups cleaned up');
      }
    });
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end().then(() => {
      console.log('Database connection pool closed');
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end().then(() => {
      console.log('Database connection pool closed');
    });
  });
});