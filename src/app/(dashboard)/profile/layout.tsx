'use client';

import React from 'react';

import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import type { FamilyProfile } from '@/types/family-profile';
import familyProfileService from '@/services/family-profile.service';
import { ProfileProvider } from './ProfileContext';

import '@/styles/profile.css';

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
      <div className="profile-page">
        <div className="profile-container">
          <ProfileHeader />

          <div className="profile-layout">
            <ProfileSidebar />
            <main className="profile-main">{children}</main>
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}
