/**
 * Go4It Sports Deployment Package Creator
 * 
 * This script creates a deployment-ready package for a fresh server installation.
 * It includes all necessary files while excluding development artifacts.
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

// Configuration
const config = {
  outputDir: './',
  packageName: 'go4it-deployment.zip',
  excludeDirs: [
    'node_modules',
    '.git',
    'uploads',
    'logs',
    'clean_build',
    'complete_export',
    'data',
    'deployment_temp',
    'export',
    'go4it_complete_package',
    'go4it_deployment_20250429_184412',
    'go4it_essential_deploy',
    'go4it_latest_working_site',
    'package',
    'quantum-animation-engine',
    'scripts',
    'site_map_package',
    'star_coder_editor_files',
    'temp_extract',
    'wizard-assets',
    'wizard-package',
    'attached_assets',
  ],
  excludeFiles: [
    '.DS_Store',
    'package-lock.json',
    'go4it-clean-build.zip',
    'go4it-deployment-*.zip',
    'go4it-final-deployment.zip',
    'go4it-final.zip',
  ],
  excludePatterns: [
    /\.zip$/,
    /go4it.*\.zip$/,
    /\.log$/,
    /\.tmp$/,
    /~$/,
  ],
  includeEmptyDirs: [
    'uploads',
    'uploads/videos',
    'logs',
  ],
};

/**
 * Main function to create the deployment package
 */
async function createDeploymentPackage() {
  try {
    console.log('🚀 Creating Go4It Sports deployment package...');
    
    // Create the output path if it doesn't exist
    const outputPath = path.join(config.outputDir, config.packageName);
    console.log(`📦 Package will be created at: ${outputPath}`);
    
    // Create a file to stream archive data to
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    // Listen for all archive data to be written
    output.on('close', () => {
      console.log(`✅ Archive created successfully: ${outputPath}`);
      console.log(`📊 Total bytes: ${archive.pointer()}`);
      console.log('🎉 Deployment package is ready!');
      
      // Print deployment instructions
      printDeploymentInstructions();
    });
    
    // Handle warnings and errors
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn(`⚠️ Warning: ${err.message}`);
      } else {
        throw err;
      }
    });
    
    archive.on('error', (err) => {
      throw err;
    });
    
    // Pipe archive data to the file
    archive.pipe(output);
    
    // Add package.json
    console.log('📄 Adding package.json...');
    archive.file('package.json', { name: 'package.json' });
    
    // Add .env.production as .env
    if (fs.existsSync('.env.production')) {
      console.log('📄 Adding .env.production as .env...');
      archive.file('.env.production', { name: '.env' });
    } else {
      console.warn('⚠️ Warning: .env.production not found, environment variables will need to be set manually');
    }
    
    // Add other critical configuration files
    const configFiles = [
      'drizzle.config.ts',
      '.replit',
      '.replit.deployment',
      'tsconfig.json',
      'vite.config.ts',
    ];
    
    configFiles.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`📄 Adding ${file}...`);
        archive.file(file, { name: file });
      }
    });
    
    // Add client and server directories
    console.log('📁 Adding client directory...');
    archive.directory('client', 'client');
    
    console.log('📁 Adding server directory...');
    archive.directory('server', 'server');
    
    console.log('📁 Adding shared directory...');
    archive.directory('shared', 'shared');
    
    // Add documentation and scripts
    const docFiles = [
      'README.md',
      'DEPLOYMENT.md',
      'DEPLOYMENT_CHECKLIST.md',
      'PRODUCTION_OPTIMIZATIONS.md',
      'DEPLOYMENT_README.md',
      'server.js',
      'server.cjs',
      'start-production.js',
      'verify-deployment.js'
    ];
    
    docFiles.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`📄 Adding ${file}...`);
        archive.file(file, { name: file });
      }
    });
    
    // Create necessary empty directories
    config.includeEmptyDirs.forEach(dir => {
      console.log(`📁 Adding empty directory: ${dir}...`);
      archive.append(null, { name: `${dir}/.gitkeep` });
    });
    
    // Add a deployment timestamp file
    const timestamp = new Date().toISOString();
    archive.append(
      `Go4It Sports Deployment Package\nCreated: ${timestamp}\nVersion: 2.0.0`,
      { name: 'deployment-info.txt' }
    );
    
    // Finalize the archive
    await archive.finalize();
    
  } catch (error) {
    console.error('❌ Error creating deployment package:', error);
    process.exit(1);
  }
}

/**
 * Determine if a file should be included in the package
 */
function shouldInclude(filePath) {
  const relativePath = filePath.replace(/\\/g, '/');
  
  // Check against exclude directories
  for (const dir of config.excludeDirs) {
    if (relativePath.startsWith(dir + '/') || relativePath === dir) {
      return false;
    }
  }
  
  // Check against exclude files
  if (config.excludeFiles.includes(path.basename(relativePath))) {
    return false;
  }
  
  // Check against exclude patterns
  for (const pattern of config.excludePatterns) {
    if (pattern.test(relativePath)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Print deployment instructions
 */
function printDeploymentInstructions() {
  console.log('\n📋 Deployment Instructions:');
  console.log('1. Upload the deployment package to your server');
  console.log('2. Extract the package: unzip go4it-deployment.zip');
  console.log('3. Install dependencies: npm install');
  console.log('4. Set up the database: npm run db:push');
  console.log('5. Verify deployment: node verify-deployment.js');
  console.log('6. Start the application: node start-production.js');
  console.log('\nMake sure you have:\n- Node.js v20+\n- PostgreSQL database\n- Properly configured .env file');
}

// Run the script
createDeploymentPackage();