import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoupons, redeemCoupon } from "../../services/couponService";
import type { Coupon } from "../../types/Coupon";

const QUERY_KEYS = {
  coupons: ["coupons"] as const,
  profile: ["userProfile"] as const,
};

export function useApplyCoupon() {
  const qc = useQueryClient();

  const mutation = useMutation<Coupon, Error,string>({
    mutationFn: async (code: string) => {
      // Find coupon by code
      const list = await getCoupons({ code });
      if (!list || list.length === 0) {
        throw new Error("Coupon not found");
      }
      const coupon = list[0];
      try {
        // Some backends expect a body when redeeming (e.g. { code })
        const redeemed = await redeemCoupon(coupon.id, { code: coupon.code });
        return redeemed;
      } catch (err: unknown) {
        // surface backend error message when available
        if (err instanceof Error) throw err;
        // attempt to stringify server error
        throw new Error(JSON.stringify(err));
      }
    },
    onSuccess: (data) => {
      console.log(data);
      // Invalidate related caches so UI can refresh
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coupons });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });

  return {
      apply: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

export default useApplyCoupon;
