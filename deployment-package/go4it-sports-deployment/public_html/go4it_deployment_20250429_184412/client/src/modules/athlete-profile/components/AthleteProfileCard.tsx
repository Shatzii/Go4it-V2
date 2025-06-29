import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';

interface AthleteProfileCardProps {
  athleteId: number;
  showStats?: boolean;
  className?: string;
}

export default function AthleteProfileCard({ 
  athleteId, 
  showStats = true,
  className = ""
}: AthleteProfileCardProps) {
  // Fetch athlete data
  const { data: athlete, isLoading, error } = useQuery({
    queryKey: [`/api/athletes/${athleteId}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/athletes/${athleteId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch athlete');
        }
        return response.json();
      } catch (err) {
        console.error("Error fetching athlete:", err);
        return null;
      }
    }
  });

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="pt-6">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-20 w-20 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/4 mb-1"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !athlete) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Error loading athlete profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={athlete.profileImage || "https://via.placeholder.com/150"} alt={athlete.name} />
            <AvatarFallback>{athlete.name?.substring(0, 2).toUpperCase() || "AT"}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle>{athlete.name}</CardTitle>
        <div className="flex gap-1 justify-center mt-2">
          <Badge variant="secondary">{athlete.sport || "Sport"}</Badge>
          <Badge variant="outline">{athlete.position || "Position"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4">
          <p>{athlete.school || "School Name"}</p>
          <p>{athlete.gradeLevel ? `Grade ${athlete.gradeLevel}` : "Grade Level"}</p>
        </div>
        
        {showStats && (
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t">
            <div>
              <p className="text-lg font-semibold">{athlete.height || "--"}</p>
              <p className="text-xs text-muted-foreground">Height</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{athlete.weight || "--"}</p>
              <p className="text-xs text-muted-foreground">Weight</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{athlete.garScore || "--"}</p>
              <p className="text-xs text-muted-foreground">GAR Score</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}