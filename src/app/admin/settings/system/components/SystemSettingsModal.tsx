'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useState, useEffect, forwardRef } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import systemSettingService from '@/services/system-setting.service';
import type { SystemSetting } from '../page';

import styles from './system-settings-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  settingToEdit?: SystemSetting | null;
};

type FormErrors = {
  value?: string;
};

const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <input {...props} ref={ref} className={`${styles.formControl} ${className || ''}`} />;
  }
);
CustomInput.displayName = 'CustomInput';

const CustomTextarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return <textarea {...props} ref={ref} className={`${styles.formControl} ${className || ''}`} data-type="textarea" />;
  }
);
CustomTextarea.displayName = 'CustomTextarea';

export function SystemSettingsModal({ open, onOpenChange, onSuccess, settingToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<{ value: string }>({ value: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      if (settingToEdit) {
        setFormData({
          value: settingToEdit.value,
        });
      } else {
        setFormData({ value: '' });
      }
      setErrors({});
    }
  }, [open, settingToEdit]);

  const handleFieldChange = (value: string) => {
    setFormData({ value });
    if (errors.value) {
      setErrors((prev) => ({ ...prev, value: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.value.trim()) {
      newErrors.value = 'Giá trị không được để trống.';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (!settingToEdit) return;

    try {
      setIsSubmitting(true);
      setErrors({});

      await systemSettingService.updateSetting(settingToEdit.key, formData.value);
      toast({ title: 'Cập nhật cấu hình thành công', variant: 'success' });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const fallbackMessage = 'Cập nhật cấu hình thất bại';
      const rawMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : fallbackMessage;

      toast({ title: rawMessage || fallbackMessage, variant: 'error' });
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
          <h2 className={styles.modalTitle}>Chỉnh sửa cấu hình</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="settingKey">Key</label>
              <CustomInput
                id="settingKey"
                value={settingToEdit?.key || ''}
                disabled
                className={styles.disabledInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="settingDescription">Mô tả</label>
              <CustomInput
                id="settingDescription"
                value={settingToEdit?.description || '-'}
                disabled
                className={styles.disabledInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="settingDataType">Kiểu dữ liệu</label>
              <CustomInput
                id="settingDataType"
                value={settingToEdit?.dataType || ''}
                disabled
                className={styles.disabledInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="settingValue">
                Giá trị <span className={styles.required}>*</span>
              </label>
              {settingToEdit?.dataType === 'string' || settingToEdit?.dataType === 'number' ? (
                <CustomInput
                  id="settingValue"
                  type={settingToEdit?.dataType === 'number' ? 'number' : 'text'}
                  value={formData.value}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  className={errors.value ? styles.invalid : ''}
                  required
                />
              ) : (
                <CustomTextarea
                  id="settingValue"
                  value={formData.value}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  className={errors.value ? styles.invalid : ''}
                  rows={4}
                  required
                />
              )}
              {errors.value && <p className={styles.errorMessage}>{errors.value}</p>}
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
              {isSubmitting ? 'Đang xử lý...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
