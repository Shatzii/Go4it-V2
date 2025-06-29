#!/bin/bash

echo "Updating Go4It Sports Go4It Sports Enterprise..."

# Pull latest images
docker-compose pull

# Restart services
docker-compose down
docker-compose up -d

echo "Update completed!"
