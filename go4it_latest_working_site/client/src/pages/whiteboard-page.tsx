import { useEffect, useState } from 'react';
import CollaborativeWhiteboard from '@/components/collaborative-whiteboard';
import { useAuth } from '@/contexts/auth-context';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'wouter';

export default function WhiteboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const params = useParams<{ sessionId: string }>();
  const [sessionId, setSessionId] = useState<string>(params.sessionId || '');

  useEffect(() => {
    // If no session ID provided in URL, create a new one
    if (!params.sessionId) {
      const newSessionId = uuidv4().substring(0, 8);
      setSessionId(newSessionId);
      navigate(`/strategy-board/${newSessionId}`, { replace: true });
    }
  }, [params.sessionId, navigate]);

  const createNewBoard = () => {
    const newSessionId = uuidv4().substring(0, 8);
    navigate(`/strategy-board/${newSessionId}`);
    toast({
      title: 'New Strategy Board Created',
      description: 'Starting a fresh strategy board.',
    });
  };

  const inviteUsers = () => {
    if (navigator.clipboard && sessionId) {
      const url = `${window.location.origin}/strategy-board/${sessionId}`;
      navigator.clipboard.writeText(url).then(
        () => {
          toast({
            title: 'Link Copied!',
            description: 'Share this link with your team to collaborate.',
          });
        },
        (err) => {
          console.error('Could not copy text: ', err);
          toast({
            title: 'Copy Failed',
            description: 'Please copy the URL manually from your address bar.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  if (!user) {
    return <div>Please log in to access the strategy board.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 bg-muted/30">
        <h1 className="text-xl font-bold">Strategy Board: {sessionId}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={inviteUsers}>
            <Users className="h-4 w-4 mr-2" />
            Invite Team
          </Button>
          <Button variant="default" size="sm" onClick={createNewBoard}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Board
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {sessionId && (
          <CollaborativeWhiteboard
            sessionId={sessionId}
            userId={user.id}
            username={user.username}
          />
        )}
      </div>
    </div>
  );
}