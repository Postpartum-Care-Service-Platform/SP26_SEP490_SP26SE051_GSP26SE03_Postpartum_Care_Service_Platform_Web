'use client';

import { useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
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

type Props = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function AddAppointmentForm({ onCancel, onSuccess }: Props) {
  const [values, setValues] = useState<FormValues>({
    customerId: '',
    name: '',
    date: '',
    time: '',
    appointmentTypeId: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange =
    (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = field === 'appointmentTypeId' ? Number(event.target.value) : event.target.value;
      setValues((prev) => ({ ...prev, [field]: value as never }));
    };

  const normalizeTimeForApi = (rawTime: string): string => {
    if (!rawTime) return rawTime;
    return /^\d{2}:\d{2}$/.test(rawTime) ? `${rawTime}:00` : rawTime;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: CreateCustomerAppointmentRequest = {
        customerId: values.customerId,
        name: values.name,
        date: values.date,
        time: normalizeTimeForApi(values.time),
        appointmentTypeId: values.appointmentTypeId,
      };

      await appointmentService.createAppointmentForCustomer(payload);
      toast({ title: 'Tạo lịch hẹn thành công', variant: 'success' });
      setValues({
        customerId: '',
        name: '',
        date: '',
        time: '',
        appointmentTypeId: 1,
      });
      onSuccess?.();
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: unknown }).message)
          : 'Tạo lịch hẹn thất bại. Vui lòng thử lại.';
      toast({ title: message, variant: 'error' });
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
        <button type="button" onClick={onCancel} className={styles.secondaryButton}>
          Hủy
        </button>
        <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu lịch hẹn'}
        </button>
      </div>
    </form>
  );
}

