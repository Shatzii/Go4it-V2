#!/bin/bash

# ==============================================
# GO4IT SPORTS SERVER FILE SELECTOR
# Version: 1.0
# This script determines the best server file to use and configures PM2 accordingly
# ==============================================

echo "===== GO4IT SPORTS SERVER FILE SELECTOR ====="
echo "Started: $(date)"
echo "Current directory: $(pwd)"

# Change to server directory
cd /var/www/go4itsports/server

echo "===== AVAILABLE SERVER FILES ====="
ls -la index*

# Step 1: Identify the best server file to use
echo
echo "===== ANALYZING SERVER FILES ====="

# Priority order for files
PRIORITY_FILES=(
  "production-server.js"  # Production-ready JS file
  "index.fixed.ts"        # Fixed TypeScript file
  "index-fixed.ts"        # Alternative fixed TypeScript file
  "index.js"              # Compiled JavaScript file
  "index.ts"              # TypeScript source file
)

# Start with no selected file
SELECTED_FILE=""
SELECTED_TYPE=""

# Check if there's a designated production server
if [ -f "production-server.js" ]; then
  SELECTED_FILE="production-server.js"
  SELECTED_TYPE="production"
  echo "✅ Found production server file: $SELECTED_FILE"
else
  # Check for the priority files in order
  for file in "${PRIORITY_FILES[@]}"; do
    if [ -f "$file" ]; then
      SELECTED_FILE="$file"
      
      # Determine file type
      if [[ "$file" == *.js ]]; then
        SELECTED_TYPE="javascript"
      elif [[ "$file" == *.ts ]]; then
        SELECTED_TYPE="typescript"
      fi
      
      echo "✅ Selected server file: $SELECTED_FILE (${SELECTED_TYPE})"
      break
    fi
  done
fi

# If no file was selected, use whatever is available
if [ -z "$SELECTED_FILE" ]; then
  # Check for any index file
  for file in index*; do
    if [ -f "$file" ] && [[ "$file" != *.bak ]]; then
      SELECTED_FILE="$file"
      
      # Determine file type
      if [[ "$file" == *.js ]]; then
        SELECTED_TYPE="javascript"
      elif [[ "$file" == *.ts ]]; then
        SELECTED_TYPE="typescript"
      fi
      
      echo "⚠️ No priority file found. Using: $SELECTED_FILE (${SELECTED_TYPE})"
      break
    fi
  done
fi

# If we still don't have a file, exit with error
if [ -z "$SELECTED_FILE" ]; then
  echo "❌ No suitable server file found!"
  exit 1
fi

# Step 2: Prepare the selected file
echo
echo "===== PREPARING SERVER FILE ====="

# If it's a TypeScript file, we need to check if it needs compilation
if [ "$SELECTED_TYPE" == "typescript" ]; then
  echo "TypeScript file selected. Checking if it needs compilation..."
  
  # Check if there's a corresponding .js file that's newer
  JS_FILE="${SELECTED_FILE%.ts}.js"
  
  if [ -f "$JS_FILE" ] && [ "$JS_FILE" -nt "$SELECTED_FILE" ]; then
    echo "✅ Found up-to-date compiled JavaScript file: $JS_FILE"
    SELECTED_FILE="$JS_FILE"
    SELECTED_TYPE="javascript"
  else
    echo "Need to compile TypeScript file..."
    
    # Check if ts-node is installed
    if ! command -v ts-node &> /dev/null; then
      echo "Installing ts-node..."
      npm install -g ts-node typescript
    fi
    
    # Create a starter script to use ts-node
    cat > "../start-ts.js" << EOL
// TypeScript starter
const { spawn } = require('child_process');
const path = require('path');

const tsFile = path.join(__dirname, 'server', '${SELECTED_FILE}');
console.log('Starting TypeScript file:', tsFile);

const tsNode = spawn('npx', ['ts-node', tsFile], {
  stdio: 'inherit',
  env: process.env
});

tsNode.on('error', (err) => {
  console.error('Failed to start ts-node:', err);
});

process.on('SIGINT', () => {
  tsNode.kill('SIGINT');
});

process.on('SIGTERM', () => {
  tsNode.kill('SIGTERM');
});
EOL
    
    SELECTED_FILE="../start-ts.js"
    SELECTED_TYPE="ts-runner"
    echo "✅ Created TypeScript runner script: $SELECTED_FILE"
  fi
fi

# Step 3: Update PM2 to use the selected file
echo
echo "===== UPDATING PM2 CONFIGURATION ====="

# Get the absolute path to the selected file
ABSOLUTE_PATH="$(cd "$(dirname "$SELECTED_FILE")" && pwd)/$(basename "$SELECTED_FILE")"
echo "Using absolute path: $ABSOLUTE_PATH"

# Stop any running PM2 process
pm2 stop go4it-api 2>/dev/null
pm2 delete go4it-api 2>/dev/null

# Start with the selected file
echo "Starting PM2 with selected file: $SELECTED_FILE"
cd ..  # Go back to main directory
pm2 start "$ABSOLUTE_PATH" --name go4it-api --max-memory-restart 500M

# Save PM2 configuration
pm2 save

# Step 4: Verify the server is running
echo
echo "===== VERIFICATION ====="

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Check if server is running on port 5000
if netstat -tulpn | grep -q ":5000"; then
  echo "✅ Server is running on port 5000"
else
  echo "❌ Server is not running on port 5000"
  
  # Check PM2 logs for errors
  echo "PM2 logs:"
  pm2 logs --lines 20 --nostream
fi

# Final status
echo
echo "===== SERVER FILE SELECTION COMPLETE ====="
echo "Selected file: $SELECTED_FILE ($SELECTED_TYPE)"
echo "PM2 Status:"
pm2 list
echo
echo "Completed: $(date)"