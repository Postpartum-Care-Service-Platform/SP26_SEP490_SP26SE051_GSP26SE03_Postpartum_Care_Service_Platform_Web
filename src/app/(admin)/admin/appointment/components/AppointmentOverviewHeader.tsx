'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './appointment-overview-header.module.css';

export function AppointmentOverviewHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Appointment Overview</h4>
      <Breadcrumbs
        items={[
          { label: 'Hospital', href: '/admin' },
          { label: 'Appointment Overview' },
        ]}
        homeHref="/admin"
      />
    </div>
  );
}

