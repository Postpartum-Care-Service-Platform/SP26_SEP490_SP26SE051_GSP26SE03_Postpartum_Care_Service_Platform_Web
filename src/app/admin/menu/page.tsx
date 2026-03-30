'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import menuService from '@/services/menu.service';
import type { Menu } from '@/types/menu';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Pagination } from '@/components/ui/pagination';

import {
  MenuListHeader,
  MenuTable,
  MenuTableControls,
  NewMenuModal,
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

  const handleDelete = async (menu: Menu) => {
    try {
      setDeletingId(menu.id);
      await menuService.deleteMenu(menu.id);
      toast({ title: 'Xóa thực đơn thành công', variant: 'success' });
      await fetchMenus();
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Xóa thực đơn thất bại'),
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminPageLayout
      header={<MenuListHeader />}
      controlPanel={
        <MenuTableControls
          onSearch={(q) => setSearchQuery(q)}
          onSortChange={(sort) => setSortKey(sort)}
          onStatusChange={(status) => setStatusFilter(status)}
          onNewMenu={() => setIsModalOpen(true)}
        />
      }
      pagination={
        filteredMenus.length > 0 ? (
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
        ) : (
          <MenuTable
            menus={paginatedMenus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        )}
      </div>

      <NewMenuModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchMenus}
        menuToEdit={editingMenu}
      />
    </AdminPageLayout>
  );
}
