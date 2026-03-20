'use client';

import { Cross1Icon, ImageIcon } from '@radix-ui/react-icons';
import { Upload } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import foodService from '@/services/food.service';
import type { CreateFoodRequest, Food, UpdateFoodRequest } from '@/types/food';

import styles from './new-food-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  foodToEdit?: Food | null;
};

const INITIAL_FORM_DATA: CreateFoodRequest = {
  name: '',
  type: '',
  description: '',
  imageUrl: null,
  isActive: true,
};

type FormErrors = {
  name?: string;
  type?: string;
  description?: string;
  imageUrl?: string;
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
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

export function NewFoodModal({ open, onOpenChange, onSuccess, foodToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateFoodRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!foodToEdit;

  useEffect(() => {
    if (open) {
      if (foodToEdit) {
        setFormData({
          name: foodToEdit.name,
          type: foodToEdit.type,
          description: foodToEdit.description || '',
          imageUrl: foodToEdit.imageUrl,
          isActive: foodToEdit.isActive,
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [open, foodToEdit]);

  const handleFieldChange = <K extends keyof CreateFoodRequest>(field: K, value: CreateFoodRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Vui lòng chọn tệp hình ảnh (.jpg, .png, .webp)', variant: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      handleFieldChange('imageUrl', e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFieldChange('imageUrl', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên món ăn không được để trống.';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Loại món ăn không được để trống.';
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

      if (isEditMode && foodToEdit) {
        const updatePayload: UpdateFoodRequest = {
          name: formData.name,
          type: formData.type,
          description: formData.description,
          imageUrl: formData.imageUrl,
          isActive: formData.isActive,
        };
        await foodService.updateFood(foodToEdit.id, updatePayload);
        toast({ title: 'Cập nhật món ăn thành công', variant: 'success' });
      } else {
        await foodService.createFood(formData);
        toast({ title: 'Tạo món ăn thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        isEditMode ? 'Cập nhật món ăn thất bại' : 'Tạo món ăn thất bại',
      );

      if (
        errorMessage.includes('tồn tại') ||
        errorMessage.includes('đã tồn tại') ||
        errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('duplicate')
      ) {
        setErrors({ name: 'Tên món ăn đã tồn tại.' });
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
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name">
                  Tên món ăn <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="name"
                  placeholder="Ví dụ: Phở bò, Bún chả"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={errors.name ? styles.invalid : ''}
                  required
                />
                {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="type">
                  Loại món ăn <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="type"
                  placeholder="Ví dụ: Món chính, Món phụ"
                  value={formData.type}
                  onChange={(e) => handleFieldChange('type', e.target.value)}
                  className={errors.type ? styles.invalid : ''}
                  required
                />
                {errors.type && <p className={styles.errorMessage}>{errors.type}</p>}
              </div>
            </div>

            <div className={styles.imageUploadGroup}>
              <label className={styles.uploadLabel}>Hình ảnh món ăn</label>
              <input
                type="file"
                ref={fileInputRef}
                className={styles.hiddenInput}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              <div
                className={`${styles.imageUploadZone} ${isDragging ? styles.dragging : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.imageUrl ? (
                  <div className={styles.previewContainer}>
                    <img src={formData.imageUrl} alt="Preview" className={styles.imagePreview} />
                    <button type="button" className={styles.removeImage} onClick={removeImage}>
                      <Cross1Icon />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className={styles.uploadIcon} />
                    <span className={styles.uploadText}>Kéo thả ảnh vào đây hoặc click để chọn</span>
                    <span className={styles.uploadHint}>Hỗ trợ: JPG, PNG, WEBP (Tối đa 5MB)</span>
                  </>
                )}
              </div>
              {errors.imageUrl && <p className={styles.errorMessage}>{errors.imageUrl}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Mô tả</label>
              <CustomTextarea
                id="description"
                placeholder="Mô tả về món ăn..."
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
