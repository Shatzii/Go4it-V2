import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from '@tanstack/react-query';

interface AthleteStatsProps {
  athleteId: number;
  className?: string;
}

export default function AthleteStats({ 
  athleteId,
  className = ""
}: AthleteStatsProps) {
  // Fetch athlete stats
  const { data: stats, isLoading, error } = useQuery({
    queryKey: [`/api/athletes/${athleteId}/stats`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/athletes/${athleteId}/stats`);
        if (!response.ok) {
          throw new Error('Failed to fetch athlete stats');
        }
        return response.json();
      } catch (err) {
        console.error("Error fetching athlete stats:", err);
        return null;
      }
    }
  });

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg">Athlete Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg">Athlete Statistics</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Error loading athlete statistics</p>
        </CardContent>
      </Card>
    );
  }

  // Get the real stats or fall back to default example data if the API returned empty
  const displayStats = stats.attributes && stats.attributes.length > 0 
    ? stats.attributes 
    : [
        { name: "Speed", value: 85, maxValue: 100 },
        { name: "Strength", value: 75, maxValue: 100 },
        { name: "Agility", value: 90, maxValue: 100 },
        { name: "Technique", value: 82, maxValue: 100 },
        { name: "Game IQ", value: 88, maxValue: 100 }
      ];

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Athlete Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayStats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{stat.name}</span>
                <span className="text-sm text-muted-foreground">
                  {stat.value}/{stat.maxValue}
                </span>
              </div>
              <Progress value={(stat.value / stat.maxValue) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}