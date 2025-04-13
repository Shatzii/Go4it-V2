/**
 * useContent Hook
 * 
 * Custom hook for easily accessing content from the CMS system.
 * Provides querying capabilities and caching for improved performance.
 */

import { useQuery } from '@tanstack/react-query';
import { ContentBlock, ContentSection } from '../types';
import { getAllContentBlocks, getContentBlocksBySection, getContentBlockByIdentifier, createContentSection } from '../services/contentService';

export function useContentBlocks() {
  return useQuery({
    queryKey: ['/api/content-blocks'],
    queryFn: () => getAllContentBlocks()
  });
}

export function useContentBlocksBySection(section: string) {
  return useQuery({
    queryKey: ['/api/content-blocks/section', section],
    queryFn: () => getContentBlocksBySection(section),
    enabled: !!section
  });
}

export function useContentBlockByIdentifier(identifier: string) {
  return useQuery({
    queryKey: ['/api/content-blocks/identifier', identifier],
    queryFn: () => getContentBlockByIdentifier(identifier),
    enabled: !!identifier
  });
}

export function useContentSection(sectionId: string, title?: string, description?: string) {
  return useQuery({
    queryKey: ['/api/content-section', sectionId],
    queryFn: () => createContentSection(sectionId, title, description),
    enabled: !!sectionId
  });
}

/**
 * Helper function to extract a single block from section data
 * @param section The content section 
 * @param identifier The block identifier to find
 * @returns The content block or undefined if not found
 */
export function getBlockFromSection(section: ContentSection | undefined, identifier: string): ContentBlock | undefined {
  if (!section || !section.blocks) return undefined;
  return section.blocks.find(block => block.identifier === identifier);
}

/**
 * Helper function to format content with optional HTML
 * @param content The content string which may contain HTML
 * @param allowHtml Whether to allow HTML in the content
 * @returns The formatted content
 */
export function formatContent(content: string | undefined, allowHtml: boolean = true): string {
  if (!content) return '';
  
  // If HTML is not allowed, strip HTML tags
  if (!allowHtml) {
    return content.replace(/<[^>]*>?/gm, '');
  }
  
  return content;
}