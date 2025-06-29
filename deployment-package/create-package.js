/**
 * Go4It Sports Package Creator
 * 
 * This script creates a downloadable ZIP file of the entire application.
 */
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'package');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create a file to stream archive data to
const outputPath = path.join(outputDir, 'go4it-sports-complete.zip');
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log(`Package created successfully! (${archive.pointer()} total bytes)`);
  console.log(`File saved to: ${outputPath}`);
  console.log('You can now download this file from the Files panel in Replit.');
});

// Handle archive warnings
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

// Handle archive errors
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Define directories to include
const directories = [
  { src: 'client', dest: 'client' },
  { src: 'server', dest: 'server' },
  { src: 'shared', dest: 'shared' }
];

// Files to exclude (patterns)
const excludePatterns = [
  /node_modules/,
  /\.git/,
  /\.env/,
  /package-lock\.json$/,
  /\.log$/,
  /\.zip$/,
  /tmp/,
  /temp/,
  /\.DS_Store$/,
  /thumbs\.db$/
];

// Function to check if a file should be excluded
function shouldExclude(filePath) {
  return excludePatterns.some(pattern => pattern.test(filePath));
}

// Add directories to archive
directories.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    // Add directory
    archive.directory(src, dest, (data) => {
      // Filter out excluded files
      if (shouldExclude(data.name)) {
        return false;
      }
      return data;
    });
    console.log(`Added directory: ${src} → ${dest}`);
  } else {
    console.warn(`Warning: Directory "${src}" does not exist and will be skipped.`);
  }
});

// Add individual files
const individualFiles = [
  'package.json',
  'drizzle.config.ts',
  '.env.example',
  'README.md'
];

individualFiles.forEach(file => {
  if (fs.existsSync(file)) {
    archive.file(file, { name: file });
    console.log(`Added file: ${file}`);
  }
});

// Add deployment scripts and configuration
const deploymentFiles = [
  { src: 'deploy.sh', name: 'deploy/deploy.sh' },
  { src: 'ecosystem.config.js', name: 'deploy/ecosystem.config.js' }
];

deploymentFiles.forEach(({ src, name }) => {
  if (fs.existsSync(src)) {
    archive.file(src, { name });
    console.log(`Added deployment file: ${src} → ${name}`);
  }
});

// Create a simple installation guide
const installGuide = `
# Go4It Sports Installation Guide

## Deployment to Your Server

Follow these steps to deploy the application to your server:

1. Upload and extract this package to your server:
   \`\`\`bash
   scp go4it-sports-complete.zip user@your-server:/var/www/
   ssh user@your-server
   cd /var/www/
   unzip go4it-sports-complete.zip -d go4itsports
   cd go4itsports
   \`\`\`

2. Set up the directory structure:
   \`\`\`bash
   mkdir -p client server shared backup deploy
   cp -r client/* client/
   cp -r server/* server/
   cp -r shared/* shared/
   cp -r deploy/* deploy/
   chmod -R 755 .
   chmod +x deploy/deploy.sh
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   cd server
   npm install
   \`\`\`

4. Configure environment variables:
   \`\`\`bash
   cp .env.example .env
   nano .env
   # Set your database connection and API keys
   \`\`\`

5. Start the application with PM2:
   \`\`\`bash
   npm install -g pm2
   pm2 start deploy/ecosystem.config.js
   pm2 save
   pm2 startup
   \`\`\`

6. Configure Nginx:
   \`\`\`bash
   # Create an Nginx configuration file for your domain
   nano /etc/nginx/sites-available/yourdomain.com
   # Add the configuration provided below
   
   # Enable the site
   ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   \`\`\`

7. Set up SSL with Certbot:
   \`\`\`bash
   apt-get update
   apt-get install -y certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   \`\`\`

## Nginx Configuration Example

\`\`\`
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL configuration will be added by Certbot
    
    # Client files
    root /var/www/go4itsports/client;
    index index.html;
    
    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

## Troubleshooting

If you encounter any issues:

1. Check Nginx logs: \`tail -f /var/log/nginx/error.log\`
2. Check PM2 logs: \`pm2 logs\`
3. Make sure all environment variables are properly set
4. Verify permissions: \`chmod -R 755 /var/www/go4itsports\`

For additional support, please contact support@go4itsports.org
`;

archive.append(installGuide, { name: 'INSTALL.md' });
console.log('Added installation guide: INSTALL.md');

// Create a basic ecosystem.config.js if it doesn't exist
if (!fs.existsSync('ecosystem.config.js')) {
  const ecosystemConfig = `
module.exports = {
  apps: [{
    name: "go4itsports",
    script: "/var/www/go4itsports/server/index.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 5000
    }
  }]
};
`;
  archive.append(ecosystemConfig, { name: 'deploy/ecosystem.config.js' });
  console.log('Created and added missing file: deploy/ecosystem.config.js');
}

// Create a basic deploy.sh if it doesn't exist
if (!fs.existsSync('deploy.sh')) {
  const deployScript = `#!/bin/bash

# Go4It Sports Deployment Script
CLIENT_PATH="/var/www/go4itsports/client"
SERVER_PATH="/var/www/go4itsports/server"
SHARED_PATH="/var/www/go4itsports/shared"
BACKUP_PATH="/var/www/go4itsports/backup"

# Create backup
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_PATH}/backup_${BACKUP_DATE}.zip"
echo "Creating backup to ${BACKUP_FILE}"
zip -r "${BACKUP_FILE}" "${CLIENT_PATH}" "${SERVER_PATH}" "${SHARED_PATH}" > /dev/null 2>&1

# Set permissions after deployment
echo "Setting permissions..."
find "${CLIENT_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${CLIENT_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null
find "${SERVER_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${SERVER_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null
find "${SERVER_PATH}" -name "*.sh" -exec chmod 755 {} \; 2>/dev/null
find "${SHARED_PATH}" -type d -exec chmod 755 {} \; 2>/dev/null
find "${SHARED_PATH}" -type f -exec chmod 644 {} \; 2>/dev/null

# Restart the application
echo "Restarting the application..."
cd "${SERVER_PATH}"
pm2 restart go4itsports || pm2 start /var/www/go4itsports/deploy/ecosystem.config.js

echo "Deployment process completed"
`;
  archive.append(deployScript, { name: 'deploy/deploy.sh' });
  console.log('Created and added missing file: deploy/deploy.sh');
}

// Create a .env.example file if it doesn't exist
if (!fs.existsSync('.env.example')) {
  const envExample = `# Database Connection
DATABASE_URL=postgres://username:password@localhost:5432/go4itsports

# Server Configuration
PORT=5000
NODE_ENV=production

# API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Session Secret
SESSION_SECRET=your_session_secret_here

# Deployment Settings
SITE_URL=https://go4itsports.org
`;
  archive.append(envExample, { name: '.env.example' });
  console.log('Created and added missing file: .env.example');
}

// Finalize the archive
archive.finalize();