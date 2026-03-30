'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Bell, ChevronRight, FileText, ShoppingCart, Users, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown/Dropdown';
import notificationService from '@/services/notification.service';
import type { Notification } from '@/types/notification';

import styles from './notification-dropdown.module.css';

const getNotificationIcon = (_typeId: number | null, typeName: string | null) => {
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

export function NotificationDropdown({ onViewAll, isSidebarOpen }: { onViewAll?: () => void; isSidebarOpen?: boolean }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);

  const isFetchingRef = React.useRef(false);

  const fetchData = React.useCallback(async () => {
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setIsLoading(true);

      const notificationsData = await notificationService.getMyNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  // Fetch dữ liệu lần đầu khi mount và mỗi khi fetchData thay đổi
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tự động làm mới thông báo sau mỗi 30 giây để cập nhật badge count
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const unreadCount = notifications.filter((n) => n.status === 'Unread').length;
  const displayCount = unreadCount > 0 ? (unreadCount > 9 ? '9+' : `${unreadCount}`) : null;

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
    } catch {
      return '';
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (notification.status === 'Unread') {
      try {
        await notificationService.markAsRead(notification.id);
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, status: 'Read' as const } : n))
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip.Root open={isOpen || isSidebarOpen ? false : isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <Tooltip.Trigger asChild>
            <DropdownMenuTrigger asChild>
              <button className={styles.trigger} type="button" aria-label="Thông báo">
                <Bell size={18} />
                {displayCount && <span className={styles.badge}>{displayCount}</span>}
              </button>
            </DropdownMenuTrigger>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className={styles.tooltipContent} side="bottom" sideOffset={5}>
              Thông báo
              <Tooltip.Arrow className={styles.tooltipArrow} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <DropdownMenuContent className={styles.dropdownContent} align="end" sideOffset={8}>
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
            notifications.slice(0, 5).map((notification) => {
              const Icon = getNotificationIcon(notification.notificationTypeId, notification.notificationTypeName);
              const isUnread = notification.status === 'Unread';
              return (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${isUnread ? styles.notificationItemUnread : ''}`}
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
                    <div className={styles.notificationTime}>{formatTime(notification.createdAt)}</div>
                  </div>
                  {isUnread && <div className={styles.unreadDot} />}
                </div>
              );
            })
          )}
        </div>

        {notifications.length > 5 && (
          <div className={styles.dropdownFooter}>
            <button
              type="button"
              className={styles.viewMoreLink}
              onClick={() => {
                setIsOpen(false);
                setIsTooltipOpen(false);
                onViewAll?.();
              }}
            >
              <span>Xem tất cả</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  </Tooltip.Provider>
  );
}

