// This script patches the vite.config.ts import statement for cartographer
import fs from 'fs';
import path from 'path';

const viteConfigPath = path.resolve('./vite.config.ts');
console.log('Patching vite.config.ts...');

try {
  if (fs.existsSync(viteConfigPath)) {
    let content = fs.readFileSync(viteConfigPath, 'utf8');

    // Check if we need to patch
    if (content.includes('import cartographer from "@replit/vite-plugin-cartographer"')) {
      // Replace the direct import with our bridge
      content = content.replace(
        'import cartographer from "@replit/vite-plugin-cartographer";',
        'import { cartographer } from "./cartographer-bridge.js";'
      );

      // Write the patched content to a temporary file that will be used instead
      fs.writeFileSync('./vite.config.patched.ts', content);
      console.log('Successfully patched vite.config.ts to use the cartographer bridge');
    } else {
      console.log('vite.config.ts does not need patching');
    }
  } else {
    console.error('Could not find vite.config.ts');
  }
} catch (error) {
  console.error('Error patching vite.config.ts:', error);
}