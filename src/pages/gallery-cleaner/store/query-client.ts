import { QueryClient } from '@tanstack/react-query';

export const cleanerQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      retryOnMount: true,
      retryDelay: 1000,
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      experimental_prefetchInRender: true,
    },
  },
});

export const QUERY_KEYS = {
  ALBUM: 'KEY::album',
};
