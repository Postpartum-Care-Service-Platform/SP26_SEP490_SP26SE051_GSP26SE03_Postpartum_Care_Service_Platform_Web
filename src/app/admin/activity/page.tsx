'use client';

import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/components/ui/toast/use-toast';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Pagination } from '@/components/ui/pagination';
import activityService from '@/services/activity.service';
import type { Activity } from '@/types/activity';
import styles from './activity.module.css';
import { ActivityListHeader, ActivityTable, ActivityTableControls, ImportActivityModal, NewActivityModal } from './components';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const sortActivities = (items: Activity[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
    case 'id-asc':
      return arr.sort((a, b) => a.id - b.id);
    case 'createdAt-desc':
    case 'id-desc':
      return arr.sort((a, b) => b.id - a.id);
    case 'name-asc':
      return arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'name-desc':
      return arr.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    default:
      return arr;
  }
};

// Internal Premium Skeleton Component for consistent look
const SkeletonBone = ({ width, height, circle = false, margin = '0' }: { width?: string | number, height?: string | number, circle?: boolean, margin?: string }) => (
  <div 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      backgroundColor: '#f1f5f9',
      borderRadius: circle ? '50%' : '4px',
      position: 'relative',
      overflow: 'hidden',
      margin: margin
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      animation: 'skeleton-shimmer-run 1.8s infinite linear',
      transform: 'translateX(-100%)'
    }} />
  </div>
);

export default function AdminActivityPage() {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Activity | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [view, setView] = useState<'table' | 'ui'>('table');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for 2s for premium skeleton feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = await activityService.getAllActivities();
      setActivities(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message ? err.message : 'Không thể tải danh sách hoạt động';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);


  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) => ((a.name as string) || '').toLowerCase().includes(q) || ((a.description as string) || '').toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) =>
        statusFilter === 'active' ? (a.status === 0 || a.status === 'Active') : (a.status === 1 || a.status === 'Inactive')
      );
    }

    return sortActivities(filtered, sortKey);
  }, [activities, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredActivities.slice(start, end);
  }, [filteredActivities, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredActivities.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingActivity(null);
    }
  };

  const handleDeleteTrigger = (activity: Activity) => {
    setItemToDelete(activity);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeletingId(itemToDelete.id);
      await activityService.deleteActivity(itemToDelete.id);
      toast({ title: 'Xóa hoạt động thành công', variant: 'success' });
      await fetchActivities();
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message ? err.message : 'Xóa hoạt động thất bại';
      toast({ title: message, variant: 'error' });
    } finally {
      setDeletingId(null);
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleExport = async () => {
    try {
      toast({ title: 'Đang chuẩn bị file xuất...', variant: 'default' });
      const blob = await activityService.exportActivities();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Danh_sach_hoat_dong_${new Date().getTime()}.xlsx`);
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
      const blob = await activityService.downloadTemplateActivities();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Mau_nhap_hoat_dong.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Tải file mẫu thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: 'Tải file mẫu thất bại', description: err.message, variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 bg-white">
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        
        <AdminPageLayout
          header={<ActivityListHeader view={view} onViewChange={setView} />}
          controlPanel={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <SkeletonBone width={320} height={42} />
                <SkeletonBone width={180} height={42} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <SkeletonBone width={120} height={42} />
                <SkeletonBone width={100} height={42} />
                <SkeletonBone width={120} height={42} />
              </div>
            </div>
          }
        >
          <div style={{ 
            backgroundColor: '#ffffff', 
            overflow: 'hidden',
            padding: '0 16px'
          }}>
            <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
            {[...Array(pageSize || 10)].map((_, i) => (
              <div key={i} style={{ 
                height: '64px', 
                borderBottom: i === (pageSize || 10) - 1 ? 'none' : '1px solid #f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 24px', 
                gap: '24px' 
              }}>
                <SkeletonBone width={40} height={16} />
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="60%" height={16} />
                </div>
                <div style={{ flex: 2 }}>
                  <SkeletonBone width="80%" height={16} />
                </div>
                <SkeletonBone width={100} height={32} />
              </div>
            ))}
          </div>
        </AdminPageLayout>
      </div>
    );
  }


  if (error) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Đã xảy ra lỗi</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <AdminPageLayout
        noCard={view === 'ui'}
        header={<ActivityListHeader view={view} onViewChange={setView} />}
        controlPanel={
          view === 'table' ? (
            <ActivityTableControls
              onSearch={(q) => setSearchQuery(q)}
              onSortChange={(sort) => setSortKey(sort)}
              onStatusChange={(status) => setStatusFilter(status as any)}
              onNewActivity={() => setIsModalOpen(true)}
              onImport={() => setIsImportModalOpen(true)}
              onExport={handleExport}
              onDownloadTemplate={handleDownloadTemplate}
            />
          ) : null
        }
        pagination={
          view === 'table' && totalPages > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredActivities.length}
              onPageChange={handlePageChange}
              pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
              onPageSizeChange={handlePageSizeChange}
              showResultCount={true}
            />
          ) : null
        }
      >
        {view === 'table' ? (
          <ActivityTable
            activities={paginatedActivities}
            onEdit={handleEdit}
            onDelete={handleDeleteTrigger}
            deletingId={deletingId}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <div className={styles.emptyState}>
            <p>Dạng xem UI đang được cập nhật...</p>
          </div>
        )}
      </AdminPageLayout>

      <NewActivityModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchActivities}
        activityToEdit={editingActivity}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa hoạt động"
        message={`Bạn có chắc chắn muốn xóa hoạt động "${itemToDelete?.name}"? Hành động này không thể hoàn tác.`}
      />

      <ImportActivityModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={fetchActivities}
      />
    </div>
  );
}

