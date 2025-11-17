# Replit Production Deployment Guide

## ✅ Pre-Deployment Checklist

### Environment Variables Required
Make sure these are set in Replit Secrets:

#### **Database**
- `DATABASE_URL` - PostgreSQL connection string
- `POSTGRES_URL` - Backup database URL (optional)

#### **Authentication**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`

#### **Payment Processing**
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

#### **AI Services**
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

#### **Communication**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

#### **Monitoring (Optional)**
- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`

#### **Application**
- `NEXT_PUBLIC_APP_URL` - Your Replit app URL (e.g., `https://your-app.replit.app`)
- `NODE_ENV=production`

---

## 🚀 Deployment Optimizations Applied

### **1. .replit Configuration** ✅
- **Autoscale deployment** for automatic scaling
- **Production build optimization** with `npm ci`
- **Memory optimization** with 4GB limit
- **Clean cache** directories excluded

### **2. replit.nix Dependencies** ✅
- PostgreSQL 16 for database
- Redis for caching
- FFmpeg for video processing
- AI/ML tools (Ollama)
- Development utilities (organized)

### **3. Next.js Configuration** ✅
- **Standalone output** for optimized deployment
- **Server-side package externalization** for AI/ML packages
- **Memory optimizations** enabled
- **Security headers** configured
- **Cache optimization** for static assets
- **Bundle splitting** optimized

### **4. Package.json Scripts** ✅
- Production build scripts added
- Deployment check script
- Post-install hooks

---

## 📋 Deployment Steps

### **Step 1: Set Environment Variables**
1. Go to Replit Secrets tab
2. Add all required environment variables listed above
3. Verify `NODE_ENV=production` is set

### **Step 2: Connect to GitHub**
1. Repository is already public: `Shatzii/Go4it-V2`
2. Ensure Replit is connected to the repo
3. Set branch to `main`

### **Step 3: Deploy**
1. Click the **Deploy** button in Replit
2. Select **Autoscale** deployment
3. Monitor build logs for any errors
4. Wait for deployment to complete

### **Step 4: Post-Deployment Verification**
```bash
# Check if site is accessible
curl https://your-app.replit.app

# Verify health endpoint (if you have one)
curl https://your-app.replit.app/api/health

# Test key pages
- Landing page: /
- Dashboard: /dashboard
- Recruiting Hub: /recruiting-hub
- Academy: /academy
```

---

## 🔧 Performance Optimizations

### **Memory Management**
- Node.js max memory: 4GB
- Parallel builds: Limited to 1
- Bundle analysis available: `ANALYZE=true npm run build`

### **Caching Strategy**
- Static assets: 1 year cache
- API routes: No cache
- Next.js build files: Immutable cache

### **Code Splitting**
- Vendor bundles separated
- Radix UI components bundled separately
- Route-based lazy loading

---

## 🐛 Troubleshooting

### **Build Failures**
```bash
# Clear cache and rebuild
npm run clean
npm ci
npm run build
```

### **Memory Issues**
- Build process limited to 4GB
- If OOM errors occur, increase `max-old-space-size`
- Consider disabling source maps: `productionBrowserSourceMaps: false`

### **Database Connection**
```bash
# Test database connection
npm run db:push

# Open database studio
npm run db:studio
```

### **Port Already in Use**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

---

## 📊 Monitoring

### **Application Health**
- Monitor build logs in Replit dashboard
- Check application logs for errors
- Use Sentry for error tracking (if configured)

### **Performance Metrics**
- Monitor response times
- Check memory usage
- Watch database connection pool

---

## 🔐 Security Notes

### **Headers Configured**
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### **CORS Settings**
- Production: Restricted to allowed origins
- Development: Wildcard allowed

---

## 📝 Build Information

- **Node Version:** >= 20.0.0
- **NPM Version:** >= 10.0.0
- **Next.js Version:** 15.5.6
- **Build Output:** Standalone
- **Deployment:** Autoscale

---

## 🎯 Success Criteria

✅ Build completes without errors  
✅ All pages load correctly  
✅ Database connections work  
✅ API endpoints respond  
✅ Authentication flows work  
✅ Payment processing functional  
✅ Video upload and analysis operational  
✅ AI features accessible  

---

## 📞 Support

If you encounter issues:
1. Check build logs in Replit
2. Verify all environment variables
3. Test database connectivity
4. Review error logs in application
5. Check GitHub Actions for CI/CD status

---

**Last Updated:** October 30, 2025  
**Platform Version:** 2.1.0  
**Deployment Target:** Replit Autoscale
