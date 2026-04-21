'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import menuRecordService from '@/services/menu-record.service';
import type { MenuRecord } from '@/types/menu-record';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { Pagination } from '@/components/ui/pagination';
import userService from '@/services/user.service';
import menuService from '@/services/menu.service';
import type { Account } from '@/types/account';
import type { Menu } from '@/types/menu';

import { NewMenuRecordModal, MenuRecordTable, MenuRecordTableControls } from './components';
import { MenuRecordListHeader } from './components/MenuRecordListHeader';
import styles from './menu-record.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallbackMessage;
};

const sortMenuRecords = (items: MenuRecord[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'createdAt-desc':
      return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'name-asc':
      return arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'name-desc':
      return arr.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    case 'date-asc':
      return arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'date-desc':
      return arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    default:
      return arr;
  }
};

export default function AdminMenuRecordPage() {
  const { toast } = useToast();
  const [menuRecords, setMenuRecords] = useState<MenuRecord[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenuRecord, setEditingMenuRecord] = useState<MenuRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [menuRecordToDelete, setMenuRecordToDelete] = useState<MenuRecord | null>(null);

  const [view, setView] = useState<'table' | 'ui'>('table');

  const fetchMenuRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const [recordsData, accountsData, menusData] = await Promise.all([
        menuRecordService.getAllMenuRecords(),
        userService.getAllAccounts(),
        menuService.getAllMenus(),
      ]);
      setMenuRecords(recordsData);
      setAccounts(accountsData);
      setMenus(menusData);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Không thể tải danh sách bản ghi thực đơn'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuRecords();
  }, []);

  const filteredMenuRecords = useMemo(() => {
    let filtered = [...menuRecords];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((m) => (m.name || '').toLowerCase().includes(q) || (m.accountId || '').toLowerCase().includes(q));
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((m) => (statusFilter === 'active' ? m.isActive : !m.isActive));
    }

    return sortMenuRecords(filtered, sortKey);
  }, [menuRecords, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedMenuRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredMenuRecords.slice(start, end);
  }, [filteredMenuRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMenuRecords.length / pageSize) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollArea = document.querySelector(`.${styles.pageContainer}`)?.closest('[class*="scrollArea"]');
    scrollArea?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (menuRecord: MenuRecord) => {
    setEditingMenuRecord(menuRecord);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingMenuRecord(null);
    }
  };

  const handleDelete = (menuRecord: MenuRecord) => {
    setMenuRecordToDelete(menuRecord);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!menuRecordToDelete) return;
    try {
      setDeletingId(menuRecordToDelete.id);
      await menuRecordService.deleteMenuRecord(menuRecordToDelete.id);
      toast({ title: 'Xóa bản ghi thực đơn thành công', variant: 'success' });
      await fetchMenuRecords();
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Xóa bản ghi thực đơn thất bại'),
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
      setMenuRecordToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <AdminPageLayout
      noCard={view === 'ui'}
      header={<MenuRecordListHeader view={view} onViewChange={setView} />}
      controlPanel={
        view === 'table' ? (
          <MenuRecordTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewMenuRecord={() => setIsModalOpen(true)}
          />
        ) : null
      }
      pagination={
        view === 'table' && filteredMenuRecords.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredMenuRecords.length}
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
          <MenuRecordTable
            menuRecords={paginatedMenuRecords}
            accounts={accounts}
            menus={menus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <div className={styles.emptyState}>
            <p>Dạng xem UI đang được cập nhật...</p>
          </div>
        )}
      </div>

      <NewMenuRecordModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchMenuRecords}
        menuRecordToEdit={editingMenuRecord}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa bản ghi thực đơn"
        message={`Bạn có chắc chắn muốn xóa bản ghi thực đơn "${menuRecordToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa ngay"
        cancelLabel="Suy nghĩ lại"
        variant="danger"
      />
    </AdminPageLayout>
  );
}
