'use client';

import { Cross1Icon, PlusIcon, MinusIcon } from '@radix-ui/react-icons';
import { forwardRef, useEffect, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import foodService from '@/services/food.service';
import menuTypeService from '@/services/menu-type.service';
import menuService from '@/services/menu.service';
import type { Food } from '@/types/food';
import type { Menu, CreateMenuRequest, UpdateMenuRequest } from '@/types/menu';
import type { MenuType } from '@/types/menu-type';
import { CustomDropdown } from '@/components/ui/select/CustomDropdown';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ImagePreviewModal } from '@/app/admin/food/components/ImagePreviewModal';

import styles from './new-menu-modal.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
};

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

const CustomInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={`${styles.formControl} ${className || ''}`}
    />
  );
});
CustomInput.displayName = 'CustomInput';

const CustomTextarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      {...props}
      ref={ref}
      className={`${styles.formControl} ${className || ''}`}
      data-type="textarea"
    />
  );
});
CustomTextarea.displayName = 'CustomTextarea';



export function NewMenuModal({ open, onOpenChange, onSuccess, menuToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateMenuRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
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
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Không thể tải danh sách loại thực đơn và món ăn'),
        variant: 'error',
      });
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

  const handleFieldChange = <K extends keyof CreateMenuRequest>(
    field: K,
    value: CreateMenuRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFoodToggle = (foodId: number) => {
    const currentIds = formData.foodIds || [];
    if (currentIds.includes(foodId)) {
      // Remove all instances of this food
      handleFieldChange('foodIds', currentIds.filter(id => id !== foodId));
    } else {
      // Add one instance
      handleFieldChange('foodIds', [...currentIds, foodId]);
    }
  };

  const handleQuantityChange = (foodId: number, delta: number) => {
    const currentIds = [...(formData.foodIds || [])];
    if (delta > 0) {
      currentIds.push(foodId);
    } else {
      const index = currentIds.lastIndexOf(foodId);
      if (index !== -1) {
        currentIds.splice(index, 1);
      }
    }
    handleFieldChange('foodIds', currentIds);
  };

  const getFoodQuantity = (foodId: number) => {
    return (formData.foodIds || []).filter(id => id === foodId).length;
  };

  const foodCategories = Array.from(new Set(foods.map(f => f.foodType))).filter(Boolean) as string[];

  const getCategoryCount = (category: string | null) => {
    if (!category) return foods.length;
    return foods.filter(f => f.foodType === category).length;
  };

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(foodSearchQuery.toLowerCase());
    const matchesFilter = !activeFilter || food.foodType === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const uniqueSelectedFoodIds = Array.from(new Set(formData.foodIds || []));

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
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        isEditMode ? 'Cập nhật thực đơn thất bại' : 'Tạo thực đơn thất bại',
      );

      if (
        errorMessage.includes('tồn tại') ||
        errorMessage.includes('đã tồn tại') ||
        errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('duplicate')
      ) {
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
          <h2 className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa thực đơn' : 'Thêm thực đơn mới'}
          </h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onOpenChange(false)}
                className={styles.closeButton}
                aria-label="Close"
              >
                <Cross1Icon />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">Đóng</TooltipContent>
          </Tooltip>
        </div>
        <form onSubmit={handleSubmit} className={styles.formWrapper}>
          <div className={styles.modalBody}>
            <div className={styles.dualColumnLayout}>
              {/* Left Column: Food Discovery */}
              <div className={styles.leftColumn}>
                <div className={styles.searchSection}>
                  <label>Tìm kiếm món ăn</label>
                  <div className={styles.searchWrapper}>
                    <input
                      type="text"
                      placeholder="Nhập tên món ăn cần tìm..."
                      className={styles.formControl}
                      value={foodSearchQuery}
                      onChange={(e) => setFoodSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.filterSection}>
                  <button 
                    type="button"
                    className={`${styles.filterBtn} ${!activeFilter ? styles.filterBtnActive : ''}`}
                    onClick={() => setActiveFilter(null)}
                  >
                    Tất cả ({getCategoryCount(null)})
                  </button>
                  {foodCategories.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterBtnActive : ''}`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter} ({getCategoryCount(filter)})
                    </button>
                  ))}
                </div>

                <div className={styles.foodGridContainer}>
                  {loadingOptions ? (
                    <div className={styles.loadingContainer}>
                      <div className={styles.loader}></div>
                      <p className={styles.loadingText}>Đang tải món ăn...</p>
                    </div>
                  ) : !activeFilter ? (
                    foodCategories.map((category) => {
                      const foodsInCategory = filteredFoods.filter(f => f.foodType === category);
                      if (foodsInCategory.length === 0) return null;
                      return (
                        <div key={category} className={styles.categorySection}>
                          <h3 className={styles.categoryTitle}>{category}</h3>
                          <div className={styles.foodGrid}>
                            {foodsInCategory.map((food) => (
                              <div
                                key={food.id}
                                className={`${styles.foodCard} ${formData.foodIds?.includes(food.id) ? styles.foodCardSelected : ''}`}
                                onClick={() => handleFoodToggle(food.id)}
                              >
                                <div className={styles.foodItemContent}>
                                  <div className={styles.circularImageWrapper}>
                                    <img
                                      src={food.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                                      alt={food.name}
                                      className={styles.circularImage}
                                    />
                                    {formData.foodIds?.includes(food.id) && (
                                      <div className={styles.circleSelectionOverlay}>
                                        <span className={styles.circleCheckIcon}>✓</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className={styles.foodLabelInfo}>
                                    <h4 className={styles.foodLabelName}>{food.name}</h4>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.foodGrid}>
                      {filteredFoods.map((food) => (
                        <div
                          key={food.id}
                          className={`${styles.foodCard} ${formData.foodIds?.includes(food.id) ? styles.foodCardSelected : ''}`}
                          onClick={() => handleFoodToggle(food.id)}
                        >
                          <div className={styles.foodItemContent}>
                            <div className={styles.circularImageWrapper}>
                              <img
                                src={food.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                                alt={food.name}
                                className={styles.circularImage}
                              />
                              {formData.foodIds?.includes(food.id) && (
                                <div className={styles.circleSelectionOverlay}>
                                  <span className={styles.circleCheckIcon}>✓</span>
                                </div>
                              )}
                            </div>
                            <div className={styles.foodLabelInfo}>
                              <h4 className={styles.foodLabelName}>{food.name}</h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Menu Information & Selection Review */}
              <div className={styles.rightColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="menuTypeId">
                    Loại thực đơn <span className={styles.required}>*</span>
                  </label>
                  <CustomDropdown
                    options={menuTypes.map((type) => ({
                      value: type.id,
                      label: type.name,
                    }))}
                    value={formData.menuTypeId}
                    onChange={(val) => handleFieldChange('menuTypeId', Number(val))}
                    placeholder="Chọn loại thực đơn"
                    isInvalid={!!errors.menuTypeId}
                  />
                  {errors.menuTypeId && (
                    <p className={styles.errorMessage}>{errors.menuTypeId}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="menuName">
                    Tên thực đơn <span className={styles.required}>*</span>
                  </label>
                  <CustomInput
                    id="menuName"
                    placeholder="Ví dụ: Thực đơn sáng ngày 1"
                    value={formData.menuName}
                    onChange={(e) =>
                      handleFieldChange('menuName', e.target.value)
                    }
                    className={errors.menuName ? styles.invalid : ''}
                    required
                  />
                  {errors.menuName && (
                    <p className={styles.errorMessage}>{errors.menuName}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description">Mô tả thực đơn</label>
                  <CustomTextarea
                    id="description"
                    placeholder="Ghi chú về thực đơn này..."
                    value={formData.description}
                    onChange={(e) =>
                      handleFieldChange('description', e.target.value)
                    }
                    className={errors.description ? styles.invalid : ''}
                    rows={2}
                  />
                </div>

                <div className={styles.selectedFoodsSection}>
                  <div className={styles.selectedFoodsHeader}>
                    <label>Món ăn đã chọn</label>
                    <span className={styles.badge}>{formData.foodIds?.length || 0}</span>
                  </div>
                  <div className={styles.selectedList}>
                    {uniqueSelectedFoodIds.length === 0 ? (
                      <div className={styles.emptySelected}>Chưa có món nào được chọn</div>
                    ) : (
                      uniqueSelectedFoodIds.map(id => {
                        const food = foods.find(f => f.id === id);
                        if (!food) return null;
                        const qty = getFoodQuantity(id);
                        return (
                          <div key={id} className={styles.selectedCard}>
                            <img 
                              src={food.imageUrl || ''} 
                              alt="" 
                              className={styles.selectedThumb} 
                              onClick={() => {
                                setPreviewImage(food.imageUrl || '');
                                setPreviewTitle(food.name);
                              }}
                            />
                            <span className={styles.selectedName}>{food.name}</span>
                            
                            <div className={styles.quantitySelector}>
                              <button 
                                type="button" 
                                className={styles.qtyBtn}
                                onClick={() => handleQuantityChange(id, -1)}
                                disabled={qty <= 1}
                              >
                                <MinusIcon />
                              </button>
                              <span className={styles.qtyValue}>{qty}</span>
                              <button 
                                type="button" 
                                className={styles.qtyBtn}
                                onClick={() => handleQuantityChange(id, 1)}
                              >
                                <PlusIcon />
                              </button>
                            </div>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  type="button" 
                                  className={styles.removeBtn}
                                  onClick={() => handleFoodToggle(id)}
                                  aria-label="Remove food"
                                >
                                  ✕
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">Xóa món</TooltipContent>
                            </Tooltip>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
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
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonPrimary}`}
              disabled={isSubmitting || loadingOptions}
            >
              {isSubmitting
                ? 'Đang xử lý...'
                : isEditMode
                  ? 'Cập nhật'
                  : 'Thêm mới'}
            </button>
          </div>
        </form>

        <ImagePreviewModal 
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          imageUrl={previewImage || ''}
          foodName={previewTitle}
        />
      </div>
    </div>
  );
}
