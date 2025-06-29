import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Plus, User, Star, Eye, Heart, ArrowUpRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

// Define TypeScript type for SpotlightProfile
interface SpotlightProfile {
  id: number;
  userId: number;
  name: string;
  sport: string;
  position: string;
  school: string;
  graduationYear: number;
  location: string;
  bio: string;
  highlights: string;
  stats: string;
  height: string;
  weight: string;
  email: string;
  phone: string;
  academicGpa: string;
  profileImageUrl: string | null;
  highlightVideoUrl: string | null;
  views: number;
  likes: number;
  featured: boolean;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NextUpSpotlight() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all spotlight profiles
  const { data: allProfiles, isLoading: isLoadingAll, error: errorAll } = useQuery({
    queryKey: ['/api/spotlight-profiles'],
    staleTime: 60000, // 1 minute
  });

  // Fetch featured spotlight profiles
  const { data: featuredProfiles, isLoading: isLoadingFeatured, error: errorFeatured } = useQuery({
    queryKey: ['/api/spotlight-profiles/featured'],
    staleTime: 60000,
  });

  // Fetch trending spotlight profiles
  const { data: trendingProfiles, isLoading: isLoadingTrending, error: errorTrending } = useQuery({
    queryKey: ['/api/spotlight-profiles/trending'],
    staleTime: 60000,
  });

  // Fetch recommended spotlight profiles
  const { data: recommendedProfiles, isLoading: isLoadingRecommended, error: errorRecommended } = useQuery({
    queryKey: ['/api/spotlight-profiles/recommended', user?.id],
    staleTime: 60000,
    enabled: !!user, // Only run this query if user is logged in
  });

  // Determine which profiles to show based on active tab
  const getProfilesForActiveTab = () => {
    switch (activeTab) {
      case "featured":
        return featuredProfiles || [];
      case "trending":
        return trendingProfiles || [];
      case "recommendations":
        return recommendedProfiles || [];
      case "all":
      default:
        return allProfiles || [];
    }
  };

  // Filter profiles based on search query and sport filter
  const profiles = getProfilesForActiveTab();
  const filteredProfiles = Array.isArray(profiles) ? profiles.filter((profile: SpotlightProfile) => {
    const matchesSearch = searchQuery === "" || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      profile.school.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSport = sportFilter === "" || profile.sport === sportFilter;
    
    return matchesSearch && matchesSport;
  }) : [];

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

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
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
          {isLoadingAll ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              <span className="ml-2 text-lg text-muted-foreground">Loading athletes...</span>
            </div>
          ) : errorAll ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg border-red-300">
              <p className="text-red-500 text-center">
                Error loading spotlight profiles. Please try again later.
              </p>
            </div>
          ) : filteredProfiles.length > 0 ? (
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
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted flex items-center justify-center mb-4 rounded-md overflow-hidden">
                      {profile.profileImageUrl ? (
                        <img 
                          src={profile.profileImageUrl} 
                          alt={`${profile.name}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-muted-foreground" />
                      )}
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
          {isLoadingTrending ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              <span className="ml-2 text-lg text-muted-foreground">Loading trending athletes...</span>
            </div>
          ) : errorTrending ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg border-red-300">
              <p className="text-red-500 text-center">
                Error loading trending profiles. Please try again later.
              </p>
            </div>
          ) : filteredProfiles.length > 0 ? (
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
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted flex items-center justify-center mb-4 rounded-md overflow-hidden">
                      {profile.profileImageUrl ? (
                        <img 
                          src={profile.profileImageUrl} 
                          alt={`${profile.name}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-muted-foreground" />
                      )}
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
              <p className="text-muted-foreground text-center">
                No trending athletes found at the moment.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured" className="m-0">
          {isLoadingFeatured ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              <span className="ml-2 text-lg text-muted-foreground">Loading featured athletes...</span>
            </div>
          ) : errorFeatured ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg border-red-300">
              <p className="text-red-500 text-center">
                Error loading featured profiles. Please try again later.
              </p>
            </div>
          ) : filteredProfiles.length > 0 ? (
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
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted flex items-center justify-center mb-4 rounded-md overflow-hidden">
                      {profile.profileImageUrl ? (
                        <img 
                          src={profile.profileImageUrl} 
                          alt={`${profile.name}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-muted-foreground" />
                      )}
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
              <p className="text-muted-foreground text-center">
                No featured athletes found at the moment.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="m-0">
          {!user ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground text-center mb-4">
                Log in to see personalized athlete recommendations
              </p>
              <Button asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          ) : isLoadingRecommended ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              <span className="ml-2 text-lg text-muted-foreground">Loading recommendations...</span>
            </div>
          ) : errorRecommended ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg border-red-300">
              <p className="text-red-500 text-center">
                Error loading recommendations. Please try again later.
              </p>
            </div>
          ) : filteredProfiles.length > 0 ? (
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
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted flex items-center justify-center mb-4 rounded-md overflow-hidden">
                      {profile.profileImageUrl ? (
                        <img 
                          src={profile.profileImageUrl} 
                          alt={`${profile.name}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-muted-foreground" />
                      )}
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
              <p className="text-muted-foreground text-center">
                No personalized recommendations found at the moment. 
                Try exploring more athletes to improve your recommendations.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}