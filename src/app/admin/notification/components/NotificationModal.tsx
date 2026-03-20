'use client';
import { ChevronDownIcon, Cross1Icon, CheckIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import notificationService from '@/services/notification.service';
import userService from '@/services/user.service';
import amenityTicketService from '@/services/amenity-ticket.service';
import type { Account } from '@/types/account';
import type { AmenityTicket } from '@/types/amenity-ticket';
import type { Notification, CreateNotificationRequest, UpdateNotificationRequest } from '@/types/notification';
import type { NotificationType } from '@/types/notification-type';

import * as Checkbox from '@radix-ui/react-checkbox';
import { translateNotificationTypeName } from '../utils/notificationTypeTranslations';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import { cn } from '@/lib/utils';
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
  receiverIds?: string;
  amenityTicketId?: string;
};

// --- Move constants and helper functions to the top ---
const INITIAL_FORM = {
  title: '',
  content: '',
  notificationTypeId: '',
  amenityTicketId: 0,
  receiverIds: [] as string[],
  status: 'Unread' as 'Unread' | 'Read',
};

const AVATAR_COLORS = ['#fb3e3e', '#fa8314', '#007bff', '#28a745', '#6f42c1'];

function getAvatarColor(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function UserMultiSelect({
  users,
  selectedUserIds,
  onChange,
  isFetching,
  error,
}: {
  users: Account[];
  selectedUserIds: string[];
  onChange: (ids: string[]) => void;
  isFetching: boolean;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (id: string) => {
    if (selectedUserIds.includes(id)) {
      onChange(selectedUserIds.filter((uid) => uid !== id));
    } else {
      onChange([...selectedUserIds, id]);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUsers = users.filter((u) => selectedUserIds.includes(u.id));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          styles.formControl,
          'flex items-center justify-between min-h-[40px] px-3 py-2 gap-2 cursor-pointer transition-all duration-200',
          isOpen && 'border-[var(--color-brand-accent)] ring-1 ring-[rgba(250,131,20,0.1)]',
          error ? styles.invalid : '',
          'bg-white'
        )}
      >
        <div className={styles.selectedUsers}>
          {selectedUsers.length > 0 ? (
            <>
              {selectedUsers.slice(0, 3).map((user) => (
                <span key={user.id} className={styles.userChip}>
                  {user.ownerProfile?.fullName || user.username}
                  <Cross1Icon
                    className={styles.removeChip}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(user.id);
                    }}
                  />
                </span>
              ))}
              {selectedUsers.length > 3 && (
                <span className="text-xs text-slate-500 whitespace-nowrap ml-1">
                  + {selectedUsers.length - 3} người khác
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400">Chọn người nhận</span>
          )}
        </div>
        <ChevronDownIcon
          className={cn('w-4 h-4 text-slate-500 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-[10010] top-full right-0 mt-1 min-w-[450px] max-h-[400px] flex flex-col',
            'border border-[var(--color-border-default)] rounded-[var(--radius-sm)] shadow-[var(--shadow-lg)] bg-white'
          )}
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="p-[12px] border-b border-[var(--color-border-default)] bg-[#fcfcfc]">
            <div className={styles.searchContainer}>
              <span className={styles.searchIcon}>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className={cn('flex-1 overflow-y-auto text-left', styles.noScroll)}>
            {isFetching ? (
              <p className="p-4 text-center text-sm">Đang tải...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="p-4 text-center text-sm text-slate-500">
                {searchTerm ? 'Không tìm thấy kết quả' : 'Không có người dùng'}
              </p>
            ) : (
              <>
                <label className={cn(styles.userOption, 'border-b border-[#f1f3f5] sticky top-0 bg-white z-10 !py-3')}>
                  <Checkbox.Root
                    className={styles.radixCheckbox}
                    checked={filteredUsers.length > 0 && filteredUsers.every(u => selectedUserIds.includes(u.id))}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const newIds = Array.from(new Set([...selectedUserIds, ...filteredUsers.map(u => u.id)]));
                        onChange(newIds);
                      } else {
                        const filteredIds = filteredUsers.map(u => u.id);
                        onChange(selectedUserIds.filter(id => !filteredIds.includes(id)));
                      }
                    }}
                  >
                    <Checkbox.Indicator className={styles.radixIndicator}>
                      <CheckIcon style={{ width: '8px', height: '8px' }} />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <div style={{ width: '32px' }} /> {/* Avatar placeholder for alignment */}
                  <span className="text-sm font-medium text-slate-600">Chọn tất cả ({filteredUsers.length})</span>
                </label>
                {filteredUsers.map((user: Account) => (
                  <label
                    key={user.id}
                    className={cn(styles.userOption, selectedUserIds.includes(user.id) && styles.selected)}
                  >
                    <Checkbox.Root
                      className={styles.radixCheckbox}
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={() => handleToggle(user.id)}
                    >
                      <Checkbox.Indicator className={styles.radixIndicator}>
                        <CheckIcon style={{ width: '8px', height: '8px' }} />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <div className={styles.userAvatar} style={{ backgroundColor: getAvatarColor(user.username) }}>
                      {(user.ownerProfile?.fullName || user.username).substring(0, 2).toUpperCase()}
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{user.ownerProfile?.fullName || user.username}</span>
                      <span className={styles.userEmail}>{user.email}</span>
                    </div>
                  </label>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export function NotificationModal({ open, onOpenChange, notification, notificationTypes, onSuccess }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFetchingAccounts, setIsFetchingAccounts] = useState(false);
  const [amenityTickets, setAmenityTickets] = useState<AmenityTicket[]>([]);
  const isEditMode = !!notification;

  useEffect(() => {
    const fetchAmenityTickets = async () => {
      try {
        const data = await amenityTicketService.getAllAmenityTickets();
        setAmenityTickets(data);
      } catch (error) {
        console.error('Error fetching amenity tickets:', error);
      }
    };
    fetchAmenityTickets();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsFetchingAccounts(true);
        const data = await userService.getAllAccounts();
        setAccounts(data);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      } finally {
        setIsFetchingAccounts(false);
      }
    };

    if (open && !isEditMode) {
      fetchAccounts();
    }
  }, [open, isEditMode]);

  const prevOpenRef = useRef(open);
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      if (notification) {
        setFormData({
          title: notification.title || '',
          content: notification.content || '',
          notificationTypeId: notification.notificationTypeId ? String(notification.notificationTypeId) : '',
          amenityTicketId: notification.amenityTicketId || 0,
          receiverIds: notification.receiverId ? [notification.receiverId] : [],
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
    prevOpenRef.current = open;
  }, [open, notification, notificationTypes]);

  const handleFieldChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev: typeof INITIAL_FORM) => ({ ...prev, [field]: value }));
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
    if (!isEditMode && formData.receiverIds.length === 0) {
      newErrors.receiverIds = 'Vui lòng chọn ít nhất một người nhận.';
    }
    if (!isEditMode && (!formData.amenityTicketId || formData.amenityTicketId === 0)) {
      newErrors.amenityTicketId = 'Vui lòng chọn phiếu tiện nghi.';
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
          amenityTicketId: formData.amenityTicketId,
          receiverIds: formData.receiverIds,
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
          <div className={styles.tooltipWrapper}>
            <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
              <Cross1Icon />
            </button>
            <span className={styles.tooltip}>Đóng</span>
          </div>
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
                className={`${styles.formControl} ${errors.title ? styles.invalid : ''} bg-white`}
                required
              />
              {errors.title && <p className={styles.errorMessage}>{errors.title}</p>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="notification-type">
                  Loại thông báo <span className={styles.required}>*</span>
                </label>
                <CustomDropdown
                  options={notificationTypes.map((type) => ({
                    value: String(type.id),
                    label: translateNotificationTypeName(type.name),
                  }))}
                  value={formData.notificationTypeId}
                  onChange={(value) => handleFieldChange('notificationTypeId', value)}
                  placeholder="Chọn loại thông báo"
                  triggerClassName={`${errors.notificationTypeId ? styles.invalid : ''} bg-white`}
                />
                {errors.notificationTypeId && <p className={styles.errorMessage}>{errors.notificationTypeId}</p>}
              </div>

              {!isEditMode && (
                <div className={styles.formGroup}>
                  <label>
                    Người nhận <span className={styles.required}>*</span>
                  </label>
                  <UserMultiSelect
                    users={accounts}
                    selectedUserIds={formData.receiverIds}
                    onChange={(ids) => setFormData((prev: typeof INITIAL_FORM) => ({ ...prev, receiverIds: ids }))}
                    isFetching={isFetchingAccounts}
                    error={errors.receiverIds}
                  />
                  {errors.receiverIds && <p className={styles.errorMessage}>{errors.receiverIds}</p>}
                </div>
              )}
            </div>

            {!isEditMode && (
              <div className={styles.formGroup}>
                <label htmlFor="notification-amenityTicketId">
                  Phiếu Tiện Nghi <span className={styles.required}>*</span>
                </label>
                <CustomDropdown
                  options={amenityTickets.map((t) => ({
                    value: String(t.id),
                    label: `Phiếu #${t.id} - ${t.status}`,
                  }))}
                  value={formData.amenityTicketId ? String(formData.amenityTicketId) : ''}
                  onChange={(val) => handleFieldChange('amenityTicketId', Number(val))}
                  placeholder="Chọn phiếu tiện nghi"
                  triggerClassName={`${errors.amenityTicketId ? styles.invalid : ''} bg-white`}
                />
                {errors.amenityTicketId && <p className={styles.errorMessage}>{errors.amenityTicketId}</p>}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="notification-content">
                Nội dung <span className={styles.required}>*</span>
              </label>
              <textarea
                id="notification-content"
                className={`${styles.formControl} ${styles.textarea} ${errors.content ? styles.invalid : ''} bg-white`}
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
                <label>Trạng thái</label>
                <CustomDropdown
                  options={[
                    { value: 'Unread', label: 'Chưa đọc' },
                    { value: 'Read', label: 'Đã đọc' },
                  ]}
                  value={formData.status}
                  onChange={(value) => handleFieldChange('status', value as 'Unread' | 'Read')}
                  triggerClassName="bg-white"
                />
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

