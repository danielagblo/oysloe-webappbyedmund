// profile-specific calls
// These connect mocks or real HTTP calls depending on env variable.

import { apiClient } from './apiClient';
import { endpoints } from './endpoints';
import mockProfile from '../../assets/mocks/profile.json';

const useMocks = process.env.REACT_APP_USE_MOCKS === 'true';

export async function getMyProfile() {
  if (useMocks) return mockProfile;
  return apiClient.get<UserProfile>(endpoints.profile.me());
}

export async function updateMyProfile(delta: Partial<UserProfile>) {
  if (useMocks) return { ...mockProfile, ...delta };
  return apiClient.patch<UserProfile>(endpoints.profile.update(), delta);
}