# 📋 Replit Production Deployment Checklist

Use this checklist to ensure a smooth deployment to Replit production environment.

---

## ☑️ Pre-Deployment (Do These First)

### Account Setup
- [ ] Replit account created/upgraded for production use
- [ ] Domain purchased and verified
- [ ] DNS configured to point to Replit
- [ ] SSL certificate ready (auto via Replit or custom)

### External Services
- [ ] **PostgreSQL Database**
  - [ ] Database created (Replit DB or external like Neon, Supabase)
  - [ ] Connection string obtained
  - [ ] Database accessible from Replit

- [ ] **Clerk Authentication**
  - [ ] Production application created
  - [ ] Production keys copied
  - [ ] Allowed domains configured
  - [ ] Webhook endpoints configured

- [ ] **Stripe Payments**
  - [ ] Business verified and activated
  - [ ] Production API keys obtained
  - [ ] Products created:
    - [ ] Transcript Audit ($199)
    - [ ] StarPath Monthly (pricing TBD)
    - [ ] Supplemental Courses (pricing TBD)
  - [ ] Webhook endpoint configured
  - [ ] Test payments successful

- [ ] **Cloudflare R2**
  - [ ] Account created
  - [ ] Bucket created (`go4it-production-drills`)
  - [ ] API keys generated
  - [ ] CORS configured
  - [ ] CDN URL configured (optional)

- [ ] **Email Service**
  - [ ] SMTP credentials obtained (Gmail, SendGrid, etc.)
  - [ ] Sending domain verified
  - [ ] SPF/DKIM records configured
  - [ ] Test email sent successfully

### Repository Preparation
- [ ] Latest code committed to main branch
- [ ] All secrets removed from code
- [ ] `.env.example` file updated
- [ ] Dependencies up to date (`npm outdated`)
- [ ] No console.errors in production code
- [ ] TypeScript errors resolved (`npm run type-check`)
- [ ] Lint warnings addressed (`npm run lint`)

---

## ⚙️ Replit Configuration

### 1. Environment Variables (Replit Secrets)

Copy and paste this template into Replit Secrets (one per line):

```bash
# Core
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://go4itsports.org
NEXT_PUBLIC_SITE_URL=https://go4itsports.org

# Database
DATABASE_URL=postgresql://user:pass@host:5432/go4it_production

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_XXXXXX
CLERK_SECRET_KEY=sk_live_XXXXXX
CLERK_WEBHOOK_SECRET=whsec_XXXXXX

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXX
STRIPE_SECRET_KEY=sk_live_XXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXX
STRIPE_TRANSCRIPT_AUDIT_PRICE_ID=price_XXXXXX

# Storage (Cloudflare R2)
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=go4it-production-drills
CLOUDFLARE_CDN_URL=https://cdn.go4itsports.com

# AI Services
OLLAMA_BASE_URL=http://localhost:11434
WHISPER_SERVICE_URL=http://localhost:8000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@go4itsports.org
SMTP_PASS=your_app_password
SMTP_FROM=Go4it Sports Academy <noreply@go4itsports.org>
```

**Verification:**
- [ ] All 20+ environment variables added to Replit Secrets
- [ ] No test/development keys in production
- [ ] All values are correct (no typos)
- [ ] Sensitive data not exposed in code

### 2. Replit Files

- [ ] `.replit` file exists with production config
- [ ] `replit.nix` file has all dependencies
- [ ] `.replit` run command: `npm run start:production`

### 3. Scripts Permissions

Run in Replit shell:
```bash
chmod +x scripts/*.sh
```

- [ ] All scripts are executable
- [ ] Verified with `ls -la scripts/`

---

## 🚀 Deployment Steps

### Phase 1: Pre-Flight

```bash
./scripts/pre-flight.sh
```

**Expected Output:**
- [ ] ✓ Node version >= 20.0.0
- [ ] ✓ npm version shown
- [ ] ✓ All required environment variables set
- [ ] ✓ No TypeScript errors
- [ ] ✓ No critical lint errors
- [ ] ✓ Database connection successful
- [ ] ✓ Sufficient disk space
- [ ] ✓ Sufficient memory

**If Any Checks Fail:** Fix the issue before continuing!

