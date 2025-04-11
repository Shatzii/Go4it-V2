import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap, ChevronRight, ChevronLeft, Award, Timer, Activity } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AdvancedAnimationPlayer from '@/components/ui/video/AdvancedAnimationPlayer';

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

// Sprint animation - Madden/2K style
const SprintAnimation = ({ colors, isPlaying }: { colors: any, isPlaying: boolean }) => {
  return (
    <div className="relative w-full h-full">
      {/* Track */}
      <div className="absolute inset-x-10 top-1/4 bottom-1/4 border border-white/20 rounded-lg overflow-hidden">
        <div className="absolute top-0 bottom-0 left-[25%] w-px h-full bg-white/20"></div>
        <div className="absolute top-0 bottom-0 left-[50%] w-px h-full bg-white/20"></div>
        <div className="absolute top-0 bottom-0 left-[75%] w-px h-full bg-white/20"></div>
        
        {/* Lane marks */}
        <div className="absolute top-1/3 w-full h-px bg-white/20"></div>
        <div className="absolute top-2/3 w-full h-px bg-white/20"></div>
        
        {/* Distance markers */}
        <div className="absolute top-0 left-[25%] text-xs text-white/40 -translate-x-1/2 -translate-y-1/2">10y</div>
        <div className="absolute top-0 left-[50%] text-xs text-white/40 -translate-x-1/2 -translate-y-1/2">20y</div>
        <div className="absolute top-0 left-[75%] text-xs text-white/40 -translate-x-1/2 -translate-y-1/2">30y</div>
        <div className="absolute top-0 right-0 text-xs text-white/40 -translate-x-1/2 -translate-y-1/2">40y</div>
        
        {/* Finish line */}
        <motion.div 
          className="absolute right-0 top-0 bottom-0 w-1"
          style={{ 
            background: `linear-gradient(to right, transparent, ${colors.primary})` 
          }}
          animate={isPlaying ? { 
            opacity: [0.2, 0.8, 0.2] 
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      {/* Player character - 2K style running animation */}
      <motion.div
        className="absolute left-[10%] top-[45%] w-[60px] h-[100px]" 
        animate={isPlaying ? { 
          x: [0, 300, 300], 
          y: [0, 0, 0],
        } : {}}
        transition={{ 
          duration: 3, 
          times: [0, 0.8, 1],
          repeat: isPlaying ? Infinity : 0,
          repeatDelay: 1
        }}
      >
        {/* Draw the athlete - Madden-style detailed player */}
        <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
          <motion.g
            animate={isPlaying ? {
              rotate: [-3, 3, -3, 3],
              y: [0, -2, 0, -2]
            } : {}}
            transition={{ 
              duration: 0.4,
              repeat: Infinity
            }}
            style={{ transformOrigin: 'center center' }}
          >
            {/* Body Base - More realistic proportions */}
            <g>
              {/* Base Shadow for depth */}
              <ellipse cx="40" cy="110" rx="12" ry="4" opacity="0.3" fill="#000000" />
              
              {/* Shoes/Cleats */}
              <path d="M28 102 L24 106 L26 110 L34 110 L36 107 L32 102 Z" fill="#111111" />
              <path d="M52 102 L56 106 L54 110 L46 110 L44 107 L48 102 Z" fill="#111111" />
              <path d="M28 102 L24 106 L26 110 L34 110 L36 107 L32 102 Z" stroke="#333333" strokeWidth="0.5" />
              <path d="M52 102 L56 106 L54 110 L46 110 L44 107 L48 102 Z" stroke="#333333" strokeWidth="0.5" />
              
              {/* Athletic Socks */}
              <rect x="30" y="96" width="6" height="6" rx="1" fill="white" />
              <rect x="44" y="96" width="6" height="6" rx="1" fill="white" />
              
              {/* Lower Legs with Muscle Definition */}
              <path d="M29 75 C27 82, 27 90, 30 96 L36 96 C38 90, 37 82, 35 75 Z" fill="#6b4f35" />
              <path d="M51 75 C53 82, 53 90, 50 96 L44 96 C42 90, 43 82, 45 75 Z" fill="#6b4f35" />
              
              {/* Knee Detail */}
              <ellipse cx="32" cy="75" rx="3" ry="2" fill="#6b4f35" stroke="#5a4128" strokeWidth="0.5" />
              <ellipse cx="48" cy="75" rx="3" ry="2" fill="#6b4f35" stroke="#5a4128" strokeWidth="0.5" />
              
              {/* Thighs with Muscle Definition - Shorts */}
              <path d="M34 55 C26 55, 26 65, 29 75 L36 75 C36 65, 37 55, 36 55 Z" fill="#1e293b" />
              <path d="M46 55 C54 55, 54 65, 51 75 L44 75 C44 65, 43 55, 44 55 Z" fill="#1e293b" />
              
              {/* Belt/Waistband */}
              <path d="M32 55 C32 53, 48 53, 48 55 C48 57, 32 57, 32 55 Z" fill="#333333" />
              
              {/* Jersey - More detailed with folds */}
              <path d="M32 35 C30 38, 28 44, 28 55 L52 55 C52 44, 50 38, 48 35 L44 28 L36 28 L32 35 Z" fill={colors.primary} />
              <path d="M36 28 L36 55 M44 28 L44 55" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <path d="M32 35 C30 38, 28 44, 28 55 L52 55 C52 44, 50 38, 48 35 L44 28 L36 28 L32 35 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
              
              {/* Shoulders with padding */}
              <ellipse cx="32" cy="30" rx="5" ry="4" fill={colors.primary} />
              <ellipse cx="48" cy="30" rx="5" ry="4" fill={colors.primary} />
              
              {/* Neck */}
              <path d="M36 23 C36 28, 44 28, 44 23" fill="#6b4f35" />
              
              {/* Head - Helmet Style */}
              <ellipse cx="40" cy="16" rx="8" ry="10" fill="#6b4f35" />
              <path d="M32 16 C32 8, 48 8, 48 16 C48 24, 32 24, 32 16 Z" fill={colors.primary} />
              <path d="M32 16 C32 10, 48 10, 48 16" fill={colors.secondary} />
              
              {/* Helmet Details */}
              <path d="M36 10 L44 10 L44 14 L36 14 Z" fill="#111111" />
              <path d="M38 14 L42 14 L42 16 L38 16 Z" fill="#333333" />
              <rect x="35" y="7" width="10" height="1" fill="white" />
              <path d="M35 8 L35 10 M45 8 L45 10" stroke="white" strokeWidth="0.5" />
              
              {/* Facemask */}
              <path d="M34 14 L34 20 M37 14 L37 21 M40 14 L40 21 M43 14 L43 21 M46 14 L46 20" stroke="#555555" strokeWidth="1.5" />
              <path d="M34 18 L46 18" stroke="#555555" strokeWidth="1.5" />
            </g>
            
            {/* Arms With Muscle Definition */}
            <motion.g
              animate={isPlaying ? {
                rotate: [-40, 30, -40, 30]
              } : {}}
              transition={{ 
                duration: 0.3,
                repeat: Infinity
              }}
              style={{ transformOrigin: '32px 30px' }}
            >
              <path d="M32 30 C25 31, 18 36, 15 42" stroke="#6b4f35" strokeWidth="6" strokeLinecap="round" />
              <path d="M32 30 C25 31, 18 36, 15 42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="15" cy="42" rx="3" ry="2.5" fill="#6b4f35" />
              <ellipse cx="15" cy="42" rx="3" ry="2.5" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [40, -30, 40, -30]
              } : {}}
              transition={{ 
                duration: 0.3,
                repeat: Infinity
              }}
              style={{ transformOrigin: '48px 30px' }}
            >
              <path d="M48 30 C55 31, 62 36, 65 42" stroke="#6b4f35" strokeWidth="6" strokeLinecap="round" />
              <path d="M48 30 C55 31, 62 36, 65 42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="65" cy="42" rx="3" ry="2.5" fill="#6b4f35" />
              <ellipse cx="65" cy="42" rx="3" ry="2.5" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            </motion.g>
            
            {/* Leg Movement - More Natural Joint Bending */}
            <motion.g
              animate={isPlaying ? {
                rotate: [15, -15, 15, -15]
              } : {}}
              transition={{ 
                duration: 0.3,
                repeat: Infinity
              }}
              style={{ transformOrigin: '34px 55px' }}
            >
              <path d="M34 55 C26 55, 26 65, 29 75 L36 75 C36 65, 37 55, 36 55 Z" fill="#1e293b" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
              <path d="M29 75 C27 82, 27 90, 30 96 L36 96 C38 90, 37 82, 35 75 Z" fill="#6b4f35" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
              <rect x="30" y="96" width="6" height="6" rx="1" fill="white" />
              <path d="M28 102 L24 106 L26 110 L34 110 L36 107 L32 102 Z" fill="#111111" stroke="#333333" strokeWidth="0.5" />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [-15, 15, -15, 15]
              } : {}}
              transition={{ 
                duration: 0.3,
                repeat: Infinity
              }}
              style={{ transformOrigin: '46px 55px' }}
            >
              <path d="M46 55 C54 55, 54 65, 51 75 L44 75 C44 65, 43 55, 44 55 Z" fill="#1e293b" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
              <path d="M51 75 C53 82, 53 90, 50 96 L44 96 C42 90, 43 82, 45 75 Z" fill="#6b4f35" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
              <rect x="44" y="96" width="6" height="6" rx="1" fill="white" />
              <path d="M52 102 L56 106 L54 110 L46 110 L44 107 L48 102 Z" fill="#111111" stroke="#333333" strokeWidth="0.5" />
            </motion.g>
          </motion.g>
          
          {/* Jersey Number */}
          <text x="40" y="42" textAnchor="middle" className="text-lg font-bold" fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5">17</text>
        </svg>
        
        {/* Speed lines */}
        <motion.div
          className="absolute -left-5 top-1/2 -translate-y-1/2 w-20 h-1"
          style={{ 
            background: `linear-gradient(to right, ${colors.accent}, transparent)`,
          }}
          animate={isPlaying ? {
            opacity: [0, 0.8, 0],
            x: [-10, 0]
          } : { opacity: 0 }}
          transition={{
            duration: 0.3,
            repeat: Infinity
          }}
        />
        
        {/* Speed particles */}
        {isPlaying && Array(5).fill(0).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            initial={{ 
              x: -10 - Math.random() * 20,
              y: Math.random() * 80 - 40,
              opacity: 0
            }}
            animate={{ 
              x: -30 - Math.random() * 30,
              y: Math.random() * 80 - 40,
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              delay: Math.random() * 0.5
            }}
          />
        ))}
      </motion.div>
      
      {/* Result overlay - appears at the end of the run */}
      <motion.div
        className="absolute left-[75%] top-[30%]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isPlaying ? {
          opacity: [0, 0, 1],
          scale: [0.8, 0.8, 1]
        } : { opacity: 0 }}
        transition={{
          duration: 3,
          times: [0, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <div 
          className="px-4 py-2 rounded-md text-lg font-bold"
          style={{ 
            backgroundColor: colors.primary,
            color: 'white',
            boxShadow: `0 0 10px ${colors.primary}` 
          }}
        >
          4.42s
        </div>
      </motion.div>
      
      {/* Timer animation */}
      <motion.div
        className="absolute right-14 top-10 flex items-center text-white font-mono text-lg"
        animate={isPlaying ? {} : {}}
      >
        <motion.span
          animate={isPlaying ? {
            opacity: 1,
            color: ['#ffffff', colors.accent, '#ffffff']
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          {isPlaying ? (
            <motion.span
              animate={{
                opacity: [1, 1]
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                repeatDelay: 1.6
              }}
            >
              {isPlaying ? "4.42s" : "0.00s"}
            </motion.span>
          ) : (
            '0.00s'
          )}
        </motion.span>
      </motion.div>
    </div>
  );
};

// Vertical Jump Animation - NBA 2K style
const VerticalAnimation = ({ colors, isPlaying }: { colors: any, isPlaying: boolean }) => {
  return (
    <div className="relative w-full h-full">
      {/* Measurement backdrop */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[15%] bottom-[20%] w-1 bg-gray-800"></div>
      
      {/* Height markers */}
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className="absolute left-[48%] flex items-center"
          style={{ top: `${25 + i * 10}%` }}
        >
          <div className="w-6 h-0.5 bg-gray-700"></div>
          <span className="text-xs text-gray-500 ml-2">{(6 - i) * 6}"</span>
        </div>
      ))}
      
      {/* Player character - 2K style jump animation */}
      <motion.div
        className="absolute left-[45%] bottom-[25%] w-[70px] h-[120px]"
        animate={isPlaying ? {
          y: [0, -150, 0]
        } : {}}
        transition={{
          duration: 1.5,
          times: [0, 0.5, 1],
          repeat: isPlaying ? Infinity : 0,
          repeatDelay: 1.5,
          type: "spring",
          stiffness: 300
        }}
      >
        {/* Draw the athlete - Basketball player style */}
        <svg width="80" height="140" viewBox="0 0 80 140" fill="none">
          <motion.g
            animate={isPlaying ? {
              scaleY: [1, 0.9, 1.1, 1],
              y: [0, 10, -20, 0]
            } : {}}
            transition={{
              duration: 1.5,
              times: [0, 0.3, 0.6, 1],
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 1.5
            }}
          >
            {/* Base Shadow for depth */}
            <ellipse cx="40" cy="130" rx="12" ry="4" opacity="0.3" fill="#000000" />
            
            {/* Basketball Shoes */}
            <path d="M28 112 L25 118 L30 120 L36 119 L38 114 L34 112 Z" fill="#EC4D28" />
            <path d="M28 112 L25 118 L30 120 L36 119 L38 114 L34 112 Z" stroke="#000" strokeWidth="0.5" />
            <path d="M38 114 L40 115 L36 119" stroke="#EC4D28" strokeWidth="2" />
            
            <path d="M52 112 L55 118 L50 120 L44 119 L42 114 L46 112 Z" fill="#EC4D28" />
            <path d="M52 112 L55 118 L50 120 L44 119 L42 114 L46 112 Z" stroke="#000" strokeWidth="0.5" />
            <path d="M42 114 L40 115 L44 119" stroke="#EC4D28" strokeWidth="2" />
            
            {/* Athletic Socks */}
            <rect x="30" y="105" width="6" height="7" rx="1" fill="white" stroke="#DDD" strokeWidth="0.5" />
            <rect x="44" y="105" width="6" height="7" rx="1" fill="white" stroke="#DDD" strokeWidth="0.5" />
            
            {/* Basketball Shorts - Detailed */}
            <path d="M30 60 C20 65, 24 85, 28 105 L33 105 C37 90, 37 70, 35 60 Z" fill="#1e293b" />
            <path d="M30 60 C20 65, 24 85, 28 105 L33 105 C37 90, 37 70, 35 60 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            <path d="M50 60 C60 65, 56 85, 52 105 L47 105 C43 90, 43 70, 45 60 Z" fill="#1e293b" />
            <path d="M50 60 C60 65, 56 85, 52 105 L47 105 C43 90, 43 70, 45 60 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            
            {/* Basketball Jersey Trim */}
            <path d="M30 40 L30 60 L50 60 L50 40 Z" fill={colors.primary} />
            <path d="M30 40 L30 60 L50 60 L50 40 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            <path d="M28 45 L30 40 L30 60 M52 45 L50 40 L50 60" stroke="white" strokeWidth="1" />
            
            {/* Muscular Arms */}
            <motion.g
              animate={isPlaying ? {
                rotate: [-45, -180, -45],
                y: [0, -15, 0]
              } : {}}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1.5
              }}
              style={{ transformOrigin: '30px 42px' }}
            >
              <path d="M30 42 C20 42, 15 48, 10 52" stroke="#6b4f35" strokeWidth="6" strokeLinecap="round" />
              <path d="M30 42 C20 42, 15 48, 10 52" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="10" cy="52" rx="3" ry="2.5" fill="#6b4f35" />
              <ellipse cx="10" cy="52" rx="3" ry="2.5" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [45, 180, 45],
                y: [0, -15, 0]
              } : {}}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1.5
              }}
              style={{ transformOrigin: '50px 42px' }}
            >
              <path d="M50 42 C60 42, 65 48, 70 52" stroke="#6b4f35" strokeWidth="6" strokeLinecap="round" />
              <path d="M50 42 C60 42, 65 48, 70 52" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="70" cy="52" rx="3" ry="2.5" fill="#6b4f35" />
              <ellipse cx="70" cy="52" rx="3" ry="2.5" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            </motion.g>
            
            {/* Leg Muscle Definition */}
            <motion.g
              animate={isPlaying ? {
                rotate: [-30, 0, -30],
                scaleY: [1, 0.7, 1]
              } : {}}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1.5
              }}
              style={{ transformOrigin: '33px 60px' }}
            >
              {/* Left Leg with Muscles */}
              <path d="M30 60 C20 65, 24 85, 28 105 L33 105 C37 90, 37 70, 35 60 Z" fill="#1e293b" />
              <path d="M30 60 C20 65, 24 85, 28 105 L33 105 C37 90, 37 70, 35 60 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
              <rect x="30" y="105" width="6" height="7" rx="1" fill="white" stroke="#DDD" strokeWidth="0.5" />
              <path d="M28 112 L25 118 L30 120 L36 119 L38 114 L34 112 Z" fill="#EC4D28" />
              <path d="M28 112 L25 118 L30 120 L36 119 L38 114 L34 112 Z" stroke="#000" strokeWidth="0.5" />
              <path d="M38 114 L40 115 L36 119" stroke="#EC4D28" strokeWidth="2" />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [30, 0, 30],
                scaleY: [1, 0.7, 1]
              } : {}}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1.5
              }}
              style={{ transformOrigin: '47px 60px' }}
            >
              {/* Right Leg with Muscles */}
              <path d="M50 60 C60 65, 56 85, 52 105 L47 105 C43 90, 43 70, 45 60 Z" fill="#1e293b" />
              <path d="M50 60 C60 65, 56 85, 52 105 L47 105 C43 90, 43 70, 45 60 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
              <rect x="44" y="105" width="6" height="7" rx="1" fill="white" stroke="#DDD" strokeWidth="0.5" />
              <path d="M52 112 L55 118 L50 120 L44 119 L42 114 L46 112 Z" fill="#EC4D28" />
              <path d="M52 112 L55 118 L50 120 L44 119 L42 114 L46 112 Z" stroke="#000" strokeWidth="0.5" />
              <path d="M42 114 L40 115 L44 119" stroke="#EC4D28" strokeWidth="2" />
            </motion.g>
            
            {/* Torso - Athletic Build */}
            <path d="M32 26 C28 30, 26 35, 30 40 L30 60 L50 60 L50 40 C54 35, 52 30, 48 26 Z" fill={colors.primary} />
            <path d="M32 26 C28 30, 26 35, 30 40 L30 60 L50 60 L50 40 C54 35, 52 30, 48 26 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            
            {/* Shoulders */}
            <ellipse cx="32" cy="38" rx="4" ry="3" fill={colors.primary} />
            <ellipse cx="48" cy="38" rx="4" ry="3" fill={colors.primary} />
            
            {/* Neck */}
            <path d="M36 26 C36 28, 44 28, 44 26" fill="#6b4f35" />
            
            {/* Head with Basketball Headband */}
            <circle cx="40" cy="18" r="10" fill="#6b4f35" />
            <path d="M30 18 C30 12, 50 12, 50 18" fill="#6b4f35" />
            <path d="M30 18 C30 24, 50 24, 50 18" fill="#6b4f35" />
            <path d="M30 15 L50 15" stroke={colors.primary} strokeWidth="3" />
            
            {/* Face Details */}
            <ellipse cx="36" cy="16" rx="1.5" ry="2" fill="white" />
            <ellipse cx="44" cy="16" rx="1.5" ry="2" fill="white" />
            <motion.path 
              d="M36 22 Q40 24 44 22" 
              stroke="rgba(255,255,255,0.8)" 
              fill="transparent" 
              strokeWidth="1"
              animate={isPlaying ? {
                d: ["M36 22 Q40 24 44 22", "M36 24 Q40 26 44 24", "M36 22 Q40 24 44 22"]
              } : {}}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1.5
              }}
            />
            
            {/* Jersey Number */}
            <text x="40" y="50" textAnchor="middle" className="text-lg font-bold" fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5">17</text>
          </motion.g>
        </svg>
        
        {/* Power effect */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full"
          style={{ 
            background: `radial-gradient(circle, ${colors.primary}50 0%, transparent 70%)`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={isPlaying ? {
            scale: [0, 1, 0],
            opacity: [0, 0.7, 0],
            y: [0, 0, 0]
          } : { scale: 0, opacity: 0 }}
          transition={{
            duration: 1.5,
            times: [0, 0.3, 1],
            repeat: isPlaying ? Infinity : 0,
            repeatDelay: 1.5
          }}
        />
      </motion.div>
      
      {/* Jump height marker */}
      <motion.div
        className="absolute left-[53%] w-12 h-0.5"
        style={{ 
          backgroundColor: colors.primary,
          boxShadow: `0 0 5px ${colors.primary}` 
        }}
        initial={{ opacity: 0 }}
        animate={isPlaying ? {
          opacity: [0, 0, 1], 
          top: ["48%", "48%", "25%"]
        } : { opacity: 0 }}
        transition={{
          duration: 1.5,
          times: [0, 0.3, 0.5],
          repeat: isPlaying ? Infinity : 0,
          repeatDelay: 1.5
        }}
      >
        <div 
          className="absolute top-1/2 left-full -translate-y-1/2 ml-1 px-2 py-1 rounded text-xs"
          style={{ 
            backgroundColor: colors.primary, 
            color: 'white'
          }}
        >
          38.5"
        </div>
      </motion.div>
      
      {/* Power meter */}
      <div className="absolute top-8 right-8 w-10 h-40 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="w-full rounded-full"
          style={{ backgroundColor: colors.primary }}
          initial={{ height: '0%' }}
          animate={isPlaying ? {
            height: ['0%', '90%', '0%']
          } : { height: '0%' }}
          transition={{
            duration: 1.5,
            times: [0, 0.4, 1],
            repeat: isPlaying ? Infinity : 0,
            repeatDelay: 1.5
          }}
        />
      </div>
    </div>
  );
};

// Agility Drill Animation - Madden style
const AgilityAnimation = ({ colors, isPlaying }: { colors: any, isPlaying: boolean }) => {
  // Cone positions
  const cones = [
    { x: '20%', y: '50%' },
    { x: '50%', y: '30%' },
    { x: '80%', y: '50%' },
    { x: '50%', y: '70%' },
  ];
  
  return (
    <div className="relative w-full h-full">
      {/* Cones */}
      {cones.map((cone, index) => (
        <div
          key={index}
          className="absolute w-4 h-6"
          style={{ 
            left: cone.x, 
            top: cone.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div 
            className="w-0 h-0 mx-auto"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '12px solid #ef4444'
            }}
          />
        </div>
      ))}
      
      {/* Path lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <path 
          d={`M ${cones[0].x} ${cones[0].y} L ${cones[1].x} ${cones[1].y} L ${cones[2].x} ${cones[2].y} L ${cones[3].x} ${cones[3].y} L ${cones[0].x} ${cones[0].y}`}
          stroke="#4b5563"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
        />
      </svg>
      
      {/* Player character - 2K style agility animation */}
      <motion.div
        className="absolute left-[20%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-[60px] h-[100px] z-10"
        animate={isPlaying ? {
          left: ['20%', '35%', '50%', '65%', '80%', '65%', '50%', '35%', '20%'],
          top: ['50%', '40%', '30%', '40%', '50%', '60%', '70%', '60%', '50%'],
          rotate: [0, -20, 0, 20, 0, -20, 0, 20, 0]
        } : {}}
        transition={{
          duration: 4,
          times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
          repeat: isPlaying ? Infinity : 0,
          repeatDelay: 1
        }}
      >
        {/* Draw the athlete - Football player for agility */}
        <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
          <g>
            {/* Base Shadow */}
            <ellipse cx="40" cy="110" rx="12" ry="4" opacity="0.3" fill="#000000" />
            
            {/* Cleats */}
            <path d="M25 95 L20 100 L22 102 L30 102 L32 98 L28 95 Z" fill="#111111" />
            <path d="M25 95 L20 100 L22 102 L30 102 L32 98 L28 95 Z" stroke="#333333" strokeWidth="0.5" />
            <path d="M55 95 L60 100 L58 102 L50 102 L48 98 L52 95 Z" fill="#111111" />
            <path d="M55 95 L60 100 L58 102 L50 102 L48 98 L52 95 Z" stroke="#333333" strokeWidth="0.5" />
            
            {/* Athletic Socks */}
            <rect x="28" y="88" width="6" height="7" rx="1" fill="white" />
            <rect x="46" y="88" width="6" height="7" rx="1" fill="white" />
            
            {/* Leg Muscle Definition - Football Pants */}
            <path d="M32 50 C22 55, 22 75, 25 88 L37 88 C38 75, 38 55, 36 50 Z" fill="#efefef" stroke="#dedede" strokeWidth="0.5" />
            <path d="M48 50 C58 55, 58 75, 55 88 L43 88 C42 75, 42 55, 44 50 Z" fill="#efefef" stroke="#dedede" strokeWidth="0.5" />
            
            {/* Knee Pads */}
            <rect x="28" y="70" width="6" height="6" rx="3" fill="#dddddd" stroke="#cccccc" strokeWidth="0.5" />
            <rect x="46" y="70" width="6" height="6" rx="3" fill="#dddddd" stroke="#cccccc" strokeWidth="0.5" />
            
            {/* Hip Pads */}
            <rect x="32" y="52" width="6" height="4" rx="2" fill="#dddddd" stroke="#cccccc" strokeWidth="0.5" />
            <rect x="42" y="52" width="6" height="4" rx="2" fill="#dddddd" stroke="#cccccc" strokeWidth="0.5" />
            
            {/* Jersey - Football Style */}
            <path d="M30 28 C26 30, 24 35, 24 50 L56 50 C56 35, 54 30, 50 28 Z" fill={colors.primary} />
            <path d="M30 28 C26 30, 24 35, 24 50 L56 50 C56 35, 54 30, 50 28 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            
            {/* Jersey Lines */}
            <path d="M30 32 L30 50 M50 32 L50 50" stroke="white" strokeWidth="0.5" />
            <path d="M24 40 L56 40" stroke="white" strokeWidth="1" />
            
            {/* Shoulder Pads */}
            <ellipse cx="30" cy="30" rx="7" ry="5" fill={colors.primary} />
            <ellipse cx="50" cy="30" rx="7" ry="5" fill={colors.primary} />
            <path d="M28 26 C28 28, 32 30, 32 30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <path d="M52 26 C52 28, 48 30, 48 30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            
            {/* Neck */}
            <path d="M35 22 C35 25, 45 25, 45 22" fill="#6b4f35" />
            
            {/* Helmet - Football Style */}
            <path d="M32 14 C25 14, 25 22, 32 22 L48 22 C55 22, 55 14, 48 14 Z" fill={colors.primary} />
            <path d="M32 14 C25 14, 25 22, 32 22 L48 22 C55 22, 55 14, 48 14 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            <path d="M32 14 C28 10, 52 10, 48 14" fill={colors.primary} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            
            {/* Helmet Stripe */}
            <path d="M40 9 L40 22" stroke="white" strokeWidth="2" />
            
            {/* Facemask */}
            <path d="M32 18 L48 18" stroke="#555555" strokeWidth="1.5" />
            <path d="M30 16 L30 20 M33 14 L33 21 M37 14 L37 21 M40 14 L40 21 M43 14 L43 21 M47 14 L47 21 M50 16 L50 20" stroke="#555555" strokeWidth="1.5" />
            
            {/* Arm Muscles */}
            <motion.g
              animate={isPlaying ? {
                rotate: [-40, 20, -40]
              } : {}}
              transition={{ 
                duration: 0.5,
                repeat: Infinity
              }}
              style={{ transformOrigin: '30px 32px' }}
            >
              <path d="M30 32 C18 32, 18 38, 15 42" stroke="#6b4f35" strokeWidth="6" strokeLinecap="round" />
              <path d="M30 32 C18 32, 18 38, 15 42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="15" cy="42" rx="3" ry="2.5" fill="#6b4f35" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [40, -20, 40]
              } : {}}
              transition={{ 
                duration: 0.5,
                repeat: Infinity
              }}
              style={{ transformOrigin: '50px 32px' }}
            >
              <path d="M50 32 C62 32, 62 38, 65 42" stroke="#6b4f35" strokeWidth="6" strokeLinecap="round" />
              <path d="M50 32 C62 32, 62 38, 65 42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="65" cy="42" rx="3" ry="2.5" fill="#6b4f35" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            </motion.g>
            
            {/* Dynamic Leg Movement */}
            <motion.g
              animate={isPlaying ? {
                rotate: [15, -15, 15]
              } : {}}
              transition={{ 
                duration: 0.5,
                repeat: Infinity
              }}
              style={{ transformOrigin: '32px 50px' }}
            >
              <path d="M32 50 C22 55, 22 75, 25 88 L37 88 C38 75, 38 55, 36 50 Z" fill="#efefef" stroke="#dedede" strokeWidth="0.5" />
              <rect x="28" y="70" width="6" height="6" rx="3" fill="#dddddd" stroke="#cccccc" strokeWidth="0.5" />
              <rect x="28" y="88" width="6" height="7" rx="1" fill="white" />
              <path d="M25 95 L20 100 L22 102 L30 102 L32 98 L28 95 Z" fill="#111111" stroke="#333333" strokeWidth="0.5" />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [-15, 15, -15]
              } : {}}
              transition={{ 
                duration: 0.5,
                repeat: Infinity
              }}
              style={{ transformOrigin: '48px 50px' }}
            >
              <path d="M48 50 C58 55, 58 75, 55 88 L43 88 C42 75, 42 55, 44 50 Z" fill="#efefef" stroke="#dedede" strokeWidth="0.5" />
              <rect x="46" y="70" width="6" height="6" rx="3" fill="#dddddd" stroke="#cccccc" strokeWidth="0.5" />
              <rect x="46" y="88" width="6" height="7" rx="1" fill="white" />
              <path d="M55 95 L60 100 L58 102 L50 102 L48 98 L52 95 Z" fill="#111111" stroke="#333333" strokeWidth="0.5" />
            </motion.g>
            
            {/* Jersey Number */}
            <text x="40" y="40" textAnchor="middle" className="text-lg font-bold" fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5">17</text>
          </g>
        </svg>
      </motion.div>
      
      {/* Motion trail */}
      <motion.div
        className="absolute left-0 top-0 w-full h-full pointer-events-none"
        style={{ zIndex: 5 }}
      >
        <svg width="100%" height="100%">
          <motion.path
            d={`M 20% 50% Q 50% 10% 80% 50% Q 50% 90% 20% 50%`}
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isPlaying ? { 
              pathLength: [0, 1, 0],
              opacity: [0, 0.4, 0]
            } : {}}
            transition={{
              duration: 4,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 1
            }}
          />
        </svg>
      </motion.div>
      
      {/* Timer */}
      <motion.div
        className="absolute right-10 top-10 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border"
        style={{ borderColor: colors.primary }}
      >
        <span className="text-gray-400 text-xs">TIME</span>
        <motion.div
          className="text-lg font-mono font-bold"
          style={{ color: colors.accent }}
          animate={isPlaying ? {
            opacity: [1, 1]
          } : {}}
          transition={{
            duration: 4,
            repeat: isPlaying ? Infinity : 0,
            repeatDelay: 1
          }}
        >
          {isPlaying ? "6.78s" : "0.00s"}
        </motion.div>
      </motion.div>
    </div>
  );
};

