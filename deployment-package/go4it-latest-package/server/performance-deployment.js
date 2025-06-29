/**
 * Go4It Sports Performance Optimization Deployment Script
 * 
 * This script should be run on your production server to 
 * apply the performance optimizations.
 */

// Path: server/performance-deployment.js

#!/usr/bin/env node

/**
 * This script applies all performance optimizations to a Go4It Sports deployment:
 * 1. Sets up Redis for caching
 * 2. Configures NGINX for optimal static asset serving
 * 3. Applies database indexes for better query performance
 * 4. Configures PM2 process clustering
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Main deployment function
async function deploy() {
  console.log(`${colors.bright}${colors.blue}==============================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}GO4IT SPORTS PERFORMANCE OPTIMIZATION DEPLOYER${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}==============================================${colors.reset}\n`);
  
  // Get confirmation before proceeding
  const confirmation = await question(`${colors.yellow}This script will apply performance optimizations to your Go4It Sports deployment.${colors.reset}\nContinue? (y/n): `);
  
  if (confirmation.toLowerCase() !== 'y') {
    console.log(`${colors.red}Deployment cancelled.${colors.reset}`);
    process.exit(0);
  }
  
  try {
    // Step 1: Install Redis if not present
    await installRedis();
    
    // Step 2: Apply database optimizations
    await optimizeDatabase();
    
    // Step 3: Configure NGINX for performance
    await configureNginx();
    
    // Step 4: Set up PM2 clustering
    await configurePm2Clustering();
    
    // Step 5: Apply CDN configuration
    await configureCdn();
    
    // Step 6: Final restart of services
    await restartServices();
    
    console.log(`\n${colors.green}${colors.bright}Performance optimizations successfully applied!${colors.reset}`);
    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log(`${colors.cyan}1. Monitor server performance${colors.reset}`);
    console.log(`${colors.cyan}2. Check cache hit rates in logs${colors.reset}`);
    console.log(`${colors.cyan}3. Consider upgrading to a CDN service for global distribution${colors.reset}\n`);
    
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}Error during deployment:${colors.reset} ${error.message}`);
    console.error(`${colors.yellow}Check the logs for more details.${colors.reset}`);
  } finally {
    rl.close();
  }
}

// Promisified question function
function question(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

// Execute a command and return its output
function exec(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
  } catch (error) {
    console.error(`${colors.red}Command failed:${colors.reset} ${command}`);
    throw error;
  }
}

// Step 1: Install Redis
async function installRedis() {
  console.log(`\n${colors.bright}${colors.cyan}STEP 1: Installing Redis${colors.reset}`);
  
  try {
    // Check if Redis is already installed
    const redisCheck = exec('redis-cli ping', { silent: true }).toString().trim();
    if (redisCheck === 'PONG') {
      console.log(`${colors.green}✓ Redis is already installed and running${colors.reset}`);
      return;
    }
  } catch (error) {
    // Redis is not installed or not running
    console.log(`${colors.yellow}➤ Redis needs to be installed${colors.reset}`);
    
    // Install Redis
    exec('sudo apt update');
    exec('sudo apt install -y redis-server');
    
    // Configure Redis for production
    const redisConf = `/etc/redis/redis.conf`;
    console.log(`${colors.yellow}➤ Configuring Redis for production...${colors.reset}`);
    
    // Make a backup of the original config
    exec(`sudo cp ${redisConf} ${redisConf}.bak`);
    
    // Update Redis configuration for production use
    exec(`sudo sed -i 's/^# maxmemory-policy.*/maxmemory-policy allkeys-lru/' ${redisConf}`);
    exec(`sudo sed -i 's/^# maxmemory .*/maxmemory 256mb/' ${redisConf}`);
    
    // Enable Redis service
    exec('sudo systemctl enable redis-server');
    exec('sudo systemctl restart redis-server');
    
    // Verify Redis is running
    const redisStatus = exec('sudo systemctl status redis-server | grep Active', { silent: true }).toString();
    if (redisStatus.includes('active (running)')) {
      console.log(`${colors.green}✓ Redis installed and configured successfully${colors.reset}`);
    } else {
      throw new Error('Redis installation failed');
    }
  }
}

