'use client';

import { ChevronDownIcon, Cross1Icon } from '@radix-ui/react-icons';
import { forwardRef, useEffect, useRef, useState } from 'react';

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
  price: null,
  target: 'Mom',
  activityTypeId: undefined,
  duration: undefined,
  status: 'Active',
};

type FormErrors = {
  name?: string;
  description?: string;
  duration?: string;
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

type DropdownOption = { value: string; label: string };

type CustomDropdownProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
};

function CustomDropdown({ id, value, onChange, options, placeholder }: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder ?? '';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className={styles.dropdownWrapper} ref={containerRef}>
      <button
        id={id}
        type="button"
        className={`${styles.dropdownTrigger} ${open ? styles.dropdownTriggerOpen : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selectedLabel}</span>
        <ChevronDownIcon className={`${styles.dropdownChevron} ${open ? styles.dropdownChevronOpen : ''}`} />
      </button>
      {open && (
        <ul className={styles.dropdownMenu} role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`${styles.dropdownItem} ${option.value === value ? styles.dropdownItemActive : ''}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
              {option.value === value && <span className={styles.dropdownItemCheck}>✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
          name: activityToEdit.name || '',
          description: activityToEdit.description || '',
          price: activityToEdit.price ?? null,
          target: activityToEdit.target || 'Mom',
          activityTypeId: activityToEdit.activityTypeId,
          duration: activityToEdit.duration,
          status: activityToEdit.status || 'Active',
        });
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

    if (!formData.name || !formData.name.trim()) {
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
          price: formData.price,
          target: formData.target,
          activityTypeId: formData.activityTypeId,
          duration: formData.duration,
          status: formData.status,
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
            {/* Tên hoạt động */}
            <div className={styles.formGroup}>
              <label htmlFor="activity-name">
                Tên hoạt động <span className={styles.required}>*</span>
              </label>
              <CustomInput
                id="activity-name"
                placeholder="Nhập tên hoạt động"
                value={formData.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={errors.name ? styles.invalid : ''}
                required
              />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>

            {/* Mô tả */}
            <div className={styles.formGroup}>
              <label htmlFor="activity-description">Mô tả</label>
              <CustomTextarea
                id="activity-description"
                placeholder="Mô tả về hoạt động..."
                value={formData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className={errors.description ? styles.invalid : ''}
                rows={4}
              />
              {errors.description && <p className={styles.errorMessage}>{errors.description}</p>}
            </div>

            {/* Đối tượng */}
            <div className={styles.formGroup}>
              <label htmlFor="activity-target">Đối tượng</label>
              <CustomDropdown
                id="activity-target"
                value={formData.target || 'Mom'}
                onChange={(val) => handleFieldChange('target', val)}
                options={[
                  { value: 'Mom', label: 'Mẹ' },
                  { value: 'Baby', label: 'Bé' },
                  { value: 'Both', label: 'Cả hai' },
                ]}
              />
            </div>

            {/* Thời lượng */}
            <div className={styles.formGroup}>
              <label htmlFor="activity-duration">Thời lượng (phút)</label>
              <CustomInput
                id="activity-duration"
                type="number"
                min={1}
                placeholder="Nhập thời lượng"
                value={formData.duration ?? ''}
                onChange={(e) => handleFieldChange('duration', e.target.value ? Number(e.target.value) : undefined)}
                className={errors.duration ? styles.invalid : ''}
              />
              {errors.duration && <p className={styles.errorMessage}>{errors.duration}</p>}
            </div>

            {/* Trạng thái */}
            <div className={styles.formGroup}>
              <label htmlFor="activity-status">Trạng thái</label>
              <CustomDropdown
                id="activity-status"
                value={formData.status || 'Active'}
                onChange={(val) => handleFieldChange('status', val)}
                options={[
                  { value: 'Active', label: 'Hoạt động' },
                  { value: 'Inactive', label: 'Tạm dừng' },
                ]}
              />
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
