export interface Feature {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  subcategory: number;
}

export type FeaturePayload = {
  name: string;
  description?: string;
  subcategory: number;
};
