import type {
  MessageResponse,
  OTPVerifyRequest,
  UserProfile,
  UserProfileUpdatePayload,
} from "../types/UserProfile";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

// User Preferences
export const getUserPreferences = async (): Promise<UserProfile> => {
  return apiClient.get<UserProfile>(endpoints.userProfile.userPreferences);
};

export const updateUserPreferences = async (
  body: UserProfileUpdatePayload,
): Promise<UserProfile> => {
  return apiClient.put<UserProfile>(endpoints.userProfile.userPreferences, body);
};

// User Profile
export const getUserProfile = async (): Promise<UserProfile> => {
  return apiClient.get<UserProfile>(endpoints.userProfile.userProfile);
};

export const updateUserProfile = async (
  body: UserProfileUpdatePayload,
): Promise<UserProfile> => {
  return apiClient.patch<UserProfile>(endpoints.userProfile.userProfile, body);
};

// OTP Verification
export const sendOTP = async (phone: string): Promise<MessageResponse> => {
  return apiClient.get<MessageResponse>(endpoints.userProfile.sendOTP(phone));
};

export const verifyOTP = async (
  body: OTPVerifyRequest,
): Promise<MessageResponse> => {
  return apiClient.post<MessageResponse>(endpoints.userProfile.verifyOTP, body);
};

export default {
  getUserPreferences,
  updateUserPreferences,
  getUserProfile,
  updateUserProfile,
  sendOTP,
  verifyOTP,
};
