'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/components/ui/toast/use-toast';
import { Pagination } from '@/components/ui/pagination';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';

import appointmentTypeService from '@/services/appointment-type.service';
import type { AppointmentTypeDetail } from '@/types/appointment-type';

import { AppointmentTypeTable } from './components/AppointmentTypeTable';
import { AppointmentTypeTableControls } from './components/AppointmentTypeTableControls';
import { AppointmentTypeModal } from './components/AppointmentTypeModal';
import { ImportAppointmentTypeModal } from './components/ImportAppointmentTypeModal';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import styles from './appointment-type.module.css';

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

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error &&
    typeof (error as { message?: unknown }).message === 'string')
    return (error as { message: string }).message;
  return fallback;
};

export default function AdminAppointmentTypePage() {
  const { toast } = useToast();
  const [items, setItems] = useState<AppointmentTypeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AppointmentTypeDetail | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingStatusIds, setUpdatingStatusIds] = useState<Set<number>>(new Set());

  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];

  // Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Confirm Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AppointmentTypeDetail | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for 2s for premium skeleton feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = await appointmentTypeService.getAllAppointmentTypes();
      setItems(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Không thể tải danh sách loại lịch hẹn'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const sortedAndFilteredItems = useMemo(() => {
    let filtered = [...items];
    
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(q));
    }
    
    // Status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => statusFilter === 'active' ? item.isActive : !item.isActive);
    }
    
    // Sort
    filtered.sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      
      switch (sortKey) {
        case 'createdAt-desc': return bTime - aTime;
        case 'createdAt-asc': return aTime - bTime;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return bTime - aTime;
      }
    });
    
    return filtered;
  }, [items, searchQuery, statusFilter, sortKey]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, sortKey]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAndFilteredItems.slice(start, start + pageSize);
  }, [sortedAndFilteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedAndFilteredItems.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AppointmentTypeDetail) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (item: AppointmentTypeDetail) => {
    setItemToDelete(item);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeletingId(itemToDelete.id);
      await appointmentTypeService.deleteAppointmentType(itemToDelete.id);
      toast({ title: 'Xóa loại lịch hẹn thành công', variant: 'success' });
      await fetchData();
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Xóa loại lịch hẹn thất bại'), variant: 'error' });
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleExport = async () => {
    try {
      toast({ title: 'Đang chuẩn bị file xuất...', variant: 'default' });
      const blob = await appointmentTypeService.exportAppointmentTypes();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Loai_lich_hen_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Xuất dữ liệu thất bại'), variant: 'error' });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      toast({ title: 'Đang tải file mẫu...', variant: 'default' });
      const blob = await appointmentTypeService.downloadTemplateAppointmentTypes();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Mau_nhap_loai_lich_hen.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Tải file mẫu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Tải file mẫu thất bại'), variant: 'error' });
    }
  };

  const handleToggleStatus = async (item: AppointmentTypeDetail, newStatus: boolean) => {
    if (item.isActive === newStatus || updatingStatusIds.has(item.id)) return;
    try {
      setUpdatingStatusIds(prev => new Set(prev).add(item.id));
      await appointmentTypeService.updateAppointmentType(item.id, { isActive: newStatus });
      toast({ title: 'Cập nhật trạng thái thành công', variant: 'success' });
      await fetchData();
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Cập nhật trạng thái thất bại'), variant: 'error' });
    } finally {
      setUpdatingStatusIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Controls Area Placeholder */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={320} height={42} />
              <SkeletonBone width={180} height={42} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={120} height={42} />
              <SkeletonBone width={100} height={42} />
              <SkeletonBone width={120} height={42} />
            </div>
          </div>

          {/* Table Area Placeholder */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '4px', 
            border: '1px solid #f1f5f9', 
            overflow: 'hidden'
          }}>
            <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
            {[...Array(pageSize)].map((_, i) => (
              <div key={i} style={{ 
                height: '64px', 
                borderBottom: i === pageSize - 1 ? 'none' : '1px solid #f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 24px', 
                gap: '24px' 
              }}>
                <SkeletonBone width={40} height={16} />
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="70%" height={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="50%" height={16} />
                </div>
                <SkeletonBone width={100} height={16} />
                <SkeletonBone width={100} height={32} />
              </div>
            ))}
          </div>
        </div>
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

  const paginationConfig = totalPages > 0
    ? {
        currentPage, totalPages, pageSize,
        totalItems: sortedAndFilteredItems.length,
        onPageChange: handlePageChange,
        pageSizeOptions: [...PAGE_SIZE_OPTIONS],
        onPageSizeChange: (size: number) => {
          setPageSize(size);
          setCurrentPage(1);
        },
        showResultCount: true,
      }
    : undefined;

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-white">
      <AdminPageLayout
        controlPanel={
          <AppointmentTypeTableControls
            onSearch={setSearchQuery}
            onSortChange={setSortKey}
            onStatusChange={setStatusFilter}
            onNewAppointmentType={handleOpenCreate}
            onImport={() => setIsImportModalOpen(true)}
            onExport={handleExport}
            onDownloadTemplate={handleDownloadTemplate}
          />
        }
        pagination={
          paginationConfig ? (
            <Pagination {...paginationConfig} />
          ) : null
        }
      >
        <AppointmentTypeTable
          appointmentTypes={paginatedItems}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteTrigger}
          onToggleStatus={handleToggleStatus}
          deletingId={deletingId}
          updatingStatusIds={updatingStatusIds}
          pagination={{ currentPage, pageSize }}
        />

        <AppointmentTypeModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          item={editingItem}
          onSuccess={fetchData}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa loại lịch hẹn"
          message={`Bạn có chắc chắn muốn xóa loại lịch hẹn "${itemToDelete?.name}"? Hành động này không thể hoàn tác.`}
          confirmLabel="Xóa ngay"
          cancelLabel="Suy nghĩ lại"
          variant="danger"
        />

        <ImportAppointmentTypeModal
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onSuccess={fetchData}
        />
      </AdminPageLayout>
    </div>
  );
}
