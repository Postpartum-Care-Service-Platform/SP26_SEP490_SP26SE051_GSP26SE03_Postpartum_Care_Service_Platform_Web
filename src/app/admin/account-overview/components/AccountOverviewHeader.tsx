'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import styles from './account-overview-header.module.css';

export function AccountOverviewHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Tổng quan tài khoản</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Tổng quan tài khoản' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
