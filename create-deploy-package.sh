#!/bin/bash
# Simplified deployment package script for Go4It Sports Platform

set -e

echo "===== Creating Go4It Sports Deployment Package ====="

# Set variables
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PACKAGE_NAME="go4it-deployment-${TIMESTAMP}.zip"
TEMP_DIR="deploy_temp"

# Create temporary directory
echo "Creating temporary directory..."
mkdir -p "$TEMP_DIR"
mkdir -p "$TEMP_DIR/logs"
mkdir -p "$TEMP_DIR/uploads"
mkdir -p "$TEMP_DIR/uploads/videos"

# Copy essential files
echo "Copying essential files..."
cp -r server "$TEMP_DIR/"
cp -r shared "$TEMP_DIR/"
cp -r scripts "$TEMP_DIR/"
cp -r client "$TEMP_DIR/"
cp *.json "$TEMP_DIR/"
cp *.ts "$TEMP_DIR/"
cp *.md "$TEMP_DIR/"
cp deploy-production.sh "$TEMP_DIR/"

# Create deployment version info file
echo "Creating version info file..."
VERSION_DATE=$(date "+%Y-%m-%d %H:%M:%S")
cat > "$TEMP_DIR/deployment-version.txt" << EOF
Go4It Sports Platform
Deployment Package created: $VERSION_DATE
Package timestamp: $TIMESTAMP
Performance optimizations included:
- Server-side caching with 5-minute TTL
- Cache invalidation for video routes
- Enhanced database connection pooling
- Code splitting with React.lazy() and Suspense
EOF

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
EOF

# Create zip archive
echo "Creating deployment package..."
cd "$TEMP_DIR"
zip -r "../$PACKAGE_NAME" .
cd ..

# Cleanup
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "===== Deployment Package Creation Complete ====="
echo "Package created: $PACKAGE_NAME"
echo "1. Transfer this package to your production server"
echo "2. Follow the deployment instructions in DEPLOYMENT.md"