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

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
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
          totalPages > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={sortedAndFilteredItems.length}
              onPageChange={setCurrentPage}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showResultCount={true}
            />
          ) : null
        }
      >
        {loading ? (
          <div className={styles.placeholder}>Đang tải dữ liệu...</div>
        ) : error ? (
          <div className={styles.placeholder}>{error}</div>
        ) : (
          <AppointmentTypeTable
            appointmentTypes={paginatedItems}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteTrigger}
            onToggleStatus={handleToggleStatus}
            deletingId={deletingId}
            updatingStatusIds={updatingStatusIds}
            pagination={{ currentPage, pageSize }}
          />
        )}

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
