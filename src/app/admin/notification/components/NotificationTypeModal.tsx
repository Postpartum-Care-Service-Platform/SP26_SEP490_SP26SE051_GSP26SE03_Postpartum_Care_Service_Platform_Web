'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import notificationTypeService from '@/services/notification-type.service';
import type { NotificationType, CreateNotificationTypeRequest, UpdateNotificationTypeRequest } from '@/types/notification-type';

import styles from './notification-type-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: NotificationType | null;
  onSuccess?: () => void;
};

type FormErrors = {
  name?: string;
};

const INITIAL_FORM: CreateNotificationTypeRequest = {
  name: '',
  isActive: true,
};

export function NotificationTypeModal({ open, onOpenChange, type, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateNotificationTypeRequest>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!type;

  useEffect(() => {
    if (open) {
      if (type) {
        setFormData({
          name: type.name,
          isActive: type.isActive,
        });
      } else {
        setFormData(INITIAL_FORM);
      }
      setErrors({});
    }
  }, [open, type]);

  const handleFieldChange = <K extends keyof CreateNotificationTypeRequest>(field: K, value: CreateNotificationTypeRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Tên loại không được để trống.';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditMode && type) {
        const payload: UpdateNotificationTypeRequest = {
          name: formData.name.trim(),
          isActive: formData.isActive,
        };
        await notificationTypeService.updateNotificationType(type.id, payload);
        toast({ title: 'Cập nhật loại thông báo thành công', variant: 'success' });
      } else {
        await notificationTypeService.createNotificationType({
          name: formData.name.trim(),
          isActive: formData.isActive,
        });
        toast({ title: 'Tạo loại thông báo thành công', variant: 'success' });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.message || (isEditMode ? 'Cập nhật loại thông báo thất bại' : 'Tạo loại thông báo thất bại');
      if (msg.toLowerCase().includes('tồn tại') || msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('exists')) {
        setErrors({ name: 'Tên loại thông báo đã tồn tại.' });
      } else {
        toast({ title: msg, variant: 'error' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa loại thông báo' : 'Thêm loại thông báo mới'}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="notification-type-name">
                Tên loại <span className={styles.required}>*</span>
              </label>
              <input
                id="notification-type-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Ví dụ: Thông báo lịch hẹn"
                className={`${styles.formControl} ${errors.name ? styles.invalid : ''}`}
                required
              />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Hoạt động</span>
              </label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonOutline}`}
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

