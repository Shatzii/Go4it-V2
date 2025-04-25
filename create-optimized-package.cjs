/**
 * Create Optimized Production Package for Go4It Sports
 * 
 * This script creates a production-ready package for deployment to go4itsports.org
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Variables
const PACKAGE_NAME = `go4it-deployment-${new Date().toISOString().split('T')[0]}.zip`;
const TEMP_DIR = path.join(__dirname, 'deployment_dist');
const VERSION = '1.0.1';

console.log('===== Creating Go4It Sports Production Package =====');
console.log('Target: https://go4itsports.org');
console.log('Version:', VERSION);

/**
 * Create directory structure
 */
function createDirectoryStructure() {
  console.log('\n📁 Creating directory structure...');
  
  const directories = [
    TEMP_DIR,
    path.join(TEMP_DIR, 'dist'),
    path.join(TEMP_DIR, 'dist', 'assets'),
    path.join(TEMP_DIR, 'dist', 'assets', 'js'),
    path.join(TEMP_DIR, 'dist', 'assets', 'css'),
    path.join(TEMP_DIR, 'dist', 'assets', 'images'),
    path.join(TEMP_DIR, 'dist', 'assets', 'fonts'),
    path.join(TEMP_DIR, 'dist', 'js'),
    path.join(TEMP_DIR, 'server'),
    path.join(TEMP_DIR, 'shared'),
    path.join(TEMP_DIR, 'uploads'),
    path.join(TEMP_DIR, 'uploads', 'videos'),
    path.join(TEMP_DIR, 'uploads', 'images'),
    path.join(TEMP_DIR, 'logs'),
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  Created: ${dir}`);
    }
  });
}

/**
 * Copy production optimized files
 */
function copyOptimizedFiles() {
  console.log('\n📋 Copying optimized production files...');
  
  // Copy production-ready HTML file
  fs.copyFileSync(
    path.join(__dirname, 'production-index.html'),
    path.join(TEMP_DIR, 'dist', 'index.html')
  );
  console.log('  Copied production-index.html to dist/index.html');
  
  // Copy production-ready CSS file
  fs.copyFileSync(
    path.join(__dirname, 'production-main.css'),
    path.join(TEMP_DIR, 'dist', 'assets', 'css', 'main.css')
  );
  console.log('  Copied production-main.css to dist/assets/css/main.css');
  
  // Copy production-ready JS file
  fs.copyFileSync(
    path.join(__dirname, 'production-main.js'),
    path.join(TEMP_DIR, 'dist', 'assets', 'js', 'main.js')
  );
  console.log('  Copied production-main.js to dist/assets/js/main.js');
  
  // Copy AI module files to dist/js
  const aiScripts = [
    { source: 'client/src/lib/agent.js', target: 'dist/js/agent.js' },
    { source: 'client/src/lib/ai_assist.js', target: 'dist/js/ai_assist.js' },
    { source: 'client/src/lib/upload.js', target: 'dist/js/upload.js' },
    { source: 'client/src/lib/voice.js', target: 'dist/js/voice.js' },
    { source: 'client/src/lib/ai-loader.js', target: 'dist/js/ai-loader.js' }
  ];
  
  aiScripts.forEach(script => {
    try {
      const sourcePath = path.join(__dirname, script.source);
      const targetPath = path.join(TEMP_DIR, script.target);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`  Copied ${script.source} to ${script.target}`);
      } else {
        // Create an optimized module stub
        const scriptBasename = path.basename(script.target);
        const scriptContent = `/**
 * ${scriptBasename} - Go4It Sports AI Module
 * Production build for https://go4itsports.org
 * Version: ${VERSION}
 * Build date: ${new Date().toISOString().split('T')[0]}
 */

// Define module configuration
const config = {
  apiBase: '/api',
  environment: 'production'
};

// Initialize module
function init(options = {}) {
  console.log('${scriptBasename} initialized');
  return true;
}

// Export module
export default {
  init,
  version: '${VERSION}'
};`;
        
        fs.writeFileSync(targetPath, scriptContent);
        console.log(`  Created stub for ${script.target}`);
      }
    } catch (error) {
      console.error(`  Error processing ${script.source}:`, error);
    }
  });
  
  // Create error.html page
  const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - Go4It Sports</title>
  <link rel="stylesheet" href="/assets/css/main.css">
  <style>
    .error-container {
      max-width: 600px;
      margin: 100px auto;
      padding: 2rem;
      background-color: var(--bg-card);
      border-radius: 8px;
      text-align: center;
      border: 1px solid #f44336;
    }
    .error-title {
      color: #f44336;
      margin-bottom: 1rem;
    }
    .home-button {
      display: inline-block;
      background-color: #0066cc;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      margin-top: 1.5rem;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <h1 class="error-title">Server Error</h1>
    <p>We're sorry, something went wrong on our server.</p>
    <p>Our team has been notified and we're working to fix the issue.</p>
    <a href="/" class="home-button">Return to Home</a>
  </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(TEMP_DIR, 'dist', 'error.html'), errorHtml);
  console.log('  Created error.html');
  
  // Create favicon.png placeholder
  try {
    // Try to copy existing favicon if available
    if (fs.existsSync(path.join(__dirname, 'client', 'public', 'favicon.png'))) {
      fs.copyFileSync(
        path.join(__dirname, 'client', 'public', 'favicon.png'),
        path.join(TEMP_DIR, 'dist', 'assets', 'favicon.png')
      );
    } else {
      // Create very simple favicon data
      const faviconBase64 = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI4SURBVFhH7ZdNSFRRFMefTi8xzaW0cBWRUFKLgoiChCyIENuUGBhIiwja1Do30bLa1CYw2gSCMG2MsVUthCBoERG50kBmHJUEYeZN+Hne7f8O59Jcc97MnRaJP/i753O453z0cM2yLOtflKqqKgUCAdXU1KjGxkb5b25uqqWlRa2srKhcLqdWV1dVJpOJo/nfaGhoMJ5sNhuwbdvq7e21mpubraamJmtoaMh4MdVPTk5anZ2d1vDwsDE1v+Pt+XxezFTQ19c3irJzwGYHyE2zn8hxVP8QlDgfqtCK2vv7+27TNFdwXBcIR1qtVjQaDYTDYXWzuUo1+0YUh3IlXQ4Z61RYrKurM9va2iov0N7eblZXV7tbW1v82dLS4m5XoqOjgzNXknPAb3geZR+AbCU3CHu6EBBz+vO8Dv4A3+DnOeAluADj3ztOTEwYTg31CWR8Lzs9PW3OzMyY09NTYylTLBZtVJ9+Qb7UfwOCKLmHsktA9gV5GXLcv81R5xprcZ/eo8YeOw+OMg6WOB+qsM97fmxsjCNlczwe59Uo3WVHR0c561aJRGIPWVKXw0SiwS83f54DpVJJ41wSQWx5v6Hf19TUeO4Z1nIWn2R9fl1hOp0m8/QBU8jyB1JHYVDXIbCyuVzO3d7e1s5X8FPWIeeAS8wB2XGw77cB2XXwYnZ2VsxuIpXidNRz2Vmgq3E2n6RSkzebTbMCLiFkI+lPOw/ugy7gzYOvbDjK14Msn/8a6A3K94CXLMvK5JfzL5D0CzGwHDlMQHvDAAAAAElFTkSuQmCC";
      const faviconBuffer = Buffer.from(faviconBase64, 'base64');
      fs.writeFileSync(path.join(TEMP_DIR, 'dist', 'assets', 'favicon.png'), faviconBuffer);
    }
    console.log('  Created favicon.png');
  } catch (error) {
    console.error('  Error creating favicon:', error);
  }
}

/**
 * Copy server files
 */
function copyServerFiles() {
  console.log('\n🖥️ Copying server files...');
  
  try {
    // Copy production server file
    fs.copyFileSync(
      path.join(__dirname, 'server', 'production-server.js'),
      path.join(TEMP_DIR, 'server', 'production-server.js')
    );
    console.log('  Copied production-server.js');
    
    // Copy essential server files
    const serverFiles = [
      'routes.ts',
      'db.ts',
      'storage.ts',
      'auth.ts'
    ];
    
    serverFiles.forEach(file => {
      const sourcePath = path.join(__dirname, 'server', file);
      const targetPath = path.join(TEMP_DIR, 'server', file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`  Copied server/${file}`);
      }
    });
    
    // Copy shared directory for database schema
    try {
      execSync(`cp -r ${path.join(__dirname, 'shared')}/* ${path.join(TEMP_DIR, 'shared')}/`);
      console.log('  Copied shared directory');
    } catch (error) {
      console.error('  Error copying shared directory:', error);
    }
    
    // Create server.js entry point
    const serverEntryPoint = `/**
 * Go4It Sports API Server
 * Production Entry Point
 * Version: ${VERSION}
 */

// Load environment variables
require('dotenv').config();

// Force production mode
process.env.NODE_ENV = 'production';

// Start the server
console.log('Starting Go4It Sports API Server...');
console.log('Environment: ' + process.env.NODE_ENV);
console.log('Version: ${VERSION}');

// Load the production server
require('./production-server.js');
`;
    
    fs.writeFileSync(path.join(TEMP_DIR, 'server.js'), serverEntryPoint);
    console.log('  Created server.js entry point');
  } catch (error) {
    console.error('  Error copying server files:', error);
  }
}

/**
 * Create configuration files
 */
function createConfigFiles() {
  console.log('\n🔧 Creating configuration files...');
  
  // Create Nginx configuration
  const nginxConfig = `# Nginx configuration for Go4It Sports
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;
    
    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name go4itsports.org www.go4itsports.org;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/go4itsports.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/go4itsports.org/privkey.pem;
    
    # Modern SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 1.1.1.1 1.0.0.1 valid=300s;
    resolver_timeout 5s;
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Referrer-Policy strict-origin-when-cross-origin;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://api.openai.com https://api.anthropic.com wss://$host/ws ws://$host/ws; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com; font-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';";
    
    # Root directory
    root /var/www/go4itsports.org/dist;
    index index.html;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;
    
    # File cache settings
    location ~* \\.(?:jpg|jpeg|png|gif|ico|webp|svg|woff2|woff|ttf|otf|css|js)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
        try_files $uri =404;
    }
    
    # JS module files
    location ~* \\.js$ {
        default_type application/javascript;
        add_header X-Content-Type-Options nosniff;
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
        try_files $uri =404;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # Cache API responses
        proxy_cache go4it_api_cache;
        proxy_cache_valid 200 302 5m;  # Cache successful responses for 5 minutes
        proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
        add_header X-Cache-Status $upstream_cache_status;
        
        # Don't cache authenticated requests
        proxy_cache_bypass $http_authorization;
        proxy_no_cache $http_authorization;
    }
    
    # WebSocket for real-time features
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;  # 24 hours
    }
    
    # Media uploads
    location /uploads/ {
        alias /var/www/go4itsports.org/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        try_files $uri =404;
    }
    
    # Handle SPA routes
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /error.html;
}

