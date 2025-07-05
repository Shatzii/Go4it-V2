#!/bin/bash

# Go4It Sports Platform - Production Build Script
echo "🏗️  Building Go4It Sports Platform for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Prepare production server
echo "⚙️  Preparing production server..."
cp server.js dist/server.js 2>/dev/null || echo "Using existing server.js"

echo "✅ Build complete - ready for deployment!"
