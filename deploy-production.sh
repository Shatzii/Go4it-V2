#!/bin/bash
# Deployment script for Go4It Sports platform on production server (5.16.1.9:81)

# Stop execution on any error
set -e

echo "===== Go4It Sports Production Deployment ====="
echo "Target: 5.16.1.9:81"
echo "Beginning deployment process..."

# Set NODE_ENV to production
export NODE_ENV=production

# Create necessary directories if they don't exist
echo "Creating necessary directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p build

# Install dependencies
echo "Installing dependencies..."
npm ci --production

# Build the application
echo "Building application..."
npm run build

# Check if an existing server process is running on port 81
echo "Checking for existing processes on port 81..."
if lsof -i:81 -t &> /dev/null; then
  echo "Stopping existing server on port 81..."
  kill $(lsof -i:81 -t) || true
  # Give it a moment to shut down
  sleep 2
fi

# Start the application in the background
echo "Starting application on port 81..."
NODE_ENV=production PORT=81 nohup node server/index.js > logs/server.log 2>&1 &

# Capture the process ID
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"

# Wait a moment and check if process is still running
sleep 3
if kill -0 $SERVER_PID 2>/dev/null; then
  echo "Server is running successfully!"
  echo "You can view logs with: tail -f logs/server.log"
  echo "===== Deployment Completed Successfully ====="
else
  echo "ERROR: Server failed to start properly."
  echo "Check logs in logs/server.log for details."
  echo "===== Deployment Failed ====="
  exit 1
fi