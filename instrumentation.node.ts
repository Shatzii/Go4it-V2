// Disable Sentry instrumentation for middleware to avoid edge runtime eval() issues
export async function register() {
  // Instrumentation disabled for deployment
  console.log('Instrumentation disabled for deployment');
}
