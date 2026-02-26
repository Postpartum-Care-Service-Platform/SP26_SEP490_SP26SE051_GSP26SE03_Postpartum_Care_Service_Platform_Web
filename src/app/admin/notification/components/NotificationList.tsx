'use client';

import React from 'react';

import type { Notification } from '@/types/notification';
import type { NotificationType } from '@/types/notification-type';

import styles from './notification-list.module.css';
import { NotificationCard } from './NotificationCard';

type Props = {
  notifications: Notification[];
  notificationTypes: Map<number, NotificationType>;
  onMarkAsRead?: (notification: Notification) => void;
  onEdit?: (notification: Notification) => void;
  onDelete?: (notification: Notification) => void;
};

export function NotificationList({ notifications, notificationTypes, onMarkAsRead, onEdit, onDelete }: Props) {
  if (notifications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Chưa có thông báo nào</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          notificationTypes={notificationTypes}
          onMarkAsRead={onMarkAsRead}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
