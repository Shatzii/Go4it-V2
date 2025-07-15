#!/bin/bash
#
# Command Panel & Sentinel 4.5 Integrated Deployment Script
# 
# This script deploys both the updated Command Panel and Sentinel Security System
# to the target server at 188.245.209.124
#

# Exit on error
set -e

# Banner
echo "┌─────────────────────────────────────────────────────────┐"
echo "│                                                         │"
echo "│  🔧 COMMAND PANEL + SENTINEL 4.5 DEPLOYMENT SCRIPT 🛡️   │"
echo "│                                                         │"
echo "│  Target: 188.245.209.124                               │"
echo "│  Path: /var/www/go4itsports/pharaoh/command_panel/     │"
echo "│                                                         │"
echo "└─────────────────────────────────────────────────────────┘"
echo ""

# Default values
SERVER_IP="188.245.209.124"
SSH_USER="root"
SSH_KEY="~/.ssh/id_rsa"
LOCAL_COMMAND_FILES="./command_panel_files/"
LOCAL_SENTINEL_PACKAGE="./Sentinel_4.5_Security_System.tar.gz"
REMOTE_BASE_PATH="/var/www/go4itsports/pharaoh/command_panel"

# Check for files
if [ ! -d "$LOCAL_COMMAND_FILES" ]; then
    echo "❌ Error: Command panel files directory not found: $LOCAL_COMMAND_FILES"
    echo "Please create this directory and place your command panel files inside."
    exit 1
fi

if [ ! -f "$LOCAL_SENTINEL_PACKAGE" ]; then
    echo "❌ Error: Sentinel package not found: $LOCAL_SENTINEL_PACKAGE"
    echo "Please download the Sentinel_4.5_Security_System.tar.gz file first."
    exit 1
fi

# SSH command prefix
SSH_CMD="ssh -i $SSH_KEY $SSH_USER@$SERVER_IP"
SCP_CMD="scp -i $SSH_KEY"

# Step 1: Check if we can connect to the server
echo "🔍 Testing SSH connection to $SERVER_IP..."
if ! $SSH_CMD "echo 'Connection successful'"; then
  echo "❌ Failed to connect to $SERVER_IP"
  exit 1
fi
echo "✅ SSH connection successful"

# Step 2: Create required directories on the server
echo "📁 Creating remote directories..."
$SSH_CMD "mkdir -p $REMOTE_BASE_PATH/sentinel"
echo "✅ Remote directories created"

