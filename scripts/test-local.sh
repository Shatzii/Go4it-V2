#!/bin/bash

# ============================================
# Quick Local Test Script
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Running Local Tests...${NC}"
echo ""

# Test 1: Check .env
echo -n "1. Checking .env file... "
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}   .env file not found. Run: ./scripts/setup-local-test.sh${NC}"
    exit 1
fi

# Test 2: Check required env vars
echo -n "2. Checking required environment variables... "
source .env 2>/dev/null || true
if [ -z "$DATABASE_URL" ] || [ -z "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ]; then
    echo -e "${YELLOW}⚠${NC}"
    echo -e "${YELLOW}   Some required variables are missing in .env${NC}"
else
    echo -e "${GREEN}✓${NC}"
fi

# Test 3: Check node_modules
echo -n "3. Checking dependencies... "
if [ -d node_modules ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}   Dependencies not installed. Run: npm install${NC}"
    exit 1
fi

# Test 4: Check database connection
echo -n "4. Testing database connection... "
if [ ! -z "$DATABASE_URL" ]; then
    # Try to connect (timeout after 3 seconds)
    if timeout 3 node -e "const { Pool } = require('pg'); const pool = new Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT 1').then(() => {console.log('OK'); process.exit(0);}).catch(() => {process.exit(1);});" 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠${NC}"
        echo -e "${YELLOW}   Could not connect to database${NC}"
    fi
else
    echo -e "${YELLOW}⚠${NC}"
fi

# Test 5: Check if Next.js can compile
echo -n "5. Checking Next.js setup... "
if [ -f "next.config.js" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    exit 1
fi

# Test 6: Check build output
echo -n "6. Checking if build exists... "
if [ -d ".next" ]; then
    echo -e "${GREEN}✓${NC} (cached)"
else
    echo -e "${YELLOW}⚠${NC} (will build on first run)"
fi

echo ""
echo -e "${GREEN}✅ Pre-flight checks complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}To start testing:${NC}"
echo ""
echo -e "  ${GREEN}npm run dev${NC}      → Development mode (hot reload)"
echo -e "  ${GREEN}npm run build${NC}    → Build for production"
echo -e "  ${GREEN}npm run start${NC}    → Production mode"
echo ""
echo "App will be available at: http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
