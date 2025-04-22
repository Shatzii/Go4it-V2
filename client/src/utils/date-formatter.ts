/**
 * Format a date object as MM/DD/YYYY
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  if (!date) return 'N/A';
  
  try {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format a date object as MM/DD/YYYY HH:MM AM/PM
 * @param date The date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date): string => {
  if (!date) return 'N/A';
  
  try {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return 'Invalid Date';
  }
};

/**
 * Format a date as a relative time string (e.g., "2 days ago")
 * @param date The date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date): string => {
  if (!date) return 'N/A';
  
  try {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSecs < 60) {
      return 'just now';
    } else if (diffInMins < 60) {
      return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return formatDate(date);
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
};