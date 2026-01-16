'use client';

import React from 'react';
import { Bell, Clock, ChevronRight, FileText, ShoppingCart, Users, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown/Dropdown';
import notificationService from '@/services/notification.service';
import notificationTypeService from '@/services/notification-type.service';
import { translateNotificationTypeName } from '@/app/admin/notification/utils/notificationTypeTranslations';
import type { Notification } from '@/types/notification';
import type { NotificationType } from '@/types/notification-type';

import styles from './notification-dropdown.module.css';

const getNotificationIcon = (typeId: number, typeName: string | null, typesMap?: Map<number, NotificationType>) => {
  if (typesMap) {
    const type = typesMap.get(typeId);
    if (type && type.name) {
      const name = type.name.toLowerCase();
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
    }
  }

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
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [notificationTypes, setNotificationTypes] = React.useState<Map<number, NotificationType>>(new Map());
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [notificationsData, typesData] = await Promise.all([
          notificationService.getMyNotifications(),
          notificationTypeService.getAllNotificationTypes(),
        ]);
        setNotifications(notificationsData);
        const typesMap = new Map(typesData.map((type) => [type.id, type]));
        setNotificationTypes(typesMap);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

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
    <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className={styles.trigger} type="button" aria-label="Thông báo">
          <Bell size={18} />
          {displayCount && <span className={styles.badge}>{displayCount}</span>}
        </button>
      </DropdownMenuTrigger>
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
            notifications.slice(0, 3).map((notification) => {
              const Icon = getNotificationIcon(notification.notificationTypeId, notification.notificationTypeName, notificationTypes);
              return (
                <div key={notification.id} className={styles.notificationItem}>
                  <div className={styles.notificationIconWrapper}>
                    <Icon size={20} className={styles.notificationIcon} />
                  </div>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationTitle}>{notification.title}</div>
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

        {notifications.length > 3 && (
          <div className={styles.dropdownFooter}>
            <a href="#" className={styles.viewMoreLink}>
              <span>Xem thêm..</span>
              <ChevronRight size={16} />
            </a>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

