# Go4It Sports Platform - Production Deployment Guide
## Domain: go4itsports.org | Server: 167.235.128.41

### Quick Deployment Commands

```bash
# 1. Clone and setup
git clone <repository-url> /var/www/go4itsports
cd /var/www/go4itsports

# 2. Install dependencies and build
npm ci
npm run build

# 3. Configure environment
cp production.env .env
# Edit .env with your actual values

# 4. Setup database
npm run db:push

# 5. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 6. Configure Nginx (see nginx config below)
```

### Server Requirements

- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Node.js**: Version 20.x
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 20GB SSD
- **PostgreSQL**: Version 13+
- **Nginx**: Version 1.18+

### Environment Variables (.env)

```bash
# Core Configuration
NODE_ENV=production
PORT=5000
DOMAIN=go4itsports.org
SERVER_IP=167.235.128.41

# Database
DATABASE_URL=postgresql://go4itsports:PASSWORD@localhost:5432/go4itsports_prod

# Security
SESSION_SECRET=your-256-bit-secret-key-here
FORCE_HTTPS=true
SSL_ENABLED=true

# CORS
ALLOWED_ORIGINS=https://go4itsports.org,https://www.go4itsports.org

# File Uploads
UPLOAD_MAX_SIZE=50mb
UPLOAD_PATH=/var/www/go4itsports/uploads

# Optional API Keys
ANTHROPIC_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here
NOTION_INTEGRATION_SECRET=your-key-here
```

### Nginx Configuration (/etc/nginx/sites-available/go4itsports)

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name go4itsports.org www.go4itsports.org 167.235.128.41;
    return 301 https://go4itsports.org$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name go4itsports.org www.go4itsports.org;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/go4itsports.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/go4itsports.org/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/go4itsports.org/chain.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Performance
    client_max_body_size 50M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;
    
    # Root directory
    root /var/www/go4itsports/dist;
    index index.html;
    
    # Static assets with long cache
    location /assets/ {
        alias /var/www/go4itsports/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Upload files
    location /uploads/ {
        alias /var/www/go4itsports/uploads/;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering off;
    }
    
    # React app fallback
    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }
    
    # Security: Block sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ /\.(env|log|conf)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### PostgreSQL Setup

```sql
-- Create database and user
CREATE DATABASE go4itsports_prod;
CREATE USER go4itsports WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE go4itsports_prod TO go4itsports;

-- Connect to the database
\c go4itsports_prod;
GRANT ALL ON SCHEMA public TO go4itsports;
```

### SSL Certificate Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### PM2 Process Management

```bash
# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 status
pm2 logs go4itsports
pm2 monit

# Management
pm2 restart go4itsports
pm2 reload go4itsports
pm2 stop go4itsports

# Auto-startup
pm2 save
pm2 startup
```

### Firewall Configuration

```bash
# UFW setup
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Check status
sudo ufw status
```

### Monitoring and Logs

```bash
# Application logs
pm2 logs go4itsports

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System monitoring
htop
df -h
free -m
```

### Backup Strategy

```bash
# Database backup
pg_dump -U go4itsports -h localhost go4itsports_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Application backup
tar -czf go4itsports_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/go4itsports

# Automated backups (crontab)
# 0 2 * * * /home/user/backup_script.sh
```

### Performance Optimization

1. **Database Optimization**
   - Regular VACUUM and ANALYZE
   - Proper indexing on frequently queried columns
   - Connection pooling

2. **Static Asset Optimization**
   - Gzip compression enabled
   - Long cache headers for static files
   - CDN for global distribution (optional)

3. **Application Optimization**
   - PM2 cluster mode for load balancing
   - Memory limit monitoring
   - Keep-alive connections

### Troubleshooting

**Common Issues:**

1. **502 Bad Gateway**
   - Check if Node.js app is running: `pm2 status`
   - Check port 5000: `netstat -tlnp | grep 5000`

2. **SSL Certificate Issues**
   - Verify certificate: `sudo certbot certificates`
   - Test SSL: `openssl s_client -connect go4itsports.org:443`

3. **Database Connection Issues**
   - Check PostgreSQL status: `sudo systemctl status postgresql`
   - Test connection: `psql -U go4itsports -d go4itsports_prod -h localhost`

4. **Permission Issues**
   - Check file ownership: `ls -la /var/www/go4itsports`
   - Fix permissions: `sudo chown -R www-data:www-data /var/www/go4itsports`

### Security Checklist

- [ ] Firewall configured (UFW/iptables)
- [ ] SSH key authentication enabled
- [ ] SSL certificate installed and valid
- [ ] Security headers configured in Nginx
- [ ] Database user has minimal privileges
- [ ] Regular security updates scheduled
- [ ] Backup strategy implemented
- [ ] Log monitoring configured

### Post-Deployment

1. **DNS Configuration**
   - Point go4itsports.org A record to 167.235.128.41
   - Point www.go4itsports.org CNAME to go4itsports.org

2. **Testing**
   - Load test with realistic traffic
   - Test all major features
   - Verify analytics and monitoring

3. **Documentation**
   - Update admin credentials
   - Document any custom configurations
   - Create runbook for common operations

### Support and Maintenance

- **Log Rotation**: Configured via logrotate
- **Updates**: Monthly security updates recommended
- **Monitoring**: Consider Prometheus + Grafana for advanced monitoring
- **Backups**: Daily automated backups to external storage

---

**Deployment Status**: Ready for production on go4itsports.org (167.235.128.41)
**Last Updated**: Production deployment configuration
**Contact**: admin@go4itsports.org