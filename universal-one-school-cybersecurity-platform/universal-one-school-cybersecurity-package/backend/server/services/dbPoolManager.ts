import { Pool, PoolClient } from '@neondatabase/serverless';
import { performanceOptimizer } from './performanceOptimizer';

/**
 * Database connection pool manager for optimizing database connections
 * and query performance across the application
 */
class DbPoolManager {
  private pool: Pool;
  private maxConnections: number = 20;
  private activeConnections: number = 0;
  private waitingQueries: Array<{
    resolve: (client: PoolClient) => void;
    reject: (error: Error) => void;
    priority: number;
    timestamp: number;
  }> = [];
  
  // Query statistics for optimization
  private queryStats: Map<string, {
    count: number;
    totalTime: number;
    avgTime: number;
  }> = new Map();
  
  constructor(connectionString: string) {
    this.pool = new Pool({ 
      connectionString,
      max: this.maxConnections
    });
    
    console.log('Database pool manager initialized');
    
    // Start monitoring
    this.startMonitoring();
  }
  
  /**
   * Start monitoring the connection pool
   */
  private startMonitoring(): void {
    // Check pool health every 30 seconds
    setInterval(() => this.checkPoolHealth(), 30000);
    
    // Log statistics every 5 minutes
    setInterval(() => this.logPoolStats(), 5 * 60 * 1000);
  }
  
  /**
   * Check the health of the connection pool
   */
  private async checkPoolHealth(): Promise<void> {
    try {
      // Execute a simple query to verify pool health
      const client = await this.pool.connect();
      try {
        await client.query('SELECT 1');
      } finally {
        client.release();
      }
      
      // Process any waiting queries if possible
      this.processWaitingQueries();
    } catch (error) {
      console.error('Database pool health check failed:', error);
      // Could implement pool reset logic here if needed
    }
  }
  
  /**
   * Log pool statistics
   */
  private logPoolStats(): void {
    // Sort queries by average time
    const sortedQueries = Array.from(this.queryStats.entries())
      .sort((a, b) => b[1].avgTime - a[1].avgTime)
      .slice(0, 10); // Get top 10 slowest queries
      
    console.log('=== Database Pool Statistics ===');
    console.log(`Active connections: ${this.activeConnections}/${this.maxConnections}`);
    console.log(`Waiting queries: ${this.waitingQueries.length}`);
    
    if (sortedQueries.length > 0) {
      console.log('Top slowest queries:');
      sortedQueries.forEach(([query, stats]) => {
        console.log(`- ${query.substring(0, 50)}... (${stats.avgTime.toFixed(2)}ms avg, ${stats.count} executions)`);
      });
    }
  }
  
  /**
   * Get a client from the pool with priority handling
   * Higher priority queries get processed first
   */
  async getClient(priority: number = 1): Promise<PoolClient> {
    if (this.activeConnections < this.maxConnections) {
      this.activeConnections++;
      
      try {
        const client = await this.pool.connect();
        
        // Add wrapper to track when client is released
        const originalRelease = client.release.bind(client);
        client.release = () => {
          this.activeConnections--;
          originalRelease();
          
          // Process any waiting queries
          this.processWaitingQueries();
        };
        
        return client;
      } catch (error) {
        this.activeConnections--;
        throw error;
      }
    } else {
      // No available connections, add to waiting queue
      return new Promise((resolve, reject) => {
        this.waitingQueries.push({
          resolve,
          reject,
          priority,
          timestamp: Date.now()
        });
        
        // Sort waiting queries by priority and then by timestamp
        this.waitingQueries.sort((a, b) => {
          if (a.priority !== b.priority) {
            return b.priority - a.priority; // Higher priority first
          }
          return a.timestamp - b.timestamp; // Older requests first
        });
      });
    }
  }
  
  /**
   * Process waiting queries if connections are available
   */
  private processWaitingQueries(): void {
    // Process as many waiting queries as possible
    while (this.waitingQueries.length > 0 && this.activeConnections < this.maxConnections) {
      const nextQuery = this.waitingQueries.shift();
      if (!nextQuery) continue;
      
      this.getClient()
        .then(client => nextQuery.resolve(client))
        .catch(error => nextQuery.reject(error));
    }
  }
  
  /**
   * Execute a query with performance tracking
   */
  async executeQuery<T>(queryText: string, params: any[] = [], priority: number = 1): Promise<T> {
    // Use cache for read queries when possible
    const isCacheable = queryText.trim().toLowerCase().startsWith('select');
    const cacheKey = isCacheable ? `sql:${queryText}:${JSON.stringify(params)}` : '';
    
    // Track query timing for performance analysis
    const startTime = performance.now();
    let client: PoolClient | null = null;
    
    if (isCacheable) {
      // Try to get from cache first for read queries
      return performanceOptimizer.getCachedData<T>(
        cacheKey,
        async () => {
          try {
            client = await this.getClient(priority);
            const result = await client.query(queryText, params);
            return result.rows as T;
          } finally {
            if (client) client.release();
          }
        },
        priority === 3 ? 60000 : 30000 // Cache time based on priority
      );
    } else {
      // Execute write query directly
      try {
        client = await this.getClient(priority);
        const result = await client.query(queryText, params);
        
        // Invalidate related caches for write operations
        if (queryText.match(/insert|update|delete/i)) {
          // Extract table name from query
          const tableMatch = queryText.match(/\b(from|into|update)\s+([a-z0-9_]+)/i);
          if (tableMatch && tableMatch[2]) {
            const table = tableMatch[2];
            performanceOptimizer.invalidateCachePattern(`sql:select.*from.*${table}`);
          }
        }
        
        return result.rows as T;
      } finally {
        if (client) client.release();
        this.recordQueryStats(queryText, performance.now() - startTime);
      }
    }
  }
  
  /**
   * Record query statistics for performance analysis
   */
  private recordQueryStats(query: string, executionTime: number): void {
    // Normalize query by replacing parameter values with placeholders
    const normalizedQuery = query
      .replace(/\$\d+/g, '$?')
      .replace(/\d+/g, '?')
      .replace(/'\w+'/, '?')
      .trim();
    
    // Update query statistics
    const stats = this.queryStats.get(normalizedQuery) || { count: 0, totalTime: 0, avgTime: 0 };
    stats.count++;
    stats.totalTime += executionTime;
    stats.avgTime = stats.totalTime / stats.count;
    
    this.queryStats.set(normalizedQuery, stats);
  }
  
  /**
   * Execute a batch of queries in a transaction
   */
  async executeTransaction<T>(
    queries: Array<{ text: string, params: any[] }>,
    priority: number = 2
  ): Promise<T[]> {
    const client = await this.getClient(priority);
    try {
      await client.query('BEGIN');
      
      const results: T[] = [];
      for (const { text, params } of queries) {
        const startTime = performance.now();
        const result = await client.query(text, params);
        this.recordQueryStats(text, performance.now() - startTime);
        results.push(result.rows as T);
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Close the pool and all connections
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Create singleton instance
export const dbPoolManager = new DbPoolManager(process.env.DATABASE_URL as string);