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
import { MapPin, Calendar, DollarSign, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface EventsGridProps {
  filter?: 'upcoming' | 'past' | 'all';
  limit?: number;
}

export default function EventsGrid({ filter = 'all', limit = 100 }: EventsGridProps) {
  // Fetch combine events from the API
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['/api/combine-tour/events'],
    // We don't need to specify queryFn as the default fetcher is set up 
  });

  if (isLoading) {
    return <EventsGridSkeleton count={4} />;
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
  }

  // Apply limit
  formattedEvents = formattedEvents.slice(0, limit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {formattedEvents.length > 0 ? (
        formattedEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))
      ) : (
        <div className="col-span-full text-center p-8">
          <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
          <p>There are currently no {filter} events scheduled.</p>
        </div>
      )}
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
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative">
        <img 
          src={event.featuredImage || '/images/combines/default-combine.jpg'} 
          alt={event.name}
          className="w-full h-48 object-cover"
        />
        <Badge className={`absolute top-3 right-3 ${statusClass}`}>
          {statusText}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-2">{event.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin size={16} className="flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 space-y-3 flex-grow">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="flex-shrink-0 text-muted-foreground" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="flex-shrink-0 text-muted-foreground" />
          <span>${event.price.toFixed(2)}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {event.testingTypes.map(type => (
            <Badge key={type} variant="outline" className="flex items-center gap-1">
              <Tag size={14} />
              <span className="capitalize">{type}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Link href={`/combine-tour/${event.id}`}>
          <Button className="w-full" disabled={event.status === 'sold_out' || event.status === 'past'}>
            {event.status === 'sold_out' ? 'Sold Out' : 
             event.status === 'past' ? 'View Results' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function EventsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}