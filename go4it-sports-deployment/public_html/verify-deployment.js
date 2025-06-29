/**
 * Go4It Sports Deployment Verification
 * 
 * This script checks that all components of a production deployment are working correctly.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { execSync } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Track verification results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0
};

/**
 * Print a section header
 */
function printSection(title) {
  console.log(`\n${colors.cyan}===== ${title} =====${colors.reset}\n`);
}

/**
 * Print a verification result
 */
function printResult(test, passed, message = null) {
  if (passed) {
    console.log(`${colors.green}✅ PASS: ${test}${colors.reset}`);
    results.passed++;
  } else {
    console.log(`${colors.red}❌ FAIL: ${test}${colors.reset}`);
    results.failed++;
    if (message) {
      console.log(`   ${message}`);
    }
  }
}

/**
 * Print a warning
 */
function printWarning(test, message) {
  console.log(`${colors.yellow}⚠️ WARNING: ${test}${colors.reset}`);
  results.warnings++;
  if (message) {
    console.log(`   ${message}`);
  }
}

/**
 * Verify the system environment
 */
async function verifyEnvironment() {
  printSection('Environment Verification');

  // Check Node.js version
  try {
    const nodeVersion = process.version;
    const versionMatch = /v(\d+)\./.exec(nodeVersion);
    const majorVersion = versionMatch ? parseInt(versionMatch[1], 10) : 0;
    
    printResult(
      `Node.js version (${nodeVersion})`,
      majorVersion >= 20,
      majorVersion < 20 ? 'Node.js v20+ is recommended' : null
    );
  } catch (error) {
    printResult('Node.js version check', false, error.message);
  }

  // Check for required environment variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'SESSION_SECRET'
  ];
  
  for (const envVar of requiredEnvVars) {
    const exists = process.env[envVar] !== undefined;
    printResult(
      `${envVar} environment variable`,
      exists,
      !exists ? `${envVar} is not set` : null
    );
  }
  
  // Check for optional environment variables
  const optionalEnvVars = [
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'PORT'
  ];
  
  for (const envVar of optionalEnvVars) {
    const exists = process.env[envVar] !== undefined;
    if (!exists) {
      printWarning(
        `${envVar} environment variable`,
        `${envVar} is not set, which might limit functionality`
      );
    } else {
      printResult(`${envVar} environment variable`, true);
    }
  }
}

/**
 * Verify the filesystem and required files
 */
async function verifyFilesystem() {
  printSection('Filesystem Verification');
  
  // Check for critical files
  const requiredFiles = [
    'package.json',
    'server.js',
    'start-production.js',
    'drizzle.config.ts',
    'server/db.ts',
    'server/routes.ts',
    'server/auth.ts'
  ];
  
  for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(__dirname, file));
    printResult(
      `${file} exists`,
      exists,
      !exists ? `${file} is missing` : null
    );
  }
  
  // Check for required directories
  const requiredDirs = [
    'client',
    'server',
    'shared',
    'uploads'
  ];
  
  for (const dir of requiredDirs) {
    const exists = fs.existsSync(path.join(__dirname, dir)) && 
                   fs.statSync(path.join(__dirname, dir)).isDirectory();
    printResult(
      `${dir}/ directory exists`,
      exists,
      !exists ? `${dir}/ directory is missing` : null
    );
  }
  
  // Check if client is built
  const clientBuildPath = path.join(__dirname, 'client/dist');
  const clientBuildExists = fs.existsSync(clientBuildPath) && 
                           fs.statSync(clientBuildPath).isDirectory();
  
  if (clientBuildExists) {
    printResult('Client build exists', true);
    
    // Check for index.html in client build
    const indexHtmlExists = fs.existsSync(path.join(clientBuildPath, 'index.html'));
    printResult(
      'Client build contains index.html',
      indexHtmlExists,
      !indexHtmlExists ? 'index.html is missing from client build' : null
    );
  } else {
    printWarning(
      'Client build missing',
      'Client build is missing. Run "npm run build" to create it'
    );
  }
}

/**
 * Try to connect to the database
 */
async function verifyDatabaseConnection() {
  printSection('Database Verification');
  
  if (!process.env.DATABASE_URL) {
    printResult('Database connection', false, 'DATABASE_URL is not set');
    return;
  }
  
  try {
    // Import the db module dynamically since it might not be available in all environments
    const { default: pg } = await import('pg');
    const client = new pg.Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    await client.connect();
    printResult('Database connection', true);
    
    // Check if required tables exist
    const { rows } = await client.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `);
    
    const tableNames = rows.map(row => row.tablename);
    
    const requiredTables = [
      'users',
      'sessions'
    ];
    
    for (const table of requiredTables) {
      const exists = tableNames.includes(table);
      printResult(
        `"${table}" table exists`,
        exists,
        !exists ? `"${table}" table is missing` : null
      );
    }
    
    await client.end();
  } catch (error) {
    printResult('Database connection', false, error.message);
  }
}

/**
 * Verify the AI Engine configuration
 */
async function verifyAIEngine() {
  printSection('AI Engine Verification');
  
  try {
    // Check for key environment variables for the AI engine
    if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
      printWarning(
        'AI API keys',
        'Neither OPENAI_API_KEY nor ANTHROPIC_API_KEY are set. AI functionality will be limited'
      );
    } else {
      printResult('AI API keys', true);
    }
    
    // Check if the AI engine config exists
    const aiConfigPath = path.join(__dirname, 'server/engine/config.ts');
    const aiConfigExists = fs.existsSync(aiConfigPath);
    
    printResult(
      'AI Engine configuration',
      aiConfigExists,
      !aiConfigExists ? 'AI Engine configuration file is missing' : null
    );
    
    // Check if the AI engine services exist
    const aiServicesPaths = [
      'server/engine/services/gar-scoring-ai-service.ts',
      'server/engine/services/video-analysis-ai-service.ts',
      'server/engine/services/highlight-generator-ai-service.ts',
      'server/engine/services/transfer-portal-ai-service.ts',
      'server/engine/services/blog-content-service.ts'
    ];
    
    for (const servicePath of aiServicesPaths) {
      const exists = fs.existsSync(path.join(__dirname, servicePath));
      printResult(
        `AI service: ${path.basename(servicePath)}`,
        exists,
        !exists ? `AI service file is missing: ${servicePath}` : null
      );
    }
  } catch (error) {
    printResult('AI Engine verification', false, error.message);
  }
}

/**
 * Summary of verification results
 */
function printSummary() {
  printSection('Verification Summary');
  
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${results.warnings}${colors.reset}`);
  
  if (results.failed === 0 && results.warnings === 0) {
    console.log(`\n${colors.green}All checks passed! The deployment is ready to go.${colors.reset}`);
  } else if (results.failed === 0) {
    console.log(`\n${colors.yellow}Deployment has warnings but no failures. It should work with limited functionality.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}Deployment verification failed with ${results.failed} errors. Fix the issues before proceeding.${colors.reset}`);
  }
}

/**
 * Run all verification checks
 */
async function runVerification() {
  console.log(`\n${colors.magenta}Go4It Sports Deployment Verification${colors.reset}`);
  console.log(`Running verification on: ${new Date().toISOString()}\n`);
  
  try {
    await verifyEnvironment();
    await verifyFilesystem();
    await verifyDatabaseConnection();
    await verifyAIEngine();
    printSummary();
  } catch (error) {
    console.error(`\n${colors.red}Verification process failed: ${error.message}${colors.reset}`);
  }
}

// Run the verification
runVerification();