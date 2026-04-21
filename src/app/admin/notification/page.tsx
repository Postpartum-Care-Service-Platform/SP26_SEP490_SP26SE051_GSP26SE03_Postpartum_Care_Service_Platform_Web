'use client';

import { useState, useEffect, useCallback } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import notificationService from '@/services/notification.service';
import type { Notification } from '@/types/notification';
import type { NotificationType } from '@/types/notification-type';
import notificationTypeService from '@/services/notification-type.service';

import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { Pagination } from '@/components/ui/pagination';

import { NotificationListHeader } from './components/NotificationListHeader';
import { NotificationModal } from './components/NotificationModal';
import { NotificationTable } from './components/NotificationTable';
import { NotificationTableControls } from './components/NotificationTableControls';
import { ImportNotificationModal } from './components/ImportNotificationModal';
import styles from './notification.module.css';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (
    typeof error === 'object' && error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) return (error as { message: string }).message;
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

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [sortKey, setSortKey] = useState<'createdAt-desc' | 'createdAt-asc'>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Notification | null>(null);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const filtered = notifications
      .filter((n) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.content && n.content.toLowerCase().includes(q)) ||
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

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await notificationService.updateNotification(notification.id, { status: 'Read' });
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

  const handleDeleteNotification = (notification: Notification) => {
    setItemToDelete(notification);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await notificationService.deleteNotification(itemToDelete.id);
      setNotifications((prev) => prev.filter((n) => n.id !== itemToDelete.id));
      toast({ title: 'Xóa thông báo thành công', variant: 'success' });
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, 'Xóa thông báo thất bại'), variant: 'error' });
    } finally {
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleExport = async () => {
    try {
      toast({ title: 'Đang chuẩn bị file xuất...', variant: 'default' });
      const blob = await notificationService.exportNotifications();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Thong_bao_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: 'Xuất dữ liệu thất bại', description: err.message, variant: 'error' });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      toast({ title: 'Đang tải file mẫu...', variant: 'default' });
      const blob = await notificationService.downloadTemplateNotifications();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Mau_nhap_thong_bao.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Tải file mẫu thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: 'Tải file mẫu thất bại', description: err.message, variant: 'error' });
    }
  };

  const paginatedNotifications = (() => {
    const start = (currentPage - 1) * pageSize;
    return filteredNotifications.slice(start, start + pageSize);
  })();

  const totalPages = Math.ceil(filteredNotifications.length / pageSize);

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <AdminPageLayout
        header={<NotificationListHeader />}
        controlPanel={
          <NotificationTableControls
            onCreateClick={handleCreateNotification}
            onSearch={setSearchQuery}
            onStatusChange={(status) => setStatusFilter(status)}
            onSortChange={(sort) => setSortKey(sort)}
            onImport={() => setIsImportModalOpen(true)}
            onExport={handleExport}
            onDownloadTemplate={handleDownloadTemplate}
          />
        }
        pagination={
          totalPages > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredNotifications.length}
              onPageChange={(page) => setCurrentPage(page)}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showResultCount={true}
            />
          ) : undefined
        }
      >
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
            pagination={{
              currentPage,
              pageSize,
            }}
          />
        )}

        <NotificationModal
          open={isNotificationModalOpen}
          onOpenChange={setIsNotificationModalOpen}
          notification={selectedNotification}
          notificationTypes={notificationTypes}
          onSuccess={fetchData}
        />

        <ImportNotificationModal
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onSuccess={fetchData}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa thông báo"
          message={`Bạn có chắc chắn muốn xóa thông báo "${itemToDelete?.title || itemToDelete?.id}"? Hành động này không thể hoàn tác.`}
          confirmLabel="Xóa ngay"
          cancelLabel="Suy nghĩ lại"
          variant="danger"
        />
      </AdminPageLayout>
    </div>
  );
}

