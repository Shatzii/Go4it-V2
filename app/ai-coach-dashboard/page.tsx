'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AICoachWidget } from '@/components/ai-coach/AICoachWidget';
import { 
  Brain, Video, Star, Trophy, Users, MessageCircle,
  Zap, Target, Crown, Play, Settings, BarChart3,
  Calendar, BookOpen, Mic, Camera, FileText
} from 'lucide-react';

export default function AICoachDashboardPage() {
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState('coach-premium');
  const [integrationStats, setIntegrationStats] = useState<any>(null);

  useEffect(() => {
    fetchIntegrationStats();
  }, []);

  const fetchIntegrationStats = async () => {
    try {
      const response = await fetch('/api/ai-coach/integration?stats=true');
      if (response.ok) {
        const stats = await response.json();
        setIntegrationStats(stats);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const integrationFeatures = [
    {
      id: 'gar_analysis',
      title: 'GAR Analysis + Voice Coaching',
      description: 'Get voice feedback on your video analysis results',
      icon: Video,
      color: 'green',
      status: 'active',
      integration: 'Phase 1',
      features: ['Real-time voice coaching', 'Performance breakdown', 'Improvement suggestions']
    },
    {
      id: 'starpath',
      title: 'StarPath Progression Coach',
      description: 'Voice guidance through your skill development journey',
      icon: Star,
      color: 'purple',
      status: 'active', 
      integration: 'Phase 1',
      features: ['Achievement celebrations', 'Next milestone guidance', 'Motivational coaching']
    },
    {
      id: 'challenges',
      title: 'Challenge System Integration',
      description: 'Real-time coaching during challenge completion',
      icon: Trophy,
      color: 'blue',
      status: 'active',
      integration: 'Phase 1',
      features: ['Technique corrections', 'Live coaching tips', 'Performance optimization']
    },
    {
      id: 'recruiting_reports',
      title: 'Recruiting Report Analysis',
      description: 'Voice explanation of recruiting opportunities and improvements',
      icon: Target,
      color: 'orange',
      status: 'active',
      integration: 'Phase 1',
      features: ['Report summaries', 'College match analysis', 'Improvement roadmaps']
    },
    {
      id: 'flag_football',
      title: 'Flag Football Specialization',
      description: 'Specialized coaching for flag football players and coaches',
      icon: Zap,
      color: 'yellow',
      status: 'active',
      integration: 'Phase 1',
      features: ['Flag football strategies', 'Youth development', 'Tournament preparation']
    },
    {
      id: 'parent_dashboard',
      title: 'Parent Communication Hub',
      description: 'Voice reports and updates for parents',
      icon: MessageCircle,
      color: 'pink',
      status: 'active',
      integration: 'Phase 2',
      features: ['Progress voice reports', 'Communication summaries', 'Home practice guides']
    },
    {
      id: 'mobile_analysis',
      title: 'Mobile Video + Voice Coaching',
      description: 'Instant voice feedback on mobile video uploads',
      icon: Camera,
      color: 'cyan',
      status: 'active',
      integration: 'Phase 2',
      features: ['Instant analysis', 'Quick coaching tips', 'Mobile-optimized feedback']
    },
    {
      id: 'team_sports',
      title: 'Multi-Sport Team Coaching',
      description: 'Cross-sport coaching for basketball, soccer, and football',
      icon: Users,
      color: 'red',
      status: 'active',
      integration: 'Phase 2',
      features: ['Multi-sport strategies', 'Team management', 'Cross-training advice']
    }
  ];

  const phase2Features = [
    {
      id: 'playbook_creator',
      title: 'AI Playbook Creator',
      description: 'Generate custom playbooks with AI assistance',
      icon: BookOpen,
      endpoint: '/api/ai-coach/playbook',
      features: ['Custom play generation', 'Formation optimization', 'Practice plan creation']
    },
    {
      id: 'tournament_manager', 
      title: 'Tournament Management System',
      description: 'Complete tournament organization with AI coaching',
      icon: Calendar,
      endpoint: '/api/ai-coach/tournament',
      features: ['Bracket generation', 'Game analysis', 'Team strategy advice']
    },
    {
      id: 'advanced_analytics',
      title: 'Advanced Performance Analytics',
      description: 'Deep dive analytics with voice explanations',
      icon: BarChart3,
      endpoint: '/api/ai-coach/analytics',
      features: ['Performance trends', 'Predictive analysis', 'Comparative insights']
    }
  ];

  const createPlaybook = async () => {
    try {
      const response = await fetch('/api/ai-coach/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: 'flag_football',
          gameType: '7v7',
          teamLevel: 'youth',
          ageGroup: '10-12',
          formation: 'spread',
          playstyle: 'balanced'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Playbook created:', result);
        // Show success message or redirect
      }
    } catch (error) {
      console.error('Playbook creation error:', error);
    }
  };

  const createTournament = async () => {
    try {
      const response = await fetch('/api/ai-coach/tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_tournament',
          tournamentData: {
            name: 'Youth Flag Football Championship',
            sport: 'flag_football',
            gameType: '7v7',
            ageGroup: 'youth',
            teams: [
              { name: 'Team A', coach: 'Coach Smith' },
              { name: 'Team B', coach: 'Coach Johnson' },
              { name: 'Team C', coach: 'Coach Williams' },
              { name: 'Team D', coach: 'Coach Brown' }
            ],
            format: 'single_elimination',
            duration: 1,
            venue: 'Local Sports Complex'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Tournament created:', result);
        // Show success message or redirect
      }
    } catch (error) {
      console.error('Tournament creation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              AI Coach Dashboard
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Complete integration of AI coaching with all your Go4It features
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Phase 1: 5 Integrations Active
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Phase 2: 3 Advanced Features
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="integrations" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="integrations">Feature Integrations</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
            <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrationFeatures.map((feature) => (
                <AICoachWidget
                  key={feature.id}
                  feature={feature.id as any}
                  context={{ 
                    userLevel: 'intermediate',
                    sport: 'football',
                    integration: feature.integration 
                  }}
                  className="h-full"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* AI Playbook Creator */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl text-white">AI Playbook Creator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Generate custom playbooks with AI assistance for any sport and skill level.
                  </p>
                  
                  <div className="space-y-2">
                    <h5 className="font-semibold text-white text-sm">Features:</h5>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• 15-20 AI-generated plays per playbook</li>
                      <li>• Formation diagrams and coaching points</li>
                      <li>• Practice plan integration</li>
                      <li>• Voice coaching for each play</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={createPlaybook}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create Playbook
                  </Button>
                </CardContent>
              </Card>

              {/* Tournament Management */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-400" />
                    </div>
                    <CardTitle className="text-xl text-white">Tournament Manager</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Complete tournament organization with bracket generation and AI coaching.
                  </p>
                  
                  <div className="space-y-2">
                    <h5 className="font-semibold text-white text-sm">Features:</h5>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Automated bracket generation</li>
                      <li>• Game-by-game analysis</li>
                      <li>• Team strategy recommendations</li>
                      <li>• Real-time coaching adjustments</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={createTournament}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Tournament
                  </Button>
                </CardContent>
              </Card>

              {/* Advanced Analytics */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-400" />
                    </div>
                    <CardTitle className="text-xl text-white">Advanced Analytics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Deep performance analytics with AI-powered insights and voice explanations.
                  </p>
                  
                  <div className="space-y-2">
                    <h5 className="font-semibold text-white text-sm">Features:</h5>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Performance trend analysis</li>
                      <li>• Predictive modeling</li>
                      <li>• Comparative benchmarking</li>
                      <li>• Voice-explained insights</li>
                    </ul>
                  </div>

                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Voice Sessions</h3>
                  <p className="text-2xl font-bold text-green-400 mb-1">24</p>
                  <p className="text-slate-400 text-sm">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Video className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Video Analysis</h3>
                  <p className="text-2xl font-bold text-blue-400 mb-1">18</p>
                  <p className="text-slate-400 text-sm">With voice coaching</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">StarPath Progress</h3>
                  <p className="text-2xl font-bold text-purple-400 mb-1">12</p>
                  <p className="text-slate-400 text-sm">Milestones achieved</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Challenges</h3>
                  <p className="text-2xl font-bold text-yellow-400 mb-1">8</p>
                  <p className="text-slate-400 text-sm">With AI coaching</p>
                </CardContent>
              </Card>
            </div>

            {/* Usage Chart Placeholder */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">AI Coach Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">Usage analytics visualization</p>
                    <p className="text-slate-500 text-sm">Integration with analytics dashboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience Full AI Integration?</h3>
            <p className="text-slate-300 text-lg mb-8">
              All features are now enhanced with AI voice coaching. Start using any feature to experience the integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/gar-upload'}
                className="bg-green-600 hover:bg-green-700 px-8 py-3"
              >
                <Video className="w-5 h-5 mr-2" />
                Try GAR + Voice Coaching
              </Button>
              <Button 
                onClick={() => window.location.href = '/enhanced-starpath'}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
              >
                <Star className="w-5 h-5 mr-2" />
                StarPath + AI Coach
              </Button>
              <Button 
                onClick={() => window.location.href = '/ai-football-coach'}
                variant="outline"
                className="border-slate-600 text-slate-300 px-8 py-3"
              >
                <Crown className="w-5 h-5 mr-2" />
                AI Coach Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}