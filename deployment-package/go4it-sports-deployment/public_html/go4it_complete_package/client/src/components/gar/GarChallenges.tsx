import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CustomProgress } from "@/components/ui/custom-progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Trophy,
  Zap,
  Target,
  ArrowUp,
  CheckCircle2,
  PlayCircle,
  Info,
  Clock,
  Award,
  TrendingUp,
  ChevronRight,
  Dumbbell,
  Video,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type ChallengeType = {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  badgeReward?: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  duration?: number;
  progress?: number;
  isActive: boolean;
  isCompleted?: boolean;
  startedAt?: string;
  completedAt?: string;
  garCategory?: {
    id: number;
    name: string;
    color: string;
  };
  garSubcategory?: {
    id: number;
    name: string;
  };
  targetScore: number;
  currentScore?: number;
  improvementPercentage?: number;
  recommendedDrills?: any[];
  resourceLinks?: any[];
  aiGeneratedTips?: string;
  sportType: string;
  position?: string;
};

// Challenge Card Component
const ChallengeCard: React.FC<{
  challenge: ChallengeType;
  onAccept: (id: number) => void;
  onComplete: (id: number) => void;
  onViewDetails: (challenge: ChallengeType) => void;
}> = ({ challenge, onAccept, onComplete, onViewDetails }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "physical":
        return "bg-blue-500";
      case "technical":
        return "bg-green-500";
      case "mental":
        return "bg-purple-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div
        className={cn(
          "h-2",
          challenge.garCategory?.color
            ? challenge.garCategory.color
            : getCategoryColor(challenge.category)
        )}
      />
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{challenge.title}</CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "text-xs border-none text-white",
              getDifficultyColor(challenge.difficulty)
            )}
          >
            {challenge.difficulty}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Target className="h-3 w-3" />
          <span>
            {challenge.garSubcategory?.name || challenge.category}{" "}
            {challenge.targetScore && `(Target: ${challenge.targetScore})`}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-4">
          {challenge.description}
        </p>
        {challenge.progress !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{challenge.progress}%</span>
            </div>
            <CustomProgress
              value={challenge.progress}
              className="h-2"
              indicatorClassName={
                challenge.garCategory?.color || getCategoryColor(challenge.category)
              }
            />
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span>{challenge.xpReward} XP</span>
          </div>
          {challenge.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{challenge.duration} days</span>
            </div>
          )}
          {challenge.badgeReward && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Award className="h-3 w-3 text-amber-500" />
              <span>{challenge.badgeReward}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => onViewDetails(challenge)}
        >
          <Info className="h-3 w-3 mr-1" />
          Details
        </Button>
        {!challenge.progress && !challenge.isCompleted ? (
          <Button
            variant="default"
            size="sm"
            className="text-xs"
            onClick={() => onAccept(challenge.id)}
          >
            <PlayCircle className="h-3 w-3 mr-1" />
            Start
          </Button>
        ) : challenge.isCompleted ? (
          <Badge className="bg-green-500 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onComplete(challenge.id)}
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Challenge Details Dialog Component
const ChallengeDetails: React.FC<{
  challenge: ChallengeType | null;
  onClose: () => void;
  onAccept: (id: number) => void;
}> = ({ challenge, onClose, onAccept }) => {
  if (!challenge) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "physical":
        return "text-blue-500";
      case "technical":
        return "text-green-500";
      case "mental":
        return "text-purple-500";
      default:
        return "text-slate-500";
    }
  };

  const getRecommendedDrills = () => {
    if (!challenge.recommendedDrills || challenge.recommendedDrills.length === 0) {
      return [
        {
          id: 1,
          title: "Focused Shooting Drill",
          description: "10 shots from 5 different positions, tracking accuracy",
          duration: 15,
          difficulty: "Medium",
          type: "Technical",
        },
        {
          id: 2,
          title: "Ball Handling Series",
          description: "Advanced dribbling patterns to improve control",
          duration: 10,
          difficulty: "Hard",
          type: "Technical",
        },
      ];
    }
    return challenge.recommendedDrills;
  };

  const getResourceLinks = () => {
    if (!challenge.resourceLinks || challenge.resourceLinks.length === 0) {
      return [
        {
          id: 1,
          title: "Advanced Shooting Form Analysis",
          type: "video",
          url: "#",
        },
        {
          id: 2,
          title: "Mental Focus Techniques for Athletes",
          type: "article",
          url: "#",
        },
      ];
    }
    return challenge.resourceLinks;
  };

  const drills = getRecommendedDrills();
  const resources = getResourceLinks();

  return (
    <DialogContent className="sm:max-w-md md:max-w-lg">
      <DialogHeader>
        <DialogTitle>{challenge.title}</DialogTitle>
        <DialogDescription>
          <div className="flex gap-2 mt-1">
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                challenge.garCategory?.color
                  ? challenge.garCategory.color.replace("bg-", "text-")
                  : getCategoryColor(challenge.category)
              )}
            >
              {challenge.garCategory?.name || challenge.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {challenge.difficulty}
            </Badge>
            {challenge.sportType && (
              <Badge variant="outline" className="text-xs">
                {challenge.sportType}
              </Badge>
            )}
            {challenge.position && (
              <Badge variant="outline" className="text-xs">
                {challenge.position}
              </Badge>
            )}
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Description</h4>
          <p className="text-sm text-muted-foreground">{challenge.description}</p>
        </div>

        {(challenge.targetScore || challenge.currentScore) && (
          <div>
            <h4 className="text-sm font-medium mb-1">Target Score</h4>
            <div className="flex items-center gap-2">
              {challenge.currentScore && (
                <span className="text-sm">
                  Current: {challenge.currentScore}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Target: {challenge.targetScore}
              </span>
              {challenge.improvementPercentage && (
                <Badge className="bg-blue-500 text-xs ml-2">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {challenge.improvementPercentage}% improvement
                </Badge>
              )}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium mb-1">Rewards</h4>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">{challenge.xpReward} XP</span>
            </div>
            {challenge.badgeReward && (
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="text-sm">{challenge.badgeReward} Badge</span>
              </div>
            )}
            {challenge.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{challenge.duration} days</span>
              </div>
            )}
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {challenge.aiGeneratedTips && (
            <AccordionItem value="tips">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Tips for Success</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  {challenge.aiGeneratedTips}
                </p>
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="drills">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                <span>Recommended Drills</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {drills.map((drill) => (
                  <div
                    key={drill.id}
                    className="border rounded-md p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-sm font-medium">{drill.title}</h5>
                        <p className="text-xs text-muted-foreground">
                          {drill.description}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap"
                      >
                        {drill.duration} min
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        {drill.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {drill.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Learning Resources</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    {resource.type === "video" ? (
                      <Video className="h-4 w-4 text-red-500" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-sm">{resource.title}</span>
                  </a>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {!challenge.progress && !challenge.isCompleted && (
          <Button onClick={() => onAccept(challenge.id)}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Start Challenge
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

// Main Component
export function GarChallenges() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType | null>(null);
  const [filterOption, setFilterOption] = useState<string>("all");

  // Fetch challenges
  const { data: challenges, isLoading } = useQuery({
    queryKey: ["/api/athlete/gar-challenges", user?.id],
    queryFn: () => fetch(`/api/athlete/gar-challenges/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  // Accept challenge mutation
  const acceptChallengeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      const response = await apiRequest("POST", "/api/athlete/accept-challenge", {
        userId: user?.id,
        challengeId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/gar-challenges"] });
      toast({
        title: "Challenge accepted!",
        description: "The challenge has been added to your active challenges.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to accept challenge",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Complete challenge mutation
  const completeChallengeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      const response = await apiRequest("POST", "/api/athlete/complete-challenge", {
        userId: user?.id,
        challengeId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/gar-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/gar-scores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/xp"] });
      toast({
        title: "Challenge completed!",
        description: `You earned ${data.xpEarned} XP and improved your GAR score!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to complete challenge",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle challenge accept
  const handleAcceptChallenge = (challengeId: number) => {
    acceptChallengeMutation.mutate(challengeId);
    setSelectedChallenge(null);
  };

  // Handle challenge complete
  const handleCompleteChallenge = (challengeId: number) => {
    completeChallengeMutation.mutate(challengeId);
  };

  // Handle view details
  const handleViewDetails = (challenge: ChallengeType) => {
    setSelectedChallenge(challenge);
  };

  // Filter challenges
  const getFilteredChallenges = () => {
    if (!challenges) return [];

    const mockChallenges: ChallengeType[] = [
      {
        id: 1,
        title: "Shooting Accuracy Master",
        description: "Improve your shooting accuracy by reaching a 75 GAR score in the technical shooting subcategory.",
        xpReward: 500,
        badgeReward: "Sharpshooter",
        difficulty: "medium",
        category: "technical",
        targetScore: 75,
        currentScore: 70,
        improvementPercentage: 7.1,
        isActive: true,
        sportType: "basketball",
        position: "Guard",
        aiGeneratedTips: "Focus on your elbow alignment and follow-through. Practice daily with 100 shots from your weak spots. Use visualization techniques before each shot to improve focus and consistency."
      },
      {
        id: 2,
        title: "Speed Demon Challenge",
        description: "Increase your speed GAR score by at least 5 points through dedicated speed training.",
        xpReward: 400,
        difficulty: "hard",
        category: "physical",
        targetScore: 90,
        currentScore: 85,
        isActive: true,
        sportType: "football",
        duration: 14,
        progress: 35,
        aiGeneratedTips: "Incorporate high-intensity interval training (HIIT) twice a week. Focus on explosive movements like box jumps and sprints. Make sure to allow for proper recovery between sessions."
      },
      {
        id: 3,
        title: "Mental Focus Builder",
        description: "Enhance your focus and decision-making skills to achieve a higher mental GAR score.",
        xpReward: 300,
        badgeReward: "Mind Master",
        difficulty: "easy",
        category: "mental",
        targetScore: 80,
        isActive: true,
        sportType: "basketball",
        aiGeneratedTips: "Practice meditation for 5 minutes before training sessions. Use visualization techniques to imagine successful plays. Keep a journal to track your mental state during games and practices."
      }
    ];

    // Combine real challenges with mock challenges for development
    const allChallenges = [...(challenges || []), ...mockChallenges];

    switch (filterOption) {
      case "active":
        return allChallenges.filter(c => c.progress && !c.isCompleted);
      case "available":
        return allChallenges.filter(c => !c.progress && !c.isCompleted);
      case "completed":
        return allChallenges.filter(c => c.isCompleted);
      case "physical":
        return allChallenges.filter(c => c.category === "physical");
      case "technical":
        return allChallenges.filter(c => c.category === "technical");
      case "mental":
        return allChallenges.filter(c => c.category === "mental");
      default:
        return allChallenges;
    }
  };

  const filteredChallenges = getFilteredChallenges();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            GAR Improvement Challenges
          </h2>
          <p className="text-muted-foreground">
            Complete challenges to improve your GAR scores and earn rewards
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterOption === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterOption("all")}
          >
            All
          </Button>
          <Button
            variant={filterOption === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterOption("active")}
          >
            In Progress
          </Button>
          <Button
            variant={filterOption === "available" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterOption("available")}
          >
            Available
          </Button>
          <Button
            variant={filterOption === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterOption("completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onAccept={handleAcceptChallenge}
            onComplete={handleCompleteChallenge}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No challenges found</h3>
          <p className="text-muted-foreground text-center mt-1">
            {filterOption === "all"
              ? "No challenges are available at the moment. Check back later!"
              : `No ${filterOption} challenges found. Try a different filter.`}
          </p>
        </div>
      )}

      <Dialog open={!!selectedChallenge} onOpenChange={(open) => !open && setSelectedChallenge(null)}>
        <ChallengeDetails
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onAccept={handleAcceptChallenge}
        />
      </Dialog>
    </div>
  );
}