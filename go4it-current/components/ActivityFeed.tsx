'use client';

import { useState, useEffect } from 'react';
import { Trophy, Upload, Star, Target } from 'lucide-react';

interface Activity {
  id: string;
  type: 'upload' | 'commit' | 'score' | 'interest';
  user: string;
  action: string;
  timestamp: Date;
  icon: React.ReactNode;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'commit',
    user: 'Marcus J.',
    action: 'committed to University of Miami',
    timestamp: new Date(Date.now() - 300000), // 5 min ago
    icon: <Trophy className="w-4 h-4 text-yellow-400" />,
  },
  {
    id: '2',
    type: 'upload',
    user: 'Sarah M.',
    action: 'uploaded new highlight reel',
    timestamp: new Date(Date.now() - 600000), // 10 min ago
    icon: <Upload className="w-4 h-4 text-blue-400" />,
  },
  {
    id: '3',
    type: 'interest',
    user: 'Devon K.',
    action: 'received interest from Duke University',
    timestamp: new Date(Date.now() - 900000), // 15 min ago
    icon: <Star className="w-4 h-4 text-purple-400" />,
  },
  {
    id: '4',
    type: 'score',
    user: 'Alex R.',
    action: 'achieved 9.2 GAR Score',
    timestamp: new Date(Date.now() - 1200000), // 20 min ago
    icon: <Target className="w-4 h-4 text-green-400" />,
  },
  {
    id: '5',
    type: 'commit',
    user: 'Jordan T.',
    action: 'committed to Stanford University',
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
    icon: <Trophy className="w-4 h-4 text-yellow-400" />,
  },
];

export default function ActivityFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
    return `${diff}m ago`;
  };

  const currentActivity = activities[currentIndex];

  return (
    <div className="hero-bg neon-border p-4 rounded-lg mb-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs text-slate-400 font-medium">LIVE ACTIVITY</span>
      </div>

      <div
        className={`transition-all duration-300 ${
          isVisible ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-2'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{currentActivity.icon}</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white truncate">
              <span className="font-semibold neon-text">{currentActivity.user}</span>{' '}
              {currentActivity.action}
            </p>
            <p className="text-xs text-slate-500">{formatTime(currentActivity.timestamp)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
