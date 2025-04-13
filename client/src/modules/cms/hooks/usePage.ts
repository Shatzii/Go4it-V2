import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PageData } from '../types';

/**
 * Hook to fetch a page from the CMS by its slug
 * @param slug The unique page slug/identifier
 * @param options Additional react-query options
 * @returns Query result with the page data
 */
export function usePage(
  slug?: string,
  options?: Omit<UseQueryOptions<PageData, Error, PageData, string[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['page', slug || ''],
    queryFn: async () => {
      if (!slug) return null;
      
      const res = await fetch(`/api/pages/${slug}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Page not found: ${slug}`);
        }
        throw new Error(`Failed to fetch page data: ${res.status} ${res.statusText}`);
      }
      
      return res.json();
    },
    enabled: !!slug && (options?.enabled !== false),
    ...options,
  });
}