import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { formatDateTime } from '@/lib/combine-utils';
import { CombineTourEvent } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedCombines: React.FC = () => {
  const { data: events = [], isLoading, error } = useQuery<CombineTourEvent[]>({
    queryKey: ['/api/combine-tour/events/status/upcoming'],
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="w-full py-6">
        <h2 className="text-2xl font-bold mb-4">Upcoming Combine Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !events || events.length === 0) {
    return (
      <div className="w-full py-6">
        <h2 className="text-2xl font-bold mb-4">Upcoming Combine Events</h2>
        <Card className="p-6 text-center">
          <p>No upcoming combine events found. Check back soon!</p>
        </Card>
      </div>
    );
  }

  // Only show the 3 most recent events on the home page
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="w-full py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Upcoming Combine Events</h2>
        <Link href="/combine-tour">
          <Button variant="outline">View All Events</Button>
        </Link>
      </div>
      
      <div className="block md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {featuredEvents.map((event: CombineTourEvent) => (
              <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                <EventCard event={event} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredEvents.map((event: CombineTourEvent) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

type EventCardProps = {
  event: CombineTourEvent;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isFilling, setIsFilling] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);

  useEffect(() => {
    if (event.maximumAttendees && event.currentAttendees) {
      const fillRatio = event.currentAttendees / event.maximumAttendees;
      setIsFilling(fillRatio >= 0.75 && fillRatio < 1);
      setIsSoldOut(fillRatio >= 1);
    }
  }, [event]);

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url(${event.featuredImage || 'https://images.unsplash.com/photo-1546519638-68e109acd27d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80'})` }}
      >
        <div className="p-3 flex justify-end">
          {isSoldOut ? (
            <Badge variant="destructive" className="text-xs">SOLD OUT</Badge>
          ) : isFilling ? (
            <Badge variant="secondary" className="text-xs">FILLING FAST</Badge>
          ) : (
            <Badge variant="outline" className="text-xs bg-white/80">AVAILABLE</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-1">{event.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {event.city}, {event.state} • {formatDateTime(event.startDate)}
        </p>
        <p className="text-sm line-clamp-2 mb-4">{event.description}</p>
        
        <div className="mt-auto">
          <Link href={`/combine-tour/${event.slug || event.id}`}>
            <Button className="w-full" disabled={isSoldOut}>
              {isSoldOut ? 'Sold Out' : 'Register Now'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedCombines;