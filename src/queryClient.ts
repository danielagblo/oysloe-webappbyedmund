import { QueryClient } from "@tanstack/react-query";

// Simple localStorage-based persistence for react-query cache.
// This avoids adding extra dependencies while providing persistence
// across page reloads. We serialize query keys + data and hydrate
// at startup. Note: data must be serializable (no functions).

const LS_KEY = "rq_cache_v1";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optimized for better performance
      staleTime: 5 * 60 * 1000, // 5 minutes - reduce unnecessary refetches
      gcTime: 5 * 60 * 1000, // 5 minutes - keep cached data longer
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true, // Only refetch if data is stale
    },
  },
});

function isSerializable(v: unknown) {
  try {
    JSON.stringify(v);
    return true;
  } catch (e) {
    return false;
  }
}

// Hydrate cache from localStorage (run immediately so queries can use it)
try {
  if (typeof window !== "undefined" && window.localStorage) {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const entries: Array<{ key: unknown; data: unknown; updatedAt?: number }> = JSON.parse(raw);
      if (Array.isArray(entries)) {
        for (const e of entries) {
          try {
            // Use the query key as stored (array or primitive)
            queryClient.setQueryData(e.key as any, e.data as any);
          } catch (err) {
            // ignore hydrate errors for incompatible entries
          }
        }
      }
    }
  }
} catch (e) {
  // ignore
}

// Periodically persist query cache to localStorage
if (typeof window !== "undefined" && window.addEventListener) {
  const persist = () => {
    try {
      const queries = queryClient.getQueryCache().getAll();
      const out: Array<{ key: unknown; data: unknown; updatedAt?: number }> = [];
      for (const q of queries) {
        try {
          const key = q.queryKey;
          const data = queryClient.getQueryData(key as any);
          if (data !== undefined && isSerializable(data)) {
            out.push({ key, data, updatedAt: Date.now() });
          }
        } catch (e) {
          /* ignore individual query serialization errors */
        }
      }
      localStorage.setItem(LS_KEY, JSON.stringify(out));
    } catch (e) {
      /* ignore persistence errors */
    }
  };

  // Save on unload and periodically
  window.addEventListener("beforeunload", persist);
  // also save every 30s while the page is active
  const intervalId = window.setInterval(persist, 30 * 1000);
  // Clear interval when page is unloaded
  window.addEventListener("unload", () => {
    try {
      window.clearInterval(intervalId);
    } catch (e) {
      /* ignore */
    }
  });
}
