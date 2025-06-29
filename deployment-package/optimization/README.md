# Go4It Sports Server Optimizations

This package contains optimization scripts for deployment on Hetzner VPS:
- 4 vCPU
- 16GB RAM
- 160GB SSD

## Contents:

1. server-optimization.sh - System-level optimizations for PostgreSQL, Nginx, Node.js
2. ai-video-optimization.js - Configuration for AI video analysis
3. video-processing-worker.js - Worker implementation for parallel video processing
4. upload-config.js - File upload configurations with 2GB limit for admins, 500MB for regular users
5. nginx-traffic-optimization.conf - Traffic optimization with time-based rules for morning/afternoon peaks
6. migrate-data.sh - Data migration script for transferring from old server
7. DNS_SETUP_GUIDE.md - Complete DNS configuration guide

## Installation:

1. Upload these files to your server
2. Make the shell scripts executable: `chmod +x *.sh`
3. Run server optimization: `./server-optimization.sh`
4. Add the AI video optimization files to your application
5. Configure your nginx with the provided optimization settings
6. Follow the DNS setup guide for domain configuration

These optimizations will ensure your Go4It Sports platform runs efficiently with the specified AI video analysis requirements.
