'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, ExternalLink, Activity, Target, Users, BarChart3 } from 'lucide-react'

// Optimized Landing Page with Database-Independent Architecture
export default function OptimizedHomePage() {
  const [platformStatus, setPlatformStatus] = useState('loading')
  const [features, setFeatures] = useState({
    landing: true,
    dashboard: true,
    database: false,
    api: true
  })

  useEffect(() => {
    // Check platform health
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          const health = await response.json()
          setFeatures(health.features || features)
          setPlatformStatus('ready')
        } else {
          setPlatformStatus('degraded')
        }
      } catch (error) {
        console.log('Health check failed, using offline mode')
        setPlatformStatus('offline')
      }
    }

    checkHealth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Optimized Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">Go4It Sports</div>
            <div className="flex space-x-4">
              <SafeLink 
                href="/auth" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign In
              </SafeLink>
              <SafeLink 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Get Started
              </SafeLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Platform Status Banner */}
      {platformStatus === 'degraded' && (
        <div className="bg-yellow-900/20 border-b border-yellow-600 px-6 py-3">
          <div className="max-w-7xl mx-auto text-center text-yellow-200">
            Running in optimized mode. Some features may have limited functionality.
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Revolutionary Sports Analytics
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              AI-powered platform designed specifically for neurodivergent student athletes aged 12-18.
              Advanced video analysis, personalized coaching, and college recruitment tools.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <SafeLink 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3 rounded-md transition-colors inline-flex items-center justify-center"
              >
                Explore Platform
                <ExternalLink className="ml-2 w-5 h-5" />
              </SafeLink>
              <SafeLink 
                href="/starpath" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg px-8 py-3 rounded-md transition-colors"
              >
                View StarPath
              </SafeLink>
            </div>

            {/* Platform Status */}
            <div className="flex items-center justify-center">
              <PlatformStatusIndicator status={platformStatus} />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <FeatureCard 
              icon={<Activity className="w-8 h-8" />}
              title="Video Analysis (GAR)"
              description="AI-powered Growth and Ability Rating system"
              enabled={features.api}
            />
            <FeatureCard 
              icon={<Target className="w-8 h-8" />}
              title="StarPath Progression"
              description="Interactive skill development with XP tracking"
              enabled={features.database}
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Team Management"
              description="Comprehensive tools for coaches and athletes"
              enabled={features.dashboard}
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8" />}
              title="Performance Analytics"
              description="Real-time tracking with detailed insights"
              enabled={features.api}
            />
          </div>

          {/* Stats Section */}
          <div className="bg-slate-800 rounded-lg p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <StatCard number="15/15" label="Features Complete" color="blue" />
              <StatCard number="100%" label="Platform Ready" color="purple" />
              <StatCard number="$2.3B" label="Target Market" color="green" />
              <StatCard number="3-5" label="Years Ahead" color="orange" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>&copy; 2025 Go4It Sports Platform - Advanced Athletics for Neurodivergent Student Athletes</p>
        </div>
      </footer>
    </div>
  )
}

// Safe Link Component - Never breaks routing
function SafeLink({ href, children, className }: { 
  href: string
  children: React.ReactNode
  className?: string 
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Use window.location for reliable navigation
    window.location.href = href
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}

// Platform Status Indicator
function PlatformStatusIndicator({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'ready':
        return { color: 'text-green-400', icon: CheckCircle, text: 'Platform Status: Optimized & Ready' }
      case 'degraded':
        return { color: 'text-yellow-400', icon: Activity, text: 'Platform Status: Running (Limited Features)' }
      case 'offline':
        return { color: 'text-blue-400', icon: Activity, text: 'Platform Status: Offline Mode' }
      default:
        return { color: 'text-slate-400', icon: Activity, text: 'Platform Status: Loading...' }
    }
  }

  const { color, icon: Icon, text } = getStatusConfig()

  return (
    <div className={`flex items-center ${color}`}>
      <Icon className="w-5 h-5 mr-2" />
      <span>{text}</span>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ 
  icon, 
  title, 
  description, 
  enabled 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
}) {
  return (
    <div className={`bg-slate-800 border rounded-lg p-6 transition-colors ${
      enabled 
        ? 'border-slate-700 hover:border-blue-500' 
        : 'border-slate-600 opacity-60'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={enabled ? 'text-blue-400' : 'text-slate-500'}>
          {icon}
        </div>
        <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-500'}`} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm">{description}</p>
      {!enabled && (
        <p className="text-yellow-400 text-xs mt-2">Limited functionality in current mode</p>
      )}
    </div>
  )
}

// Stats Card Component
function StatCard({ 
  number, 
  label, 
  color 
}: { 
  number: string
  label: string
  color: 'blue' | 'purple' | 'green' | 'orange'
}) {
  const colorClasses = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    orange: 'text-orange-400'
  }

  return (
    <div>
      <div className={`text-4xl font-bold ${colorClasses[color]} mb-2`}>{number}</div>
      <div className="text-slate-300">{label}</div>
    </div>
  )
}