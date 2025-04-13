import React from 'react';
import { usePage } from '../hooks/usePage';
import { PageData, PageComponent } from '../types';
import { ContentBlock } from './ContentBlock';
import { formatContent } from '../utils/contentFormatter';

interface PageProps {
  slug: string;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * Page Component
 * 
 * Renders a full page from the CMS based on its slug.
 * Displays components of the page in a structured layout.
 */
export function Page({ slug, fallback, className = '' }: PageProps) {
  // Fetch page data by slug
  const { data: page, isLoading, error } = usePage(slug);
  
  // Show loading state
  if (isLoading) {
    return <div className={`cms-page-loading ${className}`}>Loading page...</div>;
  }
  
  // Show error state
  if (error) {
    return (
      <div className={`cms-page-error ${className}`}>
        <p>Error loading page: {(error as Error).message || 'Unknown error'}</p>
      </div>
    );
  }
  
  // Show not found state
  if (!page) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className={`cms-page-not-found ${className}`}>
        <p>Page not found: {slug}</p>
      </div>
    );
  }
  
  // Show inactive page message
  if (!page.active) {
    return (
      <div className={`cms-page-inactive ${className}`}>
        <p>This page is currently inactive.</p>
      </div>
    );
  }
  
  return (
    <div 
      className={`cms-page ${page.className || ''} ${className}`}
      data-id={page.id}
      data-slug={page.slug}
    >
      {/* Page main content */}
      {page.title && <h1 className="cms-page-title">{page.title}</h1>}
      
      {page.content && (
        <div 
          className="cms-page-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}
      
      {/* Page components */}
      {page.components && page.components.length > 0 && (
        <div className="cms-page-components">
          {page.components.map((component, index) => renderComponent(component, page, index))}
        </div>
      )}
    </div>
  );
}

/**
 * Renders a component based on its type
 */
function renderComponent(component: PageComponent, page: PageData, index: number) {
  const key = `component-${index}`;
  
  switch (component.type) {
    case 'content-block':
      // Render a single content block by identifier
      return (
        <div key={key} className={`cms-component-block ${component.className || ''}`}>
          <ContentBlock identifier={component.identifier} />
        </div>
      );
      
    case 'content-section':
      // Render all content blocks from a section
      return (
        <div key={key} className={`cms-component-section ${component.className || ''}`}>
          {component.title && <h2 className="cms-section-title">{component.title}</h2>}
          
          <div className="cms-section-blocks">
            {page.blocks && 
             page.blocks.filter(block => block.section === component.section).map((block, idx) => (
              <ContentBlock key={`block-${idx}`} block={block} />
            ))}
          </div>
        </div>
      );
      
    case 'hero':
      // Render a hero section with optional background image
      return (
        <div 
          key={key}
          className={`cms-component-hero ${component.className || ''}`}
          style={component.backgroundImage ? {
            backgroundImage: `url(${component.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : undefined}
        >
          {component.title && <h2 className="cms-hero-title">{component.title}</h2>}
          {component.subtitle && <p className="cms-hero-subtitle">{component.subtitle}</p>}
          {component.content && (
            <div 
              className="cms-hero-content"
              dangerouslySetInnerHTML={{ __html: formatContent(component.content, 'html') }}
            />
          )}
        </div>
      );
      
    case 'custom':
      // For custom components, just render the raw content
      return (
        <div 
          key={key}
          className={`cms-component-custom ${component.className || ''}`}
        >
          {component.title && <h2 className="cms-custom-title">{component.title}</h2>}
          {component.subtitle && <p className="cms-custom-subtitle">{component.subtitle}</p>}
          {component.content && (
            <div 
              className="cms-custom-content"
              dangerouslySetInnerHTML={{ __html: formatContent(component.content, 'html') }}
            />
          )}
        </div>
      );
      
    default:
      return (
        <div key={key} className="cms-component-unknown">
          <p>Unknown component type: {(component as any).type}</p>
        </div>
      );
  }
}