import { useRef, useEffect, useState, MouseEvent } from 'react';
import { websocketService } from '@/services/websocket-service';
import { Button } from '@/components/ui/button';
import { Eraser, Pencil, Type, Circle, Square, Undo, Save, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  color: string;
}

interface Position {
  x: number;
  y: number;
}

type DrawingPath = {
  path: Position[];
  color: string;
  lineWidth: number;
  tool: string;
  userId: number;
};

type TextObject = {
  text: string;
  position: Position;
  color: string;
  userId: number;
};

type ShapeObject = {
  type: 'circle' | 'rectangle';
  position: Position;
  size: number;
  color: string;
  userId: number;
};

interface CollaborativeWhiteboardProps {
  sessionId: string;
  userId: number;
  username: string;
}

const CollaborativeWhiteboard = ({ sessionId, userId, username }: CollaborativeWhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'text' | 'circle' | 'rectangle'>('pen');
  const [currentColor, setCurrentColor] = useState('#0066CC');
  const [lineWidth, setLineWidth] = useState(2);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [textObjects, setTextObjects] = useState<TextObject[]>([]);
  const [shapeObjects, setShapeObjects] = useState<ShapeObject[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [currentPath, setCurrentPath] = useState<Position[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Connect to WebSocket when component mounts
  useEffect(() => {
    websocketService.connect(userId);

    const handleWhiteboardMessages = (message: any) => {
      if (message.type === 'whiteboard') {
        const { data } = message;
        
        if (data.sessionId !== sessionId) return;
        
        switch (data.eventType) {
          case 'sessionState':
            // Initialize whiteboard with current state
            setPaths(data.paths || []);
            setTextObjects(data.textObjects || []);
            setShapeObjects(data.shapeObjects || []);
            setActiveUsers(data.activeUsers || []);
            break;
            
          case 'draw':
            if (data.path) {
              setPaths(prev => [...prev, {
                path: data.path,
                color: data.color || '#000000',
                lineWidth: data.lineWidth || 2,
                tool: data.tool || 'pen',
                userId: data.userId
              }]);
            }
            break;
            
          case 'text':
            if (data.textObject) {
              setTextObjects(prev => [...prev, data.textObject]);
            }
            break;
            
          case 'shape':
            if (data.shapeObject) {
              setShapeObjects(prev => [...prev, data.shapeObject]);
            }
            break;
            
          case 'clear':
            setPaths([]);
            setTextObjects([]);
            setShapeObjects([]);
            break;
            
          case 'userJoined':
            setActiveUsers(prev => {
              if (prev.some(user => user.id === data.userId)) {
                return prev; // User already in the list
              }
              return [...prev, {
                id: data.userId,
                name: data.username,
                color: data.color || '#0066CC'
              }];
            });
            
            toast({
              title: 'User Joined',
              description: `${data.username} joined the board`,
            });
            break;
            
          case 'userLeft':
            setActiveUsers(prev => prev.filter(user => user.id !== data.userId));
            toast({
              title: 'User Left',
              description: `${data.username} left the board`,
            });
            break;
        }
      }
    };

    websocketService.addMessageListener(handleWhiteboardMessages);
    
    // Send join message when component mounts
    websocketService.sendWhiteboardEvent(sessionId, {
      type: 'join',
      color: currentColor
    });
    
    // Request current session state
    websocketService.sendWhiteboardEvent(sessionId, {
      type: 'requestState'
    });

    return () => {
      // Send leave message when component unmounts
      websocketService.sendWhiteboardEvent(sessionId, {
        type: 'leave'
      });
      
      websocketService.removeMessageListener(handleWhiteboardMessages);
    };
  }, [sessionId, userId, username, currentColor, toast]);

  // Initialize canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to full parent size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      // Initialize context
      const context = canvas.getContext('2d');
      if (!context) return;
      
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = currentColor;
      context.lineWidth = lineWidth;
      contextRef.current = context;
      
      // Redraw all objects
      redrawCanvas();
    };
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Redraw canvas when paths or objects change
  useEffect(() => {
    redrawCanvas();
  }, [paths, textObjects, shapeObjects]);

  const redrawCanvas = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all paths
    paths.forEach(path => {
      if (path.path.length < 2) return;
      
      context.beginPath();
      context.strokeStyle = path.color;
      context.lineWidth = path.lineWidth;
      
      context.moveTo(path.path[0].x, path.path[0].y);
      
      for (let i = 1; i < path.path.length; i++) {
        context.lineTo(path.path[i].x, path.path[i].y);
      }
      
      context.stroke();
    });
    
    // Draw all text objects
    textObjects.forEach(textObj => {
      context.font = '16px Arial';
      context.fillStyle = textObj.color;
      context.fillText(textObj.text, textObj.position.x, textObj.position.y);
    });
    
    // Draw all shape objects
    shapeObjects.forEach(shapeObj => {
      context.beginPath();
      context.fillStyle = shapeObj.color;
      
      if (shapeObj.type === 'circle') {
        context.arc(
          shapeObj.position.x,
          shapeObj.position.y,
          shapeObj.size,
          0,
          2 * Math.PI
        );
      } else if (shapeObj.type === 'rectangle') {
        context.rect(
          shapeObj.position.x - shapeObj.size,
          shapeObj.position.y - shapeObj.size,
          shapeObj.size * 2,
          shapeObj.size * 2
        );
      }
      
      context.fill();
    });
  };

  function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'text') {
      if (textInputRef.current) {
        textInputRef.current.style.display = 'block';
        textInputRef.current.style.left = `${e.nativeEvent.offsetX}px`;
        textInputRef.current.style.top = `${e.nativeEvent.offsetY}px`;
        textInputRef.current.focus();
      }
      return;
    }
    
    const { offsetX, offsetY } = e.nativeEvent;
    
    if (currentTool === 'circle' || currentTool === 'rectangle') {
      const newShape: ShapeObject = {
        type: currentTool === 'circle' ? 'circle' : 'rectangle',
        position: { x: offsetX, y: offsetY },
        size: 30, // Default size
        color: currentColor,
        userId: userId
      };
      
      setShapeObjects(prev => [...prev, newShape]);
      
      websocketService.sendWhiteboardEvent(sessionId, {
        type: 'shape',
        shapeObject: newShape
      });
      
      return;
    }
    
    const context = contextRef.current;
    if (!context) return;
    
    setIsDrawing(true);
    
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    context.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    context.lineWidth = lineWidth;
    
    setCurrentPath([{ x: offsetX, y: offsetY }]);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    const context = contextRef.current;
    if (!context) return;
    
    context.lineTo(offsetX, offsetY);
    context.stroke();
    
    setCurrentPath(prev => [...prev, { x: offsetX, y: offsetY }]);
  };

  const finishDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (currentPath.length > 0) {
      const newPath: DrawingPath = {
        path: currentPath,
        color: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
        lineWidth: lineWidth,
        tool: currentTool,
        userId: userId
      };
      
      setPaths(prev => [...prev, newPath]);
      
      // Send drawing to server
      websocketService.sendWhiteboardEvent(sessionId, {
        type: 'draw',
        path: currentPath,
        color: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
        lineWidth: lineWidth,
        tool: currentTool
      });
    }
    
    setCurrentPath([]);
  };

  const handleTextSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && textInputRef.current) {
      const text = textInputRef.current.value;
      if (!text.trim()) {
        textInputRef.current.style.display = 'none';
        textInputRef.current.value = '';
        return;
      }
      
      const left = parseInt(textInputRef.current.style.left, 10);
      const top = parseInt(textInputRef.current.style.top, 10);
      
      const newText: TextObject = {
        text,
        position: { x: left, y: top },
        color: currentColor,
        userId: userId
      };
      
      setTextObjects(prev => [...prev, newText]);
      
      // Send text to server
      websocketService.sendWhiteboardEvent(sessionId, {
        type: 'text',
        textObject: newText
      });
      
      textInputRef.current.style.display = 'none';
      textInputRef.current.value = '';
    }
  };

  const clearCanvas = () => {
    setPaths([]);
    setTextObjects([]);
    setShapeObjects([]);
    
    // Send clear to server
    websocketService.sendWhiteboardEvent(sessionId, {
      type: 'clear'
    });
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `strategy-board-${sessionId}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

  return (
    <div className="flex flex-col h-full relative">
      <div className="absolute top-2 left-2 z-10 flex space-x-2 bg-background/90 rounded-md p-2 shadow-lg">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentTool === 'pen' ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentTool('pen')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pen</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentTool === 'eraser' ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentTool('eraser')}
              >
                <Eraser className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Eraser</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentTool === 'text' ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentTool('text')}
              >
                <Type className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentTool === 'circle' ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentTool('circle')}
              >
                <Circle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Circle</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentTool === 'rectangle' ? "default" : "outline"}
                size="icon" 
                onClick={() => setCurrentTool('rectangle')}
              >
                <Square className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rectangle</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="border-2"
              style={{ backgroundColor: currentColor }}
            >
              <span className="sr-only">Select color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setCurrentColor(color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Line Width: {lineWidth}px
              </label>
              <Slider
                value={[lineWidth]}
                min={1}
                max={20}
                step={1}
                onValueChange={(values) => setLineWidth(values[0])}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="absolute top-2 right-2 z-10 flex space-x-2 bg-background/90 rounded-md p-2 shadow-lg">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={saveCanvas}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={clearCanvas}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear All</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="absolute bottom-2 left-2 z-10 bg-background/90 rounded-md p-2 shadow-lg">
        <h3 className="text-sm font-medium mb-1">Active Users</h3>
        <div className="flex flex-wrap gap-1 max-w-xs">
          <div 
            className="flex items-center space-x-1 text-xs px-2 py-1 rounded-full" 
            style={{ backgroundColor: currentColor }}
          >
            <span className="font-bold text-white">{username} (You)</span>
          </div>
          {activeUsers.map(user => (
            <div 
              key={user.id}
              className="flex items-center space-x-1 text-xs px-2 py-1 rounded-full" 
              style={{ backgroundColor: user.color }}
            >
              <span className="font-bold text-white">{user.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="flex-1 cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
      ></canvas>
      
      <input
        ref={textInputRef}
        type="text"
        className="absolute hidden px-2 py-1 bg-transparent border-b-2 border-primary focus:outline-none"
        style={{ top: 0, left: 0 }}
        onKeyDown={handleTextSubmit}
        placeholder="Type and press Enter"
      />
    </div>
  );
};

export default CollaborativeWhiteboard;