#!/bin/bash

# Go4It Sports Platform - Production Start Script
echo "🚀 Starting Go4It Sports Platform in production mode..."

# Set production environment
export NODE_ENV=production
export PORT=5000

# Start the optimized server
node server.js
