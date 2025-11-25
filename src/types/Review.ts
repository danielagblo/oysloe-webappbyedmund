import type { AuthUser } from "./Auth";
import type { Product } from "./Product";

export interface Review {
  id: number;
  user: AuthUser;
  product: Product;
  rating: number;
  comment?: string;
  created_at: string;
}

export type ReviewPayload = {
  product: number;
  rating: number;
  comment?: string;
};
