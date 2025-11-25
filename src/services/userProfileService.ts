import type {
  MessageResponse,
  OTPVerifyRequest,
  UserProfile,
  UserProfileUpdatePayload,
} from "../types/UserProfile";
import { apiClient } from "./apiClient";

// User Preferences
export const getUserPreferences = async (): Promise<UserProfile> => {
  return apiClient.get<UserProfile>(`/userpreferences/`);
};

export const updateUserPreferences = async (
  body: UserProfileUpdatePayload,
): Promise<UserProfile> => {
  return apiClient.put<UserProfile>(`/userpreferences/`, body);
};

// User Profile
export const getUserProfile = async (): Promise<UserProfile> => {
  return apiClient.get<UserProfile>(`/userprofile/`);
};

export const updateUserProfile = async (
  body: UserProfileUpdatePayload,
): Promise<UserProfile> => {
  return apiClient.put<UserProfile>(`/userprofile/`, body);
};

// OTP Verification
export const sendOTP = async (phone: string): Promise<MessageResponse> => {
  return apiClient.get<MessageResponse>(
    `/verifyotp/?phone=${encodeURIComponent(phone)}`,
  );
};

export const verifyOTP = async (
  body: OTPVerifyRequest,
): Promise<MessageResponse> => {
  return apiClient.post<MessageResponse>(`/verifyotp/`, body);
};

export default {
  getUserPreferences,
  updateUserPreferences,
  getUserProfile,
  updateUserProfile,
  sendOTP,
  verifyOTP,
};
