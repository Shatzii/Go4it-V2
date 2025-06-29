#!/usr/bin/env node

/**
 * Go4It Sports Platform - GitHub Repository Package Creator
 * 
 * Creates a clean, downloadable package ready for GitHub upload
 */

const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');

async function createGitHubPackage() {
  console.log('🚀 Creating Go4It Sports GitHub Package...');
  
  const packageName = 'go4it-sports-github-package';
  const packageDir = path.join(process.cwd(), packageName);
  
  try {
    // Clean up existing package
    await fs.rmdir(packageDir, { recursive: true }).catch(() => {});
    await fs.mkdir(packageDir, { recursive: true });
    
    console.log('📁 Setting up package structure...');
    
    // Core application files
    const filesToCopy = [
      // Main application
      'app',
      'components', 
      'lib',
      'server',
      'shared',
      'public',
      
      // Configuration
      'package.json',
      'next.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'drizzle.config.ts',
      'tsconfig.json',
      
      // Environment and setup
      '.env.example',
      'server.js',
      'start-server.js',
      
      // GitHub repository files
      'README.md',
      'CONTRIBUTING.md',
      'GITHUB_SETUP.md',
      '.gitignore',
      'LICENSE',
      
      // Documentation
      'replit.md',
      'DEPLOYMENT.md',
      'PERMANENT_SOLUTIONS_SUMMARY.md'
    ];
    
    // Copy files and directories
    for (const item of filesToCopy) {
      const sourcePath = path.join(process.cwd(), item);
      const destPath = path.join(packageDir, item);
      
      try {
        const stat = await fs.stat(sourcePath);
        
        if (stat.isDirectory()) {
          await copyDirectory(sourcePath, destPath);
          console.log(`📂 Copied directory: ${item}`);
        } else {
          await fs.copyFile(sourcePath, destPath);
          console.log(`📄 Copied file: ${item}`);
        }
      } catch (err) {
        console.log(`⚠️  Skipped missing: ${item}`);
      }
    }
    
    // Create uploads directory structure
    const uploadsDir = path.join(packageDir, 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, '.gitkeep'), '# Keep this directory\n');
    
    // Create deployment instructions
    await createDeploymentInstructions(packageDir);
    
    // Create ZIP package
    console.log('📦 Creating ZIP package...');
    const zipPath = path.join(process.cwd(), `${packageName}.zip`);
    await createZipArchive(packageDir, zipPath);
    
    console.log('✅ Package created successfully!');
    console.log(`📁 Package location: ${packageDir}`);
    console.log(`📦 ZIP file: ${zipPath}`);
    console.log('');
    console.log('🎯 Ready for GitHub upload!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Download the ZIP file');
    console.log('2. Extract on your local machine');
    console.log('3. Follow GITHUB_SETUP.md instructions');
    console.log('4. Push to your GitHub repository');
    
  } catch (error) {
    console.error('❌ Error creating package:', error);
  }
}

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  
  const items = await fs.readdir(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    
    const stat = await fs.stat(sourcePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (['node_modules', '.next', 'dist', 'build', '.git'].includes(item)) {
        continue;
      }
      await copyDirectory(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

async function createZipArchive(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = require('fs').createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
      console.log(`📦 ZIP created: ${archive.pointer()} bytes`);
      resolve();
    });
    
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function createDeploymentInstructions(packageDir) {
  const instructions = `# Go4It Sports Platform - Local Setup

## Quick Start

1. **Install Node.js 18+** from nodejs.org
2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Setup database:**
   - Install PostgreSQL
   - Create database: \`createdb go4it_sports\`
   - Update DATABASE_URL in .env.local

4. **Configure environment:**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your settings
   \`\`\`

5. **Initialize database:**
   \`\`\`bash
   npm run db:push
   \`\`\`

6. **Start application:**
   \`\`\`bash
   node server.js
   \`\`\`

Visit http://localhost:5000

## GitHub Repository Setup

Follow the complete instructions in GITHUB_SETUP.md

## Support

- Documentation: Check README.md
- Issues: Create GitHub issues for bugs
- Discussions: Use GitHub discussions for questions

Happy coding! 🚀
`;

  await fs.writeFile(path.join(packageDir, 'QUICK_START.md'), instructions);
}

// Run the package creator
if (require.main === module) {
  createGitHubPackage().catch(console.error);
}

module.exports = { createGitHubPackage };