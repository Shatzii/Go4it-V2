#!/usr/bin/env node

/**
 * Go4It Sports Platform - Replit Deployment Preparation
 * 
 * Prepares the platform for Replit deployment with optimized configuration
 */

const fs = require('fs').promises;
const path = require('path');

async function prepareReplotDeployment() {
  console.log('🚀 Preparing Go4It Sports Platform for Replit Deployment...');
  
  try {
    // Create production build script
    await createProductionBuildScript();
    
    // Create deployment health check
    await createDeploymentHealthCheck();
    
    // Create production environment template
    await createProductionEnvTemplate();
    
    // Create deployment documentation
    await createDeploymentDocs();
    
    console.log('✅ Replit deployment preparation complete!');
    console.log('');
    console.log('🎯 Ready for Replit deployment:');
    console.log('1. Click the "Deploy" button in Replit');
    console.log('2. Configure environment variables in deployment settings');
    console.log('3. Monitor deployment at the provided URL');
    console.log('');
    console.log('📊 Platform features ready for production:');
    console.log('- Universal Port Server (auto-detects environment)');
    console.log('- Database-independent landing page');
    console.log('- Health monitoring system');
    console.log('- Bulletproof error handling');
    
  } catch (error) {
    console.error('❌ Error preparing deployment:', error);
  }
}

async function createProductionBuildScript() {
  const buildScript = `#!/bin/bash

# Go4It Sports Platform - Production Build Script
echo "🏗️  Building Go4It Sports Platform for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Prepare production server
echo "⚙️  Preparing production server..."
cp server.js dist/server.js 2>/dev/null || echo "Using existing server.js"

echo "✅ Build complete - ready for deployment!"
`;

  await fs.writeFile('build-production.sh', buildScript);
  console.log('📄 Created production build script');
}

async function createDeploymentHealthCheck() {
  const healthCheck = `#!/usr/bin/env node

/**
 * Deployment Health Check
 * Verifies all systems are operational for production deployment
 */

const http = require('http');

async function checkHealth(port = 5000) {
  return new Promise((resolve, reject) => {
    const req = http.get(\`http://localhost:\${port}/api/health\`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          resolve(health);
        } catch (e) {
          reject(new Error('Invalid health response'));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Health check timeout')));
  });
}

async function runDeploymentCheck() {
  console.log('🔍 Running deployment health check...');
  
  try {
    const health = await checkHealth();
    
    console.log('✅ Health Check Results:');
    console.log(\`   Status: \${health.status}\`);
    console.log(\`   Environment: \${health.environment}\`);
    console.log(\`   Port: \${health.port}\`);
    console.log(\`   Uptime: \${health.uptime}s\`);
    
    if (health.features) {
      console.log('📊 Features Status:');
      Object.entries(health.features).forEach(([feature, status]) => {
        console.log(\`   \${feature}: \${status ? '✅' : '❌'}\`);
      });
    }
    
    if (health.status === 'healthy') {
      console.log('🎯 Platform ready for production deployment!');
      process.exit(0);
    } else {
      console.log('⚠️  Platform not ready - check logs');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runDeploymentCheck();
}

module.exports = { checkHealth, runDeploymentCheck };
`;

  await fs.writeFile('deployment-health-check.js', healthCheck);
  console.log('📄 Created deployment health check');
}

async function createProductionEnvTemplate() {
  const envTemplate = `# Go4It Sports Platform - Production Environment Configuration

# === REQUIRED CONFIGURATION ===
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key

# Application Configuration
PORT=5000
NODE_ENV=production
NEXT_PUBLIC_PORT=5000

# === OPTIONAL AI SERVICES ===
# OpenAI API (for AI coaching features)
OPENAI_API_KEY=sk-your-openai-api-key

# Anthropic API (alternative AI provider)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# === OPTIONAL COMMUNICATION SERVICES ===
# Twilio (for SMS notifications)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# SendGrid (for email notifications)
SENDGRID_API_KEY=your-sendgrid-api-key

# === REPLIT DEPLOYMENT SETTINGS ===
# These are automatically set by Replit
REPLIT_DEV_DOMAIN=your-repl-domain.replit.dev
REPLIT_DB_URL=automatically-set-by-replit

# === SECURITY SETTINGS ===
# Session secret for secure authentication
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters

# === FEATURE FLAGS ===
# Enable/disable features for production
ENABLE_VIDEO_ANALYSIS=true
ENABLE_AI_COACHING=true
ENABLE_RECRUITMENT_HUB=true
ENABLE_TEAM_MANAGEMENT=true

# === MONITORING ===
# Health check configuration
HEALTH_CHECK_ENABLED=true
HEALTH_CHECK_PATH=/api/health
`;

  await fs.writeFile('.env.production', envTemplate);
  console.log('📄 Created production environment template');
}

