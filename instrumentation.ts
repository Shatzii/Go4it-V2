// Instrumentation file to suppress Sentry warnings
export async function register() {
  // Minimal instrumentation to satisfy Next.js requirements
  if (process.env.NODE_ENV === 'production') {
    console.log('Production instrumentation loaded');
  }
}