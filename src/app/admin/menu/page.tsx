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
        {loading ? (
          <div className={styles.loading}>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : view === 'table' ? (
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
