import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, ZoomOut, Home, Lock, Star, Check, Award, Zap, 
  BookOpen, ArrowUpRight, Brain, Dumbbell, Sparkles 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import SkillRankingVisualizer from './SkillRankingVisualizer';

// Types for skill tree data (same as in interactive-skill-tree.tsx)
type SkillNode = {
  id: number;
  name: string;
  description: string;
  category: string;
  sportType: string;
  position?: string;
  difficulty: string;
  prerequisites: number[];
  imageUrl?: string;
  active: boolean;
  xpToUnlock: number;
};

type SkillRelationship = {
  id: number;
  parentNodeId: number;
  childNodeId: number;
};

type UserSkill = {
  id: number;
  userId: number;
  skillNodeId: number;
  unlocked: boolean;
  unlockedAt?: Date;
  level?: number;
  xp?: number;
  lastTrainedAt?: Date;
};

interface InteractiveSkillTreeVisualizationProps {
  sportType: string;
  position?: string;
  onSkillSelected?: (skill: SkillNode) => void;
}

const InteractiveSkillTreeVisualization: React.FC<InteractiveSkillTreeVisualizationProps> = ({
  sportType,
  position,
  onSkillSelected
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch skill tree data
  const { data: skillTreeData, isLoading: isLoadingSkillTree } = useQuery({
    queryKey: ['/api/ai-coach/skill-tree', sportType, position],
    enabled: !!sportType,
  });

  // Fetch user's skill progress
  const { data: userSkills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['/api/player/skill-progress', sportType],
    enabled: !!sportType,
  });

  useEffect(() => {
    // Set the first category as selected when data loads
    if (skillTreeData?.nodes && skillTreeData.nodes.length > 0) {
      const categories = [...new Set(skillTreeData.nodes.map((node: SkillNode) => node.category))];
      if (categories.length > 0 && !selectedCategory) {
        setSelectedCategory(categories[0]);
      }
    }
  }, [skillTreeData, selectedCategory]);

  // Helper to check if a skill is unlocked
  const isSkillUnlocked = (skillId: number): boolean => {
    if (!userSkills) return false;
    const skill = userSkills.find((s: UserSkill) => s.skillNodeId === skillId);
    return !!skill && skill.unlocked;
  };

  // Helper to get skill level
  const getSkillLevel = (skillId: number): number => {
    if (!userSkills) return 0;
    const skill = userSkills.find((s: UserSkill) => s.skillNodeId === skillId);
    return skill?.level || 0;
  };

  // Helper to get skill XP
  const getSkillXp = (skillId: number): number => {
    if (!userSkills) return 0;
    const skill = userSkills.find((s: UserSkill) => s.skillNodeId === skillId);
    return skill?.xp || 0;
  };

  // Helper to check if a skill can be unlocked (all prerequisites are met)
  const canUnlockSkill = (skill: SkillNode): boolean => {
    if (!skillTreeData || !userSkills) return false;
    
    // If the skill is already unlocked, return false
    if (isSkillUnlocked(skill.id)) return false;
    
    // Check if all prerequisites are unlocked
    const prerequisites = skill.prerequisites || [];
    if (prerequisites.length === 0) return true; // No prerequisites, can unlock
    
    return prerequisites.every(preqId => isSkillUnlocked(preqId));
  };

  // Get all child nodes of a given node
  const getChildNodes = (nodeId: number): number[] => {
    if (!skillTreeData) return [];
    const children = skillTreeData.relationships
      .filter((rel: SkillRelationship) => rel.parentNodeId === nodeId)
      .map((rel: SkillRelationship) => rel.childNodeId);
    
    // Recursively get all descendants
    let allChildren: number[] = [...children];
    children.forEach(childId => {
      allChildren = [...allChildren, ...getChildNodes(childId)];
    });
    
    return allChildren;
  };

  // Get all parent nodes of a given node
  const getParentNodes = (nodeId: number): number[] => {
    if (!skillTreeData) return [];
    const parents = skillTreeData.relationships
      .filter((rel: SkillRelationship) => rel.childNodeId === nodeId)
      .map((rel: SkillRelationship) => rel.parentNodeId);
    
    // Recursively get all ancestors
    let allParents: number[] = [...parents];
    parents.forEach(parentId => {
      allParents = [...allParents, ...getParentNodes(parentId)];
    });
    
    return allParents;
  };

  // Handle zoom in/out
  const handleZoom = (factor: number) => {
    setZoom(prevZoom => {
      const newZoom = prevZoom + factor;
      // Limit zoom levels
      return Math.max(0.5, Math.min(newZoom, 1.5));
    });
  };

  // Reset view
  const resetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setPanOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up to stop panning
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle skill hover
  const handleSkillHover = (skill: SkillNode | null) => {
    setHoveredSkill(skill);
    
    if (skill) {
      // Highlight the skill's prerequisites and dependents
      const parents = getParentNodes(skill.id);
      const children = getChildNodes(skill.id);
      setHighlightedPath([...parents, skill.id, ...children]);
    } else {
      setHighlightedPath([]);
    }
  };

  // Handle skill click
  const handleSkillClick = (skill: SkillNode) => {
    if (onSkillSelected) {
      onSkillSelected(skill);
    }
  };

  // Render skill difficulty badge
  const renderDifficultyBadge = (difficulty: string) => {
    const colorMap: Record<string, string> = {
      beginner: 'bg-green-500/20 text-green-500 border-green-500/50',
      intermediate: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      advanced: 'bg-orange-500/20 text-orange-500 border-orange-500/50',
      expert: 'bg-red-500/20 text-red-500 border-red-500/50',
    };
    
    const color = colorMap[difficulty.toLowerCase()] || 'bg-blue-500/20 text-blue-500 border-blue-500/50';
    
    return (
      <Badge variant="outline" className={`${color} capitalize`}>
        {difficulty}
      </Badge>
    );
  };

  // Render skill category tabs
  const renderCategoryTabs = () => {
    if (!skillTreeData?.nodes) return null;
    
    const categories = [...new Set(skillTreeData.nodes.map((node: SkillNode) => node.category))];
    
    return (
      <div className="flex overflow-x-auto mb-4 pb-2 gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
    );
  };

  // Render skill connections/paths
  const renderConnections = () => {
    if (!skillTreeData) return null;
    
    const { relationships } = skillTreeData;
    const connections: JSX.Element[] = [];
    
    relationships.forEach((rel: SkillRelationship) => {
      const sourceEl = document.getElementById(`skill-${rel.parentNodeId}`);
      const targetEl = document.getElementById(`skill-${rel.childNodeId}`);
      
      if (sourceEl && targetEl) {
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        
        // Calculate positions
        const x1 = sourceRect.left + sourceRect.width / 2 - containerRect.left;
        const y1 = sourceRect.top + sourceRect.height / 2 - containerRect.top;
        const x2 = targetRect.left + targetRect.width / 2 - containerRect.left;
        const y2 = targetRect.top + targetRect.height / 2 - containerRect.top;
        
        // Determine line style based on skill state
        const parentUnlocked = isSkillUnlocked(rel.parentNodeId);
        const childUnlocked = isSkillUnlocked(rel.childNodeId);
        const isHighlighted = highlightedPath.includes(rel.parentNodeId) && 
                              highlightedPath.includes(rel.childNodeId);
        
        // Draw the connection line
        connections.push(
          <motion.path
            key={`connection-${rel.id}`}
            d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
            stroke={isHighlighted ? '#60a5fa' : (parentUnlocked && childUnlocked ? '#3b82f6' : '#4b5563')}
            strokeWidth={isHighlighted ? 3 : (parentUnlocked && childUnlocked ? 2 : 1)}
            strokeDasharray={parentUnlocked && childUnlocked ? undefined : '5,5'}
            strokeOpacity={isHighlighted ? 1 : (parentUnlocked ? 0.8 : 0.4)}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        );
      }
    });
    
    return connections;
  };

  // Render skill nodes
  const renderSkillNodes = () => {
    if (!skillTreeData?.nodes || !selectedCategory) return null;
    
    const categoryNodes = skillTreeData.nodes.filter(
      (node: SkillNode) => node.category === selectedCategory
    );
    
    // Calculate optimal grid layout
    const columns = Math.ceil(Math.sqrt(categoryNodes.length));
    const rows = Math.ceil(categoryNodes.length / columns);
    
    return (
      <div 
        className="grid gap-6"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(250px, 1fr))`,
          transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`, 
          transformOrigin: 'center',
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
      >
        {categoryNodes.map((node: SkillNode) => {
          const isUnlocked = isSkillUnlocked(node.id);
          const canUnlock = canUnlockSkill(node);
          const isHighlighted = highlightedPath.includes(node.id);
          const level = getSkillLevel(node.id);
          const xp = getSkillXp(node.id);
          
          return (
            <motion.div
              id={`skill-${node.id}`}
              key={`skill-${node.id}`}
              className="relative cursor-pointer transition-all duration-200"
              onMouseEnter={() => handleSkillHover(node)}
              onMouseLeave={() => handleSkillHover(null)}
              onClick={() => handleSkillClick(node)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card 
                className={`
                  border-2 transition-all duration-200
                  ${isHighlighted ? 'ring-2 ring-primary/70 shadow-lg shadow-primary/20' : ''}
                  ${isUnlocked 
                    ? 'bg-primary/10 border-primary/50' 
                    : canUnlock 
                      ? 'bg-secondary/20 border-secondary/50' 
                      : 'bg-gray-900/30 border-gray-700 opacity-80'
                  }
                `}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-md flex items-center">
                      {node.name}
                    </CardTitle>
                    {renderDifficultyBadge(node.difficulty)}
                  </div>
                  <CardDescription className="text-sm line-clamp-2">
                    {node.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  {isUnlocked ? (
                    <div className="space-y-2">
                      <div className="flex gap-1 justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <motion.div
                            key={`star-${i}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: i < level ? 1 : 0.8 }}
                            transition={{ delay: i * 0.1, duration: 0.2 }}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                i < level 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : i === level && xp > 75
                                    ? 'text-yellow-400 fill-yellow-400/50'
                                    : 'text-gray-500'
                              } ${i < level && level >= 4 ? 'animate-pulse' : ''}`}
                              style={{
                                animationDuration: i < level && level >= 4 ? `${2 - (i * 0.2)}s` : undefined
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                      
                      <SkillRankingVisualizer 
                        level={level}
                        xp={xp}
                        showStars={false}
                        showGradient={true}
                        showPercentage={true}
                        size="md"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                      {canUnlock ? (
                        <Badge variant="secondary" className="bg-secondary/30">
                          <Zap className="w-3 h-3 mr-1" />
                          Available to Unlock
                        </Badge>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Lock className="w-5 h-5 mb-1 text-gray-500" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                {isUnlocked && (
                  <CardFooter className="pt-0 flex justify-center">
                    <Badge 
                      variant="outline" 
                      className="text-xs text-primary/80 border-primary/30"
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Level {level}
                    </Badge>
                  </CardFooter>
                )}
                
                {/* Connecting lines will be rendered separately via SVG */}
              </Card>
              
              {/* Visual indicator for hovering */}
              {isHighlighted && (
                <div className="absolute -inset-2 rounded-xl border-2 border-primary/30 animate-pulse pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Render skill stats
  const renderSkillStats = () => {
    if (!skillTreeData?.nodes || !selectedCategory) return null;
    
    const categoryNodes = skillTreeData.nodes.filter(
      (node: SkillNode) => node.category === selectedCategory
    );
    
    const totalSkills = categoryNodes.length;
    const unlockedSkills = categoryNodes.filter(node => isSkillUnlocked(node.id)).length;
    const masteredSkills = categoryNodes.filter(node => getSkillLevel(node.id) >= 5).length;
    
    const getProgressPercent = () => {
      if (totalSkills === 0) return 0;
      return Math.round((unlockedSkills / totalSkills) * 100);
    };
    
    const getMasteryPercent = () => {
      if (totalSkills === 0) return 0;
      return Math.round((masteredSkills / totalSkills) * 100);
    };
    
    return (
      <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="text-center">
            <div className="text-sm text-gray-400">Total Skills</div>
            <div className="text-xl font-bold mt-1">{totalSkills}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Unlocked</div>
            <div className="text-xl font-bold mt-1 text-primary">{unlockedSkills}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Mastered</div>
            <div className="text-xl font-bold mt-1 text-yellow-500">{masteredSkills}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{getProgressPercent()}%</span>
          </div>
          <Progress value={getProgressPercent()} className="h-2" />
          
          <div className="flex justify-between text-xs mb-1">
            <span>Mastery</span>
            <span>{getMasteryPercent()}%</span>
          </div>
          <Progress value={getMasteryPercent()} className="h-2 bg-gray-800" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #facc15)' }} />
        </div>
      </div>
    );
  };

  if (isLoadingSkillTree || isLoadingSkills) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-400">Loading skill tree visualization...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/30 rounded-lg border border-gray-800 p-4">
      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
          Interactive Skill Tree
        </h2>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => handleZoom(0.1)}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => handleZoom(-0.1)}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={resetView}>
                  <Home className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Category tabs */}
      {renderCategoryTabs()}
      
      {/* Skill stats */}
      {selectedCategory && renderSkillStats()}
      
      {/* Main visualization container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: '600px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG for connections between skills */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          {renderConnections()}
        </svg>
        
        {/* Skill nodes */}
        <div className="relative p-4 h-full">
          {renderSkillNodes()}
        </div>
        
        {/* Skill hover info - displays detailed info when hovering over a skill */}
        <AnimatePresence>
          {hoveredSkill && (
            <motion.div 
              className="absolute bottom-4 right-4 max-w-xs z-20 bg-black/80 backdrop-blur-md rounded-lg border border-gray-700 p-3 shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">{hoveredSkill.name}</h3>
                {renderDifficultyBadge(hoveredSkill.difficulty)}
              </div>
              <p className="text-sm text-gray-300 mb-2">{hoveredSkill.description}</p>
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>Level {getSkillLevel(hoveredSkill.id)}</span>
                <span>{getSkillXp(hoveredSkill.id)} XP</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Help text */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        Drag to pan • Scroll or use zoom buttons to zoom • Click a skill to view details
      </div>
    </div>
  );
};

export default InteractiveSkillTreeVisualization;