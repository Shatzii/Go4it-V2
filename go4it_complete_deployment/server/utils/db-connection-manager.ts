/**
 * Go4It Sports - Database Connection Manager
 * 
 * This utility manages connections to the PostgreSQL database:
 * - Connection pooling with health checks
 * - Connection timeouts and retries
 * - Automatic reconnection
 * - Query logging for debugging
 * - Metrics for monitoring
 */

import { Pool, PoolClient } from 'pg';
import { AppError, ErrorTypes, logError } from '../middleware/error-handler';
import { EventEmitter } from 'events';

// Connection stats tracking
interface ConnectionStats {
  totalQueries: number;
  activeConnections: number;
  maxConnections: number;
  errors: number;
  lastError: Error | null;
  lastErrorTime: Date | null;
  slowQueries: number;
  avgQueryTime: number;
  totalQueryTime: number;
  queriesPerSecond: number[];
  queriesPerEndpoint: Record<string, number>;
}

// Configuration options
interface ConnectionManagerConfig {
  connectionString?: string;
  maxConnections?: number;
  idleTimeout?: number;
  connectionTimeout?: number;
  acquireTimeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  logQueries?: boolean;
  logSlowQueries?: boolean;
  slowQueryThreshold?: number;
  poolIdleCheckInterval?: number;
  metricsInterval?: number;
}

// Default configuration
const DEFAULT_CONFIG: ConnectionManagerConfig = {
  connectionString: process.env.DATABASE_URL,
  maxConnections: 20,
  idleTimeout: 10000,
  connectionTimeout: 30000,
  acquireTimeout: 60000,
  maxRetries: 3,
  retryDelay: 1000,
  logQueries: process.env.NODE_ENV === 'development',
  logSlowQueries: true,
  slowQueryThreshold: 1000, // 1 second
  poolIdleCheckInterval: 30000, // 30 seconds
  metricsInterval: 60000, // 1 minute
};

/**
 * Database Connection Manager
 * 
 * Handles database connections, pooling, retries, and monitoring
 */
export class ConnectionManager extends EventEmitter {
  private pool: Pool;
  private config: ConnectionManagerConfig;
  private active: boolean = false;
  private metricsTimer: NodeJS.Timeout | null = null;
  private idleCheckTimer: NodeJS.Timeout | null = null;
  private queryTimeTracking: Map<string, number> = new Map();
  private lastMetricsTimestamp: number = Date.now();
  private queryCounter: number = 0;
  private stats: ConnectionStats = {
    totalQueries: 0,
    activeConnections: 0,
    maxConnections: 0,
    errors: 0,
    lastError: null,
    lastErrorTime: null,
    slowQueries: 0,
    avgQueryTime: 0,
    totalQueryTime: 0,
    queriesPerSecond: new Array(60).fill(0),
    queriesPerEndpoint: {},
  };
  
  /**
   * Create a database connection manager
   */
  constructor(config: ConnectionManagerConfig = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Make sure we have a connection string
    if (!this.config.connectionString) {
      throw new Error('No database connection string provided. Check DATABASE_URL environment variable.');
    }
    
    // Configure the connection pool
    this.pool = new Pool({
      connectionString: this.config.connectionString,
      max: this.config.maxConnections,
      idleTimeoutMillis: this.config.idleTimeout,
      connectionTimeoutMillis: this.config.connectionTimeout,
    });
    
    // Set up event listeners
    this.configurePoolEvents();
    
    // Start metrics collection
    this.startMetricsCollection();
    
    // Start idle connection checking
    this.startIdleConnectionChecking();
    
    this.active = true;
    console.log('[db] Database connection manager initialized');
  }
  
  /**
   * Configure the event listeners for the pool
   */
  private configurePoolEvents(): void {
    // When a new client is created
    this.pool.on('connect', (client) => {
      this.stats.activeConnections++;
      this.stats.maxConnections = Math.max(this.stats.maxConnections, this.stats.activeConnections);
      console.log(`[db] New client connected to database (active: ${this.stats.activeConnections})`);
    });
    
    // When a client is closed
    this.pool.on('remove', (client) => {
      this.stats.activeConnections--;
      console.log(`[db] Client removed from pool (active: ${this.stats.activeConnections})`);
    });
    
    // Handle pool errors
    this.pool.on('error', (err) => {
      this.trackError(err);
      console.error('[db] Pool error:', err.message);
    });
  }
  
