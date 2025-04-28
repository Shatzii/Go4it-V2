import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import CollaborativeWhiteboard from '@/components/collaborative-whiteboard';
import { useAuth } from "@/contexts/auth-context";

const WhiteboardPage = () => {
  const { id: whiteboardId } = useParams<{ id: string }>();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [roomName, setRoomName] = useState<string>(whiteboardId || '');
  const [isJoining, setIsJoining] = useState<boolean>(false);
  
  // If whiteboardId is provided in the URL, we're joining an existing session
  useEffect(() => {
    if (whiteboardId) {
      setRoomName(whiteboardId);
      setIsJoining(true);
    }
  }, [whiteboardId]);

  const handleCreateSession = () => {
    if (!roomName.trim()) {
      toast({
        title: "Session name required",
        description: "Please enter a name for your strategy session",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to the specific whiteboard room
    navigate(`/whiteboard/${roomName}`);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Strategy Board</h1>
      
      {!isJoining ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create or Join a Strategy Session</CardTitle>
            <CardDescription>
              Collaborate with teammates and coaches to plan game strategies in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-name">Session Name</Label>
                <Input 
                  id="session-name" 
                  placeholder="Enter a name for your strategy session" 
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateSession} className="w-full">
              Start Collaboration
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Session: {roomName}</h2>
              <p className="text-muted-foreground">Collaborate in real-time with your team</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/whiteboard')}>
              Exit Session
            </Button>
          </div>
          
          <Card className="w-full p-1 h-[600px]">
            <CollaborativeWhiteboard 
              sessionId={roomName} 
              userId={user?.id || 0}
              username={user?.name || 'Anonymous'}
            />
          </Card>
          
          <div className="text-sm text-muted-foreground">
            <p>Tip: You can share this strategy board with others by sending them the URL.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhiteboardPage;