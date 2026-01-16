'use client';

import React from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
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
                        className={styles.editButton}
                        onClick={() => onEdit?.(type)}
                        aria-label={`Chỉnh sửa ${type.name}`}
                      >
                        <Pencil1Icon />
                      </Button>
                      {type.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.deleteButton}
                          onClick={() => onDelete?.(type)}
                          aria-label={`Xóa ${type.name}`}
                        >
                          <TrashIcon />
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

