'use client'

import React from 'react'
import { Star, Trophy, Target, Brain, CheckCircle, ArrowRight, Play, Activity } from 'lucide-react'
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

// Simple Go4It Sports Landing Page
export default function Go4ItHomePageSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Clean Navigation */}
      <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
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
                  <span className="text-sm font-medium text-primary-foreground">Platform Status: Ready</span>
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
                  href="/starpath" 
                  className="border border-primary/50 hover:bg-primary/20 text-primary hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Star className="w-5 h-5" />
                  Explore StarPath
                </SafeLink>
              </div>
            </div>
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