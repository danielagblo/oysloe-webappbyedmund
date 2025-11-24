export type DiscountType = 'fixed' | 'percent';

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: string | number;
  max_uses: number;
  uses: number;
  per_user_limit: number;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  remaining_uses?: number;
}

export type CouponPayload = {
  code: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: string | number;
  max_uses?: number;
  per_user_limit?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
};
