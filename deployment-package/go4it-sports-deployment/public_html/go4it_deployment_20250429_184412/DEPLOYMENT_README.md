# Go4It Sports Deployment Package

This is a complete deployment package for Go4It Sports platform, including the new Star Coder + Monaco Editor integration.

## Deployment Steps

1. Upload this entire package to your server using File Browser or other file transfer method.
2. Connect to your server via SSH or use the File Browser Terminal feature.
3. Navigate to the uploaded directory and run the deployment script:
   ```
   chmod +x auto_deploy.sh
   ./auto_deploy.sh
   ```
4. The script will handle installation of dependencies and configuration of services.

## Star Coder + Monaco Editor Integration

The `/editor_integration` directory contains files needed to connect your existing Star Coder instance with Monaco Editor:

1. Follow the instructions in `monaco_integration_instructions.md` to integrate Star Coder with Monaco Editor.
2. Upload `direct_integration.js` to `/var/www/html/pharaoh/js/` on your server.
3. Update your Monaco Editor initialization in `monaco-setup.js` as described in the instructions.

## Post-Deployment Steps

After deployment, verify that:
1. The main Go4It Sports application is running correctly
2. The Star Coder integration with Monaco Editor is working
3. All database connections are functioning properly

## Troubleshooting

If you encounter issues during deployment:
1. Check the logs with `journalctl -u go4it`
2. Review database connection settings
3. Verify Star Coder API is running and accessible

For Star Coder integration issues:
1. Check browser console for JavaScript errors
2. Verify `direct_integration.js` was uploaded correctly
3. Make sure Star Coder API is running at the expected URL (default: http://localhost:11434/v1)
