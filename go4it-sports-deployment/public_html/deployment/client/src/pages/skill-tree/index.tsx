import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  ArrowRight, 
  Dumbbell, 
  Brain, 
  Zap,
  Info,
  Sparkles,
  Lightbulb
} from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import InteractiveSkillTreeVisualization from '@/components/skill-tree/InteractiveSkillTreeVisualization';
import SkillRankingVisualizer from '@/components/skill-tree/SkillRankingVisualizer';

// Types
type SkillNode = {
  id: number;
  name: string;
  description: string;
  sportType: string;
  position?: string;
  level: number;
  xpToUnlock: number;
  iconUrl?: string;
  unlockCriteria?: any;
  active: boolean;
  prerequisiteSkills?: string[];
  skillCategory: string;
  difficulty: string;
};

type SkillRelationship = {
  id: number;
  parentNodeId: number;
  childNodeId: number;
  relationshipType: string;
};

type UserSkill = {
  id: number;
  userId: number;
  skillNodeId: number;
  level: number;
  xp: number;
  unlocked: boolean;
  unlockedAt?: string;
  lastTrainedAt?: string;
  notes?: string;
};

type TrainingDrill = {
  id: number;
  name: string;
  description: string;
  sport: string;
  position?: string;
  difficulty: string;
  estimatedDuration?: number;
  equipmentNeeded?: string[];
  videoUrl?: string;
  instructions?: string[];
  tips?: string[];
  skillNodeId?: number;
  xpReward: number;
};

type UserSportPreference = {
  sportType: string;
  position?: string;
  isPrimary: boolean;
  experience: string;
  interestLevel: number;
};

