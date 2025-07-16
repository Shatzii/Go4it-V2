# Go4It Sports Platform - Self-Hosting Guide

## Overview
This guide will help you deploy the Go4It Sports Platform on your own server and point your domain to it.

## Server Requirements

### Minimum Requirements
- **CPU**: 4 vCPUs (8 vCPUs recommended)
- **RAM**: 8GB (16GB recommended)
- **Storage**: 50GB SSD (100GB+ recommended)
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Network**: 100Mbps+ connection

### Recommended Server Specs
- **CPU**: 8 vCPUs
- **RAM**: 16GB
- **Storage**: 100GB SSD
- **OS**: Ubuntu 22.04 LTS

## Installation Steps

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl wget nginx postgresql postgresql-contrib

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install SSL certificates (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Database Setup
```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE go4it_sports;"
sudo -u postgres psql -c "CREATE USER go4it_user WITH ENCRYPTED PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE go4it_sports TO go4it_user;"
```

### 3. Clone and Setup Application
```bash
# Create app directory
sudo mkdir -p /var/www/go4it-sports
cd /var/www/go4it-sports

# Clone repository (replace with your repo URL)
git clone https://github.com/yourusername/go4it-sports-platform.git .

# Install dependencies
npm install

# Build application
npm run build
```

### 4. Environment Configuration
Create production environment file:
```bash
sudo nano /var/www/go4it-sports/.env.production
```

Add the following configuration:
```env
# Database Configuration
DATABASE_URL=postgresql://go4it_user:your_secure_password@localhost:5432/go4it_sports

# Application Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
PORT=3000

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
SESSION_SECRET=your-session-secret-key-here

# AI Configuration - Self-hosted models
USE_LOCAL_MODELS=true
LOCAL_SPORTS_MODEL=llama3.1:8b
OLLAMA_ENDPOINT=http://localhost:11434/api/generate

# Feature Flags
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 5. Database Migration
```bash
# Run database migrations
npm run db:push
```

### 6. PM2 Process Management
Create PM2 ecosystem file:
```bash
sudo nano /var/www/go4it-sports/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'go4it-sports',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/go4it-sports',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/go4it-sports/error.log',
    out_file: '/var/log/go4it-sports/out.log',
    log_file: '/var/log/go4it-sports/combined.log',
    time: true
  }]
};
```

### 7. Start Application
```bash
# Create log directory
sudo mkdir -p /var/log/go4it-sports
sudo chown -R $USER:$USER /var/log/go4it-sports

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Domain and SSL Configuration

### 1. Nginx Configuration
Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/go4it-sports
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    location /_next/static {
        alias /var/www/go4it-sports/.next/static;
        expires 365d;
        access_log off;
    }
    
    location /uploads {
        alias /var/www/go4it-sports/uploads;
        expires 30d;
        access_log off;
    }
}
```

### 2. Enable Site and SSL
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/go4it-sports /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Self-Hosted AI Setup (Optional)

### Install Ollama for Local AI Models
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
sudo systemctl start ollama
sudo systemctl enable ollama

# Pull lightweight models
ollama pull gemma:2b
ollama pull llama3.1:8b
```

## Domain Pointing

### 1. DNS Configuration
Point your domain to your server:
```
A Record: yourdomain.com → YOUR_SERVER_IP
A Record: www.yourdomain.com → YOUR_SERVER_IP
```

### 2. Firewall Configuration
```bash
# Allow HTTP/HTTPS traffic
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

## Monitoring and Maintenance

### 1. PM2 Monitoring
```bash
# Check application status
pm2 status
pm2 logs go4it-sports

# Monitor system resources
pm2 monit
```

### 2. Backup Strategy
```bash
# Create backup script
sudo nano /etc/cron.daily/go4it-backup
```

```bash
#!/bin/bash
# Backup database
pg_dump -U go4it_user -h localhost go4it_sports > /backups/go4it_db_$(date +%Y%m%d).sql

# Backup application files
tar -czf /backups/go4it_app_$(date +%Y%m%d).tar.gz /var/www/go4it-sports

# Clean old backups (keep 7 days)
find /backups -name "*.sql" -mtime +7 -delete
find /backups -name "*.tar.gz" -mtime +7 -delete
```

### 3. Auto-Updates
```bash
# Create update script
sudo nano /usr/local/bin/update-go4it
```

```bash
#!/bin/bash
cd /var/www/go4it-sports
git pull origin main
npm ci
npm run build
pm2 reload go4it-sports
```

## Security Considerations

### 1. Server Security
- Keep OS and packages updated
- Use strong passwords and SSH keys
- Configure firewall properly
- Regular security audits

### 2. Application Security
- Use HTTPS only
- Secure JWT secrets
- Regular dependency updates
- Database security best practices

## Performance Optimization

### 1. Nginx Optimization
```nginx
# Add to nginx.conf
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 2. Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_video_analysis_user_id ON video_analysis(user_id);
CREATE INDEX idx_video_analysis_created_at ON video_analysis(created_at);
```

## Troubleshooting

### Common Issues
1. **Port 3000 already in use**: Check with `sudo lsof -i :3000`
2. **Database connection issues**: Check PostgreSQL service and credentials
3. **SSL certificate issues**: Verify domain DNS and firewall settings
4. **Performance issues**: Monitor with `pm2 monit` and check server resources

### Logs Location
- Application logs: `/var/log/go4it-sports/`
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: `/var/log/postgresql/`

## Support

For technical support or deployment assistance:
- Check the main README.md file
- Review the deployment logs
- Contact the development team

---

**Note**: Replace `yourdomain.com` with your actual domain name and `your_secure_password` with strong passwords throughout this guide.