// Strength Animation - NBA 2K style
const StrengthAnimation = ({ colors, isPlaying }: { colors: any, isPlaying: boolean }) => {
  return (
    <div className="relative w-full h-full">
      {/* Bench */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[15%]">
        <div className="absolute top-0 left-[5%] right-[5%] h-6 bg-gray-700 rounded-md"></div>
        <div className="absolute top-6 left-[10%] w-4 h-16 bg-gray-800 rounded-b-md"></div>
        <div className="absolute top-6 right-[10%] w-4 h-16 bg-gray-800 rounded-b-md"></div>
      </div>
      
      {/* Weight bar */}
      <motion.div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 w-[60%] h-3 bg-gray-300 rounded-full"
        animate={isPlaying ? {
          y: [0, -20, 0]
        } : {}}
        transition={{
          duration: 2,
          times: [0, 0.5, 1],
          repeat: isPlaying ? Infinity : 0,
          repeatDelay: 1
        }}
      >
        <div className="absolute left-[10%] top-0 bottom-0 w-6 h-6 -translate-y-1.5 -translate-x-1/2 rounded-full bg-gray-600"></div>
        <div className="absolute right-[10%] top-0 bottom-0 w-6 h-6 -translate-y-1.5 translate-x-1/2 rounded-full bg-gray-600"></div>
      </motion.div>
      
      {/* Player character */}
      <motion.div
        className="absolute left-1/2 top-[50%] -translate-x-1/2 w-[70px] h-[120px]"
        animate={isPlaying ? {
          y: [0, -10, 0],
          scaleY: [1, 0.95, 1]
        } : {}}
        transition={{
          duration: 2,
          times: [0, 0.5, 1],
          repeat: isPlaying ? Infinity : 0,
          repeatDelay: 1
        }}
      >
        <svg width="90" height="130" viewBox="0 0 90 130" fill="none">
          <g>
            {/* Base Shadow for depth */}
            <ellipse cx="45" cy="120" rx="15" ry="4" opacity="0.3" fill="#000000" />
            
            {/* Feet/Shoes - Weightlifting */}
            <rect x="28" y="105" width="12" height="8" rx="2" fill="#222222" stroke="#111111" strokeWidth="0.5" />
            <rect x="50" y="105" width="12" height="8" rx="2" fill="#222222" stroke="#111111" strokeWidth="0.5" />
            <path d="M28 109 L40 109" stroke="#444444" strokeWidth="1" />
            <path d="M50 109 L62 109" stroke="#444444" strokeWidth="1" />
            
            {/* Athletic Socks */}
            <rect x="30" y="98" width="8" height="7" rx="1" fill="white" stroke="#DDDDDD" strokeWidth="0.5" />
            <rect x="52" y="98" width="8" height="7" rx="1" fill="white" stroke="#DDDDDD" strokeWidth="0.5" />
            
            {/* Powerlifting Leg Muscles */}
            <path d="M32 60 C25 65, 25 85, 30 98 L38 98 C40 85, 40 65, 38 60 Z" fill="#1e293b" />
            <path d="M32 60 C25 65, 25 85, 30 98 L38 98 C40 85, 40 65, 38 60 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            <path d="M58 60 C65 65, 65 85, 60 98 L52 98 C50 85, 50 65, 52 60 Z" fill="#1e293b" />
            <path d="M58 60 C65 65, 65 85, 60 98 L52 98 C50 85, 50 65, 52 60 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            
            {/* Muscle Definition Lines */}
            <path d="M35 70 C32 80, 32 90, 34 98" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <path d="M55 70 C58 80, 58 90, 56 98" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            
            {/* Weight Belt */}
            <rect x="30" y="60" width="30" height="5" fill="#663300" stroke="#442200" strokeWidth="0.5" />
            <rect x="42" y="60" width="6" height="5" fill="#884400" stroke="#663300" strokeWidth="0.5" />
            
            {/* Hulking Muscular Torso - Bodybuilder Style */}
            <path d="M30 35 C25 40, 20 50, 30 60 L60 60 C70 50, 65 40, 60 35 Z" fill={colors.primary} />
            <path d="M30 35 C25 40, 20 50, 30 60 L60 60 C70 50, 65 40, 60 35 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            
            {/* Muscle Definition in Torso */}
            <path d="M45 35 L45 60" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            <path d="M35 45 L55 45" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            <path d="M35 53 L55 53" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            
            {/* Massive Shoulders */}
            <ellipse cx="30" cy="35" rx="8" ry="6" fill={colors.primary} />
            <ellipse cx="60" cy="35" rx="8" ry="6" fill={colors.primary} />
            
            {/* Beefy Neck */}
            <path d="M35 25 C35 30, 55 30, 55 25" fill="#6b4f35" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            <path d="M38 28 L52 28" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            
            {/* Head - Focused Expression */}
            <ellipse cx="45" cy="18" rx="12" ry="14" fill="#6b4f35" />
            
            {/* Determined Face/Expression */}
            <ellipse cx="40" cy="16" rx="2" ry="1.5" fill="white" />
            <ellipse cx="50" cy="16" rx="2" ry="1.5" fill="white" />
            <motion.path 
              d="M38 24 Q45 23 52 24" 
              stroke="white" 
              fill="transparent" 
              strokeWidth="1"
              animate={isPlaying ? {
                d: ["M38 24 Q45 23 52 24", "M38 24 Q45 22 52 24", "M38 24 Q45 23 52 24"]
              } : {}}
              transition={{
                duration: 2,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1
              }}
            />
            
            {/* Eyebrows - Concentration */}
            <motion.path 
              d="M37 13 L43 14" 
              stroke="rgba(255,255,255,0.5)" 
              strokeWidth="1"
              animate={isPlaying ? {
                d: ["M37 13 L43 14", "M37 12 L43 13", "M37 13 L43 14"]
              } : {}}
              transition={{
                duration: 2,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1
              }}
            />
            <motion.path 
              d="M47 14 L53 13" 
              stroke="rgba(255,255,255,0.5)" 
              strokeWidth="1"
              animate={isPlaying ? {
                d: ["M47 14 L53 13", "M47 13 L53 12", "M47 14 L53 13"]
              } : {}}
              transition={{
                duration: 2,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1
              }}
            />
            
            {/* Power lifting bandana */}
            <path d="M33 10 L57 10 L53 18 L37 18 Z" fill={colors.primary} />
            <path d="M33 10 L57 10 L53 18 L37 18 Z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            <path d="M33 10 L30 18 M57 10 L60 18" stroke={colors.primary} strokeWidth="2" />
            
            {/* Bulging Arms */}
            <motion.g
              animate={isPlaying ? {
                rotate: [0, -12, 0],
                y: [0, -4, 0]
              } : {}}
              transition={{
                duration: 2,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1
              }}
              style={{ transformOrigin: '30px 35px' }}
            >
              {/* Bicep Definition */}
              <path d="M30 35 C20 35, 10 38, 8 45" stroke="#6b4f35" strokeWidth="10" strokeLinecap="round" />
              <path d="M30 35 C20 35, 10 38, 8 45" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
              <path d="M22 35 C15 38, 10 42, 8 45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              
              {/* Hand */}
              <ellipse cx="8" cy="45" rx="5" ry="4" fill="#6b4f35" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
              <path d="M5 45 L11 45" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [0, 12, 0],
                y: [0, -4, 0]
              } : {}}
              transition={{
                duration: 2,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1
              }}
              style={{ transformOrigin: '60px 35px' }}
            >
              {/* Bicep Definition */}
              <path d="M60 35 C70 35, 80 38, 82 45" stroke="#6b4f35" strokeWidth="10" strokeLinecap="round" />
              <path d="M60 35 C70 35, 80 38, 82 45" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
              <path d="M68 35 C75 38, 80 42, 82 45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              
              {/* Hand */}
              <ellipse cx="82" cy="45" rx="5" ry="4" fill="#6b4f35" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
              <path d="M79 45 L85 45" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            </motion.g>
            
            {/* Veins effect - bodybuilder */}
            <motion.path
              d="M25 40 C26 42, 24 45, 25 48"
              stroke="rgba(0,65,130,0.3)"
              strokeWidth="0.5"
              fill="none"
              animate={isPlaying ? {
                opacity: [0.2, 0.4, 0.2]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
            <motion.path
              d="M65 40 C64 42, 66 45, 65 48"
              stroke="rgba(0,65,130,0.3)"
              strokeWidth="0.5"
              fill="none"
              animate={isPlaying ? {
                opacity: [0.2, 0.4, 0.2]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
            
            {/* Jersey Number */}
            <text x="45" y="50" textAnchor="middle" className="text-xl font-bold" fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5">17</text>
          </g>
        </svg>
      </motion.div>
      
      {/* Rep counter */}
      <motion.div
        className="absolute right-8 top-8 px-4 py-2 rounded-lg"
        style={{ 
          backgroundColor: colors.primary,
          color: 'white'
        }}
      >
        <span className="block text-xs opacity-80">REPS</span>
        <motion.div
          className="text-xl font-bold text-center"
          initial={{ opacity: 1 }}
          animate={isPlaying ? { opacity: 1 } : { opacity: 1 }}
        >
          {isPlaying ? "22" : "0"}
        </motion.div>
      </motion.div>
      
      {/* Strength meter */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-40 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="w-full rounded-full"
          style={{ backgroundColor: colors.primary }}
          initial={{ height: '0%' }}
          animate={isPlaying ? {
            height: ['0%', '50%', '80%', '60%', '90%', '70%', '91%']
          } : { height: '0%' }}
          transition={{
            duration: 30,
            times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
            repeat: isPlaying ? Infinity : 0,
            repeatDelay: 1
          }}
        />
      </div>
      
      {/* Exertion effect */}
      {isPlaying && (
        <motion.div
          className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none"
          animate={{
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0
          }}
        >
          {/* Strength burst rays */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 h-1 rounded-full"
              style={{ 
                width: '30px',
                backgroundColor: colors.primary,
                transformOrigin: 'left center',
                transform: `rotate(${i * 45}deg) translateX(10px)`
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scaleX: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default GameStyleGarCommercial;