import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

/**
 * RealisticMotionPlayer - Ultra high-quality "128-bit" video animation component
 * 
 * This component creates a console-quality animation experience by using pre-rendered
 * video sequences with interactive overlays and real-time effects.
 */
interface RealisticMotionPlayerProps {
  videoSources: {
    [key: string]: string; // maps animation type to video URL
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
  onComplete?: () => void;
  autoPlay?: boolean;
  loop?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const RealisticMotionPlayer: React.FC<RealisticMotionPlayerProps> = ({
  videoSources,
  animationType,
  colors,
  metricData,
  onComplete,
  autoPlay = true,
  loop = true,
  width = '100%',
  height = '100%',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Select the appropriate video based on animation type
  const videoSource = videoSources[animationType] || '';
  
  // Initialize playback
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => {
          console.error("Error playing video:", e);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoSource]);
  
  // Handle time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };
  
  // Handle video end
  const handleVideoEnd = () => {
    if (onComplete) {
      onComplete();
    }
    
    if (!loop) {
      setIsPlaying(false);
    }
  };
  
  // Restart the video
  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.error("Error restarting video:", e));
      setIsPlaying(true);
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Handle video loaded
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(e => {
        console.error("Error auto-playing video:", e);
        setIsPlaying(false);
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {!videoLoaded && (
          <motion.div 
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center">
              <div 
                className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: `${colors.primary} transparent transparent transparent` }}
              />
              <p className="mt-4 text-white">Loading high-quality animation...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The main video player */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={videoSource}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onLoadedData={handleVideoLoaded}
        playsInline
        muted
        loop={loop}
      />
      
      {/* Overlay with animation data */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sport-appropriate overlays and data displays based on animation type */}
        {animationType === 'sprint' && (
          <motion.div 
            className="absolute right-5 top-5 px-3 py-2 rounded-lg"
            style={{ 
              backgroundColor: `${colors.primary}`,
              color: 'white',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: isPlaying && progress > 50 ? 1 : 0,
              y: isPlaying && progress > 50 ? 0 : -20
            }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs opacity-80">TIME</p>
            <p className="text-xl font-bold">{metricData?.value || '4.42s'}</p>
          </motion.div>
        )}
        
        {animationType === 'vertical' && (
          <motion.div 
            className="absolute left-5 top-5 px-3 py-2 rounded-lg"
            style={{ 
              backgroundColor: `${colors.primary}`,
              color: 'white',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: isPlaying && progress > 60 ? 1 : 0,
              y: isPlaying && progress > 60 ? 0 : -20
            }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs opacity-80">VERTICAL</p>
            <p className="text-xl font-bold">{metricData?.value || '38.5"'}</p>
          </motion.div>
        )}
        
        {animationType === 'agility' && (
          <motion.div 
            className="absolute right-5 top-5 px-3 py-2 rounded-lg"
            style={{ 
              backgroundColor: `${colors.primary}`,
              color: 'white',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: isPlaying && progress > 70 ? 1 : 0, 
              y: isPlaying && progress > 70 ? 0 : -20
            }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs opacity-80">AGILITY</p>
            <p className="text-xl font-bold">{metricData?.value || '6.78s'}</p>
          </motion.div>
        )}
        
        {animationType === 'strength' && (
          <motion.div 
            className="absolute right-5 top-5 px-3 py-2 rounded-lg"
            style={{ 
              backgroundColor: `${colors.primary}`,
              color: 'white',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: isPlaying && progress > 40 ? 1 : 0,
              y: isPlaying && progress > 40 ? 0 : -20
            }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs opacity-80">REPS</p>
            <p className="text-xl font-bold">{metricData?.value || '22'}</p>
          </motion.div>
        )}
      </div>

      {/* Player controls */}
      <AnimatePresence>
        {(showControls || !isPlaying) && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
              onClick={handleRestart}
            >
              <RotateCcw size={18} />
            </button>
            
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: colors.primary
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive prompt to engage with the animation */}
      {!isPlaying && !showControls && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlayPause}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={32} className="text-white ml-1" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default RealisticMotionPlayer;