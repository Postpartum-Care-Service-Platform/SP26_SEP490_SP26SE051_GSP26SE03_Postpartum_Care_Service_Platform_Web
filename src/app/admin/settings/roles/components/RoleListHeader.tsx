'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './role-list-header.module.css';

export function RoleListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách vai trò</h4>
      <Breadcrumbs
        items={[
          { label: 'Vai trò' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
