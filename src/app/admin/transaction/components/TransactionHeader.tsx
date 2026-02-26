'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './transaction-header.module.css';

export function TransactionHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách giao dịch</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Giao dịch' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
