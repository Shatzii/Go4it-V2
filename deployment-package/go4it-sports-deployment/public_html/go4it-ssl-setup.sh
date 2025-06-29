#!/bin/bash
# GO4IT SPORTS SSL/NGINX CONFIGURATION SCRIPT
# This script will configure NGINX to use your SSL certificates for HTTPS

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}GO4IT SPORTS: SSL/NGINX CONFIGURATION${NC}"
echo -e "${BLUE}============================================================${NC}"

# Function to display section headers
section() {
  echo -e "\n${YELLOW}>>> $1...${NC}"
}

# Function to display success messages
success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to display error messages
error() {
  echo -e "${RED}✗ $1${NC}"
}

# Function to display info messages
info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

# Instructions for running the script
echo -e "${YELLOW}This script will configure NGINX with SSL for Go4It Sports${NC}"
echo -e "${YELLOW}It should be run on your server with root privileges${NC}"
echo ""
echo -e "Run this script on your go4itsports.org server with:"
echo -e "${BLUE}sudo bash go4it-ssl-setup.sh${NC}"
echo ""

section "SSL Certificate Check"
# Check if SSL certificates exist
if [ -f /etc/nginx/ssl/go4itsports.crt ] && [ -f /etc/nginx/ssl/go4itsports.key ]; then
  success "Self-signed SSL certificates found at /etc/nginx/ssl/"
  CERT_PATH="/etc/nginx/ssl/go4itsports.crt"
  KEY_PATH="/etc/nginx/ssl/go4itsports.key"
elif [ -f /etc/letsencrypt/live/go4itsports.org/fullchain.pem ] && [ -f /etc/letsencrypt/live/go4itsports.org/privkey.pem ]; then
  success "Let's Encrypt SSL certificates found"
  CERT_PATH="/etc/letsencrypt/live/go4itsports.org/fullchain.pem"
  KEY_PATH="/etc/letsencrypt/live/go4itsports.org/privkey.pem"
else
  info "No SSL certificates found, creating self-signed certificates"
  
  # Create directory for SSL certs if it doesn't exist
  mkdir -p /etc/nginx/ssl
  
  # Generate self-signed certificate with modern parameters
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/go4itsports.key \
    -out /etc/nginx/ssl/go4itsports.crt \
    -subj "/CN=go4itsports.org" \
    -addext "subjectAltName = DNS:go4itsports.org,DNS:www.go4itsports.org"
  
  if [ $? -eq 0 ]; then
    success "Self-signed SSL certificates created"
    CERT_PATH="/etc/nginx/ssl/go4itsports.crt"
    KEY_PATH="/etc/nginx/ssl/go4itsports.key"
  else
    error "Failed to create SSL certificates"
    exit 1
  fi
fi

section "NGINX Configuration"
# Make sure NGINX is installed
if ! command -v nginx &> /dev/null; then
  info "NGINX not installed, installing now"
  apt-get update
  apt-get install -y nginx
else
  success "NGINX is installed"
fi

# Create NGINX configuration
info "Creating NGINX configuration for Go4It Sports"
cat > /etc/nginx/sites-available/go4itsports.conf << EOT
# Go4It Sports NGINX Configuration
# Created by the Go4It Sports Deployment Agent

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;
    
    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name go4itsports.org www.go4itsports.org;
    
    # SSL Configuration
    ssl_certificate ${CERT_PATH};
    ssl_certificate_key ${KEY_PATH};
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Main Application
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
    }
    
    # Coach Portal API
    location /api/coach-portal/ {
        proxy_pass http://127.0.0.1:3000/api/coach-portal/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg|eot)$ {
        proxy_pass http://127.0.0.1:5000;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
EOT

# Enable the site configuration
info "Enabling Go4It Sports NGINX configuration"
ln -sf /etc/nginx/sites-available/go4itsports.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test NGINX config
info "Testing NGINX configuration"
nginx -t
if [ $? -eq 0 ]; then
  success "NGINX configuration is valid"
else
  error "NGINX configuration test failed"
  exit 1
fi

section "Firewall Configuration"
# Configure firewall if UFW is installed
if command -v ufw &> /dev/null; then
  info "Configuring firewall rules"
  ufw allow OpenSSH
  ufw allow 'Nginx Full'
  ufw --force enable
  success "Firewall configured"
fi

section "Starting Services"
# Restart NGINX to apply changes
info "Restarting NGINX service"
systemctl restart nginx
if [ $? -eq 0 ]; then
  success "NGINX service restarted successfully"
else
  error "Failed to restart NGINX service"
  systemctl status nginx
  exit 1
fi

# Check if PM2 processes are running
if command -v pm2 &> /dev/null; then
  info "Checking PM2 processes"
  if ! pm2 list | grep -q "go4it-main"; then
    info "Starting main application with PM2"
    cd /var/www/go4itsports
    pm2 start ecosystem.config.js --only go4it-main
  else
    success "Main application is already running"
  fi
  
  if ! pm2 list | grep -q "go4it-coach-api"; then
    info "Starting coach API with PM2"
    cd /var/www/go4itsports
    pm2 start ecosystem.config.js --only go4it-coach-api
  else
    success "Coach API is already running"
  fi
else
  error "PM2 is not installed, can't manage application processes"
fi

section "Testing Configuration"
# Test server status
info "Testing HTTPS setup"
if command -v curl &> /dev/null; then
  response=$(curl -k -s -o /dev/null -w "%{http_code}" https://localhost)
  if [ "$response" = "200" ] || [ "$response" = "302" ]; then
    success "HTTPS is working correctly (response code: $response)"
  else
    error "HTTPS not responding correctly (response code: $response)"
  fi
else
  info "curl is not installed, skipping HTTPS test"
fi

echo -e "\n${GREEN}============================================================${NC}"
echo -e "${GREEN}SSL/NGINX CONFIGURATION COMPLETE${NC}"
echo -e "${GREEN}============================================================${NC}"
echo -e "Your Go4It Sports platform should now be accessible at:"
echo -e "${BLUE}https://go4itsports.org${NC}"
echo -e ""
echo -e "If you encounter any issues:"
echo -e "1. Check NGINX status with: ${YELLOW}systemctl status nginx${NC}"
echo -e "2. View NGINX logs with: ${YELLOW}tail -f /var/log/nginx/error.log${NC}"
echo -e "3. Check application logs with: ${YELLOW}pm2 logs${NC}"
echo ""
echo -e "${YELLOW}Note:${NC} Since you're using self-signed certificates, browsers will"
echo -e "      show a security warning. You can proceed safely through this."
echo -e "      For production, consider adding Let's Encrypt certificates later."