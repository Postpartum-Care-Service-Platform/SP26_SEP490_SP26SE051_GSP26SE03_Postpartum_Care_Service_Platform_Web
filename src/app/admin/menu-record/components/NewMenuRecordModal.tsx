'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useState, useEffect, forwardRef } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import menuRecordService from '@/services/menu-record.service';
import type { CreateMenuRecordRequest, MenuRecord, UpdateMenuRecordRequest } from '@/types/menu-record';

import styles from './new-menu-record-modal.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
};


type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  menuRecordToEdit?: MenuRecord | null;
};

const INITIAL_FORM_DATA: CreateMenuRecordRequest = {
  accountId: '',
  menuId: 0,
  name: '',
  date: '',
  isActive: true,
};

type FormErrors = {
  accountId?: string;
  menuId?: string;
  name?: string;
  date?: string;
};

const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <input {...props} ref={ref} className={`${styles.formControl} ${className || ''}`} />;
  }
);
CustomInput.displayName = 'CustomInput';

export function NewMenuRecordModal({ open, onOpenChange, onSuccess, menuRecordToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateMenuRecordRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditMode = !!menuRecordToEdit;

  useEffect(() => {
    if (open) {
      if (menuRecordToEdit) {
        setFormData({
          accountId: menuRecordToEdit.accountId,
          menuId: menuRecordToEdit.menuId,
          name: menuRecordToEdit.name,
          date: menuRecordToEdit.date,
          isActive: menuRecordToEdit.isActive,
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          ...INITIAL_FORM_DATA,
          date: today,
        });
      }
      setErrors({});
    }
  }, [open, menuRecordToEdit]);

  const handleFieldChange = <K extends keyof CreateMenuRecordRequest>(field: K, value: CreateMenuRecordRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.accountId.trim()) {
      newErrors.accountId = 'Account ID không được để trống.';
    }

    if (!formData.menuId || formData.menuId <= 0) {
      newErrors.menuId = 'Menu ID phải là số dương.';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Tên không được để trống.';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Ngày không được để trống.';
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

      if (isEditMode && menuRecordToEdit) {
        const updatePayload: UpdateMenuRecordRequest = {
          accountId: formData.accountId,
          menuId: formData.menuId,
          name: formData.name,
          date: formData.date,
          isActive: formData.isActive,
        };
        await menuRecordService.updateMenuRecord(menuRecordToEdit.id, updatePayload);
        toast({ title: 'Cập nhật bản ghi thực đơn thành công', variant: 'success' });
      } else {
        await menuRecordService.createMenuRecord(formData);
        toast({ title: 'Tạo bản ghi thực đơn thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(
          error,
          isEditMode ? 'Cập nhật bản ghi thực đơn thất bại' : 'Tạo bản ghi thực đơn thất bại',
        ),
        variant: 'error',
      });
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
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa bản ghi thực đơn' : 'Thêm bản ghi thực đơn mới'}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="accountId">
                  Account ID <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="accountId"
                  placeholder="Nhập Account ID"
                  value={formData.accountId}
                  onChange={(e) => handleFieldChange('accountId', e.target.value)}
                  className={errors.accountId ? styles.invalid : ''}
                  required
                />
                {errors.accountId && <p className={styles.errorMessage}>{errors.accountId}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="menuId">
                  Menu ID <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="menuId"
                  type="number"
                  placeholder="Nhập Menu ID"
                  value={formData.menuId || ''}
                  onChange={(e) => handleFieldChange('menuId', parseInt(e.target.value, 10) || 0)}
                  className={errors.menuId ? styles.invalid : ''}
                  required
                />
                {errors.menuId && <p className={styles.errorMessage}>{errors.menuId}</p>}
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="name">
                Tên <span className={styles.required}>*</span>
              </label>
              <CustomInput
                id="name"
                placeholder="Ví dụ: Buổi trưa vui vẻ"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={errors.name ? styles.invalid : ''}
                required
              />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="date">
                Ngày <span className={styles.required}>*</span>
              </label>
              <CustomInput
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                className={errors.date ? styles.invalid : ''}
                required
              />
              {errors.date && <p className={styles.errorMessage}>{errors.date}</p>}
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
