import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoupon, getCoupons, redeemCoupon } from "../../services/couponService";
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

      // Preflight: fetch latest coupon details to validate availability
      try {
        const latest = await getCoupon(coupon.id);
        // If backend exposes remaining_uses or uses/max_uses, validate
        if (typeof latest.remaining_uses === "number" && latest.remaining_uses <= 0) {
          throw new Error("Coupon usage limit reached");
        }
        if (typeof latest.uses === "number" && typeof latest.max_uses === "number" && latest.max_uses > 0 && latest.uses >= latest.max_uses) {
          throw new Error("Coupon usage limit reached");
        }
        if (latest.is_active === false) {
          throw new Error("Coupon is not active");
        }
        const now = new Date();
        if (latest.valid_from && new Date(latest.valid_from) > now) {
          throw new Error("Coupon is not yet valid");
        }
        if (latest.valid_until && new Date(latest.valid_until) < now) {
          throw new Error("Coupon has expired");
        }
      } catch (preErr) {
        // If getCoupon failed with a network/server error, rethrow that
        if (preErr instanceof Error) throw preErr;
        throw new Error(String(preErr));
      }

      try {
        // Redeem — include code in body in case backend expects it
        const redeemed = await redeemCoupon(coupon.id, { code: coupon.code });
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
