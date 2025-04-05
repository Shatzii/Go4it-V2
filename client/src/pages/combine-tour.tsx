
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  MapPin,
  CalendarCheck,
  Users,
  Trophy,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  PlayCircle,
  Mail,
  Phone,
  Info,
  ChevronsRight,
  BarChart,
  Heart,
  Brain,
  User,
  UserCheck,
  Timer,
  Gauge,
  Sparkles,
  Dumbbell,
  AlertCircle,
  Check,
  X,
  ArrowUpRight
} from "lucide-react";

// Types for Combine Tour
interface CombineEvent {
  id: number;
  name: string;
  location: string;
  date: Date;
  registrationDeadline: Date;
  spotsAvailable: number;
  totalSpots: number;
  price: number;
  testingTypes: ("physical" | "cognitive" | "psychological")[];
  description: string;
  status: 'upcoming' | 'filling_fast' | 'sold_out' | 'past';
  isRegistered?: boolean;
}

interface TestingCategory {
  name: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  icon: JSX.Element;
  tests: {
    name: string;
    description: string;
    unit?: string;
  }[];
}

// Sample testing categories that match the GAR system
const testingCategories: TestingCategory[] = [
  {
    name: "Physical",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-600/10",
    borderClass: "border-blue-500/20",
    icon: <Dumbbell className="h-5 w-5" />,
    tests: [
      { name: "40-Yard Dash", description: "Sprint speed and acceleration", unit: "seconds" },
      { name: "Pro Agility Shuttle", description: "Lateral quickness and change of direction", unit: "seconds" },
      { name: "Vertical Jump", description: "Lower body explosiveness", unit: "inches" },
      { name: "Broad Jump", description: "Lower body power and explosiveness", unit: "feet/inches" },
      { name: "Push-Ups", description: "Upper body endurance and strength", unit: "reps" },
      { name: "Reaction Time", description: "Visual response speed", unit: "ms" },
      { name: "Balance Test", description: "Body control and stability" }
    ]
  },
  {
    name: "Cognitive",
    colorClass: "text-purple-400",
    bgClass: "bg-purple-600/10",
    borderClass: "border-purple-500/20",
    icon: <Brain className="h-5 w-5" />,
    tests: [
      { name: "Tap Speed & Memory", description: "Measure of processing speed and short-term memory" },
      { name: "Decision-Making IQ", description: "Quick-thinking and situational judgment evaluation" },
      { name: "Learning Style Assessment", description: "Determination of visual, auditory, or kinesthetic preference" },
      { name: "Play Recognition", description: "Ability to recognize and respond to game situations" },
    ]
  },
  {
    name: "Psychological",
    colorClass: "text-green-400",
    bgClass: "bg-green-600/10",
    borderClass: "border-green-500/20",
    icon: <Heart className="h-5 w-5" />,
    tests: [
      { name: "Confidence & Coachability", description: "Measures belief in abilities and receptiveness to feedback" },
      { name: "Risk Profile", description: "Evaluation of decision-making under pressure" },
      { name: "Team vs Solo Preference", description: "Assessment of collaborative tendencies" },
      { name: "Motivational Analysis", description: "Identifies primary sources of motivation" },
      { name: "Personality Archetype", description: "Categorizes into types (e.g., Warrior, Analyst, Director)" }
    ]
  }
];

