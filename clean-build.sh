#!/bin/bash

# Clean build artifacts and optimize for deployment
echo "🧹 Cleaning build artifacts for deployment..."

# Remove build artifacts
rm -rf .next
rm -rf out
rm -rf dist
rm -f *.tsbuildinfo
rm -f build-error.log
rm -rf node_modules/.cache

# Clean npm cache
npm cache clean --force

# Remove development files
rm -rf attached_assets
rm -rf ai-models
rm -rf temp
rm -rf tmp
rm -rf logs/*.log

# Remove large video files
find . -name "*.mov" -delete
find . -name "*.mp4" -delete 2>/dev/null || true
find . -name "*.avi" -delete 2>/dev/null || true

# Clean up documentation files (keep README.md)
find . -name "*.md" -not -name "README.md" -not -name "replit.md" -delete

echo "✅ Build artifacts cleaned successfully"