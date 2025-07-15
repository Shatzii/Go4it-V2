'use client';

import { 
  Upload, 
  Play, 
  Calendar, 
  MessageCircle, 
  Target, 
  TrendingUp 
} from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Upload Video',
      icon: Upload,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/gar-upload'
    },
    {
      title: 'StarPath',
      icon: Play,
      color: 'bg-green-500 hover:bg-green-600',
      href: '/starpath'
    },
    {
      title: 'Academy',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/academy'
    },
    {
      title: 'AI Teachers',
      icon: MessageCircle,
      color: 'bg-orange-500 hover:bg-orange-600',
      href: '/ai-teachers'
    },
    {
      title: 'Teams',
      icon: Target,
      color: 'bg-pink-500 hover:bg-pink-600',
      href: '/teams'
    },
    {
      title: 'Profile',
      icon: TrendingUp,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      href: '/profile'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className={`p-4 rounded-lg transition-colors text-white ${action.color} flex flex-col items-center space-y-2 hover:scale-105 transform duration-200`}
          >
            <action.icon className="h-6 w-6" />
            <span className="text-sm font-medium">{action.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}