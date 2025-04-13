import React from 'react';
import { useContent } from '../hooks/useContent';
import { formatContent } from '../utils/contentFormatter';
import { cn } from '@/lib/utils';

interface ContentBlockProps {
  identifier: string;
  className?: string;
  fallback?: React.ReactNode;
  isLoading?: React.ReactNode;
}

/**
 * ContentBlock Component
 * 
 * This component fetches and displays a single content block from the CMS.
 * Content can be formatted in HTML, Markdown, or JSON.
 * 
 * @param identifier - Unique identifier for the content block
 * @param className - Optional CSS class name to apply to the wrapper
 * @param fallback - Content to display if the block is not found
 * @param isLoading - Content to display while the block is loading
 */
export function ContentBlock({ 
  identifier,
  className = '',
  fallback = null,
  isLoading = <div className="cms-content-block-loading">Loading content...</div>
}: ContentBlockProps) {
  const { data: block, isLoading: loading, error } = useContent(identifier);

  if (loading) {
    return <>{isLoading}</>;
  }

  if (error || !block) {
    console.error(`Error loading content block ${identifier}:`, error);
    return <>{fallback}</>;
  }

  // Format content based on the format (html, markdown, json)
  const formattedContent = formatContent(block.content, block.format);

  return (
    <div 
      className={cn('cms-content-block', className)}
      data-identifier={identifier}
      data-format={block.format}
    >
      {block.title && (
        <h2 className="cms-content-block-title">{block.title}</h2>
      )}
      <div 
        className="cms-content-block-content"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </div>
  );
}

/**
 * InlineContent Component
 * 
 * Similar to ContentBlock but renders content inline without any wrapper div.
 * Useful for embedding content blocks within other components or text.
 * 
 * @param identifier - Unique identifier for the content block
 * @param fallback - Content to display if the block is not found
 */
export function InlineContent({ 
  identifier, 
  fallback = null 
}: { 
  identifier: string; 
  fallback?: React.ReactNode; 
}) {
  const { data: block, isLoading, error } = useContent(identifier);

  if (isLoading || error || !block) {
    return <>{fallback}</>;
  }

  // Format content and return only the HTML without wrapper
  const formattedContent = formatContent(block.content, block.format);
  
  return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
}