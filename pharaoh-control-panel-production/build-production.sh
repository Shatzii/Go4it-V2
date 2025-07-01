#!/bin/bash

# Pharaoh Control Panel 2.0 - Production Build Script
# This creates a production-ready build of your application

set -e

echo "🏗️  BUILDING PHARAOH CONTROL PANEL FOR PRODUCTION"
echo "================================================="

# Clean previous builds
rm -rf dist/
rm -rf build/

# Install all dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Create production package
echo "📁 Creating production package..."
mkdir -p production-build

# Copy necessary files
cp -r dist/ production-build/
cp package.json production-build/
cp package-lock.json production-build/
cp deploy.sh production-build/
cp production.env production-build/
cp DEPLOYMENT_GUIDE.md production-build/
cp ecosystem.config.js production-build/ 2>/dev/null || echo "ecosystem.config.js will be created during deployment"

# Copy database migration files
mkdir -p production-build/scripts
cp -r scripts/ production-build/ 2>/dev/null || echo "No scripts directory found"

echo "✅ Production build complete!"
echo ""
echo "📦 Your deployment package is ready in ./production-build/"
echo ""
echo "🚀 To deploy to your server:"
echo "1. Upload the production-build folder to your server"
echo "2. Run: chmod +x deploy.sh && ./deploy.sh"
echo "3. Your Pharaoh Control Panel will be live!"