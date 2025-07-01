# This file provides an overview of the scripts used in the Pharaoh Control Panel project.

## Overview
The scripts directory contains essential scripts for the deployment and management of the Pharaoh Control Panel application. 

## Directory Structure
- **deploy.sh**: This script is responsible for building and deploying the frontend application to the specified server. It includes commands to ensure that the application is properly built and transferred to the server.

## Usage
To deploy the application, run the following command in your terminal:
```bash
bash scripts/deploy.sh
```

Ensure that you have the necessary permissions to execute the script and that your environment is set up correctly.

## Requirements
- Ensure that you have Node.js and npm installed.
- The script assumes that the Vite and TailwindCSS dependencies are included in your `package.json`.

## Notes
- Modify the `deploy.sh` script as needed to fit your deployment environment.
- Always test the deployment process in a staging environment before deploying to production.