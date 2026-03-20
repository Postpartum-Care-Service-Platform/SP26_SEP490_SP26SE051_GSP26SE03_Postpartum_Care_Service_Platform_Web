'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './amenity-ticket-header.module.css';

export function AmenityTicketListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Quản lý Ticket Tiện ích</h4>
      <Breadcrumbs
        items={[
          { label: 'Tiện ích', href: '/admin/amenity-service' },
          { label: 'Vé tiện ích' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}