async function createDeploymentDocs() {
  const deploymentDocs = `# Go4It Sports Platform - Replit Deployment Guide

## 🚀 Quick Deployment

### Step 1: Prepare for Deployment
1. Run the deployment preparation script:
   \`\`\`bash
   node deploy-replit.js
   \`\`\`

2. Test the platform locally:
   \`\`\`bash
   node server.js
   \`\`\`

### Step 2: Deploy on Replit
1. Click the **"Deploy"** button in Replit
2. Choose **"Autoscale"** deployment target
3. Configure environment variables (see below)
4. Click **"Deploy"**

### Step 3: Configure Environment Variables
In Replit deployment settings, add these required variables:

**Required:**
- \`DATABASE_URL\` - PostgreSQL connection string
- \`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\` - Clerk authentication
- \`CLERK_SECRET_KEY\` - Clerk secret key
- \`SESSION_SECRET\` - Random 32+ character string

**Optional (for full features):**
- \`OPENAI_API_KEY\` - AI coaching features
- \`ANTHROPIC_API_KEY\` - Alternative AI provider

### Step 4: Monitor Deployment
- Check deployment logs for any errors
- Visit your deployment URL
- Verify health check: \`https://your-app.replit.app/api/health\`

## 🏗️ Architecture Overview

The platform uses a **Universal Port Server** that automatically:
- Detects Replit environment
- Configures correct ports (5000 for production)
- Handles database connections gracefully
- Provides health monitoring

## 📊 Production Features

### Bulletproof Architecture
- **Database-independent landing page** - works even if database fails
- **Graceful degradation** - features degrade gracefully when services unavailable
- **Health monitoring** - real-time system status at /api/health
- **Error handling** - comprehensive logging and recovery

### Performance Optimizations
- **Next.js static generation** for fast page loads
- **Optimized database queries** with Drizzle ORM
- **Efficient file handling** for video uploads
- **CDN-ready assets** for global distribution

## 🔧 Troubleshooting

### Common Issues

**Port Configuration:**
- Platform automatically detects Replit and uses port 5000
- No manual configuration needed

**Database Connection:**
- Ensure DATABASE_URL is correctly set
- Test connection with: \`node deployment-health-check.js\`

**Authentication:**
- Verify Clerk keys are for production environment
- Check domain configuration in Clerk dashboard

**Performance:**
- Monitor resource usage in Replit dashboard
- Check health endpoint for system status

### Debug Commands

\`\`\`bash
# Check system health
node deployment-health-check.js

# Test database connection
npm run db:push

# View logs
tail -f logs/app.log

# Check environment variables
node -e "console.log(process.env.DATABASE_URL ? 'Database configured' : 'Database not configured')"
\`\`\`

## 🎯 Post-Deployment

### Verification Checklist
- [ ] Landing page loads successfully
- [ ] Health check returns "healthy" status
- [ ] User authentication works
- [ ] Database operations functional
- [ ] Video upload system operational
- [ ] AI coaching features active (if configured)

### Monitoring
- Set up alerts for deployment health
- Monitor user activity and performance
- Regular database backups
- Security updates and patches

## 📈 Scaling

The platform is configured for **autoscale** deployment:
- Automatically scales based on traffic
- Handles multiple concurrent users
- Optimized for neurodivergent user experience
- ADHD-friendly interface maintained at scale

## 🆘 Support

- **Health Status:** \`/api/health\` endpoint
- **Documentation:** Built-in help system
- **Logs:** Available in Replit dashboard
- **Performance:** Real-time monitoring

Your Go4It Sports Platform is ready for production deployment! 🚀
`;

  await fs.writeFile('REPLIT_DEPLOYMENT.md', deploymentDocs);
  console.log('📄 Created deployment documentation');
}

// Run deployment preparation
if (require.main === module) {
  prepareReplotDeployment().catch(console.error);
}

module.exports = { prepareReplotDeployment };