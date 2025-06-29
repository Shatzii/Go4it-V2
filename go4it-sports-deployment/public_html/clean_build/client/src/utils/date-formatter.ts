/**
 * Format a date object to a human-readable string
 * @param date Date object to format
 * @param showTime Whether to include time in the formatted string
 * @returns Formatted date string
 */
export function formatDate(date: Date, showTime: boolean = false): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    if (showTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date string to a relative time (e.g., "2 days ago")
 * @param dateString Date string to format
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (isNaN(diffInSeconds)) {
      return 'Invalid date';
    }
    
    if (diffInSeconds < 60) {
      return diffInSeconds <= 1 ? 'just now' : `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return diffInDays === 1 ? 'yesterday' : `${diffInDays} days ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
}

/**
 * Format a duration in seconds to a readable format (e.g., "1h 30m")
 * @param durationInSeconds Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(durationInSeconds: number): string {
  try {
    if (durationInSeconds < 60) {
      return `${durationInSeconds}s`;
    }
    
    const minutes = Math.floor(durationInSeconds / 60);
    if (minutes < 60) {
      const seconds = durationInSeconds % 60;
      return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  } catch (error) {
    console.error('Error formatting duration:', error);
    return 'Invalid duration';
  }
}