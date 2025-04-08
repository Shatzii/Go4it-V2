import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import EventsGrid from '@/components/combine-tour/EventsGrid';
import EventsCarousel from '@/components/combine-tour/EventsCarousel';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CombineTourPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  return (
    <div className="container py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Go4It Combine Tour</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find and register for our national combines to showcase your skills in front of top college coaches and scouts.
        </p>
      </div>
      
      {/* Featured Events Carousel */}
      <section className="mb-12">
        <EventsCarousel 
          filter="filling_fast" 
          limit={5} 
          title="Filling Fast" 
          description="These events are almost sold out - register now to secure your spot" 
        />
      </section>
      
      {/* Upcoming Events Section */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Register for a Combine</CardTitle>
            <CardDescription>
              Our combines include comprehensive evaluations across physical, cognitive, and psychological attributes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[800px] overflow-auto mt-6 pr-4">
                <TabsContent value="upcoming" className="m-0">
                  <EventsGrid filter="upcoming" />
                </TabsContent>
                <TabsContent value="past" className="m-0">
                  <EventsGrid filter="past" />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      </section>
      
      {/* About the Combine Tour */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">About Our Combines</CardTitle>
            <CardDescription>
              The Go4It Combine Tour provides opportunities for athletes to showcase their talents
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Expert Evaluation</h3>
              <p className="text-muted-foreground">
                Get evaluated by top coaches and scouts using our proprietary GAR (Go4It Athlete Rating) scoring system.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recruiting Visibility</h3>
              <p className="text-muted-foreground">
                Your performance data is shared with our network of college coaches and recruiters.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Complete Assessment</h3>
              <p className="text-muted-foreground">
                We evaluate physical, cognitive, and psychological attributes to provide a comprehensive profile.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start space-y-4">
            <h3 className="text-lg font-semibold">What to Expect</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Sport-specific drills and tests designed by professional coaches</li>
              <li>Accurate measurements of speed, strength, agility, and sport-specific skills</li>
              <li>Cognitive assessments testing reaction time, decision-making, and game intelligence</li>
              <li>Psychological evaluations for mental toughness and competitive mindset</li>
              <li>Highlight video creation captured by professional videographers</li>
              <li>Direct feedback from evaluators and position coaches</li>
            </ul>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}