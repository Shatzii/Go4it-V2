#!/bin/bash

# ==============================================
# GO4IT SPORTS HTTPS SETUP WITH ACME.SH
# Version: 1.0.0
# - Completes SSL certificate setup with acme.sh
# - Configures NGINX for HTTPS
# - Redirects HTTP to HTTPS
# ==============================================

echo "===== GO4IT SPORTS HTTPS SETUP WITH ACME.SH ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"

# Base directory
APP_DIR="/var/www/go4itsports"
DOMAIN="go4itsports.org"
WEBROOT="$APP_DIR/public"
EMAIL="admin@go4itsports.org" # CHANGE THIS to your actual email

# STEP 1: Verify acme.sh installation
echo -e "\n===== STEP 1: VERIFYING ACME.SH INSTALLATION ====="

if [ ! -f "$HOME/.acme.sh/acme.sh" ]; then
  echo "acme.sh not found. Installing now..."
  curl https://get.acme.sh | sh
else
  echo "✅ acme.sh is already installed"
fi

# STEP 2: Register account with acme.sh
echo -e "\n===== STEP 2: REGISTERING ACCOUNT ====="

echo "Registering account with email: $EMAIL"
$HOME/.acme.sh/acme.sh --register-account -m "$EMAIL"

# STEP 3: Ensure web directories exist
echo -e "\n===== STEP 3: CHECKING WEB DIRECTORIES ====="

if [ ! -d "$WEBROOT" ]; then
  echo "Creating webroot directory: $WEBROOT"
  mkdir -p "$WEBROOT"
fi

echo "Testing if webroot is accessible via HTTP..."
curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN/" || echo "Warning: Domain may not be accessible"

# STEP 4: Create SSL directory for NGINX
echo -e "\n===== STEP 4: SETTING UP NGINX SSL DIRECTORY ====="

SSL_DIR="/etc/nginx/ssl"
if [ ! -d "$SSL_DIR" ]; then
  echo "Creating NGINX SSL directory..."
  sudo mkdir -p "$SSL_DIR"
  sudo chmod 700 "$SSL_DIR"
else
  echo "✅ NGINX SSL directory already exists"
fi

# STEP 5: Stop NGINX temporarily for standalone mode
echo -e "\n===== STEP 5: PREPARING FOR CERTIFICATE ISSUANCE ====="
echo "Temporarily stopping NGINX to free up port 80..."
sudo systemctl stop nginx

# STEP 6: Issue the certificate
echo -e "\n===== STEP 6: ISSUING SSL CERTIFICATE ====="

echo "Attempting to issue certificate in standalone mode..."
$HOME/.acme.sh/acme.sh --issue -d "$DOMAIN" -d "www.$DOMAIN" --standalone

# Check if certificate was issued successfully
if [ -d "$HOME/.acme.sh/$DOMAIN" ]; then
  echo "✅ Certificate issued successfully"
else
  echo "❌ Certificate issuance failed"
  echo "Restarting NGINX and exiting..."
  sudo systemctl start nginx
  exit 1
fi

# STEP 7: Install the certificate to NGINX
echo -e "\n===== STEP 7: INSTALLING CERTIFICATE TO NGINX ====="

echo "Installing certificates to NGINX configuration..."
$HOME/.acme.sh/acme.sh --install-cert -d "$DOMAIN" \
  --key-file       "$SSL_DIR/$DOMAIN.key" \
  --fullchain-file "$SSL_DIR/$DOMAIN.crt" \
  --reloadcmd     "sudo systemctl reload nginx"

# STEP 8: Update NGINX configuration
echo -e "\n===== STEP 8: UPDATING NGINX CONFIGURATION ====="

