'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import paymentTypeService from '@/services/payment-type.service';
import type { PaymentType, CreatePaymentTypeRequest, UpdatePaymentTypeRequest } from '@/types/payment-type';

import styles from './payment-type-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: PaymentType | null;
  onSuccess?: () => void;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  const errObj = error as Record<string, any>;
  return errObj?.message || errObj?.error || errObj?.data?.message || errObj?.data?.error || fallback;
};

export function PaymentTypeModal({ open, onOpenChange, item, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreatePaymentTypeRequest>({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!item;

  useEffect(() => {
    if (open) {
      if (item) {
        setFormData({
          name: item.name,
          description: item.description,
        });
      } else {
        setFormData({
          name: '',
          description: '',
        });
      }
      setErrors({});
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; description?: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Tên loại thanh toán không được để trống.';
    if (!formData.description.trim()) newErrors.description = 'Mô tả không được để trống.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditMode && item) {
        const payload: UpdatePaymentTypeRequest = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          isActive: item.isActive,
        };
        await paymentTypeService.update(item.id, payload);
        toast({ title: 'Cập nhật loại thanh toán thành công', variant: 'success' });
      } else {
        await paymentTypeService.create(formData);
        toast({ title: 'Tạo loại thanh toán thành công', variant: 'success' });
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
        onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa loại thanh toán' : 'Thêm loại thanh toán mới'}
          </h2>
          <button type="button" onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Đóng">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="ptName">Tên loại thanh toán <span className={styles.required}>*</span></label>
              <input id="ptName" className={`${styles.formControl} ${errors.name ? styles.invalid : ''}`}
                placeholder="Ví dụ: Tiền mặt, Chuyển khoản..."
                value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} autoFocus />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ptDesc">Mô tả <span className={styles.required}>*</span></label>
              <textarea id="ptDesc" className={`${styles.formControl} ${errors.description ? styles.invalid : ''}`}
                placeholder="Nhập mô tả ngắn gọn về phương thức này" rows={3}
                value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
              {errors.description && <p className={styles.errorMessage}>{errors.description}</p>}
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
