'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './amenity-service-header.module.css';

export function AmenityServiceListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Danh sách tiện ích</h4>
      <Breadcrumbs
        items={[
          { label: 'Tiện ích' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
