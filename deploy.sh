#!/bin/bash

# Go4It Sports Platform - Direct Deployment Script
# This script builds and deploys the Go4It Sports platform directly to go4itsports.org

echo "==============================================="
echo "   Go4It Sports Platform Deployment"
echo "   $(date)"
echo "==============================================="

# Configuration - CUSTOMIZE THESE VALUES
SERVER_USER="deploy"
SERVER_HOST="go4itsports.org"
SERVER_PATH="/var/www/go4itsports.org"
SSH_KEY_PATH="~/.ssh/id_rsa"  # Path to your SSH key for the server

# Temporary build directory
BUILD_DIR="go4it_deployment_$(date +%Y%m%d_%H%M%S)"

# Create build directory
echo "Creating temporary build directory..."
mkdir -p $BUILD_DIR

# Copy essential server files
echo "Copying server files..."
cp server.js $BUILD_DIR/
cp -r server $BUILD_DIR/
cp -r shared $BUILD_DIR/ 2>/dev/null || :

# Install dependencies and build the client
echo "Building client application..."
(cd client && npm run build) || {
  echo "Error: Client build failed!"
  exit 1
}

# Copy client build to deployment directory
echo "Copying client build..."
mkdir -p $BUILD_DIR/client
cp -r client/dist $BUILD_DIR/client/

# Create package.json for production
echo "Creating production package.json..."
cat > $BUILD_DIR/package.json << EOF
{
  "name": "go4it-sports",
  "version": "1.0.0",
  "description": "Advanced sports analytics platform for neurodivergent student athletes",
  "main": "server.js",
  "scripts": {
    "start": "NODE_ENV=production node server.js"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.7.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3",
    "drizzle-orm": "^0.29.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Create .env file with placeholders
echo "Creating .env file..."
cat > $BUILD_DIR/.env << EOF
# Go4It Sports Platform Environment Variables
NODE_ENV=production
PORT=5000

# Database Configuration (Supabase)
DATABASE_URL=your_database_url_here

# Security Settings
JWT_SECRET=your_jwt_secret_here
SENTINEL_API_KEY=your_sentinel_key_here
EOF

# Create systemd service file
echo "Creating systemd service file..."
cat > $BUILD_DIR/go4itsports.service << EOF
[Unit]
Description=Go4It Sports Platform
After=network.target

[Service]
WorkingDirectory=$SERVER_PATH
ExecStart=/usr/bin/node server.js
Restart=always
User=www-data
Group=www-data
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
EOF

# Create Nginx configuration
echo "Creating nginx configuration..."
cat > $BUILD_DIR/go4itsports.nginx.conf << EOF
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Package the build for deployment
echo "Creating deployment package..."
tar -czf "${BUILD_DIR}.tar.gz" $BUILD_DIR

echo "Deployment package created: ${BUILD_DIR}.tar.gz"
echo ""

# Ask the user if they want to deploy now
read -p "Deploy to go4itsports.org now? (y/n): " deploy_now

if [[ $deploy_now =~ ^[Yy]$ ]]; then
  echo "Starting deployment to go4itsports.org..."
  
  # Copy deployment package to server
  echo "Copying deployment package to server..."
  scp -i $SSH_KEY_PATH "${BUILD_DIR}.tar.gz" $SERVER_USER@$SERVER_HOST:/tmp/
  
  # Execute deployment commands on server
  echo "Executing deployment commands on server..."
  ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST << EOF
    # Create deployment directory if it doesn't exist
    sudo mkdir -p $SERVER_PATH
    
    # Extract deployment package
    sudo tar -xzf /tmp/${BUILD_DIR}.tar.gz -C /tmp
    sudo cp -r /tmp/$BUILD_DIR/* $SERVER_PATH/
    
    # Set proper permissions
    sudo chown -R www-data:www-data $SERVER_PATH
    
    # Install production dependencies
    cd $SERVER_PATH
    sudo npm install --production
    
    # Configure Nginx
    sudo cp go4itsports.nginx.conf /etc/nginx/sites-available/go4itsports
    sudo ln -sf /etc/nginx/sites-available/go4itsports /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    
    # Set up systemd service
    sudo cp go4itsports.service /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable go4itsports
    sudo systemctl restart go4itsports
    
    # Clean up
    rm -rf /tmp/$BUILD_DIR
    rm /tmp/${BUILD_DIR}.tar.gz
    
    echo "Checking service status..."
    sudo systemctl status go4itsports --no-pager
EOF
  
  echo "Deployment completed successfully!"
  echo "Your Go4It Sports platform is now running at: https://go4itsports.org"
else
  echo "Deployment skipped. To deploy manually later:"
  echo "1. Copy the package: scp ${BUILD_DIR}.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/"
  echo "2. SSH to your server: ssh $SERVER_USER@$SERVER_HOST"
  echo "3. Extract and set up: tar -xzf /tmp/${BUILD_DIR}.tar.gz && cd $BUILD_DIR"
  echo "4. Follow the instructions in DEPLOY.md"
fi

# Clean up
echo "Cleaning up local build directory..."
rm -rf $BUILD_DIR

echo "==============================================="
echo "  Deployment process complete!"
echo "==============================================="