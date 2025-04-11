import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap, ChevronRight, ChevronLeft, Award, Timer, Activity } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
              {currentScene.id === 'sprint' && (
                <SprintAnimation colors={currentColors} isPlaying={isPlaying} />
              )}
              
              {currentScene.id === 'vertical' && (
                <VerticalAnimation colors={currentColors} isPlaying={isPlaying} />
              )}
              
              {currentScene.id === 'agility' && (
                <AgilityAnimation colors={currentColors} isPlaying={isPlaying} />
              )}
              
              {currentScene.id === 'strength' && (
                <StrengthAnimation colors={currentColors} isPlaying={isPlaying} />
              )}
              
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
        {/* Draw the athlete */}
        <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
          {/* Body */}
          <motion.g
            animate={isPlaying ? {
              rotate: [-5, 5, -5, 5],
              y: [0, -2, 0, -2]
            } : {}}
            transition={{ 
              duration: 0.4,
              repeat: Infinity
            }}
            style={{ transformOrigin: 'center center' }}
          >
            {/* Torso */}
            <rect x="22" y="20" width="16" height="34" rx="6" fill={colors.primary} />
            
            {/* Head */}
            <circle cx="30" cy="15" r="10" fill="#7c3aed" />
            
            {/* Eyes and Mouth */}
            <circle cx="26" cy="12" r="1.5" fill="white" />
            <circle cx="34" cy="12" r="1.5" fill="white" />
            <path d="M26 18 Q30 20 34 18" stroke="white" fill="transparent" strokeWidth="1" />
            
            {/* Arms */}
            <motion.g
              animate={isPlaying ? {
                rotate: [-40, 40, -40, 40]
              } : {}}
              transition={{ 
                duration: 0.3,
                repeat: Infinity
              }}
              style={{ transformOrigin: '22px 25px' }}
            >
              <rect x="10" y="25" width="12" height="5" rx="2.5" fill={colors.primary} />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [40, -40, 40, -40]
              } : {}}
              transition={{ 
                duration: 0.3,
                repeat: Infinity
              }}
              style={{ transformOrigin: '38px 25px' }}
            >
              <rect x="38" y="25" width="12" height="5" rx="2.5" fill={colors.primary} />
            </motion.g>
            
            {/* Legs */}
            <motion.g
              animate={isPlaying ? {
                rotate: [20, -20, 20, -20]
              } : {}}
              transition={{ 
                duration: 0.3,
                repeat: Infinity
              }}
              style={{ transformOrigin: '26px 54px' }}
            >
              <rect x="18" y="54" width="8" height="25" rx="4" fill="#1e293b" />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [-20, 20, -20, 20]
              } : {}}
              transition={{ 
                duration: 0.3,
                repeat: Infinity
              }}
              style={{ transformOrigin: '34px 54px' }}
            >
              <rect x="34" y="54" width="8" height="25" rx="4" fill="#1e293b" />
            </motion.g>
          </motion.g>
          
          {/* Number/jersey */}
          <text x="30" y="40" textAnchor="middle" className="text-xs font-bold" fill="white">17</text>
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
        {/* Draw the athlete */}
        <svg width="70" height="120" viewBox="0 0 70 120" fill="none">
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
            {/* Torso */}
            <rect x="25" y="30" width="20" height="40" rx="6" fill={colors.primary} />
            
            {/* Head */}
            <circle cx="35" cy="20" r="12" fill="#7c3aed" />
            
            {/* Eyes and Mouth */}
            <circle cx="30" cy="17" r="2" fill="white" />
            <circle cx="40" cy="17" r="2" fill="white" />
            <motion.path 
              d="M30 24 Q35 28 40 24" 
              stroke="white" 
              fill="transparent" 
              strokeWidth="1.5"
              animate={isPlaying ? {
                d: ["M30 24 Q35 28 40 24", "M30 27 Q35 30 40 27", "M30 24 Q35 28 40 24"]
              } : {}}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1.5
              }}
            />
            
            {/* Arms */}
            <motion.g
              animate={isPlaying ? {
                rotate: [-45, -180, -45],
                y: [0, -10, 0]
              } : {}}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1.5
              }}
              style={{ transformOrigin: '25px 35px' }}
            >
              <rect x="10" y="35" width="15" height="8" rx="4" fill={colors.primary} />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [45, 180, 45],
                y: [0, -10, 0]
              } : {}}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1.5
              }}
              style={{ transformOrigin: '45px 35px' }}
            >
              <rect x="45" y="35" width="15" height="8" rx="4" fill={colors.primary} />
            </motion.g>
            
            {/* Legs */}
            <motion.g
              animate={isPlaying ? {
                rotate: [-30, 0, -30],
                scaleY: [1, 0.8, 1]
              } : {}}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1.5
              }}
              style={{ transformOrigin: '30px 70px' }}
            >
              <rect x="22" y="70" width="8" height="30" rx="4" fill="#1e293b" />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [30, 0, 30],
                scaleY: [1, 0.8, 1]
              } : {}}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1.5
              }}
              style={{ transformOrigin: '40px 70px' }}
            >
              <rect x="40" y="70" width="8" height="30" rx="4" fill="#1e293b" />
            </motion.g>
            
            {/* Jersey number */}
            <text x="35" y="55" textAnchor="middle" className="text-xs font-bold" fill="white">17</text>
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
        {/* Draw the athlete */}
        <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
          {/* Body */}
          <g>
            {/* Torso */}
            <rect x="22" y="20" width="16" height="34" rx="6" fill={colors.primary} />
            
            {/* Head */}
            <circle cx="30" cy="15" r="10" fill="#7c3aed" />
            
            {/* Eyes and Mouth */}
            <circle cx="26" cy="12" r="1.5" fill="white" />
            <circle cx="34" cy="12" r="1.5" fill="white" />
            <path d="M26 18 Q30 20 34 18" stroke="white" fill="transparent" strokeWidth="1" />
            
            {/* Arms */}
            <motion.g
              animate={isPlaying ? {
                rotate: [-20, 20, -20]
              } : {}}
              transition={{ 
                duration: 0.5,
                repeat: Infinity
              }}
              style={{ transformOrigin: '22px 25px' }}
            >
              <rect x="10" y="25" width="12" height="5" rx="2.5" fill={colors.primary} />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [20, -20, 20]
              } : {}}
              transition={{ 
                duration: 0.5,
                repeat: Infinity
              }}
              style={{ transformOrigin: '38px 25px' }}
            >
              <rect x="38" y="25" width="12" height="5" rx="2.5" fill={colors.primary} />
            </motion.g>
            
            {/* Legs */}
            <motion.g
              animate={isPlaying ? {
                rotate: [15, -15, 15]
              } : {}}
              transition={{ 
                duration: 0.5,
                repeat: Infinity
              }}
              style={{ transformOrigin: '26px 54px' }}
            >
              <rect x="18" y="54" width="8" height="25" rx="4" fill="#1e293b" />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [-15, 15, -15]
              } : {}}
              transition={{ 
                duration: 0.5,
                repeat: Infinity
              }}
              style={{ transformOrigin: '34px 54px' }}
            >
              <rect x="34" y="54" width="8" height="25" rx="4" fill="#1e293b" />
            </motion.g>
            
            {/* Jersey number */}
            <text x="30" y="40" textAnchor="middle" className="text-xs font-bold" fill="white">17</text>
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
        <svg width="70" height="120" viewBox="0 0 70 120" fill="none">
          <g>
            {/* Torso */}
            <rect x="25" y="50" width="20" height="30" rx="6" fill={colors.primary} />
            
            {/* Head */}
            <circle cx="35" cy="35" r="10" fill="#7c3aed" />
            
            {/* Eyes and Mouth */}
            <circle cx="30" cy="32" r="1.5" fill="white" />
            <circle cx="40" cy="32" r="1.5" fill="white" />
            <motion.path 
              d="M30 39 Q35 37 40 39" 
              stroke="white" 
              fill="transparent" 
              strokeWidth="1"
              animate={isPlaying ? {
                d: ["M30 39 Q35 37 40 39", "M30 39 Q35 41 40 39", "M30 39 Q35 37 40 39"]
              } : {}}
              transition={{
                duration: 2,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1
              }}
            />
            
            {/* Arms */}
            <motion.g
              animate={isPlaying ? {
                rotate: [0, -15, 0],
                y: [0, -5, 0]
              } : {}}
              transition={{
                duration: 2,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1
              }}
              style={{ transformOrigin: '25px 45px' }}
            >
              <rect x="5" y="45" width="20" height="8" rx="4" fill={colors.primary} />
            </motion.g>
            
            <motion.g
              animate={isPlaying ? {
                rotate: [0, 15, 0],
                y: [0, -5, 0]
              } : {}}
              transition={{
                duration: 2,
                times: [0, 0.5, 1],
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1
              }}
              style={{ transformOrigin: '45px 45px' }}
            >
              <rect x="45" y="45" width="20" height="8" rx="4" fill={colors.primary} />
            </motion.g>
            
            {/* Legs */}
            <rect x="25" y="80" width="8" height="25" rx="4" fill="#1e293b" />
            <rect x="37" y="80" width="8" height="25" rx="4" fill="#1e293b" />
            
            {/* Jersey number */}
            <text x="35" y="70" textAnchor="middle" className="text-xs font-bold" fill="white">17</text>
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