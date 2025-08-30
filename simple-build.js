#!/usr/bin/env node

// Simple build script with timeout and better error handling
const { spawn } = require('child_process');

// Set environment variables to suppress Sentry warnings
process.env.SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING = '1';
process.env.SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING = '1';
process.env.NODE_ENV = 'production';

console.log('🚀 Starting optimized Next.js build...');

const buildProcess = spawn('npx', ['next', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING: '1',
    SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING: '1',
  }
});

// Set timeout to prevent infinite hangs
const timeout = setTimeout(() => {
  console.log('⏰ Build timeout reached, terminating process...');
  buildProcess.kill('SIGTERM');
  setTimeout(() => {
    buildProcess.kill('SIGKILL');
  }, 5000);
}, 300000); // 5 minute timeout

buildProcess.on('close', (code) => {
  clearTimeout(timeout);
  if (code === 0) {
    console.log('✅ Build completed successfully!');
  } else {
    console.log(`❌ Build failed with exit code ${code}`);
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  clearTimeout(timeout);
  console.error('❌ Build error:', error);
  process.exit(1);
});