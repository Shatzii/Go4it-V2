import React, { useEffect, useState, memo } from 'react';
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

// We removed animation keyframes from here as they are now in the global CSS (index.css)

const SkillRankingVisualizer: React.FC<SkillRankingVisualizerProps> = memo(({
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
  // State for animation
  const [animate, setAnimate] = useState(false);
  
  // Trigger animation when props change
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [level, xp]);

  // Calculate the percentage for the current level progress
  const xpForNextLevel = (level + 1) * 100;
  const percentComplete = Math.min((xp / xpForNextLevel) * 100, 100);
  const isMastered = level >= maxLevel;
  
  // Calculate the overall mastery percentage (across all levels)
  const totalMasteryPercent = Math.min((level / maxLevel) * 100 + (percentComplete / maxLevel), 100);

  // Pre-calculated color maps for different levels to avoid recalculation
  const levelColorMap = [
    { start: '#1e40af', mid: '#3b82f6', end: '#60a5fa' }, // Level 0-1 (Blues)
    { start: '#3b82f6', mid: '#10b981', end: '#34d399' }, // Level 2 (Blue to Green)
    { start: '#10b981', mid: '#84cc16', end: '#facc15' }, // Level 3 (Green to Yellow)
    { start: '#84cc16', mid: '#facc15', end: '#f97316' }, // Level 4 (Yellow to Orange)
    { start: '#facc15', mid: '#f97316', end: '#ef4444' }  // Level 5+ (Yellow to Orange to Red)
  ];

  // Mastered gradient (pre-defined for performance)
  const masteredGradient = `linear-gradient(to right, 
    #fde047, 
    #fbbf24, 
    #f97316, 
    #ef4444
  )`;

  // Get color gradient efficiently
  const getColorGradient = () => {
    if (isMastered) return masteredGradient;
    
    const colorIndex = Math.min(Math.max(0, level), 4);
    const colors = levelColorMap[colorIndex];
    
    return `linear-gradient(to right, 
      ${colors.start}, 
      ${colors.mid}, 
      ${colors.end}
    )`;
  };

  // Animation durations based on level (memoized values)
  const shineAnimationDurations = ['none', 'none', 'none', 'shine 2.5s infinite', 'shine 2s infinite', 'shine 1.5s infinite'];
  
  // Size classes (static objects to prevent recreation)
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
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
                  ? 'text-yellow-500 fill-yellow-500 transition-all duration-300'
                  : i === level && percentComplete > 75
                  ? 'text-yellow-400 fill-yellow-400/50 transition-all duration-300'
                  : 'text-gray-500 transition-all duration-300',
                i < level && level >= 4 && 'animate-pulse',
                i === level - 1 && animate && 'animate-ping'
              )}
              style={{
                animationDuration: i < level && level >= 4 ? `${2 - (i * 0.2)}s` : undefined
              }}
            />
          ))}
        </div>
      )}

      {/* XP values and level */}
      {showXpValues && (
        <div className="flex justify-between text-xs">
          <span className={cn(
            "font-medium",
            animate && "text-primary transition-colors duration-500"
          )}>
            Level {level}
          </span>
          {!isMastered && (
            <span className={cn(
              animate && "text-primary transition-colors duration-500"
            )}>
              {xp} / {xpForNextLevel} XP
            </span>
          )}
          {isMastered && (
            <span className="text-yellow-500 font-semibold transition-all duration-300" 
              style={{ 
                textShadow: '0 0 5px rgba(234, 179, 8, 0.5)'
              }}>
              MASTERED
            </span>
          )}
        </div>
      )}

      {/* Progress bar with gradient */}
      <div className="relative w-full overflow-hidden">
        <Progress 
          value={percentComplete} 
          className={cn(
            sizeClasses[size],
            showGradient ? 'bg-gray-800/50' : '',
            'transition-all duration-300'
          )}
          // Apply gradient styles directly to the progress bar
          style={
            showGradient 
              ? {
                  backgroundImage: getColorGradient(),
                  boxShadow: level > 3 ? `0 0 10px ${isMastered ? 'rgba(234, 179, 8, 0.5)' : 'rgba(14, 165, 233, 0.5)'}` : 'none',
                  transition: 'all 0.3s ease',
                }
              : {}
          }
        />
        
        {/* Shine effect for higher level skills */}
        {level > 2 && showGradient && (
          <div 
            className="absolute top-0 h-full bg-white/25"
            style={{ 
              width: '50%',
              transform: 'skewX(-20deg)',
              animation: shineAnimationDurations[Math.min(level, 5)],
              left: '-100%'
            }}
          />
        )}
        
        {/* Pulsing glow effect for mastered skills */}
        {isMastered && showGradient && (
          <div 
            className="absolute inset-0 bg-yellow-500/20 rounded-full animate-pulse"
            style={{ 
              width: `${percentComplete}%`,
              animationDuration: '1.5s'
            }}
          />
        )}
        
        {/* Show percentage text if enabled */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className={cn(
                "text-xs font-semibold text-white drop-shadow-md",
                isMastered && "text-yellow-300"
              )}
              style={{
                textShadow: '0 0 2px rgba(0, 0, 0, 0.7)'
              }}
            >
              {Math.round(totalMasteryPercent)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

SkillRankingVisualizer.displayName = 'SkillRankingVisualizer';

export default SkillRankingVisualizer;