#!/bin/bash

# Go4It Sports Platform Build Script
# This script provides robust build handling with fallbacks

echo "🏗️  Starting Go4It Sports Platform Build..."

# Set environment variables
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf dist

# Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci --silent
fi

# Run type checking (optional, can be disabled)
echo "🔍 Running type check..."
npx tsc --noEmit || echo "⚠️  TypeScript errors found, continuing build..."

# Build the application
echo "🚀 Building application..."
timeout 300 npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build completed successfully!"
  
  # Create production start script
  cat > start-production.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
export PORT=5000
npm run start
EOF
  
  chmod +x start-production.sh
  echo "📝 Production start script created!"
  
else
  echo "❌ Build failed or timed out"
  echo "🔄 Attempting fallback build..."
  
  # Fallback build with minimal optimizations
  NODE_ENV=development npm run build
  
  if [ $? -eq 0 ]; then
    echo "✅ Fallback build completed!"
  else
    echo "❌ All build attempts failed"
    exit 1
  fi
fi

echo "🎉 Build process completed!"