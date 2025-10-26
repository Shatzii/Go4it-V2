#!/bin/bash

echo "=========================================="
echo "  Starting GO4IT Hybrid System (Replit)"
echo "=========================================="
echo ""

# Get the port from Replit environment
PORT=${PORT:-5000}
MEDIAPIPE_PORT=$((PORT + 1))

echo "🌐 Next.js will run on port: $PORT"
echo "🤖 MediaPipe will run on port: $MEDIAPIPE_PORT"
echo ""

# Start MediaPipe service in background
echo "🚀 Starting MediaPipe service..."
cd mediapipe-service

# Check if virtual environment exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Update MediaPipe service port
python3 <<EOF
import re

with open('app.py', 'r') as f:
    content = f.read()

# Replace the port in the app.run line
content = re.sub(
    r"app\.run\(host='0\.0\.0\.0', port=\d+",
    f"app.run(host='0.0.0.0', port=$MEDIAPIPE_PORT",
    content
)

with open('app.py', 'w') as f:
    f.write(content)

print("✅ MediaPipe configured for port $MEDIAPIPE_PORT")
EOF

# Start MediaPipe in background
python3 app.py > ../mediapipe.log 2>&1 &
MEDIAPIPE_PID=$!
echo "✅ MediaPipe service started (PID: $MEDIAPIPE_PID)"

cd ..

# Set environment variable for Next.js to find MediaPipe
export MEDIAPIPE_SERVICE_URL="http://localhost:$MEDIAPIPE_PORT"

# Wait for MediaPipe to start
echo "⏳ Waiting for MediaPipe service to initialize..."
sleep 5

# Check if MediaPipe started successfully
if curl -s "http://localhost:$MEDIAPIPE_PORT/health" > /dev/null 2>&1; then
    echo "✅ MediaPipe service is healthy"
else
    echo "⚠️  MediaPipe service may not be running"
    echo "   Check mediapipe.log for errors"
    echo "   System will fall back to GPT-4o only mode"
fi

echo ""
echo "🚀 Starting Next.js application..."
echo "=========================================="
echo ""

# Start Next.js
npm run dev:replit

# Cleanup on exit
trap "kill $MEDIAPIPE_PID 2>/dev/null" EXIT
