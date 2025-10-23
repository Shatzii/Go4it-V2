// Go4it Sports - Automated Production Setup// Go4it Sports - Automated Production Setup

// Node.js cross-platform automation script// Node.js cross-platform automation script



const { execSync, spawn } = require('child_process');const { execSync, spawn } = require('child_process');

const fs = require('fs');const fs = require('fs');

const path = require('path');const path = require('path');

const readline = require('readline');const readline = require('readline');



// Colors for console output// Colors for console output

const colors = {const colors = {

  reset: '\x1b[0m',  reset: '\x1b[0m',

  bright: '\x1b[1m',  bright: '\x1b[1m',

  red: '\x1b[31m',  red: '\x1b[31m',

  green: '\x1b[32m',  green: '\x1b[32m',

  yellow: '\x1b[33m',  yellow: '\x1b[33m',

  blue: '\x1b[34m',  blue: '\x1b[34m',

  magenta: '\x1b[35m',  magenta: '\x1b[35m',

  cyan: '\x1b[36m',  cyan: '\x1b[36m',

};};



function colorize(text, color) {function colorize(text, color) {

  return `${colors[color]}${text}${colors.reset}`;  return ${colors[color]};

}}



function success(msg) { console.log(colorize(`✅ ${msg}`, 'green')); }function success(msg) { console.log(colorize(' ' + msg, 'green')); }

function info(msg) { console.log(colorize(`ℹ️  ${msg}`, 'cyan')); }function info(msg) { console.log(colorize('ℹ  ' + msg, 'cyan')); }

function warning(msg) { console.log(colorize(`⚠️  ${msg}`, 'yellow')); }function warning(msg) { console.log(colorize('  ' + msg, 'yellow')); }

function error(msg) { console.log(colorize(`❌ ${msg}`, 'red')); }function error(msg) { console.log(colorize(' ' + msg, 'red')); }

function step(msg) { console.log(`\n${colorize(`🚀 ${msg}`, 'magenta')}`); }function step(msg) { console.log('\n' + colorize(' ' + msg, 'magenta')); }



const rl = readline.createInterface({const rl = readline.createInterface({

  input: process.stdin,  input: process.stdin,

  output: process.stdout  output: process.stdout

});});



function ask(question) {function ask(question) {

  return new Promise(resolve => rl.question(question, resolve));  return new Promise(resolve => rl.question(question, resolve));

}}



function exec(command, options = {}) {function exec(command, options = {}) {

  try {  try {

    return execSync(command, {     return execSync(command, { 

      encoding: 'utf8',       encoding: 'utf8', 

      stdio: options.silent ? 'pipe' : 'inherit',      stdio: options.silent ? 'pipe' : 'inherit',

      ...options       ...options 

    });    });

  } catch (err) {  } catch (err) {

    if (!options.ignoreErrors) throw err;    if (!options.ignoreErrors) throw err;

    return null;    return null;

  }  }

}}



