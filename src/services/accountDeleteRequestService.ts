import type { AccountDeleteRequest } from "../types/AccountDeleteRequest";
import { apiClient } from "./apiClient";

export const getUserAccountDeleteRequests = async (): Promise<AccountDeleteRequest[]> => {
  const response = await apiClient.get<AccountDeleteRequest[]>("/api-v1/account-delete-requests/");
  return response;
};