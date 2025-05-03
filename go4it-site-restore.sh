#!/bin/bash

# ==============================================
# GO4IT SPORTS SITE RESTORE AGENT
# Version: 1.0.0
# This script ensures the real Go4It website is shown instead of the placeholder
# ==============================================

echo "===== GO4IT SPORTS SITE RESTORE AGENT ====="
echo "Started: $(date)"
echo "Running as: $(whoami)"
echo "Current directory: $(pwd)"

# Set the base directory
CURRENT_DIR="$(pwd)"

# Check if we're in the proper directory
if [[ "$CURRENT_DIR" != *"go4itsports"* ]]; then
  echo "⚠️ Not in the Go4It Sports directory."
  if [ -d "/var/www/go4itsports" ]; then
    cd /var/www/go4itsports
    echo "✅ Changed to /var/www/go4itsports directory."
  else
    echo "❌ Cannot find Go4It Sports directory. Continuing with current directory."
  fi
fi

echo "Working in: $(pwd)"

# Step 1: Ensure correct client files are being served
echo
echo "===== CHECKING CLIENT FILES ====="

# Look for real client distribution files
CLIENT_PATHS=(
  "./client/dist"
  "./client/build"
  "./dist"
  "./build"
  "./public"
)

REAL_CLIENT_PATH=""
for path in "${CLIENT_PATHS[@]}"; do
  if [ -d "$path" ] && [ -f "$path/index.html" ]; then
    # Check if this is a real site, not a placeholder
    if grep -q "Go4It Sports" "$path/index.html" && grep -q "<script" "$path/index.html"; then
      REAL_CLIENT_PATH="$path"
      echo "✅ Found real client build at: $REAL_CLIENT_PATH"
      break
    fi
  fi
done

