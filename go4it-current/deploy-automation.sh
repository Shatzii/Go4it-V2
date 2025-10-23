#!/bin/bash

# Go4it Sports GPT - Complete Automation Deployment Script
# This script deploys the enhanced GPT system with all open source automation services

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/docker-compose.automation.yml"
ENV_FILE="$PROJECT_ROOT/.env.local"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    # Check environment file
    if [ ! -f "$ENV_FILE" ]; then
        log_warning "Environment file .env.local not found. Creating from example..."
        if [ -f ".env.automation.example" ]; then
            cp .env.automation.example .env.local
            log_warning "Please edit .env.local with your actual API keys before continuing."
            read -p "Press Enter after configuring .env.local..."
        else
            log_error "Neither .env.local nor .env.automation.example found."
            exit 1
        fi
    fi

    log_success "Prerequisites check passed."
}

# Setup directories
setup_directories() {
    log_info "Setting up directories..."

    # Create data directories for services
    mkdir -p data/{redis,elasticsearch,minio,postgres,rabbitmq,portainer}
    mkdir -p data/minio/{config,data}
    mkdir -p logs/{automation,ai,workflows}

    # Set proper permissions
    chmod -R 755 data/
    chmod -R 755 logs/

    log_success "Directories setup complete."
}

# Deploy automation services
deploy_automation_services() {
    log_info "Deploying automation services..."

    # Pull latest images
    log_info "Pulling Docker images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull

    # Start services
    log_info "Starting automation services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    sleep 30

    # Check service health
    check_service_health

    log_success "Automation services deployed successfully."
}

# Check service health
check_service_health() {
    log_info "Checking service health..."

    services=("redis" "elasticsearch" "minio" "postgres" "rabbitmq" "portainer" "metabase" "n8n")

    for service in "${services[@]}"; do
        if docker-compose -f "$DOCKER_COMPOSE_FILE" ps "$service" | grep -q "Up"; then
            log_success "$service is running"
        else
            log_warning "$service is not running yet, checking again in 10 seconds..."
            sleep 10
            if docker-compose -f "$DOCKER_COMPOSE_FILE" ps "$service" | grep -q "Up"; then
                log_success "$service is now running"
            else
                log_error "$service failed to start"
            fi
        fi
    done
}

# Configure services
configure_services() {
    log_info "Configuring services..."

    # Configure MinIO
    configure_minio

    # Configure Metabase
    configure_metabase

    # Configure n8n
    configure_n8n

    # Configure Elasticsearch
    configure_elasticsearch

    log_success "Services configuration complete."
}

# Configure MinIO
configure_minio() {
    log_info "Configuring MinIO..."

    # Wait for MinIO to be ready
    sleep 10

    # Create bucket if it doesn't exist
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T minio mc alias set go4it http://localhost:9000 go4it_admin go4it_minio_2025 || true
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T minio mc mb go4it/go4it-assets || true
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T minio mc policy set public go4it/go4it-assets || true

    log_success "MinIO configured."
}

# Configure Metabase
configure_metabase() {
    log_info "Configuring Metabase..."

    # Metabase will be configured through the web interface
    # Default admin credentials: admin@go4it.com / go4it2025!
    log_info "Metabase will be available at http://localhost:3000"
    log_info "Default admin: admin@go4it.com / go4it2025!"
}

# Configure n8n
configure_n8n() {
    log_info "Configuring n8n..."

    # n8n will be configured through the web interface
    log_info "n8n will be available at http://localhost:5678"
    log_info "Complete setup through the web interface"
}

# Configure Elasticsearch
configure_elasticsearch() {
    log_info "Configuring Elasticsearch..."

    # Wait for Elasticsearch to be ready
    sleep 15

    # Create initial index template
    curl -X PUT "localhost:9200/_index_template/go4it_template" \
         -H 'Content-Type: application/json' \
         -d '{
           "index_patterns": ["go4it-*"],
           "template": {
             "settings": {
               "number_of_shards": 1,
               "number_of_replicas": 0
             },
             "mappings": {
               "properties": {
                 "timestamp": { "type": "date" },
                 "type": { "type": "keyword" },
                 "data": { "type": "object" }
               }
             }
           }
         }' || log_warning "Elasticsearch template creation failed, will retry on first use"
}

