export interface Subscription {
  id: number;
  name: string;
  tier?: string;
  description?: string;
  price: string | number;
  original_price?: string | number;
  multiplier?: string | number;
  discount_percentage?: string | number;
  effective_price?: string | number;
  features?: string;
  features_list?: string[];
  duration_days: number;
  max_products: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
