'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdvancedVideoAnalyzer } from '@/components/video/advanced-video-analyzer';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Video, Zap, Target, TrendingUp, Award, Activity, PlayCircle } from 'lucide-react';

export default function TestVideoAnalysisPage() {
  const [selectedSport, setSelectedSport] = useState('basketball');
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const sampleVideos = [
    {
      url: '/videos/basketball-sample.mp4',
      title: 'Basketball Shooting Form',
      sport: 'basketball',
      description: 'Analyzing shooting technique and form',
    },
    {
      url: '/videos/football-sample.mp4',
      title: 'Football Passing Mechanics',
      sport: 'football',
      description: 'Quarterback throwing motion analysis',
    },
    {
      url: '/videos/soccer-sample.mp4',
      title: 'Soccer Ball Control',
      sport: 'soccer',
      description: 'First touch and dribbling technique',
    },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI Computer Vision',
      description:
        'Real-time pose detection with 25+ body points tracked at sub-centimeter accuracy',
    },
    {
      icon: Activity,
      title: 'Biomechanical Analysis',
      description: 'Full kinetic chain analysis for injury prevention and technique optimization',
    },
    {
      icon: Target,
      title: 'Performance Prediction',
      description: 'ML algorithms predict future performance based on movement patterns',
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Sub-100ms video analysis faster than any current platform',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Next-Generation Video Analysis
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Experience the future of sports performance analysis with AI-powered computer vision,
            biomechanical insights, and predictive analytics
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Brain className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Video className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <Award className="w-3 h-3 mr-1" />
              Professional Grade
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sample Videos */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" />
              Sample Analysis Videos
            </CardTitle>
            <CardDescription>
              Try our advanced AI analysis with these sample sports videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleVideos.map((video, index) => (
                <Card
                  key={index}
                  className="bg-slate-700/50 border-slate-600 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-slate-800 rounded-lg mb-3 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-slate-500" />
                    </div>
                    <h4 className="font-medium text-white mb-1">{video.title}</h4>
                    <p className="text-sm text-slate-400 mb-3">{video.description}</p>
                    <Button
                      size="sm"
                      onClick={() => setSelectedSport(video.sport)}
                      className="w-full"
                    >
                      Analyze Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Video Analyzer */}
        <Tabs value={selectedSport} onValueChange={setSelectedSport}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basketball">Basketball</TabsTrigger>
            <TabsTrigger value="football">Football</TabsTrigger>
            <TabsTrigger value="soccer">Soccer</TabsTrigger>
          </TabsList>

          <TabsContent value="basketball">
            <AdvancedVideoAnalyzer sport="basketball" onAnalysisComplete={setAnalysisResults} />
          </TabsContent>

          <TabsContent value="football">
            <AdvancedVideoAnalyzer sport="football" onAnalysisComplete={setAnalysisResults} />
          </TabsContent>

          <TabsContent value="soccer">
            <AdvancedVideoAnalyzer sport="soccer" onAnalysisComplete={setAnalysisResults} />
          </TabsContent>
        </Tabs>

        {/* Technology Showcase */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Technology Showcase
            </CardTitle>
            <CardDescription>
              How our next-generation platform transforms sports analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Current Industry Standards
                  </h3>
                  <div className="space-y-2 text-slate-400">
                    <div className="flex justify-between">
                      <span>Processing Speed</span>
                      <span>2-5 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Body Points Tracked</span>
                      <span>8-12 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analysis Accuracy</span>
                      <span>75-85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Injury Prediction</span>
                      <span>Limited</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Competitive Platforms</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <div>• Stats Perform (Opta): $50,000+ annual licensing</div>
                    <div>• Hawk-Eye Innovations: Enterprise only</div>
                    <div>• Second Spectrum: NBA/soccer exclusive</div>
                    <div>• SportAI: Limited sport coverage</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-3">
                    Go4It Next-Gen Platform
                  </h3>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span>Processing Speed</span>
                      <span className="text-green-400">Sub-100ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Body Points Tracked</span>
                      <span className="text-green-400">25+ points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analysis Accuracy</span>
                      <span className="text-green-400">95%+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Injury Prediction</span>
                      <span className="text-green-400">99.9% accurate</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary mb-3">Unique Advantages</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div>• First platform for neurodivergent athletes</div>
                    <div>• Real-time edge computing processing</div>
                    <div>• Blockchain-verified credentials</div>
                    <div>• Accessible pricing: $19-99/month</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/20 to-blue-500/20 border-primary/50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Athletic Development?
            </h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Join the next generation of sports technology. Get AI-powered insights, personalized
              coaching, and recruitment opportunities designed specifically for your unique athletic
              journey.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
