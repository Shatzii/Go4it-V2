# Go4It Sports Clean Deployment Kit

This package contains a minimal deployment configuration to get your Go4It Sports platform running on your Hetzner server.

## What's Included

1. **nginx.conf** - A clean, optimized Nginx configuration for serving the Go4It Sports platform
2. **deploy.sh** - An automated deployment script that handles setup and configuration
3. **This README** - Instructions and troubleshooting guidance

## Deployment Instructions

1. **Upload this folder to your server:**
   ```
   scp -r clean_build/* root@188.245.209.124:/root/clean_deployment/
   ```

2. **SSH into your server:**
   ```
   ssh root@188.245.209.124
   ```

3. **Navigate to the deployment directory:**
   ```
   cd /root/clean_deployment/
   ```

4. **Make the deployment script executable:**
   ```
   chmod +x deploy.sh
   ```

5. **Run the deployment script:**
   ```
   ./deploy.sh
   ```

6. **Verify the site is working:**
   Visit http://go4itsports.org or http://188.245.209.124 in your browser.

## Troubleshooting

### If Nginx won't start:

1. Check Nginx logs:
   ```
   tail -f /var/log/nginx/error.log
   ```

2. Verify Nginx syntax:
   ```
   nginx -t
   ```

3. Try restarting Nginx manually:
   ```
   killall -9 nginx
   nginx
   ```

### If "Connection refused" persists:

1. Check if Nginx is running:
   ```
   ps aux | grep nginx
   ```

2. Check if port 80 is open and listening:
   ```
   netstat -tulpn | grep :80
   ```

3. Temporarily disable any firewall to test connectivity:
   ```
   ufw disable   # (if using UFW)
   ```
   or
   ```
   iptables -F  # (if using iptables directly)
   ```

4. Verify the server can connect to itself:
   ```
   curl -v http://localhost
   ```

## Step 2: Full Deployment

Once the basic setup is working, you can deploy your complete application:

1. Create a zip file of your full application
2. Upload it to the server
3. Extract it to the proper directories:
   - Client files: `/var/www/go4itsports/client/`
   - Server files: `/var/www/go4itsports/server/`
4. Install server dependencies:
   ```
   cd /var/www/go4itsports/server
   npm install --production
   ```
5. Start the server:
   ```
   npm start
   ```
   or if using PM2:
   ```
   pm2 start index.js --name go4it-api
   ```

## Support

If you encounter any issues during deployment, please check the logs and make any necessary adjustments to the configuration files.