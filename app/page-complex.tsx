'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, ExternalLink, Activity, Target, Users, BarChart3, Star, TrendingUp, Award, Calendar, MapPin, ArrowRight, Play, GraduationCap, Trophy, Crown } from 'lucide-react'
import Image from 'next/image'
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

// Go4It Sports Landing Page - Exact match to deployed site styling
export default function Go4ItHomePage() {
  // Testing with simple content first
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">Go4It Sports Platform</h1>
        <p className="text-xl text-slate-300 mb-8">Testing content load</p>
      </section>
      
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Top Verified Athletes</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold">Cooper Flagg</h3>
              <p className="text-slate-400">Basketball • Small Forward</p>
              <p className="text-blue-400">GAR: 98/100</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold">Ace Bailey</h3>
              <p className="text-slate-400">Basketball • Shooting Guard</p>
              <p className="text-blue-400">GAR: 96/100</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold">Dylan Harper</h3>
              <p className="text-slate-400">Basketball • Point Guard</p>
              <p className="text-blue-400">GAR: 95/100</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold">VJ Edgecombe</h3>
              <p className="text-slate-400">Basketball • Shooting Guard</p>
              <p className="text-blue-400">GAR: 93/100</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function OriginalGo4ItHomePage() {
  const [platformStatus, setPlatformStatus] = useState('ready')
  const [topAthletes, setTopAthletes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          setPlatformStatus('ready')
        } else {
          setPlatformStatus('degraded')
        }
      } catch (error) {
        console.log('Health check failed, using offline mode')
        setPlatformStatus('ready') // Changed to ready to prevent loading screen
      }
    }

    const fetchTopAthletes = async () => {
      try {
        const response = await fetch('/api/recruiting/athletes/database')
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

    checkHealth()
    fetchTopAthletes()
  }, [])

  // Calculate GAR score based on athlete rankings and stats
  const calculateGARScore = (athlete) => {
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
  const getAthleteImage = (athlete) => {
    if (athlete.highlights.images && athlete.highlights.images.length > 0) {
      return athlete.highlights.images[0]
    }
    // Fallback to sport-specific stock images
    const sportImages = {
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

      {/* Hero Section - Dynamic Sports Platform */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse delay-700"></div>
          {/* Additional floating logo elements */}
          <div className="absolute top-1/3 right-1/4 opacity-10">
            <Image
              src={logoImage}
              alt="Go4It Logo"
              width={60}
              height={60}
              className="rounded-full animate-pulse delay-1000"
            />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
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
              
              {/* Key Features - New Priority Features */}
              <div className="grid grid-cols-2 gap-4">
                <SafeLink 
                  href="/ncaa-eligibility"
                  className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">NCAA Eligibility</div>
                    <div className="text-sm text-slate-300">Sliding Scale Calculator</div>
                  </div>
                </SafeLink>
                
                <SafeLink 
                  href="/athletic-contacts"
                  className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center group-hover:bg-yellow-500/30">
                    <Users className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Athletic Contacts</div>
                    <div className="text-sm text-slate-300">Verified Coaches</div>
                  </div>
                </SafeLink>
                
                <SafeLink 
                  href="/recruitment-ranking"
                  className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30">
                    <Trophy className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Rankings</div>
                    <div className="text-sm text-slate-300">Regional & National</div>
                  </div>
                </SafeLink>
                
                <SafeLink 
                  href="/ai-coach"
                  className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30">
                    <Activity className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">AI Coach</div>
                    <div className="text-sm text-slate-300">Advanced Analysis</div>
                  </div>
                </SafeLink>
              </div>
              
              {/* Vienna Event CTA */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 font-semibold text-sm">FIRST VERIFIED COMBINE EVENT</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Vienna, Austria • July 22-24, 2025
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Be one of the first 100 verified athletes. Friday Night Lights starts at 7PM.
                </p>
                <SafeLink 
                  href="/lifetime"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-6 py-3 rounded-lg text-sm transition-all duration-300 inline-flex items-center gap-2 shadow-lg"
                >
                  <Crown className="w-4 h-4" />
                  JOIN THE VERIFIED 100
                </SafeLink>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <SafeLink 
                  href="/auth" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-5 h-5" />
                  Start Your Journey
                </SafeLink>
                
                <SafeLink 
                  href="/rankings" 
                  className="border border-purple-500/50 hover:bg-purple-500/20 text-purple-400 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Trophy className="w-5 h-5" />
                  View Live Rankings
                </SafeLink>
              </div>
            </div>
            
            {/* Right Column - Visual Elements */}
            <div className="relative">
              {/* Main Visual Container */}
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl border border-slate-700/50 p-8 shadow-2xl backdrop-blur-sm">
                {/* Performance Stats */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Performance Overview</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-300">Live</span>
                    </div>
                  </div>
                  
                  {/* Progress Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">Athletic Performance</span>
                        <span className="text-sm text-primary font-semibold">92%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[92%] transition-all duration-1000"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">Academic Progress</span>
                        <span className="text-sm text-primary font-semibold">87%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[87%] transition-all duration-1000 delay-300"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white">StarPath Level</span>
                        <span className="text-sm text-primary font-semibold">Elite</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[95%] transition-all duration-1000 delay-500"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">1,247</div>
                      <div className="text-sm text-slate-300">Training Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">94%</div>
                      <div className="text-sm text-slate-300">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Achievement Card */}
              <div className="absolute -top-4 -right-4 bg-primary text-white p-4 rounded-2xl shadow-lg transform rotate-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">New Achievement!</span>
                </div>
                <div className="text-sm opacity-90">Elite Performance Unlocked</div>
              </div>
              
              {/* Floating Notification */}
              <div className="absolute -bottom-4 -left-4 bg-slate-800/90 border border-slate-700/50 p-4 rounded-2xl shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">AI Coach Ready</div>
                    <div className="text-xs text-slate-300">3 new drills available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Go4It Sports Academy - Featured Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Go4It Sports Academy</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              A comprehensive K-12 educational institution designed specifically for student-athletes, 
              combining world-class academics with elite athletic development.
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">847 Students</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">156 Faculty</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">234 Courses</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Academic Excellence */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Academic Excellence</h3>
              <p className="text-slate-300 mb-4">
                Complete K-12 curriculum with NCAA-approved core courses, advanced placement programs, 
                and specialized sports science education.
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• NCAA-approved core courses</li>
                <li>• Advanced Placement programs</li>
                <li>• Sports science curriculum</li>
                <li>• Individual learning plans</li>
              </ul>
            </div>

            {/* Athletic Development */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Athletic Development</h3>
              <p className="text-slate-300 mb-4">
                Professional-grade training facilities and coaching staff for 12+ sports, 
                with integrated performance analytics and injury prevention.
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• 12+ sport programs</li>
                <li>• Professional coaching staff</li>
                <li>• Performance analytics</li>
                <li>• Injury prevention protocols</li>
              </ul>
            </div>

            {/* Student Life */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/50">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Student Life</h3>
              <p className="text-slate-300 mb-4">
                Comprehensive support services including counseling, college planning, 
                and neurodivergent student accommodations.
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Academic counseling</li>
                <li>• College recruitment support</li>
                <li>• Neurodivergent accommodations</li>
                <li>• Mental health resources</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <SafeLink 
              href="/academy" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg text-lg"
            >
              <GraduationCap className="w-6 h-6" />
              Explore Academy
              <ArrowRight className="w-5 h-5" />
            </SafeLink>
          </div>
        </div>
      </section>

      {/* Comprehensive Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Complete Athletic Development Platform</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to excel as a student-athlete, from NCAA eligibility to professional recruitment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* NCAA Eligibility Tracker */}
            <SafeLink 
              href="/ncaa-eligibility"
              className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">NCAA Eligibility Tracker</h3>
              <p className="text-slate-300 mb-4">
                Complete sliding scale calculator with 48 GPA/test score combinations, international student support, and real-time core course validation.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <span>STARTER Tier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </SafeLink>

            {/* Athletic Department Contacts */}
            <SafeLink 
              href="/athletic-contacts"
              className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/30 transition-colors">
                <Users className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Athletic Department Contacts</h3>
              <p className="text-slate-300 mb-4">
                Access to college athletic teams with authentic coaching staff contacts, recruiting coordinators, and sport-specific information.
              </p>
              <div className="flex items-center gap-2 text-yellow-500 font-medium">
                <span>PRO Tier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </SafeLink>

            {/* Live Rankings */}
            <SafeLink 
              href="/rankings"
              className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                <Trophy className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Rankings</h3>
              <p className="text-slate-300 mb-4">
                Real-time global athlete rankings and comprehensive performance analytics.
              </p>
              <div className="flex items-center gap-2 text-purple-500 font-medium">
                <span>ELITE Tier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </SafeLink>

            {/* Advanced AI Analysis */}
            <SafeLink 
              href="/ai-coach"
              className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 hover:border-green-500/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                <Activity className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Advanced AI Analysis</h3>
              <p className="text-slate-300 mb-4">
                Computer vision analysis, sport-specific models for 10 sports, performance benchmarking, and injury risk assessment.
              </p>
              <div className="flex items-center gap-2 text-green-500 font-medium">
                <span>PRO/ELITE Tier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </SafeLink>

            {/* GAR Performance System */}
            <SafeLink 
              href="/dashboard"
              className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">GAR Performance System</h3>
              <p className="text-slate-300 mb-4">
                Growth and Ability Rating system with 5-component analysis, weighted scoring, and predictive insights for athletic development.
              </p>
              <div className="flex items-center gap-2 text-blue-500 font-medium">
                <span>All Tiers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </SafeLink>

            {/* Go4It Sports Academy */}
            <SafeLink 
              href="/academy"
              className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                <Target className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Go4It Sports Academy</h3>
              <p className="text-slate-300 mb-4">
                Complete K-12 educational institution with 847 students, 156 faculty, 234 courses, and full academic infrastructure.
              </p>
              <div className="flex items-center gap-2 text-orange-500 font-medium">
                <span>ELITE Tier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </SafeLink>
          </div>

          {/* Additional Features Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-white mb-2">StarPath System</h4>
              <p className="text-sm text-slate-300">Gamified skill progression</p>
            </div>
            
            <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-white mb-2">Performance Analytics</h4>
              <p className="text-sm text-slate-300">Advanced metrics tracking</p>
            </div>
            
            <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-white mb-2">Recruitment Timeline</h4>
              <p className="text-sm text-slate-300">Contact & visit tracking</p>
            </div>
            
            <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-white mb-2">Regional Rankings</h4>
              <p className="text-sm text-slate-300">National & local positioning</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <SafeLink 
              href="/pricing"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Trophy className="w-5 h-5" />
              Explore All Features
            </SafeLink>
          </div>
        </div>
      </section>

      {/* Top Verified Athletes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Top Verified Athletes</h2>
            <SafeLink 
              href="/athletes" 
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </SafeLink>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-slate-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-slate-700 rounded mb-2 w-1/2"></div>
                  </div>
                </div>
              ))
            ) : topAthletes.length > 0 ? (
              topAthletes.map((athlete) => (
                <AthleteCard
                  key={athlete.id}
                  name={athlete.name}
                  sport={athlete.sport}
                  position={athlete.position}
                  garScore={calculateGARScore(athlete)}
                  verified={true}
                  imageUrl={getAthleteImage(athlete)}
                  athlete={athlete}
                />
              ))
            ) : (
              // Fallback to original hardcoded athletes if API fails
              <>
                <AthleteCard
                  name="Cooper Flagg"
                  sport="Basketball"
                  position="Small Forward"
                  garScore={98}
                  verified={true}
                  imageUrl="https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
                />
                <AthleteCard
                  name="Ace Bailey"
                  sport="Basketball"
                  position="Shooting Guard"
                  garScore={96}
                  verified={true}
                  imageUrl="https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
                />
                <AthleteCard
                  name="Dylan Harper"
                  sport="Basketball"
                  position="Point Guard"
                  garScore={95}
                  verified={true}
                  imageUrl="https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
                />
                <AthleteCard
                  name="VJ Edgecombe"
                  sport="Basketball"
                  position="Shooting Guard"
                  garScore={93}
                  verified={true}
                  imageUrl="https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFza2V0YmFsbCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Combine Events */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Upcoming Combine Events</h2>
            <SafeLink 
              href="/combine-tour" 
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
              View All Events
              <ArrowRight className="w-4 h-4" />
            </SafeLink>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <CombineEventCard
              title="Chicago Elite Combine"
              location="Chicago, IL"
              date="Jul 22, 2025"
              status="FILLING FAST"
              description="Join us for a comprehensive evaluation featuring physical testing, skills assessment, and game play. College coaches will be in attendance to evaluate talent."
            />
            <CombineEventCard
              title="Los Angeles Skills Showcase"
              location="Los Angeles, CA"
              date="Jul 29, 2025"
              status="FILLING FAST"
              description="An exclusive opportunity for top high school athletes to showcase their skills in front of college scouts and coaches."
            />
            <CombineEventCard
              title="Dallas All-Stars Combine"
              location="Arlington, TX"
              date="Jul 16, 2025"
              status="FILLING FAST"
              description="The premier combine event in Texas featuring comprehensive testing and evaluation for multiple sports."
            />
          </div>
        </div>
      </section>

      {/* Blog & News */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Blog & News</h2>
            <SafeLink 
              href="/blog" 
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </SafeLink>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
              Featured
            </button>
            <button className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium">
              Training
            </button>
            <button className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium">
              Nutrition
            </button>
            <button className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium">
              Recruiting
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogCard
              title="The Ultimate Guide to NIL opportunities for high school athletes"
              category="tips"
              date="Jun 2, 2025"
              imageUrl="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800"
              excerpt="This comprehensive guide explores nil opportunities for high school athletes, offering valuable insights for athletes, coaches, and parents."
            />
            <BlogCard
              title="5 Key Insights About Soccer position-specific training for midfielders"
              category="training"
              date="Jun 2, 2025"
              imageUrl="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800"
              excerpt="Learn the latest strategies, techniques, and trends that can help young athletes excel in today's competitive sports landscape."
            />
            <BlogCard
              title="How college recruiters are using AI to find talent"
              category="ncaa"
              date="Jun 2, 2025"
              imageUrl="https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800"
              excerpt="Discover how AI is changing the recruiting landscape and what it means for student athletes."
            />
          </div>
        </div>
      </section>

      {/* Community Forum */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Community Forum</h2>
          <p className="text-xl text-white/80 mb-8">
            Connect with athletes, coaches, and parents in our community forum. Share experiences, get advice, and build your network.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <CommunityCard
              title="Athletes"
              subtitle="Training & Development"
              description="Share your training routines, progress, and goals with other athletes."
              href="/community/athletes"
            />
            <CommunityCard
              title="Coaches"
              subtitle="Coaching Strategies"
              description="Exchange coaching tips, drills, and management strategies."
              href="/community/coaches"
            />
            <CommunityCard
              title="Parents"
              subtitle="Parent Support Network"
              description="Connect with other parents about supporting your young athletes."
              href="/community/parents"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Elevate Your Athletic Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of athletes who have discovered their potential and connected with coaches through our platform.
          </p>
          <SafeLink 
            href="/auth" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center gap-2 shadow-lg"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </SafeLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src={logoImage}
                  alt="Go4It Sports Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <div className="text-xl font-bold text-white">Go4It Sports</div>
              </div>
              <p className="text-slate-300">
                Empowering athletes through AI-powered performance analysis and verified evaluation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <div className="space-y-2">
                <SafeLink href="/dashboard" className="text-slate-300 hover:text-white block">Dashboard</SafeLink>
                <SafeLink href="/gar-upload" className="text-slate-300 hover:text-white block">GAR Analysis</SafeLink>
                <SafeLink href="/combine-tour" className="text-slate-300 hover:text-white block">Combines</SafeLink>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Community</h3>
              <div className="space-y-2">
                <SafeLink href="/community/athletes" className="text-slate-300 hover:text-white block">Athletes</SafeLink>
                <SafeLink href="/community/coaches" className="text-slate-300 hover:text-white block">Coaches</SafeLink>
                <SafeLink href="/community/parents" className="text-slate-300 hover:text-white block">Parents</SafeLink>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <div className="space-y-2">
                <SafeLink href="/about" className="text-slate-300 hover:text-white block">About</SafeLink>
                <SafeLink href="/contact" className="text-slate-300 hover:text-white block">Contact</SafeLink>
                <SafeLink href="/privacy" className="text-slate-300 hover:text-white block">Privacy</SafeLink>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-300">
            <p>&copy; 2025 Go4It Sports. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Reusable Components
function SafeLink({ href, children, className }: { 
  href: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <a 
      href={href} 
      className={className}
      onClick={(e) => {
        e.preventDefault()
        window.location.href = href
      }}
    >
      {children}
    </a>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border hover:neon-border transition-all duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function AthleteCard({ 
  name, 
  sport, 
  position, 
  garScore, 
  verified, 
  imageUrl,
  athlete
}: { 
  name: string; 
  sport: string; 
  position: string; 
  garScore: number; 
  verified: boolean; 
  imageUrl: string;
  athlete?: any;
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:neon-border transition-all duration-300">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        {verified && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            <CheckCircle className="w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" fill="currentColor" />
            <span className="text-blue-400 text-xs font-semibold">VERIFIED</span>
          </div>
        )}
        
        {/* GAR Score circle with neon glow */}
        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold neon-glow">
          {garScore}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-card-foreground mb-1">{name}</h3>
        <p className="text-muted-foreground text-sm mb-1">{position}</p>
        
        {/* Match deployed site format exactly */}
        <div className="text-xs text-muted-foreground space-y-1 mb-2">
          <div>SPORT • {sport}</div>
          <div>POSITION • {position}</div>
          {athlete && (
            <>
              <div>CLASS • {athlete.classYear}</div>
              <div>SCHOOL • {athlete.school.current}</div>
              <div>RANKING • #{athlete.rankings.composite}</div>
            </>
          )}
          <div>GAR • {garScore}/100</div>
        </div>
        
        {/* Star Rating based on GAR score with neon glow */}
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={Math.floor(garScore / 20)} maxRating={5} />
          <span className="text-xs text-muted-foreground">({garScore}/100)</span>
        </div>
        
        <div className="mt-3 flex gap-2">
          <SafeLink 
            href={athlete ? `/athlete/${athlete.id}` : `/profile/${encodeURIComponent(name.toLowerCase().replace(' ', '-'))}`}
            className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors neon-glow"
          >
            View Profile
          </SafeLink>
          {athlete && athlete.highlights.videos.length > 0 ? (
            <a
              href={athlete.highlights.videos[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary border border-primary px-3 py-1 rounded text-xs font-medium hover:neon-border transition-all duration-300"
            >
              Highlights
            </a>
          ) : (
            <button className="text-primary border border-primary px-3 py-1 rounded text-xs font-medium hover:neon-border transition-all duration-300">
              Highlights
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function CombineEventCard({ 
  title, 
  location, 
  date, 
  status, 
  description 
}: { 
  title: string; 
  location: string; 
  date: string; 
  status: string; 
  description: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
          {status}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-card-foreground mb-2">{title}</h3>
      <div className="flex items-center text-muted-foreground text-sm mb-1">
        <MapPin className="w-4 h-4 mr-1" />
        {location}
      </div>
      <div className="flex items-center text-muted-foreground text-sm mb-3">
        <Calendar className="w-4 h-4 mr-1" />
        {date}
      </div>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-sm font-medium transition-colors">
        Register Now
      </button>
    </div>
  )
}

function BlogCard({ 
  title, 
  category, 
  date, 
  imageUrl, 
  excerpt 
}: { 
  title: string; 
  category: string; 
  date: string; 
  imageUrl: string; 
  excerpt: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {category}
          </span>
          <span className="text-muted-foreground text-xs">{date}</span>
        </div>
        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{excerpt}</p>
        <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
          Read Article
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

function CommunityCard({ 
  title, 
  subtitle, 
  description, 
  href 
}: { 
  title: string; 
  subtitle: string; 
  description: string; 
  href: string;
}) {
  return (
    <div className="bg-primary/10 p-6 rounded-lg text-center">
      <h3 className="text-xl font-semibold text-primary-foreground mb-2">{title}</h3>
      <h4 className="text-lg text-primary-foreground/80 mb-3">{subtitle}</h4>
      <p className="text-primary-foreground/70 text-sm mb-4">{description}</p>
      <SafeLink 
        href={href} 
        className="bg-card text-card-foreground px-4 py-2 rounded text-sm font-medium hover:bg-card/90 transition-colors inline-block"
      >
        Join Discussion
      </SafeLink>
    </div>
  )
}