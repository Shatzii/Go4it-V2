'use client';

import { Video, Trophy, Target, BookOpen, Users, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'video' | 'achievement' | 'workout' | 'academic' | 'team';
  title: string;
  description: string;
  timestamp: string;
  xpEarned?: number;
  priority?: 'low' | 'medium' | 'high';
}

export function ActivityFeed() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'video',
      title: 'GAR Analysis Complete',
      description: 'New video analysis shows 12% improvement in technique',
      timestamp: '2 hours ago',
      xpEarned: 200,
      priority: 'high',
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Weekly Warrior',
      description: 'Completed 7 consecutive days of training',
      timestamp: '1 day ago',
      xpEarned: 300,
      priority: 'high',
    },
    {
      id: '3',
      type: 'workout',
      title: 'Agility Training',
      description: 'Completed advanced agility ladder drills',
      timestamp: '2 days ago',
      xpEarned: 150,
      priority: 'medium',
    },
    {
      id: '4',
      type: 'academic',
      title: 'Assignment Submitted',
      description: 'Biology lab report submitted on time',
      timestamp: '3 days ago',
      priority: 'low',
    },
    {
      id: '5',
      type: 'team',
      title: 'Team Practice',
      description: 'Attended team scrimmage session',
      timestamp: '3 days ago',
      xpEarned: 100,
      priority: 'medium',
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'video':
        return Video;
      case 'achievement':
        return Trophy;
      case 'workout':
        return Target;
      case 'academic':
        return BookOpen;
      case 'team':
        return Users;
      default:
        return Clock;
    }
  };

  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500/20 bg-red-500/5';
      case 'medium':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'low':
        return 'border-green-500/20 bg-green-500/5';
      default:
        return 'border-slate-600 bg-slate-800';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <div
              key={activity.id}
              className={`border rounded-lg p-4 transition-colors hover:bg-slate-700/50 ${getPriorityColor(activity.priority)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{activity.title}</p>
                    <div className="flex items-center space-x-2">
                      {activity.xpEarned && (
                        <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                          +{activity.xpEarned} XP
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{activity.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
