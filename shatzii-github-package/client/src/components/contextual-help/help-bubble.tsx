import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, X, Lightbulb, TrendingUp, Target, ArrowRight } from 'lucide-react';

interface HelpSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'tip' | 'optimization' | 'feature' | 'revenue';
  action?: {
    label: string;
    onClick: () => void;
  };
  priority: 'high' | 'medium' | 'low';
}

interface HelpBubbleProps {
  context?: string;
  userRole?: string;
  className?: string;
}

export function HelpBubble({ context, userRole = 'user', className }: HelpBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<HelpSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('/');

  // Generate contextual suggestions based on current page and user activity
  const generateSuggestions = async (pageContext: string): Promise<HelpSuggestion[]> => {
    // AI-powered suggestions based on page context
    const contextSuggestions: Record<string, HelpSuggestion[]> = {
      '/': [
        {
          id: 'revenue-dashboard',
          title: 'Track Revenue Recovery',
          description: 'Monitor real-time revenue opportunities identified by AI agents across all your business units.',
          type: 'revenue',
          action: {
            label: 'View Dashboard',
            onClick: () => window.location.href = '/dashboard'
          },
          priority: 'high'
        },
        {
          id: 'ai-setup',
          title: 'Configure AI Agents',
          description: 'Set up autonomous AI agents for marketing, sales, and operations to maximize revenue capture.',
          type: 'feature',
          action: {
            label: 'Setup Agents',
            onClick: () => window.location.href = '/ai-playground'
          },
          priority: 'high'
        },
        {
          id: 'quick-demo',
          title: 'Interactive Demo',
          description: 'Experience live AI automation in action with our interactive business simulation.',
          type: 'tip',
          action: {
            label: 'Start Demo',
            onClick: () => window.location.href = '/interactive-demo'
          },
          priority: 'medium'
        }
      ],
      '/dashboard': [
        {
          id: 'metrics-analysis',
          title: 'Analyze Performance Metrics',
          description: 'Your AI agents have identified 3 new revenue opportunities worth $47K. Review the analysis.',
          type: 'revenue',
          action: {
            label: 'View Opportunities',
            onClick: () => console.log('Navigate to revenue opportunities')
          },
          priority: 'high'
        },
        {
          id: 'automation-tips',
          title: 'Optimize Automation Rules',
          description: 'Fine-tune your AI automation rules to increase efficiency by up to 35%.',
          type: 'optimization',
          priority: 'medium'
        },
        {
          id: 'export-data',
          title: 'Export Analytics',
          description: 'Download comprehensive reports for stakeholder presentations and ROI analysis.',
          type: 'tip',
          priority: 'low'
        }
      ],
      '/ai-playground': [
        {
          id: 'model-selection',
          title: 'Choose Optimal AI Model',
          description: 'Shatzii-Finance-7B shows 94% accuracy for your use case. Consider switching from the default model.',
          type: 'optimization',
          priority: 'high'
        },
        {
          id: 'custom-prompts',
          title: 'Create Custom Prompts',
          description: 'Industry-specific prompts can improve AI response quality by 40-60% for your sector.',
          type: 'tip',
          priority: 'medium'
        },
        {
          id: 'batch-processing',
          title: 'Enable Batch Processing',
          description: 'Process multiple requests simultaneously to reduce processing time by 70%.',
          type: 'feature',
          priority: 'medium'
        }
      ],
      '/pricing': [
        {
          id: 'roi-calculator',
          title: 'Calculate Your ROI',
          description: 'Based on your industry, Shatzii typically pays for itself in 3-6 months with 300-500% ROI.',
          type: 'revenue',
          action: {
            label: 'See Projections',
            onClick: () => console.log('Open ROI calculator')
          },
          priority: 'high'
        },
        {
          id: 'plan-comparison',
          title: 'Compare Plan Features',
          description: 'Enterprise plan includes unlimited AI agents and custom model training for maximum revenue recovery.',
          type: 'feature',
          priority: 'medium'
        }
      ],
      '/contact': [
        {
          id: 'demo-request',
          title: 'Schedule Personalized Demo',
          description: 'Get a custom demo showcasing AI solutions specific to your industry and use case.',
          type: 'tip',
          action: {
            label: 'Book Demo',
            onClick: () => console.log('Open demo scheduler')
          },
          priority: 'high'
        }
      ]
    };

    // Add role-specific suggestions
    const roleSuggestions: Record<string, HelpSuggestion[]> = {
      admin: [
        {
          id: 'user-management',
          title: 'Manage User Access',
          description: 'Configure role-based permissions and monitor user activity across the platform.',
          type: 'feature',
          action: {
            label: 'User Settings',
            onClick: () => window.location.href = '/admin/users'
          },
          priority: 'medium'
        },
        {
          id: 'system-health',
          title: 'Monitor System Health',
          description: 'Check AI engine performance, database status, and email service connectivity.',
          type: 'optimization',
          priority: 'high'
        }
      ]
    };

    const pageSuggestions = contextSuggestions[pageContext] || [];
    const userSuggestions = roleSuggestions[userRole] || [];
    
    return [...pageSuggestions, ...userSuggestions].slice(0, 4); // Limit to 4 suggestions
  };

  // Load suggestions when component mounts
  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      const newSuggestions = await generateSuggestions(currentPage);
      setSuggestions(newSuggestions);
      setLoading(false);
    };

    loadSuggestions();
    
    // Update current page based on URL
    setCurrentPage(window.location.pathname);
  }, [currentPage, userRole]);

  const getPriorityIcon = (type: HelpSuggestion['type']) => {
    switch (type) {
      case 'revenue':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'optimization':
        return <Target className="h-4 w-4 text-blue-600" />;
      case 'feature':
        return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: HelpSuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {isOpen && (
        <div className="mb-4 animate-in slide-in-from-bottom-2 duration-200">
            <Card className="w-80 shadow-lg border-2 border-blue-200 bg-white dark:bg-gray-900">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    AI Suggestions
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contextual tips to maximize your platform usage
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div key={suggestion.id}>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex-shrink-0 mt-0.5">
                          {getPriorityIcon(suggestion.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {suggestion.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getPriorityColor(suggestion.priority)}`}
                            >
                              {suggestion.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {suggestion.description}
                          </p>
                          {suggestion.action && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={suggestion.action.onClick}
                              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
                            >
                              {suggestion.action.label}
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {index < suggestions.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No suggestions available for this page
                    </p>
                  </div>
                )}
                
                <Separator />
                
                <div className="text-center">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => window.location.href = '/help'}
                    className="text-xs text-gray-600 hover:text-gray-700"
                  >
                    Need more help? Visit our Help Center
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
      )}

      {/* Help Bubble Trigger */}
      <div className="transition-transform hover:scale-105 active:scale-95">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <HelpCircle className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>

      {/* Notification Badge for High Priority Suggestions */}
      {!isOpen && suggestions.some(s => s.priority === 'high') && (
        <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-xs text-white font-bold">
            {suggestions.filter(s => s.priority === 'high').length}
          </span>
        </div>
      )}
    </div>
  );
}