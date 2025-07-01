import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  Target,
  Zap,
  Trophy,
  Flame,
  Brain,
  Heart,
  Eye,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillNode {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  category: string;
  icon: any;
  prerequisites: string[];
  dependents: string[];
  position: { x: number; y: number };
  color: string;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  completionRate: number;
  color: string;
}

interface AnimatedSkillVisualizerProps {
  userProgress: any[];
  onSkillSelect: (skillId: string) => void;
  onPathSelect: (pathId: string) => void;
}

const skillIcons = {
  speed: Zap,
  accuracy: Target,
  decision: Brain,
  agility: Flame,
  endurance: Heart,
  vision: Eye,
  reaction: Cpu,
  power: Trophy
};

const skillCategories = {
  physical: { color: "#ef4444", bgColor: "#fef2f2" },
  mental: { color: "#3b82f6", bgColor: "#eff6ff" },
  technical: { color: "#10b981", bgColor: "#f0fdf4" },
  tactical: { color: "#f59e0b", bgColor: "#fffbeb" }
};

export default function AnimatedSkillVisualizer({ 
  userProgress, 
  onSkillSelect, 
  onPathSelect 
}: AnimatedSkillVisualizerProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'skills' | 'paths'>('skills');
  const [animationPhase, setAnimationPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample skill nodes data
  const skillNodes: SkillNode[] = [
    {
      id: 'speed',
      name: 'Speed Development',
      description: 'Improve your acceleration and top speed',
      level: 8,
      maxLevel: 15,
      xp: 2400,
      xpToNext: 600,
      isUnlocked: true,
      isCompleted: false,
      category: 'physical',
      icon: Zap,
      prerequisites: [],
      dependents: ['agility', 'endurance'],
      position: { x: 150, y: 100 },
      color: skillCategories.physical.color
    },
    {
      id: 'accuracy',
      name: 'Precision Training',
      description: 'Enhance targeting and ball control accuracy',
      level: 12,
      maxLevel: 15,
      xp: 3600,
      xpToNext: 400,
      isUnlocked: true,
      isCompleted: false,
      category: 'technical',
      icon: Target,
      prerequisites: ['speed'],
      dependents: ['decision'],
      position: { x: 350, y: 150 },
      color: skillCategories.technical.color
    },
    {
      id: 'decision',
      name: 'Decision Making',
      description: 'Improve game awareness and decision speed',
      level: 6,
      maxLevel: 15,
      xp: 1800,
      xpToNext: 700,
      isUnlocked: true,
      isCompleted: false,
      category: 'mental',
      icon: Brain,
      prerequisites: ['accuracy'],
      dependents: ['vision'],
      position: { x: 550, y: 100 },
      color: skillCategories.mental.color
    },
    {
      id: 'agility',
      name: 'Agility & Mobility',
      description: 'Enhance movement flexibility and coordination',
      level: 4,
      maxLevel: 15,
      xp: 1200,
      xpToNext: 800,
      isUnlocked: true,
      isCompleted: false,
      category: 'physical',
      icon: Flame,
      prerequisites: ['speed'],
      dependents: ['reaction'],
      position: { x: 150, y: 300 },
      color: skillCategories.physical.color
    },
    {
      id: 'endurance',
      name: 'Stamina Building',
      description: 'Build cardiovascular and muscular endurance',
      level: 10,
      maxLevel: 15,
      xp: 3000,
      xpToNext: 500,
      isUnlocked: true,
      isCompleted: false,
      category: 'physical',
      icon: Heart,
      prerequisites: ['speed'],
      dependents: ['power'],
      position: { x: 350, y: 350 },
      color: skillCategories.physical.color
    },
    {
      id: 'vision',
      name: 'Field Vision',
      description: 'Develop peripheral awareness and anticipation',
      level: 3,
      maxLevel: 15,
      xp: 900,
      xpToNext: 600,
      isUnlocked: false,
      isCompleted: false,
      category: 'mental',
      icon: Eye,
      prerequisites: ['decision'],
      dependents: [],
      position: { x: 550, y: 300 },
      color: skillCategories.mental.color
    },
    {
      id: 'reaction',
      name: 'Reaction Time',
      description: 'Improve response speed to game situations',
      level: 0,
      maxLevel: 15,
      xp: 0,
      xpToNext: 1000,
      isUnlocked: false,
      isCompleted: false,
      category: 'mental',
      icon: Cpu,
      prerequisites: ['agility'],
      dependents: [],
      position: { x: 150, y: 500 },
      color: skillCategories.mental.color
    },
    {
      id: 'power',
      name: 'Power Development',
      description: 'Build explosive strength and force generation',
      level: 0,
      maxLevel: 15,
      xp: 0,
      xpToNext: 1000,
      isUnlocked: false,
      isCompleted: false,
      category: 'physical',
      icon: Trophy,
      prerequisites: ['endurance'],
      dependents: [],
      position: { x: 350, y: 500 },
      color: skillCategories.physical.color
    }
  ];

  // Sample learning paths
  const learningPaths: LearningPath[] = [
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Focus on explosive speed and agility development',
      skills: ['speed', 'agility', 'reaction'],
      difficulty: 'intermediate',
      estimatedTime: '6-8 weeks',
      completionRate: 65,
      color: '#ef4444'
    },
    {
      id: 'precision-master',
      name: 'Precision Master',
      description: 'Master accuracy and technical skills',
      skills: ['accuracy', 'decision', 'vision'],
      difficulty: 'advanced',
      estimatedTime: '8-10 weeks',
      completionRate: 40,
      color: '#10b981'
    },
    {
      id: 'endurance-warrior',
      name: 'Endurance Warrior',
      description: 'Build stamina and power for peak performance',
      skills: ['endurance', 'power', 'speed'],
      difficulty: 'beginner',
      estimatedTime: '4-6 weeks',
      completionRate: 80,
      color: '#f59e0b'
    },
    {
      id: 'tactical-genius',
      name: 'Tactical Genius',
      description: 'Develop game intelligence and decision making',
      skills: ['decision', 'vision', 'reaction'],
      difficulty: 'expert',
      estimatedTime: '10-12 weeks',
      completionRate: 25,
      color: '#3b82f6'
    }
  ];

  // Animation effects
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSkillProgressPercentage = (skill: SkillNode) => {
    return Math.min((skill.level / skill.maxLevel) * 100, 100);
  };

  const getConnectionPath = (from: SkillNode, to: SkillNode) => {
    const dx = to.position.x - from.position.x;
    const dy = to.position.y - from.position.y;
    const midX = from.position.x + dx / 2;
    const midY = from.position.y + dy / 2;
    
    return `M ${from.position.x + 30} ${from.position.y + 30} Q ${midX} ${midY} ${to.position.x + 30} ${to.position.y + 30}`;
  };

  const renderSkillConnections = () => {
    return skillNodes.map(skill => 
      skill.dependents.map(dependentId => {
        const dependent = skillNodes.find(s => s.id === dependentId);
        if (!dependent) return null;

        const isActive = skill.isUnlocked && dependent.isUnlocked;
        
        return (
          <motion.path
            key={`${skill.id}-${dependentId}`}
            d={getConnectionPath(skill, dependent)}
            stroke={isActive ? skill.color : "#374151"}
            strokeWidth="3"
            fill="none"
            strokeDasharray={isActive ? "0" : "5,5"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="opacity-60"
          />
        );
      })
    ).flat();
  };

  const renderSkillNode = (skill: SkillNode) => {
    const IconComponent = skill.icon;
    const progress = getSkillProgressPercentage(skill);
    const isSelected = selectedSkill === skill.id;

    return (
      <motion.div
        key={skill.id}
        className={cn(
          "absolute cursor-pointer group",
          !skill.isUnlocked && "cursor-not-allowed"
        )}
        style={{
          left: skill.position.x,
          top: skill.position.y,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: animationPhase === 0 ? 0 : Math.sin(Date.now() * 0.001 + skill.position.x * 0.01) * 2
        }}
        transition={{ duration: 0.5, delay: skill.position.x * 0.001 }}
        whileHover={{ scale: skill.isUnlocked ? 1.1 : 1 }}
        whileTap={{ scale: skill.isUnlocked ? 0.95 : 1 }}
        onClick={() => {
          if (skill.isUnlocked) {
            setSelectedSkill(skill.id);
            onSkillSelect(skill.id);
          }
        }}
      >
        <div className={cn(
          "relative w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300",
          skill.isUnlocked 
            ? "bg-white shadow-lg border-opacity-80 hover:shadow-xl" 
            : "bg-gray-100 border-gray-300",
          isSelected && "ring-4 ring-blue-300",
          skill.isCompleted && "bg-green-50 border-green-400"
        )}
        style={{ 
          borderColor: skill.isUnlocked ? skill.color : "#9ca3af",
        }}
      >
        {/* Progress ring */}
        <svg className="absolute inset-0 w-16 h-16 -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke={skill.color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: "175.929 175.929", strokeDashoffset: 175.929 }}
            animate={{ 
              strokeDashoffset: skill.isUnlocked 
                ? 175.929 - (175.929 * progress) / 100 
                : 175.929 
            }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </svg>

        {/* Icon */}
        <div className={cn(
          "relative z-10 p-2 rounded-full",
          skill.isUnlocked ? "text-gray-700" : "text-gray-400"
        )}>
          {skill.isUnlocked ? (
            <IconComponent className="w-6 h-6" />
          ) : (
            <Lock className="w-6 h-6" />
          )}
        </div>

        {/* Level badge */}
        {skill.isUnlocked && (
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            {skill.level}
          </motion.div>
        )}

        {/* Completion star */}
        {skill.isCompleted && (
          <motion.div
            className="absolute -top-1 -left-1"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </motion.div>
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute z-50 bg-white rounded-lg shadow-xl border p-4 w-64"
            style={{
              left: skill.position.x + 80,
              top: skill.position.y,
            }}
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <IconComponent className="w-5 h-5" style={{ color: skill.color }} />
              <h3 className="font-semibold text-gray-800">{skill.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Level {skill.level}/{skill.maxLevel}</span>
                <span>{skill.xp} XP</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-gray-500">
                {skill.xpToNext} XP to next level
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className="mt-2"
              style={{ 
                backgroundColor: skillCategories[skill.category as keyof typeof skillCategories].bgColor,
                color: skillCategories[skill.category as keyof typeof skillCategories].color
              }}
            >
              {skill.category}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    );
  };

  const renderLearningPath = (path: LearningPath, index: number) => {
    const pathSkills = skillNodes.filter(skill => path.skills.includes(skill.id));
    const completedSkills = pathSkills.filter(skill => skill.isCompleted).length;
    const unlockedSkills = pathSkills.filter(skill => skill.isUnlocked).length;

    return (
      <motion.div
        key={path.id}
        className={cn(
          "p-6 rounded-xl border-2 cursor-pointer transition-all duration-300",
          selectedPath === path.id 
            ? "border-blue-400 bg-blue-50 shadow-lg" 
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => {
          setSelectedPath(path.id);
          onPathSelect(path.id);
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{path.name}</h3>
            <p className="text-sm text-gray-600">{path.description}</p>
          </div>
          <Badge 
            variant="outline"
            className={cn(
              "text-xs",
              path.difficulty === 'beginner' && "border-green-400 text-green-600",
              path.difficulty === 'intermediate' && "border-yellow-400 text-yellow-600",
              path.difficulty === 'advanced' && "border-orange-400 text-orange-600",
              path.difficulty === 'expert' && "border-red-400 text-red-600"
            )}
          >
            {path.difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex -space-x-2">
            {pathSkills.slice(0, 4).map((skill, i) => {
              const IconComponent = skill.icon;
              return (
                <div
                  key={skill.id}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs",
                    skill.isUnlocked ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                  )}
                  style={{ zIndex: pathSkills.length - i }}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
              );
            })}
            {pathSkills.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                +{pathSkills.length - 4}
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {unlockedSkills}/{pathSkills.length} unlocked
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{path.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full"
              style={{ backgroundColor: path.color }}
              initial={{ width: 0 }}
              animate={{ width: `${path.completionRate}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Est. time: {path.estimatedTime}</span>
            <span>{completedSkills} completed</span>
          </div>
        </div>

        {selectedPath === path.id && (
          <motion.div
            className="mt-4 pt-4 border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              className="w-full" 
              style={{ backgroundColor: path.color }}
              onClick={(e) => {
                e.stopPropagation();
                // Handle path activation
              }}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Start Learning Path
            </Button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">
              Skill Development Center
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'skills' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('skills')}
                className={viewMode === 'skills' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Skills Map
              </Button>
              <Button
                variant={viewMode === 'paths' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('paths')}
                className={viewMode === 'paths' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Learning Paths
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {viewMode === 'skills' ? (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  ref={containerRef}
                  className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100 overflow-hidden"
                  onClick={() => setSelectedSkill(null)}
                >
                  {/* Background grid */}
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Skill connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {renderSkillConnections()}
                  </svg>

                  {/* Skill nodes */}
                  {skillNodes.map(renderSkillNode)}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg border">
                    <h4 className="text-sm font-semibold mb-2">Categories</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(skillCategories).map(([category, { color }]) => (
                        <div key={category} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: color }}
                          />
                          <span className="capitalize">{category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="paths"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {learningPaths.map(renderLearningPath)}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-white rounded-lg p-4 border shadow-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Unlocked Skills</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {skillNodes.filter(s => s.isUnlocked).length}
          </div>
          <div className="text-xs text-gray-500">
            of {skillNodes.length} total
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-4 border shadow-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium">Completed Skills</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {skillNodes.filter(s => s.isCompleted).length}
          </div>
          <div className="text-xs text-gray-500">
            mastery achieved
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-4 border shadow-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Active Paths</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {learningPaths.filter(p => p.completionRate > 0 && p.completionRate < 100).length}
          </div>
          <div className="text-xs text-gray-500">
            in progress
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-4 border shadow-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium">Total XP</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {skillNodes.reduce((total, skill) => total + skill.xp, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            experience points
          </div>
        </motion.div>
      </div>
    </div>
  );
}