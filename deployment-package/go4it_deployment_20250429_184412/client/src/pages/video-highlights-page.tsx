import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { PageHeader } from '@/components/ui/page-header';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Award, ChevronDown, Filter, Play, Search, SlidersHorizontal, Star } from 'lucide-react';
import VideoHighlightPlayer from '@/components/video-analysis/VideoHighlightPlayer';
import VideoHighlightsList from '@/components/video-analysis/VideoHighlightsList';

/**
 * Video Highlights Page
 * 
 * This page displays all available video highlights with their associated scores.
 * Users can filter, search, and play videos directly from this interface.
 */
const VideoHighlightsPage: React.FC = () => {
  const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Fetch all featured highlights
  const { 
    data: featuredHighlights, 
    isLoading: featuredLoading 
  } = useQuery({
    queryKey: ['/api/highlights/featured'],
    queryFn: async () => {
      const response = await fetch('/api/highlights/featured');
      if (!response.ok) {
        throw new Error('Failed to fetch featured highlights');
      }
      return response.json();
    }
  });
  
  // Fetch all highlights (could be paginated in a real implementation)
  const { 
    data: allHighlights, 
    isLoading: allLoading 
  } = useQuery({
    queryKey: ['/api/highlights/all'],
    queryFn: async () => {
      const response = await fetch('/api/highlights/all');
      if (!response.ok) {
        throw new Error('Failed to fetch all highlights');
      }
      return response.json();
    }
  });
  
  const handleHighlightSelect = (highlight: any) => {
    setSelectedHighlight(highlight);
  };
  
  // Function to filter highlights based on current filters
  const filterHighlights = (highlights: any[] = []) => {
    if (!highlights) return [];
    
    return highlights.filter(highlight => {
      // Apply sport filter
      if (sportFilter !== 'all' && highlight.sportType !== sportFilter) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery && !highlight.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'highest-score':
          return (b.garScore || 0) - (a.garScore || 0);
        case 'lowest-score':
          return (a.garScore || 0) - (b.garScore || 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
  };
  
  const isLoading = featuredLoading || allLoading;
  
  return (
    <div className="container mx-auto pt-8 pb-16">
      <PageHeader
        title="Video Highlights"
        description="Watch and analyze performance highlights with GAR scoring"
      />
      
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 my-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search highlights..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest-score">Highest Score</SelectItem>
              <SelectItem value="lowest-score">Lowest Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sport</label>
                <Select value={sportFilter} onValueChange={setSportFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="soccer">Soccer</SelectItem>
                    <SelectItem value="baseball">Baseball</SelectItem>
                    <SelectItem value="volleyball">Volleyball</SelectItem>
                    <SelectItem value="track">Track</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="golf">Golf</SelectItem>
                    <SelectItem value="wrestling">Wrestling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          {selectedHighlight ? (
            <VideoHighlightPlayer 
              highlight={selectedHighlight} 
              onClose={() => setSelectedHighlight(null)} 
            />
          ) : (
            <div className="border rounded-lg flex items-center justify-center h-[400px] bg-muted/20">
              <div className="text-center p-6">
                <Play className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                <h3 className="text-xl font-medium mb-2">Select a Highlight</h3>
                <p className="text-muted-foreground">
                  Choose a video highlight from the list to play and analyze
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Highlights List */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="featured">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="featured">
                <Star className="w-4 h-4 mr-2" />
                Featured
              </TabsTrigger>
              <TabsTrigger value="all">
                <Award className="w-4 h-4 mr-2" />
                All Highlights
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="featured">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Spinner />
                </div>
              ) : (
                <VideoHighlightsList 
                  highlights={filterHighlights(featuredHighlights)} 
                  onSelectHighlight={handleHighlightSelect}
                  selectedHighlightId={selectedHighlight?.id}
                />
              )}
            </TabsContent>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Spinner />
                </div>
              ) : (
                <VideoHighlightsList 
                  highlights={filterHighlights(allHighlights)} 
                  onSelectHighlight={handleHighlightSelect}
                  selectedHighlightId={selectedHighlight?.id}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VideoHighlightsPage;