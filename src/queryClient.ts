import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optimized for better performance
      staleTime: 5 * 60 * 1000, // 5 minutes - reduce unnecessary refetches
      gcTime: 10 * 60 * 1000,   // 10 minutes - keep cached data longer
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true, // Only refetch if data is stale
    },
  },
});
