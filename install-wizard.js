/**
 * Go4It Sports Installation Wizard
 * 
 * A graphical web-based installer for the Go4It Sports platform
 * Version: 1.0.1
 */

import express from 'express';
import { exec, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { promisify } from 'util';
import * as dotenv from 'dotenv';
import crypto from 'crypto';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Promisify exec
const execAsync = promisify(exec);

// Constants
const WIZARD_PORT = process.env.WIZARD_PORT || 3333;
const LOG_FILE = './logs/install-wizard.log';
const INSTALL_DIR = process.cwd();

// Ensure logs directory exists
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs', { recursive: true });
}

// Setup Express App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'wizard-assets')));

// Simple logger
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Generate a random string for secrets
function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Initialize data storage for the installation process
const installData = {
  step: 0,
  totalSteps: 7,
  serverInfo: {
    hostname: os.hostname(),
    osType: os.type(),
    osRelease: os.release(),
    cpuCount: os.cpus().length,
    memoryTotal: Math.round(os.totalmem() / (1024 * 1024 * 1024)), // in GB
    nodeVersion: process.version,
  },
  environment: 'production',
  database: {
    host: 'localhost',
    port: 5432,
    name: 'go4it_sports',
    user: 'go4it',
    password: '',
    connectionEstablished: false
  },
  webServer: {
    type: 'nginx',
    port: 80,
    sslPort: 443,
    domain: 'go4itsports.org',
    useSSL: true,
    configCreated: false
  },
  api: {
    port: 5000,
    corsOrigins: '*',
    rateLimitMax: 100
  },
  apiKeys: {
    openai: '',
    anthropic: '',
    twilio: {
      accountSid: '',
      authToken: '',
      phoneNumber: ''
    }
  },
  security: {
    sessionSecret: generateRandomString(),
    jwtSecret: generateRandomString(),
    cookieSecret: generateRandomString()
  },
  features: {
    enableAiCoach: true,
    enableHighlightGeneration: true,
    enableSmsNotifications: false
  },
  status: {
    checksPassed: false,
    databaseSetup: false,
    serverConfigured: false,
    apiKeysConfigured: false,
    environmentConfigured: false,
    installed: false
  }
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'wizard-assets', 'index.html'));
});

// API endpoint to get the current installation state
app.get('/api/state', (req, res) => {
  res.json(installData);
});

