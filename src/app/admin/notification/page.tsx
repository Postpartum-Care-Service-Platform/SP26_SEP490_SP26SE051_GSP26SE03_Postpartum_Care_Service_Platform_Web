'use client';

import { useState, useEffect, useCallback } from 'react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast/use-toast';
import notificationTypeService from '@/services/notification-type.service';
import notificationService from '@/services/notification.service';
import type { Notification } from '@/types/notification';
import type { NotificationType } from '@/types/notification-type';

import { NotificationListHeader } from './components/NotificationListHeader';
import { NotificationModal } from './components/NotificationModal';
import { NotificationTable } from './components/NotificationTable';
import { NotificationTableControls } from './components/NotificationTableControls';
import { NotificationTypeList } from './components/NotificationTypeList';
import { NotificationTypeModal } from './components/NotificationTypeModal';
import { NotificationTypeTableControls } from './components/NotificationTypeTableControls';
import styles from './notification.module.css';
import { translateNotificationTypeName } from './utils/notificationTypeTranslations';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
};

export default function AdminNotificationPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const [isNotificationTypeModalOpen, setIsNotificationTypeModalOpen] = useState(false);
  const [selectedNotificationType, setSelectedNotificationType] = useState<NotificationType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [sortKey, setSortKey] = useState<'createdAt-desc' | 'createdAt-asc'>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [notificationTypeSearch, setNotificationTypeSearch] = useState('');
  const [notificationTypeStatus, setNotificationTypeStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const filtered = notifications
      .filter((n) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.staffName && n.staffName.toLowerCase().includes(q)) ||
          (n.receiverName && n.receiverName.toLowerCase().includes(q))
        );
      })
      .filter((n) => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'unread') return n.status === 'Unread';
        return n.status === 'Read';
      })
      .sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return sortKey === 'createdAt-desc' ? bTime - aTime : aTime - bTime;
      });

    setFilteredNotifications(filtered);
    setCurrentPage(1);
  }, [searchQuery, notifications, statusFilter, sortKey]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [notificationsData, typesData] = await Promise.all([
        notificationService.getAllNotifications(),
        notificationTypeService.getAllNotificationTypes(),
      ]);
      setNotifications(notificationsData);
      setNotificationTypes(typesData);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Không thể tải dữ liệu'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await notificationService.updateNotification(notification.id, {
        status: 'Read',
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, status: 'Read' as const } : n))
      );
    } catch (err: unknown) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleCreateNotification = () => {
    setSelectedNotification(null);
    setIsNotificationModalOpen(true);
  };

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsNotificationModalOpen(true);
  };

  const handleDeleteNotification = async (notification: Notification) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa thông báo "${notification.title}"?`)) {
      return;
    }

    try {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      toast({ title: 'Xóa thông báo thành công', variant: 'success' });
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, 'Xóa thông báo thất bại'), variant: 'error' });
    }
  };

  const handleCreateNotificationType = () => {
    setSelectedNotificationType(null);
    setIsNotificationTypeModalOpen(true);
  };

  const handleEditNotificationType = (type: NotificationType) => {
    setSelectedNotificationType(type);
    setIsNotificationTypeModalOpen(true);
  };

  const handleDeleteNotificationType = async (type: NotificationType) => {
    try {
      await notificationTypeService.deleteNotificationType(type.id);
      setNotificationTypes((prev) => prev.map((t) => (t.id === type.id ? { ...t, isActive: false } : t)));
      toast({ title: 'Xóa loại thông báo thành công', variant: 'success' });
      fetchData();
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, 'Xóa loại thông báo thất bại'), variant: 'error' });
    }
  };

  const handleRestoreNotificationType = async (type: NotificationType) => {
    try {
      await notificationTypeService.restoreNotificationType(type.id);
      toast({ title: 'Khôi phục loại thông báo thành công', variant: 'success' });
      fetchData();
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, 'Khôi phục loại thông báo thất bại'), variant: 'error' });
    }
  };

  const filteredNotificationTypes = notificationTypes.filter((type) => {
    const matchesSearch = notificationTypeSearch
      ? translateNotificationTypeName(type.name).toLowerCase().includes(notificationTypeSearch.toLowerCase())
      : true;
    const matchesStatus =
      notificationTypeStatus === 'all'
        ? true
        : notificationTypeStatus === 'active'
          ? type.isActive
          : !type.isActive;
    return matchesSearch && matchesStatus;
  });

  const paginatedNotifications = (() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredNotifications.slice(start, end);
  })();

  const totalPages = Math.ceil(filteredNotifications.length / PAGE_SIZE);

  return (
    <div className={styles.pageContainer}>
      <NotificationListHeader />
      <Tabs defaultValue="notifications" className={styles.tabs}>
        <TabsList>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="types">Loại thông báo</TabsTrigger>
        </TabsList>
        <TabsContent value="notifications">
          <NotificationTableControls
            onCreateClick={handleCreateNotification}
            onSearch={setSearchQuery}
            onStatusChange={(status) => setStatusFilter(status)}
            onSortChange={(sort) => setSortKey(sort)}
          />
          {loading ? (
            <div className={styles.loading}>Đang tải dữ liệu...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <NotificationTable
              notifications={paginatedNotifications}
              onEdit={handleEditNotification}
              onDelete={handleDeleteNotification}
              onMarkAsRead={handleMarkAsRead}
              pagination={
                totalPages > 0
                  ? {
                      currentPage,
                      totalPages,
                      pageSize: PAGE_SIZE,
                      totalItems: filteredNotifications.length,
                      onPageChange: (page) => setCurrentPage(page),
                    }
                  : undefined
              }
            />
          )}
        </TabsContent>
        <TabsContent value="types">
          <NotificationTypeTableControls
            onCreateClick={handleCreateNotificationType}
            onSearch={(q) => setNotificationTypeSearch(q)}
            onStatusChange={(s) => setNotificationTypeStatus(s)}
          />
          <NotificationTypeList
            notificationTypes={filteredNotificationTypes}
            onEdit={handleEditNotificationType}
            onDelete={handleDeleteNotificationType}
            onRestore={handleRestoreNotificationType}
          />
        </TabsContent>
      </Tabs>

      <NotificationModal
        open={isNotificationModalOpen}
        onOpenChange={setIsNotificationModalOpen}
        notification={selectedNotification}
        notificationTypes={notificationTypes}
        onSuccess={fetchData}
      />

      <NotificationTypeModal
        open={isNotificationTypeModalOpen}
        onOpenChange={setIsNotificationTypeModalOpen}
        type={selectedNotificationType}
        onSuccess={fetchData}
      />
    </div>
  );
}