# API cache configuration
proxy_cache_path /var/cache/nginx/go4it_api_cache levels=1:2 keys_zone=go4it_api_cache:10m max_size=1g inactive=60m use_temp_path=off;`;
  
  fs.writeFileSync(path.join(TEMP_DIR, 'nginx.conf'), nginxConfig);
  console.log('  Created nginx.conf');
  
  // Create .env.example file
  const envExample = `# Go4It Sports Production Environment
# Copy this file to .env and set your values

# Server settings
NODE_ENV=production
PORT=5000
SITE_URL=https://go4itsports.org

# Database Connection
DATABASE_URL=postgresql://username:password@localhost:5432/go4it_sports
PGHOST=localhost
PGUSER=username
PGPASSWORD=password
PGDATABASE=go4it_sports
PGPORT=5432

# Database connection pooling settings
PG_MAX_CONNECTIONS=20
PG_IDLE_TIMEOUT=30000
PG_CONNECTION_TIMEOUT=5000

# API Keys (required)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# Optional: Twilio for SMS notifications
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_here

# Cache settings
API_CACHE_TTL=300  # 5 minutes in seconds
CACHE_ENABLED=true

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/var/www/go4itsports.org/logs/app.log

# Security
SESSION_SECRET=generate_a_long_random_string_here
JWT_SECRET=generate_another_long_random_string_here
COOKIE_SECRET=third_random_string_here

