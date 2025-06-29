// Wrapper module to handle the cartographer import issue
import * as viteConfig from './vite.config.js';

// Monkey patch the cartographer module
import cartographerProxy from './node_modules/@replit/vite-plugin-cartographer/dist/proxy.js';
globalThis.cartographerModule = cartographerProxy;

export default viteConfig.default;
