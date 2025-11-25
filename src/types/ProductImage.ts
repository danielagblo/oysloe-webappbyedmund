export interface ProductImage {
  id: number;
  product: number;
  image: string;
  created_at: string;
}

export type ProductImagePayload = {
  product: number;
  image: string;
};
