import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Award,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Users,
  CheckCircle2,
  Lock,
  Star,
  Zap,
  Brain,
  Heart,
  Eye,
  Trophy,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'video' | 'practice' | 'assessment' | 'challenge';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  prerequisites: string[];
  xpReward: number;
  completionRate: number;
  estimatedTime: string;
}

interface PathProgress {
  pathId: string;
  currentModule: string;
  completedModules: string[];
  totalXP: number;
  timeSpent: number;
  streakDays: number;
  lastActivity: Date;
}

interface InteractiveLearningPathsProps {
  selectedPath: string | null;
  userProgress: PathProgress[];
  onModuleStart: (moduleId: string) => void;
  onPathComplete: (pathId: string) => void;
}

const moduleTypeIcons = {
  video: BookOpen,
  practice: Target,
  assessment: Brain,
  challenge: Trophy
};

const difficultyColors = {
  easy: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  hard: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' }
};

export default function InteractiveLearningPaths({
  selectedPath,
  userProgress,
  onModuleStart,
  onPathComplete
}: InteractiveLearningPathsProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'roadmap'>('timeline');

  // Sample learning paths with modules
  const learningPaths = {
    'speed-demon': {
      name: 'Speed Demon',
      description: 'Master explosive speed and agility',
      color: '#ef4444',
      totalModules: 12,
      estimatedWeeks: 8,
      modules: [
        {
          id: 'speed-basics',
          title: 'Speed Training Fundamentals',
          description: 'Learn the science behind speed development',
          duration: 15,
          difficulty: 'easy' as const,
          type: 'video' as const,
          status: 'completed' as const,
          prerequisites: [],
          xpReward: 100,
          completionRate: 100,
          estimatedTime: '15 min'
        },
        {
          id: 'acceleration-drills',
          title: 'Acceleration Technique Drills',
          description: 'Practice proper acceleration mechanics',
          duration: 25,
          difficulty: 'medium' as const,
          type: 'practice' as const,
          status: 'completed' as const,
          prerequisites: ['speed-basics'],
          xpReward: 150,
          completionRate: 100,
          estimatedTime: '25 min'
        },
        {
          id: 'top-speed-mechanics',
          title: 'Top Speed Mechanics',
          description: 'Master maximum velocity running form',
          duration: 20,
          difficulty: 'medium' as const,
          type: 'video' as const,
          status: 'in_progress' as const,
          prerequisites: ['acceleration-drills'],
          xpReward: 200,
          completionRate: 65,
          estimatedTime: '20 min'
        },
        {
          id: 'agility-integration',
          title: 'Agility Integration',
          description: 'Combine speed with directional changes',
          duration: 30,
          difficulty: 'hard' as const,
          type: 'practice' as const,
          status: 'available' as const,
          prerequisites: ['top-speed-mechanics'],
          xpReward: 250,
          completionRate: 0,
          estimatedTime: '30 min'
        },
        {
          id: 'speed-assessment',
          title: 'Speed Skills Assessment',
          description: 'Test your speed development progress',
          duration: 45,
          difficulty: 'hard' as const,
          type: 'assessment' as const,
          status: 'locked' as const,
          prerequisites: ['agility-integration'],
          xpReward: 300,
          completionRate: 0,
          estimatedTime: '45 min'
        }
      ]
    },
    'precision-master': {
      name: 'Precision Master',
      description: 'Develop pinpoint accuracy and control',
      color: '#10b981',
      totalModules: 10,
      estimatedWeeks: 6,
      modules: [
        {
          id: 'accuracy-foundations',
          title: 'Accuracy Fundamentals',
          description: 'Understanding precision in sports',
          duration: 18,
          difficulty: 'easy' as const,
          type: 'video' as const,
          status: 'completed' as const,
          prerequisites: [],
          xpReward: 120,
          completionRate: 100,
          estimatedTime: '18 min'
        },
        {
          id: 'targeting-drills',
          title: 'Target Practice Drills',
          description: 'Progressive targeting exercises',
          duration: 35,
          difficulty: 'medium' as const,
          type: 'practice' as const,
          status: 'available' as const,
          prerequisites: ['accuracy-foundations'],
          xpReward: 180,
          completionRate: 0,
          estimatedTime: '35 min'
        }
      ]
    }
  };

  const currentPathData = selectedPath ? learningPaths[selectedPath as keyof typeof learningPaths] : null;
  const currentProgress = userProgress.find(p => p.pathId === selectedPath);

  // Animation variants
  const moduleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    hover: { scale: 1.02, y: -2 }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: { width: '100%' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeModule) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + playbackSpeed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeModule, playbackSpeed]);

  const handleModuleClick = (module: LearningModule) => {
    if (module.status === 'locked') return;
    
    setActiveModule(module.id);
    onModuleStart(module.id);
  };

  const getModuleStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'available':
        return <Target className="w-4 h-4 text-gray-500" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const renderTimelineView = () => {
    if (!currentPathData) return null;

    return (
      <div className="space-y-6">
        {currentPathData.modules.map((module, index) => {
          const IconComponent = moduleTypeIcons[module.type];
          const colors = difficultyColors[module.difficulty];
          const isActive = activeModule === module.id;
          const isNext = index > 0 && currentPathData.modules[index - 1].status === 'completed' && module.status === 'available';

          return (
            <motion.div
              key={module.id}
              variants={moduleVariants}
              initial="hidden"
              animate="visible"
              whileHover={module.status !== 'locked' ? "hover" : undefined}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection line */}
              {index > 0 && (
                <div className="absolute left-6 -top-6 w-0.5 h-6 bg-gray-200" />
              )}

              <div
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer",
                  module.status === 'locked' 
                    ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60" 
                    : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md",
                  isActive && "border-blue-400 bg-blue-50 shadow-lg",
                  isNext && "ring-2 ring-blue-200 animate-pulse"
                )}
                onClick={() => handleModuleClick(module)}
              >
                {/* Module icon and status */}
                <div className="relative">
                  <div className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center",
                    module.status === 'completed' && "bg-green-100 border-green-300",
                    module.status === 'in_progress' && "bg-blue-100 border-blue-300",
                    module.status === 'available' && "bg-gray-100 border-gray-300",
                    module.status === 'locked' && "bg-gray-50 border-gray-200"
                  )}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    {getModuleStatusIcon(module.status)}
                  </div>
                </div>

                {/* Module content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={cn(
                      "font-semibold",
                      module.status === 'locked' ? "text-gray-400" : "text-gray-800"
                    )}>
                      {module.title}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={cn(colors.bg, colors.text, colors.border)}
                    >
                      {module.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {module.type}
                    </Badge>
                  </div>
                  
                  <p className={cn(
                    "text-sm mb-3",
                    module.status === 'locked' ? "text-gray-400" : "text-gray-600"
                  )}>
                    {module.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {module.xpReward} XP
                    </div>
                    {module.completionRate > 0 && (
                      <div className="flex items-center gap-2">
                        <span>Progress:</span>
                        <div className="w-16 h-1 bg-gray-200 rounded">
                          <motion.div
                            className="h-1 bg-blue-500 rounded"
                            initial={{ width: 0 }}
                            animate={{ width: `${module.completionRate}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          />
                        </div>
                        <span>{module.completionRate}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action button */}
                {module.status !== 'locked' && (
                  <Button
                    size="sm"
                    variant={module.status === 'completed' ? 'outline' : 'default'}
                    className={cn(
                      module.status === 'completed' && "text-green-600 border-green-300",
                      isNext && "animate-pulse"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleClick(module);
                    }}
                  >
                    {module.status === 'completed' && <CheckCircle2 className="w-4 h-4 mr-1" />}
                    {module.status === 'in_progress' && <Play className="w-4 h-4 mr-1" />}
                    {module.status === 'available' && <Target className="w-4 h-4 mr-1" />}
                    {module.status === 'completed' ? 'Review' : 
                     module.status === 'in_progress' ? 'Continue' : 'Start'}
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderGridView = () => {
    if (!currentPathData) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPathData.modules.map((module, index) => {
          const IconComponent = moduleTypeIcons[module.type];
          const colors = difficultyColors[module.difficulty];

          return (
            <motion.div
              key={module.id}
              variants={moduleVariants}
              initial="hidden"
              animate="visible"
              whileHover={module.status !== 'locked' ? "hover" : undefined}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all duration-300",
                module.status === 'locked' 
                  ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60" 
                  : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md",
                activeModule === module.id && "border-blue-400 bg-blue-50 shadow-lg"
              )}
              onClick={() => handleModuleClick(module)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  colors.bg
                )}>
                  <IconComponent className={cn("w-5 h-5", colors.text)} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{module.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {getModuleStatusIcon(module.status)}
                    <Badge variant="outline" className="text-xs">
                      {module.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-3">{module.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{module.estimatedTime}</span>
                  <span>{module.xpReward} XP</span>
                </div>
                {module.completionRate > 0 && (
                  <Progress value={module.completionRate} className="h-1" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderRoadmapView = () => {
    if (!currentPathData) return null;

    return (
      <div className="relative">
        <svg className="w-full h-96" viewBox="0 0 800 400">
          {/* Path curve */}
          <path
            d="M 50 350 Q 200 50 400 200 Q 600 350 750 100"
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,5"
          />
          
          {/* Module nodes */}
          {currentPathData.modules.slice(0, 6).map((module, index) => {
            const progress = index / 5;
            const x = 50 + progress * 700;
            const y = 350 - Math.sin(progress * Math.PI * 2) * 150 - Math.cos(progress * Math.PI) * 50;
            
            return (
              <g key={module.id}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r="20"
                  fill={module.status === 'completed' ? '#10b981' : 
                        module.status === 'in_progress' ? '#3b82f6' :
                        module.status === 'available' ? '#6b7280' : '#d1d5db'}
                  stroke="#fff"
                  strokeWidth="3"
                  className="cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleModuleClick(module)}
                />
                <text
                  x={x}
                  y={y - 35}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700"
                >
                  {module.title.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  if (!selectedPath || !currentPathData) {
    return (
      <Card className="go4it-card">
        <CardContent className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-white mb-2">Select a Learning Path</h3>
          <p className="text-slate-300">Choose a learning path from the Skills Map to begin your journey</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white mb-2">
                {currentPathData.name}
              </CardTitle>
              <p className="text-slate-300">{currentPathData.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {currentProgress?.completedModules.length || 0}/{currentPathData.totalModules}
              </div>
              <div className="text-sm text-slate-300">modules completed</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Progress 
              value={(currentProgress?.completedModules.length || 0) / currentPathData.totalModules * 100} 
              className="flex-1 h-2"
            />
            <Badge variant="outline" className="text-white border-white">
              {currentPathData.estimatedWeeks} weeks
            </Badge>
          </div>

          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-6">
              {renderTimelineView()}
            </TabsContent>
            
            <TabsContent value="grid" className="mt-6">
              {renderGridView()}
            </TabsContent>
            
            <TabsContent value="roadmap" className="mt-6">
              {renderRoadmapView()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Active module player */}
      <AnimatePresence>
        {activeModule && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Module Player</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveModule(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  {currentPathData.modules.find(m => m.id === activeModule)?.title}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <div className="flex-1 h-2 bg-gray-200 rounded">
                    <div 
                      className="h-2 bg-blue-500 rounded transition-all duration-300"
                      style={{ width: `${(currentTime / 60) * 100}%` }}
                    />
                  </div>
                  
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="text-xs border rounded px-1"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
                
                <div className="text-xs text-gray-500">
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Path statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Progress</span>
          </div>
          <div className="text-xl font-bold">
            {Math.round((currentProgress?.completedModules.length || 0) / currentPathData.totalModules * 100)}%
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">XP Earned</span>
          </div>
          <div className="text-xl font-bold">
            {currentProgress?.totalXP || 0}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Time Spent</span>
          </div>
          <div className="text-xl font-bold">
            {Math.round((currentProgress?.timeSpent || 0) / 60)}h
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Streak</span>
          </div>
          <div className="text-xl font-bold">
            {currentProgress?.streakDays || 0} days
          </div>
        </Card>
      </div>
    </div>
  );
}