#!/bin/bash
# build-production.sh - Build the application for production

set -e

echo "🏗️  Building Go4it v2.1 for production..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next out node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies (this may take a few minutes)..."
npm ci --production=false --legacy-peer-deps

# Generate database client
echo "⚙️  Generating database client..."
if [ -f "drizzle.config.ts" ]; then
  npm run db:generate
else
  echo "⚠️  No drizzle.config.ts found, skipping..."
fi

# Build Next.js
echo "🔨 Building Next.js application..."
NODE_ENV=production npm run build

# Check build output
if [ ! -d ".next" ]; then
  echo "❌ Build failed - .next directory not created"
  exit 1
fi

# Build size analysis
echo ""
echo "📊 Build Analysis:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
du -sh .next
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count files
echo "Total files: $(find .next -type f | wc -l)"
echo "JavaScript files: $(find .next -name "*.js" | wc -l)"

# Check for large files
echo ""
echo "📦 Large files (>1MB):"
find .next -type f -size +1M -exec ls -lh {} \; | awk '{ print $9 ": " $5 }'

echo ""
echo "✅ Build complete!"
echo ""
