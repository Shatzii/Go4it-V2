'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, Video, Upload, Trophy, Star, 
  Mic, Camera, FileText, Brain, Target, Users,
  Play, Pause, Send, Image, Zap, Crown, Check
} from 'lucide-react';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
  userType: 'player' | 'coach' | 'parent';
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'player-basic',
    name: 'Player Coach',
    price: 8.95,
    userType: 'player',
    features: [
      'Voice conversations with AI Football Coach',
      'Personalized training advice',
      'Technique analysis through chat',
      'Position-specific guidance',
      'Basic performance tracking',
      '50 AI conversations per month'
    ]
  },
  {
    id: 'coach-premium',
    name: 'Coach & Parent Pro',
    price: 12.95,
    userType: 'coach',
    recommended: true,
    features: [
      'Everything in Player Coach',
      'Team management tools',
      'Parent communication features',
      'Advanced analytics dashboard',
      'Video analysis integration',
      'Unlimited AI conversations',
      'Custom training plan generation',
      'Multi-player coaching sessions'
    ]
  },
  {
    id: 'elite-package',
    name: 'Elite Integration',
    price: 24.95,
    userType: 'coach',
    features: [
      'Everything in Coach & Parent Pro',
      'Visual GAR analysis integration',
      'Real-time video coaching',
      'AI-powered recruiting reports',
      'Advanced biomechanical analysis',
      'Custom drill library creation',
      'Priority support',
      'Beta feature access'
    ]
  }
];

export default function AIFootballCoachPage() {
  const [selectedTier, setSelectedTier] = useState<string>('coach-premium');
  const [activeTab, setActiveTab] = useState('overview');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [conversation, setConversation] = useState<any[]>([]);

  const startVoiceConversation = () => {
    setIsVoiceActive(true);
    // Initialize ElevenLabs agent
    const agentUrl = 'https://elevenlabs.io/app/talk-to?agent_id=Ayif0LPWGdrZglfWInx0';
    window.open(agentUrl, '_blank', 'width=800,height=600');
  };

  const handleSubscribe = async (tierId: string) => {
    try {
      const response = await fetch('/api/subscribe/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId })
      });

      if (response.ok) {
        const { checkoutUrl } = await response.json();
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              AI FOOTBALL COACH
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-8">
            Advanced AI-powered football coaching with voice, visual, and text integration
          </p>
          
          {/* Quick Demo */}
          <Card className="bg-slate-800 border-slate-700 max-w-4xl mx-auto mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Voice Coaching</h3>
                  <p className="text-slate-300 text-sm">Natural voice conversations with AI coach</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Visual Analysis</h3>
                  <p className="text-slate-300 text-sm">GAR integration with video analysis</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Text Chat</h3>
                  <p className="text-slate-300 text-sm">Detailed text-based coaching sessions</p>
                </div>
              </div>
              
              <Button 
                onClick={startVoiceConversation}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-3"
              >
                <Mic className="w-5 h-5 mr-2" />
                Try Voice Coach Demo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Choose Your Coaching Plan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative transition-all duration-300 ${
                  tier.recommended 
                    ? 'bg-gradient-to-br from-blue-500/20 to-green-500/20 border-blue-500 scale-105' 
                    : 'bg-slate-800 border-slate-700 hover:border-blue-500/50'
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1">
                      RECOMMENDED
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mb-4">
                    {tier.userType === 'player' && <Trophy className="w-12 h-12 text-green-400 mx-auto" />}
                    {tier.userType === 'coach' && <Users className="w-12 h-12 text-blue-400 mx-auto" />}
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">{tier.name}</CardTitle>
                  <div className="text-4xl font-bold text-white mb-2">
                    ${tier.price}
                    <span className="text-lg text-slate-400">/month</span>
                  </div>
                  <p className="text-slate-300 text-sm capitalize">
                    For {tier.userType}s {tier.userType === 'coach' && '& Parents'}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleSubscribe(tier.id)}
                    className={`w-full ${
                      tier.recommended
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Three Integration Upgrade Options
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Option 1: Voice + Visual */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Mic className="w-6 h-6 text-green-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Voice + Visual Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Connect ElevenLabs voice agent with GAR video analysis system
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Upload video, get voice coaching feedback</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Real-time technique corrections via voice</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>GAR scores explained through conversation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Voice-guided video replay analysis</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Technical Implementation:</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• ElevenLabs API integration</li>
                    <li>• GAR analysis pipeline connection</li>
                    <li>• WebRTC for real-time video</li>
                    <li>• Custom webhook handlers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Option 2: Multi-Modal AI */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Multi-Modal AI Coach</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Advanced AI that processes voice, video, and text simultaneously
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>OpenAI GPT-4 Vision for video analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>Context-aware coaching across all inputs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>Personalized training plan generation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>Progress tracking with voice updates</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Technical Implementation:</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• OpenAI GPT-4 Vision API</li>
                    <li>• Multi-modal prompt engineering</li>
                    <li>• Context memory management</li>
                    <li>• Real-time data fusion</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Option 3: Complete Platform */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Complete AI Ecosystem</CardTitle>
                </div>
                <Badge className="bg-purple-500 text-white w-fit">PREMIUM</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Full integration with recruiting, team management, and parent communication
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>AI recruiting report generation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Team performance analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Parent progress notifications</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>College coach outreach automation</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Technical Implementation:</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Complete platform integration</li>
                    <li>• Automated workflow triggers</li>
                    <li>• Advanced analytics pipeline</li>
                    <li>• Multi-user collaboration tools</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo Interface */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              AI Coach Interface
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="voice">Voice Coach</TabsTrigger>
                <TabsTrigger value="visual">Visual Analysis</TabsTrigger>
                <TabsTrigger value="chat">Text Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="voice" className="mt-6">
                <div className="text-center py-8">
                  <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mic className="w-16 h-16 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Voice Coaching Session</h3>
                  <p className="text-slate-300 mb-6">
                    Click below to start a voice conversation with your AI Football Coach
                  </p>
                  <Button 
                    onClick={startVoiceConversation}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Voice Session
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="visual" className="mt-6">
                <div className="text-center py-8">
                  <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video className="w-16 h-16 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Video Analysis + Voice Feedback</h3>
                  <p className="text-slate-300 mb-6">
                    Upload your training video and get instant AI coaching through voice
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => window.location.href = '/gar-upload'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Video
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/multi-angle-upload'}
                      variant="outline"
                      className="border-slate-600"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Multi-Angle Analysis
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="mt-6">
                <div className="bg-slate-700/50 rounded-lg p-4 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Text-Based Coaching</h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Subscribe to unlock detailed text conversations with your AI coach
                    </p>
                    <Button 
                      onClick={() => handleSubscribe('player-basic')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Subscribe to Chat
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Football Training?</h3>
              <p className="text-slate-300 text-lg mb-8">
                Get personalized AI coaching through voice, visual analysis, and text - all integrated with your GAR performance data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => handleSubscribe('coach-premium')}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-3"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button 
                  onClick={startVoiceConversation}
                  variant="outline"
                  className="border-slate-600 text-slate-300 px-8 py-3"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Try Voice Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}