#!/bin/bash

echo "=========================================="
echo "  GO4IT Replit Health Check"
echo "=========================================="
echo ""

# Check if running on Replit
if [ -z "$REPL_ID" ]; then
    echo "⚠️  Not running on Replit"
    echo "This script is designed for Replit environments"
    exit 1
fi

echo "✅ Running on Replit"
echo "   Repl ID: $REPL_ID"
echo "   Repl Slug: $REPL_SLUG"
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check Python
echo ""
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python installed: $PYTHON_VERSION"
else
    echo "❌ Python not found"
    exit 1
fi

# Check MediaPipe service
echo ""
echo "🤖 Checking MediaPipe service..."
if [ -d "mediapipe-service" ]; then
    echo "✅ mediapipe-service directory exists"
    
    if [ -f "mediapipe-service/app.py" ]; then
        echo "✅ app.py found"
    else
        echo "❌ app.py missing"
    fi
    
    if [ -f "mediapipe-service/requirements.txt" ]; then
        echo "✅ requirements.txt found"
    else
        echo "❌ requirements.txt missing"
    fi
else
    echo "❌ mediapipe-service directory not found"
fi

# Check if MediaPipe is running
echo ""
echo "🔍 Checking if services are running..."
MEDIAPIPE_PORT=${MEDIAPIPE_PORT:-5001}
NEXT_PORT=${PORT:-5000}

if curl -s "http://localhost:$MEDIAPIPE_PORT/health" > /dev/null 2>&1; then
    echo "✅ MediaPipe service is running on port $MEDIAPIPE_PORT"
    MEDIAPIPE_RUNNING=true
else
    echo "⚠️  MediaPipe service not running (will use GPT-4o fallback)"
    MEDIAPIPE_RUNNING=false
fi

if curl -s "http://localhost:$NEXT_PORT" > /dev/null 2>&1; then
    echo "✅ Next.js is running on port $NEXT_PORT"
    NEXT_RUNNING=true
else
    echo "❌ Next.js not running"
    NEXT_RUNNING=false
fi

# Check environment variables
echo ""
echo "🔐 Checking environment variables..."
if [ -n "$OPENAI_API_KEY" ]; then
    echo "✅ OPENAI_API_KEY is set"
else
    echo "⚠️  OPENAI_API_KEY not set (required for AI analysis)"
fi

if [ -n "$MEDIAPIPE_SERVICE_URL" ]; then
    echo "✅ MEDIAPIPE_SERVICE_URL is set: $MEDIAPIPE_SERVICE_URL"
else
    echo "ℹ️  MEDIAPIPE_SERVICE_URL not set (using default: http://localhost:5001)"
fi

# Check disk space
echo ""
echo "💾 Checking disk space..."
df -h . | tail -1 | awk '{print "   Used: " $3 " / " $2 " (" $5 " full)"}'

# Check memory
echo ""
echo "🧠 Checking memory..."
free -h | grep "Mem:" | awk '{print "   Used: " $3 " / " $2}'

# Summary
echo ""
echo "=========================================="
echo "  Summary"
echo "=========================================="
echo ""

if [ "$MEDIAPIPE_RUNNING" = true ] && [ "$NEXT_RUNNING" = true ]; then
    echo "✅ SYSTEM STATUS: FULLY OPERATIONAL"
    echo "   Mode: Hybrid (MediaPipe + GPT-4o)"
    echo "   Cost savings: 96%"
    echo "   Speed: 1-3 seconds per video"
elif [ "$MEDIAPIPE_RUNNING" = false ] && [ "$NEXT_RUNNING" = true ]; then
    echo "✅ SYSTEM STATUS: OPERATIONAL (FALLBACK MODE)"
    echo "   Mode: Cloud-only (GPT-4o)"
    echo "   MediaPipe unavailable, using GPT-4o for all analysis"
    echo "   Speed: 5-10 seconds per video"
else
    echo "❌ SYSTEM STATUS: NOT OPERATIONAL"
    echo "   Next.js is not running"
    echo "   Run: npm run dev:replit:hybrid"
fi

echo ""
echo "Your Replit URL: https://$REPL_SLUG.$REPL_OWNER.repl.co"
echo ""
