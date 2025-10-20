#!/usr/bin/env node

/**
 * Replit Deployment Optimization Script
 * Optimizes the Go4It Sports Platform for .replit.dev preview and deployment
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Avoid process reference conflicts
const nodeProcess = process;

// Environment configuration for Replit deployment
const REPLIT_ENV = {
  NODE_ENV: nodeProcess.env.NODE_ENV || 'development',
  PORT: nodeProcess.env.PORT || '5000',
  REPLIT_DEV_DOMAIN: nodeProcess.env.REPLIT_DEV_DOMAIN || '',
  DATABASE_URL: nodeProcess.env.DATABASE_URL || '',
};

// Log deployment configuration
console.log('🚀 Go4It Sports Platform - Replit Deployment Optimization');
console.log('='.repeat(60));
console.log('Environment:', REPLIT_ENV.NODE_ENV);
console.log('Port:', REPLIT_ENV.PORT);
console.log('Domain:', REPLIT_ENV.REPLIT_DEV_DOMAIN || 'localhost');
console.log('Database:', REPLIT_ENV.DATABASE_URL ? 'Connected' : 'Not configured');
console.log('='.repeat(60));

function executeCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Executing: ${command} ${args.join(' ')}`);

    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...REPLIT_ENV },
      ...options,
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${command} completed successfully`);
        resolve(code);
      } else {
        console.error(`❌ ${command} failed with code ${code}`);
        reject(new Error(`Command failed: ${command}`));
      }
    });

    process.on('error', (error) => {
      console.error(`❌ Error executing ${command}:`, error.message);
      reject(error);
    });
  });
}

async function optimizeForReplit() {
  try {
    console.log('🔧 Optimizing for Replit deployment...');

    // Ensure essential directories exist
    const dirs = ['public', '.next', 'uploads'];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    }

    // Create optimized environment file for deployment
    const envContent = Object.entries(REPLIT_ENV)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync('.env.replit', envContent);
    console.log('📄 Created .env.replit configuration');

    // Optimize package.json scripts for Replit
    const packagePath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      // Ensure Replit-optimized scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        'dev:replit': 'next dev -p 5000 --hostname 0.0.0.0',
        'build:replit': 'next build',
        'start:replit': 'next start -p 5000 --hostname 0.0.0.0',
        'deploy:replit': 'node replit-deploy.js',
      };

      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log('📝 Updated package.json with Replit scripts');
    }

    console.log('✅ Replit optimization completed');
    return true;
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    return false;
  }
}

async function buildForProduction() {
  try {
    console.log('🏗️  Building for production...');

    // Clean previous builds
    if (fs.existsSync('.next')) {
      console.log('🧹 Cleaning previous build...');
      await executeCommand('rm', ['-rf', '.next']);
    }

    // Build the application
    await executeCommand('npx', ['next', 'build']);

    console.log('✅ Production build completed');
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return false;
  }
}

async function startServer() {
  try {
    console.log('🚀 Starting server...');

    const startCommand =
      REPLIT_ENV.NODE_ENV === 'production'
        ? ['next', 'start', '-p', REPLIT_ENV.PORT, '--hostname', '0.0.0.0']
        : ['next', 'dev', '-p', REPLIT_ENV.PORT, '--hostname', '0.0.0.0'];

    await executeCommand('npx', startCommand);
  } catch (error) {
    console.error('❌ Server start failed:', error.message);
    throw error;
  }
}

async function runHealthCheck() {
  try {
    console.log('🔍 Running health checks...');

    // Check if Next.js config is valid
    if (!fs.existsSync('next.config.js')) {
      throw new Error('next.config.js not found');
    }

    // Check if essential files exist
    const essentialFiles = ['package.json', 'app/page.tsx'];
    for (const file of essentialFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Essential file missing: ${file}`);
      }
    }

    console.log('✅ Health checks passed');
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

// Main deployment function
async function main() {
  const command = process.argv[2] || 'dev';

  try {
    // Always run optimization and health checks
    await optimizeForReplit();

    if (!(await runHealthCheck())) {
      process.exit(1);
    }

    switch (command) {
      case 'build':
        await buildForProduction();
        break;

      case 'start':
        await startServer();
        break;

      case 'dev':
      default:
        console.log('🔄 Starting development server...');
        await executeCommand('npx', [
          'next',
          'dev',
          '-p',
          REPLIT_ENV.PORT,
          '--hostname',
          '0.0.0.0',
        ]);
        break;
    }
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Run the deployment
if (require.main === module) {
  main();
}

module.exports = { optimizeForReplit, buildForProduction, startServer, runHealthCheck };
