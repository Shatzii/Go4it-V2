#!/bin/bash

# Go4It Sports - Directory Structure Creation Script
# This script creates the complete directory structure needed for the Go4It Sports platform

# Exit on error
set -e

echo "=== Creating Go4It Sports Directory Structure ==="

# Create main application directory
echo "Creating main application directory..."
mkdir -p /var/www/go4itsports

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
chmod 755 /var/www/go4itsports
chmod 700 /var/www/go4itsports/api_locker
chmod -R 755 /var/www/go4itsports/public
chmod -R 755 /var/www/go4itsports/uploads

echo "Directory structure creation complete!"
echo "========================================"
echo "You can now transfer your application files to these directories."
echo "Use the deploy.sh script to complete the deployment process."
echo "========================================"