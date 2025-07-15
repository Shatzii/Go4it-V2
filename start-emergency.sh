#!/bin/bash
export NODE_ENV=production
export PORT=5000
export HOSTNAME=0.0.0.0

echo "🚀 Starting Go4It Sports Platform..."

# Try standard build first
if [ -f ".next/server.js" ]; then
  echo "📦 Using emergency build"
  node .next/server.js
else
  echo "📦 Using npm start"
  npm run start
fi
