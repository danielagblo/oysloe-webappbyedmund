import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoupons, redeemCoupon } from "../../services/couponService";
import type { Coupon } from "../../types/Coupon";

const QUERY_KEYS = {
  coupons: ["coupons"] as const,
  profile: ["userProfile"] as const,
};

export function useApplyCoupon() {
  const qc = useQueryClient();

  const mutation = useMutation<Coupon, Error, string>({
    mutationFn: async (code: string) => {
      // Find coupon by code
      const list = await getCoupons({ code });
      if (!list || list.length === 0) {
        throw new Error("Coupon not found");
      }
      const coupon = list[0];
      // Redeem by id
      const redeemed = await redeemCoupon(coupon.id);
      return redeemed;
    },
    onSuccess: (data) => {
      // Invalidate related caches so UI can refresh
      qc.invalidateQueries(QUERY_KEYS.coupons as any);
      qc.invalidateQueries(QUERY_KEYS.profile as any);
    },
  });

  return {
    apply: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

export default useApplyCoupon;
