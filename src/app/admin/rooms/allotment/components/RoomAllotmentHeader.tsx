'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './room-allotment-header.module.css';

export function RoomAllotmentHeader() {
  return (
    <div className={styles.header}>
      <Breadcrumbs
        items={[
          { label: 'Tất cả phòng' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
