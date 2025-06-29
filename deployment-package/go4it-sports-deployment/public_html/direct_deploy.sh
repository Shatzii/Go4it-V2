#!/bin/bash

# Go4It Sports Platform - Direct Deployment Script
# This script provides a command-line deployment without unzipping

echo "=============================================================="
echo "   Go4It Sports Platform Direct Deployment"
echo "   $(date)"
echo "=============================================================="

# Configuration - Edit these values for your setup
SERVER_USER="deploy"
SERVER_HOST="go4itsports.org"
SERVER_PATH="/var/www/go4itsports.org"
SSH_KEY_PATH="~/.ssh/id_rsa"

# Deployment package
BUILD_DIR="go4it_deploy_$(date +%Y%m%d_%H%M%S)"
DEPLOY_PACKAGE="${BUILD_DIR}.tar.gz"

echo "Creating temporary build directory at: $BUILD_DIR"
mkdir -p $BUILD_DIR

# Copy essential files
echo "Copying essential files..."
cp -r server $BUILD_DIR/
cp -r client/dist $BUILD_DIR/client/ 2>/dev/null || mkdir -p $BUILD_DIR/client/dist
cp -r shared $BUILD_DIR/ 2>/dev/null || :
cp server.js $BUILD_DIR/ 2>/dev/null || touch $BUILD_DIR/server.js
cp .env.production $BUILD_DIR/.env 2>/dev/null || {
  echo "Creating default .env file..."
  cat > $BUILD_DIR/.env << EOF
# Go4It Sports Production Environment
NODE_ENV=production
PORT=5000

# Database - Replace with your actual values
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

# APIs - Replace with your actual values
OPENAI_API_KEY=your_openai_api_key
EOF
}

# Create package.json if it doesn't exist
cp package.json $BUILD_DIR/ 2>/dev/null || {
  echo "Creating package.json..."
  cat > $BUILD_DIR/package.json << EOF
{
  "name": "go4it-sports",
  "version": "1.0.0",
  "description": "Advanced sports analytics platform for neurodivergent student athletes",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.7.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3",
    "drizzle-orm": "^0.29.0"
  }
}
EOF
}

# Create nginx config
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

# Create direct_install.sh script that will run on the server
echo "Creating server-side installation script..."
cat > $BUILD_DIR/direct_install.sh << EOF
#!/bin/bash

# Go4It Sports Direct Installation Script
# This script is executed on the server

DEPLOY_PATH="$SERVER_PATH"

# Ensure we have the required commands
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting."; exit 1; }

# Stop existing service if running
if systemctl is-active --quiet go4itsports; then
    echo "Stopping existing Go4It Sports service..."
    sudo systemctl stop go4itsports
fi

# Clear existing deployment
echo "Clearing existing files from \$DEPLOY_PATH..."
sudo rm -rf \$DEPLOY_PATH/*

# Install dependencies
echo "Installing dependencies..."
cd \$DEPLOY_PATH
sudo npm install --production

# Set up Nginx
echo "Configuring Nginx..."
if [ -f "/etc/nginx/sites-available/go4itsports" ]; then
    echo "Existing Nginx configuration found, updating..."
    sudo mv go4itsports.nginx.conf /etc/nginx/sites-available/go4itsports
else
    echo "Setting up new Nginx configuration..."
    sudo cp go4itsports.nginx.conf /etc/nginx/sites-available/go4itsports
    sudo ln -sf /etc/nginx/sites-available/go4itsports /etc/nginx/sites-enabled/
fi

# Validate Nginx configuration and reload
sudo nginx -t && sudo systemctl reload nginx

# Set up and start systemd service
echo "Setting up systemd service..."
sudo cp go4itsports.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable go4itsports
sudo systemctl restart go4itsports

# Wait a moment and check service status
sleep 3
echo "Service status:"
sudo systemctl status go4itsports --no-pager

echo "Deployment completed! Go4It Sports is now running at https://go4itsports.org"
EOF

# Make the server script executable
chmod +x $BUILD_DIR/direct_install.sh

# Package everything for deployment
echo "Creating deployment package..."
tar -czf $DEPLOY_PACKAGE $BUILD_DIR

echo "Deployment package created: $DEPLOY_PACKAGE"

# Option to deploy directly to the server
read -p "Deploy to go4itsports.org now? (y/n): " DEPLOY_NOW

if [[ $DEPLOY_NOW =~ ^[Yy]$ ]]; then
    echo "Starting deployment to go4itsports.org..."
    
    # Execute deployment
    echo "Copying deployment package to server..."
    scp -i $SSH_KEY_PATH $DEPLOY_PACKAGE $SERVER_USER@$SERVER_HOST:/tmp/
    
    echo "Creating deployment directory on server..."
    ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST "sudo mkdir -p $SERVER_PATH"
    
    echo "Extracting package on server..."
    ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST "sudo tar -xzf /tmp/$DEPLOY_PACKAGE -C /tmp/"
    
    echo "Copying files to deployment location..."
    ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST "sudo cp -r /tmp/$BUILD_DIR/* $SERVER_PATH/"
    
    echo "Running installation script on server..."
    ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && sudo ./direct_install.sh"
    
    echo "Cleaning up temporary files on server..."
    ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST "sudo rm -rf /tmp/$BUILD_DIR /tmp/$DEPLOY_PACKAGE"
    
    echo "=============================================================="
    echo "  ✅ Deployment completed successfully!"
    echo "  Your Go4It Sports platform is now running at:"
    echo "  https://go4itsports.org"
    echo "=============================================================="
else
    echo ""
    echo "Deployment package ready for manual transfer: $DEPLOY_PACKAGE"
    echo ""
    echo "To deploy manually:"
    echo "1. Copy the package to your server:"
    echo "   scp $DEPLOY_PACKAGE $SERVER_USER@$SERVER_HOST:/tmp/"
    echo ""
    echo "2. SSH to your server:"
    echo "   ssh $SERVER_USER@$SERVER_HOST"
    echo ""
    echo "3. Extract and install:"
    echo "   sudo mkdir -p $SERVER_PATH"
    echo "   sudo tar -xzf /tmp/$DEPLOY_PACKAGE -C /tmp/"
    echo "   sudo cp -r /tmp/$BUILD_DIR/* $SERVER_PATH/"
    echo "   cd $SERVER_PATH && sudo ./direct_install.sh"
    echo ""
fi

# Clean up local build directory
echo "Cleaning up local build directory..."
rm -rf $BUILD_DIR

echo "Done."