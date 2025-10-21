#!/bin/bash

# Go4It OS - Enterprise Quick Start Script
# Version: 2.1.0
# Date: October 8, 2025

set -e

echo "🚀 Go4It OS - Enterprise Quick Start"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${BLUE}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${YELLOW}⚠️  Warning: Node.js 20.x or higher recommended${NC}"
else
    echo -e "${GREEN}✅ Node.js version OK${NC}"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Copying from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✅ .env.local created${NC}"
        echo -e "${YELLOW}⚠️  Please update .env.local with your actual keys${NC}"
    fi
else
    echo -e "${GREEN}✅ Environment file exists${NC}"
fi

# Clean cache if requested
if [ "$1" = "--clean" ]; then
    echo -e "${BLUE}🧹 Cleaning cache...${NC}"
    rm -rf .next/cache
    echo -e "${GREEN}✅ Cache cleaned${NC}"
fi

# Start the appropriate mode
if [ "$1" = "--build" ]; then
    echo -e "${BLUE}🔨 Building for production...${NC}"
    npm run build
    echo -e "${GREEN}✅ Build complete${NC}"
    echo ""
    echo -e "${GREEN}To start production server, run: npm start${NC}"
elif [ "$1" = "--prod" ]; then
    echo -e "${BLUE}🚀 Starting production server...${NC}"
    npm start
else
    echo -e "${BLUE}🔥 Starting development server...${NC}"
    echo ""
    echo -e "${GREEN}Server will be available at:${NC}"
    echo -e "${GREEN}  - Local:   http://localhost:5000${NC}"
    echo -e "${GREEN}  - Network: http://$(hostname -I | awk '{print $1}'):5000${NC}"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""
    npm run dev
fi
