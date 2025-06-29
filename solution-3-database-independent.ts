// Database-Independent Architecture
// Landing page works even if database is down

interface AppConfig {
  databaseEnabled: boolean
  features: Record<string, boolean>
  fallbackMode: boolean
}

class DatabaseService {
  private isConnected = false
  private retryCount = 0
  private maxRetries = 3

  async connect(): Promise<boolean> {
    try {
      // Test database connection
      if (process.env.DATABASE_URL) {
        // Actual connection test here
        this.isConnected = true
        return true
      }
    } catch (error) {
      console.warn(`Database connection failed (attempt ${this.retryCount + 1})`)
      this.retryCount++
      if (this.retryCount < this.maxRetries) {
        // Retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, this.retryCount)))
        return this.connect()
      }
    }
    return false
  }

  isAvailable(): boolean {
    return this.isConnected
  }
}

class ConfigService {
  private static instance: ConfigService
  private config: AppConfig
  private dbService: DatabaseService

  constructor() {
    this.dbService = new DatabaseService()
    this.config = this.getDefaultConfig()
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService()
    }
    return ConfigService.instance
  }

  private getDefaultConfig(): AppConfig {
    return {
      databaseEnabled: false,
      features: {
        landing: true,        // Always available
        dashboard: true,      // Always available  
        videoAnalysis: false, // Requires database
        starpath: false,      // Requires database
        teams: false,         // Requires database
        analytics: false      // Requires database
      },
      fallbackMode: true
    }
  }

  async initialize(): Promise<AppConfig> {
    // Try to connect to database
    const dbConnected = await this.dbService.connect()
    
    this.config = {
      databaseEnabled: dbConnected,
      features: {
        landing: true,
        dashboard: true,
        videoAnalysis: dbConnected,
        starpath: dbConnected,
        teams: dbConnected,
        analytics: dbConnected
      },
      fallbackMode: !dbConnected
    }

    console.log(`App initialized - Database: ${dbConnected ? 'Connected' : 'Offline'}, Features: ${Object.values(this.config.features).filter(Boolean).length}/6`)
    
    return this.config
  }

  getConfig(): AppConfig {
    return this.config
  }

  isFeatureEnabled(feature: string): boolean {
    return this.config.features[feature] || false
  }
}

// React Hook for Configuration
import { useState, useEffect } from 'react'

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeConfig = async () => {
      try {
        const configService = ConfigService.getInstance()
        const appConfig = await configService.initialize()
        setConfig(appConfig)
      } catch (error) {
        console.error('Failed to initialize config:', error)
        // Use safe defaults
        setConfig({
          databaseEnabled: false,
          features: { landing: true, dashboard: true },
          fallbackMode: true
        })
      } finally {
        setLoading(false)
      }
    }

    initializeConfig()
  }, [])

  return { config, loading, isFeatureEnabled: (feature: string) => config?.features[feature] || false }
}

// Adaptive Landing Page Component
export function AdaptiveLanding() {
  const { config, loading, isFeatureEnabled } = useAppConfig()

  if (loading) {
    return <LandingPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <LandingHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        {config?.fallbackMode && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-8">
            <p className="text-yellow-200">
              Running in offline mode. Some features may be limited.
            </p>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">Go4It Sports Platform</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Advanced sports analytics for neurodivergent student athletes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            title="Dashboard" 
            enabled={isFeatureEnabled('dashboard')} 
            href="/dashboard"
            description="Overview and quick access to all features"
          />
          <FeatureCard 
            title="Video Analysis" 
            enabled={isFeatureEnabled('videoAnalysis')} 
            href="/video-analysis"
            description="AI-powered GAR scoring and analysis"
          />
          <FeatureCard 
            title="StarPath" 
            enabled={isFeatureEnabled('starpath')} 
            href="/starpath"
            description="Interactive skill progression system"
          />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ title, enabled, href, description }: {
  title: string
  enabled: boolean
  href: string
  description: string
}) {
  const cardClass = enabled 
    ? "bg-slate-800 border-slate-700 hover:border-blue-500 cursor-pointer" 
    : "bg-slate-800/50 border-slate-600 opacity-60"

  const content = (
    <div className={`border rounded-lg p-6 transition-colors ${cardClass}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-500'}`} />
      </div>
      <p className="text-slate-300 text-sm">{description}</p>
      {!enabled && (
        <p className="text-yellow-400 text-xs mt-2">Requires database connection</p>
      )}
    </div>
  )

  return enabled ? (
    <a href={href}>{content}</a>
  ) : (
    content
  )
}

function LandingHeader() {
  return (
    <header className="border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Go4It Sports</div>
          <div className="flex space-x-4">
            <a href="/auth" className="text-blue-400 hover:text-blue-300">Sign In</a>
            <a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

function LandingPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-900 text-white animate-pulse">
      <div className="border-b border-slate-800 p-4">
        <div className="h-8 bg-slate-700 rounded w-32"></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="h-12 bg-slate-700 rounded w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-slate-700 rounded w-64 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

export default AdaptiveLanding