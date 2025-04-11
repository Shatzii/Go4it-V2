import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Award,
  Crown,
  Lock,
  Sparkles,
  VideoIcon,
  BarChart3,
  BadgeCheck,
  Leaf,
  BookOpen,
  Lightbulb,
  LucideIcon
} from 'lucide-react';
import { Link } from 'wouter';

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
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: color,
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
        initial={{ opacity: 0.7, scale: 1 }}
        animate={{ 
          opacity: 0, 
          scale: 1.7
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeOut"
        }}
        style={{ 
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: color,
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
            className="absolute left-0 top-0 right-0 h-[40%] rounded-t-full"
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

// Ball component with effects
interface BallProps {
  position: Position;
  visible?: boolean;
  sport?: 'basketball' | 'football' | 'soccer';
  size?: 'sm' | 'md' | 'lg';
}

const Ball: React.FC<BallProps> = ({ position, visible = true, sport = 'basketball', size = 'md' }) => {
  const sizeMap = {
    sm: { ballSize: 14, glow: 3 },
    md: { ballSize: 18, glow: 5 },
    lg: { ballSize: 22, glow: 8 }
  };
  
  const { ballSize, glow } = sizeMap[size];
  
  const ballColors: Record<string, string> = {
    basketball: '#e66000',
    football: '#964B00',
    soccer: '#fff'
  };
  
  const color = ballColors[sport];
  
  // Custom shapes for different ball types
  const renderBallContent = () => {
    switch (sport) {
      case 'basketball':
        return (
          <>
            <div className="absolute inset-0 rounded-full" 
                 style={{ 
                   background: `radial-gradient(circle at 30% 30%, ${color}, ${adjustColorBrightness(color, -30)})`,
                   opacity: 0.9
                 }} />
            <div className="absolute inset-0 rounded-full" 
                 style={{ 
                   borderTop: '1px solid rgba(255,255,255,0.4)',
                   borderLeft: '1px solid rgba(255,255,255,0.2)',
                   borderBottom: '1px solid rgba(0,0,0,0.2)',
                   borderRight: '1px solid rgba(0,0,0,0.1)'
                 }} />
          </>
        );
      
      case 'football':
        return (
          <>
            <div className="absolute inset-0 rounded-full" 
                 style={{ 
                   background: `radial-gradient(circle at 30% 30%, ${color}, ${adjustColorBrightness(color, -30)})`,
                   opacity: 0.9
                 }} />
            <div className="absolute inset-0 rounded-full" 
                 style={{ 
                   borderTop: '1px solid rgba(255,255,255,0.2)',
                   borderBottom: '1px solid rgba(0,0,0,0.2)',
                 }} />
            <div className="absolute h-[2px] w-[90%] top-1/2 left-[5%] bg-white/30" />
          </>
        );
        
      case 'soccer':
        return (
          <>
            <div className="absolute inset-0 rounded-full bg-white" />
            <div className="absolute inset-0 rounded-full" 
                 style={{ 
                   background: 'radial-gradient(circle at 70% 70%, transparent 60%, rgba(0,0,0,0.2) 60%)'
                 }} />
            <div className="absolute inset-[15%] rounded-full bg-black/80" 
                 style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          </>
        );
        
      default:
        return <div className="absolute inset-0 rounded-full bg-white" />;
    }
  };
  
  // Ball shadow
  const renderBallShadow = () => (
    <div 
      className="absolute bg-black/50 rounded-full blur-sm" 
      style={{
        width: ballSize * 0.7,
        height: ballSize * 0.3,
        bottom: -3,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: -1
      }}
    />
  );
  
  // Motion effects for the ball
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: visible ? 1 : 0,
        x: position.x, 
        y: position.y,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 200, 
        damping: 20
      }}
      style={{
        position: 'absolute',
        width: ballSize,
        height: ballSize,
        transform: 'translate(-50%, -50%)',
        boxShadow: visible ? `0 0 ${glow}px rgba(255,255,255,0.6)` : 'none',
        zIndex: 8
      }}
    >
      <div className="relative w-full h-full">
        {renderBallContent()}
        {renderBallShadow()}
      </div>
    </motion.div>
  );
};

// Define interface for feature animations
interface FeatureScene {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof iconComponents;
  sport: 'basketball' | 'football' | 'soccer';
  color: string;
  duration: number;
  playerPaths: {
    user: Position[];
    teammates: Position[][];
    opponents: Position[][];
  };
  ballPath?: Position[];
}

