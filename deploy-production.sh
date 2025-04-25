#!/bin/bash
# Production deployment script for Go4It Sports
# This script creates a production-ready build for deployment to go4itsports.org

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Go4It Sports Production Deployment ==="
echo "Target: https://go4itsports.org"
echo "====================================="

# Ensure we're in the project root
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    exit 1
fi

# Set environment to production
export NODE_ENV=production

# Step 1: Install dependencies
echo "📦 Installing production dependencies..."
npm ci --production

# Step 2: Run the build process
echo "🏗️ Building for production..."
node vite-production-build.js

# Step 3: Verify build
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed: index.html not found in dist directory"
    exit 1
fi

echo "✅ Build verification passed"

# Step 4: Create a zip archive for easy deployment
echo "📦 Creating deployment package..."
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PACKAGE_NAME="go4it-sports-$TIMESTAMP.zip"

(cd dist && zip -r "../$PACKAGE_NAME" .)

echo "✅ Deployment package created: $PACKAGE_NAME"

# Step 5: Display deployment instructions
echo ""
echo "=== DEPLOYMENT INSTRUCTIONS ==="
echo "1. Transfer $PACKAGE_NAME to your production server"
echo "2. Unzip the contents to /var/www/go4itsports.org/"
echo "3. Configure Nginx using the included nginx.conf"
echo "4. Set up environment variables using .env.example"
echo "5. Start the API server with: node api/server.js"
echo ""
echo "For detailed instructions, see dist/DEPLOYMENT.md"
echo ""

echo "✅ Production build and deployment package complete!"