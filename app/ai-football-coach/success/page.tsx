'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mic, Video, MessageCircle, Crown, Star } from 'lucide-react';

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session_id = urlParams.get('session_id');
    setSessionId(session_id);
  }, []);

  const startVoiceCoaching = () => {
    const agentUrl = 'https://elevenlabs.io/app/talk-to?agent_id=Ayif0LPWGdrZglfWInx0';
    window.open(agentUrl, '_blank', 'width=800,height=600');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Welcome to AI Football Coach!
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Your subscription has been activated successfully. Start your AI coaching journey now!
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-bold text-white mb-2">1. Start Voice Coaching</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Click below to begin your first conversation with the AI Football Coach
                </p>
                <Button 
                  onClick={startVoiceCoaching}
                  className="bg-green-600 hover:bg-green-700 w-full"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Talk to Coach
                </Button>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2">2. Upload Training Video</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Get your GAR score and receive personalized coaching feedback
                </p>
                <Button 
                  onClick={() => window.location.href = '/gar-upload'}
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-bold text-white mb-2">3. Track Progress</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Monitor your development through the StarPath progression system
                </p>
                <Button 
                  onClick={() => window.location.href = '/enhanced-starpath'}
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  View StarPath
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Unlocked */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Features Now Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Voice conversations with AI Football Coach</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Personalized training advice</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">GAR video analysis integration</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Position-specific guidance</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Performance tracking dashboard</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">7-day free trial started</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support & Resources */}
        <Card className="bg-gradient-to-r from-blue-500/20 to-green-500/20 border-blue-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Need Help Getting Started?</h3>
            <p className="text-slate-300 mb-6">
              Our support team is here to help you make the most of your AI Football Coach subscription.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/support'}
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                Contact Support
              </Button>
              <Button 
                onClick={() => window.location.href = '/ai-football-coach'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Back to Coach Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session Info */}
        {sessionId && (
          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm">
              Session ID: {sessionId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}