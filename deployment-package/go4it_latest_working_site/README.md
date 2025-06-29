# Go4It Sports - Latest Working Version

This package contains all the essential files from the latest working version of the Go4It Sports platform. This is a complete snapshot of the working code that can be deployed to your production server.

## Contents

- `/client` - Frontend code (React/TypeScript)
- `/server` - Backend code (Node.js/Express)
- `/shared` - Shared types and schemas
- `/public` - Static assets
- Configuration files (package.json, tsconfig.json, etc.)
- Deployment scripts

## Deployment

1. Follow the instructions in `full_deployment_instructions.md` to deploy this package to your server.
2. Use the `deploy.sh` script to automate the deployment process.
3. The directory structure can be created using `create_directory_structure.sh`.

## Important Notes

- Before deployment, make sure to create a `.env` file with your specific environment variables (use .env.template as reference)
- Make sure your domain (go4itsports.org) is pointing to your server IP (188.245.209.124)
- SSL certificates will be set up automatically by the deployment script

For detailed directory structure information, see `go4it_site_map.md`.
