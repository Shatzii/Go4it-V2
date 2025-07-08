'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  TrendingUp, 
  Trophy, 
  Target, 
  Users, 
  Calendar,
  Video,
  Star,
  BarChart3,
  Activity,
  Award,
  Zap,
  BookOpen,
  MessageSquare,
  Settings,
  Bell,
  ChevronRight,
  Play,
  Eye,
  Plus
} from 'lucide-react';

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
  const [recentActivity, setRecentActivity] = useState([]);
  const [quickStats, setQuickStats] = useState({
    currentGAR: 0,
    totalXP: 0,
    currentLevel: 1,
    videosUploaded: 0,
    achievementsUnlocked: 0,
    scoutViews: 0
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadDashboardData();
    loadRecentActivity();
    loadQuickStats();
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

  const loadRecentActivity = async () => {
    try {
      setRecentActivity([
        {
          id: 1,
          type: 'video_upload',
          title: 'New GAR Analysis Complete',
          description: 'Basketball scrimmage video processed - GAR Score: 78',
          timestamp: '2 hours ago',
          icon: Video,
          color: 'text-blue-400'
        },
        {
          id: 2,
          type: 'achievement',
          title: 'Achievement Unlocked',
          description: 'Consistency Champion - 5 consecutive uploads',
          timestamp: '1 day ago',
          icon: Trophy,
          color: 'text-yellow-400'
        },
        {
          id: 3,
          type: 'starpath',
          title: 'StarPath Level Up',
          description: 'Advanced to Emerging Talent (Level 2)',
          timestamp: '3 days ago',
          icon: Star,
          color: 'text-purple-400'
        },
        {
          id: 4,
          type: 'scout',
          title: 'Scout Activity',
          description: '3 new scouts viewed your profile',
          timestamp: '1 week ago',
          icon: Eye,
          color: 'text-green-400'
        }
      ]);
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    }
  };

  const loadQuickStats = async () => {
    try {
      setQuickStats({
        currentGAR: 78,
        totalXP: 2850,
        currentLevel: 12,
        videosUploaded: 15,
        achievementsUnlocked: 8,
        scoutViews: 47
      });
    } catch (error) {
      console.error('Failed to load quick stats:', error);
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
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Enhanced Header with Navigation */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Go4It Sports
              </h1>
              <nav className="hidden md:flex space-x-6">
                <NavLink href="/dashboard" active>Dashboard</NavLink>
                <NavLink href="/gar-upload">GAR Analysis</NavLink>
                <NavLink href="/starpath">StarPath</NavLink>
                <NavLink href="/teams">Teams</NavLink>
                <NavLink href="/profile">Profile</NavLink>
                {user?.role === 'admin' && (
                  <NavLink href="/admin">Admin</NavLink>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-400">3</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {user?.firstName || user?.username}
                </p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || user?.username}! 👋
          </h2>
          <p className="text-slate-400">
            Here's your athletic development summary for today
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <QuickStatCard
            label="Current GAR"
            value={quickStats.currentGAR}
            icon={<BarChart3 className="w-5 h-5" />}
            color="text-blue-400"
            suffix="/100"
          />
          <QuickStatCard
            label="Total XP"
            value={quickStats.totalXP.toLocaleString()}
            icon={<Zap className="w-5 h-5" />}
            color="text-yellow-400"
          />
          <QuickStatCard
            label="Current Level"
            value={quickStats.currentLevel}
            icon={<Star className="w-5 h-5" />}
            color="text-purple-400"
          />
          <QuickStatCard
            label="Videos"
            value={quickStats.videosUploaded}
            icon={<Video className="w-5 h-5" />}
            color="text-green-400"
          />
          <QuickStatCard
            label="Achievements"
            value={quickStats.achievementsUnlocked}
            icon={<Award className="w-5 h-5" />}
            color="text-orange-400"
          />
          <QuickStatCard
            label="Scout Views"
            value={quickStats.scoutViews}
            icon={<Eye className="w-5 h-5" />}
            color="text-cyan-400"
          />
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EnhancedStatCard
            title="GAR Analyses"
            value={stats.garAnalyses}
            icon={<TrendingUp className="h-8 w-8" />}
            description="Video analyses completed"
            trend="+2 this week"
            color="bg-blue-500/10 text-blue-400 border-blue-500/20"
            onClick={() => router.push('/gar-upload')}
          />
          <EnhancedStatCard
            title="StarPath Progress"
            value={`${stats.starPathProgress}%`}
            icon={<Target className="h-8 w-8" />}
            description="Skill development completion"
            trend="+5% this month"
            color="bg-green-500/10 text-green-400 border-green-500/20"
            onClick={() => router.push('/starpath')}
          />
          <EnhancedStatCard
            title="Achievements"
            value={stats.achievements}
            icon={<Trophy className="h-8 w-8" />}
            description="Badges earned"
            trend="2 new badges"
            color="bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            onClick={() => router.push('/profile')}
          />
          <EnhancedStatCard
            title="Active Scouts"
            value={stats.activeUsers}
            icon={<Users className="h-8 w-8" />}
            description="Athlete scouts monitoring"
            trend="47 profile views"
            color="bg-purple-500/10 text-purple-400 border-purple-500/20"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-blue-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionButton
                  title="Upload Video"
                  description="Get GAR analysis with AI insights"
                  icon={<Upload className="w-8 h-8" />}
                  color="bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push('/gar-upload')}
                />
                <ActionButton
                  title="View StarPath"
                  description="Check skill progression & unlock new levels"
                  icon={<Star className="w-8 h-8" />}
                  color="bg-purple-600 hover:bg-purple-700"
                  onClick={() => router.push('/starpath')}
                />
                <ActionButton
                  title="Team Management"
                  description="Manage teams & coordinate with coaches"
                  icon={<Users className="w-8 h-8" />}
                  color="bg-green-600 hover:bg-green-700"
                  onClick={() => router.push('/teams')}
                />
                <ActionButton
                  title="Academic Progress"
                  description="Track GPA & NCAA eligibility"
                  icon={<BookOpen className="w-8 h-8" />}
                  color="bg-orange-600 hover:bg-orange-700"
                  onClick={() => router.push('/academics')}
                />
                <ActionButton
                  title="Highlight Reel Generator"
                  description="Create professional highlight reels with AI"
                  icon={<Video className="w-8 h-8" />}
                  color="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  onClick={() => router.push('/highlight-reel')}
                />
                <ActionButton
                  title="Performance Analytics"
                  description="Advanced biomechanical analysis"
                  icon={<BarChart3 className="w-8 h-8" />}
                  color="bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => router.push('/analytics')}
                />
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-green-400" />
                Performance Overview
              </h3>
              <div className="space-y-4">
                <PerformanceMetric
                  label="Average GAR Score"
                  value="78"
                  max="100"
                  color="bg-blue-500"
                  percentage={78}
                />
                <PerformanceMetric
                  label="Skill Development"
                  value="65"
                  max="100"
                  color="bg-purple-500"
                  percentage={65}
                />
                <PerformanceMetric
                  label="Academic Progress"
                  value="92"
                  max="100"
                  color="bg-green-500"
                  percentage={92}
                />
                <PerformanceMetric
                  label="Scout Interest"
                  value="47"
                  max="100"
                  color="bg-cyan-500"
                  percentage={47}
                />
              </div>
            </div>

            {/* GAR Video Analysis Hub */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Video className="w-6 h-6 mr-2 text-blue-400" />
                GAR Video Analysis
              </h3>
              
              {/* Video Upload Area */}
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 mb-6 text-center bg-slate-900/50">
                <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-white mb-2">Upload Performance Video</h4>
                <p className="text-slate-400 mb-4">Get AI-powered GAR scoring and biomechanical analysis</p>
                <div className="flex space-x-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Select Video File
                  </button>
                  <button 
                    onClick={() => router.push('/highlight-reel')}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Create Highlight Reel</span>
                  </button>
                </div>
              </div>
              
              {/* Recent GAR Analysis */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">92</div>
                  <div className="text-sm text-slate-400">Latest GAR</div>
                  <div className="text-xs text-slate-500">Basketball Jump Shot</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">88.5</div>
                  <div className="text-sm text-slate-400">30-Day Avg</div>
                  <div className="text-xs text-slate-500">12 videos analyzed</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">+5.2</div>
                  <div className="text-sm text-slate-400">Improvement</div>
                  <div className="text-xs text-slate-500">vs last month</div>
                </div>
              </div>
            </div>

            {/* Recruitment Dashboard */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-green-400" />
                Recruitment Hub
              </h3>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-400">47</div>
                  <div className="text-xs text-slate-400">Profile Views</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-blue-400">12</div>
                  <div className="text-xs text-slate-400">Active Scouts</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-purple-400">8</div>
                  <div className="text-xs text-slate-400">College Interests</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-orange-400">3</div>
                  <div className="text-xs text-slate-400">Offers</div>
                </div>
              </div>
              
              {/* Recent Scout Activity */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-300">Recent Scout Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">DU</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Duke University</div>
                        <div className="text-xs text-slate-400">Viewed profile</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">2h ago</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">UCLA</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">UCLA</div>
                        <div className="text-xs text-slate-400">Downloaded highlight reel</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">1d ago</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Progress Tracker */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-orange-400" />
                Academic Progress
              </h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">3.8</div>
                  <div className="text-sm text-slate-400">Current GPA</div>
                  <div className="text-xs text-green-400">Above NCAA minimum</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">✓</div>
                  <div className="text-sm text-slate-400">NCAA Eligible</div>
                  <div className="text-xs text-green-400">Status: Qualified</div>
                </div>
              </div>
              
              {/* Course Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Core Academic Courses</span>
                  <span className="text-sm text-green-400">15/16 Complete</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '93.75%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">SAT/ACT Requirements</span>
                  <span className="text-sm text-blue-400">Met</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity Feed */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-blue-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    icon={activity.icon}
                    title={activity.title}
                    description={activity.description}
                    timestamp={activity.timestamp}
                    color={activity.color}
                  />
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-green-400" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <EventItem
                  title="Basketball Practice"
                  time="Tomorrow, 4:00 PM"
                  type="practice"
                />
                <EventItem
                  title="Video Analysis Session"
                  time="Friday, 2:00 PM"
                  type="analysis"
                />
                <EventItem
                  title="College Scout Visit"
                  time="Next Week"
                  type="scout"
                />
              </div>
            </div>

            {/* Quick Messages */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-purple-400" />
                Messages
              </h3>
              <div className="space-y-3">
                <MessageItem
                  sender="Coach Thompson"
                  message="Great progress on your shooting form!"
                  time="2h ago"
                />
                <MessageItem
                  sender="Scout Williams"
                  message="Interested in scheduling a meeting"
                  time="1d ago"
                />
              </div>
              <button className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                View All Messages
              </button>
            </div>

            {/* AI Coaching Insights */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-indigo-400" />
                AI Coaching Insights
              </h3>
              
              <div className="space-y-4">
                {/* Today's Focus */}
                <div className="bg-indigo-600/20 border border-indigo-500 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Target className="w-4 h-4 text-indigo-400 mr-2" />
                    <h4 className="text-sm font-semibold text-indigo-400">Today's Focus</h4>
                  </div>
                  <p className="text-sm text-white">Work on follow-through consistency. Your shooting accuracy improved 12% with proper form.</p>
                </div>
                
                {/* ADHD-Optimized Training */}
                <div className="bg-purple-600/20 border border-purple-500 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Zap className="w-4 h-4 text-purple-400 mr-2" />
                    <h4 className="text-sm font-semibold text-purple-400">ADHD-Optimized</h4>
                  </div>
                  <p className="text-sm text-white">Use 15-minute focused sessions with 5-minute breaks for optimal concentration.</p>
                </div>
                
                {/* Performance Trend */}
                <div className="bg-green-600/20 border border-green-500 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                    <h4 className="text-sm font-semibold text-green-400">Performance Trend</h4>
                  </div>
                  <p className="text-sm text-white">You're improving! GAR scores increased 8.3% over the past month.</p>
                </div>
                
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                  Get Personalized Training Plan
                </button>
              </div>
            </div>

            {/* StarPath Quick View */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Star className="w-6 h-6 mr-2 text-purple-400" />
                StarPath Progress
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">Level 8</div>
                  <div className="text-sm text-slate-400">Current Tier</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">2,450</div>
                  <div className="text-sm text-slate-400">Total XP</div>
                </div>
              </div>
              
              {/* Recent Achievements */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-300">Recent Achievements</h4>
                <div className="flex items-center space-x-2 p-2 bg-slate-900 rounded">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white">Ball Control Master</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-slate-900 rounded">
                  <Trophy className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Shooting Specialist</span>
                </div>
              </div>
              
              <button 
                onClick={() => router.push('/starpath')}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
              >
                View Full Skill Tree
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Component Functions

function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <a
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-slate-700 text-white'
          : 'text-slate-300 hover:text-white hover:bg-slate-700'
      }`}
    >
      {children}
    </a>
  );
}

function QuickStatCard({ label, value, icon, color, suffix = '' }: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className={`${color}`}>{icon}</div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {value}{suffix}
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function EnhancedStatCard({ title, value, icon, description, trend, color, onClick }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`rounded-xl p-6 border cursor-pointer transition-all hover:scale-105 ${color}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        {icon}
        <ChevronRight className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <p className="text-sm opacity-80 mb-1">{description}</p>
      <p className="text-xs opacity-60">{trend}</p>
    </div>
  );
}

function ActionButton({ title, description, icon, color, onClick }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white p-6 rounded-xl transition-all hover:scale-105 text-left w-full`}
    >
      <div className="flex items-center justify-between mb-4">
        {icon}
        <ChevronRight className="w-6 h-6" />
      </div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  );
}

function PerformanceMetric({ label, value, max, color, percentage }: {
  label: string;
  value: string;
  max: string;
  color: string;
  percentage: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm text-slate-400">{value}/{max}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, description, timestamp, color }: {
  icon: any;
  title: string;
  description: string;
  timestamp: string;
  color: string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-lg bg-slate-700 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-slate-400">{description}</p>
        <p className="text-xs text-slate-500 mt-1">{timestamp}</p>
      </div>
    </div>
  );
}

function EventItem({ title, time, type }: {
  title: string;
  time: string;
  type: string;
}) {
  const getTypeColor = () => {
    switch (type) {
      case 'practice': return 'bg-blue-500/20 text-blue-400';
      case 'analysis': return 'bg-purple-500/20 text-purple-400';
      case 'scout': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-slate-400">{time}</p>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs ${getTypeColor()}`}>
        {type}
      </div>
    </div>
  );
}

function MessageItem({ sender, message, time }: {
  sender: string;
  message: string;
  time: string;
}) {
  return (
    <div className="p-3 bg-slate-700 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-white">{sender}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
      <p className="text-xs text-slate-400">{message}</p>
    </div>
  );
}