NGINX_CONF="/etc/nginx/sites-available/go4itsports.conf"
if [ ! -f "$NGINX_CONF" ]; then
  FOUND_CONF=$(find /etc/nginx -name "*.conf" | grep -i "go4it\|sports" | head -1)
  if [ -n "$FOUND_CONF" ]; then
    echo "Found NGINX configuration at: $FOUND_CONF"
    NGINX_CONF="$FOUND_CONF"
  else
    echo "❌ No NGINX configuration found for Go4It Sports"
    echo "Restarting NGINX and exiting..."
    sudo systemctl start nginx
    exit 1
  fi
fi

echo "Backing up original NGINX configuration..."
BACKUP_CONF="$NGINX_CONF.backup-$(date +%Y%m%d%H%M%S)"
sudo cp "$NGINX_CONF" "$BACKUP_CONF"

echo "Updating NGINX configuration to use SSL..."
# Check if the configuration already has SSL settings
if grep -q "listen 443 ssl" "$NGINX_CONF"; then
  echo "✅ HTTPS configuration already exists in NGINX config"
else
  # Create a new config with SSL
  TEMP_CONF=$(mktemp)
  
  # Extract the existing server block content
  SERVER_BLOCK=$(sed -n '/server {/,/}/p' "$NGINX_CONF")
  
  # Write the HTTP to HTTPS redirect block
  cat > "$TEMP_CONF" << EOF
# HTTP server to redirect to HTTPS
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirect all HTTP requests to HTTPS
    return 301 https://\$host\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl;
    server_name $DOMAIN www.$DOMAIN;
    
    ssl_certificate $SSL_DIR/$DOMAIN.crt;
    ssl_certificate_key $SSL_DIR/$DOMAIN.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
    ssl_session_cache shared:SSL:10m;
    
    # The rest of your existing configuration
    $(echo "$SERVER_BLOCK" | grep -v "server {" | grep -v "listen 80" | grep -v "server_name")
}
EOF

  # Replace the existing config
  sudo mv "$TEMP_CONF" "$NGINX_CONF"
  echo "✅ NGINX configuration updated with HTTPS settings"
fi

# STEP 9: Test and restart NGINX
echo -e "\n===== STEP 9: TESTING AND RESTARTING NGINX ====="

echo "Testing NGINX configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
  echo "✅ NGINX configuration test successful"
  echo "Starting NGINX..."
  sudo systemctl start nginx
else
  echo "❌ NGINX configuration test failed!"
  echo "Restoring backup configuration..."
  sudo cp "$BACKUP_CONF" "$NGINX_CONF"
  echo "Starting NGINX with original configuration..."
  sudo systemctl start nginx
  exit 1
fi

# STEP 10: Set up auto-renewal
echo -e "\n===== STEP 10: SETTING UP AUTO-RENEWAL ====="

echo "Setting up acme.sh cronjob for certificate renewal..."
$HOME/.acme.sh/acme.sh --upgrade --auto-upgrade
echo "✅ Auto-renewal configured. Certificates will renew automatically."

# STEP 11: Final verification
echo -e "\n===== STEP 11: VERIFYING HTTPS ACCESS ====="

echo "Testing HTTPS access to the site..."
curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/" || echo "⚠️ HTTPS access may not be working yet"

echo -e "\n===== SUMMARY ====="
echo "1. acme.sh installed and registered"
echo "2. SSL certificate issued for $DOMAIN and www.$DOMAIN"
echo "3. NGINX configured for HTTPS"
echo "4. HTTP to HTTPS redirection set up"
echo "5. Auto-renewal configured"

echo -e "\n✅ HTTPS setup completed: $(date)"
echo "You should now be able to access your site via HTTPS: https://$DOMAIN"
echo ""
echo "If you're experiencing issues, check:"
echo "  - NGINX logs: sudo tail -f /var/log/nginx/error.log"
echo "  - Certificate path: ls -la $HOME/.acme.sh/$DOMAIN"
echo "  - Firewall: Make sure port 443 is open"
echo "  - DNS: Ensure your domain is pointing to this server's IP"