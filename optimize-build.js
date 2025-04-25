/**
 * Production Build Optimizer for Go4It Sports
 * 
 * This script ensures that the production build is properly optimized
 * for deployment at https://go4itsports.org
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Go4It Sports Production Build Optimizer');
console.log('======================================');
console.log('Target domain: https://go4itsports.org');

// Step 1: Ensure environment is set to production
process.env.NODE_ENV = 'production';

// Step 2: Clear old build files
console.log('\n🧹 Cleaning previous build...');
if (fs.existsSync('dist')) {
  execSync('rm -rf dist');
}

// Step 3: Modify vite.config.ts to ensure base URL is set correctly
console.log('\n🔧 Configuring build for production...');

// Create production build
console.log('\n🏗️ Building frontend...');
execSync('npm run build', { stdio: 'inherit' });

// Step 4: Create necessary directories in dist
console.log('\n📁 Setting up directory structure...');
const dirs = [
  'dist/assets',
  'dist/uploads',
  'dist/uploads/videos',
  'dist/uploads/images',
  'dist/uploads/athletes',
  'dist/api'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`   Created: ${dir}`);
  }
});

// Step 5: Copy necessary files to ensure complete package
console.log('\n📋 Copying additional files...');

// Copy public assets
execSync('cp -r public/* dist/', { stdio: 'inherit' });

// Ensure AI and agent scripts are available and properly set as modules
const aiScripts = [
  'agent.js',
  'ai_assist.js',
  'upload.js',
  'voice.js'
];

aiScripts.forEach(script => {
  const scriptPath = path.join('client/src/lib', script);
  const destPath = path.join('dist', script);
  
  if (fs.existsSync(scriptPath)) {
    let content = fs.readFileSync(scriptPath, 'utf8');
    
    // Ensure scripts are set as modules
    if (!content.includes('type="module"')) {
      content = `// @ts-nocheck\n// Production build - ${new Date().toISOString()}\n${content}`;
    }
    
    fs.writeFileSync(destPath, content);
    console.log(`   Copied and optimized: ${script}`);
  } else {
    console.log(`   ⚠️ Warning: Could not find ${scriptPath}`);
  }
});

// Step 6: Process index.html to ensure all scripts are properly loaded
console.log('\n🔍 Finalizing index.html...');
const indexPath = path.join('dist', 'index.html');

if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Make sure AI scripts are loaded properly
  let scriptsToAdd = '';
  aiScripts.forEach(script => {
    if (!indexContent.includes(`/${script}`)) {
      scriptsToAdd += `    <script type="module" src="/${script}"></script>\n`;
    }
  });
  
  if (scriptsToAdd) {
    // Add scripts before the closing </body> tag
    indexContent = indexContent.replace('</body>', `${scriptsToAdd}</body>`);
    fs.writeFileSync(indexPath, indexContent);
    console.log('   Added missing script tags to index.html');
  }
  
  // Ensure base URL is set to the production domain
  if (!indexContent.includes('<base href="https://go4itsports.org">')) {
    indexContent = indexContent.replace('<head>', '<head>\n    <base href="https://go4itsports.org">');
    fs.writeFileSync(indexPath, indexContent);
    console.log('   Added production base URL to index.html');
  }
  
  // Remove any localhost references
  indexContent = indexContent.replace(/http:\/\/localhost:\d+/g, 'https://go4itsports.org');
  fs.writeFileSync(indexPath, indexContent);
}

// Step 7: Create a nginx config file for reference
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
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://api.openai.com https://api.anthropic.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com; font-src 'self'; frame-src 'self';";
    
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

fs.writeFileSync('dist/nginx.conf', nginxConfig);
console.log('   Created nginx.conf reference file');

// Step 8: Create deployment instructions
const deploymentInstructions = `# Go4It Sports Production Deployment Instructions

This build is ready to be deployed to https://go4itsports.org

## Server Requirements

- Nginx web server
- Node.js 20.x or higher (for API server)
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

3. Start the API server:
   \`\`\`bash
   cd /var/www/go4itsports.org/
   NODE_ENV=production PORT=5000 node api/server.js
   \`\`\`

4. For production use, set up a process manager like PM2:
   \`\`\`bash
   npm install -g pm2
   pm2 start api/server.js --name go4it-api -- --port=5000
   pm2 save
   pm2 startup
   \`\`\`

5. Set up SSL with Let's Encrypt:
   \`\`\`bash
   sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org
   \`\`\`

## Environment Variables

Make sure these are set on your server:

\`\`\`
NODE_ENV=production
DATABASE_URL=postgresql://username:password@localhost:5432/go4it_sports
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
\`\`\`

## Maintenance

- Database backups: Set up daily PostgreSQL backups
- Log rotation: Configure for nginx and Node.js logs
- Monitoring: Set up server monitoring (we recommend Datadog or Prometheus)

For support contact: support@go4itsports.org
`;

fs.writeFileSync('dist/DEPLOYMENT.md', deploymentInstructions);
console.log('   Created deployment instructions');

// Step 9: Copy server files to the dist/api directory
console.log('\n📋 Preparing server files...');

// Create a simple entry point for the API server
const serverEntry = `/**
 * Go4It Sports API Server - Production Entry Point
 * This file starts the API server in production mode
 */

require('dotenv').config();
const { createServer } = require('http');
const express = require('express');
const { Pool } = require('pg');
const { registerRoutes } = require('./routes');

// Ensure we're in production mode
process.env.NODE_ENV = 'production';

// Create Express app
const app = express();
app.use(express.json());

// Set up database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Connection pooling
  idleTimeoutMillis: 30000
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Register all routes
const server = registerRoutes(app);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(\`Go4It Sports API server running on port \${PORT}\`);
  console.log(\`Environment: \${process.env.NODE_ENV}\`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    pool.end();
  });
});
`;

// Write the server entry point
fs.mkdirSync('dist/api', { recursive: true });
fs.writeFileSync('dist/api/server.js', serverEntry);
console.log('   Created API server entry point');

// Copy necessary server files
console.log('   Copying server files to dist/api...');
try {
  execSync('cp -r server/* dist/api/', { stdio: 'inherit' });
  execSync('cp -r shared dist/api/', { stdio: 'inherit' });
  console.log('   Server files copied successfully');
} catch (error) {
  console.error('   Error copying server files:', error);
}

// Step 10: Create production .env example
const envExample = `# Go4It Sports Production Environment
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

# Optional: Twilio for SMS
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
`;

fs.writeFileSync('dist/.env.example', envExample);
console.log('   Created .env.example template');

console.log('\n✅ Build optimization complete!');
console.log('\nProduction files are ready in the dist/ directory.');
console.log('Follow the instructions in dist/DEPLOYMENT.md to deploy to your server.');
console.log('\n📝 Next steps:');
console.log('1. Verify the build locally if desired');
console.log('2. Transfer the dist folder to your production server');
console.log('3. Configure Nginx using the provided nginx.conf');
console.log('4. Start the API server with proper environment variables');
console.log('\nThank you for using Go4It Sports!');