### Phase 2: Build

```bash
./scripts/build-production.sh
```

**Expected Output:**
- [ ] ✓ Previous build cleaned
- [ ] ✓ Dependencies installed
- [ ] ✓ Database client generated
- [ ] ✓ Next.js build completed
- [ ] ✓ Build size reported
- [ ] ✓ .next directory created

**Build Time:** 2-5 minutes (normal)

### Phase 3: Services

```bash
./scripts/start-services.sh
```

**Expected Output:**
- [ ] ✓ Docker available
- [ ] ✓ Ollama container started
- [ ] ✓ Whisper container started
- [ ] ✓ Ollama responding
- [ ] ✓ Whisper responding
- [ ] ✓ Models downloaded:
  - [ ] claude-educational-primary:7b
  - [ ] nomic-embed-text

**Model Download Time:** 5-10 minutes (first time only)

### Phase 4: Database

```bash
./scripts/migrate-and-seed.sh
```

**Expected Output:**
- [ ] ✓ Backup created
- [ ] ✓ Migrations completed
- [ ] ✓ Seeding completed
- [ ] ✓ Colleges populated (1,200+ records)
- [ ] ✓ Database statistics shown

**Migration Time:** 1-3 minutes

### Phase 5: Application

```bash
./scripts/start-app.sh
```

**Expected Output:**
- [ ] ✓ Application started (PID shown)
- [ ] ✓ Application responding within 30 seconds
- [ ] ✓ Health check passed
- [ ] ✓ All services healthy in health response

**Startup Time:** 10-30 seconds

### Phase 6: Verification

```bash
./scripts/verify-deployment.sh
```

**Expected Checks:**
- [ ] ✓ Application health: healthy
- [ ] ✓ Database connection: connected
- [ ] ✓ College database: 1000+ records
- [ ] ✓ Ollama service: running
- [ ] ✓ Whisper service: running
- [ ] ✓ Home page: 200
- [ ] ✓ StarPath page: 200
- [ ] ✓ Academy page: 200
- [ ] ✓ Drills page: 200
- [ ] ✓ Recruiting page: 200
- [ ] ✓ Health API: 200
- [ ] ✓ Response time < 2 seconds
- [ ] ✓ Memory usage reasonable
- [ ] ✓ Disk space < 80%

**Or Run Master Script (All Phases):**
```bash
./scripts/deploy-production.sh
```

---

## ✅ Post-Deployment Verification

### 1. Manual Testing

Test critical user flows:

**Public Pages:**
- [ ] Visit https://go4itsports.org
- [ ] Home page loads correctly
- [ ] Navigation works
- [ ] Images load from CDN
- [ ] Forms are functional

**Authentication:**
- [ ] Sign up with test account
- [ ] Verify email works
- [ ] Sign in successful
- [ ] Sign out works
- [ ] Password reset works

**StarPath:**
- [ ] Access StarPath dashboard
- [ ] View ARI/GAR scores
- [ ] See recommendations
- [ ] Check improvement plans

**Transcript Audit:**
- [ ] Start audit flow
- [ ] Payment page loads
- [ ] Stripe checkout works
- [ ] Test payment successful (use Stripe test card: 4242 4242 4242 4242)
- [ ] Confirmation email received
- [ ] Audit results accessible

**Drill Library:**
- [ ] Browse drills
- [ ] Search works
- [ ] Video playback works
- [ ] Drill assignment works

**Admin Functions:**
- [ ] Admin dashboard accessible
- [ ] College database visible
- [ ] User management works
- [ ] Reports generate

### 2. Integration Testing

**Stripe Webhooks:**
- [ ] Test webhook endpoint
- [ ] Payment success webhook received
- [ ] Subscription webhook received
- [ ] Log in Stripe dashboard shows success

**Clerk Webhooks:**
- [ ] User creation webhook received
- [ ] User update webhook received
- [ ] Log in Clerk dashboard shows success

**Email Delivery:**
- [ ] Welcome email received
- [ ] Password reset email received
- [ ] Transaction receipt received
- [ ] Parent Night confirmation received

**SMS (Email-to-SMS):**
- [ ] SMS reminder sent
- [ ] Test received on phone

