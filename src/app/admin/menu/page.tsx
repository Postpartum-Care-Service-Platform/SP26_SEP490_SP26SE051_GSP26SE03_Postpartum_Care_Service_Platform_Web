'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import menuService from '@/services/menu.service';
import type { Menu } from '@/types/menu';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { Pagination } from '@/components/ui/pagination';

import {
  MenuListHeader,
  MenuTableControls,
  MenuTable,
  NewMenuModal,
  MenuViewVisualizer,
  ImportMenuModal
} from './components';
import styles from './menu.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallbackMessage;
};

const sortMenus = (items: Menu[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case 'createdAt-desc':
      return arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'name-asc':
      return arr.sort((a, b) => a.menuName.localeCompare(b.menuName));
    case 'name-desc':
      return arr.sort((a, b) => b.menuName.localeCompare(a.menuName));
    case 'type-asc':
      return arr.sort((a, b) => a.menuTypeName.localeCompare(b.menuTypeName));
    case 'type-desc':
      return arr.sort((a, b) => b.menuTypeName.localeCompare(a.menuTypeName));
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

export default function AdminMenuPage() {
  const { toast } = useToast();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    'all'
  );
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [view, setView] = useState<'table' | 'ui'>('table');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for 2s for premium skeleton feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = await menuService.getAllMenus();
      setMenus(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Không thể tải danh sách thực đơn'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const filteredMenus = useMemo(() => {
    let filtered = [...menus];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.menuName.toLowerCase().includes(q) ||
          m.menuTypeName.toLowerCase().includes(q) ||
          (m.description || '').toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((m) =>
        statusFilter === 'active' ? m.isActive : !m.isActive
      );
    }

    return sortMenus(filtered, sortKey);
  }, [menus, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedMenus = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredMenus.slice(start, end);
  }, [filteredMenus, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMenus.length / pageSize) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollArea = document.querySelector(`.${styles.pageContainer}`)?.closest('[class*="scrollArea"]');
    scrollArea?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingMenu(null);
    }
  };

  const handleDelete = (menu: Menu) => {
    setMenuToDelete(menu);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!menuToDelete) return;
    try {
      setDeletingId(menuToDelete.id);
      await menuService.deleteMenu(menuToDelete.id);
      toast({ title: 'Xóa thực đơn thành công', variant: 'success' });
      await fetchMenus();
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Xóa thực đơn thất bại'),
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
      setMenuToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleExport = async () => {
    try {
      toast({ title: 'Đang chuẩn bị file xuất...', variant: 'default' });
      const blob = await menuService.exportMenus();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Danh_sach_thuc_don_${new Date().getTime()}.xlsx`);
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
      const blob = await menuService.downloadTemplateMenus();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Mau_nhap_thuc_don.xlsx');
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
                  <SkeletonBone width="60%" height={16} />
                </div>
                <div style={{ flex: 2 }}>
                  <SkeletonBone width="80%" height={16} />
                </div>
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

  return (
    <AdminPageLayout
      noCard={view === 'ui'}
      header={<MenuListHeader view={view} onViewChange={setView} />}
      controlPanel={
        view === 'table' ? (
          <MenuTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewMenu={() => setIsModalOpen(true)}
            onImport={() => setIsImportModalOpen(true)}
            onExport={handleExport}
            onDownloadTemplate={handleDownloadTemplate}
          />
        ) : null
      }
      pagination={
        view === 'table' && filteredMenus.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredMenus.length}
            onPageChange={handlePageChange}
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
      <div className={styles.pageContainer}>
        {view === 'table' ? (
          <MenuTable
            menus={paginatedMenus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <MenuViewVisualizer menus={filteredMenus} />
        )}
      </div>

      <NewMenuModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchMenus}
        menuToEdit={editingMenu}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa thực đơn"
        message={`Bạn có chắc chắn muốn xóa thực đơn "${menuToDelete?.menuName}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa ngay"
        cancelLabel="Suy nghĩ lại"
        variant="danger"
      />

      <ImportMenuModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={fetchMenus}
      />
    </AdminPageLayout>
  );
}

