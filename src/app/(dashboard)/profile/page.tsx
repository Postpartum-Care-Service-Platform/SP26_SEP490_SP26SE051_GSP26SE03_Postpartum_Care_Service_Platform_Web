'use client';

import React from 'react';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { useProfile } from './ProfileContext';

export default function ProfilePage() {
  const { profile, setProfile } = useProfile();

  return <PersonalInfoForm profile={profile} onProfileUpdate={setProfile} />;
}
