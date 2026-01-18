'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import styles from './care-plan-detail-list-header.module.css';

export function CarePlanDetailListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách chi tiết kế hoạch chăm sóc</h4>
      <Breadcrumbs
        items={[
          { label: 'Trang quản trị', href: '/admin' },
          { label: 'Chi tiết kế hoạch chăm sóc' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
