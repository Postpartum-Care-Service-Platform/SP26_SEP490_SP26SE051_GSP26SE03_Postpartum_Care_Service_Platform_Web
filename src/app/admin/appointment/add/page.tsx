'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

import styles from '../add-appointment.module.css';
import { AddAppointmentForm } from '../components/AddAppointmentForm';

const breadcrumbItems = [
  { label: 'Lịch hẹn', href: '/admin/appointment' },
  { label: 'Thêm lịch hẹn' },
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

