import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface HelpContext {
  page: string;
  userActivity: string[];
  sessionTime: number;
  lastAction?: string;
}

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  category: 'workflow' | 'feature' | 'optimization' | 'troubleshooting';
}

export function useContextualHelp(userRole: string = 'user') {
  const [location] = useLocation();
  const [context, setContext] = useState<HelpContext>({
    page: location,
    userActivity: [],
    sessionTime: 0,
    lastAction: undefined
  });
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Track user activity and session time
  useEffect(() => {
    const sessionStart = Date.now();
    const activityTracker: string[] = [];

    const trackActivity = (action: string) => {
      activityTracker.push(`${Date.now()}: ${action}`);
      setContext(prev => ({
        ...prev,
        userActivity: [...prev.userActivity, action].slice(-10), // Keep last 10 actions
        sessionTime: Date.now() - sessionStart,
        lastAction: action
      }));
    };

    // Track page views
    trackActivity(`visited_${location}`);

    // Track common user interactions
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON') {
        trackActivity(`clicked_button_${target.textContent?.slice(0, 20)}`);
      } else if (target.tagName === 'A') {
        trackActivity(`clicked_link_${target.textContent?.slice(0, 20)}`);
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.type) {
        trackActivity(`input_${target.type}_${target.name || 'unnamed'}`);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('input', handleInput);
    };
  }, [location]);

  // Generate AI-powered suggestions based on context
  const generateAISuggestions = async (contextData: HelpContext): Promise<AISuggestion[]> => {
    setIsLoading(true);
    
    try {
      // Simulate AI analysis of user context
      const suggestions: AISuggestion[] = [];

      // Page-specific suggestions
      const pageAnalysis = analyzePageBehavior(contextData);
      suggestions.push(...pageAnalysis);

      // Time-based suggestions
      const timeAnalysis = analyzeSessionTime(contextData);
      suggestions.push(...timeAnalysis);

      // Activity pattern suggestions
      const activityAnalysis = analyzeUserActivity(contextData);
      suggestions.push(...activityAnalysis);

      // Role-based suggestions
      const roleAnalysis = analyzeUserRole(userRole, contextData);
      suggestions.push(...roleAnalysis);

      // Sort by confidence score and return top 5
      return suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze user behavior on current page
  const analyzePageBehavior = (contextData: HelpContext): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];

    switch (contextData.page) {
      case '/':
        if (contextData.sessionTime > 30000) { // 30 seconds
          suggestions.push({
            id: 'homepage_explore',
            title: 'Explore AI Capabilities',
            description: 'Try our AI Playground to see live demonstrations of autonomous business operations.',
            confidence: 0.8,
            actionable: true,
            category: 'feature'
          });
        }
        break;

      case '/dashboard':
        if (contextData.userActivity.some(a => a.includes('metrics'))) {
          suggestions.push({
            id: 'dashboard_optimization',
            title: 'Optimize Dashboard Layout',
            description: 'Customize your dashboard widgets for better insights based on your viewing patterns.',
            confidence: 0.9,
            actionable: true,
            category: 'optimization'
          });
        }
        break;

      case '/ai-playground':
        if (contextData.userActivity.length > 5) {
          suggestions.push({
            id: 'playground_advanced',
            title: 'Try Advanced Features',
            description: 'Explore batch processing and custom model fine-tuning for improved results.',
            confidence: 0.85,
            actionable: true,
            category: 'feature'
          });
        }
        break;
    }

    return suggestions;
  };

  // Analyze session duration for time-based suggestions
  const analyzeSessionTime = (contextData: HelpContext): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];
    const sessionMinutes = contextData.sessionTime / (1000 * 60);

    if (sessionMinutes > 5 && sessionMinutes < 15) {
      suggestions.push({
        id: 'session_guidance',
        title: 'Getting Started Guide',
        description: 'Access our step-by-step tutorial to maximize your Shatzii experience.',
        confidence: 0.7,
        actionable: true,
        category: 'workflow'
      });
    }

    if (sessionMinutes > 20) {
      suggestions.push({
        id: 'session_break',
        title: 'Take a Break',
        description: 'Save your current work and consider taking a short break for better productivity.',
        confidence: 0.6,
        actionable: false,
        category: 'optimization'
      });
    }

    return suggestions;
  };

  // Analyze user activity patterns
  const analyzeUserActivity = (contextData: HelpContext): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];
    const recentActions = contextData.userActivity.slice(-5);

    // Detect repeated actions
    const actionCounts: Record<string, number> = {};
    recentActions.forEach(action => {
      const actionType = action.split('_')[1];
      actionCounts[actionType] = (actionCounts[actionType] || 0) + 1;
    });

    Object.entries(actionCounts).forEach(([action, count]) => {
      if (count >= 3) {
        suggestions.push({
          id: `repeated_${action}`,
          title: 'Streamline Workflow',
          description: `You've performed ${action} actions frequently. Consider using keyboard shortcuts or automation.`,
          confidence: 0.75,
          actionable: true,
          category: 'optimization'
        });
      }
    });

    // Detect potential confusion (many different actions in short time)
    if (recentActions.length >= 5 && new Set(recentActions).size === recentActions.length) {
      suggestions.push({
        id: 'workflow_confusion',
        title: 'Need Help?',
        description: 'It looks like you might be exploring different features. Would you like a guided tour?',
        confidence: 0.8,
        actionable: true,
        category: 'troubleshooting'
      });
    }

    return suggestions;
  };

  // Generate role-specific suggestions
  const analyzeUserRole = (role: string, contextData: HelpContext): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];

    switch (role) {
      case 'admin':
        suggestions.push({
          id: 'admin_monitoring',
          title: 'System Health Check',
          description: 'Review system performance metrics and user activity logs.',
          confidence: 0.9,
          actionable: true,
          category: 'workflow'
        });
        break;

      case 'manager':
        suggestions.push({
          id: 'manager_reports',
          title: 'Generate Reports',
          description: 'Create comprehensive analytics reports for stakeholder presentations.',
          confidence: 0.85,
          actionable: true,
          category: 'feature'
        });
        break;

      default:
        suggestions.push({
          id: 'user_features',
          title: 'Discover Features',
          description: 'Explore advanced features that can boost your productivity.',
          confidence: 0.7,
          actionable: true,
          category: 'feature'
        });
    }

    return suggestions;
  };

  // Update suggestions when context changes
  useEffect(() => {
    const updateSuggestions = async () => {
      const newSuggestions = await generateAISuggestions(context);
      setSuggestions(newSuggestions);
    };

    // Debounce updates to avoid too frequent regeneration
    const timeoutId = setTimeout(updateSuggestions, 1000);
    return () => clearTimeout(timeoutId);
  }, [context, userRole]);

  // Manual refresh function
  const refreshSuggestions = async () => {
    const newSuggestions = await generateAISuggestions(context);
    setSuggestions(newSuggestions);
  };

  return {
    suggestions,
    isLoading,
    context,
    refreshSuggestions
  };
}