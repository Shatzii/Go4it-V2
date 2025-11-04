'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  Trophy,
  Target,
  TrendingUp,
  Award,
  Zap,
  Crown,
  Flame,
  GraduationCap,
  Medal,
  Sparkles,
  Lock,
  CheckCircle,
  Activity,
  Calendar,
} from 'lucide-react';

interface StarpathData {
  totalXP: number;
  currentLevel: number;
  starRating: number;
  xpToNextLevel: number;
  xpProgress: number;
  
  // NCAA Progress
  ncaaStatus: string;
  ncaaEligibilityScore: number;
  coreGPA: number;
  coreCreditsEarned: number;
  coreCreditsRequired: number;
  
  // GAR Performance
  avgGarScore: number;
  garSessionsCompleted: number;
  garMilestone: string;
  garToNextMilestone: number;
  
  // Scholarship Progress
  scholarshipOffersReceived: number;
  scholarshipInterestCount: number;
  recruitersContacted: number;
  
  // Streaks
  loginStreak: number;
  academicStreak: number;
  
  // Recent Achievements
  recentAchievements: Achievement[];
  nextMilestones: Milestone[];
  activeChallenges: Challenge[];
  
  // Rankings
  overallRank: number;
  totalUsers: number;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  category: string;
  tier: string;
  unlockedAt: string;
  xpReward: number;
  iconUrl?: string;
}

interface Milestone {
  id: number;
  name: string;
  description: string;
  category: string;
  progressPercent: number;
  requiredXP: number;
  requiredGarScore: number;
  starRatingIncrease: number;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  type: string;
  currentProgress: number;
  targetValue: number;
  xpReward: number;
  endsAt: string;
}

