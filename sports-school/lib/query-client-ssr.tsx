'use client';

import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from '@tanstack/react-query';
import { useState, useEffect } from 'react';

// Create a client with SSR-safe configuration
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
          if (error?.status === 401 || error?.status === 403) {
            return false;
          }
          return failureCount < 3;
        },
        // Prevent queries from running during SSR
        enabled: typeof window !== 'undefined',
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function SSRQueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return <TanStackQueryClientProvider client={queryClient}>{children}</TanStackQueryClientProvider>;
}

// Custom hook for SSR-safe queries
export function useSSRSafeQuery(options: any) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    ...options,
    enabled: isMounted && (options.enabled ?? true),
  };
}
