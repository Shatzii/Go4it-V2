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
import {
  Gift,
  ShoppingBag,
  Shirt,
  Crown,
  Medal,
  Gem,
  Palette,
  Users,
  Sparkles,
  Share2,
  CheckCircle2,
  Lock,
  BadgePlus
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
    case RewardType.Gear:
      return <ShoppingBag {...iconProps} />;
    case RewardType.Apparel:
      return <Shirt {...iconProps} />;
    case RewardType.Badge:
      return <BadgePlus {...iconProps} />;
    case RewardType.Title:
      return <Crown {...iconProps} />;
    case RewardType.Exclusive:
      return <Gem {...iconProps} />;
    case RewardType.Cosmetic:
      return <Palette {...iconProps} />;
    case RewardType.Social:
      return <Users {...iconProps} />;
    case RewardType.Special:
      return <Sparkles {...iconProps} />;
    default:
      return <Gift {...iconProps} />;
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
      return 'bg-green-100 dark:bg-green-900/40';
    case 'rare':
      return 'bg-blue-100 dark:bg-blue-900/40';
    case 'epic':
      return 'bg-purple-100 dark:bg-purple-900/40';
    case 'legendary':
      return 'bg-yellow-100 dark:bg-yellow-900/40';
    default:
      return 'bg-gray-100 dark:bg-gray-800';
  }
};

export const RewardDisplay = ({
  rewards,
  title = "Rewards",
  description = "Unlock rewards as you progress",
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

  // Sort rewards by rarity and locked/unlocked status
  const sortedGroups = availableTypes.reduce((acc, type) => {
    const sortedRewards = [...groupedRewards[type]].sort((a, b) => {
      // First by unlocked status (unlocked first)
      if (a.isUnlocked !== b.isUnlocked) {
        return a.isUnlocked ? -1 : 1;
      }
      
      // Then by rarity (legendary first, common last)
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
      const rarityA = rarityOrder[a.rarity as keyof typeof rarityOrder] || 5;
      const rarityB = rarityOrder[b.rarity as keyof typeof rarityOrder] || 5;
      return rarityA - rarityB;
    });
    
    acc[type] = sortedRewards;
    return acc;
  }, {} as Record<RewardType, Reward[]>);

  return (
    <Card className={`shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Gift className="h-5 w-5 text-purple-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {rewards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Gift className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No rewards available yet</p>
            <p className="text-sm mt-2">Keep progressing to unlock rewards</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {rewards.map((reward) => (
              <motion.div
                key={reward.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRewardClick(reward)}
                className={`
                  relative rounded-lg p-3 cursor-pointer
                  ${getRarityBackground(reward.rarity)}
                  ${reward.isUnlocked ? 'opacity-100' : 'opacity-75 hover:opacity-90'}
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
                  <div className="absolute top-1 right-1">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                {reward.isUnlocked && (
                  <div className="absolute top-1 right-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
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
                  : 'Locked - Keep progressing to unlock'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className={`
                p-4 rounded-lg ${getRarityBackground(selectedReward.rarity)}
              `}>
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-background shadow-md">
                    {getRewardIcon(selectedReward.type, selectedReward.rarity)}
                  </div>
                </div>
                <ScrollArea className="h-24">
                  <p className="text-sm">
                    {selectedReward.description}
                  </p>
                </ScrollArea>
                
                {selectedReward.requirements && (
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="font-medium">Requirements:</p>
                    <p className="text-muted-foreground">{selectedReward.requirements}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-between">
                {selectedReward.isUnlocked ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleShareReward(selectedReward)}
                      className="flex items-center gap-1"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    {selectedReward.redeemUrl && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(selectedReward.redeemUrl, '_blank')}
                        className="flex items-center gap-1"
                      >
                        <Sparkles className="h-4 w-4" />
                        Redeem
                      </Button>
                    )}
                  </>
                ) : showUnlockButton ? (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <Sparkles className="h-4 w-4" />
                    Unlock Requirements
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Keep training
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

export default RewardDisplay;