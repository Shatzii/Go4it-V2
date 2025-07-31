'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, ExternalLink, Activity, Target, Users, BarChart3, Star, TrendingUp, Award, Calendar, MapPin, ArrowRight, Play, GraduationCap, Trophy, Crown, Brain } from 'lucide-react'
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
export { default } from './landing-optimized/page'

function Go4ItHomePage() {
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
            <div className="hidden md:flex items-center space-x-6">
              <SafeLink 
                href="/starpath" 
                className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                StarPath
              </SafeLink>
              <SafeLink 
                href="/rankings" 
                className="text-slate-300 hover:text-white transition-colors"
              >
                Rankings
              </SafeLink>
              <SafeLink 
                href="/auth" 
                className="text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </SafeLink>
              <SafeLink 
                href="/pricing" 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg"
              >
                Get Started
              </SafeLink>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <SafeLink 
                href="/auth" 
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
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

      {/* Neon Gaming Dashboard Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* Animated Neon Grid Background */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 opacity-20" 
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(0, 191, 255, 0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(0, 191, 255, 0.1) 1px, transparent 1px)
                 `,
                 backgroundSize: '50px 50px'
               }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-black/60"></div>
          
          {/* Floating Neon Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-cyan-400/30 rounded-full animate-pulse">
            <div className="w-full h-full border-2 border-cyan-400/50 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
          </div>
          <div className="absolute bottom-40 right-32 w-24 h-24 border-2 border-blue-400/40 rounded-full animate-pulse delay-300">
            <div className="w-full h-full border-2 border-blue-400/60 rounded-full animate-spin" style={{animationDuration: '6s'}}></div>
          </div>
          <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-cyan-300/20 rounded-full animate-pulse delay-700"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-12">
            {/* Central Verification Hub */}
            <div className="space-y-8">
              {/* Pulsing Verification Badge */}
              <div className="inline-flex items-center justify-center relative">
                <div className="absolute w-40 h-40 border-4 border-cyan-400/30 rounded-full animate-pulse"></div>
                <div className="absolute w-32 h-32 border-2 border-cyan-400/50 rounded-full animate-pulse delay-300"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/50">
                  <CheckCircle className="w-12 h-12 text-white" fill="currentColor" />
                </div>
              </div>
              
              {/* Main Gaming-Style Title */}
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text leading-tight tracking-wider">
                  VERIFICATION
                  <span className="block text-5xl lg:text-7xl">HUB</span>
                </h1>
                
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-400/20 rounded-full border border-cyan-400/50 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-400 font-bold text-lg">SYSTEM ONLINE</span>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-500"></div>
                </div>
              </div>
              
              <p className="text-2xl text-slate-300 font-medium max-w-4xl mx-auto leading-relaxed">
                <span className="text-cyan-400 font-bold">UNLOCK YOUR ATHLETIC POTENTIAL</span> - Join the elite ranks of verified student athletes and dominate the recruitment game
              </p>
            </div>

            {/* Gaming Level Progression */}
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Level 1: Rookie */}
              <div className="group relative bg-gradient-to-b from-slate-800/80 to-slate-900/80 rounded-2xl border-2 border-slate-600/50 p-6 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-slate-700 px-4 py-1 rounded-full">
                  <span className="text-slate-300 text-sm font-bold">LEVEL 1</span>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-slate-600 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white">ROOKIE</h3>
                  <div className="text-3xl font-black text-green-400">FREE</div>
                  <p className="text-slate-400 text-sm">Create profile, upload highlights, basic features</p>
                </div>
              </div>

              {/* Level 2: Verified */}
              <div className="group relative bg-gradient-to-b from-cyan-900/40 to-blue-900/40 rounded-2xl border-2 border-cyan-400/50 p-6 hover:border-cyan-400 transition-all duration-500 hover:scale-105 shadow-lg shadow-cyan-400/20">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-cyan-400 px-4 py-1 rounded-full">
                  <span className="text-black text-sm font-bold">LEVEL 2</span>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/50">
                    <CheckCircle className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-bold text-cyan-400">VERIFIED</h3>
                  <div className="text-3xl font-black text-cyan-400">$49</div>
                  <p className="text-cyan-200 text-sm">Official GAR Analysis + Verification Badge</p>
                </div>
              </div>

              {/* Level 3: Elite */}
              <div className="group relative bg-gradient-to-b from-purple-900/40 to-violet-900/40 rounded-2xl border-2 border-purple-400/50 p-6 hover:border-purple-400 transition-all duration-500 hover:scale-105">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-400 px-4 py-1 rounded-full">
                  <span className="text-white text-sm font-bold">LEVEL 3</span>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-400">ELITE</h3>
                  <div className="text-3xl font-black text-purple-400">$19<span className="text-lg">/mo</span></div>
                  <p className="text-purple-200 text-sm">StarPath Training + AI Coach + Analytics</p>
                </div>
              </div>

              {/* Level 4: Academy */}
              <div className="group relative bg-gradient-to-b from-yellow-900/40 to-orange-900/40 rounded-2xl border-2 border-yellow-400/50 p-6 hover:border-yellow-400 transition-all duration-500 hover:scale-105">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-4 py-1 rounded-full">
                  <span className="text-black text-sm font-bold">LEVEL 4</span>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400">ACADEMY</h3>
                  <div className="text-3xl font-black text-yellow-400">$49<span className="text-lg">/mo</span></div>
                  <p className="text-yellow-200 text-sm">Full Academic + NCAA Eligibility + Recruiting</p>
                </div>
              </div>
            </div>

            {/* Live Stats Counter */}
            <div className="flex justify-center items-center gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-black text-cyan-400 font-mono">847</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Verified Athletes</div>
              </div>
              <div className="w-px h-12 bg-slate-600"></div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-purple-400 font-mono">156</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Elite Members</div>
              </div>
              <div className="w-px h-12 bg-slate-600"></div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-yellow-400 font-mono">67</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Academy Students</div>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="space-y-6">
              <SafeLink 
                href="/auth" 
                className="inline-flex items-center gap-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-12 py-6 rounded-2xl text-2xl font-black uppercase tracking-wider transition-all duration-300 shadow-2xl shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:scale-105 border-2 border-cyan-400/50"
              >
                <CheckCircle className="w-8 h-8" fill="currentColor" />
                START VERIFICATION
                <ArrowRight className="w-8 h-8" />
              </SafeLink>
              
              <p className="text-slate-400 text-sm">
                <span className="text-green-400 font-semibold">LIMITED TIME:</span> First 100 athletes get lifetime verification badges
              </p>
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

      {/* StarPath Progression System Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30 mb-6">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Gamified Skill Development</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              StarPath Progression System
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Level up your athletic skills with our neurodivergent-friendly progression system. 
              Track XP, unlock achievements, and follow personalized training paths.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* StarPath Preview */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Your Progress</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-primary font-medium">Level 3</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300">Overall Progress</span>
                      <span className="text-primary font-medium">2,450 / 3,000 XP</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{width: '82%'}}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">Technical</span>
                      </div>
                      <div className="text-white font-bold">Level 4</div>
                      <div className="text-slate-400 text-sm">850/1000 XP</div>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-medium">Physical</span>
                      </div>
                      <div className="text-white font-bold">Level 3</div>
                      <div className="text-slate-400 text-sm">650/800 XP</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h4 className="text-lg font-semibold text-white mb-4">Recent Achievements</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Ball Control Master</div>
                      <div className="text-slate-400 text-sm">Completed technical skill tree</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="text-white font-medium">Speed Demon</div>
                      <div className="text-slate-400 text-sm">Unlocked agility training</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Skill Trees & Progression</h3>
                    <p className="text-slate-300">Follow structured paths for technical, physical, tactical, and mental development with clear milestones.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">XP & Achievement System</h3>
                    <p className="text-slate-300">Earn experience points for training sessions, unlock badges, and celebrate your progress with visual rewards.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">ADHD-Friendly Design</h3>
                    <p className="text-slate-300">Clear visual feedback, manageable goals, and positive reinforcement designed specifically for neurodivergent athletes.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <SafeLink 
                  href="/starpath"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg"
                >
                  <Star className="w-5 h-5" />
                  Explore StarPath System
                  <ArrowRight className="w-5 h-5" />
                </SafeLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}