#!/bin/bash

# API Testing Script for Go4It Platform
# Tests Study Hall, NCAA Checklist, and GAR Scores APIs
# Usage: ./scripts/test-apis.sh [BASE_URL]

BASE_URL="${1:-http://localhost:3000}"
TEST_STUDENT_ID="test-student-$(date +%s)"
echo "🧪 Testing Go4It APIs"
echo "📍 Base URL: $BASE_URL"
echo "🆔 Test Student ID: $TEST_STUDENT_ID"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Helper function to test endpoint
test_endpoint() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local data="$4"
  local expected_status="${5:-200}"
  
  echo -n "Testing: $name... "
  
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi
  
  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$status_code" = "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $status_code)"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $status_code, expected $expected_status)"
    echo "Response: $body"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Study Hall API Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: GET study logs (should work even with no data)
test_endpoint \
  "GET study logs" \
  "GET" \
  "/api/study?studentId=$TEST_STUDENT_ID"

# Test 2: POST study session
STUDY_LOG_ID=$(curl -s -X POST "$BASE_URL/api/study" \
  -H "Content-Type: application/json" \
  -d "{
    \"studentId\": \"$TEST_STUDENT_ID\",
    \"minutes\": 45,
    \"notes\": \"Automated test session\",
    \"subject\": \"Mathematics\",
    \"location\": \"Library\"
  }" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

test_endpoint \
  "POST study session (45 minutes)" \
  "POST" \
  "/api/study" \
  "{
    \"studentId\": \"$TEST_STUDENT_ID\",
    \"minutes\": 45,
    \"notes\": \"Automated test session\",
    \"subject\": \"Mathematics\",
    \"location\": \"Library\"
  }"

# Test 3: GET study logs with date range
START_DATE=$(date -d "7 days ago" +%Y-%m-%d 2>/dev/null || date -v-7d +%Y-%m-%d)
END_DATE=$(date +%Y-%m-%d)

test_endpoint \
  "GET study logs with date range" \
  "GET" \
  "/api/study?studentId=$TEST_STUDENT_ID&startDate=$START_DATE&endDate=$END_DATE"

# Test 4: POST another session (test aggregation)
test_endpoint \
  "POST second study session (30 minutes)" \
  "POST" \
  "/api/study" \
  "{
    \"studentId\": \"$TEST_STUDENT_ID\",
    \"minutes\": 30,
    \"subject\": \"Science\"
  }"

# Test 5: Validation test (invalid minutes)
test_endpoint \
  "POST invalid study session (500 minutes)" \
  "POST" \
  "/api/study" \
  "{
    \"studentId\": \"$TEST_STUDENT_ID\",
    \"minutes\": 500
  }" \
  "400"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏈 NCAA Checklist API Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 6: GET NCAA checklist (should auto-initialize)
NCAA_RESPONSE=$(curl -s "$BASE_URL/api/ncaa?studentId=$TEST_STUDENT_ID")
test_endpoint \
  "GET NCAA checklist (auto-initialize)" \
  "GET" \
  "/api/ncaa?studentId=$TEST_STUDENT_ID"

# Extract first checklist item ID
NCAA_ITEM_ID=$(echo "$NCAA_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

# Test 7: POST custom checklist item
test_endpoint \
  "POST custom NCAA item" \
  "POST" \
  "/api/ncaa" \
  "{
    \"studentId\": \"$TEST_STUDENT_ID\",
    \"key\": \"test-item-$(date +%s)\",
    \"label\": \"Test: Schedule campus visit\",
    \"status\": \"todo\",
    \"priority\": \"high\",
    \"dueDate\": \"2025-12-31\"
  }"

# Test 8: PATCH checklist item status
if [ -n "$NCAA_ITEM_ID" ]; then
  test_endpoint \
    "PATCH NCAA item status to 'done'" \
    "PATCH" \
    "/api/ncaa?id=$NCAA_ITEM_ID" \
    "{
      \"status\": \"done\",
      \"notes\": \"Completed in automated test\"
    }"
else
  echo -e "${YELLOW}⚠ SKIP${NC} PATCH test (no item ID found)"
fi

# Test 9: Validation test (invalid status)
test_endpoint \
  "POST NCAA item with invalid status" \
  "POST" \
  "/api/ncaa" \
  "{
    \"studentId\": \"$TEST_STUDENT_ID\",
    \"key\": \"invalid-test\",
    \"label\": \"Invalid Status Test\",
    \"status\": \"invalid_status\"
  }" \
  "400"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏆 GAR Scores API Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 10: POST GAR score
test_endpoint \
  "POST GAR score" \
  "POST" \
  "/api/gar" \
  "{
    \"studentId\": \"$TEST_STUDENT_ID\",
    \"testDate\": \"2025-01-15\",
    \"overallScore\": 87,
    \"stars\": 4,
    \"speed\": 85,
    \"agility\": 90,
    \"power\": 82,
    \"endurance\": 88,
    \"reactionTime\": 450,
    \"decisionMaking\": 86,
    \"spatialAwareness\": 84,
    \"mentalToughness\": 89,
    \"focus\": 87,
    \"composure\": 85,
    \"testLocation\": \"Test Center A\",
    \"testType\": \"combine\",
    \"verified\": true
  }"

# Test 11: GET all GAR scores
test_endpoint \
  "GET all GAR scores" \
  "GET" \
  "/api/gar?studentId=$TEST_STUDENT_ID"

# Test 12: GET latest GAR score
test_endpoint \
  "GET latest GAR score (with breakdowns)" \
  "GET" \
  "/api/gar/latest?studentId=$TEST_STUDENT_ID"

# Test 13: POST second GAR score (test ordering)
test_endpoint \
  "POST second GAR score (newer date)" \
  "POST" \
  "/api/gar" \
  "{
    \"studentId\": \"$TEST_STUDENT_ID\",
    \"testDate\": \"2025-01-20\",
    \"overallScore\": 92,
    \"stars\": 5,
    \"speed\": 90,
    \"agility\": 93,
    \"power\": 91,
    \"endurance\": 94,
    \"reactionTime\": 420,
    \"decisionMaking\": 92,
    \"spatialAwareness\": 91,
    \"mentalToughness\": 93,
    \"focus\": 91,
    \"composure\": 90,
    \"testLocation\": \"Test Center B\",
    \"testType\": \"individual\",
    \"verified\": false
  }"

# Test 14: Validation test (invalid score)
test_endpoint \
  "POST GAR with invalid score (150)" \
  "POST" \
  "/api/gar" \
  "{
    \"studentId\": \"$TEST_STUDENT_ID\",
    \"testDate\": \"2025-01-25\",
    \"overallScore\": 150,
    \"stars\": 5,
    \"speed\": 90
  }" \
  "400"

# Test 15: Validation test (invalid stars)
test_endpoint \
  "POST GAR with invalid stars (10)" \
  "POST" \
  "/api/gar" \
  "{
    \"studentId\": \"$TEST_STUDENT_ID\",
    \"testDate\": \"2025-01-25\",
    \"overallScore\": 85,
    \"stars\": 10,
    \"speed\": 90
  }" \
  "400"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${RED}✗ Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
  echo -e "\n${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "\n${RED}❌ Some tests failed${NC}"
  exit 1
fi