export default function StarPathDashboard() {
  const [data, setData] = useState<StarpathData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadStarPathData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/starpath/progress');
        if (response.ok) {
          const result = await response.json();
          setData(result.data || generateDemoData());
        } else {
          setData(generateDemoData());
        }
      } catch (error) {
        setData(generateDemoData());
      } finally {
        setIsLoading(false);
      }
    };

    loadStarPathData();
  }, []);

  const generateDemoData = (): StarpathData => {
    return {
      totalXP: 12450,
      currentLevel: 18,
      starRating: 3.5,
      xpToNextLevel: 1550,
      xpProgress: 75,
      
      ncaaStatus: 'on_track',
      ncaaEligibilityScore: 78,
      coreGPA: 3.45,
      coreCreditsEarned: 12.5,
      coreCreditsRequired: 16,
      
      avgGarScore: 82.5,
      garSessionsCompleted: 24,
      garMilestone: 'proficient',
      garToNextMilestone: 5,
      
      scholarshipOffersReceived: 2,
      scholarshipInterestCount: 8,
      recruitersContacted: 15,
      
      loginStreak: 12,
      academicStreak: 8,
      
      recentAchievements: [
        {
          id: 1,
          name: 'NCAA Tracking Activated',
          description: 'Started tracking NCAA eligibility progress',
          category: 'ncaa',
          tier: 'bronze',
          unlockedAt: '2025-01-20',
          xpReward: 100,
        },
        {
          id: 2,
          name: 'First Scholarship Interest',
          description: 'Received first scholarship interest from a college',
          category: 'scholarship',
          tier: 'gold',
          unlockedAt: '2025-01-18',
          xpReward: 500,
        },
        {
          id: 3,
          name: 'GAR Pro',
          description: 'Achieved 80+ GAR score average',
          category: 'gar',
          tier: 'silver',
          unlockedAt: '2025-01-15',
          xpReward: 250,
        },
      ],
      
      nextMilestones: [
        {
          id: 1,
          name: '4-Star Athlete Status',
          description: 'Achieve 4.0 star rating through consistent performance',
          category: 'star_4',
          progressPercent: 65,
          requiredXP: 15000,
          requiredGarScore: 85,
          starRatingIncrease: 0.5,
        },
        {
          id: 2,
          name: 'NCAA Eligible',
          description: 'Complete all NCAA core requirements and achieve eligibility',
          category: 'ncaa',
          progressPercent: 78,
          requiredXP: 0,
          requiredGarScore: 0,
          starRatingIncrease: 0,
        },
        {
          id: 3,
          name: 'GAR Elite',
          description: 'Reach elite GAR milestone with 90+ average',
          category: 'gar',
          progressPercent: 42,
          requiredXP: 0,
          requiredGarScore: 90,
          starRatingIncrease: 0.25,
        },
      ],
      
      activeChallenges: [
        {
          id: 1,
          title: 'Weekly GAR Champion',
          description: 'Complete 5 GAR sessions this week',
          type: 'weekly',
          currentProgress: 3,
          targetValue: 5,
          xpReward: 300,
          endsAt: '2025-01-28',
        },
        {
          id: 2,
          title: 'Academic Excellence',
          description: 'Complete 10 assignments with 90%+ grades',
          type: 'weekly',
          currentProgress: 7,
          targetValue: 10,
          xpReward: 400,
          endsAt: '2025-01-28',
        },
      ],
      
      overallRank: 127,
      totalUsers: 1842,
    };
  };

  const getStarColor = (rating: number) => {
    if (rating >= 4.5) return 'text-yellow-400';
    if (rating >= 4.0) return 'text-yellow-500';
    if (rating >= 3.0) return 'text-blue-400';
    if (rating >= 2.0) return 'text-green-400';
    return 'text-slate-400';
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className={`w-8 h-8 fill-current ${getStarColor(rating)}`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-8 h-8">
            <Star className="w-8 h-8 text-slate-600 fill-current absolute" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`w-8 h-8 fill-current ${getStarColor(rating)}`} />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-8 h-8 text-slate-600 fill-current" />
        );
      }
    }

    return stars;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond': return 'from-cyan-400 to-blue-400';
      case 'platinum': return 'from-slate-300 to-slate-400';
      case 'gold': return 'from-yellow-400 to-orange-400';
      case 'silver': return 'from-slate-300 to-slate-500';
      case 'bronze': return 'from-orange-600 to-orange-800';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your StarPath...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Star Rating */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            {renderStars(data.starRating)}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
            Your StarPath Journey
          </h1>
          <p className="text-slate-400">
            Level {data.currentLevel} • {data.totalXP.toLocaleString()} XP • Rank #{data.overallRank} of {data.totalUsers.toLocaleString()}
          </p>
        </div>

        {/* XP Progress Bar */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">Level {data.currentLevel} Progress</span>
              </div>
              <span className="text-slate-300">{data.xpToNextLevel} XP to Level {data.currentLevel + 1}</span>
            </div>
            <Progress value={data.xpProgress} className="h-3 mb-2" />
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Current XP: {data.totalXP.toLocaleString()}</span>
              <span>{data.xpProgress}% Complete</span>
            </div>
          </CardContent>
        </Card>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* NCAA Eligibility */}
          <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <GraduationCap className="w-8 h-8 text-blue-400" />
                <Badge className={`${
                  data.ncaaStatus === 'eligible' ? 'bg-green-600' :
                  data.ncaaStatus === 'on_track' ? 'bg-blue-600' :
                  'bg-yellow-600'
                }`}>
                  {data.ncaaStatus.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{data.ncaaEligibilityScore}%</div>
                <p className="text-sm text-slate-300">NCAA Eligibility</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>GPA: {data.coreGPA}</span>
                  <span>{data.coreCreditsEarned}/{data.coreCreditsRequired} credits</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GAR Performance */}
          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-green-400" />
                <Badge className="bg-green-600">
                  {data.garMilestone.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{data.avgGarScore}</div>
                <p className="text-sm text-slate-300">Avg GAR Score</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{data.garSessionsCompleted} sessions</span>
                  <span>{data.garToNextMilestone} to Elite</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scholarship Progress */}
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-purple-400" />
                <Badge className="bg-purple-600">
                  {data.scholarshipOffersReceived} OFFERS
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{data.scholarshipInterestCount}</div>
                <p className="text-sm text-slate-300">Interest Letters</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{data.recruitersContacted} recruiters</span>
                  <span>{data.scholarshipOffersReceived} official offers</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Streaks */}
          <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Flame className="w-8 h-8 text-orange-400" />
                <Badge className="bg-orange-600">
                  {data.loginStreak} DAYS
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{data.academicStreak}</div>
                <p className="text-sm text-slate-300">Academic Streak</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Login: {data.loginStreak} days</span>
                  <span>Keep it up!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Detailed Views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 mb-6">
            <TabsTrigger value="overview">
              <Target className="w-4 h-4 mr-2" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <Calendar className="w-4 h-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Crown className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Milestones Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Next Major Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.nextMilestones.map((milestone) => (
                  <Card key={milestone.id} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{milestone.name}</h3>
                          <p className="text-sm text-slate-400">{milestone.description}</p>
                        </div>
                        {milestone.starRatingIncrease > 0 && (
                          <Badge className="bg-yellow-600/20 text-yellow-400 ml-4">
                            +{milestone.starRatingIncrease} ★
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white font-semibold">{milestone.progressPercent}%</span>
                        </div>
                        <Progress value={milestone.progressPercent} className="h-2" />
                        {milestone.requiredGarScore > 0 && (
                          <p className="text-xs text-slate-500">
                            Required: {milestone.requiredGarScore} GAR Score
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Path to 5-Star */}
            <Card className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border-yellow-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Path to 5-Star Elite Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Current Rating</span>
                    <div className="flex items-center gap-2">
                      {renderStars(data.starRating)}
                      <span className="text-xl font-bold text-white ml-2">{data.starRating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">NCAA Core GPA 3.0+</span>
                      </div>
                      <span className="text-green-400 font-semibold">✓ {data.coreGPA}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {data.avgGarScore >= 85 ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="text-slate-300">GAR Score 85+</span>
                      </div>
                      <span className={`font-semibold ${data.avgGarScore >= 85 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {data.avgGarScore >= 85 ? '✓' : ''} {data.avgGarScore}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {data.scholarshipOffersReceived >= 1 ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="text-slate-300">Scholarship Offer(s)</span>
                      </div>
                      <span className={`font-semibold ${data.scholarshipOffersReceived >= 1 ? 'text-green-400' : 'text-slate-500'}`}>
                        {data.scholarshipOffersReceived >= 1 ? '✓' : ''} {data.scholarshipOffersReceived}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {data.ncaaStatus === 'eligible' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="text-slate-300">NCAA Eligible</span>
                      </div>
                      <span className={`font-semibold ${data.ncaaStatus === 'eligible' ? 'text-green-400' : 'text-blue-400'}`}>
                        {data.ncaaStatus === 'eligible' ? '✓' : data.ncaaEligibilityScore + '%'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.recentAchievements.map((achievement) => (
                    <Card 
                      key={achievement.id}
                      className={`bg-gradient-to-br ${getTierColor(achievement.tier)}/10 border-${achievement.tier === 'gold' ? 'yellow' : achievement.tier === 'silver' ? 'slate' : 'orange'}-600/50`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTierColor(achievement.tier)} flex items-center justify-center flex-shrink-0`}>
                            <Medal className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-1">{achievement.name}</h3>
                            <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge className={`bg-${achievement.tier === 'gold' ? 'yellow' : achievement.tier === 'silver' ? 'slate' : 'orange'}-600`}>
                                {achievement.tier.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-yellow-400 font-semibold">+{achievement.xpReward} XP</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Active Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.activeChallenges.map((challenge) => (
                  <Card key={challenge.id} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{challenge.title}</h3>
                            <Badge className={`${challenge.type === 'daily' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                              {challenge.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">{challenge.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-yellow-400 font-bold">+{challenge.xpReward} XP</div>
                          <div className="text-xs text-slate-500">
                            Ends {new Date(challenge.endsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white font-semibold">
                            {challenge.currentProgress}/{challenge.targetValue}
                          </span>
                        </div>
                        <Progress 
                          value={(challenge.currentProgress / challenge.targetValue) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Your Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">#{data.overallRank}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Overall Ranking</h3>
                  <p className="text-slate-400">
                    Out of {data.totalUsers.toLocaleString()} student athletes
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Top {Math.round((data.overallRank / data.totalUsers) * 100)}% of all users
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-slate-400 text-sm">
              <Sparkles className="w-5 h-5 inline-block mr-2" />
              Full leaderboards coming soon with regional and sport-specific rankings
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            onClick={() => window.location.href = '/starpath'}
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            View NCAA Progress
          </Button>
          
          <Button 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            onClick={() => window.location.href = '/gar'}
          >
            <Activity className="w-5 h-5 mr-2" />
            Start GAR Session
          </Button>
          
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => window.location.href = '/recruiting'}
          >
            <Trophy className="w-5 h-5 mr-2" />
            View Scholarship Offers
          </Button>
        </div>
      </div>
    </div>
  );
}