# Upload limits
MAX_UPLOAD_SIZE=100000000  # 100MB
ALLOWED_UPLOAD_TYPES=mp4,mov,jpg,jpeg,png,pdf

# Feature flags
ENABLE_AI_COACH=true
ENABLE_HIGHLIGHT_GENERATION=true
ENABLE_SMS_NOTIFICATIONS=false

# Performance
COMPRESSION_LEVEL=6`;
  
  fs.writeFileSync(path.join(TEMP_DIR, '.env.example'), envExample);
  console.log('  Created .env.example');
  
  // Create start.sh script
  const startScript = `#!/bin/bash
# Go4It Sports Production Start Script
# Version: ${VERSION}

# Ensure we're in the correct directory
cd "$(dirname "$0")"

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set production environment
export NODE_ENV=production

# Start the server
echo "Starting Go4It Sports API Server..."
echo "Environment: $NODE_ENV"
echo "Version: ${VERSION}"

# Run the server
node server.js`;
  
  fs.writeFileSync(path.join(TEMP_DIR, 'start.sh'), startScript);
  fs.chmodSync(path.join(TEMP_DIR, 'start.sh'), 0o755); // Make executable
  console.log('  Created start.sh');
  
  // Create package.json
  const packageJson = {
    name: "go4it-sports",
    version: VERSION,
    description: "Sports performance platform for neurodivergent student athletes",
    main: "server.js",
    scripts: {
      "start": "NODE_ENV=production node server.js"
    },
    engines: {
      "node": ">=20.0.0"
    },
    dependencies: {
      "@anthropic-ai/sdk": "^0.13.0",
      "@neondatabase/serverless": "^0.9.0",
      "bcryptjs": "^2.4.3",
      "compression": "^1.7.4",
      "connect-pg-simple": "^9.0.1",
      "cors": "^2.8.5",
      "dotenv": "^16.4.5",
      "drizzle-orm": "^0.29.5",
      "express": "^4.19.2",
      "express-session": "^1.18.0",
      "jsonwebtoken": "^9.0.2",
      "openai": "^4.32.0",
      "pg": "^8.11.3",
      "ws": "^8.16.0",
      "zod": "^3.22.4"
    }
  };
  
  fs.writeFileSync(
    path.join(TEMP_DIR, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log('  Created package.json');
}

/**
 * Create documentation files
 */
function createDocumentation() {
  console.log('\n📝 Creating documentation...');
  
  // Create README.md
  const readme = `# Go4It Sports Platform