  /**
   * Start collecting metrics on query performance
   */
  private startMetricsCollection(): void {
    if (this.config.metricsInterval && this.config.metricsInterval > 0) {
      this.metricsTimer = setInterval(() => {
        this.calculateMetrics();
      }, this.config.metricsInterval);
    }
  }
  
  /**
   * Start checking for idle connections
   */
  private startIdleConnectionChecking(): void {
    if (this.config.poolIdleCheckInterval && this.config.poolIdleCheckInterval > 0) {
      this.idleCheckTimer = setInterval(() => {
        this.checkPoolHealth();
      }, this.config.poolIdleCheckInterval);
    }
  }
  
  /**
   * Track when a query starts for performance monitoring
   */
  private trackQueryStart(id: string): void {
    this.queryTimeTracking.set(id, Date.now());
    this.stats.totalQueries++;
    this.queryCounter++;
  }
  
  /**
   * Track when a query ends for performance monitoring
   */
  private trackQueryEnd(id: string, endpoint: string = 'unknown'): void {
    const startTime = this.queryTimeTracking.get(id);
    
    if (startTime) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Update tracking stats
      this.stats.totalQueryTime += duration;
      this.stats.avgQueryTime = this.stats.totalQueryTime / this.stats.totalQueries;
      
      // Update per-endpoint stats
      if (!this.stats.queriesPerEndpoint[endpoint]) {
        this.stats.queriesPerEndpoint[endpoint] = 0;
      }
      this.stats.queriesPerEndpoint[endpoint]++;
      
      // Check for slow queries
      if (duration > (this.config.slowQueryThreshold || 1000)) {
        this.stats.slowQueries++;
        if (this.config.logSlowQueries) {
          console.warn(`[db] Slow query detected (${duration}ms) for endpoint ${endpoint}`);
        }
      }
      
      // Clean up
      this.queryTimeTracking.delete(id);
    }
  }
  
  /**
   * Track database errors
   */
  private trackError(error: Error): void {
    this.stats.errors++;
    this.stats.lastError = error;
    this.stats.lastErrorTime = new Date();
    
    // Emit error event for external handling
    this.emit('error', error);
  }
  
  /**
   * Calculate performance metrics
   */
  private calculateMetrics(): void {
    const now = Date.now();
    const elapsed = (now - this.lastMetricsTimestamp) / 1000; // in seconds
    
    if (elapsed > 0) {
      // Calculate queries per second
      const qps = this.queryCounter / elapsed;
      
      // Update the queries per second array (rolling 60 seconds)
      this.stats.queriesPerSecond.shift();
      this.stats.queriesPerSecond.push(qps);
      
      // Reset counters
      this.queryCounter = 0;
      this.lastMetricsTimestamp = now;
      
      // Emit metrics event for external monitoring
      this.emit('metrics', {
        timestamp: new Date(),
        ...this.stats
      });
    }
  }
  
  /**
   * Check pool health by pinging the database
   */
  private async checkPoolHealth(): Promise<void> {
    try {
      // Run a simple query to check connection
      await this.query('SELECT 1 AS health_check', [], 'health_check');
      
      // If successful, emit healthy event
      this.emit('healthy');
    } catch (error) {
      console.error('[db] Pool health check failed:', error);
      this.trackError(error instanceof Error ? error : new Error(String(error)));
      
      // If failed, try to recover
      this.attemptRecovery();
      
      // Emit unhealthy event
      this.emit('unhealthy', error);
    }
  }
  
  /**
   * Attempt to recover from connection issues
   */
  private async attemptRecovery(): Promise<void> {
    try {
      console.log('[db] Attempting to recover pool...');
      
      // Drain the pool and create a new one
      await this.pool.end();
      
      // Create a new pool
      this.pool = new Pool({
        connectionString: this.config.connectionString,
        max: this.config.maxConnections,
        idleTimeoutMillis: this.config.idleTimeout,
        connectionTimeoutMillis: this.config.connectionTimeout,
      });
      
      // Reconfigure events
      this.configurePoolEvents();
      
      console.log('[db] Pool recovery successful');
    } catch (error) {
      console.error('[db] Pool recovery failed:', error);
    }
  }
  
  /**
   * Get a client from the pool
   */
  public async getClient(): Promise<PoolClient> {
    if (!this.active) {
      throw new AppError(
        'Database connection manager is not active',
        ErrorTypes.DATABASE,
        500
      );
    }
    
    let retries = 0;
    let lastError: Error | null = null;
    
    // Try to get a client, with retries
    while (retries <= (this.config.maxRetries || 3)) {
      try {
        const client = await this.pool.connect();
        return client;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.trackError(lastError);
        
        // Increment retry counter
        retries++;
        
        // If we have more retries, wait and try again
        if (retries <= (this.config.maxRetries || 3)) {
          console.warn(`[db] Failed to get client, retrying (${retries}/${this.config.maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }
    
    // If we get here, all retries have failed
    throw new AppError(
      'Failed to acquire database connection after maximum retries',
      ErrorTypes.DATABASE,
      503,
      { originalError: lastError?.message }
    );
  }
  
  /**
   * Execute a query with automatic retries
   */
  public async query(text: string, params: any[] = [], endpoint: string = 'unknown') {
    if (!this.active) {
      throw new AppError(
        'Database connection manager is not active',
        ErrorTypes.DATABASE,
        500
      );
    }
    
    const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.trackQueryStart(queryId);
    
    // Log the query if enabled
    if (this.config.logQueries) {
      console.log(`[db] Executing query for ${endpoint}:`, {
        text,
        params: params.length > 0 ? params : undefined
      });
    }
    
    let retries = 0;
    let lastError: Error | null = null;
    
    // Try to execute the query, with retries for certain errors
    while (retries <= (this.config.maxRetries || 3)) {
      try {
        const result = await this.pool.query(text, params);
        this.trackQueryEnd(queryId, endpoint);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.trackError(lastError);
        
        // Check if the error is retriable (connection-related)
        const isRetriable = this.isRetriableError(lastError);
        
        // Increment retry counter
        retries++;
        
        // If the error is retriable and we have more retries, wait and try again
        if (isRetriable && retries <= (this.config.maxRetries || 3)) {
          console.warn(`[db] Query failed, retrying (${retries}/${this.config.maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        } else {
          // Non-retriable error or out of retries
          break;
        }
      }
    }
    
    // If we get here with an error, all retries have failed
    // or we had a non-retriable error
    if (lastError) {
      // Format the error for better debugging
      const queryDetails = {
        text,
        params: params.length > 0 ? params : [],
        endpoint
      };
      
      // Create an app error with details
      throw new AppError(
        'Database query failed',
        ErrorTypes.DATABASE,
        500,
        {
          originalError: lastError.message,
          query: queryDetails,
          retries
        }
      );
    }
    
    // This should never happen (we either return a result or throw an error)
    throw new Error('Unexpected error in database query execution');
  }
  
  /**
   * Determine if an error is retriable
   */
  private isRetriableError(error: Error): boolean {
    // Connection-related errors that can be retried
    const retriableMessages = [
      'connection terminated',
      'connection reset',
      'Connection terminated',
      'Connection reset',
      'timeout',
      'Timeout',
      'Connection timed out',
      'connection timed out',
      'no connection',
      'No connection',
      'too many clients',
      'Too many clients',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT'
    ];
    
    // Check if the error message contains any of the retriable phrases
    return retriableMessages.some(msg => error.message.includes(msg));
  }
  
  /**
   * Execute a transaction with automatic rollback on error
   */
  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      // Attempt to roll back the transaction
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('[db] Error rolling back transaction:', rollbackError);
      }
      
      // Re-throw the original error
      throw error;
    } finally {
      // Always release the client
      client.release();
    }
  }
  
  /**
   * Get database statistics
   */
  public getStats(): ConnectionStats {
    return { ...this.stats };
  }
  
  /**
   * Shut down the connection manager
   */
  public async close(): Promise<void> {
    this.active = false;
    
    // Clear timers
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
      this.metricsTimer = null;
    }
    
    if (this.idleCheckTimer) {
      clearInterval(this.idleCheckTimer);
      this.idleCheckTimer = null;
    }
    
    // Drain the pool
    try {
      await this.pool.end();
      console.log('[db] Database connection pool closed');
    } catch (error) {
      console.error('[db] Error closing database connection pool:', error);
    }
  }
}

// Create a singleton instance of the connection manager
const connectionManager = new ConnectionManager();

export default connectionManager;