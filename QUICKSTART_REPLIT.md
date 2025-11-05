# 🚀 Quick Start - Replit Production Deployment

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] Replit account with sufficient resources
- [ ] PostgreSQL database (Replit DB or external)
- [ ] Clerk account (production keys)
- [ ] Stripe account (production keys)
- [ ] Cloudflare R2 bucket created
- [ ] Domain configured and pointing to Replit

## 5-Minute Setup

### 1. Set Environment Variables in Replit

Click "Secrets" (🔒) in Replit sidebar and add:

```bash
# Required
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
CLOUDFLARE_R2_BUCKET_NAME=go4it-production
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
OLLAMA_BASE_URL=http://localhost:11434
WHISPER_SERVICE_URL=http://localhost:8000
```

### 2. Make Scripts Executable

```bash
chmod +x scripts/*.sh
```

### 3. Deploy

```bash
./scripts/deploy-production.sh
```

That's it! The script will:
- ✅ Run pre-flight checks
- ✅ Build the application
- ✅ Start Docker services (Ollama, Whisper)
- ✅ Run database migrations
- ✅ Start the application
- ✅ Verify deployment

## Manual Step-by-Step (If Needed)

### Step 1: Install Dependencies

```bash
npm ci --production=false
```

### Step 2: Build Application

```bash
npm run build
```

### Step 3: Start Services

```bash
# Start Ollama
docker run -d -p 11434:11434 --name ollama ollama/ollama:latest

# Start Whisper
docker run -d -p 8000:8000 --name whisper ghcr.io/openai/whisper:latest

# Download models
docker exec ollama ollama pull claude-educational-primary:7b
docker exec ollama ollama pull nomic-embed-text
```

### Step 4: Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed data
npm run seed:production

# Populate colleges
curl -X POST http://localhost:3000/api/colleges/populate
```

### Step 5: Start Application

```bash
npm run start:production
```

### Step 6: Verify

```bash
curl http://localhost:3000/api/health
```

## Common Issues & Fixes

### Issue: "Module not found"

```bash
rm -rf node_modules .next
npm ci
npm run build
```

### Issue: "Database connection failed"

Check your `DATABASE_URL` in Secrets and verify:
```bash
psql $DATABASE_URL -c "SELECT version();"
```

### Issue: "Ollama not responding"

```bash
docker restart ollama
docker logs ollama --tail 50
```

### Issue: "Port already in use"

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Issue: "Out of memory"

Increase Node memory:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run start:production
```

## Monitoring

### View Logs

```bash
# Application logs
tail -f logs/app.log
tail -f logs/combined.log
tail -f logs/error.log

# Docker logs
docker logs ollama -f
docker logs whisper -f
```

### Check Health

```bash
curl http://localhost:3000/api/health | jq '.'
```

### Monitor Resources

```bash
# Memory
free -h

# Disk
df -h

# Docker stats
docker stats
```

## Updating Code

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies (if package.json changed)
npm ci

# Rebuild
npm run build

# Restart app
kill $(cat app.pid)
npm run start:production &
echo $! > app.pid
```

## Rollback

If something goes wrong:

```bash
# Stop application
kill $(cat app.pid)

# Restore database from backup
gunzip backups/backup_TIMESTAMP.sql.gz
psql $DATABASE_URL < backups/backup_TIMESTAMP.sql

# Checkout previous version
git checkout <previous-commit>

# Rebuild and restart
npm run build
npm run start:production &
```

## Performance Tips

1. **Enable Redis Caching**
   - Add Redis to docker-compose
   - Set `REDIS_URL` in Secrets

2. **Use CDN for Static Assets**
   - Configure Cloudflare CDN
   - Set `CLOUDFLARE_CDN_URL`

3. **Optimize Database**
   - Add indexes on frequently queried columns
   - Use connection pooling

4. **Monitor Response Times**
   - Use the health endpoint
   - Set up external monitoring (UptimeRobot, etc.)

## Security Checklist

- [ ] All environment variables in Secrets (not .env files)
- [ ] Production Clerk keys (not test keys)
- [ ] Production Stripe keys (not test keys)
- [ ] HTTPS enabled
- [ ] CORS origins restricted
- [ ] Rate limiting enabled
- [ ] Database backups automated
- [ ] Error logging configured

## Support

- **Documentation**: `/REPLIT_PRODUCTION_DEPLOYMENT.md`
- **Platform Docs**: `/GO4IT_COMPLETE_PLATFORM_DOCUMENTATION.md`
- **Email**: devops@go4itsports.org
- **Emergency**: +1-205-434-8405

## Next Steps After Deployment

1. ✅ Test all critical user flows
2. ✅ Verify Parent Night signup
3. ✅ Test Transcript Audit purchase
4. ✅ Check email notifications
5. ✅ Test Stripe webhooks
6. ✅ Verify drill uploads
7. ✅ Test GAR verification
8. ✅ Check college database
9. ✅ Monitor logs for errors
10. ✅ Set up external monitoring

---

**Version**: 2.1  
**Last Updated**: November 5, 2025  
**Deployment Target**: Replit Production
