import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Share2, 
  Calendar, 
  TrendingUp, 
  BarChart2, 
  Clock, 
  FileDown, 
  ChevronRight,
  Volume2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TimeLapseProgression } from '@/components/gar/time-lapse-progression';
import { SpeechButton } from '@/components/ui/speech-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// This is a placeholder for when the performance heatmap component is created
const PerformanceHeatmap = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <div className="text-2xl font-bold">Performance Heatmap</div>
    <div className="text-muted-foreground mb-8">Coming soon</div>
  </div>
);

// This is a placeholder for when the strength weakness grid component is created
const StrengthWeaknessGrid = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <div className="text-2xl font-bold">Strength/Weakness Analysis</div>
    <div className="text-muted-foreground mb-8">Coming soon</div>
  </div>
);

export default function EnhancedGARPage() {
  const [activeTab, setActiveTab] = useState('time-lapse');
  const { toast } = useToast();
  
  // Define the athlete interface
  interface Athlete {
    id: number;
    name: string;
    sport: string;
    position: string;
    starRating: number;
    profileImg: string;
    age: number;
    grade: string;
    goals: {
      short_term: string;
      long_term: string;
    }
  }
  
  // Fetch athlete data - for now we'll use mock
  const { data: athlete, isLoading } = useQuery<Athlete>({
    queryKey: ['/api/athlete/current'],
    enabled: false, // Disable for now as we're using mock data
  });
  
  // Mock athlete data
  const mockAthlete: Athlete = {
    id: 1,
    name: 'Marcus Johnson',
    sport: 'Basketball',
    position: 'Point Guard',
    starRating: 4,
    profileImg: 'https://images.unsplash.com/photo-1564146174570-8b7110cede7f?w=300&h=300&fit=crop',
    age: 17,
    grade: '11th',
    goals: {
      short_term: 'Improve three-point shooting accuracy',
      long_term: 'Earn Division I scholarship'
    }
  };
  
  // Use mock data for now
  const athleteData: Athlete = athlete || mockAthlete;
  
  const getPageDescription = () => {
    switch (activeTab) {
      case 'time-lapse':
        return 'View your performance progress over time with animated visualization';
      case 'heatmap':
        return 'Analyze performance patterns across different skills and scenarios';
      case 'strengths':
        return 'Identify your key strengths and areas for improvement';
      default:
        return 'Advanced performance analytics and visualization';
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'time-lapse':
        return 'GAR Progression Time-Lapse';
      case 'heatmap':
        return 'Performance Heat Map';
      case 'strengths':
        return 'Strength & Weakness Grid';
      default:
        return 'Enhanced GAR Analytics';
    }
  };
  
  // Handle share button click
  const handleShare = () => {
    toast({
      title: 'Share Feature',
      description: 'Sharing functionality will be available soon',
    });
  };
  
  // Handle download report
  const handleDownloadReport = () => {
    toast({
      title: 'Download Report',
      description: 'Report download functionality will be available soon',
    });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }
  
  const pageDescription = getPageDescription();
  const pageTitle = getPageTitle();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Enhanced GAR Analytics
              <SpeechButton 
                text={`Enhanced GAR Analytics. ${pageTitle}. ${pageDescription}`} 
                tooltip="Read page title and description"
              />
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Advanced analytics to track your athletic progress, identify strengths, and enhance performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={handleDownloadReport}>
            <FileDown className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar - Athlete summary */}
        <div className="col-span-1">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Athlete Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-primary/50">
                  <img 
                    src={athleteData.profileImg} 
                    alt={athleteData.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg">{athleteData.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{athleteData.sport}</span>
                  <span>•</span>
                  <span>{athleteData.position}</span>
                </div>
                <div className="flex mt-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg 
                      key={idx} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill={idx < athleteData.starRating ? "currentColor" : "none"}
                      stroke={idx < athleteData.starRating ? "none" : "currentColor"}
                      className={`w-4 h-4 ${idx < athleteData.starRating ? "text-amber-400" : "text-gray-300"}`}
                    >
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Age/Grade</div>
                  <div>{athleteData.age} years • {athleteData.grade} Grade</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Current Goals</div>
                  <div className="text-sm">{athleteData.goals.short_term}</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Long-term Goals</div>
                  <div className="text-sm">{athleteData.goals.long_term}</div>
                </div>
                
                <Button variant="outline" className="w-full justify-between mt-4">
                  <span className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Full Profile
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                Quick Stats
                <SpeechButton 
                  text="Quick Stats for your athletic performance" 
                  tooltip="Read stats summary"
                  className="ml-2"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground uppercase font-semibold">GAR Score</div>
                  <div className="text-2xl font-bold mt-1">4.1</div>
                  <div className="flex items-center text-xs text-emerald-500 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.3 pts
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Assessments</div>
                  <div className="text-2xl font-bold mt-1">12</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Last: 5 days ago
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Top Skill</div>
                  <div className="text-lg font-bold mt-1">Agility</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <BarChart2 className="h-3 w-3 mr-1" />
                    4.2 / 5.0
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Growth Area</div>
                  <div className="text-lg font-bold mt-1">Strength</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <BarChart2 className="h-3 w-3 mr-1" />
                    3.7 / 5.0
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="col-span-1 lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="time-lapse" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>Time-Lapse</span>
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                <span>Heat Map</span>
              </TabsTrigger>
              <TabsTrigger value="strengths" className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Strengths & Weaknesses</span>
              </TabsTrigger>
            </TabsList>
            
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="time-lapse">
                <TimeLapseProgression athleteId={athleteData.id} />
              </TabsContent>
              
              <TabsContent value="heatmap">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span>Performance Heat Map</span>
                        <SpeechButton 
                          text="Performance Heat Map: Analyze performance patterns across different skills and scenarios" 
                          tooltip="Read heatmap description"
                          className="ml-2"
                        />
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Analyze performance patterns across different skills and scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PerformanceHeatmap />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="strengths">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span>Strength & Weakness Grid</span>
                        <SpeechButton 
                          text="Strength and Weakness Grid: Identify your key strengths and areas for improvement" 
                          tooltip="Read strengths description"
                          className="ml-2"
                        />
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Identify your key strengths and areas for improvement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StrengthWeaknessGrid />
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}