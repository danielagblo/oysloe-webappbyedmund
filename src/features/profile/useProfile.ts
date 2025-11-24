import { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile } from '../../services/profileService';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getMyProfile().then(setProfile);
  }, []);

  async function saveProfile(updates: Partial<UserProfile>) {
    const updated = await updateMyProfile(updates);
    setProfile(updated);
  }

  return { profile, saveProfile };
}