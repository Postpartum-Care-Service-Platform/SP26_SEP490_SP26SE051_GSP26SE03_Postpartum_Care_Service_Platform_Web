'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { forwardRef, useEffect, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import activityService from '@/services/activity.service';
import carePlanDetailService from '@/services/care-plan-detail.service';
import packageService from '@/services/package.service';
import type { Activity } from '@/types/activity';
import type { CarePlanDetail, CreateCarePlanDetailRequest, UpdateCarePlanDetailRequest } from '@/types/care-plan-detail';
import type { Package } from '@/types/package';

import styles from './new-care-plan-detail-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  carePlanDetailToEdit?: CarePlanDetail | null;
};

const INITIAL_FORM_DATA: CreateCarePlanDetailRequest = {
  packageId: 0,
  activityId: 0,
  dayNo: 1,
  startTime: '09:00',
  endTime: '10:00',
  instruction: '',
  sortOrder: 0,
};

type FormErrors = {
  packageId?: string;
  activityId?: string;
  dayNo?: string;
  startTime?: string;
  endTime?: string;
  instruction?: string;
  sortOrder?: string;
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

export function NewCarePlanDetailModal({ open, onOpenChange, onSuccess, carePlanDetailToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateCarePlanDetailRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [packages, setPackages] = useState<Package[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const isEditMode = !!carePlanDetailToEdit;

  useEffect(() => {
    if (open) {
      const loadOptions = async () => {
        try {
          setLoadingOptions(true);
          const [packagesData, activitiesData] = await Promise.all([
            packageService.getAllPackages(),
            activityService.getAllActivities(),
          ]);
          setPackages(packagesData);
          setActivities(activitiesData);
        } catch {
          toast({ title: 'Không thể tải danh sách gói dịch vụ và hoạt động', variant: 'error' });
        } finally {
          setLoadingOptions(false);
        }
      };
      loadOptions();

      if (carePlanDetailToEdit) {
        setFormData({
          packageId: carePlanDetailToEdit.packageId,
          activityId: carePlanDetailToEdit.activityId,
          dayNo: carePlanDetailToEdit.dayNo,
          startTime: carePlanDetailToEdit.startTime,
          endTime: carePlanDetailToEdit.endTime,
          instruction: carePlanDetailToEdit.instruction,
          sortOrder: carePlanDetailToEdit.sortOrder,
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [open, carePlanDetailToEdit, toast]);

  const handleFieldChange = <K extends keyof CreateCarePlanDetailRequest>(field: K, value: CreateCarePlanDetailRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.packageId || formData.packageId <= 0) {
      newErrors.packageId = 'Vui lòng chọn gói dịch vụ.';
    }

    if (!formData.activityId || formData.activityId <= 0) {
      newErrors.activityId = 'Vui lòng chọn hoạt động.';
    }

    if (formData.dayNo <= 0) {
      newErrors.dayNo = 'Số ngày phải lớn hơn 0.';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Thời gian bắt đầu không được để trống.';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Thời gian kết thúc không được để trống.';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu.';
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

      if (isEditMode && carePlanDetailToEdit) {
        const updatePayload: UpdateCarePlanDetailRequest = {
          packageId: formData.packageId,
          activityId: formData.activityId,
          dayNo: formData.dayNo,
          startTime: formData.startTime,
          endTime: formData.endTime,
          instruction: formData.instruction,
          sortOrder: formData.sortOrder,
        };
        await carePlanDetailService.updateCarePlanDetail(carePlanDetailToEdit.id, updatePayload);
        toast({ title: 'Cập nhật chi tiết kế hoạch chăm sóc thành công', variant: 'success' });
      } else {
        await carePlanDetailService.createCarePlanDetail(formData);
        toast({ title: 'Tạo chi tiết kế hoạch chăm sóc thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : isEditMode
            ? 'Cập nhật chi tiết kế hoạch chăm sóc thất bại'
            : 'Tạo chi tiết kế hoạch chăm sóc thất bại';
      toast({ title: errorMessage, variant: 'error' });
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
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa chi tiết kế hoạch chăm sóc' : 'Thêm chi tiết kế hoạch chăm sóc mới'}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="packageId">
                  Gói dịch vụ <span className={styles.required}>*</span>
                </label>
                <CustomSelect
                  id="packageId"
                  value={formData.packageId}
                  onChange={(e) => handleFieldChange('packageId', parseInt(e.target.value, 10) || 0)}
                  className={errors.packageId ? styles.invalid : ''}
                  required
                  disabled={loadingOptions}
                >
                  <option value="0">Chọn gói dịch vụ</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.packageName}
                    </option>
                  ))}
                </CustomSelect>
                {errors.packageId && <p className={styles.errorMessage}>{errors.packageId}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="activityId">
                  Hoạt động <span className={styles.required}>*</span>
                </label>
                <CustomSelect
                  id="activityId"
                  value={formData.activityId}
                  onChange={(e) => handleFieldChange('activityId', parseInt(e.target.value, 10) || 0)}
                  className={errors.activityId ? styles.invalid : ''}
                  required
                  disabled={loadingOptions}
                >
                  <option value="0">Chọn hoạt động</option>
                  {activities.map((activity) => {
                    const name = (activity.name as string) || '';
                    return (
                      <option key={activity.id} value={activity.id}>
                        {name || `Hoạt động ${activity.id}`}
                      </option>
                    );
                  })}
                </CustomSelect>
                {errors.activityId && <p className={styles.errorMessage}>{errors.activityId}</p>}
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="dayNo">
                  Số ngày <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="dayNo"
                  type="number"
                  min="1"
                  value={formData.dayNo}
                  onChange={(e) => handleFieldChange('dayNo', parseInt(e.target.value, 10) || 0)}
                  className={errors.dayNo ? styles.invalid : ''}
                  required
                />
                {errors.dayNo && <p className={styles.errorMessage}>{errors.dayNo}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sortOrder">
                  Thứ tự
                </label>
                <CustomInput
                  id="sortOrder"
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) => handleFieldChange('sortOrder', parseInt(e.target.value, 10) || 0)}
                  className={errors.sortOrder ? styles.invalid : ''}
                />
                {errors.sortOrder && <p className={styles.errorMessage}>{errors.sortOrder}</p>}
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="startTime">
                  Thời gian bắt đầu <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleFieldChange('startTime', e.target.value)}
                  className={errors.startTime ? styles.invalid : ''}
                  required
                />
                {errors.startTime && <p className={styles.errorMessage}>{errors.startTime}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endTime">
                  Thời gian kết thúc <span className={styles.required}>*</span>
                </label>
                <CustomInput
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleFieldChange('endTime', e.target.value)}
                  className={errors.endTime ? styles.invalid : ''}
                  required
                />
                {errors.endTime && <p className={styles.errorMessage}>{errors.endTime}</p>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="instruction">Hướng dẫn</label>
              <CustomTextarea
                id="instruction"
                placeholder="Nhập hướng dẫn..."
                value={formData.instruction}
                onChange={(e) => handleFieldChange('instruction', e.target.value)}
                className={errors.instruction ? styles.invalid : ''}
                rows={4}
              />
              {errors.instruction && <p className={styles.errorMessage}>{errors.instruction}</p>}
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
