#!/bin/bash

# Go4It Sports Deployment Script
# This script prepares and deploys the Go4It Sports platform to go4itsports.org

echo "==============================================="
echo "   Go4It Sports Deployment - $(date)"
echo "==============================================="

# Ensure script fails on any command error
set -e

# Configuration
DEPLOY_DIR="go4it_deployment_$(date +%Y%m%d_%H%M%S)"
SERVER_URL="go4itsports.org"
SSH_USER="deploy"

# Create deployment directory
echo "Creating deployment directory..."
mkdir -p $DEPLOY_DIR

# Copy server files
echo "Copying server files..."
cp server.js $DEPLOY_DIR/
cp deployment-config.js $DEPLOY_DIR/

# Create client build
echo "Building client application..."
mkdir -p $DEPLOY_DIR/client
cp -r client/src $DEPLOY_DIR/client/
cp -r client/public $DEPLOY_DIR/client/
mkdir -p $DEPLOY_DIR/client/dist

# Copy essential files
echo "Copying essential files..."
cp -r client/index.html $DEPLOY_DIR/client/
cp -r client/dashboard.html $DEPLOY_DIR/client/
cp -r client/auth.html $DEPLOY_DIR/client/

# Install dependencies
echo "Preparing package configuration..."
cat > $DEPLOY_DIR/package.json << EOF
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
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Create README
echo "Creating deployment documentation..."
cat > $DEPLOY_DIR/README.md << EOF
# Go4It Sports Platform

This is the deployment package for the Go4It Sports platform.

## Setup Instructions

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Configure environment variables:
   - Create a .env file with the following variables:
     \`\`\`
     PORT=5000
     DATABASE_URL=your_supabase_database_url
     SENTINEL_API_KEY=your_sentinel_security_key
     JWT_SECRET=your_jwt_secret
     \`\`\`

3. Start the server:
   \`\`\`
   npm start
   \`\`\`

## Features
- Mobile-first design for athletes of all economic backgrounds
- Video analysis with GAR scoring
- Academic integration with NCAA tracking
- Black and blue theme with white toggle option
- Sentinel cybersecurity integration
- Supabase database integration

## Support
For support, contact support@go4itsports.org
EOF

# Create deployment package
echo "Creating deployment package..."
zip -r "${DEPLOY_DIR}.zip" $DEPLOY_DIR

echo "==============================================="
echo " Deployment package created: ${DEPLOY_DIR}.zip"
echo "==============================================="
echo ""
echo "To deploy to go4itsports.org:"
echo "1. Upload the package to your server"
echo "2. Extract the package: unzip ${DEPLOY_DIR}.zip"
echo "3. Navigate to the directory: cd $DEPLOY_DIR"
echo "4. Install dependencies: npm install"
echo "5. Start the server: npm start (or use PM2/systemd for production)"
echo ""
echo "For automated deployment:"
echo "scp ${DEPLOY_DIR}.zip $SSH_USER@$SERVER_URL:/var/www/"
echo "ssh $SSH_USER@$SERVER_URL 'cd /var/www/ && unzip ${DEPLOY_DIR}.zip && cd $DEPLOY_DIR && npm install && pm2 restart go4it-sports'"
echo ""