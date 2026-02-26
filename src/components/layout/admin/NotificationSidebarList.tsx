'use client';

import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AlertCircle, CheckCircle, ChevronRight, Clock, FileText, Info, ShoppingCart, Users, XCircle } from 'lucide-react';
import React from 'react';

import notificationTypeService from '@/services/notification-type.service';
import notificationService from '@/services/notification.service';
import type { Notification } from '@/types/notification';
import type { NotificationType } from '@/types/notification-type';

import styles from './notification-sidebar-list.module.css';

// This helper is copied to keep the component self-contained
const getNotificationIcon = (typeId: number, typesMap: Map<number, NotificationType>) => {
  const type = typesMap.get(typeId);
  if (type && type.name) {
    const name = type.name.toLowerCase();
    if (name.includes('báo cáo') || name.includes('tài liệu')) return FileText;
    if (name.includes('đơn hàng')) return ShoppingCart;
    if (name.includes('cuộc họp') || name.includes('nhóm')) return Users;
    if (name.includes('cảnh báo')) return AlertCircle;
    if (name.includes('thành công')) return CheckCircle;
    if (name.includes('lỗi')) return XCircle;
    if (name.includes('thông tin')) return Info;
  }
  return FileText;
};

export function NotificationSidebarList() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [notificationTypes, setNotificationTypes] = React.useState<Map<number, NotificationType>>(new Map());
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [notificationsData, typesData] = await Promise.all([
          notificationService.getMyNotifications(),
          notificationTypeService.getAllNotificationTypes(),
        ]);
        setNotifications(notificationsData);
        setNotificationTypes(new Map(typesData.map((type) => [type.id, type])));
      } catch (error) {
        console.error('Failed to fetch notifications for sidebar:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return <div className={styles.centered}>Đang tải...</div>;
  }

  if (notifications.length === 0) {
    return <div className={styles.centered}>Không có thông báo nào.</div>;
  }

  return (
    <div className={styles.list}>
      {notifications.map((notification) => {
        const Icon = getNotificationIcon(notification.notificationTypeId, notificationTypes);
        const isUnread = notification.status === 'Unread';
        return (
          <div key={notification.id} className={`${styles.card} ${isUnread ? styles.unread : ''}`}>
            <div className={styles.iconWrapper}>
              <Icon size={20} className={styles.icon} />
            </div>
            <div className={styles.content}>
              <div className={styles.title}>{notification.title}</div>
              <div className={styles.time}>
                <Clock size={13} />
                <span>{formatTime(notification.createdAt)}</span>
              </div>
            </div>
            <ChevronRight size={16} className={styles.arrow} />
          </div>
        );
      })}
    </div>
  );
}
