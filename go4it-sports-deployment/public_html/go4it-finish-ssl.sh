#!/bin/bash

# ==============================================
# GO4IT SPORTS SSL CONFIGURATION FINISHER
# Version: 1.0.0
# - Creates necessary directories
# - Sets up NGINX configuration
# - Completes the SSL installation
# ==============================================

echo "===== GO4IT SPORTS SSL CONFIGURATION FINISHER ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"

# Base directory and domains
DOMAIN="go4itsports.org"
SSL_DIR="/etc/nginx/ssl"
NGINX_CONF="/etc/nginx/sites-available/go4itsports.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/go4itsports.conf"

# STEP 1: Create SSL directory
echo -e "\n===== STEP 1: CREATING SSL DIRECTORY ====="
sudo mkdir -p "$SSL_DIR"
sudo chmod 700 "$SSL_DIR"
echo "✅ SSL directory created: $SSL_DIR"

# STEP 2: Create NGINX configuration file
echo -e "\n===== STEP 2: CREATING NGINX CONFIGURATION ====="
cat > "/tmp/go4itsports.conf" << 'EOF'
# NGINX configuration for go4itsports.org with SSL

# HTTP server block - redirects all traffic to HTTPS
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;
    
    # Redirect all HTTP requests to HTTPS
    return 301 https://$host$request_uri;
}

# HTTPS server block
server {
    listen 443 ssl;
    server_name go4itsports.org www.go4itsports.org;
    
    # SSL certificate configuration
    ssl_certificate /etc/nginx/ssl/go4itsports.org.crt;
    ssl_certificate_key /etc/nginx/ssl/go4itsports.org.key;
    
    # SSL protocols and ciphers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # SSL optimizations
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    
    # Root directory of the site
    root /var/www/go4itsports/public;
    index index.html index.htm index.php;
    
    # Logs
    access_log /var/log/nginx/go4itsports-access.log;
    error_log /var/log/nginx/go4itsports-error.log;
    
    # Main API proxy
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket proxy
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Deny access to .htaccess files
    location ~ /\.ht {
        deny all;
    }
}
EOF

# Copy the configuration file to NGINX directory
sudo cp "/tmp/go4itsports.conf" "$NGINX_CONF"
echo "✅ NGINX configuration created: $NGINX_CONF"

# Create symbolic link in sites-enabled
if [ -d "/etc/nginx/sites-enabled" ]; then
  sudo ln -sf "$NGINX_CONF" "$NGINX_ENABLED"
  echo "✅ NGINX configuration enabled"
fi

# STEP 3: Install the certificate
echo -e "\n===== STEP 3: INSTALLING CERTIFICATES ====="
# Copy the existing certificates from acme.sh directory
ACME_DIR="$HOME/.acme.sh/$DOMAIN"
if [ -d "$ACME_DIR" ]; then
  echo "Found certificates in $ACME_DIR"
  # Install certificates with acme.sh
  $HOME/.acme.sh/acme.sh --install-cert -d "$DOMAIN" \
    --key-file       "$SSL_DIR/$DOMAIN.key" \
    --fullchain-file "$SSL_DIR/$DOMAIN.crt" \
    --reloadcmd      "sudo systemctl force-reload nginx"
  echo "✅ Certificates installed"
else
  echo "❌ Certificates not found in $ACME_DIR"
  echo "Running certificate issuance again..."
  
  # Stop NGINX to free port 80
  sudo systemctl stop nginx
  
  # Issue the certificate
  $HOME/.acme.sh/acme.sh --issue -d "$DOMAIN" -d "www.$DOMAIN" --standalone
  
  # Install the certificate
  $HOME/.acme.sh/acme.sh --install-cert -d "$DOMAIN" \
    --key-file       "$SSL_DIR/$DOMAIN.key" \
    --fullchain-file "$SSL_DIR/$DOMAIN.crt" \
    --reloadcmd      "sudo systemctl force-reload nginx"
fi

# STEP 4: Test and restart NGINX
echo -e "\n===== STEP 4: TESTING AND RESTARTING NGINX ====="
echo "Testing NGINX configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
  echo "✅ NGINX configuration test successful"
  echo "Starting NGINX..."
  sudo systemctl restart nginx
else
  echo "❌ NGINX configuration test failed!"
  echo "Check the error message above and fix the configuration."
  exit 1
fi

# STEP 5: Open firewall for HTTPS
echo -e "\n===== STEP 5: OPENING FIREWALL FOR HTTPS ====="
if command -v ufw &> /dev/null; then
  echo "Using UFW firewall..."
  
  if ! sudo ufw status | grep -q "443"; then
    echo "Opening port 443 in UFW..."
    sudo ufw allow 443/tcp
  else
    echo "✅ Port 443 is already open in UFW"
  fi
  
  echo "Current UFW status:"
  sudo ufw status
elif command -v firewall-cmd &> /dev/null; then
  echo "Using firewalld..."
  
  if ! sudo firewall-cmd --list-ports | grep -q "443"; then
    echo "Opening port 443 in firewalld..."
    sudo firewall-cmd --permanent --add-port=443/tcp
    sudo firewall-cmd --reload
  else
    echo "✅ Port 443 is already open in firewalld"
  fi
  
  echo "Current firewalld status:"
  sudo firewall-cmd --list-all
else
  echo "No supported firewall detected, skipping firewall configuration"
fi

# STEP 6: Verify HTTPS
echo -e "\n===== STEP 6: VERIFYING HTTPS ACCESS ====="
echo "Testing HTTPS connectivity..."
if command -v curl &> /dev/null; then
  STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/")
  if [ "$STATUS_CODE" -eq 200 ] || [ "$STATUS_CODE" -eq 301 ] || [ "$STATUS_CODE" -eq 302 ]; then
    echo "✅ HTTPS is working! Status code: $STATUS_CODE"
  else
    echo "⚠️ HTTPS returned status code: $STATUS_CODE"
  fi
else
  echo "curl not available, please manually check HTTPS connectivity"
fi

echo -e "\n===== SUMMARY ====="
echo "1. NGINX SSL directory created at $SSL_DIR"
echo "2. NGINX configuration created and enabled"
echo "3. SSL certificates installed"
echo "4. NGINX restarted with new configuration"
echo "5. Firewall opened for HTTPS traffic"
echo "6. HTTPS connectivity tested"

echo -e "\n✅ SSL configuration completed: $(date)"
echo "Your site should now be accessible via HTTPS: https://$DOMAIN"
echo ""
echo "If you're experiencing issues:"
echo "  1. Check NGINX error logs: sudo tail -f /var/log/nginx/error.log"
echo "  2. Verify certificate files: ls -la $SSL_DIR"
echo "  3. Test NGINX configuration: sudo nginx -t"
echo "  4. Check certificate expiration: openssl x509 -in $SSL_DIR/$DOMAIN.crt -text -noout | grep -A2 'Validity'"