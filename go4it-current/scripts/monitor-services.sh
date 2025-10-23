#!/bin/bash

# Go4it Sports GPT - Automation Services Monitoring Script
# Comprehensive health check and performance monitoring for all services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
DOCKER_COMPOSE_FILE="docker-compose.automation.yml"
LOG_FILE="logs/monitoring-$(date +%Y%m%d-%H%M%S).log"
HEALTH_CHECK_INTERVAL=300  # 5 minutes

# Services to monitor
SERVICES=("redis" "elasticsearch" "minio" "postgres" "rabbitmq" "portainer" "metabase" "n8n")
PORTS=("6379" "9200" "9000" "5432" "5672" "9001" "3000" "5678")

# Logging function
log() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Header
print_header() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              Go4it Sports GPT - Service Monitor              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Check Docker service status
check_docker_services() {
    echo -e "${BLUE}🐳 Docker Services Status:${NC}"
    echo "────────────────────────────────────────────────────────────────"

    for service in "${SERVICES[@]}"; do
        if docker-compose -f "$DOCKER_COMPOSE_FILE" ps "$service" 2>/dev/null | grep -q "Up"; then
            echo -e "✅ ${GREEN}$service${NC} - Running"
        else
            echo -e "❌ ${RED}$service${NC} - Stopped"
        fi
    done
    echo ""
}

# Check port availability
check_ports() {
    echo -e "${BLUE}🔌 Port Availability:${NC}"
    echo "────────────────────────────────────────────────────────────────"

    for i in "${!SERVICES[@]}"; do
        service="${SERVICES[$i]}"
        port="${PORTS[$i]}"

        if nc -z localhost "$port" 2>/dev/null; then
            echo -e "✅ ${GREEN}$service${NC} (port $port) - Open"
        else
            echo -e "❌ ${RED}$service${NC} (port $port) - Closed"
        fi
    done
    echo ""
}