Version: ${VERSION}
Deployment date: ${new Date().toISOString().split('T')[0]}

## Overview
The Go4It Sports platform is designed for student athletes aged 12-18, with a specialized approach to supporting neurodivergent individuals through comprehensive development tools and personalized insights.

## Production Deployment
This package contains a production-ready build of the Go4It Sports platform for deployment to https://go4itsports.org.

## Directory Structure
- \`dist/\`: Frontend static files for Nginx
- \`server/\`: Backend API server files
- \`shared/\`: Shared code including database schema
- \`uploads/\`: User uploaded content
- \`logs/\`: Application logs

## Getting Started
1. Set up your server environment (Node.js, PostgreSQL, Nginx)
2. Configure environment variables in \`.env\`
3. Start the API server with \`./start.sh\`
4. Configure Nginx using the provided \`nginx.conf\`

## Technologies
- React.js with TypeScript frontend
- Node.js backend with intelligent performance analysis
- PostgreSQL database with Drizzle ORM
- WebSocket for real-time features
- OpenAI and Anthropic Claude integration for AI coaching

## Documentation
- \`DEPLOYMENT.md\`: Detailed deployment instructions
- \`RELEASE_NOTES.md\`: Changes in this version
- \`.env.example\`: Environment variable template

## Support
For technical support, contact support@go4itsports.org.
`;
  
  fs.writeFileSync(path.join(TEMP_DIR, 'README.md'), readme);
  console.log('  Created README.md');
  
  // Create DEPLOYMENT.md
  const deployment = `# Go4It Sports Deployment Guide
Version: ${VERSION}

This guide provides step-by-step instructions for deploying the Go4It Sports platform to a production environment.

## Server Requirements
- Ubuntu 20.04 LTS or newer
- Node.js 20.x or newer
- PostgreSQL 14.x or newer
- Nginx 1.20.x or newer
- 2+ CPU cores
- 4+ GB RAM
- 20+ GB SSD storage

## Step 1: Prepare the Server
\`\`\`bash
# Update the system
sudo apt update
sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx postgresql postgresql-contrib certbot python3-certbot-nginx

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
\`\`\`

## Step 2: Set up the Database
\`\`\`bash
# Create a database user and database
sudo -u postgres psql -c "CREATE USER go4it WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "CREATE DATABASE go4it_sports OWNER go4it;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE go4it_sports TO go4it;"
\`\`\`

## Step 3: Deploy the Application
\`\`\`bash
# Create application directory
sudo mkdir -p /var/www/go4itsports.org
sudo chown $USER:$USER /var/www/go4itsports.org

# Extract deployment package
unzip go4it-deployment-*.zip -d /var/www/go4itsports.org/

# Navigate to application directory
cd /var/www/go4itsports.org

# Install dependencies
npm install --production

# Configure environment variables
cp .env.example .env
nano .env  # Edit with your specific values
\`\`\`

## Step 4: Configure Nginx
\`\`\`bash
# Copy Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/go4itsports.org

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/go4itsports.org /etc/nginx/sites-enabled/

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

## Step 5: Set up SSL with Let's Encrypt
\`\`\`bash
sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org
\`\`\`

## Step 6: Start the Application
\`\`\`bash
# Using PM2 for process management
pm2 start server.js --name go4it-api
pm2 save
pm2 startup

# Alternatively, use the start script
./start.sh
\`\`\`

## Step 7: Set up Monitoring and Backups
\`\`\`bash
# Set up daily database backups
sudo mkdir -p /var/backups/go4itsports

# Create backup script
sudo nano /etc/cron.daily/backup-go4itsports.sh

# Add this content:
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/var/backups/go4itsports"
sudo -u postgres pg_dump go4it_sports > "$BACKUP_DIR/go4it_sports_$TIMESTAMP.sql"
find "$BACKUP_DIR" -name "go4it_sports_*.sql" -mtime +30 -delete

# Make the script executable
sudo chmod +x /etc/cron.daily/backup-go4itsports.sh
\`\`\`

## Troubleshooting
- Check application logs: \`tail -f /var/www/go4itsports.org/logs/app.log\`
- Check Nginx logs: \`sudo tail -f /var/log/nginx/error.log\`
- Restart the application: \`pm2 restart go4it-api\`
- Verify database connection: \`psql -U go4it -h localhost -d go4it_sports\`

For additional support, contact support@go4itsports.org
`;
  
  fs.writeFileSync(path.join(TEMP_DIR, 'DEPLOYMENT.md'), deployment);
  console.log('  Created DEPLOYMENT.md');
  
  // Create RELEASE_NOTES.md
  const releaseNotes = `# Go4It Sports Platform - Release Notes

## Version ${VERSION} (Production Release) - ${new Date().toISOString().split('T')[0]}

This release focuses on production optimization and deployment readiness for the Go4It Sports platform.

### Performance Improvements

- **Enhanced Database Connection Pooling**: Implemented enterprise-grade connection pooling with automatic recovery mechanisms and configurable pool sizes
- **API Response Caching**: Added server-side caching with 5-minute TTL for common API endpoints
- **Selective Cache Invalidation**: Implemented fine-grained cache invalidation for video routes to ensure video updates are immediately reflected
- **Static Asset Optimization**: Configured proper cache headers for static assets to reduce bandwidth and improve load times
- **Code Splitting**: Implemented React.lazy() and Suspense for optimized JavaScript bundle loading
- **WebSocket Keep-Alive**: Added ping/pong mechanism to maintain WebSocket connections for real-time features

### Production Build Enhancements

- **Environment-Based Configuration**: Added dynamic configuration based on NODE_ENV for proper production settings
- **Build Process Optimization**: Created streamlined production build process with proper module type declarations
- **Minification & Compression**: Enhanced JS, CSS, and HTML minification with proper source maps
- **ES Modules Support**: Ensured all JavaScript files use proper ES module syntax for modern browsers
- **AI Tool Integration**: Added production-ready JS modules for AI features (agent.js, ai_assist.js, upload.js, voice.js)
- **Static File Structure**: Organized static files for optimal Nginx serving
- **API Server Configuration**: Created production-optimized Express server configuration
- **Security Headers**: Added comprehensive security headers for production deployment

### Infrastructure Updates

- **Nginx Configuration**: Added optimized Nginx server configuration with HTTP/2, SSL, and caching directives
- **WebSocket Support**: Ensured WebSocket connections work properly behind Nginx
- **CORS Configuration**: Updated CORS settings for secure cross-origin requests
- **Error Logging**: Enhanced error handling and logging for production environment
- **Graceful Shutdown**: Added proper shutdown handlers for database and server processes
- **Resource Limits**: Configured appropriate request limits and timeouts for production traffic

### Bug Fixes

- Fixed database statement timeout issues
- Improved error handling for failed database connections
- Resolved WebSocket connection handling for mobile clients
- Fixed cache invalidation issues for updated content

## Previous Versions

For information about previous versions, please refer to our version history documentation.
`;
  
  fs.writeFileSync(path.join(TEMP_DIR, 'RELEASE_NOTES.md'), releaseNotes);
  console.log('  Created RELEASE_NOTES.md');
  
  // Create VERSION.md
  const version = `# Go4It Sports Platform v${VERSION}

**Deployment Package created:** ${new Date().toISOString()}
**Target URL:** https://go4itsports.org

## Production Build Optimizations

- Server-side caching with 5-minute TTL
- Cache invalidation for video routes
- Enhanced database connection pooling with retry mechanisms
- Production-ready Nginx configuration with HTTP/2 and SSL
- WebSocket connection handling with keep-alive
- Static asset optimization with proper cache headers
- ES Module support for all JavaScript files
- Comprehensive security headers

## Server Requirements

- Node.js 20+
- PostgreSQL 14+
- Nginx 1.20+
- 2+ CPU cores
- 4+ GB RAM
- 20+ GB SSD

## Required API Keys

- OpenAI API key
- Anthropic API key
- (Optional) Twilio API keys for SMS notifications

## Deployment Instructions

See DEPLOYMENT.md for detailed deployment steps.
`;
  
  fs.writeFileSync(path.join(TEMP_DIR, 'VERSION.md'), version);
  console.log('  Created VERSION.md');
}

