'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './dashboard-header.module.css';

export function DashboardHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Dashboard</h4>
      <Breadcrumbs
        items={[
          { label: 'Dashboard' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

