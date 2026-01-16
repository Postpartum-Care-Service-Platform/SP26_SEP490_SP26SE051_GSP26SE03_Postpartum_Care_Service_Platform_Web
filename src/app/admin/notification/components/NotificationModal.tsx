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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast/use-toast';
import notificationService from '@/services/notification.service';
import notificationTypeService from '@/services/notification-type.service';
import { translateNotificationTypeName } from '../utils/notificationTypeTranslations';
import type { Notification, CreateNotificationRequest, UpdateNotificationRequest } from '@/types/notification';
import type { NotificationType } from '@/types/notification-type';
import styles from './notification-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification?: Notification | null;
  notificationTypes: NotificationType[];
  onSuccess?: () => void;
};

export function NotificationModal({ open, onOpenChange, notification, notificationTypes, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    notificationTypeId: '',
    status: 'Unread' as 'Unread' | 'Read',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (notification) {
        setFormData({
          title: notification.title,
          content: notification.content,
          notificationTypeId: String(notification.notificationTypeId),
          status: notification.status,
        });
      } else {
        setFormData({
          title: '',
          content: '',
          notificationTypeId: notificationTypes.length > 0 ? String(notificationTypes[0].id) : '',
          status: 'Unread',
        });
      }
    }
  }, [open, notification, notificationTypes]);

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

    if (!formData.title.trim()) {
      toast({ title: 'Vui lòng nhập tiêu đề', variant: 'error' });
      return;
    }

    if (!formData.content.trim()) {
      toast({ title: 'Vui lòng nhập nội dung', variant: 'error' });
      return;
    }

    if (!formData.notificationTypeId) {
      toast({ title: 'Vui lòng chọn loại thông báo', variant: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);

      if (notification) {
        const updateData: UpdateNotificationRequest = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          notificationTypeId: Number(formData.notificationTypeId),
          status: formData.status,
        };
        await notificationService.updateNotification(notification.id, updateData);
        toast({ title: 'Cập nhật thông báo thành công', variant: 'success' });
      } else {
        const createData: CreateNotificationRequest = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          notificationTypeId: Number(formData.notificationTypeId),
        };
        await notificationService.createNotification(createData);
        toast({ title: 'Tạo thông báo thành công', variant: 'success' });
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
            {notification ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}
          </DialogTitle>
          <DialogDescription>
            {notification ? 'Cập nhật thông tin thông báo' : 'Điền thông tin để tạo thông báo mới'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formFields}>
            <TextField
              label="Tiêu đề"
              variant="booking"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Nhập tiêu đề thông báo"
              required
            />

            <div className={styles.selectField}>
              <label className={styles.selectLabel}>Loại thông báo</label>
              <Select value={formData.notificationTypeId} onValueChange={(value) => handleFieldChange('notificationTypeId', value)}>
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Chọn loại thông báo" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {translateNotificationTypeName(type.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={styles.textareaField}>
              <label className={styles.textareaLabel}>Nội dung</label>
              <textarea
                className={styles.textarea}
                value={formData.content}
                onChange={(e) => handleFieldChange('content', e.target.value)}
                placeholder="Nhập nội dung thông báo"
                rows={4}
                required
              />
            </div>

            {notification && (
              <div className={styles.selectField}>
                <label className={styles.selectLabel}>Trạng thái</label>
                <Select value={formData.status} onValueChange={(value) => handleFieldChange('status', value)}>
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unread">Chưa đọc</SelectItem>
                    <SelectItem value="Read">Đã đọc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
              {isSubmitting ? 'Đang xử lý...' : notification ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

