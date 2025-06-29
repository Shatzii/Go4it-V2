import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Sport {
  name: string;
  level: string;
}

interface AthleteConnectionProps {
  id: number;
  name: string;
  avatarUrl?: string;
  location: string;
  sports: Sport[];
  connectionType: 'peer' | 'mentor' | 'coach' | 'suggested';
  connectionStatus?: 'pending' | 'connected' | 'none';
  garScore?: number;
  onClick?: (id: number) => void;
  onConnect?: (id: number) => void;
  onMessage?: (id: number) => void;
  className?: string;
}

/**
 * AthleteConnectionCard component
 * 
 * Displays athlete connection information in a card format with actions
 * This is a modular component that can be dropped into the CMS
 */
export const AthleteConnectionCard: React.FC<AthleteConnectionProps> = ({
  id,
  name,
  avatarUrl,
  location,
  sports,
  connectionType,
  connectionStatus = 'none',
  garScore,
  onClick,
  onConnect,
  onMessage,
  className = ''
}) => {
  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get badge color based on connection type
  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'mentor':
        return 'default';
      case 'coach':
        return 'destructive';
      case 'peer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card 
      className={`w-full shadow-md hover:shadow-lg transition-shadow ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick ? () => onClick(id) : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{location}</CardDescription>
            </div>
          </div>
          
          <Badge variant={getBadgeVariant(connectionType)} className="capitalize">
            {connectionType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Sports */}
          <div className="flex flex-wrap gap-2">
            {sports.map((sport, index) => (
              <div key={index} className="bg-muted rounded-full px-3 py-1 text-xs">
                {sport.name} - {sport.level}
              </div>
            ))}
          </div>
          
          {/* GAR Score (if available) */}
          {garScore && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium">GAR Score:</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-sm font-medium">
                {garScore}/100
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-0">
        {connectionStatus === 'none' && onConnect && (
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onConnect(id);
            }}
          >
            Connect
          </Button>
        )}
        
        {connectionStatus === 'pending' && (
          <Button variant="outline" size="sm" className="flex-1" disabled>
            Request Pending
          </Button>
        )}
        
        {connectionStatus === 'connected' && onMessage && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onMessage(id);
            }}
          >
            Message
          </Button>
        )}
        
        <Button 
          variant="secondary" 
          size="sm"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(id);
          }}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};