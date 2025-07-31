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
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="text-primary border-primary mb-4">
              Next-Generation Sports Technology
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="text-white">Athletic Development</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto mb-8">
              AI-powered sports analysis, intelligent recruitment, and neurodivergent-optimized learning. 
              The only platform designed specifically for the unique needs of every athlete.
            </p>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.athletes.toLocaleString()}+
              </div>
              <div className="text-slate-400">Athletes Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {stats.analyses.toLocaleString()}+
              </div>
              <div className="text-slate-400">AI Analyses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                {stats.colleges.toLocaleString()}+
              </div>
              <div className="text-slate-400">College Connections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                {stats.success.toFixed(1)}%
              </div>
              <div className="text-slate-400">Success Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Platform Differentiators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformAdvantages.map((advantage, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <advantage.icon className={`w-12 h-12 ${advantage.color} mx-auto mb-4`} />
                  <h3 className="font-semibold text-white mb-2">{advantage.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{advantage.description}</p>
                  <div className="space-y-1">
                    {advantage.features.map((feature, i) => (
                      <div key={i} className="text-xs text-slate-500">• {feature}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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