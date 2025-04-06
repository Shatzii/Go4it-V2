// This is a simple wrapper to start the application
// It uses CommonJS syntax to avoid ES module issues

console.log('Starting Go4It Sports Platform...');

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a modified vite.config.js file without the problematic import
function createModifiedViteConfig() {
  const configPath = path.resolve('./vite.config.simple.js');
  const content = `
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";
    import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
    import path from "path";
    import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

    // Dummy cartographer function
    function cartographer() {
      return {
        name: 'cartographer-dummy',
        apply: () => {},
        enforce: 'pre',
      };
    }

    export default defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        themePlugin(),
        ...(process.env.NODE_ENV !== "production" &&
        process.env.REPL_ID !== undefined
          ? [cartographer()]
          : []),
      ],
      resolve: {
        alias: {
          "@": path.resolve("./client/src"),
          "@shared": path.resolve("./shared"),
          "@assets": path.resolve("./attached_assets"),
        },
      },
      root: path.resolve("./client"),
      build: {
        outDir: path.resolve("./dist/public"),
        emptyOutDir: true,
      },
    });
  `;

  fs.writeFileSync(configPath, content);
  console.log('Created modified Vite config at vite.config.simple.js');
}

// Set required environment variables
process.env.VITE_CONFIG_PATH = './vite.config.simple.js';
process.env.NODE_ENV = 'development';
process.env.DEBUG = '*';

// Create the modified vite config
createModifiedViteConfig();

// Start the application using tsx but with a specific command line
// that bypasses the problematic vite.config.ts
const command = 'NODE_OPTIONS="--no-warnings" npx tsx --tsconfig ./tsconfig.json --experimental-specifier-resolution=node ./server/index.fixed.ts';

console.log('Running command:', command);

const child = exec(command, {
  env: {
    ...process.env,
    VITE_CONFIG_PATH: './vite.config.simple.js',
    NODE_OPTIONS: '--no-warnings'
  }
});

child.stdout.on('data', (data) => {
  console.log(data.toString().trim());
});

child.stderr.on('data', (data) => {
  console.error(data.toString().trim());
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Process exited with code ${code}`);
  }
});

// Ensure we close the child process when this script ends
process.on('SIGINT', () => {
  child.kill();
  process.exit();
});