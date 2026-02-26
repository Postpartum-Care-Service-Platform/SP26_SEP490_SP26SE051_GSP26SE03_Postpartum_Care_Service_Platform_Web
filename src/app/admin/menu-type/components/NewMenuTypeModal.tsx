'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { forwardRef, useEffect, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import menuTypeService from '@/services/menu-type.service';
import type {
  CreateMenuTypeRequest,
  MenuType,
  UpdateMenuTypeRequest,
} from '@/types/menu-type';

import styles from './new-menu-type-modal.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  menuTypeToEdit?: MenuType | null;
};

const INITIAL_FORM_DATA: CreateMenuTypeRequest = {
  name: '',
  isActive: true,
};

type FormErrors = {
  name?: string;
};

const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <input {...props} ref={ref} className={`${styles.formControl} ${className || ''}`} />;
  }
);
CustomInput.displayName = 'CustomInput';

export function NewMenuTypeModal({ open, onOpenChange, onSuccess, menuTypeToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateMenuTypeRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditMode = !!menuTypeToEdit;

  useEffect(() => {
    if (open) {
      if (menuTypeToEdit) {
        setFormData({
          name: menuTypeToEdit.name,
          isActive: menuTypeToEdit.isActive,
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [open, menuTypeToEdit]);

  const handleFieldChange = <K extends keyof CreateMenuTypeRequest>(field: K, value: CreateMenuTypeRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên loại không được để trống.';
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

      if (isEditMode && menuTypeToEdit) {
        const updatePayload: UpdateMenuTypeRequest = {
          name: formData.name,
          isActive: formData.isActive,
        };
        await menuTypeService.updateMenuType(menuTypeToEdit.id, updatePayload);
        toast({ title: 'Cập nhật loại thực đơn thành công', variant: 'success' });
      } else {
        await menuTypeService.createMenuType(formData);
        toast({ title: 'Tạo loại thực đơn thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        isEditMode ? 'Cập nhật loại thực đơn thất bại' : 'Tạo loại thực đơn thất bại',
      );

      if (
        errorMessage.includes('tồn tại') ||
        errorMessage.includes('đã tồn tại') ||
        errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('duplicate')
      ) {
        setErrors({ name: 'Tên loại thực đơn đã tồn tại.' });
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
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa loại thực đơn' : 'Thêm loại thực đơn mới'}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="name">
                Tên loại <span className={styles.required}>*</span>
              </label>
              <CustomInput
                id="name"
                placeholder="Ví dụ: Bữa sáng, Bữa trưa, Bữa tối"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={errors.name ? styles.invalid : ''}
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
