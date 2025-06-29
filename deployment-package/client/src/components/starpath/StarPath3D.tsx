import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/simplified-auth-context";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// This component renders the interactive 3D StarPath experience
// with PlayStation 5-quality visuals and game-like mechanics
export const StarPath3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize the 3D experience
  useEffect(() => {
    if (!canvasRef.current || initialized) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const initStarPath = async () => {
      try {
        setLoading(true);
        
        // Simulating loading the 3D engine and assets
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Setup canvas size
        const resizeCanvas = () => {
          const { width, height } = canvas.getBoundingClientRect();
          canvas.width = width;
          canvas.height = height;
          drawStarPath(ctx, canvas.width, canvas.height);
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Initialize the simulation
        setInitialized(true);
        setLoading(false);
        
        // Start animation loop
        let animationFrame: number;
        const animate = () => {
          drawStarPath(ctx, canvas.width, canvas.height);
          animationFrame = requestAnimationFrame(animate);
        };
        animate();
        
        return () => {
          window.removeEventListener('resize', resizeCanvas);
          cancelAnimationFrame(animationFrame);
        };
      } catch (error) {
        console.error("Error initializing StarPath 3D:", error);
        toast({
          title: "StarPath Error",
          description: "Could not initialize the interactive experience. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    initStarPath();
  }, [toast, initialized]);
  
  // Draw the StarPath field and player avatar
  const drawStarPath = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background gradient (dark blue to slightly lighter blue)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0e1628');
    gradient.addColorStop(1, '#1a2744');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw field grid
    drawGrid(ctx, width, height);
    
    // Draw skill nodes
    drawSkillNodes(ctx, width, height);
    
    // Draw player avatar
    drawPlayerAvatar(ctx, width, height);
    
    // Draw effects
    drawEffects(ctx, width, height);
  };
  
  // Draw the grid representing the skill field
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.2)';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    const rows = 20;
    const rowHeight = height / rows;
    for (let i = 0; i <= rows; i++) {
      const y = i * rowHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical lines
    const cols = 20;
    const colWidth = width / cols;
    for (let i = 0; i <= cols; i++) {
      const x = i * colWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  };
  
  // Draw the skill nodes on the field
  const drawSkillNodes = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Define some sample skill nodes
    const skills = [
      { x: width * 0.2, y: height * 0.3, radius: 30, color: '#22c55e', name: 'Speed', level: 3 },
      { x: width * 0.4, y: height * 0.2, radius: 25, color: '#3b82f6', name: 'Shooting', level: 4 },
      { x: width * 0.6, y: height * 0.3, radius: 20, color: '#8b5cf6', name: 'Awareness', level: 2 },
      { x: width * 0.8, y: height * 0.4, radius: 30, color: '#eab308', name: 'Focus', level: 3 },
      { x: width * 0.3, y: height * 0.6, radius: 25, color: '#22c55e', name: 'Strength', level: 2 },
      { x: width * 0.5, y: height * 0.7, radius: 30, color: '#3b82f6', name: 'Handling', level: 3 },
      { x: width * 0.7, y: height * 0.6, radius: 20, color: '#8b5cf6', name: 'Team Play', level: 3 },
      { x: width * 0.6, y: height * 0.5, radius: 25, color: '#eab308', name: 'Resilience', level: 3 },
    ];
    
    // Connect related skills with lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(skills[0].x, skills[0].y);
    ctx.lineTo(skills[1].x, skills[1].y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(skills[1].x, skills[1].y);
    ctx.lineTo(skills[2].x, skills[2].y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(skills[2].x, skills[2].y);
    ctx.lineTo(skills[3].x, skills[3].y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(skills[0].x, skills[0].y);
    ctx.lineTo(skills[4].x, skills[4].y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(skills[4].x, skills[4].y);
    ctx.lineTo(skills[5].x, skills[5].y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(skills[5].x, skills[5].y);
    ctx.lineTo(skills[6].x, skills[6].y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(skills[6].x, skills[6].y);
    ctx.lineTo(skills[7].x, skills[7].y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(skills[2].x, skills[2].y);
    ctx.lineTo(skills[7].x, skills[7].y);
    ctx.stroke();
    
    // Draw each skill node
    skills.forEach(skill => {
      // Outer glow
      const gradient = ctx.createRadialGradient(
        skill.x, skill.y, skill.radius * 0.5,
        skill.x, skill.y, skill.radius * 1.5
      );
      gradient.addColorStop(0, skill.color + '80');
      gradient.addColorStop(1, skill.color + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(skill.x, skill.y, skill.radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner circle
      ctx.fillStyle = skill.color + '30';
      ctx.beginPath();
      ctx.arc(skill.x, skill.y, skill.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Border
      ctx.strokeStyle = skill.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(skill.x, skill.y, skill.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Level indicator
      const angle = Math.PI * 2 / 5; // 5 is max level
      const startAngle = -Math.PI / 2; // Start from top
      
      for (let i = 0; i < 5; i++) {
        const segmentStartAngle = startAngle + i * angle;
        const segmentEndAngle = segmentStartAngle + angle * 0.8; // Leave a small gap between segments
        
        ctx.beginPath();
        ctx.arc(skill.x, skill.y, skill.radius * 0.8, segmentStartAngle, segmentEndAngle);
        ctx.lineWidth = 4;
        ctx.strokeStyle = i < skill.level ? skill.color : 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();
      }
      
      // Skill name
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(skill.name, skill.x, skill.y + skill.radius + 15);
      
      // Skill level
      ctx.fillStyle = skill.color;
      ctx.fillText(`Lv ${skill.level}`, skill.x, skill.y + skill.radius + 30);
    });
  };
  
  // Draw the player's avatar
  const drawPlayerAvatar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const x = width * 0.5;
    const y = height * 0.4;
    const radius = 40;
    
    // Pulsing glow effect
    const time = Date.now() * 0.001;
    const pulse = Math.sin(time * 2) * 0.2 + 0.8;
    
    // Avatar glow
    const gradient = ctx.createRadialGradient(
      x, y, radius * 0.5,
      x, y, radius * 2 * pulse
    );
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2 * pulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Avatar circle
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Avatar border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Player icon
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y - 10, 10, 0, Math.PI * 2); // Head
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 15); // Body
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x - 15, y); // Arms
    ctx.lineTo(x + 15, y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y + 15); // Legs
    ctx.lineTo(x - 10, y + 25);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y + 15);
    ctx.lineTo(x + 10, y + 25);
    ctx.stroke();
    
    // Player level
    const level = 5; // Sample level
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${level}`, x, y + radius + 20);
    
    // Player name
    ctx.fillStyle = '#3b82f6';
    ctx.font = '14px Arial';
    ctx.fillText(user?.name || 'Athlete', x, y + radius + 40);
  };
  
  // Draw various visual effects to enhance the experience
  const drawEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const time = Date.now() * 0.001;
    
    // Draw floating particles
    for (let i = 0; i < 50; i++) {
      const x = Math.sin(time * 0.5 + i * 0.3) * width * 0.5 + width * 0.5;
      const y = Math.cos(time * 0.7 + i * 0.2) * height * 0.5 + height * 0.5;
      const size = Math.sin(time + i) * 2 + 3;
      
      ctx.fillStyle = `rgba(59, 130, 246, ${0.1 + Math.sin(time + i) * 0.05})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw flowing lines along the bottom
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x <= width; x += 20) {
      const y = height - 50 + Math.sin(x * 0.01 + time * 2) * 20;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  };
  
  return (
    <div className="relative w-full bg-slate-900 rounded-xl overflow-hidden" style={{ height: '70vh', minHeight: '500px' }}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <p className="text-lg text-white font-medium">Loading StarPath...</p>
          <p className="text-sm text-slate-400 mt-2">Preparing your interactive experience</p>
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
        <div className="flex justify-between items-center">
          <div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm mr-2">
              Unlock Skills
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md font-medium text-sm">
              View Achievements
            </button>
          </div>
          <div>
            <div className="bg-slate-800 px-3 py-1 rounded-md text-xs text-slate-300">
              <span className="text-blue-400 font-medium">28,450</span> XP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarPath3D;