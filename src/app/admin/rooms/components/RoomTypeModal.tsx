'use client';

import { useEffect, useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';

import { useToast } from '@/components/ui/toast/use-toast';
import roomTypeService from '@/services/room-type.service';
import type { RoomType, CreateRoomTypeRequest, UpdateRoomTypeRequest } from '@/types/room-type';

import styles from './room-type-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: RoomType | null;
  onSuccess?: () => void;
};

interface FormData {
  name: string;
  basePrice: string;
  capacity: string;
  description: string;
}

interface FormErrors {
  name?: string;
  basePrice?: string;
  capacity?: string;
}

const INITIAL_FORM: FormData = { name: '', basePrice: '', capacity: '', description: '' };

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error &&
    typeof (error as { message?: unknown }).message === 'string')
    return (error as { message: string }).message;
  return fallback;
};

export function RoomTypeModal({ open, onOpenChange, room, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors]     = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!room;

  useEffect(() => {
    if (open) {
      setFormData(
        room
          ? {
              name:        room.name,
              basePrice:   String(room.basePrice),
              capacity:    room.capacity != null ? String(room.capacity) : '',
              description: room.description || '',
            }
          : INITIAL_FORM,
      );
      setErrors({});
    }
  }, [open, room]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!formData.name.trim())
      errs.name = 'Tên loại phòng không được để trống.';
    const price = Number(formData.basePrice);
    if (formData.basePrice === '' || Number.isNaN(price) || price < 0)
      errs.basePrice = 'Giá cơ bản phải là số không âm.';
    if (formData.capacity !== '') {
      const cap = Number(formData.capacity);
      if (Number.isNaN(cap) || cap < 0 || !Number.isInteger(cap))
        errs.capacity = 'Sức chứa phải là số nguyên không âm.';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const basePrice = Number(formData.basePrice);
    const capacity  = formData.capacity !== '' ? Number(formData.capacity) : 0;

    try {
      setIsSubmitting(true);
      if (isEditMode && room) {
        const updateData: UpdateRoomTypeRequest = {
          name: formData.name.trim(), basePrice, description: formData.description.trim(), capacity,
        };
        await roomTypeService.updateRoomType(room.id, updateData);
        toast({ title: 'Cập nhật loại phòng thành công', variant: 'success' });
      } else {
        const createData: CreateRoomTypeRequest = {
          name: formData.name.trim(), basePrice, description: formData.description.trim(), capacity,
        };
        await roomTypeService.createRoomType(createData);
        toast({ title: 'Tạo loại phòng thành công', variant: 'success' });
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
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-type-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 id="room-type-modal-title" className={styles.modalTitle}>
            {isEditMode ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={styles.closeButton}
            aria-label="Đóng"
          >
            <Cross1Icon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Tên */}
            <div className={styles.formGroup}>
              <label htmlFor="roomTypeName">
                Tên loại phòng <span className={styles.required}>*</span>
              </label>
              <input
                id="roomTypeName"
                className={`${styles.formControl} ${errors.name ? styles.invalid : ''}`}
                placeholder="Ví dụ: Phòng đơn, Phòng VIP..."
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                autoFocus
              />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>

            {/* 2 cột: Giá + Sức chứa */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="roomTypePrice">
                  Giá cơ bản (VND) <span className={styles.required}>*</span>
                </label>
                <input
                  id="roomTypePrice"
                  type="number"
                  min="0"
                  className={`${styles.formControl} ${errors.basePrice ? styles.invalid : ''}`}
                  placeholder="0"
                  value={formData.basePrice}
                  onChange={(e) => handleChange('basePrice', e.target.value)}
                />
                {errors.basePrice && <p className={styles.errorMessage}>{errors.basePrice}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="roomTypeCapacity">Sức chứa</label>
                <input
                  id="roomTypeCapacity"
                  type="number"
                  min="0"
                  className={`${styles.formControl} ${errors.capacity ? styles.invalid : ''}`}
                  placeholder="1"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                />
                {errors.capacity && <p className={styles.errorMessage}>{errors.capacity}</p>}
              </div>
            </div>

            {/* Mô tả */}
            <div className={styles.formGroup}>
              <label htmlFor="roomTypeDesc">Mô tả</label>
              <textarea
                id="roomTypeDesc"
                className={styles.formControl}
                placeholder="Mô tả ngắn về loại phòng..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Footer */}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