// Map of Lucide icons for feature display
const iconComponents = {
  Trophy: Trophy,
  Video: VideoIcon,
  Brain: Brain,
  Chart: BarChart3,
  Verify: BadgeCheck,
  Academic: BookOpen,
  Spark: Sparkles,
  Growth: Leaf,
  Idea: Lightbulb
};

// Prepare feature scenes with animations
const featureScenes: FeatureScene[] = [
  {
    id: 'ai-coach',
    title: 'AI Coaching',
    description: 'Professional-level coaching powered by AI for athletes with ADHD',
    icon: 'Brain',
    sport: 'basketball',
    color: '#2563eb',
    duration: 5,
    playerPaths: {
      user: [
        { x: 50, y: 80 },
        { x: 50, y: 60 },
        { x: 50, y: 40 },
        { x: 40, y: 25 },
        { x: 45, y: 40 }
      ],
      teammates: [
        [
          { x: 80, y: 50 },
          { x: 80, y: 50 },
          { x: 80, y: 50 },
          { x: 80, y: 50 },
          { x: 75, y: 50 }
        ],
        [
          { x: 40, y: 20 },
          { x: 40, y: 20 },
          { x: 40, y: 20 },
          { x: 45, y: 20 },
          { x: 40, y: 20 }
        ]
      ],
      opponents: [
        [
          { x: 50, y: 85 },
          { x: 50, y: 65 },
          { x: 50, y: 45 },
          { x: 45, y: 30 },
          { x: 45, y: 45 }
        ]
      ]
    },
    ballPath: [
      { x: 50, y: 80 },
      { x: 50, y: 60 },
      { x: 50, y: 40 },
      { x: 40, y: 25 },
      { x: 45, y: 40 }
    ]
  },
  {
    id: 'video-analysis',
    title: 'Video Analysis',
    description: 'Upload your game footage for detailed AI performance analysis',
    icon: 'Video',
    sport: 'football',
    color: '#0ea5e9',
    duration: 5,
    playerPaths: {
      user: [
        { x: 50, y: 85 },
        { x: 45, y: 75 },
        { x: 40, y: 70 },
        { x: 45, y: 65 },
        { x: 50, y: 60 }
      ],
      teammates: [
        [
          { x: 80, y: 85 },
          { x: 80, y: 75 },
          { x: 80, y: 65 },
          { x: 80, y: 55 },
          { x: 75, y: 45 }
        ]
      ],
      opponents: [
        [
          { x: 35, y: 85 },
          { x: 40, y: 80 },
          { x: 45, y: 75 },
          { x: 40, y: 70 },
          { x: 40, y: 70 }
        ],
        [
          { x: 50, y: 65 },
          { x: 55, y: 65 },
          { x: 60, y: 60 },
          { x: 65, y: 55 },
          { x: 70, y: 50 }
        ]
      ]
    },
    ballPath: [
      { x: 50, y: 85 },
      { x: 45, y: 75 },
      { x: 40, y: 70 },
      { x: 45, y: 65 },
      { x: 50, y: 60 }
    ]
  },
  {
    id: 'gar-rating',
    title: 'GAR Rating',
    description: 'Comprehensive growth and ability rating system for neurodivergent athletes',
    icon: 'Chart',
    sport: 'soccer',
    color: '#06b6d4',
    duration: 5,
    playerPaths: {
      user: [
        { x: 40, y: 60 },
        { x: 45, y: 55 },
        { x: 50, y: 50 },
        { x: 55, y: 45 },
        { x: 65, y: 30 }
      ],
      teammates: [
        [
          { x: 60, y: 40 },
          { x: 60, y: 40 },
          { x: 60, y: 40 },
          { x: 60, y: 40 },
          { x: 65, y: 35 }
        ]
      ],
      opponents: [
        [
          { x: 35, y: 60 },
          { x: 40, y: 55 },
          { x: 45, y: 50 },
          { x: 50, y: 45 },
          { x: 55, y: 40 }
        ]
      ]
    },
    ballPath: [
      { x: 40, y: 60 },
      { x: 45, y: 55 },
      { x: 50, y: 50 },
      { x: 55, y: 45 },
      { x: 65, y: 30 }
    ]
  },
  {
    id: 'skill-tree',
    title: 'Skill Tree',
    description: 'Visualize your athletic development with gamified progression paths',
    icon: 'Growth',
    sport: 'basketball',
    color: '#3b82f6',
    duration: 5,
    playerPaths: {
      user: [
        { x: 30, y: 70 },
        { x: 40, y: 60 },
        { x: 50, y: 50 },
        { x: 60, y: 40 },
        { x: 70, y: 30 }
      ],
      teammates: [
        [
          { x: 70, y: 70 },
          { x: 65, y: 65 },
          { x: 60, y: 60 },
          { x: 55, y: 55 },
          { x: 50, y: 50 }
        ]
      ],
      opponents: [
        [
          { x: 30, y: 30 },
          { x: 35, y: 35 },
          { x: 40, y: 40 },
          { x: 45, y: 45 },
          { x: 50, y: 50 }
        ]
      ]
    },
    ballPath: [
      { x: 30, y: 70 },
      { x: 40, y: 60 },
      { x: 50, y: 50 },
      { x: 60, y: 40 },
      { x: 70, y: 30 }
    ]
  },
  {
    id: 'academics',
    title: 'Academic Tracking',
    description: 'Monitor classroom progress alongside athletic development',
    icon: 'Academic',
    sport: 'football',
    color: '#0891b2',
    duration: 5,
    playerPaths: {
      user: [
        { x: 40, y: 80 },
        { x: 45, y: 65 },
        { x: 50, y: 50 },
        { x: 55, y: 35 },
        { x: 60, y: 20 }
      ],
      teammates: [],
      opponents: []
    },
    ballPath: [
      { x: 40, y: 80 },
      { x: 45, y: 65 },
      { x: 50, y: 50 },
      { x: 55, y: 35 },
      { x: 60, y: 20 }
    ]
  }
];

