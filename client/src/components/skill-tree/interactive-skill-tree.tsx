import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Lock, Trophy, ChevronRight, ChevronDown, Info, Play, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

// Types based on the database schema
interface SkillTreeNode {
  id: number;
  name: string;
  description: string;
  sportType: string | null;
  position: string | null;
  category: string;
  level: number;
  xpToUnlock: number;
  iconPath: string | null;
  unlockRequirement: string | null;
  sortOrder: number;
  createdAt: Date;
  isActive: boolean;
}

interface SkillTreeRelationship {
  id: number;
  parentId: number;
  childId: number;
  requirement: string | null;
  createdAt: Date;
}

interface SkillTreeData {
  nodes: SkillTreeNode[];
  relationships: SkillTreeRelationship[];
}

interface TrainingDrill {
  id: number;
  name: string;
  description: string;
  skillNodeId: number;
  difficulty: string;
  sportType: string | null;
  position: string | null;
  category: string;
  duration: number;
  equipment: string[];
  targetMuscles: string[];
  videoUrl: string | null;
  imageUrl: string | null;
  instructions: string;
  tips: string[];
  variations: string[];
  xpReward: number;
  createdAt: Date;
  updatedAt: Date;
  isAiGenerated: boolean;
  aiPromptUsed: string | null;
  sourceId: string | null;
}

interface UserSkillProgress {
  skillNodeId: number;
  level: number;
  xp: number;
  unlocked: boolean;
}

interface InteractiveSkillTreeProps {
  sportType: string;
  position?: string;
  onSkillSelected?: (skill: SkillTreeNode) => void;
}

