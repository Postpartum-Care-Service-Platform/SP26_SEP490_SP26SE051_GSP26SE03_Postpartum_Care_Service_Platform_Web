'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AlertCircle, Bell, CheckCircle, ChevronRight, Clock, FileText, Info, ShoppingCart, Users, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import notificationService from '@/services/notification.service';
import type { Notification } from '@/types/notification';

import styles from './notification-dropdown.module.css';

const getNotificationIcon = (typeId: number, typeName: string | null) => {
  if (!typeName) {
    return FileText;
  }

  const name = typeName.toLowerCase();
  if (name.includes('báo cáo') || name.includes('tài liệu') || name.includes('document') || name.includes('report')) {
    return FileText;
  }
  if (name.includes('đơn hàng') || name.includes('order') || name.includes('cart')) {
    return ShoppingCart;
  }
  if (name.includes('cuộc họp') || name.includes('nhóm') || name.includes('meeting') || name.includes('group')) {
    return Users;
  }
  if (name.includes('cảnh báo') || name.includes('warning') || name.includes('alert')) {
    return AlertCircle;
  }
  if (name.includes('thành công') || name.includes('success') || name.includes('complete')) {
    return CheckCircle;
  }
  if (name.includes('lỗi') || name.includes('error') || name.includes('fail')) {
    return XCircle;
  }
  if (name.includes('thông tin') || name.includes('info')) {
    return Info;
  }
  return FileText;
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const notificationsData = await notificationService.getMyNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
      // Reset showAll khi mở dropdown
      setShowAll(false);
    }
  }, [isOpen]);

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === 'Unread') {
      try {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, status: 'Read' as const } : n))
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const unreadCount = notifications.filter((n) => n.status === 'Unread').length;
  const displayCount = unreadCount > 0 ? (unreadCount > 9 ? '9+' : `${unreadCount}`) : null;

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
    } catch {
      return '';
    }
  };

  return (
    <DropdownMenu.Root modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className={styles.trigger} type="button" aria-label="Thông báo">
          <Bell width={20} height={20} />
          {displayCount && <span className={styles.badge}>{displayCount}</span>}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={styles.dropdownContent} align="end" sideOffset={8}>
        <div className={styles.dropdownHeader}>
          <div className={styles.headerLeft}>
            <Bell size={18} className={styles.headerIcon} />
            <span className={styles.headerTitle}>Thông báo</span>
          </div>
          {displayCount && <span className={styles.headerBadge}>{displayCount}</span>}
        </div>

        <div className={styles.notificationsList}>
          {isLoading ? (
            <div className={styles.loading}>Đang tải...</div>
          ) : notifications.length === 0 ? (
            <div className={styles.empty}>Không có thông báo</div>
          ) : (
            (showAll ? notifications : notifications.slice(0, 5)).map((notification) => {
              const Icon = getNotificationIcon(notification.notificationTypeId, notification.notificationTypeName);
              const isUnread = notification.status === 'Unread';
              return (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${isUnread ? styles.unread : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={styles.notificationIconWrapper}>
                    <Icon size={20} className={styles.notificationIcon} />
                  </div>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationTitle}>{notification.title}</div>
                    {notification.content && (
                      <div className={styles.notificationContentText}>{notification.content}</div>
                    )}
                    <div className={styles.notificationTime}>
                      <Clock size={12} />
                      <span>{formatTime(notification.createdAt)}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className={styles.notificationArrow} />
                </div>
              );
            })
          )}
        </div>

        {notifications.length > 5 && !showAll && (
          <div className={styles.dropdownFooter}>
            <button
              type="button"
              className={styles.viewMoreLink}
              onClick={(e) => {
                e.preventDefault();
                setShowAll(true);
              }}
            >
              <span>Xem thêm ({notifications.length - 5} thông báo)</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {showAll && notifications.length > 5 && (
          <div className={styles.dropdownFooter}>
            <button
              type="button"
              className={styles.viewMoreLink}
              onClick={(e) => {
                e.preventDefault();
                setShowAll(false);
              }}
            >
              <span>Thu gọn</span>
              <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
