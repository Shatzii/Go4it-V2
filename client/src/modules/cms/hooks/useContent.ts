import { useQuery } from '@tanstack/react-query';
import { ContentBlock } from '../types';
import { getContentBlock, getContentBlocksBySection, getAllContentBlocks } from '../services/contentService';

/**
 * Custom hook for fetching a content block by its identifier
 * 
 * @param identifier The unique identifier for the content block
 * @param options Additional react-query options
 * @returns Query result with the content block data
 */
export function useContent(
  identifier: string,
  options: { enabled?: boolean } = {}
) {
  return useQuery<ContentBlock>({
    queryKey: ['/api/cms/content-blocks', identifier],
    queryFn: async () => {
      const response = await getContentBlock(identifier);
      return response;
    },
    ...options,
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
  return useQuery<ContentBlock[]>({
    queryKey: ['/api/cms/content-sections', section],
    queryFn: async () => {
      const response = await getContentBlocksBySection(section);
      return response;
    },
    ...options,
  });
}

/**
 * Hook to fetch all content blocks
 * 
 * @param options Additional react-query options
 * @returns Query result with an array of all content blocks
 */
export function useAllContent(options: { enabled?: boolean } = {}) {
  return useQuery<ContentBlock[]>({
    queryKey: ['/api/cms/content-blocks'],
    queryFn: async () => {
      const response = await getAllContentBlocks();
      return response;
    },
    ...options,
  });
}