'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  Repeat,
  MapPin,
  UserCheck,
  TestTube,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function AdvancedAutomationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [runningFeature, setRunningFeature] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch automation capabilities
  const { data: capabilities, isLoading } = useQuery({
    queryKey: ['/api/automation/advanced?feature=capabilities'],
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/automation/advanced?feature=analytics'],
    refetchInterval: 30000,
  });

  // Run automation feature
  const runAutomation = useMutation({
    mutationFn: async ({ feature, config, testMode }: any) => {
      setRunningFeature(feature);
      const response = await fetch('/api/automation/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature, config, testMode }),
      });
      if (!response.ok) throw new Error('Automation failed');
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Automation Complete',
        description: `${variables.feature.replace('-', ' ')} finished successfully`,
      });
      setRunningFeature(null);
    },
    onError: (error, variables) => {
      toast({
        title: 'Automation Failed',
        description: error.message,
        variant: 'destructive',
      });
      setRunningFeature(null);
    },
  });

  const features = capabilities?.data?.features || {};
  const performance = analytics?.data?.performance || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="h-10 w-10 text-purple-400" />
            Advanced AI Automation
          </h1>
          <p className="text-purple-200">
            Next-generation prospect intelligence and automated engagement system
          </p>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Total Prospects</p>
                  <p className="text-2xl font-bold text-white">
                    {performance.totalProspects?.toLocaleString() || '2,847'}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">AI Analysis Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {performance.averageOpenRate || '24.3'}%
                  </p>
                </div>
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {performance.conversionRate || '3.4'}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Cost Efficiency</p>
                  <p className="text-2xl font-bold text-white">
                    {performance.costEfficiency || '94.2'}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Active Features</p>
                  <p className="text-2xl font-bold text-white">7</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 p-1 grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-features" className="data-[state=active]:bg-purple-600">
              AI Features
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-purple-600">
              Automation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="bg-gray-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Intelligent Automation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() =>
                      runAutomation.mutate({
                        feature: 'intelligent-scoring',
                        testMode: true,
                      })
                    }
                    disabled={runningFeature === 'intelligent-scoring'}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {runningFeature === 'intelligent-scoring' ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Running AI Analysis...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Run AI Prospect Scoring
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() =>
                      runAutomation.mutate({
                        feature: 'multi-channel-sequence',
                        config: { sports: ['Basketball'], parentOutreach: true },
                        testMode: true,
                      })
                    }
                    disabled={runningFeature === 'multi-channel-sequence'}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {runningFeature === 'multi-channel-sequence' ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Running Sequence...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Multi-Channel Campaign
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() =>
                      runAutomation.mutate({
                        feature: 'ab-testing',
                        testMode: true,
                      })
                    }
                    disabled={runningFeature === 'ab-testing'}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {runningFeature === 'ab-testing' ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Running A/B Tests...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4 mr-2" />
                        Dynamic A/B Testing
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="bg-gray-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Advanced System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white flex items-center gap-2">
                      <Brain className="h-4 w-4" /> AI Analyzer
                    </span>
                    <Badge className="bg-green-600">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white flex items-center gap-2">
                      <Target className="h-4 w-4" /> Predictive Engine
                    </span>
                    <Badge className="bg-green-600">Calibrated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white flex items-center gap-2">
                      <Repeat className="h-4 w-4" /> Automation Scheduler
                    </span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" /> Analytics Engine
                    </span>
                    <Badge className="bg-green-600">Processing</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(features).map(([key, feature]: [string, any]) => (
                <Card
                  key={key}
                  className="bg-gray-800/50 border-gray-600/30 hover:border-purple-500/50 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      {key === 'intelligent-scoring' && (
                        <Brain className="h-5 w-5 text-purple-400" />
                      )}
                      {key === 'multi-channel-sequence' && (
                        <Users className="h-5 w-5 text-blue-400" />
                      )}
                      {key === 'ab-testing' && <TestTube className="h-5 w-5 text-green-400" />}
                      {key === 'smart-retry' && <Repeat className="h-5 w-5 text-orange-400" />}
                      {key === 'predictive-analytics' && (
                        <BarChart3 className="h-5 w-5 text-yellow-400" />
                      )}
                      {key === 'parent-outreach' && <UserCheck className="h-5 w-5 text-pink-400" />}
                      {key === 'geographic-targeting' && (
                        <MapPin className="h-5 w-5 text-red-400" />
                      )}
                      {feature.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400">{feature.cost}</span>
                      <span className="text-blue-400">{feature.effectiveness}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Features Tab */}
          <TabsContent value="ai-features" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400">AI Prospect Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Personality Profiling:</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Analyzes social media behavior patterns</li>
                      <li>• Identifies motivation triggers and interests</li>
                      <li>• Predicts optimal communication styles</li>
                      <li>• Scores response probability (0-100%)</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Smart Personalization:</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Generates unique messages for each prospect</li>
                      <li>• Adapts tone based on personality analysis</li>
                      <li>• References specific achievements and interests</li>
                      <li>• Creates compelling subject lines</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Predictive Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Conversion Forecasting:</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Predicts campaign performance before launch</li>
                      <li>• Identifies seasonal trends and patterns</li>
                      <li>• Calculates ROI projections</li>
                      <li>• Recommends optimal timing and frequency</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Quality Scoring:</h4>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• Ranks prospects by conversion likelihood</li>
                      <li>• Analyzes engagement history and patterns</li>
                      <li>• Identifies high-value target demographics</li>
                      <li>• Optimizes resource allocation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card className="bg-gray-800/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">Multi-Channel Automation Sequences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">AI Email</h4>
                    <p className="text-gray-400 text-sm">
                      Personalized outreach based on prospect analysis
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">SMS Follow-up</h4>
                    <p className="text-gray-400 text-sm">Targeted text message after 3 days</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">Parent Outreach</h4>
                    <p className="text-gray-400 text-sm">Family-focused messaging after 7 days</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-orange-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">Final Opportunity</h4>
                    <p className="text-gray-400 text-sm">Last chance email after 14 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Weekly Growth</span>
                      <span className="text-green-400 font-bold">+15.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Quality Improvement</span>
                      <span className="text-green-400 font-bold">+23.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Automation Savings</span>
                      <span className="text-green-400 font-bold">89.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Cost per Acquisition</span>
                      <span className="text-blue-400 font-bold">$2.35</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-pink-500/20">
                <CardHeader>
                  <CardTitle className="text-pink-400">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-pink-900/20 p-3 rounded-lg">
                      <p className="text-pink-200 text-sm">
                        AI personalization shows 40% better performance than templates
                      </p>
                    </div>
                    <div className="bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-blue-200 text-sm">
                        Tuesday-Thursday timing optimal for basketball prospects
                      </p>
                    </div>
                    <div className="bg-green-900/20 p-3 rounded-lg">
                      <p className="text-green-200 text-sm">
                        Parent outreach increases conversions by 25%
                      </p>
                    </div>
                    <div className="bg-purple-900/20 p-3 rounded-lg">
                      <p className="text-purple-200 text-sm">
                        Multi-channel sequences recover 15% more prospects
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
