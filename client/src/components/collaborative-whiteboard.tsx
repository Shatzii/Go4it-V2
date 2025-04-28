import { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { websocketService } from '@/services/websocket-service';
import { 
  Eraser, 
  PenTool, 
  Circle, 
  Square, 
  Type, 
  ChevronDown, 
  Download, 
  Undo, 
  Redo, 
  Trash, 
  Users,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'text' | 'circle' | 'rectangle'>('pen');
  const [currentPath, setCurrentPath] = useState<Position[]>([]);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [textObjects, setTextObjects] = useState<TextObject[]>([]);
  const [shapeObjects, setShapeObjects] = useState<ShapeObject[]>([]);
  const [color, setColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(3);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<Position | null>(null);
  const [isAddingText, setIsAddingText] = useState(false);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const { toast } = useToast();
  const [userColor] = useState(() => getRandomColor());
  
  // Drawing history for undo/redo
  const [history, setHistory] = useState<{
    paths: DrawingPath[];
    textObjects: TextObject[];
    shapeObjects: ShapeObject[];
  }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Generate a random color for each user
  function getRandomColor() {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33F5', 
      '#33FFF5', '#F5FF33', '#FF5733', '#33FF57'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Initialize WebSocket connection when the component mounts
  useEffect(() => {
    // Connect to WebSocket when component mounts
    if (!websocketService.socket || websocketService.socket.readyState !== WebSocket.OPEN) {
      websocketService.connect(userId);
    }

    // Authenticate with the WebSocket server
    if (userId) {
      websocketService.authenticate(userId);
    }

    // Join the whiteboard session
    websocketService.sendWhiteboardEvent(sessionId, {
      type: 'join',
      userId,
      username,
      color: userColor,
      sessionId
    });

    // Add message listener for whiteboard events
    const handleWhiteboardMessage = (message: any) => {
      if (message.type !== 'whiteboard') return;
      
      const data = message.data;
      
      switch (data.eventType) {
        case 'draw':
          handleRemoteDrawEvent(data);
          break;
        case 'text':
          handleRemoteTextEvent(data);
          break;
        case 'shape':
          handleRemoteShapeEvent(data);
          break;
        case 'clear':
          handleRemoteClearEvent();
          break;
        case 'userJoined':
          handleUserJoined(data);
          break;
        case 'userLeft':
          handleUserLeft(data);
          break;
        case 'sessionState':
          handleSessionState(data);
          break;
      }
    };

    websocketService.addMessageListener(handleWhiteboardMessage);

    // Request the current session state
    websocketService.sendWhiteboardEvent(sessionId, {
      type: 'requestState',
      sessionId
    });

    // Clean up WebSocket connection when component unmounts
    return () => {
      websocketService.sendWhiteboardEvent(sessionId, {
        type: 'leave',
        userId,
        sessionId
      });
      websocketService.removeMessageListener(handleWhiteboardMessage);
    };
  }, [sessionId, userId, username, userColor]);

  // When paths, textObjects, or shapeObjects change, update the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas background color (dark grey)
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw all paths
    paths.forEach((path) => {
      if (path.path.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(path.path[0].x, path.path[0].y);
      
      for (let i = 1; i < path.path.length; i++) {
        ctx.lineTo(path.path[i].x, path.path[i].y);
      }
      
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
    
    // Draw all text objects
    textObjects.forEach((textObj) => {
      ctx.font = '16px Arial';
      ctx.fillStyle = textObj.color;
      ctx.fillText(textObj.text, textObj.position.x, textObj.position.y);
    });
    
    // Draw all shape objects
    shapeObjects.forEach((shapeObj) => {
      ctx.fillStyle = shapeObj.color;
      
      if (shapeObj.type === 'circle') {
        ctx.beginPath();
        ctx.arc(
          shapeObj.position.x, 
          shapeObj.position.y, 
          shapeObj.size / 2, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
      } else if (shapeObj.type === 'rectangle') {
        ctx.fillRect(
          shapeObj.position.x - shapeObj.size / 2,
          shapeObj.position.y - shapeObj.size / 2,
          shapeObj.size,
          shapeObj.size
        );
      }
    });
    
    // Draw the current path if drawing
    if (isDrawing && currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }, [paths, textObjects, shapeObjects, isDrawing, currentPath, color, lineWidth]);

  // Set canvas dimensions when the component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      // Redraw everything when the canvas is resized
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (tool === 'text') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setTextPosition({ x, y });
      setIsAddingText(true);
      return;
    }
    
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPath([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing || tool === 'text') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPath((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing || tool === 'text') return;
    
    setIsDrawing(false);
    
    if (currentPath.length < 2) {
      setCurrentPath([]);
      return;
    }
    
    const newPath: DrawingPath = {
      path: currentPath,
      color: tool === 'eraser' ? '#1e1e1e' : color,
      lineWidth: tool === 'eraser' ? 20 : lineWidth,
      tool,
      userId
    };
    
    // Add to history
    const newPaths = [...paths, newPath];
    addToHistory(newPaths, textObjects, shapeObjects);
    
    setPaths(newPaths);
    setCurrentPath([]);
    
    // Send to other users
    websocketService.sendWhiteboardEvent(sessionId, {
      type: 'draw',
      path: newPath,
      sessionId
    });
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
      handleMouseUp();
    }
  };

  // Tool selection handlers
  const handleToolSelect = (selectedTool: 'pen' | 'eraser' | 'text' | 'circle' | 'rectangle') => {
    setTool(selectedTool);
    if (isAddingText) {
      setIsAddingText(false);
      setTextPosition(null);
    }
  };

  // Text input handlers
  const handleTextSubmit = () => {
    if (!textPosition || !textInput.trim()) {
      setIsAddingText(false);
      setTextPosition(null);
      setTextInput('');
      return;
    }
    
    const newText: TextObject = {
      text: textInput,
      position: textPosition,
      color,
      userId
    };
    
    // Add to history
    const newTextObjects = [...textObjects, newText];
    addToHistory(paths, newTextObjects, shapeObjects);
    
    setTextObjects(newTextObjects);
    setIsAddingText(false);
    setTextPosition(null);
    setTextInput('');
    
    // Send to other users
    websocketService.sendWhiteboardEvent(sessionId, {
      type: 'text',
      textObject: newText,
      sessionId
    });
  };

  // Shape handlers
  const handleAddShape = (type: 'circle' | 'rectangle') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    
    const newShape: ShapeObject = {
      type,
      position: { x, y },
      size: 50,
      color,
      userId
    };
    
    // Add to history
    const newShapeObjects = [...shapeObjects, newShape];
    addToHistory(paths, textObjects, newShapeObjects);
    
    setShapeObjects(newShapeObjects);
    
    // Send to other users
    websocketService.sendWhiteboardEvent(sessionId, {
      type: 'shape',
      shapeObject: newShape,
      sessionId
    });
  };

  // Clear canvas handler
  const handleClearCanvas = () => {
    // Add to history
    addToHistory(paths, textObjects, shapeObjects);
    
    setPaths([]);
    setTextObjects([]);
    setShapeObjects([]);
    
    // Send to other users
    websocketService.sendWhiteboardEvent(sessionId, {
      type: 'clear',
      sessionId
    });

    toast({
      title: "Canvas cleared",
      description: "The whiteboard has been cleared"
    });
  };

  // Undo/Redo handlers
  const addToHistory = (
    currentPaths: DrawingPath[],
    currentTextObjects: TextObject[],
    currentShapeObjects: ShapeObject[]
  ) => {
    const newHistoryState = {
      paths: [...currentPaths],
      textObjects: [...currentTextObjects],
      shapeObjects: [...currentShapeObjects]
    };
    
    // If we're not at the end of the history, remove everything after the current index
    const newHistory = history.slice(0, historyIndex + 1);
    
    setHistory([...newHistory, newHistoryState]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    if (newIndex >= 0) {
      const previousState = history[newIndex];
      setPaths([...previousState.paths]);
      setTextObjects([...previousState.textObjects]);
      setShapeObjects([...previousState.shapeObjects]);
    } else {
      setPaths([]);
      setTextObjects([]);
      setShapeObjects([]);
    }
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    
    const nextState = history[newIndex];
    setPaths([...nextState.paths]);
    setTextObjects([...nextState.textObjects]);
    setShapeObjects([...nextState.shapeObjects]);
  };

  // Export canvas handler
  const handleExportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `strategy-board-${sessionId}.png`;
    link.href = dataUrl;
    link.click();

    toast({
      title: "Whiteboard exported",
      description: "The whiteboard has been exported as a PNG image"
    });
  };

  // Remote event handlers
  const handleRemoteDrawEvent = (data: any) => {
    const remotePath = data.path;
    setPaths((prev) => [...prev, remotePath]);
  };

  const handleRemoteTextEvent = (data: any) => {
    const remoteText = data.textObject;
    setTextObjects((prev) => [...prev, remoteText]);
  };

  const handleRemoteShapeEvent = (data: any) => {
    const remoteShape = data.shapeObject;
    setShapeObjects((prev) => [...prev, remoteShape]);
  };

  const handleRemoteClearEvent = () => {
    setPaths([]);
    setTextObjects([]);
    setShapeObjects([]);
  };

  const handleUserJoined = (data: any) => {
    const newUser = {
      id: data.userId,
      name: data.username,
      color: data.color
    };
    
    setActiveUsers((prev) => {
      if (prev.some(user => user.id === newUser.id)) {
        return prev;
      }
      return [...prev, newUser];
    });

    toast({
      title: "User joined",
      description: `${data.username} joined the whiteboard session`
    });
  };

  const handleUserLeft = (data: any) => {
    setActiveUsers((prev) => 
      prev.filter(user => user.id !== data.userId)
    );

    toast({
      title: "User left",
      description: `${data.username} left the whiteboard session`
    });
  };

  const handleSessionState = (data: any) => {
    if (data.paths) setPaths(data.paths);
    if (data.textObjects) setTextObjects(data.textObjects);
    if (data.shapeObjects) setShapeObjects(data.shapeObjects);
    if (data.activeUsers) setActiveUsers(data.activeUsers);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <div className="flex space-x-2">
          {/* Drawing Tools */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={tool === 'pen' ? "default" : "outline"} 
                  size="icon" 
                  onClick={() => handleToolSelect('pen')}
                >
                  <PenTool className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pen Tool</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={tool === 'eraser' ? "default" : "outline"} 
                  size="icon" 
                  onClick={() => handleToolSelect('eraser')}
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
                  variant={tool === 'text' ? "default" : "outline"} 
                  size="icon" 
                  onClick={() => handleToolSelect('text')}
                >
                  <Type className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Text Tool</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Shape Dropdown */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant={tool === 'circle' || tool === 'rectangle' ? "default" : "outline"} 
                      size="icon"
                    >
                      {tool === 'circle' ? <Circle className="h-4 w-4" /> : 
                       tool === 'rectangle' ? <Square className="h-4 w-4" /> : 
                       <Circle className="h-4 w-4" />}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Shapes</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenuContent>
              <DropdownMenuLabel>Shapes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                handleToolSelect('circle');
                handleAddShape('circle');
              }}>
                <Circle className="h-4 w-4 mr-2" />
                Circle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleToolSelect('rectangle');
                handleAddShape('rectangle');
              }}>
                <Square className="h-4 w-4 mr-2" />
                Rectangle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Color Selector */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="relative"
                  >
                    <Palette className="h-4 w-4" />
                  </Button>
                  <input 
                    type="color" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div 
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-gray-300" 
                    style={{backgroundColor: color}}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>Select Color</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Line Width Slider */}
          <div className="flex items-center space-x-2 ml-2">
            <span className="text-xs text-gray-400">Width:</span>
            <Slider
              min={1}
              max={20}
              step={1}
              value={[lineWidth]}
              onValueChange={(value) => setLineWidth(value[0])}
              className="w-24"
            />
            <span className="text-xs text-gray-400">{lineWidth}px</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {/* Undo/Redo */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Clear Canvas */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClearCanvas}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear Canvas</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Export Canvas */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExportCanvas}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as PNG</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Active Users */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
                <Badge variant="secondary" className="ml-1">{activeUsers.length}</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Active Users</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {activeUsers.map((user) => (
                <DropdownMenuItem key={user.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: user.color }}
                  />
                  <span>{user.name}</span>
                  {user.id === userId && <span className="text-xs text-gray-400">(You)</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative flex-1">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
        
        {isAddingText && textPosition && (
          <div
            className="absolute z-10 flex flex-col"
            style={{
              left: textPosition.x,
              top: textPosition.y
            }}
          >
            <textarea
              autoFocus
              className="bg-gray-800 text-white border border-gray-600 rounded p-2 w-48 h-20"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleTextSubmit();
                }
              }}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsAddingText(false);
                  setTextPosition(null);
                  setTextInput('');
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleTextSubmit}
              >
                Add Text
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeWhiteboard;