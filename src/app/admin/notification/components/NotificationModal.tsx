'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import notificationService from '@/services/notification.service';
import type { Notification, CreateNotificationRequest, UpdateNotificationRequest } from '@/types/notification';
import type { NotificationType } from '@/types/notification-type';

import { translateNotificationTypeName } from '../utils/notificationTypeTranslations';

import styles from './notification-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification?: Notification | null;
  notificationTypes: NotificationType[];
  onSuccess?: () => void;
};

type FormErrors = {
  title?: string;
  content?: string;
  notificationTypeId?: string;
};

const INITIAL_FORM = {
  title: '',
  content: '',
  notificationTypeId: '',
  status: 'Unread' as 'Unread' | 'Read',
};

export function NotificationModal({ open, onOpenChange, notification, notificationTypes, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!notification;

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
          ...INITIAL_FORM,
          notificationTypeId: notificationTypes.length > 0 ? String(notificationTypes[0].id) : '',
        });
      }
      setErrors({});
    }
  }, [open, notification, notificationTypes]);

  const handleFieldChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống.';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống.';
    }
    if (!formData.notificationTypeId) {
      newErrors.notificationTypeId = 'Vui lòng chọn loại thông báo.';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditMode && notification) {
        const payload: UpdateNotificationRequest = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          notificationTypeId: Number(formData.notificationTypeId),
          status: formData.status,
        };
        await notificationService.updateNotification(notification.id, payload);
        toast({ title: 'Cập nhật thông báo thành công', variant: 'success' });
      } else {
        const payload: CreateNotificationRequest = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          notificationTypeId: Number(formData.notificationTypeId),
        };
        await notificationService.createNotification(payload);
        toast({ title: 'Tạo thông báo thành công', variant: 'success' });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const fallbackMessage = isEditMode ? 'Cập nhật thông báo thất bại' : 'Tạo thông báo thất bại';
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : fallbackMessage;
      toast({ title: message, variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isEditMode ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="notification-title">
                Tiêu đề <span className={styles.required}>*</span>
              </label>
              <input
                id="notification-title"
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Nhập tiêu đề thông báo"
                className={`${styles.formControl} ${errors.title ? styles.invalid : ''}`}
                required
              />
              {errors.title && <p className={styles.errorMessage}>{errors.title}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notification-type">
                Loại thông báo <span className={styles.required}>*</span>
              </label>
              <select
                id="notification-type"
                value={formData.notificationTypeId}
                onChange={(e) => handleFieldChange('notificationTypeId', e.target.value)}
                className={`${styles.formControl} ${errors.notificationTypeId ? styles.invalid : ''}`}
                required
              >
                <option value="" disabled>
                  Chọn loại thông báo
                </option>
                {notificationTypes.map((type) => (
                  <option key={type.id} value={String(type.id)}>
                    {translateNotificationTypeName(type.name)}
                  </option>
                ))}
              </select>
              {errors.notificationTypeId && <p className={styles.errorMessage}>{errors.notificationTypeId}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notification-content">
                Nội dung <span className={styles.required}>*</span>
              </label>
              <textarea
                id="notification-content"
                className={`${styles.formControl} ${styles.textarea} ${errors.content ? styles.invalid : ''}`}
                value={formData.content}
                onChange={(e) => handleFieldChange('content', e.target.value)}
                placeholder="Nhập nội dung thông báo"
                rows={4}
                required
              />
              {errors.content && <p className={styles.errorMessage}>{errors.content}</p>}
            </div>

            {isEditMode && (
              <div className={styles.formGroup}>
                <label htmlFor="notification-status">Trạng thái</label>
                <select
                  id="notification-status"
                  value={formData.status}
                  onChange={(e) => handleFieldChange('status', e.target.value as 'Unread' | 'Read')}
                  className={styles.formControl}
                >
                  <option value="Unread">Chưa đọc</option>
                  <option value="Read">Đã đọc</option>
                </select>
              </div>
            )}
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
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

