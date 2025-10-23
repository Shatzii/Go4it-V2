#!/bin/bash

# Go4it Sports GPT - Deployment Validation & Status Report
# Comprehensive validation of the enhanced automation system

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
REPORT_FILE="deployment-status-$(date +%Y%m%d-%H%M%S).md"

# Services and their expected ports
declare -A SERVICES_PORTS=(
    ["redis"]="6379"
    ["elasticsearch"]="9200"
    ["minio"]="9000"
    ["postgres"]="5432"
    ["rabbitmq"]="5672"
    ["portainer"]="9001"
    ["metabase"]="3000"
    ["n8n"]="5678"
)

# API endpoints to test
API_ENDPOINTS=(
    "http://localhost:3001/api/health"
    "http://localhost:3001/api/ai/enhance/huggingface"
    "http://localhost:3001/api/ai/enhance/workflow"
    "http://localhost:3001/api/ai/enhance/content"
    "http://localhost:3001/api/ai/enhance/pipeline"
)

# Validation results
VALIDATION_PASSED=0
VALIDATION_FAILED=0

# Logging functions
log_success() {
    echo -e "✅ ${GREEN}$1${NC}"
    ((VALIDATION_PASSED++))
}

log_failure() {
    echo -e "❌ ${RED}$1${NC}"
    ((VALIDATION_FAILED++))
}

log_warning() {
    echo -e "⚠️  ${YELLOW}$1${NC}"
}

log_info() {
    echo -e "${BLUE}$1${NC}"
}

# Generate report header
generate_report_header() {
    cat > "$REPORT_FILE" << EOF
# Go4it Sports GPT - Deployment Status Report
**Generated:** $(date)
**System:** $(uname -a)

## Executive Summary

EOF
}

# Update report summary
update_report_summary() {
    local total=$((VALIDATION_PASSED + VALIDATION_FAILED))
    local success_rate=$((VALIDATION_PASSED * 100 / total))

    sed -i "s|## Executive Summary|## Executive Summary

**Total Checks:** $total
**Passed:** $VALIDATION_PASSED
**Failed:** $VALIDATION_FAILED
**Success Rate:** ${success_rate}%

**Status:** $(if [ $VALIDATION_FAILED -eq 0 ]; then echo "✅ All Systems Operational"; else echo "⚠️ Issues Detected"; fi)

---|" "$REPORT_FILE"
}

# Check prerequisites
check_prerequisites() {
    echo -e "${CYAN}🔍 Checking Prerequisites...${NC}"

    # Docker
    if command -v docker &> /dev/null; then
        docker_version=$(docker --version)
        log_success "Docker installed: $docker_version"
    else
        log_failure "Docker not installed"
    fi

    # Docker Compose
    if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
        compose_version=$(docker-compose --version 2>/dev/null || docker compose version)
        log_success "Docker Compose installed: $compose_version"
    else
        log_failure "Docker Compose not installed"
    fi

    # Node.js
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        log_success "Node.js installed: $node_version"
    else
        log_failure "Node.js not installed"
    fi

    # Environment file
    if [ -f ".env.local" ]; then
        log_success "Environment file (.env.local) exists"
    else
        log_failure "Environment file (.env.local) missing"
    fi

    echo ""
}

# Check Docker services
check_docker_services() {
    echo -e "${CYAN}🐳 Checking Docker Services...${NC}"

    for service in "${!SERVICES_PORTS[@]}"; do
        if docker-compose -f docker-compose.automation.yml ps "$service" 2>/dev/null | grep -q "Up"; then
            log_success "$service container is running"
        else
            log_failure "$service container is not running"
        fi
    done

    echo ""
}

# Check service ports
check_service_ports() {
    echo -e "${CYAN}🔌 Checking Service Ports...${NC}"

    for service in "${!SERVICES_PORTS[@]}"; do
        port="${SERVICES_PORTS[$service]}"
        if nc -z localhost "$port" 2>/dev/null; then
            log_success "$service port $port is accessible"
        else
            log_failure "$service port $port is not accessible"
        fi
    done

    echo ""
}

