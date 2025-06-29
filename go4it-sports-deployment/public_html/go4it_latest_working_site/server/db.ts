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
let totalActiveConnections = 0;
let peakConnections = 0;
let connectionStats = {
  created: 0,
  acquired: 0,
  released: 0,
  destroyed: 0
};

/**
 * Creates a database connection pool with enterprise-grade error handling and retry logic
 * Optimized for Hetzner VPS environment (4 vCPU/16GB RAM)
 */
function createPool(): Pool {
  if (!process.env.DATABASE_URL) {
    log("DATABASE_URL is not defined", "db");
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }

  // Read connection pool settings from environment or use defaults
  // Optimized defaults for Hetzner VPS (4 vCPU/16GB RAM)
  const isProd = process.env.NODE_ENV === 'production';
  
  // Conservative pool size for production to avoid overwhelming the VPS
  // Formula: (num_cpu_cores * 2) + effective_spindle_count
  // For a 4 vCPU server with SSD, we use 4*2+2 = 10 as default
  const defaultMaxConnections = isProd ? 10 : 20;
  
  const maxConnections = parseInt(process.env.PG_MAX_CONNECTIONS || String(defaultMaxConnections), 10);
  const minConnections = parseInt(process.env.PG_MIN_CONNECTIONS || '2', 10);
  const idleTimeout = parseInt(process.env.PG_IDLE_TIMEOUT || (isProd ? '60000' : '30000'), 10);
  const connectionTimeout = parseInt(process.env.PG_CONNECTION_TIMEOUT || '5000', 10);
  const statementTimeout = parseInt(process.env.PG_STATEMENT_TIMEOUT || '30000', 10);
  const queryTimeout = parseInt(process.env.PG_QUERY_TIMEOUT || '20000', 10);
  
  log(`Initializing database connection pool (${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}): ${process.env.DATABASE_URL.split('@')[1]}`, "db");
  log(`Pool config: max=${maxConnections}, min=${minConnections}, idleTimeout=${idleTimeout}ms`, "db");
  
  // Create pool with production-optimized settings
  const newPool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: maxConnections,
    min: minConnections,
    idleTimeoutMillis: idleTimeout,
    connectionTimeoutMillis: connectionTimeout,
    allowExitOnIdle: false,
    statement_timeout: statementTimeout,
    query_timeout: queryTimeout
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
         err.message.includes('Cannot use a pool after calling end') ||
         err.message.includes('Connection terminated unexpectedly')) && 
        connectionRetryCount < MAX_RETRIES) {
      
      connectionRetryCount++;
      log(`Recoverable database error detected. Attempt ${connectionRetryCount} of ${MAX_RETRIES} to recreate pool in ${RETRY_DELAY_MS}ms`, "db");
      
      // Clean up the old pool
      try {
        newPool.end();
      } catch (endError: any) {
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
    connectionStats.created++;
    log(`New client connected to database (active: ${++totalActiveConnections})`, "db");
    
    if (totalActiveConnections > peakConnections) {
      peakConnections = totalActiveConnections;
    }
    
    // Reset retry count and update health status on successful connection
    connectionRetryCount = 0;
    isHealthy = true;
    lastSuccessfulConnection = new Date();
    failedConnectionAttempts = 0;
    
    client.on('error', (err) => {
      log(`Client connection error: ${err.message}`, "db");
    });
    
    // Track when a client is removed
    client.on('end', () => {
      connectionStats.destroyed++;
      totalActiveConnections = Math.max(0, totalActiveConnections - 1);
    });
    
    // Set session parameters for this connection
    if (isProd) {
      // In production, set parameters for optimal performance
      client.query("SET application_name = 'go4it_sports_prod';");
      client.query("SET statement_timeout = '30s';");
      // Setting work_mem appropriately for 16GB RAM server
      client.query("SET work_mem = '8MB';");
    }
  });
  
  // Additional detailed monitoring for production
  if (isProd) {
    // Instead of monkey-patching the connect method, use events for monitoring
    // This avoids TypeScript errors and is more reliable
    newPool.on('acquire', () => {
      connectionStats.acquired++;
    });
    
    newPool.on('release', () => {
      connectionStats.released++;
    });
    
    // Every 5 minutes, ping the database to keep the connection alive
    // and log connection stats for monitoring
    setInterval(async () => {
      try {
        const client = await newPool.connect();
        try {
          await client.query('SELECT 1');
          isHealthy = true;
          lastSuccessfulConnection = new Date();
          
          // Log connection stats every 5 minutes in production
          log(`DB Connection Stats: active=${totalActiveConnections}, peak=${peakConnections}, created=${connectionStats.created}, acquired=${connectionStats.acquired}, released=${connectionStats.released}, destroyed=${connectionStats.destroyed}`, "db");
          
          // Reset peak connections counter periodically
          peakConnections = totalActiveConnections;
        } finally {
          client.release();
        }
      } catch (error: any) {
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
    } catch (error: any) {
      // Convert to standard Error type for consistent handling
      lastError = error instanceof Error ? error : new Error(error?.message || String(error));
      
      // If this is a connection error and not the last attempt, wait and retry
      if ((typeof error.message === 'string' &&
           (error.message.includes('Connection terminated') || 
           error.message.includes('Connection timed out') ||
           error.message.includes('Cannot use a pool after calling end') ||
           error.message.includes('Connection terminated unexpectedly') ||
           error.message.includes('database connection not established'))) && 
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

/**
 * Get current database connection health status
 * Used for health check endpoints and monitoring
 */
export function getDatabaseHealth(): {
  isHealthy: boolean;
  lastSuccessfulConnection: Date | null;
  failedConnectionAttempts: number;
  activeConnections: number;
  peakConnections: number;
  connectionStats: typeof connectionStats;
} {
  return {
    isHealthy,
    lastSuccessfulConnection,
    failedConnectionAttempts,
    activeConnections: totalActiveConnections,
    peakConnections,
    connectionStats: { ...connectionStats }
  };
}

/**
 * Gracefully shut down the database pool
 * This ensures all queries are completed before shutting down
 */
export async function shutdownDatabasePool(): Promise<void> {
  if (poolInstance) {
    log(`Closing database pool gracefully`, "db");
    try {
      // Give active connections time to finish (30 seconds max)
      const shutdownTimeout = setTimeout(() => {
        log(`Force closing database pool after timeout`, "db");
        if (poolInstance) poolInstance.end();
      }, 30000);
      
      await poolInstance.end();
      clearTimeout(shutdownTimeout);
      
      log(`Database pool has ended gracefully`, "db");
      poolInstance = null;
    } catch (error) {
      log(`Error during database pool shutdown: ${error.message}`, "db");
      // Force end the pool if graceful shutdown fails
      if (poolInstance) {
        try {
          poolInstance.end();
        } catch (e) {
          // Ignore errors during forced shutdown
        }
        poolInstance = null;
      }
    }
  }
}

// Single handler for graceful shutdown
function handleShutdown() {
  log(`Application shutdown initiated, closing database connections...`, "db");
  shutdownDatabasePool().catch(err => {
    log(`Error during database shutdown: ${err.message}`, "db");
  });
}

// Setup graceful shutdown - only register the handlers once
process.once("SIGINT", handleShutdown);
process.once("SIGTERM", handleShutdown);