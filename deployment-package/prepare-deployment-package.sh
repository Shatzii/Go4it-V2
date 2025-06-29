#!/bin/bash
# Script to prepare a complete deployment package for Go4It Sports Platform

# Stop on first error
set -e

echo "===== Preparing Go4It Sports Deployment Package ====="
echo "This script will create a complete deployment package for your production server"

# Set variables
PACKAGE_NAME="go4it-sports-deployment"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PACKAGE_FILENAME="${PACKAGE_NAME}-${TIMESTAMP}.zip"
TEMP_DIR="deployment_temp"

# Create temporary directory
echo "Creating temporary directory..."
mkdir -p "$TEMP_DIR"

# Copy essential files
echo "Copying essential files..."

# Source code (excluding node_modules, logs, and other unnecessary files)
echo "Copying source code..."
rsync -av --progress ./ "$TEMP_DIR/" \
  --exclude node_modules \
  --exclude .git \
  --exclude logs \
  --exclude .DS_Store \
  --exclude "*.log" \
  --exclude temp_extract \
  --exclude attached_assets \
  --exclude "$TEMP_DIR" \
  --exclude "*.zip"

# Create necessary directories that should exist in production
echo "Creating necessary directories..."
mkdir -p "$TEMP_DIR/logs"
mkdir -p "$TEMP_DIR/uploads"

# Create a sample .env file with placeholders
echo "Creating sample .env file..."
cat > "$TEMP_DIR/.env.sample" << EOF
# Database connection
DATABASE_URL=postgresql://username:password@localhost:5432/go4it_sports
PGHOST=localhost
PGUSER=username
PGPASSWORD=password
PGDATABASE=go4it_sports
PGPORT=5432

# Environment settings
NODE_ENV=production
PORT=81

# API Keys (replace with actual keys)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Optional: Twilio for SMS notifications
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Optional: Social media API credentials
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
EOF

# Create a README file specifically for deployment
echo "Creating deployment README..."
cat > "$TEMP_DIR/DEPLOY_README.md" << EOF
# Go4It Sports Platform Deployment Package

This package contains everything needed to deploy the Go4It Sports platform to your production server.

## Quick Start

1. **Unzip the package on your server**
   \`\`\`bash
   unzip ${PACKAGE_FILENAME} -d /var/www/go4it
   cd /var/www/go4it
   \`\`\`

2. **Configure environment variables**
   \`\`\`bash
   cp .env.sample .env
   # Edit .env with your actual values
   nano .env
   \`\`\`

3. **Set up the database**
   Follow instructions in DEPLOYMENT.md

4. **Deploy the application**
   \`\`\`bash
   chmod +x deploy-production.sh
   ./deploy-production.sh
   \`\`\`

5. **Verify the deployment**
   - Check the application is running: \`curl http://localhost:81\`
   - View logs: \`tail -f logs/server.log\`

For complete instructions, see DEPLOYMENT.md and DEPLOYMENT_CHECKLIST.md
EOF

# Create deployment version info file
echo "Creating version info file..."
VERSION_DATE=$(date "+%Y-%m-%d %H:%M:%S")
GIT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "Not a git repository")
cat > "$TEMP_DIR/deployment-version.txt" << EOF
Go4It Sports Platform
Deployment Package created: $VERSION_DATE
Git commit: $GIT_COMMIT
Package timestamp: $TIMESTAMP
EOF

# Make all scripts executable
echo "Setting executable permissions on scripts..."
find "$TEMP_DIR" -name "*.sh" -type f -exec chmod +x {} \;

# Create zip archive
echo "Creating deployment package..."
cd "$TEMP_DIR"
zip -r "../$PACKAGE_FILENAME" .
cd ..

# Cleanup temporary directory
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "===== Deployment Package Creation Complete ====="
echo "Package created: $PACKAGE_FILENAME"
echo "1. Transfer this package to your production server at 5.161.99.81"
echo "2. Follow the instructions in DEPLOY_README.md to complete the deployment"