# Check service health endpoints
check_health_endpoints() {
    echo -e "${BLUE}🏥 Service Health Checks:${NC}"
    echo "────────────────────────────────────────────────────────────────"

    # Redis
    if docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
        echo -e "✅ ${GREEN}Redis${NC} - Healthy"
    else
        echo -e "❌ ${RED}Redis${NC} - Unhealthy"
    fi

    # Elasticsearch
    if curl -s http://localhost:9200/_cluster/health | jq -r '.status' 2>/dev/null | grep -q "green\|yellow"; then
        cluster_status=$(curl -s http://localhost:9200/_cluster/health | jq -r '.status')
        echo -e "✅ ${GREEN}Elasticsearch${NC} - $cluster_status"
    else
        echo -e "❌ ${RED}Elasticsearch${NC} - Unhealthy"
    fi

    # MinIO
    if curl -s http://localhost:9000/minio/health/ready 2>/dev/null; then
        echo -e "✅ ${GREEN}MinIO${NC} - Healthy"
    else
        echo -e "❌ ${RED}MinIO${NC} - Unhealthy"
    fi

    # PostgreSQL
    if docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T postgres pg_isready -U go4it 2>/dev/null; then
        echo -e "✅ ${GREEN}PostgreSQL${NC} - Healthy"
    else
        echo -e "❌ ${RED}PostgreSQL${NC} - Unhealthy"
    fi

    # RabbitMQ
    if curl -s http://guest:guest@localhost:15672/api/overview 2>/dev/null | jq -r '.node' 2>/dev/null; then
        echo -e "✅ ${GREEN}RabbitMQ${NC} - Healthy"
    else
        echo -e "❌ ${RED}RabbitMQ${NC} - Unhealthy"
    fi

    echo ""
}

# Check system resources
check_system_resources() {
    echo -e "${BLUE}💻 System Resources:${NC}"
    echo "────────────────────────────────────────────────────────────────"

    # CPU Usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    echo -e "CPU Usage: ${YELLOW}$(printf "%.1f" $cpu_usage)%${NC}"

    # Memory Usage
    mem_info=$(free | grep Mem)
    mem_total=$(echo $mem_info | awk '{print $2}')
    mem_used=$(echo $mem_info | awk '{print $3}')
    mem_usage=$((mem_used * 100 / mem_total))
    echo -e "Memory Usage: ${YELLOW}$mem_usage%${NC} (${mem_used}MB / ${mem_total}MB)"

    # Disk Usage
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    echo -e "Disk Usage: ${YELLOW}$disk_usage%${NC}"

    echo ""
}

# Check AI API endpoints
check_ai_apis() {
    echo -e "${BLUE}🤖 AI API Status:${NC}"
    echo "────────────────────────────────────────────────────────────────"

    # Check if Next.js app is running
    if curl -s http://localhost:3001/api/health 2>/dev/null; then
        echo -e "✅ ${GREEN}Next.js App${NC} - Running"
    else
        echo -e "❌ ${RED}Next.js App${NC} - Not responding"
    fi

    # Test Hugging Face endpoint
    hf_response=$(curl -s -X POST http://localhost:3001/api/ai/enhance/huggingface \
        -H "Content-Type: application/json" \
        -d '{"task": "sentiment-analysis", "inputs": "test"}' 2>/dev/null)

    if echo "$hf_response" | jq -r '.error' 2>/dev/null | grep -q "null"; then
        echo -e "✅ ${GREEN}Hugging Face API${NC} - Responding"
    else
        echo -e "❌ ${RED}Hugging Face API${NC} - Error"
    fi

    echo ""
}

# Check automation workflows
check_automation_workflows() {
    echo -e "${BLUE}⚡ Automation Workflows:${NC}"
    echo "────────────────────────────────────────────────────────────────"

    # Check n8n workflows
    n8n_workflows=$(curl -s http://localhost:5678/rest/workflows 2>/dev/null | jq '.data | length' 2>/dev/null || echo "0")
    echo -e "n8n Workflows: ${YELLOW}$n8n_workflows${NC} active"

    # Check RabbitMQ queues
    queue_count=$(curl -s http://guest:guest@localhost:15672/api/queues 2>/dev/null | jq '. | length' 2>/dev/null || echo "0")
    echo -e "RabbitMQ Queues: ${YELLOW}$queue_count${NC}"

    # Check Redis keys
    redis_keys=$(docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T redis redis-cli dbsize 2>/dev/null || echo "0")
    echo -e "Redis Keys: ${YELLOW}$redis_keys${NC}"

    echo ""
}

# Performance metrics
check_performance_metrics() {
    echo -e "${BLUE}📊 Performance Metrics:${NC}"
    echo "────────────────────────────────────────────────────────────────"

    # API Response Times (if available)
    echo -e "API Response Times:"
    # Add specific API timing checks here

    # Database connection pool
    db_connections=$(docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T postgres psql -U go4it -d go4it_prod -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tail -3 | head -1 | tr -d ' ' || echo "N/A")
    echo -e "DB Connections: ${YELLOW}$db_connections${NC}"

    # Elasticsearch indices
    es_indices=$(curl -s http://localhost:9200/_cat/indices 2>/dev/null | wc -l)
    echo -e "ES Indices: ${YELLOW}$es_indices${NC}"

    echo ""
}

# Generate alerts
generate_alerts() {
    echo -e "${BLUE}🚨 System Alerts:${NC}"
    echo "────────────────────────────────────────────────────────────────"

    alerts=()

    # Check critical services
    for service in "${SERVICES[@]}"; do
        if ! docker-compose -f "$DOCKER_COMPOSE_FILE" ps "$service" 2>/dev/null | grep -q "Up"; then
            alerts+=("CRITICAL: $service is down")
        fi
    done

    # Check system resources
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    if (( $(echo "$cpu_usage > 90" | bc -l) )); then
        alerts+=("WARNING: High CPU usage ($cpu_usage%)")
    fi

    mem_usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
    if (( $(echo "$mem_usage > 90" | bc -l) )); then
        alerts+=("WARNING: High memory usage ($mem_usage%)")
    fi

    # Display alerts
    if [ ${#alerts[@]} -eq 0 ]; then
        echo -e "✅ ${GREEN}No alerts${NC}"
    else
        for alert in "${alerts[@]}"; do
            echo -e "⚠️  ${YELLOW}$alert${NC}"
        done
    fi

    echo ""
}

# Main monitoring function
monitor() {
    print_header
    check_docker_services
    check_ports
    check_health_endpoints
    check_system_resources
    check_ai_apis
    check_automation_workflows
    check_performance_metrics
    generate_alerts

    log "Monitoring check completed"
}

# Continuous monitoring mode
monitor_continuous() {
    log "Starting continuous monitoring (interval: ${HEALTH_CHECK_INTERVAL}s)"
    log "Press Ctrl+C to stop"

    while true; do
        monitor
        echo -e "${PURPLE}Next check in ${HEALTH_CHECK_INTERVAL} seconds...${NC}"
        sleep $HEALTH_CHECK_INTERVAL
    done
}

# Help function
show_help() {
    echo "Go4it Sports GPT - Automation Services Monitor"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -c, --continuous    Run continuous monitoring"
    echo "  -i, --interval SEC  Set monitoring interval (default: 300s)"
    echo "  -h, --help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Single monitoring check"
    echo "  $0 --continuous       # Continuous monitoring"
    echo "  $0 -i 60              # Monitor every 60 seconds"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -c|--continuous)
            CONTINUOUS=true
            shift
            ;;
        -i|--interval)
            HEALTH_CHECK_INTERVAL="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Create logs directory
mkdir -p logs

# Run monitoring
if [ "$CONTINUOUS" = true ]; then
    monitor_continuous
else
    monitor
fi