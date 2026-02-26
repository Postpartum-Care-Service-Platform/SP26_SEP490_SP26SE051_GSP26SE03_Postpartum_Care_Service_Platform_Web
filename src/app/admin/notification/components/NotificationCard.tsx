'use client';

/* eslint-disable import/order */

import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MoreVertical } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown/Dropdown';
import { translateNotificationTypeName } from '../utils/notificationTypeTranslations';
import styles from './notification-card.module.css';

import type { Notification } from '@/types/notification';
import type { NotificationType } from '@/types/notification-type';

type Props = {
  notification: Notification;
  notificationTypes?: Map<number, NotificationType>;
  onMarkAsRead?: (notification: Notification) => void;
  onEdit?: (notification: Notification) => void;
  onDelete?: (notification: Notification) => void;
};

const getInitials = (name: string | null | undefined): string => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name: string | null | undefined): string => {
  if (!name) return '#9CA3AF';
  const colors = [
    '#FA8314',
    '#8B5CF6',
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#EC4899',
    '#6366F1',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const formatTime = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: vi,
    });
  } catch {
    return '';
  }
};

export function NotificationCard({ notification, onMarkAsRead, onEdit, onDelete }: Props) {
  const isUnread = notification.status === 'Unread';
  const staffName = notification.staffName || 'Hệ thống';
  const avatarColor = getAvatarColor(staffName);
  const initials = getInitials(staffName);

  const handleCardClick = () => {
    if (isUnread) {
      onMarkAsRead?.(notification);
    }
  };

  return (
    <div
      className={`${styles.card} ${isUnread ? styles.unread : ''}`}
      onClick={handleCardClick}
    >
      <div className={styles.cardContent}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar} style={{ backgroundColor: avatarColor }}>
            {initials}
          </div>
          {isUnread && <div className={styles.unreadDot} />}
        </div>

        <div className={styles.content}>
          <div className={styles.mainText}>
            <span className={styles.staffName}>{staffName}</span>
            <span className={styles.actionText}> {notification.title}</span>
          </div>

          {notification.content && (
            <div className={styles.description}>{notification.content}</div>
          )}

          <div className={styles.meta}>
            <span className={styles.time}>{formatTime(notification.createdAt)}</span>
            {notification.receiverName && (
              <>
                <span className={styles.separator}>|</span>
                <span className={styles.team}>
                  {translateNotificationTypeName(notification.notificationTypeName)}
                </span>
              </>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={styles.menuButton}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(notification)}>
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(notification)}
                className={styles.deleteItem}
              >
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
