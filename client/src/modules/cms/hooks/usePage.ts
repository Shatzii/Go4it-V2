import { useQuery } from '@tanstack/react-query';
import type { PageData } from '../types';

/**
 * Hook to fetch a page from the CMS by its slug
 * @param slug The unique page slug/identifier
 */
export function usePage(slug: string) {
  return useQuery({
    queryKey: ['/api/cms/pages', slug],
    queryFn: async () => {
      const response = await fetch(`/api/cms/pages/${encodeURIComponent(slug)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch page: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as PageData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}