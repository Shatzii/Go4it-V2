'use client';

import { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface CoachingInsight {
  id: string;
  type: 'technique' | 'fitness' | 'mental' | 'nutrition' | 'recovery';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionItems: string[];
  adhdFriendly: boolean;
}

interface AICoachingEngineProps {
  userId: string;
  sportType: string;
  adhdSupport?: boolean;
}

export function AICoachingEngine({ userId, sportType, adhdSupport = true }: AICoachingEngineProps) {
  const [insights, setInsights] = useState<CoachingInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<CoachingInsight | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // Simulate AI coaching analysis
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockInsights: CoachingInsight[] = [
          {
            id: '1',
            type: 'technique',
            title: 'Footwork Improvement Detected',
            description:
              'Your latest video shows 15% improvement in footwork timing. Focus on maintaining this rhythm.',
            priority: 'high',
            actionItems: [
              'Practice ladder drills 3x per week',
              'Focus on quick, light steps',
              'Record yourself for self-assessment',
            ],
            adhdFriendly: true,
          },
          {
            id: '2',
            type: 'mental',
            title: 'Focus Enhancement Strategy',
            description:
              'ADHD-optimized training routine to maintain concentration during practice.',
            priority: 'medium',
            actionItems: [
              'Break practice into 15-minute segments',
              'Use visual cues for technique reminders',
              'Implement reward system for completed drills',
            ],
            adhdFriendly: true,
          },
          {
            id: '3',
            type: 'fitness',
            title: 'Strength Training Progression',
            description:
              'Ready to advance to next level of strength training based on recent performance.',
            priority: 'medium',
            actionItems: [
              'Increase weight by 5-10%',
              'Add plyometric exercises',
              'Monitor recovery between sessions',
            ],
            adhdFriendly: false,
          },
        ];

        setInsights(mockInsights);
      } catch (error) {
        console.error('Failed to fetch coaching insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [userId, sportType]);

  const getPriorityColor = (priority: CoachingInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'low':
        return 'text-green-400 bg-green-400/10';
      default:
        return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getTypeIcon = (type: CoachingInsight['type']) => {
    switch (type) {
      case 'technique':
        return Target;
      case 'fitness':
        return TrendingUp;
      case 'mental':
        return Brain;
      case 'nutrition':
        return CheckCircle;
      case 'recovery':
        return AlertCircle;
      default:
        return Brain;
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">AI Coaching Engine</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">AI Coaching Engine</h3>
        </div>
        {adhdSupport && (
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
            ADHD Optimized
          </span>
        )}
      </div>

      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = getTypeIcon(insight.type);
          return (
            <div
              key={insight.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-700/50 ${
                selectedInsight?.id === insight.id
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-slate-600'
              }`}
              onClick={() =>
                setSelectedInsight(selectedInsight?.id === insight.id ? null : insight)
              }
            >
              <div className="flex items-start space-x-3">
                <Icon className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                    <div className="flex items-center space-x-2">
                      {insight.adhdFriendly && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                          ADHD
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded ${getPriorityColor(insight.priority)}`}
                      >
                        {insight.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{insight.description}</p>

                  {selectedInsight?.id === insight.id && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                      <h5 className="text-xs font-medium text-slate-300 mb-2">Action Items:</h5>
                      <ul className="space-y-1">
                        {insight.actionItems.map((item, index) => (
                          <li key={index} className="text-xs text-slate-400 flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
