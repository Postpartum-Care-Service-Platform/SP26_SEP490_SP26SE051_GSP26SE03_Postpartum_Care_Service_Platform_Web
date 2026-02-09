'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { translateNotificationTypeName } from '../utils/notificationTypeTranslations';
import type { NotificationType } from '@/types/notification-type';
import styles from './notification-type-list.module.css';

type Props = {
  notificationTypes: NotificationType[];
  onEdit?: (type: NotificationType) => void;
  onDelete?: (type: NotificationType) => void;
  onRestore?: (type: NotificationType) => void;
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

export function NotificationTypeList({ notificationTypes, onEdit, onDelete, onRestore }: Props) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên loại</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {notificationTypes.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  Chưa có loại thông báo nào
                </td>
              </tr>
            ) : (
              notificationTypes.map((type) => (
                <tr key={type.id} className={styles.tableRow}>
                  <td>{type.id}</td>
                  <td className={styles.name}>{translateNotificationTypeName(type.name)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${type.isActive ? styles.statusActive : styles.statusInactive}`}>
                      {type.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td>{formatDate(type.createdAt)}</td>
                  <td>{formatDate(type.updatedAt)}</td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.editButton} btn-icon btn-sm`}
                        onClick={() => onEdit?.(type)}
                        aria-label={`Chỉnh sửa ${type.name}`}
                      >
                        <Edit2OutlineIcon fill="#A47BC8" size={16} />
                      </Button>
                      {type.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${styles.deleteButton} btn-icon btn-sm`}
                          onClick={() => onDelete?.(type)}
                          aria-label={`Xóa ${type.name}`}
                        >
                          <Trash2OutlineIcon fill="#FD6161" size={16} />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.restoreButton}
                          onClick={() => onRestore?.(type)}
                          aria-label={`Khôi phục ${type.name}`}
                        >
                          Khôi phục
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

