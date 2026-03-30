'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './account-overview-header.module.css';

export function AccountOverviewHeader() {
  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label: 'Danh sách tài khoản', href: '/admin/account' },
          { label: 'Tổng quan tài khoản' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
