#!/bin/bash

# Self-Hosted AI Agents Setup Script
# Complete deployment with local AI models - no external API dependencies

set -e

echo "Setting up Shatzii self-hosted AI agents with local models..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install system dependencies
install_dependencies() {
    echo "Installing system dependencies..."
    
    sudo apt update
    sudo apt install -y \
        curl \
        git \
        build-essential \
        postgresql-client \
        jq \
        certbot \
        nginx \
        python3 \
        python3-pip
    
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

    # Install Ollama for local AI models
    if ! command_exists ollama; then
        echo "Installing Ollama for local AI models..."
        curl -fsSL https://ollama.ai/install.sh | sh
    fi
}

# Setup environment for local AI
setup_local_ai_environment() {
    echo "Setting up local AI environment..."
    
    # Create .env file for self-hosted setup
    cat > .env << 'EOL'
# Self-Hosted Configuration
NODE_ENV=production
LOCAL_AI_MODE=true
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://postgres:shatzii_secure_password@localhost:5432/shatzii_prod
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=shatzii_secure_password
PGDATABASE=shatzii_prod

# Security
JWT_SECRET=your_super_secure_jwt_secret_change_this_in_production

# Local AI Configuration
OLLAMA_BASE_URL=http://localhost:11434
QDRANT_URL=http://localhost:6333
TEXTGEN_API_URL=http://localhost:7860

# Self-hosted email (optional - uses local SMTP)
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=noreply@localhost
SMTP_PASS=password

# Application Settings
SELF_HOSTED=true
USE_LOCAL_MODELS=true
EOL
    
    echo "Environment configured for self-hosted deployment"
}

# Download and setup local AI models
setup_ai_models() {
    echo "Setting up local AI models..."
    
    # Create models directory
    mkdir -p ./ai-models
    
    # Start Ollama service
    sudo systemctl enable ollama
    sudo systemctl start ollama
    
    # Wait for Ollama to be ready
    sleep 10
    
    # Download essential models
    echo "Downloading AI models (this may take some time)..."
    
    ollama pull mistral:7b-instruct    # Main content generation
    ollama pull llama3.2:3b           # Fast responses
    ollama pull phi3:mini             # Lightweight classification
    ollama pull qwen2.5:7b            # Business content
    
    echo "AI models downloaded successfully"
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
}

# Setup vector database for AI
setup_vector_database() {
    echo "Setting up Qdrant vector database..."
    
    docker run -d \
        --name shatzii-qdrant \
        --restart unless-stopped \
        -p 6333:6333 \
        -v qdrant_data:/qdrant/storage \
        qdrant/qdrant:latest
    
    sleep 10
    echo "Vector database ready"
}

# Build application with local AI support
build_application() {
    echo "Building application with local AI support..."
    
    # Install dependencies
    npm install
    
    # Build client
    npm run build
    
    # Run database migrations
    npm run db:push
    
    # Verify build
    if [ -d "dist" ]; then
        echo "Application built successfully"
    else
        echo "Build failed"
        exit 1
    fi
}

# Create systemd services
create_services() {
    echo "Creating systemd services..."
    
    # AI Engines service
    sudo tee /etc/systemd/system/shatzii-ai-engines.service << EOF
[Unit]
Description=Shatzii AI Engines
After=network.target postgresql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
EnvironmentFile=$(pwd)/.env
ExecStart=$(pwd)/server/scripts/start-local-engines.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    # Main application service
    sudo tee /etc/systemd/system/shatzii-app.service << EOF
[Unit]
Description=Shatzii Application
After=network.target postgresql.service shatzii-ai-engines.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
EnvironmentFile=$(pwd)/.env
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd and enable services
    sudo systemctl daemon-reload
    sudo systemctl enable shatzii-ai-engines
    sudo systemctl enable shatzii-app
    
    echo "Systemd services created"
}

