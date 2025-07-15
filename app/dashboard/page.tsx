'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Target, Eye, GraduationCap, Video } from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';
import { DashboardSkeleton } from '@/components/ui/SkeletonLoader';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { AICoachingEngine } from '@/components/ai/AICoachingEngine';
import { HighlightReelGenerator } from '@/components/highlights/HighlightReelGenerator';
import { useApp } from '@/components/providers/AppProviders';

export default function OptimizedDashboard() {
  const { user, loading, setUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <ClientOnly fallback={<DashboardSkeleton />}>
      <div className="min-h-screen bg-background text-foreground hero-bg">
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground neon-text mb-2">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Ready to elevate your athletic performance today?
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Star Level"
              value="Level 8"
              icon={Star}
              color="blue"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="GAR Score"
              value="78"
              icon={Trophy}
              color="green"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Current GPA"
              value="3.8"
              icon={GraduationCap}
              color="purple"
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Scout Views"
              value="47"
              icon={Eye}
              color="orange"
              trend={{ value: 23, isPositive: true }}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Features */}
            <div className="lg:col-span-2 space-y-6">
              <QuickActions />
              
              {/* StarPath Progress */}
              <div className="bg-card border border-border rounded-lg p-6 neon-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">StarPath Progress</h3>
                  <span className="text-sm text-primary">Level 8 - Elite Prospect</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current XP</span>
                    <span className="text-sm text-foreground">2,450 / 3,000</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full neon-glow"
                      style={{ width: '81.7%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">550 XP to next level</span>
                    <span className="text-primary">+150 XP today</span>
                  </div>
                </div>
              </div>

              {/* Video Analysis Hub */}
              <div className="bg-card border border-border rounded-lg p-6 neon-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">GAR Video Analysis</h3>
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Latest Analysis</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your form has improved by 12% since last week
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary neon-text">78</span>
                      <span className="text-sm text-muted-foreground">GAR Score</span>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Upload New Video</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get instant AI-powered analysis
                    </p>
                    <a href="/gar-upload" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded text-sm transition-colors inline-block text-center neon-border">
                      Upload Video
                    </a>
                  </div>
                </div>
              </div>

              {/* AI Coaching Engine */}
              <AICoachingEngine 
                userId={user.id.toString()} 
                sportType="soccer" 
                adhdSupport={true} 
              />

              {/* Highlight Reel Generator */}
              <HighlightReelGenerator />
            </div>

            {/* Right Column - Activity & Info */}
            <div className="space-y-6">
              <ActivityFeed />
              
              {/* Recruitment Status */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recruitment Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Active Scouts</span>
                    <span className="text-sm text-white">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Profile Views</span>
                    <span className="text-sm text-white">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">College Interests</span>
                    <span className="text-sm text-white">8</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-sm text-blue-400">
                      Duke University scout viewed your profile
                    </p>
                    <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>

              {/* Academic Progress */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Academic Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Current GPA</span>
                    <span className="text-sm text-white">3.8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">NCAA Eligible</span>
                    <span className="text-sm text-green-400">Yes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Credits Completed</span>
                    <span className="text-sm text-white">45/120</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ width: '37.5%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ClientOnly>
  );
}