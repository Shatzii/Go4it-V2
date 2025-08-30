#!/usr/bin/env node

// Fallback build script that skips type checking for deployment
const { spawn } = require('child_process');

// Set environment variables
process.env.SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING = '1';
process.env.SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING = '1';
process.env.NODE_ENV = 'production';

console.log('🚀 Starting fallback build (TypeScript checking disabled)...');

const buildProcess = spawn('npx', ['next', 'build', '--no-lint'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING: '1',
    SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING: '1',
    TSC_COMPILE_ON_ERROR: 'true',
    NEXT_TS_IGNORE_BUILD_ERRORS: 'true'
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
    console.log('✅ Fallback build completed successfully!');
  } else {
    console.log(`❌ Fallback build failed with exit code ${code}`);
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  clearTimeout(timeout);
  console.error('❌ Fallback build error:', error);
  process.exit(1);
});