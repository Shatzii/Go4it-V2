import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export default function GarTestingCommercial() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-black/60 rounded-xl overflow-hidden shadow-lg border border-cyan-900/50">
      <div className="flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900 to-blue-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-500 text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">GAR Testing Combine</h2>
          </div>
          <div className="text-white font-mono px-3 py-1 bg-black/30 rounded-md text-sm">
            LIVE DEMONSTRATION
          </div>
        </div>
        
        {/* Main content - Combine Testing Field */}
        <div className="relative min-h-[500px] bg-gradient-to-b from-gray-900 to-black p-6">
          {/* Field markings */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 right-0 top-[60%] h-[2px] bg-white/20"></div>
            <div className="absolute left-1/4 top-[50%] bottom-0 w-[2px] bg-white/20"></div>
            <div className="absolute left-2/4 top-[50%] bottom-0 w-[2px] bg-white/20"></div>
            <div className="absolute left-3/4 top-[50%] bottom-0 w-[2px] bg-white/20"></div>
            
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
          
          {/* Station labels */}
          <div className="absolute top-6 left-0 right-0 flex justify-around px-6">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mx-auto mb-2">1</div>
              <span className="text-blue-400 text-sm font-medium">40-Yard Dash</span>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mx-auto mb-2">2</div>
              <span className="text-green-400 text-sm font-medium">Vertical Jump</span>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mx-auto mb-2">3</div>
              <span className="text-purple-400 text-sm font-medium">Agility Drill</span>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold mx-auto mb-2">4</div>
              <span className="text-red-400 text-sm font-medium">Bench Press</span>
            </div>
          </div>
          
          {/* GAR Rating Display */}
          <motion.div
            className="absolute top-[85px] left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-black/70 backdrop-blur-sm rounded-lg border border-cyan-800/50 p-4 overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl text-white font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Growth & Ability Rating
                </span>
              </h3>
              <p className="text-cyan-300 text-sm mt-1">Real-time performance assessment</p>
            </div>
            
            <div className="flex">
              {/* Left Side - Radar Chart */}
              <div className="w-1/2 relative flex items-center justify-center">
                <div className="relative w-36 h-36">
                  <div className="absolute inset-0 border border-cyan-500/30 rounded-full"></div>
                  <div className="absolute inset-[20%] border border-cyan-500/50 rounded-full"></div>
                  <div className="absolute inset-[40%] border border-cyan-500/70 rounded-full"></div>
                  <div className="absolute inset-[60%] border border-cyan-500 rounded-full"></div>
                  
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 text-[10px]">Physical</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-cyan-400 text-[10px]">Mental</div>
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 text-[10px]">Technical</div>
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-cyan-400 text-[10px]">Focus</div>
                  
                  {/* Radar Fill */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <motion.path
                        d="M50,10 L25,50 L50,90 L75,50 Z"
                        fill="rgba(6, 182, 212, 0.2)"
                        stroke="#06b6d4"
                        strokeWidth="1"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                      />
                    </svg>
                  </motion.div>
                  
                  {/* Score in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="bg-cyan-500/20 backdrop-blur-sm rounded-full h-16 w-16 flex items-center justify-center border border-cyan-500/50"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <motion.span 
                        className="text-white font-bold text-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        84
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Metrics */}
              <div className="w-1/2 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-200 text-sm">Speed</span>
                    <span className="text-white text-sm font-mono">85/100</span>
                  </div>
                  <motion.div
                    className="h-2 bg-gray-800 rounded-full overflow-hidden"
                    initial={{ width: '100%' }}
                  >
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '85%' }}
                      transition={{ delay: 0.3, duration: 0.7 }}
                    />
                  </motion.div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-200 text-sm">Vertical</span>
                    <span className="text-white text-sm font-mono">78/100</span>
                  </div>
                  <motion.div
                    className="h-2 bg-gray-800 rounded-full overflow-hidden"
                    initial={{ width: '100%' }}
                  >
                    <motion.div
                      className="h-full bg-green-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '78%' }}
                      transition={{ delay: 0.4, duration: 0.7 }}
                    />
                  </motion.div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-200 text-sm">Agility</span>
                    <span className="text-white text-sm font-mono">90/100</span>
                  </div>
                  <motion.div
                    className="h-2 bg-gray-800 rounded-full overflow-hidden"
                    initial={{ width: '100%' }}
                  >
                    <motion.div
                      className="h-full bg-purple-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '90%' }}
                      transition={{ delay: 0.5, duration: 0.7 }}
                    />
                  </motion.div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-200 text-sm">Strength</span>
                    <span className="text-white text-sm font-mono">82/100</span>
                  </div>
                  <motion.div
                    className="h-2 bg-gray-800 rounded-full overflow-hidden"
                    initial={{ width: '100%' }}
                  >
                    <motion.div
                      className="h-full bg-red-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '82%' }}
                      transition={{ delay: 0.6, duration: 0.7 }}
                    />
                  </motion.div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-200 text-sm">Focus</span>
                    <span className="text-white text-sm font-mono">88/100</span>
                  </div>
                  <motion.div
                    className="h-2 bg-gray-800 rounded-full overflow-hidden"
                    initial={{ width: '100%' }}
                  >
                    <motion.div
                      className="h-full bg-yellow-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '88%' }}
                      transition={{ delay: 0.7, duration: 0.7 }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Animated Athletes Doing Combine Tests */}
          {/* 40-Yard Dash */}
          <motion.div 
            className="absolute left-[10%] top-[70%] w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
            initial={{ x: 0 }}
            animate={{ 
              x: [0, 300],
              y: [0, -2, 0, -2, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut" 
            }}
          >
            <span className="text-white text-xs font-bold">1</span>
          </motion.div>
          
          {/* Sprint Timer */}
          <motion.div
            className="absolute left-[80%] top-[69%] bg-black/60 backdrop-blur-sm px-3 py-2 rounded border border-blue-500/30 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              repeatDelay: 2.5,
              times: [0, 0.1, 0.8, 1]
            }}
          >
            <div className="flex flex-col items-center">
              <span className="text-blue-400 text-xs">40-YD TIME</span>
              <span className="text-white font-mono font-bold">4.53s</span>
            </div>
          </motion.div>
          
          {/* Vertical Jump */}
          <motion.div
            className="absolute left-[25%] top-[85%] w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
            animate={{ 
              y: [0, -80, 0],
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity,
              repeatDelay: 2.8,
              ease: "easeOut"
            }}
          >
            <span className="text-white text-xs font-bold">2</span>
          </motion.div>
          
          {/* Vertical Jump Measurement */}
          <motion.div
            className="absolute left-[27%] top-[55%] bg-black/60 backdrop-blur-sm px-3 py-2 rounded border border-green-500/30 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatDelay: 2.5,
              times: [0, 0.2, 0.7, 1],
              delay: 0.5
            }}
          >
            <div className="flex flex-col items-center">
              <span className="text-green-400 text-xs">VERT</span>
              <span className="text-white font-mono font-bold">36.5"</span>
            </div>
          </motion.div>
          
          {/* Agility Drill */}
          <motion.div
            className="absolute left-[50%] top-[85%] w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
            animate={{ 
              x: [0, 30, 0, -30, 0],
              y: [0, -30, -50, -30, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatDelay: 2,
              ease: "linear"
            }}
          >
            <span className="text-white text-xs font-bold">3</span>
          </motion.div>
          
          {/* Agility Cones */}
          <div className="absolute left-[43%] top-[82%] w-3 h-3 bg-orange-500/70 transform rotate-45 border border-orange-400"></div>
          <div className="absolute left-[50%] top-[75%] w-3 h-3 bg-orange-500/70 transform rotate-45 border border-orange-400"></div>
          <div className="absolute left-[57%] top-[82%] w-3 h-3 bg-orange-500/70 transform rotate-45 border border-orange-400"></div>
          
          {/* Agility Timer */}
          <motion.div
            className="absolute left-[55%] top-[65%] bg-black/60 backdrop-blur-sm px-3 py-2 rounded border border-purple-500/30 text-sm"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-xs">3-CONE</span>
              <motion.span
                className="text-white font-mono font-bold"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.5 }}
              >
                6.81s
              </motion.span>
            </div>
          </motion.div>
          
          {/* Bench Press */}
          <motion.div
            className="absolute left-[75%] top-[85%] w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
            animate={{ 
              y: [0, -7, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.4, 
              repeat: Infinity,
              repeatDelay: 0.2,
            }}
          >
            <span className="text-white text-xs font-bold">4</span>
          </motion.div>
          
          {/* Bench Press Bar */}
          <motion.div
            className="absolute left-[67%] top-[84%] w-16 h-2 bg-gray-400 rounded-full shadow-lg"
            animate={{ 
              y: [0, -7, 0],
            }}
            transition={{ 
              duration: 0.4, 
              repeat: Infinity,
              repeatDelay: 0.2,
            }}
          />
          
          {/* Rep Counter */}
          <motion.div
            className="absolute left-[75%] top-[65%] bg-black/60 backdrop-blur-sm px-3 py-2 rounded border border-red-500/30 text-sm"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center">
              <span className="text-red-400 text-xs">BENCH REPS</span>
              <motion.span
                className="text-white font-mono font-bold"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 0.3 }}
              >
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {/* Count displayed statically but animated with opacity changes */}
                  12
                </motion.span>
                <span> @ 225lb</span>
              </motion.span>
            </div>
          </motion.div>
          
          {/* Status Indicators */}
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-green-400 text-xs">Live Analysis</span>
          </div>
          
          <div className="absolute left-4 bottom-4 flex items-center gap-2">
            <div className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-bold">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                AI COACH MONITORING
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}