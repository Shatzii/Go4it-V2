import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Rocket, ArrowRight, BarChart3, TrendingUp, Target, Zap } from 'lucide-react';
import { Link } from 'wouter';

interface OptimizationFeature {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'planned';
  impact: string;
  icon: React.ComponentType<any>;
}

const optimizationFeatures: OptimizationFeature[] = [
  {
    id: 'vertical-dashboard',
    title: 'Interactive Vertical Dashboard',
    description: 'Dynamic 12-industry grid with hover effects and real-time metrics',
    status: 'completed',
    impact: '$161.7M showcase',
    icon: BarChart3
  },
  {
    id: 'revenue-counter',
    title: 'Live Revenue Counter',
    description: 'Animated counters with real-time updates from autonomous agents',
    status: 'completed',
    impact: 'Visual proof of scale',
    icon: TrendingUp
  },
  {
    id: 'ai-heatmap',
    title: 'AI Agent Activity Heat Map',
    description: 'Live visualization of 197 agents working across all verticals',
    status: 'completed',
    impact: 'Trust & automation proof',
    icon: Zap
  },
  {
    id: 'comparison-matrix',
    title: 'Vertical Comparison Matrix',
    description: 'Interactive table with filtering and side-by-side comparisons',
    status: 'active',
    impact: 'Decision acceleration',
    icon: Target
  }
];

export default function ProgressTracker() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const completedCount = optimizationFeatures.filter(f => f.status === 'completed').length;
  const totalCount = optimizationFeatures.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(progressPercentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Panel */}
      {isExpanded && (
        <Card className="mb-4 w-96 bg-slate-800/95 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-100">Optimization Progress</h3>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                {completedCount}/{totalCount} Complete
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Overall Progress</span>
                <span className="text-cyan-400 font-mono text-sm">{Math.round(currentProgress)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="h-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-3 mb-6">
              {optimizationFeatures.map((feature) => (
                <div key={feature.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    feature.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    feature.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {feature.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : feature.status === 'active' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <feature.icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-100 font-medium text-sm">{feature.title}</div>
                    <div className="text-slate-400 text-xs">{feature.impact}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/wizard">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  onClick={() => setIsExpanded(false)}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Full Wizard
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => setIsExpanded(false)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-2xl transition-all duration-300 ${
          isExpanded ? 'scale-110' : 'hover:scale-105'
        }`}
      >
        <div className="relative">
          {/* Progress Circle */}
          <svg className="absolute -inset-2 w-20 h-20" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - currentProgress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              transform="rotate(-90 40 40)"
            />
          </svg>
          
          {/* Icon */}
          <Rocket className="w-6 h-6" />
          
          {/* Notification dot */}
          {completedCount > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-slate-900">{completedCount}</span>
            </div>
          )}
        </div>
      </Button>
    </div>
  );
}