'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Lock, CheckCircle, Trophy, Target, Zap, ArrowRight, Play } from 'lucide-react';

interface StarPathNode {
  id: string;
  name: string;
  description: string;
  currentLevel: number;
  maxLevel: number;
  totalXp: number;
  requiredXp: number;
  isUnlocked: boolean;
  category: 'technical' | 'physical' | 'mental' | 'tactical';
  prerequisites: string[];
  rewards: string[];
}

interface UserProgress {
  totalXp: number;
  completedNodes: number;
  currentTier: number;
  achievements: number;
}

const SAMPLE_STARPATH_DATA: StarPathNode[] = [
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
    prerequisites: [],
    rewards: ['First Touch Badge', '+10 Technical Rating']
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
    prerequisites: [],
    rewards: ['Speed Demon Badge', '+8 Athleticism Rating']
  },
  {
    id: 'game_vision',
    name: 'Game Vision',
    description: 'Enhance field awareness and decision-making',
    currentLevel: 1,
    maxLevel: 5,
    totalXp: 200,
    requiredXp: 400,
    isUnlocked: true,
    category: 'tactical',
    prerequisites: [],
    rewards: ['Visionary Badge', '+12 Game Awareness']
  },
  {
    id: 'mental_toughness',
    name: 'Mental Resilience',
    description: 'Build confidence and focus under pressure',
    currentLevel: 0,
    maxLevel: 5,
    totalXp: 0,
    requiredXp: 300,
    isUnlocked: false,
    category: 'mental',
    prerequisites: ['game_vision'],
    rewards: ['Unshakeable Badge', '+15 Consistency']
  },
  {
    id: 'advanced_techniques',
    name: 'Advanced Techniques',
    description: 'Master elite-level skills and movements',
    currentLevel: 0,
    maxLevel: 5,
    totalXp: 0,
    requiredXp: 800,
    isUnlocked: false,
    category: 'technical',
    prerequisites: ['ball_control'],
    rewards: ['Elite Technician Badge', '+20 Technical Rating']
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
    prerequisites: ['mental_toughness', 'game_vision'],
    rewards: ['Captain Badge', '+25 Leadership Rating']
  }
];

