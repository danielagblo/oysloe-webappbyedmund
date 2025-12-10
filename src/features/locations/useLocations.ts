import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import * as locationService from "../../services/locationService";
import type { Location } from "../../types/Location";

const QUERY_KEY = "locations" as const;

export default function useLocations() {
  const q = useQuery<Location[], Error>({
    queryKey: [QUERY_KEY],
    queryFn: () => locationService.getLocations(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // group by region => array of place names
  const grouped = useMemo(() => {
    const g: Record<string, string[]> = {};
    (q.data ?? []).forEach((loc) => {
      if (!g[loc.region]) g[loc.region] = [];
      g[loc.region].push(loc.name);
    });
    return g;
  }, [q.data]);

  return {
    locations: q.data ?? [],
    groupedLocations: grouped,
    loading: q.isLoading,
    error: q.error?.message ?? null,
    refetch: q.refetch,
  };
}
