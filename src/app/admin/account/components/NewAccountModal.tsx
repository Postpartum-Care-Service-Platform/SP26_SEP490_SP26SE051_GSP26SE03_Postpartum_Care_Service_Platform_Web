'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { forwardRef, useEffect, useState } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast/use-toast';
import authService from '@/services/auth.service';

import styles from './new-account-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

type CreateCustomerRequest = {
  email: string;
  phone: string;
  username: string;
};

type FormErrors = {
  email?: string;
  phone?: string;
  username?: string;
};

type ApiClientError = {
  status?: number;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

function getApiErrorMessage(err: unknown, fallback: string) {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as ApiClientError).message === 'string') {
    return (err as ApiClientError).message as string;
  }

  if (err instanceof Error && err.message) return err.message;

  return fallback;
}

function mapMessageToFieldErrors(message: string): FormErrors {
  const m = message.toLowerCase();
  const next: FormErrors = {};

  if (m.includes('email')) next.email = message;
  if (m.includes('số điện thoại') || m.includes('so dien thoai') || m.includes('phone')) {
    next.phone = message;
  }

  if (m.includes('username') || m.includes('tên đăng nhập') || m.includes('ten dang nhap')) {
    // Chuẩn hoá thông báo sang tiếng Việt cho username
    if (m.includes('đã tồn tại') || m.includes('da ton tai')) {
      next.username = 'Tên đăng nhập đã tồn tại';
    } else {
      next.username = message.replace(/username/gi, 'Tên đăng nhập');
    }
  }

  return next;
}

const INITIAL_FORM_DATA: CreateCustomerRequest = {
  email: '',
  phone: '',
  username: '',
};

const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <input {...props} ref={ref} className={`${styles.formControl} ${className || ''}`} />;
  }
);
CustomInput.displayName = 'CustomInput';

export function NewAccountModal({ open, onOpenChange, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateCustomerRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
    }
  }, [open]);

  const handleFieldChange = <K extends keyof CreateCustomerRequest>(field: K, value: CreateCustomerRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống.';
    } else if (!/^[0-9+\-\s]{8,20}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ.';
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

      await authService.createCustomer({
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        username: formData.username.trim(),
      });

      toast({ title: 'Tạo tài khoản thành công', variant: 'success' });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Tạo tài khoản thất bại');
      const fieldErrors = mapMessageToFieldErrors(msg);

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Thêm tài khoản mới</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="username">
                  Tên đăng nhập <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="username"
                  placeholder="Ví dụ: nguyenvana"
                  value={formData.username}
                  onChange={(e) => handleFieldChange('username', e.target.value)}
                  className={errors.username ? styles.invalid : ''}
                  required
                />
                {errors.username && <p className={styles.errorMessage}>{errors.username}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">
                  Số điện thoại <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="phone"
                  placeholder="Ví dụ: 0901234567"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className={errors.phone ? styles.invalid : ''}
                  required
                />
                {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="email">
                Email <span className={styles.required}>*</span>
              </label>
              <CustomInput
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className={errors.email ? styles.invalid : ''}
                required
              />
              {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
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
              {isSubmitting ? <Spinner size="sm" /> : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