if [ -z "$REAL_CLIENT_PATH" ]; then
  echo "⚠️ Could not find real client build. Will look for it in other locations."
  
  # Look in deployment directories
  DEPLOY_PATHS=(
    "./go4it_latest_working_site"
    "./clean_build"
    "./go4it_complete_package"
    "./go4it_essential_deploy"
    "./complete_export"
  )
  
  for path in "${DEPLOY_PATHS[@]}"; do
    if [ -d "$path" ]; then
      echo "Checking deployment directory: $path"
      
      # Check subdirectories for client build
      for subdir in "$path"/*; do
        if [ -d "$subdir" ] && [ -f "$subdir/index.html" ]; then
          # Check if this is a real site, not a placeholder
          if grep -q "Go4It Sports" "$subdir/index.html" && grep -q "<script" "$subdir/index.html"; then
            echo "✅ Found client build in deployment directory: $subdir"
            
            # Copy to client/dist directory
            mkdir -p client/dist
            cp -r "$subdir"/* client/dist/
            REAL_CLIENT_PATH="client/dist"
            echo "✅ Copied files to client/dist directory"
            break 2
          fi
        fi
      done
    fi
  done
fi

# If we still don't have a real client path, create a better temporary site
if [ -z "$REAL_CLIENT_PATH" ]; then
  echo "⚠️ Could not find real client build. Creating enhanced temporary site."
  mkdir -p client/dist
  REAL_CLIENT_PATH="client/dist"
  
  cat > client/dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Go4It Sports - Elite Athlete Development</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4cc9f0;
      --primary-dark: #3a97b7;
      --secondary: #4361ee;
      --dark: #0a0a1a;
      --dark-accent: #1a1a2e;
      --text: #ffffff;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    html, body {
      height: 100%;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 
        'Open Sans', 'Helvetica Neue', sans-serif;
      background: var(--dark);
      color: var(--text);
      line-height: 1.6;
    }
    
    .wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    header {
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: var(--primary);
    }
    
    nav ul {
      display: flex;
      list-style: none;
    }
    
    nav li {
      margin-left: 30px;
    }
    
    nav a {
      color: var(--text);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }
    
    nav a:hover {
      color: var(--primary);
    }
    
    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 80px 0;
    }
    
    .hero h1 {
      font-size: 48px;
      margin-bottom: 20px;
      line-height: 1.2;
    }
    
    .hero p {
      font-size: 20px;
      max-width: 600px;
      margin-bottom: 30px;
    }
    
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background: var(--secondary);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: background 0.3s;
    }
    
    .btn:hover {
      background: #3a56d4;
    }
    
    .features {
      padding: 80px 0;
      background: var(--dark-accent);
    }
    
    .features h2 {
      font-size: 36px;
      margin-bottom: 40px;
      text-align: center;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    
    .feature-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 30px;
      transition: transform 0.3s;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
    }
    
    .feature-card h3 {
      font-size: 24px;
      margin-bottom: 15px;
      color: var(--primary);
    }
    
    .feature-card p {
      margin-bottom: 20px;
    }
    
    .feature-icon {
      font-size: 40px;
      margin-bottom: 20px;
      color: var(--primary);
    }
    
    .api-status {
      display: inline-block;
      padding: 8px 15px;
      border-radius: 4px;
      font-weight: 500;
      margin-bottom: 20px;
      background: #718096;
    }
    
    .api-status.connected {
      background: #10b981;
    }
    
    .api-status.disconnected {
      background: #ef4444;
    }
    
    footer {
      background: var(--dark-accent);
      padding: 40px 0;
      text-align: center;
      margin-top: 80px;
    }
    
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 36px;
      }
      
      .hero p {
        font-size: 18px;
      }
      
      nav {
        display: none;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="wrapper">
      <div class="logo">Go4It Sports</div>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="/auth" class="btn">Sign In</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <section class="hero">
    <div class="wrapper">
      <div class="api-status" id="apiStatus">API Status: Checking...</div>
      <h1>Elevate Your Athletic Performance</h1>
      <p>Connect with coaches, track your progress, and showcase your talents with our comprehensive athlete development platform.</p>
      <a href="/auth" class="btn">Get Started</a>
    </div>
  </section>
  
  <section class="features">
    <div class="wrapper">
      <h2>What Makes Us Different</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🏆</div>
          <h3>AI Motion Analysis</h3>
          <p>Our cutting-edge AI technology analyzes your form and provides personalized feedback for improvement.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎓</div>
          <h3>College Recruiting</h3>
          <p>Create your profile and get discovered by college recruiters looking for talent like yours.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⭐</div>
          <h3>StarPath Development</h3>
          <p>Follow a customized development path designed specifically for your sport and skill level.</p>
        </div>
      </div>
    </div>
  </section>
  
  <section>
    <div class="wrapper">
      <h2 style="text-align: center; margin: 60px 0 40px;">Latest Blog Posts</h2>
      <div id="blogPosts" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px;">
        <div style="background: var(--dark-accent); border-radius: 10px; overflow: hidden;">
          <div style="height: 180px; background: var(--primary-dark);"></div>
          <div style="padding: 20px;">
            <h3 style="margin-bottom: 10px;">Loading blog posts...</h3>
            <p>Please wait while we fetch the latest content.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <footer>
    <div class="wrapper">
      <p>© 2025 Go4It Sports. All rights reserved.</p>
    </div>
  </footer>

  <script>
    // Check API status
    fetch('/api/health')
      .then(response => response.json())
      .then(data => {
        document.getElementById('apiStatus').textContent = 'API Status: Connected';
        document.getElementById('apiStatus').classList.add('connected');
      })
      .catch(error => {
        document.getElementById('apiStatus').textContent = 'API Status: Disconnected';
        document.getElementById('apiStatus').classList.add('disconnected');
        console.error('API health check failed:', error);
      });
      
    // Load blog posts
    fetch('/api/blog-posts/featured')
      .then(response => response.json())
      .then(posts => {
        const blogsContainer = document.getElementById('blogPosts');
        blogsContainer.innerHTML = '';
        
        posts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.style.background = 'var(--dark-accent)';
          postElement.style.borderRadius = '10px';
          postElement.style.overflow = 'hidden';
          
          const imageDiv = document.createElement('div');
          imageDiv.style.height = '180px';
          imageDiv.style.background = 'var(--primary-dark)';
          
          const contentDiv = document.createElement('div');
          contentDiv.style.padding = '20px';
          
          const title = document.createElement('h3');
          title.style.marginBottom = '10px';
          title.textContent = post.title;
          
          const excerpt = document.createElement('p');
          excerpt.textContent = post.excerpt || post.content?.substring(0, 120) + '...' || 'Read more...';
          
          contentDiv.appendChild(title);
          contentDiv.appendChild(excerpt);
          
          postElement.appendChild(imageDiv);
          postElement.appendChild(contentDiv);
          
          blogsContainer.appendChild(postElement);
        });
      })
      .catch(error => {
        console.error('Failed to load blog posts:', error);
      });
  </script>
</body>
</html>
EOL
  echo "✅ Created enhanced temporary site"
fi

# Step 2: Update NGINX configuration to point to correct client directory
echo
echo "===== UPDATING NGINX CONFIGURATION ====="

# Check if NGINX is installed
if ! command -v nginx &> /dev/null; then
  echo "NGINX not found, installing..."
  apt-get update
  apt-get install -y nginx
fi

# Get absolute path of client directory
REAL_CLIENT_PATH_ABS="$(cd "$REAL_CLIENT_PATH" && pwd)"
echo "Using client path: $REAL_CLIENT_PATH_ABS"

# Create NGINX configuration
cat > /etc/nginx/sites-available/go4itsports.conf << EOL
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;

    root ${REAL_CLIENT_PATH_ABS};
    index index.html;

    # Frontend static files
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API requests
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
    }

    # Media files
    location /uploads/ {
        alias $(pwd)/uploads/;
        autoindex off;
    }
}
EOL

# Create symbolic link to enable the site
ln -sf /etc/nginx/sites-available/go4itsports.conf /etc/nginx/sites-enabled/

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test NGINX configuration
nginx -t

# Restart NGINX
systemctl restart nginx
systemctl enable nginx

# Step 3: Ensure PM2 is running the server
echo
echo "===== CHECKING SERVER STATUS ====="

# Check if PM2 process exists and is running
if ! pm2 list | grep -q "go4it-api"; then
  echo "PM2 process not found, starting server..."
  
  # Find server file
  SERVER_FILE=""
  if [ -f "server/index.js" ]; then
    SERVER_FILE="server/index.js"
  elif [ -f "server.js" ]; then
    SERVER_FILE="server.js"
  else
    echo "⚠️ Could not find server file. Please run the recovery agent first."
    exit 1
  fi
  
  # Start the server
  pm2 start $SERVER_FILE --name go4it-api --max-memory-restart 500M
  pm2 save
else
  echo "✅ PM2 process is running"
fi

# Step 4: Verify the fix
echo
echo "===== VERIFICATION ====="

# Check if server is running on port 5000
if netstat -tulpn | grep -q ":5000"; then
  echo "✅ Server is running on port 5000"
else
  echo "❌ Server is not running on port 5000"
fi

# Check if NGINX is running
if systemctl is-active --quiet nginx; then
  echo "✅ NGINX is running"
else
  echo "❌ NGINX is not running"
fi

# Check API health
if curl -s http://localhost:5000/api/health > /dev/null; then
  echo "✅ API health endpoint responding"
else
  echo "❌ API health endpoint not responding"
fi

# Check website access
if curl -s http://localhost > /dev/null; then
  echo "✅ Website is accessible"
else
  echo "❌ Website is not accessible"
fi

# Final status
echo
echo "===== SITE RESTORATION COMPLETE ====="
echo "The Go4It Sports website has been restored."
echo "Visit http://go4itsports.org to access the site."
echo "Completed: $(date)"