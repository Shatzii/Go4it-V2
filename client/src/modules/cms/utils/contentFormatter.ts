/**
 * Content Formatter Utility
 * 
 * Converts content from various formats (markdown, json, html) to HTML for rendering
 */

import { marked } from 'marked'; // You may need to install this package

/**
 * Format content based on the specified format
 * 
 * @param content The content to format
 * @param format The format of the content: 'markdown', 'json', or 'html'
 * @returns Formatted HTML content
 */
export function formatContent(content: string, format: 'markdown' | 'json' | 'html' = 'html'): string {
  try {
    switch (format) {
      case 'markdown':
        return formatMarkdown(content);
      case 'json':
        return formatJson(content);
      case 'html':
      default:
        return content; // HTML is already in the right format
    }
  } catch (error) {
    console.error('Error formatting content:', error);
    return `<div class="cms-format-error">Error formatting content: ${(error as Error).message || 'Unknown error'}</div>`;
  }
}

/**
 * Convert markdown content to HTML
 * 
 * @param content Markdown content
 * @returns HTML content
 */
function formatMarkdown(content: string): string {
  try {
    // Use marked library to convert markdown to HTML
    return marked(content);
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    throw new Error('Failed to convert markdown content');
  }
}

/**
 * Parse and format JSON content
 * 
 * @param content JSON content as a string
 * @returns HTML content based on the JSON structure
 */
function formatJson(content: string): string {
  try {
    // Parse JSON string to object
    const jsonData = JSON.parse(content);
    
    // Format JSON data based on its structure
    // This is a simple implementation; you can extend it based on your specific JSON structure
    if (Array.isArray(jsonData)) {
      // Handle array of items
      return formatJsonArray(jsonData);
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      // Handle single object
      return formatJsonObject(jsonData);
    } else {
      // Handle primitive value
      return `<div class="cms-json-value">${String(jsonData)}</div>`;
    }
  } catch (error) {
    console.error('Error parsing JSON content:', error);
    throw new Error('Failed to parse JSON content');
  }
}

/**
 * Format an array of JSON items to HTML
 * 
 * @param array Array of items
 * @returns HTML content for the array
 */
function formatJsonArray(array: any[]): string {
  if (array.length === 0) {
    return '<div class="cms-json-empty-array">No items</div>';
  }
  
  // Format each item in the array and join them
  const items = array.map((item, index) => {
    if (typeof item === 'object' && item !== null) {
      // Format object item
      return `
        <div class="cms-json-array-item" data-index="${index}">
          ${formatJsonObject(item)}
        </div>
      `;
    } else {
      // Format primitive item
      return `
        <div class="cms-json-array-item" data-index="${index}">
          <div class="cms-json-value">${String(item)}</div>
        </div>
      `;
    }
  }).join('');
  
  return `<div class="cms-json-array">${items}</div>`;
}

/**
 * Format a JSON object to HTML
 * 
 * @param obj Object to format
 * @returns HTML content for the object
 */
function formatJsonObject(obj: Record<string, any>): string {
  const keys = Object.keys(obj);
  
  if (keys.length === 0) {
    return '<div class="cms-json-empty-object">Empty object</div>';
  }
  
  // Check if this object represents a rich text content
  if (keys.includes('type') && keys.includes('content')) {
    if (obj.type === 'richText' && typeof obj.content === 'string') {
      return obj.content; // Return the rich text content directly
    }
  }
  
  // Format each property in the object
  const properties = keys.map(key => {
    const value = obj[key];
    
    // Format based on the value type
    let formattedValue: string;
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        formattedValue = formatJsonArray(value);
      } else {
        formattedValue = formatJsonObject(value);
      }
    } else {
      formattedValue = `<div class="cms-json-value">${String(value)}</div>`;
    }
    
    return `
      <div class="cms-json-property">
        <div class="cms-json-key">${key}:</div>
        <div class="cms-json-property-value">${formattedValue}</div>
      </div>
    `;
  }).join('');
  
  return `<div class="cms-json-object">${properties}</div>`;
}