#!/bin/bash

# Production Setup Script for Shatzii AI Agents
# Configures a complete self-hosted deployment with working AI engines

set -e

echo "Setting up Shatzii AI Agents for production deployment..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install system dependencies
install_dependencies() {
    echo "Installing system dependencies..."
    
    # Update package list
    sudo apt update
    
    # Install required packages
    sudo apt install -y \
        curl \
        git \
        build-essential \
        postgresql-client \
        jq \
        certbot \
        nginx
    
    # Install Docker if not present
    if ! command_exists docker; then
        echo "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
    fi
    
    # Install Docker Compose if not present
    if ! command_exists docker-compose; then
        echo "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    # Install Node.js 18 if not present
    if ! command_exists node; then
        echo "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
}

# Setup environment variables
setup_environment() {
    echo "Setting up environment configuration..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        cat > .env << 'EOL'
# Database Configuration
DATABASE_URL=postgresql://postgres:shatzii_secure_password@localhost:5432/shatzii_prod
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=shatzii_secure_password
PGDATABASE=shatzii_prod

# Security
JWT_SECRET=your_super_secure_jwt_secret_change_this_in_production

# AI Services (REQUIRED - Get these from providers)
OPENAI_API_KEY=your_openai_api_key_here
APOLLO_API_KEY=your_apollo_api_key_here
ZOOMINFO_API_KEY=your_zoominfo_api_key_here

# Communication Services
SENDGRID_API_KEY=your_sendgrid_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Application Settings
NODE_ENV=production
PORT=5000
EOL
        
        echo "Created .env file. Please edit it with your actual API keys:"
        echo "  nano .env"
        echo ""
        echo "Required API keys to obtain:"
        echo "  1. OpenAI API Key: https://platform.openai.com/api-keys"
        echo "  2. SendGrid API Key: https://app.sendgrid.com/settings/api_keys"
        echo "  3. Apollo API Key: https://apollo.io (optional, for enhanced lead generation)"
        echo "  4. ZoomInfo API Key: https://zoominfo.com (optional, for prospect database)"
        echo "  5. Twilio Credentials: https://twilio.com (optional, for voice calls)"
        echo ""
        read -p "Press Enter after updating .env file with your API keys..."
    fi
    
    # Load environment variables
    export $(grep -v '^#' .env | xargs)
}

# Setup database
setup_database() {
    echo "Setting up PostgreSQL database..."
    
    # Start PostgreSQL container
    docker run -d \
        --name shatzii-postgres \
        --restart unless-stopped \
        -e POSTGRES_DB=shatzii_prod \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=shatzii_secure_password \
        -p 5432:5432 \
        -v shatzii_postgres_data:/var/lib/postgresql/data \
        postgres:15-alpine
    
    # Wait for database to be ready
    echo "Waiting for database to be ready..."
    sleep 15
    
    # Test database connection
    if pg_isready -h localhost -p 5432 -U postgres; then
        echo "Database is ready"
    else
        echo "Database connection failed"
        exit 1
    fi
    
    # Run database migrations
    echo "Running database migrations..."
    npm run db:push
}

# Build application
build_application() {
    echo "Building application..."
    
    # Install dependencies
    npm install
    
    # Build client
    npm run build
    
    # Verify build
    if [ -d "dist" ]; then
        echo "Application built successfully"
    else
        echo "Build failed"
        exit 1
    fi
}

# Setup SSL certificate
setup_ssl() {
    read -p "Enter your domain name (e.g., your-domain.com): " DOMAIN
    
    if [ -n "$DOMAIN" ]; then
        echo "Setting up SSL certificate for $DOMAIN..."
        
        # Stop nginx if running
        sudo systemctl stop nginx 2>/dev/null || true
        
        # Get certificate
        sudo certbot certonly --standalone -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN"
        
        # Create nginx configuration
        sudo tee /etc/nginx/sites-available/shatzii << EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/shatzii /etc/nginx/sites-enabled/
        sudo nginx -t && sudo systemctl reload nginx
        
        echo "SSL certificate installed for $DOMAIN"
    else
        echo "Skipping SSL setup"
    fi
}

