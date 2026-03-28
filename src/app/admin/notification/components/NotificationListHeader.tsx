'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './notification-list-header.module.css';

export function NotificationListHeader() {
  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label: 'Danh sách thông báo' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

