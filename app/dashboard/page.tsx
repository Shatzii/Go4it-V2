
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
  School,
  ChevronRight,
  Timer,
  MapPin,
  Gamepad2,
  Upload,
  LineChart,
  UserPlus,
  Headphones,
  Smartphone,
  Search,
  FileText,
  AlertCircle,
  ThumbsUp
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
  unlockedSkills: number;
  totalSkills: number;
  weeklyGoalProgress: number;
  monthlyRank: number;
}

interface AcademicProgress {
  currentGPA: number;
  targetGPA: number;
  completedCredits: number;
  totalCredits: number;
  ncaaEligible: boolean;
  upcomingDeadlines: number;
  currentCourses: number;
  semesterHours: number;
  academicStanding: string;
}

interface HealthMetrics {
  recoveryScore: number;
  sleepHours: number;
  hydrationLevel: number;
  energyLevel: number;
  injuryStatus: string;
  lastWorkout: string;
}

interface ScoutActivity {
  scoutName: string;
  action: string;
  timestamp: string;
  university: string;
}

interface RecentActivity {
  id: string;
  type: 'workout' | 'video' | 'achievement' | 'academic' | 'skill' | 'scout' | 'team';
  title: string;
  description: string;
  xpEarned?: number;
  timestamp: string;
  verified?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export default function StudentAthleteDashboard() {
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
    lastGarAnalysis: '2024-01-15',
    unlockedSkills: 15,
    totalSkills: 44,
    weeklyGoalProgress: 68,
    monthlyRank: 142
  });
  
  const [academicProgress, setAcademicProgress] = useState<AcademicProgress>({
    currentGPA: 3.4,
    targetGPA: 3.8,
    completedCredits: 45,
    totalCredits: 120,
    ncaaEligible: true,
    upcomingDeadlines: 3,
    currentCourses: 5,
    semesterHours: 15,
    academicStanding: 'Good Standing'
  });

  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    recoveryScore: 85,
    sleepHours: 7.5,
    hydrationLevel: 82,
    energyLevel: 78,
    injuryStatus: 'Healthy',
    lastWorkout: '6 hours ago'
  });

  const [scoutActivity, setScoutActivity] = useState<ScoutActivity[]>([
    {
      scoutName: 'Mike Johnson',
      action: 'Viewed profile',
      timestamp: '2 hours ago',
      university: 'Duke University'
    },
    {
      scoutName: 'Sarah Williams',
      action: 'Downloaded highlight reel',
      timestamp: '1 day ago',
      university: 'Stanford University'
    },
    {
      scoutName: 'Coach Rodriguez',
      action: 'Requested contact',
      timestamp: '3 days ago',
      university: 'UCLA'
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'workout',
      title: 'Agility Ladder Drill',
      description: 'Completed advanced agility training session',
      xpEarned: 150,
      timestamp: '2 hours ago',
      verified: true,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'video',
      title: 'GAR Analysis Complete',
      description: 'New video analysis shows 12% improvement',
      xpEarned: 200,
      timestamp: '1 day ago',
      verified: true,
      priority: 'high'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Weekly Warrior',
      description: 'Completed 7 consecutive days of training',
      xpEarned: 300,
      timestamp: '2 days ago',
      verified: true,
      priority: 'high'
    },
    {
      id: '4',
      type: 'scout',
      title: 'Scout Interest',
      description: 'Duke University scout viewed your profile',
      timestamp: '2 hours ago',
      priority: 'high'
    },
    {
      id: '5',
      type: 'academic',
      title: 'Assignment Submitted',
      description: 'Biology lab report submitted on time',
      timestamp: '1 day ago',
      priority: 'medium'
    }
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userResponse = await fetch('/api/auth/me');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      } else {
        // If user is not authenticated, redirect to login
        router.push('/auth');
        return;
      }

      const starPathResponse = await fetch('/api/starpath/progress');
      if (starPathResponse.ok) {
        const progress = await starPathResponse.json();
        console.log('StarPath progress loaded:', progress);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      // On error, redirect to login
      router.push('/auth');
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your athlete dashboard...</p>
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
                Student Athlete Dashboard
              </h1>
              <nav className="hidden md:flex space-x-6">
                <NavLink href="/dashboard" active>Dashboard</NavLink>
                <NavLink href="/starpath">StarPath</NavLink>
                <NavLink href="/gar-upload">Video Analysis</NavLink>
                <NavLink href="/academics">Academics</NavLink>
                <NavLink href="/profile">Profile</NavLink>
                <NavLink href="/teams">Teams</NavLink>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/gar-upload')}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Quick Upload</span>
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
            Continue your journey to become a Five-Star Athlete. You're currently a {getStarLevelTitle(starPathProgress.currentStarLevel)} with {starPathProgress.currentXP} XP.
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <QuickStat icon={<Star className="h-5 w-5" />} label="Star Level" value={starPathProgress.currentStarLevel} color="yellow" />
          <QuickStat icon={<Target className="h-5 w-5" />} label="GAR Score" value={starPathProgress.garScore} color="blue" />
          <QuickStat icon={<BookOpen className="h-5 w-5" />} label="GPA" value={academicProgress.currentGPA.toFixed(1)} color="green" />
          <QuickStat icon={<Dumbbell className="h-5 w-5" />} label="Workouts" value={starPathProgress.verifiedWorkouts} color="purple" />
          <QuickStat icon={<Eye className="h-5 w-5" />} label="Scout Views" value="24" color="orange" />
          <QuickStat icon={<Flame className="h-5 w-5" />} label="Streak" value={starPathProgress.streakDays} color="red" />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* StarPath Progress Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">StarPath Training System</h3>
                <p className="text-slate-400">Interactive hybrid training progression</p>
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
                <div className="text-2xl font-bold text-green-400">{starPathProgress.unlockedSkills}/{starPathProgress.totalSkills}</div>
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
                <Gamepad2 className="h-4 w-4" />
                <span>Continue StarPath</span>
              </button>
              <button
                onClick={() => router.push('/myplayer/verification')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Submit Workout</span>
              </button>
            </div>
          </div>

          {/* Scout Activity & Health */}
          <div className="space-y-4">
            {/* Scout Activity Card */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Scout Activity</h4>
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              <div className="space-y-3">
                {scoutActivity.slice(0, 2).map((activity, index) => (
                  <div key={index} className="text-sm">
                    <div className="text-white font-medium">{activity.scoutName}</div>
                    <div className="text-slate-400">{activity.action}</div>
                    <div className="text-xs text-slate-500">{activity.university} • {activity.timestamp}</div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => router.push('/scout-network')}
                className="w-full mt-3 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                View All Scout Activity
              </button>
            </div>

            {/* Health Metrics Card */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Health Metrics</h4>
                <Heart className="h-5 w-5 text-red-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Recovery</span>
                  <span className="text-green-400">{healthMetrics.recoveryScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Sleep</span>
                  <span className="text-blue-400">{healthMetrics.sleepHours}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Energy</span>
                  <span className="text-yellow-400">{healthMetrics.energyLevel}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status</span>
                  <span className="text-green-400">{healthMetrics.injuryStatus}</span>
                </div>
              </div>
              <button 
                onClick={() => router.push('/health')}
                className="w-full mt-3 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                View Health Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Academic Progress & GAR Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Academic Progress */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Academic Progress Tracker</h3>
              <School className="h-5 w-5 text-green-400" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{academicProgress.currentGPA}</div>
                <div className="text-sm text-slate-400">Current GPA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{academicProgress.completedCredits}</div>
                <div className="text-sm text-slate-400">Credits Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{academicProgress.currentCourses}</div>
                <div className="text-sm text-slate-400">Current Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{academicProgress.upcomingDeadlines}</div>
                <div className="text-sm text-slate-400">Due Soon</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-300">Degree Progress</span>
                <span className="text-slate-300">
                  {academicProgress.completedCredits}/{academicProgress.totalCredits} Credits
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(academicProgress.completedCredits / academicProgress.totalCredits) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">NCAA Eligible</span>
              </div>
              <div className="text-sm text-slate-400">{academicProgress.academicStanding}</div>
            </div>

            <button 
              onClick={() => router.push('/academics')}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              View Academic Dashboard
            </button>
          </div>

          {/* GAR Analysis */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">GAR Video Analysis</h3>
              <Target className="h-5 w-5 text-blue-400" />
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2">{starPathProgress.garScore}/100</div>
              <div className="text-sm text-slate-400">Overall GAR Score</div>
              <div className="text-xs text-slate-500">Last updated: {starPathProgress.lastGarAnalysis}</div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Technical Skills</span>
                <span className="text-blue-400">82/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Athletic Ability</span>
                <span className="text-green-400">85/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Game Readiness</span>
                <span className="text-yellow-400">74/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Physical Condition</span>
                <span className="text-purple-400">79/100</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => router.push('/gar-upload')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Video className="h-4 w-4" />
                <span>Upload Video</span>
              </button>
              <button 
                onClick={() => router.push('/video-analysis')}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Grid - All Student Athlete Tools */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {/* Core Features */}
          <FeatureCard
            icon={<Gamepad2 className="h-6 w-6" />}
            title="StarPath Training"
            description="Interactive skill development"
            action="Continue"
            onClick={() => router.push('/starpath')}
            color="blue"
          />
          
          <FeatureCard
            icon={<Target className="h-6 w-6" />}
            title="Skill Tree"
            description="Unlock new abilities"
            action="Develop"
            onClick={() => router.push('/skill-tree')}
            color="green"
          />

          <FeatureCard
            icon={<Dumbbell className="h-6 w-6" />}
            title="Workout Verification"
            description="Submit for XP rewards"
            action="Submit"
            onClick={() => router.push('/myplayer/verification')}
            color="purple"
          />

          <FeatureCard
            icon={<Video className="h-6 w-6" />}
            title="Video Analysis"
            description="GAR scoring & feedback"
            action="Upload"
            onClick={() => router.push('/gar-upload')}
            color="orange"
          />

          {/* Additional Features */}
          <FeatureCard
            icon={<School className="h-6 w-6" />}
            title="Academic Tracker"
            description="GPA & NCAA eligibility"
            action="View"
            onClick={() => router.push('/academics')}
            color="green"
          />

          <FeatureCard
            icon={<Eye className="h-6 w-6" />}
            title="Scout Network"
            description="College recruitment"
            action="Connect"
            onClick={() => router.push('/scout-network')}
            color="yellow"
          />

          <FeatureCard
            icon={<Heart className="h-6 w-6" />}
            title="Health Metrics"
            description="Recovery & wellness"
            action="Monitor"
            onClick={() => router.push('/health')}
            color="red"
          />

          <FeatureCard
            icon={<MessageCircle className="h-6 w-6" />}
            title="AI Coach"
            description="Personalized guidance"
            action="Chat"
            onClick={() => router.push('/myplayer/ai-coach')}
            color="blue"
          />

          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Team Hub"
            description="Team communications"
            action="Connect"
            onClick={() => router.push('/teams')}
            color="purple"
          />

          <FeatureCard
            icon={<Camera className="h-6 w-6" />}
            title="Mobile Capture"
            description="Record training videos"
            action="Record"
            onClick={() => router.push('/mobile-video')}
            color="orange"
          />

          <FeatureCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Analytics"
            description="Performance insights"
            action="Analyze"
            onClick={() => router.push('/analytics')}
            color="green"
          />

          <FeatureCard
            icon={<Award className="h-6 w-6" />}
            title="Achievements"
            description="Badges & milestones"
            action="Explore"
            onClick={() => router.push('/achievements')}
            color="yellow"
          />
        </div>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className={`flex items-center space-x-4 p-3 bg-slate-800 rounded-lg border ${getPriorityColor(activity.priority || 'low')}`}>
                  <div className="flex-shrink-0">
                    {activity.type === 'workout' && <Dumbbell className="h-5 w-5 text-purple-400" />}
                    {activity.type === 'video' && <Video className="h-5 w-5 text-blue-400" />}
                    {activity.type === 'achievement' && <Trophy className="h-5 w-5 text-yellow-400" />}
                    {activity.type === 'academic' && <BookOpen className="h-5 w-5 text-green-400" />}
                    {activity.type === 'skill' && <Target className="h-5 w-5 text-orange-400" />}
                    {activity.type === 'scout' && <Eye className="h-5 w-5 text-red-400" />}
                    {activity.type === 'team' && <Users className="h-5 w-5 text-purple-400" />}
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
                icon={<Upload className="h-5 w-5" />}
                title="Upload Video"
                onClick={() => router.push('/gar-upload')}
              />
              <QuickActionButton
                icon={<CheckCircle className="h-5 w-5" />}
                title="Submit Workout"
                onClick={() => router.push('/myplayer/verification')}
              />
              <QuickActionButton
                icon={<Smartphone className="h-5 w-5" />}
                title="Mobile Capture"
                onClick={() => router.push('/mobile-video')}
              />
              <QuickActionButton
                icon={<MessageCircle className="h-5 w-5" />}
                title="AI Coach"
                onClick={() => router.push('/myplayer/ai-coach')}
              />
              <QuickActionButton
                icon={<FileText className="h-5 w-5" />}
                title="View Transcript"
                onClick={() => router.push('/academics/progress')}
              />
              <QuickActionButton
                icon={<Search className="h-5 w-5" />}
                title="Scout Search"
                onClick={() => router.push('/scout-network')}
              />
            </div>
          </div>
        </div>

        {/* Weekly Goals & Monthly Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Weekly Goals */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Weekly Goals</h3>
              <Target className="h-5 w-5 text-green-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Training Sessions</span>
                <span className="text-white">4/5</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Video Uploads</span>
                <span className="text-white">2/3</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Study Hours</span>
                <span className="text-white">18/20</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-white">{starPathProgress.weeklyGoalProgress}%</div>
              <div className="text-sm text-slate-400">Weekly Progress</div>
            </div>
          </div>

          {/* Monthly Ranking & Achievements */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Performance Ranking</h3>
              <Medal className="h-5 w-5 text-yellow-400" />
            </div>
            
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-yellow-400">#{starPathProgress.monthlyRank}</div>
              <div className="text-sm text-slate-400">National Ranking</div>
              <div className="text-xs text-slate-500">Among {getStarLevelTitle(starPathProgress.currentStarLevel)} athletes</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">XP This Month</span>
                <span className="text-blue-400">+2,340</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Skills Unlocked</span>
                <span className="text-green-400">+3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Scout Views</span>
                <span className="text-purple-400">+47</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">GPA Improvement</span>
                <span className="text-orange-400">+0.2</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white">Keep it up! You're in the top 15% this month.</span>
              </div>
            </div>
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

function QuickStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const colorClasses = {
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
    red: 'text-red-400'
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-center">
      <div className={`flex justify-center mb-2 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
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
    yellow: 'border-yellow-500/20 hover:border-yellow-500/40',
    red: 'border-red-500/20 hover:border-red-500/40',
  };

  return (
    <div className={`bg-slate-900 rounded-lg p-4 border transition-all hover:scale-105 cursor-pointer ${colorClasses[color]}`} onClick={onClick}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-white">{icon}</div>
        <h4 className="font-medium text-white text-sm">{title}</h4>
      </div>
      <p className="text-slate-400 text-xs mb-3">{description}</p>
      <button className="w-full bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded text-xs transition-colors flex items-center justify-center space-x-2">
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
      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-center group"
    >
      <div className="text-white mb-2 flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-xs text-slate-300 font-medium">{title}</div>
    </button>
  );
}
