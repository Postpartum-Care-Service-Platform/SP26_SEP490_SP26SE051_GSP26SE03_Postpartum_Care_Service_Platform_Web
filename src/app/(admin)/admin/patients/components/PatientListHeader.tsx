'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from './patient-list-header.module.css';

export function PatientListHeader() {
  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Patient List</h4>
      <Breadcrumbs
        items={[
          { label: 'Hospital', href: '/admin' },
          { label: 'Patient List' },
        ]}
      />
    </div>
  );
}

