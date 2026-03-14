'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useState, useEffect, forwardRef } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import roleService from '@/services/role.service';
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '@/types/role';

import styles from './role-modal.module.css';


type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  roleToEdit?: Role | null;
};

const INITIAL_FORM_DATA: CreateRoleRequest = {
  roleName: '',
  description: '',
};

type FormErrors = {
  roleName?: string;
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

export function RoleModal({ open, onOpenChange, onSuccess, roleToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateRoleRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditMode = !!roleToEdit;

  useEffect(() => {
    if (open) {
      if (roleToEdit) {
        setFormData({
          roleName: roleToEdit.roleName,
          description: roleToEdit.description || '',
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [open, roleToEdit]);

  const handleFieldChange = <K extends keyof CreateRoleRequest>(field: K, value: CreateRoleRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.roleName.trim()) {
      newErrors.roleName = 'Ten vai tro khong duoc de trong.';
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

      if (isEditMode && roleToEdit) {
        const updatePayload: UpdateRoleRequest = {
          roleName: formData.roleName,
          description: formData.description,
        };
        await roleService.updateRole(roleToEdit.id, updatePayload);
        toast({ title: 'Cap nhat vai tro thanh cong', variant: 'success' });
      } else {
        await roleService.createRole(formData);
        toast({ title: 'Tao vai tro thanh cong', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const fallbackMessage = isEditMode ? 'Cap nhat vai tro that bai' : 'Tao vai tro that bai';
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
        errorMessage.includes('ton tai') ||
        errorMessage.includes('da ton tai') ||
        errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('duplicate')
      ) {
        setErrors({ roleName: 'Ten vai tro da ton tai.' });
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

  const editTitle = 'Chinh sua vai tro';
  const addTitle = 'Them vai tro moi';

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isEditMode ? editTitle : addTitle}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="roleName">
                  Ten vai tro <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="roleName"
                  placeholder="Vi du: Admin, Manager, Staff"
                  value={formData.roleName}
                  onChange={(e) => handleFieldChange('roleName', e.target.value)}
                  className={errors.roleName ? styles.invalid : ''}
                  required
                />
                {errors.roleName && <p className={styles.errorMessage}>{errors.roleName}</p>}
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="description">Mo ta</label>
              <CustomTextarea
                id="description"
                placeholder="Mo ta ve vai tro..."
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
              Huy
            </button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
              {isSubmitting ? 'Dang xu ly...' : isEditMode ? 'Cap nhat' : 'Them moi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