export default function InteractiveSkillTree({ 
  sportType, 
  position,
  onSkillSelected
}: InteractiveSkillTreeProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSkill, setSelectedSkill] = useState<SkillTreeNode | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<TrainingDrill | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drillDrawerOpen, setDrillDrawerOpen] = useState(false);
  const [skillProgress, setSkillProgress] = useState<Map<number, UserSkillProgress>>(new Map());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Custom colors for different skill categories
  const categoryColors: Record<string, string> = {
    speed: '#3b82f6',      // blue
    strength: '#f97316',   // orange
    agility: '#84cc16',    // lime
    technique: '#8b5cf6',  // violet
    endurance: '#ec4899',  // pink
    flexibility: '#14b8a6', // teal
    coordination: '#f59e0b', // amber
    balance: '#0ea5e9',    // sky
    power: '#ef4444',      // red
    mental: '#6366f1',     // indigo
  };
  
  // Fetch skill tree data
  const { data: skillTreeData, isLoading: isLoadingSkillTree } = useQuery<SkillTreeData>({
    queryKey: ['/api/ai-coach/skill-tree', sportType],
    enabled: !!user && !!sportType,
  });
  
  // Fetch user's skill progress
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery<UserSkillProgress[]>({
    queryKey: ['/api/player/skill-progress', sportType],
    enabled: !!user && !!sportType,
    // This is a fallback for development if the API endpoint isn't fully implemented yet
    onError: () => {
      console.warn('Skill progress endpoint not available, using mock data');
      // Mock progress data based on skill tree nodes
      if (skillTreeData?.nodes) {
        const mockProgress: UserSkillProgress[] = skillTreeData.nodes.map(node => ({
          skillNodeId: node.id,
          level: node.level === 1 ? 1 : 0, // Only first level skills are unlocked
          xp: node.level === 1 ? Math.floor(Math.random() * 30) : 0,
          unlocked: node.level === 1 // Only first level skills are unlocked
        }));
        setSkillProgress(new Map(mockProgress.map(p => [p.skillNodeId, p])));
      }
    }
  });
  
  // Fetch drills for the selected skill
  const { data: drills, isLoading: isLoadingDrills } = useQuery<TrainingDrill[]>({
    queryKey: ['/api/ai-coach/skill-drills', selectedSkill?.id],
    enabled: !!selectedSkill?.id,
  });
  
  // Generate a drill mutation
  const generateDrillMutation = useMutation({
    mutationFn: async (data: { skillNodeId: number, difficulty: string }) => {
      return await apiRequest('POST', '/api/ai-coach/generate-drill', data);
    },
    onSuccess: () => {
      toast({
        title: "Drill generated!",
        description: "A new training drill has been created for this skill.",
      });
      // Invalidate cache to refresh drills
      queryClient.invalidateQueries({ queryKey: ['/api/ai-coach/skill-drills', selectedSkill?.id] });
    },
    onError: (error) => {
      console.error('Error generating drill:', error);
      toast({
        title: "Drill generation failed",
        description: "Could not generate a new drill at this time.",
        variant: "destructive",
      });
    }
  });
  
  // Complete a drill mutation
  const completeDrillMutation = useMutation({
    mutationFn: async (data: { drillId: number }) => {
      return await apiRequest('POST', '/api/player/complete-drill', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Drill completed!",
        description: `You've earned ${data.xpEarned} XP!`,
      });
      // Invalidate cache to refresh skill progress
      queryClient.invalidateQueries({ queryKey: ['/api/player/skill-progress', sportType] });
      // Close the drill drawer
      setDrillDrawerOpen(false);
    },
    onError: (error) => {
      console.error('Error completing drill:', error);
      toast({
        title: "Couldn't record completion",
        description: "There was an error recording your drill completion.",
        variant: "destructive",
      });
    }
  });
  
  // Update skillProgress state when userProgress data loads
  useEffect(() => {
    if (userProgress) {
      setSkillProgress(new Map(userProgress.map(p => [p.skillNodeId, p])));
    }
  }, [userProgress]);
  
  // Set the first category as active when data loads
  useEffect(() => {
    if (skillTreeData?.nodes && skillTreeData.nodes.length > 0 && !activeCategory) {
      const categories = [...new Set(skillTreeData.nodes.map(node => node.category))];
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
      }
    }
  }, [skillTreeData, activeCategory]);

  // Handle skill node click
  const handleSkillClick = (skill: SkillTreeNode) => {
    setSelectedSkill(skill);
    setDrawerOpen(true);
    if (onSkillSelected) {
      onSkillSelected(skill);
    }
  };
  
  // Handle drill selection
  const handleDrillSelect = (drill: TrainingDrill) => {
    setSelectedDrill(drill);
    setDrillDrawerOpen(true);
  };
  
  // Generate a new drill
  const handleGenerateDrill = () => {
    if (selectedSkill) {
      generateDrillMutation.mutate({ 
        skillNodeId: selectedSkill.id, 
        difficulty: 'intermediate' 
      });
    }
  };
  
  // Mark a drill as completed
  const handleCompleteDrill = () => {
    if (selectedDrill) {
      completeDrillMutation.mutate({ drillId: selectedDrill.id });
    }
  };
  
  // Function to filter nodes by category
  const filterNodesByCategory = (nodes: SkillTreeNode[], category: string | null): SkillTreeNode[] => {
    if (!category) return nodes;
    return nodes.filter(node => node.category === category);
  };
  
  // Get unique categories from nodes
  const getCategories = (): string[] => {
    if (!skillTreeData?.nodes) return [];
    const categories = [...new Set(skillTreeData.nodes.map(node => node.category))];
    return categories;
  };
  
  // Check if a skill is unlocked
  const isSkillUnlocked = (skillId: number): boolean => {
    const progress = skillProgress.get(skillId);
    if (!progress) return false;
    return progress.unlocked;
  };
  
  // Get a node's progress percentage
  const getSkillProgress = (skillId: number): number => {
    const progress = skillProgress.get(skillId);
    if (!progress) return 0;
    
    // If the skill is not unlocked yet, return 0
    if (!progress.unlocked) return 0;
    
    // Calculate XP needed to level up (simplified formula)
    const xpNeeded = progress.level * 50;
    return Math.min(100, Math.floor((progress.xp / xpNeeded) * 100));
  };
  
  // Get parent-child relationships
  const getChildNodes = (parentId: number): SkillTreeNode[] => {
    if (!skillTreeData?.relationships || !skillTreeData?.nodes) return [];
    
    const childIds = skillTreeData.relationships
      .filter(rel => rel.parentId === parentId)
      .map(rel => rel.childId);
    
    return skillTreeData.nodes.filter(node => childIds.includes(node.id));
  };
  
  // Calculate node position based on its level and position within level
  const calculateNodePosition = (node: SkillTreeNode, filteredNodes: SkillTreeNode[]) => {
    const levelNodes = filteredNodes.filter(n => n.level === node.level);
    const levelWidth = levelNodes.length * 150;
    const nodeIndex = levelNodes.findIndex(n => n.id === node.id);
    
    // Calculate horizontal position (x)
    const horizontalSpacing = Math.max(150, 800 / (levelNodes.length || 1));
    const x = (nodeIndex * horizontalSpacing) + horizontalSpacing / 2;
    
    // Calculate vertical position (y)
    const verticalSpacing = 180;
    const y = (node.level - 1) * verticalSpacing + 100;
    
    return { x, y };
  };
  
  // Render category selection tabs
  const renderCategoryTabs = () => {
    const categories = getCategories();
    
    return (
      <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
              activeCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    );
  };
  
  // Draw connecting lines between parent and child nodes
  const renderConnections = () => {
    if (!skillTreeData?.relationships || !skillTreeData?.nodes) return null;
    const filteredNodes = activeCategory 
      ? filterNodesByCategory(skillTreeData.nodes, activeCategory) 
      : skillTreeData.nodes;
    
    return (
      <>
        {skillTreeData.relationships.map(rel => {
          const parent = filteredNodes.find(node => node.id === rel.parentId);
          const child = filteredNodes.find(node => node.id === rel.childId);
          
          if (!parent || !child) return null;
          
          // Skip if either node is not in the active category
          if (activeCategory && (parent.category !== activeCategory || child.category !== activeCategory)) {
            return null;
          }
          
          const parentPos = calculateNodePosition(parent, filteredNodes);
          const childPos = calculateNodePosition(child, filteredNodes);
          
          // Only draw the connection if parent is unlocked
          const parentUnlocked = isSkillUnlocked(parent.id);
          
          return (
            <line
              key={`connection-${rel.id}`}
              x1={parentPos.x}
              y1={parentPos.y + 40} // Adjust for node height
              x2={childPos.x}
              y2={childPos.y - 40} // Adjust for node height
              stroke={parentUnlocked ? categoryColors[parent.category] || '#3b82f6' : '#1f2937'}
              strokeWidth={parentUnlocked ? 3 : 2}
              strokeDasharray={parentUnlocked ? undefined : "5,5"}
              strokeOpacity={parentUnlocked ? 1 : 0.5}
            />
          );
        })}
      </>
    );
  };
  
  // Render all skill nodes
  const renderNodes = () => {
    if (!skillTreeData?.nodes) return null;
    
    const filteredNodes = activeCategory 
      ? filterNodesByCategory(skillTreeData.nodes, activeCategory) 
      : skillTreeData.nodes;
    
    return (
      <>
        {filteredNodes.map(node => {
          const { x, y } = calculateNodePosition(node, filteredNodes);
          const isUnlocked = isSkillUnlocked(node.id);
          const progress = getSkillProgress(node.id);
          const categoryColor = categoryColors[node.category] || '#3b82f6';
          
          return (
            <g 
              key={`node-${node.id}`} 
              transform={`translate(${x - 60}, ${y - 40})`}
              onClick={() => handleSkillClick(node)}
              style={{ cursor: 'pointer' }}
            >
              {/* Background */}
              <rect 
                width="120" 
                height="80" 
                rx="8" 
                fill={isUnlocked ? '#1e293b' : '#0f172a'} 
                stroke={isUnlocked ? categoryColor : '#334155'} 
                strokeWidth="2"
              />
              
              {/* Icon */}
              <foreignObject x="10" y="10" width="24" height="24">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800">
                  {isUnlocked ? (
                    <Star className="w-4 h-4" style={{ color: categoryColor }} />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </foreignObject>
              
              {/* Title */}
              <foreignObject x="10" y="38" width="100" height="20">
                <div className="text-xs font-medium text-gray-200 truncate">
                  {node.name}
                </div>
              </foreignObject>
              
              {/* Progress bar */}
              <foreignObject x="10" y="60" width="100" height="12">
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: isUnlocked ? categoryColor : '#475569'
                    }}
                  ></div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </>
    );
  };
  
  // Render skill detail drawer
  const renderSkillDrawer = () => {
    if (!selectedSkill) return null;
    
    const isUnlocked = isSkillUnlocked(selectedSkill.id);
    const progress = getSkillProgress(selectedSkill.id);
    const categoryColor = categoryColors[selectedSkill.category] || '#3b82f6';
    
    return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-gray-800">
            <DrawerTitle className="text-xl flex items-center gap-2">
              {isUnlocked ? (
                <Sparkles className="h-5 w-5" style={{ color: categoryColor }} />
              ) : (
                <Lock className="h-5 w-5 text-gray-400" />
              )}
              {selectedSkill.name}
            </DrawerTitle>
            <DrawerDescription className="text-gray-400">
              {selectedSkill.category.charAt(0).toUpperCase() + selectedSkill.category.slice(1)} • 
              Level {selectedSkill.level} • 
              {isUnlocked ? `${progress}% Mastered` : 'Locked'}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-gray-300">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h4 className="text-gray-300 font-medium mb-2">Description</h4>
              <p className="text-gray-400 text-sm">{selectedSkill.description}</p>
            </div>
            
            {/* Unlock requirements if locked */}
            {!isUnlocked && selectedSkill.unlockRequirement && (
              <div className="mb-6">
                <h4 className="text-gray-300 font-medium mb-2">Requirements to Unlock</h4>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                    {selectedSkill.unlockRequirement}
                  </p>
                </div>
              </div>
            )}
            
            {/* Training drills section */}
            {isUnlocked && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-gray-300 font-medium">Training Drills</h4>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleGenerateDrill}
                    disabled={generateDrillMutation.isPending}
                  >
                    {generateDrillMutation.isPending ? (
                      <>Generating...</>
                    ) : (
                      <>Generate Drill</>
                    )}
                  </Button>
                </div>
                
                {isLoadingDrills ? (
                  <div className="text-center py-6">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-gray-400 text-sm">Loading drills...</p>
                  </div>
                ) : drills && drills.length > 0 ? (
                  <div className="space-y-3">
                    {drills.map(drill => (
                      <Card key={drill.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750">
                        <CardHeader className="p-3 pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>{drill.name}</span>
                            <Badge variant="outline" className="ml-2 bg-blue-900/30">
                              {drill.difficulty}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-xs">
                            {drill.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Dumbbell className="h-3 w-3" />
                              <span>{drill.duration} min</span>
                            </div>
                            <Button
                              variant="ghost" 
                              size="sm"
                              className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto"
                              onClick={() => handleDrillSelect(drill)}
                            >
                              View Details <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">No drills available for this skill yet.</p>
                    <Button 
                      size="sm" 
                      onClick={handleGenerateDrill}
                      disabled={generateDrillMutation.isPending}
                    >
                      {generateDrillMutation.isPending ? (
                        <>Generating...</>
                      ) : (
                        <>Generate Your First Drill</>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DrawerFooter className="border-t border-gray-800">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };
  
  // Render training drill detail drawer
  const renderDrillDrawer = () => {
    if (!selectedDrill) return null;
    
    return (
      <Drawer open={drillDrawerOpen} onOpenChange={setDrillDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-gray-800">
            <div className="flex items-center justify-between">
              <DrawerTitle>{selectedDrill.name}</DrawerTitle>
              <Badge variant="outline" className="ml-2 bg-blue-900/30">
                {selectedDrill.difficulty}
              </Badge>
            </div>
            <DrawerDescription>
              {selectedDrill.category.charAt(0).toUpperCase() + selectedDrill.category.slice(1)} • 
              {selectedDrill.duration} min • 
              {selectedDrill.xpReward} XP
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4 space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Description</h4>
              <p className="text-gray-400 text-sm">{selectedDrill.description}</p>
            </div>
            
            {/* Equipment needed */}
            {selectedDrill.equipment && selectedDrill.equipment.length > 0 && (
              <div>
                <h4 className="text-gray-300 font-medium mb-2">Equipment Needed</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDrill.equipment.map((item, i) => (
                    <Badge key={i} variant="secondary" className="bg-gray-800">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Instructions */}
            <div>
              <h4 className="text-gray-300 font-medium mb-2">Instructions</h4>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-300 text-sm whitespace-pre-line">{selectedDrill.instructions}</p>
              </div>
            </div>
            
            {/* Coaching tips */}
            {selectedDrill.tips && selectedDrill.tips.length > 0 && (
              <div>
                <h4 className="text-gray-300 font-medium mb-2">Coaching Tips</h4>
                <ul className="space-y-2">
                  {selectedDrill.tips.map((tip, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Variations */}
            {selectedDrill.variations && selectedDrill.variations.length > 0 && (
              <div>
                <h4 className="text-gray-300 font-medium mb-2">Variations</h4>
                <div className="space-y-2">
                  {selectedDrill.variations.map((variation, i) => (
                    <div key={i} className="bg-gray-800 p-2 rounded text-sm text-gray-300">
                      {variation}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Video if available */}
            {selectedDrill.videoUrl && (
              <div>
                <h4 className="text-gray-300 font-medium mb-2">Demonstration</h4>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  {/* This would be replaced with actual video player */}
                  <Button variant="outline" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Watch Demo
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DrawerFooter className="border-t border-gray-800">
            <Button onClick={handleCompleteDrill} disabled={completeDrillMutation.isPending}>
              {completeDrillMutation.isPending ? 'Updating Progress...' : `Mark as Completed (Earn ${selectedDrill.xpReward} XP)`}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };
  
  if (isLoadingSkillTree) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-400">Loading skill tree...</p>
      </div>
    );
  }
  
  if (!skillTreeData || skillTreeData.nodes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/50 rounded-xl">
        <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-300 mb-2">Skill Tree Not Available</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          We don't have a skill tree for {sportType} yet. Check back soon or try another sport.
        </p>
      </div>
    );
  }
  
  // Calculate SVG size based on the number of nodes
  const maxLevel = Math.max(...skillTreeData.nodes.map(node => node.level));
  const nodesPerLevel = Array.from({length: maxLevel}, (_, i) => {
    return skillTreeData.nodes.filter(node => node.level === i + 1).length;
  });
  const maxNodesInAnyLevel = Math.max(...nodesPerLevel);
  
  const svgWidth = Math.max(800, maxNodesInAnyLevel * 150);
  const svgHeight = maxLevel * 180 + 100;
  
  return (
    <div className="flex flex-col w-full">
      {/* Category selection */}
      {renderCategoryTabs()}
      
      {/* Skill tree visualization */}
      <div className="relative overflow-x-auto overflow-y-auto bg-gray-900/50 rounded-xl border border-gray-800 p-2">
        <div className="min-w-[800px]">
          <svg
            ref={svgRef}
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="skill-tree-svg"
          >
            {/* Connecting lines between nodes */}
            {renderConnections()}
            
            {/* Skill nodes */}
            {renderNodes()}
          </svg>
        </div>
      </div>
      
      {/* Skill detail drawer */}
      {renderSkillDrawer()}
      
      {/* Drill detail drawer */}
      {renderDrillDrawer()}
    </div>
  );
}