// Utility functions for combine tour events
import { formatDistanceToNow, isPast } from 'date-fns';

// Define the event data structure
export type CombineEvent = {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
  date: string;
  endDate: string;
  registrationDeadline: string;
  maximumAttendees: number;
  currentAttendees: number;
  price: string | number;
  status: string;
  slug: string;
  featuredImage?: string;
  description?: string;
};

export type FormattedCombineEvent = {
  id: number;
  name: string;
  location: string;
  date: string;
  registrationDeadline: string;
  spotsAvailable: number;
  totalSpots: number;
  price: number;
  testingTypes: string[];
  description: string;
  status: 'upcoming' | 'filling_fast' | 'sold_out' | 'past';
  isRegistered: boolean;
  featuredImage?: string;
};

// Define statuses
export type EventStatus = 'upcoming' | 'filling_fast' | 'sold_out' | 'past';

/**
 * Determine the display status of a combine event
 */
export function getEventStatus(event: CombineEvent): EventStatus {
  const now = new Date();
  const eventDate = new Date(event.date);
  const endDate = new Date(event.endDate || event.date);
  
  // If end date is in the past, it's a past event
  if (isPast(endDate)) {
    return 'past';
  }
  
  // Calculate spots available
  const spotsAvailable = event.maximumAttendees - (event.currentAttendees || 0);
  
  // If no spots, it's sold out
  if (spotsAvailable <= 0) {
    return 'sold_out';
  }
  
  // If less than 20% spots available, it's filling fast
  const fillPercentage = (event.currentAttendees || 0) / event.maximumAttendees;
  if (fillPercentage > 0.8) {
    return 'filling_fast';
  }
  
  // Otherwise, it's upcoming
  return 'upcoming';
}

/**
 * Format a combine event for display
 */
export function formatCombineEvent(event: CombineEvent): FormattedCombineEvent {
  // Calculate spots available
  const spotsAvailable = event.maximumAttendees - (event.currentAttendees || 0);
  
  return {
    id: event.id,
    name: event.name,
    location: `${event.location}, ${event.city}, ${event.state}`,
    date: event.date,
    registrationDeadline: event.registrationDeadline,
    spotsAvailable: spotsAvailable > 0 ? spotsAvailable : 0,
    totalSpots: event.maximumAttendees || 0,
    price: typeof event.price === 'string' ? parseFloat(event.price) : event.price,
    testingTypes: ["physical", "cognitive", "psychological"], // Default testing types
    description: event.description || "",
    status: getEventStatus(event),
    isRegistered: false, // This would be determined by user registration data
    featuredImage: event.featuredImage
  };
}

/**
 * Format a time distance in a human readable way
 */
export function formatTimeDistance(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Get human-readable status text
 */
export function getStatusText(status: EventStatus): string {
  switch (status) {
    case 'upcoming':
      return 'Registration Open';
    case 'filling_fast':
      return 'Filling Fast';
    case 'sold_out':
      return 'Sold Out';
    case 'past':
      return 'Past Event';
    default:
      return 'Unknown Status';
  }
}

/**
 * Get CSS class for status
 */
export function getStatusClass(status: EventStatus): string {
  switch (status) {
    case 'upcoming':
      return 'bg-green-600 text-white';
    case 'filling_fast':
      return 'bg-yellow-500 text-white';
    case 'sold_out':
      return 'bg-red-600 text-white';
    case 'past':
      return 'bg-gray-600 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}

/**
 * Format a date string for display
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}