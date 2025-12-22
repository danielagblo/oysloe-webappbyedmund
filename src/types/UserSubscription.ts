import type { Payment } from "./Payment";
import type { Subscription } from "./Subscription";

export interface UserSubscription {
  id: number;
  subscription: Subscription;
  payment: Payment;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export type UserSubscriptionPayload = {
  subscription_id: number;
};
