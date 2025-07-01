#!/bin/bash

echo "🚀 Starting Pharaoh Control Panel 2.0..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Environment file not found. Please run ./install.sh first"
    exit 1
fi

# Build the application
echo "🏗️  Building application..."
npm run build

# Start the application
echo "▶️  Starting server..."
npm run start
