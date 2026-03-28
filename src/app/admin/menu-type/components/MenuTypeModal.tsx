'use client';

import { useEffect, useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';

import { useToast } from '@/components/ui/toast/use-toast';
import menuTypeService from '@/services/menu-type.service';
import type { MenuType, CreateMenuTypeRequest, UpdateMenuTypeRequest } from '@/types/menu-type';

import styles from './menu-type-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: MenuType | null;
  onSuccess?: () => void;
};

const getErrorMessage = (error: any, fallback: string): string => {
  if (typeof error === 'string') return error;
  return error?.message || error?.error || error?.data?.message || error?.data?.error || fallback;
};

export function MenuTypeModal({ open, onOpenChange, item, onSuccess }: Props) {
  const { toast } = useToast();
  const [name, setName]           = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!item;

  useEffect(() => {
    if (open) {
      setName(item ? item.name : '');
      setNameError('');
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Tên loại thực đơn không được để trống.'); return; }

    try {
      setIsSubmitting(true);
      if (isEditMode && item) {
        const payload: UpdateMenuTypeRequest = { name: name.trim(), isActive: item.isActive };
        await menuTypeService.updateMenuType(item.id, payload);
        toast({ title: 'Cập nhật loại thực đơn thành công', variant: 'success' });
      } else {
        const payload: CreateMenuTypeRequest = { name: name.trim() };
        await menuTypeService.createMenuType(payload);
        toast({ title: 'Tạo loại thực đơn thành công', variant: 'success' });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, 'Có lỗi xảy ra'), variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div className={styles.modalContent} role="dialog" aria-modal="true"
        aria-labelledby="menu-type-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 id="menu-type-modal-title" className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa loại thực đơn' : 'Thêm loại thực đơn mới'}
          </h2>
          <button type="button" onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Đóng">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="menuTypeName">Tên loại thực đơn <span className={styles.required}>*</span></label>
              <input id="menuTypeName" className={`${styles.formControl} ${nameError ? styles.invalid : ''}`}
                placeholder="Ví dụ: Thực đơn sáng, Thực đơn dinh dưỡng..."
                value={name} onChange={(e) => { setName(e.target.value); setNameError(''); }} autoFocus />
              {nameError && <p className={styles.errorMessage}>{nameError}</p>}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.button} ${styles.buttonOutline}`}
              onClick={() => onOpenChange(false)} disabled={isSubmitting}>Hủy</button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
