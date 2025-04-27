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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  Crown, 
  ShieldCheck,
  Sparkles,
  Zap,
  Share,
  Dumbbell,
  Shirt,
  MessageSquare
} from 'lucide-react';
import { Reward, RewardType } from '../types';

interface RewardDisplayProps {
  rewards: Reward[];
  title?: string;
  description?: string;
  onShare?: (reward: Reward) => void;
  showUnlockButton?: boolean;
  className?: string;
}

// Icon mapping for different reward types
const getRewardIcon = (type: RewardType, rarity: string) => {
  const iconProps = { 
    className: `h-6 w-6 ${getRarityColor(rarity)}`,
    strokeWidth: 1.5
  };

  switch (type) {
    case RewardType.Badge:
      return <Medal {...iconProps} />;
    case RewardType.Avatar:
      return <MessageSquare {...iconProps} />;
    case RewardType.Title:
      return <Crown {...iconProps} />;
    case RewardType.Equipment:
      return <Dumbbell {...iconProps} />;
    case RewardType.Accessory:
      return <Shirt {...iconProps} />;
    case RewardType.Training:
      return <Zap {...iconProps} />;
    case RewardType.Animation:
      return <Sparkles {...iconProps} />;
    case RewardType.SpecialEffect:
      return <ShieldCheck {...iconProps} />;
    case RewardType.SocialMedia:
      return <Share {...iconProps} />;
    default:
      return <Award {...iconProps} />;
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
      return 'bg-gray-200 dark:bg-gray-800';
    case 'uncommon':
      return 'bg-green-100 dark:bg-green-900';
    case 'rare':
      return 'bg-blue-100 dark:bg-blue-900';
    case 'epic':
      return 'bg-purple-100 dark:bg-purple-900';
    case 'legendary':
      return 'bg-yellow-100 dark:bg-yellow-900';
    default:
      return 'bg-gray-200 dark:bg-gray-800';
  }
};

export const RewardDisplay = ({
  rewards,
  title = "Rewards",
  description = "Unlock special rewards as you progress",
  onShare,
  showUnlockButton = false,
  className = ""
}: RewardDisplayProps) => {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRewardClick = (reward: Reward) => {
    setSelectedReward(reward);
    setIsDialogOpen(true);
  };

  const handleShareReward = (reward: Reward) => {
    if (onShare) {
      onShare(reward);
    }
  };

  // Group rewards by type
  const groupedRewards = rewards.reduce((acc, reward) => {
    const type = reward.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(reward);
    return acc;
  }, {} as Record<RewardType, Reward[]>);

  // Filter to get only types that have rewards
  const availableTypes = Object.keys(groupedRewards).filter(
    type => groupedRewards[type as RewardType]?.length > 0
  ) as RewardType[];

  return (
    <Card className={`shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {rewards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No rewards available yet</p>
            <p className="text-sm mt-2">Complete achievements to unlock rewards</p>
          </div>
        ) : (
          <Tabs defaultValue={availableTypes[0]} className="w-full">
            <TabsList className="w-full mb-4 overflow-x-auto flex no-scrollbar">
              {availableTypes.map((type) => (
                <TabsTrigger key={type} value={type} className="flex-1 min-w-fit">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {availableTypes.map((type) => (
              <TabsContent key={type} value={type} className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {groupedRewards[type].map((reward) => (
                    <motion.div
                      key={reward.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRewardClick(reward)}
                      className={`
                        relative rounded-lg p-3 cursor-pointer 
                        ${getRarityBackground(reward.rarity)}
                        ${reward.isUnlocked ? 'opacity-100' : 'opacity-60 grayscale'}
                        hover:shadow-md transition-all duration-200
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background shadow-md mb-2">
                          {getRewardIcon(reward.type, reward.rarity)}
                        </div>
                        <h4 className="text-sm font-medium text-center line-clamp-1">
                          {reward.name}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`mt-1.5 text-xs capitalize ${getRarityColor(reward.rarity)}`}
                        >
                          {reward.rarity}
                        </Badge>
                      </div>
                      {!reward.isUnlocked && (
                        <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                          <div className="bg-background rounded-full p-1.5 shadow-md">
                            <Star className="h-4 w-4" />
                          </div>
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
      {selectedReward && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getRewardIcon(selectedReward.type, selectedReward.rarity)}
                <span>{selectedReward.name}</span>
              </DialogTitle>
              <DialogDescription>
                {selectedReward.isUnlocked 
                  ? `Unlocked on ${selectedReward.unlockedAt 
                      ? new Date(selectedReward.unlockedAt).toLocaleDateString() 
                      : 'your journey'}`
                  : `Requires ${selectedReward.requiredStarLevel 
                      ? `${selectedReward.requiredStarLevel}-star level` 
                      : 'special achievement'}`
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className={`
                p-4 rounded-lg ${getRarityBackground(selectedReward.rarity)}
                ${selectedReward.isUnlocked ? '' : 'grayscale opacity-80'}
              `}>
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-background shadow-md">
                    {getRewardIcon(selectedReward.type, selectedReward.rarity)}
                  </div>
                </div>
                <ScrollArea className="h-28">
                  <p className="text-sm">
                    {selectedReward.description}
                  </p>
                </ScrollArea>
              </div>

              <div className="flex justify-between">
                {selectedReward.isUnlocked ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleShareReward(selectedReward)}
                    className="flex items-center gap-1"
                  >
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                ) : (
                  showUnlockButton && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={true}
                      className="flex items-center gap-1"
                    >
                      <Star className="h-4 w-4" />
                      Progress to unlock
                    </Button>
                  )
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default RewardDisplay;