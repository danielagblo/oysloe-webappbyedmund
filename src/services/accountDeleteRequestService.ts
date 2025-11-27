import type {
    AccountDeleteRequest,
    AccountDeleteRequestStatus,
} from "../types/AccountDeleteRequest";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getUserAccountDeleteRequests = async (params?: {
  ordering?: string;
  search?: string;
  status?: AccountDeleteRequestStatus;
}): Promise<AccountDeleteRequest[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);
  if (params?.status) qs.append("status", params.status);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  const response = await apiClient.get<AccountDeleteRequest[]>(
    `${endpoints.accountDeleteRequests.list()}${query}`,
  );
  return response;
};

export const createAccountDeleteRequest = async (body: {
  reason: string;
}): Promise<AccountDeleteRequest> => {
  const response = await apiClient.post<AccountDeleteRequest>(
    endpoints.accountDeleteRequests.create(),
    body,
  );
  return response;
};

export const deleteAccountDeleteRequest = async (id: number): Promise<void> => {
  await apiClient.delete<void>(endpoints.accountDeleteRequests.delete(id));
};
