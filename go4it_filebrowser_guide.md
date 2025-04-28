# Go4It Sports File Upload Guide
## Using FileBrowser to Deploy Your Application

*Version 1.0 - April 28, 2025*

---

## Table of Contents

1. [Installation & Setup](#part-1-installation--setup)
2. [Using FileBrowser](#part-2-using-filebrowser-to-upload-files)
3. [Troubleshooting](#part-3-troubleshooting-common-issues)
4. [Verifying Deployment](#part-4-verifying-your-deployment)
5. [Quick Reference Commands](#part-5-quick-reference-commands)

---

## Part 1: Installation & Setup

### Install FileBrowser on the Server

First, SSH into your server:

```bash
ssh root@188.245.209.124
```

Once logged in, run these commands:

```bash
# Update system packages
apt update
apt install -y curl unzip

# Download the latest FileBrowser binary
curl -fsSL https://github.com/filebrowser/filebrowser/releases/download/v2.25.0/linux-amd64-filebrowser.tar.gz | tar -xz

# Move the binary to a system directory
mv filebrowser /usr/local/bin/filebrowser

# Create config directory
mkdir -p /etc/filebrowser

# Initialize FileBrowser configuration
filebrowser config init -d /etc/filebrowser/filebrowser.db

# Set the root directory to Go4It's folder
filebrowser config set -r /var/www/go4itsports -d /etc/filebrowser/filebrowser.db

# Set branding for the interface
filebrowser config set --branding.name "Go4It Sports File Manager" -d /etc/filebrowser/filebrowser.db

# Create an admin user (choose a strong password)
filebrowser users add admin YourSecurePassword --perm.admin -d /etc/filebrowser/filebrowser.db

# Create a service file for FileBrowser
cat > /etc/systemd/system/filebrowser.service << EOL
[Unit]
Description=File Browser
After=network.target

[Service]
ExecStart=/usr/local/bin/filebrowser -d /etc/filebrowser/filebrowser.db -a 0.0.0.0 -p 8080
Restart=on-failure
User=root
Group=root

[Install]
WantedBy=multi-user.target
EOL

# Start and enable FileBrowser service
systemctl daemon-reload
systemctl start filebrowser
systemctl enable filebrowser

# Set up Nginx as a proxy
cat > /etc/nginx/sites-available/filebrowser << EOL
server {
    listen 80;
    server_name files.go4itsports.org;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        client_max_body_size 500M;  # Increase upload limit to 500MB
    }
}
EOL

# Enable the site
ln -s /etc/nginx/sites-available/filebrowser /etc/nginx/sites-enabled/

# Test and reload Nginx
nginx -t && systemctl reload nginx

# Set up SSL (if domain is already pointed to your server)
certbot --nginx -d files.go4itsports.org --non-interactive --agree-tos --email a.barrett@go4itsports.org
```

### Create Directory Structure

Before uploading files, create the required directory structure:

```bash
#!/bin/bash

# Exit on error
set -e

echo "=== Creating Go4It Sports Directory Structure ==="

# Create main application directory with proper permissions
echo "Creating main application directory..."
mkdir -p /var/www/go4itsports
chmod 755 /var/www/go4itsports

# Create essential top-level directories
echo "Creating essential directories..."
mkdir -p /var/www/go4itsports/{client,server,shared,public,uploads,logs,api_locker,migrations}

# Create client subdirectories
echo "Creating client directories..."
mkdir -p /var/www/go4itsports/client/{dist,public/images,public/fonts,src/components,src/contexts,src/hooks,src/lib,src/pages,src/services}

# Create server subdirectories
echo "Creating server directories..."
mkdir -p /var/www/go4itsports/server/{middleware,routes,services,types,utils}

# Create upload subdirectories
echo "Creating upload directories..."
mkdir -p /var/www/go4itsports/uploads/{videos,images,highlights,temp}

# Create log directories
echo "Creating log directories..."
mkdir -p /var/www/go4itsports/logs/pm2

# Create database backup directory
echo "Creating backup directory..."
mkdir -p /var/backups/go4itsports

# Set proper permissions
echo "Setting proper permissions..."
chmod 700 /var/www/go4itsports/api_locker
chmod -R 755 /var/www/go4itsports/public
chmod -R 755 /var/www/go4itsports/uploads

echo "Directory structure creation complete!"
```

### Update DNS Records

Add a new DNS A record for `files.go4itsports.org` pointing to your server IP (`188.245.209.124`).

---

## Part 2: Using FileBrowser to Upload Files

### Accessing FileBrowser

1. Open your web browser and go to `https://files.go4itsports.org`
2. Log in with:
   - Username: `admin`
   - Password: The secure password you set during installation

### Navigating the Interface

FileBrowser's interface consists of:

- **Left Sidebar**: Contains navigation options
- **Main Area**: Displays files and folders in the current directory
- **Top Bar**: Contains search, view options, and user menu

### Uploading Files Method 1: Drag & Drop

1. Navigate to the destination folder in FileBrowser
   - Click on folders to open them
   - Use the path breadcrumbs at the top to navigate back

2. Drag files directly from your computer's file explorer onto the FileBrowser window
   - A blue upload area will appear when you drag
   - Drop the files to start uploading
   - Progress bars will show upload status

3. Once uploads complete, you'll see the files in the current directory

### Uploading Files Method 2: Upload Button

1. Navigate to the destination folder in FileBrowser

2. Click the "Upload" button in the top-right corner
   - Select "Upload Files" from the dropdown

3. In the file selection dialog that appears:
   - Select one or multiple files
   - Click "Open" or "Upload"
   - Progress bars will show upload status

### Uploading an Entire Directory

1. Navigate to the destination folder in FileBrowser

2. Click the "Upload" button in the top-right corner
   - Select "Upload Directory" from the dropdown

3. In the folder selection dialog:
   - Select the folder you want to upload
   - Click "Upload" or "Select Folder"
   - The entire directory structure will be preserved

### Creating New Directories

Before uploading, you might want to create a new directory:

1. Navigate to the location where you want to create a directory
2. Click the "New" button in the top menu
3. Select "Directory" from the dropdown
4. Enter a name for the new directory
5. Click "Create" or press Enter

### Managing Files After Upload

After uploading, you can:

1. **Move Files**: Select files and click "Move" button
2. **Rename Files**: Click on the file name and edit it
3. **Delete Files**: Select files and click "Delete" button
4. **Edit Text Files**: Click on a text file to open the built-in editor
5. **Download Files**: Select files and click "Download" button

### Uploading Go4It Sports Application Files

For your Go4It Sports deployment, follow this structure:

1. Create the required directories first (if not already done by the setup script)
   - Navigate to each directory path and create it if needed

2. Upload the application files to the correct locations:
   - `/var/www/go4itsports/client` - Upload frontend files
   - `/var/www/go4itsports/server` - Upload backend files
   - `/var/www/go4itsports/shared` - Upload shared schemas and types
   - `/var/www/go4itsports/public` - Upload static assets
   - Upload configuration files to the root directory

3. Upload configuration files to root:
   - `.env` (create or edit this directly if it contains sensitive info)
   - `package.json`
   - `tsconfig.json`
   - Other config files

### Setting Proper File Permissions

After uploading:

1. In FileBrowser, select files or directories
2. Click the "Permissions" button in the top menu
3. Set appropriate permissions:
   - For directories: Usually 755 (rwxr-xr-x)
   - For executables: 755 (rwxr-xr-x)
   - For configuration files: 644 (rw-r--r--)
   - For sensitive files: 600 (rw-------)

---

## Part 3: Troubleshooting Common Issues

### Upload Fails: File Too Large

If your uploads fail due to size limits:

1. SSH into your server
2. Edit the Nginx configuration:
   ```bash
   nano /etc/nginx/sites-available/filebrowser
   ```
3. Increase the `client_max_body_size` value (e.g., to 1000M for 1GB)
4. Save and reload Nginx:
   ```bash
   nginx -t && systemctl reload nginx
   ```

### Can't See Uploaded Files

If files are uploaded but not visible:

1. Check file permissions:
   ```bash
   ls -la /var/www/go4itsports/path/to/file
   ```
2. Ensure the user running FileBrowser has read permissions

### Connection Issues

If you can't connect to FileBrowser:

1. Check if the service is running:
   ```bash
   systemctl status filebrowser
   ```
2. Verify Nginx is running:
   ```bash
   systemctl status nginx
   ```
3. Check firewall settings:
   ```bash
   ufw status
   ```

---

## Part 4: Verifying Your Deployment

After uploading all files:

1. Check file structure integrity:
   ```bash
   find /var/www/go4itsports -type d | sort
   ```

2. Verify key files existence:
   ```bash
   ls -la /var/www/go4itsports/package.json
   ls -la /var/www/go4itsports/server/index.ts
   ls -la /var/www/go4itsports/client/index.html
   ```

3. Install dependencies and build the application:
   ```bash
   cd /var/www/go4itsports
   npm ci
   npm run build
   ```

4. Start the application:
   ```bash
   pm2 start ecosystem.config.js
   ```

## Part 5: Quick Reference Commands

### Starting/Stopping FileBrowser

```bash
# Start FileBrowser
systemctl start filebrowser

# Stop FileBrowser
systemctl stop filebrowser

# Restart FileBrowser
systemctl restart filebrowser

# Check status
systemctl status filebrowser
```

### File & Directory Commands

```bash
# Check file permissions
ls -la /path/to/file

# Change file permissions
chmod 644 /path/to/file

# Change directory permissions
chmod 755 /path/to/directory

# Change ownership
chown -R www-data:www-data /path/to/directory
```

### Directory Structure

```
/var/www/go4itsports/
├── client/
│   ├── dist/
│   ├── public/
│   │   ├── images/
│   │   └── fonts/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       └── services/
├── server/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── utils/
├── shared/
├── public/
├── uploads/
│   ├── videos/
│   ├── images/
│   ├── highlights/
│   └── temp/
├── logs/
├── api_locker/
└── migrations/
```

---

*Note: This guide is specific to Go4It Sports deployment. For general FileBrowser documentation, visit https://filebrowser.org/.*

*Created: April 28, 2025*