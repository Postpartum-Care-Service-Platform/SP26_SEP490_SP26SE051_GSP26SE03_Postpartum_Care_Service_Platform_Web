'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { forwardRef, useEffect, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import activityService from '@/services/activity.service';
import type { Activity, CreateActivityRequest, UpdateActivityRequest } from '@/types/activity';

import styles from './new-activity-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  activityToEdit?: Activity | null;
};

const INITIAL_FORM_DATA: CreateActivityRequest = {
  name: '',
  description: '',
  isActive: true,
} as CreateActivityRequest;

type FormErrors = {
  name?: string;
  description?: string;
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

export function NewActivityModal({ open, onOpenChange, onSuccess, activityToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateActivityRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditMode = !!activityToEdit;

  useEffect(() => {
    if (open) {
      if (activityToEdit) {
        setFormData({
          name: (activityToEdit.name as string) || '',
          description: (activityToEdit.description as string) || '',
          isActive: (activityToEdit.isActive as boolean) ?? true,
        } as CreateActivityRequest);
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [open, activityToEdit]);

  const handleFieldChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    const name = formData.name as string;
    if (!name || !name.trim()) {
      newErrors.name = 'Tên hoạt động không được để trống.';
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

    try {
      setIsSubmitting(true);
      setErrors({});

      if (isEditMode && activityToEdit) {
        const updatePayload: UpdateActivityRequest = {
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
        };
        await activityService.updateActivity(activityToEdit.id, updatePayload);
        toast({ title: 'Cập nhật hoạt động thành công', variant: 'success' });
      } else {
        await activityService.createActivity(formData);
        toast({ title: 'Tạo hoạt động thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      let errorMessage: string;

      if (err instanceof Error && err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else {
        errorMessage = isEditMode ? 'Cập nhật hoạt động thất bại' : 'Tạo hoạt động thất bại';
      }

      if (
        errorMessage.includes('tồn tại') ||
        errorMessage.includes('đã tồn tại') ||
        errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('duplicate')
      ) {
        setErrors({ name: 'Tên hoạt động đã tồn tại.' });
      } else {
        toast({ title: errorMessage, variant: 'error' });
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
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động mới'}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="name">
                Tên hoạt động <span className={styles.required}>*</span>
              </label>
              <CustomInput
                id="name"
                placeholder="Nhập tên hoạt động"
                value={(formData.name as string) || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={errors.name ? styles.invalid : ''}
                required
              />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Mô tả</label>
              <CustomTextarea
                id="description"
                placeholder="Mô tả về hoạt động..."
                value={(formData.description as string) || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className={errors.description ? styles.invalid : ''}
                rows={4}
              />
              {errors.description && <p className={styles.errorMessage}>{errors.description}</p>}
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.button} ${styles.buttonOutline}`} onClick={() => onOpenChange(false)} disabled={isSubmitting}>
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
