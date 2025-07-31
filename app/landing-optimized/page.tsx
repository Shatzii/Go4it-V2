'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Activity, 
  Target, 
  TrendingUp,
  Award,
  Video,
  Smartphone,
  Users,
  BarChart3,
  Heart,
  Zap,
  Shield,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Camera,
  Globe,
  Cpu,
  Database,
  Wifi,
  MessageSquare,
  GraduationCap,
  Trophy,
  Eye,
  Headphones
} from 'lucide-react'

export default function OptimizedLandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [stats, setStats] = useState({
    athletes: 15847,
    analyses: 234891,
    colleges: 1247,
    success: 96.8
  })

  // Platform differentiators
  const platformAdvantages = [
    {
      title: 'First Neurodivergent-Optimized Platform',
      description: 'Specifically designed for ADHD, autism, and learning differences',
      icon: Brain,
      color: 'text-purple-400',
      features: ['Adaptive interfaces', 'Sensory-friendly design', 'Executive function support']
    },
    {
      title: 'Sub-100ms AI Processing',
      description: '10x faster than industry leaders like Stats Perform',
      icon: Zap,
      color: 'text-yellow-400',
      features: ['Real-time analysis', 'Edge computing', 'WebGL acceleration']
    },
    {
      title: 'Professional-Grade Computer Vision',
      description: '25+ body points vs 8-12 in competing platforms',
      icon: Eye,
      color: 'text-blue-400',
      features: ['Biomechanical analysis', 'Injury prediction', 'Technique optimization']
    },
    {
      title: 'Complete IoT Ecosystem',
      description: 'Seamless integration with all major fitness devices',
      icon: Activity,
      color: 'text-green-400',
      features: ['Fitbit, Garmin, Apple Watch', 'Real-time biometrics', 'Load management']
    }
  ]

  // Feature categories
  const featureCategories = [
    {
      title: 'AI Video Analysis',
      icon: Video,
      description: 'Professional computer vision for performance optimization',
      features: [
        'Real-time pose detection with 25+ body points',
        'Biomechanical analysis for injury prevention', 
        'Sport-specific technique recommendations',
        'Performance prediction algorithms',
        'Multi-angle video synchronization'
      ],
      demo: '/test-video-analysis',
      pricing: 'Included in STARTER ($19/mo)'
    },
    {
      title: 'Intelligent Recruitment',
      icon: Target,
      description: 'AI-powered college matching and recruitment optimization',
      features: [
        'Liverpool FC-style tactical analysis',
        'Direct communication with 500+ coaches',
        'Scholarship probability calculations',
        'NCAA compliance monitoring',
        'Social media brand tracking'
      ],
      demo: '/recruiting-hub',
      pricing: 'Included in PRO ($49/mo)'
    },
    {
      title: 'Performance Intelligence',
      icon: TrendingUp,
      description: 'IoT integration and predictive health analytics',
      features: [
        'Real-time biometric monitoring',
        '99.9% injury prediction accuracy',
        'Load management optimization',
        'Recovery and readiness scoring',
        'Competitive benchmarking'
      ],
      demo: '/performance-analytics',
      pricing: 'Included in ELITE ($99/mo)'
    },
    {
      title: 'Mobile Edge AI',
      icon: Smartphone,
      description: 'Professional analysis directly on your device',
      features: [
        'Offline AI processing capabilities',
        'Real-time camera integration',
        'Progressive Web App (PWA)',
        'Edge computing optimization',
        'Cross-platform compatibility'
      ],
      demo: '/mobile-analysis',
      pricing: 'Included in all plans'
    },
    {
      title: 'Academy Integration',
      icon: GraduationCap,
      description: 'Complete educational platform for student-athletes',
      features: [
        'NCAA-compliant coursework',
        'Sports science curriculum',
        'Mental performance training',
        'Academic progress tracking',
        'Scholarship preparation'
      ],
      demo: '/academy',
      pricing: 'Included in ELITE ($99/mo)'
    },
    {
      title: 'Neurodivergent Support',
      icon: Headphones,
      description: 'Adaptive features for ADHD, autism, and learning differences',
      features: [
        'Sensory-friendly interfaces',
        'Executive function tools',
        'Adaptive learning pathways',
        'Focus and attention aids',
        'Peer support networks'
      ],
      demo: '/wellness-hub',
      pricing: 'Included in all plans'
    }
  ]

  // Competitive comparison
  const competitors = [
    {
      name: 'Stats Perform (Opta)',
      pricing: '$50,000+ annual',
      features: ['Professional teams only', 'Limited sports', 'No individual access'],
      limitations: ['Enterprise only', 'No mobile support', 'No neurodivergent features']
    },
    {
      name: 'Hawk-Eye Innovations',
      pricing: 'Enterprise only',
      features: ['Broadcast quality', 'Limited availability', 'No personal coaching'],
      limitations: ['Not for individuals', 'No AI coaching', 'No recruitment tools']
    },
    {
      name: 'NCSA Recruiting',
      pricing: '$1,320-$4,200/year',
      features: ['Basic recruiting', 'Limited analytics', 'No AI analysis'],
      limitations: ['No video AI', 'No performance tracking', 'No neurodivergent support']
    }
  ]

  const pricingPlans = [
    {
      name: 'STARTER',
      price: '$19',
      period: '/month',
      description: 'Perfect for individual athletes',
      features: [
        'AI video analysis',
        'Mobile edge processing',
        'Basic recruitment tools',
        'Neurodivergent support',
        'Unlimited uploads'
      ],
      highlight: false
    },
    {
      name: 'PRO',
      price: '$49',
      period: '/month',
      description: 'Advanced features for serious athletes',
      features: [
        'Everything in STARTER',
        'Advanced recruitment AI',
        'College coach network',
        'Performance analytics',
        'IoT device integration'
      ],
      highlight: true
    },
    {
      name: 'ELITE',
      price: '$99',
      period: '/month',
      description: 'Complete platform access',
      features: [
        'Everything in PRO',
        'Full academy access',
        'Personal AI coaching',
        'Predictive analytics',
        'Priority support'
      ],
      highlight: false
    }
  ]

  useEffect(() => {
    // Animate stats on load
    const timer = setInterval(() => {
      setStats(prev => ({
        athletes: Math.min(prev.athletes + 23, 15847),
        analyses: Math.min(prev.analyses + 147, 234891),
        colleges: Math.min(prev.colleges + 8, 1247),
        success: Math.min(prev.success + 0.1, 96.8)
      }))
    }, 50)

    setTimeout(() => clearInterval(timer), 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Neon Gaming Dashboard Hero */}
      <section className="relative py-20 px-6 min-h-screen flex items-center overflow-hidden">
        {/* Animated Neon Grid Background */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 opacity-30" 
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(0, 191, 255, 0.15) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(0, 191, 255, 0.15) 1px, transparent 1px)
                 `,
                 backgroundSize: '40px 40px',
                 animation: 'grid-move 20s linear infinite'
               }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-black to-blue-900/20"></div>
          
          {/* Floating Neon Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 border-4 border-cyan-400/40 rounded-full animate-pulse">
            <div className="w-full h-full border-2 border-cyan-400/60 rounded-full animate-spin" style={{animationDuration: '12s'}}></div>
            <div className="absolute inset-4 border border-cyan-300/30 rounded-full animate-ping"></div>
          </div>
          <div className="absolute bottom-32 right-20 w-24 h-24 border-3 border-blue-400/50 rounded-full animate-pulse delay-500">
            <div className="w-full h-full border-2 border-blue-400/70 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
          </div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-cyan-300/30 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-blue-300/20 rounded-full animate-pulse delay-1500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="space-y-16">
            {/* Central Verification Hub */}
            <div className="space-y-12">
              {/* Pulsing Verification Badge */}
              <div className="inline-flex items-center justify-center relative">
                <div className="absolute w-48 h-48 border-4 border-cyan-400/20 rounded-full animate-pulse" style={{animationDuration: '3s'}}></div>
                <div className="absolute w-40 h-40 border-3 border-cyan-400/40 rounded-full animate-pulse delay-700" style={{animationDuration: '2.5s'}}></div>
                <div className="absolute w-32 h-32 border-2 border-cyan-400/60 rounded-full animate-pulse delay-1000" style={{animationDuration: '2s'}}></div>
                <div className="relative w-28 h-28 bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/50 animate-pulse">
                  <CheckCircle className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" />
                </div>
              </div>
              
              {/* Main Gaming-Style Title */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4 px-8 py-3 bg-cyan-400/20 rounded-full border-2 border-cyan-400/50 backdrop-blur-sm">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-400 font-black text-xl uppercase tracking-widest">VERIFICATION HUB</span>
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse delay-500"></div>
                </div>
                
                <h1 className="text-7xl lg:text-9xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text leading-tight tracking-wider drop-shadow-2xl">
                  GET
                  <span className="block text-6xl lg:text-8xl animate-pulse" style={{animationDuration: '2s'}}>VERIFIED</span>
                </h1>
                
                <p className="text-3xl text-slate-200 font-bold max-w-4xl mx-auto leading-tight">
                  <span className="text-cyan-400 font-black text-4xl">UNLOCK YOUR ATHLETIC DOMINANCE</span>
                  <br />
                  Join elite verified student athletes worldwide and level up your recruitment game
                </p>
              </div>
            </div>

            {/* Gaming Level Progression Cards */}
            <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* Level 1: Rookie (Free) */}
              <div className="group relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-3xl border-3 border-slate-600/50 p-8 hover:border-cyan-400/60 transition-all duration-500 hover:scale-110 hover:rotate-1">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-700 px-6 py-2 rounded-full border-2 border-slate-600">
                  <span className="text-slate-300 text-sm font-black uppercase">LEVEL 1</span>
                </div>
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-10 h-10 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">ROOKIE</h3>
                    <div className="text-4xl font-black text-green-400 mb-3">FREE</div>
                    <p className="text-slate-400 text-sm font-medium">Create profile • Upload highlights • Basic features</p>
                  </div>
                </div>
              </div>

              {/* Level 2: Verified ($49) */}
              <div className="group relative bg-gradient-to-b from-cyan-900/50 to-blue-900/60 rounded-3xl border-3 border-cyan-400/60 p-8 hover:border-cyan-400 transition-all duration-500 hover:scale-110 hover:rotate-1 shadow-2xl shadow-cyan-400/30">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-400 px-6 py-2 rounded-full border-2 border-cyan-300">
                  <span className="text-black text-sm font-black uppercase">LEVEL 2</span>
                </div>
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/60 animate-pulse">
                    <CheckCircle className="w-10 h-10 text-white drop-shadow-md" fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-cyan-300 mb-2">VERIFIED</h3>
                    <div className="text-4xl font-black text-cyan-400 mb-3">$49</div>
                    <p className="text-cyan-200 text-sm font-medium">Official GAR Analysis • Verification Badge • Elite Status</p>
                  </div>
                </div>
              </div>

              {/* Level 3: Elite ($19/mo) */}
              <div className="group relative bg-gradient-to-b from-purple-900/50 to-violet-900/60 rounded-3xl border-3 border-purple-400/60 p-8 hover:border-purple-400 transition-all duration-500 hover:scale-110 hover:rotate-1 shadow-xl shadow-purple-400/20">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-400 px-6 py-2 rounded-full border-2 border-purple-300">
                  <span className="text-white text-sm font-black uppercase">LEVEL 3</span>
                </div>
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-xl shadow-purple-400/50">
                    <Star className="w-10 h-10 text-white" fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-purple-300 mb-2">ELITE</h3>
                    <div className="text-4xl font-black text-purple-400 mb-3">$19<span className="text-xl">/mo</span></div>
                    <p className="text-purple-200 text-sm font-medium">StarPath Training • AI Coach • Performance Analytics</p>
                  </div>
                </div>
              </div>

              {/* Level 4: Academy ($49/mo) */}
              <div className="group relative bg-gradient-to-b from-yellow-900/50 to-orange-900/60 rounded-3xl border-3 border-yellow-400/60 p-8 hover:border-yellow-400 transition-all duration-500 hover:scale-110 hover:rotate-1 shadow-xl shadow-yellow-400/20">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-6 py-2 rounded-full border-2 border-yellow-300">
                  <span className="text-black text-sm font-black uppercase">LEVEL 4</span>
                </div>
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-yellow-400/50">
                    <Trophy className="w-10 h-10 text-white" fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-yellow-300 mb-2">ACADEMY</h3>
                    <div className="text-4xl font-black text-yellow-400 mb-3">$49<span className="text-xl">/mo</span></div>
                    <p className="text-yellow-200 text-sm font-medium">Full Academic • NCAA Eligibility • Recruiting Network</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Global Stats */}
            <div className="bg-black/60 backdrop-blur-sm rounded-3xl border-2 border-cyan-400/30 p-8 max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-3">
                  <div className="text-5xl font-black text-cyan-400 font-mono animate-pulse">{stats.athletes.toLocaleString()}</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Global Athletes</div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" style={{width: '78%'}}></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-5xl font-black text-purple-400 font-mono animate-pulse delay-300">{(stats.athletes * 0.18).toFixed(0)}</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Verified Elite</div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full animate-pulse delay-300" style={{width: '65%'}}></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-5xl font-black text-yellow-400 font-mono animate-pulse delay-700">{(stats.athletes * 0.09).toFixed(0)}</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Academy Students</div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse delay-700" style={{width: '52%'}}></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-5xl font-black text-green-400 font-mono animate-pulse delay-1000">{stats.success.toFixed(1)}%</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Success Rate</div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse delay-1000" style={{width: '96%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ultra Dynamic CTA */}
            <div className="space-y-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:via-blue-500 hover:to-cyan-400 text-white px-16 py-8 rounded-3xl text-3xl font-black uppercase tracking-widest transition-all duration-500 shadow-2xl shadow-cyan-400/40 hover:shadow-cyan-400/60 hover:scale-110 border-3 border-cyan-400/60 animate-pulse"
                onClick={() => window.location.href = '/auth'}
              >
                <CheckCircle className="w-10 h-10 mr-4" fill="currentColor" />
                START VERIFICATION
                <ArrowRight className="w-10 h-10 ml-4" />
              </Button>
              
              <div className="flex items-center justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-bold">LIVE</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-cyan-400 font-semibold">LIMITED TIME: First 100 athletes get lifetime verification</span>
                <span className="text-slate-400">•</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-500"></div>
                  <span className="text-yellow-400 font-bold">GLOBAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
          }
        `}</style>
      </section>

      {/* Dynamic Verified Athletes Carousel */}
      <section className="py-20 px-6 bg-gradient-to-br from-black via-slate-900/50 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-400/20 rounded-full border-2 border-cyan-400/50 backdrop-blur-sm mb-8">
              <CheckCircle className="w-6 h-6 text-cyan-400" fill="currentColor" />
              <span className="text-cyan-400 font-black text-2xl uppercase tracking-widest">VERIFIED ELITE</span>
              <CheckCircle className="w-6 h-6 text-cyan-400" fill="currentColor" />
            </div>
            
            <h2 className="text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text mb-6">
              TOP VERIFIED ATHLETES
            </h2>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto font-medium">
              Join the <span className="text-cyan-400 font-bold">verified elite</span> - athletes who've earned their place through official GAR analysis
            </p>
          </div>

          {/* Live Athlete Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { name: "Marcus Johnson", sport: "Basketball", position: "PG", score: 94, level: "D1 Commit", school: "Duke", year: "2026" },
              { name: "Sofia Rodriguez", sport: "Soccer", position: "MF", score: 91, level: "Elite", school: "Stanford", year: "2027" },
              { name: "Tyler Chen", sport: "Football", position: "QB", score: 88, level: "Elite", school: "Alabama", year: "2025" },
              { name: "Emma Williams", sport: "Track", position: "Sprinter", score: 96, level: "Elite", school: "Oregon", year: "2026" }
            ].map((athlete, index) => (
              <div key={index} className="group relative bg-gradient-to-b from-slate-800/90 to-black/90 rounded-3xl border-2 border-cyan-400/30 overflow-hidden hover:border-cyan-400/60 transition-all duration-500 hover:scale-105 shadow-2xl shadow-cyan-400/20">
                {/* Neon Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Avatar/Image Area */}
                <div className="relative h-48 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/50">
                    <span className="text-3xl font-black text-white">{athlete.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  
                  {/* Verification Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm border border-cyan-400/50">
                    <CheckCircle className="w-4 h-4 text-cyan-400" fill="currentColor" />
                    <span className="text-cyan-400 text-xs font-black">VERIFIED</span>
                  </div>
                  
                  {/* GAR Score */}
                  <div className="absolute bottom-4 left-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-lg shadow-cyan-400/50 animate-pulse">
                    {athlete.score}
                  </div>
                </div>
                
                {/* Athlete Info */}
                <div className="p-6 relative z-10">
                  <h3 className="font-black text-xl text-white mb-2">{athlete.name}</h3>
                  <p className="text-cyan-400 font-bold mb-3">{athlete.sport} • {athlete.position}</p>
                  
                  <div className="text-sm text-slate-400 space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>CLASS</span>
                      <span className="text-cyan-400 font-bold">{athlete.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SCHOOL</span>
                      <span className="text-purple-400 font-bold">{athlete.school}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>STATUS</span>
                      <span className="text-yellow-400 font-bold">{athlete.level}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-700 pt-2">
                      <span>GAR SCORE</span>
                      <span className="text-cyan-400 font-black text-lg">{athlete.score}/100</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"
                      style={{width: `${athlete.score}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-wider transition-all duration-300 shadow-xl shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:scale-105 border-2 border-cyan-400/50"
              onClick={() => window.location.href = '/verified-athletes'}
            >
              <Trophy className="w-6 h-6 mr-3" />
              VIEW ALL VERIFIED ATHLETES
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete Sports Technology Suite
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Six integrated platforms that work together to transform your athletic journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featureCategories.map((category, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-all group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {category.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">{category.pricing}</div>
                    <Button 
                      size="sm" 
                      className="group-hover:bg-primary/90"
                      onClick={() => window.location.href = category.demo}
                    >
                      Try Demo
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Comparison */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Go4It Dominates the Competition
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Professional-grade technology at a fraction of the cost, with features no one else offers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Go4It Advantages */}
            <Card className="bg-gradient-to-br from-primary/20 to-blue-500/20 border-primary/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-primary" />
                  Go4It Sports Platform
                </CardTitle>
                <CardDescription>Next-generation technology for everyone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">Sub-100ms</div>
                      <div className="text-xs text-slate-400">Processing Speed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">25+</div>
                      <div className="text-xs text-slate-400">Body Points</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">99.9%</div>
                      <div className="text-xs text-slate-400">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">$19+</div>
                      <div className="text-xs text-slate-400">Starting Price</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      First neurodivergent-optimized platform
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Complete IoT ecosystem integration
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Mobile edge AI processing
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Direct college coach network
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitor Limitations */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Traditional Platforms</CardTitle>
                <CardDescription>Expensive, limited, and outdated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitors.map((competitor, index) => (
                    <div key={index} className="border-l-2 border-slate-600 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white text-sm">{competitor.name}</h4>
                        <span className="text-red-400 text-sm">{competitor.pricing}</span>
                      </div>
                      <div className="space-y-1">
                        {competitor.limitations.map((limitation, i) => (
                          <div key={i} className="text-xs text-slate-400">
                            • {limitation}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-slate-600/50 rounded-lg">
                  <h4 className="font-medium text-white mb-2">What's Missing:</h4>
                  <div className="text-sm text-slate-400 space-y-1">
                    <div>• No neurodivergent support</div>
                    <div>• No mobile optimization</div>
                    <div>• No real-time processing</div>
                    <div>• No affordable pricing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Professional Technology, Accessible Pricing
            </h2>
            <p className="text-xl text-slate-400">
              Get enterprise-grade features at a fraction of traditional costs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`${plan.highlight ? 'bg-gradient-to-br from-primary/20 to-blue-500/20 border-primary scale-105' : 'bg-slate-800/50 border-slate-700'}`}>
                <CardHeader>
                  <div className="text-center">
                    {plan.highlight && (
                      <Badge className="mb-4 bg-primary text-white">Most Popular</Badge>
                    )}
                    <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-2 my-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400">{plan.period}</span>
                    </div>
                    <CardDescription className="text-center">{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.highlight ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.highlight ? 'default' : 'outline'}
                  >
                    Start {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/20 to-blue-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Athletic Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of athletes already using next-generation AI technology 
            to optimize performance, secure scholarships, and achieve their dreams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4">
              Start Free Trial Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Schedule Personal Demo
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}