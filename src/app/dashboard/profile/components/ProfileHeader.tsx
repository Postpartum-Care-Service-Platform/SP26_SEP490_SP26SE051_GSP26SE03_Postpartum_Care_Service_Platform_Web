'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './profile-header.module.css';

export function ProfileHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Profile</h4>
      <Breadcrumbs
        items={[
          { label: 'Pages', href: '/' },
          { label: 'Profile' },
        ]}
        homeHref="/"
      />
    </div>
  );
}

