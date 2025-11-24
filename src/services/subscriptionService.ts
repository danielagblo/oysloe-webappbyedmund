import type { Subscription } from "../types/Subscription";
import { apiClient } from "./apiClient";

export const getSubscriptions = async (): Promise<Subscription[]> => {
	return apiClient.get<Subscription[]>(`/api-v1/subscriptions/`);
};

export const getSubscription = async (id: number): Promise<Subscription> => {
	return apiClient.get<Subscription>(`/api-v1/subscriptions/${id}/`);
};

export default {
	getSubscriptions,
	getSubscription,
};
