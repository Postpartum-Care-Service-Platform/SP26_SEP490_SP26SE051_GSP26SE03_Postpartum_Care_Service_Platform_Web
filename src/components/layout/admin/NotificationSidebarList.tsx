'use client';

import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AlertCircle, CheckCircle, FileText, Info, ShoppingCart, Users, XCircle } from 'lucide-react';
import React from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useNotificationHub, type NotificationPayload } from '@/hooks/useNotificationHub';
import notificationService from '@/services/notification.service';
import type { Notification } from '@/types/notification';

import styles from './notification-sidebar-list.module.css';

const getNotificationIcon = (_typeId: number | null, typeName: string | null) => {
  if (!typeName) return FileText;

  const name = typeName.toLowerCase();
  if (name.includes('báo cáo') || name.includes('tài liệu') || name.includes('document') || name.includes('report')) return FileText;
  if (name.includes('đơn hàng') || name.includes('order') || name.includes('cart')) return ShoppingCart;
  if (name.includes('cuộc họp') || name.includes('nhóm') || name.includes('meeting') || name.includes('group')) return Users;
  if (name.includes('cảnh báo') || name.includes('warning') || name.includes('alert')) return AlertCircle;
  if (name.includes('thành công') || name.includes('success') || name.includes('complete')) return CheckCircle;
  if (name.includes('lỗi') || name.includes('error') || name.includes('fail')) return XCircle;
  if (name.includes('thông tin') || name.includes('info')) return Info;
  return FileText;
};

export function NotificationSidebarList() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const { session } = useAuth();
  const token = session?.user?.accessToken;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const notificationsData = await notificationService.getMyNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Failed to fetch notifications for sidebar:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReceive = React.useCallback((notification: NotificationPayload) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notification.id)) return prev;
      
      // Normalize status: backend SignalR sends 0/1, but type expects 'Unread'/'Read'
      const normalized = {
        ...notification,
        status: notification.status === 0 || notification.status === 'Unread' ? 'Unread' : 'Read',
      } as unknown as Notification;
      
      return [normalized, ...prev];
    });
  }, []);

  useNotificationHub({ token, onReceive: handleReceive });

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
    } catch {
      return '';
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === 'Unread') {
      try {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, status: 'Read' } : n))
        );
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
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
        const Icon = getNotificationIcon(notification.notificationTypeId, notification.notificationTypeName);
        const isUnread = notification.status === 'Unread';
        return (
          <div 
            key={notification.id} 
            className={`${styles.card} ${isUnread ? styles.unread : ''}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className={styles.iconWrapper}>
              <Icon size={20} className={styles.icon} />
            </div>
            <div className={styles.content}>
              <div className={styles.title}>{notification.title}</div>
              {notification.content && <div className={styles.contentText}>{notification.content}</div>}
              <div className={styles.time}>{formatTime(notification.createdAt)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
