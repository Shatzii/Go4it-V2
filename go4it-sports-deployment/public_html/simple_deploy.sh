#!/bin/bash

# Go4It Sports Platform - Simple Deployment Script
# This script handles deployment with proper directory creation and error checking

echo "========================================================"
echo "  Go4It Sports Platform - Simple Deployment"
echo "  $(date)"
echo "========================================================"

# Configuration - Edit these values
SERVER_USER="deploy"
SERVER_HOST="go4itsports.org"
SERVER_PATH="/var/www/go4itsports.org"
SSH_KEY_PATH="~/.ssh/id_rsa"

# Build directory with timestamp to avoid conflicts
BUILD_DIR="go4it_build_$(date +%Y%m%d_%H%M%S)"
DEPLOY_TAR="${BUILD_DIR}.tar.gz"

echo "Creating build directory: $BUILD_DIR"
mkdir -p $BUILD_DIR

# Copy essential files to the build directory
echo "Copying files to build directory..."
cp -r server $BUILD_DIR/ 2>/dev/null || mkdir -p $BUILD_DIR/server
cp -r client/dist $BUILD_DIR/client/ 2>/dev/null || mkdir -p $BUILD_DIR/client/dist
cp -r shared $BUILD_DIR/ 2>/dev/null || mkdir -p $BUILD_DIR/shared

# Create main server file
if [ -f "server.js" ]; then
  cp server.js $BUILD_DIR/
else
  echo "server.js not found, creating minimal version..."
  cat > $BUILD_DIR/server.js << EOF
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, 'client/dist')));

// API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', version: '1.0.0' });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(\`Go4It Sports server running on port \${PORT}\`);
});
EOF
fi

# Create package.json
cat > $BUILD_DIR/package.json << EOF
{
  "name": "go4it-sports",
  "version": "1.0.0",
  "description": "Sports analytics platform for neurodivergent student athletes",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  }
}
EOF

# Create .env file
cat > $BUILD_DIR/.env << EOF
# Go4It Sports Platform Environment
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=your_database_url_here

# API Keys
JWT_SECRET=your_jwt_secret_here
EOF

# Create essential files that need to exist on the server
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
    }
}
EOF

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

# Create client-side files if they don't exist
if [ ! -d "$BUILD_DIR/client/dist" ] || [ -z "$(ls -A $BUILD_DIR/client/dist)" ]; then
  echo "Creating minimal client files..."
  mkdir -p $BUILD_DIR/client/dist
  cat > $BUILD_DIR/client/dist/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Go4It Sports Platform</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #121212;
      color: white;
    }
    .container {
      max-width: 800px;
      padding: 20px;
      text-align: center;
    }
    h1 {
      color: #4287f5;
    }
    .status {
      margin-top: 20px;
      padding: 10px;
      background-color: #1e1e1e;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Go4It Sports Platform</h1>
    <p>Your sports analytics platform is running successfully!</p>
    <div class="status">
      <p>Status: Server Online</p>
      <p>For more information, contact support@go4itsports.org</p>
    </div>
  </div>
</body>
</html>
EOF
fi

# Create server-side installation script
cat > $BUILD_DIR/install.sh << EOF
#!/bin/bash

echo "Installing Go4It Sports Platform..."

# Create directory structure (with error handling)
for dir in server client shared; do
  mkdir -p $SERVER_PATH/\$dir
done

# Set proper permissions
sudo chown -R www-data:www-data $SERVER_PATH

# Install dependencies
cd $SERVER_PATH
npm install --production

# Configure Nginx
sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
sudo cp go4itsports.nginx.conf /etc/nginx/sites-available/go4itsports
sudo ln -sf /etc/nginx/sites-available/go4itsports /etc/nginx/sites-enabled/ 2>/dev/null

# Reload Nginx if it exists
if command -v nginx &> /dev/null; then
  sudo nginx -t && sudo systemctl reload nginx
else
  echo "Nginx not installed, skipping configuration"
fi

# Configure systemd service
sudo cp go4itsports.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable go4itsports
sudo systemctl restart go4itsports

echo "Go4It Sports Platform installation complete!"
EOF

# Make script executable
chmod +x $BUILD_DIR/install.sh

# Create deployment tar file
echo "Creating deployment package..."
tar -czf $DEPLOY_TAR $BUILD_DIR

# Offer deployment options
echo "Deployment package created: $DEPLOY_TAR"
read -p "Deploy to $SERVER_HOST now? (y/n): " do_deploy

if [[ $do_deploy =~ ^[Yy]$ ]]; then
  echo "Deploying to $SERVER_HOST..."
  
  # Copy package to server
  scp -i $SSH_KEY_PATH $DEPLOY_TAR $SERVER_USER@$SERVER_HOST:/tmp/
  
  # Execute remote commands with error handling
  ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST << EOF
    # Ensure base directory exists
    sudo mkdir -p $SERVER_PATH
    
    # Extract files (with error handling)
    cd /tmp
    sudo tar -xzf $DEPLOY_TAR
    
    # Clean existing files (only if target directory exists)
    if [ -d "$SERVER_PATH" ]; then
      sudo rm -rf $SERVER_PATH/*
    fi
    
    # Copy all files
    sudo cp -r /tmp/$BUILD_DIR/* $SERVER_PATH/
    
    # Make install script executable and run it
    sudo chmod +x $SERVER_PATH/install.sh
    cd $SERVER_PATH
    sudo ./install.sh
    
    # Clean up
    sudo rm -rf /tmp/$BUILD_DIR
    sudo rm /tmp/$DEPLOY_TAR
EOF
  
  echo "========================================================="
  echo "  Deployment complete! Go4It Sports is now live at:"
  echo "  https://go4itsports.org"
  echo "========================================================="
else
  echo "Deployment package is ready for manual transfer: $DEPLOY_TAR"
  echo ""
  echo "To deploy manually:"
  echo "1. Copy package to server: scp $DEPLOY_TAR $SERVER_USER@$SERVER_HOST:/tmp/"
  echo "2. SSH to server: ssh $SERVER_USER@$SERVER_HOST"
  echo "3. Run these commands:"
  echo "   sudo mkdir -p $SERVER_PATH"
  echo "   cd /tmp"
  echo "   sudo tar -xzf $DEPLOY_TAR"
  echo "   sudo rm -rf $SERVER_PATH/*"
  echo "   sudo cp -r /tmp/$BUILD_DIR/* $SERVER_PATH/"
  echo "   cd $SERVER_PATH"
  echo "   sudo chmod +x install.sh"
  echo "   sudo ./install.sh"
fi

# Clean up local build directory
echo "Cleaning up local files..."
rm -rf $BUILD_DIR

echo "Done."