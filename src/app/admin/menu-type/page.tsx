'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import menuTypeService from '@/services/menu-type.service';
import type { MenuType } from '@/types/menu-type';

import {
  MenuTypeStatsCards,
  MenuTypeTable,
  MenuTypeTableControls,
  NewMenuTypeModal,
} from './components';
import { MenuTypeListHeader } from './components/MenuTypeListHeader';
import styles from './menu-type.module.css';

import type { MenuTypeStats } from './components';

const PAGE_SIZE = 10;

const sortMenuTypes = (items: MenuType[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case 'createdAt-desc':
      return arr.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return arr.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return arr;
  }
};

export default function AdminMenuTypePage() {
  const { toast } = useToast();
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenuType, setEditingMenuType] = useState<MenuType | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    'all'
  );
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMenuTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuTypeService.getAllMenuTypes();
      setMenuTypes(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách loại thực đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuTypes();
  }, []);

  const stats: MenuTypeStats = useMemo(() => {
    const total = menuTypes.length;
    const active = menuTypes.filter((m) => m.isActive).length;
    const inactive = total - active;

    return {
      total,
      active,
      inactive,
    };
  }, [menuTypes]);

  const filteredMenuTypes = useMemo(() => {
    let filtered = [...menuTypes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((m) => m.name.toLowerCase().includes(q));
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((m) =>
        statusFilter === 'active' ? m.isActive : !m.isActive
      );
    }

    return sortMenuTypes(filtered, sortKey);
  }, [menuTypes, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedMenuTypes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredMenuTypes.slice(start, end);
  }, [filteredMenuTypes, currentPage]);

  const totalPages = Math.ceil(filteredMenuTypes.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (menuType: MenuType) => {
    setEditingMenuType(menuType);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingMenuType(null);
    }
  };

  const handleDelete = async (menuType: MenuType) => {
    try {
      setDeletingId(menuType.id);
      await menuTypeService.deleteMenuType(menuType.id);
      toast({ title: 'Xóa loại thực đơn thành công', variant: 'success' });
      await fetchMenuTypes();
    } catch (err: any) {
      toast({
        title: err?.message || 'Xóa loại thực đơn thất bại',
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <MenuTypeListHeader />

      {loading ? (
        <div className={styles.content}>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className={styles.content}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <MenuTypeStatsCards stats={stats} />

          <MenuTypeTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewMenuType={() => setIsModalOpen(true)}
          />

          <MenuTypeTable
            menuTypes={paginatedMenuTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            pagination={
              totalPages > 0
                ? {
                    currentPage,
                    totalPages,
                    pageSize: PAGE_SIZE,
                    totalItems: filteredMenuTypes.length,
                    onPageChange: handlePageChange,
                  }
                : undefined
            }
          />
        </>
      )}

      <NewMenuTypeModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchMenuTypes}
        menuTypeToEdit={editingMenuType}
      />
    </div>
  );
}
