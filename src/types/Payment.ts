export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Payment {
  id: number;
  user: number;
  subscription: number;
  amount: string | number;
  currency: string;
  provider: string;
  reference: string;
  status: PaymentStatus;
  channel?: string;
  raw_response?: string;
  created_at: string;
  updated_at: string;
}

export interface PaystackInitiateRequest {
  subscription_id: number;
  callback_url: string;
}
