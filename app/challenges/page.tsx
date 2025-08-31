'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AICoachWidget } from '@/components/ai-coach/AICoachWidget';
import {
  Trophy,
  Target,
  Clock,
  Star,
  Zap,
  Award,
  PlayCircle,
  CheckCircle,
  Lock,
  TrendingUp,
  Flame,
  Crown,
  Shield,
  Mic,
  Brain,
  Timer,
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'speed' | 'agility' | 'accuracy' | 'endurance' | 'technique' | 'game_awareness';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  duration: number; // minutes
  xpReward: number;
  requirements: string[];
  completed: boolean;
  locked: boolean;
  bestScore?: number;
  currentAttempt?: number;
  totalAttempts?: number;
}

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [isCoachingActive, setIsCoachingActive] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const response = await fetch('/api/challenges/route?userId=demo-user');
      const result = await response.json();

      if (result.success) {
        setChallenges(result.challenges || sampleChallenges);
      } else {
        setChallenges(sampleChallenges);
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
      setChallenges(sampleChallenges);
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = async (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setChallengeProgress(0);
    setIsCoachingActive(true);

    try {
      const response = await fetch('/api/challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          userId: 'demo-user',
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Challenge started successfully');
      }
    } catch (error) {
      console.error('Failed to start challenge:', error);
    }
  };

  const sampleChallenges: Challenge[] = [
    {
      id: 'speed_burst',
      title: '40-Yard Dash Challenge',
      description: 'Sprint 40 yards as fast as possible with perfect form',
      category: 'speed',
      difficulty: 'intermediate',
      duration: 10,
      xpReward: 150,
      requirements: ['Basic running form', 'Proper warm-up'],
      completed: true,
      locked: false,
      bestScore: 4.8,
      currentAttempt: 3,
      totalAttempts: 5,
    },
    {
      id: 'agility_cone',
      title: 'Cone Weave Mastery',
      description: 'Navigate through 10 cones with perfect technique and speed',
      category: 'agility',
      difficulty: 'beginner',
      duration: 8,
      xpReward: 100,
      requirements: ['Basic footwork'],
      completed: true,
      locked: false,
      bestScore: 12.3,
      currentAttempt: 1,
      totalAttempts: 3,
    },
    {
      id: 'accuracy_target',
      title: 'Precision Passing',
      description: 'Hit 8 out of 10 targets from various distances',
      category: 'accuracy',
      difficulty: 'intermediate',
      duration: 15,
      xpReward: 200,
      requirements: ['Basic throwing mechanics', 'Target practice level 1'],
      completed: false,
      locked: false,
      currentAttempt: 0,
      totalAttempts: 0,
    },
    {
      id: 'endurance_circuit',
      title: 'Stamina Circuit',
      description: 'Complete 5-station circuit maintaining intensity',
      category: 'endurance',
      difficulty: 'advanced',
      duration: 20,
      xpReward: 300,
      requirements: ['Intermediate fitness level', 'Circuit training basics'],
      completed: false,
      locked: false,
      currentAttempt: 0,
      totalAttempts: 0,
    },
    {
      id: 'technique_form',
      title: 'Form Perfect Challenge',
      description: 'Demonstrate perfect technique across 5 key movements',
      category: 'technique',
      difficulty: 'advanced',
      duration: 25,
      xpReward: 350,
      requirements: ['Advanced technical skills', 'Form analysis completion'],
      completed: false,
      locked: true,
      currentAttempt: 0,
      totalAttempts: 0,
    },
    {
      id: 'game_awareness',
      title: 'Field Vision Test',
      description: 'Make correct decisions in 10 game scenarios',
      category: 'game_awareness',
      difficulty: 'elite',
      duration: 30,
      xpReward: 500,
      requirements: ['Advanced game knowledge', 'Situational awareness training'],
      completed: false,
      locked: true,
      currentAttempt: 0,
      totalAttempts: 0,
    },
  ];

  const categories = [
    { value: 'all', label: 'All Challenges', icon: Trophy, color: 'text-yellow-400' },
    { value: 'speed', label: 'Speed', icon: Zap, color: 'text-blue-400' },
    { value: 'agility', label: 'Agility', icon: Target, color: 'text-green-400' },
    { value: 'accuracy', label: 'Accuracy', icon: Target, color: 'text-red-400' },
    { value: 'endurance', label: 'Endurance', icon: Shield, color: 'text-purple-400' },
    { value: 'technique', label: 'Technique', icon: Crown, color: 'text-orange-400' },
    { value: 'game_awareness', label: 'Game IQ', icon: Brain, color: 'text-pink-400' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'advanced':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'elite':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find((c) => c.value === category);
    return categoryData?.color || 'text-gray-400';
  };

  const filteredChallenges =
    selectedCategory === 'all'
      ? challenges
      : challenges.filter((c) => c.category === selectedCategory);

  const completeChallenge = () => {
    if (activeChallenge) {
      // Update challenge completion status
      setChallengeProgress(100);
      setActiveChallenge(null);
      setIsCoachingActive(false);
    }
  };

  const stopChallenge = () => {
    setActiveChallenge(null);
    setChallengeProgress(0);
    setIsCoachingActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Athletic Challenges
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-4">Push your limits with AI-coached challenges</p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Real-time Coaching
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Performance Tracking
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Technique Analysis
            </Badge>
          </div>
        </div>

        {/* Active Challenge Banner */}
        {activeChallenge && (
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Active Challenge: {activeChallenge.title}
                  </h3>
                  <p className="text-slate-300">{activeChallenge.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">AI Coach Active</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-300">Progress</span>
                  <span className="text-white">{challengeProgress}%</span>
                </div>
                <Progress value={challengeProgress} className="h-2" />
              </div>

              <div className="flex gap-3">
                <Button onClick={completeChallenge} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Challenge
                </Button>
                <Button onClick={stopChallenge} variant="outline" className="border-slate-600">
                  Stop Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* AI Coach Integration */}
          <div className="lg:col-span-1">
            <AICoachWidget
              feature="challenges"
              context={{
                activeChallenge,
                challengeType: activeChallenge?.category || 'general',
                difficulty: activeChallenge?.difficulty || 'intermediate',
                sport: 'football',
                isActive: isCoachingActive,
              }}
              className="mb-6"
            />

            {/* Challenge Statistics */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {challenges.filter((c) => c.completed).length}
                    </div>
                    <p className="text-sm text-slate-300">Completed</p>
                  </div>

                  <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {challenges.reduce((sum, c) => sum + (c.completed ? c.xpReward : 0), 0)}
                    </div>
                    <p className="text-sm text-slate-300">XP Earned</p>
                  </div>

                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {Math.round(
                        (challenges.filter((c) => c.completed).length / challenges.length) * 100,
                      )}
                      %
                    </div>
                    <p className="text-sm text-slate-300">Completion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Challenge Area */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    variant={selectedCategory === category.value ? 'default' : 'outline'}
                    className={`flex items-center gap-2 ${
                      selectedCategory === category.value
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${category.color}`} />
                    {category.label}
                  </Button>
                );
              })}
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChallenges.map((challenge) => {
                const CategoryIcon =
                  categories.find((c) => c.value === challenge.category)?.icon || Trophy;

                return (
                  <Card
                    key={challenge.id}
                    className={`bg-slate-800 border-slate-700 transition-all duration-300 ${
                      challenge.locked ? 'opacity-50' : 'hover:border-blue-500/50'
                    } ${activeChallenge?.id === challenge.id ? 'border-blue-500 shadow-lg shadow-blue-500/20' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center`}
                          >
                            {challenge.locked ? (
                              <Lock className="w-5 h-5 text-slate-400" />
                            ) : challenge.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <CategoryIcon
                                className={`w-5 h-5 ${getCategoryColor(challenge.category)}`}
                              />
                            )}
                          </div>
                          <div>
                            <CardTitle
                              className={`text-lg ${challenge.locked ? 'text-slate-400' : 'text-white'}`}
                            >
                              {challenge.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getDifficultyColor(challenge.difficulty)}>
                                {challenge.difficulty}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Timer className="w-3 h-3" />
                                <span>{challenge.duration}min</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {challenge.completed && (
                          <div className="text-right">
                            <div className="text-sm text-green-400 font-medium">
                              Best: {challenge.bestScore}
                            </div>
                            <div className="text-xs text-slate-400">
                              {challenge.currentAttempt}/{challenge.totalAttempts} attempts
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p
                        className={`text-sm ${challenge.locked ? 'text-slate-500' : 'text-slate-300'}`}
                      >
                        {challenge.description}
                      </p>

                      {challenge.requirements.length > 0 && (
                        <div>
                          <h5 className="font-medium text-white text-sm mb-2">Requirements:</h5>
                          <ul className="text-xs text-slate-400 space-y-1">
                            {challenge.requirements.map((req, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-yellow-400 font-medium">
                            +{challenge.xpReward} XP
                          </span>
                        </div>

                        <Button
                          onClick={() => startChallenge(challenge)}
                          disabled={challenge.locked || activeChallenge !== null}
                          className={
                            challenge.completed
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }
                        >
                          {challenge.locked ? (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Locked
                            </>
                          ) : challenge.completed ? (
                            <>
                              <Award className="w-4 h-4 mr-2" />
                              Retry
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Challenge Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Speed Champions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded">
                    <span className="text-sm text-slate-300">1. Alex Johnson</span>
                    <span className="text-sm text-yellow-400">4.2s</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                    <span className="text-sm text-slate-300">2. Sarah Lee</span>
                    <span className="text-sm text-slate-400">4.5s</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-500/10 rounded">
                    <span className="text-sm text-slate-300">3. You</span>
                    <span className="text-sm text-orange-400">4.8s</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Agility Masters</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded">
                    <span className="text-sm text-slate-300">1. Maria Garcia</span>
                    <span className="text-sm text-yellow-400">11.2s</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-500/10 rounded">
                    <span className="text-sm text-slate-300">2. You</span>
                    <span className="text-sm text-green-400">12.3s</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                    <span className="text-sm text-slate-300">3. Jake Smith</span>
                    <span className="text-sm text-slate-400">12.8s</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Most XP Earned</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded">
                    <span className="text-sm text-slate-300">1. Chris Wong</span>
                    <span className="text-sm text-yellow-400">2,450 XP</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                    <span className="text-sm text-slate-300">2. Emma Davis</span>
                    <span className="text-sm text-slate-400">1,890 XP</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                    <span className="text-sm text-slate-300">3. Ryan Kim</span>
                    <span className="text-sm text-slate-400">1,650 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
