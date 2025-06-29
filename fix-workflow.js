#!/usr/bin/env node

// Go4It Sports Workflow Fix
// This script temporarily replaces the Next.js binary to ensure it starts on port 5000

const fs = require('fs');
const path = require('path');

console.log('🔧 Applying workflow fix for Go4It Sports Platform...');

// Path to the Next.js binary
const nextBinPath = path.join(__dirname, 'node_modules', '.bin', 'next');
const nextBinBackupPath = nextBinPath + '.original';

// Create a custom Next.js wrapper that forces port 5000
const customNextScript = `#!/usr/bin/env node

// Custom Next.js wrapper for Go4It Sports Platform
// Forces the dev server to run on port 5000 for Replit workflow compatibility

const originalNext = require('${path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next')}');
const { spawn } = require('child_process');

// Override the arguments to force port 5000 for dev command
const args = process.argv.slice(2);

if (args[0] === 'dev') {
  // Force dev server to run on port 5000 with hostname 0.0.0.0
  const devArgs = ['dev', '-p', '5000', '-H', '0.0.0.0'];
  
  // Set environment variables
  process.env.PORT = '5000';
  process.env.HOSTNAME = '0.0.0.0';
  
  console.log('🚀 Starting Go4It Sports Platform on port 5000...');
  
  // Use npx to run next with our custom arguments
  const child = spawn('npx', ['next', ...devArgs], {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  child.on('error', (error) => {
    console.error('❌ Failed to start Next.js:', error);
    process.exit(1);
  });
  
  child.on('close', (code) => {
    process.exit(code);
  });
} else {
  // For non-dev commands, use original Next.js
  require('${path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next')}');
}
`;

try {
  // Backup original next binary if it exists and hasn't been backed up
  if (fs.existsSync(nextBinPath) && !fs.existsSync(nextBinBackupPath)) {
    fs.copyFileSync(nextBinPath, nextBinBackupPath);
    console.log('✅ Backed up original Next.js binary');
  }
  
  // Write our custom script
  fs.writeFileSync(nextBinPath, customNextScript);
  
  // Make it executable
  fs.chmodSync(nextBinPath, '755');
  
  console.log('✅ Applied workflow fix - Next.js dev will now run on port 5000');
  console.log('🔄 Please restart the workflow to see the changes');
  
} catch (error) {
  console.error('❌ Failed to apply workflow fix:', error);
  
  // Try to restore backup if something went wrong
  if (fs.existsSync(nextBinBackupPath)) {
    try {
      fs.copyFileSync(nextBinBackupPath, nextBinPath);
      console.log('🔄 Restored original Next.js binary');
    } catch (restoreError) {
      console.error('❌ Failed to restore backup:', restoreError);
    }
  }
  
  process.exit(1);
}