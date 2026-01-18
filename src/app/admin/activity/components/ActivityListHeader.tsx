'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import styles from './activity-list-header.module.css';

export function ActivityListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách hoạt động</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Hoạt động' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
