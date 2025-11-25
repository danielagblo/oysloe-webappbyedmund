import type { Policy } from "../types/Policy";
import { apiClient } from "./apiClient";

export const getLatestPrivacyPolicy = async (): Promise<Policy> => {
  return apiClient.get<Policy>(`/privacy-policies/latest/`);
};

export const getLatestTermsAndConditions = async (): Promise<Policy> => {
  return apiClient.get<Policy>(`/terms-and-conditions/latest/`);
};

export default {
  getLatestPrivacyPolicy,
  getLatestTermsAndConditions,
};
