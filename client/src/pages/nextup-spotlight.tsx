import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Plus, User, Star, Eye, Heart, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NextUpSpotlight() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("");

  // This would be fetched from the API in a real implementation
  const spotlightProfiles = [
    {
      id: 1,
      name: "Marcus Johnson",
      sport: "Basketball",
      position: "Point Guard",
      school: "West High School",
      graduationYear: 2025,
      image: null,
      highlights: "Breaking ankles with his crossover since 2020",
      stats: "21.5 PPG, 8.3 APG, 4.2 RPG",
      views: 1240,
      likes: 325,
    },
    {
      id: 2,
      name: "Alicia Thompson",
      sport: "Soccer",
      position: "Forward",
      school: "Eastside Academy",
      graduationYear: 2024,
      image: null,
      highlights: "Led league in goals for 2 consecutive seasons",
      stats: "32 goals, 15 assists in 2023 season",
      views: 890,
      likes: 210,
    },
    {
      id: 3,
      name: "Jamal Williams",
      sport: "Football",
      position: "Quarterback",
      school: "North County High",
      graduationYear: 2024,
      image: null,
      highlights: "State championship MVP 2023",
      stats: "3,200 passing yards, 35 TDs, 5 INTs",
      views: 1850,
      likes: 420,
    },
    {
      id: 4,
      name: "Sophie Chen",
      sport: "Tennis",
      position: "Singles",
      school: "Brighton Prep",
      graduationYear: 2026,
      image: null,
      highlights: "Regional champion 2023",
      stats: "32-2 record, 4.8 UTR rating",
      views: 620,
      likes: 180,
    },
    {
      id: 5,
      name: "Tyler Robinson",
      sport: "Baseball",
      position: "Pitcher",
      school: "Westfield High",
      graduationYear: 2025,
      image: null,
      highlights: "Perfect game pitched in state semifinals",
      stats: "12-1 record, 0.87 ERA, 142 strikeouts",
      views: 980,
      likes: 265,
    },
    {
      id: 6,
      name: "Kayla Martinez",
      sport: "Basketball",
      position: "Shooting Guard",
      school: "South River High",
      graduationYear: 2024,
      image: null,
      highlights: "School record 45 points in a single game",
      stats: "24.1 PPG, 5.3 RPG, 3.7 APG",
      views: 1100,
      likes: 300,
    }
  ];

  const filteredProfiles = spotlightProfiles.filter(profile => {
    const matchesSearch = searchQuery === "" || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      profile.school.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSport = sportFilter === "" || profile.sport === sportFilter;
    
    return matchesSearch && matchesSport;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NextUp Spotlight</h1>
          <p className="text-muted-foreground mt-1">
            Discover the next generation of athletic talent
          </p>
        </div>
        {user && (
          <Button asChild>
            <Link href="/spotlight-create">
              <Plus className="mr-2 h-4 w-4" /> Create Your Spotlight
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Athletes</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="recommendations">For You</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search athletes or schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sports</SelectItem>
                <SelectItem value="Basketball">Basketball</SelectItem>
                <SelectItem value="Football">Football</SelectItem>
                <SelectItem value="Baseball">Baseball</SelectItem>
                <SelectItem value="Soccer">Soccer</SelectItem>
                <SelectItem value="Tennis">Tennis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{profile.name}</CardTitle>
                        <CardDescription>
                          {profile.position} | {profile.school} | Class of {profile.graduationYear}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted flex items-center justify-center mb-4 rounded-md">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-sm mb-2 font-medium">{profile.highlights}</p>
                    <p className="text-xs text-muted-foreground">Key Stats: {profile.stats}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" /> {profile.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" /> {profile.likes}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/spotlight-profile/${profile.id}`}>
                        View Profile <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
              <User className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No athletes found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Try adjusting your search criteria or check back later for new spotlights.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="m-0">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground text-center">
              Trending athletes will appear here based on current activity
            </p>
          </div>
        </TabsContent>

        <TabsContent value="featured" className="m-0">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground text-center">
              Featured athletes selected by our sports analysts will appear here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="m-0">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground text-center">
              {user 
                ? "Personalized recommendations based on your interests will appear here" 
                : "Log in to see personalized athlete recommendations"}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}