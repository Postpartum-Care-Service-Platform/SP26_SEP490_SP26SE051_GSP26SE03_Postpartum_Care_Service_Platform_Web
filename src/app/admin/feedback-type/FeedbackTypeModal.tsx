'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useEffect, useState, forwardRef } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import feedbackTypeService from '@/services/feedback-type.service';
import type { FeedbackType } from '@/types/feedback-type';

import styles from './feedback-type-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  itemToEdit?: FeedbackType | null;
};

interface FormErrors {
  name?: string;
}

const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input {...props} ref={ref} className={`${styles.formControl} ${className || ''}`} />
  ),
);
CustomInput.displayName = 'CustomInput';

export function FeedbackTypeModal({ open, onOpenChange, onSuccess, itemToEdit }: Props) {
  const { toast } = useToast();
  const [name, setName]           = useState('');
  const [errors, setErrors]       = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!itemToEdit;

  useEffect(() => {
    if (open) {
      setName(itemToEdit?.name ?? '');
      setErrors({});
    }
  }, [open, itemToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrors({ name: 'Tên loại phản hồi không được để trống.' });
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditMode && itemToEdit) {
        await feedbackTypeService.updateFeedbackType(itemToEdit.id, { name: name.trim() });
        toast({ title: 'Cập nhật loại phản hồi thành công', variant: 'success' });
      } else {
        await feedbackTypeService.createFeedbackType({ name: name.trim() });
        toast({ title: 'Thêm loại phản hồi thành công', variant: 'success' });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const fallback = isEditMode ? 'Cập nhật thất bại' : 'Thêm mới thất bại';
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err &&
            typeof (err as { message?: unknown }).message === 'string'
          ? (err as { message: string }).message
          : fallback;

      if (
        message.toLowerCase().includes('tồn tại') ||
        message.toLowerCase().includes('exists') ||
        message.toLowerCase().includes('duplicate')
      ) {
        setErrors({ name: 'Tên loại phản hồi đã tồn tại.' });
      } else {
        toast({ title: message || fallback, variant: 'error' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-type-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 id="feedback-type-modal-title" className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa loại phản hồi' : 'Thêm loại phản hồi mới'}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={styles.closeButton}
            aria-label="Đóng"
          >
            <Cross1Icon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="feedbackTypeName">
                Tên loại phản hồi <span className={styles.required}>*</span>
              </label>
              <CustomInput
                id="feedbackTypeName"
                placeholder="Ví dụ: Dịch vụ, Nhân viên, Cơ sở vật chất..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({});
                }}
                className={errors.name ? styles.invalid : ''}
                autoFocus
              />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonOutline}`}
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonPrimary}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
