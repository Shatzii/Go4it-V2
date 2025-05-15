/**
 * Go4It Sports - Database Connection Manager
 * 
 * This utility provides resilient database connection handling with:
 * - Connection pooling optimizations
 * - Automatic reconnection strategies
 * - Circuit breaker pattern for error handling
 * - Health monitoring
 */

import { Pool, PoolClient } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import { AppError, ErrorTypes } from '../middleware/error-handler';

// Maximum connection attempts before invoking circuit breaker
const MAX_CONNECTION_FAILURES = 3;
// Time in milliseconds to wait between reconnection attempts
const RECONNECTION_DELAY = 1000;
// Circuit breaker timeout in milliseconds (how long to wait before allowing new connection attempts)
const CIRCUIT_BREAKER_TIMEOUT = 30000;

// State of the connection manager
interface ConnectionManagerState {
  failureCount: number;
  lastFailureTime: number | null;
  circuitOpen: boolean;
  lastReconnectAttempt: number | null;
  isConnected: boolean;
  currentConnections: number;
  maxConnections: number;
  totalErrors: number;
  lastErrorMessage: string | null;
}

// Default connection manager state
const initialState: ConnectionManagerState = {
  failureCount: 0,
  lastFailureTime: null,
  circuitOpen: false,
  lastReconnectAttempt: null,
  isConnected: false,
  currentConnections: 0,
  maxConnections: 0,
  totalErrors: 0,
  lastErrorMessage: null
};

/**
 * Database Connection Manager class
 */
class DbConnectionManager {
  private pool: Pool;
  private state: ConnectionManagerState;
  private static instance: DbConnectionManager;
  
