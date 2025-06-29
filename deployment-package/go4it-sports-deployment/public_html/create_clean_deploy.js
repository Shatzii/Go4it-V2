/**
 * Go4It Sports Clean Deployment Generator
 * 
 * This script creates a minimal viable deployment package with proper
 * file structure and configurations that will work on your Hetzner server.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

// Configuration
const BUILD_DIR = path.join(__dirname, 'clean_build');
const PACKAGE_NAME = 'go4it_clean_deployment.zip';
const NGINX_CONFIG = `
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;
    
    root /var/www/go4itsports/client;
    index index.html;
    
    # Proper MIME type for JavaScript modules
    location ~ \\.js$ {
        types { application/javascript js; }
        add_header Cache-Control "no-cache";
    }
    
    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
`;

// Sample HTML for testing
const TEST_HTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Go4It Sports - Test Page</title>
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
            
            <button class="button" onclick="testAPI()">Test API Connection</button>
            <p id="api-result"></p>
        </div>
    </div>

    <script>
        // Update server time
        function updateTime() {
            document.getElementById('server-time').textContent = new Date().toLocaleString();
        }
        updateTime();
        setInterval(updateTime, 1000);
        
        // Test API connection
        async function testAPI() {
            const resultElement = document.getElementById('api-result');
            resultElement.textContent = 'Testing API connection...';
            
            try {
                const response = await fetch('/api/status');
                if (response.ok) {
                    const data = await response.json();
                    resultElement.textContent = 'API is working! Response: ' + JSON.stringify(data);
                    resultElement.className = 'success';
                } else {
                    resultElement.textContent = 'API responded with status: ' + response.status;
                    resultElement.className = '';
                }
            } catch (error) {
                resultElement.textContent = 'Could not connect to API: ' + error.message;
                resultElement.className = '';
            }
        }
    </script>
</body>
</html>
`;

// Simple Express server script
const SERVER_JS = `
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        message: 'Go4It Sports API is running correctly'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});
`;

// PM2 Ecosystem config
const PM2_CONFIG = `
module.exports = {
  apps: [
    {
      name: 'go4it-api',
      script: 'server/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};
`;

// Deployment script
const DEPLOY_SCRIPT = `#!/bin/bash
# Go4It Sports Deployment Script

set -e

echo "=== Go4It Sports Deployment Script ==="
echo "Starting deployment..."

# Create directories
mkdir -p /var/www/go4itsports/client
mkdir -p /var/www/go4itsports/server

# Extract the package
unzip -o $1 -d /var/www/go4itsports/

# Set permissions
chmod 755 -R /var/www/go4itsports/

# Install dependencies if needed
cd /var/www/go4itsports/server
npm install --production

# Copy Nginx config
cp /var/www/go4itsports/nginx.conf /etc/nginx/sites-available/go4itsports.org

# Enable site
ln -sf /etc/nginx/sites-available/go4itsports.org /etc/nginx/sites-enabled/go4itsports.org

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx || {
    echo "Failed to restart Nginx with systemctl, trying service command..."
    service nginx restart
}

# Start server with PM2
cd /var/www/go4itsports
pm2 start ecosystem.config.js || {
    echo "Starting server without PM2..."
    cd /var/www/go4itsports/server
    node index.js &
}

echo "Deployment complete!"
echo "Testing site..."
curl -s http://localhost || echo "Could not connect to site"
`;

// Helper functions
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Main function
async function createDeploymentPackage() {
    console.log('Creating clean deployment package...');
    
    // Clean build directory
    if (fs.existsSync(BUILD_DIR)) {
        fs.rmSync(BUILD_DIR, { recursive: true, force: true });
    }
    ensureDir(BUILD_DIR);
    ensureDir(path.join(BUILD_DIR, 'client'));
    ensureDir(path.join(BUILD_DIR, 'server'));
    
    // Create test files
    fs.writeFileSync(path.join(BUILD_DIR, 'client', 'index.html'), TEST_HTML);
    fs.writeFileSync(path.join(BUILD_DIR, 'server', 'index.js'), SERVER_JS);
    fs.writeFileSync(path.join(BUILD_DIR, 'ecosystem.config.js'), PM2_CONFIG);
    fs.writeFileSync(path.join(BUILD_DIR, 'nginx.conf'), NGINX_CONFIG);
    
    // Create deployment script
    const deployScriptPath = path.join(BUILD_DIR, 'deploy.sh');
    fs.writeFileSync(deployScriptPath, DEPLOY_SCRIPT);
    fs.chmodSync(deployScriptPath, '755');
    
    // Create package.json for the server
    const packageJson = {
        name: 'go4it-sports-api',
        version: '1.0.0',
        description: 'Go4It Sports API Server',
        main: 'index.js',
        dependencies: {
            'express': '^4.17.1'
        }
    };
    fs.writeFileSync(
        path.join(BUILD_DIR, 'server', 'package.json'), 
        JSON.stringify(packageJson, null, 2)
    );
    
    // Create README with instructions
    const readme = `# Go4It Sports Clean Deployment

## Deployment Instructions

1. Upload this package to your server
2. SSH into your server
3. Navigate to the upload directory
4. Run: \`./deploy.sh go4it_clean_deployment.zip\`
5. Visit http://go4itsports.org or your server IP

## Troubleshooting

If you encounter issues:

1. Check Nginx logs: \`tail -f /var/log/nginx/error.log\`
2. Check the server logs: \`pm2 logs\` or \`journalctl -u nginx\`
3. Ensure port 80 is open: \`netstat -tulpn | grep :80\`
4. Ensure port 5000 is open: \`netstat -tulpn | grep :5000\`
5. Restart services: \`systemctl restart nginx\`
`;
    fs.writeFileSync(path.join(BUILD_DIR, 'README.md'), readme);
    
    // Create zip file
    console.log('Creating zip file...');
    const output = fs.createWriteStream(path.join(__dirname, PACKAGE_NAME));
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
        console.log(`Package created successfully: ${PACKAGE_NAME}`);
        console.log(`Total size: ${archive.pointer()} bytes`);
        console.log('\nDeployment instructions:');
        console.log('1. Download the zip file');
        console.log('2. Upload it to your server');
        console.log('3. SSH into your server and navigate to the upload directory');
        console.log('4. Run: ./deploy.sh go4it_clean_deployment.zip');
        console.log('5. Test by visiting your server IP or domain');
    });
    
    archive.on('error', (err) => {
        throw err;
    });
    
    archive.pipe(output);
    archive.directory(BUILD_DIR, false);
    await archive.finalize();
}

// Run the script
createDeploymentPackage().catch(err => {
    console.error('Error creating package:', err);
    process.exit(1);
});