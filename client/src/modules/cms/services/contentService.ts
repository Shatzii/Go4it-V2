/**
 * Content Service
 * 
 * Service for fetching and managing content from the CMS system.
 * Acts as the bridge between the front-end components and the backend content API.
 */

import { ContentBlock, ContentSection, PageData } from '../types';

/**
 * Fetches all content blocks from the CMS
 */
export const getAllContentBlocks = async (): Promise<ContentBlock[]> => {
  const response = await fetch('/api/content-blocks');
  if (!response.ok) {
    throw new Error('Failed to fetch content blocks');
  }
  return response.json();
};

/**
 * Fetches content blocks by section identifier
 * @param section The section identifier to fetch blocks for
 */
export const getContentBlocksBySection = async (section: string): Promise<ContentBlock[]> => {
  const response = await fetch(`/api/content-blocks/section/${section}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch content blocks for section: ${section}`);
  }
  return response.json();
};

/**
 * Fetches a content block by its unique identifier
 * @param identifier The unique identifier of the content block
 */
export const getContentBlockByIdentifier = async (identifier: string): Promise<ContentBlock | null> => {
  try {
    const response = await fetch(`/api/content-blocks/identifier/${identifier}`);
    if (!response.ok) {
      console.error(`Content block with identifier ${identifier} not found`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching content block with identifier ${identifier}:`, error);
    return null;
  }
};

/**
 * Creates a content section by fetching all blocks for the given section
 * @param sectionId The section identifier
 * @param title Optional title for the section
 * @param description Optional description for the section
 */
export const createContentSection = async (
  sectionId: string, 
  title?: string, 
  description?: string
): Promise<ContentSection> => {
  const blocks = await getContentBlocksBySection(sectionId);
  
  return {
    id: sectionId,
    name: title || sectionId,
    description,
    blocks: blocks.sort((a, b) => {
      // Sort by order if available, otherwise by id
      if (a.order !== null && b.order !== null) {
        return a.order - b.order;
      }
      return a.id - b.id;
    })
  };
};

/**
 * Fetches page data by slug, including all sections and content blocks
 * @param slug The page slug to fetch
 */
export const getPageData = async (slug: string): Promise<PageData | null> => {
  // In a future implementation, this would fetch from a proper page API
  // For now, we'll build a simple page based on predefined sections
  
  try {
    // This is a simplified implementation
    // In a real CMS, we would fetch the page structure from an API
    
    // Mock page layout based on slug
    let sections: string[] = [];
    let title = '';
    
    switch (slug) {
      case 'home':
        title = 'Go4It Sports - Home';
        sections = ['hero', 'what-makes-us-different', 'featured-athletes', 'testimonials'];
        break;
      case 'about':
        title = 'About Go4It Sports';
        sections = ['about-hero', 'our-mission', 'team', 'partners'];
        break;
      case 'features':
        title = 'Go4It Sports Features';
        sections = ['features-hero', 'skill-assessment', 'video-analysis', 'progress-tracking'];
        break;
      default:
        // If no predefined page exists, return null
        return null;
    }
    
    // Fetch content for each section
    const contentSections = await Promise.all(
      sections.map(sectionId => createContentSection(sectionId))
    );
    
    return {
      slug,
      title,
      layout: {
        id: `${slug}-layout`,
        name: `${title} Layout`,
        sections,
        template: 'default',
        isDefault: true
      },
      sections: contentSections
    };
  } catch (error) {
    console.error(`Error fetching page data for slug ${slug}:`, error);
    return null;
  }
};