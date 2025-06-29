# Go4It Sports Site Map and Directory Structure Package

This package contains essential files for setting up the directory structure and deploying the Go4It Sports platform on your Hetzner server.

## Files Included:

1. `go4it_site_map.md` - Complete site map showing the full directory structure
2. `create_directory_structure.sh` - Script to automatically create all required directories
3. `deploy.sh` - Complete deployment script for setting up the Go4It Sports platform
4. `deploy_checklist.md` - Checklist of essential files needed for deployment
5. `full_deployment_instructions.md` - Step-by-step deployment instructions

## How to Use:

1. Upload these files to your server
2. Make the scripts executable: `chmod +x *.sh`
3. Run `./create_directory_structure.sh` to create the directory structure
4. Follow the deployment instructions to complete the setup

## Directory Structure Overview:

The site map describes a standardized directory structure for your application:

- `/var/www/go4itsports/` - Main application directory
  - `client/` - Frontend code
  - `server/` - Backend code
  - `shared/` - Shared code
  - `uploads/` - File uploads
  - `public/` - Static files
  - `logs/` - Application logs
  - `api_locker/` - Secure API key storage

For detailed information, please refer to the `go4it_site_map.md` file.
