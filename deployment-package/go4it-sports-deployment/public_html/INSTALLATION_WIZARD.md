# Go4It Sports Installation Wizard

## Overview

The Go4It Sports platform comes with a user-friendly graphical installation wizard that guides you through the setup process. The wizard provides an intuitive interface to configure all aspects of your installation, including:

- Database connection
- Web server settings
- API configuration
- External service integration
- Feature customization

## System Requirements

Before running the installation wizard, ensure your system meets the following requirements:

- Node.js 20.x or newer
- PostgreSQL 14.x or newer
- A web server (Nginx recommended)
- 2+ CPU cores
- 4+ GB RAM
- 20+ GB SSD storage

## Running the Installation Wizard

To start the installation wizard:

1. Extract the deployment package to your desired location
   ```bash
   unzip go4it-deployment-*.zip -d /var/www/go4itsports.org/
   cd /var/www/go4itsports.org/
   ```

2. Run the installation script
   ```bash
   ./install.sh
   ```
   
   This will automatically:
   - Install required dependencies
   - Start the installation wizard
   - Open your default web browser to the wizard interface

3. If the browser doesn't open automatically, navigate to:
   ```
   http://localhost:3333
   ```

## Installation Steps

The wizard will guide you through these steps:

1. **Welcome**: Introduction and overview
2. **System Check**: Verification of system requirements
3. **Database Setup**: Configure PostgreSQL connection
4. **Web Server**: Configure Nginx or other web server
5. **API Configuration**: Set up API server settings
6. **API Keys**: Configure external service integration
7. **Features**: Enable/disable platform features
8. **Installation**: Final setup and configuration generation

## After Installation

Once the installation is complete, the wizard will provide instructions for:

1. Starting the application server
2. Setting up your web server with the generated configuration
3. Accessing your Go4It Sports platform

## Troubleshooting

If you encounter any issues during the installation:

- Check the logs in the `logs` directory
- Verify your system meets all requirements
- Ensure all API keys are valid
- Make sure your database server is running and accessible

For additional assistance, consult the documentation or contact support.

## Manual Installation

If you prefer to install manually without the wizard, you can follow the instructions in the `DEPLOYMENT.md` file included in the deployment package.