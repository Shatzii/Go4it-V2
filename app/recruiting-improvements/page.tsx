'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Users, 
  TrendingUp, 
  Calendar,
  Award,
  MessageSquare,
  BarChart3,
  Camera,
  Shield,
  Brain,
  Globe,
  Heart
} from 'lucide-react';

export default function RecruitingImprovementsPage() {
  const [selectedTier, setSelectedTier] = useState('all');

  const improvements = [
    {
      id: 1,
      title: "Live Recruiting Tracker",
      description: "Real-time tracking of all recruiting activities with coach interactions, visits, and timeline views",
      tier: "immediate",
      timeframe: "1-2 weeks",
      impact: "High",
      icon: TrendingUp,
      color: "bg-green-500",
      features: [
        "Live dashboard with coach interactions",
        "Timeline view of recruiting process",
        "Automated follow-up reminders",
        "Status updates and progress tracking",
        "Integration with phone/email logging"
      ]
    },
    {
      id: 2,
      title: "Coach Communication Hub",
      description: "Direct messaging system between athletes and coaches with compliance monitoring",
      tier: "immediate",
      timeframe: "1-2 weeks",
      impact: "High",
      icon: MessageSquare,
      color: "bg-blue-500",
      features: [
        "Verified coach accounts",
        "Message templates for first contact",
        "File sharing for highlights",
        "Read receipts and response tracking",
        "NCAA compliance monitoring"
      ]
    },
    {
      id: 3,
      title: "Smart School Matching Engine",
      description: "AI-powered algorithm matching athletes to perfect schools based on academic and athletic fit",
      tier: "immediate",
      timeframe: "1-2 weeks",
      impact: "High",
      icon: Target,
      color: "bg-purple-500",
      features: [
        "Academic fit scoring",
        "Athletic fit analysis",
        "Geographic preferences",
        "Financial aid prediction",
        "Cultural fit assessment"
      ]
    },
    {
      id: 4,
      title: "Automated Highlight Reel Creator",
      description: "AI-powered video editing that creates perfect highlight reels automatically",
      tier: "competitive",
      timeframe: "3-4 weeks",
      impact: "High",
      icon: Camera,
      color: "bg-orange-500",
      features: [
        "AI finds best moments in footage",
        "Sport-specific highlight detection",
        "Automated editing with graphics",
        "Multiple versions for different schools",
        "Direct sharing to coaches"
      ]
    },
    {
      id: 5,
      title: "Transfer Portal Intelligence",
      description: "Real-time transfer portal tracking with opportunity alerts and roster predictions",
      tier: "competitive",
      timeframe: "3-4 weeks",
      impact: "High",
      icon: Users,
      color: "bg-red-500",
      features: [
        "Live transfer portal tracking",
        "Roster spot predictions",
        "Automated opportunity alerts",
        "Historical transfer data",
        "Connection to portal athletes"
      ]
    },
    {
      id: 6,
      title: "Scholarship Calculator & Negotiation Tools",
      description: "Financial aid optimization and negotiation assistance for maximum value",
      tier: "competitive",
      timeframe: "3-4 weeks",
      impact: "High",
      icon: Award,
      color: "bg-yellow-500",
      features: [
        "Scholarship offer comparison",
        "Financial aid analysis",
        "Negotiation strategies",
        "Market value assessment",
        "Cost-benefit analysis"
      ]
    },
    {
      id: 7,
      title: "Virtual Recruiting Events",
      description: "Online combines and showcases with live GAR scoring and coach viewing",
      tier: "disruptive",
      timeframe: "5-8 weeks",
      impact: "Very High",
      icon: Globe,
      color: "bg-indigo-500",
      features: [
        "Virtual combine events",
        "Live-streamed workouts",
        "Real-time GAR analysis",
        "1-on-1 coach meetings",
        "Recorded sessions"
      ]
    },
    {
      id: 8,
      title: "Predictive Recruitment Analytics",
      description: "Machine learning that predicts recruiting success and optimizes strategies",
      tier: "disruptive",
      timeframe: "5-8 weeks",
      impact: "Very High",
      icon: Brain,
      color: "bg-pink-500",
      features: [
        "Probability scoring for schools",
        "Optimal contact timing",
        "Success rate predictions",
        "Timeline optimization",
        "Risk assessment"
      ]
    },
    {
      id: 9,
      title: "Social Media Recruiting Amplifier",
      description: "Automated social media optimization for maximum athletic recruiting visibility",
      tier: "disruptive",
      timeframe: "5-8 weeks",
      impact: "High",
      icon: Star,
      color: "bg-teal-500",
      features: [
        "Automated highlight posting",
        "Hashtag optimization",
        "Content calendar management",
        "Engagement tracking",
        "Compliance monitoring"
      ]
    },
    {
      id: 10,
      title: "Personal Recruiting Coordinator",
      description: "Dedicated human coordinator for ELITE tier members with VIP service",
      tier: "premium",
      timeframe: "2-3 months",
      impact: "Very High",
      icon: Shield,
      color: "bg-violet-500",
      features: [
        "Personal strategist assignment",
        "Weekly 1-on-1 sessions",
        "Direct coach relationship management",
        "Application coordination",
        "24/7 support"
      ]
    },
    {
      id: 11,
      title: "Camp & Showcase Optimizer",
      description: "AI-powered recommendations for camps and showcases with ROI analysis",
      tier: "premium",
      timeframe: "2-3 months",
      impact: "High",
      icon: Calendar,
      color: "bg-cyan-500",
      features: [
        "ROI analysis for camps",
        "Coach attendance predictions",
        "Success rate data",
        "Cost-benefit analysis",
        "Automated registration"
      ]
    },
    {
      id: 12,
      title: "Alumni Network Connector",
      description: "Connection platform with former athletes for insider knowledge and mentorship",
      tier: "premium",
      timeframe: "2-3 months",
      impact: "High",
      icon: Heart,
      color: "bg-emerald-500",
      features: [
        "Alumni database by school",
        "Mentorship matching",
        "Insider program information",
        "Academic guidance",
        "Career networking"
      ]
    },
    {
      id: 13,
      title: "Virtual Reality Campus Visits",
      description: "VR technology for immersive campus experiences without travel costs",
      tier: "revolutionary",
      timeframe: "6+ months",
      impact: "Very High",
      icon: Zap,
      color: "bg-lime-500",
      features: [
        "360-degree campus tours",
        "Virtual coach meetings",
        "Interactive exploration",
        "Game day simulation",
        "Dorm and dining experiences"
      ]
    },
    {
      id: 14,
      title: "Injury Prevention & Recovery System",
      description: "AI-powered injury prediction and prevention with biomechanical analysis",
      tier: "revolutionary",
      timeframe: "6+ months",
      impact: "Very High",
      icon: Shield,
      color: "bg-rose-500",
      features: [
        "Injury risk analysis",
        "Training modifications",
        "Recovery protocols",
        "Medical network",
        "Insurance assistance"
      ]
    },
    {
      id: 15,
      title: "Academic Concierge Service",
      description: "Complete academic support for student-athletes with course optimization",
      tier: "revolutionary",
      timeframe: "6+ months",
      impact: "High",
      icon: BarChart3,
      color: "bg-amber-500",
      features: [
        "Course scheduling optimization",
        "Tutor matching",
        "Study abroad coordination",
        "Graduate school placement",
        "Career transition planning"
      ]
    }
  ];

  const tierColors = {
    immediate: "bg-green-500",
    competitive: "bg-blue-500",
    disruptive: "bg-purple-500",
    premium: "bg-orange-500",
    revolutionary: "bg-red-500"
  };

  const tierLabels = {
    immediate: "Immediate Game-Changers",
    competitive: "Competitive Dominance",
    disruptive: "Industry Disruption",
    premium: "Premium Game-Changers",
    revolutionary: "Revolutionary Features"
  };

  const filteredImprovements = selectedTier === 'all' 
    ? improvements 
    : improvements.filter(imp => imp.tier === selectedTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-500 text-white font-bold text-lg px-6 py-2">
            RECRUITING PLATFORM ROADMAP
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            15 GAME-CHANGING IMPROVEMENTS
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Transform Go4It Sports into the ultimate recruiting platform that dominates every competitor
          </p>
        </div>

        {/* Tier Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            onClick={() => setSelectedTier('all')}
            variant={selectedTier === 'all' ? 'default' : 'outline'}
            className="px-6 py-2"
          >
            All Tiers
          </Button>
          {Object.entries(tierLabels).map(([tier, label]) => (
            <Button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              variant={selectedTier === tier ? 'default' : 'outline'}
              className={`px-6 py-2 ${selectedTier === tier ? tierColors[tier] : 'border-slate-600'}`}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Improvements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImprovements.map((improvement) => {
            const Icon = improvement.icon;
            return (
              <Card key={improvement.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 ${improvement.color} rounded-full flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{improvement.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${tierColors[improvement.tier]} text-white text-xs`}>
                          {tierLabels[improvement.tier]}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {improvement.timeframe}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4 text-sm">{improvement.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-white text-sm">Key Features:</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {improvement.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Impact:</span>
                      <Badge 
                        className={`text-xs ${
                          improvement.impact === 'Very High' ? 'bg-red-500' :
                          improvement.impact === 'High' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        } text-white`}
                      >
                        {improvement.impact}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      #{improvement.id}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Implementation Timeline */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Implementation Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400">Phase 1: Foundation</CardTitle>
                <Badge className="w-fit bg-green-500 text-white">Month 1</Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Live Recruiting Tracker</li>
                  <li>• Coach Communication Hub</li>
                  <li>• Smart School Matching Engine</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Phase 2: Differentiation</CardTitle>
                <Badge className="w-fit bg-blue-500 text-white">Month 2</Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Automated Highlight Creator</li>
                  <li>• Transfer Portal Intelligence</li>
                  <li>• Scholarship Calculator</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400">Phase 3: Dominance</CardTitle>
                <Badge className="w-fit bg-purple-500 text-white">Month 3</Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Virtual Recruiting Events</li>
                  <li>• Predictive Analytics</li>
                  <li>• Social Media Amplifier</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Competitive Advantage */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">
                Why These Improvements Make Us Unbeatable
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">vs NCSA</div>
                  <p className="text-slate-300 text-sm">
                    Modern AI vs outdated technology. Better UX at fraction of cost.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">vs SportsRecruits</div>
                  <p className="text-slate-300 text-sm">
                    Comprehensive AI features vs basic functionality. Same value, lifetime access.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">vs Stack Sports</div>
                  <p className="text-slate-300 text-sm">
                    Revolutionary GAR scoring vs basic features. Premium service included.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 font-semibold text-lg">
                  Revenue Potential: $50-100M Annually
                </p>
                <p className="text-slate-300 text-sm mt-2">
                  Target Market: 500,000+ high school athletes • Serviceable Market: 100,000 serious recruits
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}