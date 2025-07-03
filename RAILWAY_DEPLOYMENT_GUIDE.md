# Universal One School - Railway Deployment Guide

## 🚀 Complete Railway Deployment Setup

**Recommended Platform:** Railway  
**Domain:** school.shatzii.com  
**Cost:** $10-25/month total

## Step 1: Railway Account Setup

### Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account
3. Verify email address
4. Connect payment method (required for custom domains)

### Install Railway CLI
```bash
# Install globally
npm install -g @railway/cli

# Login to Railway
railway login

# Verify installation
railway --version
```

## Step 2: Project Preparation

### 1. Update package.json Scripts
```json
{
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "next build && tsc server/index.ts --outDir dist --target ES2022 --module commonjs",
    "start": "node dist/index.js",
    "railway": "npm run build && railway up"
  }
}
```

### 2. Create Production Server File
```bash
# Create production server
cat > server/index.js << 'EOF'
const { createServer } = require('http')
const next = require('next')

const dev = false
const hostname = process.env.HOST || '0.0.0.0'
const port = parseInt(process.env.PORT || '3000')

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log('Starting Universal One School platform...')

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      await handle(req, res)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })

  server.listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Universal One School ready on http://${hostname}:${port}`)
    console.log('Platform features:')
    console.log('- VR Educational Gaming System')
    console.log('- Self-Hosted AI Engine')
    console.log('- 5 Specialized Schools')
    console.log('- Manufacturing Administration')
    console.log('Domain: https://school.shatzii.com')
  })
})
.catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
EOF
```

### 3. Update Next.js Configuration
```bash
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential for Railway deployment
  output: 'standalone',
  
  // Optimize for production
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Environment variables
  env: {
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
    USE_LOCAL_AI_ENGINE: process.env.USE_LOCAL_AI_ENGINE,
  },
  
  // Image optimization
  images: {
    domains: ['school.shatzii.com', 'railway.app'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ]
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  },
  
  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  
  // External packages for server components
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk', '@neondatabase/serverless']
  }
}

module.exports = nextConfig
EOF
```

## Step 3: Railway Deployment

### Initialize Railway Project
```bash
# In your project directory
railway init

# Select "Empty Project"
# Give it a name: "universal-one-school"
```

### Deploy to Railway
```bash
# Deploy the application
railway up

# This will:
# 1. Upload your code
# 2. Install dependencies
# 3. Build the application
# 4. Start the server
```

### Monitor Deployment
```bash
# View deployment logs
railway logs

# Check deployment status
railway status

# Get deployment URL
railway domain
```

## Step 4: Environment Variables Setup

### Set Required Variables
```bash
# Production settings
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set HOST=0.0.0.0

# AI Configuration
railway variables set USE_LOCAL_AI_ENGINE=true
railway variables set AI_ENGINE_URL=http://localhost:8000

# Security (generate secure random strings)
railway variables set SESSION_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)

# School configuration
railway variables set SCHOOL_NAME="Universal One School"
railway variables set ADMIN_EMAIL="admin@school.shatzii.com"
```

### Add API Keys (Required)
```bash
# Add your actual API keys
railway variables set ANTHROPIC_API_KEY="your_anthropic_key_here"
railway variables set OPENAI_API_KEY="your_openai_key_here"
railway variables set PERPLEXITY_API_KEY="your_perplexity_key_here"
```

## Step 5: Database Setup (Optional)

### Add PostgreSQL Database
```bash
# Add PostgreSQL service
railway add postgresql

# Database URL will be automatically set
# Check with: railway variables
```

## Step 6: Custom Domain Configuration

### Add Custom Domain
```bash
# Add your domain
railway domain add school.shatzii.com

# Railway will provide SSL certificate automatically
```

### DNS Configuration
Configure these DNS records with your domain provider:

```
Type: CNAME
Name: school
Value: your-project-name.railway.app
TTL: 300

