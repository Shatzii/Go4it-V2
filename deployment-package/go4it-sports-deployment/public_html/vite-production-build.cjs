/**
 * Production Build Configuration for Go4It Sports
 * 
 * This script wraps Vite's build process, setting appropriate environment
 * variables and post-processing the build output for production deployment.
 * 
 * CommonJS version for compatibility with Node.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Go4It Sports production build (CommonJS)...');

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.VITE_APP_URL = 'https://go4itsports.org';

// Ensure production build directory exists
const distDir = path.resolve(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

try {
  // Run the Vite build
  console.log('\n📦 Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Create necessary directories
  console.log('\n📁 Creating required directories...');
  const directories = [
    'dist/assets',
    'dist/uploads',
    'dist/uploads/videos',
    'dist/uploads/images',
    'dist/api'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   Created: ${dir}`);
    }
  });
  
  // Copy server files for API
  console.log('\n📋 Preparing server files...');
  execSync('cp -r server dist/api/', { stdio: 'inherit' });
  execSync('cp -r shared dist/api/', { stdio: 'inherit' });
  
  // Post-process index.html
  console.log('\n🔍 Post-processing index.html...');
  const indexPath = path.join(distDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Add base URL
    if (!indexContent.includes('<base href="https://go4itsports.org">')) {
      indexContent = indexContent.replace('<head>', '<head>\n    <base href="https://go4itsports.org">');
    }
    
    // Add AI script tags
    const aiScripts = ['agent.js', 'ai_assist.js', 'upload.js', 'voice.js'];
    let scriptsToAdd = '';
    
    aiScripts.forEach(script => {
      if (!indexContent.includes(`/${script}`)) {
        scriptsToAdd += `    <script type="module" src="/${script}"></script>\n`;
      }
    });
    
    if (scriptsToAdd) {
      indexContent = indexContent.replace('</body>', `${scriptsToAdd}</body>`);
    }
    
    // Replace any localhost references
    indexContent = indexContent.replace(/http:\/\/localhost:\d+/g, 'https://go4itsports.org');
    
    // Ensure scripts are marked as module type
    indexContent = indexContent.replace(/<script src="\/assets\/([^"]+)"><\/script>/g, 
      '<script type="module" src="/assets/$1"></script>');
    
    // Write updated index.html
    fs.writeFileSync(indexPath, indexContent);
    console.log('   Updated index.html with production settings');
  }
  
  // Create production server entry point
  console.log('\n🖥️ Creating production server entry point...');
  const serverEntryPath = path.join(distDir, 'api', 'server.js');
  
  const serverEntry = `/**
 * Go4It Sports API Server - Production Entry Point
 */

require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Pool } = require('pg');
const path = require('path');
const { WebSocketServer } = require('ws');
const compression = require('compression');
const cors = require('cors');

// Ensure production mode
process.env.NODE_ENV = 'production';

// Initialize Express app
const app = express();

// Common middleware
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure CORS for production
const corsOptions = {
  origin: process.env.SITE_URL || 'https://go4itsports.org',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Database connection pool with optimized settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.PG_MAX_CONNECTIONS || '20', 10),
  idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.PG_CONNECTION_TIMEOUT || '5000', 10)
});

// Load routes
const { registerRoutes } = require('./routes');

// Serve static files from dist
app.use(express.static(path.join(__dirname, '..'), {
  maxAge: '1d',
  etag: true
}));

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '1.0.1',
    environment: process.env.NODE_ENV, 
    time: new Date().toISOString() 
  });
});

// Register API routes
const httpServer = registerRoutes(app);

// Create WebSocket server on the /ws path
const wss = new WebSocketServer({ 
  server: httpServer, 
  path: '/ws',
  clientTracking: true
});

// WebSocket handling
wss.on('connection', (ws, req) => {
  console.log(\`WebSocket client connected: \${req.socket.remoteAddress}\`);
  
  ws.isAlive = true;
  
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log(\`Received message: \${parsedMessage.type}\`);
      
      // Handle different message types
      switch (parsedMessage.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', time: Date.now() }));
          break;
        default:
          // Forward to appropriate handlers based on message type
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Go4It Sports WebSocket server',
    time: Date.now()
  }));
});

// Keep-alive ping for WebSockets to prevent timeouts
const pingInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('Terminating inactive WebSocket connection');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(pingInterval);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('API error:', err);
  
  res.status(err.status || 500).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'An internal server error occurred'
        : err.message,
      status: err.status || 500
    }
  });
});

// For any other route, serve the SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(\`Go4It Sports server running on port \${PORT}\`);
  console.log(\`Environment: \${process.env.NODE_ENV}\`);
  console.log(\`API available at: http://localhost:\${PORT}/api\`);
  console.log(\`WebSocket available at: ws://localhost:\${PORT}/ws\`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('HTTP server closed');
    pool.end();
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
});
`;
  
  fs.writeFileSync(serverEntryPath, serverEntry);
  console.log('   Created production server entry point');
  
  // Create Nginx configuration
  console.log('\n🌐 Creating Nginx configuration...');
  fs.copyFileSync('nginx-production.conf', path.join(distDir, 'nginx.conf'));
  console.log('   Copied Nginx configuration file');
  
  // Copy deployment instructions
  console.log('\n📝 Copying deployment instructions...');
  fs.copyFileSync('FINAL_DEPLOYMENT_CHECKLIST.md', path.join(distDir, 'DEPLOYMENT_CHECKLIST.md'));
  fs.copyFileSync('RELEASE_NOTES.md', path.join(distDir, 'RELEASE_NOTES.md'));
  console.log('   Copied deployment instructions');
  
  // Create environment example file
  console.log('\n🔐 Creating environment variables example...');
  fs.copyFileSync('.env.production', path.join(distDir, '.env.example'));
  console.log('   Created environment variables example');
  
  // Create AI scripts
  console.log('\n🤖 Creating AI scripts...');
  
  // Copy from client/src/lib if they exist, otherwise create stubs
  ['agent.js', 'ai_assist.js', 'upload.js', 'voice.js', 'ai-loader.js'].forEach(scriptName => {
    const sourcePath = path.join('client', 'src', 'lib', scriptName);
    const destPath = path.join(distDir, scriptName);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`   Copied: ${scriptName}`);
    } else {
      // Create a stub for each AI script
      const scriptContent = `/**
 * ${scriptName} - Go4It Sports AI Module
 * Production build - ${new Date().toISOString()}
 */

// Type definition for better IDE support
/** @type {module} */

document.addEventListener('DOMContentLoaded', () => {
  console.log('${scriptName} initialized');
  
  // AI module functionality would be implemented here
  // This is a stub - actual code would be copied from the source files
});

// Export default module
export default {
  init: () => {
    console.log('${scriptName} ready');
  }
};
`;
      
      fs.writeFileSync(destPath, scriptContent);
      console.log(`   Created stub: ${scriptName}`);
    }
  });
  
  console.log('\n✅ Production build complete!');
  console.log('\nYour production build is ready in the dist/ directory.');
  console.log('Follow the instructions in dist/DEPLOYMENT_CHECKLIST.md to deploy to your server.');
  
} catch (error) {
  console.error('\n❌ Build failed:', error);
  process.exit(1);
}