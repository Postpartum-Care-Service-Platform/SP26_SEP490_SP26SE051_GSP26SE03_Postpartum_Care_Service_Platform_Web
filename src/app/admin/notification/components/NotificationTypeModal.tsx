'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/toast/use-toast';
import notificationTypeService from '@/services/notification-type.service';
import type { NotificationType, CreateNotificationTypeRequest, UpdateNotificationTypeRequest } from '@/types/notification-type';
import styles from './notification-type-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: NotificationType | null;
  onSuccess?: () => void;
};

export function NotificationTypeModal({ open, onOpenChange, type, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (type) {
        setFormData({
          name: type.name,
          isActive: type.isActive,
        });
      } else {
        setFormData({
          name: '',
          isActive: true,
        });
      }
    }
  }, [open, type]);

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

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: 'Vui lòng nhập tên loại thông báo', variant: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);

      if (type) {
        const updateData: UpdateNotificationTypeRequest = {
          name: formData.name.trim(),
          isActive: formData.isActive,
        };
        await notificationTypeService.updateNotificationType(type.id, updateData);
        toast({ title: 'Cập nhật loại thông báo thành công', variant: 'success' });
      } else {
        const createData: CreateNotificationTypeRequest = {
          name: formData.name.trim(),
          isActive: formData.isActive,
        };
        await notificationTypeService.createNotificationType(createData);
        toast({ title: 'Tạo loại thông báo thành công', variant: 'success' });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast({ title: err?.message || 'Có lỗi xảy ra', variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            {type ? 'Chỉnh sửa loại thông báo' : 'Thêm loại thông báo mới'}
          </DialogTitle>
          <DialogDescription>
            {type ? 'Cập nhật thông tin loại thông báo' : 'Điền thông tin để tạo loại thông báo mới'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formFields}>
            <TextField
              label="Tên loại thông báo"
              variant="booking"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Nhập tên loại thông báo"
              required
            />

            <div className={styles.switchField}>
              <label className={styles.switchLabel}>Trạng thái hoạt động</label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleFieldChange('isActive', checked)}
              />
            </div>
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
              {isSubmitting ? 'Đang xử lý...' : type ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