Type: CNAME
Name: www.school  
Value: your-project-name.railway.app
TTL: 300
```

## Step 7: Production Optimizations

### Health Check Endpoint
```bash
# Create health check API
mkdir -p pages/api
cat > pages/api/health.js << 'EOF'
export default function handler(req, res) {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platform: 'Universal One School',
    version: '6.0',
    features: {
      aiEngine: process.env.USE_LOCAL_AI_ENGINE === 'true',
      database: !!process.env.DATABASE_URL,
      vrSystem: true,
      manufacturing: true
    }
  }
  
  res.status(200).json(healthCheck)
}
EOF
```

### Environment-Specific Configuration
```bash
# Set environment-specific variables
railway variables set NEXT_PUBLIC_API_URL=https://school.shatzii.com
railway variables set RAILWAY_STATIC_URL=https://school.shatzii.com
railway variables set NEXTAUTH_URL=https://school.shatzii.com
```

## Step 8: Monitoring & Maintenance

### View Application Logs
```bash
# Real-time logs
railway logs --follow

# Recent logs
railway logs --tail 100

# Filter logs
railway logs --filter "error"
```

### Redeploy Application
```bash
# Redeploy current code
railway up

# Redeploy with specific commit
railway up --detach
```

### Scale Application
```bash
# View current resources
railway status

# Resources are auto-scaled by Railway
# Monitor usage in Railway dashboard
```

## Step 9: Deployment Verification

### Test Deployment
```bash
# Test health endpoint
curl https://school.shatzii.com/api/health

# Test main page
curl -I https://school.shatzii.com

# Test SSL certificate
openssl s_client -connect school.shatzii.com:443 -servername school.shatzii.com
```

### Verify All Features
1. **Main Landing Page**: https://school.shatzii.com
2. **SuperHero School**: https://school.shatzii.com/schools/primary-school
3. **Stage Prep School**: https://school.shatzii.com/schools/secondary-school
4. **Law School**: https://school.shatzii.com/schools/law-school
5. **Language Academy**: https://school.shatzii.com/schools/language-school
6. **Sports Academy**: https://school.shatzii.com/schools/sports-academy
7. **VR System**: https://school.shatzii.com/vr-educational-gaming
8. **AI Engine**: https://school.shatzii.com/self-hosted-ai
9. **Manufacturing**: https://school.shatzii.com/device-ecosystem

## Troubleshooting

### Common Issues and Solutions

#### Build Failures
```bash
# Check build logs
railway logs --filter "build"

# Common fixes:
railway variables set NODE_VERSION=20
railway up
```

#### Domain Issues
```bash
# Check domain status
railway domain

# Verify DNS propagation
dig school.shatzii.com
nslookup school.shatzii.com
```

#### Environment Variables
```bash
# List all variables
railway variables

# Update specific variable
railway variables set NODE_ENV=production

# Delete variable
railway variables delete VARIABLE_NAME
```

#### Memory Issues
```bash
# Monitor resource usage
railway status

# Upgrade plan if needed (in Railway dashboard)
```

## Cost Optimization

### Railway Pricing Tiers
- **Starter**: $5/month (1GB RAM, 1vCPU) - Good for testing
- **Pro**: $20/month (8GB RAM, 8vCPU) - Recommended for production
- **Database**: $5/month (PostgreSQL)

### Recommended Setup
```
Application: Pro Plan ($20/month)
Database: PostgreSQL ($5/month)
Total: $25/month
```

## Security Best Practices

### Environment Security
```bash
# Rotate secrets regularly
railway variables set SESSION_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Use strong API keys
# Enable 2FA on Railway account
# Monitor access logs
```

### Application Security
- ✅ HTTPS enabled automatically
- ✅ Security headers configured
- ✅ Environment variables encrypted
- ✅ Database connection secured
- ✅ API key protection

## Backup Strategy

### Automated Backups
Railway provides:
- ✅ Automatic daily database backups
- ✅ Point-in-time recovery
- ✅ Code versioning with GitHub integration
- ✅ Environment variable backup

### Manual Backup
```bash
# Download current deployment
railway connect

# Export database
railway run pg_dump $DATABASE_URL > backup.sql
```

## Final Checklist

- ✅ Railway account created and payment added
- ✅ Project deployed and running
- ✅ Environment variables configured
- ✅ Custom domain added (school.shatzii.com)
- ✅ DNS records configured
- ✅ SSL certificate active
- ✅ Health checks passing
- ✅ All school pages accessible
- ✅ AI engine operational
- ✅ VR system functional
- ✅ Manufacturing admin working

Your Universal One School platform will be live at **https://school.shatzii.com** with:
- Complete VR Educational Gaming System
- Self-Hosted AI Engine with 10+ models
- Asian manufacturing administration
- All 5 specialized schools
- Full Texas compliance
- FERPA/COPPA compliant data handling