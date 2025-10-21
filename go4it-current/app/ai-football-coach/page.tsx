'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  MessageCircle,
  Video,
  Play,
  Mic,
  Trophy,
  Target,
  Star,
  Users,
  Crown,
  Zap,
} from 'lucide-react';

export default function AIFootballCoachPage() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const startVoiceCoaching = () => {
    const context = encodeURIComponent(
      "Welcome to your personal AI Strength & Conditioning Coach! I'm here to help you build strength, improve conditioning, develop proper form, and create personalized training programs. What aspect of your fitness would you like to work on today?",
    );
    const voiceUrl = `https://elevenlabs.io/app/talk-to?agent_id=tb80F0KNyKEjO8IymYOU&context=${context}`;

    window.open(voiceUrl, '_blank', 'width=800,height=600');
    setIsVoiceActive(true);
  };

  const coachingAreas = [
    {
      title: 'Technique Analysis',
      description: 'Get voice feedback on your form and mechanics',
      icon: Video,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      title: 'Game Strategy',
      description: 'Learn advanced football strategies and tactics',
      icon: Brain,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Performance Review',
      description: 'Comprehensive analysis of your athletic progress',
      icon: Trophy,
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    },
    {
      title: 'Skill Development',
      description: 'Personalized training plans for improvement',
      icon: Target,
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    {
      title: 'Recruiting Guidance',
      description: 'College recruitment advice and planning',
      icon: Star,
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
    {
      title: 'Team Leadership',
      description: 'Develop leadership skills and team dynamics',
      icon: Users,
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
  ];

  const quickStartTopics = [
    'How can I improve my GAR score?',
    'What are the best drills for my position?',
    'Help me understand college recruiting',
    'Analyze my recent game performance',
    'Create a training plan for me',
    'Explain flag football strategies',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              AI Strength & Conditioning Coach
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-6">
            Your personal AI-powered strength & conditioning coach with voice interaction
          </p>

          {/* Main Voice Coaching Button */}
          <div className="mb-8">
            <Button
              onClick={startVoiceCoaching}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
            >
              <Mic className="w-6 h-6 mr-3" />
              Start Voice Coaching Session
            </Button>
            <p className="text-sm text-slate-400 mt-2">
              Click to open your personal AI coach in a new window
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Voice Powered
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Personalized</Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Real-time
            </Badge>
          </div>
        </div>

        {/* Coaching Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {coachingAreas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <Card
                key={index}
                className="bg-slate-800 border-slate-700 hover:border-green-500/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${area.color} flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-white text-lg">{area.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-4">{area.description}</p>
                  <Button
                    onClick={startVoiceCoaching}
                    variant="outline"
                    className="w-full border-slate-600 hover:bg-slate-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask Coach
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Start Topics */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Quick Start Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Not sure what to ask? Try one of these popular coaching topics:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickStartTopics.map((topic, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    const context = encodeURIComponent(
                      `The athlete is asking: "${topic}". Please provide detailed, personalized coaching advice on this topic.`,
                    );
                    const voiceUrl = `https://elevenlabs.io/app/talk-to?agent_id=tb80F0KNyKEjO8IymYOU&context=${context}`;
                    window.open(voiceUrl, '_blank', 'width=800,height=600');
                  }}
                  variant="outline"
                  className="justify-start text-left border-slate-600 hover:bg-slate-700 h-auto py-3 px-4"
                >
                  <Play className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                  <span className="text-sm">{topic}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integration Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                Integrated Platform Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">GAR Video Analysis</span>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">StarPath Progression</span>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">Challenge Coaching</span>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">Recruiting Reports</span>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">Flag Football Academy</span>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-400" />
                Advanced Coaching Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">AI Playbook Creator</span>
                <Badge className="bg-blue-500/20 text-blue-400">Phase 2</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">Tournament Management</span>
                <Badge className="bg-blue-500/20 text-blue-400">Phase 2</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">Mobile Analysis</span>
                <Badge className="bg-blue-500/20 text-blue-400">Phase 2</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">Multi-Sport Coaching</span>
                <Badge className="bg-blue-500/20 text-blue-400">Phase 2</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">Parent Dashboard</span>
                <Badge className="bg-blue-500/20 text-blue-400">Phase 2</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Elevate Your Game?</h3>
            <p className="text-slate-300 text-lg mb-6">
              Experience personalized AI coaching that adapts to your unique needs and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={startVoiceCoaching}
                className="bg-green-600 hover:bg-green-700 px-8 py-3"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Coaching Now
              </Button>
              <Button
                onClick={() => (window.location.href = '/ai-coach-dashboard')}
                variant="outline"
                className="border-slate-600 text-slate-300 px-8 py-3"
              >
                <Crown className="w-5 h-5 mr-2" />
                View Full Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
