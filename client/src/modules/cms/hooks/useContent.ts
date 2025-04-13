import { useQuery } from '@tanstack/react-query';
import type { ContentBlock } from '../types';

/**
 * Hook to fetch content blocks from the CMS
 * @param section Optional section name to filter content blocks
 * @param identifier Optional unique identifier for a specific content block
 */
export function useContent(section?: string, identifier?: string) {
  return useQuery({
    queryKey: ['/api/cms/content-blocks', section, identifier].filter(Boolean),
    queryFn: async () => {
      let url = '/api/cms/content-blocks';
      
      if (identifier) {
        url = `${url}/identifier/${identifier}`;
      } else if (section) {
        url = `${url}/section/${section}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content blocks: ${response.statusText}`);
      }
      
      return await response.json() as identifier ? ContentBlock : ContentBlock[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}