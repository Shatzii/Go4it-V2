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
      onClick: () => console.log('Upload video')
    },
    {
      title: 'Start Training',
      icon: Play,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => console.log('Start training')
    },
    {
      title: 'Schedule Session',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => console.log('Schedule session')
    },
    {
      title: 'Message Coach',
      icon: MessageCircle,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => console.log('Message coach')
    },
    {
      title: 'Set Goals',
      icon: Target,
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => console.log('Set goals')
    },
    {
      title: 'View Progress',
      icon: TrendingUp,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => console.log('View progress')
    }
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-lg transition-colors text-white ${action.color} flex flex-col items-center space-y-2`}
          >
            <action.icon className="h-6 w-6" />
            <span className="text-sm font-medium">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}