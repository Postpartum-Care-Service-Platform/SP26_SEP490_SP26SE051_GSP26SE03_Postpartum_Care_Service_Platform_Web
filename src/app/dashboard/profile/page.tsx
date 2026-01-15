'use client';

import { ProfileHeader } from './components/ProfileHeader';
import { ProfileSidebarColumn } from './components/ProfileSidebarColumn';
import { ProfileSummaryCards } from './components/ProfileSummaryCards';
import { ProfileActivityFeed } from './components/ProfileActivityFeed';
import styles from './profile.module.css';

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <ProfileHeader />
      <div className={styles.layout}>
        <ProfileSidebarColumn />
        <div className={styles.mainColumn}>
          <ProfileSummaryCards />
          <ProfileActivityFeed />
        </div>
      </div>
    </div>
  );
}
