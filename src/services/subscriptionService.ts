import type { Subscription } from "../types/Subscription";
import { apiClient } from "./apiClient";

export const getSubscriptions = async (): Promise<Subscription[]> => {
	return apiClient.get<Subscription[]>(`/subscriptions/`);
};

export const getSubscription = async (id: number): Promise<Subscription> => {
	return apiClient.get<Subscription>(`/subscriptions/${id}/`);
};

export default {
	getSubscriptions,
	getSubscription,
};
