// Performance optimization utilities for Go4It Sports Platform
import { db } from './db'
import { eq, and, gte, lte, desc, asc } from 'drizzle-orm'

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  // Intelligent caching system
  async getCachedData<T>(
    key: string,
    dataFetcher: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }

    const freshData = await dataFetcher()
    this.cache.set(key, {
      data: freshData,
      timestamp: Date.now(),
      ttl
    })

    return freshData
  }

  // Optimized database queries with proper indexing
  async getOptimizedUserData(userId: number) {
    return this.getCachedData(
      `user_data_${userId}`,
      async () => {
        // Batch multiple queries to reduce database round trips
        const [user, recentUploads, starPathProgress, recentAnalyses] = await Promise.all([
          db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
              subscriptions: true
            }
          }),
          db.query.userFiles.findMany({
            where: eq(userFiles.userId, userId),
            orderBy: [desc(userFiles.createdAt)],
            limit: 10
          }),
          db.query.starPathProgress.findMany({
            where: eq(starPathProgress.userId, userId),
            orderBy: [desc(starPathProgress.totalXp)],
            limit: 20
          }),
          db.query.contentAnalysis.findMany({
            where: eq(contentAnalysis.userId, userId),
            orderBy: [desc(contentAnalysis.analyzedAt)],
            limit: 5
          })
        ])

        return {
          user,
          recentUploads,
          starPathProgress,
          recentAnalyses
        }
      },
      2 * 60 * 1000 // 2 minutes for user data
    )
  }

  // Optimized performance analytics queries
  async getPerformanceMetrics(userId: number, sport?: string, dateRange?: { start: Date; end: Date }) {
    const cacheKey = `performance_${userId}_${sport || 'all'}_${dateRange?.start}_${dateRange?.end}`
    
    return this.getCachedData(
      cacheKey,
      async () => {
        let query = db.select({
          id: garAnalyses.id,
          overallScore: garAnalyses.overallScore,
          technicalSkills: garAnalyses.technicalSkills,
          athleticism: garAnalyses.athleticism,
          gameAwareness: garAnalyses.gameAwareness,
          consistency: garAnalyses.consistency,
          improvement: garAnalyses.improvement,
          sport: garAnalyses.sport,
          analyzedAt: garAnalyses.analyzedAt
        })
        .from(garAnalyses)
        .where(eq(garAnalyses.userId, userId))

        if (sport) {
          query = query.where(and(
            eq(garAnalyses.userId, userId),
            eq(garAnalyses.sport, sport)
          ))
        }

        if (dateRange) {
          query = query.where(and(
            eq(garAnalyses.userId, userId),
            gte(garAnalyses.analyzedAt, dateRange.start),
            lte(garAnalyses.analyzedAt, dateRange.end)
          ))
        }

        const results = await query
          .orderBy(desc(garAnalyses.analyzedAt))
          .limit(100)

        // Calculate aggregated metrics
        const metrics = this.calculatePerformanceMetrics(results)
        
        return {
          rawData: results,
          metrics
        }
      },
      10 * 60 * 1000 // 10 minutes for performance data
    )
  }

  // Image and video compression utilities
  async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          resolve(compressedFile)
        }, 'image/jpeg', quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // Batch processing for better performance
  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 5
  ): Promise<R[]> {
    const results: R[] = []
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(item => processor(item))
      )
      results.push(...batchResults)
    }
    
    return results
  }

  // Preload critical resources
  async preloadCriticalResources() {
    // Preload frequently accessed data
    const criticalQueries = [
      'popular_sports',
      'featured_content',
      'latest_announcements'
    ]

    await Promise.all(
      criticalQueries.map(query => 
        this.getCachedData(query, async () => {
          // Implement specific queries for each resource
          switch (query) {
            case 'popular_sports':
              return ['Basketball', 'Football', 'Soccer', 'Baseball', 'Tennis']
            case 'featured_content':
              return db.query.userFiles.findMany({
                where: eq(userFiles.featured, true),
                limit: 10
              })
            case 'latest_announcements':
              return db.query.announcements.findMany({
                orderBy: [desc(announcements.createdAt)],
                limit: 5
              })
            default:
              return null
          }
        })
      )
    )
  }

  // Database query optimization
  private calculatePerformanceMetrics(data: any[]) {
    if (data.length === 0) return null

    const latest = data[0]
    const oldest = data[data.length - 1]
    
    return {
      current: {
        overall: latest.overallScore,
        technical: latest.technicalSkills,
        athleticism: latest.athleticism,
        gameAwareness: latest.gameAwareness,
        consistency: latest.consistency,
        improvement: latest.improvement
      },
      trend: {
        overall: latest.overallScore - oldest.overallScore,
        technical: latest.technicalSkills - oldest.technicalSkills,
        athleticism: latest.athleticism - oldest.athleticism,
        gameAwareness: latest.gameAwareness - oldest.gameAwareness,
        consistency: latest.consistency - oldest.consistency,
        improvement: latest.improvement - oldest.improvement
      },
      average: {
        overall: data.reduce((sum, d) => sum + d.overallScore, 0) / data.length,
        technical: data.reduce((sum, d) => sum + d.technicalSkills, 0) / data.length,
        athleticism: data.reduce((sum, d) => sum + d.athleticism, 0) / data.length,
        gameAwareness: data.reduce((sum, d) => sum + d.gameAwareness, 0) / data.length,
        consistency: data.reduce((sum, d) => sum + d.consistency, 0) / data.length,
        improvement: data.reduce((sum, d) => sum + d.improvement, 0) / data.length
      },
      dataPoints: data.length,
      timeSpan: {
        start: oldest.analyzedAt,
        end: latest.analyzedAt
      }
    }
  }

  // Clear cache when needed
  clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  // Memory management
  cleanupExpiredCache() {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Performance monitoring
  async measurePerformance<T>(
    operation: () => Promise<T>,
    label: string
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now()
    const result = await operation()
    const duration = performance.now() - start
    
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`)
    
    return { result, duration }
  }
}

// Global instance
export const performanceOptimizer = PerformanceOptimizer.getInstance()

// Auto cleanup every 5 minutes
setInterval(() => {
  performanceOptimizer.cleanupExpiredCache()
}, 5 * 60 * 1000)