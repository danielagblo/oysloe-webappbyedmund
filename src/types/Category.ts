export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export type CategoryPayload = {
  name: string;
  description?: string;
};
