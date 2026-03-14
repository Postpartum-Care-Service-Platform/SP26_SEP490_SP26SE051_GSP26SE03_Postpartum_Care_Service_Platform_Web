'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './booking-header.module.css';

export function BookingHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách đặt phòng</h4>
      <Breadcrumbs
        items={[
          { label: 'Đặt phòng' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

