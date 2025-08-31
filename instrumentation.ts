// Minimal instrumentation to avoid SSR issues
export async function register() {
  // Only run in browser environment
  if (typeof window !== 'undefined') {
    // Browser-only initialization
    console.log('Client-side instrumentation initialized');
  }
}
