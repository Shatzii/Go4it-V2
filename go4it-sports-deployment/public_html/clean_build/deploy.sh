#!/bin/bash
# Go4It Sports Clean Deployment Script

set -e

echo "===== Go4It Sports Clean Deployment ====="
echo "Starting deployment process..."

# Make sure we're in the right directory 
cd "$(dirname "$0")"

# 1. Set up directories
echo "[1/7] Setting up directories..."
mkdir -p /var/www/go4itsports/client
mkdir -p /var/www/go4itsports/server
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# 2. Configure Nginx
echo "[2/7] Configuring Nginx..."

# Backup existing configuration
if [ -f /etc/nginx/nginx.conf ]; then
    cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
    echo "Backed up existing nginx.conf to nginx.conf.backup"
fi

# Install the global Nginx configuration
cp nginx.global.conf /etc/nginx/nginx.conf
echo "Installed new global Nginx configuration"

# Install the site configuration
cp nginx.conf /etc/nginx/sites-available/go4itsports.org

# Remove any existing symlinks to avoid conflicts
rm -f /etc/nginx/sites-enabled/go4itsports.org
rm -f /etc/nginx/sites-enabled/default

# Create the symlink
ln -sf /etc/nginx/sites-available/go4itsports.org /etc/nginx/sites-enabled/

# Test Nginx configuration to make sure there are no syntax errors
echo "Testing Nginx configuration..."
nginx -t

# 3. Create a simple test page just to verify basic connectivity
echo "[3/7] Creating test page..."
cat > /var/www/go4itsports/client/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Go4It Sports - Server Test</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background-color: #121212; 
            color: white; 
            margin: 0; 
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        h1 { color: #4a90e2; margin-bottom: 10px; }
        p { line-height: 1.6; }
        .card {
            background-color: #1e1e1e;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            width: 100%;
        }
        .success { color: #4CAF50; }
        .button {
            background-color: #4a90e2;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 15px;
        }
        .button:hover {
            background-color: #357ABD;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Go4It Sports Platform</h1>
        <p>Server is online and configured correctly!</p>
        
        <div class="card">
            <h2>Server Status</h2>
            <p class="success">✓ NGINX is properly configured</p>
            <p class="success">✓ Static content is being served</p>
            <p>Server Time: <span id="server-time"></span></p>
        </div>
    </div>

    <script>
        // Update server time
        function updateTime() {
            document.getElementById('server-time').textContent = new Date().toLocaleString();
        }
        updateTime();
        setInterval(updateTime, 1000);
    </script>
</body>
</html>
EOF

# 4. Set proper permissions
echo "[4/7] Setting permissions..."
chmod -R 755 /var/www/go4itsports/
chown -R www-data:www-data /var/www/go4itsports/

# 5. Restart Nginx
echo "[5/7] Restarting Nginx..."
systemctl restart nginx || {
    echo "Failed to restart Nginx with systemctl, trying service command..."
    service nginx restart || {
        echo "Failed to restart Nginx with service, trying direct command..."
        killall -9 nginx
        nginx
    }
}

# 6. Check if Nginx is running
echo "[6/7] Verifying Nginx service..."
pgrep nginx > /dev/null && echo "Nginx is running" || echo "WARNING: Nginx is not running"

# 7. Test connectivity
echo "[7/7] Testing connectivity..."
curl -s http://localhost > /dev/null && echo "Connection test successful" || echo "Connection test failed"

echo ""
echo "===== Deployment Complete! ====="
echo "Next steps:"
echo "1. Verify your site is accessible at http://go4itsports.org"
echo "2. If it's working, upload your full application"
echo "3. If issues persist, check Nginx logs: tail -f /var/log/nginx/error.log"
echo ""
echo "Site is available at: http://go4itsports.org"
echo "==================================="