# Create systemd service
create_service() {
    echo "Creating systemd service..."
    
    sudo tee /etc/systemd/system/shatzii-agents.service << EOF
[Unit]
Description=Shatzii AI Agents
After=network.target postgresql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
EnvironmentFile=$(pwd)/.env
ExecStart=$(pwd)/server/scripts/start-engines.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd and enable service
    sudo systemctl daemon-reload
    sudo systemctl enable shatzii-agents
    
    echo "Systemd service created: shatzii-agents"
}

# Setup monitoring
setup_monitoring() {
    echo "Setting up monitoring..."
    
    # Create monitoring directory
    mkdir -p monitoring
    
    # Create health check script
    cat > monitoring/health-check.sh << 'EOF'
#!/bin/bash

# Health check for Shatzii AI Agents
HEALTH_URL="http://localhost:5000/api/engines/status"
LOG_FILE="/var/log/shatzii-health.log"

# Perform health check
if curl -s "$HEALTH_URL" | jq -e '.running == true' > /dev/null; then
    echo "$(date): Health check PASSED" >> "$LOG_FILE"
    exit 0
else
    echo "$(date): Health check FAILED" >> "$LOG_FILE"
    
    # Restart service if unhealthy
    sudo systemctl restart shatzii-agents
    exit 1
fi
EOF
    
    chmod +x monitoring/health-check.sh
    
    # Add to crontab for monitoring every 5 minutes
    (crontab -l 2>/dev/null; echo "*/5 * * * * $(pwd)/monitoring/health-check.sh") | crontab -
    
    echo "Health monitoring configured"
}

# Setup backup
setup_backup() {
    echo "Setting up automated backups..."
    
    mkdir -p backups
    
    cat > backups/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/shatzii-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Database backup
docker exec shatzii-postgres pg_dump -U postgres shatzii_prod > "$BACKUP_DIR/db_$DATE.sql"

# Application data backup
tar -czf "$BACKUP_DIR/app_data_$DATE.tar.gz" data/ logs/ .env

# Cleanup old backups (keep last 7 days)
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF
    
    chmod +x backups/backup.sh
    
    # Schedule daily backups at 2 AM
    (crontab -l 2>/dev/null; echo "0 2 * * * $(pwd)/backups/backup.sh") | crontab -
    
    echo "Automated backups configured"
}

# Main installation process
main() {
    echo "Starting Shatzii AI Agents production setup..."
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        echo "Please run this script as a regular user (not root)"
        exit 1
    fi
    
    # Install dependencies
    install_dependencies
    
    # Setup environment
    setup_environment
    
    # Setup database
    setup_database
    
    # Build application
    build_application
    
    # Setup SSL (optional)
    setup_ssl
    
    # Create systemd service
    create_service
    
    # Setup monitoring
    setup_monitoring
    
    # Setup backup
    setup_backup
    
    echo ""
    echo "🎉 Production setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start the service: sudo systemctl start shatzii-agents"
    echo "2. Check status: sudo systemctl status shatzii-agents"
    echo "3. View logs: sudo journalctl -u shatzii-agents -f"
    echo "4. Access dashboard: http://localhost:5000"
    echo ""
    echo "The AI agents will automatically:"
    echo "  • Generate leads from multiple sources"
    echo "  • Create and execute marketing campaigns"
    echo "  • Qualify prospects and schedule demos"
    echo "  • Negotiate deals and close sales"
    echo "  • Operate 24/7 without intervention"
    echo ""
    echo "Monitor operations at: http://localhost:5000/autonomous-marketing"
    echo ""
    echo "For support and troubleshooting, see:"
    echo "  • Deployment guide: ./server/deployment/DEPLOYMENT_BLUEPRINT.md"
    echo "  • Logs: /var/log/shatzii-health.log"
    echo "  • Service status: systemctl status shatzii-agents"
}

# Run main function
main "$@"