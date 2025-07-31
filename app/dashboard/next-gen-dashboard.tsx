'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Camera
} from 'lucide-react'

export function NextGenDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [realtimeData, setRealtimeData] = useState({
    heartRate: 142,
    performance: 87.5,
    injuryRisk: 'Low',
    activeDevices: 3
  })

  // Next-generation features
  const nextGenFeatures = [
    {
      title: 'AI Video Analysis',
      description: 'Professional computer vision with 25+ body points',
      icon: Brain,
      status: 'active',
      link: '/test-video-analysis',
      metrics: { accuracy: '95%', speed: '<100ms' }
    },
    {
      title: 'Mobile Analysis',
      description: 'Edge AI processing on your device',
      icon: Smartphone,
      status: 'active', 
      link: '/mobile-analysis',
      metrics: { processing: 'Real-time', offline: 'Full support' }
    },
    {
      title: 'IoT Integration',
      description: 'Fitbit, Garmin, Apple Watch connectivity',
      icon: Activity,
      status: 'connected',
      link: '/performance',
      metrics: { devices: '4 connected', sync: 'Live' }
    },
    {
      title: 'Recruitment AI',
      description: 'Intelligent college matching system',
      icon: Target,
      status: 'active',
      link: '/recruiting-hub',
      metrics: { matches: '12 found', accuracy: '92%' }
    },
    {
      title: 'Performance Prediction',
      description: 'Injury risk and talent forecasting',
      icon: TrendingUp,
      status: 'monitoring',
      link: '/performance-analytics',
      metrics: { prediction: '99.9%', timeline: '6 months' }
    },
    {
      title: 'Academy Integration',
      description: 'Complete educational platform',
      icon: Award,
      status: 'enrolled',
      link: '/academy',
      metrics: { courses: '6 active', progress: '78%' }
    }
  ]

  const performanceMetrics = {
    garScore: 87.5,
    improvement: '+12.3%',
    rank: '#156',
    recruiting: {
      matches: 23,
      interested: 8,
      offers: 2
    },
    wellness: {
      readiness: 85,
      fatigue: 'Low',
      recovery: 92
    }
  }

  const recentAnalyses = [
    {
      id: 1,
      type: 'Video Analysis',
      sport: 'Basketball',
      score: 89.2,
      timestamp: '2 hours ago',
      insights: ['Improved shooting form', 'Better balance', 'Consistent release']
    },
    {
      id: 2,
      type: 'Performance Tracking',
      sport: 'Training',
      score: 84.7,
      timestamp: '1 day ago', 
      insights: ['High intensity', 'Good recovery', 'Maintain current load']
    },
    {
      id: 3,
      type: 'Recruitment Analysis',
      sport: 'Basketball',
      score: 91.5,
      timestamp: '3 days ago',
      insights: ['Strong D1 prospects', 'Academic fit excellent', 'Contact coaches']
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-4">
            Next-Generation Athletic Dashboard
          </h1>
          <p className="text-xl text-slate-400 mb-4">
            AI-powered sports analysis, recruitment, and performance optimization platform
          </p>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Brain className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Activity className="w-3 h-3 mr-1" />
              Real-time Analytics
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <Target className="w-3 h-3 mr-1" />
              Recruitment Ready
            </Badge>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              <Zap className="w-3 h-3 mr-1" />
              Edge Computing
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">GAR Score</p>
                  <p className="text-3xl font-bold text-primary">{performanceMetrics.garScore}</p>
                  <p className="text-green-400 text-sm">+12.3% this month</p>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">College Matches</p>
                  <p className="text-3xl font-bold text-blue-400">{performanceMetrics.recruiting.matches}</p>
                  <p className="text-blue-400 text-sm">{performanceMetrics.recruiting.offers} offers received</p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Readiness Score</p>
                  <p className="text-3xl font-bold text-green-400">{performanceMetrics.wellness.readiness}</p>
                  <p className="text-green-400 text-sm">Optimal training day</p>
                </div>
                <Heart className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">National Rank</p>
                  <p className="text-3xl font-bold text-purple-400">{performanceMetrics.rank}</p>
                  <p className="text-purple-400 text-sm">Class of 2026</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next-Generation Features Grid */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Next-Generation Platform Features
            </CardTitle>
            <CardDescription>
              Industry-leading AI and technology at your fingertips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nextGenFeatures.map((feature, index) => (
                <Card key={index} className="bg-slate-700/50 border-slate-600 hover:border-primary/50 transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <feature.icon className="w-8 h-8 text-primary" />
                      <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                        {feature.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">{feature.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {Object.entries(feature.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-slate-500 capitalize">{key}:</span>
                          <span className="text-slate-300">{value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full group-hover:bg-primary/90 transition-colors"
                      onClick={() => window.location.href = feature.link}
                    >
                      Access Feature
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Recent AI Analysis
            </CardTitle>
            <CardDescription>
              Latest performance insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnalyses.map((analysis, index) => (
                <div key={analysis.id} className="flex items-start gap-4 p-4 bg-slate-700/50 rounded-lg">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{analysis.type} - {analysis.sport}</h4>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{analysis.score}</div>
                        <div className="text-xs text-slate-400">{analysis.timestamp}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.insights.map((insight, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {insight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col gap-2 bg-primary/20 hover:bg-primary/30 border border-primary/50">
                <Camera className="w-6 h-6" />
                <span className="text-sm">Record Video</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50">
                <Brain className="w-6 h-6" />
                <span className="text-sm">AI Analysis</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50">
                <Target className="w-6 h-6" />
                <span className="text-sm">Find Colleges</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50">
                <Activity className="w-6 h-6" />
                <span className="text-sm">Track Performance</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}