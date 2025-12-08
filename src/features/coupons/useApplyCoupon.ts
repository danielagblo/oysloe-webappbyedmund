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

      // Directly redeem the coupon via POST /coupons/{id}/redeem/
      try {
        // Some backends expect the full coupon payload when redeeming.
        const payload = {
          code: coupon.code,
          description: (coupon as any).description ?? "",
          discount_type: (coupon as any).discount_type ?? "percent",
          discount_value: (coupon as any).discount_value ?? (coupon as any).discount ?? 0,
          max_uses: (coupon as any).max_uses ?? undefined,
          per_user_limit: (coupon as any).per_user_limit ?? undefined,
          valid_from: (coupon as any).valid_from ?? undefined,
          valid_until: (coupon as any).valid_until ?? undefined,
          is_active: (coupon as any).is_active ?? true,
        } as Record<string, unknown>;

        const redeemed = await redeemCoupon(coupon.id, payload);
        return redeemed;
      } catch (err: unknown) {
        if (err instanceof Error) throw err;
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
