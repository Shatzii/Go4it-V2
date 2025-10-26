#!/bin/bash

echo "=========================================="
echo "  GO4IT Hybrid System - Replit Setup"
echo "=========================================="
echo ""

# Install Python dependencies for MediaPipe service
echo "📦 Installing Python dependencies..."
cd mediapipe-service

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing MediaPipe and dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Some packages may have failed to install"
    echo "MediaPipe might not work, will fall back to GPT-4o only"
fi

echo "✅ Python dependencies installed"
cd ..

# Install Node.js dependencies (if needed)
echo ""
echo "📦 Checking Node.js dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "To start the system:"
echo "  npm run dev:replit"
echo ""
echo "Or use the 'Run' button in Replit"
echo ""
