import type { Coupon, CouponPayload } from "../types/Coupon";
import { apiClient } from "./apiClient";
import endpoints from "./endpoints";

export const getCoupons = async (params?: {
  code?: string;
  discount_type?: string;
  is_active?: boolean;
  ordering?: string;
  search?: string;
}): Promise<Coupon[]> => {
  const qs = new URLSearchParams();
  if (params?.code) qs.append("code", params.code);
  if (params?.discount_type) qs.append("discount_type", params.discount_type);
  if (typeof params?.is_active === "boolean")
    qs.append("is_active", String(params.is_active));
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<Coupon[]>(`${endpoints.coupons.list()}${query}`);
};

export const getCoupon = async (id: number): Promise<Coupon> => {
  return apiClient.get<Coupon>(endpoints.coupons.detail(id));
};

export const createCoupon = async (body: CouponPayload): Promise<Coupon> => {
  return apiClient.post<Coupon>(endpoints.coupons.list(), body);
};

export const updateCoupon = async (
  id: number,
  body: CouponPayload,
): Promise<Coupon> => {
  return apiClient.put<Coupon>(endpoints.coupons.detail(id), body);
};

export const patchCoupon = async (
  id: number,
  body: Partial<CouponPayload>,
): Promise<Coupon> => {
  return apiClient.patch<Coupon>(endpoints.coupons.detail(id), body);
};

export const deleteCoupon = async (id: number): Promise<void> => {
  await apiClient.delete<void>(endpoints.coupons.detail(id));
};

// Expire a coupon (admin action) - server may accept an optional payload
export const expireCoupon = async (
  id: number,
  body: Partial<CouponPayload> = {},
): Promise<void> => {
  await apiClient.post<void>(endpoints.coupons.detail(id) + "expire/", body);
};

// Redeem a coupon (user action) - may accept optional payload (e.g., user id)
export const redeemCoupon = async (
  id: number,
  body: Partial<CouponPayload> = {},
): Promise<Coupon> => {
  return apiClient.post<Coupon>(endpoints.coupons.redeem(id), body);
};

export default {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  patchCoupon,
  deleteCoupon,
  expireCoupon,
  redeemCoupon,
};
