'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  Trophy, 
  Target, 
  Zap, 
  Video, 
  BookOpen, 
  Dumbbell, 
  Calendar,
  Users,
  MessageCircle,
  TrendingUp,
  Award,
  Brain,
  Heart,
  Camera,
  Shield,
  Graduation,
  Play,
  CheckCircle,
  Lock,
  ArrowRight,
  BarChart3,
  Activity,
  Clock,
  Medal,
  Flame,
  Plus,
  Settings,
  Eye,
  School
} from 'lucide-react';

interface User {
  id: number;
  firstName?: string;
  username?: string;
  email?: string;
}

interface StarPathProgress {
  currentStarLevel: number;
  targetStarLevel: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  skillTreeProgress: number;
  completedDrills: number;
  verifiedWorkouts: number;
  streakDays: number;
  longestStreak: number;
  achievements: number;
  garScore?: number;
  lastGarAnalysis?: string;
}

interface AcademicProgress {
  currentGPA: number;
  targetGPA: number;
  completedCredits: number;
  totalCredits: number;
  ncaaEligible: boolean;
  upcomingDeadlines: number;
}

interface RecentActivity {
  id: string;
  type: 'workout' | 'video' | 'achievement' | 'academic' | 'skill';
  title: string;
  description: string;
  xpEarned?: number;
  timestamp: string;
  verified?: boolean;
}

