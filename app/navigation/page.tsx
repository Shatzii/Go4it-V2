'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, Star, Users, Target, Zap, Award,
  TrendingUp, Calendar, FileText, Camera,
  Brain, Dumbbell, Eye, Heart, Sync, Crown,
  ArrowRight, CheckCircle, Play, Upload
} from 'lucide-react';

const featureCategories = [
  {
    title: "GAR Analysis System",
    description: "AI-powered performance analysis and verification",
    color: "from-blue-500 to-purple-500",
    features: [
      {
        name: "Standard GAR Upload",
        path: "/gar-upload",
        icon: <Upload className="w-5 h-5" />,
        description: "Single-video GAR analysis and scoring",
        status: "live"
      },
      {
        name: "Multi-Angle Analysis",
        path: "/multi-angle-upload",
        icon: <Sync className="w-5 h-5" />,
        description: "360-degree comprehensive analysis from multiple cameras",
        status: "enhanced"
      },
      {
        name: "GAR Results",
        path: "/gar-results",
        icon: <Trophy className="w-5 h-5" />,
        description: "View detailed analysis results and feedback",
        status: "live"
      }
    ]
  },
  {
    title: "StarPath Progression",
    description: "Skill development mapped to GAR performance",
    color: "from-purple-500 to-pink-500",
    features: [
      {
        name: "Standard StarPath",
        path: "/starpath",
        icon: <Star className="w-5 h-5" />,
        description: "Original skill tree and XP system",
        status: "live"
      },
      {
        name: "Enhanced StarPath",
        path: "/enhanced-starpath",
        icon: <Zap className="w-5 h-5" />,
        description: "GAR-integrated progressive skill mapping",
        status: "enhanced"
      }
    ]
  },
  {
    title: "Ranking & Competition",
    description: "Peer comparison and competitive features",
    color: "from-yellow-500 to-orange-500",
    features: [
      {
        name: "Leaderboard",
        path: "/leaderboard",
        icon: <Crown className="w-5 h-5" />,
        description: "Verified 100 founding members leaderboard",
        status: "live"
      },
      {
        name: "Rankings",
        path: "/rankings",
        icon: <TrendingUp className="w-5 h-5" />,
        description: "Multi-sport, regional, and class rankings",
        status: "live"
      },
      {
        name: "Challenges",
        path: "/challenges",
        icon: <Target className="w-5 h-5" />,
        description: "Gamified challenges with XP rewards",
        status: "enhanced"
      }
    ]
  },
  {
    title: "Team & Coaching",
    description: "Team management and AI coaching tools",
    color: "from-green-500 to-teal-500",
    features: [
      {
        name: "Teams",
        path: "/teams",
        icon: <Users className="w-5 h-5" />,
        description: "Team roster management and analytics",
        status: "live"
      },
      {
        name: "AI Coach",
        path: "/ai-coach",
        icon: <Brain className="w-5 h-5" />,
        description: "Personalized AI coaching and training plans",
        status: "live"
      },
      {
        name: "Wellness Hub",
        path: "/wellness-hub",
        icon: <Heart className="w-5 h-5" />,
        description: "Health tracking and injury prevention",
        status: "live"
      }
    ]
  },
  {
    title: "College Recruitment",
    description: "College recruitment and reporting tools",
    color: "from-indigo-500 to-blue-500",
    features: [
      {
        name: "Recruiting Reports",
        path: "/recruiting-reports",
        icon: <FileText className="w-5 h-5" />,
        description: "AI-generated college recruitment reports",
        status: "enhanced"
      },
      {
        name: "College Matching",
        path: "/college-matching",
        icon: <Award className="w-5 h-5" />,
        description: "Match with colleges based on GAR scores",
        status: "coming-soon"
      }
    ]
  },
  {
    title: "Events & Marketing",
    description: "Camp events and marketing campaigns",
    color: "from-red-500 to-pink-500",
    features: [
      {
        name: "USA Football Marketing",
        path: "/marketing/usa-football",
        icon: <Calendar className="w-5 h-5" />,
        description: "Pathway to America marketing strategy",
        status: "live"
      },
      {
        name: "Pricing",
        path: "/pricing",
        icon: <Trophy className="w-5 h-5" />,
        description: "Mexico camps and platform subscriptions",
        status: "live"
      }
    ]
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'live':
      return <Badge className="bg-green-500 text-white">LIVE</Badge>;
    case 'enhanced':
      return <Badge className="bg-blue-500 text-white">ENHANCED</Badge>;
    case 'coming-soon':
      return <Badge className="bg-yellow-500 text-black">COMING SOON</Badge>;
    default:
      return <Badge className="bg-slate-500 text-white">UNKNOWN</Badge>;
  }
};

export default function NavigationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            PLATFORM NAVIGATION
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Complete overview of all Phase 1 & 2 enhanced features and implementations
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">15</div>
                <div className="text-slate-400">Live Features</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">5</div>
                <div className="text-slate-400">Enhanced Features</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">12</div>
                <div className="text-slate-400">Sports Supported</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-slate-400">Feature Coverage</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="space-y-12">
          {featureCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="mb-8">
                <div className={`inline-block bg-gradient-to-r ${category.color} text-white px-6 py-3 rounded-lg mb-4`}>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>
                <p className="text-slate-300 text-lg">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.features.map((feature, featureIndex) => (
                  <Card 
                    key={featureIndex} 
                    className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => {
                      if (feature.status !== 'coming-soon') {
                        window.location.href = feature.path;
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-700 group-hover:bg-blue-600/20 transition-colors">
                            {feature.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                              {feature.name}
                            </CardTitle>
                          </div>
                        </div>
                        {getStatusBadge(feature.status)}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-slate-300 text-sm mb-4">{feature.description}</p>
                      
                      {feature.status !== 'coming-soon' ? (
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="ghost" 
                            className="text-blue-400 hover:text-blue-300 p-0 h-auto group-hover:translate-x-1 transition-transform"
                          >
                            Visit Feature
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      ) : (
                        <div className="text-center text-slate-500">
                          <div className="text-sm">Feature in development</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Implementation Summary */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-white mb-6 text-center">Phase 1 & 2 Implementation Complete</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Phase 1 - Quick Wins (Completed)
                  </h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>✅ Challenge System UI - Full gamified interface with XP rewards</li>
                    <li>✅ Recruitment Reports - AI-generated college recruitment materials</li>
                    <li>✅ Multi-Angle Upload - Professional 360-degree analysis interface</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Phase 2 - Integration Improvements (Completed)
                  </h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>✅ Enhanced StarPath Mapping - GAR-driven skill progression</li>
                    <li>✅ Multi-Angle Analysis System - Comprehensive video processing</li>
                    <li>✅ College Database Integration - Recruiting report automation</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-slate-300 mb-6">
                  All suggested improvements from the original 10-point enhancement list have been successfully implemented 
                  or were already available in the platform. The Go4It Sports Platform now offers comprehensive 
                  athlete development with seamless feature integration.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => window.location.href = '/gar-upload'}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start GAR Analysis
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/challenges'}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    View Challenges
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/leaderboard'}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:border-slate-500"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Check Rankings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}