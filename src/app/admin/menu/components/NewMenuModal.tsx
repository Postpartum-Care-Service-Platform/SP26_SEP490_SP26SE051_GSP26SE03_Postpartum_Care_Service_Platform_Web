'use client';

import { useState, useEffect, forwardRef } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/toast/use-toast';
import styles from './new-menu-modal.module.css';
import type { Menu, CreateMenuRequest, UpdateMenuRequest } from '@/types/menu';
import menuService from '@/services/menu.service';
import menuTypeService from '@/services/menu-type.service';
import foodService from '@/services/food.service';
import type { MenuType } from '@/types/menu-type';
import type { Food } from '@/types/food';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  menuToEdit?: Menu | null;
};

const INITIAL_FORM_DATA: CreateMenuRequest = {
  menuTypeId: 0,
  menuName: '',
  description: '',
  isActive: true,
  foodIds: [],
};

type FormErrors = {
  menuTypeId?: string;
  menuName?: string;
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

const CustomSelect = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return <select {...props} ref={ref} className={`${styles.formControl} ${className || ''}`} />;
  }
);
CustomSelect.displayName = 'CustomSelect';

export function NewMenuModal({ open, onOpenChange, onSuccess, menuToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateMenuRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const isEditMode = !!menuToEdit;

  useEffect(() => {
    if (open) {
      const loadOptions = async () => {
        try {
          setLoadingOptions(true);
          const [menuTypesData, foodsData] = await Promise.all([
            menuTypeService.getAllMenuTypes(),
            foodService.getAllFoods(),
          ]);
          setMenuTypes(menuTypesData);
          setFoods(foodsData);
        } catch (err) {
          toast({ title: 'Không thể tải danh sách loại thực đơn và món ăn', variant: 'error' });
        } finally {
          setLoadingOptions(false);
        }
      };
      loadOptions();

      if (menuToEdit) {
        setFormData({
          menuTypeId: menuToEdit.menuTypeId,
          menuName: menuToEdit.menuName,
          description: menuToEdit.description || '',
          isActive: menuToEdit.isActive,
          foodIds: menuToEdit.foods?.map((f) => f.id) || [],
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [open, menuToEdit, toast]);

  const handleFieldChange = <K extends keyof CreateMenuRequest>(field: K, value: CreateMenuRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFoodToggle = (foodId: number) => {
    const currentIds = formData.foodIds || [];
    const newIds = currentIds.includes(foodId)
      ? currentIds.filter((id) => id !== foodId)
      : [...currentIds, foodId];
    handleFieldChange('foodIds', newIds);
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.menuTypeId || formData.menuTypeId <= 0) {
      newErrors.menuTypeId = 'Vui lòng chọn loại thực đơn.';
    }

    if (!formData.menuName.trim()) {
      newErrors.menuName = 'Tên thực đơn không được để trống.';
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

      if (isEditMode && menuToEdit) {
        const updatePayload: UpdateMenuRequest = {
          menuTypeId: formData.menuTypeId,
          menuName: formData.menuName,
          description: formData.description,
          isActive: formData.isActive,
          foodIds: formData.foodIds,
        };
        await menuService.updateMenu(menuToEdit.id, updatePayload);
        toast({ title: 'Cập nhật thực đơn thành công', variant: 'success' });
      } else {
        await menuService.createMenu(formData);
        toast({ title: 'Tạo thực đơn thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err?.message || (isEditMode ? 'Cập nhật thực đơn thất bại' : 'Tạo thực đơn thất bại');

      if (errorMessage.includes('tồn tại') || errorMessage.includes('đã tồn tại') || errorMessage.toLowerCase().includes('exists') || errorMessage.toLowerCase().includes('duplicate')) {
        setErrors({ menuName: 'Tên thực đơn đã tồn tại.' });
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
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa thực đơn' : 'Thêm thực đơn mới'}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="menuTypeId">
                  Loại thực đơn <span className={styles.required}>*</span>
                </label>
                <CustomSelect
                  id="menuTypeId"
                  value={formData.menuTypeId}
                  onChange={(e) => handleFieldChange('menuTypeId', parseInt(e.target.value, 10) || 0)}
                  className={errors.menuTypeId ? styles.invalid : ''}
                  required
                  disabled={loadingOptions}
                >
                  <option value="0">Chọn loại thực đơn</option>
                  {menuTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </CustomSelect>
                {errors.menuTypeId && <p className={styles.errorMessage}>{errors.menuTypeId}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="menuName">
                  Tên thực đơn <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="menuName"
                  placeholder="Ví dụ: Thực đơn sáng, Thực đơn trưa"
                  value={formData.menuName}
                  onChange={(e) => handleFieldChange('menuName', e.target.value)}
                  className={errors.menuName ? styles.invalid : ''}
                  required
                />
                {errors.menuName && <p className={styles.errorMessage}>{errors.menuName}</p>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Mô tả</label>
              <CustomTextarea
                id="description"
                placeholder="Mô tả về thực đơn..."
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className={errors.description ? styles.invalid : ''}
                rows={4}
              />
              {errors.description && <p className={styles.errorMessage}>{errors.description}</p>}
            </div>

            <div className={styles.formGroup}>
              <label>Món ăn</label>
              <div className={styles.foodList}>
                {loadingOptions ? (
                  <p className={styles.loadingText}>Đang tải danh sách món ăn...</p>
                ) : (
                  foods.map((food) => {
                    const isSelected = formData.foodIds?.includes(food.id) || false;
                    return (
                      <label key={food.id} className={styles.foodItem}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleFoodToggle(food.id)}
                          className={styles.checkbox}
                        />
                        <span>{food.name}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.button} ${styles.buttonOutline}`} onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting || loadingOptions}>
              {isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
