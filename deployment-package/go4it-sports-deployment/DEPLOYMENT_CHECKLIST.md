# Go4it Sports Deployment Checklist

## Pre-Deployment
- [ ] Repository is up to date
- [ ] All code is tested and working
- [ ] Environment variables are configured
- [ ] Build process completed (if applicable)

## Server Setup
- [ ] Server is accessible
- [ ] Web server is installed (Apache/Nginx)
- [ ] PHP is installed (if needed)
- [ ] SSL certificate is ready

## File Upload
- [ ] All files uploaded to correct directory
- [ ] File permissions set correctly
- [ ] .htaccess file is in place
- [ ] No sensitive files (like .env) are exposed

## Domain Configuration
- [ ] DNS A record points to 5.188.99.81
- [ ] WWW subdomain configured
- [ ] DNS propagation completed (24-48 hours)

## SSL & Security
- [ ] SSL certificate installed
- [ ] HTTP to HTTPS redirect working
- [ ] Security headers configured
- [ ] Sensitive files protected

## Testing
- [ ] Site loads at go4itsports.org
- [ ] HTTPS works properly
- [ ] All pages accessible
- [ ] Mobile version works
- [ ] Contact forms work (if any)
- [ ] No broken links or images

## Post-Deployment
- [ ] Monitor server logs
- [ ] Set up monitoring/analytics
- [ ] Create backup schedule
- [ ] Document any custom configurations
