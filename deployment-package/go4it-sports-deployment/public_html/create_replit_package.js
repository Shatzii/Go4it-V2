/**
 * Go4It Sports Replit Integration - Package Creator
 * 
 * This script creates a deployable package from your Replit project,
 * excluding unnecessary files and configuring it for direct deployment
 * to the Go4It Sports server.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

// Configuration
const PACKAGE_NAME = 'Go4It_Package.zip';
const EXCLUDED_PATTERNS = [
  '.git*',
  '.replit*',
  'node_modules/*',
  'package-lock.json',
  '.env',
  '*.log',
  'tmp/*',
  '.nix',
  '.config',
  '.cache',
  '.upm',
  '.npm',
  'logs/*',
  'backups/*',
  'clean_build/*',
  'deployment/*',
  'go4it_deployment_*',
  'go4it_essential_deploy/*',
  'go4it_latest_working_site/*',
  'go4it_complete_package/*',
  'star_coder_editor_files/*',
  'attached_assets/*',
  'temp_extract/*',
  'uploads/*',
  'go4it-*.zip'
];

// Server information
const SERVER_URL = '188.245.209.124';
const UPLOAD_PATH = '/var/www/go4itsports/uploads/temp';
const DEPLOY_SCRIPT = '/var/www/go4itsports/deploy.sh';

console.log('===============================================');
console.log('   Go4It Sports Replit Integration Package Creator   ');
console.log('===============================================');
console.log();

// Ensure required directories exist in the package
function ensureDirectories() {
  console.log('Creating essential directories structure...');
  
  const dirs = [
    'client',
    'server',
    'shared',
    'client/src',
    'client/public',
    'server/services',
    'server/routes'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating ${dir} directory...`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  console.log('Directory structure created!\n');
}

// Copy files to clean staging area
function stageFiles() {
  console.log('Staging files for packaging...');
  
  // Clean staging area if it exists
  const stagingDir = path.join(process.cwd(), 'clean_build');
  if (fs.existsSync(stagingDir)) {
    console.log('Cleaning existing staging directory...');
    execSync(`rm -rf ${stagingDir}`);
  }
  
  // Create staging directory
  fs.mkdirSync(stagingDir, { recursive: true });
  
  // Copy all files except excluded patterns
  console.log('Copying files to staging area...');
  const excludeArgs = EXCLUDED_PATTERNS.map(pattern => `--exclude="${pattern}"`).join(' ');
  execSync(`rsync -av --progress ./ ${stagingDir}/ ${excludeArgs}`, { stdio: 'inherit' });
  
  console.log('Files staged successfully!\n');
  return stagingDir;
}

// Create zip package
function createPackage(stagingDir) {
  console.log('Creating deployment package...');
  
  const output = fs.createWriteStream(PACKAGE_NAME);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });
  
  // Listen for warnings and errors
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      console.warn('Warning:', err);
    } else {
      throw err;
    }
  });
  
  archive.on('error', function(err) {
    throw err;
  });
  
  // Pipe archive data to the file
  archive.pipe(output);
  
  // Add all files from staging directory
  archive.directory(stagingDir, false);
  
  // Finalize archive
  archive.finalize();
  
  // Wait for archive to complete
  return new Promise((resolve, reject) => {
    output.on('close', function() {
      console.log(`Package created: ${PACKAGE_NAME}`);
      console.log(`Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB\n`);
      resolve();
    });
    
    output.on('error', function(err) {
      reject(err);
    });
  });
}

// Generate deployment instructions
function generateInstructions() {
  console.log('===============================================');
  console.log('   Deployment Instructions   ');
  console.log('===============================================');
  console.log();
  console.log('Option 1: Direct Upload from Replit');
  console.log('-----------------------------------');
  console.log('1. Click "Run" to create the package');
  console.log('2. Download the package from Replit using Files panel');
  console.log('3. Upload the package to FileBrowser at http://188.245.209.124/filebrowser/');
  console.log('   - Path: /var/www/go4itsports/uploads/temp');
  console.log();
  console.log('Option 2: Automatic Deployment');
  console.log('-----------------------------');
  console.log('1. Open the Go4It Launcher at:');
  console.log(`   http://${SERVER_URL}/G4T_LHR.html`);
  console.log('2. Use the Upload tab to upload your package');
  console.log('3. Use the Deploy tab to deploy your package');
  console.log();
  console.log('Option 3: Manual Deployment');
  console.log('-------------------------');
  console.log('SSH to the server and run:');
  console.log(`bash ${DEPLOY_SCRIPT} ${UPLOAD_PATH}/${PACKAGE_NAME}`);
  console.log();
  console.log('=============================================');
  console.log();
}

// Run deployment steps
async function main() {
  try {
    // Create necessary directories
    ensureDirectories();
    
    // Stage files to clean directory
    const stagingDir = stageFiles();
    
    // Create zip package
    await createPackage(stagingDir);
    
    // Show deployment instructions
    generateInstructions();
    
    console.log('Package creation completed successfully!');
    console.log(`Package is ready for deployment: ${PACKAGE_NAME}`);
    
    return true;
  } catch (error) {
    console.error('Error creating package:', error);
    return false;
  }
}

// Run the script
main().then(success => {
  if (success) {
    console.log('Ready to deploy!');
  } else {
    console.error('Package creation failed.');
    process.exit(1);
  }
});