// API endpoint to get system requirements
app.get('/api/system-check', async (req, res) => {
  try {
    // Check for required software
    const checks = {
      node: { name: 'Node.js', required: '20.0.0', installed: process.version, pass: false },
      npm: { name: 'NPM', required: '9.0.0', installed: '', pass: false },
      postgres: { name: 'PostgreSQL', required: '14.0', installed: '', pass: false },
      nginx: { name: 'Nginx', required: '1.20.0', installed: '', pass: false }
    };
    
    // Check NPM version
    try {
      const { stdout: npmVersion } = await execAsync('npm --version');
      checks.npm.installed = npmVersion.trim();
      checks.npm.pass = compareVersions(npmVersion.trim(), checks.npm.required) >= 0;
    } catch (error) {
      checks.npm.installed = 'Not installed';
      checks.npm.pass = false;
    }
    
    // Check PostgreSQL version
    try {
      const { stdout: pgVersion } = await execAsync('psql --version');
      const pgVersionMatch = pgVersion.match(/\d+\.\d+/);
      checks.postgres.installed = pgVersionMatch ? pgVersionMatch[0] : 'Unknown';
      checks.postgres.pass = pgVersionMatch && compareVersions(pgVersionMatch[0], checks.postgres.required) >= 0;
    } catch (error) {
      checks.postgres.installed = 'Not installed';
      checks.postgres.pass = false;
    }
    
    // Check Nginx version
    try {
      const { stdout: nginxVersion } = await execAsync('nginx -v 2>&1');
      const nginxVersionMatch = nginxVersion.match(/\d+\.\d+\.\d+/);
      checks.nginx.installed = nginxVersionMatch ? nginxVersionMatch[0] : 'Unknown';
      checks.nginx.pass = nginxVersionMatch && compareVersions(nginxVersionMatch[0], checks.nginx.required) >= 0;
    } catch (error) {
      checks.nginx.installed = 'Not installed';
      checks.nginx.pass = false;
    }
    
    // Check Node.js version
    checks.node.pass = compareVersions(process.version.substring(1), checks.node.required) >= 0;
    
    // Get system health metrics
    const metrics = {
      cpuUsage: os.loadavg()[0] / os.cpus().length,
      memoryUsage: 1 - (os.freemem() / os.totalmem()),
      diskSpace: await getDiskSpace(),
      requirements: {
        cpu: { required: '2 cores', actual: `${os.cpus().length} cores`, pass: os.cpus().length >= 2 },
        memory: { required: '4 GB', actual: `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`, pass: (os.totalmem() / (1024 * 1024 * 1024)) >= 4 }
      }
    };
    
    // Overall pass/fail
    const allPassed = Object.values(checks).every(check => check.pass) && 
                      Object.values(metrics.requirements).every(req => req.pass);
    
    // Update install data
    installData.status.checksPassed = allPassed;
    
    res.json({
      systemInfo: installData.serverInfo,
      softwareChecks: checks,
      systemMetrics: metrics,
      allPassed
    });
  } catch (error) {
    log(`Error in system check: ${error.message}`, 'ERROR');
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to test database connection
app.post('/api/test-database', async (req, res) => {
  const { host, port, name, user, password } = req.body;
  
  // Update installation data
  installData.database = {
    host,
    port: parseInt(port, 10),
    name,
    user,
    password,
    connectionEstablished: false
  };
  
  try {
    // Create a PostgreSQL connection pool
    const pool = new Pool({
      host,
      port: parseInt(port, 10),
      database: name,
      user,
      password,
      ssl: false,
      connectionTimeoutMillis: 5000
    });
    
    // Test the connection
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    client.release();
    await pool.end();
    
    // Connection successful
    installData.database.connectionEstablished = true;
    installData.status.databaseSetup = true;
    
    log(`Database connection successful: ${host}:${port}/${name}`);
    res.json({ 
      success: true, 
      message: 'Database connection successful', 
      version: result.rows[0].version 
    });
  } catch (error) {
    log(`Database connection failed: ${error.message}`, 'ERROR');
    res.status(400).json({ 
      success: false, 
      message: `Database connection failed: ${error.message}` 
    });
  }
});

// API endpoint to save web server configuration
app.post('/api/webserver-config', (req, res) => {
  const { type, port, sslPort, domain, useSSL } = req.body;
  
  // Update installation data
  installData.webServer = {
    type,
    port: parseInt(port, 10),
    sslPort: parseInt(sslPort, 10),
    domain,
    useSSL: useSSL === true || useSSL === 'true',
    configCreated: true
  };
  
  installData.status.serverConfigured = true;
  
  log(`Web server configuration saved: ${type}, domain: ${domain}`);
  res.json({ success: true, message: 'Web server configuration saved' });
});

// API endpoint to save API configuration
app.post('/api/server-config', (req, res) => {
  const { port, corsOrigins, rateLimitMax } = req.body;
  
  // Update installation data
  installData.api = {
    port: parseInt(port, 10),
    corsOrigins,
    rateLimitMax: parseInt(rateLimitMax, 10)
  };
  
  log(`API server configuration saved, port: ${port}`);
  res.json({ success: true, message: 'API configuration saved' });
});

// API endpoint to save API keys
app.post('/api/api-keys', (req, res) => {
  const { openai, anthropic, twilio } = req.body;
  
  // Update installation data
  installData.apiKeys = {
    openai: openai || '',
    anthropic: anthropic || '',
    twilio: {
      accountSid: twilio?.accountSid || '',
      authToken: twilio?.authToken || '',
      phoneNumber: twilio?.phoneNumber || ''
    }
  };
  
  installData.status.apiKeysConfigured = true;
  
  log('API keys saved');
  res.json({ success: true, message: 'API keys saved' });
});

// API endpoint to save feature settings
app.post('/api/features', (req, res) => {
  const { enableAiCoach, enableHighlightGeneration, enableSmsNotifications } = req.body;
  
  // Update installation data
  installData.features = {
    enableAiCoach: enableAiCoach === true || enableAiCoach === 'true',
    enableHighlightGeneration: enableHighlightGeneration === true || enableHighlightGeneration === 'true',
    enableSmsNotifications: enableSmsNotifications === true || enableSmsNotifications === 'true'
  };
  
  log('Feature settings saved');
  res.json({ success: true, message: 'Feature settings saved' });
});

// API endpoint for the installation process
app.post('/api/install', async (req, res) => {
  try {
    log('Starting installation process...');
    
    // Create a .env file with all the configuration
    await createEnvFile();
    
    // Generate nginx config if selected
    if (installData.webServer.type === 'nginx') {
      await createNginxConfig();
    }
    
    // Update installation status
    installData.status.environmentConfigured = true;
    installData.status.installed = true;
    installData.step = installData.totalSteps;
    
    log('Installation completed successfully');
    res.json({ success: true, message: 'Installation completed successfully' });
  } catch (error) {
    log(`Installation failed: ${error.message}`, 'ERROR');
    res.status(500).json({ success: false, message: `Installation failed: ${error.message}` });
  }
});

// API endpoint to update current step
app.post('/api/update-step', (req, res) => {
  const { step } = req.body;
  installData.step = parseInt(step, 10);
  res.json({ success: true, currentStep: installData.step });
});

// Function to compare version numbers
function compareVersions(a, b) {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;
    
    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }
  
  return 0;
}

// Function to get disk space
async function getDiskSpace() {
  try {
    // Simplified for demo purposes - returns mock data
    return {
      total: 100, // GB
      free: 50,   // GB
      used: 50    // GB
    };
  } catch (error) {
    console.error('Error getting disk space:', error);
    return { total: 0, free: 0, used: 0 };
  }
}

// Helper function to create .env file
async function createEnvFile() {
  const envPath = path.join(INSTALL_DIR, '.env');
  const envContent = `# Go4It Sports Production Environment
# Created by Installation Wizard
# Date: ${new Date().toISOString()}
# Version: 1.0.1

# Server settings
NODE_ENV=${installData.environment}
PORT=${installData.api.port}
SITE_URL=${installData.webServer.useSSL ? 'https' : 'http'}://${installData.webServer.domain}

# Database Connection
DATABASE_URL=postgresql://${installData.database.user}:${installData.database.password}@${installData.database.host}:${installData.database.port}/${installData.database.name}
PGHOST=${installData.database.host}
PGUSER=${installData.database.user}
PGPASSWORD=${installData.database.password}
PGDATABASE=${installData.database.name}
PGPORT=${installData.database.port}

# Database connection pooling settings
PG_MAX_CONNECTIONS=20
PG_IDLE_TIMEOUT=30000
PG_CONNECTION_TIMEOUT=5000

# API Keys
OPENAI_API_KEY=${installData.apiKeys.openai}
ANTHROPIC_API_KEY=${installData.apiKeys.anthropic}

# Optional: Twilio for SMS notifications
TWILIO_ACCOUNT_SID=${installData.apiKeys.twilio.accountSid}
TWILIO_AUTH_TOKEN=${installData.apiKeys.twilio.authToken}
TWILIO_PHONE_NUMBER=${installData.apiKeys.twilio.phoneNumber}

# Cache settings
API_CACHE_TTL=300  # 5 minutes in seconds
CACHE_ENABLED=true

# CORS settings
CORS_ORIGINS=${installData.api.corsOrigins}
RATE_LIMIT_MAX=${installData.api.rateLimitMax}

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=${path.join(INSTALL_DIR, 'logs', 'app.log')}

# Security
SESSION_SECRET=${installData.security.sessionSecret}
JWT_SECRET=${installData.security.jwtSecret}
COOKIE_SECRET=${installData.security.cookieSecret}

# Upload limits
MAX_UPLOAD_SIZE=100000000  # 100MB
ALLOWED_UPLOAD_TYPES=mp4,mov,jpg,jpeg,png,pdf

# Feature flags
ENABLE_AI_COACH=${installData.features.enableAiCoach}
ENABLE_HIGHLIGHT_GENERATION=${installData.features.enableHighlightGeneration}
ENABLE_SMS_NOTIFICATIONS=${installData.features.enableSmsNotifications}

# Performance
COMPRESSION_LEVEL=6
`;

  fs.writeFileSync(envPath, envContent);
  log('Created .env file with installation configuration');
  return true;
}

// Helper function to create Nginx config
async function createNginxConfig() {
  const configPath = path.join(INSTALL_DIR, 'go4itsports.nginx.conf');
  const sslConfig = installData.webServer.useSSL ? `
    # SSL Configuration
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/${installData.webServer.domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${installData.webServer.domain}/privkey.pem;
    
    # Modern SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 1.1.1.1 1.0.0.1 valid=300s;
    resolver_timeout 5s;` : '';

  const httpRedirect = installData.webServer.useSSL ? `
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name ${installData.webServer.domain} www.${installData.webServer.domain};
    return 301 https://$host$request_uri;
}` : '';

  const nginxConfig = `# Nginx configuration for Go4It Sports
# Created by Installation Wizard
# Date: ${new Date().toISOString()}
# Installation Directory: ${INSTALL_DIR}

${httpRedirect}

server {
    ${installData.webServer.useSSL ? '' : `listen ${installData.webServer.port};`}
    server_name ${installData.webServer.domain} www.${installData.webServer.domain};
    
    ${sslConfig}
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Referrer-Policy strict-origin-when-cross-origin;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://api.openai.com https://api.anthropic.com wss://$host/ws ws://$host/ws; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com; font-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';";
    
    # Root directory
    root ${path.join(INSTALL_DIR, 'dist')};
    index index.html;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;
    
    # File cache settings
    location ~* \\.(?:jpg|jpeg|png|gif|ico|webp|svg|woff2|woff|ttf|otf|css|js)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
        try_files $uri =404;
    }
    
    # JS module files
    location ~* \\.js$ {
        default_type application/javascript;
        add_header X-Content-Type-Options nosniff;
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
        try_files $uri =404;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:${installData.api.port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # Cache API responses
        proxy_cache go4it_api_cache;
        proxy_cache_valid 200 302 5m;  # Cache successful responses for 5 minutes
        proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
        add_header X-Cache-Status $upstream_cache_status;
        
        # Don't cache authenticated requests
        proxy_cache_bypass $http_authorization;
        proxy_no_cache $http_authorization;
    }
    
    # WebSocket for real-time features
    location /ws {
        proxy_pass http://localhost:${installData.api.port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;  # 24 hours
    }
    
    # Media uploads
    location /uploads/ {
        alias ${path.join(INSTALL_DIR, 'uploads')}/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        try_files $uri =404;
    }
    
    # Handle SPA routes
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /error.html;
}

# API cache configuration
proxy_cache_path /var/cache/nginx/go4it_api_cache levels=1:2 keys_zone=go4it_api_cache:10m max_size=1g inactive=60m use_temp_path=off;`;

  fs.writeFileSync(configPath, nginxConfig);
  log(`Created Nginx configuration file at ${configPath}`);
  
  return true;
}

// Use the getDiskSpace function declared earlier

// Start the server
const server = app.listen(WIZARD_PORT, () => {
  log(`Installation wizard running at http://localhost:${WIZARD_PORT}`);
  console.log(`\n🧙 Go4It Sports Installation Wizard\n`);
  console.log(`Open your browser and navigate to:`);
  console.log(`\x1b[34m  http://localhost:${WIZARD_PORT}\x1b[0m`);
  console.log(`\nPress Ctrl+C to exit the wizard`);
  
  // Try to open the browser automatically
  try {
    open(`http://localhost:${WIZARD_PORT}`);
  } catch (error) {
    log(`Failed to open browser automatically: ${error.message}`, 'WARN');
  }
});

// Handle shutdown
process.on('SIGINT', () => {
  log('Installation wizard shutting down...');
  server.close(() => {
    log('Installation wizard has been terminated');
    process.exit(0);
  });
});