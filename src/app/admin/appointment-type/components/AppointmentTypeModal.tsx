'use client';

import { useEffect, useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';

import { useToast } from '@/components/ui/toast/use-toast';
import appointmentTypeService from '@/services/appointment-type.service';
import type { AppointmentTypeDetail, CreateAppointmentTypeRequest, UpdateAppointmentTypeRequest } from '@/types/appointment-type';

import styles from './appointment-type-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: AppointmentTypeDetail | null;
  onSuccess?: () => void;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error &&
    typeof (error as { message?: unknown }).message === 'string')
    return (error as { message: string }).message;
  return fallback;
};

export function AppointmentTypeModal({ open, onOpenChange, item, onSuccess }: Props) {
  const { toast } = useToast();
  const [name, setName]             = useState('');
  const [nameError, setNameError]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!item;

  useEffect(() => {
    if (open) {
      setName(item ? item.name : '');
      setNameError('');
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Tên loại lịch hẹn không được để trống.'); return; }

    try {
      setIsSubmitting(true);
      if (isEditMode && item) {
        const payload: UpdateAppointmentTypeRequest = { name: name.trim() };
        await appointmentTypeService.updateAppointmentType(item.id, payload);
        toast({ title: 'Cập nhật loại lịch hẹn thành công', variant: 'success' });
      } else {
        const payload: CreateAppointmentTypeRequest = { name: name.trim() };
        await appointmentTypeService.createAppointmentType(payload);
        toast({ title: 'Tạo loại lịch hẹn thành công', variant: 'success' });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, 'Có lỗi xảy ra'), variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div className={styles.modalContent} role="dialog" aria-modal="true"
        aria-labelledby="appt-type-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 id="appt-type-modal-title" className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa loại lịch hẹn' : 'Thêm loại lịch hẹn mới'}
          </h2>
          <button type="button" onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Đóng">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="apptTypeName">Tên loại lịch hẹn <span className={styles.required}>*</span></label>
              <input id="apptTypeName" className={`${styles.formControl} ${nameError ? styles.invalid : ''}`}
                placeholder="Ví dụ: Tư vấn trực tiếp, Khám định kỳ..."
                value={name} onChange={(e) => { setName(e.target.value); setNameError(''); }} autoFocus />
              {nameError && <p className={styles.errorMessage}>{nameError}</p>}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.button} ${styles.buttonOutline}`}
              onClick={() => onOpenChange(false)} disabled={isSubmitting}>Hủy</button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
