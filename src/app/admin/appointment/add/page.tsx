'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from '../add-appointment.module.css';
import { AddAppointmentForm } from '../components/AddAppointmentForm';

const breadcrumbItems = [
  { label: 'Hospital', href: '/admin' },
  { label: 'All Appointment', href: '/admin/appointment' },
  { label: 'Add Appointment' },
];

export default function AddAppointmentPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h4 className={styles.title}>Add Appointment</h4>
        <Breadcrumbs items={breadcrumbItems} homeHref="/admin" />
      </div>
      <AddAppointmentForm />
    </div>
  );
}

