import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eraser, Pencil, Delete, Undo, Redo, Image as ImageIcon, Save } from 'lucide-react';
import websocketService from '@/services/websocket-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DrawEvent {
  type: 'draw' | 'clear' | 'undo' | 'redo' | 'image';
  points?: { x: number; y: number }[];
  color?: string;
  lineWidth?: number;
  userId?: number;
  userName?: string;
  imageData?: string;
}

interface WhiteboardProps {
  sessionId?: string;
  readOnly?: boolean;
  initialBackground?: string;
}

export function CollaborativeWhiteboard({ 
  sessionId = 'default', 
  readOnly = false,
  initialBackground
}: WhiteboardProps) {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0066CC');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [isConnected, setIsConnected] = useState(false);
  const [boardName, setBoardName] = useState(`Strategy Board - ${new Date().toLocaleDateString()}`);
  const [users, setUsers] = useState<{ id: number, name: string, color: string }[]>([]);
  
  // Drawing history for undo/redo
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Track current drawing path
  const currentPath = useRef<{ x: number; y: number }[]>([]);
  
  // Setup canvas and WebSocket
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initial canvas setup
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Set canvas width and height to match container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas to white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add initial state to history
    saveCanvasState();
    
    // Load background image if provided
    if (initialBackground) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveCanvasState();
      };
      img.src = initialBackground;
    }
    
    // Handle window resize
    const handleResize = () => {
      // Save current canvas
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }
      
      // Resize canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Restore drawing on resized canvas
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [initialBackground]);
  
  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) return;
    
    // Connect to WebSocket if not already connected
    if (!websocketService.isConnected()) {
      websocketService.connect(user.id);
    }
    
    // Add connection listener
    const connectionListener = () => {
      setIsConnected(true);
      
      // Join this specific whiteboard session
      if (websocketService.isConnected()) {
        // Use sendWhiteboardEvent with a custom join event type
        websocketService.sendWhiteboardEvent(sessionId, {
          type: 'join',
          userColor: color
        });
      }
    };
    
    // Add message listener
    const messageListener = (data: any) => {
      // Handle whiteboard-specific messages
      if (data.type === 'whiteboard_event' && data.sessionId === sessionId) {
        handleRemoteDrawEvent(data.event);
      }
      else if (data.type === 'whiteboard_user_joined' && data.sessionId === sessionId) {
        setUsers(prev => [...prev.filter(u => u.id !== data.userId), {
          id: data.userId,
          name: data.userName,
          color: data.userColor
        }]);
      }
      else if (data.type === 'whiteboard_user_left' && data.sessionId === sessionId) {
        setUsers(prev => prev.filter(u => u.id !== data.userId));
      }
      else if (data.type === 'whiteboard_users' && data.sessionId === sessionId) {
        setUsers(data.users);
      }
    };
    
    websocketService.addConnectionListener(connectionListener);
    websocketService.addMessageListener(messageListener);
    
    // If already connected, send join message right away
    if (websocketService.isConnected()) {
      connectionListener();
    }
    
    // Clean up on unmount
    return () => {
      // Leave the whiteboard session
      if (websocketService.isConnected()) {
        // Use custom event for leaving whiteboard
        websocketService.sendWhiteboardEvent(sessionId, {
          type: 'leave',
          userId: user.id
        });
      }
      
      websocketService.removeConnectionListener(connectionListener);
      websocketService.removeMessageListener(messageListener);
    };
  }, [user, sessionId, color]);
  
  // Save current canvas state to history
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get current canvas state
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // If we're not at the end of history, remove forward history
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    
    // Add current state to history
    setHistory(prev => [...prev, currentState]);
    setHistoryIndex(prev => prev + 1);
  };
  
  // Apply a canvas state from history
  const applyCanvasState = (state: ImageData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.putImageData(state, 0, 0);
  };
  
  // Handle remote drawing events
  const handleRemoteDrawEvent = (event: DrawEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Handle different event types
    switch (event.type) {
      case 'draw':
        if (!event.points || event.points.length < 2) return;
        
        ctx.strokeStyle = event.color || '#000000';
        ctx.lineWidth = event.lineWidth || 3;
        
        ctx.beginPath();
        ctx.moveTo(event.points[0].x, event.points[0].y);
        
        for (let i = 1; i < event.points.length; i++) {
          ctx.lineTo(event.points[i].x, event.points[i].y);
        }
        
        ctx.stroke();
        break;
        
      case 'clear':
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveCanvasState();
        break;
        
      case 'undo':
        // Remote undo is handled by sending the entire canvas state
        if (event.imageData) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = event.imageData;
        }
        break;
        
      case 'image':
        if (event.imageData) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            saveCanvasState();
          };
          img.src = event.imageData;
        }
        break;
    }
  };
  
  // Send drawing event to other collaborators
  const sendDrawEvent = (event: DrawEvent) => {
    if (!user || !isConnected || readOnly) return;
    
    websocketService.sendWhiteboardEvent(sessionId, event);
  };
  
  // Handle mouse down event
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    
    // Start new path
    currentPath.current = [{ x, y }];
    
    // Draw a dot if the user just clicks
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
      
      if (tool === 'pencil') {
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }
    }
  };
  
  // Handle mouse move event
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    
    // Add point to current path
    currentPath.current.push({ x, y });
    
    // Draw line segment
    if (currentPath.current.length >= 2) {
      const current = currentPath.current;
      const lastIdx = current.length - 1;
      
      ctx.beginPath();
      ctx.moveTo(current[lastIdx - 1].x, current[lastIdx - 1].y);
      ctx.lineTo(current[lastIdx].x, current[lastIdx].y);
      
      if (tool === 'pencil') {
        ctx.strokeStyle = color;
      } else {
        ctx.strokeStyle = '#FFFFFF';  
      }
      
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };
  
  // Handle mouse up event
  const handleMouseUp = () => {
    if (!isDrawing || readOnly) return;
    
    // Send full path to others
    if (currentPath.current.length > 0) {
      sendDrawEvent({
        type: 'draw',
        points: currentPath.current,
        color: tool === 'pencil' ? color : '#FFFFFF',
        lineWidth
      });
      
      // Save state for undo history
      saveCanvasState();
    }
    
    setIsDrawing(false);
    currentPath.current = [];
  };
  
  // Handle clearing the whiteboard
  const handleClear = () => {
    if (readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear to white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Send clear event
    sendDrawEvent({ type: 'clear' });
    
    // Save cleared state
    saveCanvasState();
  };
  
  // Handle undo
  const handleUndo = () => {
    if (readOnly || historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    // Apply previous state
    if (history[newIndex]) {
      applyCanvasState(history[newIndex]);
      
      // Send canvas image to others
      const canvas = canvasRef.current;
      if (canvas) {
        sendDrawEvent({
          type: 'undo',
          imageData: canvas.toDataURL()
        });
      }
    }
  };
  
  // Handle redo
  const handleRedo = () => {
    if (readOnly || historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    
    // Apply next state
    if (history[newIndex]) {
      applyCanvasState(history[newIndex]);
      
      // Send canvas image to others
      const canvas = canvasRef.current;
      if (canvas) {
        sendDrawEvent({
          type: 'undo',
          imageData: canvas.toDataURL()
        });
      }
    }
  };
  
  // Handle saving the whiteboard
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create temporary link and click it to download
    const link = document.createElement('a');
    link.download = `${boardName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
  // Add image to whiteboard
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Draw image centered on canvas
        const aspectRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (aspectRatio > canvasRatio) {
          // Image is wider than canvas
          drawWidth = canvas.width;
          drawHeight = canvas.width / aspectRatio;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        } else {
          // Image is taller than canvas
          drawHeight = canvas.height;
          drawWidth = canvas.height * aspectRatio;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        }
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
        // Send image to others
        sendDrawEvent({
          type: 'image',
          imageData: canvas.toDataURL()
        });
        
        // Save state for history
        saveCanvasState();
      };
      
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    
    reader.readAsDataURL(file);
    
    // Reset input value so the same file can be selected again
    e.target.value = '';
  };
  
  // Predefined color options
  const colorOptions = [
    '#0066CC', // Go4It Blue
    '#000000', // Black
    '#FF0000', // Red
    '#00CC00', // Green
    '#FF6600', // Orange
    '#9900CC', // Purple
    '#FFCC00', // Yellow
    '#FF66CC', // Pink
  ];
  
  return (
    <Card className="w-full max-w-4xl mx-auto flex flex-col h-[600px]">
      <CardHeader className="bg-blue-950 text-white flex flex-row items-center justify-between py-3">
        <CardTitle className="flex items-center gap-2">
          <Pencil className="h-5 w-5" />
          <Input 
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="bg-transparent border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7 text-lg"
            disabled={readOnly}
          />
        </CardTitle>
        
        {/* User list */}
        <div className="flex items-center space-x-1">
          {users.map(user => (
            <div 
              key={user.id} 
              title={user.name}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: user.color || '#666' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 relative overflow-hidden bg-gray-50">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full cursor-crosshair touch-none"
        />
      </CardContent>
      
      {!readOnly && (
        <CardFooter className="border-t p-2 bg-gray-100">
          <div className="w-full flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-1">
              {/* Tool selector */}
              <div className="flex border rounded overflow-hidden">
                <Button
                  variant={tool === 'pencil' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setTool('pencil')}
                  className="rounded-none h-9 w-9"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant={tool === 'eraser' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setTool('eraser')}
                  className="rounded-none h-9 w-9"
                >
                  <Eraser className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Color picker */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 w-9 p-0">
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: color }}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <div className="grid grid-cols-4 gap-1 p-1">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-blue-600' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Line width */}
              <div className="w-32 flex items-center space-x-2">
                <div className="w-8 text-center text-xs">{lineWidth}px</div>
                <Slider
                  value={[lineWidth]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(values) => setLineWidth(values[0])}
                  className="w-20"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {/* History controls */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="h-9 w-9"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="h-9 w-9"
              >
                <Redo className="h-4 w-4" />
              </Button>
              
              {/* Add image & save buttons */}
              <div className="relative">
                <Button
                  variant="outline" 
                  size="icon"
                  className="h-9 w-9"
                >
                  <ImageIcon className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleSave}
                className="h-9 w-9"
              >
                <Save className="h-4 w-4" />
              </Button>
              
              {/* Clear board button */}
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleClear}
                className="h-9"
              >
                <Delete className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default CollaborativeWhiteboard;