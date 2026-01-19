'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import styles from './appointment-type-list-header.module.css';

export function AppointmentTypeListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách loại lịch hẹn</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Loại lịch hẹn' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
