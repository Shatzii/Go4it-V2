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
