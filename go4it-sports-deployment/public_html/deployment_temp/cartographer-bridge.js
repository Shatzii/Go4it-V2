
// This bridge creates a dummy cartographer function to avoid import issues

/**
 * Creates a dummy cartographer plugin that satisfies the Vite plugin requirements
 */
export function cartographer() {
  return {
    name: 'cartographer-dummy',
    apply: 'serve',
    enforce: 'pre',
    configResolved() {
      // Empty implementation
    }
  };
}

export default cartographer;
