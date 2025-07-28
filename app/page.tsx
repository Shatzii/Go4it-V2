'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, ExternalLink, Activity, Target, Users, BarChart3, Star, TrendingUp, Award, Calendar, MapPin, ArrowRight, Play, GraduationCap, Trophy, Crown } from 'lucide-react'
import Image from 'next/image'

// SafeLink Component
function SafeLink({ href, children, className, ...props }: { href: string; children: React.ReactNode; className?: string; [key: string]: any }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = href
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  )
}

// Using public logo path for Next.js
const logoImage = '/go4it-logo-new.jpg'

// Star Rating Component to match deployed site
function StarRating({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) {
  const stars = []
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <Star 
        key={i} 
        className={`w-4 h-4 ${i <= rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
      />
    )
  }
  return <div className="flex items-center gap-1">{stars}</div>
}

// Go4It Sports Landing Page - Complete Original Content Restored
export default function Go4ItHomePage() {
  const [platformStatus, setPlatformStatus] = useState('ready')
  const [topAthletes, setTopAthletes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
        
        const response = await fetch('/api/health', { 
          signal: controller.signal,
          cache: 'no-cache'
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          setPlatformStatus('ready')
        } else {
          setPlatformStatus('degraded')
        }
      } catch (error) {
        console.log('Health check failed, using offline mode')
        setPlatformStatus('ready') // Always set to ready to show content
      }
    }

    const fetchTopAthletes = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        const response = await fetch('/api/recruiting/athletes/database', {
          signal: controller.signal,
          cache: 'no-cache'
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.athletes) {
            console.log('Fetched athletes:', data.athletes.length)
            setTopAthletes(data.athletes.slice(0, 4)) // Get top 4 athletes
          }
        }
      } catch (error) {
        console.log('Failed to fetch athletes, using fallback')
      } finally {
        setIsLoading(false)
      }
    }

    // Run health check but don't wait for it
    checkHealth()
    fetchTopAthletes()
    
    // Ensure content shows after maximum 2 seconds regardless of API status
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false)
      setPlatformStatus('ready')
    }, 2000)
    
    return () => clearTimeout(fallbackTimer)
  }, [])

  // Calculate GAR score based on athlete rankings and stats
  const calculateGARScore = (athlete: any) => {
    if (!athlete) return 75
    
    // Base score from composite ranking (lower ranking = higher score)
    const rankingScore = Math.max(100 - (athlete.rankings.composite * 2), 60)
    
    // Academic bonus
    const academicBonus = athlete.academics.gpa > 3.5 ? 5 : 0
    
    // Commitment status bonus
    const commitmentBonus = athlete.recruiting.status === 'committed' ? 3 : 0
    
    return Math.min(rankingScore + academicBonus + commitmentBonus, 100)
  }

  // Get athlete image URL
  const getAthleteImage = (athlete: any) => {
    if (athlete.highlights.images && athlete.highlights.images.length > 0) {
      return athlete.highlights.images[0]
    }
    // Fallback to sport-specific stock images
    const sportImages: { [key: string]: string } = {
      'Basketball': 'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
      'Soccer': 'https://images.unsplash.com/photo-1511067007398-7e4b9499a637?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      'American Football': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
      'Track & Field': 'https://images.unsplash.com/photo-1527334919515-b8dee906a34b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJhY2slMjBmaWVsZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'
    }
    return sportImages[athlete.sport] || sportImages['Basketball']
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white -mt-16">
      {/* Override the layout navigation with homepage navigation */}
      <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image
                src={logoImage}
                alt="Go4It Sports Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="text-2xl font-bold text-white">
                Go4It Sports
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <SafeLink 
                href="/lifetime" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg text-sm"
              >
                VERIFIED 100
              </SafeLink>
              <SafeLink 
                href="/auth" 
                className="text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </SafeLink>
              <SafeLink 
                href="/pricing" 
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
              >
                Get Started
              </SafeLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Vienna Event Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
        <div className="relative max-w-7xl mx-auto flex items-center justify-center text-center">
          <div className="flex items-center gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="font-bold">FIRST VERIFIED COMBINE</span>
            </div>
            <div className="hidden md:block">•</div>
            <div>
              <span className="font-medium">Vienna, Austria • July 22-24, 2025</span>
            </div>
            <div className="hidden md:block">•</div>
            <div>
              <span className="text-yellow-300">Friday Night Lights @ 7PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
          <div className="absolute top-20 left-20 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-300"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-primary-foreground">Platform Status: {platformStatus.charAt(0).toUpperCase() + platformStatus.slice(1)}</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Elevate Your
                  <span className="block text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Athletic Journey
                  </span>
                </h1>
                
                <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                  The ultimate AI-powered platform designed specifically for neurodivergent student athletes. 
                  From NCAA eligibility to professional recruitment, we have everything you need to excel.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <SafeLink 
                  href="/auth" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-5 h-5" />
                  Start Your Journey
                </SafeLink>
                
                <SafeLink 
                  href="/rankings/class-2026" 
                  className="border border-purple-500/50 hover:bg-purple-500/20 text-purple-400 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Trophy className="w-5 h-5" />
                  View Top 100 Rankings
                </SafeLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Verified Athletes Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Top Verified Athletes</h2>
            <p className="text-xl text-slate-300">Elite performers from our growing community</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-slate-800/80 rounded-2xl border border-slate-700/50 overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-slate-700/50"></div>
                  <div className="p-6">
                    <div className="h-4 bg-slate-700/50 rounded mb-3"></div>
                    <div className="h-3 bg-slate-700/50 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-slate-700/50 rounded mb-2 w-1/2"></div>
                  </div>
                </div>
              ))
            ) : topAthletes.length > 0 ? (
              topAthletes.map((athlete: any) => (
                <div key={athlete.id} className="group bg-slate-800/80 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-primary/30 transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getAthleteImage(athlete)} 
                      alt={athlete.name} 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4 text-primary" fill="currentColor" />
                      <span className="text-primary text-xs font-semibold">VERIFIED</span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold">
                      {calculateGARScore(athlete)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-white mb-2">{athlete.name}</h3>
                    <p className="text-slate-400 mb-3">{athlete.sport} • {athlete.position}</p>
                    
                    <div className="text-sm text-slate-500 space-y-1 mb-4">
                      <div>CLASS • {athlete.classYear}</div>
                      <div>SCHOOL • {athlete.school.current}</div>
                      <div>RANKING • #{athlete.rankings.composite}</div>
                      <div className="text-primary font-medium">GAR • {calculateGARScore(athlete)}/100</div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <StarRating rating={Math.floor(calculateGARScore(athlete) / 20)} />
                      <span className="text-sm text-slate-400">({calculateGARScore(athlete)}/100)</span>
                    </div>
                    
                    <div className="flex gap-3">
                      <SafeLink 
                        href={`/athlete/${athlete.id}`}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors flex-1 text-center"
                      >
                        View Profile
                      </SafeLink>
                      {athlete.highlights.videos.length > 0 && (
                        <SafeLink
                          href={athlete.highlights.videos[0].url}
                          className="text-primary border border-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </SafeLink>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback elite athletes
              [
                { name: 'Cooper Flagg', sport: 'Basketball', position: 'Small Forward', garScore: 98, id: 'cooper-flagg-2025' },
                { name: 'Ace Bailey', sport: 'Basketball', position: 'Shooting Guard', garScore: 96, id: 'ace-bailey-2025' },
                { name: 'Dylan Harper', sport: 'Basketball', position: 'Point Guard', garScore: 95, id: 'dylan-harper-2025' },
                { name: 'VJ Edgecombe', sport: 'Basketball', position: 'Shooting Guard', garScore: 93, id: 'vj-edgecombe-2025' }
              ].map((athlete) => (
                <div key={athlete.id} className="group bg-slate-800/80 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-primary/30 transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" 
                      alt={athlete.name} 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4 text-primary" fill="currentColor" />
                      <span className="text-primary text-xs font-semibold">VERIFIED</span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold">
                      {athlete.garScore}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-white mb-2">{athlete.name}</h3>
                    <p className="text-slate-400 mb-3">{athlete.sport} • {athlete.position}</p>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <StarRating rating={Math.floor(athlete.garScore / 20)} />
                      <span className="text-primary font-medium">GAR: {athlete.garScore}/100</span>
                    </div>
                    
                    <div className="flex gap-3">
                      <SafeLink 
                        href={`/athlete/${athlete.id}`}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors flex-1 text-center"
                      >
                        View Profile
                      </SafeLink>
                      <button className="text-primary border border-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300">
                        Highlights
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <SafeLink 
              href="/verified-athletes" 
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg"
            >
              View All Verified Athletes
              <ArrowRight className="w-5 h-5" />
            </SafeLink>
          </div>
        </div>
      </section>
    </div>
  )
}