import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLocation, Link } from 'wouter';
import { CollaborativeWhiteboard } from '@/components/collaborative-whiteboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ChevronLeft, Plus, Edit, Share2, ListFilter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// In a real implementation, this would come from an API/database
const mockSavedBoards = [
  { id: 1, name: 'Game Strategy - Zone Defense', creator: 'Coach Thompson', lastEdited: '2025-04-25T14:30:00Z' },
  { id: 2, name: 'Offensive Play #42', creator: 'Coach Davis', lastEdited: '2025-04-24T10:15:00Z' },
  { id: 3, name: 'Defense Positioning', creator: 'Coach Wilson', lastEdited: '2025-04-23T16:45:00Z' },
];

export function WhiteboardPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const [showBoardList, setShowBoardList] = useState(true);
  const [newBoardName, setNewBoardName] = useState('');
  const [boards, setBoards] = useState(mockSavedBoards);
  const [shareLink, setShareLink] = useState('');
  
  // Get board ID from URL if present
  useEffect(() => {
    const boardIdMatch = location.match(/\/whiteboard\/(\d+)/);
    if (boardIdMatch && boardIdMatch[1]) {
      const boardId = parseInt(boardIdMatch[1]);
      setActiveBoard(boardId);
      setShowBoardList(false);
    }
  }, [location]);
  
  // Format timestamp to readable date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Create a new board
  const handleCreateBoard = () => {
    const newBoard = {
      id: boards.length + 1,
      name: newBoardName || `New Strategy Board ${boards.length + 1}`,
      creator: user?.name || user?.username || 'Anonymous',
      lastEdited: new Date().toISOString()
    };
    
    setBoards([...boards, newBoard]);
    setActiveBoard(newBoard.id);
    setShowBoardList(false);
    setLocation(`/whiteboard/${newBoard.id}`);
  };
  
  // Open a board
  const handleOpenBoard = (boardId: number) => {
    setActiveBoard(boardId);
    setShowBoardList(false);
    setLocation(`/whiteboard/${boardId}`);
  };
  
  // Back to board list
  const handleBackToList = () => {
    setActiveBoard(null);
    setShowBoardList(true);
    setLocation('/whiteboard');
  };
  
  // Generate a shareable link
  const handleShare = (boardId: number) => {
    const link = `${window.location.origin}/whiteboard/${boardId}?mode=view&token=abc123`;
    setShareLink(link);
  };
  
  // Render board list view
  const renderBoardList = () => (
    <div className="max-w-5xl mx-auto p-4">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Strategy Boards</CardTitle>
        <CardDescription>
          Collaborate on game plans and player formations in real-time
        </CardDescription>
      </CardHeader>
      
      <div className="flex justify-between items-center my-4">
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="mr-2">
            <ListFilter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Input 
            placeholder="Search boards..." 
            className="w-64"
          />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New Board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Strategy Board</DialogTitle>
              <DialogDescription>
                Give your board a name and start collaborating with your team.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Input
                placeholder="Enter board name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>Cancel</Button>
              <Button onClick={handleCreateBoard}>Create Board</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {boards.map(board => (
          <Card key={board.id} className="cursor-pointer hover:border-blue-500 transition-colors">
            <CardContent 
              className="p-4 flex flex-col h-full"
              onClick={() => handleOpenBoard(board.id)}
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center mb-3 rounded-md overflow-hidden">
                {/* This would be a thumbnail in a real implementation */}
                <Edit className="h-10 w-10 text-gray-400" />
              </div>
              
              <h3 className="font-medium text-lg mb-1">{board.name}</h3>
              <div className="text-sm text-gray-500 mt-auto flex justify-between">
                <span>{board.creator}</span>
                <span>Edited {formatDate(board.lastEdited)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
  // Render active board view
  const renderActiveBoard = () => {
    const board = boards.find(b => b.id === activeBoard);
    if (!board) return null;
    
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToList}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Boards
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Whiteboard</DialogTitle>
                <DialogDescription>
                  Share this link with your team members to collaborate in real-time.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <Input
                  value={shareLink || `${window.location.href}?mode=view&token=abc123`}
                  readOnly
                  onClick={e => (e.target as HTMLInputElement).select()}
                  className="w-full"
                />
              </div>
              
              <DialogFooter>
                <Button onClick={() => {
                  navigator.clipboard.writeText(shareLink || `${window.location.href}?mode=view&token=abc123`);
                }}>
                  Copy Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <CollaborativeWhiteboard 
          sessionId={`board-${board.id}`} 
          readOnly={false}
        />
      </div>
    );
  };
  
  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access the collaborative whiteboard feature.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth">Login or Register</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {showBoardList ? renderBoardList() : renderActiveBoard()}
    </div>
  );
}

export default WhiteboardPage;