import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CalendarIcon, 
  ChevronRightIcon, 
  MapPinIcon, 
  Clock, 
  Award,
  Star,
  BarChart,
  CheckCircle2,
  Users,
  TrendingUp,
  FileText,
  Search,
  FilterIcon,
  CalendarDays,
  Video,
  Camera
} from 'lucide-react';
import { format, isAfter, isBefore, parseISO, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import useAuthContext from '../hooks/use-auth';
import { CombineTourEvent, CombineAthleteRating, CombineAnalysisResult } from '@shared/schema';

// Component to display a single combine event card
const CombineEventCard = ({ event }: { event: CombineTourEvent }) => {
  const now = new Date();
  const startDate = new Date(event.startDate as any);
  const isPast = isBefore(startDate, now);
  const isUpcoming = isAfter(startDate, now);

  // Get status badge
  const getStatusBadge = () => {
    if (isPast) {
      return <Badge variant="outline" className="bg-gray-600 text-white">Past Event</Badge>;
    }
    
    if (event.capacity && event.registeredCount) {
      const fillRatio = event.registeredCount / event.capacity;
      
      if (fillRatio >= 1) {
        return <Badge variant="outline" className="bg-red-600 text-white">Sold Out</Badge>;
      }
      
      if (fillRatio >= 0.8) {
        return <Badge variant="outline" className="bg-yellow-500 text-white">Filling Fast</Badge>;
      }
    }
    
    return <Badge variant="outline" className="bg-green-600 text-white">Registration Open</Badge>;
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {event.bannerImage ? (
        <div className="relative h-40 w-full overflow-hidden">
          <img 
            src={event.bannerImage} 
            alt={event.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-0 right-0 p-2">
            {getStatusBadge()}
          </div>
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div className="absolute top-0 right-0 p-2">
            {getStatusBadge()}
          </div>
          <div className="flex items-center justify-center h-full text-white font-bold text-xl">
            {event.name}
          </div>
        </div>
      )}
      
      <CardContent className="flex-grow pt-4">
        <h3 className="font-bold text-lg mb-2">{event.name}</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-muted-foreground" />
            <span>
              {event.city}, {event.state}
              {event.location && <p className="text-muted-foreground text-xs">{event.location}</p>}
            </span>
          </div>
          
          <div className="flex items-start">
            <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-muted-foreground" />
            <span>
              {format(parseISO(event.startDate as unknown as string), 'MMMM d, yyyy')}
              {event.endDate && event.endDate !== event.startDate && 
                <span> - {format(parseISO(event.endDate as unknown as string), 'MMMM d, yyyy')}</span>
              }
            </span>
          </div>
          
          {event.sportTypes && event.sportTypes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {event.sportTypes.map(sport => (
                <Badge key={sport} variant="secondary" className="text-xs">
                  {sport}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link href={`/combine-tour/${event.id}`} className="w-full">
          <Button className="w-full" variant={isPast ? "outline" : "default"}>
            {isPast ? 'View Results' : isUpcoming ? 'Register Now' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Rating score display component
const RatingScore = ({ score, label }: { score: number, label: string }) => {
  let color = "bg-gray-400";
  if (score >= 8.5) color = "bg-green-500";
  else if (score >= 7.5) color = "bg-teal-500";
  else if (score >= 6.5) color = "bg-blue-500";
  else if (score >= 5.5) color = "bg-yellow-500";
  else if (score >= 4.5) color = "bg-orange-500";
  else if (score >= 0) color = "bg-red-500";
  
  return (
    <div className="flex flex-col items-center">
      <div className={`${color} text-white rounded-full h-10 w-10 flex items-center justify-center font-bold`}>
        {score.toFixed(1)}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
};

// Rating metrics display component
const MetricsDisplay = ({ metrics }: { metrics: Record<string, any> }) => {
  if (!metrics || Object.keys(metrics).length === 0) {
    return <p className="text-muted-foreground italic text-sm">No metrics recorded</p>;
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key} className="border rounded p-2">
          <p className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
          <p className="font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</p>
        </div>
      ))}
    </div>
  );
};

const CombinePublicPage = () => {
  const [location, setLocation] = useLocation();
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sportFilter, setSportFilter] = useState("all");

  // Fetch all combine events
  const { data: events = [], isLoading: eventsLoading } = useQuery<CombineTourEvent[]>({
    queryKey: ['/api/combine-tour/events'],
    enabled: activeTab === "upcoming" || activeTab === "past",
  });
  
  // Fetch user's registrations
  const { data: registrations = [], isLoading: registrationsLoading } = useQuery({
    queryKey: ['/api/combine-tour/registrations'],
    enabled: !!user && activeTab === "registered",
  });
  
  // Fetch user's ratings
  const { data: ratings = [], isLoading: ratingsLoading } = useQuery<CombineAthleteRating[]>({
    queryKey: ['/api/combines/athlete-ratings'],
    enabled: !!user && activeTab === "results",
  });
  
  // Fetch user's analysis
  const { data: analysis = [], isLoading: analysisLoading } = useQuery<CombineAnalysisResult[]>({
    queryKey: ['/api/combines/analysis/athlete'],
    enabled: !!user && activeTab === "results",
  });

  // Filter events by date (upcoming or past)
  const filteredEvents = events.filter(event => {
    const now = new Date();
    const eventStartDate = parseISO(event.startDate as unknown as string);
    
    if (activeTab === "upcoming") {
      return isAfter(eventStartDate, now);
    } else if (activeTab === "past") {
      return isBefore(eventStartDate, now);
    }
    return true;
  });
  
  // Further filter by sport if selected
  const filteredBySport = sportFilter === "all" 
    ? filteredEvents 
    : filteredEvents.filter(event => 
        event.sportTypes && event.sportTypes.includes(sportFilter)
      );

  // Get unique sports from all events
  const uniqueSports = Array.from(
    new Set(
      events
        .filter(event => event.sportTypes && event.sportTypes.length > 0)
        .flatMap(event => event.sportTypes)
    )
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Combine Central</h1>
          <p className="text-muted-foreground">
            Register for combines, view your results, and track your development
          </p>
        </div>
        
        {user ? (
          <Button 
            onClick={() => setActiveTab("results")}
            className="flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            View My Results
          </Button>
        ) : (
          <Button 
            onClick={() => setLocation("/login")}
            className="flex items-center gap-2"
            variant="outline"
          >
            Log in to View Your Results
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[800px]">
          <TabsTrigger value="upcoming">Upcoming Combines</TabsTrigger>
          <TabsTrigger value="past">Past Combines</TabsTrigger>
          <TabsTrigger value="registered" disabled={!user}>My Registrations</TabsTrigger>
          <TabsTrigger value="results" disabled={!user}>My Results</TabsTrigger>
        </TabsList>
        
        {/* Upcoming Combines Tab */}
        <TabsContent value="upcoming">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="flex items-center gap-2">
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {uniqueSports.map(sport => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search combines..."
                  className="pl-8 w-full md:w-[200px]"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <MapPinIcon className="h-4 w-4 mr-2" />
                Near Me
              </Button>
            </div>
          </div>
          
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="pt-4">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredBySport.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming combines found</h3>
                <p className="text-muted-foreground max-w-md">
                  {sportFilter === "all" 
                    ? "There are no upcoming combines scheduled at this time. Please check back later."
                    : `There are no upcoming combines for ${sportFilter} scheduled at this time. Try selecting a different sport.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBySport.map(event => (
                <CombineEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Past Combines Tab */}
        <TabsContent value="past">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="flex items-center gap-2">
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {uniqueSports.map(sport => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search combines..."
                  className="pl-8 w-full md:w-[200px]"
                />
              </div>
            </div>
          </div>
          
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="pt-4">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredBySport.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No past combines found</h3>
                <p className="text-muted-foreground max-w-md">
                  {sportFilter === "all" 
                    ? "There are no past combines in our records yet."
                    : `There are no past combines for ${sportFilter} in our records. Try selecting a different sport.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBySport.map(event => (
                <CombineEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* My Registrations Tab */}
        <TabsContent value="registered">
          {!user ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Please log in to view your registrations</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  You need to be logged in to see your combine registrations and results.
                </p>
                <Button onClick={() => setLocation("/login")}>Log In</Button>
              </CardContent>
            </Card>
          ) : registrationsLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-9 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : registrations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No registrations found</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  You haven't registered for any combines yet. Browse upcoming combines to register.
                </p>
                <Button onClick={() => setActiveTab("upcoming")}>View Upcoming Combines</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>My Registered Combines</CardTitle>
                <CardDescription>
                  Combines you've registered for and their details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registrations.map((registration: any) => (
                    <div key={registration.id} className="flex flex-col md:flex-row justify-between gap-4 border rounded-lg p-4">
                      <div>
                        <h3 className="font-bold">{registration.eventName}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {format(parseISO(registration.eventDate as unknown as string), 'MMMM d, yyyy')}
                        </div>
                        {registration.registrationStatus && (
                          <Badge className="mt-2" variant={registration.registrationStatus === 'confirmed' ? 'default' : 'outline'}>
                            {registration.registrationStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 self-end md:self-center">
                        <Button variant="outline" size="sm" onClick={() => setLocation(`/combine-tour/${registration.eventId}`)}>
                          View Details
                        </Button>
                        {registration.registrationStatus === 'confirmed' && (
                          <Button size="sm">
                            Check In
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* My Results Tab */}
        <TabsContent value="results">
          {!user ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Please log in to view your results</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  You need to be logged in to see your combine ratings and analysis.
                </p>
                <Button onClick={() => setLocation("/login")}>Log In</Button>
              </CardContent>
            </Card>
          ) : ratingsLoading || analysisLoading ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
          ) : ratings.length === 0 && analysis.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No combine results yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  You don't have any combine ratings or analysis results yet. Participate in a combine to get evaluated.
                </p>
                <Button onClick={() => setActiveTab("upcoming")}>View Upcoming Combines</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {ratings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-amber-500" />
                      Combine Ratings
                    </CardTitle>
                    <CardDescription>
                      Your performance ratings from combines you've attended
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {ratings.map((rating, index) => (
                        <AccordionItem key={rating.id} value={`rating-${rating.id}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex flex-col md:flex-row md:items-center justify-between w-full pr-4">
                              <div className="flex-1">
                                <span className="font-medium">{rating.sport} - {rating.position}</span>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(rating.created_at as any), 'MMMM d, yyyy')}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 mt-2 md:mt-0">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < rating.star_level ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <div className="flex flex-wrap justify-around gap-4 bg-muted p-4 rounded-lg">
                                {rating.metrics && Object.entries(rating.metrics as Record<string, number>).slice(0, 5).map(([key, value]) => (
                                  <RatingScore 
                                    key={key} 
                                    score={typeof value === 'number' ? value : 0} 
                                    label={key.replace('_', ' ')} 
                                  />
                                ))}
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Detailed Metrics</h4>
                                <MetricsDisplay metrics={rating.metrics as Record<string, any>} />
                              </div>
                              
                              {rating.traits && (
                                <div>
                                  <h4 className="font-medium mb-2">Observed Traits</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.entries(rating.traits as Record<string, any>).map(([category, traits]) => (
                                      <div key={category} className="border rounded p-4">
                                        <h5 className="font-medium capitalize mb-2">{category.replace('_', ' ')}</h5>
                                        <div className="space-y-2">
                                          {Object.entries(traits as Record<string, number>).map(([trait, value]) => (
                                            <div key={trait} className="flex justify-between items-center">
                                              <span className="text-sm capitalize">{trait.replace('_', ' ')}</span>
                                              <div className="flex gap-0.5">
                                                {Array(10).fill(0).map((_, i) => (
                                                  <div 
                                                    key={i} 
                                                    className={`h-2 w-2 rounded-full ${i < value ? 'bg-blue-500' : 'bg-gray-200'}`}
                                                  />
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {rating.notes && (
                                <div>
                                  <h4 className="font-medium mb-2">Evaluator Notes</h4>
                                  <div className="bg-muted p-4 rounded-lg text-sm">
                                    {rating.notes}
                                  </div>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}
              
              {analysis.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      AI Analysis & Recommendations
                    </CardTitle>
                    <CardDescription>
                      Detailed analysis of your combine performance and areas for improvement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {analysis.map((result) => (
                        <AccordionItem key={result.id} value={`analysis-${result.id}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4">
                              <div className="flex-1">
                                <span className="font-medium">Performance Analysis</span>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(result.ai_analysis_date as any), 'MMMM d, yyyy')}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <Badge variant="outline" className="bg-blue-50">
                                  AI Generated
                                </Badge>
                                {result.recovery_score && (
                                  <Badge variant={
                                    result.recovery_score > 80 ? "default" : 
                                    result.recovery_score > 60 ? "secondary" : "destructive"
                                  }>
                                    Recovery: {result.recovery_score}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              {result.position_fit && result.position_fit.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Position Fit</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {result.position_fit.map((position) => (
                                      <Badge key={position}>{position}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {result.skill_analysis && (
                                <div>
                                  <h4 className="font-medium mb-2">Skill Analysis</h4>
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {Object.entries(result.skill_analysis as Record<string, any>).map(([category, analysis]) => (
                                      <Card key={category} className="border shadow-none">
                                        <CardHeader className="p-4 pb-2">
                                          <CardTitle className="text-base capitalize">{category.replace('_', ' ')}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 text-sm">
                                          <p>{analysis.description}</p>
                                          {analysis.score && (
                                            <div className="mt-2">
                                              <div className="flex justify-between text-xs mb-1">
                                                <span>Current Level</span>
                                                <span>{analysis.score}/10</span>
                                              </div>
                                              <Progress value={analysis.score * 10} className="h-2" />
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {result.next_steps && (
                                <div>
                                  <h4 className="font-medium mb-2">Training Recommendations</h4>
                                  <div className="space-y-4">
                                    {Object.entries(result.next_steps as Record<string, any>).map(([focus, steps], index) => (
                                      <div key={index} className="border rounded-lg p-4">
                                        <h5 className="font-medium mb-2 capitalize">{focus.replace('_', ' ')}</h5>
                                        <ul className="space-y-2 text-sm">
                                          {Array.isArray(steps) ? steps.map((step, i) => (
                                            <li key={i} className="flex items-start">
                                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                                              <span>{step}</span>
                                            </li>
                                          )) : (
                                            <li className="flex items-start">
                                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                                              <span>{steps as string}</span>
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {result.ai_coach_notes && (
                                <div>
                                  <h4 className="font-medium mb-2">AI Coach Notes</h4>
                                  <div className="bg-muted p-4 rounded-lg text-sm">
                                    {result.ai_coach_notes}
                                  </div>
                                </div>
                              )}
                              
                              {result.video_id && (
                                <div className="flex justify-center">
                                  <Button variant="outline" className="flex items-center gap-2">
                                    <Video className="h-4 w-4" />
                                    View Performance Video
                                  </Button>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-muted rounded-lg">
                <div>
                  <h3 className="font-bold text-lg">Improve Your Combine Performance</h3>
                  <p className="text-muted-foreground">Upload training videos to get AI-powered feedback</p>
                </div>
                <Button className="flex items-center gap-2" onClick={() => setLocation('/upload')}>
                  <Camera className="h-4 w-4" />
                  Upload Training Video
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CombinePublicPage;