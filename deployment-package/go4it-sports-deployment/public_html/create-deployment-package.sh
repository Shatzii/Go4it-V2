#!/bin/bash

# Create deployment package for Go4it Sports
# For manual upload to 5.188.99.81 with domain go4itsports.org

echo "📦 Creating deployment package for Go4it Sports..."

# Create deployment directory
mkdir -p go4it-sports-deployment
cd go4it-sports-deployment

# Copy project files (excluding git, node_modules, etc.)
echo "📁 Copying project files..."
rsync -av --exclude='.git' --exclude='node_modules' --exclude='*.log' \
    --exclude='.env' --exclude='deployment-*' --exclude='go4it-sports-deployment' \
    ../ ./public_html/

# Create configuration files
echo "⚙️  Creating server configuration files..."

# Create .htaccess for Apache
cat > public_html/.htaccess << 'EOF'
# Go4it Sports - Apache Configuration
RewriteEngine On

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# HTTPS redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove index.php from URLs
RewriteCond %{THE_REQUEST} /public([/\s?].*)?(\s|\?|&|#|$) [NC]
RewriteRule ^(.*)$ /%1 [R=301,L]

# Handle Angular/React routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Protect sensitive files
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>
EOF

# Create Nginx configuration (for reference)
cat > nginx-config.conf << 'EOF'
# Nginx configuration for go4itsports.org
server {
    listen 80;
    server_name go4itsports.org www.go4itsports.org;
    root /var/www/html;
    index index.html index.php;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Handle static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # PHP processing (if needed)
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
EOF

# Create PHP configuration (if needed)
cat > public_html/index.php << 'EOF'
<?php
// Go4it Sports - PHP Entry Point
// This file handles PHP routing if needed

// Simple routing example
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

switch ($path) {
    case '/':
    case '/home':
        include 'index.html';
        break;
    case '/api/health':
        header('Content-Type: application/json');
        echo json_encode(['status' => 'OK', 'timestamp' => time()]);
        break;
    default:
        // Serve static files or fall back to index.html
        if (file_exists(__DIR__ . $path)) {
            return false; // Let the web server handle static files
        } else {
            include 'index.html'; // Single Page Application fallback
        }
        break;
}
?>
EOF

# Create deployment instructions
cat > DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# Go4it Sports Deployment Instructions

## Server Details
- **IP Address:** 5.188.99.81
- **Domain:** go4itsports.org
- **Repository:** https://github.com/Shatzii/Go4it-Sports

## Deployment Steps

### 1. Upload Files
Upload the contents of the `public_html` folder to your web server's document root:
- cPanel: Upload to `public_html` folder
- Plesk: Upload to `httpdocs` folder
- Direct server: Upload to `/var/www/html` or similar

### 2. DNS Configuration
Point your domain to the server:
```
Type: A Record
Name: @
Value: 5.188.99.81
TTL: 3600

Type: A Record
Name: www
Value: 5.188.99.81
TTL: 3600
```

### 3. SSL Certificate
Install SSL certificate for HTTPS:
- Use Let's Encrypt (free)
- Or upload your own SSL certificate

### 4. File Permissions
Set correct file permissions:
```bash
chmod 755 public_html/
chmod 644 public_html/*
chmod 755 public_html/*/
```

### 5. Web Server Configuration

#### For Apache:
- The `.htaccess` file is already included
- Make sure mod_rewrite is enabled

#### For Nginx:
- Use the provided `nginx-config.conf`
- Place in `/etc/nginx/sites-available/`
- Enable with symlink to `/etc/nginx/sites-enabled/`

## Testing
1. Visit http://go4itsports.org
2. Check HTTPS redirect works
3. Test all major pages/features
4. Verify mobile responsiveness

## Troubleshooting
- Check server error logs
- Verify file permissions
- Ensure all dependencies are uploaded
- Test DNS propagation

## Support
Repository: https://github.com/Shatzii/Go4it-Sports
Contact: media@shatzii.com
EOF

# Create a simple deployment checklist
cat > DEPLOYMENT_CHECKLIST.md << 'EOF'
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
EOF

# Create archive for easy upload
echo "🗜️  Creating deployment archive..."
tar -czf ../go4it-sports-deployment.tar.gz .

cd ..
echo ""
echo "✅ Deployment package created successfully!"
echo ""
echo "📦 Files created:"
echo "   - go4it-sports-deployment/ (folder with all files)"
echo "   - go4it-sports-deployment.tar.gz (compressed archive)"
echo ""
echo "📋 Next steps:"
echo "   1. Download the deployment package"
echo "   2. Upload to your server using:"
echo "      - FTP/SFTP client"
echo "      - Control panel file manager"
echo "      - Hosting provider's upload tool"
echo "   3. Follow DEPLOYMENT_INSTRUCTIONS.md"
echo "   4. Configure DNS to point go4itsports.org to 5.188.99.81"
echo ""
echo "🌐 Your site will be available at: https://go4itsports.org"
