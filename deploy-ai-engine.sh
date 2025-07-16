#!/bin/bash
# Deploy Go4It AI Engine Server

set -e

echo "🚀 Deploying Go4It AI Engine Server..."

# Configuration
AI_ENGINE_PORT=${AI_ENGINE_PORT:-3001}
AI_ENGINE_API_KEY=${AI_ENGINE_API_KEY:-"your-secure-api-key"}
SERVER_USER=${SERVER_USER:-"root"}
SERVER_HOST=${SERVER_HOST:-"your-server-ip"}
DEPLOY_PATH=${DEPLOY_PATH:-"/opt/go4it-ai-engine"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running locally or remotely
if [[ "$1" == "local" ]]; then
    print_status "Deploying AI Engine locally..."
    DEPLOY_PATH="./ai-engine"
    
    # Create directory
    mkdir -p $DEPLOY_PATH
    
    # Copy files
    cp ai-engine-server.js $DEPLOY_PATH/
    cp -r lib $DEPLOY_PATH/
    cp package.json $DEPLOY_PATH/
    
    # Create environment file
    cat > $DEPLOY_PATH/.env << EOF
PORT=$AI_ENGINE_PORT
AI_ENGINE_API_KEY=$AI_ENGINE_API_KEY
NODE_ENV=production
USE_LOCAL_MODELS=true
LOCAL_SPORTS_MODEL=llama3.1:8b
OLLAMA_ENDPOINT=http://localhost:11434/api/generate
EOF
    
    # Install dependencies
    cd $DEPLOY_PATH
    npm install
    
    # Start AI Engine
    print_status "Starting AI Engine on port $AI_ENGINE_PORT..."
    node ai-engine-server.js &
    
    print_status "AI Engine deployed locally at http://localhost:$AI_ENGINE_PORT"
    
elif [[ "$1" == "remote" ]]; then
    if [[ -z "$SERVER_HOST" ]]; then
        print_error "SERVER_HOST environment variable is required for remote deployment"
        exit 1
    fi
    
    print_status "Deploying AI Engine to remote server $SERVER_HOST..."
    
    # Create deployment package
    tar -czf ai-engine-deploy.tar.gz ai-engine-server.js lib/ package.json AI_ENGINE_SERVER.md
    
    # Upload to server
    print_status "Uploading files to server..."
    scp ai-engine-deploy.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/
    
    # Execute deployment on server
    ssh $SERVER_USER@$SERVER_HOST << EOF
        # Extract files
        mkdir -p $DEPLOY_PATH
        cd $DEPLOY_PATH
        tar -xzf /tmp/ai-engine-deploy.tar.gz
        
        # Install dependencies
        npm install
        
        # Create environment file
        cat > .env << EOL
PORT=$AI_ENGINE_PORT
AI_ENGINE_API_KEY=$AI_ENGINE_API_KEY
NODE_ENV=production
USE_LOCAL_MODELS=true
LOCAL_SPORTS_MODEL=llama3.1:8b
OLLAMA_ENDPOINT=http://localhost:11434/api/generate
EOL
        
        # Install PM2 if not installed
        npm install -g pm2 || true
        
        # Stop existing AI engine
        pm2 stop ai-engine || true
        
        # Start AI Engine with PM2
        pm2 start ai-engine-server.js --name ai-engine
        pm2 save
        
        # Setup auto-start
        pm2 startup || true
        
        # Clean up
        rm /tmp/ai-engine-deploy.tar.gz
EOF
    
    # Clean up local files
    rm ai-engine-deploy.tar.gz
    
    print_status "AI Engine deployed remotely to $SERVER_HOST:$AI_ENGINE_PORT"
    
else
    print_status "Go4It AI Engine Deployment Script"
    echo ""
    echo "Usage:"
    echo "  $0 local   - Deploy AI Engine locally"
    echo "  $0 remote  - Deploy AI Engine to remote server"
    echo ""
    echo "Environment variables:"
    echo "  AI_ENGINE_PORT     - Port for AI Engine (default: 3001)"
    echo "  AI_ENGINE_API_KEY  - API key for authentication"
    echo "  SERVER_HOST        - Remote server hostname/IP"
    echo "  SERVER_USER        - Remote server username (default: root)"
    echo "  DEPLOY_PATH        - Deploy path on server (default: /opt/go4it-ai-engine)"
    echo ""
    echo "Examples:"
    echo "  AI_ENGINE_PORT=3001 AI_ENGINE_API_KEY=mykey $0 local"
    echo "  SERVER_HOST=192.168.1.100 AI_ENGINE_API_KEY=mykey $0 remote"
    exit 1
fi

print_status "Deployment complete!"
print_status "AI Engine API endpoint: http://localhost:$AI_ENGINE_PORT"
print_status "Health check: curl -H 'X-API-Key: $AI_ENGINE_API_KEY' http://localhost:$AI_ENGINE_PORT/health"