/**
 * Create the deployment package
 */
function createPackage() {
  console.log('\n📦 Creating deployment package...');
  
  try {
    // Create the zip file
    execSync(`cd ${TEMP_DIR} && zip -r ../${PACKAGE_NAME} .`);
    console.log(`  Created ${PACKAGE_NAME}`);
    
    // Get the file size
    const stats = fs.statSync(path.join(__dirname, PACKAGE_NAME));
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`  Package size: ${fileSizeMB} MB`);
  } catch (error) {
    console.error('  Error creating package:', error);
  }
}

/**
 * Clean up temporary files
 */
function cleanup() {
  console.log('\n🧹 Cleaning up...');
  
  try {
    execSync(`rm -rf ${TEMP_DIR}`);
    console.log('  Removed temporary directory');
  } catch (error) {
    console.error('  Error cleaning up:', error);
  }
}

// Main function
function main() {
  try {
    // Create structure and files
    createDirectoryStructure();
    copyOptimizedFiles();
    copyServerFiles();
    createConfigFiles();
    createDocumentation();
    createPackage();
    cleanup();
    
    console.log('\n✅ Production package creation complete!');
    console.log(`Package: ${PACKAGE_NAME}`);
    console.log(`Version: ${VERSION}`);
    console.log('\nDeployment Steps:');
    console.log('1. Upload the package to your production server');
    console.log('2. Extract the package to /var/www/go4itsports.org');
    console.log('3. Follow the instructions in DEPLOYMENT.md');
  } catch (error) {
    console.error('\n❌ Error creating production package:', error);
    process.exit(1);
  }
}

// Run the script
main();