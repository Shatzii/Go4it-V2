import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  Medal, 
  Users, 
  CalendarDays, 
  MapPin, 
  Share2, 
  Download, 
  Clock, 
  Gauge, 
  Zap, 
  User, 
  ChevronRight, 
  PlusCircle, 
  Calendar, 
  CheckCircle, 
  Dribbble, 
  Timer
} from 'lucide-react';
import AthleticCombineShowcase from '@/components/animations/AthleticCombineShowcase';

/**
 * Athletic Combine Showcase Page
 * Displays the high-quality 256-bit commercial animation for athletic combines
 */
export default function AthleticCombineShowcasePage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedProfile, setSelectedProfile] = useState<string>("michael");
  const { toast } = useToast();

  // Sample athlete profiles
  const athleteProfiles = {
    michael: {
      name: "Michael James",
      age: 17,
      sport: "Basketball",
      metrics: {
        dash: { value: 4.52, tier: "excellent" },
        jump: { value: 36.5, tier: "elite" },
        basketball: { value: 87, tier: "excellent" },
        agility: { value: 92, tier: "elite" }
      }
    },
    jessica: {
      name: "Jessica Williams",
      age: 16,
      sport: "Soccer",
      metrics: {
        dash: { value: 4.65, tier: "excellent" },
        jump: { value: 33.0, tier: "excellent" },
        basketball: { value: 79, tier: "good" },
        agility: { value: 95, tier: "elite" }
      }
    },
    tyrone: {
      name: "Tyrone Jackson",
      age: 18,
      sport: "Football",
      metrics: {
        dash: { value: 4.38, tier: "elite" },
        jump: { value: 38.5, tier: "elite" },
        basketball: { value: 82, tier: "excellent" },
        agility: { value: 89, tier: "excellent" }
      }
    }
  };

  const handleShare = () => {
    toast({
      title: "Showcase Link Copied",
      description: "Athletic Combine Showcase link has been copied to clipboard"
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for download"
    });
  };

  const handleRegister = () => {
    toast({
      title: "Registration Started",
      description: "You're being redirected to the combine registration form"
    });
  };

  const getActiveProfile = () => {
    return selectedProfile === "michael" 
      ? athleteProfiles.michael 
      : selectedProfile === "jessica" 
        ? athleteProfiles.jessica 
        : athleteProfiles.tyrone;
  };

  return (
    <>
      <Helmet>
        <title>Athletic Combine Showcase | Go4It Sports</title>
      </Helmet>
      
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Athletic Combine Showcase</h1>
            <p className="text-muted-foreground">
              High-performance athlete evaluation with 256-bit Quantum Animation Pipeline
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">
              <Video className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Showcase</span>
              <span className="sm:hidden">Show</span>
            </TabsTrigger>
            <TabsTrigger value="profiles">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Athlete Profiles</span>
              <span className="sm:hidden">Profiles</span>
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Combine Events</span>
              <span className="sm:hidden">Events</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Showcase Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AthleticCombineShowcase 
                  athleteName={getActiveProfile().name}
                  athleteAge={getActiveProfile().age}
                  sportsFocus={getActiveProfile().sport}
                  autoPlay={true}
                  showControls={true}
                />
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Athlete Profile</CardTitle>
                      <Badge variant="outline" className="capitalize">{getActiveProfile().sport}</Badge>
                    </div>
                    <CardDescription>Performance evaluation metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{getActiveProfile().name}</h3>
                          <p className="text-sm text-muted-foreground">Age {getActiveProfile().age}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="border rounded-lg p-3 flex flex-col items-center justify-center">
                          <div className="text-sm text-muted-foreground mb-1">
                            <Timer className="h-3.5 w-3.5 inline mr-1" />
                            40-Yard
                          </div>
                          <div className="text-xl font-bold">{getActiveProfile().metrics.dash.value}s</div>
                          <Badge variant="secondary" className="mt-1 capitalize">
                            {getActiveProfile().metrics.dash.tier}
                          </Badge>
                        </div>
                        
                        <div className="border rounded-lg p-3 flex flex-col items-center justify-center">
                          <div className="text-sm text-muted-foreground mb-1">
                            <Zap className="h-3.5 w-3.5 inline mr-1" />
                            Vertical
                          </div>
                          <div className="text-xl font-bold">{getActiveProfile().metrics.jump.value}"</div>
                          <Badge variant="secondary" className="mt-1 capitalize">
                            {getActiveProfile().metrics.jump.tier}
                          </Badge>
                        </div>
                        
                        <div className="border rounded-lg p-3 flex flex-col items-center justify-center">
                          <div className="text-sm text-muted-foreground mb-1">
                            <Dribbble className="h-3.5 w-3.5 inline mr-1" />
                            Basketball
                          </div>
                          <div className="text-xl font-bold">{getActiveProfile().metrics.basketball.value}</div>
                          <Badge variant="secondary" className="mt-1 capitalize">
                            {getActiveProfile().metrics.basketball.tier}
                          </Badge>
                        </div>
                        
                        <div className="border rounded-lg p-3 flex flex-col items-center justify-center">
                          <div className="text-sm text-muted-foreground mb-1">
                            <Gauge className="h-3.5 w-3.5 inline mr-1" />
                            Agility
                          </div>
                          <div className="text-xl font-bold">{getActiveProfile().metrics.agility.value}</div>
                          <Badge variant="secondary" className="mt-1 capitalize">
                            {getActiveProfile().metrics.agility.tier}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedProfile("michael")}
                        className={selectedProfile === "michael" ? "border-primary" : ""}
                      >
                        Michael
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedProfile("jessica")}
                        className={selectedProfile === "jessica" ? "border-primary" : ""}
                      >
                        Jessica
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedProfile("tyrone")}
                        className={selectedProfile === "tyrone" ? "border-primary" : ""}
                      >
                        Tyrone
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Key combine measurements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Gauge className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm font-medium">40-Yard Dash</span>
                          </div>
                          <Badge>{getActiveProfile().metrics.dash.value}s</Badge>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${Math.min(100, 100 - (getActiveProfile().metrics.dash.value - 4.2) * 50)}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>5.2s</span>
                          <span>4.8s</span>
                          <span>4.6s</span>
                          <span>4.4s</span>
                          <span>4.2s</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm font-medium">Vertical Jump</span>
                          </div>
                          <Badge>{getActiveProfile().metrics.jump.value}"</Badge>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${Math.min(100, (getActiveProfile().metrics.jump.value / 42) * 100)}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>24"</span>
                          <span>28"</span>
                          <span>32"</span>
                          <span>36"</span>
                          <span>40"</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Dribbble className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm font-medium">Basketball Skills</span>
                          </div>
                          <Badge>{getActiveProfile().metrics.basketball.value}/100</Badge>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${Math.min(100, getActiveProfile().metrics.basketball.value)}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>60</span>
                          <span>70</span>
                          <span>80</span>
                          <span>90</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <Medal className="h-4 w-4 mr-2" />
                      Full Analysis Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Athlete Profiles Tab */}
          <TabsContent value="profiles" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(athleteProfiles).map(([key, profile]) => (
                <Card key={key} className={selectedProfile === key ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{profile.name}</CardTitle>
                      <Badge variant="outline">{profile.sport}</Badge>
                    </div>
                    <CardDescription>Age {profile.age}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">40-Yard Dash</span>
                        <Badge variant="secondary">{profile.metrics.dash.value}s</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Vertical Jump</span>
                        <Badge variant="secondary">{profile.metrics.jump.value}"</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Basketball Skills</span>
                        <Badge variant="secondary">{profile.metrics.basketball.value}/100</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Agility Rating</span>
                        <Badge variant="secondary">{profile.metrics.agility.value}/100</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={selectedProfile === key ? "default" : "outline"}
                      onClick={() => {
                        setSelectedProfile(key);
                        setActiveTab("dashboard");
                      }}
                    >
                      {selectedProfile === key ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Currently Selected
                        </>
                      ) : (
                        <>
                          <Video className="h-4 w-4 mr-2" />
                          View Showcase
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <Button className="w-full md:w-auto" variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Register as Athlete
            </Button>
          </TabsContent>
          
          {/* Combine Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Combines</CardTitle>
                <CardDescription>Register for athletic evaluation events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-md p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Summer Elite Combine</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>June 15, 2025</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>Metro Sports Complex</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">Basketball</Badge>
                            <Badge variant="outline">Football</Badge>
                            <Badge variant="outline">Track</Badge>
                          </div>
                        </div>
                      </div>
                      <Button onClick={handleRegister}>Register</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Fall Prospect Camp</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>September 24, 2025</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>University Athletic Center</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">Basketball</Badge>
                            <Badge variant="outline">Soccer</Badge>
                            <Badge variant="outline">Volleyball</Badge>
                            <Badge variant="outline">Swimming</Badge>
                          </div>
                        </div>
                      </div>
                      <Button onClick={handleRegister}>Register</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Winter College Showcase</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>December 10, 2025</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>National Performance Center</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">Basketball</Badge>
                            <Badge variant="outline">Football</Badge>
                            <Badge variant="secondary">College Recruiters</Badge>
                          </div>
                        </div>
                      </div>
                      <Button onClick={handleRegister}>Register</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Medal className="h-5 w-5 text-primary mr-1.5" />
                      <span className="text-sm font-medium">157 College Recruiters</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-primary mr-1.5" />
                      <span className="text-sm font-medium">1,200+ Athletes</span>
                    </div>
                  </div>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    View All Locations
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>About Go4It Athletic Combines</CardTitle>
            <CardDescription>
              Our combines use cutting-edge technology to evaluate athletic performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                Go4It Athletic Combines provide comprehensive athletic assessments using advanced 
                motion capture technology and 256-bit Quantum Animation rendering. Our combines are 
                designed specifically for neurodivergent student athletes aged 12-18, with a special 
                focus on capturing the unique talents and abilities of athletes with ADHD.
              </p>
              
              <p>
                Each combine includes evaluation of key metrics like 40-yard dash speed, vertical jump 
                height, agility, sport-specific skills, and game IQ. Athletes receive a detailed report 
                with their Growth and Ability Rating (GAR) score, personalized recommendations for 
                improvement, and high-quality animation visualizations of their performance.
              </p>
              
              <h3>Key Features:</h3>
              <ul>
                <li>High-precision motion capture technology</li>
                <li>256-bit Quantum Animation rendering for performance analysis</li>
                <li>Sport-specific drills and assessments</li>
                <li>Neurodivergent-focused evaluation metrics</li>
                <li>Comprehensive GAR scoring system</li>
                <li>College recruitment exposure opportunities</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Medal className="h-5 w-5 text-primary mr-1.5" />
                <span className="text-sm font-medium">157 College Recruiters</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-1.5" />
                <span className="text-sm font-medium">1,200+ Athletes</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-1.5" />
                <span className="text-sm font-medium">24 Locations</span>
              </div>
            </div>
            <Button onClick={handleRegister}>
              <Calendar className="h-4 w-4 mr-2" />
              Register for Upcoming Combine
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}