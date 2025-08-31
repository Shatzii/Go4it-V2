// Minimal client-side instrumentation to prevent errors
export async function register() {
  // Disabled in development
  if (process.env.NODE_ENV === 'development') {
    return;
  }
}
