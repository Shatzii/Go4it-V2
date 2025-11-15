'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  MessageCircle,
  Video,
  Brain,
  Trophy,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Zap,
  Star,
} from 'lucide-react';

interface AICoachWidgetProps {
  feature:
    | 'gar_analysis'
    | 'starpath'
    | 'challenges'
    | 'recruiting_reports'
    | 'flag_football'
    | 'parent_dashboard'
    | 'mobile_analysis'
    | 'team_sports';
  context?: any;
  userId?: string;
  className?: string;
}

export function AICoachWidget({ feature, context, userId, className }: AICoachWidgetProps) {
  const [isActive, setIsActive] = useState(false);
  const [coaching, setCoaching] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const getFeatureConfig = (feature: string) => {
    const configs = {
      gar_analysis: {
        title: 'GAR Analysis Coaching',
        icon: Video,
        color: 'bg-green-500',
        description: 'Get voice coaching on your GAR performance',
        actions: ['generate_voice_feedback', 'real_time_coaching'],
      },
      starpath: {
        title: 'StarPath Progress Coach',
        icon: Star,
        color: 'bg-purple-500',
        description: 'Voice guidance through your skill progression',
        actions: ['voice_progression_guide', 'celebrate_achievement'],
      },
      challenges: {
        title: 'Challenge Coaching',
        icon: Trophy,
        color: 'bg-blue-500',
        description: 'Real-time coaching during challenges',
        actions: ['voice_challenge_coaching', 'technique_correction'],
      },
      recruiting_reports: {
        title: 'Recruiting Coach',
        icon: Brain,
        color: 'bg-orange-500',
        description: 'Voice analysis of recruiting opportunities',
        actions: ['voice_recruiting_summary', 'improvement_guidance'],
      },
      flag_football: {
        title: 'Flag Football Coach',
        icon: Zap,
        color: 'bg-yellow-500',
        description: 'Specialized flag football coaching',
        actions: ['flag_football_coaching', 'playbook_creation'],
      },
      parent_dashboard: {
        title: 'Parent Updates Coach',
        icon: MessageCircle,
        color: 'bg-pink-500',
        description: 'Voice reports for parents',
        actions: ['parent_voice_reports', 'communication_summary'],
      },
      mobile_analysis: {
        title: 'Mobile Analysis Coach',
        icon: Video,
        color: 'bg-cyan-500',
        description: 'Instant voice feedback on mobile uploads',
        actions: ['mobile_voice_analysis', 'quick_coaching'],
      },
      team_sports: {
        title: 'Multi-Sport Coach',
        icon: Trophy,
        color: 'bg-red-500',
        description: 'Cross-sport coaching and strategy',
        actions: ['multi_sport_coaching', 'team_strategy'],
      },
    };

    return configs[feature] || configs.gar_analysis;
  };

  const config = getFeatureConfig(feature);
  const IconComponent = config.icon;

  const startAICoaching = async (action?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-coach/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature,
          action: action || config.actions[0],
          data: context,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCoaching(result);
        setIsActive(true);

        // Open ElevenLabs voice coaching if available
        if (result.elevenlabsUrl && voiceEnabled) {
          window.open(result.elevenlabsUrl, '_blank', 'width=800,height=600');
        }
      }
    } catch (error) {
      console.error('AI coaching error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopAICoaching = () => {
    setIsActive(false);
    setCoaching(null);
  };

  return (
    <Card
      className={`${className} border-slate-700 bg-slate-800 transition-all duration-300 ${isActive ? 'border-green-500 shadow-lg shadow-green-500/20' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${config.color}/20 rounded-lg flex items-center justify-center`}
            >
              <IconComponent className={`w-5 h-5 text-${config.color.split('-')[1]}-400`} />
            </div>
            <div>
              <CardTitle className="text-lg text-white">{config.title}</CardTitle>
              <p className="text-sm text-slate-400">{config.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="text-slate-400 hover:text-white"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>

            {isActive && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isActive ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {config.actions.map((action, index) => (
                <Button
                  key={action}
                  onClick={() => startAICoaching(action)}
                  disabled={loading}
                  className={`w-full justify-start text-left ${
                    index === 0
                      ? `${config.color} hover:${config.color}/80`
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </Button>
              ))}
            </div>

            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full" />
                <span className="ml-2 text-slate-400">Starting AI Coach...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {coaching && (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">AI Coaching Active</h4>

                {coaching.voiceFeedback && (
                  <div className="mb-3">
                    <p className="text-sm text-slate-300 mb-2">{coaching.voiceFeedback.message}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Mic className="w-3 h-3" />
                      <span>Voice coaching session started</span>
                    </div>
                  </div>
                )}

                {coaching.improvements && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-white mb-1">Key Improvements:</h5>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {coaching.improvements.slice(0, 3).map((improvement: any, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Star className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span>
                            {improvement.area}: {improvement.specific_focus}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {coaching.nextSteps && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-white mb-1">Next Steps:</h5>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {coaching.nextSteps.slice(0, 2).map((step: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Zap className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={stopAICoaching}
                variant="outline"
                size="sm"
                className="flex-1 border-slate-600"
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop Coaching
              </Button>

              {coaching?.elevenlabsUrl && (
                <Button
                  onClick={() =>
                    window.open(coaching.elevenlabsUrl, '_blank', 'width=800,height=600')
                  }
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Voice Chat
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
