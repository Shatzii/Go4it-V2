import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StarIcon, TrophyIcon, ZapIcon, ActivityIcon, CheckCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StarPathProgress } from '../index';

type StarPathCardProps = {
  progress: StarPathProgress;
  className?: string;
  onTrainClick?: () => void;
  onCheckInClick?: () => void;
};

export function StarPathCard({ progress, className, onTrainClick, onCheckInClick }: StarPathCardProps) {
  const canCheckIn = !progress.lastCheckIn || 
    new Date(progress.lastCheckIn).toDateString() !== new Date().toDateString();
  
  // Maps star levels to their display names
  const starLevelNames = [
    'Rising Prospect',
    'Emerging Talent',
    'Standout Performer',
    'Elite Prospect',
    'Five-Star Athlete'
  ];
  
  // Get the current level name
  const currentLevelName = starLevelNames[progress.currentStarLevel - 1] || 'Rookie';
  
  // Calculate percentage to next level
  const percentToNextLevel = Math.min(
    100,
    Math.round((progress.currentXp / progress.nextLevelXp) * 100)
  );
  
  // Format XP display
  const formatXP = (xp: number) => xp.toLocaleString();
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl flex items-center">
            <StarIcon className="mr-2 h-6 w-6 text-yellow-500 inline" /> 
            Star Path
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 py-1 px-2 bg-blue-950 text-white">
            <ActivityIcon className="h-3.5 w-3.5" />
            {progress.streakDays} day streak
          </Badge>
        </div>
        <CardDescription className="flex items-center">
          Your journey from prospect to star athlete
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Current Level Badge */}
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Current Level</span>
              <div className="flex items-center">
                <span className="text-xl font-bold">{currentLevelName}</span>
                <Badge className="ml-2 bg-amber-500" variant="secondary">Level {progress.currentStarLevel}</Badge>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-muted-foreground">Total XP</span>
              <span className="text-xl font-bold">{formatXP(progress.xpTotal)}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {progress.currentStarLevel + 1}</span>
              <span>{formatXP(progress.currentXp)} / {formatXP(progress.nextLevelXp)} XP</span>
            </div>
            <Progress value={percentToNextLevel} className="h-2" />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex flex-col items-center p-2 bg-muted rounded-md">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-lg font-bold">{progress.completedDrills}</span>
              <span className="text-xs text-center">Drills Done</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-muted rounded-md">
              <ZapIcon className="h-5 w-5 text-yellow-500 mb-1" />
              <span className="text-lg font-bold">{progress.verifiedWorkouts}</span>
              <span className="text-xs text-center">Workouts</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-muted rounded-md">
              <TrophyIcon className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-lg font-bold">{progress.skillTreeProgress}%</span>
              <span className="text-xs text-center">Skills</span>
            </div>
          </div>
          
          {/* Next Milestone */}
          {progress.nextMilestone && (
            <div className="text-sm mt-2">
              <span className="text-muted-foreground">Next Milestone: </span>
              <span>{progress.nextMilestone}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button variant="default" className="w-[48%]" onClick={onTrainClick}>
          Train Now
        </Button>
        <Button 
          variant={canCheckIn ? "secondary" : "outline"} 
          className="w-[48%]" 
          onClick={onCheckInClick}
          disabled={!canCheckIn}
        >
          {canCheckIn ? 'Daily Check-In' : 'Already Checked In'}
        </Button>
      </CardFooter>
    </Card>
  );
}