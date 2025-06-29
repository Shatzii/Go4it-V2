#!/bin/bash

# Go4It Sports Star Coder Editor Integration Setup Script
# This script sets up the Star Coder integration with Monaco Editor

# Set color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration variables - EDIT THESE
EDITOR_PORT=8090
DOMAIN="editor.go4itsports.org"
EDITOR_PATH="/var/www/editor"
API_PORT=8091
PROJECTS_ROOT="/var/www/go4itsports"
EMAIL="a.barrett@go4itsports.org"
STAR_CODER_HOST="localhost" # Update if your Star Coder instance is on a different server
STAR_CODER_PORT="11434"     # Update based on your Star Coder configuration

echo -e "${GREEN}=== Go4It Sports Star Coder Editor Integration Setup ===${NC}"
echo -e "${YELLOW}This script will set up a web-based code editor with Star Coder integration.${NC}"
echo

# Step 1: Create directory structure
echo -e "${GREEN}Step 1: Creating directory structure...${NC}"
mkdir -p $EDITOR_PATH/client
mkdir -p $EDITOR_PATH/public

# Step 2: Install required packages
echo -e "\n${GREEN}Step 2: Installing required packages...${NC}"
apt update
apt install -y nginx certbot python3-certbot-nginx nodejs npm

# Step 3: Copy files
echo -e "\n${GREEN}Step 3: Copying integration files...${NC}"
# Copy the Star Coder integration backend
cp star_coder_integration.js $EDITOR_PATH/
# Copy the editor frontend
cp client/editor.html $EDITOR_PATH/public/index.html

# Step 4: Set up Node.js environment
echo -e "\n${GREEN}Step 4: Setting up Node.js environment...${NC}"
cd $EDITOR_PATH
npm init -y
npm install express cors axios body-parser path fs

# Step 5: Create configuration file
echo -e "\n${GREEN}Step 5: Creating configuration file...${NC}"
cat > $EDITOR_PATH/config.js << EOF
/**
 * Go4It Sports Star Coder Editor Integration Configuration
 */

module.exports = {
  // Star Coder API endpoint
  starCoderApiUrl: 'http://${STAR_CODER_HOST}:${STAR_CODER_PORT}/v1',
  
  // Monaco Editor service port
  editorPort: ${EDITOR_PORT},
  
  // API service port
  apiPort: ${API_PORT},
  
  // Projects root directory
  projectsRoot: '${PROJECTS_ROOT}',
  
  // Domain for the editor
  editorDomain: '${DOMAIN}'
};
EOF

# Step 6: Update integration file to use config
echo -e "\n${GREEN}Step 6: Updating integration file...${NC}"
sed -i "1i const config = require('./config');" $EDITOR_PATH/star_coder_integration.js

# Step 7: Create systemd service file
echo -e "\n${GREEN}Step 7: Creating systemd service...${NC}"
cat > /etc/systemd/system/star-coder-editor.service << EOF
[Unit]
Description=Go4It Sports Star Coder Editor Integration
After=network.target

[Service]
WorkingDirectory=${EDITOR_PATH}
ExecStart=/usr/bin/node star_coder_integration.js
Restart=always
User=root
Group=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Step 8: Configure Nginx
echo -e "\n${GREEN}Step 8: Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/star-coder-editor << EOF
server {
    listen 80;
    server_name ${DOMAIN};

    location / {
        root ${EDITOR_PATH}/public;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:${EDITOR_PORT}/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/star-coder-editor /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Step 9: Set up SSL
echo -e "\n${GREEN}Step 9: Setting up SSL certificate...${NC}"
certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email ${EMAIL} || {
    echo -e "${YELLOW}Warning: SSL setup failed. Your domain may not be pointing to this server yet.${NC}"
    echo -e "${YELLOW}You can run this command later: certbot --nginx -d ${DOMAIN}${NC}"
}

# Step 10: Start services
echo -e "\n${GREEN}Step 10: Starting services...${NC}"
systemctl daemon-reload
systemctl enable star-coder-editor
systemctl start star-coder-editor

# Step 11: Create README file
echo -e "\n${GREEN}Step 11: Creating README file...${NC}"
cat > $EDITOR_PATH/README.md << EOF
# Go4It Sports Star Coder Editor Integration

This is a web-based code editor with Star Coder integration for the Go4It Sports platform.

## Features

- Monaco Editor integration
- Star Coder AI assistance
- Code diagnostics and error detection
- Automated code fixes
- File explorer
- Multi-file editing

## Configuration

Edit the \`config.js\` file to customize the editor:

- \`starCoderApiUrl\`: URL of your Star Coder API
- \`editorPort\`: Port for the editor service
- \`apiPort\`: Port for the API service
- \`projectsRoot\`: Root directory for project files
- \`editorDomain\`: Domain for the editor

## Usage

Access the editor at: https://${DOMAIN}

## Maintenance

- Restart the service: \`systemctl restart star-coder-editor\`
- View logs: \`journalctl -u star-coder-editor\`
- Update configuration: Edit \`config.js\` and restart the service
EOF

echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
echo -e "${YELLOW}Your Go4It Sports Star Coder Editor Integration is now available at:${NC}"
echo "https://${DOMAIN}"
echo
echo -e "${YELLOW}You can use this editor to modify and correct any files in your Go4It deployment.${NC}"
echo -e "${YELLOW}The editor includes AI-powered diagnostics and correction capabilities via Star Coder.${NC}"
echo
echo -e "${GREEN}To check the status:${NC} systemctl status star-coder-editor"
echo -e "${GREEN}To view logs:${NC} journalctl -u star-coder-editor"