'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, Zap, Target, Trophy, Lock, CheckCircle,
  ArrowRight, TrendingUp, Award, Brain, Dumbbell,
  Eye, Heart, BookOpen, Users, Crown, Sparkles, Mic
} from 'lucide-react';
import { AICoachWidget } from '@/components/ai-coach/AICoachWidget';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'physical' | 'mental' | 'tactical';
  tier: number;
  xpRequired: number;
  currentXp: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  prerequisite?: string[];
  garComponent: 'technicalSkills' | 'athleticism' | 'gameAwareness' | 'consistency' | 'improvementPotential';
  garThreshold: number;
  rewards: {
    xp: number;
    badge?: string;
    feature?: string;
  };
  nextNodes: string[];
}

interface GarProgress {
  technicalSkills: number;
  athleticism: number;
  gameAwareness: number;
  consistency: number;
  improvementPotential: number;
  lastAnalysis: string;
}

const mockSkillTree: SkillNode[] = [
  // Technical Skills Branch
  {
    id: 'basic-technique',
    name: 'Basic Technique',
    description: 'Master fundamental movement patterns and form',
    category: 'technical',
    tier: 1,
    xpRequired: 100,
    currentXp: 100,
    isUnlocked: true,
    isCompleted: true,
    garComponent: 'technicalSkills',
    garThreshold: 60,
    rewards: { xp: 100, badge: 'Fundamentals' },
    nextNodes: ['advanced-technique', 'form-mastery']
  },
  {
    id: 'advanced-technique',
    name: 'Advanced Technique',
    description: 'Execute complex movements with precision',
    category: 'technical',
    tier: 2,
    xpRequired: 250,
    currentXp: 180,
    isUnlocked: true,
    isCompleted: false,
    prerequisite: ['basic-technique'],
    garComponent: 'technicalSkills',
    garThreshold: 80,
    rewards: { xp: 250, badge: 'Technician', feature: 'Advanced Analysis' },
    nextNodes: ['technique-mastery']
  },
  {
    id: 'form-mastery',
    name: 'Form Mastery',
    description: 'Perfect biomechanical efficiency',
    category: 'technical',
    tier: 2,
    xpRequired: 200,
    currentXp: 150,
    isUnlocked: true,
    isCompleted: false,
    prerequisite: ['basic-technique'],
    garComponent: 'technicalSkills',
    garThreshold: 75,
    rewards: { xp: 200, badge: 'Form Expert' },
    nextNodes: ['technique-mastery']
  },
  {
    id: 'technique-mastery',
    name: 'Technique Mastery',
    description: 'Elite-level technical execution',
    category: 'technical',
    tier: 3,
    xpRequired: 500,
    currentXp: 0,
    isUnlocked: false,
    isCompleted: false,
    prerequisite: ['advanced-technique', 'form-mastery'],
    garComponent: 'technicalSkills',
    garThreshold: 90,
    rewards: { xp: 500, badge: 'Master Technician', feature: 'Technique Coach' },
    nextNodes: []
  },

  // Physical/Athletic Branch
  {
    id: 'basic-athleticism',
    name: 'Athletic Foundation',
    description: 'Develop core athletic abilities',
    category: 'physical',
    tier: 1,
    xpRequired: 100,
    currentXp: 100,
    isUnlocked: true,
    isCompleted: true,
    garComponent: 'athleticism',
    garThreshold: 60,
    rewards: { xp: 100, badge: 'Athlete' },
    nextNodes: ['power-development', 'speed-training']
  },
  {
    id: 'power-development',
    name: 'Power Development',
    description: 'Build explosive strength and power',
    category: 'physical',
    tier: 2,
    xpRequired: 250,
    currentXp: 120,
    isUnlocked: true,
    isCompleted: false,
    prerequisite: ['basic-athleticism'],
    garComponent: 'athleticism',
    garThreshold: 75,
    rewards: { xp: 250, badge: 'Powerhouse' },
    nextNodes: ['elite-athlete']
  },
  {
    id: 'speed-training',
    name: 'Speed & Agility',
    description: 'Maximize speed and change of direction',
    category: 'physical',
    tier: 2,
    xpRequired: 200,
    currentXp: 80,
    isUnlocked: true,
    isCompleted: false,
    prerequisite: ['basic-athleticism'],
    garComponent: 'athleticism',
    garThreshold: 70,
    rewards: { xp: 200, badge: 'Speed Demon' },
    nextNodes: ['elite-athlete']
  },
  {
    id: 'elite-athlete',
    name: 'Elite Athlete',
    description: 'Peak physical performance level',
    category: 'physical',
    tier: 3,
    xpRequired: 500,
    currentXp: 0,
    isUnlocked: false,
    isCompleted: false,
    prerequisite: ['power-development', 'speed-training'],
    garComponent: 'athleticism',
    garThreshold: 90,
    rewards: { xp: 500, badge: 'Elite Athlete', feature: 'Performance Tracking' },
    nextNodes: []
  },

  // Game Awareness Branch
  {
    id: 'situational-awareness',
    name: 'Situational Awareness',
    description: 'Read and react to game situations',
    category: 'tactical',
    tier: 1,
    xpRequired: 100,
    currentXp: 90,
    isUnlocked: true,
    isCompleted: false,
    garComponent: 'gameAwareness',
    garThreshold: 65,
    rewards: { xp: 100, badge: 'Game Reader' },
    nextNodes: ['tactical-intelligence', 'decision-making']
  },
  {
    id: 'tactical-intelligence',
    name: 'Tactical Intelligence',
    description: 'Understand complex game strategies',
    category: 'tactical',
    tier: 2,
    xpRequired: 300,
    currentXp: 0,
    isUnlocked: false,
    isCompleted: false,
    prerequisite: ['situational-awareness'],
    garComponent: 'gameAwareness',
    garThreshold: 80,
    rewards: { xp: 300, badge: 'Tactician' },
    nextNodes: ['game-master']
  },
  {
    id: 'decision-making',
    name: 'Quick Decision Making',
    description: 'Make optimal choices under pressure',
    category: 'tactical',
    tier: 2,
    xpRequired: 250,
    currentXp: 0,
    isUnlocked: false,
    isCompleted: false,
    prerequisite: ['situational-awareness'],
    garComponent: 'gameAwareness',
    garThreshold: 75,
    rewards: { xp: 250, badge: 'Decision Maker' },
    nextNodes: ['game-master']
  },

  // Mental Branch
  {
    id: 'focus-control',
    name: 'Focus & Concentration',
    description: 'Maintain focus during performance',
    category: 'mental',
    tier: 1,
    xpRequired: 150,
    currentXp: 120,
    isUnlocked: true,
    isCompleted: false,
    garComponent: 'consistency',
    garThreshold: 70,
    rewards: { xp: 150, badge: 'Focused' },
    nextNodes: ['mental-toughness', 'confidence-building']
  },
  {
    id: 'mental-toughness',
    name: 'Mental Toughness',
    description: 'Perform under pressure and adversity',
    category: 'mental',
    tier: 2,
    xpRequired: 300,
    currentXp: 0,
    isUnlocked: false,
    isCompleted: false,
    prerequisite: ['focus-control'],
    garComponent: 'consistency',
    garThreshold: 85,
    rewards: { xp: 300, badge: 'Warrior' },
    nextNodes: ['champion-mindset']
  }
];

const mockGarProgress: GarProgress = {
  technicalSkills: 82,
  athleticism: 76,
  gameAwareness: 71,
  consistency: 78,
  improvementPotential: 85,
  lastAnalysis: '2025-01-05'
};

export default function EnhancedStarPathPage() {
  const [skillTree, setSkillTree] = useState<SkillNode[]>(mockSkillTree);
  const [garProgress, setGarProgress] = useState<GarProgress>(mockGarProgress);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    // Update skill unlocks based on GAR progress
    updateSkillUnlocks();
  }, [garProgress]);

  const updateSkillUnlocks = () => {
    setSkillTree(prev => prev.map(node => {
      const garScore = garProgress[node.garComponent];
      const meetsGarThreshold = garScore >= node.garThreshold;
      const meetsPrerequisites = !node.prerequisite || 
        node.prerequisite.every(preReq => 
          prev.find(n => n.id === preReq)?.isCompleted
        );

      return {
        ...node,
        isUnlocked: meetsGarThreshold && meetsPrerequisites
      };
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Target className="w-5 h-5" />;
      case 'physical': return <Dumbbell className="w-5 h-5" />;
      case 'tactical': return <Eye className="w-5 h-5" />;
      case 'mental': return <Brain className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'text-blue-400 border-blue-500 bg-blue-500/10';
      case 'physical': return 'text-red-400 border-red-500 bg-red-500/10';
      case 'tactical': return 'text-green-400 border-green-500 bg-green-500/10';
      case 'mental': return 'text-purple-400 border-purple-500 bg-purple-500/10';
      default: return 'text-slate-400 border-slate-500 bg-slate-500/10';
    }
  };

  const getNodeStatus = (node: SkillNode) => {
    if (node.isCompleted) return 'completed';
    if (node.isUnlocked) return 'unlocked';
    return 'locked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'unlocked': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'locked': return <Lock className="w-4 h-4 text-slate-500" />;
      default: return <Star className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredNodes = activeCategory === 'all' 
    ? skillTree 
    : skillTree.filter(node => node.category === activeCategory);

  const totalXp = skillTree.reduce((sum, node) => sum + node.currentXp, 0);
  const completedNodes = skillTree.filter(node => node.isCompleted).length;
  const unlockedNodes = skillTree.filter(node => node.isUnlocked && !node.isCompleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ENHANCED STARPATH
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-8">
            Progressive skill development mapped to your GAR analysis results
          </p>
        </div>

        {/* GAR Progress Overview */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              GAR Progress Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{garProgress.technicalSkills}</div>
                <div className="text-sm text-slate-400">Technical Skills</div>
                <Progress value={garProgress.technicalSkills} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{garProgress.athleticism}</div>
                <div className="text-sm text-slate-400">Athleticism</div>
                <Progress value={garProgress.athleticism} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{garProgress.gameAwareness}</div>
                <div className="text-sm text-slate-400">Game Awareness</div>
                <Progress value={garProgress.gameAwareness} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{garProgress.consistency}</div>
                <div className="text-sm text-slate-400">Consistency</div>
                <Progress value={garProgress.consistency} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{garProgress.improvementPotential}</div>
                <div className="text-sm text-slate-400">Improvement</div>
                <Progress value={garProgress.improvementPotential} className="h-2 mt-2" />
              </div>
            </div>
            <div className="text-center text-slate-400">
              Last GAR Analysis: {garProgress.lastAnalysis}
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{totalXp}</div>
              <div className="text-slate-400">Total XP</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{completedNodes}</div>
              <div className="text-slate-400">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{unlockedNodes}</div>
              <div className="text-slate-400">Available</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-400 mb-2">{skillTree.length - completedNodes - unlockedNodes}</div>
              <div className="text-slate-400">Locked</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="all">All Skills</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="tactical">Tactical</TabsTrigger>
            <TabsTrigger value="mental">Mental</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Skill Tree */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNodes.map((node) => {
            const status = getNodeStatus(node);
            const progress = (node.currentXp / node.xpRequired) * 100;
            const garScore = garProgress[node.garComponent];
            
            return (
              <Card 
                key={node.id} 
                className={`cursor-pointer transition-all duration-300 ${
                  status === 'completed' 
                    ? 'bg-green-900/20 border-green-500/50 hover:border-green-400' 
                    : status === 'unlocked'
                    ? 'bg-slate-800 border-slate-700 hover:border-purple-500/50'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
                onClick={() => setSelectedNode(node)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(node.category)}
                      <CardTitle className="text-lg text-white">{node.name}</CardTitle>
                    </div>
                    {getStatusIcon(status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(node.category)}>
                      {node.category}
                    </Badge>
                    <Badge variant="outline" className="text-slate-300">
                      Tier {node.tier}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">{node.description}</p>
                  
                  {/* GAR Requirement */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">GAR Requirement:</span>
                      <span className={garScore >= node.garThreshold ? 'text-green-400' : 'text-red-400'}>
                        {garScore}/{node.garThreshold}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((garScore / node.garThreshold) * 100, 100)} 
                      className="h-2"
                    />
                  </div>

                  {/* XP Progress */}
                  {status !== 'locked' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">XP Progress:</span>
                        <span className="text-white">{node.currentXp}/{node.xpRequired}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      <span>+{node.rewards.xp} XP</span>
                      {node.rewards.badge && (
                        <>
                          <Award className="w-3 h-3 ml-2" />
                          <span>{node.rewards.badge}</span>
                        </>
                      )}
                    </div>
                    {node.rewards.feature && (
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-3 h-3" />
                        <span>Unlocks: {node.rewards.feature}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {status === 'unlocked' && !node.isCompleted && (
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle skill training
                      }}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Start Training
                    </Button>
                  )}
                  
                  {status === 'completed' && (
                    <div className="flex items-center justify-center text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mastered
                    </div>
                  )}
                  
                  {status === 'locked' && (
                    <div className="text-center text-slate-500 text-sm">
                      <Lock className="w-4 h-4 mx-auto mb-1" />
                      Improve GAR score to unlock
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Unlock Your Potential</h3>
              <p className="text-slate-300 mb-6">
                Your StarPath progression is directly linked to your GAR analysis results. 
                Complete more analyses to unlock advanced skills and reach your peak performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/gar-upload'}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Get GAR Analysis
                </Button>
                <Button 
                  onClick={() => window.location.href = '/multi-angle-upload'}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Multi-Angle Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}