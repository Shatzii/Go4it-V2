/**
 * GO4IT Sports Simple File Transfer Utility
 * 
 * This script helps prepare and package files for easy transfer to your server.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Function to create a deployment package
async function createDeploymentPackage() {
  console.log('Creating deployment package...');
  
  // Source directory (you can change this to your needs)
  const sourceDir = path.join(__dirname, 'dist');
  
  // Output file
  const outputFile = path.join(__dirname, 'public', 'client_deployment.zip');
  
  // Create a file to stream archive data to
  const output = fs.createWriteStream(outputFile);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });
  
  // Listen for all archive data to be written
  output.on('close', function() {
    console.log(`Deployment package created: ${archive.pointer()} total bytes`);
    console.log(`Package available at: ${outputFile}`);
  });
  
  // Pipe archive data to the file
  archive.pipe(output);
  
  // Add the source directory contents to the archive
  archive.directory(sourceDir, false);
  
  // Finalize the archive
  await archive.finalize();
  
  return outputFile;
}

// Function to list the files in the deployment package
function listPackageContents(packagePath) {
  return new Promise((resolve, reject) => {
    exec(`unzip -l "${packagePath}"`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error listing package contents: ${error.message}`);
        return;
      }
      resolve(stdout);
    });
  });
}

// Main function
async function main() {
  try {
    // Check if we have the frontend files already extracted in the frontend_extract directory
    if (fs.existsSync(path.join(__dirname, 'frontend_extract'))) {
      console.log('Frontend files already extracted. Creating a package from these files...');
      
      // Create a symbolic link or copy files to dist for packaging
      if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
      }
      
      // Copy files from frontend_extract to dist
      const frontendFiles = fs.readdirSync(path.join(__dirname, 'frontend_extract'));
      frontendFiles.forEach(file => {
        const sourcePath = path.join(__dirname, 'frontend_extract', file);
        const destPath = path.join(__dirname, 'dist', file);
        
        if (fs.statSync(sourcePath).isDirectory()) {
          // For directories, we need to copy recursively
          fs.cpSync(sourcePath, destPath, { recursive: true });
        } else {
          // For files, simple copy
          fs.copyFileSync(sourcePath, destPath);
        }
      });
      
      // Create deployment package
      const packagePath = await createDeploymentPackage();
      console.log(`Package created: ${packagePath}`);
      
      // List package contents
      const contents = await listPackageContents(packagePath);
      console.log('Package contents:');
      console.log(contents);
      
      // Return download URL
      console.log('Download URL:');
      console.log(`http://localhost:3000/client_deployment.zip`);
    } else {
      console.log('Frontend files not found in frontend_extract directory.');
      console.log('Please extract the frontend files from the deployment package first.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Routes for API
app.get('/api/package-info', (req, res) => {
  try {
    const packagePath = path.join(__dirname, 'public', 'client_deployment.zip');
    const stats = fs.statSync(packagePath);
    
    res.json({
      name: 'client_deployment.zip',
      size: stats.size,
      created: stats.birthtime,
      path: '/client_deployment.zip'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start express server
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`File Transfer Utility available at: http://localhost:${PORT}`);
  console.log(`Download client files from: http://localhost:${PORT}/client_deployment.zip`);
});

// If this script is run directly, execute the main function
if (require.main === module) {
  main();
}