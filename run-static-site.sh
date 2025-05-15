#!/bin/bash

# Go4It Sports Static Server Launcher
# This script runs the database-free version of the site

echo "====================================================="
echo "     Starting Go4It Sports Static Site Server        "
echo "====================================================="

# Kill any existing node processes
pkill -f "node start-static-server.js" || true
sleep 1

# Start the server
echo "Starting static server on port 5000..."
node start-static-server.js