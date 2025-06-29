import { format, parseISO } from 'date-fns';

// Interface for formatted combine events
export interface FormattedCombineEvent {
  id: number;
  name: string;
  location: string;
  city: string;
  state?: string;
  country?: string;
  venueDetails?: string;
  startDate: string;
  endDate: string;
  registrationUrl?: string;
  description?: string;
  sportTypes?: string[];
  ageGroups?: string[];
  status?: string;
  featured?: boolean;
  capacity?: number;
  registeredCount?: number;
  price?: number;
  bannerImage?: string;
  featuredImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  slug?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
  // Formatted fields
  dateFormatted: string;
  timeFormatted: string;
  endDateFormatted: string | null;
  statusClass: string;
  statusText: string;
  spotsAvailable?: number;
  totalSpots?: number;
  registrationDeadline?: string;
  registrationDeadlineFormatted?: string | null;
  isRegistered?: boolean;
}

// Format dates for display
export function formatDateTime(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  try {
    return format(new Date(dateString), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

// Get status text for display
export function getStatusText(status: string | undefined): string {
  if (!status) return 'Upcoming';
  
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'Upcoming';
    case 'ongoing':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    case 'filling_fast':
      return 'Filling Fast';
    case 'sold_out':
      return 'Sold Out';
    case 'past':
      return 'Past Event';
    default:
      return status;
  }
}

// Get CSS class for status badges
export function getStatusClass(status: string | undefined): string {
  if (!status) return 'bg-blue-100 text-blue-800';
  
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'ongoing':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'filling_fast':
      return 'bg-yellow-100 text-yellow-800';
    case 'sold_out':
      return 'bg-purple-100 text-purple-800';
    case 'past':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Calculate spots availability
export function calculateAvailability(event: any) {
  if (event.capacity && typeof event.registeredCount === 'number') {
    return {
      spotsAvailable: Math.max(0, event.capacity - event.registeredCount),
      totalSpots: event.capacity
    };
  }
  return {};
}

// Format a combine event for display
export function formatCombineEvent(event: any): FormattedCombineEvent {
  // Handle the case where event doesn't have required dates
  if (!event || !event.startDate) {
    return {
      id: event?.id || 0,
      name: event?.name || 'Event',
      location: event?.location || 'Unknown Location',
      city: event?.city || '',
      startDate: event?.startDate || new Date().toISOString(),
      endDate: event?.endDate || new Date().toISOString(),
      dateFormatted: 'Unknown Date',
      timeFormatted: 'Unknown Time',
      endDateFormatted: null,
      statusClass: getStatusClass(event?.status),
      statusText: getStatusText(event?.status),
    };
  }

  // Format dates
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;

  // Calculate availability
  const availability = calculateAvailability(event);

  return {
    ...event,
    dateFormatted: format(startDate, 'MMMM d, yyyy'),
    timeFormatted: format(startDate, 'h:mm a'),
    endDateFormatted: endDate ? format(endDate, 'MMMM d, yyyy') : null,
    registrationDeadlineFormatted: registrationDeadline ? format(registrationDeadline, 'MMMM d, yyyy') : null,
    statusClass: getStatusClass(event.status),
    statusText: getStatusText(event.status),
    ...availability
  };
}

// Format a list of combine events
export function formatCombineEvents(events: any[]): FormattedCombineEvent[] {
  if (!events || !Array.isArray(events)) return [];
  return events.map(formatCombineEvent);
}