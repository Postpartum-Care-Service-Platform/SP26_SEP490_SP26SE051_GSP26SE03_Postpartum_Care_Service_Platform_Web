'use client';

import Link from 'next/link';
import { useState } from 'react';

import appointmentService from '@/services/appointment.service';
import type { CreateCustomerAppointmentRequest } from '@/types/appointment';

import styles from '../add-appointment.module.css';

type FormValues = {
  customerId: string;
  name: string;
  date: string;
  time: string;
  appointmentTypeId: number;
};

export function AddAppointmentForm() {
  const [values, setValues] = useState<FormValues>({
    customerId: '',
    name: '',
    date: '',
    time: '',
    appointmentTypeId: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = field === 'appointmentTypeId' ? Number(event.target.value) : event.target.value;
      setValues((prev) => ({ ...prev, [field]: value as never }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: CreateCustomerAppointmentRequest = {
        customerId: values.customerId,
        name: values.name,
        date: values.date,
        time: values.time,
        appointmentTypeId: values.appointmentTypeId,
      };

      await appointmentService.createAppointmentForCustomer(payload);
      setValues({
        customerId: '',
        name: '',
        date: '',
        time: '',
        appointmentTypeId: 1,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.sectionCard}>
        <p className={styles.sectionTitle}>Add Appointment</p>
        <div className={styles.gridTwo}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="customerId">
              Customer ID
            </label>
            <input
              id="customerId"
              className={styles.input}
              placeholder="Nhập customerId"
              value={values.customerId}
              onChange={handleChange('customerId')}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Appointment Name
            </label>
            <input
              id="name"
              className={styles.input}
              placeholder="Nhập tên lịch hẹn"
              value={values.name}
              onChange={handleChange('name')}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              className={styles.input}
              value={values.date}
              onChange={handleChange('date')}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="time">
              Time
            </label>
            <input
              id="time"
              type="time"
              className={styles.input}
              value={values.time}
              onChange={handleChange('time')}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="appointmentTypeId">
              Appointment Type
            </label>
            <select
              id="appointmentTypeId"
              className={styles.select}
              value={values.appointmentTypeId}
              onChange={handleChange('appointmentTypeId')}
            >
              <option value={1}>Type 1</option>
              <option value={2}>Type 2</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/admin/appointment" className={styles.secondaryButton}>
          Cancel
        </Link>
        <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Appointment'}
        </button>
      </div>
    </form>
  );
}

