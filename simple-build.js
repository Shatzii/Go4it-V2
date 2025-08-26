#!/usr/bin/env node

// Simple build script that bypasses auto-deploy.js wrapper
const { spawn } = require('child_process');

// Set environment variables to suppress Sentry warnings
process.env.SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING = '1';
process.env.SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING = '1';
process.env.NODE_ENV = 'production';

console.log('🚀 Starting simple Next.js build...');

const buildProcess = spawn('npx', ['next', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING: '1',
    SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING: '1',
  }
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Build completed successfully!');
  } else {
    console.log(`❌ Build failed with exit code ${code}`);
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  console.error('❌ Build error:', error);
  process.exit(1);
});