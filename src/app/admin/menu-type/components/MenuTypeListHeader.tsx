'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './menu-type-list-header.module.css';

export function MenuTypeListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách loại thực đơn</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Loại thực đơn' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
