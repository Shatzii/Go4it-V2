import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// 1. Micro-interactions and Animations Component
export const MicroInteractionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'success' | 'achievement';
}> = ({ children, onClick, variant = 'default' }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setShowParticles(true);
    setTimeout(() => setIsPressed(false), 150);
    setTimeout(() => setShowParticles(false), 1000);
    onClick?.();
  };

  return (
    <div className="relative">
      <motion.div
        animate={{
          scale: isPressed ? 0.95 : 1,
          rotateZ: isPressed ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button onClick={handleClick} variant={variant === 'default' ? 'default' : 'outline'}>
          {children}
        </Button>
      </motion.div>
      
      <AnimatePresence>
        {showParticles && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0.5,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 1.5,
                  x: (Math.random() - 0.5) * 60,
                  y: (Math.random() - 0.5) * 60
                }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="absolute top-1/2 left-1/2 w-1 h-1 bg-current rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 2. Adaptive Theming System
export const AdaptiveThemeProvider: React.FC<{
  children: React.ReactNode;
  neurodivergentProfile?: string;
  timeOfDay?: string;
}> = ({ children, neurodivergentProfile = 'focus_force', timeOfDay }) => {
  const [currentTheme, setCurrentTheme] = useState(neurodivergentProfile);

  const themeConfigs = {
    focus_force: {
      primary: 'from-purple-600 to-indigo-700',
      accent: 'bg-purple-600',
      contrast: 'high',
      font: 'font-sans'
    },
    pattern_pioneers: {
      primary: 'from-blue-600 to-cyan-700',
      accent: 'bg-blue-600',
      contrast: 'medium',
      font: 'font-mono'
    },
    sensory_squad: {
      primary: 'from-teal-600 to-emerald-700',
      accent: 'bg-teal-600',
      contrast: 'reduced',
      font: 'font-serif'
    },
    vision_voyagers: {
      primary: 'from-orange-600 to-amber-700',
      accent: 'bg-orange-600',
      contrast: 'high',
      font: 'font-sans tracking-wide'
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      document.documentElement.style.filter = 'sepia(10%) hue-rotate(15deg)';
    } else {
      document.documentElement.style.filter = 'none';
    }
  }, [timeOfDay]);

  const theme = themeConfigs[currentTheme] || themeConfigs.focus_force;

  return (
    <div className={`adaptive-theme ${theme.font} ${theme.contrast}-contrast`}>
      {children}
    </div>
  );
};

// 3. Gesture-Based Navigation
export const GestureNavigationWrapper: React.FC<{
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}> = ({ children, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }) => {
  const handleDragEnd = (event: any, info: any) => {
    const { offset } = info;
    const threshold = 50;

    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > threshold && onSwipeRight) onSwipeRight();
      if (offset.x < -threshold && onSwipeLeft) onSwipeLeft();
    } else {
      if (offset.y > threshold && onSwipeDown) onSwipeDown();
      if (offset.y < -threshold && onSwipeUp) onSwipeUp();
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
};

// 4. Immersive Storytelling Interface
export const StorytellingProgressCard: React.FC<{
  chapter: string;
  progress: number;
  character: string;
  nextObjective: string;
}> = ({ chapter, progress, character, nextObjective }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20" />
          <CardTitle className="relative z-10 flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
              <span className="text-lg font-bold">{character.charAt(0)}</span>
            </div>
            <div>
              <div className="text-lg">{chapter}</div>
              <div className="text-sm text-slate-400">with {character}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Chapter Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <Separator className="bg-slate-700" />
            
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-sm text-slate-300 mb-1">Next Quest:</div>
              <div className="text-sm font-medium">{nextObjective}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// 5. Gamification Layer
export const GamificationOverlay: React.FC<{
  level: number;
  xp: number;
  xpToNext: number;
  achievements: Array<{ id: string; name: string; icon: string; unlocked: boolean }>;
  streakDays: number;
}> = ({ level, xp, xpToNext, achievements, streakDays }) => {
  return (
    <div className="fixed top-4 left-4 z-40 space-y-2">
      <Card className="bg-black/20 backdrop-blur border-white/10">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold">Lv.{level}</div>
            <div className="flex-1">
              <div className="text-xs text-gray-300 mb-1">
                {xp} / {xp + xpToNext} XP
              </div>
              <Progress 
                value={(xp / (xp + xpToNext)) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 backdrop-blur border-white/10">
        <CardContent className="p-3 flex items-center">
          <i className="ri-fire-line text-orange-500 mr-2"></i>
          <span className="text-sm">{streakDays} day streak</span>
        </CardContent>
      </Card>

      <div className="space-y-1">
        {achievements.filter(a => a.unlocked).slice(-3).map(achievement => (
          <motion.div
            key={achievement.id}
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur rounded-lg p-2 border border-yellow-500/30"
          >
            <div className="flex items-center text-sm">
              <span className="mr-2">{achievement.icon}</span>
              <span>{achievement.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 6. Feedback Visualization System
export const FeedbackVisualization: React.FC<{
  progressData: Array<{ date: string; value: number; subject: string }>;
  emotionalState: 'positive' | 'neutral' | 'frustrated' | 'excited';
  performanceHeatmap: Array<{ day: string; hour: number; performance: number }>;
}> = ({ progressData, emotionalState, performanceHeatmap }) => {
  const emotionalColors = {
    positive: 'from-green-400 to-emerald-500',
    neutral: 'from-gray-400 to-slate-500',
    frustrated: 'from-red-400 to-orange-500',
    excited: 'from-purple-400 to-pink-500'
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 backdrop-blur border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${emotionalColors[emotionalState]} mr-2`} />
            Learning Pulse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-600"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className={`text-gradient-to-r ${emotionalColors[emotionalState]}`}
                strokeDasharray={`${2 * Math.PI * 56}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - 0.75) }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">75%</div>
                <div className="text-xs text-gray-400">Today</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 backdrop-blur border-white/10">
        <CardHeader>
          <CardTitle>Learning Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {performanceHeatmap.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`w-8 h-8 rounded text-xs flex items-center justify-center text-white font-medium ${
                  item.performance > 0.8 ? 'bg-green-500' :
                  item.performance > 0.6 ? 'bg-yellow-500' :
                  item.performance > 0.4 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                title={`${item.day} ${item.hour}:00 - ${Math.round(item.performance * 100)}%`}
              >
                {Math.round(item.performance * 100)}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export {
  MicroInteractionButton,
  AdaptiveThemeProvider,
  GestureNavigationWrapper,
  StorytellingProgressCard,
  GamificationOverlay,
  FeedbackVisualization
};