export default function StarPathPage() {
  const [starPathData, setStarPathData] = useState<StarPathNode[]>(SAMPLE_STARPATH_DATA);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXp: 1400,
    completedNodes: 0,
    currentTier: 2,
    achievements: 3
  });
  const [selectedNode, setSelectedNode] = useState<StarPathNode | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadStarPathProgress();
  }, []);

  const loadStarPathProgress = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('auth-token');
      if (!token) {
        console.log('No token found, using sample data');
        return;
      }

      const response = await fetch('/api/starpath/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform API data to match UI format
          const transformedData = data.progress.map(item => ({
            id: item.id,
            name: item.skillName,
            description: getSkillDescription(item.skillName),
            currentLevel: item.currentLevel,
            maxLevel: item.maxLevel,
            totalXp: item.totalXp,
            requiredXp: item.requiredXp,
            isUnlocked: item.isUnlocked,
            category: item.category,
            prerequisites: getSkillPrerequisites(item.id),
            rewards: getSkillRewards(item.skillName, item.currentLevel)
          }));
          
          setStarPathData(transformedData);
          setUserProgress({
            totalXp: data.stats.totalXp,
            completedNodes: data.stats.completedNodes,
            currentTier: data.stats.currentTier,
            achievements: data.stats.achievements
          });
        }
      }
    } catch (error) {
      console.error('Failed to load StarPath data:', error);
    }
  };

  // Helper functions for skill data
  const getSkillDescription = (skillName: string): string => {
    const descriptions = {
      'Ball Control Mastery': 'Master fundamental ball handling and control techniques',
      'Agility & Speed': 'Develop explosive movement and directional changes',
      'Game Vision': 'Enhance field awareness and decision-making',
      'Mental Resilience': 'Build confidence and focus under pressure',
      'Advanced Techniques': 'Master complex sport-specific movements'
    };
    return descriptions[skillName] || 'Develop advanced athletic skills';
  };

  const getSkillPrerequisites = (skillId: string): string[] => {
    const prereqs = {
      'mental_toughness': ['game_vision'],
      'advanced_techniques': ['ball_control', 'agility_training']
    };
    return prereqs[skillId] || [];
  };

  const getSkillRewards = (skillName: string, level: number): string[] => {
    const baseRewards = {
      'Ball Control Mastery': [`First Touch Badge Level ${level}`, `+${level * 2} Technical Rating`],
      'Agility & Speed': [`Speed Demon Badge Level ${level}`, `+${level * 2} Athleticism Rating`],
      'Game Vision': [`Visionary Badge Level ${level}`, `+${level * 3} Game Awareness`],
      'Mental Resilience': [`Unshakeable Badge Level ${level}`, `+${level * 3} Consistency`],
      'Advanced Techniques': [`Master Badge Level ${level}`, `+${level * 4} Overall Rating`]
    };
    return baseRewards[skillName] || [`Achievement Badge Level ${level}`, `+${level * 2} Skill Points`];
  };

  const startTraining = async (nodeId: string) => {
    if (loading) return;
    
    setLoading(true);
    try {
      // Simulate training activity
      const response = await fetch('/api/starpath/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, activity: 'practice_drill' })
      });

      if (response.ok) {
        const result = await response.json();
        // Update local state with new XP and progress
        setStarPathData(prevData => 
          prevData.map(node => 
            node.id === nodeId 
              ? { ...node, totalXp: Math.min(node.totalXp + 50, node.requiredXp) }
              : node
          )
        );
        setUserProgress(prev => ({ ...prev, totalXp: prev.totalXp + 50 }));
      }
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: 'bg-primary/20 border-primary text-primary',
      physical: 'bg-primary/20 border-primary text-primary',
      mental: 'bg-primary/20 border-primary text-primary',
      tactical: 'bg-primary/20 border-primary text-primary'
    };
    return colors[category] || colors.technical;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      technical: <Target className="h-5 w-5" />,
      physical: <Zap className="h-5 w-5" />,
      mental: <Trophy className="h-5 w-5" />,
      tactical: <Star className="h-5 w-5" />
    };
    return icons[category] || icons.technical;
  };

  return (
    <div className="min-h-screen bg-background text-foreground hero-bg">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-foreground neon-text">StarPath Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total XP</div>
                <div className="text-lg font-bold text-primary">{userProgress.totalXp}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Tier</div>
                <div className="text-lg font-bold text-primary">{userProgress.currentTier}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* StarPath Journey Overview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Your Athletic Journey</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Complete your GAR analysis to determine your StarPath level, then progress through AI-generated training 
            to unlock College Path features for NCAA eligibility and recruitment.
          </p>
        </div>

        {/* Three Main Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Athletic Development */}
          <div className="bg-card rounded-lg p-6 border border-border neon-border">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Athletic Development</h3>
              <p className="text-sm text-muted-foreground">AI-powered training and performance analysis</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/gar-upload')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get GAR Analysis
              </button>
              <button 
                onClick={() => router.push('/ai-coach')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                AI Coach Training
              </button>
              <button 
                onClick={() => router.push('/performance-analytics')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Performance Analytics
              </button>
              <button 
                onClick={() => router.push('/team-sports')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Team Training
              </button>
            </div>
          </div>

          {/* College Path */}
          <div className="bg-card rounded-lg p-6 border border-border neon-border">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">College Path</h3>
              <p className="text-sm text-muted-foreground">NCAA eligibility and recruitment tools</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/academy')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Academy Courses
              </button>
              <button 
                onClick={() => router.push('/ncaa-eligibility')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                NCAA Eligibility
              </button>
              <button 
                onClick={() => router.push('/athletic-contacts')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Coach Contacts
              </button>
              <button 
                onClick={() => router.push('/scholarship-tracker')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Scholarship Tracker
              </button>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="bg-card rounded-lg p-6 border border-border neon-border">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">Monitor your development and achievements</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/student-dashboard')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Student Dashboard
              </button>
              <button 
                onClick={() => router.push('/rankings')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Athlete Rankings
              </button>
              <button 
                onClick={() => router.push('/verified-athletes')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Verified Athletes
              </button>
              <button 
                onClick={() => router.push('/wellness-hub')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Wellness Hub
              </button>
            </div>
          </div>
        </div>

        {/* Current Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-lg p-4 border border-border neon-border text-center">
            <Star className="h-8 w-8 text-primary mx-auto mb-2 neon-glow" />
            <div className="text-2xl font-bold text-foreground">{userProgress.totalXp}</div>
            <div className="text-sm text-muted-foreground">Total Experience</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border neon-border text-center">
            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2 neon-glow" />
            <div className="text-2xl font-bold text-foreground">{starPathData.filter(n => n.currentLevel > 0).length}</div>
            <div className="text-sm text-muted-foreground">Skills in Progress</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border neon-border text-center">
            <Trophy className="h-8 w-8 text-primary mx-auto mb-2 neon-glow" />
            <div className="text-2xl font-bold text-foreground">{userProgress.achievements}</div>
            <div className="text-sm text-muted-foreground">Achievements Earned</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border neon-border text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2 neon-glow" />
            <div className="text-2xl font-bold text-foreground">{userProgress.currentTier}</div>
            <div className="text-sm text-muted-foreground">Current Tier</div>
          </div>
        </div>

        {/* StarPath Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {starPathData.map((node) => (
            <StarPathNodeCard
              key={node.id}
              node={node}
              onSelect={setSelectedNode}
              onStartTraining={startTraining}
              loading={loading}
              getCategoryColor={getCategoryColor}
              getCategoryIcon={getCategoryIcon}
            />
          ))}
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <NodeDetailsModal
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onStartTraining={startTraining}
            loading={loading}
            getCategoryColor={getCategoryColor}
            getCategoryIcon={getCategoryIcon}
          />
        )}
      </div>
    </div>
  );
}

function StarPathNodeCard({ 
  node, 
  onSelect, 
  onStartTraining, 
  loading, 
  getCategoryColor, 
  getCategoryIcon 
}: {
  node: StarPathNode;
  onSelect: (node: StarPathNode) => void;
  onStartTraining: (nodeId: string) => void;
  loading: boolean;
  getCategoryColor: (category: string) => string;
  getCategoryIcon: (category: string) => React.ReactNode;
}) {
  const progressPercent = (node.totalXp / node.requiredXp) * 100;
  const isCompleted = node.currentLevel >= node.maxLevel;

  return (
    <div className={`bg-slate-900 rounded-lg p-6 border transition-all hover:border-slate-600 ${
      node.isUnlocked ? 'border-slate-800' : 'border-slate-800 opacity-60'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getCategoryColor(node.category)}`}>
          <div className="flex items-center space-x-1">
            {getCategoryIcon(node.category)}
            <span className="capitalize">{node.category}</span>
          </div>
        </div>
        {!node.isUnlocked && <Lock className="h-5 w-5 text-slate-500" />}
        {isCompleted && <CheckCircle className="h-5 w-5 text-green-400" />}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-white mb-2">{node.name}</h3>
      <p className="text-slate-400 text-sm mb-4">{node.description}</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300">Level {node.currentLevel}/{node.maxLevel}</span>
          <span className="text-slate-300">{node.totalXp}/{node.requiredXp} XP</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onSelect(node)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
        >
          View Details
        </button>
        {node.isUnlocked && !isCompleted && (
          <button
            onClick={() => onStartTraining(node.id)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center space-x-1"
          >
            <Play className="h-3 w-3" />
            <span>Train</span>
          </button>
        )}
      </div>
    </div>
  );
}

function NodeDetailsModal({ 
  node, 
  onClose, 
  onStartTraining, 
  loading, 
  getCategoryColor, 
  getCategoryIcon 
}: {
  node: StarPathNode;
  onClose: () => void;
  onStartTraining: (nodeId: string) => void;
  loading: boolean;
  getCategoryColor: (category: string) => string;
  getCategoryIcon: (category: string) => React.ReactNode;
}) {
  const progressPercent = (node.totalXp / node.requiredXp) * 100;
  const isCompleted = node.currentLevel >= node.maxLevel;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg p-6 max-w-2xl w-full border border-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className={`inline-block px-3 py-1 rounded-full border text-xs font-medium mb-3 ${getCategoryColor(node.category)}`}>
              <div className="flex items-center space-x-1">
                {getCategoryIcon(node.category)}
                <span className="capitalize">{node.category}</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">{node.name}</h2>
            <p className="text-slate-400 mt-2">{node.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress Details */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Level {node.currentLevel}/{node.maxLevel}</span>
            <span className="text-slate-300">{node.totalXp}/{node.requiredXp} XP</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
          <div className="text-slate-400 text-xs mt-1">
            {Math.round(progressPercent)}% Complete
          </div>
        </div>

        {/* Prerequisites */}
        {node.prerequisites.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Prerequisites</h4>
            <div className="flex flex-wrap gap-2">
              {node.prerequisites.map((prereq, index) => (
                <span key={index} className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">
                  {prereq.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rewards */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-2">Rewards</h4>
          <div className="space-y-2">
            {node.rewards.map((reward, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-300 text-sm">{reward}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Close
          </button>
          {node.isUnlocked && !isCompleted && (
            <button
              onClick={() => {
                onStartTraining(node.id);
                onClose();
              }}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-6 py-2 rounded-md transition-colors flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Start Training</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}