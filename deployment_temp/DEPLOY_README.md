# Go4It Sports Platform Deployment Package

This package contains everything needed to deploy the Go4It Sports platform to your production server.

## Quick Start

1. **Unzip the package on your server**
   ```bash
   unzip go4it-sports-deployment-20250425-211221.zip -d /var/www/go4it
   cd /var/www/go4it
   ```

2. **Configure environment variables**
   ```bash
   cp .env.sample .env
   # Edit .env with your actual values
   nano .env
   ```

3. **Set up the database**
   Follow instructions in DEPLOYMENT.md

4. **Deploy the application**
   ```bash
   chmod +x deploy-production.sh
   ./deploy-production.sh
   ```

5. **Verify the deployment**
   - Check the application is running: `curl http://localhost:81`
   - View logs: `tail -f logs/server.log`

For complete instructions, see DEPLOYMENT.md and DEPLOYMENT_CHECKLIST.md
