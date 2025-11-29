import { useQuery } from "@tanstack/react-query";
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
  const grouped: Record<string, string[]> = {};
  (q.data ?? []).forEach((loc) => {
    if (!grouped[loc.region]) grouped[loc.region] = [];
    grouped[loc.region].push(loc.name);
  });

  return {
    locations: q.data ?? [],
    groupedLocations: grouped,
    loading: q.isLoading,
    error: q.error?.message ?? null,
    refetch: q.refetch,
  };
}