### 3. Performance Testing

**Load Testing:**
- [ ] Run: `ab -n 100 -c 10 https://go4itsports.org/`
- [ ] All requests successful
- [ ] Average response time < 500ms
- [ ] No 500 errors

**Database Performance:**
- [ ] Query response times reasonable
- [ ] Connection pool not exhausted
- [ ] No slow query warnings

**AI Services:**
- [ ] Ollama response time < 5s
- [ ] Whisper transcription works
- [ ] Embeddings generation works

### 4. Monitoring Setup

**Health Monitoring:**
- [ ] Set up UptimeRobot or similar
- [ ] Monitor https://go4itsports.org/api/health
- [ ] Alert email configured
- [ ] Alert SMS configured (optional)

**Error Tracking:**
- [ ] Sentry configured (if using)
- [ ] Test error captured
- [ ] Alert notifications working

**Analytics:**
- [ ] PostHog configured (if using)
- [ ] Events tracking
- [ ] User sessions visible

**Log Monitoring:**
- [ ] Application logs accessible
- [ ] Error logs monitored
- [ ] Docker logs accessible

---

## 📊 Success Criteria

Deployment is successful when:

- [ ] ✅ Health endpoint returns "healthy"
- [ ] ✅ All critical pages load (200 status)
- [ ] ✅ Database queries work
- [ ] ✅ Ollama and Whisper respond
- [ ] ✅ Authentication works end-to-end
- [ ] ✅ Payments process successfully
- [ ] ✅ Emails deliver
- [ ] ✅ No console errors
- [ ] ✅ Response times acceptable
- [ ] ✅ Memory usage stable
- [ ] ✅ No crashes for 1 hour

---

## 🐛 If Something Goes Wrong

### Quick Diagnostics

```bash
# Check if app is running
curl http://localhost:3000/api/health

# Check application logs
tail -50 logs/app.log
tail -50 logs/error.log

# Check Docker services
docker ps
docker logs ollama --tail 50
docker logs whisper --tail 50

# Check process
ps aux | grep node

# Check ports
lsof -i :3000
lsof -i :11434
lsof -i :8000

# Check memory
free -h

# Check disk
df -h
```

### Common Fixes

**App won't start:**
```bash
rm -rf .next node_modules/.cache
npm ci
npm run build
npm run start:production
```

**Database errors:**
```bash
# Verify connection
psql $DATABASE_URL -c "SELECT version();"

# Re-run migrations
npm run db:migrate
```

**Ollama not responding:**
```bash
docker restart ollama
docker exec ollama ollama list
```

**Out of memory:**
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run start:production
```

### Rollback Procedure

If deployment fails completely:

```bash
# 1. Stop application
kill $(cat app.pid)

# 2. Restore database
gunzip backups/backup_TIMESTAMP.sql.gz
psql $DATABASE_URL < backups/backup_TIMESTAMP.sql

# 3. Revert code
git checkout <previous-working-commit>

# 4. Rebuild
npm run build

# 5. Restart
npm run start:production
```

---

## 📞 Support Contacts

**During Deployment:**
- Technical Lead: devops@go4itsports.org
- Emergency: +1-205-434-8405

**Service Providers:**
- Replit: support@replit.com
- Clerk: support@clerk.dev
- Stripe: support@stripe.com
- Cloudflare: support.cloudflare.com

---

## 📚 Documentation Reference

- **Complete Guide**: `REPLIT_PRODUCTION_DEPLOYMENT.md`
- **Quick Start**: `QUICKSTART_REPLIT.md`
- **Platform Docs**: `GO4IT_COMPLETE_PLATFORM_DOCUMENTATION.md`
- **Summary**: `DEPLOYMENT_OPTIMIZATION_SUMMARY.md`

---

## ✅ Final Sign-Off

Deployment completed by: _________________

Date: _________________

Time: _________________

All checks passed: ☐ Yes  ☐ No (see notes)

Notes:
_______________________________________________________
_______________________________________________________
_______________________________________________________

Verified by: _________________

---

**Version**: 2.1  
**Platform**: Go4it Sports Academy - NCAA Readiness School  
**Environment**: Replit Production  
**Last Updated**: November 5, 2025
