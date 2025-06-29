import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap, ChevronRight, ChevronLeft, Award, Timer, Activity } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AdvancedAnimationPlayer from '@/components/ui/video/AdvancedAnimationPlayer';
import { SprintAnimation, VerticalAnimation, AgilityAnimation, StrengthAnimation } from './AnimationComponents';

// Interface like modern sports video games
const GameStyleGarCommercial = () => {
  const [activeScene, setActiveScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Auto-advance scenes
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setTimeout(() => {
      setActiveScene((prev) => (prev + 1) % scenes.length);
    }, 7000);
    
    return () => clearTimeout(timer);
  }, [activeScene, isPlaying]);
  
  // Color schemes for different tests
  const colors = {
    speed: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#60a5fa'
    },
    power: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399'
    },
    agility: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa'
    },
    strength: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#f87171'
    }
  };
  
  // Different test scenes
  const scenes = [
    {
      id: 'sprint',
      name: '40-Yard Dash',
      type: 'speed',
      metrics: {
        result: '4.42s',
        score: 92,
        rank: 'Elite'
      },
      strengths: ['Acceleration', 'Top End Speed'],
      tips: 'Focus on drive phase mechanics for first 10 yards'
    },
    {
      id: 'vertical',
      name: 'Vertical Jump',
      type: 'power',
      metrics: {
        result: '38.5"',
        score: 94,
        rank: 'Elite'
      },
      strengths: ['Explosiveness', 'Power Generation'],
      tips: 'Add plyometric training to improve stretch-shortening cycle'
    },
    {
      id: 'agility',
      name: '3-Cone Drill',
      type: 'agility',
      metrics: {
        result: '6.78s',
        score: 95,
        rank: 'Elite'
      },
      strengths: ['Change of Direction', 'Body Control'],
      tips: 'Enhance hand-eye coordination for multi-task situations'
    },
    {
      id: 'strength',
      name: 'Bench Press',
      type: 'strength',
      metrics: {
        result: '22 reps',
        score: 91,
        rank: 'Elite'
      },
      strengths: ['Upper Body Power', 'Core Stability'],
      tips: 'Add eccentric training to improve strength capacity'
    }
  ];
  
  const currentScene = scenes[activeScene];
  const currentColors = colors[currentScene.type as keyof typeof colors];
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Container - Game Console Style */}
      <div className="relative rounded-lg overflow-hidden border border-gray-800 bg-black">
        {/* Scene selection navigation */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              onClick={() => {
                setActiveScene(index);
                setIsPlaying(false);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                index === activeScene 
                  ? `bg-${colors[scene.type as keyof typeof colors].primary} text-white shadow-lg` 
                  : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700/80'
              }`}
              style={index === activeScene ? { 
                backgroundColor: colors[scene.type as keyof typeof colors].primary,
                boxShadow: `0 0 10px ${colors[scene.type as keyof typeof colors].primary}80` 
              } : {}}
            >
              {index + 1}
            </button>
          ))}
          <Button 
            size="icon" 
            variant="ghost" 
            className="w-8 h-8 rounded-full bg-gray-800/80 text-white"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
            ) : (
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent" />
            )}
          </Button>
        </div>
        
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1"
          >
            {/* Video Game Style Animation Area */}
            <div 
              className="relative h-[400px] overflow-hidden"
              style={{
                background: `linear-gradient(to bottom, #0f172a, #111827)`
              }}
            >
              {/* Advanced 128-bit Animation Player */}
              <AdvancedAnimationPlayer
                videoSources={{
                  sprint: '/videos/40_yard_dash.mp4',
                  vertical: '/videos/vertical_jump.mp4',
                  agility: '/videos/agility_drill.mp4',
                  strength: '/videos/bench_press.mp4'
                }}
                svgAnimations={{
                  sprint: SprintAnimation,
                  vertical: VerticalAnimation,
                  agility: AgilityAnimation,
                  strength: StrengthAnimation
                }}
                animationType={currentScene.id}
                colors={currentColors}
                metricData={{
                  label: currentScene.name,
                  value: currentScene.metrics.result,
                  unit: ''
                }}
                className="w-full h-full"
              />
              
              {/* Heads-up display */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
                <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-4 h-4 text-${currentScene.type}`} style={{ color: currentColors.primary }} />
                    <span className="text-white font-bold">{currentScene.name}</span>
                  </div>
                </div>
                
                <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-white" />
                    <span className="text-white">GAR Testing</span>
                  </div>
                </div>
              </div>
              
              {/* Metric Panel (game style) */}
              <div 
                className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md rounded-lg border overflow-hidden"
                style={{ borderColor: currentColors.primary }}
              >
                <div 
                  className="px-3 py-1 text-center text-white text-sm font-bold"
                  style={{ backgroundColor: currentColors.primary }}
                >
                  PERFORMANCE METRICS
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-300 text-xs">RESULT:</span>
                    <motion.span 
                      key={`result-${currentScene.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-white font-mono font-bold"
                    >
                      {currentScene.metrics.result}
                    </motion.span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-300 text-xs">GAR SCORE:</span>
                    <motion.div 
                      key={`score-${currentScene.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="flex items-center gap-1"
                    >
                      <span 
                        className="text-white font-mono font-bold"
                        style={{ color: currentColors.accent }}
                      >
                        {currentScene.metrics.score}
                      </span>
                      <span className="text-gray-300">/100</span>
                    </motion.div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-300 text-xs">RANK:</span>
                    <motion.div 
                      key={`rank-${currentScene.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span 
                        className="text-white font-bold"
                        style={{ color: currentColors.accent }}
                      >
                        {currentScene.metrics.rank}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Coach Tip */}
              <motion.div
                className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md rounded-lg border border-gray-700 p-3 max-w-[260px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: currentColors.primary }}
                  >
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white text-sm font-bold">COACH TIP</span>
                </div>
                <motion.p 
                  key={`tip-${currentScene.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-300 text-xs"
                >
                  {currentScene.tips}
                </motion.p>
              </motion.div>
              
              {/* Navigation arrows */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white"
                  onClick={() => {
                    setActiveScene((prev) => (prev - 1 + scenes.length) % scenes.length);
                    setIsPlaying(false);
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white"
                  onClick={() => {
                    setActiveScene((prev) => (prev + 1) % scenes.length);
                    setIsPlaying(false);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Game Console Style UI Footer - ADHD Optimized Simplified UI */}
            <div className="bg-gradient-to-r from-gray-900 to-black p-4 flex justify-between items-center border-t border-gray-800">
              {/* Left side - Strengths */}
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">STRENGTHS</span>
                  <motion.div 
                    key={`strengths-${currentScene.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    {currentScene.strengths.map((strength, index) => (
                      <span 
                        key={index} 
                        className="text-sm font-medium"
                        style={{ color: currentColors.accent }}
                      >
                        {strength}
                        {index < currentScene.strengths.length - 1 && ", "}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
              
              {/* GAR Score Badge - console style */}
              <motion.div
                className="flex flex-col items-center"
                animate={{ 
                  scale: [1, 1.05, 1],
                  y: [0, -2, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs text-gray-400">OVERALL GAR</span>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2 relative"
                  style={{ 
                    borderColor: currentColors.primary,
                    boxShadow: `0 0 10px ${currentColors.primary}60`
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{ backgroundColor: currentColors.primary }}
                    animate={{ 
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-lg font-bold text-white">84</span>
                </div>
              </motion.div>
              
              {/* Right side - Test sequence indicator */}
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">TEST</span>
                  <span className="text-white text-sm">{activeScene + 1} of {scenes.length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameStyleGarCommercial;