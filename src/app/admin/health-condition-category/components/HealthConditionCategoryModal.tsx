'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import healthConditionService from '@/services/health-condition.service';
import type { HealthConditionCategory } from '@/types/health-record';

import styles from '../../package-type/components/package-type-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: HealthConditionCategory | null;
  onSuccess?: () => void;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return fallback;
};

export function HealthConditionCategoryModal({ open, onOpenChange, item, onSuccess }: Props) {
  const { toast } = useToast();
  const [name, setName]           = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!item;

  useEffect(() => {
    if (open) {
      setName(item ? item.name : '');
      setDescription(item?.description || '');
      setNameError('');
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Tên danh mục không được để trống.'); return; }

    try {
      setIsSubmitting(true);
      if (isEditMode && item) {
        await healthConditionService.updateCategory(item.id, { 
          name: name.trim(),
          description: description.trim() || null
        });
        toast({ title: 'Cập nhật danh mục thành công', variant: 'success' });
      } else {
        await healthConditionService.createCategory({ 
          name: name.trim(),
          description: description.trim() || null
        });
        toast({ title: 'Tạo danh mục thành công', variant: 'success' });
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
        aria-labelledby="category-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 id="category-modal-title" className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </h2>
          <button type="button" onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Đóng">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="categoryName">Tên danh mục <span className={styles.required}>*</span></label>
              <input id="categoryName" className={`${styles.formControl} ${nameError ? styles.invalid : ''}`}
                placeholder="Ví dụ: Dị ứng, Mãn tính..."
                value={name} onChange={(e) => { setName(e.target.value); setNameError(''); }} autoFocus />
              {nameError && <p className={styles.errorMessage}>{nameError}</p>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="categoryDescription">Mô tả</label>
              <textarea 
                id="categoryDescription" 
                className={styles.formControl}
                style={{ minHeight: '80px', resize: 'vertical' }}
                placeholder="Nhập mô tả cho danh mục này..."
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
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
