'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import menuRecordService from '@/services/menu-record.service';
import type { MenuRecord } from '@/types/menu-record';

import { NewMenuRecordModal, MenuRecordStatsCards, MenuRecordTable, MenuRecordTableControls } from './components';
import { MenuRecordListHeader } from './components/MenuRecordListHeader';
import styles from './menu-record.module.css';

import type { MenuRecordStats } from './components';



const PAGE_SIZE = 10;

const sortMenuRecords = (items: MenuRecord[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'createdAt-desc':
      return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return arr.sort((a, b) => b.name.localeCompare(a.name));
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenuRecord, setEditingMenuRecord] = useState<MenuRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMenuRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuRecordService.getAllMenuRecords();
      setMenuRecords(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách bản ghi thực đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuRecords();
  }, []);

  const stats: MenuRecordStats = useMemo(() => {
    const total = menuRecords.length;
    const active = menuRecords.filter((m) => m.isActive).length;
    const inactive = total - active;

    return {
      total,
      active,
      inactive,
    };
  }, [menuRecords]);

  const filteredMenuRecords = useMemo(() => {
    let filtered = [...menuRecords];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((m) => m.name.toLowerCase().includes(q) || m.accountId.toLowerCase().includes(q));
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
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredMenuRecords.slice(start, end);
  }, [filteredMenuRecords, currentPage]);

  const totalPages = Math.ceil(filteredMenuRecords.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleDelete = async (menuRecord: MenuRecord) => {
    try {
      setDeletingId(menuRecord.id);
      await menuRecordService.deleteMenuRecord(menuRecord.id);
      toast({ title: 'Xóa bản ghi thực đơn thành công', variant: 'success' });
      await fetchMenuRecords();
    } catch (err: any) {
      toast({ title: err?.message || 'Xóa bản ghi thực đơn thất bại', variant: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <MenuRecordListHeader />

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
          <MenuRecordStatsCards stats={stats} />

          <MenuRecordTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewMenuRecord={() => setIsModalOpen(true)}
          />

          <MenuRecordTable
            menuRecords={paginatedMenuRecords}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            pagination={
              totalPages > 0
                ? {
                    currentPage,
                    totalPages,
                    pageSize: PAGE_SIZE,
                    totalItems: filteredMenuRecords.length,
                    onPageChange: handlePageChange,
                  }
                : undefined
            }
          />
        </>
      )}

      <NewMenuRecordModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchMenuRecords}
        menuRecordToEdit={editingMenuRecord}
      />
    </div>
  );
}
