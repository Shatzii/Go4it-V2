import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Trophy, 
  Medal, 
  ArrowUp, 
  CheckCircle2, 
  Lock, 
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StarPathProgress, StarLevel } from '../types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the star flow node type
interface StarNodeProps {
  level: number;
  title: string;
  description: string;
  color: string;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  badgeIcon?: React.ReactNode;
  position: {x: number, y: number};
  onSelect: () => void;
  isSelected: boolean;
}

// Achieve a PS5 style glowing node component
const StarNode: React.FC<StarNodeProps> = ({
  level,
  title,
  description,
  color,
  isActive,
  isCompleted,
  isLocked,
  badgeIcon,
  position,
  onSelect,
  isSelected,
}) => {
  // Convert hex to rgba for glow effect
  const getRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const nodeVariants = {
    inactive: { 
      scale: 1,
      boxShadow: 'none'
    },
    active: { 
      scale: 1.05,
      boxShadow: `0 0 20px ${getRgba(color, 0.6)}`
    },
    completed: { 
      scale: 1,
      boxShadow: `0 0 10px ${getRgba(color, 0.4)}`
    },
    selected: {
      scale: 1.1,
      boxShadow: `0 0 30px ${getRgba(color, 0.8)}`
    }
  };

  const getNodeVariant = () => {
    if (isSelected) return 'selected';
    if (isCompleted) return 'completed';
    if (isActive) return 'active';
    return 'inactive';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "absolute flex flex-col items-center",
              "cursor-pointer transition-all duration-300",
              isLocked ? "opacity-50" : "opacity-100",
            )}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              zIndex: isSelected ? 50 : 10
            }}
            variants={nodeVariants}
            animate={getNodeVariant()}
            whileHover={isLocked ? {} : { scale: 1.05 }}
            onClick={isLocked ? undefined : onSelect}
          >
            {/* Star badge with number */}
            <motion.div 
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                "border-2",
                isCompleted ? "bg-gradient-to-br border-white/30" : "bg-gray-900/90 border-gray-700/50",
              )}
              style={{
                backgroundImage: isCompleted ? `linear-gradient(to bottom right, ${color}, ${getRgba(color, 0.7)})` : undefined,
              }}
            >
              <div className="relative flex items-center justify-center">
                {isLocked ? (
                  <Lock className="w-7 h-7 text-gray-400" />
                ) : (
                  <>
                    <Star className={cn(
                      "w-7 h-7", 
                      isCompleted ? "text-white" : "text-gray-400"
                    )} />
                    <span className={cn(
                      "absolute font-bold", 
                      isCompleted ? "text-black" : "text-gray-300"
                    )}>
                      {level}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
            
            {/* Star title */}
            <div className="mt-2 text-center">
              <h4 className={cn(
                "font-bold", 
                isCompleted ? "text-white" : "text-gray-300"
              )}>
                {title}
              </h4>
              {isSelected && (
                <motion.p 
                  className="text-xs text-gray-400 max-w-[150px] text-center mt-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {description}
                </motion.p>
              )}
            </div>

            {/* Achievement badge if completed */}
            {isCompleted && badgeIcon && (
              <motion.div 
                className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                {badgeIcon}
              </motion.div>
            )}

            {/* Animated glow effect for active node */}
            {isActive && !isLocked && (
              <motion.div 
                className="absolute inset-0 rounded-full pointer-events-none"
                animate={{ 
                  boxShadow: [
                    `0 0 10px ${getRgba(color, 0.3)}`,
                    `0 0 20px ${getRgba(color, 0.6)}`,
                    `0 0 10px ${getRgba(color, 0.3)}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{title} - Level {level}</p>
          {isLocked && <p className="text-xs text-muted-foreground">Locked</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Define specific accomplishments for each star level
interface Accomplishment {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  xpValue: number;
}

interface StarLevelDetail {
  level: number;
  title: string;
  description: string;
  color: string;
  accomplishments: Accomplishment[];
  requiredXp: number;
  nextMilestone?: string;
}

// Main Star Path Flow component
interface StarPathFlowProps {
  progress: StarPathProgress;
  onSelectLevel?: (level: number) => void;
  className?: string;
}

export const StarPathFlow: React.FC<StarPathFlowProps> = ({
  progress,
  onSelectLevel,
  className = ''
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Define star level details with associated accomplishments
  const starLevelDetails: StarLevelDetail[] = [
    {
      level: 1,
      title: "Rising Prospect",
      description: "Beginning your athletic journey with fundamental skills and training",
      color: "#3b82f6", // blue
      requiredXp: 0,
      accomplishments: [
        { 
          id: "first-workout", 
          title: "First Workout", 
          description: "Complete your first verified workout",
          isCompleted: progress.verifiedWorkouts > 0,
          xpValue: 100
        },
        { 
          id: "profile-setup", 
          title: "Profile Setup", 
          description: "Complete your athletic profile",
          isCompleted: !!progress.position && !!progress.sportType,
          xpValue: 50
        },
        { 
          id: "training-streak", 
          title: "Training Streak", 
          description: "Achieve a 3-day training streak",
          isCompleted: progress.streakDays >= 3,
          xpValue: 150
        }
      ],
      nextMilestone: "Complete 5 workouts to advance"
    },
    {
      level: 2,
      title: "Emerging Talent",
      description: "Developing consistent habits and sport-specific skills",
      color: "#10b981", // green
      requiredXp: 1000,
      accomplishments: [
        { 
          id: "skill-focus", 
          title: "Skill Focus", 
          description: "Complete 10 skill development drills",
          isCompleted: progress.completedDrills >= 10,
          xpValue: 200
        },
        { 
          id: "week-streak", 
          title: "Weekly Warrior", 
          description: "Maintain a 7-day training streak",
          isCompleted: progress.streakDays >= 7,
          xpValue: 250
        },
        { 
          id: "first-assessment", 
          title: "First Assessment", 
          description: "Complete a full athletic assessment",
          isCompleted: progress.level >= 2,
          xpValue: 300
        }
      ],
      nextMilestone: "Participate in a competitive event"
    },
    {
      level: 3,
      title: "Standout Performer",
      description: "Demonstrating advanced skills and competitive abilities",
      color: "#8b5cf6", // purple
      requiredXp: 5000,
      accomplishments: [
        { 
          id: "leadership", 
          title: "Leadership Role", 
          description: "Take on a leadership position",
          isCompleted: progress.achievements?.includes("leadership") || false,
          xpValue: 400
        },
        { 
          id: "competition", 
          title: "Competition Ready", 
          description: "Participate in three competitive events",
          isCompleted: progress.level >= 3,
          xpValue: 500
        },
        { 
          id: "skill-tree", 
          title: "Skill Tree Growth", 
          description: "Reach 50% completion in your skill tree",
          isCompleted: progress.skillTreeProgress >= 50,
          xpValue: 450
        }
      ],
      nextMilestone: "Achieve 75% in your primary skill attributes"
    },
    {
      level: 4,
      title: "Elite Prospect",
      description: "Recognized for exceptional performance and leadership",
      color: "#f59e0b", // amber
      requiredXp: 10000,
      accomplishments: [
        { 
          id: "recruitment", 
          title: "Recruitment Profile", 
          description: "Create a complete recruitment profile",
          isCompleted: progress.level >= 4,
          xpValue: 600
        },
        { 
          id: "mentorship", 
          title: "Mentorship", 
          description: "Mentor a younger athlete",
          isCompleted: progress.achievements?.includes("mentorship") || false,
          xpValue: 550
        },
        { 
          id: "elite-training", 
          title: "Elite Training", 
          description: "Complete 30 advanced training sessions",
          isCompleted: progress.completedDrills >= 30,
          xpValue: 700
        }
      ],
      nextMilestone: "Receive college coach interest"
    },
    {
      level: 5,
      title: "Five-Star Athlete",
      description: "National recognition and top prospect status",
      color: "#ef4444", // red
      requiredXp: 25000,
      accomplishments: [
        { 
          id: "national", 
          title: "National Recognition", 
          description: "Receive national recognition in your sport",
          isCompleted: progress.level >= 5,
          xpValue: 1000
        },
        { 
          id: "college-ready", 
          title: "College Ready", 
          description: "Complete all college recruitment requirements",
          isCompleted: progress.achievements?.includes("college-ready") || false,
          xpValue: 800
        },
        { 
          id: "leadership-legacy", 
          title: "Leadership Legacy", 
          description: "Create a lasting impact in your team/community",
          isCompleted: progress.achievements?.includes("legacy") || false,
          xpValue: 900
        }
      ],
      nextMilestone: "The journey continues - maintain elite status!"
    }
  ];

  const handleNodeSelect = (level: number) => {
    setSelectedLevel(level === selectedLevel ? null : level);
    if (onSelectLevel) {
      onSelectLevel(level);
    }
  };

  // Calculate current star level
  const currentLevel = progress.currentStarLevel || 1;
  
  // PS5-style glow effect
  const psGlow = "0 0 15px rgba(59, 130, 246, 0.7)";

  return (
    <div className={cn("relative w-full", className)}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="star-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#star-grid)" />
        </svg>
      </div>

      {/* Star path visualization area */}
      <div className="relative min-h-[400px] py-10">
        {/* Path connector lines - animating with gradient */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-0" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="25%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <mask id="pathMask">
              <rect x="0" y="0" width="100" height="100" fill="white"/>
            </mask>
          </defs>
          
          {/* Base path lines */}
          <path
            d="M 10,50 C 20,30 30,70 40,50 C 50,30 60,70 70,50 C 80,30 90,70 100,50"
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2,2"
            mask="url(#pathMask)"
          />
          
          {/* Active path with gradient */}
          <motion.path
            d="M 10,50 C 20,30 30,70 40,50 C 50,30 60,70 70,50 C 80,30 90,70 100,50"
            stroke="url(#pathGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: Math.min((currentLevel - 1) / 4, 1) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            mask="url(#pathMask)"
          />
          
          {/* Animated particles along the path */}
          {currentLevel > 1 && (
            <motion.circle
              r="3"
              fill="#ffffff"
              filter="drop-shadow(0 0 3px #ffffff)"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                offsetPath: "path('M 10,50 C 20,30 30,70 40,50 C 50,30 60,70 70,50 C 80,30 90,70 100,50')"
              }}
            />
          )}
        </svg>

        {/* Star Path Nodes */}
        <StarNode
          level={1}
          title="Rising Prospect"
          description="Beginning your athletic journey"
          color="#3b82f6" // blue
          isActive={currentLevel === 1}
          isCompleted={currentLevel > 1}
          isLocked={false}
          badgeIcon={currentLevel > 1 ? <CheckCircle2 className="w-4 h-4 text-white" /> : undefined}
          position={{ x: 10, y: 50 }}
          onSelect={() => handleNodeSelect(1)}
          isSelected={selectedLevel === 1}
        />
        
        <StarNode
          level={2}
          title="Emerging Talent"
          description="Developing core skills"
          color="#10b981" // green
          isActive={currentLevel === 2}
          isCompleted={currentLevel > 2}
          isLocked={currentLevel < 2}
          badgeIcon={currentLevel > 2 ? <Medal className="w-4 h-4 text-white" /> : undefined}
          position={{ x: 30, y: 30 }}
          onSelect={() => handleNodeSelect(2)}
          isSelected={selectedLevel === 2}
        />
        
        <StarNode
          level={3}
          title="Standout Performer"
          description="Competitive excellence"
          color="#8b5cf6" // purple
          isActive={currentLevel === 3}
          isCompleted={currentLevel > 3}
          isLocked={currentLevel < 3}
          badgeIcon={currentLevel > 3 ? <Trophy className="w-4 h-4 text-white" /> : undefined}
          position={{ x: 50, y: 50 }}
          onSelect={() => handleNodeSelect(3)}
          isSelected={selectedLevel === 3}
        />
        
        <StarNode
          level={4}
          title="Elite Prospect"
          description="College recruitment ready"
          color="#f59e0b" // amber
          isActive={currentLevel === 4}
          isCompleted={currentLevel > 4}
          isLocked={currentLevel < 4}
          badgeIcon={currentLevel > 4 ? <ArrowUp className="w-4 h-4 text-white" /> : undefined}
          position={{ x: 70, y: 30 }}
          onSelect={() => handleNodeSelect(4)}
          isSelected={selectedLevel === 4}
        />
        
        <StarNode
          level={5}
          title="Five-Star Athlete"
          description="National recognition"
          color="#ef4444" // red
          isActive={currentLevel === 5}
          isCompleted={currentLevel >= 5}
          isLocked={currentLevel < 5}
          badgeIcon={currentLevel >= 5 ? <Sparkles className="w-4 h-4 text-white" /> : undefined}
          position={{ x: 90, y: 50 }}
          onSelect={() => handleNodeSelect(5)}
          isSelected={selectedLevel === 5}
        />
      </div>

      {/* Selected level details */}
      {selectedLevel !== null && (
        <motion.div
          className="mt-4 p-4 rounded-lg border border-blue-900/50 bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-sm"
          style={{ boxShadow: psGlow }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {(() => {
            const levelData = starLevelDetails[selectedLevel - 1];
            return (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {levelData.title} <span className="ml-1 text-muted-foreground">(Level {levelData.level})</span>
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">{levelData.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedLevel(null)}
                  >
                    Close
                  </Button>
                </div>

                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-blue-400">Achievements:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {levelData.accomplishments.map(achievement => (
                      <div 
                        key={achievement.id} 
                        className={cn(
                          "p-3 rounded-lg border",
                          achievement.isCompleted 
                            ? "bg-blue-900/20 border-blue-700/50" 
                            : "bg-gray-800/40 border-gray-700/50"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium text-white">
                              {achievement.title}
                            </h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              {achievement.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {achievement.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="text-xs text-amber-400 font-medium">
                                +{achievement.xpValue} XP
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {levelData.nextMilestone && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-900/20 border border-blue-800/50">
                    <h4 className="font-medium text-blue-400">Next Milestone:</h4>
                    <p className="text-white text-sm mt-1">{levelData.nextMilestone}</p>
                  </div>
                )}
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};

export default StarPathFlow;