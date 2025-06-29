import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import CollaborativeWhiteboard from '@/components/collaborative-whiteboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Share2, Settings } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface BoardSession {
  id: string;
  name: string;
  createdAt: string;
  userId: number;
  createdBy: string;
  lastAccessed?: string;
}

export default function StrategyBoardPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [boards, setBoards] = useState<BoardSession[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Extract session ID from URL
  useEffect(() => {
    const pathParts = location.split('/');
    if (pathParts.length > 2 && pathParts[1] === 'strategy-board') {
      setActiveSession(pathParts[2]);
    } else {
      setActiveSession(null);
    }
  }, [location]);

  // Load boards
  useEffect(() => {
    if (!user) return;
    
    const fetchBoards = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest('GET', '/api/strategy-boards');
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error('Error loading strategy boards:', error);
        toast({
          title: 'Error',
          description: 'Failed to load strategy boards. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBoards();
  }, [user, toast]);

  const createNewBoard = async () => {
    if (!sessionName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your strategy board.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const response = await apiRequest('POST', '/api/strategy-boards', {
        name: sessionName.trim()
      });
      
      if (response.ok) {
        const data = await response.json();
        setBoards(prev => [data, ...prev]);
        setLocation(`/strategy-board/${data.id}`);
        setSessionName('');
        setIsCreateDialogOpen(false);
        
        toast({
          title: 'Success',
          description: 'Strategy board created successfully!',
        });
      } else {
        throw new Error('Failed to create board');
      }
    } catch (error) {
      console.error('Error creating board:', error);
      toast({
        title: 'Error',
        description: 'Failed to create strategy board. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const shareBoard = (boardId: string) => {
    const url = `${window.location.origin}/strategy-board/${boardId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link Copied',
        description: 'Board link copied to clipboard!',
      });
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Strategy Board</h1>
        <p className="text-gray-400 mb-4">Please log in to use the Strategy Board feature.</p>
        <Link href="/auth">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4">
      {activeSession ? (
        <div className="h-[calc(100vh-12rem)]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                {boards.find(b => b.id === activeSession)?.name || 'Strategy Board'}
              </h1>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2"
                onClick={() => shareBoard(activeSession)}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/strategy-board')}
            >
              <X className="h-4 w-4 mr-1" />
              Close Board
            </Button>
          </div>
          
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg h-full overflow-hidden">
            <CollaborativeWhiteboard 
              sessionId={activeSession} 
              userId={user.id} 
              username={user.name || user.username || 'Anonymous'}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Strategy Boards</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Board
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Strategy Board</DialogTitle>
                  <DialogDescription>
                    Give your new strategy board a name to help you identify it later.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="board-name">Board Name</Label>
                    <Input 
                      id="board-name" 
                      placeholder="Enter board name" 
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={createNewBoard}
                  >
                    Create Board
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <p className="text-gray-400 mb-6">
            Create and collaborate on strategy boards for your team. Draw plays, discuss tactics, and plan your game strategy together in real-time.
          </p>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : boards.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Strategy Boards Yet</h3>
              <p className="text-gray-400 mb-4">Create your first strategy board to get started</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Board
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map((board) => (
                <div 
                  key={board.id} 
                  className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-primary transition-colors"
                >
                  <div 
                    className="h-40 bg-neutral-950 border-b border-neutral-800 flex items-center justify-center cursor-pointer"
                    onClick={() => setLocation(`/strategy-board/${board.id}`)}
                  >
                    <div className="p-4 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold truncate">{board.name}</h3>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => shareBoard(board.id)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Created {formatDate(board.createdAt)}</span>
                      <span>By {board.createdBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}