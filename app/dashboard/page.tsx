'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, TrendingUp, Trophy, Target, Users, Calendar } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  sport?: string;
}

interface DashboardStats {
  garAnalyses: number;
  starPathProgress: number;
  achievements: number;
  activeUsers: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    garAnalyses: 0,
    starPathProgress: 0,
    achievements: 0,
    activeUsers: 711
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/auth');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth');
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load user-specific stats
      const [garResponse, starPathResponse, achievementsResponse] = await Promise.all([
        fetch('/api/gar/stats'),
        fetch('/api/starpath/stats'),
        fetch('/api/achievements/stats')
      ]);

      const garData = garResponse.ok ? await garResponse.json() : { count: 0 };
      const starPathData = starPathResponse.ok ? await starPathResponse.json() : { progress: 0 };
      const achievementsData = achievementsResponse.ok ? await achievementsResponse.json() : { count: 0 };

      setStats({
        garAnalyses: garData.count || 0,
        starPathProgress: starPathData.progress || 0,
        achievements: achievementsData.count || 0,
        activeUsers: 711 // Active athlete scouts
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-400">Go4It Sports</h1>
              <span className="text-slate-400">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">
                Welcome, {user?.firstName || user?.username}
              </span>
              <button
                onClick={logout}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="GAR Analyses"
            value={stats.garAnalyses}
            icon={<TrendingUp className="h-8 w-8 text-blue-400" />}
            description="Video analyses completed"
          />
          <StatCard
            title="StarPath Progress"
            value={`${stats.starPathProgress}%`}
            icon={<Target className="h-8 w-8 text-green-400" />}
            description="Skill development completion"
          />
          <StatCard
            title="Achievements"
            value={stats.achievements}
            icon={<Trophy className="h-8 w-8 text-yellow-400" />}
            description="Badges earned"
          />
          <StatCard
            title="Active Scouts"
            value={stats.activeUsers}
            icon={<Users className="h-8 w-8 text-purple-400" />}
            description="Athlete scouts monitoring"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <QuickActionCard
            title="Upload Video for GAR Analysis"
            description="Get your Growth and Ability Rating with AI-powered analysis"
            icon={<Upload className="h-12 w-12 text-blue-400" />}
            action={() => router.push('/gar-upload')}
            buttonText="Upload Video"
          />
          <QuickActionCard
            title="Continue StarPath Journey"
            description="Unlock new skills and advance your athletic development"
            icon={<Target className="h-12 w-12 text-green-400" />}
            action={() => router.push('/starpath')}
            buttonText="View StarPath"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            <ActivityItem
              title="Platform Ready"
              description="Go4It Sports Next.js platform successfully deployed"
              time="Just now"
              type="success"
            />
            <ActivityItem
              title="Database Initialized"
              description="User authentication and core tables created"
              time="2 minutes ago"
              type="info"
            />
            <ActivityItem
              title="711 Athlete Scouts Active"
              description="Recruitment monitoring system operational"
              time="5 minutes ago"
              type="success"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, description }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <p className="text-slate-500 text-xs mt-1">{description}</p>
        </div>
        <div className="flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, icon, action, buttonText }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  buttonText: string;
}) {
  return (
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-slate-400 mb-4">{description}</p>
          <button
            onClick={action}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time, type }: {
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}) {
  const typeColors = {
    success: 'text-green-400',
    info: 'text-blue-400',
    warning: 'text-yellow-400'
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800">
      <div className={`w-2 h-2 rounded-full mt-2 ${typeColors[type].replace('text-', 'bg-')}`}></div>
      <div className="flex-1">
        <p className="font-medium text-white">{title}</p>
        <p className="text-slate-400 text-sm">{description}</p>
        <p className="text-slate-500 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}