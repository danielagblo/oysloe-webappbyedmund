import { useMutation, useQueryClient } from "@tanstack/react-query";
import { redeemPoints } from "../../services/redeemService";
import type { RedeemPointsResponse } from "../../types/RedeemPoints";

const QUERY_KEYS = {
  profile: ["userProfile"] as const,
};

export function useRedeemPoints() {
  const queryClient = useQueryClient();

  const mutation = useMutation<RedeemPointsResponse, Error, void>({
    mutationFn: async () => {
      return redeemPoints();
    },

    onSuccess: (data) => {
      // Refresh or update user profile so points/wallet reflect redemption
      // We don't know the exact profile shape returned, so invalidate the profile query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      console.info("Redeem successful:", data);
    },

    onError: (err) => {
      console.error("Redeem failed:", err.message);
    },
  });

  return {
    redeem: mutation.mutateAsync,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

export default useRedeemPoints;
