/**
 * Go4It Sports Installation Wizard Launcher
 * 
 * This script starts the Go4It Sports installation wizard,
 * which guides users through the setup process.
 */

// Import required modules
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WIZARD_PORT = process.env.WIZARD_PORT || 3333;
const WIZARD_ASSETS_DIR = path.join(__dirname, 'wizard-assets');

// Create express app
const app = express();

// Serve static files
app.use(express.static(WIZARD_ASSETS_DIR));
app.use(express.json());

// Ensure wizard-assets directory exists
if (!fs.existsSync(WIZARD_ASSETS_DIR)) {
  console.error(`Error: Wizard assets directory not found at ${WIZARD_ASSETS_DIR}`);
  console.log('Please make sure the wizard-assets directory exists and contains the necessary files.');
  process.exit(1);
}

// API endpoint to get the current installation state
app.get('/api/state', (req, res) => {
  const installData = {
    step: 0,
    totalSteps: 7,
    serverInfo: {
      hostname: 'go4itsports-server',
      osType: 'Linux',
      osRelease: '5.15.0',
      cpuCount: 4,
      memoryTotal: 8,
      nodeVersion: process.version,
    },
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
      sessionSecret: 'generated-secret-key',
      jwtSecret: 'generated-jwt-key',
      cookieSecret: 'generated-cookie-key'
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
  
  res.json(installData);
});

// System check API
app.get('/api/system-check', (req, res) => {
  // Simulated system check results (for demonstration)
  const systemInfo = {
    hostname: 'go4itsports-server',
    osType: 'Linux',
    osRelease: '5.15.0',
    cpuCount: 4,
    memoryTotal: 8,
    nodeVersion: process.version,
  };
  
  const softwareChecks = {
    node: { name: 'Node.js', required: '20.0.0', installed: process.version, pass: true },
    npm: { name: 'NPM', required: '9.0.0', installed: '10.1.0', pass: true },
    postgres: { name: 'PostgreSQL', required: '14.0', installed: '15.3', pass: true },
    nginx: { name: 'Nginx', required: '1.20.0', installed: '1.22.1', pass: true }
  };
  
  const systemMetrics = {
    cpuUsage: 0.15,
    memoryUsage: 0.25,
    diskSpace: {
      total: 100,
      free: 75,
      totalGB: 100,
      availableGB: 75,
      percentUsed: '25%'
    },
    requirements: {
      cpu: { required: '2 cores', actual: '4 cores', pass: true },
      memory: { required: '4 GB', actual: '8 GB', pass: true }
    }
  };
  
  const allPassed = true;
  
  res.json({
    systemInfo,
    softwareChecks,
    systemMetrics,
    allPassed
  });
});

// Handle step updates
app.post('/api/update-step', (req, res) => {
  res.json({ success: true, currentStep: req.body.step });
});

// Database test API
app.post('/api/test-database', (req, res) => {
  // Simulated database test (for demonstration)
  const { host, port, name, user, password } = req.body;
  
  // Check if all required fields are provided
  if (!host || !port || !name || !user || !password) {
    return res.status(400).json({
      success: false,
      message: 'All database fields are required'
    });
  }
  
  // Successful test response
  res.json({
    success: true,
    message: 'Database connection successful!',
    version: 'PostgreSQL 15.3 on x86_64-pc-linux-gnu'
  });
});

// Web server config API
app.post('/api/webserver-config', (req, res) => {
  res.json({ success: true, message: 'Web server configuration saved' });
});

// API server config
app.post('/api/server-config', (req, res) => {
  res.json({ success: true, message: 'API server configuration saved' });
});

// API keys config
app.post('/api/api-keys', (req, res) => {
  res.json({ success: true, message: 'API keys saved' });
});

// Features config
app.post('/api/features', (req, res) => {
  res.json({ success: true, message: 'Feature settings saved' });
});

// Installation API
app.post('/api/install', (req, res) => {
  // Simulate installation process (for demonstration)
  setTimeout(() => {
    res.json({ success: true, message: 'Installation completed successfully' });
  }, 3000);
});

// Root route
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Start the server
const server = app.listen(WIZARD_PORT, () => {
  console.log(`\n🧙 Go4It Sports Installation Wizard\n`);
  console.log(`Open your browser and navigate to:`);
  console.log(`\x1b[34m  http://localhost:${WIZARD_PORT}\x1b[0m`);
  console.log(`\nPress Ctrl+C to exit the wizard`);
  
  // Try to open the browser automatically
  try {
    const url = `http://localhost:${WIZARD_PORT}`;
    // Using dynamic import for ESM compatibility
    import('open').then(openModule => {
      openModule.default(url);
    }).catch(() => {
      console.log('Could not automatically open browser. Please navigate to the URL manually.');
    });
  } catch (error) {
    console.log('Could not automatically open browser. Please navigate to the URL manually.');
  }
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\nInstallation wizard shutting down...');
  server.close(() => {
    console.log('Installation wizard has been terminated');
    process.exit(0);
  });
});