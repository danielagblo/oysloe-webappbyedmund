import type { Location } from "./Location";
import type { ProductFeature } from "./ProductFeature";
import type { ProductImage } from "./ProductImage";

export type ProductType = "SALE" | "RENT" | "SERVICE";
export type ProductStatus = "ACTIVE" | "SUSPENDED" | "PENDING" | "REJECTED";

export interface ProductOwner {
  id: number;
  email: string;
  phone?: string;
  name?: string;
}

export interface Product {
  id: number;
  images: ProductImage[];
  product_features: ProductFeature[];
  favourited_by_user?: boolean;
  location: Location;
  owner: ProductOwner;
  created_at: string;
  updated_at: string;
  pid: string;
  name: string;
  image: string;
  type: ProductType;
  status: ProductStatus;
  is_taken: boolean;
  description?: string;
  price: string | number;
  duration?: string;
  category: number;
}

export type ProductPayload = {
  pid: string;
  name: string;
  image?: string;
  type: ProductType;
  status: ProductStatus;
  is_taken?: boolean;
  description?: string;
  price: string | number;
  duration?: string;
  category: number;
};
