/**
 * Query Optimization Utilities
 * Best practices for database queries
 */

import { logger } from './logger';

/**
 * Database query result caching wrapper
 * TODO: Integrate with cache module when Redis is configured
 */
export async function cachedQuery<T>(
  _cacheKey: string,
  queryFn: () => Promise<T>,
  _ttlSeconds: number = 300
): Promise<T> {
  // Cache implementation would go here when cache utils are available
  return queryFn();
}

/**
 * Batch query executor to prevent N+1 queries
 */
export class BatchLoader<K, V> {
  private batch: Map<K, Promise<V>> = new Map();
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(
    private loader: (keys: K[]) => Promise<V[]>,
    private delayMs: number = 10
  ) {}

  load(key: K): Promise<V> {
    const existing = this.batch.get(key);
    if (existing) return existing;

    const promise = new Promise<V>((resolve, reject) => {
      this.batch.set(key, promise);

      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => {
          this.executeBatch().then(() => {
            const result = this.batch.get(key);
            if (result) {
              result.then(resolve).catch(reject);
            }
          });
        }, this.delayMs);
      }
    });

    return promise;
  }

  private async executeBatch() {
    const keys = Array.from(this.batch.keys());
    this.batch.clear();
    this.batchTimeout = null;

    try {
      const results = await this.loader(keys);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Query pagination helper
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function paginateQuery<T>(
  query: any,
  countQuery: any,
  params: PaginationParams
): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 20 } = params;
  const offset = (page - 1) * limit;

  const [data, countResult] = await Promise.all([
    query.limit(limit).offset(offset),
    countQuery,
  ]);

  const total = countResult[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Query performance monitoring
 */
export class QueryMonitor {
  private static queries: Map<string, { count: number; totalTime: number; avgTime: number }> = new Map();

  static track(queryName: string, executionTime: number): void {
    const existing = this.queries.get(queryName) || { count: 0, totalTime: 0, avgTime: 0 };
    existing.count++;
    existing.totalTime += executionTime;
    existing.avgTime = existing.totalTime / existing.count;
    this.queries.set(queryName, existing);
  }

  static async measure<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await queryFn();
      const time = Date.now() - start;
      this.track(queryName, time);
      
      // Log slow queries (>1s)
      if (time > 1000) {
        logger.warn(`SLOW QUERY: ${queryName}`, { executionTime: time });
      }
      
      return result;
    } catch (error) {
      const time = Date.now() - start;
      this.track(queryName, time);
      throw error;
    }
  }

  static getStats() {
    return Array.from(this.queries.entries()).map(([name, stats]) => ({
      query: name,
      ...stats,
    }));
  }

  static getSlowestQueries(limit: number = 10) {
    return this.getStats()
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, limit);
  }

  static reset() {
    this.queries.clear();
  }
}

/**
 * Index recommendations based on query patterns
 */
export const RECOMMENDED_INDEXES = {
  users: ['email', 'clerkUserId', 'role', 'createdAt'],
  events: ['projectId', 'createdBy', 'eventDate'],
  tasks: ['projectId', 'assignedTo', 'status', 'dueDate'],
  goals: ['parentGoalId', 'createdBy', 'type'],
  academyCourses: ['isActive', 'gradeLevel'],
  academyEnrollments: ['studentId', 'courseId', 'isActive'],
  recruitingOffers: ['userId', 'schoolId', 'status'],
  recruitingCommunications: ['userId', 'contactId'],
  starpathGARMetrics: ['studentId', 'metricType', 'recordedAt'],
};

/**
 * Query optimization tips
 */
export const OPTIMIZATION_TIPS = {
  'Use SELECT specific columns': 'Avoid SELECT * - specify only needed columns',
  'Add WHERE clause indexes': 'Create indexes on frequently queried columns',
  'Limit result sets': 'Always use LIMIT for large tables',
  'Use joins efficiently': 'Prefer INNER JOIN over multiple queries',
  'Cache frequently accessed data': 'Use cache for rarely changing data',
  'Avoid N+1 queries': 'Use batch loaders or join queries',
  'Use connection pooling': 'Reuse database connections',
  'Monitor slow queries': 'Track queries > 1 second',
};

/**
 * Database connection pool monitoring
 */
export function getConnectionStats() {
  // This would integrate with your DB connection pool
  return {
    total: 10,
    idle: 5,
    active: 5,
    waiting: 0,
  };
}
