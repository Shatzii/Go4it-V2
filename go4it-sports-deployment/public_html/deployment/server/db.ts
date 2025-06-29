import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import { log } from "./vite";

// Database connection singleton
let poolInstance: Pool | null = null;
let connectionRetryCount = 0;
const MAX_RETRIES = 5; // Increased max retries for production
const RETRY_DELAY_MS = 2000;

// Health check state
let isHealthy = false;
let lastSuccessfulConnection: Date | null = null;
let failedConnectionAttempts = 0;

/**
 * Creates a database connection pool with enterprise-grade error handling and retry logic
 * Optimized for production environment with high availability requirements
 */
function createPool(): Pool {
  if (!process.env.DATABASE_URL) {
    log("DATABASE_URL is not defined", "db");
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }

  // Read connection pool settings from environment or use defaults
  const maxConnections = parseInt(process.env.PG_MAX_CONNECTIONS || '20', 10);
  const idleTimeout = parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10);
  const connectionTimeout = parseInt(process.env.PG_CONNECTION_TIMEOUT || '5000', 10);
  
  const isProd = process.env.NODE_ENV === 'production';
  
  log(`Initializing database connection pool (${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}): ${process.env.DATABASE_URL.split('@')[1]}`, "db");
  
  // Create pool with production-optimized settings
  const newPool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: maxConnections, 
    idleTimeoutMillis: idleTimeout,
    connectionTimeoutMillis: connectionTimeout,
    allowExitOnIdle: false,
    // Add statement timeout to prevent long-running queries
    statement_timeout: 30000, // 30 seconds
    // Add query timeout to prevent blocking connections
    query_timeout: 20000 // 20 seconds
  });

  // Handle pool errors
  newPool.on('error', (err) => {
    log(`Database pool error: ${err.message}`, "db");
    isHealthy = false;
    failedConnectionAttempts++;
    
    // If we have a connection terminated error, try to recreate the pool
    if ((err.message.includes('Connection terminated') || 
         err.message.includes('Connection timed out') ||
         err.message.includes('Connection refused') ||
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
      
      // Recreate the pool after a delay with exponential backoff
      const delay = RETRY_DELAY_MS * Math.pow(2, connectionRetryCount - 1);
      setTimeout(() => {
        log(`Recreating database pool after error (delay: ${delay}ms)`, "db");
        poolInstance = createPool();
      }, delay);
    }
  });

  // Setup connection monitoring
  newPool.on('connect', (client) => {
    log(`New client connected to database`, "db");
    
    // Reset retry count and update health status on successful connection
    connectionRetryCount = 0;
    isHealthy = true;
    lastSuccessfulConnection = new Date();
    failedConnectionAttempts = 0;
    
    client.on('error', (err) => {
      log(`Client connection error: ${err.message}`, "db");
    });
    
    // Set session parameters for this connection
    if (isProd) {
      // In production, set parameters for optimal performance
      client.query("SET application_name = 'go4it_sports_prod';");
      client.query("SET statement_timeout = '30s';");
    }
  });
  
  // Set up keep-alive mechanism for production
  if (isProd) {
    // Every 5 minutes, ping the database to keep the connection alive
    setInterval(async () => {
      try {
        const client = await newPool.connect();
        try {
          await client.query('SELECT 1');
          isHealthy = true;
          lastSuccessfulConnection = new Date();
        } finally {
          client.release();
        }
      } catch (error) {
        log(`Keep-alive query failed: ${error.message}`, "db");
        isHealthy = false;
        failedConnectionAttempts++;
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

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