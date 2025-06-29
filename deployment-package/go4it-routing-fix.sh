#!/bin/bash

# ==============================================
# GO4IT SPORTS ROUTING FIX
# Version: 1.0.0
# This script fixes routing issues for all pages including auth
# ==============================================

echo "===== GO4IT SPORTS ROUTING FIX ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"
echo "Current directory: $(pwd)"

# Step 1: Check and fix NGINX configuration for SPA (Single Page Application) routing
echo
echo "===== UPDATING NGINX FOR SPA ROUTING ====="

# Create new NGINX config with proper SPA routing
cat > /etc/nginx/sites-available/go4itsports.conf << 'EOL'
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;

    root /var/www/go4itsports/client/dist;
    index index.html;

    # API requests go to Node.js server
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Media files
    location /uploads/ {
        alias /var/www/go4itsports/uploads/;
        autoindex off;
    }

    # THIS IS THE IMPORTANT CHANGE FOR SPA ROUTING
    # All routes including /auth should serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOL

# Test and reload NGINX
echo "Testing NGINX configuration..."
if nginx -t; then
    echo "✅ NGINX configuration is valid"
    systemctl reload nginx
    echo "✅ NGINX reloaded"
else
    echo "❌ NGINX configuration test failed"
    exit 1
fi

# Step 2: Verify that the frontend bundle includes SPA routing
echo
echo "===== CHECKING FRONTEND SPA ROUTER ====="

# Check if index.html exists
INDEX_HTML="/var/www/go4itsports/client/dist/index.html"
if [ -f "$INDEX_HTML" ]; then
    echo "✅ Found index.html"
    
    # Verify it contains routing code
    if grep -q "router\|Route\|Switch\|BrowserRouter\|wouter" "$INDEX_HTML"; then
        echo "✅ Index.html appears to include routing code"
    else
        echo "⚠️ Could not verify routing code in index.html. This might be normal if it's bundled/minified."
    fi
else
    echo "❌ index.html not found at expected location"
    
    # Try to find it elsewhere
    echo "Searching for index.html..."
    find /var/www/go4itsports -name "index.html" | head -5
fi

# Step 3: Create .htaccess file as a backup approach (some servers might use this)
echo
echo "===== CREATING .HTACCESS FALLBACK ====="

cat > /var/www/go4itsports/client/dist/.htaccess << 'EOL'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOL

echo "✅ Created .htaccess file for fallback support"

# Step 4: Verify auth page route works through curl
echo
echo "===== TESTING AUTH ROUTE ====="
if curl -s http://localhost/auth | grep -q "<!DOCTYPE html>"; then
    echo "✅ Auth route returns HTML content as expected"
else
    echo "❌ Auth route doesn't return expected content"
fi

# Step 5: Clear browser cache if needed
echo
echo "===== BROWSER CACHE NOTE ====="
echo "Note: You may need to clear your browser cache or use incognito mode"
echo "to see the changes. The routing should now be working correctly."

# Final verification
echo
echo "===== FIX SUMMARY ====="
echo "NGINX Status: $(systemctl is-active nginx)"
echo "Index.html Exists: $([ -f "$INDEX_HTML" ] && echo "Yes" || echo "No")"
echo "Auth Route Test: $(curl -s -o /dev/null -w "%{http_code}" http://localhost/auth)"
echo
echo "Routing Fix completed: $(date)"
echo "Try accessing the site at http://go4itsports.org and clicking 'Get Started' now."