import type {
  UserSubscription,
  UserSubscriptionPayload,
} from "../types/UserSubscription";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getUserSubscriptions = async (params?: {
  ordering?: string;
  search?: string;
}): Promise<UserSubscription[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<UserSubscription[]>(
    `${endpoints.userSubscriptions.list()}${query}`,
  );
};

export const getUserSubscription = async (
  id: number,
): Promise<UserSubscription> => {
  return apiClient.get<UserSubscription>(
    endpoints.userSubscriptions.detail(id),
  );
};

export const createUserSubscription = async (
  body: UserSubscriptionPayload,
): Promise<UserSubscription> => {
  return apiClient.post<UserSubscription>(
    endpoints.userSubscriptions.create(),
    body,
  );
};

export const updateUserSubscription = async (
  id: number,
  body: UserSubscriptionPayload,
): Promise<UserSubscription> => {
  return apiClient.put<UserSubscription>(
    endpoints.userSubscriptions.update(id),
    body,
  );
};

export const patchUserSubscription = async (
  id: number,
  body: Partial<UserSubscriptionPayload>,
): Promise<UserSubscription> => {
  return apiClient.patch<UserSubscription>(
    endpoints.userSubscriptions.patch(id),
    body,
  );
};

export const deleteUserSubscription = async (id: number): Promise<void> => {
  await apiClient.delete<void>(endpoints.userSubscriptions.delete(id));
};

export default {
  getUserSubscriptions,
  getUserSubscription,
  createUserSubscription,
  updateUserSubscription,
  patchUserSubscription,
  deleteUserSubscription,
};
