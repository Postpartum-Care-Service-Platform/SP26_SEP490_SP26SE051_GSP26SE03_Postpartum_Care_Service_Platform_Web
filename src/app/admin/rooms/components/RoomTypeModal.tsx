'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';
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

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
};

export function RoomTypeModal({ open, onOpenChange, room, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    capacity: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (room) {
        setFormData({
          name: room.name,
          basePrice: String(room.basePrice),
          capacity: room.capacity ? String(room.capacity) : '',
          description: room.description || '',
        });
      } else {
        setFormData({
          name: '',
          basePrice: '',
          capacity: '',
          description: '',
        });
      }
    }
  }, [open, room]);

  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.paddingRight = '';
    };
  }, [open]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: 'Vui lòng nhập tên loại phòng', variant: 'error' });
      return;
    }

    const basePrice = Number(formData.basePrice);
    if (Number.isNaN(basePrice) || basePrice < 0) {
      toast({ title: 'Giá cơ bản không hợp lệ', variant: 'error' });
      return;
    }

    const capacity = formData.capacity ? Number(formData.capacity) : 0;
    if (formData.capacity && (Number.isNaN(capacity) || capacity < 0)) {
      toast({ title: 'Sức chứa không hợp lệ', variant: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);

      if (room) {
        const updateData: UpdateRoomTypeRequest = {
          name: formData.name.trim(),
          basePrice,
          description: formData.description.trim(),
          capacity: capacity || 0,
        };
        await roomTypeService.updateRoomType(room.id, updateData);
        toast({ title: 'Cập nhật loại phòng thành công', variant: 'success' });
      } else {
        const createData: CreateRoomTypeRequest = {
          name: formData.name.trim(),
          basePrice,
          description: formData.description.trim(),
          capacity: capacity || 0,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            {room ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}
          </DialogTitle>
          <DialogDescription>
            {room ? 'Cập nhật thông tin loại phòng' : 'Điền thông tin để tạo loại phòng mới'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formFields}>
            <TextField
              label="Tên loại phòng"
              variant="booking"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Nhập tên loại phòng"
              required
            />

            <TextField
              label="Giá cơ bản"
              type="number"
              variant="booking"
              value={formData.basePrice}
              onChange={(e) => handleFieldChange('basePrice', e.target.value)}
              placeholder="0"
              min="0"
              required
            />

            <TextField
              label="Sức chứa"
              type="number"
              variant="booking"
              value={formData.capacity}
              onChange={(e) => handleFieldChange('capacity', e.target.value)}
              placeholder="1"
              min="0"
            />

            <TextField
              label="Mô tả"
              variant="booking"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Nhập mô tả"
            />
          </div>

          <DialogFooter className={styles.footer}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : room ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

