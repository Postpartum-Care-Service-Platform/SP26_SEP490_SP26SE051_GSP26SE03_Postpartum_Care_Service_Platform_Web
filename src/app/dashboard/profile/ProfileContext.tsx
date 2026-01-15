'use client';

import React from 'react';
import type { FamilyProfile } from '@/types/family-profile';

type ProfileContextValue = {
  profile: FamilyProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<FamilyProfile | null>>;
};

const ProfileContext = React.createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children, value }: { children: React.ReactNode; value: ProfileContextValue }) {
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = React.useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