// Step 2: Optimize database
async function optimizeDatabase() {
  console.log(`\n${colors.bright}${colors.cyan}STEP 2: Optimizing Database${colors.reset}`);
  
  // Create SQL script for database optimizations
  const sqlScript = `
-- Add indexes to frequently queried columns
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date);
CREATE INDEX IF NOT EXISTS idx_featured_athletes_featured_date ON featured_athletes(featured_date);
CREATE INDEX IF NOT EXISTS idx_content_blocks_section_key ON content_blocks(section_key);
CREATE INDEX IF NOT EXISTS idx_combine_events_event_date ON combine_events(event_date);
CREATE INDEX IF NOT EXISTS idx_scout_vision_feed_created_at ON scout_vision_feed(created_at);

-- Add indexes to foreign keys
CREATE INDEX IF NOT EXISTS idx_user_ids ON featured_athletes(user_id);

-- Optimize database settings for 16GB RAM server
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET effective_cache_size = '12GB';
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '1GB';
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET max_worker_processes = 8;
ALTER SYSTEM SET max_parallel_workers_per_gather = 4;
ALTER SYSTEM SET max_parallel_workers = 8;

-- Adjust autovacuum settings for better performance
ALTER SYSTEM SET autovacuum_vacuum_scale_factor = 0.1;
ALTER SYSTEM SET autovacuum_analyze_scale_factor = 0.05;

-- Apply changes
SELECT pg_reload_conf();
  `;
  
  // Save the SQL script to a temporary file
  const sqlFilePath = './db_optimize.sql';
  fs.writeFileSync(sqlFilePath, sqlScript);
  
  try {
    // Run the SQL script as the postgres user
    console.log(`${colors.yellow}➤ Applying database optimizations...${colors.reset}`);
    exec(`sudo -u postgres psql -d go4it -f ${sqlFilePath}`);
    
    // Analyze the database for query planning improvements
    console.log(`${colors.yellow}➤ Analyzing database...${colors.reset}`);
    exec(`sudo -u postgres psql -d go4it -c "ANALYZE VERBOSE;"`);
    
    console.log(`${colors.green}✓ Database optimizations applied successfully${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Database optimization failed: ${error.message}${colors.reset}`);
    throw error;
  } finally {
    // Clean up the temporary SQL file
    fs.unlinkSync(sqlFilePath);
  }
}

// Step 3: Configure NGINX
async function configureNginx() {
  console.log(`\n${colors.bright}${colors.cyan}STEP 3: Configuring NGINX for Performance${colors.reset}`);
  
  // Generate optimized NGINX configuration
  const nginxConf = `
# Go4It Sports NGINX Configuration - Optimized for Performance
# Path: /etc/nginx/sites-available/go4itsports.conf

server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name go4itsports.org www.go4itsports.org;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/go4itsports.crt;
    ssl_certificate_key /etc/nginx/ssl/go4itsports.key;
    
    # SSL Optimization
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    ssl_buffer_size 4k;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip Compression
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/xml
        font/opentype
        image/svg+xml
        text/css
        text/plain;
    
    # Brotli Compression (if available)
    brotli on;
    brotli_comp_level 6;
    brotli_types
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/xml
        font/opentype
        image/svg+xml
        text/css
        text/plain;
    
    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg|eot)$ {
        proxy_pass http://127.0.0.1:5000;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, stale-while-revalidate=86400";
        access_log off;
    }
    
    # Main Application
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Increase buffers for larger requests/responses
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # Coach Portal API
    location /api/coach-portal/ {
        proxy_pass http://127.0.0.1:3000/api/coach-portal/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Client-side caching for API responses
    location ~* ^/api/(content-blocks|blog-posts|featured-athletes|scout-vision)/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        
        # Set cache headers if not present in the response
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Add cache-control headers for browsers/CDNs
        add_header Cache-Control "public, max-age=60, stale-while-revalidate=300" always;
        
        expires 1m;
    }
}
  `;
  
  // Write NGINX config to a temporary file
  const nginxConfPath = './go4itsports-perf.conf';
  fs.writeFileSync(nginxConfPath, nginxConf);
  
  try {
    // Move the config to NGINX directory and enable it
    console.log(`${colors.yellow}➤ Installing optimized NGINX configuration...${colors.reset}`);
    exec(`sudo cp ${nginxConfPath} /etc/nginx/sites-available/go4itsports.conf`);
    
    // Create symbolic link if it doesn't exist
    try {
      exec('sudo ln -sf /etc/nginx/sites-available/go4itsports.conf /etc/nginx/sites-enabled/', { silent: true });
    } catch (error) {
      // Link might already exist
    }
    
    // Test NGINX configuration
    console.log(`${colors.yellow}➤ Testing NGINX configuration...${colors.reset}`);
    exec('sudo nginx -t');
    
    // Reload NGINX to apply changes
    console.log(`${colors.yellow}➤ Reloading NGINX...${colors.reset}`);
    exec('sudo systemctl reload nginx');
    
    console.log(`${colors.green}✓ NGINX performance configuration applied successfully${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}NGINX configuration failed: ${error.message}${colors.reset}`);
    throw error;
  } finally {
    // Clean up temporary file
    fs.unlinkSync(nginxConfPath);
  }
}

