#!/bin/bash

# Clean build script for fixing deployment issues
# Usage: ./scripts/clean-build.sh

echo "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

echo "🏗️  Building application..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo "🚀 You can now deploy or run: npm start"
else
  echo "❌ Build failed. Check errors above."
  exit 1
fi
