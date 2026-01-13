'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './appointment-header.module.css';

export function AppointmentHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>All Appointment</h4>
      <Breadcrumbs
        items={[
          { label: 'Hospital', href: '/admin' },
          { label: 'All Appointment' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

