'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './contract-list-header.module.css';

export function ContractListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Hợp đồng</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Hợp đồng' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

