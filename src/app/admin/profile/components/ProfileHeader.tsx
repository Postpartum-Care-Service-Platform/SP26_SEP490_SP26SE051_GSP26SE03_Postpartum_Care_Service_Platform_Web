'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import styles from './profile-header.module.css';

export function ProfileHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Hồ sơ</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Hồ sơ' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
