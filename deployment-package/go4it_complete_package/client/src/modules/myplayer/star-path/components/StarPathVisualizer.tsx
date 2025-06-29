import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Milestone {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  xpReward: number;
  level: number;
}

interface StarPathVisualizerProps {
  currentLevel: number;
  maxLevel: number;
  milestones: Milestone[];
  sportType: string;
  className?: string;
}

/**
 * StarPathVisualizer component
 * 
 * Visualizes the Star Path progression with milestones
 * This is a modular component that can be dropped into the CMS
 */
export const StarPathVisualizer: React.FC<StarPathVisualizerProps> = ({
  currentLevel,
  maxLevel,
  milestones,
  sportType,
  className = '',
}) => {
  // Get level name based on level number
  const getLevelName = (level: number): string => {
    const levelNames = [
      'Rising Prospect',
      'Emerging Talent',
      'Standout Performer',
      'Elite Prospect',
      'Five-Star Athlete'
    ];
    
    return level > 0 && level <= levelNames.length ? levelNames[level - 1] : 'Unknown Level';
  };
  
  // Group milestones by level
  const milestonesByLevel = milestones.reduce((acc, milestone) => {
    const level = milestone.level;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(milestone);
    return acc;
  }, {} as Record<number, Milestone[]>);

  // Create an array of level numbers from 1 to maxLevel
  const levelNumbers = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <Card className={cn("w-full shadow-md", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{sportType} Star Path</CardTitle>
        <CardDescription>Your journey to becoming a Five-Star Athlete</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-10">
          {/* Path visualization */}
          <div className="relative flex justify-between items-center px-4">
            {/* Progress line */}
            <div className="absolute left-0 right-0 h-1 bg-muted">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(currentLevel / maxLevel) * 100}%` }}
              />
            </div>
            
            {/* Level markers */}
            {levelNumbers.map(level => {
              const isCompleted = currentLevel >= level;
              const isCurrent = currentLevel === level;
              
              return (
                <div 
                  key={level}
                  className={cn(
                    "relative flex flex-col items-center",
                    isCompleted ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {/* Star icon */}
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center z-10 mb-2",
                      isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
                    )}
                  >
                    {isCompleted ? "★" : "☆"}
                  </div>
                  
                  {/* Level name */}
                  <div className="text-xs font-medium">{getLevelName(level)}</div>
                  
                  {/* Level number */}
                  <div className="text-xs">{level}</div>
                </div>
              );
            })}
          </div>
          
          {/* Milestone sections by level */}
          <div className="space-y-8 mt-8">
            {levelNumbers.map(level => {
              const levelMilestones = milestonesByLevel[level] || [];
              const isActiveLevel = currentLevel >= level;
              
              return (
                <div 
                  key={level}
                  className={cn(
                    "space-y-3",
                    !isActiveLevel && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">
                      Level {level}: {getLevelName(level)}
                    </h3>
                    {level === currentLevel && (
                      <Badge variant="outline" className="text-primary border-primary">
                        Current Level
                      </Badge>
                    )}
                  </div>
                  
                  {/* Milestones */}
                  <div className="grid gap-3">
                    {levelMilestones.map(milestone => (
                      <div 
                        key={milestone.id}
                        className={cn(
                          "p-3 rounded-lg border",
                          milestone.isCompleted ? "bg-primary/10 border-primary/30" : "bg-muted border-muted-foreground/20"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{milestone.title}</div>
                            <div className="text-sm text-muted-foreground">{milestone.description}</div>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <Badge variant={milestone.isCompleted ? "default" : "outline"}>
                              {milestone.isCompleted ? "Completed" : "Incomplete"}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              +{milestone.xpReward} XP
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {levelMilestones.length === 0 && (
                      <div className="text-center text-muted-foreground text-sm py-2">
                        No milestones for this level
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};