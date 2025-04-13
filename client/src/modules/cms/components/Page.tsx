/**
 * Page Component
 * 
 * A top-level component that renders a complete page from CMS data.
 * Dynamically arranges sections according to the page layout configuration.
 */

import React from 'react';
import { PageData } from '../types';
import ContentSection from './ContentSection';
import { Helmet } from 'react-helmet';

interface PageProps {
  pageData: PageData;
  className?: string;
}

const Page: React.FC<PageProps> = ({ pageData, className }) => {
  if (!pageData || !pageData.sections) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Page content not found</p>
      </div>
    );
  }
  
  const { title, description, sections, metadata } = pageData;
  
  // Extract SEO metadata if available
  const seoTitle = metadata?.seo?.title || title;
  const seoDescription = metadata?.seo?.description || description;
  const seoKeywords = metadata?.seo?.keywords?.join(', ') || '';
  const ogImage = metadata?.seo?.ogImage || '';
  
  return (
    <div className={className}>
      {/* SEO metadata */}
      <Helmet>
        <title>{seoTitle}</title>
        {seoDescription && <meta name="description" content={seoDescription} />}
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        
        {/* Open Graph tags */}
        <meta property="og:title" content={seoTitle} />
        {seoDescription && <meta property="og:description" content={seoDescription} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Render each section in order */}
      {sections.map((section) => (
        <ContentSection 
          key={section.id} 
          section={section} 
        />
      ))}
    </div>
  );
};

export default Page;