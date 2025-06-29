import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface SkillRankingVisualizerProps {
  level: number;
  xp: number;
  showStars?: boolean;
  showGradient?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MAX_LEVEL = 5;
const XP_PER_LEVEL = 100;

// This component visualizes a player's skill ranking with stars, progress bars, and dynamic color gradients
const SkillRankingVisualizer: React.FC<SkillRankingVisualizerProps> = ({
  level = 0,
  xp = 0,
  showStars = true,
  showGradient = true,
  showPercentage = false,
  size = 'md'
}) => {
  // Calculate progress percentage toward next level
  const progressPercentage = Math.min(100, (xp % XP_PER_LEVEL));
  
  // Generate a color gradient based on level
  const getColorGradient = () => {
    // Define color stops for different levels
    const colors = {
      1: ['#3b82f6', '#60a5fa'], // Blue
      2: ['#10b981', '#34d399'], // Green
      3: ['#f59e0b', '#fbbf24'], // Yellow/Gold
      4: ['#7c3aed', '#a78bfa'], // Purple
      5: ['#ef4444', '#f87171'], // Red/Orange
    };
    
    // Get colors for current level or default to level 1
    const [startColor, endColor] = colors[level as keyof typeof colors] || colors[1];
    
    return showGradient 
      ? `linear-gradient(to right, ${startColor}, ${endColor})`
      : startColor;
  };
  
  // Adjust star size based on component size
  const getStarSize = () => {
    switch (size) {
      case 'sm': return 'w-3 h-3';
      case 'lg': return 'w-6 h-6';
      default: return 'w-4 h-4';
    }
  };

  // Determine progress bar height based on component size
  const getProgressHeight = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };
  
  // Render stars based on level
  const renderStars = () => {
    if (!showStars) return null;
    
    return (
      <div className="flex gap-1 justify-center mb-1">
        {Array.from({ length: MAX_LEVEL }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.2 }}
          >
            <Star
              className={`${getStarSize()} ${
                i < level 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : i === level && progressPercentage > 75
                    ? 'text-yellow-500 fill-yellow-500/50'
                    : 'text-gray-500'
              } ${i < level && level >= 4 ? 'animate-pulse' : ''}`}
              style={{
                animationDuration: i < level && level >= 4 ? `${2 - (i * 0.2)}s` : undefined
              }}
            />
          </motion.div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {renderStars()}
      
      <div className="relative">
        <Progress 
          value={progressPercentage} 
          className={`${getProgressHeight()} ${showGradient ? 'bg-gray-700/50' : ''}`}
          indicatorClassName={showGradient ? 'bg-none' : ''}
          style={{ 
            background: showGradient ? 'rgba(31, 41, 55, 0.3)' : undefined,
          }}
          indicatorStyle={{ 
            background: getColorGradient()
          }}
        />
        
        {showPercentage && (
          <div className="absolute top-0 left-0 w-full flex justify-center text-xs text-gray-400 -mt-5">
            {progressPercentage}% to next level
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillRankingVisualizer;