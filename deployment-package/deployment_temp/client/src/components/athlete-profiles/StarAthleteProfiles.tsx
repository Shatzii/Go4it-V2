import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

type Metric = {
  height: string;
  weight: string;
  forty_yard_dash: string;
  vertical: string;
  gpa: string;
};

type Traits = {
  movement: string[];
  mental: string[];
  resilience: string[];
};

type AthleteStarProfile = {
  id: number;
  profileId: string;
  userId: number;
  name: string;
  starLevel: number;
  sport: string;
  position: string;
  ageGroup: string;
  metrics: Metric;
  traits: Traits;
  filmExpectations: string[];
  trainingFocus: string[];
  avatar: string;
  rank: string;
  xpLevel: number;
  active: boolean;
  createdAt: string;
};

const sports = [
  "All Sports",
  "Basketball",
  "Football",
  "Soccer",
  "Baseball",
  "Volleyball",
  "Track",
  "Swimming",
  "Tennis",
  "Golf",
  "Wrestling"
];

const StarAthleteProfiles: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>("All Sports");
  const [selectedStarLevel, setSelectedStarLevel] = useState<string>("All Levels");
  const { toast } = useToast();
  
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['/api/athlete-profiles/stars', selectedSport, selectedStarLevel],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedSport !== "All Sports") {
        params.append('sport', selectedSport);
      }
      if (selectedStarLevel !== "All Levels") {
        params.append('starLevel', selectedStarLevel.charAt(0));
      }
      
      const response = await fetch(`/api/athlete-profiles/stars?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch athlete profiles');
      }
      return response.json() as Promise<AthleteStarProfile[]>;
    },
    enabled: true,
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: `Failed to load athlete profiles: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Group profiles by sport for tabbed view
  const profilesBySport = React.useMemo(() => {
    if (!profiles) return {};
    
    return profiles.reduce((acc, profile) => {
      if (!acc[profile.sport]) {
        acc[profile.sport] = [];
      }
      acc[profile.sport].push(profile);
      return acc;
    }, {} as Record<string, AthleteStarProfile[]>);
  }, [profiles]);
  
  // Get list of sports that have profiles
  const sportTabs = Object.keys(profilesBySport).sort();
  
  // Render star icons based on star level
  const renderStars = (level: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={i < level ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      ));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-2">Athlete Star Profile Library</h2>
          <p className="text-muted-foreground">
            Browse our library of benchmark athlete profiles at different star levels. 
            These profiles represent the expected skill levels for athletes from 1-star to 5-star ratings.
          </p>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium mb-1">Sport</label>
            <Select
              value={selectedSport}
              onValueChange={setSelectedSport}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Sports">All Sports</SelectItem>
                {sports.filter(s => s !== "All Sports").map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium mb-1">Star Level</label>
            <Select
              value={selectedStarLevel}
              onValueChange={setSelectedStarLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Star Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Levels">All Levels</SelectItem>
                <SelectItem value="1 Star">1 Star</SelectItem>
                <SelectItem value="2 Star">2 Star</SelectItem>
                <SelectItem value="3 Star">3 Star</SelectItem>
                <SelectItem value="4 Star">4 Star</SelectItem>
                <SelectItem value="5 Star">5 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">Loading profiles...</div>
        </div>
      ) : !profiles || profiles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold">No athlete profiles found</h3>
          <p className="text-muted-foreground mt-2">
            Try changing your filters or come back later.
          </p>
        </div>
      ) : (
        <>
          {selectedSport === "All Sports" ? (
            <Tabs defaultValue={sportTabs[0]} className="w-full">
              <TabsList className="mb-4 flex flex-wrap">
                {sportTabs.map((sport) => (
                  <TabsTrigger key={sport} value={sport} className="tab">
                    {sport}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {sportTabs.map((sport) => (
                <TabsContent key={sport} value={sport} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profilesBySport[sport]
                      .sort((a, b) => b.starLevel - a.starLevel)
                      .map((profile) => (
                        <AthleteProfileCard key={profile.id} profile={profile} renderStars={renderStars} />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles
                .sort((a, b) => b.starLevel - a.starLevel)
                .map((profile) => (
                  <AthleteProfileCard key={profile.id} profile={profile} renderStars={renderStars} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface AthleteProfileCardProps {
  profile: AthleteStarProfile;
  renderStars: (level: number) => React.ReactNode;
}

const AthleteProfileCard: React.FC<AthleteProfileCardProps> = ({ profile, renderStars }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{profile.name}</CardTitle>
            <CardDescription className="text-gray-100">
              {profile.position} • {profile.sport}
            </CardDescription>
          </div>
          <div className="text-xl font-bold">
            {renderStars(profile.starLevel)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Height</h4>
            <p>{profile.metrics.height}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Weight</h4>
            <p>{profile.metrics.weight}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Forty</h4>
            <p>{profile.metrics.forty_yard_dash}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Vertical</h4>
            <p>{profile.metrics.vertical}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Traits</h4>
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1">
              {profile.traits.movement.map((trait, i) => (
                <Badge key={`movement-${i}`} variant="outline" className="bg-blue-50">
                  {trait}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.traits.mental.map((trait, i) => (
                <Badge key={`mental-${i}`} variant="outline" className="bg-indigo-50">
                  {trait}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.traits.resilience.map((trait, i) => (
                <Badge key={`resilience-${i}`} variant="outline" className="bg-purple-50">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Film Expectations</h4>
          <ul className="list-disc pl-5 text-sm">
            {profile.filmExpectations.map((expectation, i) => (
              <li key={i}>{expectation}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Training Focus</h4>
          <ul className="list-disc pl-5 text-sm">
            {profile.trainingFocus.map((focus, i) => (
              <li key={i}>{focus}</li>
            ))}
          </ul>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{profile.rank}</span>
          <span className="text-sm font-medium">XP Level: {profile.xpLevel}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StarAthleteProfiles;