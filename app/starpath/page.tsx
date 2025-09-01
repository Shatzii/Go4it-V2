'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Lock, CheckCircle, Trophy, Target, Zap, ArrowRight, Play, QrCode, Crown } from 'lucide-react';

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
  garSubScores?: {
    physical: number;
    cognitive: number;
    psychological: number;
  };
  badges?: string[];
  archetype?: string;
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
    rewards: ['First Touch Badge', '+10 Technical Rating'],
    garSubScores: { physical: 87, cognitive: 92, psychological: 78 },
    badges: ['NextUp Prospect', 'Elite Touch', 'Coachable'],
    archetype: 'Technical Master',
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
    rewards: ['Speed Demon Badge', '+8 Athleticism Rating'],
    garSubScores: { physical: 94, cognitive: 76, psychological: 82 },
    badges: ['Elite Speed', 'Explosive', 'Game Ready'],
    archetype: 'Athletic Powerhouse',
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
    rewards: ['Visionary Badge', '+12 Game Awareness'],
    garSubScores: { physical: 71, cognitive: 95, psychological: 89 },
    badges: ['Field General', 'Smart Player', 'Leader'],
    archetype: 'Tactical Commander',
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
    rewards: ['Unshakeable Badge', '+15 Consistency'],
    garSubScores: { physical: 68, cognitive: 84, psychological: 96 },
    badges: ['Clutch Player', 'Unbreakable', 'Mentor'],
    archetype: 'Mental Fortress',
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
    rewards: ['Elite Technician Badge', '+20 Technical Rating'],
    garSubScores: { physical: 91, cognitive: 88, psychological: 85 },
    badges: ['Elite Tech', 'Innovation', 'Game Changer'],
    archetype: 'Technical Innovator',
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
    rewards: ['Captain Badge', '+25 Leadership Rating'],
    garSubScores: { physical: 75, cognitive: 93, psychological: 97 },
    badges: ['Captain', 'Motivator', 'Team Builder'],
    archetype: 'Natural Leader',
  },
];