const SkillTreePage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch user's sport preferences
  const { data: userSports, isLoading: isLoadingSports } = useQuery<UserSportPreference[]>({
    queryKey: ['/api/user/sports-preferences'],
  });

  // Fetch user's skills
  const { data: userSkills, isLoading: isLoadingSkills } = useQuery<UserSkill[]>({
    queryKey: ['/api/skills/user'],
    enabled: !!selectedSport,
  });

  // Fetch skill tree data
  const { data: skillTreeData, isLoading: isLoadingSkillTree } = useQuery<{
    nodes: SkillNode[];
    relationships: SkillRelationship[];
  }>({
    queryKey: ['/api/skill-tree', selectedSport, selectedPosition],
    enabled: !!selectedSport,
  });

  // Fetch training drills for the selected skill
  const { data: trainingDrills, isLoading: isLoadingDrills } = useQuery<TrainingDrill[]>({
    queryKey: ['/api/training-drills', selectedSkill?.id],
    enabled: !!selectedSkill,
  });

  // Mutations
  const unlockSkillMutation = useMutation({
    mutationFn: (skillId: number) => {
      return fetch(`/api/skills/unlock/${skillId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(res => {
        if (!res.ok) throw new Error('Failed to unlock skill');
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills/user'] });
      toast({
        title: "Skill Unlocked!",
        description: `You've unlocked a new skill! Now you can train and improve it.`,
        variant: "default",
      });
      setIsUnlockDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unlock skill. Please try again.",
        variant: "destructive",
      });
    }
  });

  const trainSkillMutation = useMutation({
    mutationFn: (data: { skillId: number, drillId?: number }) => {
      return fetch(`/api/skills/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) throw new Error('Failed to train skill');
        return res.json();
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills/user'] });
      toast({
        title: "Training Complete!",
        description: `You gained ${data.xpGained} XP. Keep up the good work!`,
        variant: "default",
      });
      setIsTrainingDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete training. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Set default sport based on user preferences
  useEffect(() => {
    if (userSports && userSports.length > 0 && !selectedSport) {
      // Find primary sport first
      const primarySport = userSports.find(s => s.isPrimary);
      if (primarySport) {
        setSelectedSport(primarySport.sportType);
        if (primarySport.position) {
          setSelectedPosition(primarySport.position);
        }
      } else {
        // If no primary, use the first one
        setSelectedSport(userSports[0].sportType);
        if (userSports[0].position) {
          setSelectedPosition(userSports[0].position);
        }
      }
    }
  }, [userSports, selectedSport]);

  // Helper to find user's progress on a specific skill
  const getUserSkillProgress = (skillId: number): UserSkill | undefined => {
    if (!userSkills) return undefined;
    return userSkills.find(skill => skill.skillNodeId === skillId);
  };

  // Handle skill selection
  const handleSkillSelected = (skill: SkillNode) => {
    setSelectedSkill(skill);
    const userSkill = getUserSkillProgress(skill.id);
    
    if (userSkill && userSkill.unlocked) {
      setIsTrainingDialogOpen(true);
    } else if (canUnlockSkill(skill)) {
      setIsUnlockDialogOpen(true);
    } else {
      toast({
        title: "Skill Locked",
        description: "You need to unlock prerequisite skills first.",
        variant: "default",
      });
    }
  };

  // Check if a skill can be unlocked
  const canUnlockSkill = (skill: SkillNode): boolean => {
    if (!skillTreeData || !userSkills) return false;
    
    // Find relationships where this skill is a child
    const prerequisites = skillTreeData.relationships
      .filter(rel => rel.childNodeId === skill.id)
      .map(rel => rel.parentNodeId);
    
    // If no prerequisites, it can be unlocked
    if (prerequisites.length === 0) return true;
    
    // Check if all prerequisites are unlocked
    return prerequisites.every(preqId => {
      const preqSkill = userSkills.find(s => s.skillNodeId === preqId);
      return preqSkill && preqSkill.unlocked;
    });
  };

  // Get skill status (locked, can unlock, unlocked)
  const getSkillStatus = (skillId: number): 'locked' | 'can-unlock' | 'unlocked' => {
    const userSkill = getUserSkillProgress(skillId);
    if (userSkill && userSkill.unlocked) return 'unlocked';
    
    const skill = skillTreeData?.nodes.find(n => n.id === skillId);
    if (skill && canUnlockSkill(skill)) return 'can-unlock';
    
    return 'locked';
  };

  // Loading states
  if (isLoadingSports) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading your sports preferences...</p>
        </div>
      </div>
    );
  }

  // No sports added yet
  if (userSports && userSports.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-dashed border-2">
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">No Sports Added</h2>
            <p className="text-muted-foreground">
              You need to add sports to your profile before you can view the skill tree.
            </p>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            Skill Tree
          </h1>
          <p className="text-muted-foreground">
            Track your skill progression and unlock new abilities
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select 
            value={selectedSport}
            onChange={(e) => {
              setSelectedSport(e.target.value);
              setSelectedPosition('');
            }}
            className="px-3 py-2 rounded-md bg-background border border-input text-sm"
          >
            <option value="">Select Sport</option>
            {userSports?.map((sport) => (
              <option key={sport.sportType} value={sport.sportType}>
                {sport.sportType}
              </option>
            ))}
          </select>
          
          {selectedSport && (
            <select 
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="px-3 py-2 rounded-md bg-background border border-input text-sm"
            >
              <option value="">All Positions</option>
              {userSports
                ?.filter(s => s.sportType === selectedSport && s.position)
                .map((sport) => (
                  <option key={sport.position} value={sport.position}>
                    {sport.position}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Feature highlight card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 lg:col-span-3">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-3/4 space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Interactive Skill Progression
                </h2>
                <p>
                  Visualize your athletic development journey through an interactive skill tree. 
                  Unlock new skills, track your progress, and choose your training path for maximum 
                  improvement based on your specific goals.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                    <Zap className="h-3 w-3 mr-1" />
                    Personalized Training Path
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/20 text-secondary border-secondary/30">
                    <Brain className="h-3 w-3 mr-1" />
                    Neurodivergent-Optimized
                  </Badge>
                  <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-muted">
                    <Dumbbell className="h-3 w-3 mr-1" />
                    Sport-Specific Skills
                  </Badge>
                </div>
              </div>
              <div className="w-full md:w-1/4 flex justify-center items-center">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="h-20 w-20 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main skill tree visualization */}
      {selectedSport ? (
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 md:p-6">
            {isLoadingSkillTree || isLoadingSkills ? (
              <div className="flex flex-col items-center justify-center h-96">
                <Spinner size="lg" />
                <p className="mt-4 text-muted-foreground">Loading skill tree...</p>
              </div>
            ) : skillTreeData && skillTreeData.nodes.length > 0 ? (
              <InteractiveSkillTreeVisualization 
                sportType={selectedSport}
                position={selectedPosition || undefined}
                onSkillSelected={handleSkillSelected}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <Lightbulb className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-semibold">No Skills Available</h3>
                <p className="text-muted-foreground max-w-md">
                  There are no skills defined for this sport or position yet. 
                  Please check back later or select a different sport.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Sport Selected</AlertTitle>
          <AlertDescription>
            Please select a sport to view the skill tree.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Skill unlock dialog */}
      <Dialog open={isUnlockDialogOpen} onOpenChange={setIsUnlockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Unlock New Skill
            </DialogTitle>
            <DialogDescription>
              {selectedSkill?.name} - {selectedSkill?.difficulty}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p>{selectedSkill?.description}</p>
            
            <div className="bg-muted/30 p-4 rounded-md">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Skill Details
              </h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{selectedSkill?.skillCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">XP to Unlock:</span>
                  <span>{selectedSkill?.xpToUnlock} XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level Required:</span>
                  <span>{selectedSkill?.level}</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsUnlockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedSkill && unlockSkillMutation.mutate(selectedSkill.id)}
              disabled={unlockSkillMutation.isPending}
              className="gap-2"
            >
              {unlockSkillMutation.isPending && <Spinner size="sm" />}
              Unlock Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Training dialog */}
      <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Train: {selectedSkill?.name}
            </DialogTitle>
            <DialogDescription>
              Complete drills to improve this skill
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedSkill && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Current Progress</h3>
                <div className="bg-muted/30 p-4 rounded-md">
                  {(() => {
                    const userSkill = selectedSkill ? getUserSkillProgress(selectedSkill.id) : undefined;
                    return userSkill ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Level {userSkill.level}</span>
                          <span className="text-sm text-muted-foreground">{userSkill.xp} XP</span>
                        </div>
                        <SkillRankingVisualizer 
                          level={userSkill.level}
                          xp={userSkill.xp}
                          showStars={true}
                          showGradient={true}
                          showPercentage={false}
                          size="md"
                        />
                      </div>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground">No progress yet</p>
                    );
                  })()}
                </div>
              </div>
            )}
            
            <h3 className="font-medium mb-2">Training Drills</h3>
            
            {isLoadingDrills ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : trainingDrills && trainingDrills.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {trainingDrills.map(drill => (
                  <Card key={drill.id} className="bg-muted/20">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-base flex justify-between">
                        {drill.name}
                        <Badge variant="outline" className="ml-2">
                          +{drill.xpReward} XP
                        </Badge>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {drill.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="py-2 px-4 flex justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Dumbbell className="h-3 w-3 mr-1" />
                        {drill.difficulty}
                        {drill.estimatedDuration && (
                          <span className="ml-2">
                            {drill.estimatedDuration} min
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => 
                          trainSkillMutation.mutate({ 
                            skillId: selectedSkill!.id, 
                            drillId: drill.id 
                          })
                        }
                        disabled={trainSkillMutation.isPending}
                      >
                        Train
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/20 rounded-md">
                <BookOpen className="mx-auto h-8 w-8 text-muted-foreground opacity-40 mb-2" />
                <p className="text-muted-foreground">No training drills available</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTrainingDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => 
                trainSkillMutation.mutate({ skillId: selectedSkill!.id })
              }
              disabled={trainSkillMutation.isPending}
              className="gap-2"
            >
              {trainSkillMutation.isPending && <Spinner size="sm" />}
              Quick Train
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillTreePage;