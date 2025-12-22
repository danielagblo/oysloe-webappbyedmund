import type { Subscription } from "../types/Subscription";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getSubscriptions = async (): Promise<Subscription[]> => {
  return apiClient.get<Subscription[]>(endpoints.subscriptions.list());
};

export const getSubscription = async (id: number): Promise<Subscription> => {
  return apiClient.get<Subscription>(endpoints.subscriptions.detail(id));
};

export default {
  getSubscriptions,
  getSubscription,
};
