import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CombineTourEvent } from '@shared/schema';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, ChevronDownIcon, EditIcon, MapPinIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isValid, parseISO, addDays } from 'date-fns';

// Type for editing or creating a combine event
type EditingEvent = Partial<CombineTourEvent> & {
  startDate?: Date | string;
  endDate?: Date | string;
  registrationDeadline?: Date | string;
  price?: string | number;
};

const CombineEventManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EditingEvent | null>(null);
  const [activeStatus, setActiveStatus] = useState<'all' | 'upcoming' | 'past' | 'filling_fast' | 'sold_out'>('all');
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [deadlineDateOpen, setDeadlineDateOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all combine events
  const { data: events = [], isLoading: eventsLoading } = useQuery<CombineTourEvent[]>({
    queryKey: ['/api/combine-tour/events'],
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (newEvent: any) => {
      return await apiRequest('/api/combine-tour/events', 'POST', newEvent);
    },
    onSuccess: () => {
      toast({
        title: 'Combine Event Created',
        description: 'The event has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/combine-tour/events'] });
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create the event. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async (event: any) => {
      const { id, ...eventData } = event;
      return await apiRequest(`/api/combine-tour/events/${id}`, 'PUT', eventData);
    },
    onSuccess: () => {
      toast({
        title: 'Combine Event Updated',
        description: 'The event has been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/combine-tour/events'] });
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the event. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/combine-tour/events/${id}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: 'Combine Event Deleted',
        description: 'The event has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/combine-tour/events'] });
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the event. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Filter events by status
  const filteredEvents = events.filter(event => {
    if (activeStatus === 'all') return true;
    
    const eventDate = new Date(event.startDate);
    const currentDate = new Date();
    
    // Check if the event is in the past
    if (activeStatus === 'past' && eventDate < currentDate) {
      return true;
    }
    
    // Check if the event is upcoming
    if (eventDate > currentDate) {
      // For upcoming events, also check if it's filling fast or sold out
      if (event.maximumAttendees && event.currentAttendees) {
        const fillRatio = event.currentAttendees / event.maximumAttendees;
        
        if (activeStatus === 'filling_fast' && fillRatio >= 0.8 && fillRatio < 1) {
          return true;
        }
        
        if (activeStatus === 'sold_out' && fillRatio >= 1) {
          return true;
        }
      }
      
      if (activeStatus === 'upcoming') {
        return true;
      }
    }
    
    return false;
  });

  // Create a new event
  const handleCreateEvent = () => {
    if (!currentEvent) return;
    
    // Format dates for API
    const eventToCreate = {
      ...currentEvent,
      startDate: formatDateForAPI(currentEvent.startDate),
      endDate: formatDateForAPI(currentEvent.endDate),
      registrationDeadline: formatDateForAPI(currentEvent.registrationDeadline),
      price: typeof currentEvent.price === 'string' ? parseFloat(currentEvent.price) : currentEvent.price,
    };
    
    createEventMutation.mutate(eventToCreate);
  };

  // Update an existing event
  const handleUpdateEvent = () => {
    if (!currentEvent || !currentEvent.id) return;
    
    // Format dates for API
    const eventToUpdate = {
      ...currentEvent,
      startDate: formatDateForAPI(currentEvent.startDate),
      endDate: formatDateForAPI(currentEvent.endDate),
      registrationDeadline: formatDateForAPI(currentEvent.registrationDeadline),
      price: typeof currentEvent.price === 'string' ? parseFloat(currentEvent.price) : currentEvent.price,
    };
    
    updateEventMutation.mutate(eventToUpdate);
  };

  // Confirm delete an event
  const confirmDeleteEvent = (event: CombineTourEvent) => {
    if (window.confirm(`Are you sure you want to delete ${event.name}?`)) {
      deleteEventMutation.mutate(event.id);
    }
  };

  // Edit an existing event
  const editEvent = (event: CombineTourEvent) => {
    // Parse the dates from strings to Date objects for the DatePicker
    const parsedEvent = {
      ...event,
      startDate: parseISO(event.startDate as unknown as string),
      endDate: parseISO(event.endDate as unknown as string),
      registrationDeadline: event.registrationDeadline ? parseISO(event.registrationDeadline as unknown as string) : undefined,
    };
    
    setCurrentEvent(parsedEvent);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Format date for API
  const formatDateForAPI = (date: Date | string | undefined): string | undefined => {
    if (!date) return undefined;
    if (typeof date === 'string') return date;
    return date.toISOString();
  };

  // Reset the form
  const resetForm = () => {
    setCurrentEvent(null);
    setIsCreating(false);
    setIsEditing(false);
    setStartDateOpen(false);
    setEndDateOpen(false);
    setDeadlineDateOpen(false);
  };

  // Initialize new event
  const initNewEvent = () => {
    // Set default values for a new event
    const today = new Date();
    const nextWeek = addDays(today, 7);
    const twoWeeksLater = addDays(today, 14);
    
    setCurrentEvent({
      name: '',
      description: '',
      location: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      startDate: nextWeek,
      endDate: twoWeeksLater,
      registrationDeadline: today,
      maximumAttendees: 100,
      currentAttendees: 0,
      price: '149.99',
      slug: '',
      status: 'published',
      featuredImage: '',
    });
    
    setIsCreating(true);
    setIsEditing(false);
  };

  const getEventStatusBadge = (event: CombineTourEvent) => {
    const eventDate = new Date(event.startDate);
    const currentDate = new Date();
    
    if (eventDate < currentDate) {
      return <Badge variant="outline" className="bg-gray-600 text-white">Past Event</Badge>;
    }
    
    if (event.maximumAttendees && event.currentAttendees) {
      const fillRatio = event.currentAttendees / event.maximumAttendees;
      
      if (fillRatio >= 1) {
        return <Badge variant="outline" className="bg-red-600 text-white">Sold Out</Badge>;
      }
      
      if (fillRatio >= 0.8) {
        return <Badge variant="outline" className="bg-yellow-500 text-white">Filling Fast</Badge>;
      }
    }
    
    return <Badge variant="outline" className="bg-green-600 text-white">Registration Open</Badge>;
  };

  // Format a date to display
  const formatDisplayDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const generateSlug = (name: string) => {
    if (!name) return '';
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '') + '-' + new Date().getFullYear();
  }
  
  const updateFormField = (field: string, value: any) => {
    if (!currentEvent) return;
    
    // Special case for name field: auto-generate slug if name changes and slug is empty
    if (field === 'name' && (!currentEvent.slug || currentEvent.slug === '')) {
      setCurrentEvent({
        ...currentEvent,
        [field]: value,
        slug: generateSlug(value)
      });
    } else {
      setCurrentEvent({
        ...currentEvent,
        [field]: value
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Combine Tour Events</h2>
        <Button onClick={initNewEvent} className="flex items-center">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Event
        </Button>
      </div>

      <Tabs value={activeStatus} onValueChange={(value) => setActiveStatus(value as 'all' | 'upcoming' | 'past' | 'filling_fast' | 'sold_out')} className="mb-6">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="filling_fast">Filling Fast</TabsTrigger>
          <TabsTrigger value="sold_out">Sold Out</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
      </Tabs>

      {eventsLoading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading events...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No events found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                        {event.city}, {event.state}
                      </div>
                    </TableCell>
                    <TableCell>{formatDisplayDate(event.startDate)}</TableCell>
                    <TableCell>{getEventStatusBadge(event)}</TableCell>
                    <TableCell>${parseFloat(event.price as string).toFixed(2)}</TableCell>
                    <TableCell>
                      {event.currentAttendees || 0}/{event.maximumAttendees || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => editEvent(event)}>
                            <EditIcon className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => confirmDeleteEvent(event)} className="text-red-600">
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog for creating/editing events */}
      <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Create New Combine Event' : 'Edit Combine Event'}</DialogTitle>
            <DialogDescription>
              {isCreating 
                ? 'Add a new combine event to the tour schedule.' 
                : 'Update the details of this combine event.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  placeholder="Chicago Elite Combine"
                  value={currentEvent?.name || ''}
                  onChange={(e) => updateFormField('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL Path)</Label>
                <Input
                  id="slug"
                  placeholder="chicago-elite-combine-2025"
                  value={currentEvent?.slug || ''}
                  onChange={(e) => updateFormField('slug', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  A unique identifier for the URL, automatically generated from the name.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Join us for a comprehensive evaluation..."
                  className="min-h-[100px]"
                  value={currentEvent?.description || ''}
                  onChange={(e) => updateFormField('description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  placeholder="https://example.com/image.jpg"
                  value={currentEvent?.featuredImage || ''}
                  onChange={(e) => updateFormField('featuredImage', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Venue</Label>
                <Input
                  id="location"
                  placeholder="United Center Training Facility"
                  value={currentEvent?.location || ''}
                  onChange={(e) => updateFormField('location', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="1901 W Madison St"
                  value={currentEvent?.address || ''}
                  onChange={(e) => updateFormField('address', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Chicago"
                    value={currentEvent?.city || ''}
                    onChange={(e) => updateFormField('city', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="IL"
                    value={currentEvent?.state || ''}
                    onChange={(e) => updateFormField('state', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  placeholder="60612"
                  value={currentEvent?.zipCode || ''}
                  onChange={(e) => updateFormField('zipCode', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maximumAttendees">Maximum Attendees</Label>
                  <Input
                    id="maximumAttendees"
                    type="number"
                    placeholder="100"
                    value={currentEvent?.maximumAttendees || ''}
                    onChange={(e) => updateFormField('maximumAttendees', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentAttendees">Current Attendees</Label>
                  <Input
                    id="currentAttendees"
                    type="number"
                    placeholder="0"
                    value={currentEvent?.currentAttendees || ''}
                    onChange={(e) => updateFormField('currentAttendees', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  placeholder="149.99"
                  value={currentEvent?.price || ''}
                  onChange={(e) => updateFormField('price', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !currentEvent?.startDate && "text-muted-foreground"
                    )}
                  >
                    {currentEvent?.startDate ? (
                      formatDisplayDate(currentEvent.startDate)
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentEvent?.startDate instanceof Date ? currentEvent.startDate : undefined}
                    onSelect={(date) => {
                      updateFormField('startDate', date);
                      setStartDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !currentEvent?.endDate && "text-muted-foreground"
                    )}
                  >
                    {currentEvent?.endDate ? (
                      formatDisplayDate(currentEvent.endDate)
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentEvent?.endDate instanceof Date ? currentEvent.endDate : undefined}
                    onSelect={(date) => {
                      updateFormField('endDate', date);
                      setEndDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Registration Deadline</Label>
              <Popover open={deadlineDateOpen} onOpenChange={setDeadlineDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !currentEvent?.registrationDeadline && "text-muted-foreground"
                    )}
                  >
                    {currentEvent?.registrationDeadline ? (
                      formatDisplayDate(currentEvent.registrationDeadline)
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentEvent?.registrationDeadline instanceof Date ? currentEvent.registrationDeadline : undefined}
                    onSelect={(date) => {
                      updateFormField('registrationDeadline', date);
                      setDeadlineDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={currentEvent?.status || 'draft'} 
              onValueChange={(value) => updateFormField('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button 
              onClick={isCreating ? handleCreateEvent : handleUpdateEvent}
              disabled={!currentEvent?.name || !currentEvent?.startDate || !currentEvent?.city}
            >
              {isCreating ? 'Create Event' : 'Update Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CombineEventManager;