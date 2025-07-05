# Go4It Sports Platform - Replit Deployment Guide

## 🚀 Quick Deployment

### Step 1: Prepare for Deployment
1. Run the deployment preparation script:
   ```bash
   node deploy-replit.js
   ```

2. Test the platform locally:
   ```bash
   node server.js
   ```

### Step 2: Deploy on Replit
1. Click the **"Deploy"** button in Replit
2. Choose **"Autoscale"** deployment target
3. Configure environment variables (see below)
4. Click **"Deploy"**

### Step 3: Configure Environment Variables
In Replit deployment settings, add these required variables:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `CLERK_SECRET_KEY` - Clerk secret key
- `SESSION_SECRET` - Random 32+ character string

**Optional (for full features):**
- `OPENAI_API_KEY` - AI coaching features
- `ANTHROPIC_API_KEY` - Alternative AI provider

### Step 4: Monitor Deployment
- Check deployment logs for any errors
- Visit your deployment URL
- Verify health check: `https://your-app.replit.app/api/health`

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
- Test connection with: `node deployment-health-check.js`

**Authentication:**
- Verify Clerk keys are for production environment
- Check domain configuration in Clerk dashboard

**Performance:**
- Monitor resource usage in Replit dashboard
- Check health endpoint for system status

### Debug Commands

```bash
# Check system health
node deployment-health-check.js

# Test database connection
npm run db:push

# View logs
tail -f logs/app.log

# Check environment variables
node -e "console.log(process.env.DATABASE_URL ? 'Database configured' : 'Database not configured')"
```

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

- **Health Status:** `/api/health` endpoint
- **Documentation:** Built-in help system
- **Logs:** Available in Replit dashboard
- **Performance:** Real-time monitoring

Your Go4It Sports Platform is ready for production deployment! 🚀
