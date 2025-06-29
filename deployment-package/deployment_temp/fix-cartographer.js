// Fix for @replit/vite-plugin-cartographer
const fs = require('fs');
const path = require('path');

// Path to the node_modules directory
const nodeModulesPath = path.join(__dirname, 'node_modules');
const cartographerPath = path.join(nodeModulesPath, '@replit', 'vite-plugin-cartographer');

// Check if the directory exists
if (fs.existsSync(cartographerPath)) {
  const indexPath = path.join(cartographerPath, 'dist', 'index.cjs');

  if (fs.existsSync(indexPath)) {
    // Read the content of the file
    let content = fs.readFileSync(indexPath, 'utf8');

    // Check if the file needs to be modified
    if (!content.includes('module.exports.default = ')) {
      // Add default export
      content = content.replace(
        'module.exports = {',
        'module.exports = {\n  default: cartographer,'
      );

      // Write the modified content back to the file
      fs.writeFileSync(indexPath, content);
      console.log('Successfully patched @replit/vite-plugin-cartographer');
    } else {
      console.log('The file has already been patched.');
    }
  } else {
    console.error('Could not find the index.cjs file:', indexPath);
  }
} else {
  console.error('@replit/vite-plugin-cartographer is not installed');
}