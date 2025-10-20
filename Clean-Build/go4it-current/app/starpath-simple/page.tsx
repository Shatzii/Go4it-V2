'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  Lock,
  CheckCircle,
  Trophy,
  Target,
  Zap,
  ArrowRight,
  Play,
  Award,
  Flame,
  Crown,
} from 'lucide-react';

export default function StarPathSimple() {
  const userProgress = {
    totalXp: 2850,
    completedNodes: 8,
    currentTier: 3,
    achievements: 12,
  };

  const starPathNodes = [
    {
      id: 'ball_control',
      name: 'Ball Control Mastery',
      description: 'Master fundamental ball handling and control techniques',
      currentLevel: 3,
      maxLevel: 5,
      totalXp: 750,
      requiredXp: 1000,
      isUnlocked: true,
      category: 'technical',
      rewards: ['First Touch Badge', '+10 Technical Rating'],
    },
    {
      id: 'agility_training',
      name: 'Agility & Speed',
      description: 'Develop explosive movement and directional changes',
      currentLevel: 2,
      maxLevel: 5,
      totalXp: 450,
      requiredXp: 600,
      isUnlocked: true,
      category: 'physical',
      rewards: ['Speed Demon Badge', '+8 Athleticism Rating'],
    },
    {
      id: 'tactical_awareness',
      name: 'Tactical Awareness',
      description: 'Understand game situations and decision making',
      currentLevel: 4,
      maxLevel: 5,
      totalXp: 920,
      requiredXp: 1200,
      isUnlocked: true,
      category: 'mental',
      rewards: ['Field Vision Badge', '+12 IQ Rating'],
    },
    {
      id: 'finishing',
      name: 'Clinical Finishing',
      description: 'Master shooting accuracy and composure',
      currentLevel: 1,
      maxLevel: 5,
      totalXp: 150,
      requiredXp: 400,
      isUnlocked: true,
      category: 'technical',
      rewards: ['Goal Scorer Badge', '+15 Finishing Rating'],
    },
    {
      id: 'leadership',
      name: 'Team Leadership',
      description: 'Develop communication and leadership skills',
      currentLevel: 0,
      maxLevel: 5,
      totalXp: 0,
      requiredXp: 500,
      isUnlocked: false,
      category: 'mental',
      rewards: ['Captain Badge', '+20 Leadership Rating'],
    },
    {
      id: 'advanced_tactics',
      name: 'Advanced Tactics',
      description: 'Master complex tactical concepts and formations',
      currentLevel: 0,
      maxLevel: 5,
      totalXp: 0,
      requiredXp: 800,
      isUnlocked: false,
      category: 'tactical',
      rewards: ['Tactician Badge', '+25 Game IQ Rating'],
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-500';
      case 'physical':
        return 'bg-green-500';
      case 'mental':
        return 'bg-purple-500';
      case 'tactical':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Target className="w-5 h-5" />;
      case 'physical':
        return <Zap className="w-5 h-5" />;
      case 'mental':
        return <Star className="w-5 h-5" />;
      case 'tactical':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            StarPath Development System
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Gamified progression tracking for neurodivergent student athletes
          </p>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">{userProgress.totalXp}</div>
                <div className="text-sm text-slate-300">Total XP</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {userProgress.completedNodes}
                </div>
                <div className="text-sm text-slate-300">Skills Mastered</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  Tier {userProgress.currentTier}
                </div>
                <div className="text-sm text-slate-300">Current Level</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {userProgress.achievements}
                </div>
                <div className="text-sm text-slate-300">Achievements</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skill Tree */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {starPathNodes.map((node, index) => (
            <Card
              key={node.id}
              className={`relative border-2 transition-all duration-300 backdrop-blur-sm ${
                node.isUnlocked
                  ? 'bg-slate-800/70 border-slate-600 hover:border-blue-500 hover:scale-105'
                  : 'bg-slate-900/50 border-slate-700 opacity-75'
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(node.category)} text-white`}>
                      {getCategoryIcon(node.category)}
                    </div>
                    <div>
                      <CardTitle
                        className={`text-lg ${node.isUnlocked ? 'text-white' : 'text-slate-400'}`}
                      >
                        {node.name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`mt-1 text-xs ${getCategoryColor(node.category)} text-white border-none`}
                      >
                        {node.category.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {!node.isUnlocked ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : node.currentLevel === node.maxLevel ? (
                      <Crown className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Star className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className={`text-sm ${node.isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                  {node.description}
                </p>

                {/* Progress Bar */}
                {node.isUnlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">
                        Level {node.currentLevel}/{node.maxLevel}
                      </span>
                      <span className="text-slate-400">
                        {node.totalXp}/{node.requiredXp} XP
                      </span>
                    </div>
                    <Progress
                      value={(node.totalXp / node.requiredXp) * 100}
                      className="h-2 bg-slate-700"
                    />
                  </div>
                )}

                {/* Rewards */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-300">Rewards:</div>
                  <div className="flex flex-wrap gap-1">
                    {node.rewards.map((reward, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-slate-700 text-slate-300"
                      >
                        {reward}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full ${
                    !node.isUnlocked
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : node.currentLevel === node.maxLevel
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  disabled={!node.isUnlocked}
                >
                  {!node.isUnlocked ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </>
                  ) : node.currentLevel === node.maxLevel ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mastered
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Continue Training
                    </>
                  )}
                </Button>
              </CardContent>

              {/* Level indicators */}
              <div className="absolute top-2 right-2 flex gap-1">
                {Array.from({ length: node.maxLevel }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < node.currentLevel ? 'bg-blue-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Achievement Showcase */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <div className="p-2 bg-yellow-500 rounded-full">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">First Touch Master</div>
                  <div className="text-sm text-slate-400">Unlocked 2 days ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Consistency Streak</div>
                  <div className="text-sm text-slate-400">14 days training</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                <div className="p-2 bg-purple-500 rounded-full">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Rising Star</div>
                  <div className="text-sm text-slate-400">Tier 3 achieved</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Goals */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Upcoming Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white">Complete Finishing Level 2</span>
                </div>
                <span className="text-sm text-slate-400">250 XP remaining</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-white">Unlock Team Leadership</span>
                </div>
                <span className="text-sm text-slate-400">Complete Tactical Awareness first</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white">Reach Tier 4</span>
                </div>
                <span className="text-sm text-slate-400">1,150 XP remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
