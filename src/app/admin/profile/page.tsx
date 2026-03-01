'use client';

import { useAuth } from '@/contexts/AuthContext';

import { AccountInfoCard } from './components/AccountInfoCard';
import { ProfileAvatar } from './components/ProfileAvatar';
import { ProfileCover } from './components/ProfileCover';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileName } from './components/ProfileName';
import { SettingsCard } from './components/SettingsCard';
import styles from './profile.module.css';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const displayName = user?.username || '';

  return (
    <div className={styles.pageContainer}>
      <ProfileHeader />
      <div className={styles.profileSection}>
        <ProfileCover />
        <div className={styles.profileInfo}>
          <ProfileAvatar name={displayName} />
          <ProfileName name={displayName} />
        </div>
      </div>
      <div className={styles.cardsContainer}>
        <AccountInfoCard />
        <SettingsCard />
      </div>
    </div>
  );
}
