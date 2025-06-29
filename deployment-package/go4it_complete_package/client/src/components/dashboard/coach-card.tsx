import { Button } from "@/components/ui/button";
import { CoachConnection, User } from "@shared/schema";
import { MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CoachCardProps {
  connection?: CoachConnection;
  coach: {
    id: number;
    name: string;
    institution?: string;
    sport?: string;
    profileImage?: string;
    notes?: string;
  };
  isSuggested?: boolean;
  onConnect?: () => void;
}

export function CoachCard({ 
  connection, 
  coach, 
  isSuggested = false,
  onConnect
}: CoachCardProps) {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      
      // In a real app, this would connect to the coach
      await apiRequest("POST", "/api/connections", {
        coachId: coach.id,
      });
      
      toast({
        title: "Connection request sent",
        description: `You've sent a connection request to ${coach.name}`,
      });
      
      if (onConnect) {
        onConnect();
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleShareProfile = () => {
    toast({
      title: "Profile shared",
      description: `Your profile has been shared with ${coach.name}`,
    });
  };

  const handleMessage = () => {
    toast({
      title: "Message feature",
      description: "Messaging functionality will be implemented soon!",
    });
  };

  if (isSuggested) {
    return (
      <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 h-full">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <p className="text-sm text-gray-600 mb-3">Find more coaches based on your sport recommendations.</p>
          <Button 
            variant="outline" 
            className="bg-neutral-light hover:bg-gray-200 text-neutral"
            onClick={onConnect}
          >
            Explore Coaches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-light bg-opacity-30 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <img 
          src={coach.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(coach.name)} 
          alt={`Coach ${coach.name}`} 
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h3 className="font-medium text-neutral">{coach.name}</h3>
          <p className="text-xs text-gray-600">
            {coach.institution} {coach.sport && coach.sport}
          </p>
        </div>
      </div>
      {coach.notes && (
        <p className="text-sm text-gray-600 mb-3">{coach.notes}</p>
      )}
      <div className="flex space-x-2">
        <Button
          className="flex-1"
          size="sm"
          onClick={handleMessage}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Message
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-white"
          size="sm"
          onClick={handleShareProfile}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share Profile
        </Button>
      </div>
    </div>
  );
}
