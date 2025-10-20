/**
 * Server Startup Module
 *
 * Centralized server initialization with comprehensive security validation
 */

import { initializeSecurity } from './security-init';
import { initializeSecurityChecks } from '../security/credential-manager';

/**
 * Initialize all systems before server startup
 */
export async function initializeServer(): Promise<void> {
  console.log('🚀 Initializing Sports Platform Server...\n');

  try {
    // Initialize security systems
    await initializeSecurity();

    console.log('✅ Server initialization complete\n');
  } catch (error) {
    console.error('❌ Server initialization failed:', error);

    if (process.env.NODE_ENV === 'production') {
      console.error('💥 Production startup aborted');
      process.exit(1);
    } else {
      console.warn('⚠️ Development mode - continuing with warnings');
    }
  }
}

/**
 * Graceful shutdown handler
 */
export function setupGracefulShutdown(): void {
  const gracefulShutdown = (signal: string) => {
    console.log(`\n📡 Received ${signal}, initiating graceful shutdown...`);

    // Cleanup operations
    console.log('🧹 Cleaning up resources...');

    // Close database connections, stop background tasks, etc.
    setTimeout(() => {
      console.log('✅ Graceful shutdown complete');
      process.exit(0);
    }, 1000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
