import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  ArrowRight, 
  Dumbbell, 
  BarChart3, 
  BookOpen, 
  CheckCircle,
  Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function StarPathCommercial() {
  const [activeLevel, setActiveLevel] = useState(1);
  
  // Star Path levels with attributes
  const levels = [
    {
      id: 1,
      name: "Rising Prospect",
      color: "#3b82f6", // blue
      athleteImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500",
      attributes: {
        speed: 70,
        strength: 65,
        agility: 72,
        focus: 68,
        technique: 65
      },
      trainingFocus: "Build core fundamentals across all performance areas",
      unlocks: ["Basic Training Programs", "Beginner Skill Tree Access", "Performance Analytics"]
    },
    {
      id: 2,
      name: "Emerging Talent",
      color: "#8b5cf6", // purple
      athleteImage: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=500",
      attributes: {
        speed: 78,
        strength: 74,
        agility: 80,
        focus: 75,
        technique: 76
      },
      trainingFocus: "Enhance game-specific skills and physical capabilities",
      unlocks: ["Advanced Training Modules", "College Coaches Visibility", "Enhanced Skill Tree"]
    },
    {
      id: 3,
      name: "Standout Performer",
      color: "#10b981", // green
      athleteImage: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500",
      attributes: {
        speed: 85,
        strength: 82,
        agility: 87,
        focus: 84,
        technique: 88
      },
      trainingFocus: "Master position-specific techniques and develop leadership",
      unlocks: ["Elite Training Access", "Scout Visibility", "Full Skill Tree Access"]
    },
    {
      id: 4,
      name: "Elite Prospect",
      color: "#f59e0b", // amber
      athleteImage: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=500",
      attributes: {
        speed: 92,
        strength: 90,
        agility: 93,
        focus: 90,
        technique: 94
      },
      trainingFocus: "Refine elite skills and advance mental performance",
      unlocks: ["College Recruitment Tools", "Pro Scout Visibility", "Premium Training Modules"]
    },
    {
      id: 5,
      name: "Five-Star Athlete",
      color: "#ef4444", // red
      athleteImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500",
      attributes: {
        speed: 98,
        strength: 96,
        agility: 97,
        focus: 95,
        technique: 98
      },
      trainingFocus: "Maximize all performance areas for collegiate/pro readiness",
      unlocks: ["National Visibility", "Pro Training Programs", "Complete Performance Suite"]
    }
  ];
  
  const currentLevel = levels[activeLevel - 1];
  
  // PlayStation 5 style glow/shadow effect
  const psGlow = "0 0 15px rgba(59, 130, 246, 0.7)";
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-xl border border-blue-900/50 shadow-lg">
        {/* PS5-style interface header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4 flex items-center justify-between border-b border-blue-800/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Star className="w-7 h-7 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
              <motion.div 
                className="absolute inset-0 rounded-full"
                animate={{ 
                  boxShadow: ['0 0 5px rgba(250,204,21,0.5)', '0 0 20px rgba(250,204,21,0.8)', '0 0 5px rgba(250,204,21,0.5)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-7 h-7 text-yellow-400 opacity-0" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-white">Star Path Progression System</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-500/20 rounded-full">
              <span className="text-blue-300 text-sm">PlayStation 5 Quality</span>
            </div>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {/* Left panel - Athlete visualization */}
          <div className="relative flex flex-col items-center">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="star-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#star-grid)" />
              </svg>
            </div>
            
            {/* Level progress bar */}
            <div className="w-full mb-4 relative">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ backgroundColor: currentLevel.color }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${activeLevel * 20}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="flex justify-between mt-1 px-1">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      level.id === activeLevel 
                        ? 'bg-blue-600 text-white' 
                        : level.id < activeLevel 
                          ? 'bg-blue-800/50 text-gray-300' 
                          : 'bg-gray-800/80 text-gray-500'
                    }`}
                    onClick={() => setActiveLevel(level.id)}
                  >
                    {level.id < activeLevel ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      level.id
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Athlete Visualization */}
            <div className="relative w-[90%] max-w-xs aspect-[3/4] rounded-lg overflow-hidden mb-4">
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.5 }}
              />
              
              <motion.img
                src={currentLevel.athleteImage}
                alt={`${currentLevel.name} athlete`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Attribute Indicators */}
              <motion.div 
                className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-blue-500/30 z-20"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm font-medium">Speed: {currentLevel.attributes.speed}</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute top-16 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-blue-500/30 z-20"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-red-400" />
                  <span className="text-white text-sm font-medium">Strength: {currentLevel.attributes.strength}</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-16 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-blue-500/30 z-20"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm font-medium">Technique: {currentLevel.attributes.technique}</span>
                </div>
              </motion.div>
              
              {/* Level badge */}
              <motion.div
                className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-2 bg-gradient-to-r rounded-lg shadow-lg"
                style={{ 
                  backgroundImage: `linear-gradient(to right, ${currentLevel.color}90, ${currentLevel.color}60)`,
                  boxShadow: `0 0 20px ${currentLevel.color}50`
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Star className={`w-5 h-5 text-white`} fill="white" />
                <span className="text-white font-bold">{currentLevel.name}</span>
              </motion.div>
              
              {/* Animation overlay effects */}
              <motion.div 
                className="absolute inset-0 z-30 pointer-events-none"
                animate={{ 
                  boxShadow: [
                    `inset 0 0 30px ${currentLevel.color}30`,
                    `inset 0 0 60px ${currentLevel.color}60`,
                    `inset 0 0 30px ${currentLevel.color}30`
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* PS5-style Particle effects */}
              <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white opacity-80"
                    style={{ 
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%` 
                    }}
                    animate={{ 
                      y: [0, -100],
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Current level info */}
            <motion.div
              className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-blue-900/30"
              style={{ boxShadow: psGlow }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">
                Level {activeLevel}: {currentLevel.name}
              </h3>
              <p className="text-blue-300 mb-3">
                <span className="text-sm">{currentLevel.trainingFocus}</span>
              </p>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {Object.entries(currentLevel.attributes).map(([attr, value]) => (
                  <div key={attr} className="flex flex-col items-center">
                    <div className="text-[10px] uppercase text-gray-400 mb-1">{attr}</div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: 
                            attr === 'speed' ? '#3b82f6' : 
                            attr === 'strength' ? '#ef4444' :
                            attr === 'agility' ? '#10b981' :
                            attr === 'focus' ? '#f59e0b' : 
                            '#8b5cf6'
                        }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                    <div className="text-xs text-white mt-1">{value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right panel - Star Path Journey */}
          <div className="relative flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-blue-400 mb-1">Star Path Journey</h3>
              <p className="text-gray-300 text-sm">
                Transform your real-world training into digital progress and unlock new abilities as you advance.
              </p>
            </div>
            
            {/* Journey Steps */}
            <div className="space-y-4 flex-1">
              <motion.div 
                className="flex items-start gap-4 bg-blue-900/20 backdrop-blur-sm p-4 rounded-lg border border-blue-800/50"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ boxShadow: psGlow }}
              >
                <div className="rounded-full bg-blue-600 p-2 mt-1">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Real-World Training</h4>
                  <p className="text-gray-300 text-sm mt-1">Complete workouts and drills in the real world to earn XP and progress your digital athlete.</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="px-2 py-1 rounded bg-blue-600/20 text-blue-400 text-xs">Verified Workouts</div>
                    <div className="px-2 py-1 rounded bg-blue-600/20 text-blue-400 text-xs">Coach Challenges</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4 bg-purple-900/20 backdrop-blur-sm p-4 rounded-lg border border-purple-800/50"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ boxShadow: "0 0 15px rgba(124, 58, 237, 0.3)" }}
              >
                <div className="rounded-full bg-purple-600 p-2 mt-1">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">GAR Assessment</h4>
                  <p className="text-gray-300 text-sm mt-1">Your performance is measured using our Growth and Ability Rating system.</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <div className="px-2 py-1 rounded bg-purple-600/20 text-purple-400 text-xs">Physical Metrics</div>
                    <div className="px-2 py-1 rounded bg-purple-600/20 text-purple-400 text-xs">Mental Focus</div>
                    <div className="px-2 py-1 rounded bg-purple-600/20 text-purple-400 text-xs">Technical Skills</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4 bg-green-900/20 backdrop-blur-sm p-4 rounded-lg border border-green-800/50"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)" }}
              >
                <div className="rounded-full bg-green-600 p-2 mt-1">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Digital Progression</h4>
                  <p className="text-gray-300 text-sm mt-1">Watch your digital athlete transform as you advance through the five star levels.</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <div className="px-2 py-1 rounded bg-green-600/20 text-green-400 text-xs">Visual Upgrades</div>
                    <div className="px-2 py-1 rounded bg-green-600/20 text-green-400 text-xs">Skill Tree Unlocks</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4 bg-amber-900/20 backdrop-blur-sm p-4 rounded-lg border border-amber-800/50"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ boxShadow: "0 0 15px rgba(245, 158, 11, 0.3)" }}
              >
                <div className="rounded-full bg-amber-600 p-2 mt-1">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Recruitment Visibility</h4>
                  <p className="text-gray-300 text-sm mt-1">Higher star ratings increase your visibility to college coaches and recruiters.</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="px-2 py-1 rounded bg-amber-600/20 text-amber-400 text-xs">Scout Access</div>
                    <div className="px-2 py-1 rounded bg-amber-600/20 text-amber-400 text-xs">College Connection</div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Call to action */}
            <motion.div 
              className="mt-6 relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button 
                className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
              >
                <div className="flex items-center gap-2">
                  <span>Begin Your Star Path Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
              
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ 
                  boxShadow: [
                    'inset 0 0 20px rgba(59, 130, 246, 0.5)',
                    'inset 0 0 40px rgba(59, 130, 246, 0.7)',
                    'inset 0 0 20px rgba(59, 130, 246, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
        
        {/* PS5-style floating navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-blue-900/30 z-50">
          {levels.map((level) => (
            <button
              key={level.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                level.id === activeLevel 
                  ? `bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg` 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              style={level.id === activeLevel ? { 
                boxShadow: `0 0 10px ${level.color}80` 
              } : {}}
              onClick={() => setActiveLevel(level.id)}
            >
              {level.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}