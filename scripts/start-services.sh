#!/bin/bash
# start-services.sh - Start required Docker services

set -e

echo "🐳 Starting Go4it production services..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not in PATH"
    exit 1
fi

# Check if docker-compose file exists
if [ ! -f "docker-compose.production.yml" ]; then
    echo "⚠️  docker-compose.production.yml not found, creating basic setup..."
    
    # Create basic docker-compose file
    cat > docker-compose.production.yml <<'EOF'
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    container_name: go4it-ollama-prod
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

  whisper:
    image: ghcr.io/openai/whisper:latest
    container_name: go4it-whisper-prod
    restart: unless-stopped
    ports:
      - "8000:8000"

volumes:
  ollama_data:
EOF
fi

# Start Docker services
echo "Starting Docker containers..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 10

# Check Ollama
echo -n "Checking Ollama... "
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✓ Running"
else
    echo "❌ Not responding"
fi

# Check Whisper
echo -n "Checking Whisper... "
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ Running"
else
    echo "⚠️  Not responding (may still be initializing)"
fi

# Download required Ollama models if not present
echo ""
echo "📥 Checking Ollama models..."

models_to_download=(
    "claude-educational-primary:7b"
    "nomic-embed-text"
)

for model in "${models_to_download[@]}"; do
    echo -n "  Checking $model... "
    if docker exec go4it-ollama-prod ollama list | grep -q "$model"; then
        echo "✓ Already downloaded"
    else
        echo "⬇️  Downloading (this may take several minutes)..."
        docker exec go4it-ollama-prod ollama pull "$model"
    fi
done

echo ""
echo "✅ Services started successfully!"
echo ""
echo "Service Status:"
docker ps --filter "name=go4it" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
