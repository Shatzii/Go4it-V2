// Fix for @replit/vite-plugin-cartographer
const fs = require('fs');
const path = require('path');

// Path to the node_modules directory
const nodeModulesPath = path.join(__dirname, 'node_modules');
const cartographerPath = path.join(nodeModulesPath, '@replit', 'vite-plugin-cartographer');

// Check if the directory exists
if (fs.existsSync(cartographerPath)) {
  const indexJsPath = path.join(cartographerPath, 'dist', 'index.js');

  if (fs.existsSync(indexJsPath)) {
    let content = fs.readFileSync(indexJsPath, 'utf8');
    
    // Create a proxy module that properly exports the cartographer function with both named and default exports
    const proxyPath = path.join(cartographerPath, 'dist', 'proxy.js');
    const proxyContent = `
// This is a proxy module that properly exports the cartographer function
import { cartographer } from './index.js';
export { cartographer };
export default cartographer;
`;
    
    // Add named export to the original file if needed
    if (!content.includes('exports.cartographer = cartographer')) {
      content = content.replace(
        'function cartographer()',
        'function cartographer()'
      );
      
      // Add an explicit named export
      content += '\nexports.cartographer = cartographer;\n';
      
      fs.writeFileSync(indexJsPath, content);
      console.log('Successfully added named export to cartographer module');
    }
    
    // Create the proxy module
    fs.writeFileSync(proxyPath, proxyContent);
    console.log('Successfully created proxy module for @replit/vite-plugin-cartographer');
    
    // Now modify the vite-config-wrapper.js to use our proxy
    const wrapperPath = path.join(__dirname, 'vite-config-wrapper.js');
    if (fs.existsSync(wrapperPath)) {
      const wrapperContent = `// Wrapper module to handle the cartographer import issue
import * as viteConfig from './vite.config.js';

// Monkey patch the cartographer module
import cartographerProxy from './node_modules/@replit/vite-plugin-cartographer/dist/proxy.js';
globalThis.cartographerModule = cartographerProxy;

export default viteConfig.default;
`;
      fs.writeFileSync(wrapperPath, wrapperContent);
      console.log('Successfully updated vite-config-wrapper.js');
    }
    
  } else {
    console.error('Could not find the index.js file:', indexJsPath);
  }
} else {
  console.error('@replit/vite-plugin-cartographer is not installed');
}