import type { MessageResponse, OTPVerifyRequest, UserProfile, UserProfileUpdatePayload } from "../types/UserProfile";
import { apiClient } from "./apiClient";

// User Preferences
export const getUserPreferences = async (): Promise<UserProfile> => {
	return apiClient.get<UserProfile>(`/api-v1/userpreferences/`);
};

export const updateUserPreferences = async (body: UserProfileUpdatePayload): Promise<UserProfile> => {
	return apiClient.put<UserProfile>(`/api-v1/userpreferences/`, body);
};

// User Profile
export const getUserProfile = async (): Promise<UserProfile> => {
	return apiClient.get<UserProfile>(`/api-v1/userprofile/`);
};

export const updateUserProfile = async (body: UserProfileUpdatePayload): Promise<UserProfile> => {
	return apiClient.put<UserProfile>(`/api-v1/userprofile/`, body);
};

// OTP Verification
export const sendOTP = async (phone: string): Promise<MessageResponse> => {
	return apiClient.get<MessageResponse>(`/api-v1/verifyotp/?phone=${encodeURIComponent(phone)}`);
};

export const verifyOTP = async (body: OTPVerifyRequest): Promise<MessageResponse> => {
	return apiClient.post<MessageResponse>(`/api-v1/verifyotp/`, body);
};

export default {
	getUserPreferences,
	updateUserPreferences,
	getUserProfile,
	updateUserProfile,
	sendOTP,
	verifyOTP,
};
