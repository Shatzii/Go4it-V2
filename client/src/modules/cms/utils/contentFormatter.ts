import { ContentBlock } from '../types';

/**
 * Content formatting utilities for the CMS system
 */

/**
 * Formats content based on the specified format
 * @param content The content string to format
 * @param format The format type of the content
 * @returns Formatted content ready for rendering
 */
export function formatContent(content: string, format: ContentBlock['format'] = 'html'): string {
  switch (format) {
    case 'markdown':
      return markdownToHtml(content);
    case 'json':
      try {
        const parsed = JSON.parse(content);
        return `<pre class="cms-json">${JSON.stringify(parsed, null, 2)}</pre>`;
      } catch (e) {
        console.error('Error parsing JSON content:', e);
        return `<div class="cms-error">Invalid JSON format</div>`;
      }
    case 'text':
      return content.replace(/\n/g, '<br>');
    case 'html':
    default:
      return content;
  }
}

/**
 * Very simple Markdown to HTML converter
 * Note: For a real application, you'd use a proper markdown library
 */
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^\s*\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');
  
  // Line breaks
  html = html.replace(/\n/gim, '<br>');

  return html;
}

/**
 * Sorts content blocks by their sort order
 * @param blocks Array of content blocks to sort
 * @returns Sorted array of content blocks
 */
export function sortContentBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return [...blocks].sort((a, b) => {
    // If there's an explicit sortOrder, use it
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }
    
    // Otherwise sort by creation date if available
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    
    // Fallback to sorting by ID
    return a.id - b.id;
  });
}

/**
 * Groups content blocks by section
 * @param blocks Array of content blocks to group
 * @returns Object with section names as keys and arrays of blocks as values
 */
export function groupBlocksBySection(blocks: ContentBlock[]): Record<string, ContentBlock[]> {
  return blocks.reduce((acc, block) => {
    const section = block.section || 'default';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(block);
    return acc;
  }, {} as Record<string, ContentBlock[]>);
}

/**
 * Finds a content block by its identifier
 * @param blocks Array of content blocks to search
 * @param identifier The identifier to look for
 * @returns The matching content block or undefined if not found
 */
export function findBlockByIdentifier(blocks: ContentBlock[], identifier: string): ContentBlock | undefined {
  return blocks.find(block => block.identifier === identifier);
}