// src/hooks/useUserProfile.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUserPreferences,
  getUserProfile,
  sendOTP,
  updateUserPreferences,
  updateUserProfile,
  verifyOTP,
} from "../../services/userProfileService";

import type {
  MessageResponse,
  OTPVerifyRequest,
  UserProfile,
  UserProfileUpdatePayload,
} from "../../types/UserProfile";

// Always use real API services (remove mock data pathing)

/* -------------------------------------------------------
              QUERY KEYS (to avoid typos)
--------------------------------------------------------*/
const QUERY_KEYS = {
  profile: ["userProfile"] as const,
  preferences: ["userPreferences"] as const,
};

/* -------------------------------------------------------
                    MAIN HOOK EXPORT
--------------------------------------------------------*/
export function useUserProfile() {
  const queryClient = useQueryClient();

  /* -------------------------------------------------------
                     FETCH USER PROFILE
  --------------------------------------------------------*/
  const profileQuery = useQuery<UserProfile>({
    queryKey: QUERY_KEYS.profile,
    queryFn: async () => {
      return getUserProfile();
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  /* -------------------------------------------------------
                    UPDATE USER PROFILE
  --------------------------------------------------------*/
  const updateProfileMutation = useMutation<
    UserProfile,
    Error,
    UserProfileUpdatePayload
  >({
    mutationFn: async (body) => {
      return updateUserProfile(body);
    },

    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.profile, data);
    },

    onError: (err) => {
      console.error("Update profile failed:", err.message);
    },
  });

  /* -------------------------------------------------------
                   FETCH USER PREFERENCES
  --------------------------------------------------------*/
  const preferencesQuery = useQuery<UserProfile>({
    queryKey: QUERY_KEYS.preferences,
    queryFn: async () => {
      return getUserPreferences();
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  /* -------------------------------------------------------
                  UPDATE USER PREFERENCES
  --------------------------------------------------------*/
  const updatePreferencesMutation = useMutation<
    UserProfile,
    Error,
    UserProfileUpdatePayload
  >({
    mutationFn: async (body) => {
      return updateUserPreferences(body);
    },

    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.preferences, data);
    },

    onError: (err) => {
      console.error("Update preferences failed:", err.message);
    },
  });

  /* -------------------------------------------------------
                        SEND OTP
  --------------------------------------------------------*/
  const sendOTPMutation = useMutation<MessageResponse, Error, string>({
    mutationFn: async (phone) => {
      return sendOTP(phone);
    },

    onError: (err) => {
      console.error("Send OTP failed:", err.message);
    },
  });

  /* -------------------------------------------------------
                      VERIFY OTP
  --------------------------------------------------------*/
  const verifyOTPMutation = useMutation<
    MessageResponse,
    Error,
    OTPVerifyRequest
  >({
    mutationFn: async (body) => {
      return verifyOTP(body);
    },

    onError: (err) => {
      console.error("Verify OTP failed:", err.message);
    },
  });

  /* -------------------------------------------------------
                return clean hook interface
  --------------------------------------------------------*/
  return {
    // Data
    profile: profileQuery.data ?? null,
    preferences: preferencesQuery.data ?? null,

    // Status
    loading:
      profileQuery.isLoading ||
      preferencesQuery.isLoading ||
      updateProfileMutation.isPending ||
      updatePreferencesMutation.isPending ||
      sendOTPMutation.isPending ||
      verifyOTPMutation.isPending,

    error:
      profileQuery.error?.message ||
      preferencesQuery.error?.message ||
      updateProfileMutation.error?.message ||
      updatePreferencesMutation.error?.message ||
      sendOTPMutation.error?.message ||
      verifyOTPMutation.error?.message ||
      null,

    // Fetchers (from TanStack)
    refetchProfile: profileQuery.refetch,
    refetchPreferences: preferencesQuery.refetch,

    // Mutations
    updateProfile: updateProfileMutation.mutateAsync,
    updatePreferences: updatePreferencesMutation.mutateAsync,
    sendOTP: sendOTPMutation.mutateAsync,
    verifyOTP: verifyOTPMutation.mutateAsync,
  };
}

export default useUserProfile;
