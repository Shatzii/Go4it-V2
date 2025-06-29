#!/bin/bash

# Go4It Sports Platform - Direct Build Script
# This script builds the Go4It Sports platform without needing to unzip first

echo "==============================================="
echo "   Go4It Sports Platform Builder"
echo "   $(date)"
echo "==============================================="

# Configuration
BUILD_DIR="go4it_build"
DEPLOY_DIR="/var/www/go4itsports.org"
LOG_FILE="build.log"

# Create log file
echo "Build started at $(date)" > $LOG_FILE

# Create build directory
echo "Creating build directory..."
mkdir -p $BUILD_DIR
echo "Created build directory: $BUILD_DIR" >> $LOG_FILE

# Install required dependencies
echo "Installing dependencies..."
npm install --no-package-lock >> $LOG_FILE 2>&1

# Build the client application
echo "Building client application..."
cd client
echo "  - Installing client dependencies..." 
npm install --no-package-lock >> ../$LOG_FILE 2>&1
echo "  - Running build process..."
npm run build >> ../$LOG_FILE 2>&1
cd ..

# Create server configuration
echo "Creating server configuration..."
mkdir -p $BUILD_DIR/config
cat > $BUILD_DIR/config/production.json << EOF
{
  "port": 5000,
  "dbUrl": "${DATABASE_URL}",
  "sentinelApiKey": "${SENTINEL_API_KEY}",
  "jwtSecret": "${JWT_SECRET:-go4it-sports-secret-key}"
}
EOF
echo "Created server configuration" >> $LOG_FILE

# Copy server files
echo "Copying server files..."
cp server.js $BUILD_DIR/
cp -r server $BUILD_DIR/
echo "Copied server files" >> $LOG_FILE

# Copy client build
echo "Copying client build..."
mkdir -p $BUILD_DIR/client
cp -r client/dist $BUILD_DIR/client/
echo "Copied client build" >> $LOG_FILE

# Create nginx configuration
echo "Creating nginx configuration..."
cat > $BUILD_DIR/go4itsports.nginx.conf << EOF
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
echo "Created nginx configuration" >> $LOG_FILE

# Create systemd service file
echo "Creating systemd service file..."
cat > $BUILD_DIR/go4itsports.service << EOF
[Unit]
Description=Go4It Sports Platform
After=network.target

[Service]
WorkingDirectory=$DEPLOY_DIR
ExecStart=/usr/bin/node server.js
Restart=always
User=www-data
Group=www-data
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
EOF
echo "Created systemd service file" >> $LOG_FILE

# Create deployment instructions
echo "Creating deployment instructions..."
cat > $BUILD_DIR/DEPLOY.md << EOF
# Go4It Sports Deployment Instructions

## Quick Deployment Steps

1. Copy all files to your server:
   \`\`\`
   rsync -avz $BUILD_DIR/ user@go4itsports.org:$DEPLOY_DIR/
   \`\`\`

2. Install dependencies on server:
   \`\`\`
   cd $DEPLOY_DIR
   npm install --production
   \`\`\`

3. Set up Nginx:
   \`\`\`
   sudo cp go4itsports.nginx.conf /etc/nginx/sites-available/go4itsports
   sudo ln -s /etc/nginx/sites-available/go4itsports /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   \`\`\`

4. Set up systemd service:
   \`\`\`
   sudo cp go4itsports.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable go4itsports
   sudo systemctl start go4itsports
   \`\`\`

5. Set up SSL with Let's Encrypt:
   \`\`\`
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org
   \`\`\`

## Monitoring

- Check application status: \`sudo systemctl status go4itsports\`
- View logs: \`sudo journalctl -u go4itsports -f\`
EOF
echo "Created deployment instructions" >> $LOG_FILE

# Create package file
echo "Creating package.json for deployment..."
cat > $BUILD_DIR/package.json << EOF
{
  "name": "go4it-sports",
  "version": "1.0.0",
  "description": "Sports analytics platform for neurodivergent student athletes",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF
echo "Created package.json" >> $LOG_FILE

# Create .env file template
echo "Creating .env template..."
cat > $BUILD_DIR/.env.example << EOF
# Go4It Sports Environment Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL=your_supabase_database_url

# Security Configuration
JWT_SECRET=your_jwt_secret
SENTINEL_API_KEY=your_sentinel_api_key
EOF
echo "Created .env template" >> $LOG_FILE

echo "==============================================="
echo " Build complete! Files available in: $BUILD_DIR"
echo "==============================================="
echo ""
echo "To deploy to go4itsports.org:"
echo "1. Copy files to your server: rsync -avz $BUILD_DIR/ user@go4itsports.org:$DEPLOY_DIR/"
echo "2. Follow the instructions in $BUILD_DIR/DEPLOY.md"
echo ""
echo "For one-command deploy (if you have SSH access):"
echo "./deploy.sh"
echo ""
echo "Build logs available in: $LOG_FILE"