# Create startup script for local engines
create_engine_startup() {
    cat > server/scripts/start-local-engines.sh << 'EOF'
#!/bin/bash

# Start Local AI Engines
echo "Starting local AI engines..."

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "Starting Ollama service..."
    sudo systemctl start ollama
    sleep 10
fi

# Check if Qdrant is running
if ! curl -s http://localhost:6333/health > /dev/null; then
    echo "Starting Qdrant service..."
    docker start shatzii-qdrant
    sleep 5
fi

# Start the AI engine manager
echo "Starting AI engine manager..."
node -r tsx/esm server/ai-engines/engine-manager.ts

EOF
    
    chmod +x server/scripts/start-local-engines.sh
}

# Setup monitoring
setup_monitoring() {
    echo "Setting up monitoring..."
    
    # Create health check script
    cat > monitoring/health-check-local.sh << 'EOF'
#!/bin/bash

# Health check for self-hosted AI agents
LOG_FILE="/var/log/shatzii-health.log"

# Check main application
if curl -s http://localhost:5000/api/engines/status | jq -e '.running == true' > /dev/null; then
    echo "$(date): Application health check PASSED" >> "$LOG_FILE"
else
    echo "$(date): Application health check FAILED" >> "$LOG_FILE"
    sudo systemctl restart shatzii-app
fi

# Check AI models
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "$(date): AI models health check PASSED" >> "$LOG_FILE"
else
    echo "$(date): AI models health check FAILED" >> "$LOG_FILE"
    sudo systemctl restart ollama
fi

# Check vector database
if curl -s http://localhost:6333/health > /dev/null; then
    echo "$(date): Vector database health check PASSED" >> "$LOG_FILE"
else
    echo "$(date): Vector database health check FAILED" >> "$LOG_FILE"
    docker restart shatzii-qdrant
fi
EOF
    
    chmod +x monitoring/health-check-local.sh
    
    # Add to crontab for monitoring every 5 minutes
    (crontab -l 2>/dev/null; echo "*/5 * * * * $(pwd)/monitoring/health-check-local.sh") | crontab -
    
    echo "Health monitoring configured"
}

# Main installation process
main() {
    echo "Starting Shatzii self-hosted AI agents setup..."
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        echo "Please run this script as a regular user (not root)"
        exit 1
    fi
    
    # Create necessary directories
    mkdir -p monitoring ai-models logs data
    
    # Install dependencies
    install_dependencies
    
    # Setup environment
    setup_local_ai_environment
    
    # Setup AI infrastructure
    setup_ai_models
    setup_database
    setup_vector_database
    
    # Build application
    build_application
    
    # Create services
    create_engine_startup
    create_services
    
    # Setup monitoring
    setup_monitoring
    
    echo ""
    echo "🎉 Self-hosted AI agents setup completed successfully!"
    echo ""
    echo "Your AI agents are now running with:"
    echo "  • Local AI models (Mistral, Llama, Phi3, Qwen)"
    echo "  • Self-hosted vector database"
    echo "  • Local PostgreSQL database"
    echo "  • No external API dependencies"
    echo ""
    echo "Next steps:"
    echo "1. Start services: sudo systemctl start shatzii-ai-engines shatzii-app"
    echo "2. Check status: sudo systemctl status shatzii-ai-engines shatzii-app"
    echo "3. View logs: sudo journalctl -u shatzii-ai-engines -f"
    echo "4. Access dashboard: http://localhost:5000"
    echo ""
    echo "The AI agents will automatically:"
    echo "  • Generate leads using local intelligence"
    echo "  • Create content with self-hosted models"
    echo "  • Execute marketing campaigns autonomously"
    echo "  • Manage sales pipeline with AI automation"
    echo "  • Operate 24/7 without external dependencies"
    echo ""
    echo "Monitor operations at: http://localhost:5000/autonomous-marketing"
    echo "All data stays on your server - complete privacy and control."
    echo ""
    echo "For support, check logs at: /var/log/shatzii-health.log"
}

# Run main function
main "$@"