export default function StarPathPage() {
  const [starPathData, setStarPathData] = useState<StarPathNode[]>(SAMPLE_STARPATH_DATA);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXp: 1400,
    completedNodes: 0,
    currentTier: 2,
    achievements: 3,
  });
  const [selectedNode, setSelectedNode] = useState<StarPathNode | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadStarPathProgress();
  }, []);

  const loadStarPathProgress = async () => {
    try {
      setLoading(true);

      const [progressResponse, statsResponse] = await Promise.all([
        fetch('/api/starpath/route?userId=demo-user'),
        fetch('/api/starpath/progress?userId=demo-user'),
      ]);

      if (progressResponse.ok && statsResponse.ok) {
        const [progressData, statsData] = await Promise.all([
          progressResponse.json(),
          statsResponse.json(),
        ]);

        if (progressData.success && statsData.success) {
          setStarPathData(progressData.skillNodes || SAMPLE_STARPATH_DATA);
          setUserProgress(
            statsData.progress || {
              totalXp: 1400,
              completedNodes: 3,
              currentTier: 2,
              achievements: 8,
            },
          );
        }
      } else {
        setStarPathData(SAMPLE_STARPATH_DATA);
        setUserProgress({
          totalXp: 1400,
          completedNodes: 3,
          currentTier: 2,
          achievements: 8,
        });
      }
    } catch (error) {
      console.error('Failed to load StarPath data:', error);
      setStarPathData(SAMPLE_STARPATH_DATA);
      setUserProgress({
        totalXp: 1400,
        completedNodes: 3,
        currentTier: 2,
        achievements: 8,
      });
    } finally {
      setLoading(false);
    }
  };

  const startTraining = async (nodeId: string) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('/api/starpath/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, activity: 'practice_drill' }),
      });

      if (response.ok) {
        const result = await response.json();
        setStarPathData((prevData) =>
          prevData.map((node) =>
            node.id === nodeId
              ? { ...node, totalXp: Math.min(node.totalXp + 50, node.requiredXp) }
              : node,
          ),
        );
        setUserProgress((prev) => ({ ...prev, totalXp: prev.totalXp + 50 }));
      }
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: 'from-cyan-500 to-blue-500',
      physical: 'from-green-500 to-emerald-500',
      mental: 'from-purple-500 to-pink-500',
      tactical: 'from-orange-500 to-red-500',
    };
    return colors[category] || colors.technical;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      technical: <Target className="h-5 w-5" />,
      physical: <Zap className="h-5 w-5" />,
      mental: <Trophy className="h-5 w-5" />,
      tactical: <Star className="h-5 w-5" />,
    };
    return icons[category] || icons.technical;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white relative overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,191,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,191,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      {/* Animated Circuit Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-blue-400 rounded-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-16 h-16 border border-cyan-300 rounded-full animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/50 border-b border-cyan-500/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                style={{textShadow: '0 0 10px rgba(0, 191, 255, 0.8)'}}
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent" style={{fontFamily: 'Orbitron, monospace'}}>
                STARPATH SYSTEM
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center bg-black/30 rounded-lg px-4 py-2 border border-cyan-500/30">
                <div className="text-xs text-cyan-300 uppercase tracking-wide">Total XP</div>
                <div className="text-2xl font-bold text-cyan-400" style={{textShadow: '0 0 10px rgba(0, 191, 255, 0.8)'}}>{userProgress.totalXp}</div>
              </div>
              <div className="text-center bg-black/30 rounded-lg px-4 py-2 border border-blue-500/30">
                <div className="text-xs text-blue-300 uppercase tracking-wide">Tier</div>
                <div className="text-2xl font-bold text-blue-400" style={{textShadow: '0 0 10px rgba(59, 130, 246, 0.8)'}}>{userProgress.currentTier}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* StarPath Journey Overview */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6" style={{fontFamily: 'Orbitron, monospace'}}>
            ATHLETIC DEVELOPMENT SYSTEM
          </h2>
          <p className="text-cyan-200 max-w-4xl mx-auto text-lg leading-relaxed">
            Complete your <span className="text-cyan-400 font-semibold" style={{textShadow: '0 0 10px rgba(0, 191, 255, 0.8)'}}>GAR analysis</span> to determine your StarPath level, then progress through
            AI-generated training to unlock <span className="text-blue-400 font-semibold" style={{textShadow: '0 0 10px rgba(59, 130, 246, 0.8)'}}>College Path</span> features for NCAA eligibility and
            recruitment verification.
          </p>
        </div>

        {/* Current Progress Overview - Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/50 hover:border-cyan-400 transition-all duration-300">
              <Star className="h-10 w-10 text-cyan-400 mx-auto mb-3" style={{filter: 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.8))'}} />
              <div className="text-3xl font-bold text-cyan-400 text-center mb-1" style={{textShadow: '0 0 10px rgba(0, 191, 255, 0.8)', fontFamily: 'Orbitron, monospace'}}>{userProgress.totalXp}</div>
              <div className="text-sm text-cyan-200 text-center uppercase tracking-wide">Total Experience</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-green-500/50 hover:border-green-400 transition-all duration-300">
              <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" style={{filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))'}} />
              <div className="text-3xl font-bold text-green-400 text-center mb-1" style={{textShadow: '0 0 10px rgba(34, 197, 94, 0.8)', fontFamily: 'Orbitron, monospace'}}>
                {starPathData.filter((n) => n.currentLevel > 0).length}
              </div>
              <div className="text-sm text-green-200 text-center uppercase tracking-wide">Skills in Progress</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/50 hover:border-purple-400 transition-all duration-300">
              <Trophy className="h-10 w-10 text-purple-400 mx-auto mb-3" style={{filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.8))'}} />
              <div className="text-3xl font-bold text-purple-400 text-center mb-1" style={{textShadow: '0 0 10px rgba(147, 51, 234, 0.8)', fontFamily: 'Orbitron, monospace'}}>{userProgress.achievements}</div>
              <div className="text-sm text-purple-200 text-center uppercase tracking-wide">Achievements Earned</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-orange-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/50 hover:border-orange-400 transition-all duration-300">
              <Target className="h-10 w-10 text-orange-400 mx-auto mb-3" style={{filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.8))'}} />
              <div className="text-3xl font-bold text-orange-400 text-center mb-1" style={{textShadow: '0 0 10px rgba(249, 115, 22, 0.8)', fontFamily: 'Orbitron, monospace'}}>{userProgress.currentTier}</div>
              <div className="text-sm text-orange-200 text-center uppercase tracking-wide">Current Tier</div>
            </div>
          </div>
        </div>

        {/* StarPath Nodes Grid - Enhanced Player Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* CSS for glow effects */}
      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px currentColor;
        }
        
        .neon-border {
          box-shadow: 0 0 20px rgba(0, 191, 255, 0.3);
        }
        
        .tech-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 40px rgba(0, 191, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

function StarPathNodeCard({
  node,
  onSelect,
  onStartTraining,
  loading,
  getCategoryColor,
  getCategoryIcon,
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
    <div className="relative group tech-card">
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(node.category)}/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
      
      {/* Main Card */}
      <div className={`relative bg-black/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 ${
        node.isUnlocked 
          ? `border-${node.category === 'technical' ? 'cyan' : node.category === 'physical' ? 'green' : node.category === 'mental' ? 'purple' : 'orange'}-500/60 hover:border-${node.category === 'technical' ? 'cyan' : node.category === 'physical' ? 'green' : node.category === 'mental' ? 'purple' : 'orange'}-400` 
          : 'border-slate-700/60 opacity-60'
      }`}>
        
        {/* GET VERIFIED Badge */}
        <div className="absolute top-4 left-4">
          <div className={`rounded-full p-2 shadow-lg ${
            node.isUnlocked 
              ? `bg-${node.category === 'technical' ? 'cyan' : node.category === 'physical' ? 'green' : node.category === 'mental' ? 'purple' : 'orange'}-500 shadow-${node.category === 'technical' ? 'cyan' : node.category === 'physical' ? 'green' : node.category === 'mental' ? 'purple' : 'orange'}-500/50`
              : 'bg-slate-600 shadow-slate-600/50'
          }`}>
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* QR Code */}
        <div className="absolute top-4 right-4">
          <QrCode className="w-6 h-6 text-slate-400" />
        </div>

        {/* Status Icon */}
        {!node.isUnlocked && <Lock className="absolute top-16 right-4 w-5 h-5 text-slate-500" />}
        {isCompleted && <Crown className="absolute top-16 right-4 w-5 h-5 text-yellow-400" style={{filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))'}} />}

        {/* Category Icon */}
        <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(node.category)} rounded-full flex items-center justify-center mx-auto mb-4 mt-6 shadow-xl`} style={{filter: `drop-shadow(0 0 10px rgba(${node.category === 'technical' ? '0, 191, 255' : node.category === 'physical' ? '34, 197, 94' : node.category === 'mental' ? '147, 51, 234' : '249, 115, 22'}, 0.6))`}}>
          {getCategoryIcon(node.category)}
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-center mb-2 uppercase tracking-wide" style={{
          fontFamily: 'Orbitron, monospace',
          color: node.category === 'technical' ? '#00BFFF' : node.category === 'physical' ? '#22C55E' : node.category === 'mental' ? '#A855F7' : '#F97316',
          textShadow: `0 0 10px ${node.category === 'technical' ? 'rgba(0, 191, 255, 0.8)' : node.category === 'physical' ? 'rgba(34, 197, 94, 0.8)' : node.category === 'mental' ? 'rgba(168, 85, 247, 0.8)' : 'rgba(249, 115, 22, 0.8)'}`
        }}>
          {node.name}
        </h3>

        {/* Star Rating */}
        <div className="flex justify-center mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < node.currentLevel 
                  ? `text-${node.category === 'technical' ? 'cyan' : node.category === 'physical' ? 'green' : node.category === 'mental' ? 'purple' : 'orange'}-400` 
                  : 'text-slate-600'
              }`}
              style={{
                filter: i < node.currentLevel 
                  ? `drop-shadow(0 0 4px ${node.category === 'technical' ? 'rgba(0, 191, 255, 0.8)' : node.category === 'physical' ? 'rgba(34, 197, 94, 0.8)' : node.category === 'mental' ? 'rgba(168, 85, 247, 0.8)' : 'rgba(249, 115, 22, 0.8)'})`
                  : 'none'
              }}
              fill={i < node.currentLevel ? 'currentColor' : 'none'}
            />
          ))}
        </div>

        {/* GAR Stats Panel */}
        {node.garSubScores && (
          <div className="bg-black/40 rounded-lg p-4 mb-4 border border-slate-700/50">
            <div className="text-xs text-cyan-300 uppercase tracking-wide mb-3 text-center">GAR Analysis</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300 uppercase">Physical</span>
                <span className="text-sm font-bold text-cyan-400">{node.garSubScores.physical}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${node.garSubScores.physical}%`, boxShadow: '0 0 8px rgba(0, 191, 255, 0.6)' }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300 uppercase">Cognitive</span>
                <span className="text-sm font-bold text-purple-400">{node.garSubScores.cognitive}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${node.garSubScores.cognitive}%`, boxShadow: '0 0 8px rgba(147, 51, 234, 0.6)' }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300 uppercase">Mental</span>
                <span className="text-sm font-bold text-green-400">{node.garSubScores.psychological}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${node.garSubScores.psychological}%`, boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Holographic Badges */}
        {node.badges && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 justify-center">
              {node.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-md text-xs text-cyan-300 backdrop-blur-sm"
                  style={{textShadow: '0 0 4px rgba(0, 191, 255, 0.6)'}}
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archetype */}
        {node.archetype && (
          <div className="text-center mb-4">
            <div className="text-xs text-slate-400 uppercase tracking-wide">Archetype</div>
            <div className={`text-sm font-bold ${
              node.category === 'technical' ? 'text-cyan-400' : 
              node.category === 'physical' ? 'text-green-400' : 
              node.category === 'mental' ? 'text-purple-400' : 
              'text-orange-400'
            }`} style={{
              textShadow: `0 0 6px ${
                node.category === 'technical' ? 'rgba(0, 191, 255, 0.8)' : 
                node.category === 'physical' ? 'rgba(34, 197, 94, 0.8)' : 
                node.category === 'mental' ? 'rgba(168, 85, 247, 0.8)' : 
                'rgba(249, 115, 22, 0.8)'
              }`
            }}>
              {node.archetype}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-300 uppercase tracking-wide">
              Level {node.currentLevel}/{node.maxLevel}
            </span>
            <span className="text-slate-300">
              {node.totalXp}/{node.requiredXp} XP
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${getCategoryColor(node.category)} h-2 rounded-full transition-all duration-500`}
              style={{ 
                width: `${Math.min(progressPercent, 100)}%`, 
                boxShadow: `0 0 10px ${node.category === 'technical' ? 'rgba(0, 191, 255, 0.6)' : node.category === 'physical' ? 'rgba(34, 197, 94, 0.6)' : node.category === 'mental' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(249, 115, 22, 0.6)'}`
              }}
            ></div>
          </div>
        </div>

        {/* Position Fit */}
        <div className="text-center mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-2"></div>
          <div className="text-sm font-bold text-cyan-400 uppercase tracking-wide" style={{textShadow: '0 0 8px rgba(0, 191, 255, 0.8)'}}>
            Position Fit: {node.category.toUpperCase()} SPECIALIST
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onSelect(node)}
            className="flex-1 bg-slate-800/60 hover:bg-slate-700/80 text-cyan-200 px-3 py-2 rounded-lg text-sm transition-all duration-300 border border-slate-600/50 hover:border-cyan-500/50"
          >
            View Details
          </button>
          {node.isUnlocked && !isCompleted && (
            <button
              onClick={() => onStartTraining(node.id)}
              disabled={loading}
              className={`bg-gradient-to-r ${getCategoryColor(node.category)} hover:scale-105 disabled:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center space-x-1 shadow-lg`}
              style={{
                boxShadow: `0 0 15px ${node.category === 'technical' ? 'rgba(0, 191, 255, 0.4)' : node.category === 'physical' ? 'rgba(34, 197, 94, 0.4)' : node.category === 'mental' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(249, 115, 22, 0.4)'}`
              }}
            >
              <Play className="h-3 w-3" />
              <span>Train</span>
            </button>
          )}
        </div>
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
  getCategoryIcon,
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative bg-black/90 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full border-2 border-cyan-500/30 shadow-2xl">
        {/* Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(node.category)}/10 rounded-2xl blur-xl`}></div>
        
        {/* Header */}
        <div className="relative flex items-start justify-between mb-8">
          <div>
            <div className={`inline-block px-4 py-2 rounded-full border text-sm font-medium mb-4 bg-gradient-to-r ${getCategoryColor(node.category)}/20 border-${node.category === 'technical' ? 'cyan' : node.category === 'physical' ? 'green' : node.category === 'mental' ? 'purple' : 'orange'}-500/40`}>
              <div className="flex items-center space-x-2">
                {getCategoryIcon(node.category)}
                <span className="capitalize text-white">{node.category}</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wide" style={{fontFamily: 'Orbitron, monospace', textShadow: '0 0 15px rgba(255, 255, 255, 0.5)'}}>{node.name}</h2>
            <p className="text-cyan-200 mt-3 text-lg">{node.description}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl">
            ✕
          </button>
        </div>

        {/* Enhanced Progress Details */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-cyan-300 uppercase tracking-wide">
              Level {node.currentLevel}/{node.maxLevel}
            </span>
            <span className="text-cyan-300">
              {node.totalXp}/{node.requiredXp} XP
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-4 relative overflow-hidden">
            <div
              className={`bg-gradient-to-r ${getCategoryColor(node.category)} h-4 rounded-full transition-all duration-700`}
              style={{ 
                width: `${Math.min(progressPercent, 100)}%`,
                boxShadow: `0 0 15px ${node.category === 'technical' ? 'rgba(0, 191, 255, 0.8)' : node.category === 'physical' ? 'rgba(34, 197, 94, 0.8)' : node.category === 'mental' ? 'rgba(168, 85, 247, 0.8)' : 'rgba(249, 115, 22, 0.8)'}`
              }}
            ></div>
          </div>
          <div className="text-cyan-400 text-sm mt-2 text-center font-bold">{Math.round(progressPercent)}% Complete</div>
        </div>

        {/* Prerequisites */}
        {node.prerequisites.length > 0 && (
          <div className="mb-8">
            <h4 className="text-white font-bold mb-3 uppercase tracking-wide" style={{fontFamily: 'Orbitron, monospace'}}>Prerequisites</h4>
            <div className="flex flex-wrap gap-2">
              {node.prerequisites.map((prereq, index) => (
                <span key={index} className="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg text-sm border border-slate-600/50">
                  {prereq.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rewards */}
        <div className="mb-8">
          <h4 className="text-white font-bold mb-3 uppercase tracking-wide" style={{fontFamily: 'Orbitron, monospace'}}>Rewards</h4>
          <div className="space-y-3">
            {node.rewards.map((reward, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Trophy className="h-5 w-5 text-yellow-400" style={{filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))'}} />
                <span className="text-cyan-200 font-medium">{reward}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-800/60 hover:bg-slate-700/80 text-white px-6 py-3 rounded-lg transition-all duration-300 border border-slate-600/50"
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
              className={`bg-gradient-to-r ${getCategoryColor(node.category)} hover:scale-105 disabled:bg-slate-700 text-white px-8 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-xl font-bold`}
              style={{
                boxShadow: `0 0 20px ${node.category === 'technical' ? 'rgba(0, 191, 255, 0.5)' : node.category === 'physical' ? 'rgba(34, 197, 94, 0.5)' : node.category === 'mental' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(249, 115, 22, 0.5)'}`
              }}
            >
              <Play className="h-4 w-4" />
              <span>START TRAINING</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}