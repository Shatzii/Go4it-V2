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
                href="/admin" 
                className="text-red-400 hover:text-red-300 transition-colors text-sm"
              >
                Admin
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
            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              GET <span className="text-blue-400">VERIFIED</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              GAR Rating System
            </h2>
            <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
              The Ultimate AI-Powered Athlete Evaluation
            </p>
            <p className="text-lg text-slate-400 mb-8 max-w-3xl mx-auto">
              Our revolutionary GAR Rating System uses AI to analyze physical metrics, cognitive abilities, and psychological factors for the most comprehensive athlete evaluation available.
            </p>
            
            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">AI Motion Analysis</h3>
                <p className="text-sm text-slate-300">Our cutting-edge AI technology analyzes your motion mechanics with professional-grade accuracy.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">Verified Combines</h3>
                <p className="text-sm text-slate-300">Participate in certified athletic combines where your performance metrics are verified by professionals.</p>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="mb-8">
              <SafeLink 
                href="/auth" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-colors inline-block"
              >
                Get Verified Today
              </SafeLink>
            </div>

            {/* Platform Status */}
            <div className="flex items-center justify-center">
              <PlatformStatusIndicator status={platformStatus} />
            </div>
          </div>

          {/* Top Verified Athletes */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Top Verified Athletes</h2>
              <SafeLink href="/athletes" className="text-blue-400 hover:text-blue-300 transition-colors">
                View All
              </SafeLink>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sample Athletes */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-3"></div>
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    VERIFIED
                  </div>
                </div>
                <div className="text-right mb-2">
                  <div className="text-3xl font-bold text-white">92</div>
                  <div className="text-slate-400 text-sm">GAR Score</div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Alonzo Barrett</h3>
                <p className="text-slate-400 text-sm mb-2">Shooting Guard</p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>SPORT: Basketball</span>
                  <span>POSITION: Guard</span>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-3"></div>
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    VERIFIED
                  </div>
                </div>
                <div className="text-right mb-2">
                  <div className="text-3xl font-bold text-white">87</div>
                  <div className="text-slate-400 text-sm">GAR Score</div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Sarah Johnson</h3>
                <p className="text-slate-400 text-sm mb-2">Sprinter</p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>SPORT: Track</span>
                  <span>POSITION: Sprinter</span>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3"></div>
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    VERIFIED
                  </div>
                </div>
                <div className="text-right mb-2">
                  <div className="text-3xl font-bold text-white">94</div>
                  <div className="text-slate-400 text-sm">GAR Score</div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Malik Barrett</h3>
                <p className="text-slate-400 text-sm mb-2">Center Midfielder</p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>SPORT: Soccer</span>
                  <span>POSITION: Midfielder</span>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-3"></div>
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    VERIFIED
                  </div>
                </div>
                <div className="text-right mb-2">
                  <div className="text-3xl font-bold text-white">91</div>
                  <div className="text-slate-400 text-sm">GAR Score</div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Emma Wilson</h3>
                <p className="text-slate-400 text-sm mb-2">Outside Hitter</p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>SPORT: Volleyball</span>
                  <span>POSITION: Hitter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Combine Events */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Upcoming Combine Events</h2>
              <SafeLink href="/combine-tour" className="text-blue-400 hover:text-blue-300 transition-colors">
                View All Events
              </SafeLink>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-orange-500 text-sm font-semibold">FILLING FAST</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Chicago Elite Combine</h3>
                <p className="text-slate-400 text-sm mb-4">Chicago, IL • Jul 11, 2025</p>
                <p className="text-slate-300 text-sm mb-6">
                  Join us for a comprehensive evaluation featuring physical testing, skills assessment, and game play. College coaches will be in attendance to evaluate talent.
                </p>
                <SafeLink 
                  href="/combine-tour/chicago-elite-combine-2025" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full text-center inline-block"
                >
                  Register Now
                </SafeLink>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-orange-500 text-sm font-semibold">FILLING FAST</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Los Angeles Skills Showcase</h3>
                <p className="text-slate-400 text-sm mb-4">Los Angeles, CA • Jul 18, 2025</p>
                <p className="text-slate-300 text-sm mb-6">
                  An exclusive opportunity for top high school athletes to showcase their skills in front of college scouts and coaches.
                </p>
                <SafeLink 
                  href="/combine-tour/la-skills-showcase-2025" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full text-center inline-block"
                >
                  Register Now
                </SafeLink>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-orange-500 text-sm font-semibold">FILLING FAST</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Dallas All-Stars Combine</h3>
                <p className="text-slate-400 text-sm mb-4">Arlington, TX • Jul 5, 2025</p>
                <p className="text-slate-300 text-sm mb-6">
                  The premier combine event in Texas featuring comprehensive testing and evaluation for multiple sports.
                </p>
                <SafeLink 
                  href="/combine-tour/dallas-all-stars-2025" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full text-center inline-block"
                >
                  Register Now
                </SafeLink>
              </div>
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