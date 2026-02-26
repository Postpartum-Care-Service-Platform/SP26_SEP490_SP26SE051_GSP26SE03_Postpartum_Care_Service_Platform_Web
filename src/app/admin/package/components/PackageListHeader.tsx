'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './package-list-header.module.css';

export function PackageListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách gói dịch vụ</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Gói dịch vụ' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

