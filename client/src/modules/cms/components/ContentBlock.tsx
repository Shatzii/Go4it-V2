import React from 'react';
import { useContent } from '../hooks/useContent';
import { formatContent } from '../utils/contentFormatter';
import { ContentBlock as ContentBlockType } from '../types';

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
  // If a block is directly provided, use it
  // Otherwise, fetch the block by its identifier
  const { data: fetchedBlock, isLoading, error } = useContent(
    identifier,
    { enabled: !block && !!identifier }
  );

  // Determine which block to use
  const contentBlock = block || fetchedBlock;

  if (isLoading) {
    return <div className={`cms-block-loading ${className}`}>Loading content...</div>;
  }

  if (error || !contentBlock) {
    console.error("Error loading content block:", error);
    return (
      <div className={`cms-block-error ${className}`}>
        <p>Could not load content{identifier ? ` for "${identifier}"` : ''}.</p>
      </div>
    );
  }

  // Apply formatting to the content
  const formattedContent = formatContent(contentBlock.content, contentBlock.format);

  return (
    <div 
      className={`cms-block cms-block-${contentBlock.identifier} ${contentBlock.className || ''} ${className}`}
      data-block-id={contentBlock.id}
      data-block-identifier={contentBlock.identifier}
      data-block-section={contentBlock.section}
    >
      {contentBlock.title && (
        <h2 className="cms-block-title">{contentBlock.title}</h2>
      )}
      
      <div 
        className="cms-block-content"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </div>
  );
}