export default function CombineTourPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedEvent, setSelectedEvent] = useState<CombineEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Fetch upcoming combine events
  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ['/api/combine/events'],
    enabled: !!user,
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (eventId: number) => {
      return await apiRequest('POST', `/api/combine/register/${eventId}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You are now registered for this combine event",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/combine/events'] });
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mock events data until API is available
  const mockEvents: CombineEvent[] = [
    {
      id: 1,
      name: "Denver Elite Combine",
      location: "Denver Sports Complex, Colorado",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days in future
      registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      spotsAvailable: 45,
      totalSpots: 100,
      price: 149.99,
      testingTypes: ["physical", "cognitive", "psychological"],
      description: "Full GAR evaluation with college scouts in attendance. All athletes receive a comprehensive performance report and GAR rating.",
      status: 'upcoming'
    },
    {
      id: 2,
      name: "Chicago Speed & Agility Combine",
      location: "Wintrust Sports Complex, Chicago",
      date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days in future
      registrationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      spotsAvailable: 12,
      totalSpots: 75,
      price: 129.99,
      testingTypes: ["physical", "cognitive"],
      description: "Focused on speed metrics and reaction time with expanded cognitive assessment.",
      status: 'filling_fast'
    },
    {
      id: 3,
      name: "Atlanta All-Sports Combine",
      location: "Mercedes-Benz Performance Center, Atlanta",
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days in future
      registrationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      spotsAvailable: 85,
      totalSpots: 120,
      price: 169.99,
      testingTypes: ["physical", "cognitive", "psychological"],
      description: "Our most comprehensive combine event of the year with division I college coaches in attendance.",
      status: 'upcoming'
    },
    {
      id: 4,
      name: "Dallas Quarterback & Skills Combine",
      location: "Star Complex, Frisco, TX",
      date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days in future
      registrationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      spotsAvailable: 0,
      totalSpots: 50,
      price: 189.99,
      testingTypes: ["physical", "cognitive", "psychological"],
      description: "Position-specific testing focused on quarterback and skill positions with advanced cognitive assessment.",
      status: 'sold_out'
    },
    {
      id: 5,
      name: "Los Angeles Elite Combine",
      location: "SoFi Performance Center, Los Angeles",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days in past
      registrationDeadline: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      spotsAvailable: 0,
      totalSpots: 100,
      price: 149.99,
      testingTypes: ["physical", "cognitive", "psychological"],
      description: "Past event - full GAR evaluation with pro scouts in attendance.",
      status: 'past',
      isRegistered: true
    }
  ];

  // Use API data if available, otherwise use mock data
  const combineTourEvents = events || mockEvents;
  
  // Filter events based on selected date
  const filteredEvents = selectedDate 
    ? combineTourEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === selectedDate.getDate() && 
               eventDate.getMonth() === selectedDate.getMonth() && 
               eventDate.getFullYear() === selectedDate.getFullYear();
      })
    : combineTourEvents;

  // Format date string
  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMMM d, yyyy');
  };

  // Handle event selection
  const handleEventSelect = (event: CombineEvent) => {
    setSelectedEvent(event);
    setViewMode('detail');
  };

  // Handle registration
  const handleRegister = (eventId: number) => {
    registerMutation.mutate(eventId);
  };

  // Handle back to list view
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedEvent(null);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return "bg-blue-500/10 text-blue-400";
      case 'filling_fast': return "bg-amber-500/10 text-amber-400";
      case 'sold_out': return "bg-red-500/10 text-red-400";
      case 'past': return "bg-gray-500/10 text-gray-400";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  // Check if date has events
  const hasEventOnDate = (date: Date) => {
    return combineTourEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() && 
             eventDate.getMonth() === date.getMonth() && 
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  // Loading state
  if (isEventsLoading && !combineTourEvents.length) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Event Detail View */}
      {viewMode === 'detail' && selectedEvent && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBackToList}>
              <ChevronDown className="h-4 w-4 rotate-90 mr-2" />
              Back to All Events
            </Button>
            <Badge className={getStatusColor(selectedEvent.status)}>
              {selectedEvent.status === 'upcoming' && 'Upcoming'}
              {selectedEvent.status === 'filling_fast' && 'Filling Fast!'}
              {selectedEvent.status === 'sold_out' && 'Sold Out'}
              {selectedEvent.status === 'past' && 'Past Event'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{selectedEvent.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedEvent.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.testingTypes.includes('physical') && (
                      <Badge variant="outline" className="bg-blue-600/10 border-blue-500/20 text-blue-400">
                        <Dumbbell className="h-3 w-3 mr-1" />
                        Physical Testing
                      </Badge>
                    )}
                    {selectedEvent.testingTypes.includes('cognitive') && (
                      <Badge variant="outline" className="bg-purple-600/10 border-purple-500/20 text-purple-400">
                        <Brain className="h-3 w-3 mr-1" />
                        Cognitive Testing
                      </Badge>
                    )}
                    {selectedEvent.testingTypes.includes('psychological') && (
                      <Badge variant="outline" className="bg-green-600/10 border-green-500/20 text-green-400">
                        <Heart className="h-3 w-3 mr-1" />
                        Psychological Testing
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                    <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                      <CalendarCheck className="h-6 w-6 mb-2 text-blue-400" />
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="font-medium">{formatDate(selectedEvent.date)}</div>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                      <Users className="h-6 w-6 mb-2 text-amber-400" />
                      <div className="text-sm text-muted-foreground">Capacity</div>
                      <div className="font-medium">
                        {selectedEvent.status === 'past' 
                          ? `${selectedEvent.totalSpots} Athletes` 
                          : `${selectedEvent.totalSpots - selectedEvent.spotsAvailable}/${selectedEvent.totalSpots}`}
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                      <Clock className="h-6 w-6 mb-2 text-green-400" />
                      <div className="text-sm text-muted-foreground">Registration Deadline</div>
                      <div className="font-medium">{formatDate(selectedEvent.registrationDeadline)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Event Description</h3>
                    <p>{selectedEvent.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">What You'll Get</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Official GAR Rating</h4>
                          <p className="text-sm text-muted-foreground">Get a verified score that college coaches recognize</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Detailed Assessment Report</h4>
                          <p className="text-sm text-muted-foreground">Comprehensive breakdown of all testing categories</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">College Recruitment Profile</h4>
                          <p className="text-sm text-muted-foreground">Your results are added to your recruiting profile</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Exposure to College Coaches</h4>
                          <p className="text-sm text-muted-foreground">Scouts from multiple programs attend our events</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {selectedEvent.status === 'upcoming' || selectedEvent.status === 'filling_fast' ? (
                    <>
                      {selectedEvent.isRegistered ? (
                        <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                          <div className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            <span>You're registered for this event!</span>
                          </div>
                          <Button variant="outline">View Registration Details</Button>
                        </div>
                      ) : (
                        <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                          <div className="font-medium text-lg">${selectedEvent.price.toFixed(2)}</div>
                          <Button 
                            onClick={() => handleRegister(selectedEvent.id)}
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? (
                              "Processing..."
                            ) : (
                              <>Register Now <ArrowRight className="ml-2 h-4 w-4" /></>
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : selectedEvent.status === 'sold_out' ? (
                    <div className="w-full text-center">
                      <div className="text-amber-400 flex items-center justify-center mb-2">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>This event is sold out!</span>
                      </div>
                      <Button variant="outline" onClick={handleBackToList}>View Other Events</Button>
                    </div>
                  ) : (
                    <div className="w-full text-center">
                      <div className="text-muted-foreground mb-2">This event has already taken place</div>
                      {selectedEvent.isRegistered ? (
                        <Button variant="outline">View Your Results</Button>
                      ) : (
                        <Button variant="outline" onClick={handleBackToList}>View Upcoming Events</Button>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Testing Categories</CardTitle>
                  <CardDescription>
                    The following tests will be conducted at this combine
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="physical">
                    <TabsList className="grid grid-cols-3 mb-4">
                      {selectedEvent.testingTypes.includes('physical') && (
                        <TabsTrigger value="physical" className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4" />
                          <span className="hidden sm:inline">Physical</span>
                        </TabsTrigger>
                      )}
                      {selectedEvent.testingTypes.includes('cognitive') && (
                        <TabsTrigger value="cognitive" className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          <span className="hidden sm:inline">Cognitive</span>
                        </TabsTrigger>
                      )}
                      {selectedEvent.testingTypes.includes('psychological') && (
                        <TabsTrigger value="psychological" className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span className="hidden sm:inline">Psychological</span>
                        </TabsTrigger>
                      )}
                    </TabsList>
                    
                    {selectedEvent.testingTypes.includes('physical') && (
                      <TabsContent value="physical">
                        <Card className={`${testingCategories[0].bgClass} ${testingCategories[0].borderClass}`}>
                          <CardHeader>
                            <CardTitle className={testingCategories[0].colorClass}>
                              Physical Testing - 60% of GAR Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {testingCategories[0].tests.map((test, index) => (
                                <div key={index} className="flex items-start">
                                  <CheckCircle2 className={`h-4 w-4 mt-0.5 mr-2 ${testingCategories[0].colorClass}`} />
                                  <div>
                                    <h4 className="font-medium">{test.name}</h4>
                                    <p className="text-sm text-muted-foreground">{test.description}</p>
                                    {test.unit && (
                                      <Badge variant="outline" className="mt-1 text-xs">
                                        Measured in {test.unit}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )}
                    
                    {selectedEvent.testingTypes.includes('cognitive') && (
                      <TabsContent value="cognitive">
                        <Card className={`${testingCategories[1].bgClass} ${testingCategories[1].borderClass}`}>
                          <CardHeader>
                            <CardTitle className={testingCategories[1].colorClass}>
                              Cognitive Testing - 20% of GAR Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {testingCategories[1].tests.map((test, index) => (
                                <div key={index} className="flex items-start">
                                  <CheckCircle2 className={`h-4 w-4 mt-0.5 mr-2 ${testingCategories[1].colorClass}`} />
                                  <div>
                                    <h4 className="font-medium">{test.name}</h4>
                                    <p className="text-sm text-muted-foreground">{test.description}</p>
                                    {test.unit && (
                                      <Badge variant="outline" className="mt-1 text-xs">
                                        Measured in {test.unit}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )}
                    
                    {selectedEvent.testingTypes.includes('psychological') && (
                      <TabsContent value="psychological">
                        <Card className={`${testingCategories[2].bgClass} ${testingCategories[2].borderClass}`}>
                          <CardHeader>
                            <CardTitle className={testingCategories[2].colorClass}>
                              Psychological Testing - 20% of GAR Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {testingCategories[2].tests.map((test, index) => (
                                <div key={index} className="flex items-start">
                                  <CheckCircle2 className={`h-4 w-4 mt-0.5 mr-2 ${testingCategories[2].colorClass}`} />
                                  <div>
                                    <h4 className="font-medium">{test.name}</h4>
                                    <p className="text-sm text-muted-foreground">{test.description}</p>
                                    {test.unit && (
                                      <Badge variant="outline" className="mt-1 text-xs">
                                        Measured in {test.unit}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBkn2l43kpCT4RKD8FMHSO1Z_W4J5SKn9s&q=${encodeURIComponent(selectedEvent.location)}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedEvent.location}
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location)}`, '_blank')}>
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Email Us</h4>
                      <a href="mailto:support@go4itsports.org" className="text-sm text-blue-400 hover:underline">
                        support@go4itsports.org
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Call Us</h4>
                      <a href="tel:+12054344805" className="text-sm text-blue-400 hover:underline">
                        +1 (205) 434-8405
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">FAQs</h4>
                      <Button variant="link" className="h-auto p-0 text-blue-400">
                        View Common Questions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {(selectedEvent.status === 'upcoming' || selectedEvent.status === 'filling_fast') && (
                <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Ready to Get Your GAR Rating?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Secure your spot at this combine event and start your journey to getting a verified GAR Rating.</p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleRegister(selectedEvent.id)}
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        "Processing..."
                      ) : (
                        <>Register Now <ArrowRight className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Events List View */}
      {viewMode === 'list' && (
        <>
          {/* Hero Section */}
          <section className="mb-16 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
              GET VERIFIED COMBINE TOUR
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-300">
              The Future of Athlete Evaluation & Placement
            </p>
          </section>
          
          {/* Upcoming Events Calendar */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Upcoming GAR Combine Events</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Find Events
                  </CardTitle>
                  <CardDescription>
                    Select a date to see available combines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mb-4"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          modifiers={{
                            hasEvent: (date) => hasEventOnDate(date)
                          }}
                          modifiersStyles={{
                            hasEvent: { 
                              backgroundColor: "rgba(59, 130, 246, 0.1)",
                              fontWeight: "bold",
                              borderColor: "rgba(59, 130, 246, 0.5)" 
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedDate(undefined)}
                  >
                    View All Events
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedDate 
                      ? `Events on ${format(selectedDate, "MMMM d, yyyy")}` 
                      : "All Upcoming Events"}
                  </CardTitle>
                  <CardDescription>
                    {filteredEvents.filter(e => e.status !== 'past').length} 
                    {filteredEvents.filter(e => e.status !== 'past').length === 1 ? " event" : " events"} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {filteredEvents.filter(e => e.status !== 'past').length > 0 ? (
                      <div className="space-y-4">
                        {filteredEvents
                          .filter(e => e.status !== 'past')
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .map((event) => (
                            <Card 
                              key={event.id} 
                              className="overflow-hidden cursor-pointer transition-all hover:border-blue-500"
                              onClick={() => handleEventSelect(event)}
                            >
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/4 bg-gradient-to-br from-blue-900/60 to-blue-800/40 p-4 flex flex-col justify-center items-center">
                                  <div className="text-lg font-bold">{format(new Date(event.date), "MMM")}</div>
                                  <div className="text-3xl font-bold">{format(new Date(event.date), "d")}</div>
                                  <div className="text-sm">{format(new Date(event.date), "yyyy")}</div>
                                </div>
                                <div className="md:w-3/4 p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">{event.name}</h3>
                                    <Badge className={getStatusColor(event.status)}>
                                      {event.status === 'upcoming' && 'Upcoming'}
                                      {event.status === 'filling_fast' && 'Filling Fast!'}
                                      {event.status === 'sold_out' && 'Sold Out'}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {event.location}
                                  </div>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {event.testingTypes.includes('physical') && (
                                      <Badge variant="outline" className="text-xs bg-blue-600/10 border-blue-500/20 text-blue-400">
                                        Physical
                                      </Badge>
                                    )}
                                    {event.testingTypes.includes('cognitive') && (
                                      <Badge variant="outline" className="text-xs bg-purple-600/10 border-purple-500/20 text-purple-400">
                                        Cognitive
                                      </Badge>
                                    )}
                                    {event.testingTypes.includes('psychological') && (
                                      <Badge variant="outline" className="text-xs bg-green-600/10 border-green-500/20 text-green-400">
                                        Psychological
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Price:</span> ${event.price.toFixed(2)}
                                    </div>
                                    <div className="text-sm">
                                      {event.status !== 'sold_out' ? (
                                        <span className="text-muted-foreground">
                                          {event.spotsAvailable} spots left
                                        </span>
                                      ) : (
                                        <span className="text-red-400">Sold Out</span>
                                      )}
                                    </div>
                                    <Button size="sm" variant="outline">
                                      View Details <ArrowUpRight className="ml-1 h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Events Found</h3>
                        <p className="text-muted-foreground mb-4">
                          {selectedDate 
                            ? `No events scheduled for ${format(selectedDate, "MMMM d, yyyy")}` 
                            : "No upcoming events available"}
                        </p>
                        {selectedDate && (
                          <Button variant="outline" onClick={() => setSelectedDate(undefined)}>
                            View All Events
                          </Button>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Past Events */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {combineTourEvents
                .filter(e => e.status === 'past')
                .map((event) => (
                  <Card 
                    key={event.id} 
                    className="overflow-hidden cursor-pointer transition-all hover:border-gray-500"
                    onClick={() => handleEventSelect(event)}
                  >
                    <div className="p-6">
                      <Badge className={getStatusColor(event.status)}>
                        Past Event
                      </Badge>
                      <h3 className="font-semibold text-lg mt-2">{event.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                      <Button variant="outline" className="w-full">
                        {event.isRegistered ? "View Your Results" : "View Event Details"}
                      </Button>
                    </div>
                  </Card>
                ))}
              {combineTourEvents.filter(e => e.status === 'past').length === 0 && (
                <div className="col-span-3 text-center py-10">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Past Events</h3>
                  <p className="text-muted-foreground">
                    Check back later for results from previous combines
                  </p>
                </div>
              )}
            </div>
          </section>
          
          {/* GAR Rating System */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">What is GAR Rating?</h2>
                <h3 className="text-xl mb-4">The 3-Part GAR System</h3>
                <div className="space-y-6">
                  <Card className="bg-blue-600/10 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-blue-400">Physical (60%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">
                        Sprint (40yd) + Agility+ Shuttle, Vertical + Broad + Pushups / Strength + Reaction Time Balance & Coordination
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-600/10 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-purple-400">Cognitive (20%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">
                        Tap Speed & Memory + Decision-Making IQ + Learning Style: Visual / Auditory / Kinesthetic Instruction Preference
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-600/10 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="text-green-400">Psychological (20%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">
                        Confidence & Coachability + Risk Profile & Emotional Triggers + Team vs Solo Preference + Motivational Type + Personality Archetype (e.g., Warrior, Analyst)
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-2xl relative">
                  <img 
                    src="/assets/gar-athletes.jpg" 
                    alt="Athletes at Combine" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-6">
                    <Button size="lg" className="z-10 bg-blue-600 hover:bg-blue-700">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Watch GAR Overview
                    </Button>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-lg shadow-xl">
                  <div className="text-3xl font-bold">89.1</div>
                  <div className="text-sm">GAR Rating</div>
                </div>
              </div>
            </div>
          </section>

          {/* GAR Score Explanation */}
          <section className="mb-16">
            <div className="p-6 bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">GAR Score = Physical Ability + Mental Sharpness + Resilience</h2>
              <p className="text-xl text-gray-300">
                The Go4it Athletic Rating (GAR) is a dynamic scientifically backed multi-dimensional wholistic system that scores more than physical stats. Our system captures mental, emotional and learning traits to provide the most complete rating known to date.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center mb-16">
            <AnimatePresence>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-blue-900/70 to-blue-800/30 border-blue-700/30 shadow-xl">
                  <CardContent className="p-10">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Your GAR Rating?</h2>
                    <p className="text-xl mb-6 max-w-2xl mx-auto">
                      Join a combine event near you and discover your true athletic potential with our comprehensive assessment system.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {user ? (
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                          Register for an Event <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      ) : (
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                          <Link href="/auth">Sign Up to Register</Link>
                        </Button>
                      )}
                      <Button size="lg" variant="outline">
                        Learn More About GAR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Contact Info */}
          <footer className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-gray-400 text-sm">
            <div>
              <a href="tel:+12054344805" className="hover:text-blue-400">+1 (205) 434-8405</a>
            </div>
            <div>
              <a href="https://www.go4itsports.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                www.go4itsports.org
              </a>
            </div>
            <div>
              18121 E Hampden Ave, Aurora, Colorado
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
