import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillRankingVisualizerProps {
  level: number;
  xp: number;
  maxLevel?: number;
  className?: string;
  showStars?: boolean;
  showGradient?: boolean;
  showPercentage?: boolean;
  showXpValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SkillRankingVisualizer: React.FC<SkillRankingVisualizerProps> = ({
  level,
  xp,
  maxLevel = 5,
  className = '',
  showStars = true,
  showGradient = true,
  showPercentage = false,
  showXpValues = true,
  size = 'md',
}) => {
  // Calculate the percentage for the current level progress
  const xpForNextLevel = (level + 1) * 100;
  const percentComplete = Math.min((xp / xpForNextLevel) * 100, 100);
  const isMastered = level >= maxLevel;
  
  // Calculate the overall mastery percentage (across all levels)
  const totalMasteryPercent = Math.min((level / maxLevel) * 100 + (percentComplete / maxLevel), 100);

  // Define gradient colors based on skill level and progress
  const getColorGradient = () => {
    // Base gradient for low level skills (cool blue to teal)
    if (level < 2) {
      return 'from-blue-600 via-blue-500 to-teal-400';
    }
    // Mid-level skills (teal to green to yellow)
    else if (level < 4) {
      return 'from-teal-500 via-green-400 to-yellow-400';
    }
    // High-level skills (yellow to orange to red)
    else {
      return 'from-yellow-400 via-orange-500 to-red-500';
    }
  };

  // Define shine effect based on skill level
  const getShineEffect = () => {
    if (level < 2) return '';
    if (level < 4) return 'animate-pulse';
    return 'animate-pulse';
  };
  
  // Define size classes
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  // Star size based on component size
  const starSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {/* Show stars if enabled */}
      {showStars && (
        <div className="flex gap-1 justify-center">
          {Array.from({ length: maxLevel }).map((_, i) => (
            <Star
              key={`star-${i}`}
              className={cn(
                starSize[size],
                i < level 
                  ? 'text-yellow-500 fill-yellow-500'
                  : i === level && percentComplete > 75
                  ? 'text-yellow-400 fill-yellow-400/50'
                  : 'text-gray-500'
              )}
            />
          ))}
        </div>
      )}

      {/* XP values and level */}
      {showXpValues && (
        <div className="flex justify-between text-xs">
          <span className="font-medium">Level {level}</span>
          {!isMastered && <span>{xp} / {xpForNextLevel} XP</span>}
          {isMastered && <span className="text-yellow-500 font-semibold">MASTERED</span>}
        </div>
      )}

      {/* Progress bar with gradient */}
      <div className="relative w-full">
        <Progress 
          value={percentComplete} 
          className={cn(
            sizeClasses[size],
            showGradient ? 'bg-gray-800/50' : ''
          )}
          // Apply gradient styles directly to the progress bar
          style={
            showGradient 
              ? {
                  backgroundImage: isMastered 
                    ? 'linear-gradient(to right, #eab308, #f97316, #ef4444)' 
                    : `linear-gradient(to right, ${level > 0 ? '#3b82f6' : '#1e3a8a'}, ${level > 2 ? '#10b981' : '#60a5fa'}, ${level > 4 ? '#f97316' : '#34d399'})`,
                }
              : {}
          }
        />
        
        {/* Shine effect for high level skills */}
        {level > 3 && showGradient && (
          <div 
            className={`absolute top-0 left-0 h-full bg-white/20 ${getShineEffect()}`} 
            style={{ 
              width: `${percentComplete}%`,
              clipPath: 'polygon(0 0, 10% 0, 30% 100%, 0% 100%)',
              animation: 'shine 2s infinite'
            }}
          />
        )}
        
        {/* Show percentage text if enabled */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-white drop-shadow-md">
              {Math.round(totalMasteryPercent)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillRankingVisualizer;