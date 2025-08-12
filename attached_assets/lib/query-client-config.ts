import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
          // Don't retry on authentication errors
          if (error?.status === 401 || error?.status === 403) {
            return false
          }
          return failureCount < 3
        },
        // Critical: Disable queries during SSR to prevent hydration mismatches
        enabled: typeof window !== 'undefined',
        refetchOnMount: typeof window !== 'undefined',
        refetchOnWindowFocus: false,
        refetchOnReconnect: typeof window !== 'undefined',
        // Don't run queries during SSR
        ...(typeof window === 'undefined' && {
          enabled: false,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        }),
      },
      mutations: {
        retry: 1,
      },
    },
  })
}