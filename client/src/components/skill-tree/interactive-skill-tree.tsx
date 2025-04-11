import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Check, ChevronRight, Lock, Sparkles, Star, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SkillRankingVisualizer from './SkillRankingVisualizer';

// Types for skill tree data
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

type TrainingDrill = {
  id: number;
  name: string;
  description: string;
  skillNodeId: number;
  difficulty: string;
  duration: number;
  instructions: string;
  tips: string[];
  xpReward: number;
  isAiGenerated: boolean;
};

interface InteractiveSkillTreeProps {
  sportType: string;
  position?: string;
}

const InteractiveSkillTree: React.FC<InteractiveSkillTreeProps> = ({ sportType, position }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<TrainingDrill | null>(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [drillDialogOpen, setDrillDialogOpen] = useState(false);
  const [isGeneratingDrill, setIsGeneratingDrill] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  // Fetch skill tree data
  const { data: skillTreeData, isLoading: isLoadingSkillTree } = useQuery({
    queryKey: ['/api/skill-tree/root-nodes', sportType, position],
    enabled: !!sportType,
  });

  // Fetch user's skill progress
  const { data: userSkills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['/api/skill-tree/user-progress', sportType],
    enabled: !!sportType,
  });

  // Fetch drills for selected skill
  const { data: drills, isLoading: isLoadingDrills } = useQuery({
    queryKey: ['/api/skill-tree/nodes/' + selectedSkill?.id + '/drills'],
    enabled: !!selectedSkill?.id && skillDialogOpen,
  });

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

  // Generate connections between nodes
  const generateConnections = () => {
    if (!skillTreeData || !svgRef.current) return null;
    
    const { nodes, relationships } = skillTreeData;
    const connections: JSX.Element[] = [];
    
    relationships.forEach((rel: SkillRelationship) => {
      const parentNode = document.getElementById(`skill-${rel.parentNodeId}`);
      const childNode = document.getElementById(`skill-${rel.childNodeId}`);
      
      if (parentNode && childNode) {
        const parentRect = parentNode.getBoundingClientRect();
        const childRect = childNode.getBoundingClientRect();
        const svgRect = svgRef.current!.getBoundingClientRect();
        
        // Calculate position relative to SVG
        const x1 = parentRect.left + parentRect.width / 2 - svgRect.left;
        const y1 = parentRect.top + parentRect.height / 2 - svgRect.top;
        const x2 = childRect.left + childRect.width / 2 - svgRect.left;
        const y2 = childRect.top + childRect.height / 2 - svgRect.top;
        
        // Check if parent skill is unlocked
        const parentUnlocked = isSkillUnlocked(rel.parentNodeId);
        const childUnlocked = isSkillUnlocked(rel.childNodeId);
        
        connections.push(
          <line
            key={`connection-${rel.id}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={parentUnlocked && childUnlocked ? '#3b82f6' : '#4b5563'}
            strokeWidth={parentUnlocked && childUnlocked ? 3 : 2}
            strokeDasharray={parentUnlocked && childUnlocked ? undefined : '5,5'}
            strokeOpacity={parentUnlocked ? 1 : 0.5}
          />
        );
      }
    });
    
    return connections;
  };

  // Update connections when window resizes
  useEffect(() => {
    const handleResize = () => {
      // Force redraw of connections
      setConnections(generateConnections());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [skillTreeData, userSkills]);

  // Update connections when data changes
  const [connections, setConnections] = useState<JSX.Element[] | null>(null);
  useEffect(() => {
    if (skillTreeData && userSkills) {
      // Small delay to ensure nodes are rendered first
      setTimeout(() => {
        setConnections(generateConnections());
      }, 100);
    }
  }, [skillTreeData, userSkills]);

  // Handle skill click
  const handleSkillClick = (skill: SkillNode) => {
    setSelectedSkill(skill);
    setSkillDialogOpen(true);
  };

  // Handle drill click
  const handleDrillClick = (drill: TrainingDrill) => {
    setSelectedDrill(drill);
    setDrillDialogOpen(true);
  };

  // Handle completing a drill
  const handleCompleteDrill = async () => {
    if (!selectedDrill) return;
    
    try {
      const response = await fetch('/api/skill-tree/complete-drill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ drillId: selectedDrill.id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete drill');
      }
      
      const data = await response.json();
      
      toast({
        title: "Drill Completed!",
        description: `You earned ${data.xpEarned} XP for completing this drill.`,
        variant: "success",
      });
      
      // Close dialogs
      setDrillDialogOpen(false);
      setSkillDialogOpen(false);
      
      // Invalidate queries to refresh data
      // (Note: We would use queryClient here in a real implementation)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete the drill. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Generate a new drill
  const handleGenerateDrill = async () => {
    if (!selectedSkill) return;
    
    setIsGeneratingDrill(true);
    
    try {
      const response = await fetch('/api/skill-tree/generate-drill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          skillNodeId: selectedSkill.id,
          difficulty: 'intermediate',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate drill');
      }
      
      const newDrill = await response.json();
      
      toast({
        title: "Drill Generated",
        description: "A new custom drill has been created for you.",
        variant: "success",
      });
      
      // Update the drills list (would use queryClient in real implementation)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate a new drill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDrill(false);
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

  // Render skill level stars
  const renderSkillLevel = (skillId: number) => {
    const level = getSkillLevel(skillId);
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className={`w-4 h-4 ${i < level ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}`}
        />
      );
    }
    
    return <div className="flex gap-1 mt-2">{stars}</div>;
  };

  // Render skill tree nodes
  const renderSkillNodes = () => {
    if (!skillTreeData || !userSkills) return null;
    
    const { nodes } = skillTreeData;
    const categories = [...new Set(nodes.map((node: SkillNode) => node.category))];
    
    // Group nodes by category
    const nodesByCategory: Record<string, SkillNode[]> = {};
    categories.forEach(category => {
      nodesByCategory[category] = nodes.filter((node: SkillNode) => node.category === category);
    });
    
    return (
      <>
        {categories.map((category, categoryIndex) => (
          <div key={`category-${categoryIndex}`} className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-primary">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nodesByCategory[category].map((node: SkillNode) => {
                const isUnlocked = isSkillUnlocked(node.id);
                const canUnlock = canUnlockSkill(node);
                
                return (
                  <div
                    id={`skill-${node.id}`}
                    key={`skill-${node.id}`}
                    className={`relative cursor-pointer transition-all duration-200 `}
                    onClick={() => handleSkillClick(node)}
                  >
                    <Card className={`
                      border-2 transition-all duration-200
                      ${isUnlocked ? 'bg-primary/10 border-primary/50' : canUnlock ? 'bg-secondary/20 border-secondary/50' : 'bg-gray-900/30 border-gray-700 opacity-80'}
                    `}>
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
                          renderSkillLevel(node.id)
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            {canUnlock ? (
                              <>
                                <Badge variant="secondary" className="bg-secondary/30">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Available to Unlock
                                </Badge>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>Locked</span>
                              </>
                            )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        {isUnlocked && (
                          <div className="w-full">
                            <SkillRankingVisualizer 
                              level={getSkillLevel(node.id)}
                              xp={getSkillXp(node.id)}
                              showStars={false}
                              size="sm"
                            />
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </>
    );
  };

  if (isLoadingSkillTree || isLoadingSkills) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-400">Loading skill tree...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* SVG for connections between nodes */}
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{ minHeight: '1000px' }}
      >
        {connections}
      </svg>
      
      {/* Skill nodes */}
      <div className="relative z-10 p-6">
        {renderSkillNodes()}
      </div>
      
      {/* Skill dialog */}
      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{selectedSkill?.name}</span>
              {selectedSkill && renderDifficultyBadge(selectedSkill.difficulty)}
            </DialogTitle>
            <DialogDescription>
              {selectedSkill?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col-reverse md:flex-row gap-4 flex-1 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                Training Drills
              </h3>
              
              {isLoadingDrills ? (
                <div className="flex justify-center py-6">
                  <Spinner size="md" />
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  {drills && drills.length > 0 ? (
                    <div className="space-y-3">
                      {drills.map((drill: TrainingDrill) => (
                        <Card key={drill.id} className="border-gray-700 bg-gray-900/50 hover:bg-gray-800/50 cursor-pointer transition-colors" onClick={() => handleDrillClick(drill)}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex justify-between">
                              <span>{drill.name}</span>
                              <Badge variant="secondary" className="font-normal bg-primary/20 text-primary border-primary/50">
                                {drill.xpReward} XP
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pb-2 pt-0">
                            <p className="text-xs text-gray-400">{drill.description}</p>
                          </CardContent>
                          <CardFooter className="pt-0 justify-between">
                            <div className="flex items-center text-xs text-gray-400">
                              <Clock className="w-3 h-3 mr-1" /> 
                              {drill.duration} min
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                              Train <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-6">
                      <p>No drills available for this skill.</p>
                      <p className="text-sm mt-2">Click the button below to generate a custom drill.</p>
                    </div>
                  )}
                </ScrollArea>
              )}
              
              <div className="mt-4">
                <Button 
                  onClick={handleGenerateDrill} 
                  disabled={isGeneratingDrill}
                  className="w-full"
                >
                  {isGeneratingDrill ? (
                    <>
                      <Spinner size="sm" className="mr-2" /> 
                      Generating Custom Drill...
                    </>
                  ) : (
                    <>Generate Custom Drill</>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/3 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skill Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSkill && isSkillUnlocked(selectedSkill.id) ? (
                    <div className="space-y-4">
                      <SkillRankingVisualizer 
                        level={getSkillLevel(selectedSkill.id)}
                        xp={getSkillXp(selectedSkill.id)}
                        showStars={true}
                        showGradient={true}
                        showPercentage={true}
                        size="lg"
                      />
                      
                      <div className="text-center text-sm text-gray-400 mt-2">
                        {getSkillLevel(selectedSkill.id) >= 5 ? (
                          <div className="flex items-center justify-center text-yellow-500">
                            <Check className="w-4 h-4 mr-1" /> 
                            Skill Mastered
                          </div>
                        ) : (
                          <>
                            <p>{((getSkillLevel(selectedSkill.id) + 1) * 100) - getSkillXp(selectedSkill.id)} XP until next level</p>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <Lock className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                      <p className="text-sm text-gray-400">This skill is locked</p>
                      {selectedSkill && canUnlockSkill(selectedSkill) && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-3"
                          onClick={handleCompleteDrill} // Simplified - normally we'd have an unlock API
                        >
                          Unlock This Skill
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skill Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <span className="ml-2">{selectedSkill?.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Sport:</span>
                    <span className="ml-2">{selectedSkill?.sportType}</span>
                  </div>
                  {selectedSkill?.position && (
                    <div>
                      <span className="text-gray-400">Position:</span>
                      <span className="ml-2">{selectedSkill.position}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Difficulty:</span>
                    <span className="ml-2 capitalize">{selectedSkill?.difficulty}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSkillDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Drill dialog */}
      <Dialog open={drillDialogOpen} onOpenChange={setDrillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{selectedDrill?.name}</span>
              <Badge variant="outline" className="font-normal bg-primary/20 text-primary border-primary/50">
                {selectedDrill?.xpReward} XP
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {selectedDrill?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <h3 className="font-semibold mb-2">Instructions</h3>
              <p className="text-sm text-gray-300">{selectedDrill?.instructions}</p>
            </div>
            
            {selectedDrill?.tips && selectedDrill.tips.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tips</h3>
                <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                  {selectedDrill.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" /> 
              <span>Duration: {selectedDrill?.duration} minutes</span>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDrillDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleCompleteDrill}>
              Complete Drill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Clock component for duration
const Clock: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={className}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );
};

export default InteractiveSkillTree;