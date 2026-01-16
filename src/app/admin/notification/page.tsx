'use client';

import { useState, useEffect } from 'react';
import { NotificationListHeader } from './components/NotificationListHeader';
import { NotificationHeader } from './components/NotificationHeader';
import { NotificationList } from './components/NotificationList';
import { NotificationTypeList } from './components/NotificationTypeList';
import { NotificationTypeTableControls } from './components/NotificationTypeTableControls';
import { NotificationModal } from './components/NotificationModal';
import { NotificationTypeModal } from './components/NotificationTypeModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast/use-toast';
import notificationService from '@/services/notification.service';
import notificationTypeService from '@/services/notification-type.service';
import type { Notification } from '@/types/notification';
import type { NotificationType } from '@/types/notification-type';
import styles from './notification.module.css';

export default function AdminNotificationPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([]);
  const [notificationTypesMap, setNotificationTypesMap] = useState<Map<number, NotificationType>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const [isNotificationTypeModalOpen, setIsNotificationTypeModalOpen] = useState(false);
  const [selectedNotificationType, setSelectedNotificationType] = useState<NotificationType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (n.staffName && n.staffName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (n.receiverName && n.receiverName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNotifications(filtered);
    } else {
      setFilteredNotifications(notifications);
    }
  }, [searchQuery, notifications]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [notificationsData, typesData] = await Promise.all([
        notificationService.getAllNotifications(),
        notificationTypeService.getAllNotificationTypes(),
      ]);
      setNotifications(notificationsData);
      setNotificationTypes(typesData);
      const typesMap = new Map(typesData.map((type) => [type.id, type]));
      setNotificationTypesMap(typesMap);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await notificationService.updateNotification(notification.id, {
        status: 'Read',
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, status: 'Read' as const } : n))
      );
    } catch (err: any) {
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
    } catch (err: any) {
      toast({ title: err?.message || 'Xóa thông báo thất bại', variant: 'error' });
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
    } catch (err: any) {
      toast({ title: err?.message || 'Xóa loại thông báo thất bại', variant: 'error' });
    }
  };

  const handleRestoreNotificationType = async (type: NotificationType) => {
    try {
      await notificationTypeService.restoreNotificationType(type.id);
      toast({ title: 'Khôi phục loại thông báo thành công', variant: 'success' });
      fetchData();
    } catch (err: any) {
      toast({ title: err?.message || 'Khôi phục loại thông báo thất bại', variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <NotificationListHeader />
        <div className={styles.loading}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <NotificationListHeader />
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <NotificationListHeader />
      <Tabs defaultValue="notifications" className={styles.tabs}>
        <TabsList>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="types">Loại thông báo</TabsTrigger>
        </TabsList>
        <TabsContent value="notifications">
          <NotificationHeader
            onSearchChange={setSearchQuery}
            onSortClick={() => {
              const sorted = [...filteredNotifications].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              setFilteredNotifications(sorted);
            }}
          />
          <NotificationList
            notifications={filteredNotifications.length > 0 ? filteredNotifications : notifications}
            notificationTypes={notificationTypesMap}
            onMarkAsRead={handleMarkAsRead}
            onEdit={handleEditNotification}
            onDelete={handleDeleteNotification}
          />
        </TabsContent>
        <TabsContent value="types">
          <NotificationTypeTableControls onCreateClick={handleCreateNotificationType} />
          <NotificationTypeList
            notificationTypes={notificationTypes}
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
