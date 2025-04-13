import React from 'react';
import { useContent } from '../hooks/useContent';
import { ContentBlock as ContentBlockType } from '../types';
import { formatContent } from '../utils/contentFormatter';

interface ContentBlockProps {
  identifier?: string;
  block?: ContentBlockType;
  className?: string;
}

/**
 * ContentBlock Component
 * 
 * Renders a single content block from the CMS.
 * Can fetch content by identifier or use a provided content block directly.
 */
export function ContentBlock({ identifier, block, className = '' }: ContentBlockProps) {
  const { data, isLoading, error } = useContent(undefined, identifier);
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse bg-muted h-6 w-1/2 rounded-md"></div>
        <div className="animate-pulse bg-muted h-20 rounded-md"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 border border-destructive text-destructive rounded-md">
        <p>Error loading content: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
  
  // Use provided block or fetched data
  const contentBlock = block || data;
  
  if (!contentBlock) {
    if (identifier) {
      return (
        <div className="p-4 border border-amber-200 bg-amber-50 text-amber-800 rounded-md">
          <p>Content block not found: {identifier}</p>
        </div>
      );
    }
    return null;
  }
  
  // When using with an array (possible in some cases)
  const displayBlock = Array.isArray(contentBlock) ? contentBlock[0] : contentBlock;
  
  return (
    <div className={`cms-content-block ${className}`}>
      {displayBlock.title && (
        <h3 className="text-xl font-semibold mb-2">{displayBlock.title}</h3>
      )}
      
      <div 
        className="cms-content prose prose-headings:mt-4 prose-headings:mb-2"
        dangerouslySetInnerHTML={{ 
          __html: formatContent(displayBlock.content, displayBlock.format) 
        }}
      />
    </div>
  );
}