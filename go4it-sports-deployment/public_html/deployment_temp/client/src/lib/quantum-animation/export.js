#!/usr/bin/env node

/**
 * Quantum Animation Engine Export Script
 * Version 5.0.1 - 256-bit Quantum HDR Pipeline
 * 
 * This script creates a portable package of the Quantum Animation Engine
 * that can be easily installed on other websites.
 * 
 * Usage:
 * 1. Run this script: node export.js
 * 2. Copy the generated quantum-animation-engine folder to your other project
 * 3. Import the components and use them in your application
 */

const fs = require('fs');
const path = require('path');

// Define the export directory
const exportDir = path.join(__dirname, '..', '..', '..', 'quantum-animation-engine');

// Create the export directory if it doesn't exist
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
  console.log(`Created export directory: ${exportDir}`);
}

// Copy all files from the quantum-animation directory to the export directory
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  });
}

// Copy the quantum-animation directory to the export directory
copyDir(__dirname, exportDir);

// Create an installation script
const installScript = `#!/usr/bin/env node

/**
 * Quantum Animation Engine Installation Script
 * Version 5.0.1 - 256-bit Quantum HDR Pipeline
 * 
 * This script installs the Quantum Animation Engine in your project.
 * 
 * Usage:
 * 1. Run this script in your project root: node install.js
 * 2. Follow the on-screen instructions
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default installation paths
const DEFAULT_INSTALL_PATH = './src/lib/quantum-animation';

// Ask for installation path
rl.question(\`Where would you like to install the Quantum Animation Engine? (Default: \${DEFAULT_INSTALL_PATH}): \`, (installPath) => {
  const targetPath = installPath || DEFAULT_INSTALL_PATH;
  
  // Create the target directory if it doesn't exist
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
    console.log(\`Created target directory: \${targetPath}\`);
  }
  
  // Copy all files from the current directory to the target directory
  function copyDir(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    entries.forEach(entry => {
      // Skip the installation script
      if (entry.name === 'install.js') return;
      
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(\`Copied: \${entry.name}\`);
      }
    });
  }
  
  // Copy the files
  copyDir(__dirname, targetPath);
  
  console.log('\\n✅ Quantum Animation Engine installed successfully!\\n');
  console.log('Next steps:');
  console.log('1. Install required dependencies:');
  console.log('   npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs lucide-react');
  console.log('2. Import the components in your application:');
  console.log(\`   import { AdvancedAnimationStudio } from '\${targetPath.replace(/^\\.\\/?/, '')}';\`);
  console.log('3. Add the component to your JSX:');
  console.log('   <AdvancedAnimationStudio />');
  console.log('\\nFor more information, see the README.md and INSTALL.md files in the installation directory.\\n');
  
  rl.close();
});
`;

// Write the installation script to the export directory
fs.writeFileSync(path.join(exportDir, 'install.js'), installScript);
console.log(`Created installation script: ${path.join(exportDir, 'install.js')}`);

// Create a README.md for the export directory
const exportReadme = `# Quantum Animation Engine - Portable Package

This is a portable package of the Quantum Animation Engine, version 5.0.1.

## Installation

Run the installation script in your project root:

\`\`\`bash
node install.js
\`\`\`

Follow the on-screen instructions to complete the installation.

For more detailed installation instructions, see the INSTALL.md file.

## Documentation

After installation, refer to the README.md and INSTALL.md files in the installation directory for usage instructions.

## Requirements

- React 18+
- TypeScript 4.5+
- TailwindCSS 3.0+
- Node.js 16+

## License

MIT License
`;

// Write the export README to the export directory
fs.writeFileSync(path.join(exportDir, 'README.md'), exportReadme);
console.log(`Created export README: ${path.join(exportDir, 'README.md')}`);

console.log('\n✅ Export completed successfully!');
console.log(`The Quantum Animation Engine has been exported to: ${exportDir}`);
console.log('You can now copy this directory to your other projects and run the installation script.');
console.log('For more information, see the README.md file in the export directory.\n');