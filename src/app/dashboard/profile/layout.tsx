'use client';

import React from 'react';

import familyProfileService from '@/services/family-profile.service';
import type { FamilyProfile } from '@/types/family-profile';

import { ProfileProvider } from './ProfileContext';

type Props = {
  children: React.ReactNode;
};

export default function ProfileLayout({ children }: Props) {
  const [profile, setProfile] = React.useState<FamilyProfile | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const list = await familyProfileService.getMyFamilyProfiles();
        setProfile(list?.[0] ?? null);
      } catch {
        setProfile(null);
      }
    };
    load();
  }, []);

  return (
    <ProfileProvider value={{ profile, setProfile }}>
      {children}
    </ProfileProvider>
  );
}