interface FeatureCommercialProps {
  autoPlay?: boolean;
}

const FeatureCommercial: React.FC<FeatureCommercialProps> = ({ autoPlay = true }) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [pauseOnCompletion, setPauseOnCompletion] = useState(false);
  const animationRef = useRef<number | null>(null);
  const commercialContainerRef = useRef<HTMLDivElement>(null);
  
  const currentFeature = featureScenes[currentFeatureIndex];
  const totalFrames = currentFeature.playerPaths.user.length;
  const frameDuration = (currentFeature.duration * 1000) / totalFrames; // ms per frame
  
  // Play/pause control
  const togglePlayback = () => {
    setIsPlaying(prev => !prev);
  };
  
  // Reset animation
  const resetAnimation = () => {
    setCurrentFrameIndex(0);
    if (!isPlaying) setIsPlaying(true);
  };
  
  // Navigate to specific feature
  const goToFeature = (index: number) => {
    setCurrentFeatureIndex(index);
    setCurrentFrameIndex(0);
    if (!isPlaying) setIsPlaying(true);
  };
  
  // Handle animation timing
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    const animate = () => {
      setCurrentFrameIndex(prev => {
        // If we've reached the end of the animation
        if (prev >= totalFrames - 1) {
          // Move to next feature
          if (currentFeatureIndex < featureScenes.length - 1) {
            setTimeout(() => {
              setCurrentFeatureIndex(idx => (idx + 1) % featureScenes.length);
              setCurrentFrameIndex(0);
            }, 1000); // Pause at the end of animation before switching
          } else {
            // We've gone through all features, start over
            setTimeout(() => {
              setCurrentFeatureIndex(0);
              setCurrentFrameIndex(0);
              if (pauseOnCompletion) setIsPlaying(false);
            }, 1000);
          }
          return prev;
        }
        return prev + 1;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    const timeout = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, frameDuration);
    
    return () => {
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentFrameIndex, totalFrames, currentFeatureIndex, frameDuration, pauseOnCompletion, featureScenes.length]);
  
  // Get the current positions for all elements
  const userPosition = currentFeature.playerPaths.user[Math.min(currentFrameIndex, totalFrames - 1)];
  const ballPosition = currentFeature.ballPath ? 
    currentFeature.ballPath[Math.min(currentFrameIndex, totalFrames - 1)] : userPosition;
  
  // Get the icon for the current feature
  const FeatureIcon = iconComponents[currentFeature.icon];
  
  const getCourtBackground = () => {
    switch (currentFeature.sport) {
      case 'basketball':
        return (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-[85%] h-[70%] border-2 border-white/50 rounded-md">
              <div className="absolute left-1/2 top-[15%] w-16 h-16 border-2 border-white/50 rounded-full -translate-x-1/2" />
              <div className="absolute left-1/2 bottom-0 w-24 h-12 border-2 border-white/50 -translate-x-1/2 border-b-0" />
              <div className="absolute w-full h-[1px] top-1/2 bg-white/30" />
            </div>
          </div>
        );
      case 'football':
        return (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-[90%] h-[80%] border-2 border-white/50 rounded-md">
              <div className="absolute left-1/2 w-[1px] h-full bg-white/30" />
              <div className="absolute w-12 h-12 left-1/2 top-0 border-2 border-white/50 -translate-x-1/2 border-t-0" />
              <div className="absolute w-12 h-12 left-1/2 bottom-0 border-2 border-white/50 -translate-x-1/2 border-b-0" />
              <div className="absolute w-full h-[1px] top-1/4 bg-white/30" />
              <div className="absolute w-full h-[1px] top-2/4 bg-white/30" />
              <div className="absolute w-full h-[1px] top-3/4 bg-white/30" />
            </div>
          </div>
        );
      case 'soccer':
        return (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-[85%] h-[70%] border-2 border-white/50 rounded-md">
              <div className="absolute left-1/2 w-[1px] h-full bg-white/30" />
              <div className="absolute w-36 h-16 left-0 top-1/2 border-2 border-white/50 -translate-y-1/2 border-l-0" />
              <div className="absolute w-8 h-24 left-0 top-1/2 border-2 border-white/50 -translate-y-1/2 border-l-0" />
              <div className="absolute w-36 h-16 right-0 top-1/2 border-2 border-white/50 -translate-y-1/2 border-r-0" />
              <div className="absolute w-8 h-24 right-0 top-1/2 border-2 border-white/50 -translate-y-1/2 border-r-0" />
              <div className="absolute left-1/2 top-1/2 w-16 h-16 border-2 border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Feature Title */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <div 
            className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-sm"
            style={{
              boxShadow: `0 0 15px rgba(34,211,238,0.3)`
            }}
          >
            <FeatureIcon className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white">
          {currentFeature.title}
        </h3>
        <p className="text-blue-300 mt-1">{currentFeature.description}</p>
      </div>
    
      {/* Animation Area */}
      <div 
        ref={commercialContainerRef}
        className="relative w-full h-[300px] bg-gray-900/50 rounded-xl mb-6 overflow-hidden"
        style={{
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 0 15px rgba(34,211,238,0.2)'
        }}
      >
        {/* Sport-specific court background */}
        {getCourtBackground()}
        
        {/* Outer glow effect */}
        <div 
          className="absolute inset-4 rounded-lg opacity-30"
          style={{
            boxShadow: `0 0 30px 5px ${currentFeature.color}`,
            filter: 'blur(20px)'
          }}
        />
        
        {/* Players */}
        <Player
          position={userPosition}
          color={currentFeature.color}
          isUser={true}
          jersey="1"
          name="You"
          size="md"
          isSelected={true}
          hasAnimation={true}
        />
        
        {/* Teammates */}
        {currentFeature.playerPaths.teammates.map((path, teamIndex) => (
          <Player
            key={`teammate-${teamIndex}`}
            position={path[Math.min(currentFrameIndex, path.length - 1)]}
            color="#22c55e"
            jersey={(teamIndex + 2).toString()}
            size="md"
          />
        ))}
        
        {/* Opponents */}
        {currentFeature.playerPaths.opponents.map((path, oppIndex) => (
          <Player
            key={`opponent-${oppIndex}`}
            position={path[Math.min(currentFrameIndex, path.length - 1)]}
            color="#ef4444"
            jersey={(oppIndex + 1).toString()}
            size="md"
          />
        ))}
        
        {/* Ball - only show when a ball path is defined */}
        {currentFeature.ballPath && (
          <Ball
            position={ballPosition}
            visible={true}
            sport={currentFeature.sport}
            size="md"
          />
        )}
        
        {/* Progress indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {featureScenes.map((_, index) => (
            <button
              key={`progress-${index}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentFeatureIndex ? 'w-6 bg-blue-400' : 'bg-gray-600'
              }`}
              onClick={() => goToFeature(index)}
              aria-label={`View feature ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Playback controls */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-black/50 border-gray-700 hover:bg-black/70"
            onClick={togglePlayback}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-black/50 border-gray-700 hover:bg-black/70"
            onClick={resetAnimation}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Feature Navigation */}
      <div className="flex justify-center flex-wrap gap-2">
        {featureScenes.map((feature, index) => {
          const Icon = iconComponents[feature.icon];
          return (
            <Button
              key={feature.id}
              variant={currentFeatureIndex === index ? "default" : "ghost"}
              size="sm"
              className={`flex items-center gap-1.5 px-3 py-1 ${
                currentFeatureIndex === index 
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-400' 
                  : 'hover:bg-gray-800'
              }`}
              onClick={() => goToFeature(index)}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="text-xs">{feature.title}</span>
            </Button>
          );
        })}
      </div>
      
      {/* CTA Button */}
      <div className="flex justify-center mt-6">
        <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] text-lg font-semibold">
          <Link href="/auth">Get Started Today</Link>
        </Button>
      </div>
    </div>
  );
};

export default FeatureCommercial;