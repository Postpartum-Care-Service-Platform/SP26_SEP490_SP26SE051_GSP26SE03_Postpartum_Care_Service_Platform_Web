'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useState, useEffect, forwardRef } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import packageService from '@/services/package.service';
import type { CreatePackageRequest, Package, UpdatePackageRequest } from '@/types/package';

import styles from './new-package-modal.module.css';


type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  packageToEdit?: Package | null;
};

const INITIAL_FORM_DATA: CreatePackageRequest = {
  packageName: '',
  description: '',
  durationDays: 14,
  basePrice: 2000000,
  isActive: true,
};

type FormErrors = {
  packageName?: string;
  durationDays?: string;
  basePrice?: string;
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

export function NewPackageModal({ open, onOpenChange, onSuccess, packageToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreatePackageRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditMode = !!packageToEdit;

  useEffect(() => {
    if (open) {
      if (packageToEdit) {
        setFormData({
          packageName: packageToEdit.packageName,
          description: packageToEdit.description || '',
          durationDays: packageToEdit.durationDays,
          basePrice: packageToEdit.basePrice,
          isActive: packageToEdit.isActive,
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [open, packageToEdit]);

  const handleFieldChange = <K extends keyof CreatePackageRequest>(field: K, value: CreatePackageRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.packageName.trim()) {
      newErrors.packageName = 'Tên gói không được để trống.';
    }

    if (formData.durationDays <= 0) {
      newErrors.durationDays = 'Thời hạn phải là số dương.';
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'Giá cơ bản phải là số dương.';
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

      if (isEditMode && packageToEdit) {
        const updatePayload: UpdatePackageRequest = {
          packageName: formData.packageName,
          description: formData.description,
          durationDays: formData.durationDays,
          basePrice: formData.basePrice,
          isActive: formData.isActive,
        };
        await packageService.updatePackage(packageToEdit.id, updatePayload);
        toast({ title: 'Cập nhật gói dịch vụ thành công', variant: 'success' });
      } else {
        await packageService.createPackage(formData);
        toast({ title: 'Tạo gói dịch vụ thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const fallbackMessage = isEditMode ? 'Cập nhật gói thất bại' : 'Tạo gói thất bại';
      const rawMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : fallbackMessage;

      const errorMessage = rawMessage || fallbackMessage;

      if (
        errorMessage.includes('tồn tại') ||
        errorMessage.includes('đã tồn tại') ||
        errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('duplicate')
      ) {
        setErrors({ packageName: 'Tên gói dịch vụ đã tồn tại.' });
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
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa gói dịch vụ' : 'Thêm gói dịch vụ mới'}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="packageName">
                  Tên gói <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="packageName"
                  placeholder="Ví dụ: 14-VIP, 28-PRO"
                  value={formData.packageName}
                  onChange={(e) => handleFieldChange('packageName', e.target.value)}
                  className={errors.packageName ? styles.invalid : ''}
                  required
                />
                {errors.packageName && <p className={styles.errorMessage}>{errors.packageName}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="durationDays">
                  Thời hạn (số ngày) <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="durationDays"
                  type="number"
                  value={formData.durationDays}
                  onChange={(e) => handleFieldChange('durationDays', parseInt(e.target.value, 10) || 0)}
                  className={errors.durationDays ? styles.invalid : ''}
                  required
                />
                {errors.durationDays && <p className={styles.errorMessage}>{errors.durationDays}</p>}
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="basePrice">
                Giá cơ bản (VND) <span className={styles.required}>*</span>
              </label>
              <CustomInput
                id="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={(e) => handleFieldChange('basePrice', parseInt(e.target.value, 10) || 0)}
                className={errors.basePrice ? styles.invalid : ''}
                required
              />
              {errors.basePrice && <p className={styles.errorMessage}>{errors.basePrice}</p>}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="description">Mô tả</label>
              <CustomTextarea
                id="description"
                placeholder="Mô tả ngắn về gói dịch vụ..."
                value={formData.description}
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
