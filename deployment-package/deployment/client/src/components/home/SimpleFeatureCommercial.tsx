import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import {
  Brain,
  Video as VideoIcon,
  BarChart3,
  Leaf,
  BookOpen,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// Simple feature data
const features = [
  {
    id: 'ai-coach',
    title: 'AI Coaching',
    description: 'Professional-level coaching powered by AI for athletes with ADHD',
    icon: Brain,
    color: '#2563eb',
    bgImage: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    demo: (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
        {/* Animated player dots */}
        <motion.div 
          className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10"
          animate={{ 
            x: [0, 40, 0, -40, 0],
            y: [0, -40, -80, -40, 0],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-white font-bold">1</span>
        </motion.div>
        
        {/* Ball */}
        <motion.div
          className="absolute w-4 h-4 bg-orange-500 rounded-full shadow-lg"
          animate={{ 
            x: [0, 40, 0, -40, 0],
            y: [0, -40, -80, -40, 0],
            scale: [1, 0.8, 1, 0.8, 1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.1
          }}
        />
        
        {/* Coach Indicator */}
        <motion.div className="absolute right-4 bottom-4 bg-blue-700/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-blue-400">
          <div className="flex items-center gap-2">
            <Brain className="text-white w-6 h-6" />
            <div>
              <p className="text-white text-xs">AI Analysis</p>
              <motion.div 
                className="h-1 bg-blue-400 rounded-full mt-1" 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    )
  },
  {
    id: 'video-analysis',
    title: 'Video Analysis',
    description: 'Upload your game footage for detailed AI performance analysis',
    icon: VideoIcon,
    color: '#0ea5e9',
    bgImage: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)',
    demo: (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
        {/* Video Frame */}
        <div className="w-[80%] h-[70%] border-2 border-blue-400/50 rounded-md bg-black/30 overflow-hidden">
          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-black/50 backdrop-blur-sm flex items-center px-2">
            <motion.div 
              className="h-1 bg-blue-400 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
          
          {/* Player Movement */}
          <motion.div
            className="absolute w-6 h-6 bg-blue-500 rounded-full"
            animate={{
              x: [40, 80, 120, 160, 200],
              y: [80, 40, 80, 40, 80],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "loop" 
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">1</span>
          </motion.div>
        </div>
        
        {/* Analysis Overlay */}
        <motion.div
          className="absolute top-4 right-4 bg-blue-500/80 backdrop-blur-sm p-2 rounded px-3 py-1 text-white text-xs font-medium"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Speed: 18.2 mph
        </motion.div>
        
        <motion.div
          className="absolute bottom-8 left-4 bg-green-500/80 backdrop-blur-sm p-2 rounded px-3 py-1 text-white text-xs font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          Technique: 87%
        </motion.div>
      </div>
    )
  },
  {
    id: 'gar-rating',
    title: 'GAR Rating',
    description: 'Comprehensive growth and ability rating system for neurodivergent athletes',
    icon: BarChart3,
    color: '#06b6d4',
    bgImage: 'linear-gradient(135deg, #155e75 0%, #06b6d4 100%)',
    demo: (
      <div className="relative h-full w-full overflow-hidden">
        {/* Combine Testing Field */}
        <div className="absolute inset-0">
          {/* Field markings */}
          <div className="absolute left-0 right-0 top-[70%] h-[2px] bg-white/20"></div>
          <div className="absolute left-1/4 top-[60%] bottom-0 w-[2px] bg-white/20"></div>
          <div className="absolute left-2/4 top-[60%] bottom-0 w-[2px] bg-white/20"></div>
          <div className="absolute left-3/4 top-[60%] bottom-0 w-[2px] bg-white/20"></div>
        </div>
        
        {/* GAR Radar Chart in background */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32">
          <div className="absolute inset-0 border border-cyan-500/30 rounded-full"></div>
          <div className="absolute inset-[20%] border border-cyan-500/50 rounded-full"></div>
          <div className="absolute inset-[40%] border border-cyan-500/70 rounded-full"></div>
          <div className="absolute inset-[60%] border border-cyan-500 rounded-full"></div>
          
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
        </div>
        
        {/* Animated Athletes Doing Combine Tests */}
        
        {/* 40-Yard Dash */}
        <motion.div 
          className="absolute left-[10%] top-[70%] w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
          initial={{ x: 0 }}
          animate={{ 
            x: [0, 240],
            y: [0, -2, 0, -2, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatDelay: 3.5,
            ease: "easeInOut" 
          }}
        >
          <span className="text-white text-xs font-bold">1</span>
        </motion.div>
        
        {/* Sprint Timer */}
        <motion.div
          className="absolute left-[85%] top-[70%] bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatDelay: 3,
            times: [0, 0.1, 0.8, 1]
          }}
        >
          <span className="text-cyan-400 font-mono font-bold">4.53s</span>
        </motion.div>
        
        {/* Vertical Jump */}
        <motion.div
          className="absolute left-[25%] top-[85%] w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
          animate={{ 
            y: [0, -60, 0],
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
          className="absolute left-[27%] top-[55%] bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs"
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
          <span className="text-green-400 font-mono font-bold">36.5"</span>
        </motion.div>
        
        {/* Agility Drill */}
        <motion.div
          className="absolute left-[50%] top-[85%] w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
          animate={{ 
            x: [0, 20, 0, -20, 0],
            y: [0, -20, -30, -20, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatDelay: 2,
            ease: "linear"
          }}
        >
          <span className="text-white text-xs font-bold">3</span>
        </motion.div>
        
        {/* Agility Cones */}
        <div className="absolute left-[45%] top-[82%] w-2 h-2 bg-orange-500/70 transform rotate-45"></div>
        <div className="absolute left-[50%] top-[77%] w-2 h-2 bg-orange-500/70 transform rotate-45"></div>
        <div className="absolute left-[55%] top-[82%] w-2 h-2 bg-orange-500/70 transform rotate-45"></div>
        
        {/* Bench Press */}
        <motion.div
          className="absolute left-[75%] top-[85%] w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ 
            y: [0, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
        >
          <span className="text-white text-xs font-bold">4</span>
        </motion.div>
        
        {/* Bench Press Bar */}
        <motion.div
          className="absolute left-[69%] top-[83%] w-12 h-1 bg-gray-400 rounded-full"
          animate={{ 
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
        />
        
        {/* Rep Counter */}
        <motion.div
          className="absolute left-[75%] top-[75%] bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-red-400 font-mono font-bold">
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.5 }}
            >
              Rep: 12
            </motion.span>
          </span>
        </motion.div>
        
        {/* GAR Score Calculation */}
        <motion.div
          className="absolute top-[25%] left-1/2 -translate-x-1/2 bg-cyan-900/80 backdrop-blur-sm p-3 rounded-lg border border-cyan-500/30 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-2">
            <span className="text-cyan-400 font-bold text-sm">GAR SCORE: </span>
            <motion.span 
              className="text-white font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              84/100
            </motion.span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-cyan-200">Speed:</span>
              <motion.div
                className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden"
                initial={{ width: 12 }}
                animate={{ width: 12 }}
              >
                <motion.div
                  className="h-full bg-cyan-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '85%' }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                />
              </motion.div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-cyan-200">Strength:</span>
              <motion.div
                className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden"
                initial={{ width: 12 }}
                animate={{ width: 12 }}
              >
                <motion.div
                  className="h-full bg-cyan-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '78%' }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                />
              </motion.div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-cyan-200">Agility:</span>
              <motion.div
                className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden"
                initial={{ width: 12 }}
                animate={{ width: 12 }}
              >
                <motion.div
                  className="h-full bg-cyan-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '90%' }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                />
              </motion.div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-cyan-200">Focus:</span>
              <motion.div
                className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden"
                initial={{ width: 12 }}
                animate={{ width: 12 }}
              >
                <motion.div
                  className="h-full bg-cyan-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '82%' }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Exercise Labels */}
        <div className="absolute left-[10%] bottom-2 text-[10px] text-cyan-400">40-Yard Dash</div>
        <div className="absolute left-[25%] bottom-2 text-[10px] text-cyan-400">Vertical Jump</div>
        <div className="absolute left-[50%] bottom-2 text-[10px] text-cyan-400">Agility Drill</div>
        <div className="absolute left-[75%] bottom-2 text-[10px] text-cyan-400">Bench Press</div>
      </div>
    )
  },
  {
    id: 'skill-tree',
    title: 'Skill Tree',
    description: 'Visualize your athletic development with gamified progression paths',
    icon: Leaf,
    color: '#3b82f6',
    bgImage: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    demo: (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
        {/* Skill Tree Nodes */}
        <div className="relative w-full h-full">
          {/* Root Node */}
          <motion.div
            className="absolute left-1/2 bottom-8 -translate-x-1/2 w-12 h-12 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Leaf className="w-6 h-6 text-white" />
          </motion.div>
          
          {/* Connecting Lines */}
          <motion.div
            className="absolute left-1/2 bottom-20 -translate-x-1/2 w-1 h-16 bg-blue-400"
            initial={{ height: 0 }}
            animate={{ height: 16 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
          
          {/* Level 1 Nodes */}
          <motion.div
            className="absolute left-1/2 bottom-[calc(50%+1rem)] -translate-x-1/2 w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <span className="text-white font-bold text-xs">1</span>
          </motion.div>
          
          {/* Connecting Lines Level 1 to 2 */}
          <motion.div
            className="absolute left-[calc(50%-2rem)] bottom-[calc(50%+1.5rem)] w-16 h-1 bg-blue-400 rotate-45"
            initial={{ width: 0 }}
            animate={{ width: 16 }}
            transition={{ duration: 0.3, delay: 1.1 }}
          />
          
          <motion.div
            className="absolute left-[calc(50%+1rem)] bottom-[calc(50%+1.5rem)] w-16 h-1 bg-blue-400 -rotate-45"
            initial={{ width: 0 }}
            animate={{ width: 16 }}
            transition={{ duration: 0.3, delay: 1.1 }}
          />
          
          {/* Level 2 Nodes */}
          <motion.div
            className="absolute left-[calc(50%-3rem)] top-20 w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.4 }}
          >
            <span className="text-white font-bold text-xs">2</span>
          </motion.div>
          
          <motion.div
            className="absolute left-[calc(50%+2rem)] top-20 w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.4 }}
          >
            <span className="text-white font-bold text-xs">3</span>
          </motion.div>
          
          {/* Locked Node */}
          <motion.div
            className="absolute left-1/2 top-8 -translate-x-1/2 w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-500 flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.7 }}
          >
            <span className="text-white">🔒</span>
          </motion.div>
        </div>
      </div>
    )
  },
  {
    id: 'academics',
    title: 'Academic Tracking',
    description: 'Monitor classroom progress alongside athletic development',
    icon: BookOpen,
    color: '#0891b2',
    bgImage: 'linear-gradient(135deg, #164e63 0%, #0891b2 100%)',
    demo: (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
        {/* Grade Report Card */}
        <motion.div
          className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-lg border border-cyan-500/50 p-4 shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-white text-center font-bold mb-3 border-b border-cyan-500/30 pb-2">Academic Report</h3>
          
          {/* GPA */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-cyan-100 text-sm">Overall GPA:</span>
            <motion.span 
              className="text-white font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              3.87
            </motion.span>
          </div>
          
          {/* Subject Grades */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-cyan-100 text-sm">Mathematics:</span>
              <motion.div 
                className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden"
                initial={{ width: 20 }}
                animate={{ width: 80 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.div 
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '90%' }}
                  transition={{ delay: 1, duration: 0.5 }}
                />
              </motion.div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-cyan-100 text-sm">Science:</span>
              <motion.div 
                className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden"
                initial={{ width: 20 }}
                animate={{ width: 80 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <motion.div 
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                />
              </motion.div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-cyan-100 text-sm">English:</span>
              <motion.div 
                className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden"
                initial={{ width: 20 }}
                animate={{ width: 80 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                <motion.div 
                  className="h-full bg-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                />
              </motion.div>
            </div>
          </div>
          
          {/* NCAA Eligibility */}
          <motion.div 
            className="mt-4 p-2 bg-cyan-600/30 rounded border border-cyan-500/50 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
          >
            <span className="text-white text-xs">NCAA Eligibility: <span className="font-bold text-green-400">QUALIFIED</span></span>
          </motion.div>
        </motion.div>
      </div>
    )
  }
];

interface SimpleFeatureCommercialProps {
  className?: string;
}

export default function SimpleFeatureCommercial({ className }: SimpleFeatureCommercialProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentFeature = features[currentIndex];
  
  // Auto-rotate features
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [currentIndex]);
  
  const nextFeature = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };
  
  const prevFeature = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            PlayStation 5-Quality
          </span> Features
        </h2>
        <p className="text-blue-300 mt-1">Experience next-generation sports development</p>
      </div>
      
      <div className="relative overflow-hidden rounded-xl">
        {/* Feature Display */}
        <motion.div
          key={currentFeature.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full flex flex-col md:flex-row rounded-xl overflow-hidden"
          style={{
            minHeight: "400px",
            background: currentFeature.bgImage
          }}
        >
          {/* Background effects */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Demo area */}
          <div className="w-full md:w-2/3 relative p-6 flex items-center justify-center min-h-[300px]">
            {currentFeature.demo}
          </div>
          
          {/* Feature info */}
          <div className="w-full md:w-1/3 p-6 bg-black/30 backdrop-blur-sm flex flex-col justify-center relative">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center md:block hidden">
              {React.createElement(currentFeature.icon, { 
                className: "w-6 h-6", 
                style: { color: currentFeature.color }
              })}
            </div>
            
            <div className="flex items-center gap-3 md:hidden mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: currentFeature.color }}>
                {React.createElement(currentFeature.icon, { className: "w-5 h-5 text-white" })}
              </div>
              <h3 className="text-2xl font-bold text-white">{currentFeature.title}</h3>
            </div>
            
            <h3 className="text-2xl font-bold text-white hidden md:block">{currentFeature.title}</h3>
            <p className="text-gray-200 mt-2">{currentFeature.description}</p>
            
            <div className="mt-6 space-y-2">
              {/* Feature specific details */}
              {currentFeature.id === 'ai-coach' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">ADHD-focused training strategies</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">Personalized feedback system</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">Advanced motion analysis</p>
                  </div>
                </>
              )}
              
              {currentFeature.id === 'video-analysis' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">AI-powered technique breakdown</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">Performance metrics tracking</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">Highlights generation</p>
                  </div>
                </>
              )}
              
              {currentFeature.id === 'gar-rating' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">Physical & technical analysis</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">Mental focus assessment</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">Growth tracking over time</p>
                  </div>
                </>
              )}
              
              {currentFeature.id === 'skill-tree' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">Unlock abilities as you grow</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">Sport-specific development paths</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">Real-world achievements tracker</p>
                  </div>
                </>
              )}
              
              {currentFeature.id === 'academics' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">GPA monitoring</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">NCAA eligibility tracking</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <p className="text-gray-300 text-sm">ADHD-optimized study plans</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Navigation buttons */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 z-10 hidden md:flex"
          onClick={prevFeature}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 z-10 hidden md:flex"
          onClick={nextFeature}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Feature navigation dots */}
      <div className="flex justify-center gap-2 mt-4">
        {features.map((feature, index) => (
          <button
            key={feature.id}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-10 bg-blue-500' 
                : 'w-2 bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`View ${feature.title} feature`}
          />
        ))}
      </div>
    </div>
  );
}