#!/bin/bash

# Go4It Sports Platform Startup Script
# This script starts the application on port 5000 as required by the Replit workflow

echo "🚀 Starting Go4It Sports Platform..."
echo "🌐 Starting server on port 5000 for Replit compatibility..."

# Set environment variables
export PORT=5000
export HOSTNAME=0.0.0.0
export NODE_ENV=development

# Start the custom Next.js server
node server.js