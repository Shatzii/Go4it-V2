import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Athlete images for the combine testing
const athletes = {
  sprinter: "https://images.unsplash.com/photo-1594737626072-90dc274bc2bd?w=500",
  jumper: "https://images.unsplash.com/photo-1584735174965-48c48d7edfde?w=500",
  agility: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=500",
  strength: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500"
};

// GAR Testing stations
const stations = [
  {
    id: "sprint",
    name: "40-Yard Dash",
    color: "#3b82f6", // blue
    metrics: { speed: 92, agility: 88, focus: 84 }
  },
  {
    id: "vertical",
    name: "Vertical Jump",
    color: "#10b981", // green
    metrics: { power: 90, explosiveness: 94, technique: 85 }
  },
  {
    id: "agility",
    name: "Agility Drill",
    color: "#8b5cf6", // purple
    metrics: { agility: 95, balance: 89, coordination: 91 }
  },
  {
    id: "strength",
    name: "Bench Press",
    color: "#ef4444", // red
    metrics: { strength: 93, endurance: 87, form: 90 }
  }
];

export default function RealGarTestingCommercial() {
  const [activeStation, setActiveStation] = useState(0);
  const [playing, setPlaying] = useState(true);
  
  // Auto-cycle through stations
  useEffect(() => {
    if (!playing) return;
    
    const timer = setTimeout(() => {
      setActiveStation((prev) => (prev + 1) % stations.length);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [activeStation, playing]);
  
  const currentStation = stations[activeStation];
  
  // PlayStation 5 style glow effects
  const psGlow = `0 0 20px ${currentStation.color}40`;
  const psIntenseGlow = `0 0 30px ${currentStation.color}60`;
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border border-blue-900/40 shadow-lg">
        {/* Floating Station Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full border border-blue-900/30">
          {stations.map((station, index) => (
            <button
              key={station.id}
              onClick={() => {
                setActiveStation(index);
                setPlaying(false);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                index === activeStation 
                  ? `bg-gradient-to-br from-${station.color.replace('#', '')} to-${station.color.replace('#', '')}90 text-white shadow-lg` 
                  : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700/80'
              }`}
              style={index === activeStation ? { boxShadow: `0 0 15px ${station.color}80` } : {}}
            >
              {index + 1}
            </button>
          ))}
          <Button 
            size="icon" 
            variant="ghost" 
            className="w-10 h-10 rounded-full bg-gray-800/80 text-white"
            onClick={() => setPlaying(!playing)}
          >
            {playing ? (
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStation.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-[600px]"
          >
            {/* Station Header */}
            <div className="bg-gradient-to-r from-black to-gray-900 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2" style={{ backgroundColor: currentStation.color }}>
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{currentStation.name}</h2>
                    <div className="px-2 py-1 rounded-full bg-blue-900/30 text-blue-300 text-xs">
                      GAR Testing
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">Assessment Station {activeStation + 1} of 4</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-500 text-sm font-medium">LIVE</span>
              </div>
            </div>
            
            {/* Main content area with split layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left panel - Athlete visualization */}
              <div className="relative min-h-[400px] overflow-hidden">
                {currentStation.id === "sprint" && (
                  <div className="relative h-full">
                    {/* Track markings */}
                    <div className="absolute inset-x-8 top-1/3 bottom-1/4 border-2 border-blue-700/30 rounded-lg overflow-hidden">
                      {/* Track lanes */}
                      <div className="absolute top-1/4 w-full h-0.5 bg-blue-700/20"></div>
                      <div className="absolute top-2/4 w-full h-0.5 bg-blue-700/20"></div>
                      <div className="absolute top-3/4 w-full h-0.5 bg-blue-700/20"></div>
                      
                      {/* Distance markers */}
                      <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-blue-700/20"></div>
                      <div className="absolute left-2/4 top-0 bottom-0 w-0.5 bg-blue-700/20"></div>
                      <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-blue-700/20"></div>
                    </div>
                    
                    {/* Athlete image in sprint pose */}
                    <motion.div
                      className="absolute left-[5%] top-[40%] w-32 h-32 overflow-hidden"
                      animate={{ 
                        x: [0, 300, 300],
                        opacity: [1, 1, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        times: [0, 0.7, 1],
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      <img 
                        src={athletes.sprinter}
                        alt="Sprinter"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      
                      {/* Speed Blur Effects */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-500/40"
                        animate={{ opacity: [0, 0.7, 0] }}
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                      />
                    </motion.div>
                    
                    {/* Speed measurement */}
                    <motion.div
                      className="absolute top-[20%] right-[10%] bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-blue-600/30"
                      style={{ boxShadow: psGlow }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-center mb-1">
                        <span className="text-blue-400 text-sm">SPEED RATING</span>
                      </div>
                      <div className="flex justify-center">
                        <motion.div
                          className="text-2xl font-bold text-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {currentStation.metrics.speed}/100
                        </motion.div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">40-YD TIME</span>
                          <motion.span
                            className="text-sm text-white font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            4.53s
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Coach feedback */}
                    <motion.div
                      className="absolute bottom-[10%] left-[10%] right-[10%] p-4 bg-gradient-to-r from-blue-900/30 to-black/70 backdrop-blur-sm rounded-lg border border-blue-800/30"
                      style={{ boxShadow: psGlow }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                    >
                      <h4 className="text-white font-bold mb-1">AI Coach Analysis</h4>
                      <p className="text-gray-300 text-sm">
                        Excellent acceleration and top speed. Drive phase mechanics show elite hip extension. 
                        Recommendation: Focus on arm drive efficiency in the first 10 yards.
                      </p>
                    </motion.div>
                  </div>
                )}
                
                {currentStation.id === "vertical" && (
                  <div className="relative h-full">
                    {/* Measurement background */}
                    <div className="absolute left-[35%] top-[10%] bottom-[20%] w-1 bg-green-900/30"></div>
                    {/* Measurement markings */}
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute left-[33%] w-5 h-0.5 bg-green-800/40 flex items-center"
                        style={{ top: `${20 + i * 6}%` }}
                      >
                        <span className="absolute -left-6 text-[10px] text-green-500/70">{(10 - i) * 6}"</span>
                      </div>
                    ))}
                    
                    {/* Athlete image in jump sequence */}
                    <motion.div
                      className="absolute left-[30%] bottom-[20%] w-32 h-32 overflow-hidden"
                      animate={{ 
                        y: [0, -150, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatDelay: 2,
                        type: "spring"
                      }}
                    >
                      <img 
                        src={athletes.jumper}
                        alt="Jumper"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </motion.div>
                    
                    {/* Jump measurement */}
                    <motion.div
                      className="absolute top-[20%] right-[10%] bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-green-600/30"
                      style={{ boxShadow: `0 0 20px rgba(16, 185, 129, 0.4)` }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-center mb-1">
                        <span className="text-green-400 text-sm">VERTICAL RATING</span>
                      </div>
                      <div className="flex justify-center">
                        <motion.div
                          className="text-2xl font-bold text-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {currentStation.metrics.power}/100
                        </motion.div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">JUMP HEIGHT</span>
                          <motion.span
                            className="text-sm text-white font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            36.5"
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Coach feedback */}
                    <motion.div
                      className="absolute bottom-[10%] left-[10%] right-[10%] p-4 bg-gradient-to-r from-green-900/30 to-black/70 backdrop-blur-sm rounded-lg border border-green-800/30"
                      style={{ boxShadow: `0 0 20px rgba(16, 185, 129, 0.3)` }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                    >
                      <h4 className="text-white font-bold mb-1">AI Coach Analysis</h4>
                      <p className="text-gray-300 text-sm">
                        Excellent power generation through the hips and calves. Landing mechanics show good balance control.
                        Recommendation: Add plyometric training to improve explosiveness through the stretch-shortening cycle.
                      </p>
                    </motion.div>
                  </div>
                )}
                
                {currentStation.id === "agility" && (
                  <div className="relative h-full">
                    {/* Agility cone setup */}
                    <div className="absolute left-[20%] top-[40%] w-4 h-4 bg-orange-500 transform rotate-45"></div>
                    <div className="absolute left-[50%] top-[30%] w-4 h-4 bg-orange-500 transform rotate-45"></div>
                    <div className="absolute left-[80%] top-[40%] w-4 h-4 bg-orange-500 transform rotate-45"></div>
                    <div className="absolute left-[50%] top-[60%] w-4 h-4 bg-orange-500 transform rotate-45"></div>
                    
                    {/* Connecting lines */}
                    <div className="absolute left-[22%] top-[42%] w-[30%] h-0.5 bg-gray-700 rotate-[-12deg]"></div>
                    <div className="absolute left-[52%] top-[32%] w-[30%] h-0.5 bg-gray-700 rotate-[12deg]"></div>
                    <div className="absolute left-[52%] top-[42%] w-[30%] h-0.5 bg-gray-700 rotate-[-192deg]"></div>
                    <div className="absolute left-[22%] top-[52%] w-[30%] h-0.5 bg-gray-700 rotate-[32deg]"></div>
                    
                    {/* Athlete image in agility sequence */}
                    <motion.div
                      className="absolute left-[20%] top-[40%] w-28 h-28 overflow-hidden z-10"
                      animate={{ 
                        x: [0, 190, 190, 0, 0],
                        y: [0, -60, 100, 40, 0],
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "linear"
                      }}
                    >
                      <img 
                        src={athletes.agility}
                        alt="Agility drill"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      
                      {/* Motion blur effect */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-tr from-transparent to-purple-500/30"
                        animate={{ opacity: [0, 0.3, 0.3, 0.3, 0] }}
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
                      />
                    </motion.div>
                    
                    {/* Agility measurement */}
                    <motion.div
                      className="absolute top-[20%] right-[10%] bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-purple-600/30"
                      style={{ boxShadow: `0 0 20px rgba(139, 92, 246, 0.4)` }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-center mb-1">
                        <span className="text-purple-400 text-sm">AGILITY RATING</span>
                      </div>
                      <div className="flex justify-center">
                        <motion.div
                          className="text-2xl font-bold text-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {currentStation.metrics.agility}/100
                        </motion.div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">3-CONE TIME</span>
                          <motion.span
                            className="text-sm text-white font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            6.81s
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Coach feedback */}
                    <motion.div
                      className="absolute bottom-[10%] left-[10%] right-[10%] p-4 bg-gradient-to-r from-purple-900/30 to-black/70 backdrop-blur-sm rounded-lg border border-purple-800/30"
                      style={{ boxShadow: `0 0 20px rgba(139, 92, 246, 0.3)` }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                    >
                      <h4 className="text-white font-bold mb-1">AI Coach Analysis</h4>
                      <p className="text-gray-300 text-sm">
                        Elite change-of-direction skills with minimal deceleration in transitions. 
                        Footwork shows excellent precision and body control.
                        Recommendation: Work on hand-eye coordination drills to enhance multi-tasking during direction changes.
                      </p>
                    </motion.div>
                  </div>
                )}
                
                {currentStation.id === "strength" && (
                  <div className="relative h-full">
                    {/* Bench setup */}
                    <div className="absolute left-[30%] top-[50%] w-[40%] h-[10%] bg-gray-800 rounded-md"></div>
                    <div className="absolute left-[25%] top-[55%] w-[5%] h-[10%] bg-gray-700 rounded-md"></div>
                    <div className="absolute left-[70%] top-[55%] w-[5%] h-[10%] bg-gray-700 rounded-md"></div>
                    
                    {/* Barbell */}
                    <motion.div
                      className="absolute left-[25%] top-[40%] w-[50%] h-[2%] bg-gray-400 rounded-full overflow-hidden"
                      animate={{ 
                        y: [0, -30, 0],
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      }}
                    >
                      <div className="absolute left-[5%] top-0 bottom-0 w-[5%] bg-gray-600 rounded-full"></div>
                      <div className="absolute right-[5%] top-0 bottom-0 w-[5%] bg-gray-600 rounded-full"></div>
                    </motion.div>
                    
                    {/* Athlete */}
                    <motion.div
                      className="absolute left-[35%] top-[44%] w-[30%] h-[20%] overflow-hidden"
                      animate={{ 
                        y: [0, -20, 0],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      }}
                    >
                      <img 
                        src={athletes.strength}
                        alt="Bench press"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </motion.div>
                    
                    {/* Strength measurement */}
                    <motion.div
                      className="absolute top-[20%] right-[10%] bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-red-600/30"
                      style={{ boxShadow: `0 0 20px rgba(239, 68, 68, 0.4)` }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-center mb-1">
                        <span className="text-red-400 text-sm">STRENGTH RATING</span>
                      </div>
                      <div className="flex justify-center">
                        <motion.div
                          className="text-2xl font-bold text-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {currentStation.metrics.strength}/100
                        </motion.div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">BENCH MAX</span>
                          <motion.span
                            className="text-sm text-white font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            275 lbs
                          </motion.span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">REPS @ 225</span>
                          <motion.span
                            className="text-sm text-white font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            12
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Rep counter */}
                    <motion.div
                      className="absolute top-[40%] left-[10%] px-4 py-2 bg-red-900/20 backdrop-blur-sm rounded-lg border border-red-900/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <span className="text-xs text-red-400">REPS</span>
                      <div className="text-2xl font-bold text-white font-mono">
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                        >
                          12
                        </motion.span>
                      </div>
                    </motion.div>
                    
                    {/* Coach feedback */}
                    <motion.div
                      className="absolute bottom-[10%] left-[10%] right-[10%] p-4 bg-gradient-to-r from-red-900/30 to-black/70 backdrop-blur-sm rounded-lg border border-red-800/30"
                      style={{ boxShadow: `0 0 20px rgba(239, 68, 68, 0.3)` }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                    >
                      <h4 className="text-white font-bold mb-1">AI Coach Analysis</h4>
                      <p className="text-gray-300 text-sm">
                        Excellent upper body strength with good form throughout the movement. 
                        Core stability maintains proper technique under load.
                        Recommendation: Incorporate more eccentric training to improve overall strength capacity.
                      </p>
                    </motion.div>
                  </div>
                )}
              </div>
              
              {/* Right panel - GAR Analysis */}
              <div className="relative p-6 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                {/* PS5-style grid background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  {/* GAR Score Header */}
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">GAR Score Analysis</h3>
                      <p className="text-gray-400 text-sm">Growth & Ability Rating</p>
                    </div>
                    <div className="relative">
                      <motion.div 
                        className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center border-2"
                        style={{ 
                          borderColor: currentStation.color,
                          boxShadow: psGlow 
                        }}
                        animate={{ 
                          boxShadow: [psGlow, psIntenseGlow, psGlow]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-2xl font-bold text-white">84</span>
                      </motion.div>
                      <motion.div 
                        className="absolute -inset-1 rounded-full opacity-20"
                        style={{ backgroundColor: currentStation.color }}
                        animate={{ 
                          opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  
                  {/* Category Scores */}
                  <motion.div 
                    className="mb-6 grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-blue-900/20 p-4" style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)" }}>
                      <h4 className="text-blue-400 font-medium mb-2">Physical</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Speed</span>
                            <span className="text-white text-sm">92/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '92%' }}
                              transition={{ duration: 1, delay: 0.1 }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Strength</span>
                            <span className="text-white text-sm">85/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '85%' }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Agility</span>
                            <span className="text-white text-sm">88/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '88%' }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-900/20 p-4" style={{ boxShadow: "0 0 15px rgba(139, 92, 246, 0.2)" }}>
                      <h4 className="text-purple-400 font-medium mb-2">Mental</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Focus</span>
                            <span className="text-white text-sm">82/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-purple-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '82%' }}
                              transition={{ duration: 1, delay: 0.1 }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Confidence</span>
                            <span className="text-white text-sm">86/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-purple-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '86%' }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Decision Making</span>
                            <span className="text-white text-sm">83/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-purple-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '83%' }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Technical Skills */}
                  <motion.div 
                    className="mb-6 bg-black/40 backdrop-blur-sm rounded-lg border border-green-900/20 p-4"
                    style={{ boxShadow: "0 0 15px rgba(16, 185, 129, 0.2)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h4 className="text-green-400 font-medium mb-2">Technical</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Technique</span>
                            <span className="text-white text-sm">87/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-green-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '87%' }}
                              transition={{ duration: 1, delay: 0.1 }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Game IQ</span>
                            <span className="text-white text-sm">84/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-green-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '84%' }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Position Skills</span>
                            <span className="text-white text-sm">89/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-green-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '89%' }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm">Adaptability</span>
                            <span className="text-white text-sm">86/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-green-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '86%' }}
                              transition={{ duration: 1, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* ADHD Analysis */}
                  <motion.div 
                    className="bg-black/40 backdrop-blur-sm rounded-lg border border-blue-900/20 p-4"
                    style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h4 className="text-blue-400 font-medium mb-2">ADHD-Specific Analysis</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Our analysis identifies strengths that can be leveraged for elite performance.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-600 mt-0.5 flex-shrink-0"></div>
                        <span className="text-white text-sm">Hyperfocus during competition</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-600 mt-0.5 flex-shrink-0"></div>
                        <span className="text-white text-sm">Enhanced creativity in gameplay</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-purple-600 mt-0.5 flex-shrink-0"></div>
                        <span className="text-white text-sm">Quick reaction time</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-600 mt-0.5 flex-shrink-0"></div>
                        <span className="text-white text-sm">Adaptable to changing scenarios</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Navigation arrows */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white"
                onClick={() => {
                  setActiveStation((prev) => (prev - 1 + stations.length) % stations.length);
                  setPlaying(false);
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white"
                onClick={() => {
                  setActiveStation((prev) => (prev + 1) % stations.length);
                  setPlaying(false);
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}