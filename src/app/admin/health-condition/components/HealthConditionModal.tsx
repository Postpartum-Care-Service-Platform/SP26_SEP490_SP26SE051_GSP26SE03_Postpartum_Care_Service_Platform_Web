'use client';

import { Cross1Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useState, useEffect, forwardRef } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useToast } from '@/components/ui/toast/use-toast';
import healthConditionService from '@/services/health-condition.service';
import type { HealthCondition, HealthConditionCategory } from '@/types/health-record';

import styles from './health-condition-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  conditionToEdit?: HealthCondition | null;
  categories: HealthConditionCategory[];
};


const APPLIES_TO_OPTIONS = [
  { value: 'MOM', label: 'Mẹ' },
  { value: 'BABY', label: 'Bé' },
  { value: 'BOTH', label: 'Cả hai' },
];

const INITIAL_FORM_DATA = {
  name: '',
  code: '',
  description: '',
  category: '',
  appliesTo: 'BOTH',
};

type FormErrors = {
  name?: string;
  code?: string;
  description?: string;
  category?: string;
  appliesTo?: string;
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

export function HealthConditionModal({ open, onOpenChange, onSuccess, conditionToEdit, categories }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditMode = !!conditionToEdit;

  useEffect(() => {
    if (open) {
      if (conditionToEdit) {
        setFormData({
          name: conditionToEdit.name,
          code: conditionToEdit.code,
          description: conditionToEdit.description || '',
          category: conditionToEdit.category,
          appliesTo: conditionToEdit.appliesTo,
        });
      } else {
        setFormData({
          ...INITIAL_FORM_DATA,
          category: categories.length > 0 ? categories[0].name : '',
        });
      }
      setErrors({});
    }
  }, [open, conditionToEdit]);

  const handleFieldChange = (field: keyof typeof INITIAL_FORM_DATA, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên không được để trống.';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Mã không được để trống.';
    } else if (!/^[A-Z0-9_]+$/.test(formData.code)) {
      newErrors.code = 'Mã chỉ được chứa chữ hoa, số và dấu gạch dưới.';
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

      if (isEditMode && conditionToEdit) {
        await healthConditionService.update(conditionToEdit.id, formData);
        toast({ title: 'Cập nhật tình trạng sức khỏe thành công', variant: 'success' });
      } else {
        await healthConditionService.create(formData);
        toast({ title: 'Thêm tình trạng sức khỏe thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || 'Thao tác thất bại';
      toast({ title: errorMessage, variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa tình trạng sức khỏe' : 'Thêm tình trạng sức khỏe mới'}
          </h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name">
                  Tên tình trạng <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="name"
                  placeholder="Ví dụ: Dị ứng đạm bò"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={errors.name ? styles.invalid : ''}
                  required
                />
                {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="code">
                  Mã (Code) <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="code"
                  placeholder="Ví dụ: ALLERGY_COW_PROTEIN"
                  value={formData.code}
                  onChange={(e) => handleFieldChange('code', e.target.value.toUpperCase())}
                  className={errors.code ? styles.invalid : ''}
                  required
                  disabled={isEditMode}
                />
                {errors.code && <p className={styles.errorMessage}>{errors.code}</p>}
              </div>

              <div className={styles.formGroup}>
                <label>
                  Phân loại <span className={styles.required}>*</span>
                </label>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={styles.dropdownTrigger}>
                      <span className={styles.dropdownValue}>
                        {categories.find((opt) => opt.name === formData.category)?.name || 'Chọn phân loại'}
                      </span>
                      <ChevronDownIcon className={styles.dropdownChevron} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={styles.dropdownContent} align="start">
                    {categories.map((opt) => (
                      <DropdownMenuItem
                        key={opt.id}
                        className={`${styles.dropdownItem} ${formData.category === opt.name ? styles.dropdownItemActive : ''}`}
                        onClick={() => handleFieldChange('category', opt.name)}
                      >
                        {opt.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className={styles.formGroup}>
                <label>
                  Đối tượng áp dụng <span className={styles.required}>*</span>
                </label>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={styles.dropdownTrigger}>
                      <span className={styles.dropdownValue}>
                        {APPLIES_TO_OPTIONS.find((opt) => opt.value === formData.appliesTo)?.label}
                      </span>
                      <ChevronDownIcon className={styles.dropdownChevron} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={styles.dropdownContent} align="start">
                    {APPLIES_TO_OPTIONS.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        className={`${styles.dropdownItem} ${formData.appliesTo === opt.value ? styles.dropdownItemActive : ''}`}
                        onClick={() => handleFieldChange('appliesTo', opt.value)}
                      >
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="description">Mô tả</label>
              <CustomTextarea
                id="description"
                placeholder="Mô tả chi tiết về tình trạng này..."
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                rows={4}
              />
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
              {isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