  /**
   * Private constructor (use getInstance for singleton)
   */
  private constructor(connectionString?: string) {
    // Initialize connection state
    this.state = { ...initialState };
    
    // Create the connection pool
    this.pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL,
      max: 20, // Maximum number of clients
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection cannot be established
    });
    
    // Set up event handlers
    this.pool.on('connect', (client: PoolClient) => {
      this.handleConnect(client);
    });
    
    this.pool.on('error', (err: Error, client: PoolClient) => {
      this.handleError(err, client);
    });
    
    this.pool.on('acquire', () => {
      this.state.currentConnections++;
      this.state.maxConnections = Math.max(this.state.maxConnections, this.state.currentConnections);
    });
    
    this.pool.on('remove', () => {
      this.state.currentConnections--;
    });
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(connectionString?: string): DbConnectionManager {
    if (!DbConnectionManager.instance) {
      DbConnectionManager.instance = new DbConnectionManager(connectionString);
    }
    return DbConnectionManager.instance;
  }
  
  /**
   * Handle successful connections
   */
  private handleConnect(client: PoolClient): void {
    // Reset failure count on successful connection
    if (this.state.failureCount > 0) {
      console.log(`[DB] Connection successful after ${this.state.failureCount} failures`);
      this.state.failureCount = 0;
    }
    
    this.state.isConnected = true;
    this.state.circuitOpen = false;
    
    // Track client disconnections
    client.on('end', () => {
      console.log('[DB] Client disconnected');
    });
  }
  
  /**
   * Handle connection errors
   */
  private handleError(err: Error, client: PoolClient): void {
    console.error(`[DB] Pool error: ${err.message}`);
    this.state.totalErrors++;
    this.state.lastErrorMessage = err.message;
    
    // Increment failure count
    this.state.failureCount++;
    this.state.lastFailureTime = Date.now();
    
    // Remove the errored client
    client.release(err);
    
    // Check if we need to open the circuit breaker
    if (this.state.failureCount >= MAX_CONNECTION_FAILURES) {
      this.openCircuitBreaker();
    }
  }
  
  /**
   * Open the circuit breaker to prevent further connection attempts
   */
  private openCircuitBreaker(): void {
    if (!this.state.circuitOpen) {
      console.warn(`[DB] Circuit breaker activated after ${this.state.failureCount} failures`);
      this.state.circuitOpen = true;
      
      // Schedule circuit reset
      setTimeout(() => {
        console.log('[DB] Circuit breaker timeout elapsed, allowing new connection attempts');
        this.state.circuitOpen = false;
      }, CIRCUIT_BREAKER_TIMEOUT);
    }
  }
  
  /**
   * Get a client from the pool with circuit breaker protection
   */
  public async getClient(): Promise<PoolClient> {
    // Check circuit breaker
    if (this.state.circuitOpen) {
      // Check if enough time has passed since the last failure
      const now = Date.now();
      if (!this.state.lastFailureTime || (now - this.state.lastFailureTime) < CIRCUIT_BREAKER_TIMEOUT) {
        throw new AppError(
          'Database connection temporarily unavailable. Please try again shortly.',
          ErrorTypes.DATABASE,
          503
        );
      }
      
      // If enough time has passed, reset the circuit breaker
      this.state.circuitOpen = false;
      this.state.failureCount = 0;
    }
    
    try {
      // Get a client from the pool
      const client = await this.pool.connect();
      console.log('[DB] New client connected to database (active:', this.state.currentConnections, ')');
      return client;
    } catch (error) {
      // Increment failure count
      this.state.failureCount++;
      this.state.lastFailureTime = Date.now();
      this.state.totalErrors++;
      this.state.lastErrorMessage = error.message;
      
      console.error(`[DB] Error getting client: ${error.message}`);
      
      // Check if we need to open the circuit breaker
      if (this.state.failureCount >= MAX_CONNECTION_FAILURES) {
        this.openCircuitBreaker();
      }
      
      throw new AppError(
        'Unable to connect to the database. Please try again later.',
        ErrorTypes.DATABASE,
        503,
        { originalError: error.message }
      );
    }
  }
  
  /**
   * Execute a database query with automatic retries
   */
  public async executeQuery<T>(
    queryFn: (client: PoolClient) => Promise<T>, 
    maxRetries: number = 2
  ): Promise<T> {
    // Don't attempt if circuit is open
    if (this.state.circuitOpen) {
      throw new AppError(
        'Database service temporarily unavailable. Please try again shortly.',
        ErrorTypes.DATABASE,
        503
      );
    }
    
    let lastError: Error | null = null;
    let retryCount = 0;
    
    while (retryCount <= maxRetries) {
      let client: PoolClient | null = null;
      
      try {
        client = await this.getClient();
        const result = await queryFn(client);
        
        // If we succeeded after retries, log it
        if (retryCount > 0) {
          console.log(`[DB] Query succeeded after ${retryCount} retries`);
        }
        
        return result;
      } catch (error) {
        lastError = error;
        this.state.totalErrors++;
        this.state.lastErrorMessage = error.message;
        
        // Check if this is a connection error that should be retried
        const isConnectionError = error.message.includes('timeout') || 
                                error.message.includes('connection') ||
                                error.message.includes('network');
        
        if (isConnectionError && retryCount < maxRetries) {
          retryCount++;
          console.log(`[DB] Connection error, retrying (${retryCount}/${maxRetries}): ${error.message}`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RECONNECTION_DELAY * retryCount));
        } else {
          // Not a retriable error or max retries reached
          break;
        }
      } finally {
        // Always release the client back to the pool
        if (client) {
          client.release();
        }
      }
    }
    
    // If we got here, all retries failed
    throw lastError || new AppError(
      'Database query failed after multiple attempts.',
      ErrorTypes.DATABASE,
      503
    );
  }
  
  /**
   * Get a Drizzle ORM instance connected to the pool
   */
  public getDrizzle() {
    return drizzle(this.pool, { schema });
  }
  
  /**
   * Get the raw connection pool
   */
  public getPool(): Pool {
    return this.pool;
  }
  
  /**
   * Get the current state of the connection manager
   */
  public getState(): ConnectionManagerState {
    return { ...this.state };
  }
  
  /**
   * Close the connection pool
   */
  public async close(): Promise<void> {
    try {
      await this.pool.end();
      console.log('[DB] Connection pool closed');
    } catch (error) {
      console.error(`[DB] Error closing pool: ${error.message}`);
      throw error;
    }
  }
}

// Export the singleton instance
export const dbConnectionManager = DbConnectionManager.getInstance();

// Export a Drizzle ORM instance connected to the pool
export const db = dbConnectionManager.getDrizzle();

// Export the raw pool for direct queries if needed
export const pool = dbConnectionManager.getPool();

// Helper function to simplify working with the connection manager
export async function withDbClient<T>(queryFn: (client: PoolClient) => Promise<T>): Promise<T> {
  return dbConnectionManager.executeQuery(queryFn);
}