# Install dependencies and build application
build_application() {
    log_info "Building Go4it application..."

    # Install dependencies
    npm install

    # Build application
    npm run build

    # Run database migrations if needed
    npm run db:migrate || log_warning "Database migration failed, ensure database is properly configured"

    log_success "Application build complete."
}

# Setup AI workflows
setup_ai_workflows() {
    log_info "Setting up AI workflows..."

    # Import n8n workflows
    if [ -d "workflows" ]; then
        log_info "n8n workflows directory found, workflows will be imported manually"
    fi

    # Setup Hugging Face models cache
    mkdir -p data/huggingface/cache
    chmod -R 755 data/huggingface/

    log_success "AI workflows setup complete."
}

# Create monitoring dashboard
setup_monitoring() {
    log_info "Setting up monitoring..."

    # Create basic monitoring scripts
    cat > scripts/monitor-services.sh << 'EOF'
#!/bin/bash
echo "=== Go4it Automation Services Status ==="
docker-compose -f docker-compose.automation.yml ps
echo ""
echo "=== Service Health Checks ==="
echo "Redis: $(docker-compose -f docker-compose.automation.yml exec -T redis redis-cli ping 2>/dev/null || echo 'DOWN')"
echo "Elasticsearch: $(curl -s http://localhost:9200/_cluster/health | jq -r '.status' 2>/dev/null || echo 'DOWN')"
echo "MinIO: $(curl -s http://localhost:9000/minio/health/ready 2>/dev/null || echo 'DOWN')"
echo "PostgreSQL: $(docker-compose -f docker-compose.automation.yml exec -T postgres pg_isready -U go4it 2>/dev/null || echo 'DOWN')"
EOF

    chmod +x scripts/monitor-services.sh

    log_success "Monitoring setup complete."
}

# Display deployment summary
deployment_summary() {
    log_success "🎉 Go4it Sports GPT Automation Deployment Complete!"
    echo ""
    echo "=== Service URLs ==="
    echo "🤖 AI Automation Dashboard: http://localhost:3001/ai-automation"
    echo "📊 Metabase Analytics: http://localhost:3000"
    echo "⚡ n8n Workflow Automation: http://localhost:5678"
    echo "📁 MinIO Object Storage: http://localhost:9000"
    echo "🔍 Elasticsearch: http://localhost:9200"
    echo "🐰 RabbitMQ Management: http://localhost:15672"
    echo "🐳 Portainer: http://localhost:9001"
    echo ""
    echo "=== Default Credentials ==="
    echo "Metabase Admin: admin@go4it.com / go4it2025!"
    echo "MinIO: go4it_admin / go4it_minio_2025"
    echo "RabbitMQ: guest / guest"
    echo "Portainer: admin / go4it2025!"
    echo ""
    echo "=== Next Steps ==="
    echo "1. Configure your API keys in .env.local"
    echo "2. Access the AI Automation Dashboard"
    echo "3. Set up workflows in n8n"
    echo "4. Configure dashboards in Metabase"
    echo "5. Test the enhanced GPT integration"
    echo ""
    echo "=== Monitoring ==="
    echo "Run './scripts/monitor-services.sh' to check service status"
    echo ""
    log_info "Deployment completed successfully! 🚀"
}

# Main deployment function
main() {
    echo "🚀 Starting Go4it Sports GPT Automation Deployment..."
    echo ""

    check_prerequisites
    setup_directories
    deploy_automation_services
    configure_services
    build_application
    setup_ai_workflows
    setup_monitoring
    deployment_summary
}

# Handle command line arguments
case "${1:-}" in
    "check")
        check_prerequisites
        ;;
    "services")
        deploy_automation_services
        ;;
    "configure")
        configure_services
        ;;
    "build")
        build_application
        ;;
    "monitor")
        ./scripts/monitor-services.sh
        ;;
    *)
        main
        ;;
esac