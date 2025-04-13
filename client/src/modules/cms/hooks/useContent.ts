import { useQuery } from '@tanstack/react-query';
import { ContentBlock } from '../types';
import { fetchContentBlock, fetchContentBlocksBySection, fetchAllContentBlocks } from '../services/contentService';

/**
 * Custom hook for fetching a content block by its identifier
 * 
 * @param identifier The unique identifier for the content block
 * @param options Additional react-query options
 * @returns Query result with the content block data
 */
export function useContent(
  identifier?: string, 
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: identifier ? ['/api/cms/content-blocks', identifier] : [],
    queryFn: () => identifier ? fetchContentBlock(identifier) : null,
    enabled: !!identifier && (options.enabled !== false), // Only enabled if identifier is provided and not explicitly disabled
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all content blocks for a specific section
 * 
 * @param section The section name to fetch content blocks for
 * @param options Additional react-query options
 * @returns Query result with an array of content blocks
 */
export function useContentSection(
  section: string,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: ['/api/cms/content-blocks/section', section],
    queryFn: () => fetchContentBlocksBySection(section),
    enabled: !!section && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all content blocks
 * 
 * @param options Additional react-query options
 * @returns Query result with an array of all content blocks
 */
export function useAllContent(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['/api/cms/content-blocks'],
    queryFn: fetchAllContentBlocks,
    enabled: options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}