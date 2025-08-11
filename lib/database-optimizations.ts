// Database optimization utilities and indexing strategies

export interface QueryOptimization {
  query: string;
  description: string;
  performance: 'high' | 'medium' | 'low';
}

// Performance monitoring for database queries
export class DatabasePerformanceMonitor {
  private static queryTimes = new Map<string, number[]>();
  
  static startQuery(queryId: string) {
    return {
      end: () => {
        const endTime = performance.now();
        return endTime;
      }
    };
  }
  
  static recordQuery(queryId: string, duration: number) {
    if (!this.queryTimes.has(queryId)) {
      this.queryTimes.set(queryId, []);
    }
    
    const times = this.queryTimes.get(queryId)!;
    times.push(duration);
    
    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift();
    }
  }
  
  static getAverageQueryTime(queryId: string): number {
    const times = this.queryTimes.get(queryId) || [];
    if (times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
  
  static getSlowQueries(threshold: number = 1000): Array<{ queryId: string, avgTime: number }> {
    const slowQueries: Array<{ queryId: string, avgTime: number }> = [];
    
    for (const [queryId, times] of this.queryTimes) {
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      if (avgTime > threshold) {
        slowQueries.push({ queryId, avgTime });
      }
    }
    
    return slowQueries.sort((a, b) => b.avgTime - a.avgTime);
  }
}

// Recommended database indexes for better performance
export const recommendedIndexes: QueryOptimization[] = [
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);',
    description: 'Optimize user login queries by email',
    performance: 'high'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_username ON users(username);',
    description: 'Optimize user lookup by username',
    performance: 'high'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_sport_graduation ON users(sport, graduation_year);',
    description: 'Optimize athlete filtering by sport and graduation year',
    performance: 'high'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_gar_score ON users(gar_score) WHERE gar_score IS NOT NULL;',
    description: 'Optimize GAR score rankings and comparisons',
    performance: 'high'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_video_analysis_user_created ON video_analysis(user_id, created_at);',
    description: 'Optimize video history queries for users',
    performance: 'high'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_video_analysis_sport ON video_analysis(sport);',
    description: 'Optimize video analysis filtering by sport',
    performance: 'medium'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_videos_user_sport ON videos(user_id, sport);',
    description: 'Optimize video queries by user and sport',
    performance: 'high'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_starpath_progress_user ON starpath_progress(user_id);',
    description: 'Optimize StarPath progress queries',
    performance: 'high'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_camp_registrations_user ON camp_registrations(user_id) WHERE user_id IS NOT NULL;',
    description: 'Optimize camp registration lookups',
    performance: 'medium'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_camp_registrations_camp_status ON camp_registrations(camp_id, status);',
    description: 'Optimize camp management queries',
    performance: 'medium'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_subscription ON users(subscription_plan, subscription_status);',
    description: 'Optimize subscription-based queries',
    performance: 'medium'
  },
  {
    query: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login ON users(last_login_at) WHERE last_login_at IS NOT NULL;',
    description: 'Optimize user activity tracking',
    performance: 'low'
  }
];

// Query optimization suggestions
export const queryOptimizations = {
  // Batch operations for better performance
  batchVideoAnalysis: `
    WITH batch_analysis AS (
      SELECT user_id, AVG(gar_score) as avg_gar, COUNT(*) as video_count
      FROM video_analysis 
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY user_id
    )
    UPDATE users 
    SET gar_score = batch_analysis.avg_gar,
        last_gar_analysis = NOW()
    FROM batch_analysis
    WHERE users.id = batch_analysis.user_id;
  `,
  
  // Efficient user rankings
  userRankings: `
    SELECT 
      id, name, sport, gar_score,
      ROW_NUMBER() OVER (PARTITION BY sport ORDER BY gar_score DESC) as sport_rank,
      ROW_NUMBER() OVER (ORDER BY gar_score DESC) as overall_rank
    FROM users 
    WHERE gar_score IS NOT NULL 
      AND is_active = true
      AND role = 'athlete'
    ORDER BY gar_score DESC;
  `,
  
  // Optimized athlete search
  athleteSearch: `
    SELECT u.*, va.latest_analysis
    FROM users u
    LEFT JOIN LATERAL (
      SELECT gar_score, created_at as latest_analysis
      FROM video_analysis va2
      WHERE va2.user_id = u.id
      ORDER BY created_at DESC
      LIMIT 1
    ) va ON true
    WHERE u.role = 'athlete'
      AND u.is_active = true
      AND ($1::text IS NULL OR u.sport ILIKE '%' || $1 || '%')
      AND ($2::int IS NULL OR u.graduation_year = $2)
      AND ($3::decimal IS NULL OR u.gar_score >= $3)
    ORDER BY u.gar_score DESC NULLS LAST
    LIMIT $4 OFFSET $5;
  `
};

// Connection pooling configuration
export const poolConfig = {
  // Connection pool settings for production
  production: {
    max: 20,
    min: 5,
    idle: 30000,
    acquire: 60000,
    evict: 1000
  },
  
  // Development settings
  development: {
    max: 10,
    min: 2,
    idle: 10000,
    acquire: 30000,
    evict: 1000
  }
};

// Query caching strategy
export class QueryCache {
  private static cache = new Map<string, { data: any, timestamp: number, ttl: number }>();
  
  static set(key: string, data: any, ttlMs: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }
  
  static get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  static clear(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  static getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}