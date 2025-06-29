/**
 * Go4It Sports License Server
 * 
 * This creates a complete licensing system that validates subscriptions
 * while allowing customers to self-host the application.
 */

const fs = require('fs');
const path = require('path');

async function createLicenseServer() {
  console.log('Creating Go4It Sports License Server...');
  
  const licenseServerDir = './license-server';
  
  // Create directory structure
  createLicenseServerStructure(licenseServerDir);
  
  // Create license validation API
  createLicenseAPI(licenseServerDir);
  
  // Create customer portal
  createCustomerPortal(licenseServerDir);
  
  // Create client-side license validation
  createClientLicenseValidator(licenseServerDir);
  
  // Create deployment configuration
  createDeploymentConfig(licenseServerDir);
  
  console.log('✓ License server created successfully!');
  console.log(`Deploy the license server to: https://licensing.go4itsports.com`);
}

function createLicenseServerStructure(baseDir) {
  const dirs = [
    'api',
    'portal', 
    'database',
    'client-integration',
    'config',
    'scripts'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

function createLicenseAPI(baseDir) {
  // Main API server
  const apiServer = `
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');

const app = express();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for license validation
const licenseValidationLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// License validation endpoint
app.post('/api/validate', licenseValidationLimit, async (req, res) => {
  try {
    const { licenseKey, serverFingerprint, installationId } = req.body;
    
    if (!licenseKey || !serverFingerprint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get license from database
    const licenseResult = await pool.query(
      \`SELECT l.*, c.subscription_status, c.subscription_tier, c.subscription_expires_at
       FROM licenses l 
       JOIN customers c ON l.customer_id = c.id 
       WHERE l.license_key = $1 AND l.active = true\`,
      [licenseKey]
    );
    
    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid license key' });
    }
    
    const license = licenseResult.rows[0];
    
    // Check if subscription is active
    if (license.subscription_status !== 'active') {
      return res.status(403).json({ 
        error: 'Subscription inactive',
        status: license.subscription_status,
        renewalUrl: \`https://go4itsports.com/renew?license=\${licenseKey}\`
      });
    }
    
    // Check if subscription has expired
    if (new Date() > new Date(license.subscription_expires_at)) {
      return res.status(403).json({
        error: 'Subscription expired',
        expiredAt: license.subscription_expires_at,
        renewalUrl: \`https://go4itsports.com/renew?license=\${licenseKey}\`
      });
    }
    
    // Verify server fingerprint (prevent license sharing)
    if (license.server_fingerprint && license.server_fingerprint !== serverFingerprint) {
      return res.status(403).json({
        error: 'License bound to different server',
        support: 'Contact support to transfer license'
      });
    }
    
    // Update server fingerprint if not set
    if (!license.server_fingerprint) {
      await pool.query(
        'UPDATE licenses SET server_fingerprint = $1, installation_id = $2 WHERE id = $3',
        [serverFingerprint, installationId, license.id]
      );
    }
    
    // Log usage
    await pool.query(
      \`INSERT INTO license_validations (license_id, server_fingerprint, validated_at) 
       VALUES ($1, $2, NOW())\`,
      [license.id, serverFingerprint]
    );
    
    // Get feature permissions based on subscription tier
    const features = getFeaturesByTier(license.subscription_tier);
    
    res.json({
      valid: true,
      tier: license.subscription_tier,
      features,
      maxAthletes: getMaxAthletesByTier(license.subscription_tier),
      expiresAt: license.subscription_expires_at,
      validatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('License validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feature definitions by tier
function getFeaturesByTier(tier) {
  const features = {
    starter: [
      'basic_gar_analysis',
      'team_management', 
      'performance_tracking',
      'basic_reports'
    ],
    professional: [
      'basic_gar_analysis',
      'advanced_gar_analysis',
      'team_management',
      'performance_tracking', 
      'ai_coaching',
      'recruitment_tools',
      'academic_tracking',
      'advanced_reports'
    ],
    enterprise: [
      'basic_gar_analysis',
      'advanced_gar_analysis',
      'premium_gar_analysis',
      'team_management',
      'performance_tracking',
      'ai_coaching', 
      'recruitment_tools',
      'academic_tracking',
      'white_label',
      'custom_branding',
      'advanced_reports',
      'analytics_api',
      'bulk_operations'
    ]
  };
  
  return features[tier] || features.starter;
}

function getMaxAthletesByTier(tier) {
  const limits = {
    starter: 50,
    professional: 200,
    enterprise: 9999 // Unlimited
  };
  
  return limits[tier] || limits.starter;
}

// Customer portal authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const customerResult = await pool.query(
      'SELECT * FROM customers WHERE email = $1',
      [email]
    );
    
    if (customerResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const customer = customerResult.rows[0];
    const validPassword = await bcrypt.compare(password, customer.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { customerId: customer.id, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        subscriptionTier: customer.subscription_tier,
        subscriptionStatus: customer.subscription_status
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer license info
app.get('/api/customer/license', authenticateToken, async (req, res) => {
  try {
    const licenseResult = await pool.query(
      \`SELECT l.*, c.subscription_tier, c.subscription_status, c.subscription_expires_at
       FROM licenses l
       JOIN customers c ON l.customer_id = c.id
       WHERE c.id = $1\`,
      [req.customer.customerId]
    );
    
    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ error: 'No license found' });
    }
    
    const license = licenseResult.rows[0];
    
    res.json({
      licenseKey: license.license_key,
      tier: license.subscription_tier,
      status: license.subscription_status,
      expiresAt: license.subscription_expires_at,
      features: getFeaturesByTier(license.subscription_tier),
      maxAthletes: getMaxAthletesByTier(license.subscription_tier)
    });
    
  } catch (error) {
    console.error('License info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, customer) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.customer = customer;
    next();
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`License server running on port \${PORT}\`);
});
`;

  fs.writeFileSync(path.join(baseDir, 'api', 'server.js'), apiServer);
  
  // Database schema
  const dbSchema = `
-- License Server Database Schema

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  subscription_tier VARCHAR(50) NOT NULL DEFAULT 'starter',
  subscription_status VARCHAR(50) NOT NULL DEFAULT 'active',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE licenses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  license_key VARCHAR(255) UNIQUE NOT NULL,
  server_fingerprint VARCHAR(255),
  installation_id VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE license_validations (
  id SERIAL PRIMARY KEY,
  license_id INTEGER REFERENCES licenses(id),
  server_fingerprint VARCHAR(255),
  validated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscription_events (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  event_type VARCHAR(50) NOT NULL, -- 'created', 'renewed', 'cancelled', 'expired'
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_licenses_license_key ON licenses(license_key);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_license_validations_license_id ON license_validations(license_id);
CREATE INDEX idx_license_validations_validated_at ON license_validations(validated_at);
`;

  fs.writeFileSync(path.join(baseDir, 'database', 'schema.sql'), dbSchema);
}

function createClientLicenseValidator(baseDir) {
  // Client-side license validation code
  const clientValidator = `
/**
 * Go4It Sports Client-Side License Validator
 * 
 * This code gets integrated into the self-hosted Go4It application
 * to validate subscriptions with the license server.
 */

const crypto = require('crypto');
const os = require('os');

class LicenseManager {
  constructor() {
    this.licenseKey = process.env.GO4IT_LICENSE_KEY;
    this.licenseServer = process.env.GO4IT_LICENSE_SERVER || 'https://licensing.go4itsports.com';
    this.lastValidation = null;
    this.cachedLicense = null;
    this.gracePeriodEnd = null;
    this.validationInterval = null;
    
    // Start validation loop
    this.startValidationLoop();
  }
  
  generateServerFingerprint() {
    // Create unique server fingerprint
    const networkInterfaces = os.networkInterfaces();
    const cpus = os.cpus();
    const hostname = os.hostname();
    
    const fingerprint = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        hostname,
        cpus: cpus.length,
        arch: os.arch(),
        platform: os.platform(),
        networkMacs: Object.values(networkInterfaces)
          .flat()
          .filter(iface => iface.mac && iface.mac !== '00:00:00:00:00:00')
          .map(iface => iface.mac)
          .sort()
      }))
      .digest('hex');
      
    return fingerprint;
  }
  
  async validateLicense() {
    try {
      if (!this.licenseKey) {
        throw new Error('No license key configured');
      }
      
      const response = await fetch(\`\${this.licenseServer}/api/validate\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          licenseKey: this.licenseKey,
          serverFingerprint: this.generateServerFingerprint(),
          installationId: this.getInstallationId()
        }),
        timeout: 10000 // 10 second timeout
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'License validation failed');
      }
      
      const license = await response.json();
      
      // Cache valid license
      this.cachedLicense = license;
      this.lastValidation = new Date();
      this.gracePeriodEnd = null;
      
      console.log('License validated successfully');
      return license;
      
    } catch (error) {
      console.warn('License validation failed:', error.message);
      
      // Handle offline or server issues
      if (this.cachedLicense && this.isWithinGracePeriod()) {
        console.log('Using cached license within grace period');
        return this.cachedLicense;
      }
      
      // Start grace period if not already started
      if (!this.gracePeriodEnd) {
        this.gracePeriodEnd = new Date(Date.now() + this.getGracePeriodMs());
        console.log('Starting grace period until:', this.gracePeriodEnd);
      }
      
      return null;
    }
  }
  
  getGracePeriodMs() {
    // Grace period based on cached license tier
    if (!this.cachedLicense) return 24 * 60 * 60 * 1000; // 1 day default
    
    const gracePeriods = {
      starter: 7 * 24 * 60 * 60 * 1000,      // 7 days
      professional: 3 * 24 * 60 * 60 * 1000, // 3 days  
      enterprise: 1 * 24 * 60 * 60 * 1000    // 1 day
    };
    
    return gracePeriods[this.cachedLicense.tier] || gracePeriods.starter;
  }
  
  isWithinGracePeriod() {
    return this.gracePeriodEnd && new Date() < this.gracePeriodEnd;
  }
  
  startValidationLoop() {
    // Validate immediately
    this.validateLicense();
    
    // Then validate every 24 hours
    this.validationInterval = setInterval(async () => {
      const license = await this.validateLicense();
      if (!license && !this.isWithinGracePeriod()) {
        this.handleLicenseExpired();
      }
    }, 24 * 60 * 60 * 1000);
  }
  
  hasFeature(feature) {
    if (!this.cachedLicense) return false;
    if (!this.isLicenseValid()) return false;
    
    return this.cachedLicense.features.includes(feature);
  }
  
  isLicenseValid() {
    if (!this.cachedLicense) return false;
    
    // Check if within grace period
    if (this.gracePeriodEnd && new Date() > this.gracePeriodEnd) {
      return false;
    }
    
    // Check if license has expired
    if (new Date() > new Date(this.cachedLicense.expiresAt)) {
      return false;
    }
    
    return true;
  }
  
  getMaxAthletes() {
    return this.cachedLicense ? this.cachedLicense.maxAthletes : 0;
  }
  
  getLicenseStatus() {
    return {
      valid: this.isLicenseValid(),
      tier: this.cachedLicense?.tier,
      features: this.cachedLicense?.features || [],
      maxAthletes: this.getMaxAthletes(),
      expiresAt: this.cachedLicense?.expiresAt,
      gracePeriodEnd: this.gracePeriodEnd,
      lastValidation: this.lastValidation
    };
  }
  
  handleLicenseExpired() {
    console.error('License expired - disabling application features');
    
    // Emit event for application to handle
    process.emit('licenseExpired', {
      renewalUrl: \`https://go4itsports.com/renew?license=\${this.licenseKey}\`
    });
  }
  
  getInstallationId() {
    // Generate or retrieve installation ID
    const fs = require('fs');
    const path = require('path');
    const installationFile = path.join(process.cwd(), '.go4it-installation');
    
    if (fs.existsSync(installationFile)) {
      return fs.readFileSync(installationFile, 'utf8').trim();
    }
    
    const installationId = crypto.randomUUID();
    fs.writeFileSync(installationFile, installationId);
    return installationId;
  }
  
  shutdown() {
    if (this.validationInterval) {
      clearInterval(this.validationInterval);
    }
  }
}

// Export singleton instance
module.exports = new LicenseManager();
`;

  fs.writeFileSync(path.join(baseDir, 'client-integration', 'license-manager.js'), clientValidator);
  
  // Express middleware for feature protection
  const middleware = `
/**
 * Express middleware for feature protection based on license
 */

const licenseManager = require('./license-manager');

// Require specific subscription tier
const requiresSubscription = (requiredTier) => {
  const tierLevels = { starter: 1, professional: 2, enterprise: 3 };
  
  return (req, res, next) => {
    const license = licenseManager.getLicenseStatus();
    
    if (!license.valid) {
      return res.status(403).json({
        error: 'Invalid or expired license',
        renewalUrl: \`https://go4itsports.com/renew?license=\${process.env.GO4IT_LICENSE_KEY}\`
      });
    }
    
    const userLevel = tierLevels[license.tier] || 0;
    const requiredLevel = tierLevels[requiredTier] || 999;
    
    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: \`Feature requires \${requiredTier} subscription\`,
        currentTier: license.tier,
        upgradeUrl: 'https://go4itsports.com/upgrade'
      });
    }
    
    req.license = license;
    next();
  };
};

// Require specific feature
const requiresFeature = (feature) => {
  return (req, res, next) => {
    if (!licenseManager.hasFeature(feature)) {
      return res.status(403).json({
        error: \`Feature '\${feature}' not available in your subscription\`,
        availableFeatures: licenseManager.getLicenseStatus().features
      });
    }
    
    next();
  };
};

// Check athlete limit
const checkAthleteLimit = async (req, res, next) => {
  const maxAthletes = licenseManager.getMaxAthletes();
  
  // Get current athlete count from database
  const currentCount = await getCurrentAthleteCount();
  
  if (currentCount >= maxAthletes) {
    return res.status(403).json({
      error: 'Athlete limit reached',
      current: currentCount,
      maximum: maxAthletes,
      upgradeUrl: 'https://go4itsports.com/upgrade'
    });
  }
  
  next();
};

module.exports = {
  requiresSubscription,
  requiresFeature,
  checkAthleteLimit
};
`;

  fs.writeFileSync(path.join(baseDir, 'client-integration', 'middleware.js'), middleware);
}

function createCustomerPortal(baseDir) {
  // Customer portal HTML
  const portalHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Go4It Sports - License Portal</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .btn { background: #007AFF; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; }
    .btn:hover { background: #0056CC; }
    .status-active { color: #28a745; font-weight: bold; }
    .status-expired { color: #dc3545; font-weight: bold; }
    .feature-list { list-style: none; }
    .feature-list li { padding: 8px 0; border-bottom: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Go4It Sports License Portal</h1>
      <p>Manage your self-hosted Go4It Sports subscription</p>
    </div>
    
    <div class="card" id="loginCard">
      <h2>Login</h2>
      <form id="loginForm">
        <div style="margin-bottom: 15px;">
          <label for="email">Email:</label>
          <input type="email" id="email" required style="width: 100%; padding: 8px; margin-top: 5px;">
        </div>
        <div style="margin-bottom: 15px;">
          <label for="password">Password:</label>
          <input type="password" id="password" required style="width: 100%; padding: 8px; margin-top: 5px;">
        </div>
        <button type="submit" class="btn">Login</button>
      </form>
    </div>
    
    <div class="card" id="dashboardCard" style="display: none;">
      <h2>License Information</h2>
      <div id="licenseInfo"></div>
      
      <h3 style="margin-top: 30px;">Available Features</h3>
      <ul id="featureList" class="feature-list"></ul>
      
      <div style="margin-top: 30px;">
        <button class="btn" onclick="renewSubscription()">Renew Subscription</button>
        <button class="btn" onclick="upgradeSubscription()" style="margin-left: 10px;">Upgrade</button>
        <button class="btn" onclick="logout()" style="background: #666; margin-left: 10px;">Logout</button>
      </div>
    </div>
  </div>
  
  <script>
    let authToken = localStorage.getItem('go4it_auth_token');
    
    if (authToken) {
      showDashboard();
    }
    
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
          const data = await response.json();
          authToken = data.token;
          localStorage.setItem('go4it_auth_token', authToken);
          showDashboard();
        } else {
          alert('Login failed');
        }
      } catch (error) {
        alert('Login error: ' + error.message);
      }
    });
    
    async function showDashboard() {
      document.getElementById('loginCard').style.display = 'none';
      document.getElementById('dashboardCard').style.display = 'block';
      
      try {
        const response = await fetch('/api/customer/license', {
          headers: { 'Authorization': \`Bearer \${authToken}\` }
        });
        
        if (response.ok) {
          const license = await response.json();
          displayLicenseInfo(license);
        } else {
          alert('Failed to load license information');
        }
      } catch (error) {
        alert('Error loading dashboard: ' + error.message);
      }
    }
    
    function displayLicenseInfo(license) {
      const statusClass = license.status === 'active' ? 'status-active' : 'status-expired';
      const expiresAt = new Date(license.expiresAt).toLocaleDateString();
      
      document.getElementById('licenseInfo').innerHTML = \`
        <p><strong>License Key:</strong> \${license.licenseKey}</p>
        <p><strong>Subscription Tier:</strong> \${license.tier.charAt(0).toUpperCase() + license.tier.slice(1)}</p>
        <p><strong>Status:</strong> <span class="\${statusClass}">\${license.status.toUpperCase()}</span></p>
        <p><strong>Expires:</strong> \${expiresAt}</p>
        <p><strong>Max Athletes:</strong> \${license.maxAthletes === 9999 ? 'Unlimited' : license.maxAthletes}</p>
      \`;
      
      const featureList = document.getElementById('featureList');
      featureList.innerHTML = '';
      license.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
        featureList.appendChild(li);
      });
    }
    
    function renewSubscription() {
      window.open('https://go4itsports.com/renew', '_blank');
    }
    
    function upgradeSubscription() {
      window.open('https://go4itsports.com/upgrade', '_blank');
    }
    
    function logout() {
      localStorage.removeItem('go4it_auth_token');
      location.reload();
    }
  </script>
</body>
</html>
`;

  fs.writeFileSync(path.join(baseDir, 'portal', 'index.html'), portalHTML);
}

function createDeploymentConfig(baseDir) {
  // Docker Compose for license server
  const dockerCompose = `
version: '3.8'

services:
  license-api:
    build: ./api
    environment:
      - DATABASE_URL=postgresql://license_user:license_pass@postgres:5432/license_db
      - JWT_SECRET=your-jwt-secret-here
      - NODE_ENV=production
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped

  portal:
    build: ./portal
    ports:
      - "3001:80"
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=license_db
      - POSTGRES_USER=license_user
      - POSTGRES_PASSWORD=license_pass
    volumes:
      - license_db_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx.conf:/etc/nginx/nginx.conf
      - ./config/ssl:/etc/nginx/ssl
    depends_on:
      - license-api
      - portal
    restart: unless-stopped

volumes:
  license_db_data:
`;

  fs.writeFileSync(path.join(baseDir, 'docker-compose.yml'), dockerCompose);
  
  // Nginx configuration
  const nginxConfig = `
events {
    worker_connections 1024;
}

http {
    upstream license_api {
        server license-api:3000;
    }
    
    upstream portal {
        server portal:80;
    }

    server {
        listen 80;
        server_name licensing.go4itsports.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name licensing.go4itsports.com;

        ssl_certificate /etc/nginx/ssl/server.crt;
        ssl_certificate_key /etc/nginx/ssl/server.key;

        location /api/ {
            proxy_pass http://license_api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            proxy_pass http://portal;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
`;

  fs.writeFileSync(path.join(baseDir, 'config', 'nginx.conf'), nginxConfig);
  
  // API Dockerfile
  const apiDockerfile = `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
`;

  fs.writeFileSync(path.join(baseDir, 'api', 'Dockerfile'), apiDockerfile);
  
  // API package.json
  const apiPackageJson = {
    "name": "go4it-license-server",
    "version": "1.0.0", 
    "main": "server.js",
    "dependencies": {
      "express": "^4.18.0",
      "cors": "^2.8.5",
      "jsonwebtoken": "^9.0.0",
      "bcryptjs": "^2.4.3",
      "pg": "^8.8.0",
      "express-rate-limit": "^6.7.0"
    }
  };
  
  fs.writeFileSync(path.join(baseDir, 'api', 'package.json'), JSON.stringify(apiPackageJson, null, 2));
}

// Execute the license server creation
if (require.main === module) {
  createLicenseServer().catch(console.error);
}

module.exports = { createLicenseServer };