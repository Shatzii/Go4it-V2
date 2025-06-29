import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import {
  CombineEvent,
  FormattedCombineEvent,
  formatCombineEvent,
  getStatusClass,
  getStatusText
} from '@/lib/combine-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

interface EventsCarouselProps {
  filter?: 'upcoming' | 'past' | 'filling_fast';
  limit?: number;
  title?: string;
  description?: string;
}

export default function EventsCarousel({ 
  filter = 'upcoming', 
  limit = 5, 
  title = "Upcoming Combines",
  description = "Register for one of our upcoming national combines"
}: EventsCarouselProps) {
  // Fetch combine events from the API
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['/api/combine-tour/events'],
    // We don't need to specify queryFn as the default fetcher is set up
  });

  if (isLoading) {
    return <EventsCarouselSkeleton count={4} title={title} description={description} />;
  }

  if (error || !events) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Error Loading Events</h3>
        <p>Unable to load combine tour events. Please try again later.</p>
      </div>
    );
  }

  // Format the events for display
  let formattedEvents: FormattedCombineEvent[] = events.map((event: CombineEvent) => 
    formatCombineEvent(event)
  );

  // Apply filter if needed
  if (filter === 'upcoming') {
    formattedEvents = formattedEvents.filter(event => 
      event.status === 'upcoming' || event.status === 'filling_fast'
    );
  } else if (filter === 'past') {
    formattedEvents = formattedEvents.filter(event => 
      event.status === 'past'
    );
  } else if (filter === 'filling_fast') {
    formattedEvents = formattedEvents.filter(event => 
      event.status === 'filling_fast'
    );
  }

  // Sort events by date
  formattedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Apply limit
  formattedEvents = formattedEvents.slice(0, limit);

  if (formattedEvents.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="text-center p-8 bg-accent/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
          <p>There are currently no {filter} events scheduled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <Carousel className="w-full">
        <CarouselContent>
          {formattedEvents.map(event => (
            <CarouselItem key={event.id} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <EventCard event={event} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
      
      <div className="flex justify-center mt-6">
        <Link href="/combine-tour">
          <Button variant="outline">View All Events</Button>
        </Link>
      </div>
    </div>
  );
}

interface EventCardProps {
  event: FormattedCombineEvent;
}

function EventCard({ event }: EventCardProps) {
  const formattedDate = format(new Date(event.date), 'MMM dd, yyyy');
  const statusClass = getStatusClass(event.status);
  const statusText = getStatusText(event.status);

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative">
        <img 
          src={event.featuredImage || '/images/combines/default-combine.jpg'}
          alt={event.name}
          className="w-full h-40 object-cover"
        />
        <Badge className={`absolute top-3 right-3 ${statusClass}`}>
          {statusText}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{event.name}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="flex-shrink-0 text-muted-foreground" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="flex-shrink-0 text-muted-foreground" />
          <span>${event.price.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Users size={14} className="flex-shrink-0 text-muted-foreground" />
          <span>{event.spotsAvailable} spots available</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Link href={`/combine-tour/${event.id}`}>
          <Button className="w-full" size="sm" disabled={event.status === 'sold_out' || event.status === 'past'}>
            {event.status === 'sold_out' ? 'Sold Out' : 
             event.status === 'past' ? 'View Results' : 'Register Now'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function EventsCarouselSkeleton({ count = 4, title, description }: { count?: number, title?: string, description?: string }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <Carousel className="w-full">
        <CarouselContent>
          {Array(count).fill(0).map((_, index) => (
            <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Card className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-full" />
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
      
      <div className="flex justify-center mt-6">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}