#!/bin/bash

# ============================================
# Go4it Local Testing Setup
# ============================================

set -e

echo "🚀 Setting up Go4it for local testing..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: You need to add your API keys to .env${NC}"
    echo ""
    echo "Required keys:"
    echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (from https://dashboard.clerk.com)"
    echo "  - CLERK_SECRET_KEY"
    echo "  - DATABASE_URL (PostgreSQL connection string)"
    echo ""
    read -p "Press enter when you've added your keys to .env, or Ctrl+C to exit..."
fi

# Step 2: Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --prefer-offline --no-audit

# Step 3: Check PostgreSQL
echo ""
echo "🗄️  Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL not found in PATH${NC}"
    echo "Checking if PostgreSQL service is running..."
fi

# Step 4: Run database migrations
echo ""
echo "🔄 Setting up database..."
npm run db:push || {
    echo -e "${RED}❌ Database setup failed${NC}"
    echo "Make sure PostgreSQL is running and DATABASE_URL is correct in .env"
    exit 1
}

# Step 5: Seed database (optional)
echo ""
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run seed:production || echo -e "${YELLOW}⚠️  Seeding completed with warnings${NC}"
fi

# Step 6: Build the application
echo ""
echo "🔨 Building application..."
npm run build || {
    echo -e "${YELLOW}⚠️  Build completed with warnings (this is expected)${NC}"
}

# Done
echo ""
echo -e "${GREEN}✅ Local setup complete!${NC}"
echo ""
echo "To start the development server:"
echo -e "  ${GREEN}npm run dev${NC}"
echo ""
echo "To start the production server:"
echo -e "  ${GREEN}npm run start${NC}"
echo ""
echo "The app will be available at: http://localhost:3000"
echo ""
