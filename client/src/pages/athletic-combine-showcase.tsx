import React from 'react';
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
  Zap
} from 'lucide-react';
import AthleticCombineShowcase from '@/components/animations/AthleticCombineShowcase';

/**
 * Athletic Combine Showcase Page
 * Displays the high-quality 256-bit commercial animation for athletic combines
 */
export default function AthleticCombineShowcasePage() {
  return (
    <>
      <Helmet>
        <title>Athletic Combine Showcase | Go4It Sports</title>
      </Helmet>
      
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Athletic Combine Showcase</h1>
          <p className="text-muted-foreground">
            High-performance athlete evaluation with 256-bit Quantum Animation Pipeline
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AthleticCombineShowcase 
              athleteName="Michael James"
              athleteAge={17}
              sportsFocus="Basketball"
              autoPlay={true}
              showControls={true}
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Combines</CardTitle>
                <CardDescription>Register for athlete evaluation events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-medium">Summer Elite Combine</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>June 15, 2025 • 9:00 AM - 3:00 PM</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>Metro Sports Complex</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="mr-2">Basketball</Badge>
                        <Badge variant="outline">Football</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-medium">Fall Prospect Camp</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>September 24, 2025 • 10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>University Athletic Center</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="mr-2">Basketball</Badge>
                        <Badge variant="outline" className="mr-2">Football</Badge>
                        <Badge variant="outline">Soccer</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Register for Combine
                </Button>
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
                      <Badge>4.52s</Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '84%' }} />
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
                      <Badge>36.5"</Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '87%' }} />
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
                        <Video className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm font-medium">Basketball Skills</span>
                      </div>
                      <Badge>87/100</Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '87%' }} />
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
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm">
                  <Medal className="h-4 w-4 mr-2" />
                  Full Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
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
          <CardFooter className="flex justify-between">
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
            <Button>
              Register for Upcoming Combine
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}