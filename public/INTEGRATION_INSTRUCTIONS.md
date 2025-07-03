# Command Panel + Sentinel 4.5 Integration Instructions

These instructions will guide you through integrating Sentinel 4.5 security system with your Command Panel upgrade.

## Preparation Steps

1. Download these files from the Replit environment:
   - `Sentinel_4.5_Security_System.tar.gz` (The security system package)
   - `command_panel_security_integration.sh` (The integration script)
   - `security_styles.css` (CSS styles for the security integration)

2. Prepare your command panel files:
   - Create a folder named `command_panel_files` on your local machine
   - Place all your command panel upgrade files in this folder (SCindex.html renamed to index.html, SCstyle.css renamed to style.css, etc.)

3. Add security styles to your command panel CSS:
   - Open your `style.css` file in the `command_panel_files` folder
   - Append the contents of `security_styles.css` to the end of your CSS file

## Running the Integration

1. Place all these files in the same directory:
   - `command_panel_files/` (folder containing your command panel files)
   - `Sentinel_4.5_Security_System.tar.gz`
   - `command_panel_security_integration.sh`

2. Make the script executable:
   ```bash
   chmod +x command_panel_security_integration.sh
   ```

3. Run the integration script:
   ```bash
   ./command_panel_security_integration.sh
   ```

4. The script will:
   - Upload your command panel files to `/var/www/go4itsports/pharaoh/command_panel/`
   - Set up the Sentinel 4.5 security system in the `sentinel/` subdirectory
   - Configure permissions, services, and Nginx
   - Add the security integration to your command panel interface

## Manual Integration (if the script fails)

If the script encounters issues, you can follow these manual steps:

### Step 1: Upload Command Panel Files

```bash
# Upload command panel files
scp -r command_panel_files/* root@188.245.209.124:/var/www/go4itsports/pharaoh/command_panel/
```

### Step 2: Upload and Extract Sentinel

```bash
# Upload Sentinel package
scp Sentinel_4.5_Security_System.tar.gz root@188.245.209.124:/var/www/go4itsports/pharaoh/command_panel/

# SSH into server
ssh root@188.245.209.124

# Extract Sentinel package
cd /var/www/go4itsports/pharaoh/command_panel/
mkdir -p sentinel
tar -xzf Sentinel_4.5_Security_System.tar.gz -C sentinel/
rm Sentinel_4.5_Security_System.tar.gz
```

### Step 3: Set Permissions

```bash
chown -R www-data:www-data /var/www/go4itsports/pharaoh/command_panel/
chmod -R 755 /var/www/go4itsports/pharaoh/command_panel/
chmod 755 /var/www/go4itsports/pharaoh/command_panel/*.php
```

### Step 4: Install Sentinel Dependencies

```bash
cd /var/www/go4itsports/pharaoh/command_panel/sentinel/
npm ci --production
```

### Step 5: Configure Sentinel Environment

Create `/var/www/go4itsports/pharaoh/command_panel/sentinel/.env` with the content from the script (API_PREFIX and DASHBOARD_PATH pointing to your command panel path).

### Step 6: Add Security Integration to Command Panel

Edit your `/var/www/go4itsports/pharaoh/command_panel/index.html` to add the security integration code before the closing `</body>` tag.

### Step 7: Set Up the Service

Create `/etc/systemd/system/sentinel.service` as shown in the script, then run:

```bash
systemctl daemon-reload
systemctl enable sentinel
systemctl start sentinel
```

### Step 8: Configure Nginx

Create `/etc/nginx/sites-available/sentinel` as shown in the script, then:

```bash
ln -sf /etc/nginx/sites-available/sentinel /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## Verification

After integration, verify that both systems are working properly:

1. Access your command panel at:
   ```
   http://188.245.209.124/pharaoh/command_panel/
   ```

2. Check that the security section appears at the bottom of your command panel
   
3. Verify you can access the security dashboard at:
   ```
   http://188.245.209.124/pharaoh/command_panel/sentinel/dashboard/
   ```

4. Test the security API endpoint:
   ```
   http://188.245.209.124/pharaoh/command_panel/sentinel/api/status
   ```

## Troubleshooting

- **Command Panel Not Loading**: Check Nginx configuration and file permissions
- **Security Integration Not Appearing**: Make sure the HTML integration code was added to index.html
- **Security Dashboard Not Loading**: Check Sentinel service status with `systemctl status sentinel`
- **API Not Responding**: Check Nginx proxy configuration and that the service is running
- **CSS Styling Issues**: Ensure security styles were added to style.css