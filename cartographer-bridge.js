// This bridge creates a dummy cartographer function to avoid import issues
// Instead of trying to import from the problematic module, we create a dummy function

/**
 * Creates a dummy cartographer plugin that satisfies the Vite plugin type requirements
 */
export function cartographer() {
  return {
    name: 'cartographer-dummy',
    apply: 'serve',
    enforce: 'pre', // Typescript in vite.config.ts expects enforce to be 'pre', 'post', or undefined
    configResolved() {
      // Empty implementation
    }
  };
}

export default cartographer;