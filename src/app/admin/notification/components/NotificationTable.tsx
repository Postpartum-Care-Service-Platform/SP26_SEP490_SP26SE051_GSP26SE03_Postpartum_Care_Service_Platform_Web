'use client';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { translateNotificationTypeName } from '../utils/notificationTypeTranslations';
import type { Notification } from '@/types/notification';

import styles from './notification-table.module.css';

const Edit2OutlineIcon = ({ fill = '#A47BC8', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-edit-2-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

const Trash2OutlineIcon = ({ fill = '#FD6161', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-trash-2-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="trash-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
        <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
        <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
      </g>
    </g>
  </svg>
);

type Props = {
  notifications: Notification[];
  onEdit?: (notification: Notification) => void;
  onDelete?: (notification: Notification) => void;
  onMarkAsRead?: (notification: Notification) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export function NotificationTable({ notifications, onEdit, onDelete, onMarkAsRead, pagination }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Loại</th>
            <th>Người gửi</th>
            <th>Người nhận</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {notifications.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.emptyState}>
                Chưa có thông báo nào
              </td>
            </tr>
          ) : (
            notifications.map((notification) => (
              <tr key={notification.id} className={styles.tableRow}>
                <td>{notification.id}</td>
                <td className={styles.titleCell} title={notification.title}>
                  {notification.title}
                </td>
                <td>{translateNotificationTypeName(notification.notificationTypeName || '')}</td>
                <td>{notification.staffName || 'Hệ thống'}</td>
                <td>{notification.receiverName || '-'}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      notification.status === 'Unread' ? styles.statusUnread : styles.statusRead
                    }`}
                  >
                    {notification.status === 'Unread' ? 'Chưa đọc' : 'Đã đọc'}
                  </span>
                </td>
                <td>{formatDate(notification.createdAt)}</td>
                <td>
                  <div className={styles.actions}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${styles.editButton} btn-icon btn-sm`}
                      onClick={() => onEdit?.(notification)}
                      aria-label={`Chỉnh sửa ${notification.title}`}
                    >
                      <Edit2OutlineIcon fill="#A47BC8" size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${styles.deleteButton} btn-icon btn-sm`}
                      onClick={() => onDelete?.(notification)}
                      aria-label={`Xóa ${notification.title}`}
                    >
                      <Trash2OutlineIcon fill="#FD6161" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={pagination.onPageChange}
            showResultCount={true}
          />
        </div>
      )}
    </div>
  );
}
