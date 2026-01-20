'use client';

import { ProfileHeader } from './components/ProfileHeader';
import { ProfileCover } from './components/ProfileCover';
import { ProfileAvatar } from './components/ProfileAvatar';
import { ProfileName } from './components/ProfileName';
import { AccountInfoCard } from './components/AccountInfoCard';
import { SettingsCard } from './components/SettingsCard';
import { useAuth } from '@/contexts/AuthContext';
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
