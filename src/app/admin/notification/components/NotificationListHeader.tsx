'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './notification-list-header.module.css';

export function NotificationListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách thông báo</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Thông báo' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

