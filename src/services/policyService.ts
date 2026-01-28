import type { Policy } from "../types/Policy";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getLatestPrivacyPolicy = async (): Promise<Policy> => {
  return apiClient.get<Policy>(endpoints.policies.privacyLatest());
};

export const getLatestTermsAndConditions = async (): Promise<Policy> => {
  return apiClient.get<Policy>(endpoints.policies.termsLatest());
};

export default {
  getLatestPrivacyPolicy,
  getLatestTermsAndConditions,
};
