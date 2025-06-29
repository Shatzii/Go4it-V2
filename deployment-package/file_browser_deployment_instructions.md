# Deploying Star Coder Editor via File Browser

## Step 1: Download the Files

First, download these three files from this Replit to your computer:
- `star_coder_integration.js` - The backend integration service
- `client/editor.html` - The Monaco Editor frontend
- `setup_star_coder_editor.sh` - The installation script

## Step 2: Access File Browser

1. Open your web browser and navigate to File Browser on your server
   - URL: `https://files.go4itsports.org` (or your File Browser URL)
   - Log in with your credentials

## Step 3: Create Directory

1. Navigate to `/var/www/` (or your preferred installation location)
2. Create a new directory called `editor`
3. Enter the new directory

## Step 4: Upload Files

1. Upload the following files to the `/var/www/editor` directory:
   - `star_coder_integration.js` 
   - `setup_star_coder_editor.sh`
2. Create a new folder called `public` inside the `/var/www/editor` directory
3. Upload `editor.html` to the `/var/www/editor/public` directory and rename it to `index.html`

## Step 5: Execute Setup Script

1. In File Browser, open the terminal feature (if available)
2. Run the following commands:
   ```bash
   cd /var/www/editor
   chmod +x setup_star_coder_editor.sh
   ./setup_star_coder_editor.sh
   ```
3. If File Browser doesn't have a terminal feature, connect to your server via SSH and run the above commands

## Step 6: Verify Installation

After the setup script completes:
1. Check if the service is running:
   ```bash
   systemctl status star-coder-editor
   ```
2. Verify nginx configuration:
   ```bash
   nginx -t
   ```
3. Check the logs if there are any issues:
   ```bash
   journalctl -u star-coder-editor
   ```

## Step 7: Access Your Editor

Open your web browser and navigate to:
- `https://editor.go4itsports.org` (or the domain you configured)

You now have a fully functioning web-based code editor with Star Coder AI integration!