async function main() {async function main() {

  console.log(colorize(`  console.log(colorize('\n   Go4it Sports - Automated Production Setup v1.0        \n   Cross-platform Node.js automation script              \n\n  ', 'cyan'));

╔══════════════════════════════════════════════════════════╗

║   Go4it Sports - Automated Production Setup v1.0        ║  step('Step 1: Verifying workspace...');

║   Cross-platform Node.js automation script              ║  

╚══════════════════════════════════════════════════════════╝  if (!fs.existsSync('package.json')) {

  `, 'cyan'));    error('package.json not found. Please run this script from the project root.');

    process.exit(1);

  // Step 1: Verify we're in the right directory  }

  step('Step 1: Verifying workspace...');  

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  if (!fs.existsSync('package.json')) {  success('Found project: ' + (packageJson.name || 'Go4it Sports'));

    error('package.json not found. Please run this script from the project root.');

    process.exit(1);  step('Step 2: Installing dependencies...');

  }  

    const cleanInstall = await ask('Remove existing node_modules and reinstall? (y/n): ');

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));  

  success(`Found project: ${packageJson.name || 'Go4it Sports'}`);  if (cleanInstall.toLowerCase() === 'y') {

    info('Cleaning old installations...');

  // Step 2: Clean installation    

  step('Step 2: Installing dependencies...');    ['node_modules', '.next', 'package-lock.json'].forEach(item => {

        if (fs.existsSync(item)) {

  const cleanInstall = await ask('Remove existing node_modules and reinstall? (y/n): ');        info('Removing ' + item + '...');

          fs.rmSync(item, { recursive: true, force: true });

  if (cleanInstall.toLowerCase() === 'y') {      }

    info('Cleaning old installations...');    });

        

    ['node_modules', '.next', 'package-lock.json'].forEach(item => {    info('Installing npm packages (this may take a few minutes)...');

      if (fs.existsSync(item)) {    exec('npm install');

        info(`Removing ${item}...`);    success('Dependencies installed successfully');

        fs.rmSync(item, { recursive: true, force: true });  } else {

      }    info('Skipping clean install');

    });  }

    

    info('Installing npm packages (this may take a few minutes)...');  step('Step 3: Configuring environment variables...');

    exec('npm install');  

    success('Dependencies installed successfully');  if (!fs.existsSync('.env.local')) {

  } else {    info('Creating .env.local...');

    info('Skipping clean install');    

  }    const envContent = '# Go4it Sports - Environment Configuration\nNODE_ENV=development\nNEXT_PUBLIC_APP_URL=http://localhost:3000\n\n# Database\nDATABASE_URL=postgresql://user:password@localhost:5432/go4it\n\n# Authentication\nNEXTAUTH_SECRET=your-secret-here-change-this-to-random-string\nNEXTAUTH_URL=http://localhost:3000\n\n# OpenAI\nOPENAI_API_KEY=sk-your-key-here\n\n# Stripe\nSTRIPE_PUBLISHABLE_KEY=pk_test_your-key-here\nSTRIPE_SECRET_KEY=sk_test_your-key-here\n\n# Email\nSENDGRID_API_KEY=your-sendgrid-key-here\n';

    fs.writeFileSync('.env.local', envContent);

  // Step 3: Environment configuration    success('.env.local created with defaults');

  step('Step 3: Configuring environment variables...');    

      warning('Please edit .env.local with your actual API keys');

  if (!fs.existsSync('.env.local')) {  } else {

    info('Creating .env.local...');    success('.env.local already exists');

      }

    if (fs.existsSync('.env.production.example')) {

      fs.copyFileSync('.env.production.example', '.env.local');  step('Step 4: TypeScript validation...');

      success('.env.local created from template');  

    } else {  info('Checking TypeScript types...');

      // Create basic .env.local  try {

      const envContent = `# Go4it Sports - Environment Configuration    exec('npx tsc --noEmit --skipLibCheck');

NODE_ENV=development    success('TypeScript validation passed');

NEXT_PUBLIC_APP_URL=http://localhost:3000  } catch (err) {

    warning('TypeScript errors found. Review them before deploying.');

# Database  }

DATABASE_URL=postgresql://user:password@localhost:5432/go4it

  console.log(colorize('\n\n             Setup Complete!                          \n\n', 'green'));

# Authentication

NEXTAUTH_SECRET=your-secret-here-change-this-to-random-string  success('Dependencies ready');

NEXTAUTH_URL=http://localhost:3000  success('Environment configured');



# OpenAI  console.log(colorize('\n Next Steps:\n', 'cyan'));

OPENAI_API_KEY=sk-your-key-here  console.log('1. Configure API keys in .env.local');

  console.log('2. Start development: npm run dev');

# Stripe  console.log('3. Visit: http://localhost:3000');

STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here

STRIPE_SECRET_KEY=sk_test_your-key-here  console.log(colorize('\n Your project is ready for development!\n', 'green'));

  

# Email  rl.close();

SENDGRID_API_KEY=your-sendgrid-key-here}

`;

      fs.writeFileSync('.env.local', envContent);main().catch(err => {

      success('.env.local created with defaults');  error('Setup failed: ' + err.message);

    }  process.exit(1);

    });

    warning('Please edit .env.local with your actual API keys');
    const editNow = await ask('Edit .env.local now? (y/n): ');
    
    if (editNow.toLowerCase() === 'y') {
      const editor = process.platform === 'win32' ? 'notepad' : 'nano';
      info(`Opening .env.local in ${editor}...`);
      try {
        exec(`${editor} .env.local`, { stdio: 'inherit' });
      } catch (err) {
        warning('Could not open editor automatically. Please edit .env.local manually.');
      }
    }
  } else {
    success('.env.local already exists');
  }

  // Step 4: Security middleware
  step('Step 4: Deploying security middleware...');
  
  if (fs.existsSync('middleware.production.ts')) {
    const deployMiddleware = await ask('Deploy production middleware? (y/n): ');
    
    if (deployMiddleware.toLowerCase() === 'y') {
      if (fs.existsSync('middleware.ts')) {
        fs.copyFileSync('middleware.ts', 'middleware.ts.backup');
        info('Backed up existing middleware.ts');
      }
      
      fs.copyFileSync('middleware.production.ts', 'middleware.ts');
      success('Production middleware deployed');
      info('Features: Rate limiting, CORS, security headers');
    }
  } else {
    warning('middleware.production.ts not found');
  }

  // Step 5: Check console.log usage
  step('Step 5: Analyzing code quality...');
  
  info('Scanning for console statements...');
  try {
    const result = exec('findstr /s /i /n "console\\." *.ts *.tsx', { 
      silent: true,
      ignoreErrors: true 
    });
    
    if (result) {
      const lines = result.trim().split('\n').filter(l => 
        !l.includes('node_modules') && 
        !l.includes('.next') &&
        !l.includes('dist')
      );
      
      if (lines.length > 0) {
        warning(`Found ${lines.length} console statements`);
        info('Consider replacing with proper logging: logger.info()');
      } else {
        success('No console statements found');
      }
    }
  } catch (err) {
    info('Skipping console statement scan');
  }

  // Step 6: TypeScript check
  step('Step 6: Running TypeScript validation...');
  
  info('Checking TypeScript types...');
  try {
    exec('npx tsc --noEmit --skipLibCheck');
    success('TypeScript validation passed');
  } catch (err) {
    warning('TypeScript errors found. Review them before deploying.');
    const continueAnyway = await ask('Continue anyway? (y/n): ');
    if (continueAnyway.toLowerCase() !== 'y') {
      error('Setup aborted. Fix TypeScript errors first.');
      process.exit(1);
    }
  }

  // Step 7: Production build test
  step('Step 7: Testing production build...');
  
  const buildTest = await ask('Run production build test? (y/n): ');
  
  if (buildTest.toLowerCase() === 'y') {
    info('Building for production (this may take several minutes)...');
    
    try {
      exec('npm run build');
      success('✨ Production build completed successfully!');
      
      // Test production server
      info('Testing production server...');
      const serverTest = spawn('npm', ['start']);
      
      setTimeout(() => {
        serverTest.kill();
        info('Production server test completed');
      }, 5000);
      
    } catch (err) {
      error('Build failed. Check the errors above.');
      info('Common fixes:');
      info('  1. Fix TypeScript errors: npx tsc --noEmit');
      info('  2. Fix ESLint errors: npm run lint');
      info('  3. Check dependencies: npm install');
    }
  }

  // Step 8: Docker services
  step('Step 8: Docker services setup...');
  
  try {
    exec('docker --version', { silent: true });
    success('Docker is installed');
    
    if (fs.existsSync('docker-compose.automation.yml')) {
      const startDocker = await ask('Start automation services (Redis, Elasticsearch, etc.)? (y/n): ');
      
      if (startDocker.toLowerCase() === 'y') {
        info('Starting Docker services...');
        exec('docker-compose -f docker-compose.automation.yml up -d');
        success('Docker services started');
        
        info('Services available at:');
        info('  - Redis: localhost:6379');
        info('  - Elasticsearch: localhost:9200');
        info('  - Metabase: localhost:3000');
        info('  - n8n: localhost:5678');
        info('  - MinIO: localhost:9000');
      }
    }
  } catch (err) {
    warning('Docker not available. Install Docker to use automation services.');
  }

  // Step 9: Create helper scripts
  step('Step 9: Creating helper scripts...');
  
  const scripts = {
    'quick-dev.js': `#!/usr/bin/env node
console.log('🚀 Starting Go4it Sports Development Server...');
require('child_process').spawn('npm', ['run', 'dev'], { stdio: 'inherit' });
`,
    'quick-build.js': `#!/usr/bin/env node
console.log('🏗️  Building Go4it Sports for Production...');
require('child_process').spawn('npm', ['run', 'build'], { stdio: 'inherit' });
`,
    'quick-start.js': `#!/usr/bin/env node
console.log('🚀 Starting Go4it Sports Production Server...');
require('child_process').spawn('npm', ['start'], { stdio: 'inherit' });
`
  };
  
  Object.entries(scripts).forEach(([filename, content]) => {
    fs.writeFileSync(filename, content);
    try {
      fs.chmodSync(filename, 0o755);
    } catch (err) {
      // chmod not available on Windows
    }
  });
  
  success('Created helper scripts: quick-dev.js, quick-build.js, quick-start.js');

  // Final summary
  console.log(colorize(`
╔══════════════════════════════════════════════════════════╗
║            🎉 Setup Complete! 🎉                         ║
╚══════════════════════════════════════════════════════════╝
`, 'green'));

  success('Dependencies installed');
  success('Environment configured');
  success('Security middleware ready');
  success('Helper scripts created');

  console.log(colorize('\n📋 Next Steps:\n', 'cyan'));
  console.log('1. Configure API keys in .env.local');
  console.log('2. Start development: npm run dev');
  console.log('3. Visit: http://localhost:3000');
  console.log('4. Build for production: npm run build');
  console.log('5. Start Docker services: npm run docker:up');

  console.log(colorize('\n📚 Documentation:\n', 'cyan'));
  console.log('  - PRODUCTION_CHECKLIST.md');
  console.log('  - PRODUCTION_READINESS.md');
  console.log('  - NEXT_STEPS.md');

  console.log(colorize('\n🚀 Your project is ready for development!\n', 'green'));
  
  rl.close();
}

// Run the automation
main().catch(err => {
  error(`Setup failed: ${err.message}`);
  process.exit(1);
});
