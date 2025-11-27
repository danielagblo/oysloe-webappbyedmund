import type {
  Payment,
  PaymentStatus,
  PaystackInitiateRequest,
} from "../types/Payment";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getPayments = async (params?: {
  ordering?: string;
  provider?: string;
  search?: string;
  status?: PaymentStatus;
  subscription?: number;
}): Promise<Payment[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.provider) qs.append("provider", params.provider);
  if (params?.search) qs.append("search", params.search);
  if (params?.status) qs.append("status", params.status);
  if (typeof params?.subscription === "number")
    qs.append("subscription", String(params.subscription));

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<Payment[]>(`${endpoints.payments.list()}${query}`);
};

export const getPayment = async (id: number): Promise<Payment> => {
  return apiClient.get<Payment>(endpoints.payments.detail(id));
};

export const initiatePaystackPayment = async (
  body: PaystackInitiateRequest,
): Promise<void> => {
  await apiClient.post<void>(endpoints.paystack.initiate(), body);
};

export const paystackWebhook = async (body: unknown): Promise<void> => {
  await apiClient.post<void>(endpoints.paystack.webhook(), body);
};

export default {
  getPayments,
  getPayment,
  initiatePaystackPayment,
  paystackWebhook,
};
