# Go4It Sports: Final Deployment Checklist

This checklist ensures your Go4It Sports platform is properly deployed to production at https://go4itsports.org.

## Pre-Deployment

- [ ] Database backup (if updating an existing installation)
- [ ] Environment variables prepared
- [ ] SSL certificates ready (Let's Encrypt or other provider)
- [ ] Domain DNS configured to point to your server
- [ ] Server firewall configured to allow ports 80, 443, and your API port (default: 5000)
- [ ] Nginx installed and running
- [ ] Node.js v20+ installed
- [ ] PM2 or similar process manager installed

## Build Process

- [ ] Run `./deploy-production.sh` to create the production package
- [ ] Verify successful build completion
- [ ] Check the size of the generated zip file (should be approximately 15-20MB)

## Server Setup

- [ ] Transfer the deployment zip to your production server
- [ ] Create directory: `/var/www/go4itsports.org/`
- [ ] Unzip the package into the directory
- [ ] Set proper permissions:
  ```
  sudo chown -R www-data:www-data /var/www/go4itsports.org/
  sudo chmod -R 755 /var/www/go4itsports.org/
  ```
- [ ] Copy .env.example to .env and configure with production values
- [ ] Configure Nginx using the provided nginx.conf template
- [ ] Create symbolic link in sites-enabled
  ```
  sudo ln -s /etc/nginx/sites-available/go4itsports.conf /etc/nginx/sites-enabled/
  ```
- [ ] Test Nginx configuration
  ```
  sudo nginx -t
  ```
- [ ] Reload Nginx
  ```
  sudo systemctl reload nginx
  ```

## API Server Setup

- [ ] Install PM2 if not already installed
  ```
  npm install -g pm2
  ```
- [ ] Start the API server with PM2
  ```
  cd /var/www/go4itsports.org/
  pm2 start api/server.js --name go4it-api
  ```
- [ ] Configure PM2 startup
  ```
  pm2 save
  pm2 startup
  ```
- [ ] Verify API server is running
  ```
  pm2 status
  ```

## SSL Setup

- [ ] Install Let's Encrypt client (Certbot)
  ```
  sudo apt-get install certbot python3-certbot-nginx
  ```
- [ ] Obtain and configure SSL certificates
  ```
  sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org
  ```

## Post-Deployment Verification

- [ ] Check https://go4itsports.org loads without errors
- [ ] Verify API endpoint https://go4itsports.org/api/health returns status 200
- [ ] Test user authentication (login/register)
- [ ] Test video upload functionality
- [ ] Test athlete profile creation
- [ ] Test GAR scoring system
- [ ] Test mobile responsiveness

## Performance Optimization

- [ ] Enable browser caching for static assets
- [ ] Configure Nginx caching for API responses
- [ ] Set up database connection pooling
- [ ] Optimize PostgreSQL configuration for production load

## Monitoring and Maintenance

- [ ] Set up regular database backups
  ```
  # Create backup script
  sudo nano /etc/cron.daily/go4it-backup.sh
  
  # Add this content:
  #!/bin/bash
  TIMESTAMP=$(date +%Y%m%d)
  sudo -u postgres pg_dump go4it_sports > /backups/go4it_sports_$TIMESTAMP.sql
  ```
- [ ] Configure log rotation
  ```
  sudo nano /etc/logrotate.d/go4itsports
  
  # Add this content:
  /var/www/go4itsports.org/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
  }
  ```
- [ ] Set up uptime monitoring service
- [ ] Configure server resource monitoring

## Security

- [ ] Enable firewall
  ```
  sudo ufw allow 22
  sudo ufw allow 80
  sudo ufw allow 443
  sudo ufw enable
  ```
- [ ] Install security updates
  ```
  sudo apt-get update
  sudo apt-get upgrade
  ```
- [ ] Configure fail2ban for SSH protection
- [ ] Ensure database is not publicly accessible
- [ ] Set secure file permissions
- [ ] Implement rate limiting in Nginx for API endpoints

## Final Steps

- [ ] Document deployment with date and version information
- [ ] Notify team of successful deployment
- [ ] Monitor application logs for any issues

For support, contact: support@go4itsports.org