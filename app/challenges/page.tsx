'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Target, Clock, Star, Zap, Award, 
  Calendar, Users, TrendingUp, CheckCircle,
  Play, Pause, RotateCcw, Medal
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  sport: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  requirements: any;
  isActive: boolean;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'failed' | 'expired';
  progress: number;
  maxProgress: number;
  timeRemaining?: string;
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Perfect Form Week',
    description: 'Upload 5 videos showing perfect technique form for GAR analysis',
    type: 'weekly',
    sport: 'all',
    difficulty: 'medium',
    xpReward: 500,
    requirements: { videoUploads: 5, minGarScore: 75 },
    isActive: true,
    startDate: '2025-01-01',
    endDate: '2025-01-07',
    status: 'active',
    progress: 3,
    maxProgress: 5,
    timeRemaining: '2 days'
  },
  {
    id: '2',
    title: 'Daily Grind',
    description: 'Log into the platform and check your StarPath progress',
    type: 'daily',
    sport: 'all',
    difficulty: 'easy',
    xpReward: 50,
    requirements: { login: true, starpathCheck: true },
    isActive: true,
    startDate: '2025-01-05',
    endDate: '2025-01-05',
    status: 'completed',
    progress: 1,
    maxProgress: 1
  },
  {
    id: '3',
    title: 'Recruitment Ready',
    description: 'Achieve GAR score of 85+ and get verified for college recruitment',
    type: 'monthly',
    sport: 'football',
    difficulty: 'hard',
    xpReward: 1000,
    requirements: { garScore: 85, verification: true },
    isActive: true,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'active',
    progress: 1,
    maxProgress: 2,
    timeRemaining: '26 days'
  },
  {
    id: '4',
    title: 'Team Player',
    description: 'Join a team and participate in group analysis session',
    type: 'special',
    sport: 'all',
    difficulty: 'medium',
    xpReward: 750,
    requirements: { teamJoin: true, groupSession: true },
    isActive: true,
    startDate: '2025-01-05',
    endDate: '2025-02-05',
    status: 'active',
    progress: 0,
    maxProgress: 2,
    timeRemaining: '31 days'
  }
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'hard': return 'bg-red-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Clock className="w-4 h-4" />;
      case 'weekly': return <Calendar className="w-4 h-4" />;
      case 'monthly': return <Target className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'active': return <Play className="w-5 h-5 text-blue-400" />;
      case 'failed': return <RotateCcw className="w-5 h-5 text-red-400" />;
      case 'expired': return <Pause className="w-5 h-5 text-slate-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const joinChallenge = async (challengeId: string) => {
    setLoading(true);
    try {
      // In a real implementation, this would call the API
      const response = await fetch('/api/challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      });
      
      if (response.ok) {
        // Update UI to show challenge joined
        setChallenges(prev => prev.map(c => 
          c.id === challengeId ? { ...c, status: 'active' as const } : c
        ));
      }
    } catch (error) {
      console.error('Failed to join challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    switch (activeTab) {
      case 'active': return challenge.status === 'active';
      case 'completed': return challenge.status === 'completed';
      case 'available': return challenge.isActive && challenge.status !== 'active' && challenge.status !== 'completed';
      default: return true;
    }
  });

  const totalXpEarned = challenges
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.xpReward, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              CHALLENGES
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-8">
            Complete challenges to earn XP, unlock StarPath skills, and dominate the leaderboards
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{totalXpEarned}</p>
                    <p className="text-slate-400 text-sm">Total XP Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {challenges.filter(c => c.status === 'completed').length}
                    </p>
                    <p className="text-slate-400 text-sm">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {challenges.filter(c => c.status === 'active').length}
                    </p>
                    <p className="text-slate-400 text-sm">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Challenge Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="active">Active ({challenges.filter(c => c.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({challenges.filter(c => c.status === 'completed').length})</TabsTrigger>
            <TabsTrigger value="available">Available ({challenges.filter(c => c.isActive && c.status !== 'active' && c.status !== 'completed').length})</TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <Card key={challenge.id} className="bg-slate-800 border-slate-700 hover:border-yellow-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(challenge.type)}
                        <CardTitle className="text-lg text-white">{challenge.title}</CardTitle>
                      </div>
                      {getStatusIcon(challenge.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-slate-300">
                        {challenge.sport === 'all' ? 'All Sports' : challenge.sport}
                      </Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        {challenge.xpReward} XP
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-slate-300 text-sm mb-4">{challenge.description}</p>
                    
                    {challenge.status === 'active' && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Progress</span>
                          <span className="text-sm text-white">{challenge.progress}/{challenge.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(challenge.progress / challenge.maxProgress) * 100} 
                          className="h-2"
                        />
                        {challenge.timeRemaining && (
                          <p className="text-xs text-slate-400 mt-2">
                            Time remaining: {challenge.timeRemaining}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {challenge.status === 'completed' && (
                      <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
                        <Medal className="w-4 h-4" />
                        <span>Challenge completed! +{challenge.xpReward} XP earned</span>
                      </div>
                    )}

                    {activeTab === 'available' && (
                      <Button 
                        onClick={() => joinChallenge(challenge.id)}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Join Challenge
                      </Button>
                    )}
                    
                    {challenge.status === 'active' && (
                      <Button 
                        onClick={() => window.location.href = '/gar-upload'}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continue Challenge
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Level Up?</h3>
              <p className="text-slate-300 mb-6">
                Complete challenges to earn XP, unlock new StarPath skills, and climb the leaderboards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/starpath'}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Star className="w-5 h-5 mr-2" />
                  View StarPath Progress
                </Button>
                <Button 
                  onClick={() => window.location.href = '/leaderboard'}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Check Leaderboards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}