import React from 'react';
import { usePage } from '../hooks/usePage';
import { ContentBlock } from './ContentBlock';
import { PageData } from '../types';

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
  const { data: page, isLoading, error } = usePage(slug);
  
  if (isLoading) {
    return <div className={`cms-page-loading ${className}`}>Loading page...</div>;
  }
  
  if (error || !page) {
    console.error(`Error loading page (${slug}):`, error);
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className={`cms-page-error ${className}`}>
        <h2>Page Not Found</h2>
        <p>The requested page could not be loaded.</p>
      </div>
    );
  }
  
  return (
    <div 
      className={`cms-page cms-page-${slug} ${page.className || ''} ${className}`}
      data-page-slug={slug}
    >
      {page.title && (
        <h1 className="cms-page-title">{page.title}</h1>
      )}
      
      {page.description && (
        <div className="cms-page-description">{page.description}</div>
      )}
      
      <div className="cms-page-content">
        {page.components && page.components.length > 0 ? (
          <div className="cms-page-components">
            {page.components.map((component, index) => (
              <div key={index} className="cms-page-component">
                {renderComponent(component, page)}
              </div>
            ))}
          </div>
        ) : (
          <div className="cms-page-blocks">
            {/* If there are no components, render the content directly */}
            {page.content && (
              <div 
                className="cms-page-content-html"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders a component based on its type
 */
function renderComponent(component: PageData['components'][0], page: PageData) {
  switch (component.type) {
    case 'content-block':
      return <ContentBlock identifier={component.identifier} />;
      
    case 'content-section':
      return (
        <div className={`cms-section cms-section-${component.section} ${component.className || ''}`}>
          <h2 className="cms-section-title">{component.title}</h2>
          <div className="cms-section-blocks">
            {page.blocks
              ?.filter(block => block.section === component.section)
              .map((block, idx) => (
                <ContentBlock key={idx} block={block} />
              ))}
          </div>
        </div>
      );
      
    case 'hero':
      return (
        <div className={`cms-hero ${component.className || ''}`} style={{ 
          backgroundImage: component.backgroundImage ? `url(${component.backgroundImage})` : undefined 
        }}>
          {component.title && <h1 className="cms-hero-title">{component.title}</h1>}
          {component.subtitle && <h2 className="cms-hero-subtitle">{component.subtitle}</h2>}
          {component.content && (
            <div 
              className="cms-hero-content"
              dangerouslySetInnerHTML={{ __html: component.content }}
            />
          )}
        </div>
      );
      
    case 'custom':
      // Custom components will be handled by a ComponentRegistry
      // This would be expanded in a more complete implementation
      return (
        <div className="cms-custom-component">
          <p>Custom component: {component.name}</p>
        </div>
      );
      
    default:
      return (
        <div className="cms-unknown-component">
          <p>Unknown component type: {(component as any).type}</p>
        </div>
      );
  }
}