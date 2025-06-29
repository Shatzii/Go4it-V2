#!/bin/bash

# Enterprise-Grade Deployment Pipeline
# This eliminates all deployment issues permanently

set -euo pipefail  # Exit on any error

# Configuration
DOMAIN="go4itsports.org"
APP_NAME="go4it-sports"
NODE_VERSION="20"
PORT="${PORT:-5000}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Health check function
health_check() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            return 0
        fi
        log "Health check attempt $attempt/$max_attempts for $url"
        sleep 2
        ((attempt++))
    done
    return 1
}

# Environment detection
detect_environment() {
    if [ -n "${REPLIT_DEV_DOMAIN:-}" ]; then
        echo "replit"
    elif [ -n "${VERCEL:-}" ]; then
        echo "vercel"
    elif [ -n "${NETLIFY:-}" ]; then
        echo "netlify"
    elif [ -f "/etc/nginx/nginx.conf" ]; then
        echo "vps"
    else
        echo "local"
    fi
}

# Install dependencies based on environment
install_dependencies() {
    local env=$1
    
    case $env in
        "replit")
            log "Installing for Replit environment"
            # Replit handles dependencies automatically
            ;;
        "vps"|"local")
            log "Installing Node.js and dependencies"
            # Install Node.js if not present
            if ! command -v node &> /dev/null; then
                curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
                sudo apt-get install -y nodejs
            fi
            
            # Install dependencies
            npm ci --production
            ;;
    esac
}

# Build application
build_application() {
    log "Building Go4It Sports Platform"
    
    # Clean previous builds
    rm -rf .next dist build
    
    # Build the application
    if [ -f "package.json" ]; then
        npm run build || {
            warn "Build failed, trying alternative approach"
            # Fallback build process
            npx next build || error "Build process failed"
        }
    fi
    
    success "Application built successfully"
}

# Configure server
configure_server() {
    local env=$1
    
    case $env in
        "replit")
            log "Configuring for Replit"
            # Create replit-optimized server
            cat > server-replit.js << 'EOF'
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = process.env.PORT || 5000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
EOF
            ;;
        "vps")
            log "Configuring for VPS deployment"
            # Create production server
            cat > server-production.js << 'EOF'
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false
const hostname = '0.0.0.0'
const port = process.env.PORT || 5000

const app = next({ dev, hostname, port, dir: '.' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, () => {
    console.log(`> Go4It Sports Platform ready on http://${hostname}:${port}`)
  })
})
EOF
            
            # Create systemd service
            if command -v systemctl &> /dev/null; then
                sudo tee /etc/systemd/system/${APP_NAME}.service > /dev/null << EOF
[Unit]
Description=Go4It Sports Platform
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/node server-production.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=${PORT}

[Install]
WantedBy=multi-user.target
EOF
                
                sudo systemctl daemon-reload
                sudo systemctl enable ${APP_NAME}
            fi
            ;;
    esac
}

# Deploy application
deploy() {
    local env=$(detect_environment)
    
    log "Starting deployment for environment: $env"
    
    # Pre-deployment checks
    if [ ! -f "package.json" ]; then
        error "package.json not found"
    fi
    
    if [ ! -f "next.config.js" ]; then
        warn "next.config.js not found, using defaults"
    fi
    
    # Install dependencies
    install_dependencies $env
    
    # Configure server
    configure_server $env
    
    # Build application (skip for Replit dev environment)
    if [ "$env" != "replit" ] || [ "${NODE_ENV:-}" = "production" ]; then
        build_application
    fi
    
    # Start application
    case $env in
        "replit")
            log "Starting Replit server"
            node server-replit.js &
            SERVER_PID=$!
            ;;
        "vps")
            log "Starting production server"
            if command -v systemctl &> /dev/null; then
                sudo systemctl start ${APP_NAME}
                SERVER_PID=$(systemctl show -p MainPID ${APP_NAME} | cut -d= -f2)
            else
                node server-production.js &
                SERVER_PID=$!
            fi
            ;;
        "local")
            log "Starting local development server"
            node server-replit.js &
            SERVER_PID=$!
            ;;
    esac
    
    # Health check
    sleep 5
    local base_url="http://localhost:${PORT}"
    if [ "$env" = "replit" ] && [ -n "${REPLIT_DEV_DOMAIN:-}" ]; then
        base_url="https://${REPLIT_DEV_DOMAIN}"
    fi
    
    if health_check "$base_url"; then
        success "Go4It Sports Platform deployed successfully!"
        success "Access your application at: $base_url"
        
        # Additional endpoints to verify
        local endpoints=("/" "/dashboard" "/api/health")
        for endpoint in "${endpoints[@]}"; do
            if health_check "${base_url}${endpoint}"; then
                success "✓ $endpoint is responding"
            else
                warn "⚠ $endpoint may need attention"
            fi
        done
        
    else
        error "Deployment failed - application not responding"
    fi
    
    # Cleanup function
    cleanup() {
        if [ -n "${SERVER_PID:-}" ]; then
            kill $SERVER_PID 2>/dev/null || true
        fi
    }
    
    # Register cleanup function
    trap cleanup EXIT
}

# Main execution
main() {
    log "Go4It Sports Platform - Enterprise Deployment Pipeline"
    log "Environment: $(detect_environment)"
    log "Port: $PORT"
    
    deploy
}

# Run if called directly
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi