#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Go4It Sports Setup Script
 * This script helps initialize the Go4It Sports platform for development
 */

console.log('Go4It Sports Platform Setup');
console.log('============================');
console.log('');

// Check if .env file exists, if not create it from template
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  try {
    fs.copyFileSync(
      path.join(__dirname, '.env.template'),
      path.join(__dirname, '.env')
    );
    console.log('✅ Created .env file from template');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }
} else {
  console.log('✅ .env file already exists');
}

// Check for Node.js version
const nodeVersion = process.version;
console.log(`ℹ️ Using Node.js version: ${nodeVersion}`);
const versionNumber = nodeVersion.replace('v', '').split('.')[0];

if (parseInt(versionNumber) < 18) {
  console.log('⚠️ Recommended Node.js version is 18 or higher');
}

// Check for PostgreSQL
console.log('');
console.log('Checking PostgreSQL connection...');

rl.question('Do you have PostgreSQL installed and running? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes') {
    console.log('');
    console.log('Installing dependencies...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependencies installed successfully');
      
      // Ask if user wants to run database migrations
      rl.question('Do you want to run database migrations? (yes/no): ', (migrateAnswer) => {
        if (migrateAnswer.toLowerCase() === 'yes') {
          try {
            console.log('Running database migrations...');
            execSync('npm run db:push', { stdio: 'inherit' });
            console.log('✅ Database migrations completed');
          } catch (error) {
            console.error('❌ Failed to run migrations:', error.message);
            console.log('Please check your database connection settings in .env file');
          }
        }
        
        console.log('');
        console.log('Setup Complete!');
        console.log('To start the development server, run: npm run dev');
        rl.close();
      });
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error.message);
      rl.close();
    }
  } else {
    console.log('');
    console.log('⚠️ PostgreSQL is required for this application.');
    console.log('Please install PostgreSQL and create a database before continuing.');
    console.log('');
    console.log('For more information, see: https://www.postgresql.org/download/');
    rl.close();
  }
});