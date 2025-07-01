#!/bin/bash

# Shatzii Production Deployment Script
# Complete deployment automation for your server

set -e

echo "🚀 Deploying Shatzii to Production Server..."

# Configuration
SERVER_IP="5.161.99.81"
DOMAIN="shatzii.com"
APP_DIR="/opt/shatzii"
BACKUP_DIR="/opt/shatzii/backups"

# Create deployment package
echo "📦 Creating deployment package..."
npm run build
tar -czf shatzii-deployment.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=*.log \
    --exclude=.env.local \
    .

# Upload to server
echo "⬆️ Uploading to server..."
scp shatzii-deployment.tar.gz root@$SERVER_IP:$APP_DIR/

# Deploy on server
echo "🔧 Deploying on server..."
ssh root@$SERVER_IP << 'ENDSSH'
cd /opt/shatzii

# Backup current deployment
if [ -d "current" ]; then
    timestamp=$(date +%Y%m%d_%H%M%S)
    mv current backup_$timestamp
fi

# Extract new deployment
mkdir -p current
tar -xzf shatzii-deployment.tar.gz -C current
cd current

# Install dependencies
npm ci --only=production

# Run database migrations
npm run db:push

# Build application
npm run build

# Start services with Docker Compose
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Health check
echo "🏥 Running health checks..."
sleep 30

# Check if services are running
if curl -f http://localhost:3000/health; then
    echo "✅ Application is healthy"
else
    echo "❌ Health check failed"
    exit 1
fi

echo "🎉 Deployment complete!"
ENDSSH

# Verify deployment
echo "🔍 Verifying deployment..."
if curl -f https://$DOMAIN/health; then
    echo "✅ Production deployment successful!"
    echo "🌐 Site available at: https://$DOMAIN"
else
    echo "❌ Deployment verification failed"
    exit 1
fi

# Cleanup
rm shatzii-deployment.tar.gz

echo "🎉 Shatzii is now live in production!"