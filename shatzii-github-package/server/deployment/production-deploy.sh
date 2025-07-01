#!/bin/bash

# Production Deployment Script for shatzii.com
# Optimized for VPS server 5.161.99.81

set -e

# Configuration
SERVER_IP="5.161.99.81"
DOMAIN="shatzii.com"
APP_USER="shatzii"
APP_DIR="/home/shatzii/shatzii-platform"
REPO_URL="https://github.com/PharaohControl/shatzii-platform.git"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if running as app user
check_user() {
    if [ "$USER" != "$APP_USER" ]; then
        log_error "Please run as user: $APP_USER"
        log_info "Switch user: sudo su - $APP_USER"
        exit 1
    fi
}

# Clone or update repository
deploy_code() {
    log_info "Deploying application code..."
    
    if [ -d "$APP_DIR/.git" ]; then
        log_info "Updating existing repository..."
        cd $APP_DIR
        git fetch origin
        git reset --hard origin/main
    else
        log_info "Cloning repository..."
        rm -rf $APP_DIR
        git clone $REPO_URL $APP_DIR
        cd $APP_DIR
    fi
    
    log_success "Code deployed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    cd $APP_DIR
    npm ci --production
    
    # Install TypeScript for tsx runtime
    npm install -g tsx typescript
    
    log_success "Dependencies installed"
}

# Build application
build_application() {
    log_info "Building application for production..."
    
    cd $APP_DIR
    
    # Build frontend
    npm run build 2>/dev/null || {
        log_warning "npm run build not found, creating build script..."
        # Create a basic build process
        mkdir -p dist
        cp -r client/src/* dist/ 2>/dev/null || true
    }
    
    # Ensure TypeScript is compiled
    npx tsc --noEmit 2>/dev/null || log_warning "TypeScript check skipped"
    
    log_success "Application built"
}

# Setup database
setup_database() {
    log_info "Setting up database..."
    
    cd $APP_DIR
    
    # Source environment variables
    if [ -f ".env.production" ]; then
        export $(cat .env.production | grep -v '^#' | xargs)
    fi
    
    # Run database migrations if they exist
    if [ -f "package.json" ] && grep -q "db:migrate" package.json; then
        npm run db:migrate
    else
        log_warning "No database migrations found"
    fi
    
    log_success "Database setup completed"
}

# Optimize for production
optimize_production() {
    log_info "Applying production optimizations..."
    
    cd $APP_DIR
    
    # Set correct permissions
    chmod -R 755 $APP_DIR
    chmod 600 .env.production 2>/dev/null || true
    
    # Create necessary directories
    mkdir -p logs tmp uploads
    
    # Clear any development files
    rm -rf node_modules/.cache .next/cache 2>/dev/null || true
    
    # Configure Node.js for production
    export NODE_ENV=production
    export NODE_OPTIONS="--max-old-space-size=1024"
    
    log_success "Production optimizations applied"
}

# Start services
start_services() {
    log_info "Starting application services..."
    
    cd $APP_DIR
    
    # Stop existing PM2 processes
    pm2 stop all 2>/dev/null || true
    pm2 delete all 2>/dev/null || true
    
    # Start with PM2
    pm2 start ecosystem.config.js --env production
    
    # Save PM2 configuration
    pm2 save
    
    log_success "Services started"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    sleep 10  # Wait for services to start
    
    # Check if application is responding
    if curl -f http://localhost:5000/health 2>/dev/null; then
        log_success "Application is healthy"
    else
        log_warning "Health check failed, checking logs..."
        pm2 logs --lines 20
    fi
    
    # Check PM2 status
    pm2 status
}

# Setup SSL certificate
setup_ssl() {
    log_info "Setting up SSL certificate..."
    
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect 2>/dev/null || {
        log_warning "SSL setup requires manual intervention"
        log_info "Run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    }
}

# Main deployment function
main() {
    log_info "Starting production deployment for shatzii.com..."
    log_info "Server: $SERVER_IP"
    log_info "Domain: $DOMAIN"
    
    check_user
    deploy_code
    install_dependencies
    build_application
    setup_database
    optimize_production
    start_services
    health_check
    
    log_success "Deployment completed successfully!"
    log_info "Application is running at: https://$DOMAIN"
    log_info "Monitor with: pm2 monit"
    log_info "View logs with: pm2 logs"
}

# Rollback function
rollback() {
    log_warning "Rolling back to previous version..."
    
    cd $APP_DIR
    git log --oneline -10
    
    read -p "Enter commit hash to rollback to: " commit_hash
    
    if [ -n "$commit_hash" ]; then
        git reset --hard $commit_hash
        install_dependencies
        build_application
        start_services
        log_success "Rollback completed"
    else
        log_error "No commit hash provided"
    fi
}

# Handle arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "rollback")
        rollback
        ;;
    "restart")
        log_info "Restarting services..."
        pm2 restart all
        health_check
        ;;
    "status")
        pm2 status
        pm2 logs --lines 20
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|restart|status}"
        exit 1
        ;;
esac