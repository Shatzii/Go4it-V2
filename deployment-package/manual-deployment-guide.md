# Go4it Sports - Manual Deployment Guide

## Server: 5.188.99.81 (pharaoh user)
## Domain: go4itsports.org

The server appears to have firewall restrictions. Here's how to deploy manually:

## Option 1: Enable SSH Access First

Connect to your server through your hosting provider's console/panel and run:

```bash
# Enable SSH access (as pharaoh user with sudo)
sudo ufw allow 22
sudo systemctl enable ssh
sudo systemctl start ssh

# Or if using iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

## Option 2: Upload Files via FTP/SFTP

1. Create a deployment package:
```bash
git clone https://github.com/Shatzii/Go4it-Sports.git
cd Go4it-Sports
tar -czf go4it-sports-deploy.tar.gz .
```

2. Upload via FTP/SFTP to `/var/www/go4it-sports/`

## Option 3: Direct Server Setup

If you have server console access, run these commands on the server:

```bash
# 1. Install required packages
sudo apt update
sudo apt install -y nginx git nodejs npm certbot python3-certbot-nginx

# 2. Clone the repository
sudo mkdir -p /var/www/go4it-sports
cd /var/www/
sudo git clone https://github.com/Shatzii/Go4it-Sports.git go4it-sports

# 3. Set permissions
sudo chown -R www-data:www-data /var/www/go4it-sports
sudo find /var/www/go4it-sports -type d -exec chmod 755 {} \;
sudo find /var/www/go4it-sports -type f -exec chmod 644 {} \;

# 4. Create Nginx configuration
sudo nano /etc/nginx/sites-available/go4it-sports
```

Copy this Nginx configuration:

```nginx
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;
    root /var/www/go4it-sports;
    index index.html index.php index.htm;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Handle static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Handle PHP files (if needed)
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security for uploads (if any)
    location /uploads/ {
        location ~ \.php$ {
            deny all;
        }
    }
}
```

Continue with:

```bash
# 5. Enable the site
sudo ln -s /etc/nginx/sites-available/go4it-sports /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 6. Set up SSL certificate
sudo certbot --nginx -d go4itsports.org -d www.go4itsports.org --email media@shatzii.com

# 7. Enable firewall rules
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable
```

## DNS Configuration

Point your domain to the server:

```
A Record: go4itsports.org → 5.188.99.81
A Record: www.go4itsports.org → 5.188.99.81
```

## Troubleshooting

1. Check Nginx status: `sudo systemctl status nginx`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Test configuration: `sudo nginx -t`
4. Restart services: `sudo systemctl restart nginx`

## Auto-Update Script

Create this script on the server for easy updates:

```bash
#!/bin/bash
cd /var/www/go4it-sports
sudo git pull origin main
sudo chown -R www-data:www-data .
sudo systemctl reload nginx
echo "Deployment updated successfully!"
```

Save as `/home/pharaoh/update-site.sh` and make executable: `chmod +x update-site.sh`