# Step 3: Upload command panel files
echo "📤 Uploading command panel files..."
$SCP_CMD -r $LOCAL_COMMAND_FILES/* $SSH_USER@$SERVER_IP:$REMOTE_BASE_PATH/
echo "✅ Command panel files uploaded"

# Step 4: Upload and extract Sentinel package
echo "📤 Uploading Sentinel 4.5 package..."
$SCP_CMD $LOCAL_SENTINEL_PACKAGE $SSH_USER@$SERVER_IP:$REMOTE_BASE_PATH/
echo "✅ Sentinel package uploaded"

echo "📦 Extracting Sentinel package on server..."
$SSH_CMD "cd $REMOTE_BASE_PATH && tar -xzf Sentinel_4.5_Security_System.tar.gz -C sentinel/ && rm Sentinel_4.5_Security_System.tar.gz"
echo "✅ Sentinel package extracted"

# Step 5: Set appropriate permissions
echo "🔐 Setting file permissions..."
$SSH_CMD "chown -R www-data:www-data $REMOTE_BASE_PATH/ && chmod -R 755 $REMOTE_BASE_PATH/"
$SSH_CMD "chmod 755 $REMOTE_BASE_PATH/*.php"
echo "✅ Permissions set"

# Step 6: Install Sentinel dependencies
echo "🔧 Installing Sentinel dependencies..."
$SSH_CMD "cd $REMOTE_BASE_PATH/sentinel/ && npm ci --production"
echo "✅ Dependencies installed"

# Step 7: Update Sentinel configuration
echo "⚙️ Configuring Sentinel..."
$SSH_CMD "cat > $REMOTE_BASE_PATH/sentinel/.env << 'EOF'
# Sentinel 4.5 Production Environment Configuration
# For server: 188.245.209.124

# Server settings
NODE_ENV=production
SENTINEL_PORT=8080
SENTINEL_HOST=0.0.0.0

# Security settings
JWT_SECRET=change-this-to-a-secure-random-string-in-production
COOKIE_SECRET=change-this-to-another-secure-random-string
ENCRYPTION_KEY=change-this-to-a-32-character-random-string

# Logging configuration
LOG_LEVEL=info
LOG_FORMAT=json
LOG_DIR=/var/log/sentinel

# Access control
ADMIN_ROLES=admin,security_admin
API_ACCESS_ROLES=admin,security_admin,teacher,staff

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Integration with school platforms
SCHOOL_PLATFORMS=lawyer-makers,neurodivergent-school,language-school
PARENT_AUTH_ENABLED=true

# API settings - Updated for the command panel path
API_PREFIX=/pharaoh/command_panel/sentinel/api
DASHBOARD_PATH=/pharaoh/command_panel/sentinel/dashboard
EOF"
echo "✅ Sentinel configured"

# Step 8: Create Sentinel service
echo "🔄 Creating Sentinel service..."
$SSH_CMD "cat > /etc/systemd/system/sentinel.service << 'EOF'
[Unit]
Description=Sentinel 4.5 Security System
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$REMOTE_BASE_PATH/sentinel
ExecStart=/usr/bin/node $REMOTE_BASE_PATH/sentinel/dist/index.js
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/sentinel.log
StandardError=append:/var/log/sentinel-error.log
Environment=NODE_ENV=production
Environment=SERVER_ADDRESS=$SERVER_IP

[Install]
WantedBy=multi-user.target
EOF"

$SSH_CMD "systemctl daemon-reload && systemctl enable sentinel && systemctl restart sentinel"
echo "✅ Sentinel service created and started"

# Step 9: Configure Nginx for Sentinel
echo "🌐 Configuring Nginx..."
$SSH_CMD "cat > /etc/nginx/sites-available/sentinel << 'EOF'
# Sentinel security endpoints
location /pharaoh/command_panel/sentinel/api/ {
    proxy_pass http://localhost:8080/api/security/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_cache_bypass \$http_upgrade;
}

location /pharaoh/command_panel/sentinel/dashboard/ {
    proxy_pass http://localhost:8080/security-dashboard/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_cache_bypass \$http_upgrade;
}
EOF"

$SSH_CMD "ln -sf /etc/nginx/sites-available/sentinel /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"
echo "✅ Nginx configured"

# Step 10: Add Security Integration to Command Panel
echo "🔗 Integrating Security into Command Panel..."
$SSH_CMD "if grep -q 'Security Monitoring' $REMOTE_BASE_PATH/index.html; then
  echo 'Security integration already exists in index.html'
else
  # Insert security module before the closing body tag
  sed -i 's#</body>#<!-- Sentinel Security Integration -->\\n<div class=\"panel-section\">\\n  <h3>Security Monitoring</h3>\\n  <div class=\"action-buttons\">\\n    <a href=\"/pharaoh/command_panel/sentinel/dashboard/\" class=\"btn-primary\">Security Dashboard</a>\\n    <a href=\"/pharaoh/command_panel/sentinel/api/status\" class=\"btn-secondary\" target=\"_blank\">Check Security Status</a>\\n  </div>\\n  <div id=\"security-status-display\" class=\"status-display\">\\n    <p>Loading security status...</p>\\n  </div>\\n</div>\\n\\n<script>\\n  // Load security status\\n  fetch(\"/pharaoh/command_panel/sentinel/api/status\")\\n    .then(response => response.json())\\n    .then(data => {\\n      const statusDisplay = document.getElementById(\"security-status-display\");\\n      if (data.success) {\\n        const status = data.data.status;\\n        let statusClass = \"\";\\n        switch (status) {\\n          case \"secure\": statusClass = \"status-good\"; break;\\n          case \"warning\": statusClass = \"status-warning\"; break;\\n          case \"critical\": statusClass = \"status-critical\"; break;\\n          default: statusClass = \"\";\\n        }\\n        statusDisplay.innerHTML = `\\n          <p class=\"\${statusClass}\">Security Status: \${status.toUpperCase()}</p>\\n          <p>Threat Level: \${data.data.threatLevel}/100</p>\\n          <p>Active Threats: \${data.data.activeThreats}</p>\\n          <p>Last Updated: \${new Date(data.data.lastUpdated).toLocaleString()}</p>\\n        `;\\n      } else {\\n        statusDisplay.innerHTML = \"<p class=\\\"status-error\\\">Unable to load security status</p>\";\\n      }\\n    })\\n    .catch(error => {\\n      document.getElementById(\"security-status-display\").innerHTML = \\n        \"<p class=\\\"status-error\\\">Error connecting to security system</p>\";\\n    });\\n</script>\\n\\n</body>#' $REMOTE_BASE_PATH/index.html
  echo 'Security integration added to index.html'
fi"
echo "✅ Security integration added to Command Panel"

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "You can access your upgraded Command Panel with integrated security at:"
echo "  http://$SERVER_IP/pharaoh/command_panel/"
echo ""
echo "Security Dashboard is available at:"
echo "  http://$SERVER_IP/pharaoh/command_panel/sentinel/dashboard/"
echo ""
echo "API endpoints are available at:"
echo "  http://$SERVER_IP/pharaoh/command_panel/sentinel/api/"
echo ""
echo "Useful commands on the server:"
echo "  systemctl status sentinel               # Check Sentinel service status"
echo "  systemctl restart sentinel              # Restart Sentinel service"
echo "  journalctl -u sentinel -f               # View Sentinel logs"
echo ""