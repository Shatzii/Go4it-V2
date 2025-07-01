#!/bin/bash

# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Build the project
npm run build

# Copy the built files to the deployment directory
cp -r dist/* /var/www/control-room/frontend/dist/

# Restart NGINX to serve the new files
sudo systemctl restart nginx

echo "Deployment completed successfully!"