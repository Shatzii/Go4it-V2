import React, { useEffect, useState } from 'react';
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

// CSS animation keyframes - add these to your global CSS or define here
const shineKeyframes = `
@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes sparkle {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}
`;

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
  // State for animation
  const [animate, setAnimate] = useState(false);
  
  // Add keyframes to document once
  useEffect(() => {
    if (!document.getElementById('skill-ranking-keyframes')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'skill-ranking-keyframes';
      styleElement.innerHTML = shineKeyframes;
      document.head.appendChild(styleElement);
      
      return () => {
        const element = document.getElementById('skill-ranking-keyframes');
        if (element) element.remove();
      };
    }
  }, []);
  
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

  // Define color stops for gradient based on level and progress
  const getColorGradient = () => {
    const levelBasedColor = (l: number) => {
      if (l <= 1) return { start: '#1e40af', mid: '#3b82f6', end: '#60a5fa' }; // Blues
      if (l === 2) return { start: '#3b82f6', mid: '#10b981', end: '#34d399' }; // Blue to Green
      if (l === 3) return { start: '#10b981', mid: '#84cc16', end: '#facc15' }; // Green to Yellow
      if (l === 4) return { start: '#84cc16', mid: '#facc15', end: '#f97316' }; // Yellow to Orange
      return { start: '#facc15', mid: '#f97316', end: '#ef4444' }; // Yellow to Orange to Red
    };
    
    const colors = levelBasedColor(level);
    
    // For mastered skills, create a gold/orange/red flame-like gradient
    if (isMastered) {
      return `linear-gradient(to right, 
        #fde047, 
        #fbbf24, 
        #f97316, 
        #ef4444
      )`;
    }
    
    // For active skills, create a dynamic gradient based on level
    return `linear-gradient(to right, 
      ${colors.start}, 
      ${colors.mid}, 
      ${colors.end}
    )`;
  };

  // Define shine effect based on skill level
  const getShineAnimation = () => {
    if (level < 3) return 'none'; // No animation for low levels
    
    // Basic shine for mid levels
    if (level === 3) return 'shine 2.5s infinite';
    
    // Quick shines for higher levels
    if (level === 4) return 'shine 2s infinite';
    
    // Fast shine for mastered skills
    return 'shine 1.5s infinite';
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
                textShadow: isMastered ? '0 0 5px rgba(234, 179, 8, 0.5)' : 'none'
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
              animation: getShineAnimation(),
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
};

export default SkillRankingVisualizer;