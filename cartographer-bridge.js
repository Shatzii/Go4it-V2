// This bridge handles the ESM/CommonJS compatibility for @replit/vite-plugin-cartographer
// Import the actual cartographer plugin
import originalCartographer from "@replit/vite-plugin-cartographer";

// Re-export as both named and default export
export const cartographer = originalCartographer;
export default originalCartographer;