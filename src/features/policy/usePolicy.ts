import { useQuery } from "@tanstack/react-query";
import policyService from "../../services/policyService";
import type { Policy } from "../../types/Policy";

export function useLatestPrivacyPolicy() {
  const query = useQuery<Policy>({
    queryKey: ["policy", "privacy", "latest"],
    queryFn: async () => {
      return policyService.getLatestPrivacyPolicy();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    policy: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useLatestTermsAndConditions() {
  const query = useQuery<Policy>({
    queryKey: ["policy", "terms", "latest"],
    queryFn: async () => {
      return policyService.getLatestTermsAndConditions();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    policy: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useLatestPrivacyPolicy;
