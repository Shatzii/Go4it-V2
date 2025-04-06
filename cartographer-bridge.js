// This bridge creates a dummy cartographer function to avoid import issues
// Instead of trying to import from the problematic module, we create a dummy function

export function cartographer() {
  return {
    name: 'cartographer-dummy',
    apply: () => {},
    enforce: 'pre',
  };
}

export default cartographer;