export default function PlayerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [starPathProgress, setStarPathProgress] = useState<StarPathProgress>({
    currentStarLevel: 2,
    targetStarLevel: 5,
    currentXP: 1750,
    nextLevelXP: 2000,
    totalXP: 8500,
    skillTreeProgress: 34,
    completedDrills: 45,
    verifiedWorkouts: 23,
    streakDays: 7,
    longestStreak: 14,
    achievements: 12,
    garScore: 78,
    lastGarAnalysis: '2024-01-15'
  });
  const [academicProgress, setAcademicProgress] = useState<AcademicProgress>({
    currentGPA: 3.4,
    targetGPA: 3.8,
    completedCredits: 45,
    totalCredits: 120,
    ncaaEligible: true,
    upcomingDeadlines: 3
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'workout',
      title: 'Agility Ladder Drill',
      description: 'Completed advanced agility training session',
      xpEarned: 150,
      timestamp: '2 hours ago',
      verified: true
    },
    {
      id: '2',
      type: 'video',
      title: 'GAR Analysis Complete',
      description: 'New video analysis shows 12% improvement',
      xpEarned: 200,
      timestamp: '1 day ago',
      verified: true
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Weekly Warrior',
      description: 'Completed 7 consecutive days of training',
      xpEarned: 300,
      timestamp: '2 days ago',
      verified: true
    }
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      const userResponse = await fetch('/api/auth/me');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      // Load StarPath progress
      const starPathResponse = await fetch('/api/starpath/progress');
      if (starPathResponse.ok) {
        const progress = await starPathResponse.json();
        console.log('StarPath progress loaded:', progress);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStarLevelTitle = (level: number) => {
    const titles = {
      1: 'Rising Prospect',
      2: 'Emerging Talent', 
      3: 'Standout Performer',
      4: 'Elite Prospect',
      5: 'Five-Star Athlete'
    };
    return titles[level] || 'Unknown Level';
  };

  const getStarLevelColor = (level: number) => {
    const colors = {
      1: 'text-gray-400',
      2: 'text-blue-400',
      3: 'text-green-400', 
      4: 'text-purple-400',
      5: 'text-yellow-400'
    };
    return colors[level] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your StarPath journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Player Dashboard
              </h1>
              <nav className="hidden md:flex space-x-6">
                <NavLink href="/dashboard" active>Dashboard</NavLink>
                <NavLink href="/starpath">StarPath</NavLink>
                <NavLink href="/gar-upload">Video Analysis</NavLink>
                <NavLink href="/profile">Profile</NavLink>
                <NavLink href="/teams">Teams</NavLink>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Quick Upload
              </button>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || user?.username || 'Athlete'}!
          </h2>
          <p className="text-slate-400">
            Continue your journey to become a Five-Star Athlete. You're currently a {getStarLevelTitle(starPathProgress.currentStarLevel)}.
          </p>
        </div>

        {/* StarPath Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main StarPath Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">StarPath Progress</h3>
                <p className="text-slate-400">Real-world training meets digital progression</p>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= starPathProgress.currentStarLevel
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{starPathProgress.currentXP}</div>
                <div className="text-sm text-slate-400">Current XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{starPathProgress.skillTreeProgress}%</div>
                <div className="text-sm text-slate-400">Skills Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{starPathProgress.verifiedWorkouts}</div>
                <div className="text-sm text-slate-400">Verified Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{starPathProgress.streakDays}</div>
                <div className="text-sm text-slate-400">Day Streak</div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Level Progress</span>
                <span className="text-slate-300">
                  {starPathProgress.currentXP}/{starPathProgress.nextLevelXP} XP
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(starPathProgress.currentXP / starPathProgress.nextLevelXP) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/starpath')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Continue StarPath</span>
              </button>
              <button
                onClick={() => router.push('/gar-upload')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Video className="h-4 w-4" />
                <span>Upload Video</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            {/* GAR Score */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Latest GAR Score</h4>
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{starPathProgress.garScore}/100</div>
              <div className="text-sm text-slate-400">From {starPathProgress.lastGarAnalysis}</div>
              <button className="w-full mt-3 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded text-sm transition-colors">
                View Analysis
              </button>
            </div>

            {/* Academic Progress */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Academic Status</h4>
                <BookOpen className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{academicProgress.currentGPA}</div>
              <div className="text-sm text-slate-400">Current GPA</div>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">NCAA Eligible</span>
              </div>
              <button className="w-full mt-3 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded text-sm transition-colors">
                View Academics
              </button>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Video Analysis */}
          <FeatureCard
            icon={<Video className="h-6 w-6" />}
            title="Video Analysis"
            description="Upload videos for GAR scoring"
            action="Upload Video"
            onClick={() => router.push('/gar-upload')}
            color="blue"
          />

          {/* Skill Tree */}
          <FeatureCard
            icon={<Target className="h-6 w-6" />}
            title="Skill Development"
            description="Interactive skill tree progression"
            action="Train Skills"
            onClick={() => router.push('/skill-tree')}
            color="green"
          />

          {/* Workout Verification */}
          <FeatureCard
            icon={<Dumbbell className="h-6 w-6" />}
            title="Workout Verification"
            description="Submit workouts for XP rewards"
            action="Submit Workout"
            onClick={() => router.push('/myplayer/verification')}
            color="purple"
          />

          {/* Academic Tracker */}
          <FeatureCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Academic Progress"
            description="Track GPA and NCAA eligibility"
            action="View Academics"
            onClick={() => router.push('/academics')}
            color="orange"
          />
        </div>

        {/* Recent Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-slate-800 rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.type === 'workout' && <Dumbbell className="h-5 w-5 text-purple-400" />}
                    {activity.type === 'video' && <Video className="h-5 w-5 text-blue-400" />}
                    {activity.type === 'achievement' && <Trophy className="h-5 w-5 text-yellow-400" />}
                    {activity.type === 'academic' && <BookOpen className="h-5 w-5 text-green-400" />}
                    {activity.type === 'skill' && <Target className="h-5 w-5 text-orange-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                      {activity.verified && <CheckCircle className="h-4 w-4 text-green-400" />}
                    </div>
                    <p className="text-xs text-slate-400">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-500">{activity.timestamp}</span>
                      {activity.xpEarned && (
                        <span className="text-xs text-blue-400 font-medium">+{activity.xpEarned} XP</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              View All Activity
            </button>
          </div>

          {/* Quick Actions & Tools */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Quick Actions</h3>
              <Zap className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionButton
                icon={<Camera className="h-5 w-5" />}
                title="Record Video"
                onClick={() => router.push('/mobile-video')}
              />
              <QuickActionButton
                icon={<MessageCircle className="h-5 w-5" />}
                title="AI Coach Chat"
                onClick={() => router.push('/myplayer/ai-coach')}
              />
              <QuickActionButton
                icon={<Users className="h-5 w-5" />}
                title="Team Hub"
                onClick={() => router.push('/teams')}
              />
              <QuickActionButton
                icon={<TrendingUp className="h-5 w-5" />}
                title="Analytics"
                onClick={() => router.push('/analytics')}
              />
              <QuickActionButton
                icon={<Heart className="h-5 w-5" />}
                title="Health Metrics"
                onClick={() => router.push('/health')}
              />
              <QuickActionButton
                icon={<Eye className="h-5 w-5" />}
                title="Scout Vision"
                onClick={() => router.push('/scout-network')}
              />
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-8 bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Achievements</h3>
            <Award className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AchievementCard
              icon="🔥"
              title="Streak Master"
              description="7-day training streak"
              date="Today"
            />
            <AchievementCard
              icon="⭐"
              title="Star Rising"
              description="Reached 2-Star level"
              date="3 days ago"
            />
            <AchievementCard
              icon="🏆"
              title="Skill Collector"
              description="Unlocked 15 skills"
              date="1 week ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <a
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:text-white hover:bg-slate-800'
      }`}
    >
      {children}
    </a>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  action, 
  onClick, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  action: string; 
  onClick: () => void; 
  color: string;
}) {
  const colorClasses = {
    blue: 'border-blue-500/20 hover:border-blue-500/40',
    green: 'border-green-500/20 hover:border-green-500/40',
    purple: 'border-purple-500/20 hover:border-purple-500/40',
    orange: 'border-orange-500/20 hover:border-orange-500/40',
  };

  return (
    <div className={`bg-slate-900 rounded-lg p-6 border transition-all hover:scale-105 cursor-pointer ${colorClasses[color]}`} onClick={onClick}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-white">{icon}</div>
        <h4 className="font-medium text-white">{title}</h4>
      </div>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <button className="w-full bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-2">
        <span>{action}</span>
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function QuickActionButton({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-center group"
    >
      <div className="text-white mb-2 flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-xs text-slate-300 font-medium">{title}</div>
    </button>
  );
}

function AchievementCard({ icon, title, description, date }: { icon: string; title: string; description: string; date: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-medium text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400 mb-2">{description}</p>
      <span className="text-xs text-slate-500">{date}</span>
    </div>
  );
}