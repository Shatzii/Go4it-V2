#!/usr/bin/env node

// Auto-Deploy Script - Enhanced version with better error handling
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Auto-Deploy Script Starting...');

// Get command from arguments
const command = process.argv[2];

// Set environment variables
process.env.NODE_ENV = command === 'build' ? 'production' : 'development';
process.env.PORT = '5000';
process.env.HOSTNAME = '0.0.0.0';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Function to clean up problematic build files
function cleanBuildArtifacts() {
  const buildDirs = ['.next', 'node_modules/.cache'];
  buildDirs.forEach((dir) => {
    try {
      if (fs.existsSync(dir)) {
        console.log(`🧹 Cleaning ${dir}...`);
        execSync(`rm -rf ${dir}`, { stdio: 'pipe' });
      }
    } catch (error) {
      console.warn(`Warning: Could not clean ${dir}:`, error.message);
    }
  });
}

// Function to install Chrome for Puppeteer
function installChromeForPuppeteer() {
  try {
    console.log('🌐 Installing Chrome for Puppeteer...');
    // Install Chrome dependencies for Puppeteer
    execSync('npx puppeteer browsers install chrome', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'false'
      }
    });
    console.log('✅ Chrome installed successfully for Puppeteer');
  } catch (error) {
    console.warn('⚠️ Warning: Chrome installation for Puppeteer failed:', error.message);
    console.log('📝 Build will continue, but Puppeteer features may not work');
  }
}

if (command === 'build') {
  console.log('🔨 Running build command...');

  // Install Chrome for Puppeteer before build
  installChromeForPuppeteer();

  // Clean previous build artifacts if build fails initially
  let buildAttempt = 1;
  const maxAttempts = 2;

  while (buildAttempt <= maxAttempts) {
    try {
      if (buildAttempt > 1) {
        console.log(
          `🔄 Build attempt ${buildAttempt}/${maxAttempts} - cleaning artifacts first...`,
        );
        cleanBuildArtifacts();
      }

      console.log(`🏗️ Starting Next.js build (attempt ${buildAttempt})...`);

      // Use safe configuration for problematic builds
      if (buildAttempt > 1) {
        console.log('🔄 Using safe build configuration...');
        execSync(
          'cp next.config.safe.js next.config.js.backup && cp next.config.safe.js next.config.js',
          { stdio: 'pipe' },
        );
      }

      execSync('npx next build', {
        stdio: 'inherit',
        env: {
          ...process.env,
          NODE_OPTIONS: '--max-old-space-size=4096',
          NEXT_TELEMETRY_DISABLED: '1',
          PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'false',
          PUPPETEER_EXECUTABLE_PATH: '/usr/bin/google-chrome-stable',
        },
      });

      // Restore original config if we used safe config
      if (buildAttempt > 1) {
        execSync('mv next.config.js.backup next.config.js', { stdio: 'pipe' });
      }

      console.log('✅ Build completed successfully!');
      break;
    } catch (error) {
      console.error(`❌ Build attempt ${buildAttempt} failed:`, error.message);

      if (buildAttempt === maxAttempts) {
        console.error('💥 All build attempts failed. Please check the error logs above.');
        process.exit(1);
      }

      buildAttempt++;
    }
  }
} else if (command === 'start') {
  console.log('🚀 Running start command...');
  try {
    execSync('npx next start -p 5000 --hostname 0.0.0.0', {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=4096',
      },
    });
  } catch (error) {
    console.error('❌ Start failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('Usage: node auto-deploy.js [build|start]');
  process.exit(1);
}
