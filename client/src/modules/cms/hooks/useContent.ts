import { useQuery } from '@tanstack/react-query';
import type { ContentBlock } from '../types';

/**
 * Hook to fetch content blocks from the CMS
 * @param section Optional section name to filter content blocks
 * @param identifier Optional unique identifier for a specific content block
 */
export function useContent(section?: string, identifier?: string) {
  return useQuery({
    queryKey: ['/api/cms/content', section, identifier].filter(Boolean),
    queryFn: async () => {
      // Build the query URL based on provided filters
      let url = '/api/cms/content';
      const params = new URLSearchParams();
      
      if (section) {
        params.append('section', section);
      }
      
      if (identifier) {
        params.append('identifier', identifier);
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // If requesting a specific identifier, return the first item directly
      if (identifier && Array.isArray(data) && data.length > 0) {
        return data[0] as ContentBlock;
      }
      
      return data as ContentBlock[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}