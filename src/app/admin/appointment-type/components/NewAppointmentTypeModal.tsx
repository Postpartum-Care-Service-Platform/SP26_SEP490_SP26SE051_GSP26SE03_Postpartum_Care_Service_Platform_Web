'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { forwardRef, useEffect, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import appointmentTypeService from '@/services/appointment-type.service';
import type {
  AppointmentTypeDetail,
  CreateAppointmentTypeRequest,
  UpdateAppointmentTypeRequest,
} from '@/types/appointment-type';

import styles from './new-appointment-type-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  appointmentTypeToEdit?: AppointmentTypeDetail | null;
};

const INITIAL_FORM_DATA: CreateAppointmentTypeRequest = {
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

export function NewAppointmentTypeModal({ open, onOpenChange, onSuccess, appointmentTypeToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateAppointmentTypeRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditMode = !!appointmentTypeToEdit;

  useEffect(() => {
    if (open) {
      if (appointmentTypeToEdit) {
        setFormData({
          name: appointmentTypeToEdit.name,
          isActive: appointmentTypeToEdit.isActive,
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [open, appointmentTypeToEdit]);

  const handleFieldChange = <K extends keyof CreateAppointmentTypeRequest>(field: K, value: CreateAppointmentTypeRequest[K]) => {
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

      if (isEditMode && appointmentTypeToEdit) {
        const updatePayload: UpdateAppointmentTypeRequest = {
          name: formData.name,
          isActive: formData.isActive,
        };
        await appointmentTypeService.updateAppointmentType(appointmentTypeToEdit.id, updatePayload);
        toast({ title: 'Cập nhật loại lịch hẹn thành công', variant: 'success' });
      } else {
        await appointmentTypeService.createAppointmentType(formData);
        toast({ title: 'Tạo loại lịch hẹn thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : isEditMode
            ? 'Cập nhật loại lịch hẹn thất bại'
            : 'Tạo loại lịch hẹn thất bại';

      if (errorMessage.includes('tồn tại') || errorMessage.includes('đã tồn tại') || errorMessage.toLowerCase().includes('exists') || errorMessage.toLowerCase().includes('duplicate')) {
        setErrors({ name: 'Tên loại lịch hẹn đã tồn tại.' });
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
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa loại lịch hẹn' : 'Thêm loại lịch hẹn mới'}</h2>
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
                placeholder="Ví dụ: Đặt lịch thăm quan trung tâm"
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
