import type { Policy } from "../types/Policy";
import { apiClient } from "./apiClient";

export const getLatestPrivacyPolicy = async (): Promise<Policy> => {
	return apiClient.get<Policy>(`/api-v1/privacy-policies/latest/`);
};

export const getLatestTermsAndConditions = async (): Promise<Policy> => {
	return apiClient.get<Policy>(`/api-v1/terms-and-conditions/latest/`);
};

export default {
	getLatestPrivacyPolicy,
	getLatestTermsAndConditions,
};