// Step 4: Configure PM2 clustering
async function configurePm2Clustering() {
  console.log(`\n${colors.bright}${colors.cyan}STEP 4: Configuring PM2 Process Clustering${colors.reset}`);
  
  // Generate optimized PM2 ecosystem config
  const pm2Config = `
module.exports = {
  apps: [
    {
      name: 'go4it-main',
      script: 'server/index.js',
      instances: 'max', // Use all available CPUs
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 5000,
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://Go4it:Shatzii$$@localhost:5432/go4it',
        REDIS_URL: 'redis://localhost:6379'
      },
      // PM2 specific settings for performance
      node_args: '--max-old-space-size=1536',
      increment_var: 'PORT',
      instance_var: 'INSTANCE_ID',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Health checks
      exp_backoff_restart_delay: 100
    },
    {
      name: 'go4it-coach-api',
      script: 'server/api-server.js',
      instances: 2, // Use 2 instances for the coach API
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '512M',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://Go4it:Shatzii$$@localhost:5432/go4it',
        REDIS_URL: 'redis://localhost:6379'
      },
      // PM2 specific settings for performance
      node_args: '--max-old-space-size=768',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Health checks
      exp_backoff_restart_delay: 100
    }
  ]
};
  `;
  
  // Write PM2 config to ecosystem file
  const pm2ConfigPath = '/var/www/go4itsports/ecosystem.config.js';
  
  try {
    console.log(`${colors.yellow}➤ Configuring PM2 for clustering...${colors.reset}`);
    fs.writeFileSync(pm2ConfigPath, pm2Config);
    
    // Install pm2-logrotate module for log management
    console.log(`${colors.yellow}➤ Setting up PM2 log rotation...${colors.reset}`);
    exec('pm2 install pm2-logrotate');
    exec('pm2 set pm2-logrotate:max_size 10M');
    exec('pm2 set pm2-logrotate:compress true');
    exec('pm2 set pm2-logrotate:retain 7');
    
    console.log(`${colors.green}✓ PM2 clustering configured successfully${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}PM2 configuration failed: ${error.message}${colors.reset}`);
    throw error;
  }
}

// Step 5: Configure CDN-like features
async function configureCdn() {
  console.log(`\n${colors.bright}${colors.cyan}STEP 5: Setting up CDN-like Features${colors.reset}`);
  
  // Copy the CDN middleware files
  const sourceDir = path.join(__dirname, 'middleware');
  const destDir = '/var/www/go4itsports/server/middleware';
  
  // Ensure the destination directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  try {
    // Copy middleware files
    console.log(`${colors.yellow}➤ Installing CDN middleware...${colors.reset}`);
    exec(`cp ${sourceDir}/cdn-middleware.js ${destDir}/`);
    exec(`cp ${sourceDir}/cache-middleware.js ${destDir}/`);
    exec(`cp ${sourceDir}/compression-middleware.js ${destDir}/`);
    exec(`cp ${sourceDir}/index.js ${destDir}/`);
    
    // Copy cache manager
    console.log(`${colors.yellow}➤ Installing cache manager...${colors.reset}`);
    exec(`cp ${__dirname}/cache-manager.js /var/www/go4itsports/server/`);
    
    console.log(`${colors.green}✓ CDN-like features installed successfully${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}CDN configuration failed: ${error.message}${colors.reset}`);
    throw error;
  }
}

// Step 6: Restart all services
async function restartServices() {
  console.log(`\n${colors.bright}${colors.cyan}STEP 6: Restarting Services${colors.reset}`);
  
  try {
    // Restart PM2 processes
    console.log(`${colors.yellow}➤ Restarting PM2 processes...${colors.reset}`);
    exec('cd /var/www/go4itsports && pm2 reload ecosystem.config.js');
    
    // Restart NGINX
    console.log(`${colors.yellow}➤ Restarting NGINX...${colors.reset}`);
    exec('sudo systemctl restart nginx');
    
    // Final checks
    console.log(`${colors.yellow}➤ Verifying services...${colors.reset}`);
    exec('sudo systemctl status nginx | grep Active', { silent: true });
    exec('pm2 list', { silent: true });
    
    console.log(`${colors.green}✓ All services restarted successfully${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Service restart failed: ${error.message}${colors.reset}`);
    throw error;
  }
}

// Run the deployment process
deploy().catch(error => {
  console.error(`${colors.red}Deployment failed: ${error.message}${colors.reset}`);
  process.exit(1);
});