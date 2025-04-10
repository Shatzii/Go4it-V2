import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { 
  Brain, Dumbbell, Sparkles, Zap, Trophy, 
  Clock, ChevronRight, Check, Lock, BarChart, Star
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import InteractiveSkillTreeVisualization from '@/components/skill-tree/InteractiveSkillTreeVisualization';
import SkillRankingVisualizer from '@/components/skill-tree/SkillRankingVisualizer';

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

// Sports offered in the platform
const SPORTS = [
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'football', name: 'Football', icon: '🏈' },
  { id: 'soccer', name: 'Soccer', icon: '⚽' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'track', name: 'Track & Field', icon: '🏃' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'golf', name: 'Golf', icon: '⛳' },
  { id: 'wrestling', name: 'Wrestling', icon: '🤼' }
];

function EnhancedSkillTreePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSport, setSelectedSport] = useState<string>(SPORTS[0].id);
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(undefined);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<TrainingDrill | null>(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [drillDialogOpen, setDrillDialogOpen] = useState(false);
  const [isGeneratingDrill, setIsGeneratingDrill] = useState(false);

  // Get user's preferred sport and position if available
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['/api/athlete-profile', user?.id],
    enabled: !!user?.id,
  });

  // Get user's skill tree stats
  const { data: skillStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/player/skill-stats', selectedSport],
    enabled: !!user?.id && !!selectedSport,
  });

  // Fetch user's skill progress
  const { data: userSkills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['/api/player/skill-progress', selectedSport],
    enabled: !!user?.id && !!selectedSport,
  });

  // Fetch drills for selected skill
  const { data: drills, isLoading: isLoadingDrills } = useQuery({
    queryKey: ['/api/ai-coach/skill-drills', selectedSkill?.id],
    enabled: !!selectedSkill?.id && skillDialogOpen,
  });

  // Set default sport based on user profile
  useEffect(() => {
    if (userProfile?.primarySport) {
      setSelectedSport(userProfile.primarySport);
      if (userProfile.position) {
        setSelectedPosition(userProfile.position);
      }
    }
  }, [userProfile]);

  // Helper functions for skills and drills
  const getSkillLevel = (skillId: number): number => {
    if (!userSkills) return 0;
    const skill = userSkills.find((s: any) => s.skillNodeId === skillId);
    return skill?.level || 0;
  };

  const getSkillXp = (skillId: number): number => {
    if (!userSkills) return 0;
    const skill = userSkills.find((s: any) => s.skillNodeId === skillId);
    return skill?.xp || 0;
  };

  const isSkillUnlocked = (skillId: number): boolean => {
    if (!userSkills) return false;
    const skill = userSkills.find((s: any) => s.skillNodeId === skillId);
    return !!skill && skill.unlocked;
  };

  const handleSportChange = (sport: string) => {
    setSelectedSport(sport);
    // Reset position when changing sports
    setSelectedPosition(undefined);
  };

  const handleSkillSelected = (skill: SkillNode) => {
    setSelectedSkill(skill);
    setSkillDialogOpen(true);
  };

  const handleDrillClick = (drill: TrainingDrill) => {
    setSelectedDrill(drill);
    setDrillDialogOpen(true);
  };

  // Handle generating a new drill
  const handleGenerateDrill = async () => {
    if (!selectedSkill) return;
    
    setIsGeneratingDrill(true);
    
    try {
      const response = await fetch('/api/ai-coach/generate-drill', {
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
      
      // In a real implementation, we would use queryClient to invalidate and refetch
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

  // Handle completing a drill
  const handleCompleteDrill = async () => {
    if (!selectedDrill) return;
    
    try {
      const response = await fetch('/api/player/complete-drill', {
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
      
      // In a real implementation, we would use queryClient to invalidate and refetch
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

  // Render sport selection tabs
  const renderSportTabs = () => {
    return (
      <Tabs value={selectedSport} onValueChange={handleSportChange} className="w-full">
        <TabsList className="grid grid-flow-col auto-cols-fr w-full overflow-x-auto">
          {SPORTS.map(sport => (
            <TabsTrigger key={sport.id} value={sport.id} className="gap-2">
              <span>{sport.icon}</span>
              <span className="hidden md:inline">{sport.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  };

  // Render difficulty badge
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

  // Render skills overview stats
  const renderSkillsOverview = () => {
    if (isLoadingStats) {
      return (
        <div className="flex justify-center py-4">
          <Spinner size="md" />
        </div>
      );
    }

    // Default stats in case API doesn't return data
    const stats = skillStats || {
      totalSkills: 0,
      unlockedSkills: 0,
      masteredSkills: 0,
      totalXp: 0,
      skillsByCategory: []
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="overflow-hidden border-gray-800 bg-gray-900/60">
          <CardHeader className="pb-2 bg-gray-900/40">
            <CardTitle className="text-md flex items-center">
              <Dumbbell className="w-4 h-4 mr-2 text-primary" />
              Total Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {stats.unlockedSkills} / {stats.totalSkills}
            </div>
            <p className="text-sm text-muted-foreground">Skills unlocked</p>
            <Progress 
              value={(stats.unlockedSkills / Math.max(1, stats.totalSkills)) * 100} 
              className="h-1.5 mt-2"
            />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-gray-800 bg-gray-900/60">
          <CardHeader className="pb-2 bg-gray-900/40">
            <CardTitle className="text-md flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              Mastered Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.masteredSkills}
            </div>
            <p className="text-sm text-muted-foreground">Skills at max level</p>
            <Progress 
              value={(stats.masteredSkills / Math.max(1, stats.totalSkills)) * 100} 
              className="h-1.5 mt-2 bg-gray-800"
              style={{
                background: 'rgba(31, 41, 55, 0.5)',
                backgroundImage: 'linear-gradient(to right, #fbbf24, #f97316)'
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-gray-800 bg-gray-900/60">
          <CardHeader className="pb-2 bg-gray-900/40">
            <CardTitle className="text-md flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-500" />
              Total XP
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-500">
              {stats.totalXp.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Experience points earned</p>
            <div className="h-1.5 mt-2 bg-blue-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-full animate-pulse opacity-70"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-gray-800 bg-gray-900/60">
          <CardHeader className="pb-2 bg-gray-900/40">
            <CardTitle className="text-md flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-purple-500" />
              Top Skill
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {stats.skillsByCategory && stats.skillsByCategory.length > 0 ? (
              <>
                <div className="text-xl font-bold truncate text-purple-400">
                  {stats.skillsByCategory[0].category}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats.skillsByCategory[0].masteredCount} mastered skills
                </p>
                <div className="h-1.5 mt-2 bg-purple-500/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500"
                    style={{ 
                      width: `${(stats.skillsByCategory[0].masteredCount / stats.skillsByCategory[0].totalCount) * 100}%`
                    }}
                  ></div>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No skills mastered yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Interactive Skill Tree"
        description="Visualize your athletic skill progression with our enhanced 3D visualization"
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-primary border-primary">
            Interactive
          </Badge>
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Personalized
          </Badge>
          <Badge variant="outline" className="text-cyan-500 border-cyan-500">
            ADHD-Friendly
          </Badge>
          <Badge variant="outline" className="text-purple-500 border-purple-500">
            Real-time Progress
          </Badge>
        </div>
      </PageHeader>

      <div className="mt-6">
        {renderSportTabs()}
      </div>

      <div className="my-6">
        {renderSkillsOverview()}
      </div>

      <div className="my-6">
        <InteractiveSkillTreeVisualization 
          sportType={selectedSport} 
          position={selectedPosition}
          onSkillSelected={handleSkillSelected}
        />
      </div>

      {/* Skill Detail Dialog */}
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
                        <Card 
                          key={drill.id} 
                          className="border-gray-700 bg-gray-900/50 hover:bg-gray-800/50 cursor-pointer transition-colors" 
                          onClick={() => handleDrillClick(drill)}
                        >
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
                  variant="default"
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
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Custom AI Drill
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skill Mastery</CardTitle>
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
                      {selectedSkill && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-3"
                          onClick={() => {
                            // Normally we'd have an unlock API
                            toast({
                              title: "Skill Unlocked",
                              description: "You've unlocked this skill!",
                              variant: "success",
                            });
                            setTimeout(() => {
                              window.location.reload();
                            }, 1000);
                          }}
                        >
                          Unlock This Skill
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skill Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span>{selectedSkill?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Difficulty:</span>
                    <span className="capitalize">{selectedSkill?.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sport:</span>
                    <span className="capitalize">{selectedSkill?.sportType}</span>
                  </div>
                  {selectedSkill?.position && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Position:</span>
                      <span className="capitalize">{selectedSkill.position}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSkillDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drill Detail Dialog */}
      <Dialog open={drillDialogOpen} onOpenChange={setDrillDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{selectedDrill?.name}</span>
              <Badge variant="secondary" className="font-normal bg-primary/20 text-primary border-primary/50">
                {selectedDrill?.xpReward} XP
              </Badge>
            </DialogTitle>
            <DialogDescription>{selectedDrill?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Instructions</h3>
              <p className="text-sm text-gray-300">{selectedDrill?.instructions}</p>
            </div>
            
            {selectedDrill?.tips && selectedDrill.tips.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Pro Tips</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  {selectedDrill.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm bg-gray-800/50 p-2 rounded">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                <span>Duration: <strong>{selectedDrill?.duration} minutes</strong></span>
              </div>
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                <span>Reward: <strong className="text-yellow-500">{selectedDrill?.xpReward} XP</strong></span>
              </div>
              <div className="flex items-center">
                <BarChart className="w-4 h-4 mr-1 text-blue-500" />
                <span>Difficulty: <strong className="capitalize">{selectedDrill?.difficulty}</strong></span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDrillDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCompleteDrill}>
              <Check className="w-4 h-4 mr-2" />
              Complete Drill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EnhancedSkillTreePage;