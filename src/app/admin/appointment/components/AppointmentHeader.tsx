'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './appointment-header.module.css';

export function AppointmentHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Quản lý lịch hẹn</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Lịch hẹn' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

