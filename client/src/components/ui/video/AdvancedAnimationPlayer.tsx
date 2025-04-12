import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

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
 * Advanced Animation Player Component - Shows highest quality animations possible
 * using HTML5 video and iframe techniques for 128-bit visuals
 */
const AdvancedAnimationPlayer: React.FC<AnimationPlayerProps> = ({
  videoSources,
  svgAnimations,
  animationType,
  colors,
  metricData,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Current animation component for fallback if needed
  const SvgAnimation = svgAnimations[animationType];
  
  // Set up the iframe source based on animation type
  const iframeSrc = `/videos/hd/${animationType === 'sprint' ? '40_yard_dash' : 
                                  animationType === 'vertical' ? 'vertical_jump' : 
                                  animationType === 'agility' ? 'agility_drill' : 
                                  'bench_press'}.html`;

  // Toggle play/pause (control the iframe content)
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // Send message to iframe to play/pause
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { action: isPlaying ? 'pause' : 'play' },
        '*'
      );
    }
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
  
  // Show loaded state after a short timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center">
              <div 
                className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: `${colors.primary} transparent transparent transparent` }}
              />
              <p className="mt-4 text-white">Loading 128-bit animation...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main animation container */}
      <div className="aspect-video relative bg-[#0c1325]">
        {/* Iframe for high-quality animations */}
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          className="w-full h-full border-0"
          style={{ backgroundColor: '#0c1325' }}
          allow="autoplay"
        />
        
        {/* Quality badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-green-500/20 border border-green-500/40 backdrop-blur-sm flex items-center gap-1.5 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="font-medium text-green-400">128-Bit Ultra HD</span>
        </div>
        
        {/* Metric display */}
        {metricData && (
          <div 
            className="absolute top-2 left-2 px-3 py-2 rounded-lg z-10"
            style={{ 
              backgroundColor: `${colors.primary}80`,
              backdropFilter: 'blur(4px)',
              color: 'white',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            <p className="text-xs opacity-80">{metricData.label}</p>
            <p className="text-xl font-bold">{metricData.value}</p>
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
            {!isPlaying ? (
              <Play className="h-4 w-4 text-white" />
            ) : (
              <Pause className="h-4 w-4 text-white" />
            )}
          </button>
          
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition"
            onClick={() => window.location.reload()}
          >
            <RotateCcw className="h-4 w-4 text-white" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
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