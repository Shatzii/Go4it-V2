#!/bin/bash
# Production Deployment Package Script for Go4It Sports Platform
# This script creates a complete production-ready deployment package for https://go4itsports.org

set -e

echo "===== Creating Go4It Sports Production Deployment Package ====="
echo "Target: https://go4itsports.org"

# Set variables
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PACKAGE_NAME="go4it-deployment-${TIMESTAMP}.zip"
TEMP_DIR="deployment_temp"
VERSION="1.0.1"

# Create temporary directory
echo "Creating temporary directory..."
mkdir -p "$TEMP_DIR"
mkdir -p "$TEMP_DIR/logs"
mkdir -p "$TEMP_DIR/uploads/videos"
mkdir -p "$TEMP_DIR/uploads/images"
mkdir -p "$TEMP_DIR/uploads/athletes"
mkdir -p "$TEMP_DIR/dist"
mkdir -p "$TEMP_DIR/dist/assets"
mkdir -p "$TEMP_DIR/dist/uploads"

# Run the production build process
echo "Running Vite production build..."
export NODE_ENV=production
node vite-production-build.cjs || {
  echo "Build failed! Check errors above."
  exit 1
}

echo "Copying essential files..."
# Copy built files if they exist, otherwise copy source
if [ -d "dist" ]; then
  cp -r dist/* "$TEMP_DIR/dist/"
  echo "  ✓ Copied built dist files"
else
  cp -r client "$TEMP_DIR/"
  echo "  ✓ Copied client source (dist not found)"
fi

# Copy server and supporting files
cp -r server "$TEMP_DIR/"
cp -r shared "$TEMP_DIR/"
cp -r scripts "$TEMP_DIR/"
cp package.json package-lock.json "$TEMP_DIR/"
cp tsconfig.json "$TEMP_DIR/"
cp nginx-production.conf "$TEMP_DIR/"
cp deploy-production.sh "$TEMP_DIR/"
cp FINAL_DEPLOYMENT_CHECKLIST.md "$TEMP_DIR/"
cp DEPLOYMENT.md "$TEMP_DIR/"
cp RELEASE_NOTES.md "$TEMP_DIR/"

# Copy optimized AI modules
echo "Setting up AI modules..."
mkdir -p "$TEMP_DIR/dist/js"
cp client/src/lib/agent.js "$TEMP_DIR/dist/js/"
cp client/src/lib/ai_assist.js "$TEMP_DIR/dist/js/"
cp client/src/lib/upload.js "$TEMP_DIR/dist/js/"
cp client/src/lib/voice.js "$TEMP_DIR/dist/js/"
cp client/src/lib/ai-loader.js "$TEMP_DIR/dist/js/"

# Copy production-specific server files
echo "Setting up production server files..."
cp server/production-server.js "$TEMP_DIR/server/"
cp .env.production "$TEMP_DIR/"

# Create deployment version info file
echo "Creating version info file..."
VERSION_DATE=$(date "+%Y-%m-%d %H:%M:%S")
cat > "$TEMP_DIR/VERSION.md" << EOF
# Go4It Sports Platform v${VERSION}

**Deployment Package created:** ${VERSION_DATE}
**Package timestamp:** ${TIMESTAMP}
**Target URL:** https://go4itsports.org

## Performance Optimizations

- Server-side caching with 5-minute TTL
- Cache invalidation for video routes
- Enhanced database connection pooling with retry mechanisms
- Code splitting with React.lazy() and Suspense
- Production-ready Nginx configuration with HTTP/2 and SSL
- WebSocket connection handling with keep-alive
- Static asset optimization with proper cache headers
- ES Module support for all JavaScript files

## Deployment Instructions

See FINAL_DEPLOYMENT_CHECKLIST.md for detailed deployment steps.

## Production Environment Requirements

- Node.js 20+
- PostgreSQL 14+
- Nginx 1.20+
- 2+ CPU cores
- 4+ GB RAM
- 20+ GB SSD

## API Keys Required

- OpenAI API key
- Anthropic API key
- (Optional) Twilio API keys for SMS notifications
EOF

# Create a production .env file with placeholders
echo "Creating production .env file..."
cp .env.production "$TEMP_DIR/.env.production"

# Create startup script for production
echo "Creating production startup script..."
cat > "$TEMP_DIR/start-production.sh" << EOF
#!/bin/bash
# Production startup script for Go4It Sports Platform

# Ensure we're in the script directory
cd "\$(dirname "\$0")"

# Load environment variables
if [ -f .env ]; then
  export \$(grep -v '^#' .env | xargs)
fi

# Check if NODE_ENV is set
if [ -z "\$NODE_ENV" ]; then
  export NODE_ENV=production
fi

# Start the server
echo "Starting Go4It Sports Platform in \$NODE_ENV mode..."
node server/production-server.js
EOF
chmod +x "$TEMP_DIR/start-production.sh"

# Create zip archive
echo "Creating deployment package..."
cd "$TEMP_DIR"
zip -r "../$PACKAGE_NAME" .
cd ..

# Calculate package size
PACKAGE_SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)

# Cleanup
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "===== Deployment Package Creation Complete ====="
echo "Package created: $PACKAGE_NAME (Size: $PACKAGE_SIZE)"
echo "Version: $VERSION"
echo ""
echo "Deployment Steps:"
echo "1. Transfer $PACKAGE_NAME to your production server"
echo "2. Extract the package on the server"
echo "3. Follow the instructions in FINAL_DEPLOYMENT_CHECKLIST.md"
echo "4. Configure Nginx using nginx-production.conf"
echo "5. Start the API server with ./start-production.sh"