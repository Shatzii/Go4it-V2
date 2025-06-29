# Go4It Sports Final Deployment Checklist

## Pre-Deployment Verification

- [ ] Run environment verification: `./pre-deployment-check.sh`
- [ ] Verify all required API keys are available
  - [ ] `OPENAI_API_KEY`
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `TWILIO_ACCOUNT_SID` (optional, for SMS notifications)
- [ ] Check for any previous installations that need to be cleaned up
- [ ] Verify domain DNS is correctly configured for `go4itsports.org`
- [ ] Confirm SSL certificate availability or ability to generate one with Let's Encrypt
- [ ] Verify database backup mechanisms are in place

## Installation

- [ ] Upload deployment package to server
- [ ] Extract to `/var/www/go4itsports.org`
- [ ] Copy `.env.example` to `.env` and set all values
- [ ] Run database migration: `node migrate-database.js`
- [ ] Configure Nginx
  - [ ] Copy `nginx.conf` to `/etc/nginx/sites-available/go4itsports.org`
  - [ ] Create symbolic link: `ln -s /etc/nginx/sites-available/go4itsports.org /etc/nginx/sites-enabled/`
  - [ ] Test Nginx configuration: `nginx -t`
  - [ ] Enable Nginx: `systemctl restart nginx`
- [ ] Set up SSL certificate with Let's Encrypt
  - [ ] Run: `certbot --nginx -d go4itsports.org -d www.go4itsports.org`
- [ ] Set up process manager
  - [ ] Install PM2: `npm install -g pm2`
  - [ ] Start application: `pm2 start server.js --name go4it-api`
  - [ ] Save process configuration: `pm2 save`
  - [ ] Enable startup service: `pm2 startup`

## Post-Deployment Tests

- [ ] Run health check: `node healthcheck.js`
- [ ] Verify website loads at `https://go4itsports.org`
- [ ] Test all core functionality
  - [ ] User authentication (login/register)
  - [ ] Profile management
  - [ ] Video uploads
  - [ ] GAR analysis
  - [ ] Athlete dashboard
  - [ ] Coach collaboration
  - [ ] AI coach features
- [ ] Check for JavaScript console errors
- [ ] Verify WebSocket connectivity
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Verify API key functionality
  - [ ] OpenAI integration
  - [ ] Anthropic Claude integration

## Performance Verification

- [ ] Run load test with concurrent users
- [ ] Check page load times (<2s target)
- [ ] Verify caching is working properly
  - [ ] API responses have proper `Cache-Control` headers
  - [ ] Static assets have long cache times
  - [ ] Check for `X-Cache-Status` header in API responses
- [ ] Check database response times (<100ms for common queries)

## Security Checks

- [ ] Verify HTTPS is enforced
- [ ] Check security headers are present
  - [ ] `X-Content-Type-Options`
  - [ ] `X-Frame-Options`
  - [ ] `Content-Security-Policy`
  - [ ] `Strict-Transport-Security`
- [ ] Verify session cookie security
  - [ ] `Secure` flag
  - [ ] `HttpOnly` flag
  - [ ] `SameSite` attribute
- [ ] Check file permissions
  - [ ] `.env` file (600)
  - [ ] SSL private keys (600)
  - [ ] Log directory (755)
  - [ ] Upload directory (755)

## Monitoring Setup

- [ ] Configure automated health checks
  - [ ] `0 * * * * cd /var/www/go4itsports.org && node healthcheck.js`
- [ ] Set up log rotation
  - [ ] `/etc/logrotate.d/go4itsports`
- [ ] Configure database backup
  - [ ] Daily database dumps
  - [ ] Weekly offsite backup
- [ ] Set up monitoring alerts
  - [ ] Server load
  - [ ] Disk space
  - [ ] Error rates
  - [ ] Response times

## Documentation

- [ ] Update all deployment documentation with actual server details
- [ ] Document backup and restore procedures
- [ ] Create emergency contact list
- [ ] Document common maintenance tasks
  - [ ] Log rotation
  - [ ] Database optimization
  - [ ] Certificate renewal

## Final Steps

- [ ] Perform a final health check
- [ ] Notify team of successful deployment
- [ ] Schedule post-deployment review

---

**Deployment Completed By:** ____________________________

**Date:** ____________________________

**Version Deployed:** ____________________________