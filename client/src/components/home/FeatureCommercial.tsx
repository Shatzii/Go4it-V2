import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  RefreshCw,
  Trophy, 
  VideoIcon,
  Brain,
  BarChart3,
  BadgeCheck,
  Leaf,
  BookOpen,
  Lightbulb,
  Sparkles,
  ChevronRight,
  ChevronLeft
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

// Player Component
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

const Player: React.FC<PlayerProps> = ({ 
  position, 
  color, 
  isUser = false, 
  jersey = "1", 
  name,
  size = 'md',
  isSelected = false,
  hasAnimation = false
}) => {
  // Size mapping
  const sizeMap = {
    sm: { circleSize: 24, fontSize: 12, shadowSize: 2, glow: 4 },
    md: { circleSize: 32, fontSize: 14, shadowSize: 3, glow: 6 },
    lg: { circleSize: 40, fontSize: 16, shadowSize: 4, glow: 8 }
  };
  
  const { circleSize, fontSize, shadowSize, glow } = sizeMap[size];
  
  // Player shadow effect
  const renderPlayerShadow = () => (
    <div 
      className="absolute rounded-full bg-black/50 blur-sm" 
      style={{
        width: circleSize,
        height: circleSize / 4,
        bottom: -shadowSize,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: -1
      }}
    />
  );
  
  // Motion trail effect
  const renderMotionTrail = () => {
    if (!hasAnimation) return null;
    
    return (
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0.5, scale: 1.1 }}
        animate={{ 
          opacity: [0.5, 0.2, 0],
          scale: [1, 1.05, 1.1],
          x: [0, -3, -6],
          y: [0, 0, 0]
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}, ${adjustColorBrightness(color, -30)})`,
          filter: 'blur(2px)'
        }}
      />
    );
  };
  
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
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255,255,255,0.1)',
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
                   borderTopWidth: '1px',
                   borderTopStyle: 'solid',
                   borderTopColor: 'rgba(255,255,255,0.4)',
                   borderLeftWidth: '1px',
                   borderLeftStyle: 'solid',
                   borderLeftColor: 'rgba(255,255,255,0.2)',
                   borderBottomWidth: '1px',
                   borderBottomStyle: 'solid',
                   borderBottomColor: 'rgba(0,0,0,0.2)',
                   borderRightWidth: '1px',
                   borderRightStyle: 'solid',
                   borderRightColor: 'rgba(0,0,0,0.1)'
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
                   borderTopWidth: '1px',
                   borderTopStyle: 'solid',
                   borderTopColor: 'rgba(255,255,255,0.2)',
                   borderBottomWidth: '1px',
                   borderBottomStyle: 'solid',
                   borderBottomColor: 'rgba(0,0,0,0.2)',
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

  // Previous feature
  const goToPreviousFeature = () => {
    setCurrentFeatureIndex(prev => (prev - 1 + featureScenes.length) % featureScenes.length);
    setCurrentFrameIndex(0);
    if (!isPlaying) setIsPlaying(true);
  };

  // Next feature
  const goToNextFeature = () => {
    setCurrentFeatureIndex(prev => (prev + 1) % featureScenes.length);
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
  }, [isPlaying, currentFrameIndex, totalFrames, currentFeatureIndex, frameDuration, pauseOnCompletion]);

  // Custom field backgrounds for different sports
  const getCourtBackground = () => {
    switch (currentFeature.sport) {
      case 'basketball':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80%] h-[70%] border border-gray-600/30 rounded-lg">
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-16 h-16 border border-gray-600/30 rounded-full" />
              <div className="absolute w-full h-[1px] top-1/2 bg-gray-600/20" />
            </div>
          </div>
        );
      case 'football':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[85%] h-[75%] border border-gray-600/30 rounded-lg">
              <div className="absolute w-full h-[1px] top-1/4 bg-gray-600/20" />
              <div className="absolute w-full h-[1px] top-1/2 bg-gray-600/20" />
              <div className="absolute w-full h-[1px] top-3/4 bg-gray-600/20" />
              <div className="absolute left-1/2 w-[1px] h-full bg-gray-600/20" />
            </div>
          </div>
        );
      case 'soccer':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[85%] h-[70%] border border-gray-600/30 rounded-lg">
              <div className="absolute left-1/2 top-1/2 w-16 h-16 border border-gray-600/30 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute w-20 h-10 left-0 top-1/2 border-t border-r border-b border-gray-600/30 transform -translate-y-1/2" />
              <div className="absolute w-20 h-10 right-0 top-1/2 border-t border-l border-b border-gray-600/30 transform -translate-y-1/2" />
              <div className="absolute left-1/2 w-[1px] h-full bg-gray-600/20" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Create field container with animated elements
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Feature Title */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <div 
            className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-sm"
            style={{
              boxShadow: `0 0 15px rgba(34,211,238,0.3)`
            }}
          >
            {React.createElement(iconComponents[currentFeature.icon], { 
              className: "w-8 h-8 text-cyan-400"
            })}
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
        className="relative w-full h-[400px] bg-gray-900/50 rounded-xl mb-6 overflow-hidden"
        style={{
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 0 15px rgba(34,211,238,0.2)'
        }}
      >
        {/* Sport-specific court background */}
        {getCourtBackground()}
        
        {/* Dynamic background effects */}
        <div className="absolute inset-0">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`h-line-${i}`} 
                className="absolute w-full h-[1px] bg-gray-400"
                style={{ top: `${i * 25}%` }}
              />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`v-line-${i}`} 
                className="absolute h-full w-[1px] bg-gray-400"
                style={{ left: `${i * 25}%` }}
              />
            ))}
          </div>
          
          {/* Radial gradient for the current feature */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${currentFeature.color}10 0%, transparent 70%)`
            }}
          />
          
          {/* Animated particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-blue-400"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0.1 + Math.random() * 0.2,
                scale: 0.3 + Math.random() * 0.7
              }}
              animate={{
                y: [null, Math.random() * 100 + '%'],
                x: [null, Math.random() * 100 + '%'],
                opacity: [null, 0.05 + Math.random() * 0.1]
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                backgroundColor: adjustColorBrightness(currentFeature.color, Math.random() * 40)
              }}
            />
          ))}
        </div>
        
        {/* Outer glow effect */}
        <div 
          className="absolute inset-4 rounded-lg opacity-20"
          style={{
            boxShadow: `0 0 30px 5px ${currentFeature.color}`,
            filter: 'blur(20px)'
          }}
        />
        
        {/* Players */}
        <Player
          position={currentFeature.playerPaths.user[currentFrameIndex]}
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
            position={currentFeature.ballPath[Math.min(currentFrameIndex, currentFeature.ballPath.length - 1)]}
            visible={true}
            sport={currentFeature.sport}
            size="md"
          />
        )}
        
        {/* Navigation arrows */}
        <motion.button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          onClick={goToPreviousFeature}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          onClick={goToNextFeature}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
        
        {/* Progress indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {featureScenes.map((scene, index) => (
            <button
              key={`progress-${index}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentFeatureIndex ? 'w-8 bg-blue-400' : 'w-2 bg-gray-600 hover:bg-gray-500'
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
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Feature info card */}
        <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-8 px-4">
          <div className="flex items-center space-x-3">
            <div 
              className="rounded-full p-2"
              style={{ 
                background: `linear-gradient(135deg, ${currentFeature.color}, ${adjustColorBrightness(currentFeature.color, -30)})`,
                boxShadow: `0 0 10px ${currentFeature.color}40`
              }}
            >
              {React.createElement(iconComponents[currentFeature.icon], { 
                className: "w-5 h-5 text-white"
              })}
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">{currentFeature.title}</h4>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature explanation text below the animation */}
      <motion.div
        key={currentFeature.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-center text-gray-300 text-sm max-w-3xl mx-auto"
      >
        {currentFeature.id === 'ai-coach' && (
          <p>Personalized AI coaching tailored to neurodivergent athletes. Get detailed feedback on technique, strategy, and game awareness.</p>
        )}
        {currentFeature.id === 'video-analysis' && (
          <p>Upload game footage and receive AI-powered analysis highlighting strengths, areas for improvement, and ADHD-optimized development recommendations.</p>
        )}
        {currentFeature.id === 'gar-rating' && (
          <p>Our proprietary Growth and Ability Rating system measures physical, technical, mental, and neurodivergent-specific skills for comprehensive development tracking.</p>
        )}
        {currentFeature.id === 'skill-tree' && (
          <p>Visualize your development with our immersive skill tree. Unlock new abilities and track progress through a PlayStation-quality interface.</p>
        )}
        {currentFeature.id === 'academics' && (
          <p>Track academic performance alongside athletic development. Monitor GPA, NCAA eligibility, and receive ADHD-specific study strategies.</p>
        )}
      </motion.div>
    </div>
  );
};

export default FeatureCommercial;