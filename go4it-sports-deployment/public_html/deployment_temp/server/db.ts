import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import { log } from "./vite";

// Database connection singleton
let poolInstance: Pool | null = null;
let connectionRetryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

/**
 * Creates a database connection pool with error handling and retry logic
 */
function createPool(): Pool {
  if (!process.env.DATABASE_URL) {
    log("DATABASE_URL is not defined", "db");
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }

  log(`Initializing database connection pool: ${process.env.DATABASE_URL}`, "db");
  
  // Create pool with more resilient settings
  const newPool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 10, // Reduced max connections to prevent overwhelming the database
    idleTimeoutMillis: 60000, // Longer idle timeout (1 minute)
    connectionTimeoutMillis: 10000, // Longer connection timeout (10 seconds)
    allowExitOnIdle: false
  });

  // Handle pool errors
  newPool.on('error', (err) => {
    log(`Database pool error: ${err.message}`, "db");
    
    // If we have a connection terminated error, try to recreate the pool
    if ((err.message.includes('Connection terminated') || 
         err.message.includes('Connection timed out') ||
         err.message.includes('Cannot use a pool after calling end')) && 
        connectionRetryCount < MAX_RETRIES) {
      
      connectionRetryCount++;
      log(`Recoverable database error detected. Attempt ${connectionRetryCount} of ${MAX_RETRIES} to recreate pool in ${RETRY_DELAY_MS}ms`, "db");
      
      // Clean up the old pool
      try {
        newPool.end();
      } catch (endError) {
        log(`Error ending pool: ${endError.message}`, "db");
      }
      
      // Recreate the pool after a delay
      setTimeout(() => {
        log(`Recreating database pool after error`, "db");
        poolInstance = createPool();
      }, RETRY_DELAY_MS);
    }
  });

  // Setup connection monitoring
  newPool.on('connect', (client) => {
    log(`New client connected to database`, "db");
    
    // Reset retry count on successful connection
    connectionRetryCount = 0;
    
    client.on('error', (err) => {
      log(`Client connection error: ${err.message}`, "db");
    });
  });

  return newPool;
}

/**
 * Get the database pool instance
 * This ensures we only create one pool throughout the application
 */
export function getPool(): Pool {
  if (!poolInstance) {
    poolInstance = createPool();
  }
  return poolInstance;
}

// Get the pool instance
export const pool = getPool();

// Export the drizzle ORM instance 
export const db = drizzle(pool, { schema });

/**
 * Helper function to execute a query with retry logic
 * This should be used for critical database operations where retries are important
 */
export async function executeWithRetry<T>(
  dbFunction: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Try to execute the database function
      return await dbFunction();
    } catch (error) {
      lastError = error;
      
      // If this is a connection error and not the last attempt, wait and retry
      if ((error.message.includes('Connection terminated') || 
           error.message.includes('Connection timed out') ||
           error.message.includes('Cannot use a pool after calling end')) && 
          attempt < maxRetries) {
        
        log(`Database operation failed, retrying (${attempt}/${maxRetries}) after ${delay}ms: ${error.message}`, "db");
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Increase delay for next retry (exponential backoff)
        delay *= 2;
      } else {
        // For other errors or last attempt, rethrow
        throw error;
      }
    }
  }
  
  // This should never be reached due to the throw in the loop,
  // but TypeScript needs it for type safety
  throw lastError!;
}

// Single handler for graceful shutdown
function handleShutdown() {
  if (poolInstance) {
    log(`Closing database pool gracefully`, "db");
    poolInstance.end(() => {
      log(`Database pool has ended`, "db");
      poolInstance = null;
    });
  }
}

// Setup graceful shutdown - only register the handlers once
process.once("SIGINT", handleShutdown);
process.once("SIGTERM", handleShutdown);