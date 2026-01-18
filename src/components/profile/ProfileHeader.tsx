'use client';

import Image from 'next/image';
import React from 'react';

import { useProfile } from '@/app/dashboard/profile/ProfileContext';

export function ProfileHeader() {
  const { profile } = useProfile();
  const avatarUrl = profile?.avatarUrl;

  return (
    <div className="profile-header" aria-label="Profile header">
      <div className="profile-header__cover" />
      <div className="profile-header__main">
        <div className="profile-header__avatar-wrapper">
          {avatarUrl ? (
            <Image
              className="profile-header__avatar"
              src={avatarUrl}
              alt={profile?.fullName || 'Avatar'}
              width={120}
              height={120}
            />
          ) : (
            <div className="profile-header__avatar" aria-label="Avatar" />
          )}
        </div>
        <div className="profile-header__info">
          <div className="profile-header__name">{profile?.fullName || 'Chưa có thông tin'}</div>
          <div className="profile-header__role">{profile?.phoneNumber || ''}</div>
        </div>
      </div>
    </div>
  );
}
