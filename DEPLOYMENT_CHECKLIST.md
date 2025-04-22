# Go4It Sports Platform Deployment Checklist

## Pre-Deployment Tasks

### 1. Database Preparation
- [ ] Take a backup of development database 
- [ ] Prepare PostgreSQL on production server
- [ ] Create database user with proper permissions
- [ ] Test database connection from application

### 2. API Keys and Secrets
- [ ] OpenAI API key (currently configured)
- [ ] Anthropic API key (currently configured)
- [ ] Twilio credentials (optional - for SMS notifications)
- [ ] Social media API credentials (optional - for trend analysis)
- [ ] Create `.env` file with all necessary environment variables

### 3. Server Setup
- [ ] Ensure Node.js 18+ is installed
- [ ] Configure firewall to allow port 81
- [ ] Set up SSL certificate if using HTTPS (recommended)
- [ ] Create directory structure for application
- [ ] Set proper file permissions

### 4. Application Transfer
- [ ] Download complete codebase as ZIP
- [ ] Upload to production server at 5.161.99.81
- [ ] Extract files to /var/www/go4it (or preferred location)
- [ ] Run `npm ci` to install dependencies

### 5. First-Time Configuration
- [ ] Create admin user account
- [ ] Set up initial content blocks
- [ ] Configure site settings
- [ ] Test file upload functionality
- [ ] Verify email sending works

### 6. Production Launch
- [ ] Run deployment script: `./deploy-production.sh`
- [ ] Verify application is running correctly
- [ ] Test key features in production environment
- [ ] Set up monitoring and alerts
- [ ] Implement regular backup schedule

## Post-Deployment Tasks

### 1. Performance Monitoring
- [ ] Set up server monitoring (CPU, memory, disk)
- [ ] Configure application performance monitoring
- [ ] Set up database query monitoring
- [ ] Establish baseline performance metrics

### 2. Security
- [ ] Perform security audit of production deployment
- [ ] Set up regular security scanning
- [ ] Implement regular update process for dependencies
- [ ] Create incident response plan

### 3. Backup Strategy
- [ ] Configure daily database backups
- [ ] Set up file system backups for uploads
- [ ] Test restoration process
- [ ] Store backups securely off-server

## Critical Features to Test After Deployment

1. **User Authentication**
   - User registration
   - Login
   - Password reset
   - Session management

2. **Core Platform Features**
   - Athlete profiles
   - XP/level system
   - Star Path progression
   - Video upload and analysis

3. **Communication Features**
   - Messaging system
   - Notifications
   - Email delivery

4. **Administrative Functions**
   - Admin dashboard
   - User management
   - Content management
   - System settings

## Rollback Plan

In case of major issues during deployment:

1. Stop the application service
2. Restore database from backup
3. Revert to previous application version
4. Restart services
5. Notify users of maintenance

## Deployment Contacts

- Technical Support: [Your contact info]
- Database Administrator: [Your contact info]
- Server Administrator: [Your contact info]

## Additional Notes

- Production database should have regular maintenance scheduled
- Consider setting up a staging environment for future updates
- Document all configuration changes made during deployment