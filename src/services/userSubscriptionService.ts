import type {
  UserSubscription,
  UserSubscriptionPayload,
} from "../types/UserSubscription";
import { apiClient } from "./apiClient";

export const getUserSubscriptions = async (params?: {
  ordering?: string;
  search?: string;
}): Promise<UserSubscription[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<UserSubscription[]>(`/user-subscriptions/${query}`);
};

export const getUserSubscription = async (
  id: number,
): Promise<UserSubscription> => {
  return apiClient.get<UserSubscription>(`/user-subscriptions/${id}/`);
};

export const createUserSubscription = async (
  body: UserSubscriptionPayload,
): Promise<UserSubscription> => {
  return apiClient.post<UserSubscription>(`/user-subscriptions/`, body);
};

export const updateUserSubscription = async (
  id: number,
  body: UserSubscriptionPayload,
): Promise<UserSubscription> => {
  return apiClient.put<UserSubscription>(`/user-subscriptions/${id}/`, body);
};

export const patchUserSubscription = async (
  id: number,
  body: Partial<UserSubscriptionPayload>,
): Promise<UserSubscription> => {
  return apiClient.patch<UserSubscription>(`/user-subscriptions/${id}/`, body);
};

export const deleteUserSubscription = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/user-subscriptions/${id}/`);
};

export default {
  getUserSubscriptions,
  getUserSubscription,
  createUserSubscription,
  updateUserSubscription,
  patchUserSubscription,
  deleteUserSubscription,
};
