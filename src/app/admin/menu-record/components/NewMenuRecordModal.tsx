'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useState, useEffect, forwardRef, useMemo, useRef } from 'react';
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { useToast } from '@/components/ui/toast/use-toast';
import menuRecordService from '@/services/menu-record.service';
import userService from '@/services/user.service';
import menuService from '@/services/menu.service';
import type { CreateMenuRecordRequest, MenuRecord, UpdateMenuRecordRequest } from '@/types/menu-record';
import type { Account } from '@/types/account';
import type { Menu } from '@/types/menu';
import { CustomDropdown } from '@/components/ui/select/CustomDropdown';
import { DatePicker } from '@/app/admin/work-schedule/components/DatePicker';
import { cn } from '@/lib/utils';

import styles from './new-menu-record-modal.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  menuRecordToEdit?: MenuRecord | null;
};

const INITIAL_FORM_DATA: CreateMenuRecordRequest = {
  menuId: 0,
  name: '',
  date: '',
};

type FormErrors = {
  menuId?: string;
  name?: string;
  date?: string;
};

const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <input {...props} ref={ref} className={`${styles.formControl} ${className || ''}`} />;
  }
);
CustomInput.displayName = 'CustomInput';

const CustomDatePicker = ({
  label,
  value,
  onChange,
  required,
  isInvalid
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  isInvalid?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const dateValue = useMemo(() => {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [value]);

  const displayValue = useMemo(() => {
    if (!dateValue) return 'Chọn ngày áp dụng...';
    return format(dateValue, 'dd/MM/yyyy');
  }, [dateValue]);

  return (
    <div className={styles.formGroup} ref={containerRef}>
      <label>{label} {required && <span className={styles.required}>*</span>}</label>
      <div className={styles.datePickerRelative}>
        <div
          className={cn(styles.dateTrigger, open && styles.dateTriggerOpen, isInvalid && styles.invalid)}
          onClick={() => setOpen(!open)}
        >
          <CalendarIcon size={16} />
          <span className={cn(styles.dateText, !value && styles.placeholder)}>
            {displayValue}
          </span>
        </div>

        {open && (
          <div className={styles.sharedDatePickerWrapper}>
            <DatePicker
              value={dateValue}
              title=""
              side="bottom"
              onChange={(d) => {
                if (d) {
                  const y = d.getFullYear();
                  const m = String(d.getMonth() + 1).padStart(2, '0');
                  const day = String(d.getDate()).padStart(2, '0');
                  onChange(`${y}-${m}-${day}`);
                } else {
                  onChange('');
                }
                setOpen(false);
              }}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export function NewMenuRecordModal({ open, onOpenChange, onSuccess, menuRecordToEdit }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateMenuRecordRequest>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const isEditMode = !!menuRecordToEdit;

  useEffect(() => {
    if (open) {
      const fetchOptions = async () => {
        try {
          setIsLoadingOptions(true);
          const [accountsData, menusData] = await Promise.all([
            userService.getAllAccounts(),
            menuService.getAllMenus(),
          ]);
          setAccounts(accountsData);
          setMenus(menusData);
        } catch (error) {
          toast({ title: 'Không thể tải danh sách tài khoản hoặc thực đơn', variant: 'error' });
        } finally {
          setIsLoadingOptions(false);
        }
      };

      fetchOptions();

      if (menuRecordToEdit) {
        setFormData({
          menuId: menuRecordToEdit.menuId,
          name: menuRecordToEdit.name || '',
          date: menuRecordToEdit.date,
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          ...INITIAL_FORM_DATA,
          date: today,
        });
      }
      setErrors({});
    }
  }, [open, menuRecordToEdit, toast]);

  const handleFieldChange = <K extends keyof CreateMenuRecordRequest>(field: K, value: CreateMenuRecordRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.menuId) {
      newErrors.menuId = 'Vui lòng chọn thực đơn.';
    }

    if (!formData.date?.trim()) {
      newErrors.date = 'Ngày không được để trống.';
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

      if (isEditMode && menuRecordToEdit) {
        const updatePayload: UpdateMenuRecordRequest = {
          menuId: formData.menuId,
          name: formData.name || null,
          date: formData.date,
        };
        await menuRecordService.updateMenuRecord(menuRecordToEdit.id, updatePayload);
        toast({ title: 'Cập nhật bản ghi thực đơn thành công', variant: 'success' });
      } else {
        await menuRecordService.createMenuRecord({
          ...formData,
          name: formData.name || null
        });
        toast({ title: 'Tạo bản ghi thực đơn thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(
          error,
          isEditMode ? 'Cập nhật bản ghi thực đơn thất bại' : 'Tạo bản ghi thực đơn thất bại',
        ),
        variant: 'error',
      });
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
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa bản ghi thực đơn' : 'Thêm bản ghi thực đơn mới'}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup} style={{ marginBottom: '20px' }}>
                <label htmlFor="menuId">
                  Menu <span className={styles.required}>*</span>
                </label>
                <CustomDropdown
                  options={menus.map(m => ({ value: m.id, label: m.menuName }))}
                  value={formData.menuId}
                  onChange={(val) => handleFieldChange('menuId', Number(val))}
                  placeholder="Chọn thực đơn"
                  isInvalid={!!errors.menuId}
                />
                {errors.menuId && <p className={styles.errorMessage}>{errors.menuId}</p>}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ marginBottom: '20px' }}>
              <label htmlFor="name">Tên</label>
              <CustomInput
                id="name"
                placeholder="Ví dụ: Buổi trưa vui vẻ (Optional)"
                value={formData.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={errors.name ? styles.invalid : ''}
              />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>

            <CustomDatePicker
              label="Ngày áp dụng"
              required
              value={formData.date}
              onChange={(v) => handleFieldChange('date', v)}
              isInvalid={!!errors.date}
            />
            {errors.date && <p className={styles.errorMessage}>{errors.date}</p>}
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
              disabled={isSubmitting || isLoadingOptions}
            >
              {isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
