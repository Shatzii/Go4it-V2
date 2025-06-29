/**
 * Generates a URL-friendly slug from a string
 * @param text The text to convert into a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 * @param text The text to truncate
 * @param length The maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + '...';
}

/**
 * Formats a date to a human-readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Extracts the dominant color from an image URL
 * Placeholder for future implementation
 * @param imageUrl URL of the image
 * @returns Hexadecimal color code
 */
export function extractDominantColor(imageUrl: string): string {
  // This would be implemented with a color extraction library
  // For now, return a default color
  return '#3B82F6';
}

/**
 * Generates a random string of specified length
 * @param length Length of the random string
 * @returns Random string
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}