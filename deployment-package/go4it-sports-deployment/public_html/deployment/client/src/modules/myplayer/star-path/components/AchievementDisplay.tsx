import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Medal, 
  Trophy, 
  Dumbbell, 
  BookOpen, 
  Users, 
  Award,
  Star,
  CheckCircle2,
  Share2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Achievement, AchievementCategory } from '../types';

interface AchievementDisplayProps {
  achievements: Achievement[];
  title?: string;
  description?: string;
  onShare?: (achievement: Achievement) => void;
  className?: string;
}

// Icon mapping for different achievement categories
const getCategoryIcon = (category: AchievementCategory, rarity: string) => {
  const iconProps = { 
    className: `h-6 w-6 ${getRarityColor(rarity)}`,
    strokeWidth: 1.5
  };

  switch (category) {
    case AchievementCategory.Performance:
      return <Trophy {...iconProps} />;
    case AchievementCategory.Training:
      return <Dumbbell {...iconProps} />;
    case AchievementCategory.Academics:
      return <BookOpen {...iconProps} />;
    case AchievementCategory.Community:
      return <Users {...iconProps} />;
    case AchievementCategory.Milestone:
      return <Star {...iconProps} />;
    case AchievementCategory.Special:
      return <Award {...iconProps} />;
    default:
      return <Medal {...iconProps} />;
  }
};

// Helper function to get color based on rarity
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'text-gray-400';
    case 'uncommon':
      return 'text-green-500';
    case 'rare':
      return 'text-blue-500';
    case 'epic':
      return 'text-purple-500';
    case 'legendary':
      return 'text-yellow-500';
    default:
      return 'text-gray-400';
  }
};

// Helper function to get background based on rarity for UI elements
const getRarityBackground = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 dark:bg-gray-800';
    case 'uncommon':
      return 'bg-green-100 dark:bg-green-900';
    case 'rare':
      return 'bg-blue-100 dark:bg-blue-900';
    case 'epic':
      return 'bg-purple-100 dark:bg-purple-900';
    case 'legendary':
      return 'bg-yellow-100 dark:bg-yellow-900';
    default:
      return 'bg-gray-100 dark:bg-gray-800';
  }
};

export const AchievementDisplay = ({
  achievements,
  title = "Achievements",
  description = "Track your progress and achievements",
  onShare,
  className = ""
}: AchievementDisplayProps) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsDialogOpen(true);
  };

  const handleShareAchievement = (achievement: Achievement) => {
    if (onShare) {
      onShare(achievement);
    }
  };

  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const category = achievement.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {} as Record<AchievementCategory, Achievement[]>);

  // Filter to get only categories that have achievements
  const availableCategories = Object.keys(groupedAchievements).filter(
    category => groupedAchievements[category as AchievementCategory]?.length > 0
  ) as AchievementCategory[];

  return (
    <Card className={`shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Medal className="h-5 w-5 text-amber-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Medal className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No achievements yet</p>
            <p className="text-sm mt-2">Complete activities to earn achievements</p>
          </div>
        ) : (
          <Tabs defaultValue={availableCategories[0]} className="w-full">
            <TabsList className="w-full mb-4 overflow-x-auto flex no-scrollbar">
              {availableCategories.map((category) => (
                <TabsTrigger key={category} value={category} className="flex-1 min-w-fit">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {availableCategories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {groupedAchievements[category].map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAchievementClick(achievement)}
                      className={`
                        relative rounded-lg p-3 cursor-pointer
                        ${getRarityBackground(achievement.rarity)}
                        ${achievement.isCompleted ? 'opacity-100' : 'opacity-75'}
                        hover:shadow-md transition-all duration-200
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background shadow-md mb-2">
                          {getCategoryIcon(achievement.category, achievement.rarity)}
                        </div>
                        <h4 className="text-sm font-medium text-center line-clamp-1">
                          {achievement.name}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`mt-1.5 text-xs capitalize ${getRarityColor(achievement.rarity)}`}
                        >
                          {achievement.rarity}
                        </Badge>
                        
                        {achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="w-full mt-2">
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-1.5" 
                            />
                            <p className="text-xs text-center mt-1 text-muted-foreground">
                              {achievement.progress}/{achievement.maxProgress}
                            </p>
                          </div>
                        )}
                      </div>
                      {achievement.isCompleted && (
                        <div className="absolute top-1 right-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
      {selectedAchievement && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getCategoryIcon(selectedAchievement.category, selectedAchievement.rarity)}
                <span>{selectedAchievement.name}</span>
              </DialogTitle>
              <DialogDescription>
                {selectedAchievement.isCompleted 
                  ? `Completed on ${selectedAchievement.unlockedAt 
                      ? new Date(selectedAchievement.unlockedAt).toLocaleDateString() 
                      : 'your journey'}`
                  : 'In progress'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className={`
                p-4 rounded-lg ${getRarityBackground(selectedAchievement.rarity)}
              `}>
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-background shadow-md">
                    {getCategoryIcon(selectedAchievement.category, selectedAchievement.rarity)}
                  </div>
                </div>
                <ScrollArea className="h-24">
                  <p className="text-sm">
                    {selectedAchievement.description}
                  </p>
                </ScrollArea>
                
                {selectedAchievement.xpReward > 0 && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-sm">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span>Reward: {selectedAchievement.xpReward} XP</span>
                  </div>
                )}
                
                {selectedAchievement.progress !== undefined && 
                 selectedAchievement.maxProgress && 
                 !selectedAchievement.isCompleted && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{selectedAchievement.progress}/{selectedAchievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(selectedAchievement.progress / selectedAchievement.maxProgress) * 100} 
                      className="h-2" 
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-between">
                {selectedAchievement.isCompleted ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleShareAchievement(selectedAchievement)}
                    className="flex items-center gap-1"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <ArrowRight className="h-4 w-4" />
                    Continue progress
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default AchievementDisplay;