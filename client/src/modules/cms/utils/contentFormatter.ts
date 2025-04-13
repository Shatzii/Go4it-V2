/**
 * Content formatting utilities for the CMS system
 */
import { ContentBlock } from '../types';

/**
 * Formats content based on the specified format
 * @param content The content string to format
 * @param format The format type of the content
 * @returns Formatted content ready for rendering
 */
export function formatContent(content: string, format: ContentBlock['format'] = 'html'): string {
  switch (format) {
    case 'markdown':
      // Simple markdown conversion (this is a basic implementation)
      // For a full implementation, use a dedicated markdown library
      return content
        .replace(/#{1}\s+(.+)/g, '<h1>$1</h1>')
        .replace(/#{2}\s+(.+)/g, '<h2>$1</h2>')
        .replace(/#{3}\s+(.+)/g, '<h3>$1</h3>')
        .replace(/#{4}\s+(.+)/g, '<h4>$1</h4>')
        .replace(/#{5}\s+(.+)/g, '<h5>$1</h5>')
        .replace(/#{6}\s+(.+)/g, '<h6>$1</h6>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1">')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^(.+?)$/gm, (m, p1) => p1.startsWith('<') ? p1 : `<p>${p1}</p>`);
    
    case 'json':
      try {
        const parsed = JSON.parse(content);
        // Return stringified JSON with formatting for display purposes
        return `<pre>${JSON.stringify(parsed, null, 2)}</pre>`;
      } catch (e) {
        console.error('Error parsing JSON content:', e);
        return `<div class="error">Invalid JSON content</div>`;
      }
      
    case 'text':
      // For plain text, convert newlines to <br> and wrap in paragraph tags
      return `<p>${content.replace(/\n/g, '<br>')}</p>`;
      
    case 'html':
    default:
      // HTML content is returned as-is
      return content;
  }
}

/**
 * Sorts content blocks by their sort order
 * @param blocks Array of content blocks to sort
 * @returns Sorted array of content blocks
 */
export function sortContentBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return [...blocks].sort((a, b) => {
    const orderA = a.sortOrder || 0;
    const orderB = b.sortOrder || 0;
    return orderA - orderB;
  });
}

/**
 * Groups content blocks by section
 * @param blocks Array of content blocks to group
 * @returns Object with section names as keys and arrays of blocks as values
 */
export function groupBlocksBySection(blocks: ContentBlock[]): Record<string, ContentBlock[]> {
  return blocks.reduce((acc, block) => {
    const section = block.section;
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