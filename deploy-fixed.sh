#!/bin/bash
export NODE_ENV=production
export PORT=5000
export HOSTNAME=0.0.0.0

# Install dependencies
npm ci --production

# Build with timeout
timeout 240 npm run build || {
  echo "Build timed out, creating standalone server"
  mkdir -p .next
  node build-fix.js
}

# Start server
npm run start
