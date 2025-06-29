import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Play, ChevronRight, ChevronLeft, Star, Crown, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

// SVG Athlete components for fully animated characters
const SprintAthlete = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.svg
      width="100"
      height="150"
      viewBox="0 0 100 150"
      initial={{ x: 10 }}
      animate={isActive ? { 
        x: [10, 280],
        y: [0, 0, -5, 0, -5, 0]
      } : { x: 10 }}
      transition={isActive ? { 
        x: { duration: 3, ease: "easeInOut" },
        y: { duration: 3, repeat: 1, times: [0, 0.2, 0.3, 0.5, 0.7, 1] } 
      } : {}}
      className="absolute top-[40%] left-[5%]"
    >
      {/* Body */}
      <motion.g
        animate={isActive ? {
          rotate: [-5, 5, -5, 5, -5],
          y: [0, -2, 0, -2, 0]
        } : {}}
        transition={isActive ? { 
          duration: 0.8, 
          repeat: Infinity,
          repeatType: "mirror" 
        } : {}}
      >
        {/* Torso */}
        <motion.rect 
          x="40" 
          y="50" 
          width="20" 
          height="40" 
          rx="5" 
          fill="#1d4ed8" 
          stroke="black" 
          strokeWidth="1"
        />
        
        {/* Head */}
        <motion.circle 
          cx="50" 
          cy="35" 
          r="15" 
          fill="#7c3aed" 
          stroke="black"
          strokeWidth="1"
        />
        
        {/* Face */}
        <motion.circle cx="45" cy="32" r="2" fill="black" />
        <motion.circle cx="55" cy="32" r="2" fill="black" />
        <motion.path d="M45 40 Q50 45 55 40" stroke="black" fill="transparent" strokeWidth="1" />
        
        {/* Arms */}
        <motion.g
          animate={isActive ? {
            rotate: [-30, 30, -30, 30, -30],
            y: [0, -2, 0, -2, 0],
            x: [0, 2, 0, 2, 0]
          } : {}}
          transition={isActive ? { 
            duration: 0.4, 
            repeat: Infinity,
            repeatType: "mirror" 
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="30" y="50" width="10" height="30" rx="4" fill="#1d4ed8" stroke="black" strokeWidth="1" />
        </motion.g>
        
        <motion.g
          animate={isActive ? {
            rotate: [30, -30, 30, -30, 30],
            y: [0, -2, 0, -2, 0],
            x: [0, -2, 0, -2, 0]
          } : {}}
          transition={isActive ? { 
            duration: 0.4, 
            repeat: Infinity,
            repeatType: "mirror" 
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="60" y="50" width="10" height="30" rx="4" fill="#1d4ed8" stroke="black" strokeWidth="1" />
        </motion.g>
        
        {/* Legs */}
        <motion.g
          animate={isActive ? {
            rotate: [30, -30, 30, -30, 30],
            y: [0, -5, 0, -5, 0]
          } : {}}
          transition={isActive ? { 
            duration: 0.4, 
            repeat: Infinity,
            repeatType: "mirror" 
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="40" y="90" width="10" height="40" rx="4" fill="#1e293b" stroke="black" strokeWidth="1" />
        </motion.g>
        
        <motion.g
          animate={isActive ? {
            rotate: [-30, 30, -30, 30, -30],
            y: [0, -5, 0, -5, 0]
          } : {}}
          transition={isActive ? { 
            duration: 0.4, 
            repeat: Infinity,
            repeatType: "mirror" 
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="50" y="90" width="10" height="40" rx="4" fill="#1e293b" stroke="black" strokeWidth="1" />
        </motion.g>
      </motion.g>
      
      {/* Speed trail effect */}
      <motion.path
        d="M 10 75 C 30 75, 50 85, 70 75"
        stroke="#3b82f6"
        strokeWidth="2"
        fill="transparent"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={isActive ? { 
          opacity: [0, 0.8, 0], 
          pathLength: [0, 1, 0],
          x: [-50, 0]
        } : { opacity: 0 }}
        transition={isActive ? { 
          duration: 0.6, 
          repeat: 5,
          repeatType: "loop" 
        } : {}}
      />
    </motion.svg>
  );
};

const JumpAthlete = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.svg
      width="100"
      height="150"
      viewBox="0 0 100 150"
      initial={{ y: 0 }}
      animate={isActive ? { 
        y: [0, -90, 0],
      } : { y: 0 }}
      transition={isActive ? { 
        duration: 1.5, 
        repeat: Infinity,
        repeatDelay: 1
      } : {}}
      className="absolute top-[60%] left-[40%]"
    >
      {/* Body */}
      <motion.g
        animate={isActive ? { 
          scale: [1, 1.05, 0.95, 1],
          y: [0, -5, 5, 0]
        } : {}}
        transition={isActive ? { 
          duration: 1.5, 
          repeat: Infinity,
          repeatDelay: 1,
          times: [0, 0.4, 0.8, 1] 
        } : {}}
      >
        {/* Torso */}
        <rect x="40" y="50" width="20" height="40" rx="5" fill="#10b981" stroke="black" strokeWidth="1" />
        
        {/* Head */}
        <circle cx="50" cy="35" r="15" fill="#7c3aed" stroke="black" strokeWidth="1" />
        
        {/* Face */}
        <circle cx="45" cy="32" r="2" fill="black" />
        <circle cx="55" cy="32" r="2" fill="black" />
        <path d="M45 40 Q50 45 55 40" stroke="black" fill="transparent" strokeWidth="1" />
        
        {/* Arms */}
        <motion.g
          animate={isActive ? { 
            rotate: [-45, -180, -45],
            y: [0, -10, 0]
          } : {}}
          transition={isActive ? { 
            duration: 1.5, 
            repeat: Infinity,
            repeatDelay: 1,
            times: [0, 0.4, 1]
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="30" y="50" width="10" height="30" rx="4" fill="#10b981" stroke="black" strokeWidth="1" />
        </motion.g>
        
        <motion.g
          animate={isActive ? { 
            rotate: [45, 180, 45],
            y: [0, -10, 0]
          } : {}}
          transition={isActive ? { 
            duration: 1.5, 
            repeat: Infinity,
            repeatDelay: 1,
            times: [0, 0.4, 1]
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="60" y="50" width="10" height="30" rx="4" fill="#10b981" stroke="black" strokeWidth="1" />
        </motion.g>
        
        {/* Legs */}
        <motion.g
          animate={isActive ? { 
            rotate: [-45, 0, -45],
            scaleY: [1, 0.8, 1]
          } : {}}
          transition={isActive ? { 
            duration: 1.5, 
            repeat: Infinity,
            repeatDelay: 1,
            times: [0, 0.4, 1]
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="40" y="90" width="10" height="40" rx="4" fill="#1e293b" stroke="black" strokeWidth="1" />
        </motion.g>
        
        <motion.g
          animate={isActive ? { 
            rotate: [45, 0, 45],
            scaleY: [1, 0.8, 1]
          } : {}}
          transition={isActive ? { 
            duration: 1.5, 
            repeat: Infinity,
            repeatDelay: 1, 
            times: [0, 0.4, 1]
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="50" y="90" width="10" height="40" rx="4" fill="#1e293b" stroke="black" strokeWidth="1" />
        </motion.g>
      </motion.g>
      
      {/* Power effect */}
      <motion.circle
        cx="50"
        cy="110"
        r="10"
        fill="#10b98150"
        initial={{ scale: 0 }}
        animate={isActive ? { 
          scale: [0, 2, 0],
          opacity: [0, 0.7, 0]
        } : { scale: 0 }}
        transition={isActive ? { 
          duration: 1, 
          repeat: Infinity,
          repeatDelay: 1.5
        } : {}}
      />
    </motion.svg>
  );
};

const AgilityAthlete = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.svg
      width="120"
      height="150"
      viewBox="0 0 120 150"
      className="absolute top-[40%] left-[30%]"
    >
      {/* Cones */}
      <polygon points="20,80 15,100 25,100" fill="#ef4444" stroke="black" strokeWidth="1" />
      <polygon points="100,80 95,100 105,100" fill="#ef4444" stroke="black" strokeWidth="1" />
      <polygon points="60,30 55,50 65,50" fill="#ef4444" stroke="black" strokeWidth="1" />
      
      {/* Path lines */}
      <line x1="20" y1="90" x2="60" y2="40" stroke="#8b5cf630" strokeWidth="2" strokeDasharray="4" />
      <line x1="60" y1="40" x2="100" y2="90" stroke="#8b5cf630" strokeWidth="2" strokeDasharray="4" />
      
      {/* Character */}
      <motion.g
        initial={{ x: 20, y: 90 }}
        animate={isActive ? [
          { x: 20, y: 90, rotateZ: 0, scale: 1 },
          { x: 40, y: 65, rotateZ: -30, scale: 0.95 },
          { x: 60, y: 40, rotateZ: 0, scale: 1 },
          { x: 80, y: 65, rotateZ: 30, scale: 0.95 },
          { x: 100, y: 90, rotateZ: 0, scale: 1 },
          { x: 80, y: 65, rotateZ: -30, scale: 0.95 },
          { x: 60, y: 40, rotateZ: 0, scale: 1 },
          { x: 40, y: 65, rotateZ: 30, scale: 0.95 },
          { x: 20, y: 90, rotateZ: 0, scale: 1 }
        ] : { x: 20, y: 90 }}
        transition={isActive ? {
          duration: 5,
          repeat: Infinity,
          repeatDelay: 1
        } : {}}
      >
        {/* Torso */}
        <rect x="-10" y="-20" width="20" height="40" rx="5" fill="#8b5cf6" stroke="black" strokeWidth="1" />
        
        {/* Head */}
        <circle cx="0" cy="-35" r="15" fill="#7c3aed" stroke="black" strokeWidth="1" />
        
        {/* Face */}
        <circle cx="-5" cy="-38" r="2" fill="black" />
        <circle cx="5" cy="-38" r="2" fill="black" />
        <path d="M-5 -30 Q0 -25 5 -30" stroke="black" fill="transparent" strokeWidth="1" />
        
        {/* Arms */}
        <motion.g
          animate={isActive ? {
            rotate: [-30, 30, -30, 30],
          } : {}}
          transition={isActive ? {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "mirror"
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="-20" y="-20" width="10" height="30" rx="4" fill="#8b5cf6" stroke="black" strokeWidth="1" />
        </motion.g>
        
        <motion.g
          animate={isActive ? {
            rotate: [30, -30, 30, -30],
          } : {}}
          transition={isActive ? {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "mirror"
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="10" y="-20" width="10" height="30" rx="4" fill="#8b5cf6" stroke="black" strokeWidth="1" />
        </motion.g>
        
        {/* Legs */}
        <motion.g
          animate={isActive ? {
            rotate: [30, -30, 30, -30],
          } : {}}
          transition={isActive ? {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "mirror"
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="-10" y="20" width="10" height="35" rx="4" fill="#1e293b" stroke="black" strokeWidth="1" />
        </motion.g>
        
        <motion.g
          animate={isActive ? {
            rotate: [-30, 30, -30, 30],
          } : {}}
          transition={isActive ? {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "mirror"
          } : {}}
          style={{ originX: 0.5, originY: 0 }}
        >
          <rect x="0" y="20" width="10" height="35" rx="4" fill="#1e293b" stroke="black" strokeWidth="1" />
        </motion.g>
      </motion.g>
      
      {/* Motion trail */}
      <motion.path
        d="M20,90 Q60,20 100,90"
        fill="transparent"
        stroke="#8b5cf6"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isActive ? { 
          pathLength: [0, 0.5, 0], 
          opacity: [0, 0.3, 0] 
        } : {}}
        transition={isActive ? { 
          duration: 5, 
          repeat: Infinity,
          repeatDelay: 1 
        } : {}}
      />
    </motion.svg>
  );
};

const StrengthAthlete = ({ isActive }: { isActive: boolean }) => {
  return (
    <motion.svg
      width="160"
      height="150"
      viewBox="0 0 160 150"
      className="absolute top-[40%] left-[25%]"
    >
      {/* Bench */}
      <rect x="30" y="100" width="100" height="10" rx="2" fill="#475569" stroke="black" strokeWidth="1" />
      <rect x="35" y="110" width="10" height="20" fill="#475569" stroke="black" strokeWidth="1" />
      <rect x="115" y="110" width="10" height="20" fill="#475569" stroke="black" strokeWidth="1" />
      
      {/* Barbell */}
      <motion.g
        animate={isActive ? {
          y: [0, -20, 0],
        } : {}}
        transition={isActive ? {
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        } : {}}
      >
        <rect x="20" y="65" width="120" height="5" rx="2" fill="#94a3b8" stroke="black" strokeWidth="1" />
        <circle cx="25" cy="67.5" r="10" fill="#64748b" stroke="black" strokeWidth="1" />
        <circle cx="135" cy="67.5" r="10" fill="#64748b" stroke="black" strokeWidth="1" />
      </motion.g>
      
      {/* Character */}
      <motion.g
        animate={isActive ? {
          y: [0, -10, 0],
          scaleY: [1, 0.92, 1]
        } : {}}
        transition={isActive ? {
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        } : {}}
      >
        {/* Torso */}
        <rect x="50" y="80" width="60" height="20" rx="5" fill="#ef4444" stroke="black" strokeWidth="1" />
        
        {/* Head */}
        <circle cx="80" cy="55" r="15" fill="#7c3aed" stroke="black" strokeWidth="1" />
        
        {/* Face */}
        <circle cx="75" cy="52" r="2" fill="black" />
        <circle cx="85" cy="52" r="2" fill="black" />
        <motion.path 
          d="M75 60 Q80 58 85 60" 
          stroke="black" 
          fill="transparent" 
          strokeWidth="1"
          animate={isActive ? {
            d: ["M75 60 Q80 58 85 60", "M75 64 Q80 66 85 64", "M75 60 Q80 58 85 60"]
          } : {}}
          transition={isActive ? {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          } : {}}
        />
        
        {/* Arms */}
        <motion.g
          animate={isActive ? {
            rotate: [0, -20, 0],
            scaleY: [1, 1.2, 1]
          } : {}}
          transition={isActive ? {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          } : {}}
          style={{ originX: 1, originY: 0 }}
        >
          <rect x="25" y="75" width="35" height="15" rx="7" fill="#ef4444" stroke="black" strokeWidth="1" />
        </motion.g>
        
        <motion.g
          animate={isActive ? {
            rotate: [0, 20, 0],
            scaleY: [1, 1.2, 1]
          } : {}}
          transition={isActive ? {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          } : {}}
          style={{ originX: 0, originY: 0 }}
        >
          <rect x="100" y="75" width="35" height="15" rx="7" fill="#ef4444" stroke="black" strokeWidth="1" />
        </motion.g>
        
        {/* Legs */}
        <rect x="60" y="100" width="15" height="30" rx="4" fill="#1e293b" stroke="black" strokeWidth="1" />
        <rect x="85" y="100" width="15" height="30" rx="4" fill="#1e293b" stroke="black" strokeWidth="1" />
      </motion.g>
      
      {/* Strength effect */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isActive ? { 
          opacity: [0, 1, 0] 
        } : { opacity: 0 }}
        transition={isActive ? { 
          duration: 0.5, 
          repeat: Infinity,
          repeatDelay: 1.5 
        } : {}}
      >
        <line x1="30" y1="70" x2="15" y2="55" stroke="#ef4444" strokeWidth="2" />
        <line x1="30" y1="70" x2="15" y2="70" stroke="#ef4444" strokeWidth="2" />
        <line x1="30" y1="70" x2="15" y2="85" stroke="#ef4444" strokeWidth="2" />
        
        <line x1="130" y1="70" x2="145" y2="55" stroke="#ef4444" strokeWidth="2" />
        <line x1="130" y1="70" x2="145" y2="70" stroke="#ef4444" strokeWidth="2" />
        <line x1="130" y1="70" x2="145" y2="85" stroke="#ef4444" strokeWidth="2" />
      </motion.g>
    </motion.svg>
  );
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

export default function FullyAnimatedGarCommercial() {
  const [activeStation, setActiveStation] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [activeMetricIndex, setActiveMetricIndex] = useState(0);
  
  // Auto-cycle through stations
  useEffect(() => {
    if (!playing) return;
    
    const timer = setTimeout(() => {
      setActiveStation((prev) => (prev + 1) % stations.length);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [activeStation, playing]);
  
  // Cycle through metrics for active animation
  useEffect(() => {
    if (!playing) return;
    
    const metricTimer = setInterval(() => {
      setActiveMetricIndex(prev => {
        const metrics = Object.keys(stations[activeStation].metrics);
        return (prev + 1) % metrics.length;
      });
    }, 2000);
    
    return () => clearInterval(metricTimer);
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
                    
                    {/* Animated sprinter */}
                    <SprintAthlete isActive={playing} />
                    
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
                      
                      <motion.div
                        className="mt-3 pt-3 border-t border-blue-900/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-gray-300">Elite acceleration phase</span>
                        </div>
                      </motion.div>
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
                    
                    {/* Animated jumper */}
                    <JumpAthlete isActive={playing} />
                    
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
                      
                      <motion.div
                        className="mt-3 pt-3 border-t border-green-900/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-gray-300">Elite explosiveness rating</span>
                        </div>
                      </motion.div>
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
                    {/* Animated agility athlete */}
                    <AgilityAthlete isActive={playing} />
                    
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
                      
                      <motion.div
                        className="mt-3 pt-3 border-t border-purple-900/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center gap-1">
                          <Crown className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-gray-300">Top 1% in change of direction</span>
                        </div>
                      </motion.div>
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
                    {/* Animated strength athlete */}
                    <StrengthAthlete isActive={playing} />
                    
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
                      
                      <motion.div
                        className="mt-3 pt-3 border-t border-red-900/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-gray-300">Elite power-to-weight ratio</span>
                        </div>
                      </motion.div>
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
                    
                    {/* Highlighted strength */}
                    <motion.div
                      className="mt-4 pt-4 border-t border-blue-900/30 flex items-center justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        <span className="text-white font-semibold">Elite Level Potential</span>
                      </div>
                      <div className="text-blue-400 text-sm font-semibold">
                        Top 5%
                      </div>
                    </motion.div>
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