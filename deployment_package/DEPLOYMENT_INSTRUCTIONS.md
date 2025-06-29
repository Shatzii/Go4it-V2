# Go4it Sports Manual Deployment Instructions

## Overview
Since direct SSH deployment is not available due to network restrictions, use this manual deployment package to deploy the Go4it Sports application to your server.

## Prerequisites
- Server running Ubuntu/Debian Linux
- SSH access as `pharaoh` user with sudo privileges
- Nginx web server installed
- Node.js and npm installed (if using Node.js components)
- Domain: go4itsports.org pointing to IP: 5.188.99.81

## Deployment Steps

### 1. Prepare the Application Files
First, ensure you have all your application files ready on your local machine or development environment.

### 2. Upload Files to Server
Upload your application files to the server using one of these methods:

**Option A: Using SCP**
```bash
# Upload application files
scp -r /path/to/your/app pharaoh@5.188.99.81:/home/pharaoh/go4it-app

# Upload deployment script
scp deploy-on-server.sh pharaoh@5.188.99.81:/home/pharaoh/
```

**Option B: Using SFTP**
```bash
sftp pharaoh@5.188.99.81
put -r /path/to/your/app
put deploy-on-server.sh
exit
```

**Option C: Using Git (if repository is public)**
```bash
ssh pharaoh@5.188.99.81
git clone https://github.com/your-username/go4it-sports.git
```

### 3. SSH into Your Server
```bash
ssh pharaoh@5.188.99.81
```

### 4. Run the Deployment Script
```bash
# Make the script executable
chmod +x deploy-on-server.sh

# Run the deployment
sudo ./deploy-on-server.sh
```

### 5. Verify Deployment
After the script completes, verify everything is working:

```bash
# Check Nginx status
sudo systemctl status nginx

# Test HTTP response
curl -I http://go4itsports.org

# Test HTTPS response (after SSL setup)
curl -I https://go4itsports.org

# Check site files
ls -la /var/www/go4it-sports/
```

## Troubleshooting

### Nginx Issues
```bash
# Test Nginx configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx

# Check enabled sites
sudo ls -la /etc/nginx/sites-enabled/
```

### SSL Certificate Issues
```bash
# Manual certificate installation
sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org

# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew --dry-run
```

### File Permissions
```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/go4it-sports

# Fix directory permissions
sudo find /var/www/go4it-sports -type d -exec chmod 755 {} \;

# Fix file permissions
sudo find /var/www/go4it-sports -type f -exec chmod 644 {} \;
```

### DNS Configuration
Ensure your domain DNS records are correctly configured:
- **A record**: go4itsports.org → 5.188.99.81
- **A record**: www.go4itsports.org → 5.188.99.81

You can check DNS propagation:
```bash
# Check DNS resolution
nslookup go4itsports.org
dig go4itsports.org
```

## Server Requirements

### System Packages
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx certbot python3-certbot-nginx

# Install Node.js (if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Firewall Configuration
```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

## Post-Deployment Monitoring

### Log Monitoring
```bash
# Monitor access logs
sudo tail -f /var/log/nginx/access.log

# Monitor error logs
sudo tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h
```

### Backup Considerations
```bash
# Create backup of site
sudo tar -czf /home/pharaoh/go4it-backup-$(date +%Y%m%d).tar.gz /var/www/go4it-sports

# Backup Nginx configuration
sudo cp /etc/nginx/sites-available/go4it-sports /home/pharaoh/nginx-go4it-backup.conf
```

## Alternative Deployment Methods

If the automated script fails, you can deploy manually:

1. **Create the web directory:**
   ```bash
   sudo mkdir -p /var/www/go4it-sports
   ```

2. **Copy your files:**
   ```bash
   sudo cp -r /home/pharaoh/your-app-files/* /var/www/go4it-sports/
   ```

3. **Set permissions:**
   ```bash
   sudo chown -R www-data:www-data /var/www/go4it-sports
   ```

4. **Create Nginx configuration manually:**
   ```bash
   sudo nano /etc/nginx/sites-available/go4it-sports
   ```

5. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/go4it-sports /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

## Support
If you encounter issues during deployment:
1. Check the error logs first
2. Verify all prerequisites are met
3. Ensure the pharaoh user has proper sudo privileges
4. Confirm DNS settings are correct
5. Test connectivity to the server
