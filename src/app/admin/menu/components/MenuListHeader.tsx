'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './menu-list-header.module.css';

export function MenuListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách thực đơn</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Thực đơn' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

