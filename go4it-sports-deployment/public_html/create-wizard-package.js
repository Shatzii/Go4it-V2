/**
 * Go4It Sports Wizard Package Creator
 * 
 * This script creates a distribution package of the Go4It Sports installation wizard.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, 'wizard-package');
const PACKAGE_FILES = [
  'start-wizard.js',
  'wizard-assets',
  'package.json'
];

// Create minimal package.json for the wizard
const packageJson = {
  "name": "go4it-installation-wizard",
  "version": "1.0.1",
  "description": "Installation wizard for Go4It Sports platform",
  "type": "module",
  "main": "start-wizard.js",
  "scripts": {
    "start": "node start-wizard.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "open": "^9.1.0"
  }
};

async function createDistributionPackage() {
  console.log('Creating Go4It Sports Wizard Package...');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  } else {
    // Clear the directory
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Cleared and recreated output directory: ${OUTPUT_DIR}`);
  }

  // Create package.json
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log('Created package.json');

  // Copy files
  for (const file of PACKAGE_FILES) {
    const sourcePath = path.join(__dirname, file);
    const destPath = path.join(OUTPUT_DIR, file);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`Warning: Source file or directory not found: ${sourcePath}`);
      continue;
    }

    if (fs.statSync(sourcePath).isDirectory()) {
      // It's a directory, copy recursively
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectoryRecursive(sourcePath, destPath);
      console.log(`Copied directory: ${file}`);
    } else {
      // It's a file, copy directly
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied file: ${file}`);
    }
  }

  // Create a README.md
  const readmeContent = `# Go4It Sports Installation Wizard

Version: 1.0.1

## Overview

This package contains the installation wizard for the Go4It Sports platform. The wizard provides a user-friendly interface to configure and install the Go4It Sports application on your server.

## Requirements

- Node.js 20.x or higher
- npm 9.x or higher
- PostgreSQL 14.x or higher
- Nginx 1.20.x or higher (recommended) or Apache

## Quick Start

1. Extract this package to your server
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the wizard
4. Open your browser and navigate to \`http://localhost:3333\`
5. Follow the on-screen instructions to complete the installation

## What the Wizard Will Configure

- Database connection
- Web server settings (Nginx/Apache)
- API server configuration
- External API keys (OpenAI, Anthropic, etc.)
- Feature settings

## Support

For assistance, contact support@go4itsports.org or visit our documentation at https://go4itsports.org/docs

© 2025 Go4It Sports
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), readmeContent);
  console.log('Created README.md');

  // Create archive
  try {
    await execAsync(`cd ${__dirname} && zip -r go4it-wizard.zip wizard-package`);
    console.log('Created archive: go4it-wizard.zip');
  } catch (error) {
    console.error('Failed to create archive:', error.message);
  }

  console.log('\nPackage creation complete!');
  console.log('Package location: ' + path.join(__dirname, 'go4it-wizard.zip'));
}

function copyDirectoryRecursive(source, destination) {
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

// Run the package creation
createDistributionPackage().catch(error => {
  console.error('Error creating package:', error);
  process.exit(1);
});