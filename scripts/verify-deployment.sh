#!/bin/bash
# verify-deployment.sh - Verify production deployment

set -e

echo "🔍 Verifying Go4it v2.1 deployment..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Track failures
failures=0

# Test function
test_check() {
    local name=$1
    local command=$2
    local expected=$3
    
    echo -n "Testing $name... "
    
    if result=$(eval "$command" 2>&1); then
        if [ -z "$expected" ] || echo "$result" | grep -q "$expected"; then
            echo -e "${GREEN}✓${NC}"
            return 0
        else
            echo -e "${RED}✗${NC}"
            echo "  Expected: $expected"
            echo "  Got: $result"
            ((failures++))
            return 1
        fi
    else
        echo -e "${RED}✗${NC}"
        echo "  Error: $result"
        ((failures++))
        return 1
    fi
}

echo "━━━ System Health ━━━"

# 1. Application health
test_check "Application Health" \
    "curl -s http://localhost:3000/api/health" \
    '"status":"healthy"'

# 2. Database connectivity
test_check "Database Connection" \
    "psql \$DATABASE_URL -t -c 'SELECT 1;'" \
    "1"

# 3. College count
test_check "College Database" \
    "psql \$DATABASE_URL -t -c 'SELECT COUNT(*) FROM colleges;'" \
    ""

# 4. Ollama
test_check "Ollama Service" \
    "curl -s http://localhost:11434/api/tags" \
    '"models"'

# 5. Whisper
test_check "Whisper Service" \
    "curl -s http://localhost:8000/health" \
    ""

echo ""
echo "━━━ Critical Pages ━━━"

# Test critical pages
pages=(
    "/:Home Page"
    "/starpath:StarPath Dashboard"
    "/academy:Go4it Academy"
    "/drills:Drill Library"
    "/recruiting:Recruiting Hub"
    "/api/health:Health API"
)

for page in "${pages[@]}"; do
    IFS=: read -r path name <<< "$page"
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$path" 2>/dev/null || echo "000")
    
    echo -n "Testing $name... "
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓ ($status)${NC}"
    else
        echo -e "${RED}✗ ($status)${NC}"
        ((failures++))
    fi
done

echo ""
echo "━━━ Performance Metrics ━━━"

# Response time check
echo -n "Testing response time... "
response_time=$(curl -o /dev/null -s -w '%{time_total}\n' http://localhost:3000/ | awk '{printf "%.2f", $1}')
if (( $(echo "$response_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✓ ${response_time}s${NC}"
else
    echo -e "${YELLOW}⚠ ${response_time}s (slow)${NC}"
fi

# Memory usage
echo -n "Checking memory usage... "
if command -v free &> /dev/null; then
    mem_percent=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    echo -e "${GREEN}✓ ${mem_percent}%${NC}"
else
    echo -e "${YELLOW}⚠ Unable to check${NC}"
fi

# Disk space
echo -n "Checking disk space... "
disk_percent=$(df -h . | awk 'NR==2 {print $5}' | tr -d '%')
if [ "$disk_percent" -lt 80 ]; then
    echo -e "${GREEN}✓ ${disk_percent}% used${NC}"
else
    echo -e "${YELLOW}⚠ ${disk_percent}% used (high)${NC}"
fi

echo ""
echo "━━━ Docker Services ━━━"

docker ps --filter "name=go4it" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "━━━ Summary ━━━"

if [ $failures -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Deployment is successful.${NC}"
    exit 0
else
    echo -e "${RED}❌ $failures check(s) failed. Please review the issues above.${NC}"
    exit 1
fi
