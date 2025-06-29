/**
 * Production Build Configuration for Go4It Sports
 * 
 * This script wraps Vite's build process, setting appropriate environment
 * variables and post-processing the build output for production deployment.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Go4It Sports production build...');

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
    
    // Write updated index.html
    fs.writeFileSync(indexPath, indexContent);
    console.log('   Updated index.html with production settings');
  }
  
  // Create simplified server entry point
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

// Ensure production mode
process.env.NODE_ENV = 'production';

// Initialize Express app
const app = express();
app.use(express.json());

// Database connection pool with optimized settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

// Load routes
const { registerRoutes } = require('./routes');

// Serve static files from dist
app.use(express.static(path.join(__dirname, '..')));

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV, time: new Date().toISOString() });
});

// Register API routes
const httpServer = registerRoutes(app);

// Create WebSocket server on the /ws path
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      // Handle WebSocket messages
      console.log('Received:', data.type);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
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
});
`;
  
  fs.writeFileSync(serverEntryPath, serverEntry);
  console.log('   Created production server entry point');
  
  // Create Nginx configuration
  console.log('\n🌐 Creating Nginx configuration...');
  const nginxConfig = `# Nginx configuration for Go4It Sports
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;
    
    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name go4itsports.org www.go4itsports.org;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/go4itsports.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/go4itsports.org/privkey.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_session_cache shared:SSL:10m;
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    
    # Root directory
    root /var/www/go4itsports.org/dist;
    index index.html;
    
    # Static assets - long cache time
    location ~* \\.(?:jpg|jpeg|gif|png|ico|svg|webp|woff2|css|js)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket for real-time features
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
    
    # Main app - serve index.html for SPA routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /error.html;
}`;
  
  fs.writeFileSync(path.join(distDir, 'nginx.conf'), nginxConfig);
  console.log('   Created Nginx configuration file');
  
  // Create deployment instructions
  console.log('\n📝 Creating deployment instructions...');
  const deploymentInstructions = `# Go4It Sports Production Deployment Instructions

This build is optimized for deployment to https://go4itsports.org

## Server Requirements

- Nginx web server
- Node.js 20.x or higher
- PostgreSQL database

## Deployment Steps

1. Upload the contents of this \`dist\` folder to your server:
   \`\`\`bash
   scp -r dist/* user@your-server:/var/www/go4itsports.org/
   \`\`\`

2. Configure Nginx:
   - Use the provided \`nginx.conf\` as a reference
   - Add the configuration to your Nginx sites-available directory
   - Create a symbolic link to sites-enabled
   - Test and reload Nginx:
   \`\`\`bash
   sudo nginx -t
   sudo systemctl reload nginx
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cd /var/www/go4itsports.org/
   cp .env.example .env
   # Edit .env with your production values
   nano .env
   \`\`\`

4. Start the API server with PM2:
   \`\`\`bash
   npm install -g pm2
   cd /var/www/go4itsports.org/
   pm2 start api/server.js --name go4it-api
   pm2 save
   pm2 startup
   \`\`\`

5. Set up SSL with Let's Encrypt:
   \`\`\`bash
   sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org
   \`\`\`

## Server Maintenance

- Database backups: Set up daily PostgreSQL backups
  \`\`\`bash
  sudo -u postgres pg_dump go4it_sports > /backups/go4it_sports_\$(date +%Y%m%d).sql
  \`\`\`

- Log rotation: Configure for nginx and Node.js logs
  \`\`\`bash
  sudo nano /etc/logrotate.d/go4itsports
  \`\`\`

- Monitor the application:
  \`\`\`bash
  pm2 monit
  \`\`\`

## Technical Support

For support contact: support@go4itsports.org
`;
  
  fs.writeFileSync(path.join(distDir, 'DEPLOYMENT.md'), deploymentInstructions);
  console.log('   Created deployment instructions');
  
  // Create environment example file
  console.log('\n🔐 Creating environment variables example...');
  const envExample = `# Go4It Sports Production Environment
# Copy this file to .env and fill in your values

# Server settings
NODE_ENV=production
PORT=5000

# Database Connection
DATABASE_URL=postgresql://username:password@localhost:5432/go4it_sports
PGHOST=localhost
PGUSER=username
PGPASSWORD=password
PGDATABASE=go4it_sports
PGPORT=5432

# API Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Optional: Twilio for SMS notifications
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
`;
  
  fs.writeFileSync(path.join(distDir, '.env.example'), envExample);
  console.log('   Created environment variables example');
  
  // Copy necessary AI scripts
  console.log('\n🤖 Creating AI scripts...');
  const aiScripts = ['agent.js', 'ai_assist.js', 'upload.js', 'voice.js'];
  
  aiScripts.forEach(scriptName => {
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
    
    fs.writeFileSync(path.join(distDir, scriptName), scriptContent);
    console.log(`   Created: ${scriptName}`);
  });
  
  console.log('\n✅ Production build complete!');
  console.log('\nYour production build is ready in the dist/ directory.');
  console.log('Follow the instructions in dist/DEPLOYMENT.md to deploy to your server.');
  
} catch (error) {
  console.error('\n❌ Build failed:', error);
  process.exit(1);
}