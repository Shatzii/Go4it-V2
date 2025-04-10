import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Star, 
  Trophy, 
  TrendingUp, 
  Activity,
  Zap,
  Dumbbell,
  Brain,
  Footprints,
  Timer,
  Award
} from 'lucide-react';

// Utility function to adjust color brightness
const adjustColorBrightness = (color: string, percent: number): string => {
  // Handles hex colors like #RRGGBB or #RGB
  const hex = color.replace('#', '');
  let r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
  let g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
  let b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);

  // Adjust brightness
  r = Math.min(255, Math.max(0, r + (percent * r / 100)));
  g = Math.min(255, Math.max(0, g + (percent * g / 100)));
  b = Math.min(255, Math.max(0, b + (percent * b / 100)));

  // Convert back to hex
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
};

interface Position {
  x: number;
  y: number;
}

interface PlayerProps {
  position: Position;
  color: string;
  isUser?: boolean;
  jersey?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  isSelected?: boolean;
  hasAnimation?: boolean;
}

// Player component with PlayStation 5-quality visuals
const Player: React.FC<PlayerProps> = ({ 
  position, 
  color, 
  isUser = false, 
  jersey = '7', 
  name = '', 
  size = 'md',
  isSelected = false,
  hasAnimation = true
}) => {
  const sizeMap = {
    sm: { circleSize: 28, fontSize: 12, glow: 5, shadowSize: 2 },
    md: { circleSize: 34, fontSize: 16, glow: 8, shadowSize: 3 },
    lg: { circleSize: 40, fontSize: 18, glow: 12, shadowSize: 4 }
  };
  
  const { circleSize, fontSize, glow, shadowSize } = sizeMap[size];
  
  // Create particle positions for motion blur effect
  const particleCount = 6;
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const opacity = 0.4 - (i * (0.4 / particleCount));
    const scale = 1 - (i * 0.03);
    return { opacity, scale, delay: i * 0.01 };
  });
  
  // Motion blur trail for player movement
  const renderMotionTrail = () => {
    if (!isUser || !hasAnimation) return null;
    
    return particles.map((particle, index) => (
      <motion.div
        key={`trail-${index}`}
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: particle.opacity,
          scale: particle.scale
        }}
        transition={{
          opacity: { duration: 0.2, delay: particle.delay },
          scale: { duration: 0.2, delay: particle.delay }
        }}
        style={{ 
          backgroundColor: color,
          filter: 'blur(3px)'
        }}
      />
    ));
  };
  
  // Generates 3D-like shadow beneath player
  const renderPlayerShadow = () => (
    <div 
      className="absolute rounded-full bg-black/40 blur-sm" 
      style={{
        width: circleSize * 0.7,
        height: circleSize * 0.3,
        bottom: -shadowSize,
        left: '50%',
        transform: 'translateX(-50%)',
        filter: `blur(${shadowSize}px)`,
        zIndex: -1
      }}
    />
  );
  
  // Player highlight ring effect
  const renderHighlightRing = () => {
    if (!isSelected) return null;
    
    return (
      <motion.div 
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0.5, scale: 1.2 }}
        animate={{ 
          opacity: [0.5, 0.8, 0.5], 
          scale: [1.2, 1.25, 1.2],
          rotate: [0, 360] 
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          border: `2px solid ${color}`,
          boxShadow: `0 0 5px ${color}`,
          zIndex: -1
        }}
      />
    );
  };
  
  // Pulse effect for user's player
  const renderPulseEffect = () => {
    if (!isUser || !hasAnimation) return null;
    
    return [1, 2].map((i) => (
      <motion.div
        key={`pulse-${i}`}
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0.7, scale: 1, borderWidth: 2 }}
        animate={{ 
          opacity: 0, 
          scale: 1.7, 
          borderWidth: 0 
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeOut"
        }}
        style={{ 
          border: `2px solid ${color}`,
          boxShadow: `0 0 ${glow}px ${color}`
        }}
      />
    ));
  };
  
  // Jersey number with 3D-like effect
  const renderJerseyNumber = () => (
    <div className="relative flex items-center justify-center">
      <span 
        className="absolute text-black font-bold select-none opacity-30" 
        style={{ 
          fontSize, 
          transform: 'translate(1px, 1px)'
        }}
      >
        {jersey}
      </span>
      <span 
        className="relative text-white font-bold select-none" 
        style={{ 
          fontSize,
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {jersey}
      </span>
    </div>
  );
  
  // Main component return
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: isSelected ? 1.1 : 1,
        x: position.x, 
        y: position.y,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 15,
        opacity: { duration: 0.3 }
      }}
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        zIndex: isUser ? 10 : 5
      }}
    >
      {/* Player container with 3D effects */}
      <div className="relative">
        {renderHighlightRing()}
        {renderPulseEffect()}
        {renderPlayerShadow()}
        
        {/* Main player circle */}
        <div
          className={`relative flex items-center justify-center rounded-full overflow-hidden transition-all duration-200`}
          style={{ 
            width: circleSize,
            height: circleSize,
            background: `radial-gradient(circle at 30% 30%, ${color}, ${adjustColorBrightness(color, -30)})`,
            boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.2), 
                         inset 0 2px 4px rgba(255,255,255,0.2), 
                         0 ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,0.15),
                         ${isUser ? `0 0 ${glow}px ${color}` : ''}`
          }}
        >
          {/* Motion trail effect */}
          {renderMotionTrail()}
          
          {/* Jersey number with 3D effect */}
          {renderJerseyNumber()}
          
          {/* Reflective highlight */}
          <div 
            className="absolute left-0 top-0 right-0 h-[40%] rounded-t-full bg-white/10"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0))'
            }}
          />
        </div>
        
        {/* Player name tag with glass effect */}
        {name && (
          <div 
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md backdrop-blur-sm text-center whitespace-nowrap"
            style={{ 
              fontSize: fontSize - 2,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            <span className="text-white font-medium">{name}</span>
            {isUser && (
              <div className="flex justify-center mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mx-0.5" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mx-0.5" 
                     style={{animationDelay: '0.2s'}} />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mx-0.5"
                     style={{animationDelay: '0.4s'}} />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface AnimationPath {
  points: Position[];
  duration: number; // seconds per point
  loop?: boolean;
}

interface Ball {
  position: Position;
  visible: boolean;
  transition?: {
    duration: number;
    delay?: number;
  }
}

interface PlayerAnimation {
  sport: 'basketball' | 'football' | 'soccer';
  title: string;
  description?: string;
  duration: number; // seconds
  userPath: AnimationPath;
  teammatePaths: AnimationPath[];
  opponentPaths: AnimationPath[];
  ballPath?: AnimationPath;
}

// Sample basketball play animation
const basketballDribbleDrive: PlayerAnimation = {
  sport: 'basketball',
  title: "Point Guard Drive & Kick",
  description: "Drive to the basket and kick out to the open shooter",
  duration: 6,
  userPath: {
    points: [
      { x: 50, y: 80 },  // Start at the top of the key
      { x: 50, y: 60 },  // Dribble forward
      { x: 50, y: 40 },  // Continue drive
      { x: 40, y: 25 },  // Cut to the left
      { x: 45, y: 40 },  // Step back
      { x: 75, y: 50 },  // Pass to the corner
    ],
    duration: 1,
  },
  teammatePaths: [
    {
      // Shooter in the corner
      points: [
        { x: 80, y: 50 },  // Start in the corner
        { x: 80, y: 50 },  // Stay put
        { x: 80, y: 50 },  // Stay put
        { x: 80, y: 50 },  // Stay put
        { x: 75, y: 50 },  // Slight movement to receive pass
        { x: 75, y: 50 },  // Shot
      ],
      duration: 1,
    },
    {
      // Center in the post
      points: [
        { x: 40, y: 20 },  // Start in the post
        { x: 40, y: 20 },  // Stay put
        { x: 40, y: 20 },  // Stay put
        { x: 45, y: 20 },  // Move for position
        { x: 40, y: 20 },  // Back to original
        { x: 35, y: 20 },  // Clear for the pass
      ],
      duration: 1,
    },
  ],
  opponentPaths: [
    {
      // Defender guarding the ball
      points: [
        { x: 50, y: 85 },  // Guarding ball handler
        { x: 50, y: 65 },  // Following drive
        { x: 50, y: 45 },  // Following drive
        { x: 45, y: 30 },  // Following drive
        { x: 45, y: 45 },  // Caught on the step back
        { x: 55, y: 55 },  // Late to contest pass
      ],
      duration: 1,
    },
    {
      // Defender in the corner
      points: [
        { x: 85, y: 50 },  // Guarding corner
        { x: 85, y: 50 },  // Stay put
        { x: 85, y: 50 },  // Stay put
        { x: 85, y: 50 },  // Stay put
        { x: 85, y: 50 },  // Stay put
        { x: 80, y: 55 },  // Late contest
      ],
      duration: 1,
    },
  ],
  ballPath: {
    points: [
      { x: 50, y: 80 },  // With the player
      { x: 50, y: 60 },  // With the player
      { x: 50, y: 40 },  // With the player
      { x: 40, y: 25 },  // With the player
      { x: 45, y: 40 },  // With the player
      { x: 75, y: 50 },  // Pass to corner
    ],
    duration: 1,
  }
};

// Sample football play animation
const footballPassPlay: PlayerAnimation = {
  sport: 'football',
  title: "Quarterback Read Option",
  description: "Read the defense and decide to keep or pass",
  duration: 6,
  userPath: {
    points: [
      { x: 50, y: 85 },  // QB position
      { x: 45, y: 75 },  // Drop back
      { x: 40, y: 70 },  // Continue drop
      { x: 45, y: 65 },  // Scramble right
      { x: 50, y: 60 },  // Continue scramble
      { x: 45, y: 55 },  // Set up to throw
    ],
    duration: 1,
  },
  teammatePaths: [
    {
      // Wide receiver running a go route
      points: [
        { x: 80, y: 85 },  // Initial position
        { x: 80, y: 75 },  // Start route
        { x: 80, y: 65 },  // Continue route
        { x: 80, y: 55 },  // Continue route
        { x: 75, y: 45 },  // Cut inside
        { x: 70, y: 40 },  // Open for pass
      ],
      duration: 1,
    },
    {
      // Running back in pass protection
      points: [
        { x: 50, y: 80 },  // Initial position
        { x: 45, y: 80 },  // Shift to protect
        { x: 40, y: 75 },  // Block
        { x: 40, y: 75 },  // Continue block
        { x: 40, y: 70 },  // Move for outlet
        { x: 45, y: 65 },  // Outlet option
      ],
      duration: 1,
    },
  ],
  opponentPaths: [
    {
      // Defensive end rushing
      points: [
        { x: 35, y: 85 },  // Initial position
        { x: 40, y: 80 },  // Rush
        { x: 45, y: 75 },  // Continue rush
        { x: 40, y: 70 },  // Blocked by RB
        { x: 40, y: 70 },  // Continue engaging
        { x: 40, y: 65 },  // Push forward
      ],
      duration: 1,
    },
    {
      // Linebacker in coverage
      points: [
        { x: 50, y: 65 },  // Initial position
        { x: 55, y: 65 },  // Read
        { x: 60, y: 60 },  // Drop to coverage
        { x: 65, y: 55 },  // Continue coverage
        { x: 70, y: 50 },  // Move toward WR
        { x: 75, y: 45 },  // Cover receiver
      ],
      duration: 1,
    },
  ],
  ballPath: {
    points: [
      { x: 50, y: 85 },  // With QB
      { x: 45, y: 75 },  // With QB
      { x: 40, y: 70 },  // With QB
      { x: 45, y: 65 },  // With QB
      { x: 50, y: 60 },  // With QB
      { x: 70, y: 40 },  // Thrown to WR
    ],
    duration: 1,
  }
};

// Sample soccer play animation
const soccerAttackPlay: PlayerAnimation = {
  sport: 'soccer',
  title: "Give and Go Attack",
  description: "Create space with a quick give and go",
  duration: 6,
  userPath: {
    points: [
      { x: 40, y: 60 },  // Initial position
      { x: 45, y: 55 },  // Move forward
      { x: 50, y: 50 },  // Continue forward
      { x: 55, y: 45 },  // Pass the ball
      { x: 65, y: 30 },  // Make a run
      { x: 75, y: 20 },  // Receive the ball
    ],
    duration: 1,
  },
  teammatePaths: [
    {
      // Teammate to combine with
      points: [
        { x: 60, y: 40 },  // Initial position
        { x: 60, y: 40 },  // Hold position
        { x: 60, y: 40 },  // Hold position
        { x: 60, y: 40 },  // Receive pass
        { x: 65, y: 35 },  // Move with ball
        { x: 70, y: 25 },  // Pass ball back
      ],
      duration: 1,
    },
    {
      // Supporting midfielder
      points: [
        { x: 40, y: 50 },  // Initial position
        { x: 45, y: 45 },  // Support
        { x: 50, y: 40 },  // Move to space
        { x: 55, y: 35 },  // Continue movement
        { x: 60, y: 30 },  // Provide option
        { x: 65, y: 25 },  // Make run for 2nd pass
      ],
      duration: 1,
    },
  ],
  opponentPaths: [
    {
      // Defender marking the player
      points: [
        { x: 35, y: 60 },  // Initial position
        { x: 40, y: 55 },  // Follow player
        { x: 45, y: 50 },  // Continue marking
        { x: 50, y: 45 },  // Stick with player
        { x: 55, y: 40 },  // Lost player on run
        { x: 60, y: 35 },  // Behind the play
      ],
      duration: 1,
    },
    {
      // Defender marking teammate
      points: [
        { x: 65, y: 40 },  // Initial position
        { x: 65, y: 40 },  // Hold position
        { x: 65, y: 40 },  // Hold position
        { x: 65, y: 40 },  // Pressure ball
        { x: 70, y: 35 },  // Follow player
        { x: 75, y: 30 },  // Behind the play
      ],
      duration: 1,
    },
  ],
  ballPath: {
    points: [
      { x: 40, y: 60 },  // With player
      { x: 45, y: 55 },  // With player
      { x: 50, y: 50 },  // With player
      { x: 60, y: 40 },  // Passed to teammate
      { x: 65, y: 35 },  // With teammate
      { x: 75, y: 20 },  // Passed back to player
    ],
    duration: 1,
  }
};

// Main animation component
const PlayerAnimation: React.FC<{
  sport?: 'basketball' | 'football' | 'soccer';
  userName?: string;
}> = ({ 
  sport = 'basketball',
  userName = 'You'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState<PlayerAnimation>(basketballDribbleDrive);
  const animationRef = useRef<number | null>(null);
  const frameRateRef = useRef<number>(30); // frames per second
  const lastTimeRef = useRef<number>(0);
  
  // Choose animation based on selected sport
  useEffect(() => {
    switch(sport) {
      case 'basketball':
        setCurrentAnimation(basketballDribbleDrive);
        break;
      case 'football':
        setCurrentAnimation(footballPassPlay);
        break;
      case 'soccer':
        setCurrentAnimation(soccerAttackPlay);
        break;
      default:
        setCurrentAnimation(basketballDribbleDrive);
    }
    
    // Reset animation
    setCurrentFrame(0);
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [sport]);
  
  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const totalFrames = currentAnimation.duration * frameRateRef.current;
    
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      
      const elapsed = timestamp - lastTimeRef.current;
      const frameDuration = 1000 / frameRateRef.current;
      
      if (elapsed >= frameDuration) {
        lastTimeRef.current = timestamp;
        
        setCurrentFrame(prev => {
          const next = prev + 1;
          if (next >= totalFrames) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentAnimation]);
  
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    lastTimeRef.current = 0;
  };
  
  // Get position at current frame
  const getPositionAtFrame = (path: AnimationPath, frame: number) => {
    const totalFrames = currentAnimation.duration * frameRateRef.current;
    const pointsCount = path.points.length;
    const framesPerPoint = totalFrames / (pointsCount - 1);
    
    // Calculate which segment we're in
    const segmentIndex = Math.min(Math.floor(frame / framesPerPoint), pointsCount - 2);
    const segmentFrame = frame % framesPerPoint;
    const segmentProgress = segmentFrame / framesPerPoint;
    
    const start = path.points[segmentIndex];
    const end = path.points[segmentIndex + 1];
    
    // Interpolate between points
    return {
      x: start.x + (end.x - start.x) * segmentProgress,
      y: start.y + (end.y - start.y) * segmentProgress
    };
  };
  
  // Get ball position
  const getBallPosition = (): Ball => {
    if (!currentAnimation.ballPath) {
      return { position: { x: 0, y: 0 }, visible: false };
    }
    
    const position = getPositionAtFrame(currentAnimation.ballPath, currentFrame);
    return { position, visible: true };
  };
  
  // Render functions for different court/field types
  const renderCourt = () => {
    switch(sport) {
      case 'basketball':
        return (
          <div className="absolute inset-0 bg-amber-800/80 rounded-lg">
            {/* Center circle */}
            <div className="absolute left-1/2 top-1/2 w-20 h-20 border-2 border-white/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Three point arc */}
            <div className="absolute left-1/2 bottom-0 w-40 h-32 border-2 border-white/40 rounded-t-full transform -translate-x-1/2"></div>
            
            {/* Free throw line */}
            <div className="absolute left-1/2 bottom-16 w-32 h-0 border border-white/40 transform -translate-x-1/2"></div>
            
            {/* Key/paint */}
            <div className="absolute left-1/2 bottom-0 w-24 h-24 border-2 border-white/40 border-b-0 transform -translate-x-1/2"></div>
            
            {/* Backboard and hoop */}
            <div className="absolute left-1/2 bottom-1 w-10 h-1 bg-white/60 transform -translate-x-1/2"></div>
            <div className="absolute left-1/2 bottom-1 w-3 h-3 border-2 border-white/60 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            
            {/* Court dividing line */}
            <div className="absolute left-0 right-0 top-1/2 border border-white/40"></div>
          </div>
        );
        
      case 'football':
        return (
          <div className="absolute inset-0 bg-green-800 rounded-lg">
            {/* Yard lines */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div 
                key={i} 
                className="absolute left-0 right-0 border border-white/40"
                style={{ top: `${i * 10}%` }}
              ></div>
            ))}
            
            {/* Hash marks */}
            <div className="absolute left-[33%] top-0 bottom-0 border-dashed border-l border-white/40"></div>
            <div className="absolute left-[67%] top-0 bottom-0 border-dashed border-l border-white/40"></div>
            
            {/* End zones */}
            <div className="absolute left-0 right-0 top-0 h-[10%] bg-red-800/30"></div>
            <div className="absolute left-0 right-0 bottom-0 h-[10%] bg-blue-800/30"></div>
          </div>
        );
        
      case 'soccer':
        return (
          <div className="absolute inset-0 bg-green-700 rounded-lg">
            {/* Center circle */}
            <div className="absolute left-1/2 top-1/2 w-24 h-24 border-2 border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Center line */}
            <div className="absolute left-0 right-0 top-1/2 border border-white/50"></div>
            
            {/* Penalty areas */}
            <div className="absolute left-1/2 top-0 w-40 h-16 border-2 border-white/50 border-t-0 transform -translate-x-1/2"></div>
            <div className="absolute left-1/2 bottom-0 w-40 h-16 border-2 border-white/50 border-b-0 transform -translate-x-1/2"></div>
            
            {/* Goal boxes */}
            <div className="absolute left-1/2 top-0 w-20 h-6 border-2 border-white/50 border-t-0 transform -translate-x-1/2"></div>
            <div className="absolute left-1/2 bottom-0 w-20 h-6 border-2 border-white/50 border-b-0 transform -translate-x-1/2"></div>
            
            {/* Goals */}
            <div className="absolute left-1/2 top-0 w-12 h-2 bg-white/60 transform -translate-x-1/2 -translate-y-1"></div>
            <div className="absolute left-1/2 bottom-0 w-12 h-2 bg-white/60 transform -translate-x-1/2 translate-y-1"></div>
          </div>
        );
    }
  };
  
  // Ball colors for different sports
  const getBallColor = () => {
    switch(sport) {
      case 'basketball': return 'bg-orange-500';
      case 'football': return 'bg-amber-800';
      case 'soccer': return 'bg-white';
      default: return 'bg-white';
    }
  };
  
  // Get frame progress as percentage
  const progressPercent = () => {
    const totalFrames = currentAnimation.duration * frameRateRef.current;
    return (currentFrame / totalFrames) * 100;
  };
  
  // Ball component
  const ball = getBallPosition();
  
  return (
    <Card className="w-full overflow-hidden border border-gray-700 bg-gray-900 shadow-md">
      <CardContent className="p-0">
        <div className="relative w-full pb-[75%]"> {/* 4:3 aspect ratio */}
          {/* Court/Field */}
          {renderCourt()}
          
          {/* User Player */}
          <Player
            position={getPositionAtFrame(currentAnimation.userPath, currentFrame)}
            color="#3b82f6" // blue
            isUser={true}
            jersey="1"
            name={userName}
            size="lg"
            isSelected={true}
            hasAnimation={isPlaying}
          />
          
          {/* Teammates */}
          {currentAnimation.teammatePaths.map((path, i) => (
            <Player
              key={`teammate-${i}`}
              position={getPositionAtFrame(path, currentFrame)}
              color="#10b981" // green
              jersey={`${i+2}`}
              size="md"
              hasAnimation={false}
            />
          ))}
          
          {/* Opponents */}
          {currentAnimation.opponentPaths.map((path, i) => (
            <Player
              key={`opponent-${i}`}
              position={getPositionAtFrame(path, currentFrame)}
              color="#ef4444" // red
              jersey={`${i+1}`}
              size="md"
              hasAnimation={false}
            />
          ))}
          
          {/* Ball */}
          {ball.visible && (
            <motion.div
              className={`absolute rounded-full ${getBallColor()} shadow-md`}
              style={{
                width: sport === 'basketball' ? 10 : 8,
                height: sport === 'basketball' ? 10 : 8,
                x: ball.position.x + '%',
                y: ball.position.y + '%',
                transform: 'translate(-50%, -50%)',
                zIndex: 20
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.2
              }}
            />
          )}
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div 
              className="h-full bg-blue-500"
              style={{ width: `${progressPercent()}%` }}
            />
          </div>
          
          {/* Controls overlay */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <Button 
              size="sm"
              variant="secondary"
              className="bg-gray-800/80 hover:bg-gray-700/80 text-white"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              size="sm"
              variant="secondary"
              className="bg-gray-800/80 hover:bg-gray-700/80 text-white"
              onClick={resetAnimation}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Title overlay */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
            <div className="bg-black/50 rounded px-2 py-1 text-sm font-medium text-white">
              {currentAnimation.title}
            </div>
            <div className="flex space-x-1">
              <Star className="h-5 w-5 text-yellow-400" />
              <Star className="h-5 w-5 text-yellow-400" />
              <Star className="h-5 w-5 text-yellow-400" />
              <Star className="h-5 w-5 text-gray-400" />
              <Star className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Rating overlay */}
          {!isPlaying && currentFrame === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
              <div className="relative">
                <motion.div
                  className="text-4xl font-bold text-white mb-2 flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }}
                >
                  <Trophy className="h-8 w-8 text-yellow-400 mr-2" />
                  {currentAnimation.title}
                </motion.div>
                <motion.div
                  className="text-sm text-gray-200 text-center max-w-xs mb-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentAnimation.description}
                </motion.div>
                <div className="flex justify-center space-x-3 mb-4">
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Activity className="h-6 w-6 text-green-400 mb-1" />
                    <span className="text-xs text-white">Endurance +3</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <TrendingUp className="h-6 w-6 text-blue-400 mb-1" />
                    <span className="text-xs text-white">Speed +2</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Star className="h-6 w-6 text-purple-400 mb-1" />
                    <span className="text-xs text-white">Agility +5</span>
                  </motion.div>
                </div>
                <motion.button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                  onClick={togglePlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-4 w-4 inline-block mr-1" /> Play Animation
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerAnimation;