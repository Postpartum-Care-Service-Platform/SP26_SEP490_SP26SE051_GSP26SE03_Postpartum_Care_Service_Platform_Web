'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './menu-record-list-header.module.css';

export function MenuRecordListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách bản ghi thực đơn</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Bản ghi thực đơn' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
