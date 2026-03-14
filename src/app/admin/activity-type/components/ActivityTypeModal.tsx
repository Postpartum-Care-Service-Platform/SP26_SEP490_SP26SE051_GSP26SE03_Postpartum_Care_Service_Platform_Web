'use client';

import { useEffect, useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';

import { useToast } from '@/components/ui/toast/use-toast';
import activityTypeService from '@/services/activity-type.service';
import type { ActivityType, CreateActivityTypeRequest, UpdateActivityTypeRequest } from '@/types/activity-type';

import styles from './activity-type-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ActivityType | null;
  onSuccess?: () => void;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error &&
    typeof (error as { message?: unknown }).message === 'string')
    return (error as { message: string }).message;
  return fallback;
};

export function ActivityTypeModal({ open, onOpenChange, item, onSuccess }: Props) {
  const { toast } = useToast();
  const [name, setName]                   = useState('');
  const [description, setDescription]     = useState('');
  const [nameError, setNameError]         = useState('');
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const isEditMode = !!item;

  useEffect(() => {
    if (open) {
      setName(item ? item.name : '');
      setDescription(item ? (item.description ?? '') : '');
      setNameError('');
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Tên loại hoạt động không được để trống.'); return; }

    try {
      setIsSubmitting(true);
      if (isEditMode && item) {
        const payload: UpdateActivityTypeRequest = { name: name.trim(), description: description.trim() };
        await activityTypeService.updateActivityType(item.id, payload);
        toast({ title: 'Cập nhật loại hoạt động thành công', variant: 'success' });
      } else {
        const payload: CreateActivityTypeRequest = { name: name.trim(), description: description.trim() };
        await activityTypeService.createActivityType(payload);
        toast({ title: 'Tạo loại hoạt động thành công', variant: 'success' });
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
        aria-labelledby="activity-type-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 id="activity-type-modal-title" className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa loại hoạt động' : 'Thêm loại hoạt động mới'}
          </h2>
          <button type="button" onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Đóng">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="activityTypeName">Tên loại hoạt động <span className={styles.required}>*</span></label>
              <input
                id="activityTypeName"
                className={`${styles.formControl} ${nameError ? styles.invalid : ''}`}
                placeholder="Ví dụ: Center, Home, Center&Home..."
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(''); }}
                autoFocus
              />
              {nameError && <p className={styles.errorMessage}>{nameError}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="activityTypeDescription">Mô tả</label>
              <textarea
                id="activityTypeDescription"
                className={styles.formControl}
                placeholder="Mô tả ngắn về loại hoạt động..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
