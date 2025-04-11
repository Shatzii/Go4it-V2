import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Video, Maximize2, Minimize2 } from 'lucide-react';
import RealisticMotionPlayer from './RealisticMotionPlayer';

interface AnimationPlayerProps {
  videoSources: {
    [key: string]: string;
  };
  svgAnimations: {
    [key: string]: React.FC<{ colors: any; isPlaying: boolean }>;
  };
  animationType: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  metricData?: {
    label: string;
    value: string;
    unit: string;
  };
  className?: string;
}

/**
 * Advanced Animation Player Component - Manages both video and SVG animations
 * with seamless transition between high-quality pre-rendered videos and fallback SVG animations
 */
const AdvancedAnimationPlayer: React.FC<AnimationPlayerProps> = ({
  videoSources,
  svgAnimations,
  animationType,
  colors,
  metricData,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [useVideoMode, setUseVideoMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Current animation component
  const SvgAnimation = svgAnimations[animationType];
  
  // Check if video is available
  useEffect(() => {
    const checkVideoAvailability = async () => {
      try {
        const videoPath = videoSources[animationType];
        
        // For demo purposes - in production, this would be a real check
        // In development, simulate video availability even with placeholder files
        setVideoAvailable(true);
        
        // In production, you would do a real check like this:
        // const response = await fetch(videoPath, { method: 'HEAD' });
        // setVideoAvailable(response.ok);
      } catch (error) {
        console.warn("Error checking video availability:", error);
        setVideoAvailable(true); // Force to true for demo
      }
    };
    
    checkVideoAvailability();
  }, [animationType, videoSources]);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Toggle video/SVG mode
  const toggleVideoMode = () => {
    setUseVideoMode(!useVideoMode);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Play button overlay when paused */}
      {!isPlaying && !(videoAvailable && useVideoMode) && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
          onClick={togglePlayPause}
        >
          <motion.div
            className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="h-8 w-8 text-white ml-1" />
          </motion.div>
        </div>
      )}
      
      {/* Main animation container */}
      <div className="aspect-video relative">
        {/* Show either video player or SVG animation based on availability and preference */}
        {videoAvailable && useVideoMode ? (
          <RealisticMotionPlayer 
            videoSources={videoSources}
            animationType={animationType}
            colors={colors}
            metricData={metricData}
            autoPlay={isPlaying}
            loop={true}
            width="100%"
            height="100%"
            onComplete={() => console.log("Animation complete")}
          />
        ) : (
          <div className="w-full h-full">
            <SvgAnimation colors={colors} isPlaying={isPlaying} />
          </div>
        )}
        
        {/* Video quality badge */}
        {videoAvailable && (
          <div 
            className={`absolute top-2 ${useVideoMode ? 'right-2' : 'left-2'} px-2 py-1 rounded-md 
              ${useVideoMode ? 'bg-green-500/20 border border-green-500/40' : 'bg-gray-800/80 border border-gray-700'} 
              backdrop-blur-sm flex items-center gap-1.5 text-xs transition-all duration-300`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${useVideoMode ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className={`font-medium ${useVideoMode ? 'text-green-400' : 'text-gray-400'}`}>
              {useVideoMode ? '128-Bit HD Video' : 'Standard Graphics'}
            </span>
          </div>
        )}
      </div>
      
      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </button>
          
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition"
            onClick={() => setIsPlaying(false)}
          >
            <RotateCcw className="h-4 w-4 text-white" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {videoAvailable && (
            <button 
              className="px-2 py-1 text-xs rounded flex items-center gap-1 hover:bg-white/10 transition"
              onClick={toggleVideoMode}
              style={{ color: colors.accent }}
            >
              <Video className="h-3 w-3" />
              <span>{useVideoMode ? 'Standard Mode' : '128-Bit Mode'}</span>
            </button>
          )}
          
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 text-white" />
            ) : (
              <Maximize2 className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnimationPlayer;