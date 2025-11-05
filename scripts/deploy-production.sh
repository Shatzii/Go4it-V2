#!/bin/bash
# deploy-production.sh - Master deployment script for Go4it v2.1
# Usage: ./scripts/deploy-production.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "════════════════════════════════════════"
echo "  🚀 Go4it v2.1 - Production Deployment"
echo "  NCAA Readiness School Platform"
echo "════════════════════════════════════════"
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
  echo -e "${RED}❌ Do not run as root${NC}"
  exit 1
fi

# Check environment
if [ "$NODE_ENV" != "production" ]; then
  echo -e "${YELLOW}⚠️  Setting NODE_ENV to production${NC}"
  export NODE_ENV=production
fi

# Step 1: Pre-flight checks
echo -e "\n${BLUE}━━━ Step 1: Pre-Flight Checks ━━━${NC}"
if [ -f "./scripts/pre-flight.sh" ]; then
  chmod +x ./scripts/pre-flight.sh
  ./scripts/pre-flight.sh
else
  echo -e "${YELLOW}⚠️  Pre-flight script not found, skipping...${NC}"
fi

# Step 2: Build application
echo -e "\n${BLUE}━━━ Step 2: Building Application ━━━${NC}"
if [ -f "./scripts/build-production.sh" ]; then
  chmod +x ./scripts/build-production.sh
  ./scripts/build-production.sh
else
  echo -e "${YELLOW}⚠️  Build script not found, running manual build...${NC}"
  rm -rf .next
  npm ci --production=false
  npm run build
fi

# Step 3: Start services
echo -e "\n${BLUE}━━━ Step 3: Starting Services ━━━${NC}"
if [ -f "./scripts/start-services.sh" ]; then
  chmod +x ./scripts/start-services.sh
  ./scripts/start-services.sh
else
  echo -e "${YELLOW}⚠️  Service start script not found, skipping...${NC}"
fi

# Step 4: Database setup
echo -e "\n${BLUE}━━━ Step 4: Database Setup ━━━${NC}"
if [ -f "./scripts/migrate-and-seed.sh" ]; then
  chmod +x ./scripts/migrate-and-seed.sh
  ./scripts/migrate-and-seed.sh
else
  echo -e "${YELLOW}⚠️  Migration script not found, running manual migration...${NC}"
  npm run db:migrate
fi

# Step 5: Start application
echo -e "\n${BLUE}━━━ Step 5: Starting Application ━━━${NC}"
if [ -f "./scripts/start-app.sh" ]; then
  chmod +x ./scripts/start-app.sh
  ./scripts/start-app.sh
else
  echo -e "${YELLOW}⚠️  Start script not found, starting manually...${NC}"
  npm run start:production &
  echo $! > app.pid
  sleep 10
fi

# Step 6: Verification
echo -e "\n${BLUE}━━━ Step 6: Verification ━━━${NC}"
if [ -f "./scripts/verify-deployment.sh" ]; then
  chmod +x ./scripts/verify-deployment.sh
  ./scripts/verify-deployment.sh
else
  echo -e "${YELLOW}⚠️  Verification script not found, running basic health check...${NC}"
  sleep 5
  response=$(curl -s http://localhost:3000/api/health || echo '{"status":"error"}')
  if echo $response | grep -q '"status":"healthy"'; then
    echo -e "${GREEN}✅ Application is healthy!${NC}"
  else
    echo -e "${RED}❌ Health check failed!${NC}"
    echo $response
    exit 1
  fi
fi

echo -e "\n${GREEN}"
echo "════════════════════════════════════════"
echo "  ✅ Deployment Complete!"
echo "════════════════════════════════════════"
echo -e "${NC}"
echo -e "${BLUE}🌐 Application:${NC} https://go4itsports.org"
echo -e "${BLUE}📊 Health Check:${NC} https://go4itsports.org/api/health"
echo -e "${BLUE}📝 Logs:${NC} tail -f logs/combined.log"
echo -e "${BLUE}🐳 Services:${NC} docker ps"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Monitor logs for any errors"
echo "  2. Test critical user flows"
echo "  3. Verify Stripe webhooks"
echo "  4. Check email notifications"
echo "  5. Test parent night signup"
echo ""