# Check service health
check_service_health() {
    echo -e "${CYAN}🏥 Checking Service Health...${NC}"

    # Redis
    if docker-compose -f docker-compose.automation.yml exec -T redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
        log_success "Redis health check passed"
    else
        log_failure "Redis health check failed"
    fi

    # Elasticsearch
    if curl -s http://localhost:9200/_cluster/health | jq -r '.status' 2>/dev/null | grep -q "green\|yellow"; then
        status=$(curl -s http://localhost:9200/_cluster/health | jq -r '.status')
        log_success "Elasticsearch health check passed (status: $status)"
    else
        log_failure "Elasticsearch health check failed"
    fi

    # MinIO
    if curl -s http://localhost:9000/minio/health/ready 2>/dev/null; then
        log_success "MinIO health check passed"
    else
        log_failure "MinIO health check failed"
    fi

    # PostgreSQL
    if docker-compose -f docker-compose.automation.yml exec -T postgres pg_isready -U go4it 2>/dev/null; then
        log_success "PostgreSQL health check passed"
    else
        log_failure "PostgreSQL health check failed"
    fi

    # RabbitMQ
    if curl -s http://guest:guest@localhost:15672/api/overview 2>/dev/null | jq -r '.node' 2>/dev/null; then
        log_success "RabbitMQ health check passed"
    else
        log_failure "RabbitMQ health check failed"
    fi

    echo ""
}

# Check AI APIs
check_ai_apis() {
    echo -e "${CYAN}🤖 Checking AI APIs...${NC}"

    for endpoint in "${API_ENDPOINTS[@]}"; do
        if curl -s "$endpoint" 2>/dev/null; then
            log_success "API endpoint $endpoint is responding"
        else
            log_failure "API endpoint $endpoint is not responding"
        fi
    done

    # Test specific AI functionality
    hf_test=$(curl -s -X POST http://localhost:3001/api/ai/enhance/huggingface \
        -H "Content-Type: application/json" \
        -d '{"task": "sentiment-analysis", "inputs": "Great platform!"}' 2>/dev/null)

    if echo "$hf_test" | jq -r '.error' 2>/dev/null | grep -q "null"; then
        log_success "Hugging Face API functional test passed"
    else
        log_failure "Hugging Face API functional test failed"
    fi

    echo ""
}

# Check application build
check_application() {
    echo -e "${CYAN}📱 Checking Application...${NC}"

    # Check if Next.js app is built
    if [ -d ".next" ]; then
        log_success "Next.js application is built"
    else
        log_failure "Next.js application is not built"
    fi

    # Check package.json
    if [ -f "package.json" ]; then
        log_success "package.json exists"
    else
        log_failure "package.json missing"
    fi

    # Check node_modules
    if [ -d "node_modules" ]; then
        log_success "Node.js dependencies installed"
    else
        log_failure "Node.js dependencies not installed"
    fi

    echo ""
}

# Check configuration
check_configuration() {
    echo -e "${CYAN}⚙️ Checking Configuration...${NC}"

    # Check docker-compose file
    if [ -f "docker-compose.automation.yml" ]; then
        log_success "Docker Compose automation file exists"
    else
        log_failure "Docker Compose automation file missing"
    fi

    # Check environment variables
    if [ -f ".env.local" ]; then
        required_vars=("OPENAI_API_KEY" "DATABASE_URL" "REDIS_URL")
        for var in "${required_vars[@]}"; do
            if grep -q "^$var=" .env.local; then
                log_success "Environment variable $var is set"
            else
                log_failure "Environment variable $var is not set"
            fi
        done
    fi

    echo ""
}

# Check data directories
check_data_directories() {
    echo -e "${CYAN}📁 Checking Data Directories...${NC}"

    directories=("data/redis" "data/elasticsearch" "data/minio" "logs/automation" "logs/ai")

    for dir in "${directories[@]}"; do
        if [ -d "$dir" ]; then
            log_success "Data directory $dir exists"
        else
            log_failure "Data directory $dir missing"
        fi
    done

    echo ""
}

# Generate recommendations
generate_recommendations() {
    echo -e "${CYAN}💡 Generating Recommendations...${NC}"

    recommendations=()

    if [ $VALIDATION_FAILED -gt 0 ]; then
        recommendations+=("Fix the $VALIDATION_FAILED failed validation checks")
    fi

    # Check resource usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    if (( $(echo "$cpu_usage > 80" | bc -l 2>/dev/null || echo "0") )); then
        recommendations+=("High CPU usage detected ($cpu_usage%). Consider scaling resources")
    fi

    mem_usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
    if (( $(echo "$mem_usage > 80" | bc -l 2>/dev/null || echo "0") )); then
        recommendations+=("High memory usage detected ($mem_usage%). Consider scaling resources")
    fi

    # Check backup status
    if [ ! -d "backups" ]; then
        recommendations+=("Set up automated backups for data persistence")
    fi

    # Display recommendations
    if [ ${#recommendations[@]} -eq 0 ]; then
        echo -e "✅ ${GREEN}No recommendations${NC}"
    else
        for rec in "${recommendations[@]}"; do
            echo -e "• ${YELLOW}$rec${NC}"
        done
    fi

    echo ""
}

# Final status
print_final_status() {
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}🎯 DEPLOYMENT VALIDATION COMPLETE${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"

    total=$((VALIDATION_PASSED + VALIDATION_FAILED))
    success_rate=$((VALIDATION_PASSED * 100 / total))

    echo -e "Total Checks: ${YELLOW}$total${NC}"
    echo -e "Passed: ${GREEN}$VALIDATION_PASSED${NC}"
    echo -e "Failed: ${RED}$VALIDATION_FAILED${NC}"
    echo -e "Success Rate: ${YELLOW}${success_rate}%${NC}"

    if [ $VALIDATION_FAILED -eq 0 ]; then
        echo -e "\n🎉 ${GREEN}ALL SYSTEMS OPERATIONAL!${NC}"
        echo -e "Your Go4it Sports GPT automation system is fully deployed and ready to use."
    else
        echo -e "\n⚠️  ${YELLOW}ISSUES DETECTED${NC}"
        echo -e "Please review the failed checks above and resolve them before proceeding."
    fi

    echo -e "\n📋 Detailed report saved to: ${BLUE}$REPORT_FILE${NC}"
}

# Main function
main() {
    generate_report_header

    check_prerequisites
    check_docker_services
    check_service_ports
    check_service_health
    check_ai_apis
    check_application
    check_configuration
    check_data_directories
    generate_recommendations

    update_report_summary
    print_final_status
}

# Run validation
main