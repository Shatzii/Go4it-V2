'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Crown,
  Zap,
  Target,
  Award,
  Users,
  Calendar,
  BarChart3,
  Flame,
  Sparkles,
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'performance' | 'social' | 'consistency' | 'milestone';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt: Date;
  xpReward: number;
  isRecent: boolean;
}

interface SocialLeaderboardEntry {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
  rank: number;
  totalScore: number;
  recentAchievements: Achievement[];
  streak: number;
  sport: string;
  location: string;
  weeklyGain: number;
  isCurrentUser: boolean;
  tier: string;
  badges: string[];
}

interface LeaderboardStats {
  totalParticipants: number;
  userRank: number;
  percentile: number;
  weeklyMovement: number;
}

export default function SocialLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<SocialLeaderboardEntry[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all_time');
  const [selectedSport, setSelectedSport] = useState('all');

  useEffect(() => {
    loadSocialLeaderboard();
  }, [selectedTimeframe, selectedSport]);

  const loadSocialLeaderboard = async () => {
    try {
      const [leaderboardResponse, achievementsResponse] = await Promise.all([
        fetch(
          `/api/social-leaderboard?timeframe=${selectedTimeframe}&sport=${selectedSport}&limit=25`,
        ),
        fetch('/api/achievements/recent?userId=demo-user&limit=10'),
      ]);

      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json();
        setLeaderboard(leaderboardData.leaderboard || []);
        setStats(leaderboardData.stats || null);
      }

      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setUserAchievements(achievementsData.achievements || []);
      }
    } catch (error) {
      console.error('Failed to load social leaderboard:', error);
      // Generate sample data for demo
      setLeaderboard(generateSampleLeaderboard());
      setUserAchievements(generateSampleAchievements());
      setStats({
        totalParticipants: 847,
        userRank: 42,
        percentile: 95,
        weeklyMovement: 8,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSampleLeaderboard = (): SocialLeaderboardEntry[] => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: `user_${i + 1}`,
      username: `athlete${i + 1}`,
      displayName: `Star Athlete ${i + 1}`,
      rank: i + 1,
      totalScore: Math.floor(Math.random() * 2000) + 1500,
      recentAchievements: generateRecentAchievements(Math.floor(Math.random() * 3) + 1),
      streak: Math.floor(Math.random() * 30) + 1,
      sport: ['Football', 'Basketball', 'Soccer', 'Tennis', 'Track'][Math.floor(Math.random() * 5)],
      location: ['California', 'Texas', 'Florida', 'New York'][Math.floor(Math.random() * 4)],
      weeklyGain: Math.floor(Math.random() * 200) - 50,
      isCurrentUser: i === 12,
      tier: getTierFromRank(i + 1),
      badges: getBadgesForRank(i + 1),
    }));
  };

  const generateRecentAchievements = (count: number): Achievement[] => {
    const achievements = [
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Completed 5 speed challenges',
        icon: 'zap',
        category: 'performance',
        difficulty: 'gold',
      },
      {
        id: 'streak_master',
        title: 'Streak Master',
        description: '30-day training streak',
        icon: 'flame',
        category: 'consistency',
        difficulty: 'platinum',
      },
      {
        id: 'social_star',
        title: 'Social Star',
        description: 'Helped 10 teammates improve',
        icon: 'star',
        category: 'social',
        difficulty: 'silver',
      },
      {
        id: 'milestone_100',
        title: 'Century Club',
        description: 'Completed 100 challenges',
        icon: 'trophy',
        category: 'milestone',
        difficulty: 'gold',
      },
    ];

    return achievements.slice(0, count).map((achievement) => ({
      ...achievement,
      unlockedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      xpReward:
        achievement.difficulty === 'platinum' ? 500 : achievement.difficulty === 'gold' ? 300 : 200,
      isRecent: true,
    })) as Achievement[];
  };

  const generateSampleAchievements = (): Achievement[] => {
    return [
      {
        id: 'recent_1',
        title: 'Perfect Form',
        description: 'Achieved 9.5+ GAR score in technique analysis',
        icon: 'star',
        category: 'performance',
        difficulty: 'gold',
        unlockedAt: new Date('2025-01-19'),
        xpReward: 300,
        isRecent: true,
      },
      {
        id: 'recent_2',
        title: 'Consistency King',
        description: 'Completed daily training for 14 days straight',
        icon: 'flame',
        category: 'consistency',
        difficulty: 'silver',
        unlockedAt: new Date('2025-01-18'),
        xpReward: 200,
        isRecent: true,
      },
      {
        id: 'recent_3',
        title: 'Team Player',
        description: 'Shared knowledge with 5 different athletes',
        icon: 'users',
        category: 'social',
        difficulty: 'bronze',
        unlockedAt: new Date('2025-01-17'),
        xpReward: 150,
        isRecent: true,
      },
    ];
  };

  const getTierFromRank = (rank: number): string => {
    if (rank <= 5) return 'Champion';
    if (rank <= 15) return 'Elite';
    if (rank <= 50) return 'Advanced';
    if (rank <= 100) return 'Rising';
    return 'Developing';
  };

  const getBadgesForRank = (rank: number): string[] => {
    const badges = [];
    if (rank <= 10) badges.push('Top 10');
    if (rank <= 3) badges.push('Podium');
    if (rank === 1) badges.push('Champion');
    return badges;
  };

  const getAchievementIcon = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      medal: Medal,
      star: Star,
      flame: Flame,
      zap: Zap,
      target: Target,
      users: Users,
      award: Award,
    };

    const IconComponent = icons[iconName as keyof typeof icons] || Star;
    return <IconComponent className="w-4 h-4" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Social Leaderboard
            </h1>
            <p className="text-xl text-slate-300">
              Compete, achieve, and celebrate success with the Go4It community
            </p>
          </div>

          {/* User Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">#{stats.userRank}</div>
                  <div className="text-sm text-slate-300">Your Rank</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{stats.percentile}%</div>
                  <div className="text-sm text-slate-300">Percentile</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {stats.totalParticipants}
                  </div>
                  <div className="text-sm text-slate-300">Total Athletes</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <div className="text-3xl font-bold text-green-400">+{stats.weeklyMovement}</div>
                  </div>
                  <div className="text-sm text-slate-300">Weekly Movement</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="leaderboard" className="space-y-6">
            <TabsList className="bg-slate-800/50 border-slate-700">
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-slate-700">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-slate-700">
                <Sparkles className="w-4 h-4 mr-2" />
                My Achievements
              </TabsTrigger>
              <TabsTrigger value="trending" className="data-[state=active]:bg-slate-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 rounded text-white"
                >
                  <option value="all_time">All Time</option>
                  <option value="monthly">This Month</option>
                  <option value="weekly">This Week</option>
                  <option value="daily">Today</option>
                </select>

                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 rounded text-white"
                >
                  <option value="all">All Sports</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="soccer">Soccer</option>
                  <option value="tennis">Tennis</option>
                  <option value="track">Track & Field</option>
                </select>
              </div>

              {/* Leaderboard */}
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <Card
                    key={entry.id}
                    className={`${
                      entry.isCurrentUser
                        ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500'
                        : 'bg-slate-800/50'
                    } border-slate-700 backdrop-blur-sm transition-all hover:scale-[1.02]`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="text-center min-w-[60px]">
                            {entry.rank <= 3 ? (
                              <div className="flex flex-col items-center">
                                <Crown
                                  className={`w-8 h-8 ${
                                    entry.rank === 1
                                      ? 'text-yellow-400'
                                      : entry.rank === 2
                                        ? 'text-gray-400'
                                        : 'text-orange-400'
                                  }`}
                                />
                                <span className="text-sm font-bold">#{entry.rank}</span>
                              </div>
                            ) : (
                              <div className="text-2xl font-bold text-slate-300">#{entry.rank}</div>
                            )}
                          </div>

                          {/* User Info */}
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={entry.profileImage} />
                              <AvatarFallback className="bg-slate-700 text-white">
                                {entry.displayName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-white">{entry.displayName}</h3>
                                {entry.isCurrentUser && (
                                  <Badge
                                    variant="outline"
                                    className="text-blue-400 border-blue-400"
                                  >
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-300">
                                <span>{entry.sport}</span>
                                <span>•</span>
                                <span>{entry.location}</span>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">
                                  {entry.tier}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Recent Achievements */}
                          <div className="flex items-center gap-2">
                            {entry.recentAchievements.slice(0, 3).map((achievement, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded-full ${getDifficultyColor(achievement.difficulty)}`}
                                title={achievement.title}
                              >
                                {getAchievementIcon(achievement.icon)}
                              </div>
                            ))}
                          </div>

                          {/* Stats */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                              {entry.totalScore.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Flame className="w-4 h-4 text-orange-400" />
                              <span className="text-slate-300">{entry.streak} day streak</span>
                            </div>
                            <div
                              className={`text-sm ${
                                entry.weeklyGain >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}
                            >
                              {entry.weeklyGain >= 0 ? '+' : ''}
                              {entry.weeklyGain} this week
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userAchievements.map((achievement) => (
                      <Card key={achievement.id} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`p-2 rounded-full ${getDifficultyColor(achievement.difficulty)}`}
                            >
                              {getAchievementIcon(achievement.icon)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{achievement.title}</h4>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getDifficultyColor(achievement.difficulty)}`}
                              >
                                {achievement.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">{achievement.description}</p>
                          <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>+{achievement.xpReward} XP</span>
                            <span>{achievement.unlockedAt.toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trending">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Rising Stars</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboard
                        .slice(0, 5)
                        .filter((entry) => entry.weeklyGain > 50)
                        .map((entry, idx) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between p-3 bg-slate-700/50 rounded"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-slate-600 text-white text-xs">
                                  {entry.displayName
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white">{entry.displayName}</span>
                            </div>
                            <span className="text-green-400 font-semibold">
                              +{entry.weeklyGain}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Popular Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: 'Speed Demon', unlocks: 156, difficulty: 'gold' },
                        { name: 'Perfect Form', unlocks: 142, difficulty: 'platinum' },
                        { name: 'Team Player', unlocks: 189, difficulty: 'silver' },
                        { name: 'Consistency King', unlocks: 234, difficulty: 'gold' },
                        { name: 'Milestone Master', unlocks: 98, difficulty: 'platinum' },
                      ].map((achievement, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-700/50 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-1 rounded ${getDifficultyColor(achievement.difficulty)}`}
                            >
                              <Star className="w-4 h-4" />
                            </div>
                            <span className="text-white">{achievement.name}</span>
                          </div>
                          <span className="text-slate-300">{achievement.unlocks} unlocks</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
